// Pre-Launch Offer Success Page Logic
class OfferSuccess {
    constructor() {
        this.accessKey = '5c0b9311-f7eb-4a05-b1bd-c690b73f463d';
        this.init();
    }

    init() {
        this.processOfferSuccess();
        this.addAnimations();
        this.addCustomCSS();
    }

    async processOfferSuccess() {
        try {
            // Get pending offer data
            const pendingData = localStorage.getItem('pendingOfferData');
            if (pendingData) {
                const offerData = JSON.parse(pendingData);
                
                // Submit the offer registration
                await this.submitOfferRegistration(offerData);
                
                // Send setup email
                await this.sendSetupEmail(offerData);
                
                // Clear pending data
                localStorage.removeItem('pendingOfferData');
                localStorage.removeItem('paymentData');
            }
        } catch (error) {
            console.error('Error processing offer success:', error);
        }
    }

    async submitOfferRegistration(data) {
        const registrationData = {
            access_key: this.accessKey,
            subject: 'Pre-Launch Advertising Purchase - Helensvale Connect',
            business_name: data.businessName,
            email: data.email,
            product_list: data.productList,
            store_tagline: data.storeTagline,
            offer_type: data.offerType,
            payment_amount: '$3.99',
            payment_status: 'completed',
            timestamp: new Date().toISOString()
        };

        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registrationData)
        });

        if (!response.ok) throw new Error('Offer registration submission failed');
        return response.json();
    }

    async sendSetupEmail(data) {
        const emailData = {
            access_key: this.accessKey,
            subject: 'Your Mini-Store Setup Instructions - Helensvale Connect 🚀',
            from_name: 'Helensvale Connect Team',
            to: data.email,
            message: `
Dear ${data.businessName} Team,

🎉 Congratulations! Your pre-launch advertising is now active!

Your payment of $3.99 has been processed successfully, and we're excited to showcase your business on our pre-launch website.

📋 YOUR MINI-STORE DETAILS:
• Business: ${data.businessName}
• Tagline: ${data.store_tagline}
• Products to Feature: ${data.productList}

📸 NEXT STEPS - PHOTO SUBMISSION:
Please submit high-quality photos for your featured products within 48 hours:

1. Photo Requirements:
   - High resolution (at least 800x800 pixels)
   - Clear, well-lit product images
   - White or neutral background preferred
   - Multiple angles if possible

2. Submission Methods:
   - Email photos to: photos@helensvaleconnect.com
   - Subject line: "Mini-Store Photos - ${data.businessName}"
   - Include product names for each photo

🎨 STORE SETUP:
Once we receive your photos, our team will:
• Create your professional mini-store page
• Feature your products with compelling descriptions
• Add your store location and contact information
• Make your store live within 72 hours

📊 WHAT YOU GET:
• Featured placement on our pre-launch website
• Customer interest analytics and insights
• Direct traffic to your physical store location
• Priority placement when we launch in 21 days
• Early customer engagement and pre-hype

🚀 LAUNCH DAY BENEFITS:
When Helensvale Connect officially launches, you'll receive:
• Premium store placement
• Featured in launch announcements
• Priority customer notifications
• Enhanced visibility in search results

📞 NEED HELP?
Our team is here to support you:
• Email: support@helensvaleconnect.com
• Phone: +263 XXX XXXX
• We'll also contact you within 24 hours to ensure everything is set up perfectly

Thank you for being an early partner in Zimbabwe's marketplace revolution!

Best regards,
The Helensvale Connect Team

P.S. Don't forget to tell your customers to look out for your store on our pre-launch website!
            `
        };

        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) throw new Error('Setup email failed');
        return response.json();
    }

    addAnimations() {
        // Rocket animation
        const rocket = document.querySelector('.rocket-icon');
        if (rocket) {
            rocket.style.animation = 'rocketLaunch 3s ease-in-out infinite';
        }

        // Particle animation
        const particlesContainer = document.querySelector('.success-particles');
        if (particlesContainer) {
            for (let i = 0; i < 15; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 2 + 's';
                particlesContainer.appendChild(particle);
            }
        }

        // Stagger timeline items animation
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            item.style.animationDelay = (index * 0.2) + 's';
            item.classList.add('fade-in-left');
        });
    }

    addCustomCSS() {
        const css = `
            .success-section {
                min-height: 100vh;
                display: flex;
                align-items: center;
                background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.05));
                padding: 2rem 0;
            }

            .success-content {
                text-align: center;
                max-width: 900px;
                margin: 0 auto;
            }

            .success-animation {
                position: relative;
                margin-bottom: 2rem;
            }

            .rocket-icon {
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
                width: 6px;
                height: 6px;
                background: linear-gradient(45deg, #3b82f6, #8b5cf6);
                border-radius: 50%;
                animation: sparkle 2s ease-in-out infinite;
            }

            @keyframes sparkle {
                0%, 100% { transform: translateY(0px) scale(1); opacity: 1; }
                50% { transform: translateY(-30px) scale(0.5); opacity: 0.7; }
            }

            @keyframes rocketLaunch {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                25% { transform: translateY(-10px) rotate(-5deg); }
                75% { transform: translateY(-5px) rotate(5deg); }
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

            .offer-benefits-showcase {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(59, 130, 246, 0.3);
                border-radius: 20px;
                padding: 2rem;
                margin-bottom: 3rem;
                backdrop-filter: blur(10px);
            }

            .offer-benefits-showcase h3 {
                color: var(--text-primary);
                margin-bottom: 2rem;
                font-size: 1.5rem;
            }

            .next-steps-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1.5rem;
            }

            .step-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                padding: 1.5rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: all 0.3s ease;
            }

            .step-item:hover {
                transform: translateY(-5px);
                border-color: var(--accent-primary);
                box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);
            }

            .step-icon {
                font-size: 2.5rem;
                margin-bottom: 1rem;
            }

            .step-content h4 {
                color: var(--text-primary);
                margin-bottom: 0.5rem;
                font-size: 1.1rem;
            }

            .step-content p {
                color: var(--text-secondary);
                margin: 0;
                font-size: 0.9rem;
            }

            .timeline-section {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 2rem;
                margin-bottom: 3rem;
                text-align: left;
            }

            .timeline-section h3 {
                color: var(--text-primary);
                margin-bottom: 2rem;
                text-align: center;
                font-size: 1.5rem;
            }

            .timeline {
                position: relative;
                padding-left: 2rem;
            }

            .timeline::before {
                content: '';
                position: absolute;
                left: 20px;
                top: 0;
                bottom: 0;
                width: 2px;
                background: linear-gradient(to bottom, var(--accent-primary), rgba(59, 130, 246, 0.3));
            }

            .timeline-item {
                position: relative;
                margin-bottom: 2rem;
                padding-left: 2rem;
            }

            .timeline-marker {
                position: absolute;
                left: -2rem;
                top: 0.5rem;
                width: 12px;
                height: 12px;
                background: var(--accent-primary);
                border-radius: 50%;
                border: 3px solid var(--bg-primary);
            }

            .timeline-item.completed .timeline-marker {
                background: #10b981;
                box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
            }

            .timeline-content h4 {
                color: var(--text-primary);
                margin: 0 0 0.5rem 0;
                font-size: 1.1rem;
            }

            .timeline-content p {
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

            .fade-in-left {
                animation: fadeInLeft 0.6s ease-out forwards;
                opacity: 0;
                transform: translateX(-20px);
            }

            @keyframes fadeInLeft {
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @media (max-width: 768px) {
                .success-title {
                    font-size: 2rem;
                }
                
                .next-steps-grid {
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
                
                .timeline {
                    padding-left: 1.5rem;
                }
                
                .timeline-marker {
                    left: -1.5rem;
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
    new OfferSuccess();
});
