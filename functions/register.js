require('dotenv').config();
const Paynow = require('paynow');
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

        const { email, amount, plan, planId, name, role } = JSON.parse(event.body);

        // Basic validation
        const errors = [];
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRe.test(String(email))) errors.push('Valid email is required');
        if (typeof amount !== 'number' || !(amount > 0)) errors.push('Amount must be a positive number');
        if (!plan || typeof plan !== 'string') errors.push('Plan is required');
        if (!planId || typeof planId !== 'string') errors.push('planId is required');
        if (!name || typeof name !== 'string') errors.push('Name is required');
        if (role && !['business', 'customer'].includes(String(role).toLowerCase())) errors.push('Invalid role');

        if (errors.length) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request', details: errors }) };
        }

        // Initialize PayNow
        const INTEGRATION_ID = process.env.PAYNOW_INTEGRATION_ID;
        const INTEGRATION_KEY = process.env.PAYNOW_INTEGRATION_KEY;
        const SITE_URL = process.env.URL || '';

        const paynow = new Paynow(INTEGRATION_ID, INTEGRATION_KEY);
        // Generate unique reference for tracking
        const reference = `HC-${Date.now()}`;
        paynow.resultUrl(`${SITE_URL}/success.html?reference=${encodeURIComponent(reference)}`);
        paynow.returnUrl(`${SITE_URL}/success.html?reference=${encodeURIComponent(reference)}`);

        const payment = paynow.createPayment(reference, email);
        payment.add(plan, amount);

        const initResponse = await paynow.send(payment);
        if (!initResponse || !initResponse.success) {
            return { statusCode: 502, body: JSON.stringify({ error: 'Failed to initialize PayNow payment' }) };
        }

        const redirectUrl = initResponse.redirectUrl;
        const pollUrl = initResponse.pollUrl;

        // Persist transaction to Supabase for later polling
        try {
            const { error } = await supabase
                .from('transactions')
                .insert({
                    reference,
                    email,
                    name,
                    plan,
                    plan_id: planId,
                    role: (role || 'business'),
                    poll_url: pollUrl,
                    status: 'pending'
                });
            if (error) throw error;
        } catch (dbErr) {
            // Do not fail the flow if DB write fails; log-like response
            console.error('Supabase write failed', dbErr.message || dbErr);
        }

        return { statusCode: 200, body: JSON.stringify({ authorization_url: redirectUrl }) };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An unexpected error occurred.', details: error.message }),
        };
    }
};
