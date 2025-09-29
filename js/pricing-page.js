import { BUSINESS_TIERS } from './config/membership-tiers.js';

document.addEventListener('DOMContentLoaded', () => {
    const pricingContainer = document.getElementById('pricing-table-container');
    const faqContainer = document.querySelector('.faq-grid');

    if (pricingContainer) {
        renderPricingTiers(pricingContainer);
    }

    if (faqContainer) {
        renderFAQs(faqContainer);
        setupFAQAccordion();
    }
});

function renderPricingTiers(container) {
    Object.values(BUSINESS_TIERS).forEach(tier => {
        const card = document.createElement('div');
        card.className = `pricing-card ${tier.popular ? 'popular' : ''}`;

        let priceHTML;
        if (typeof tier.price === 'number') {
            priceHTML = `
                <span class="currency">$</span>
                <span class="amount">${tier.price}</span>
                <span class="billing">/ ${tier.billing}</span>
            `;
        } else {
            priceHTML = `<span class="amount">${tier.price}</span>`;
        }

        card.innerHTML = `
            ${tier.popular ? '<div class="popular-badge">Most Popular</div>' : ''}
            <div class="pricing-card-header">
                <h3>${tier.name}</h3>
                <p class="description">${tier.description}</p>
                <div class="price-display">
                    ${priceHTML}
                </div>
            </div>
            <ul class="features-list">
                ${tier.features.map(feature => `<li><i class="fas fa-check-circle"></i>${feature}</li>`).join('')}
            </ul>
            <a href="business-register.html?plan=${tier.id}" class="btn ${tier.popular ? 'btn-primary' : 'btn-outline'}">${tier.cta}</a>
        `;
        container.appendChild(card);
    });
}

function renderFAQs(container) {
    const faqs = [
        {
            question: 'Can I change my plan later?',
            answer: 'Yes, you can upgrade or downgrade your plan at any time from your business dashboard. Changes will be pro-rated.'
        },
        {
            question: 'Is there a free trial for paid plans?',
            answer: 'We offer a 30-day money-back guarantee on all our paid plans. If you\'re not satisfied, you can request a full refund within the first 30 days.'
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept a wide range of local and international payment methods, including EcoCash, OneMoney, ZimSwitch, Visa, and Mastercard.'
        },
        {
            question: 'Do I need to sign a long-term contract?',
            answer: 'No, all our plans are billed month-to-month, and you can cancel at any time without any penalty.'
        },
        {
            question: 'What kind of support do you offer?',
            answer: 'We offer email support for all plans. Our Growth and Pro plans include priority support, with dedicated account managers for our Pro members.'
        }
    ];

    faqs.forEach(faq => {
        const item = document.createElement('div');
        item.className = 'faq-item';
        item.innerHTML = `
            <div class="faq-question">
                <span>${faq.question}</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="faq-answer">
                <p>${faq.answer}</p>
            </div>
        `;
        container.appendChild(item);
    });
}

function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const currentlyActive = document.querySelector('.faq-item.active');
            if (currentlyActive && currentlyActive !== item) {
                currentlyActive.classList.remove('active');
            }
            item.classList.toggle('active');
        });
    });
}
