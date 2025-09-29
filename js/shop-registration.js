// Shop Registration System
// Handles $24.99 one-time shop registration

class ShopRegistration {
    constructor() {
        this.form = document.getElementById('shopForm');
        this.isSubmitting = false;
        this.init();
    }

    init() {
        if (!this.form) return;

        this.setupEventListeners();
        this.setupValidation();
        this.setupDynamicFields();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });

        // Dynamic field behavior
        this.setupBusinessTypeLogic();
    }

    setupValidation() {
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
            .form-section {
                margin-bottom: 2rem;
                padding: 1.5rem;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                background: #f8f9fa;
            }
            .form-section h4 {
                margin-bottom: 1rem;
                color: #202124;
            }
        `;
        document.head.appendChild(style);
    }

    setupDynamicFields() {
        // Business type specific logic
        const businessTypeField = this.form.querySelector('#businessType');
        const productsField = this.form.querySelector('#products');

        if (businessTypeField && productsField) {
            businessTypeField.addEventListener('change', () => {
                const businessType = businessTypeField.value;
                this.updateProductsPlaceholder(businessType);
            });
        }
    }

    updateProductsPlaceholder(businessType) {
        const productsField = this.form.querySelector('#products');
        const placeholders = {
            'retail': 'e.g., Electronics, Clothing, Groceries, Hardware, etc.',
            'restaurant': 'e.g., Fast Food, Fine Dining, Cafe, Takeaway, etc.',
            'services': 'e.g., Hair Salon, Car Repair, Legal Services, etc.',
            'wholesale': 'e.g., Bulk goods, Distribution, Manufacturing, etc.',
            'online': 'e.g., E-commerce, Digital products, Online services, etc.',
            'other': 'Describe your products or services in detail'
        };

        if (productsField && placeholders[businessType]) {
            productsField.placeholder = placeholders[businessType];
        }
    }

    setupBusinessTypeLogic() {
        const businessTypeField = this.form.querySelector('#businessType');
        const yearsInBusinessField = this.form.querySelector('#yearsInBusiness');
        const monthlySalesField = this.form.querySelector('#monthlySales');

        if (businessTypeField) {
            businessTypeField.addEventListener('change', () => {
                const businessType = businessTypeField.value;

                // Show/hide relevant fields based on business type
                this.toggleFieldVisibility(businessType);
            });
        }
    }

    toggleFieldVisibility(businessType) {
        // Add business type specific logic here if needed
        // For now, all fields are shown for all business types
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
            const shopData = this.processFormData(formData);

            // Store data for payment
            sessionStorage.setItem('shopData', JSON.stringify(shopData));
            sessionStorage.setItem('orderType', 'shop_registration');

            // Redirect to payment
            const params = new URLSearchParams({
                type: 'shop',
                amount: '24.99',
                description: 'Shop Registration',
                business: shopData.shopName,
                email: shopData.email
            });

            window.location.href = `payment.html?${params.toString()}`;

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
        const requiredFields = [
            'shopName', 'ownerName', 'email', 'phone',
            'businessType', 'location', 'products', 'goals', 'terms'
        ];

        requiredFields.forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field && !field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            }
        });

        // Email validation
        const emailField = this.form.querySelector('#email');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                this.showFieldError(emailField, 'Please enter a valid email address');
                isValid = false;
            }
        }

        // Phone validation
        const phoneField = this.form.querySelector('#phone');
        if (phoneField && phoneField.value) {
            const phoneRegex = /^\+?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(phoneField.value)) {
                this.showFieldError(phoneField, 'Please enter a valid phone number');
                isValid = false;
            }
        }

        // Products/Services validation (minimum length)
        const productsField = this.form.querySelector('#products');
        if (productsField && productsField.value.trim().length < 10) {
            this.showFieldError(productsField, 'Please provide more details about your products/services (minimum 10 characters)');
            isValid = false;
        }

        // Goals validation (minimum length)
        const goalsField = this.form.querySelector('#goals');
        if (goalsField && goalsField.value.trim().length < 20) {
            this.showFieldError(goalsField, 'Please provide more details about your goals (minimum 20 characters)');
            isValid = false;
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

        if (field.name === 'phone' && field.value) {
            const phoneRegex = /^\+?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(field.value)) {
                this.showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }

        if (field.name === 'products' && field.value.trim().length < 10) {
            this.showFieldError(field, 'Please provide more details about your products/services');
            return false;
        }

        if (field.name === 'goals' && field.value.trim().length < 20) {
            this.showFieldError(field, 'Please provide more details about your goals');
            return false;
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
            amount: 24.99,
            currency: 'USD',
            type: 'shop_registration',
            timestamp: new Date().toISOString(),
            status: 'pending_payment'
        };
    }

    setSubmitting(submitting) {
        this.isSubmitting = submitting;

        const submitButton = this.form.querySelector('button[type="submit"]');
        if (!submitButton) return;

        if (submitting) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        } else {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-credit-card"></i> Complete Registration - $24.99';
        }
    }

    showError(message) {
        // Remove existing errors
        const existingErrors = this.form.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());

        // Create new error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;

        this.form.insertBefore(errorDiv, this.form.firstChild);

        // Scroll to error
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Analytics
    trackEvent(eventName, data) {
        console.log(`[ShopRegistration] ${eventName}:`, data);

        if (window.gtag) {
            gtag('event', eventName, data);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('shopForm')) {
        new ShopRegistration();
    }
});
