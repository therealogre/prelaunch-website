import { BUSINESS_TIERS } from './config/membership-tiers.js';

class BusinessRegistration {
    constructor() {
        this.form = document.getElementById('businessRegistrationForm');
        if (!this.form) return;

        this.steps = document.querySelectorAll('.step');
        this.sections = document.querySelectorAll('.form-section');
        this.planContainer = document.querySelector('.plan-selection');
        this.currentStep = 1;

        this.plans = BUSINESS_TIERS;
        this.selectedPlan = this.findPopularPlanId() || 'starter';
        this.paymentMethod = 'creditCard';

        this.init();
    }

    init() {
        if (this.planContainer) {
            this.renderPlanOptions();
        }
        this.setupEventListeners();
        this.initializeForm();
        this.showSection(1);
    }

    findPopularPlanId() {
        for (const key in this.plans) {
            if (this.plans[key].popular) {
                return this.plans[key].id;
            }
        }
        return null;
    }

    renderPlanOptions() {
        this.planContainer.innerHTML = ''; // Clear static content

        Object.values(this.plans).forEach(tier => {
            const option = document.createElement('div');
            option.className = `plan-option ${tier.popular ? 'popular' : ''}`;
            option.setAttribute('data-plan', tier.id);

            let priceHTML;
            if (typeof tier.price === 'number' && tier.price > 0) {
                priceHTML = `<span class="plan-price">$${tier.price.toFixed(2)}</span><span class="plan-period">/ ${tier.billing}</span>`;
            } else if (tier.price === 0) {
                priceHTML = `<span class="plan-price">Free</span><span class="plan-period">${tier.billing}</span>`;
            } else {
                priceHTML = `<span class="plan-price">${tier.price}</span>`;
            }

            option.innerHTML = `
                ${tier.popular ? '<span class="popular-tag">Most Popular</span>' : ''}
                <h3 class="plan-name">${tier.name}</h3>
                <div class="price-container">${priceHTML}</div>
                <ul class="plan-features">
                    ${tier.features.map(feature => `<li><i class="fas fa-check"></i>${feature}</li>`).join('')}
                </ul>
                <button type="button" class="btn btn-outline btn-block select-plan">${tier.cta}</button>
            `;
            this.planContainer.appendChild(option);
        });
    }

    setupEventListeners() {
        if (this.planContainer) {
            this.planContainer.addEventListener('click', (e) => {
                const planOption = e.target.closest('.plan-option');
                if (planOption) {
                    const planId = planOption.getAttribute('data-plan');
                    this.selectPlan(planId);
                }
            });
        }

        this.form.querySelectorAll('.next-step').forEach(btn => {
            btn.addEventListener('click', () => {
                const nextStep = parseInt(btn.getAttribute('data-next'));
                this.nextStep(nextStep);
            });
        });

        this.form.querySelectorAll('.prev-step').forEach(btn => {
            btn.addEventListener('click', () => {
                const prevStep = parseInt(btn.getAttribute('data-prev'));
                this.prevStep(prevStep);
            });
        });

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        this.form.querySelectorAll('input[name="paymentMethod"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.paymentMethod = e.target.value;
                this.togglePaymentDetails();
            });
        });
    }

    initializeForm() {
        this.selectPlan(this.selectedPlan);
        this.updateOrderSummary();
        this.togglePaymentDetails();
    }

    selectPlan(planId) {
        this.selectedPlan = planId;
        this.form.querySelectorAll('.plan-option').forEach(option => {
            const button = option.querySelector('button');
            if (option.getAttribute('data-plan') === planId) {
                option.classList.add('selected');
                button.classList.replace('btn-outline', 'btn-primary');
            } else {
                option.classList.remove('selected');
                button.classList.replace('btn-primary', 'btn-outline');
            }
        });
        this.updateOrderSummary();
    }

    updateOrderSummary() {
        const planKey = this.selectedPlan.toUpperCase();
        const plan = this.plans[planKey];
        if (!plan) return;

        const planNameEl = document.getElementById('selectedPlanName');
        const accountStartDateEl = document.getElementById('accountStartDate');

        if (planNameEl) planNameEl.textContent = `${plan.name} Plan`;
        if (accountStartDateEl) {
            const startDate = new Date();
            accountStartDateEl.textContent = startDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    }

    togglePaymentDetails() {
        const cardDetails = this.form.querySelector('.card-details');
        const paymentSection = document.getElementById('section3');
        const plan = this.plans[this.selectedPlan.toUpperCase()];

        if (!plan || plan.price === 0) {
             if (paymentSection) paymentSection.style.display = 'none';
        } else {
             if (paymentSection) paymentSection.style.display = 'block';
        }

        if (cardDetails) {
            cardDetails.style.display = this.paymentMethod === 'creditCard' ? 'block' : 'none';
        }
    }

    nextStep(step) {
        if (this.validateStep(this.currentStep)) {
            this.currentStep = step;
            // Skip payment step if plan is free
            const plan = this.plans[this.selectedPlan.toUpperCase()];
            if (this.currentStep === 3 && plan && plan.price === 0) {
                this.currentStep = 4; // Skip to completion
            }
            this.showSection(this.currentStep);
            this.updateProgress(this.currentStep);
        }
    }

    prevStep(step) {
        this.currentStep = step;
         // Skip back over payment step if plan is free
        const plan = this.plans[this.selectedPlan.toUpperCase()];
        if (this.currentStep === 3 && plan && plan.price === 0) {
            this.currentStep = 2; // Go back to business info
        }
        this.showSection(this.currentStep);
        this.updateProgress(this.currentStep);
    }

    showSection(sectionNum) {
        this.sections.forEach(section => section.classList.remove('active'));
        const currentSection = document.getElementById(`section${sectionNum}`);
        if (currentSection) {
            currentSection.classList.add('active');
        }
    }

    updateProgress(step) {
        this.steps.forEach(stepEl => {
            const stepNum = parseInt(stepEl.getAttribute('data-step'));
            if (stepNum < step) {
                stepEl.classList.add('completed');
                stepEl.classList.remove('active');
            } else if (stepNum === step) {
                stepEl.classList.add('active');
                stepEl.classList.remove('completed');
            } else {
                stepEl.classList.remove('active', 'completed');
            }
        });
    }

    validateStep(step) {
        const section = document.getElementById(`section${step}`);
        if (!section) return true;

        let isValid = true;
        const requiredFields = section.querySelectorAll('[required]:not(:disabled)');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                this.showError(field, 'This field is required.');
            } else {
                this.removeError(field);
            }
        });

        return isValid;
    }

    showError(field, message) {
        this.removeError(field);
        field.classList.add('error');
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = message;
        field.parentNode.insertBefore(errorMsg, field.nextSibling);
    }

    removeError(field) {
        field.classList.remove('error');
        const errorMsg = field.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.remove();
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        const planKey = this.selectedPlan.toUpperCase();
        const plan = this.plans[planKey];
        if (!plan) return;

        const lastStep = (plan.price > 0) ? 3 : 2;
        let isValid = true;
        for (let i = 1; i <= lastStep; i++) {
            if (!this.validateStep(i)) {
                this.showSection(i);
                this.updateProgress(i);
                isValid = false;
                break;
            }
        }

        if (!isValid) return;

        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        const formData = new FormData(this.form);
        const email = formData.get('email');
        const name = formData.get('businessName');

        // If the plan is free, just show the success step.
        if (plan.price === 0) {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing
            this.showSection(4);
            this.updateProgress(4);
            return;
        }

        try {
            const response = await fetch('/.netlify/functions/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    amount: plan.price,
                    plan: plan.name,
                    planId: plan.id, // Add planId to the payload
                    role: 'business',
                    name: name,
                }),
            });

            const data = await response.json();

            if (response.ok && data.authorization_url) {
                // Redirect to Paystack's payment page
                window.location.href = data.authorization_url;
            } else {
                throw new Error(data.error || 'Payment initialization failed.');
            }
        } catch (error) {
            console.error('Payment Error:', error);
            alert(`An error occurred: ${error.message}`);
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BusinessRegistration();
});