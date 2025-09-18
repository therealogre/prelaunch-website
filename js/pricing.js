// Pricing page specific functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
    });

    // Pricing toggle functionality
    const pricingToggle = document.getElementById('pricingToggle');
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const yearlyPrices = document.querySelectorAll('.yearly-price');
    const monthlyPeriods = document.querySelectorAll('.monthly-period');
    const yearlyPeriods = document.querySelectorAll('.yearly-period');

    if (pricingToggle) {
        pricingToggle.addEventListener('change', () => {
            const isYearly = pricingToggle.checked;
            
            monthlyPrices.forEach(price => {
                price.style.display = isYearly ? 'none' : 'inline';
            });
            
            yearlyPrices.forEach(price => {
                price.style.display = isYearly ? 'inline' : 'none';
            });
            
            monthlyPeriods.forEach(period => {
                period.style.display = isYearly ? 'none' : 'inline';
            });
            
            yearlyPeriods.forEach(period => {
                period.style.display = isYearly ? 'inline' : 'none';
            });
        });
    }

    // FAQ functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                    otherItem.querySelector('.faq-question i').style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current item
            if (isOpen) {
                item.classList.remove('active');
                answer.style.maxHeight = '0';
                icon.style.transform = 'rotate(0deg)';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add pricing page specific styles
const pricingStyles = `
    .pricing-hero {
        padding: 120px 0 80px;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(10, 10, 10, 1) 100%);
        text-align: center;
    }

    .pricing-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        margin-top: 40px;
    }

    .toggle-switch {
        position: relative;
        width: 60px;
        height: 30px;
    }

    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--card-bg);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 30px;
        transition: 0.3s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 22px;
        width: 22px;
        left: 4px;
        bottom: 3px;
        background: var(--primary-gradient);
        border-radius: 50%;
        transition: 0.3s;
    }

    input:checked + .slider {
        background: var(--accent-primary);
    }

    input:checked + .slider:before {
        transform: translateX(26px);
    }

    .save-badge {
        background: var(--gold-gradient);
        color: var(--primary-bg);
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: var(--font-weight-bold);
        margin-left: 8px;
    }

    .pricing-section {
        padding: 80px 0;
    }

    .pricing-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 30px;
        margin-top: 60px;
    }

    .pricing-card {
        background: var(--card-bg);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--border-radius-large);
        padding: 40px 30px;
        position: relative;
        transition: all 0.3s ease;
    }

    .pricing-card:hover {
        transform: translateY(-10px);
        box-shadow: var(--shadow-large);
    }

    .pricing-card.featured {
        border: 2px solid var(--accent-primary);
        transform: scale(1.05);
    }

    .popular-badge {
        position: absolute;
        top: -15px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-gradient);
        color: var(--text-primary);
        padding: 8px 20px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: var(--font-weight-bold);
    }

    .plan-header {
        text-align: center;
        margin-bottom: 30px;
    }

    .plan-name {
        font-size: 1.5rem;
        font-weight: var(--font-weight-bold);
        margin-bottom: 10px;
    }

    .plan-description {
        color: var(--text-secondary);
        margin-bottom: 20px;
    }

    .plan-price {
        display: flex;
        align-items: baseline;
        justify-content: center;
        margin-bottom: 10px;
    }

    .currency {
        font-size: 1.5rem;
        font-weight: var(--font-weight-bold);
    }

    .amount {
        font-size: 3rem;
        font-weight: var(--font-weight-black);
        background: var(--primary-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .period {
        font-size: 1rem;
        color: var(--text-secondary);
        margin-left: 5px;
    }

    .plan-note {
        color: var(--text-muted);
        font-size: 14px;
    }

    .plan-features {
        margin: 30px 0;
    }

    .feature-item {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 15px;
        padding: 10px;
        border-radius: var(--border-radius);
        transition: background-color 0.3s ease;
    }

    .feature-item:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    .feature-item i {
        color: var(--accent-green);
        font-size: 16px;
        min-width: 16px;
    }

    .early-adopter-benefits {
        padding: 80px 0;
        background: var(--secondary-bg);
    }

    .benefits-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        margin: 40px 0;
    }

    .benefit-card {
        background: var(--card-bg);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--border-radius-large);
        padding: 30px;
        text-align: center;
        transition: all 0.3s ease;
    }

    .benefit-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-medium);
    }

    .benefit-icon {
        width: 60px;
        height: 60px;
        background: var(--gold-gradient);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        font-size: 24px;
        color: var(--primary-bg);
    }

    .benefit-value {
        background: var(--primary-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: var(--font-weight-bold);
        font-size: 1.2rem;
        margin-top: 15px;
    }

    .faq-section {
        padding: 80px 0;
    }

    .faq-grid {
        max-width: 800px;
        margin: 0 auto;
    }

    .faq-item {
        background: var(--card-bg);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--border-radius);
        margin-bottom: 20px;
        overflow: hidden;
        transition: all 0.3s ease;
    }

    .faq-question {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 25px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .faq-question:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    .faq-question h4 {
        font-weight: var(--font-weight-semibold);
        margin: 0;
    }

    .faq-question i {
        transition: transform 0.3s ease;
        color: var(--accent-primary);
    }

    .faq-answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
    }

    .faq-answer p {
        padding: 0 25px 25px;
        margin: 0;
        color: var(--text-secondary);
        line-height: 1.6;
    }

    @media (max-width: 768px) {
        .pricing-grid {
            grid-template-columns: 1fr;
        }
        
        .pricing-card.featured {
            transform: none;
        }
        
        .benefits-grid {
            grid-template-columns: 1fr;
        }
    }
`;

// Inject pricing styles
const styleSheet = document.createElement('style');
styleSheet.textContent = pricingStyles;
document.head.appendChild(styleSheet);
