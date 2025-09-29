// Payment Processing System
class PaymentProcessor {
    constructor() {
        this.paymentForm = document.getElementById('paymentForm');
        this.isSubmitting = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.formatCardNumber();
        this.formatExpiryDate();
        this.loadOrderDetails();
    }

    setupEventListeners() {
        if (this.paymentForm) {
            this.paymentForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Add input masking for better UX
        const cardNumberInput = document.getElementById('cardNumber');
        const expiryDateInput = document.getElementById('expiryDate');
        const cvvInput = document.getElementById('cvv');

        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => this.formatCardNumber(e));
        }

        if (expiryDateInput) {
            expiryDateInput.addEventListener('input', (e) => this.formatExpiryDate(e));
        }

        if (cvvInput) {
            cvvInput.addEventListener('input', (e) => this.formatCVV(e));
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
        const cardIconsEl = document.querySelector('.card-icons');
        if (cardIconsEl) {
            cardIconsEl.querySelectorAll('i').forEach(icon => {
                icon.style.opacity = icon.classList.contains(`fa-cc-${cardType}`) ? '1' : '0.3';
            });
        }
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
            
            // Process payment
            await this.processPayment(paymentData);
            
            // Handle successful payment
            this.handlePaymentSuccess(paymentData);
            
        } catch (error) {
            console.error('Payment error:', error);
            this.showError(error.message || 'Payment failed. Please try again.');
        } finally {
            this.setSubmitting(false);
        }
    }

    validateForm(formData) {
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
    }

    async processPayment(paymentData) {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                // Simulate 90% success rate for demo
                const isSuccess = Math.random() < 0.9;
                
                if (isSuccess) {
                    resolve({
                        ...paymentData,
                        transactionId: 'txn_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                        status: 'completed',
                        timestamp: new Date().toISOString()
                    });
                } else {
                    reject(new Error('Payment was declined by your bank. Please try another card.'));
                }
            }, 1500);
        });
    }
    
    handlePaymentSuccess(paymentData) {
        // Store payment data in session storage
        sessionStorage.setItem('paymentData', JSON.stringify({
            ...paymentData,
            status: 'completed',
            timestamp: new Date().toISOString()
        }));
        
        // Redirect to success page
        window.location.href = 'success.html';
    }
    
    loadOrderDetails() {
        try {
            // Get customer data from session storage
            const customerData = JSON.parse(sessionStorage.getItem('customerData') || '{}');
            const orderType = sessionStorage.getItem('orderType');
            
            if (!customerData || !orderType) {
                throw new Error('Session expired. Please start over.');
            }
            
            // Set order details based on order type
            const orderDescription = this.getOrderDescription(orderType);
            const orderAmount = this.getOrderAmount();
            
            // Update UI
            const orderDescEl = document.getElementById('orderDescription');
            const orderAmountEl = document.getElementById('orderAmount');
            const totalAmountEl = document.getElementById('totalAmount');
            
            if (orderDescEl) orderDescEl.textContent = orderDescription;
            if (orderAmountEl) orderAmountEl.textContent = `$${orderAmount.toFixed(2)}`;
            if (totalAmountEl) totalAmountEl.textContent = `$${orderAmount.toFixed(2)}`;
            
            // Pre-fill customer name if available
            const cardholderName = document.getElementById('cardholderName');
            if (cardholderName && customerData.name) {
                cardholderName.value = customerData.name;
            }
            
        } catch (error) {
            console.error('Error loading order details:', error);
            this.showError('Failed to load order details. Please try again.');
        }
    }
    
    getOrderDescription(orderType) {
        switch(orderType) {
            case 'customer_vip':
                return 'VIP Customer Access (Monthly Subscription)';
            case 'shop_registration':
                return 'Shop Registration (One-time Fee)';
            case 'partnership':
                return 'Partnership Program';
            default:
                return 'Order';
        }
    }
    
    getOrderAmount() {
        const orderType = sessionStorage.getItem('orderType');
        
        switch(orderType) {
            case 'customer_vip':
                return 2.99;
            case 'shop_registration':
                return 24.99;
            case 'partnership':
                return 0; // Custom pricing
            default:
                return 0;
        }
    }
    
    setSubmitting(isLoading) {
        this.isSubmitting = isLoading;
        const submitButton = this.paymentForm?.querySelector('button[type="submit"]');
        
        if (submitButton) {
            submitButton.disabled = isLoading;
            submitButton.innerHTML = isLoading
                ? '<i class="fas fa-spinner fa-spin"></i> Processing...'
                : 'Complete Payment';
        }
    }
    
    showError(message) {
        // Remove any existing error messages
        const existingError = document.querySelector('.payment-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'payment-error';
        errorDiv.innerHTML = `
            <div class="error-message" style="
                color: #e53e3e;
                background-color: #fff5f5;
                border-left: 4px solid #e53e3e;
                padding: 12px 16px;
                margin: 16px 0;
                border-radius: 4px;
                display: flex;
                align-items: center;
                gap: 8px;
            ">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Insert before the form
        const form = document.querySelector('.payment-form-container') || this.paymentForm;
        if (form) {
            form.insertBefore(errorDiv, form.firstChild);
            
            // Scroll to error
            errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Auto-remove error after 5 seconds
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.style.opacity = '0';
                    setTimeout(() => errorDiv.remove(), 300);
                }
            }, 5000);
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
