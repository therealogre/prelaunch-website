// Enterprise-level Form Validation and Error Handling
class FormValidation {
    constructor() {
        this.validators = new Map();
        this.errorMessages = new Map();
        this.init();
    }

    init() {
        this.setupValidators();
        this.setupErrorMessages();
        this.bindEvents();
        this.setupRealTimeValidation();
    }

    setupValidators() {
        // Email validation
        this.validators.set('email', {
            test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Please enter a valid email address'
        });

        // Phone validation (Zimbabwe format)
        this.validators.set('phone', {
            test: (value) => /^(\+263|0)(7[0-9]|86|87)\d{7}$/.test(value.replace(/\s/g, '')),
            message: 'Please enter a valid Zimbabwe phone number'
        });

        // Name validation
        this.validators.set('name', {
            test: (value) => /^[a-zA-Z\s]{2,50}$/.test(value),
            message: 'Name must be 2-50 characters and contain only letters'
        });

        // Business name validation
        this.validators.set('businessName', {
            test: (value) => /^[a-zA-Z0-9\s&.-]{2,100}$/.test(value),
            message: 'Business name must be 2-100 characters'
        });

        // Password validation
        this.validators.set('password', {
            test: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value),
            message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
        });

        // Required field validation
        this.validators.set('required', {
            test: (value) => value && value.trim().length > 0,
            message: 'This field is required'
        });

        // URL validation
        this.validators.set('url', {
            test: (value) => /^https?:\/\/.+\..+/.test(value),
            message: 'Please enter a valid URL'
        });

        // Number validation
        this.validators.set('number', {
            test: (value) => /^\d+$/.test(value),
            message: 'Please enter a valid number'
        });

        // Postal code validation (Zimbabwe)
        this.validators.set('postalCode', {
            test: (value) => /^\d{5}$/.test(value),
            message: 'Please enter a valid 5-digit postal code'
        });
    }

    setupErrorMessages() {
        this.errorMessages.set('network', 'Network error. Please check your connection and try again.');
        this.errorMessages.set('server', 'Server error. Please try again later.');
        this.errorMessages.set('validation', 'Please correct the errors below.');
        this.errorMessages.set('success', 'Form submitted successfully!');
    }

    bindEvents() {
        // Form submission handling
        document.addEventListener('submit', (e) => {
            if (e.target.matches('form[data-validate]')) {
                e.preventDefault();
                this.handleFormSubmission(e.target);
            }
        });

        // Real-time validation
        document.addEventListener('blur', (e) => {
            if (e.target.matches('input[data-validate], textarea[data-validate], select[data-validate]')) {
                this.validateField(e.target);
            }
        }, true);

        // Input formatting
        document.addEventListener('input', (e) => {
            if (e.target.matches('input[data-format]')) {
                this.formatField(e.target);
            }
        });
    }

    setupRealTimeValidation() {
        // Password strength indicator
        document.addEventListener('input', (e) => {
            if (e.target.type === 'password') {
                this.updatePasswordStrength(e.target);
            }
        });

        // Confirm password validation
        document.addEventListener('input', (e) => {
            if (e.target.name === 'confirmPassword') {
                this.validatePasswordConfirmation(e.target);
            }
        });
    }

    validateField(field) {
        const rules = field.dataset.validate.split('|');
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        this.clearFieldError(field);

        for (const rule of rules) {
            const [validatorName, ...params] = rule.split(':');
            const validator = this.validators.get(validatorName);

            if (validator && !validator.test(value, ...params)) {
                isValid = false;
                errorMessage = validator.message;
                break;
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.showFieldSuccess(field);
        }

        return isValid;
    }

    validateForm(form) {
        const fields = form.querySelectorAll('[data-validate]');
        let isValid = true;
        const errors = [];

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
                errors.push({
                    field: field.name || field.id,
                    message: field.nextElementSibling?.textContent || 'Invalid field'
                });
            }
        });

        return { isValid, errors };
    }

    showFieldError(field, message) {
        field.classList.add('error');
        field.classList.remove('success');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
        field.parentNode.appendChild(errorElement);

        // Add error animation
        errorElement.classList.add('animate-fade-in-up');
    }

    showFieldSuccess(field) {
        field.classList.add('success');
        field.classList.remove('error');
        
        // Remove error message
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    clearFieldError(field) {
        field.classList.remove('error', 'success');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    formatField(field) {
        const format = field.dataset.format;
        let value = field.value;

        switch (format) {
            case 'phone':
                // Format Zimbabwe phone numbers
                value = value.replace(/\D/g, '');
                if (value.startsWith('263')) {
                    value = '+' + value;
                } else if (value.startsWith('0')) {
                    value = value.replace(/^0/, '+263');
                }
                break;

            case 'currency':
                // Format currency
                value = value.replace(/[^\d.]/g, '');
                if (value) {
                    value = '$' + parseFloat(value).toFixed(2);
                }
                break;

            case 'uppercase':
                value = value.toUpperCase();
                break;

            case 'lowercase':
                value = value.toLowerCase();
                break;

            case 'capitalize':
                value = value.replace(/\b\w/g, l => l.toUpperCase());
                break;
        }

        field.value = value;
    }

    updatePasswordStrength(passwordField) {
        const password = passwordField.value;
        const strengthIndicator = document.getElementById('passwordStrength') || this.createPasswordStrengthIndicator(passwordField);
        
        let strength = 0;
        let feedback = [];

        // Length check
        if (password.length >= 8) strength++;
        else feedback.push('At least 8 characters');

        // Uppercase check
        if (/[A-Z]/.test(password)) strength++;
        else feedback.push('One uppercase letter');

        // Lowercase check
        if (/[a-z]/.test(password)) strength++;
        else feedback.push('One lowercase letter');

        // Number check
        if (/\d/.test(password)) strength++;
        else feedback.push('One number');

        // Special character check
        if (/[@$!%*?&]/.test(password)) strength++;
        else feedback.push('One special character');

        // Update strength indicator
        const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        const strengthColors = ['#ff4444', '#ff8800', '#ffbb00', '#88cc00', '#00cc44'];
        
        strengthIndicator.textContent = strengthLevels[strength] || 'Very Weak';
        strengthIndicator.style.color = strengthColors[strength] || '#ff4444';
        
        // Update progress bar
        const progressBar = strengthIndicator.nextElementSibling;
        if (progressBar) {
            progressBar.style.width = `${(strength / 5) * 100}%`;
            progressBar.style.backgroundColor = strengthColors[strength] || '#ff4444';
        }

        // Show feedback
        const feedbackElement = document.getElementById('passwordFeedback');
        if (feedbackElement && feedback.length > 0) {
            feedbackElement.innerHTML = 'Missing: ' + feedback.join(', ');
        } else if (feedbackElement) {
            feedbackElement.innerHTML = '';
        }
    }

    createPasswordStrengthIndicator(passwordField) {
        const container = document.createElement('div');
        container.className = 'password-strength-container';
        
        const indicator = document.createElement('div');
        indicator.id = 'passwordStrength';
        indicator.className = 'password-strength-text';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'password-strength-bar';
        
        const feedback = document.createElement('div');
        feedback.id = 'passwordFeedback';
        feedback.className = 'password-feedback';
        
        container.appendChild(indicator);
        container.appendChild(progressBar);
        container.appendChild(feedback);
        
        passwordField.parentNode.appendChild(container);
        return indicator;
    }

    validatePasswordConfirmation(confirmField) {
        const passwordField = document.querySelector('input[name="password"]');
        if (!passwordField) return;

        const password = passwordField.value;
        const confirmPassword = confirmField.value;

        if (confirmPassword && password !== confirmPassword) {
            this.showFieldError(confirmField, 'Passwords do not match');
        } else if (confirmPassword) {
            this.showFieldSuccess(confirmField);
        }
    }

    async handleFormSubmission(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        const removeLoading = window.scrollAnimations?.addLoadingState(submitButton, 'Submitting...');
        
        try {
            // Validate form
            const validation = this.validateForm(form);
            
            if (!validation.isValid) {
                this.showFormError(form, 'Please correct the errors below.');
                return;
            }

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Submit form based on type
            let result;
            if (form.id === 'contactForm') {
                result = await this.submitContactForm(data);
            } else if (form.id === 'registrationForm') {
                result = await this.submitRegistrationForm(data);
            } else if (form.classList.contains('partnership-form')) {
                result = await this.submitPartnershipForm(data);
            } else {
                result = await this.submitGenericForm(form, data);
            }

            if (result.success) {
                this.showFormSuccess(form, result.message || 'Form submitted successfully!');
                form.reset();
                
                // Show confetti effect if available
                if (window.confetti) {
                    window.confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }
            } else {
                this.showFormError(form, result.message || 'Submission failed. Please try again.');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormError(form, 'Network error. Please check your connection and try again.');
        } finally {
            // Remove loading state
            if (removeLoading) removeLoading();
        }
    }

    async submitContactForm(data) {
        // Use Web3Forms for contact form
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                access_key: '5c0b9311-f7eb-4a05-b1bd-c690b73f463d',
                ...data
            })
        });

        const result = await response.json();
        return {
            success: result.success,
            message: result.success ? 'Message sent successfully!' : result.message
        };
    }

    async submitRegistrationForm(data) {
        // Handle registration through existing registration system
        if (window.enhancedRegistration) {
            return await window.enhancedRegistration.handleRegistration(data);
        }
        
        return { success: false, message: 'Registration system not available' };
    }

    async submitPartnershipForm(data) {
        // Use Web3Forms for partnership applications
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                access_key: '5c0b9311-f7eb-4a05-b1bd-c690b73f463d',
                subject: 'Partnership Application - Helensvale Connect',
                ...data
            })
        });

        const result = await response.json();
        return {
            success: result.success,
            message: result.success ? 'Partnership application submitted successfully!' : result.message
        };
    }

    async submitGenericForm(form, data) {
        // Generic form submission
        const action = form.action || '#';
        const method = form.method || 'POST';

        if (action === '#') {
            // Use Web3Forms as fallback
            return await this.submitContactForm(data);
        }

        const response = await fetch(action, {
            method: method.toUpperCase(),
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        return {
            success: response.ok,
            message: result.message || (response.ok ? 'Form submitted successfully!' : 'Submission failed')
        };
    }

    showFormError(form, message) {
        this.removeFormMessages(form);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-message form-error animate-fade-in-up';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        errorDiv.setAttribute('role', 'alert');
        
        form.insertBefore(errorDiv, form.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.classList.add('animate-fade-out');
                setTimeout(() => errorDiv.remove(), 300);
            }
        }, 5000);
    }

    showFormSuccess(form, message) {
        this.removeFormMessages(form);
        
        const successDiv = document.createElement('div');
        successDiv.className = 'form-message form-success animate-fade-in-up';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        successDiv.setAttribute('role', 'status');
        
        form.insertBefore(successDiv, form.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.classList.add('animate-fade-out');
                setTimeout(() => successDiv.remove(), 300);
            }
        }, 5000);
    }

    removeFormMessages(form) {
        const messages = form.querySelectorAll('.form-message');
        messages.forEach(msg => msg.remove());
    }

    // Utility methods
    sanitizeInput(input) {
        return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize form validation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.formValidation = new FormValidation();
});

// Add CSS for form validation styles
const validationCSS = `
.form-group {
    position: relative;
    margin-bottom: 1.5rem;
}

.form-group input,
.form-group textarea,
.form-group select {
    transition: all 0.3s ease;
    border: 2px solid rgba(255, 255, 255, 0.1);
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input.error,
.form-group textarea.error,
.form-group select.error {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-group input.success,
.form-group textarea.success,
.form-group select.success {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.error-message {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.error-message::before {
    content: "⚠";
    font-size: 1rem;
}

.form-message {
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 500;
}

.form-error {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;
}

.form-success {
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: #10b981;
}

.password-strength-container {
    margin-top: 0.5rem;
}

.password-strength-text {
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.25rem;
}

.password-strength-bar {
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.password-feedback {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-top: 0.25rem;
}

@keyframes fade-out {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-10px); }
}

.animate-fade-out {
    animation: fade-out 0.3s ease-out forwards;
}
`;

// Inject validation CSS
const validationStyle = document.createElement('style');
validationStyle.textContent = validationCSS;
document.head.appendChild(validationStyle);
