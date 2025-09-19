// Clean & Simple Registration System
class CleanRegistration {
    constructor() {
        this.accessKey = '5c0b9311-f7eb-4a05-b1bd-c690b73f463d';
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupProgressiveDisclosure();
        this.setupMobileOptimization();
    }

    bindEvents() {
        // Single form handler for all registration forms
        document.addEventListener('submit', (e) => {
            if (e.target.matches('.registration-form, #earlyAccessForm')) {
                e.preventDefault();
                this.handleSubmission(e.target);
            }
        });

        // Real-time validation
        document.addEventListener('input', (e) => {
            if (e.target.matches('input[type="email"], input[type="text"]')) {
                this.validateField(e.target);
            }
        });
    }

    async handleSubmission(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Minimal loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Joining...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(form);
            const data = this.extractCleanData(formData);
            
            await this.submitToWeb3Forms(data);
            this.showSuccess(form);
            
        } catch (error) {
            this.showError(form, 'Something went wrong. Please try again.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    extractCleanData(formData) {
        return {
            access_key: this.accessKey,
            name: formData.get('name') || formData.get('fullName') || '',
            email: formData.get('email'),
            role: formData.get('role') || 'user',
            source: 'Helensvale Connect Early Access',
            timestamp: new Date().toISOString()
        };
    }

    async submitToWeb3Forms(data) {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Submission failed');
        return response.json();
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
            message = isValid ? '' : 'Please enter a valid email address';
        } else if (field.required && !value) {
            isValid = false;
            message = 'This field is required';
        }

        this.updateFieldState(field, isValid, message);
        return isValid;
    }

    updateFieldState(field, isValid, message) {
        const container = field.closest('.form-group') || field.parentElement;
        const errorEl = container.querySelector('.field-error') || this.createErrorElement();
        
        field.classList.toggle('error', !isValid);
        field.classList.toggle('valid', isValid && field.value.trim());
        
        if (!isValid && message) {
            errorEl.textContent = message;
            if (!container.contains(errorEl)) {
                container.appendChild(errorEl);
            }
        } else if (container.contains(errorEl)) {
            errorEl.remove();
        }
    }

    createErrorElement() {
        const el = document.createElement('span');
        el.className = 'field-error';
        return el;
    }

    showSuccess(form) {
        const successHTML = `
            <div class="success-message">
                <div class="success-icon">🎉</div>
                <h3>Welcome to the Future!</h3>
                <p>You're now part of Zimbabwe's marketplace revolution.</p>
                <small>Check your email for next steps.</small>
            </div>
        `;
        
        form.innerHTML = successHTML;
        this.triggerConfetti();
    }

    showError(form, message) {
        const errorEl = form.querySelector('.form-error') || document.createElement('div');
        errorEl.className = 'form-error';
        errorEl.textContent = message;
        
        if (!form.contains(errorEl)) {
            form.insertBefore(errorEl, form.firstChild);
        }
        
        setTimeout(() => errorEl.remove(), 5000);
    }

    setupProgressiveDisclosure() {
        // Show additional fields only when needed
        const roleSelects = document.querySelectorAll('select[name="role"]');
        roleSelects.forEach(select => {
            select.addEventListener('change', (e) => {
                const businessFields = document.querySelector('.business-fields');
                if (businessFields) {
                    businessFields.style.display = 
                        e.target.value === 'business' ? 'block' : 'none';
                }
            });
        });
    }

    setupMobileOptimization() {
        // Ensure forms work well on mobile
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                // Prevent zoom on iOS
                input.style.fontSize = '16px';
            });
        });
    }

    triggerConfetti() {
        // Simple confetti effect
        if (typeof confetti !== 'undefined') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.cleanRegistration = new CleanRegistration();
});

// CSS for clean registration
const cleanRegCSS = `
.registration-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.form-group {
    margin-bottom: 1.5rem;
    position: relative;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-primary);
    font-size: 16px;
    transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input.valid {
    border-color: #10b981;
}

.form-group input.error {
    border-color: #ef4444;
}

.field-error {
    color: #ef4444;
    font-size: 0.85rem;
    margin-top: 0.5rem;
    display: block;
}

.form-error {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    text-align: center;
}

.success-message {
    text-align: center;
    padding: 2rem;
}

.success-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.success-message h3 {
    color: var(--text-primary);
    margin-bottom: 1rem;
}

.success-message p {
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
}

.success-message small {
    color: var(--text-secondary);
    opacity: 0.8;
}

.business-fields {
    display: none;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
    .registration-form {
        padding: 1.5rem;
        margin: 1rem;
    }
    
    .form-group input,
    .form-group select {
        padding: 0.875rem;
    }
}
`;

// Inject CSS
const cleanRegStyle = document.createElement('style');
cleanRegStyle.textContent = cleanRegCSS;
document.head.appendChild(cleanRegStyle);
