import { BUSINESS_TIERS } from './config/membership-tiers.js';

document.addEventListener('DOMContentLoaded', () => {
    const pricingContainer = document.getElementById('pricing-grid-container');
    if (!pricingContainer) return;

    Object.values(BUSINESS_TIERS).forEach(tier => {
        const card = document.createElement('div');
        card.className = `pricing-card ${tier.popular ? 'popular' : ''}`;

        let priceHTML;
        if (typeof tier.price === 'number' && tier.price > 0) {
            priceHTML = `<div class="price"><span class="amount">$${tier.price.toFixed(2)}</span><span class="period">/ ${tier.billing}</span></div>`;
        } else if (tier.price === 0) {
            priceHTML = `<div class="price"><span class="amount">Free</span></div>`;
        } else {
            priceHTML = `<div class="price"><span class="amount">${tier.price}</span></div>`;
        }

        card.innerHTML = `
            ${tier.popular ? '<div class="popular-badge">Most Popular</div>' : ''}
            <h3>${tier.name}</h3>
            <p class="plan-description">${tier.description}</p>
            ${priceHTML}
            <ul class="features">
                ${tier.features.map(feature => `<li><i class="fas fa-check"></i>${feature}</li>`).join('')}
            </ul>
            <a href="business-registration-new.html?plan=${tier.id}" class="btn ${tier.popular ? 'btn-primary' : 'btn-outline'} btn-block">${tier.cta}</a>
        `;

        pricingContainer.appendChild(card);
    });
});
