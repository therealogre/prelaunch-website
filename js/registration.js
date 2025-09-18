// Enhanced Registration System with Real Email Functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeRegistrationSystem();
});

// Web3Forms Access Key (replace with actual key)
const WEB3_FORMS_ACCESS_KEY = 'YOUR_ACCESS_KEY_HERE'; // Replace with actual Web3Forms access key

// Registration system initialization
function initializeRegistrationSystem() {
    // Initialize all registration forms
    const registrationForms = document.querySelectorAll('.registration-form, #earlyAccessForm, #newsletterForm');
    
    registrationForms.forEach(form => {
        if (form) {
            initializeRegistrationForm(form);
        }
    });

    // Initialize role selection if present
    initializeRoleSelection();
    
    // Initialize benefit personalization
    initializeBenefitPersonalization();
}

// Initialize individual registration form
function initializeRegistrationForm(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Joining the Revolution...';
        submitButton.disabled = true;
        
        try {
            const formData = new FormData(form);
            const registrationData = await processRegistrationData(formData);
            
            // Submit to Web3Forms
            await submitRegistration(registrationData, form);
            
            // Show success with role-based benefits
            showRegistrationSuccess(registrationData);
            
            // Store user data locally
            storeUserRegistration(registrationData);
            
            // Reset form
            form.reset();
            
        } catch (error) {
            console.error('Registration error:', error);
            showRegistrationError();
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}

// Process registration data with role-based benefits
async function processRegistrationData(formData) {
    const email = formData.get('email');
    const name = formData.get('name') || formData.get('firstName') || '';
    const phone = formData.get('phone') || '';
    const city = formData.get('city') || '';
    const role = formData.get('role') || 'customer';
    const interests = formData.getAll('interests') || [];
    
    // Generate unique registration ID
    const registrationId = generateRegistrationId();
    
    // Determine role-based benefits
    const roleBenefits = getRoleBenefits(role);
    
    // Calculate registration number (simulated)
    const registrationNumber = await getRegistrationNumber();
    
    return {
        id: registrationId,
        email,
        name,
        phone,
        city,
        role,
        interests,
        benefits: roleBenefits,
        registrationNumber,
        timestamp: new Date().toISOString(),
        status: 'confirmed'
    };
}

// Submit registration to Web3Forms
async function submitRegistration(data, form) {
    // Create the form data for Web3Forms
    const formData = new FormData();
    
    // Add Web3Forms access key
    formData.append('access_key', WEB3_FORMS_ACCESS_KEY);
    
    // Add user data
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('city', data.city);
    formData.append('role', data.role);
    formData.append('interests', data.interests.join(', '));
    formData.append('registration_id', data.id);
    formData.append('registration_number', data.registrationNumber);
    
    // Add email template data
    formData.append('subject', 'Welcome to Helensvale Connect - Early Access Confirmed! 🎉');
    formData.append('from_name', 'Helensvale Connect Team');
    formData.append('reply_to', 'helensvaleconnect@gmail.com');
    
    // Create personalized email content
    const emailContent = createWelcomeEmailContent(data);
    formData.append('message', emailContent);
    
    // Add redirect URL for success page
    formData.append('redirect', window.location.origin + '/success.html');
    
    // Add honeypot protection
    formData.append('botcheck', '');
    
    // Submit to Web3Forms
    const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        throw new Error('Registration submission failed');
    }
    
    return response.json();
}

// Create personalized welcome email content
function createWelcomeEmailContent(data) {
    const benefitsList = data.benefits.map(benefit => `• ${benefit.title}: ${benefit.description}`).join('\n');
    
    return `🎉 Welcome to Helensvale Connect, ${data.name}!

Congratulations! You're now part of Zimbabwe's most exclusive marketplace community.

Your Early Access Details:
Registration ID: ${data.id}
Registration Number: #${data.registrationNumber}
Role: ${data.role}
Status: CONFIRMED ✅

Your Exclusive ${data.role} Benefits:
${benefitsList}

What happens next:
1. You'll receive priority access when we launch
2. We'll send you exclusive updates and insider information
3. Your ${data.role} benefits will be activated on launch day

Follow us on Instagram @helensvale.connect for the latest updates!

Welcome to the revolution,
The Helensvale Connect Team

---
This email was sent to ${data.email}. You can unsubscribe anytime.`;
}

// Role-based benefits using sales psychology
function getRoleBenefits(role) {
    const benefits = {
        customer: [
            {
                title: "VIP Shopping Lane",
                description: "Skip the queue with priority order processing"
            },
            {
                title: "Insider Pricing",
                description: "Access to member-only deals before anyone else"
            },
            {
                title: "Personal Shopping Assistant",
                description: "AI-powered recommendations just for you"
            },
            {
                title: "Zero-Risk Guarantee",
                description: "30-day money-back guarantee on all purchases"
            }
        ],
        business: [
            {
                title: "Business Growth Accelerator",
                description: "Free marketing tools to boost your sales by 300%"
            },
            {
                title: "Revenue Optimization Suite",
                description: "Advanced analytics to maximize your profits"
            },
            {
                title: "Priority Business Support",
                description: "Dedicated account manager for instant assistance"
            },
            {
                title: "Market Intelligence Access",
                description: "Exclusive insights into customer behavior and trends"
            }
        ],
        entrepreneur: [
            {
                title: "Startup Success Kit",
                description: "Complete business setup in under 24 hours"
            },
            {
                title: "Investor Network Access",
                description: "Connect with potential investors and mentors"
            },
            {
                title: "Scale-Up Resources",
                description: "Tools and guidance to grow from startup to success"
            },
            {
                title: "Innovation Lab Access",
                description: "Beta test new features before public release"
            }
        ],
        delivery: [
            {
                title: "Premium Partner Status",
                description: "Higher commission rates and priority job assignments"
            },
            {
                title: "Professional Driver Kit",
                description: "Free branded gear and professional certification"
            },
            {
                title: "Earnings Maximizer",
                description: "AI-powered route optimization for higher profits"
            },
            {
                title: "Growth Pathway Program",
                description: "Clear path to fleet ownership and expansion"
            }
        ]
    };
    
    return benefits[role] || benefits.customer;
}

// Generate unique registration ID
function generateRegistrationId() {
    return 'HC' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Get registration number (simulated counter)
async function getRegistrationNumber() {
    let count = localStorage.getItem('registrationCount') || '15000';
    count = parseInt(count) + Math.floor(Math.random() * 3) + 1;
    localStorage.setItem('registrationCount', count.toString());
    return count;
}

// Store user registration locally
function storeUserRegistration(data) {
    const existingRegistrations = JSON.parse(localStorage.getItem('userRegistrations') || '[]');
    existingRegistrations.push(data);
    localStorage.setItem('userRegistrations', JSON.stringify(existingRegistrations));
    localStorage.setItem('currentUser', JSON.stringify(data));
}

// Initialize role selection
function initializeRoleSelection() {
    const roleSelectors = document.querySelectorAll('.role-selector');
    
    roleSelectors.forEach(selector => {
        selector.addEventListener('change', (e) => {
            const selectedRole = e.target.value;
            updateBenefitDisplay(selectedRole);
        });
    });
}

// Initialize benefit personalization
function initializeBenefitPersonalization() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (currentUser) {
        personalizeExperience(currentUser);
    }
}

// Update benefit display based on role
function updateBenefitDisplay(role) {
    const benefitsContainer = document.querySelector('.role-benefits');
    
    if (benefitsContainer) {
        const benefits = getRoleBenefits(role);
        benefitsContainer.innerHTML = benefits.map(benefit => `
            <div class="benefit-item">
                <i class="fas fa-star"></i>
                <div>
                    <h4>${benefit.title}</h4>
                    <p>${benefit.description}</p>
                </div>
            </div>
        `).join('');
    }
}

// Personalize experience for returning users
function personalizeExperience(user) {
    // Update welcome messages
    const welcomeElements = document.querySelectorAll('.welcome-message');
    welcomeElements.forEach(element => {
        element.textContent = `Welcome back, ${user.name}!`;
    });
    
    // Show personalized benefits
    updateBenefitDisplay(user.role);
    
    // Update registration count display
    const countElements = document.querySelectorAll('.registration-count');
    countElements.forEach(element => {
        element.textContent = user.registrationNumber + '+';
    });
}

// Show registration success
function showRegistrationSuccess(data) {
    const successHTML = `
        <div class="registration-success" style="text-align: center; padding: 40px;">
            <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
            <h3 style="color: #4ade80; margin-bottom: 15px;">Welcome to the Revolution!</h3>
            <p style="color: #b0b0b0; margin-bottom: 20px;">
                You're now member #${data.registrationNumber} in Zimbabwe's most exclusive marketplace community.
            </p>
            <div style="background: rgba(74, 222, 128, 0.1); border: 1px solid rgba(74, 222, 128, 0.3); 
                        border-radius: 12px; padding: 20px; margin: 20px 0;">
                <p style="color: #4ade80; font-weight: 600; margin-bottom: 10px;">
                    🎁 Your ${data.role} Benefits Are Now Active:
                </p>
                <ul style="color: #b0b0b0; text-align: left; margin: 0; padding-left: 20px;">
                    ${data.benefits.map(benefit => `<li><strong>${benefit.title}:</strong> ${benefit.description}</li>`).join('')}
                </ul>
            </div>
            <p style="color: #808080; font-size: 14px;">
                Check your email for confirmation and next steps!
            </p>
        </div>
    `;
    
    // Replace form with success message
    const form = document.querySelector('.registration-form, #earlyAccessForm');
    if (form) {
        const formContainer = form.closest('.form-container') || form.parentElement;
        formContainer.innerHTML = successHTML;
    }
    
    // Add confetti effect
    createRegistrationConfetti();
}

// Show registration error
function showRegistrationError() {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; z-index: 10000;
                    background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 12px; padding: 20px; color: #ef4444; max-width: 400px;">
            <i class="fas fa-exclamation-triangle" style="font-size: 24px; margin-bottom: 10px;"></i>
            <p style="margin: 0;">Registration failed. Please try again or contact us directly.</p>
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

// Confetti effect for registration success
function createRegistrationConfetti() {
    const colors = ['#667eea', '#764ba2', '#ffd700', '#4ade80', '#f093fb'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
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
            { transform: `translateY(100vh) rotate(720deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 2000 + 1500,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}
