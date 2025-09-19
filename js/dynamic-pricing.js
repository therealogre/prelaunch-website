// Dynamic Pricing System with Psychological Pricing Strategies
class DynamicPricing {
    constructor() {
        this.pricingData = {
            free: {
                monthly: 0,
                annual: 0,
                originalPrice: 29.99,
                savings: 100
            },
            growth: {
                monthly: 49.99,
                annual: 39.99,
                originalPrice: 59.99,
                savings: 10
            },
            pro: {
                monthly: 39.99,
                annual: 29.99,
                originalPrice: 99.99,
                savings: 60
            }
        };
        
        this.init();
        this.setupPsychologicalPricing();
        this.setupDynamicUpdates();
    }

    init() {
        this.setupPricingToggle();
        this.setupCountdownTimer();
        this.setupScarcityIndicators();
        this.setupSocialProof();
    }

    setupPricingToggle() {
        const toggle = document.getElementById('pricingToggle');
        if (!toggle) return;

        toggle.addEventListener('change', (e) => {
            const isAnnual = e.target.checked;
            this.updatePricingDisplay(isAnnual);
            this.updateSavingsDisplay(isAnnual);
            
            // Add animation to price changes
            this.animatePriceChange();
        });
    }

    updatePricingDisplay(isAnnual) {
        Object.keys(this.pricingData).forEach(plan => {
            const monthlyEl = document.querySelector(`.${plan}-card .monthly-price`);
            const annualEl = document.querySelector(`.${plan}-card .annual-price`);
            const monthlyPeriod = document.querySelector(`.${plan}-card .monthly-period`);
            const annualPeriod = document.querySelector(`.${plan}-card .yearly-period`);

            if (monthlyEl && annualEl) {
                if (isAnnual) {
                    monthlyEl.style.display = 'none';
                    annualEl.style.display = 'inline';
                    if (monthlyPeriod) monthlyPeriod.style.display = 'none';
                    if (annualPeriod) annualPeriod.style.display = 'inline';
                } else {
                    monthlyEl.style.display = 'inline';
                    annualEl.style.display = 'none';
                    if (monthlyPeriod) monthlyPeriod.style.display = 'inline';
                    if (annualPeriod) annualPeriod.style.display = 'none';
                }
            }
        });
    }

    updateSavingsDisplay(isAnnual) {
        const savingsElements = document.querySelectorAll('.savings');
        savingsElements.forEach(el => {
            if (isAnnual) {
                el.textContent = 'Save 25% annually!';
                el.classList.add('highlight-savings');
            } else {
                const originalText = el.getAttribute('data-original') || el.textContent;
                el.textContent = originalText;
                el.classList.remove('highlight-savings');
            }
        });
    }

    animatePriceChange() {
        const priceElements = document.querySelectorAll('.amount');
        priceElements.forEach(el => {
            el.classList.add('price-update-animation');
            setTimeout(() => {
                el.classList.remove('price-update-animation');
            }, 600);
        });
    }

    setupCountdownTimer() {
        // Create urgency with limited-time offers
        const countdownElements = document.querySelectorAll('.countdown-timer');
        if (countdownElements.length === 0) {
            this.createCountdownTimer();
        }

        this.startCountdown();
    }

    createCountdownTimer() {
        const proCard = document.querySelector('.pro-card');
        if (!proCard) return;

        const timerHTML = `
            <div class="urgency-timer">
                <div class="timer-label">⚡ Limited Time Offer Ends In:</div>
                <div class="countdown-display">
                    <span class="time-unit">
                        <span class="time-number" id="hours">23</span>
                        <span class="time-label">Hours</span>
                    </span>
                    <span class="time-separator">:</span>
                    <span class="time-unit">
                        <span class="time-number" id="minutes">59</span>
                        <span class="time-label">Minutes</span>
                    </span>
                    <span class="time-separator">:</span>
                    <span class="time-unit">
                        <span class="time-number" id="seconds">59</span>
                        <span class="time-label">Seconds</span>
                    </span>
                </div>
            </div>
        `;

        const planHeader = proCard.querySelector('.plan-header');
        if (planHeader) {
            planHeader.insertAdjacentHTML('afterend', timerHTML);
        }
    }

    startCountdown() {
        // Set countdown to 24 hours from now
        const endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        
        const updateTimer = () => {
            const now = new Date().getTime();
            const timeLeft = endTime - now;

            if (timeLeft > 0) {
                const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

                const hoursEl = document.getElementById('hours');
                const minutesEl = document.getElementById('minutes');
                const secondsEl = document.getElementById('seconds');

                if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
                if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
                if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
            }
        };

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    setupScarcityIndicators() {
        // Add scarcity messaging to create urgency
        const scarcityMessages = [
            "🔥 Only 47 spots left at this price!",
            "⚡ 127 businesses joined in the last 24 hours",
            "🎯 Limited to first 500 early adopters",
            "💎 Exclusive pre-launch pricing"
        ];

        const cards = document.querySelectorAll('.pricing-card');
        cards.forEach((card, index) => {
            if (index === 1) { // Growth plan (decoy)
                this.addScarcityMessage(card, "⏰ Price increases to $59.99 soon");
            } else if (index === 2) { // Pro plan
                this.addScarcityMessage(card, scarcityMessages[0]);
            }
        });
    }

    addScarcityMessage(card, message) {
        const scarcityEl = document.createElement('div');
        scarcityEl.className = 'scarcity-message animate-pulse';
        scarcityEl.innerHTML = `<span>${message}</span>`;
        
        const planHeader = card.querySelector('.plan-header');
        if (planHeader) {
            planHeader.appendChild(scarcityEl);
        }
    }

    setupSocialProof() {
        // Add social proof elements
        const socialProofData = [
            { count: "2,547", action: "businesses signed up" },
            { count: "15,000+", action: "customers waiting" },
            { count: "98%", action: "satisfaction rate" }
        ];

        this.createSocialProofSection(socialProofData);
        this.setupLiveActivityFeed();
    }

    createSocialProofSection(data) {
        const pricingSection = document.querySelector('.pricing-section');
        if (!pricingSection) return;

        const socialProofHTML = `
            <div class="social-proof-section" data-aos="fade-up">
                <div class="social-proof-header">
                    <h3>Join Zimbabwe's Fastest Growing Marketplace</h3>
                    <p>Trusted by thousands of businesses across the country</p>
                </div>
                <div class="social-proof-stats">
                    ${data.map(stat => `
                        <div class="stat-item">
                            <div class="stat-number">${stat.count}</div>
                            <div class="stat-label">${stat.action}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        pricingSection.insertAdjacentHTML('afterend', socialProofHTML);
    }

    setupLiveActivityFeed() {
        // Create live activity notifications
        const activities = [
            "Sarah from Harare just upgraded to Pro",
            "TechHub Bulawayo joined 2 minutes ago",
            "Mike's Electronics started their free trial",
            "Zim Fashion Co. upgraded to Growth plan",
            "Local Grocery Store joined from Mutare"
        ];

        let activityIndex = 0;
        
        const showActivity = () => {
            const activity = activities[activityIndex % activities.length];
            this.showActivityNotification(activity);
            activityIndex++;
        };

        // Show first activity after 3 seconds, then every 15 seconds
        setTimeout(showActivity, 3000);
        setInterval(showActivity, 15000);
    }

    showActivityNotification(message) {
        // Remove existing notification
        const existing = document.querySelector('.activity-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'activity-notification animate-slide-in-right';
        notification.innerHTML = `
            <div class="activity-content">
                <div class="activity-icon">👤</div>
                <div class="activity-message">${message}</div>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('animate-slide-out-right');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    setupPsychologicalPricing() {
        // Implement anchoring effect
        this.setupPriceAnchoring();
        
        // Implement decoy pricing
        this.setupDecoyPricing();
        
        // Implement charm pricing
        this.setupCharmPricing();
        
        // Implement bundle pricing perception
        this.setupBundlePerception();
    }

    setupPriceAnchoring() {
        // Show original higher prices to anchor expectations
        const originalPrices = document.querySelectorAll('.original-price');
        originalPrices.forEach(el => {
            el.style.textDecoration = 'line-through';
            el.style.opacity = '0.7';
            el.style.fontSize = '0.9em';
        });
    }

    setupDecoyPricing() {
        // Make Growth plan less attractive to push users toward Pro
        const growthCard = document.querySelector('.decoy-card');
        if (growthCard) {
            growthCard.style.transform = 'scale(0.95)';
            growthCard.style.opacity = '0.9';
        }
    }

    setupCharmPricing() {
        // Ensure all prices end in .99 for psychological impact
        const priceElements = document.querySelectorAll('.amount');
        priceElements.forEach(el => {
            const price = el.textContent;
            if (price !== '0' && !price.includes('.99')) {
                // Already implemented in HTML
            }
        });
    }

    setupBundlePerception() {
        // Highlight value proposition of higher tiers
        const proCard = document.querySelector('.pro-card');
        if (proCard) {
            const valueProps = [
                "🎁 Includes $200 worth of marketing credits",
                "💰 Save $720 annually vs monthly billing",
                "🚀 2x faster customer acquisition"
            ];

            const valueSection = document.createElement('div');
            valueSection.className = 'value-propositions';
            valueSection.innerHTML = valueProps.map(prop => 
                `<div class="value-prop">${prop}</div>`
            ).join('');

            const features = proCard.querySelector('.plan-features');
            if (features) {
                features.appendChild(valueSection);
            }
        }
    }

    setupDynamicUpdates() {
        // Update pricing based on user behavior
        this.trackUserEngagement();
        this.setupPersonalizedOffers();
    }

    trackUserEngagement() {
        let scrollDepth = 0;
        let timeOnPage = Date.now();
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            scrollDepth = Math.max(scrollDepth, (currentScroll / maxScroll) * 100);
            
            // Show special offer if user scrolls past pricing
            if (scrollDepth > 70 && !localStorage.getItem('specialOfferShown')) {
                setTimeout(() => this.showSpecialOffer(), 2000);
                localStorage.setItem('specialOfferShown', 'true');
            }
        });
    }

    showSpecialOffer() {
        const modal = document.createElement('div');
        modal.className = 'special-offer-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content animate-scale-in">
                <button class="modal-close">&times;</button>
                <div class="offer-content">
                    <h3>🎉 Wait! Special Offer Just For You</h3>
                    <p>Since you're seriously considering joining us...</p>
                    <div class="special-price">
                        <span class="old-price">$39.99</span>
                        <span class="new-price">$19.99</span>
                        <span class="discount">50% OFF</span>
                    </div>
                    <p class="offer-details">First month only - then $39.99/month</p>
                    <button class="claim-offer-btn">Claim This Offer</button>
                    <p class="offer-expires">⏰ Offer expires in 10 minutes</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        const backdrop = modal.querySelector('.modal-backdrop');
        
        [closeBtn, backdrop].forEach(el => {
            el.addEventListener('click', () => {
                modal.classList.add('animate-fade-out');
                setTimeout(() => modal.remove(), 300);
            });
        });

        // Claim offer functionality
        const claimBtn = modal.querySelector('.claim-offer-btn');
        claimBtn.addEventListener('click', () => {
            window.location.href = 'index.html#early-access';
        });
    }

    setupPersonalizedOffers() {
        // Show different offers based on user behavior
        const visitCount = parseInt(localStorage.getItem('visitCount') || '0') + 1;
        localStorage.setItem('visitCount', visitCount.toString());

        if (visitCount === 2) {
            // Second visit - show urgency
            this.addUrgencyMessage("You're back! Don't miss out on early bird pricing 🐦");
        } else if (visitCount >= 3) {
            // Multiple visits - show loyalty discount
            this.addLoyaltyDiscount();
        }
    }

    addUrgencyMessage(message) {
        const heroSection = document.querySelector('.pricing-hero-content');
        if (heroSection) {
            const urgencyEl = document.createElement('div');
            urgencyEl.className = 'urgency-message animate-bounce';
            urgencyEl.innerHTML = `<span>${message}</span>`;
            heroSection.appendChild(urgencyEl);
        }
    }

    addLoyaltyDiscount() {
        const proCard = document.querySelector('.pro-card');
        if (proCard) {
            const loyaltyBadge = document.createElement('div');
            loyaltyBadge.className = 'loyalty-badge';
            loyaltyBadge.innerHTML = '🎖️ Loyal Visitor Bonus: Extra 10% OFF';
            
            const planHeader = proCard.querySelector('.plan-header');
            if (planHeader) {
                planHeader.appendChild(loyaltyBadge);
            }
        }
    }
}

// Initialize dynamic pricing when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dynamicPricing = new DynamicPricing();
});

// Add CSS for dynamic pricing features
const pricingCSS = `
.market-comparison {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin: 2rem 0;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.comparison-item {
    text-align: center;
}

.comparison-item .competitor {
    display: block;
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
}

.comparison-item .rate {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-primary);
}

.comparison-item.highlight .rate {
    color: var(--accent-primary);
    font-size: 1.4rem;
}

.vs-divider {
    background: var(--accent-primary);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.9rem;
}

.price-comparison {
    margin-top: 0.5rem;
    text-align: center;
}

.original-price {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-right: 0.5rem;
}

.savings {
    color: #10b981;
    font-weight: 600;
    font-size: 0.9rem;
}

.highlight-savings {
    background: #10b981;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    animation: pulse 2s infinite;
}

.price-update-animation {
    animation: priceUpdate 0.6s ease-in-out;
}

@keyframes priceUpdate {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); color: var(--accent-primary); }
}

.urgency-timer {
    background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
    color: white;
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
    text-align: center;
}

.timer-label {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    opacity: 0.9;
}

.countdown-display {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
}

.time-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.time-number {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
}

.time-label {
    font-size: 0.7rem;
    opacity: 0.8;
}

.time-separator {
    font-size: 1.2rem;
    font-weight: 600;
}

.scarcity-message {
    background: rgba(255, 107, 107, 0.1);
    border: 1px solid rgba(255, 107, 107, 0.3);
    color: #ff6b6b;
    padding: 0.5rem;
    border-radius: 6px;
    font-size: 0.85rem;
    margin-top: 0.5rem;
    text-align: center;
}

.social-proof-section {
    text-align: center;
    padding: 3rem 0;
    background: rgba(255, 255, 255, 0.02);
    margin: 2rem 0;
    border-radius: 12px;
}

.social-proof-stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 2rem;
}

.stat-item {
    text-align: center;
}

.stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent-primary);
    display: block;
}

.stat-label {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-top: 0.25rem;
}

.activity-notification {
    position: fixed;
    top: 100px;
    right: 20px;
    background: var(--card-bg);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    max-width: 300px;
}

.activity-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.activity-icon {
    font-size: 1.2rem;
}

.activity-message {
    font-size: 0.9rem;
    color: var(--text-primary);
}

.value-propositions {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.value-prop {
    font-size: 0.85rem;
    color: var(--accent-primary);
    margin: 0.25rem 0;
    font-weight: 500;
}

.special-offer-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
}

.modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
}

.modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--card-bg);
    border-radius: 12px;
    padding: 2rem;
    max-width: 400px;
    width: 90%;
    text-align: center;
}

.modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-secondary);
    cursor: pointer;
}

.special-price {
    margin: 1.5rem 0;
}

.old-price {
    text-decoration: line-through;
    color: var(--text-secondary);
    margin-right: 1rem;
}

.new-price {
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent-primary);
    margin-right: 1rem;
}

.discount {
    background: #10b981;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
}

.claim-offer-btn {
    background: var(--accent-primary);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    margin: 1rem 0;
    transition: all 0.3s ease;
}

.claim-offer-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);
}

.offer-expires {
    color: #ff6b6b;
    font-size: 0.85rem;
    font-weight: 500;
}

.urgency-message {
    background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
    color: white;
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
    text-align: center;
    font-weight: 500;
}

.loyalty-badge {
    background: linear-gradient(135deg, #ffd700, #ffed4e);
    color: #1a1a1a;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    margin-top: 0.5rem;
    display: inline-block;
}

.decoy-card {
    position: relative;
    opacity: 0.9;
    transform: scale(0.98);
}

.starter-card, .pro-card {
    transform: scale(1.02);
    box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
}

.guarantee {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-top: 0.5rem;
    font-style: italic;
}

@media (max-width: 768px) {
    .market-comparison {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .social-proof-stats {
        flex-direction: column;
        gap: 1rem;
    }
    
    .countdown-display {
        flex-wrap: wrap;
        gap: 0.25rem;
    }
}
`;

// Inject pricing CSS
const pricingStyle = document.createElement('style');
pricingStyle.textContent = pricingCSS;
document.head.appendChild(pricingStyle);
