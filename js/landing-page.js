class LandingPage {
    constructor() {
        this.content = null;
    }

    async init() {
        try {
            // Load content from the content file
            await this.loadContent();
            
            // Update the DOM with dynamic content
            this.updateHeroSection();
            this.updateStorySection();
            this.updateMissionSection();
            this.updateHowItWorks();
            this.updatePricingSection();
            this.updateTestimonials();
            this.updateCTASection();
            
            // Add any event listeners
            this.addEventListeners();
        } catch (error) {
            console.error('Error initializing landing page:', error);
        }
    }

    async loadContent() {
        // In a real app, you would fetch this from an API or content management system
        this.content = landingContent;
    }

    updateHeroSection() {
        const hero = this.content.hero;
        const heroSection = document.querySelector('.hero');
        
        if (heroSection) {
            // Set background image if available
            if (hero.backgroundImage) {
                heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${hero.backgroundImage}')`;
                heroSection.style.backgroundSize = 'cover';
                heroSection.style.backgroundPosition = 'center';
                heroSection.style.color = '#fff';
            }
            
            const heroTitle = heroSection.querySelector('.hero-title');
            const heroSubtitle = heroSection.querySelector('.hero-subtitle');
            const heroStats = heroSection.querySelector('.hero-stats');
            const heroCta = heroSection.querySelector('.hero-cta');

            if (heroTitle) heroTitle.innerHTML = hero.title;
            if (heroSubtitle) heroSubtitle.textContent = hero.subtitle;
            
            // Update stats
            if (heroStats) {
                heroStats.innerHTML = hero.stats.map(stat => `
                    <div class="stat">
                        <div class="stat-number">${stat.number}</div>
                        <div class="stat-label">${stat.label}</div>
                    </div>
                `).join('');
            }
            
            // Update CTA buttons
            if (heroCta && hero.cta) {
                heroCta.innerHTML = hero.cta.map(button => `
                    <a href="${button.url}" class="btn btn-${button.variant} btn-large">
                        ${button.text}
                    </a>
                `).join('');
            }
        }
    }

    updateStorySection() {
        const story = this.content.story;
        const storySection = document.getElementById('our-story');
        
        if (storySection) {
            storySection.innerHTML = `
                <div class="container">
                    <div class="section-header text-center">
                        <span class="eyebrow">Our Journey</span>
                        <h2>${story.title}</h2>
                    </div>
                    <div class="story-content">
                        <div class="story-text">
                            ${story.content.split('\n    ').map(paragraph => `<p>${paragraph}</p>`).join('')}
                        </div>
                        ${story.image ? `<div class="story-image"><img src="${story.image}" alt="${story.title}"></div>` : ''}
                    </div>
                </div>
            `;
        }
    }

    updateMissionSection() {
        const missionSection = document.getElementById('mission-vision');
        const mission = this.content.mission;
        
        if (missionSection) {
            missionSection.innerHTML = `
                <div class="container">
                    <div class="section-header text-center">
                        <h2>${mission.title}</h2>
                    </div>
                    <div class="mission-grid">
                        ${mission.items.map(item => `
                            <div class="mission-card">
                                <div class="mission-icon">
                                    <i class="${item.icon}"></i>
                                </div>
                                <h3>${item.title}</h3>
                                <p>${item.content}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }

    updateHowItWorks() {
        const howItWorks = this.content.howItWorks;
        const howSection = document.getElementById('how-it-works');
        
        if (howSection) {
            howSection.innerHTML = `
                <div class="container">
                    <div class="section-header text-center">
                        <h2>${howItWorks.title}</h2>
                    </div>
                    <div class="steps-container">
                        ${howItWorks.steps.map(step => `
                            <div class="step">
                                <div class="step-number">${step.number}</div>
                                <h3>${step.title}</h3>
                                <p>${step.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }

    updatePricingSection() {
        const pricing = this.content.businessPricing;
        if (!pricing) return;
        
        const pricingSection = document.createElement('section');
        pricingSection.id = 'pricing';
        pricingSection.className = 'section pricing-section';
        
        pricingSection.innerHTML = `
            <div class="container">
                <div class="section-header text-center">
                    <h2>${pricing.title}</h2>
                    ${pricing.description ? `<p class="section-subtitle">${pricing.description}</p>` : ''}
                </div>
                <div class="pricing-grid">
                    ${pricing.plans.map(plan => `
                        <div class="pricing-card ${plan.popular ? 'popular' : ''}">
                            ${plan.popular ? '<div class="popular-badge">Most Popular</div>' : ''}
                            <h3>${plan.name}</h3>
                            <div class="price">
                                <span class="amount">${plan.price}</span>
                                <span class="period">${plan.period}</span>
                            </div>
                            <p class="plan-description">${plan.description}</p>
                            <ul class="features">
                                ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                            <a href="${plan.cta.url}" class="btn btn-${plan.cta.variant} btn-block">
                                ${plan.cta.text}
                            </a>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Insert the pricing section before the CTA section
        const ctaSection = document.getElementById('cta-section');
        if (ctaSection && ctaSection.parentNode) {
            ctaSection.parentNode.insertBefore(pricingSection, ctaSection);
        }
    }
    
    updateTestimonials() {
        const testimonials = this.content.testimonials;
        const testimonialsSection = document.getElementById('testimonials');
        
        if (testimonialsSection) {
            testimonialsSection.innerHTML = `
                <div class="container">
                    <div class="section-header text-center">
                        <h2>${testimonials.title}</h2>
                        ${testimonials.subtitle ? `<p class="section-subtitle">${testimonials.subtitle}</p>` : ''}
                    </div>
                    <div class="testimonials-grid">
                        ${testimonials.items.map(testimonial => `
                            <div class="testimonial-card">
                                <div class="testimonial-content">
                                    <p>"${testimonial.quote}"</p>
                                </div>
                                ${testimonial.author ? `
                                    <div class="testimonial-author">
                                        <img src="${testimonial.image}" alt="${testimonial.author}" onerror="this.src='./assets/images/avatar-placeholder.png'">
                                        <div>
                                            <h4>${testimonial.author}</h4>
                                            ${testimonial.role ? `<span class="role">${testimonial.role}</span>` : ''}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }

    updateCTASection() {
        const cta = this.content.cta;
        const ctaSection = document.getElementById('cta-section');
        
        if (ctaSection && cta) {
            // Set background image if available
            if (cta.backgroundImage) {
                ctaSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${cta.backgroundImage}')`;
                ctaSection.style.backgroundSize = 'cover';
                ctaSection.style.backgroundPosition = 'center';
                ctaSection.style.color = '#fff';
            }
            
            ctaSection.innerHTML = `
                <div class="container">
                    <div class="cta-content text-center">
                        <h2>${cta.title}</h2>
                        ${cta.subtitle ? `<p>${cta.subtitle}</p>` : ''}
                        <div class="cta-buttons">
                            ${cta.buttons.map(button => `
                                <a href="${button.url}" class="btn btn-${button.variant} btn-large">
                                    ${button.text}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }
    }

    addEventListeners() {
        // Add any event listeners for interactive elements
        // For example, smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Initialize the landing page when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const landingPage = new LandingPage();
    landingPage.init();
});
