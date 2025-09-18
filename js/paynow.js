// PayNow Integration for Helensvale Connect Pre-Launch
class PayNowIntegration {
    constructor() {
        this.integrationId = 'YOUR_INTEGRATION_ID'; // Replace with actual ID
        this.integrationKey = 'YOUR_INTEGRATION_KEY'; // Replace with actual key
        this.resultUrl = 'https://helensvaleconnect.art/payment-result';
        this.returnUrl = 'https://helensvaleconnect.art/success.html';
        this.apiUrl = 'https://www.paynow.co.zw/interface/initiatetransaction';
    }

    // Create payment for early access registration
    async createEarlyAccessPayment(userDetails, plan) {
        const paymentData = {
            id: this.integrationId,
            reference: `EARLY_ACCESS_${Date.now()}`,
            amount: this.getPlanAmount(plan),
            additionalinfo: `Early Access Registration - ${plan}`,
            returnurl: this.returnUrl,
            resulturl: this.resultUrl,
            authemail: userDetails.email,
            status: 'Message'
        };

        // Add user details
        paymentData['Early Access Plan'] = plan;
        paymentData['User Name'] = userDetails.name;
        paymentData['User Email'] = userDetails.email;
        paymentData['User Role'] = userDetails.role;

        return this.initiatePayment(paymentData);
    }

    // Get plan amounts (realistic pricing)
    getPlanAmount(plan) {
        const amounts = {
            'basic': 5.00,      // $5 early access fee
            'premium': 15.00,   // $15 for premium early access
            'business': 25.00   // $25 for business early access
        };
        return amounts[plan] || amounts['basic'];
    }

    // Initiate payment with PayNow
    async initiatePayment(paymentData) {
        try {
            // Generate hash for security
            const hash = this.generateHash(paymentData);
            paymentData.hash = hash;

            // Create form data
            const formData = new FormData();
            Object.keys(paymentData).forEach(key => {
                formData.append(key, paymentData[key]);
            });

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                body: formData
            });

            const responseText = await response.text();
            return this.parsePayNowResponse(responseText);

        } catch (error) {
            console.error('PayNow payment initiation failed:', error);
            throw new Error('Payment initiation failed. Please try again.');
        }
    }

    // Generate hash for PayNow security
    generateHash(data) {
        // This is a simplified hash generation
        // In production, use proper HMAC-SHA512 with your integration key
        const values = [
            data.id,
            data.reference,
            data.amount,
            data.additionalinfo,
            data.returnurl,
            data.resulturl,
            data.authemail,
            data.status
        ].join('');
        
        // Note: This is a placeholder. Use proper crypto library for production
        return btoa(values + this.integrationKey).substring(0, 40);
    }

    // Parse PayNow response
    parsePayNowResponse(responseText) {
        const lines = responseText.split('\n');
        const response = {};
        
        lines.forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                response[key.toLowerCase()] = value;
            }
        });

        if (response.status === 'ok') {
            return {
                success: true,
                pollUrl: response.pollurl,
                redirectUrl: response.browserurl,
                reference: response.reference
            };
        } else {
            throw new Error(response.error || 'Payment initiation failed');
        }
    }

    // Check payment status
    async checkPaymentStatus(pollUrl) {
        try {
            const response = await fetch(pollUrl);
            const responseText = await response.text();
            return this.parsePayNowResponse(responseText);
        } catch (error) {
            console.error('Payment status check failed:', error);
            return { success: false, error: 'Status check failed' };
        }
    }
}

// Enhanced registration with payment integration
class EnhancedRegistration {
    constructor() {
        this.payNow = new PayNowIntegration();
        this.initializePaymentOptions();
    }

    initializePaymentOptions() {
        // Add payment options to registration form
        const registrationForm = document.getElementById('earlyAccessForm');
        if (registrationForm) {
            this.addPaymentSection(registrationForm);
        }
    }

    addPaymentSection(form) {
        const paymentSection = document.createElement('div');
        paymentSection.className = 'payment-section';
        paymentSection.innerHTML = `
            <div class="payment-options">
                <h4>Secure Your Spot (Optional)</h4>
                <p>Pre-pay for guaranteed priority access and exclusive benefits</p>
                
                <div class="payment-plans">
                    <label class="payment-plan">
                        <input type="radio" name="paymentPlan" value="free">
                        <div class="plan-card">
                            <h5>Free Registration</h5>
                            <div class="plan-price">$0</div>
                            <p>Basic early access registration</p>
                        </div>
                    </label>
                    
                    <label class="payment-plan">
                        <input type="radio" name="paymentPlan" value="basic">
                        <div class="plan-card featured">
                            <h5>Priority Access</h5>
                            <div class="plan-price">$5</div>
                            <p>Guaranteed first-week access + bonus credits</p>
                        </div>
                    </label>
                    
                    <label class="payment-plan">
                        <input type="radio" name="paymentPlan" value="premium">
                        <div class="plan-card">
                            <h5>VIP Access</h5>
                            <div class="plan-price">$15</div>
                            <p>Day-one access + premium support + exclusive features</p>
                        </div>
                    </label>
                </div>
                
                <div class="payment-methods">
                    <h5>Payment Methods</h5>
                    <div class="method-icons">
                        <img src="./assets/ecocash-logo.png" alt="EcoCash" title="EcoCash">
                        <img src="./assets/onemoney-logo.png" alt="OneMoney" title="OneMoney">
                        <img src="./assets/visa-logo.png" alt="Visa" title="Visa">
                        <img src="./assets/mastercard-logo.png" alt="Mastercard" title="Mastercard">
                    </div>
                </div>
            </div>
        `;

        // Insert before submit button
        const submitButton = form.querySelector('button[type="submit"]');
        form.insertBefore(paymentSection, submitButton);
    }

    async handleRegistrationWithPayment(formData) {
        const paymentPlan = formData.get('paymentPlan');
        
        if (paymentPlan === 'free') {
            // Process free registration
            return this.processFreeRegistration(formData);
        } else {
            // Process paid registration
            return this.processPaidRegistration(formData, paymentPlan);
        }
    }

    async processFreeRegistration(formData) {
        // Use existing Web3Forms integration for free registration
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            return {
                success: true,
                message: 'Registration successful! Check your email for confirmation.',
                redirect: 'success.html'
            };
        } else {
            throw new Error('Registration failed. Please try again.');
        }
    }

    async processPaidRegistration(formData, plan) {
        try {
            // Create user details object
            const userDetails = {
                name: formData.get('name'),
                email: formData.get('email'),
                role: formData.get('role')
            };

            // Initiate PayNow payment
            const paymentResult = await this.payNow.createEarlyAccessPayment(userDetails, plan);

            if (paymentResult.success) {
                // Store registration data temporarily
                localStorage.setItem('pendingRegistration', JSON.stringify({
                    formData: Object.fromEntries(formData),
                    paymentReference: paymentResult.reference,
                    plan: plan
                }));

                // Redirect to PayNow
                window.location.href = paymentResult.redirectUrl;
                
                return {
                    success: true,
                    message: 'Redirecting to payment...',
                    redirect: paymentResult.redirectUrl
                };
            } else {
                throw new Error('Payment initiation failed');
            }
        } catch (error) {
            console.error('Paid registration failed:', error);
            throw error;
        }
    }

    // Handle payment return
    async handlePaymentReturn() {
        const urlParams = new URLSearchParams(window.location.search);
        const reference = urlParams.get('reference');
        
        if (reference) {
            const pendingRegistration = localStorage.getItem('pendingRegistration');
            if (pendingRegistration) {
                const registrationData = JSON.parse(pendingRegistration);
                
                // Complete registration after successful payment
                await this.completeRegistration(registrationData);
                localStorage.removeItem('pendingRegistration');
            }
        }
    }

    async completeRegistration(registrationData) {
        // Send registration data to Web3Forms with payment confirmation
        const formData = new FormData();
        Object.keys(registrationData.formData).forEach(key => {
            formData.append(key, registrationData.formData[key]);
        });
        
        formData.append('payment_plan', registrationData.plan);
        formData.append('payment_reference', registrationData.paymentReference);
        formData.append('payment_status', 'completed');

        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            // Show success message
            this.showSuccessMessage(registrationData.plan);
        }
    }

    showSuccessMessage(plan) {
        const planBenefits = {
            basic: ['Priority access in first week', '$5 platform credits', 'Email support'],
            premium: ['Day-one platform access', '$15 platform credits', 'Priority customer support', 'Exclusive features preview']
        };

        const benefits = planBenefits[plan] || [];
        
        document.body.innerHTML = `
            <div class="success-container">
                <div class="success-content">
                    <i class="fas fa-check-circle success-icon"></i>
                    <h1>Payment Successful!</h1>
                    <p>Your early access registration is confirmed.</p>
                    
                    <div class="benefits-list">
                        <h3>Your Benefits:</h3>
                        <ul>
                            ${benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <a href="index.html" class="btn btn-primary">Return Home</a>
                </div>
            </div>
        `;
    }
}

// Initialize enhanced registration when page loads
document.addEventListener('DOMContentLoaded', function() {
    const enhancedReg = new EnhancedRegistration();
    
    // Handle payment returns
    if (window.location.pathname.includes('success.html')) {
        enhancedReg.handlePaymentReturn();
    }
    
    // Override existing form submission
    const form = document.getElementById('earlyAccessForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            try {
                // Show loading state
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline-flex';
                submitBtn.disabled = true;
                
                const result = await enhancedReg.handleRegistrationWithPayment(formData);
                
                if (result.success && result.redirect && !result.redirect.includes('paynow')) {
                    window.location.href = result.redirect;
                }
                
            } catch (error) {
                alert('Registration failed: ' + error.message);
                
                // Reset button
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
    }
});
