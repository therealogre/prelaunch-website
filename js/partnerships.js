// Partnerships page specific functionality (commission-only unified form)
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    if (window.AOS) {
        AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 100 });
    }

    // Bind unified commission partner form
    const form = document.getElementById('commissionPartnerForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('partner-submit-btn');
            const feedback = document.getElementById('partner-feedback');
            const original = submitBtn ? submitBtn.innerHTML : '';

            // Collect minimal fields
            const name = document.getElementById('partner-name')?.value.trim();
            const email = document.getElementById('partner-email')?.value.trim();
            const phone = document.getElementById('partner-phone')?.value.trim();
            const channel = document.getElementById('partner-channel')?.value;
            const audience = document.getElementById('partner-audience')?.value.trim();
            const notes = document.getElementById('partner-notes')?.value.trim();

            // Basic validation
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                if (feedback) { feedback.style.display = 'block'; feedback.className = 'form-feedback error'; feedback.textContent = 'Please enter a valid email.'; }
                return;
            }
            if (!name) {
                if (feedback) { feedback.style.display = 'block'; feedback.className = 'form-feedback error'; feedback.textContent = 'Please enter your full name.'; }
                return;
            }

            try {
                if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...'; }
                if (feedback) { feedback.style.display = 'none'; }

                // Submit via serverless subscribe endpoint (type=partner)
                const resp = await fetch('/.netlify/functions/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        name,
                        type: 'partner',
                        fields: { phone, channel, audience, notes }
                    })
                });
                const data = await resp.json().catch(() => ({}));
                if (!resp.ok) {
                    throw new Error(data.error || 'Unable to submit application');
                }

                if (feedback) {
                    feedback.style.display = 'block';
                    feedback.className = 'form-feedback success';
                    feedback.textContent = 'Thank you! Your partner application was received. We will reach out with your referral toolkit within 24–48 hours.';
                }
                form.reset();
            } catch (err) {
                if (feedback) {
                    feedback.style.display = 'block';
                    feedback.className = 'form-feedback error';
                    feedback.textContent = `Submission failed: ${err.message}`;
                }
            } finally {
                if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = original; }
            }
        });
    }

    // Smooth scrolling for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// Delivery Partner Form Handler
function initDeliveryPartnerForm() {
    const form = document.getElementById('deliveryPartnerForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Application...';
        submitButton.disabled = true;
        
        // Collect form data
        const formData = new FormData(form);
        const availability = [];
        formData.getAll('availability').forEach(item => availability.push(item));
        
        const data = {
            type: 'delivery-partner',
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            city: formData.get('city'),
            vehicleType: formData.get('vehicleType'),
            availability: availability,
            experience: formData.get('experience'),
            timestamp: new Date().toISOString()
        };
        
        try {
            await sendPartnershipApplication(data);
            showPartnershipSuccess('delivery');
            form.reset();
        } catch (error) {
            console.error('Error submitting delivery partner form:', error);
            showPartnershipError();
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}

// Influencer Partner Form Handler
function initInfluencerPartnerForm() {
    const form = document.getElementById('influencerPartnerForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Application...';
        submitButton.disabled = true;
        
        // Collect form data
        const formData = new FormData(form);
        
        const data = {
            type: 'influencer-partner',
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            niche: formData.get('niche'),
            socialMedia: {
                instagram: {
                    handle: formData.get('instagram'),
                    followers: formData.get('instagramFollowers')
                },
                facebook: {
                    page: formData.get('facebook'),
                    followers: formData.get('facebookFollowers')
                },
                tiktok: {
                    handle: formData.get('tiktok'),
                    followers: formData.get('tiktokFollowers')
                },
                youtube: {
                    channel: formData.get('youtube'),
                    subscribers: formData.get('youtubeSubscribers')
                }
            },
            contentStrategy: formData.get('contentStrategy'),
            timestamp: new Date().toISOString()
        };
        
        try {
            await sendPartnershipApplication(data);
            showPartnershipSuccess('influencer');
            form.reset();
        } catch (error) {
            console.error('Error submitting influencer partner form:', error);
            showPartnershipError();
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}

// Strategic Partner Form Handler
function initStrategicPartnerForm() {
    const form = document.getElementById('strategicPartnerForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Inquiry...';
        submitButton.disabled = true;
        
        // Collect form data
        const formData = new FormData(form);
        
        const data = {
            type: 'strategic-partner',
            companyName: formData.get('companyName'),
            contactName: formData.get('contactName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            industry: formData.get('industry'),
            companySize: formData.get('companySize'),
            partnershipGoals: formData.get('partnershipGoals'),
            timestamp: new Date().toISOString()
        };
        
        try {
            await sendPartnershipApplication(data);
            showPartnershipSuccess('strategic');
            form.reset();
        } catch (error) {
            console.error('Error submitting strategic partner form:', error);
            showPartnershipError();
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}

// Send partnership application
async function sendPartnershipApplication(data) {
    // Create email content
    const emailContent = `
        New Partnership Application - Helensvale Connect
        
        Type: ${data.type}
        Name: ${data.name || data.contactName}
        Email: ${data.email}
        Phone: ${data.phone}
        ${data.city ? `City: ${data.city}` : ''}
        ${data.companyName ? `Company: ${data.companyName}` : ''}
        ${data.industry ? `Industry: ${data.industry}` : ''}
        ${data.niche ? `Niche: ${data.niche}` : ''}
        
        Additional Details:
        ${JSON.stringify(data, null, 2)}
        
        Timestamp: ${data.timestamp}
        
        ---
        This application was submitted through the partnerships page.
    `;
    
    // Store in localStorage as backup
    const existingApplications = JSON.parse(localStorage.getItem('partnershipApplications') || '[]');
    existingApplications.push(data);
    localStorage.setItem('partnershipApplications', JSON.stringify(existingApplications));
    
    // For now, use mailto (in production, use backend API)
    const subject = encodeURIComponent(`New ${data.type} Application - Helensvale Connect`);
    const body = encodeURIComponent(emailContent);
    const mailtoLink = `mailto:helensvaleconnect@gmail.com?subject=${subject}&body=${body}`;
    
    // Open email client
    window.open(mailtoLink);
}

// Success message for partnerships
function showPartnershipSuccess(type) {
    let title, message, benefits;
    
    switch(type) {
        case 'delivery':
            title = 'Welcome to the Delivery Team!';
            message = 'Your application has been received. We\'ll contact you within 48 hours to complete your onboarding.';
            benefits = [
                '30% commission on every delivery',
                'Flexible working hours',
                'Zone exclusivity in your area',
                'Free delivery app with GPS'
            ];
            break;
        case 'influencer':
            title = 'Welcome to the Influencer Program!';
            message = 'Your application is under review. We\'ll send you your unique referral code and marketing materials soon.';
            benefits = [
                '30% commission on referrals',
                'Marketing support and tracking tools',
                'Performance bonuses available',
                'Free content creation support'
            ];
            break;
        case 'strategic':
            title = 'Partnership Inquiry Received!';
            message = 'Thank you for your interest in partnering with us. Our partnerships team will contact you within 24 hours.';
            benefits = [
                'Custom partnership terms',
                'Dedicated account manager',
                'Co-marketing opportunities',
                'Revenue sharing agreements'
            ];
            break;
    }
    
    const form = document.getElementById(`${type}PartnerForm` || `${type}PartnershipForm`);
    const successHTML = `
        <div class="partnership-success" style="text-align: center; padding: 40px;">
            <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
            <h3 style="color: #4ade80; margin-bottom: 15px;">${title}</h3>
            <p style="color: #b0b0b0; margin-bottom: 20px;">${message}</p>
            <div style="background: rgba(74, 222, 128, 0.1); border: 1px solid rgba(74, 222, 128, 0.3); 
                        border-radius: 12px; padding: 20px; margin: 20px 0;">
                <p style="color: #4ade80; font-weight: 600; margin-bottom: 10px;">
                    🎁 Your Partnership Benefits:
                </p>
                <ul style="color: #b0b0b0; text-align: left; margin: 0; padding-left: 20px;">
                    ${benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                </ul>
            </div>
            <p style="color: #808080; font-size: 14px;">
                Follow us on <a href="https://instagram.com/helensvale.connect" 
                style="color: #667eea;">@helensvale.connect</a> for updates!
            </p>
        </div>
    `;
    
    const formSection = form.closest('.partnership-form-section');
    formSection.innerHTML = successHTML.replace('partnership-success', 'partnership-success') + 
        `<div style="text-align: center; margin-top: 30px;">
            <a href="#partnerships" class="btn btn-secondary">View Other Partnerships</a>
        </div>`;
    
    // Add confetti effect
    createPartnershipConfetti();
}

// Error message for partnerships
function showPartnershipError() {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; z-index: 10000;
                    background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 12px; padding: 20px; color: #ef4444; max-width: 400px;">
            <i class="fas fa-exclamation-triangle" style="font-size: 24px; margin-bottom: 10px;"></i>
            <p style="margin: 0;">Something went wrong. Please try again or contact us directly at 
            <a href="mailto:helensvaleconnect@gmail.com" style="color: #ef4444;">helensvaleconnect@gmail.com</a></p>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="position: absolute; top: 10px; right: 10px; background: none; 
                           border: none; color: #ef4444; cursor: pointer; font-size: 18px;">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Confetti effect for partnerships
function createPartnershipConfetti() {
    const colors = ['#667eea', '#764ba2', '#ffd700', '#4ade80', '#f093fb'];
    const confettiCount = 30;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '8px';
        confetti.style.height = '8px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.zIndex = '9999';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        
        document.body.appendChild(confetti);
        
        // Animate confetti falling
        const animation = confetti.animate([
            { transform: 'translateY(-10px) rotate(0deg)', opacity: 1 },
            { transform: `translateY(100vh) rotate(360deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 1500 + 1000,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

// Phone number formatting for partnership forms
document.querySelectorAll('input[type="tel"]').forEach(phoneInput => {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        // Add Zimbabwe country code if not present
        if (value.length > 0 && !value.startsWith('263')) {
            if (value.startsWith('0')) {
                value = '263' + value.substring(1);
            } else if (value.length === 9) {
                value = '263' + value;
            }
        }
        
        // Format the number
        if (value.startsWith('263')) {
            const formatted = '+' + value.substring(0, 3) + ' ' + 
                            value.substring(3, 5) + ' ' + 
                            value.substring(5, 8) + ' ' + 
                            value.substring(8, 12);
            e.target.value = formatted.trim();
        }
    });
});

// Add partnerships page specific styles
const partnershipStyles = `
    .partnership-hero {
        padding: 120px 0 80px;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(10, 10, 10, 1) 100%);
        text-align: center;
    }

    .partnership-stats {
        display: flex;
        justify-content: center;
        gap: 60px;
        margin-top: 40px;
    }

    .partnership-types {
        padding: 80px 0;
    }

    .partnership-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 30px;
        margin-top: 60px;
    }

    .partnership-card {
        background: var(--card-bg);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--border-radius-large);
        padding: 40px 30px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .partnership-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--primary-gradient);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: -1;
    }

    .partnership-card:hover::before {
        opacity: 0.05;
    }

    .partnership-card:hover {
        transform: translateY(-10px);
        box-shadow: var(--shadow-large);
    }

    .partnership-icon {
        width: 80px;
        height: 80px;
        background: var(--primary-gradient);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        font-size: 32px;
        color: var(--text-primary);
    }

    .partnership-title {
        font-size: 1.5rem;
        font-weight: var(--font-weight-bold);
        margin-bottom: 15px;
        text-align: center;
    }

    .partnership-description {
        color: var(--text-secondary);
        text-align: center;
        margin-bottom: 30px;
    }

    .partnership-benefits {
        margin: 30px 0;
    }

    .benefit-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 15px;
        padding: 10px;
        border-radius: var(--border-radius);
        transition: background-color 0.3s ease;
    }

    .benefit-item:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    .benefit-item i {
        color: var(--accent-green);
        font-size: 16px;
        min-width: 16px;
        margin-top: 2px;
    }

    .earning-potential, .tier-system, .strategic-examples {
        background: rgba(255, 255, 255, 0.05);
        border-radius: var(--border-radius);
        padding: 20px;
        margin: 20px 0;
    }

    .earning-potential h4, .tier-system h4, .strategic-examples h4 {
        color: var(--accent-primary);
        margin-bottom: 15px;
        font-size: 1.1rem;
    }

    .earning-breakdown, .tier-breakdown {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .earning-item, .tier-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .earning-item:last-child, .tier-item:last-child {
        border-bottom: none;
    }

    .earning-amount, .tier-commission {
        color: var(--accent-gold);
        font-weight: var(--font-weight-bold);
    }

    .example-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 10px;
    }

    .example-item {
        background: rgba(255, 255, 255, 0.1);
        padding: 10px;
        border-radius: var(--border-radius);
        text-align: center;
        font-size: 14px;
    }

    .partnership-forms {
        padding: 80px 0;
        background: var(--secondary-bg);
    }

    .partnership-form-section {
        max-width: 800px;
        margin: 0 auto 80px;
        background: var(--card-bg);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--border-radius-large);
        padding: 40px;
    }

    .form-title {
        font-size: 2rem;
        font-weight: var(--font-weight-bold);
        text-align: center;
        margin-bottom: 10px;
    }

    .form-subtitle {
        color: var(--text-secondary);
        text-align: center;
        margin-bottom: 40px;
    }

    .partnership-form {
        display: flex;
        flex-direction: column;
        gap: 25px;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }

    .social-platforms {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .platform-input {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 15px;
        padding: 15px;
        background: var(--accent-bg);
        border-radius: var(--border-radius);
    }

    .platform-input i {
        font-size: 20px;
        color: var(--accent-primary);
        min-width: 20px;
    }

    .platform-input input {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        padding: 8px 12px;
        color: var(--text-primary);
        font-size: 14px;
    }

    .platform-input input:focus {
        outline: none;
        border-color: var(--accent-primary);
    }

    .success-stories {
        padding: 80px 0;
    }

    .stories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 30px;
        margin-top: 60px;
    }

    .story-card {
        background: var(--card-bg);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--border-radius-large);
        padding: 30px;
        transition: all 0.3s ease;
    }

    .story-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-medium);
    }

    .story-header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 20px;
    }

    .story-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
    }

    .story-info h4 {
        margin: 0 0 5px 0;
        font-weight: var(--font-weight-semibold);
    }

    .story-info span {
        color: var(--text-secondary);
        font-size: 14px;
    }

    .story-content {
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 20px;
        font-style: italic;
    }

    .story-stats {
        display: flex;
        gap: 30px;
        padding-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .story-stats .stat {
        text-align: center;
    }

    .story-stats .stat-number {
        font-size: 1.5rem;
        font-weight: var(--font-weight-bold);
        color: var(--accent-green);
    }

    .story-stats .stat-label {
        font-size: 12px;
        color: var(--text-muted);
    }

    @media (max-width: 768px) {
        .partnership-stats {
            gap: 30px;
        }
        
        .partnership-grid {
            grid-template-columns: 1fr;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .stories-grid {
            grid-template-columns: 1fr;
        }
        
        .story-stats {
            gap: 20px;
        }
    }
`;

// Inject partnership styles
const styleSheet = document.createElement('style');
styleSheet.textContent = partnershipStyles;
document.head.appendChild(styleSheet);
