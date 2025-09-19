// Business Pre-Launch Offer System
class BusinessPreLaunchOffer {
    constructor() {
        this.accessKey = '5c0b9311-f7eb-4a05-b1bd-c690b73f463d';
        this.businessInfo = {};
        this.init();
    }

    init() {
        this.parseUrlParams();
        this.setupCountdownTimer();
        this.bindFormEvents();
        this.addCustomCSS();
    }

    parseUrlParams() {
        const params = new URLSearchParams(window.location.search);
        this.businessInfo = {
            email: params.get('email'),
            businessName: params.get('business')
        };
    }

    setupCountdownTimer() {
        // Set countdown to 7 days from now
        const endTime = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);
        
        const updateTimer = () => {
            const now = new Date().getTime();
            const timeLeft = endTime - now;
            
            if (timeLeft > 0) {
                const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                
                document.getElementById('days').textContent = days.toString().padStart(2, '0');
                document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
                document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            }
        };
        
        updateTimer();
        setInterval(updateTimer, 60000); // Update every minute
    }

    bindFormEvents() {
        document.addEventListener('submit', (e) => {
            if (e.target.matches('#prelaunchOfferForm')) {
                e.preventDefault();
                this.handleOfferSubmission(e.target);
            }
        });
    }

    async handleOfferSubmission(form) {
        const submitBtn = form.querySelector('.offer-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(form);
            
            // Store offer data for payment
            const offerData = {
                email: this.businessInfo.email,
                businessName: this.businessInfo.businessName,
                productList: formData.get('productList'),
                storeTagline: formData.get('storeTagline'),
                offerType: 'pre_launch_advertising'
            };
            
            localStorage.setItem('pendingOfferData', JSON.stringify(offerData));
            
            // Redirect to PayNow for payment
            this.redirectToPayNow(offerData);
            
        } catch (error) {
            this.showError(form, 'Submission failed. Please try again.');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    redirectToPayNow(offerData) {
        const paymentData = {
            amount: 3.99,
            reference: `PRELAUNCH_${Date.now()}`,
            additionalinfo: `Pre-Launch Advertising - ${offerData.businessName}`,
            returnurl: `${window.location.origin}/offer-success.html`,
            resulturl: `${window.location.origin}/payment-result.html`,
            authemail: offerData.email,
            type: 'pre_launch_offer'
        };
        
        localStorage.setItem('paymentData', JSON.stringify(paymentData));
        window.location.href = 'payment.html';
    }

    showError(form, message) {
        const errorEl = document.createElement('div');
        errorEl.className = 'form-error';
        errorEl.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        form.insertBefore(errorEl, form.firstChild);
        
        setTimeout(() => errorEl.remove(), 5000);
    }

    addCustomCSS() {
        const css = `
            .offer-hero-section {
                padding: 4rem 0;
                background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 237, 78, 0.05));
                text-align: center;
            }

            .exclusive-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                background: linear-gradient(135deg, #ffd700, #ffed4e);
                color: #1a1a1a;
                padding: 0.75rem 1.5rem;
                border-radius: 25px;
                font-weight: 600;
                margin-bottom: 1.5rem;
                box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
            }

            .hero-title {
                font-size: 3rem;
                font-weight: 700;
                color: var(--text-primary);
                margin-bottom: 1rem;
            }

            .hero-subtitle {
                font-size: 1.2rem;
                color: var(--text-secondary);
                margin-bottom: 2rem;
            }

            .countdown-timer {
                margin-top: 2rem;
            }

            .timer-label {
                color: var(--text-secondary);
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }

            .timer-display {
                display: flex;
                justify-content: center;
                gap: 1rem;
            }

            .timer-unit {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 215, 0, 0.3);
                border-radius: 12px;
                padding: 1rem;
                min-width: 80px;
                backdrop-filter: blur(10px);
            }

            .timer-number {
                display: block;
                font-size: 2rem;
                font-weight: 700;
                color: #ffd700;
            }

            .timer-text {
                font-size: 0.9rem;
                color: var(--text-secondary);
            }

            .offer-details-section {
                padding: 4rem 0;
            }

            .offer-card {
                max-width: 800px;
                margin: 0 auto;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 3rem;
                backdrop-filter: blur(10px);
            }

            .offer-header {
                text-align: center;
                margin-bottom: 3rem;
                position: relative;
            }

            .offer-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }

            .offer-header h2 {
                color: var(--text-primary);
                margin-bottom: 1.5rem;
                font-size: 2rem;
            }

            .offer-price {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                margin-bottom: 1rem;
            }

            .original-price {
                font-size: 1.5rem;
                color: var(--text-secondary);
                text-decoration: line-through;
            }

            .sale-price {
                font-size: 3rem;
                font-weight: 700;
                color: #ffd700;
            }

            .price-period {
                color: var(--text-secondary);
            }

            .savings-badge {
                display: inline-block;
                background: #ef4444;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-weight: 600;
                font-size: 0.9rem;
            }

            .offer-benefits {
                margin-bottom: 3rem;
            }

            .offer-benefits h3 {
                color: var(--text-primary);
                margin-bottom: 2rem;
                font-size: 1.5rem;
                text-align: center;
            }

            .benefits-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 1.5rem;
            }

            .benefit-item {
                display: flex;
                gap: 1rem;
                padding: 1.5rem;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 215, 0, 0.2);
                border-radius: 12px;
                transition: all 0.3s ease;
            }

            .benefit-item:hover {
                border-color: rgba(255, 215, 0, 0.4);
                transform: translateY(-2px);
            }

            .benefit-item i {
                color: #ffd700;
                font-size: 1.5rem;
                width: 24px;
                flex-shrink: 0;
                margin-top: 0.25rem;
            }

            .benefit-content h4 {
                color: var(--text-primary);
                margin-bottom: 0.5rem;
                font-size: 1.1rem;
            }

            .benefit-content p {
                color: var(--text-secondary);
                font-size: 0.9rem;
                margin: 0;
            }

            .value-proposition {
                background: rgba(255, 215, 0, 0.1);
                border: 1px solid rgba(255, 215, 0, 0.3);
                border-radius: 12px;
                padding: 2rem;
                margin-bottom: 3rem;
            }

            .value-proposition h3 {
                color: var(--text-primary);
                margin-bottom: 1.5rem;
                text-align: center;
            }

            .value-items {
                display: grid;
                gap: 1rem;
            }

            .value-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.75rem 0;
                border-bottom: 1px solid rgba(255, 215, 0, 0.2);
            }

            .value-label {
                color: var(--text-secondary);
            }

            .value-price {
                color: var(--text-primary);
                font-weight: 600;
            }

            .value-total {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 0;
                border-top: 2px solid rgba(255, 215, 0, 0.3);
                margin-top: 1rem;
                font-weight: 600;
            }

            .total-price {
                color: var(--text-secondary);
                text-decoration: line-through;
            }

            .final-price {
                color: #ffd700;
                font-size: 1.2rem;
            }

            .form-group {
                margin-bottom: 1.5rem;
            }

            .form-group label {
                display: block;
                color: var(--text-primary);
                margin-bottom: 0.5rem;
                font-weight: 500;
            }

            .form-group input,
            .form-group textarea {
                width: 100%;
                padding: 1rem;
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.05);
                color: var(--text-primary);
                font-size: 1rem;
                transition: all 0.3s ease;
                font-family: inherit;
            }

            .form-group input:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: var(--accent-primary);
                background: rgba(255, 255, 255, 0.1);
            }

            .form-group input[type="checkbox"] {
                width: auto;
                margin-right: 0.5rem;
            }

            .offer-btn {
                background: linear-gradient(135deg, #ffd700, #ffed4e);
                color: #1a1a1a;
                border: none;
                font-weight: 600;
                font-size: 1.1rem;
                padding: 1.25rem 2rem;
            }

            .offer-btn:hover {
                background: linear-gradient(135deg, #ffed4e, #ffd700);
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
            }

            .guarantee {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                margin-top: 1rem;
                color: var(--text-secondary);
                font-size: 0.9rem;
            }

            .guarantee i {
                color: #10b981;
            }

            .skip-option {
                text-align: center;
                margin-top: 2rem;
                padding-top: 2rem;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .skip-option p {
                color: var(--text-secondary);
                margin-bottom: 0.5rem;
            }

            .skip-link {
                color: var(--accent-primary);
                text-decoration: none;
                font-weight: 500;
            }

            .skip-link:hover {
                text-decoration: underline;
            }

            .demo-section {
                padding: 4rem 0;
                background: rgba(255, 255, 255, 0.02);
            }

            .section-title {
                text-align: center;
                color: var(--text-primary);
                margin-bottom: 3rem;
                font-size: 2rem;
            }

            .demo-store {
                max-width: 600px;
                margin: 0 auto;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 2rem;
                backdrop-filter: blur(10px);
            }

            .store-header {
                display: flex;
                gap: 1rem;
                margin-bottom: 2rem;
                align-items: center;
            }

            .store-logo {
                font-size: 3rem;
            }

            .store-name {
                color: var(--text-primary);
                margin-bottom: 0.5rem;
                font-size: 1.5rem;
            }

            .store-tagline {
                color: var(--text-secondary);
                margin-bottom: 0.5rem;
            }

            .store-location {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: var(--text-secondary);
                font-size: 0.9rem;
            }

            .products-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .product-card.demo {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                padding: 1rem;
                text-align: center;
            }

            .product-image {
                font-size: 2rem;
                margin-bottom: 0.5rem;
            }

            .product-card h4 {
                color: var(--text-primary);
                margin-bottom: 0.25rem;
                font-size: 0.9rem;
            }

            .product-card p {
                color: var(--text-secondary);
                font-size: 0.8rem;
                margin: 0;
            }

            .store-cta {
                text-align: center;
            }

            .form-error {
                background: rgba(239, 68, 68, 0.1);
                border: 1px solid rgba(239, 68, 68, 0.3);
                color: #ef4444;
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            @media (max-width: 768px) {
                .hero-title {
                    font-size: 2rem;
                }
                
                .timer-display {
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }
                
                .timer-unit {
                    min-width: 60px;
                    padding: 0.75rem;
                }
                
                .timer-number {
                    font-size: 1.5rem;
                }
                
                .offer-card {
                    padding: 2rem;
                }
                
                .benefits-grid {
                    grid-template-columns: 1fr;
                }
                
                .offer-price {
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .sale-price {
                    font-size: 2rem;
                }
            }
        `;

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BusinessPreLaunchOffer();
});
