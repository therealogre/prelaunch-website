require('dotenv').config();
const Paynow = require('paynow');
const { subscribe: mlSubscribe } = require('./mailerlite');
const { supabase } = require('./supabase');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        // Environment guards
        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return { statusCode: 500, body: JSON.stringify({ error: 'Supabase configuration missing' }) };
        }
        if (!process.env.PAYNOW_INTEGRATION_ID || !process.env.PAYNOW_INTEGRATION_KEY) {
            return { statusCode: 500, body: JSON.stringify({ error: 'PayNow configuration missing' }) };
        }

        const { reference } = JSON.parse(event.body);
        if (!reference) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Payment reference is required.' }) };
        }

        // Fetch the transaction by reference from Supabase
        const { data: txnRows, error: fetchErr } = await supabase
            .from('transactions')
            .select('*')
            .eq('reference', reference)
            .limit(1);
        if (fetchErr) {
            return { statusCode: 500, body: JSON.stringify({ error: 'DB error fetching transaction', details: fetchErr.message }) };
        }
        if (!txnRows || txnRows.length === 0) {
            return { statusCode: 404, body: JSON.stringify({ error: 'Transaction not found.' }) };
        }
        const txn = txnRows[0];
        const pollUrl = txn.poll_url;
        const email = txn.email;
        const name = txn.name;
        const plan = txn.plan;
        const planId = txn.plan_id;
        const role = txn.role;

        // If already marked paid, return success without re-processing
        if ((txn.status || '').toLowerCase() === 'paid') {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Payment already verified.',
                    planId,
                    metadata: { full_name: name, role: (role || 'business') },
                    customer: { email },
                }),
            };
        }

        // Poll PayNow for status
        const paynow = new Paynow(process.env.PAYNOW_INTEGRATION_ID, process.env.PAYNOW_INTEGRATION_KEY);
        if (!pollUrl) {
            return { statusCode: 500, body: JSON.stringify({ error: 'Transaction missing poll URL' }) };
        }
        const pollResponse = await paynow.pollTransaction(pollUrl).catch((e) => ({ error: e }));

        if (!pollResponse || pollResponse.error) {
            await supabase.from('transactions').update({ status: 'unpaid', last_polled_at: new Date().toISOString() }).eq('reference', reference);
            return { statusCode: 502, body: JSON.stringify({ error: 'PayNow poll failed' }) };
        }

        if (!pollResponse.paid) {
            // Update status in Supabase (best-effort)
            await supabase.from('transactions').update({ status: 'unpaid', last_polled_at: new Date().toISOString() }).eq('reference', reference);
            return { statusCode: 400, body: JSON.stringify({ error: 'Payment not completed yet.' }) };
        }

        // Mark transaction as paid
        await supabase.from('transactions').update({ status: 'paid', paid_at: new Date().toISOString() }).eq('reference', reference);

        // Upsert user account (idempotent by email)
        if (email) {
            const { error: userErr } = await supabase
                .from('users')
                .upsert({
                    email,
                    name,
                    plan,
                    plan_id: planId,
                    role: (role || 'business')
                }, { onConflict: 'email' });
            if (userErr) {
                console.error('User upsert failed', userErr.message || userErr);
            }
        }

        // Subscribe the user to MailerLite (role-based group)
        try {
            const groupId = (role || 'business').toLowerCase() === 'business'
                ? process.env.MAILERLITE_GROUP_ID_BUSINESS
                : process.env.MAILERLITE_GROUP_ID_CUSTOMER;
            if (groupId) {
                await mlSubscribe(email, name, groupId, { plan, planId, role: (role || 'business') });
            }
        } catch (e) {
            console.error('MailerLite subscribe failed', e.message);
        }

        // Send Supabase Admin invite (creates user if needed) with metadata (requires SMTP configured)
        try {
            const siteUrl = process.env.URL || 'http://localhost:8888';
            const targetPath = (role || 'business').toLowerCase() === 'customer' ? '/customer-dashboard.html' : '/business-dashboard.html';
            const redirectTo = `${siteUrl}${targetPath}`;
            const { error: inviteErr } = await supabase.auth.admin.inviteUserByEmail(
                email,
                { data: { full_name: name, planId, role: (role || 'business') }, redirectTo }
            );
            if (inviteErr) console.error('Supabase invite error', inviteErr.message || inviteErr);
        } catch (e) {
            console.error('Magic link send failed', e.message || e);
        }

        // Return a provider-agnostic payload used by success.js
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Payment verified successfully.',
                planId,
                metadata: { full_name: name, role: (role || 'business') },
                customer: { email },
            }),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'An unexpected error occurred.', details: error.message }) };
    }
};
