import { CUSTOMER_TIERS } from './config/membership-tiers.js';

// Customer VIP Registration System
// Handles $2.99/month customer VIP subscriptions via serverless API + Paystack

class CustomerVIP {
    constructor() {
        this.form = document.getElementById('vipForm');
        this.isSubmitting = false;
        this.init();
    }

    init() {
        if (!this.form) return;

        this.setupEventListeners();
        this.prefillForm();
        this.setupValidation();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        this.form.querySelectorAll('input, select').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });
    }

    prefillForm() {
        // Check for URL parameters or stored data
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.get('email')) {
            this.form.querySelector('#customerEmail').value = urlParams.get('email');
        }

        if (urlParams.get('phone')) {
            this.form.querySelector('#customerPhone').value = urlParams.get('phone');
        }
    }

    setupValidation() {
        // Add custom validation styles
        const style = document.createElement('style');
        style.textContent = `
            .field-error {
                border-color: #ea4335 !important;
                box-shadow: 0 0 0 2px rgba(234, 67, 53, 0.2);
            }
            .error-message {
                color: #ea4335;
                font-size: 14px;
                margin-top: 4px;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .error-message i {
                font-size: 12px;
            }
        `;
        document.head.appendChild(style);
    }

    async handleSubmit() {
        if (this.isSubmitting) return;

        // Validate form
        if (!this.validateForm()) {
            this.scrollToFirstError();
            return;
        }

        this.setSubmitting(true);

        try {
            const formData = new FormData(this.form);
            const customerData = this.processFormData(formData);

            // Real payment init via serverless function
            const vipPlan = CUSTOMER_TIERS.VIP;
            const payload = {
                email: customerData.customerEmail,
                amount: vipPlan.price,
                plan: vipPlan.name,
                planId: vipPlan.id,
                role: 'customer',
                name: customerData.customerName,
            };

            const resp = await fetch('/.netlify/functions/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await resp.json();
            if (!resp.ok || !data.authorization_url) {
                throw new Error(data.error || 'Unable to start payment');
            }
            // Redirect to Paystack authorization page
            window.location.href = data.authorization_url;

        } catch (error) {
            console.error('Form submission error:', error);
            this.showError('An error occurred. Please try again.');
        } finally {
            this.setSubmitting(false);
        }
    }

    validateForm() {
        let isValid = true;

        // Required fields validation
        const requiredFields = ['customerName', 'customerEmail', 'customerPhone', 'customerLocation'];
        requiredFields.forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field && !field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            }
        });

        // Email validation
        const emailField = this.form.querySelector('#customerEmail');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                this.showFieldError(emailField, 'Please enter a valid email address');
                isValid = false;
            }
        }

        // Phone validation
        const phoneField = this.form.querySelector('#customerPhone');
        if (phoneField && phoneField.value) {
            const phoneRegex = /^\+?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(phoneField.value)) {
                this.showFieldError(phoneField, 'Please enter a valid phone number');
                isValid = false;
            }
        }

        return isValid;
    }

    validateField(field) {
        this.clearFieldError(field);

        if (field.hasAttribute('required') && !field.value.trim()) {
            this.showFieldError(field, 'This field is required');
            return false;
        }

        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }

        if (field.name === 'customerPhone' && field.value) {
            const phoneRegex = /^\+?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(field.value)) {
                this.showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }

        return true;
    }

    showFieldError(field, message) {
        field.classList.add('field-error');

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;

        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('field-error');

        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    scrollToFirstError() {
        const firstError = this.form.querySelector('.field-error, .error-message');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    processFormData(formData) {
        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }

        return {
            ...data,
            amount: 2.99,
            currency: 'USD',
            type: 'customer_vip',
            timestamp: new Date().toISOString()
        };
    }

    setSubmitting(isLoading) {
        this.isSubmitting = isLoading;
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = isLoading;
            submitButton.innerHTML = isLoading
                ? '<i class="fas fa-spinner fa-spin"></i> Processing...'
                : '<i class="fas fa-credit-card"></i> Get VIP Access - $2.99/month';
        }
    }

    showError(message) {
        // Remove any existing error messages
        const existingError = document.querySelector('.form-error-message');
        if (existingError) {
            existingError.remove();
        }

        // Get or create error container
        let errorContainer = document.getElementById('formErrorContainer');
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.id = 'formErrorContainer';
            this.form.parentNode.insertBefore(errorContainer, this.form);
        }

        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        // Add to container
        errorContainer.innerHTML = '';
        errorContainer.appendChild(errorDiv);
        
        // Scroll to error
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-remove error after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.style.opacity = '0';
                setTimeout(() => errorDiv.remove(), 300);
            }
        }, 5000);
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Analytics
    trackEvent(eventName, data) {
        console.log(`[CustomerVIP] ${eventName}:`, data);

        // In a real app, send to analytics service
        if (window.gtag) {
            gtag('event', eventName, data);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('vipForm')) {
        new CustomerVIP();
    }
});
