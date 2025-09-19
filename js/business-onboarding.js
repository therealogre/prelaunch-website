// Enhanced Business Onboarding System
class EnhancedBusinessOnboarding {
    constructor() {
        this.form = document.getElementById('businessOnboardingForm');
        this.steps = document.querySelectorAll('.form-step');
        this.progressSteps = document.querySelectorAll('.progress-steps .step');
        this.progressFill = document.getElementById('progressFill');
        this.nextBtn = document.getElementById('nextBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.submitBtn = document.getElementById('submitBtn');
        this.currentStep = 1;
        this.totalSteps = this.steps.length;
        
        this.initializeEventListeners();
        this.initializeMobileNavigation();
        this.initializeFloatingElements();
        this.updateProgress();
        this.loadSavedData();
    }

    initializeEventListeners() {
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextStep());
        }

        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevStep());
        }

        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            
            // Auto-save form data
            const inputs = this.form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('change', () => this.saveFormData());
                input.addEventListener('blur', () => this.validateField(input));
            });
        }
    }

    initializeMobileNavigation() {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const mobileSidebar = document.getElementById('mobileSidebar');
        const sidebarClose = document.getElementById('sidebarClose');

        if (mobileToggle && mobileSidebar) {
            mobileToggle.addEventListener('click', () => {
                mobileSidebar.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        if (sidebarClose && mobileSidebar) {
            sidebarClose.addEventListener('click', () => {
                mobileSidebar.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        if (mobileSidebar) {
            mobileSidebar.addEventListener('click', (e) => {
                if (e.target === mobileSidebar) {
                    mobileSidebar.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    initializeFloatingElements() {
        const floatingElements = document.querySelectorAll('.float-element');
        
        floatingElements.forEach((element, index) => {
            const speed = parseFloat(element.dataset.speed) || 1;
            const delay = index * 0.5;
            
            element.style.animationDelay = `${delay}s`;
            element.style.animationDuration = `${3 + speed}s`;
        });

        // Parallax effect on scroll
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            floatingElements.forEach(element => {
                const speed = parseFloat(element.dataset.speed) || 1;
                const yPos = -(scrolled * speed * 0.1);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    nextStep() {
        if (this.validateCurrentStep() && this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateStepDisplay();
            this.updateProgress();
            this.scrollToTop();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
            this.updateProgress();
            this.scrollToTop();
        }
    }

    scrollToTop() {
        const formSection = document.querySelector('.onboarding-form-section');
        if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    updateStepDisplay() {
        // Hide all steps
        this.steps.forEach(step => {
            step.classList.remove('active');
        });

        // Show current step
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }

        // Update button visibility
        this.prevBtn.style.display = this.currentStep > 1 ? 'inline-flex' : 'none';
        
        if (this.currentStep === this.totalSteps) {
            this.nextBtn.style.display = 'none';
            this.submitBtn.style.display = 'inline-flex';
        } else {
            this.nextBtn.style.display = 'inline-flex';
            this.submitBtn.style.display = 'none';
        }
    }

    updateProgress() {
        const progressPercentage = (this.currentStep / this.totalSteps) * 100;
        if (this.progressFill) {
            this.progressFill.style.width = `${progressPercentage}%`;
        }

        // Update progress steps
        this.progressSteps.forEach((step, index) => {
            const stepNumber = index + 1;
            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }

    validateCurrentStep() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        if (!currentStepElement) return true;

        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showError('Please fill in all required fields before continuing.');
        }

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        this.showFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    showFieldValidation(field, isValid, errorMessage) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        // Remove existing error
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Remove error class
        field.classList.remove('error');

        if (!isValid) {
            // Add error class
            field.classList.add('error');
            
            // Add error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = errorMessage;
            formGroup.appendChild(errorDiv);
        }
    }

    saveFormData() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        localStorage.setItem('businessOnboardingData', JSON.stringify(data));
    }

    loadSavedData() {
        const savedData = localStorage.getItem('businessOnboardingData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                Object.keys(data).forEach(key => {
                    const field = this.form.querySelector(`[name="${key}"]`);
                    if (field) {
                        if (field.type === 'checkbox') {
                            field.checked = data[key] === field.value;
                        } else {
                            field.value = data[key];
                        }
                    }
                });
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateCurrentStep()) {
            return;
        }

        const formData = new FormData(this.form);
        
        // Collect checkbox values properly
        const checkboxGroups = ['features', 'growth_priorities'];
        checkboxGroups.forEach(group => {
            const checkboxes = this.form.querySelectorAll(`input[name="${group}"]:checked`);
            const values = Array.from(checkboxes).map(cb => cb.value);
            formData.set(group, values.join(', '));
        });

        try {
            // Show loading state
            this.submitBtn.innerHTML = `
                <div class="loading-spinner"></div>
                <span>Completing Setup...</span>
            `;
            this.submitBtn.disabled = true;

            // Submit to Web3Forms
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                this.showSuccess('Business setup completed successfully! Redirecting to your exclusive pre-launch offer...');
                
                // Clear saved data
                localStorage.removeItem('businessOnboardingData');
                
                // Redirect to pre-launch offer
                setTimeout(() => {
                    window.location.href = 'business-pre-launch-offer.html';
                }, 2000);
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Onboarding error:', error);
            this.showError('Setup failed. Please try again or contact support.');
            
            // Reset button
            this.submitBtn.innerHTML = `
                <i class="fas fa-rocket"></i>
                <span>Complete Setup & Get Pre-Launch Offer</span>
            `;
            this.submitBtn.disabled = false;
        }
    }

    showSuccess(message) {
        this.showAlert(message, 'success');
    }

    showError(message) {
        this.showAlert(message, 'error');
    }

    showAlert(message, type) {
        const alertContainer = document.getElementById('alertContainer');
        if (!alertContainer) return;

        // Remove existing alerts
        alertContainer.innerHTML = '';

        // Create new alert
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="alert-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        alertContainer.appendChild(alert);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedBusinessOnboarding();
});
