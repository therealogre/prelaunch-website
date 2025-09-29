const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        // Parse the form data from PayNow
        const params = new URLSearchParams(event.body);
        const reference = params.get('reference');
        const paynowReference = params.get('paynowreference');
        const amount = parseFloat(params.get('amount'));
        const status = params.get('status').toLowerCase();
        const pollUrl = params.get('pollurl');
        
        if (!reference || !paynowReference || !amount || !status) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid PayNow callback data' })
            };
        }

        // Update payment status in database
        const { data: payment, error: updateError } = await supabase
            .from('payments')
            .update({
                status: status,
                paynow_reference: paynowReference,
                updated_at: new Date().toISOString(),
                poll_url: pollUrl,
                is_paid: status === 'paid' || status === 'awaiting delivery',
                paid_at: (status === 'paid' || status === 'awaiting delivery') 
                    ? new Date().toISOString() 
                    : null
            })
            .eq('reference', reference)
            .single();

        if (updateError) {
            console.error('Error updating payment status:', updateError);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Failed to update payment status' })
            };
        }

        // If payment is successful, update user/business subscription
        if (status === 'paid' || status === 'awaiting delivery') {
            await handleSuccessfulPayment(payment);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };

    } catch (error) {
        console.error('Payment callback error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};

async function handleSuccessfulPayment(payment) {
    try {
        // Update user or business subscription based on payment details
        if (payment.user_id) {
            // Update user subscription
            const { data: user, error: userError } = await supabase
                .from('profiles')
                .update({
                    is_vip: true,
                    vip_since: new Date().toISOString(),
                    subscription_plan: 'vip',
                    subscription_status: 'active',
                    payment_reference: payment.reference
                })
                .eq('id', payment.user_id)
                .single();

            if (userError) throw userError;

        } else if (payment.business_id) {
            // Update business subscription
            const { data: business, error: businessError } = await supabase
                .from('businesses')
                .update({
                    subscription_plan: payment.plan || 'essential',
                    subscription_status: 'active',
                    subscription_start: new Date().toISOString(),
                    payment_reference: payment.reference
                })
                .eq('id', payment.business_id)
                .single();

            if (businessError) throw businessError;
        }

        // Send confirmation email
        await sendConfirmationEmail(payment);

    } catch (error) {
        console.error('Error handling successful payment:', error);
        // Log error but don't fail the callback
    }
}

async function sendConfirmationEmail(payment) {
    // In a real app, you would send an email here
    console.log(`Sending confirmation email for payment ${payment.reference} to ${payment.email}`);
    
    // Example using MailerLite or similar service
    // await mailer.sendConfirmationEmail({
    //     to: payment.email,
    //     reference: payment.reference,
    //     amount: payment.amount,
    //     plan: payment.plan
    // });
}
