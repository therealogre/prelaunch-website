// Membership Selection and Interactions
class MembershipManager {
    constructor() {
        this.billingToggle = document.getElementById('billingToggle');
        this.faqItems = document.querySelectorAll('.faq-item');
        this.init();
    }

    init() {
        // Initialize event listeners
        if (this.billingToggle) {
            this.billingToggle.addEventListener('change', this.toggleBillingCycle.bind(this));
        }

        // Initialize FAQ accordion
        this.initFAQ();

        // Initialize any other interactive elements
        this.initOtherInteractions();
    }

    toggleBillingCycle() {
        const isAnnual = this.billingToggle.checked;
        const prices = document.querySelectorAll('.price');
        const periods = document.querySelectorAll('.price span');
        const saveBadges = document.querySelectorAll('.save-badge');

        prices.forEach(priceEl => {
            const basePrice = parseFloat(priceEl.getAttribute('data-monthly') || '0');
            if (isAnnual) {
                const annualPrice = (basePrice * 12 * 0.8).toFixed(2); // 20% off for annual
                priceEl.textContent = annualPrice;
            } else {
                priceEl.textContent = basePrice.toFixed(2);
            }
        });

        periods.forEach(period => {
            period.textContent = isAnnual ? '/year' : '/month';
        });

        saveBadges.forEach(badge => {
            badge.style.display = isAnnual ? 'inline-block' : 'none';
        });
    }

    initFAQ() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    // Close all other open FAQ items
                    this.faqItems.forEach(i => {
                        if (i !== item && i.classList.contains('active')) {
                            i.classList.remove('active');
                        }
                    });
                    
                    // Toggle current item
                    item.classList.toggle('active');
                });
            }
        });
    }

    initOtherInteractions() {
        // Add any additional interactive elements here
        document.addEventListener('click', (e) => {
            // Close FAQ when clicking outside
            if (!e.target.closest('.faq-item')) {
                this.faqItems.forEach(item => {
                    item.classList.remove('active');
                });
            }
        });
    }
}

// Handle plan selection
document.addEventListener('DOMContentLoaded', () => {
    // Initialize membership manager
    if (document.querySelector('.pricing-section')) {
        new MembershipManager();
    }
});

// Global function to handle plan selection
window.selectPlan = function(planType) {
    // Store selected plan in session storage
    sessionStorage.setItem('selectedPlan', planType);
    
    // If free plan, redirect to registration
    if (planType === 'free') {
        window.location.href = 'register.html?plan=free';
    } 
    // If VIP plan, redirect to payment
    else if (planType === 'vip') {
        window.location.href = 'payment.html?plan=vip';
    }
    // If business plan, redirect to business registration
    else if (['starter', 'growth', 'enterprise'].includes(planType)) {
        window.location.href = `business-register.html?plan=${planType}`;
    }
};
