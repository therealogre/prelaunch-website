// Premium Success Page Logic
class PremiumSuccess {
    constructor() {
        this.accessKey = '5c0b9311-f7eb-4a05-b1bd-c690b73f463d';
        this.init();
    }

    init() {
        this.processPaymentSuccess();
        this.addAnimations();
        this.addCustomCSS();
    }

    async processPaymentSuccess() {
        try {
            // Get pending registration data
            const pendingData = localStorage.getItem('pendingPremiumRegistration');
            if (pendingData) {
                const registrationData = JSON.parse(pendingData);
                
                // Submit the premium registration
                await this.submitPremiumRegistration(registrationData);
                
                // Send welcome email
                await this.sendWelcomeEmail(registrationData);
                
                // Clear pending data
                localStorage.removeItem('pendingPremiumRegistration');
                localStorage.removeItem('paymentData');
            }
        } catch (error) {
            console.error('Error processing premium registration:', error);
        }
    }

    async submitPremiumRegistration(data) {
        const registrationData = {
            access_key: this.accessKey,
            subject: 'New Premium Customer Registration - Helensvale Connect',
            name: data.name,
            phone: data.phone,
            email: data.email,
            city: data.city,
            suburb: data.suburb,
            registration_type: 'premium_customer',
            payment_status: 'completed',
            timestamp: new Date().toISOString()
        };

        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registrationData)
        });

        if (!response.ok) throw new Error('Registration submission failed');
        return response.json();
    }

    async sendWelcomeEmail(data) {
        const emailData = {
            access_key: this.accessKey,
            subject: 'Welcome to Helensvale Connect Premium! 👑',
            from_name: 'Helensvale Connect Team',
            to: data.email,
            message: `
Dear ${data.name},

🎉 Welcome to Helensvale Connect Premium!

Your premium registration is now complete. Here's what happens next:

🌟 YOUR PREMIUM BENEFITS:
• Personal notifications from your favorite stores
• Exclusive discounts for regular payments
• Loyal Customer badge with priority treatment
• Price suggestions when items are too expensive
• Anonymous feedback to stores about pricing
• Personalized store and product recommendations

📱 ACCOUNT CREATION:
Click the link below to create your account and set your preferences:
${window.location.origin}/account-creation.html?token=${btoa(data.email + '_' + Date.now())}

🚀 LAUNCH ACCESS:
You'll get priority access when we launch in 21 days. We'll send you login instructions 24 hours before launch.

💡 PERSONALIZATION:
After creating your account, we'll start learning your preferences to suggest stores and products tailored just for you.

Questions? Reply to this email or contact us at support@helensvaleconnect.com

Welcome to the future of shopping in Zimbabwe!

Best regards,
The Helensvale Connect Team
            `
        };

        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) throw new Error('Welcome email failed');
        return response.json();
    }

    addAnimations() {
        // Crown animation
        const crown = document.querySelector('.crown-icon');
        if (crown) {
            crown.style.animation = 'bounce 2s ease-in-out infinite';
        }

        // Particle animation
        const particlesContainer = document.querySelector('.success-particles');
        if (particlesContainer) {
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 3 + 's';
                particlesContainer.appendChild(particle);
            }
        }

        // Stagger benefit items animation
        const benefitItems = document.querySelectorAll('.benefit-item');
        benefitItems.forEach((item, index) => {
            item.style.animationDelay = (index * 0.1) + 's';
            item.classList.add('fade-in-up');
        });
    }

    addCustomCSS() {
        const css = `
            .success-section {
                min-height: 100vh;
                display: flex;
                align-items: center;
                background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 237, 78, 0.05));
                padding: 2rem 0;
            }

            .success-content {
                text-align: center;
                max-width: 800px;
                margin: 0 auto;
            }

            .success-animation {
                position: relative;
                margin-bottom: 2rem;
            }

            .crown-icon {
                font-size: 5rem;
                margin-bottom: 1rem;
                display: inline-block;
            }

            .success-particles {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
            }

            .particle {
                position: absolute;
                width: 4px;
                height: 4px;
                background: #ffd700;
                border-radius: 50%;
                animation: float 3s ease-in-out infinite;
            }

            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 1; }
                50% { transform: translateY(-20px) rotate(180deg); opacity: 0.7; }
            }

            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }

            .success-title {
                font-size: 3rem;
                font-weight: 700;
                margin-bottom: 1rem;
                color: var(--text-primary);
            }

            .success-subtitle {
                font-size: 1.2rem;
                color: var(--text-secondary);
                margin-bottom: 3rem;
            }

            .premium-benefits-showcase {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 215, 0, 0.3);
                border-radius: 20px;
                padding: 2rem;
                margin-bottom: 3rem;
                backdrop-filter: blur(10px);
            }

            .premium-benefits-showcase h3 {
                color: var(--text-primary);
                margin-bottom: 2rem;
                font-size: 1.5rem;
            }

            .benefits-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1rem;
            }

            .benefit-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                border: 1px solid rgba(255, 215, 0, 0.2);
                transition: all 0.3s ease;
            }

            .benefit-item:hover {
                transform: translateY(-2px);
                border-color: rgba(255, 215, 0, 0.4);
                box-shadow: 0 8px 25px rgba(255, 215, 0, 0.2);
            }

            .benefit-item i {
                color: #ffd700;
                font-size: 1.2rem;
                width: 20px;
            }

            .benefit-item span {
                color: var(--text-secondary);
                font-size: 0.9rem;
            }

            .next-steps {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 2rem;
                margin-bottom: 3rem;
                text-align: left;
            }

            .next-steps h3 {
                color: var(--text-primary);
                margin-bottom: 2rem;
                text-align: center;
                font-size: 1.5rem;
            }

            .steps-list {
                display: grid;
                gap: 1.5rem;
            }

            .step {
                display: flex;
                gap: 1rem;
                align-items: flex-start;
            }

            .step-number {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #ffd700, #ffed4e);
                color: #1a1a1a;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                flex-shrink: 0;
            }

            .step-content h4 {
                color: var(--text-primary);
                margin: 0 0 0.5rem 0;
                font-size: 1.1rem;
            }

            .step-content p {
                color: var(--text-secondary);
                margin: 0;
                font-size: 0.9rem;
            }

            .action-buttons {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }

            .action-buttons .btn {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 1rem 2rem;
                text-decoration: none;
                border-radius: 12px;
                font-weight: 600;
                transition: all 0.3s ease;
            }

            .fade-in-up {
                animation: fadeInUp 0.6s ease-out forwards;
                opacity: 0;
                transform: translateY(20px);
            }

            @keyframes fadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @media (max-width: 768px) {
                .success-title {
                    font-size: 2rem;
                }
                
                .benefits-grid {
                    grid-template-columns: 1fr;
                }
                
                .action-buttons {
                    flex-direction: column;
                    align-items: center;
                }
                
                .action-buttons .btn {
                    width: 100%;
                    max-width: 300px;
                    justify-content: center;
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
    new PremiumSuccess();
});
