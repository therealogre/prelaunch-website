const { createClient } = require('@supabase/supabase-js');
const Paynow = require('paynow');

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
        const paymentData = JSON.parse(event.body);
        
        // Validate required fields
        if (!paymentData.amount || !paymentData.email || !paymentData.reference) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Initialize PayNow
        const paynow = new Paynow(
            process.env.PAYNOW_INTEGRATION_ID,
            process.env.PAYNOW_INTEGRATION_KEY,
            `${process.env.URL}/payment-callback`,
            `${process.env.URL}/payment-return`
        );

        // Create payment
        const payment = paynow.createPayment(paymentData.reference, paymentData.email);
        payment.add(paymentData.description || 'Helensvale Connect Subscription', paymentData.amount);

        // Send payment to PayNow
        const response = await paynow.send(payment);

        if (response.success) {
            // Save payment to database
            const { data, error } = await supabase
                .from('payments')
                .insert([
                    {
                        reference: paymentData.reference,
                        amount: paymentData.amount,
                        email: paymentData.email,
                        status: 'pending',
                        paynow_poll_url: response.pollUrl,
                        paynow_instructions: response.instructions,
                        user_id: paymentData.userId || null,
                        business_id: paymentData.businessId || null
                    }
                ]);

            if (error) {
                console.error('Error saving payment:', error);
                // Continue even if DB save fails, as PayNow transaction is successful
            }

            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: true,
                    pollUrl: response.pollUrl,
                    instructions: response.instructions,
                    redirectUrl: response.redirectUrl
                })
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Failed to process payment',
                    details: response.error
                })
            };
        }
    } catch (error) {
        console.error('Payment processing error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                success: false, 
                error: 'Internal server error',
                details: error.message 
            })
        };
    }
};
