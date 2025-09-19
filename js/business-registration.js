// Enhanced Business Registration System
class EnhancedBusinessRegistration {
    constructor() {
        this.form = document.getElementById('businessRegistrationForm');
        this.planCards = document.querySelectorAll('.business-plan');
        this.selectPlanButtons = document.querySelectorAll('.select-plan-btn');
        this.citySelect = document.getElementById('businessCity');
        this.suburbSelect = document.getElementById('businessSuburb');
        this.selectedPlan = 'growth'; // Default to growth plan
        this.planPrices = {
            starter: { amount: '9.99', name: 'Starter Business Plan' },
            growth: { amount: '39.99', name: 'Growth Business Plan' }
        };
        
        this.initializeEventListeners();
        this.initializeLocationData();
        this.initializeMobileNavigation();
        this.initializeFloatingElements();
        this.updatePlanDisplay();
    }

    initializeEventListeners() {
        // Plan selection
        this.selectPlanButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const planType = e.target.dataset.plan;
                this.selectPlan(planType);
            });
        });

        // City selection for location intelligence
        if (this.citySelect) {
            this.citySelect.addEventListener('change', (e) => {
                this.updateSuburbs(e.target.value);
            });
        }

        // Form submission with payment integration
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                this.handleFormSubmission(e);
            });
        }

        // Real-time form validation
        this.initializeFormValidation();
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

        // Close sidebar when clicking outside
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

    selectPlan(planType) {
        // Update visual selection
        this.planCards.forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`[data-plan="${planType}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }

        this.selectedPlan = planType;
        this.updatePlanDisplay();
        
        // Update hidden form field
        const hiddenInput = document.getElementById('selectedBusinessPlan');
        if (hiddenInput) {
            hiddenInput.value = planType;
        }

        // Scroll to registration form
        const registrationSection = document.querySelector('.business-registration-section');
        if (registrationSection) {
            registrationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    updatePlanDisplay() {
        const plan = this.planPrices[this.selectedPlan];
        if (!plan) return;

        // Update plan name and price displays
        const planNameDisplay = document.getElementById('planNameDisplay');
        const planPriceDisplay = document.getElementById('planPriceDisplay');
        const totalPriceDisplay = document.getElementById('totalPriceDisplay');
        const businessBtnPrice = document.getElementById('businessBtnPrice');

        if (planNameDisplay) planNameDisplay.textContent = plan.name;
        if (planPriceDisplay) planPriceDisplay.textContent = `${plan.amount}$/month`;
        if (totalPriceDisplay) totalPriceDisplay.textContent = `${plan.amount}$`;
        if (businessBtnPrice) businessBtnPrice.textContent = `${plan.amount}$`;
    }

    initializeLocationData() {
        this.locationData = {
            harare: [
                'Avondale', 'Belvedere', 'Borrowdale', 'Chisipite', 'Glen Lorne',
                'Greendale', 'Highlands', 'Mount Pleasant', 'Newlands', 'Pomona',
                'Westgate', 'Marlborough', 'Msasa', 'Workington', 'Graniteside',
                'Hatfield', 'Waterfalls', 'Southerton', 'Ardbennie', 'Glen View',
                'Budiriro', 'Mbare', 'Highfield', 'Kuwadzana', 'Warren Park',
                'Dzivaresekwa', 'Mufakose', 'Kambuzuma', 'Tafara', 'Epworth',
                'Chitungwiza', 'Ruwa', 'Norton', 'Domboshava', 'Goromonzi',
                'Mazowe', 'Bindura', 'Shamva'
            ],
            bulawayo: [
                'Suburbs', 'Hillside', 'Burnside', 'Riverside', 'Northend',
                'Kumalo', 'Nkulumane', 'Tshabalala', 'Entumbane', 'Luveve',
                'Magwegwe', 'Mpopoma', 'Makokoba', 'Mzilikazi', 'Njube',
                'Pumula', 'Richmond', 'Selbourne Park', 'Woodville'
            ],
            mutare: [
                'Murambi', 'Chikanga', 'Dangamvura', 'Hobhouse', 'Palmerstone',
                'Tiger Reef', 'Yeovil', 'Florida', 'Greenside', 'Morningside'
            ],
            gweru: [
                'Ascot', 'Kopje', 'Mambo', 'Mkoba', 'Nehosho', 'Ridgemont',
                'Senga', 'Woodlands', 'Nashville', 'Athlone'
            ],
            kwekwe: [
                'Amaveni', 'Mbizo', 'Redcliff', 'Torwood', 'Zishavane',
                'Globe and Phoenix', 'Goldfields', 'Msasa Park'
            ],
            masvingo: [
                'Mucheke', 'Rhodene', 'Target Kopje', 'Eastvale', 'Civic Centre'
            ],
            chinhoyi: [
                'Town Centre', 'Gadzema', 'Chikonohono', 'Mzari', 'Orange Grove'
            ]
        };
    }

    updateSuburbs(city) {
        if (!this.suburbSelect || !city) {
            return;
        }

        const suburbs = this.locationData[city] || [];
        
        // Clear existing options
        this.suburbSelect.innerHTML = '<option value="">Select your suburb</option>';
        
        // Add new options
        suburbs.forEach(suburb => {
            const option = document.createElement('option');
            option.value = suburb.toLowerCase().replace(/\s+/g, '-');
            option.textContent = suburb;
            this.suburbSelect.appendChild(option);
        });
    }

    initializeFormValidation() {
        if (!this.form) return;
        
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
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

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^(\+263|0)[0-9]{9}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid Zimbabwe phone number';
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

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        const existingError = formGroup.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.classList.remove('error');
    }

    async handleFormSubmission(e) {
        e.preventDefault();
        
        // Validate all fields
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showError('Please correct the errors in the form before submitting.');
            return;
        }

        const formData = new FormData(this.form);
        const registrationData = Object.fromEntries(formData);
        
        // Get selected payment method
        const paymentMethod = formData.get('payment_method');
        if (!paymentMethod) {
            this.showError('Please select a payment method.');
            return;
        }

        // Show loading state
        const submitButton = document.getElementById('businessSubmitBtn');
        const originalContent = submitButton.innerHTML;
        submitButton.innerHTML = `
            <div class="loading-spinner"></div>
            <span>Processing Registration...</span>
        `;
        submitButton.disabled = true;

        try {
            // Store registration data temporarily
            localStorage.setItem('businessRegistrationData', JSON.stringify(registrationData));
            
            // Initiate payment process
            await this.initiatePayment(registrationData, paymentMethod);
            
        } catch (error) {
            console.error('Registration error:', error);
            this.showError('Registration failed. Please try again or contact support.');
            
            // Reset button
            submitButton.innerHTML = originalContent;
            submitButton.disabled = false;
        }
    }

    async initiatePayment(registrationData, paymentMethod) {
        // For development/testing - simulate payment process
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.simulatePaymentFlow(registrationData, paymentMethod);
            return;
        }

        // Production PayNow integration
        const plan = this.planPrices[this.selectedPlan];
        const paymentData = {
            id: '12345', // Use your actual PayNow integration ID
            reference: `BUSINESS-${this.selectedPlan.toUpperCase()}-${Date.now()}`,
            amount: plan.amount,
            additionalinfo: `${plan.name} - ${registrationData.business_name} (${registrationData.owner_name})`,
            returnurl: window.location.origin + '/business-onboarding.html',
            resulturl: window.location.origin + '/payment-result.html',
            authemail: registrationData.owner_email,
            status: 'Message'
        };

        // Generate secure hash (HMAC-SHA512)
        const integrationKey = 'your-paynow-integration-key'; // Replace with actual key
        const hashString = `${paymentData.id}${paymentData.reference}${paymentData.amount}${paymentData.additionalinfo}${paymentData.returnurl}${paymentData.resulturl}${paymentData.authemail}${paymentData.status}`;
        
        // Create payment form and submit
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://www.paynow.co.zw/interface/initiatetransaction';
        
        Object.keys(paymentData).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = paymentData[key];
            form.appendChild(input);
        });

        // Add hash
        const hashInput = document.createElement('input');
        hashInput.type = 'hidden';
        hashInput.name = 'hash';
        hashInput.value = 'generated-hash-here'; // Generate actual hash
        form.appendChild(hashInput);

        document.body.appendChild(form);
        form.submit();
    }

    simulatePaymentFlow(registrationData, paymentMethod) {
        const modal = document.createElement('div');
        modal.className = 'payment-simulation-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Payment Simulation (Development Mode)</h3>
                    <button class="modal-close" onclick="this.closest('.payment-simulation-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="payment-details">
                        <h4>Business Registration Details</h4>
                        <p><strong>Business:</strong> ${registrationData.business_name}</p>
                        <p><strong>Owner:</strong> ${registrationData.owner_name}</p>
                        <p><strong>Email:</strong> ${registrationData.owner_email}</p>
                        <p><strong>Plan:</strong> ${this.planPrices[this.selectedPlan].name}</p>
                        <p><strong>Amount:</strong> ${this.planPrices[this.selectedPlan].amount}$/month</p>
                        <p><strong>Payment Method:</strong> ${paymentMethod.toUpperCase()}</p>
                    </div>
                    <div class="simulation-actions">
                        <button class="btn btn-success" onclick="window.businessPayment.simulateSuccess()">
                            ✅ Simulate Successful Payment
                        </button>
                        <button class="btn btn-error" onclick="window.businessPayment.simulateFailure()">
                            ❌ Simulate Payment Failure
                        </button>
                        <button class="btn btn-secondary" onclick="this.closest('.payment-simulation-modal').remove()">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add simulation handlers
        window.businessPayment = {
            simulateSuccess: () => {
                modal.remove();
                this.showSuccess('Payment successful! Business registration completed.');
                
                // Reset form and button
                const submitButton = document.getElementById('businessSubmitBtn');
                submitButton.innerHTML = `
                    <span class="btn-text">Start Growing Your Business</span>
                    <span class="btn-price">${this.planPrices[this.selectedPlan].amount}$</span>
                `;
                submitButton.disabled = false;
                
                setTimeout(() => {
                    window.location.href = 'business-onboarding.html';
                }, 2000);
            },
            simulateFailure: () => {
                modal.remove();
                this.showError('Payment failed. Please try again or contact support.');
                
                // Reset button
                const submitButton = document.getElementById('businessSubmitBtn');
                submitButton.innerHTML = `
                    <span class="btn-text">Start Growing Your Business</span>
                    <span class="btn-price">${this.planPrices[this.selectedPlan].amount}$</span>
                `;
                submitButton.disabled = false;
            }
        };
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
    new EnhancedBusinessRegistration();
});
