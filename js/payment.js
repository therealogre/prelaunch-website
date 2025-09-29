// Payment Processing System
class PaymentProcessor {
    constructor() {
        this.paymentForm = document.getElementById('paymentForm');
        this.init();
    }

    init() {
        this.isSubmitting = false;
        this.setupEventListeners();
        this.formatCardNumber();
        this.formatExpiryDate();
        this.loadOrderDetails();
    }

    setupEventListeners() {
        if (this.paymentForm) {
            this.paymentForm.addEventListener('submit', this.handleSubmit.bind(this));
        }

        // Add input masking for better UX
        const cardNumberInput = document.getElementById('cardNumber');
        const expiryDateInput = document.getElementById('expiryDate');
        const cvvInput = document.getElementById('cvv');

        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', this.formatCardNumber.bind(this));
        }

        if (expiryDateInput) {
            expiryDateInput.addEventListener('input', this.formatExpiryDate.bind(this));
        }

        if (cvvInput) {
            cvvInput.addEventListener('input', this.formatCVV.bind(this));
        }
    }

    formatCardNumber(e) {
        const input = e ? e.target : document.getElementById('cardNumber');
        if (!input) return;
        
        // Remove all non-digits
        let value = input.value.replace(/\D/g, '');
        
        // Add space after every 4 digits
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        
        // Update the input value
        input.value = value.trim();
        
        // Update card type icon
        this.updateCardType(value);
    }

    updateCardType(cardNumber) {
        const cardIcons = {
            'visa': /^4/,
            'mastercard': /^5[1-5]/,
            'amex': /^3[47]/,
            'discover': /^6(?:011|5)/
        };
        
        const cardType = Object.keys(cardIcons).find(type => 
            cardIcons[type].test(cardNumber)
        );
        
        // Update UI to show card type
        document.querySelectorAll('.card-icons i').forEach(icon => {
            icon.style.opacity = icon.classList.contains(`fa-cc-${cardType}`) ? '1' : '0.3';
        });
    }

    formatExpiryDate(e) {
        const input = e ? e.target : document.getElementById('expiryDate');
        if (!input) return;
        
        let value = input.value.replace(/\D/g, '');
        
        // Add slash after MM
        if (value.length > 2) {
            value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
        }
        
        input.value = value;
    }

    formatCVV(e) {
        const input = e.target;
        if (!input) return;
        
        // Limit to 3-4 digits
        input.value = input.value.replace(/\D/g, '').slice(0, 4);
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Prevent multiple submissions
        if (this.isSubmitting) return;
        
        // Get form data
        const formData = new FormData(this.paymentForm);
        
        // Validate form
        if (!this.validateForm(formData)) {
            return;
        }
        
        // Process payment
        this.setSubmitting(true);
        
        try {
            // Get customer data from session storage
            const customerData = JSON.parse(sessionStorage.getItem('customerData') || '{}');
            const orderType = sessionStorage.getItem('orderType');
            
            if (!customerData || !orderType) {
                throw new Error('Session expired. Please start over.');
            }
            
            // Prepare payment data
            const paymentData = {
                ...customerData,
                ...Object.fromEntries(formData.entries()),
                amount: this.getOrderAmount(),
                currency: 'USD',
                timestamp: new Date().toISOString(),
                orderType: orderType
            };
            
            // In a real app, this would call your payment processor API
            const paymentResult = await this.processPayment(paymentData);
            
            // Handle successful payment
            this.handlePaymentSuccess(paymentData);
            
        } catch (error) {
            console.error('Payment error:', error);
            this.showError(error.message || 'Payment failed. Please try again.');
        } finally {
            this.setSubmitting(false);
        }
        const formData = new FormData(this.paymentForm);
        const paymentData = {
            cardholderName: formData.get('cardholderName')?.trim(),
            cardNumber: formData.get('cardNumber')?.replace(/\s+/g, ''),
            expiryDate: formData.get('expiryDate'),
            cvv: formData.get('cvv'),
            saveCard: formData.get('saveCard') === 'on',
            // Get business info from URL params
            ...Object.fromEntries(new URLSearchParams(window.location.search))
        };
        
        // Validate form
        if (!this.validateForm(paymentData)) {
            return;
        }
        
        // Sanitize payment data
        const sanitizedData = this.sanitizePaymentData(paymentData);
        
        // Show loading state
        const submitButton = this.paymentForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        // Simulate API call with better error handling
        this.processPayment(sanitizedData)
            .then(() => {
                this.handlePaymentSuccess(sanitizedData);
            })
            .catch((error) => {
                this.handlePaymentError(error, submitButton, originalButtonText);
            });
        }
    }

    validateForm(formData) {
        // Simple validation - in a real app, use a library like Yup or Joi
        const errors = [];
        
        // Cardholder name validation
        if (!formData.get('cardholderName')?.trim()) {
            errors.push('Cardholder name is required');
        }
        
        // Card number validation (basic check for 16-19 digits)
        const cardNumber = formData.get('cardNumber')?.replace(/\s+/g, '');
        if (!cardNumber || !/^\d{13,19}$/.test(cardNumber)) {
            errors.push('Please enter a valid card number');
        }
        
        // Expiry date validation (MM/YY format, not expired)
        const expiry = formData.get('expiryDate')?.split('/');
        if (!expiry || expiry.length !== 2) {
            errors.push('Please enter a valid expiry date (MM/YY)');
        } else {
            const [month, year] = expiry.map(Number);
            const now = new Date();
            const currentYear = now.getFullYear() % 100;
            const currentMonth = now.getMonth() + 1;
            
            if (isNaN(month) || month < 1 || month > 12) {
                errors.push('Please enter a valid month (01-12)');
            } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
                errors.push('This card has expired');
            }
        }
        
        // CVV validation (3-4 digits)
        const cvv = formData.get('cvv');
        if (!cvv || !/^\d{3,4}$/.test(cvv)) {
            errors.push('Please enter a valid CVV (3-4 digits)');
        }
        
        // Show errors if any
        if (errors.length > 0) {
            this.showError(errors.join('<br>'));
            return false;
        }
        
        return true;
        if (!formData.cardholderName?.trim()) {
            errors.push('Cardholder name is required');
        }
        
        if (!formData.cardNumber || formData.cardNumber.replace(/\s+/g, '').length < 15) {
            errors.push('Please enter a valid card number');
        }
        
        if (!formData.expiryDate || !/\d{2}\/\d{2}/.test(formData.expiryDate)) {
            errors.push('Please enter a valid expiry date (MM/YY)');
        } else {
            const [month, year] = formData.expiryDate.split('/').map(Number);
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100;
            const currentMonth = currentDate.getMonth() + 1;
            
            if (month < 1 || month > 12) {
                errors.push('Invalid month in expiry date');
            } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
                errors.push('Card has expired');
            }
        }
        
        if (!formData.cvv || formData.cvv.length < 3 || formData.cvv.length > 4) {
            errors.push('Please enter a valid CVV');
        }
        
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (errors.length > 0) {
            this.showError(errors.join('<br>'));
            return false;
        }
        
        return true;
    }

    getCardType(cardNumber) {
        // Simple card type detection
        const cardTypes = {
            'visa': /^4/,
            'mastercard': /^5[1-5]/,
            'amex': /^3[47]/,
            'discover': /^(6011|65|64[4-9]|622)/
        };
        
        for (const [type, pattern] of Object.entries(cardTypes)) {
            if (pattern.test(cardNumber)) {
                return type.charAt(0).toUpperCase() + type.slice(1);
            }
        }
        return 'Credit Card';
    }
    
    trackPaymentEvent(eventName, eventData) {
        // In a real app, you would send this to your analytics service
        console.log(`[Analytics] ${eventName}:`, eventData);
        
        // Example: Google Analytics
        if (window.gtag) {
            gtag('event', eventName, eventData);
        }
        
        // Example: Facebook Pixel
        if (window.fbq) {
            fbq('track', eventName, eventData);
        }
    }

    setLoadingState(isLoading) {
        const submitButton = this.paymentForm?.querySelector('button[type="submit"]');
        if (!submitButton) return;
        
        if (isLoading) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        } else {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-lock"></i> Pay $49.99';
        }
    }

    sanitizePaymentData(data) {
        // Sanitize all string fields to prevent XSS
        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string') {
                sanitized[key] = this.sanitizeInput(value);
            } else {
                sanitized[key] = value;
            }
        }
        return sanitized;
    }
    
    sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }
    
    async processPayment(paymentData) {
        try {
            // Prepare payment data for PayNow
            const paymentRequest = {
                amount: paymentData.amount,
                email: paymentData.email,
                reference: `HEL-${Date.now()}`,
                description: paymentData.description || 'Helensvale Connect Subscription',
                userId: paymentData.userId,
                businessId: paymentData.businessId,
                plan: paymentData.plan
            };

            // Call our Netlify function
            const response = await fetch('/.netlify/functions/process-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentRequest)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Payment processing failed');
            }

            // If we have a redirect URL, redirect to PayNow
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
                return;
            }

            // Otherwise show instructions
            return data;
        } catch (error) {
            console.error('Payment processing error:', error);
            throw new Error('Failed to process payment. Please try again.');
        }
    }
    
    handlePaymentError(error, submitButton, originalButtonText) {
        console.error('Payment error:', error);
        
        // Show error message
        this.showError(error.message || 'Payment failed. Please try again.');
        
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        
        // Track failed payment
        this.trackPaymentEvent('payment_failed', {
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }

    showError(message) {
        // Remove any existing error messages
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create and show new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'var(--error-color)';
        errorDiv.style.marginTop = '16px';
        errorDiv.style.padding = '12px';
        errorDiv.style.borderRadius = 'var(--radius-md)';
        errorDiv.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        errorDiv.style.borderLeft = '3px solid var(--error-color)';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        const form = document.querySelector('.payment-form');
        if (form) {
            form.appendChild(errorDiv);
            
            // Scroll to error message
            errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// Initialize payment processor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on payment page
    if (document.getElementById('paymentForm')) {
        new PaymentProcessor();
    }
});
