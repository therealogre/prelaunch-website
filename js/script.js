// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 100
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initEarlyAccessForm();
    initScrollAnimations();
    initPhoneFormatting();
    initStatsCounter();
    initializeRoleInteractivity();
});

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileSidebar = document.getElementById('mobileSidebar');
const sidebarClose = document.getElementById('sidebarClose');

mobileMenuToggle.addEventListener('click', () => {
    mobileSidebar.classList.add('active');
});

sidebarClose.addEventListener('click', () => {
    mobileSidebar.classList.remove('active');
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileSidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        mobileSidebar.classList.remove('active');
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile sidebar if open
            mobileSidebar.classList.remove('active');
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    }
});

// Countdown Timer
function initCountdown() {
    const countdownElement = document.getElementById('countdown');
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    // Set launch date (14 days from now)
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 14);
    launchDate.setHours(0, 0, 0, 0);

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = launchDate.getTime() - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysElement.textContent = days.toString().padStart(2, '0');
            hoursElement.textContent = hours.toString().padStart(2, '0');
            minutesElement.textContent = minutes.toString().padStart(2, '0');
            secondsElement.textContent = seconds.toString().padStart(2, '0');
        } else {
            // Launch day reached
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            
            // Show launch message
            document.querySelector('.countdown-title').textContent = '🚀 We\'re Live!';
        }
    }

    // Update countdown immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Early Access Form Handler
function initEarlyAccessForm() {
    const form = document.getElementById('earlyAccessForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Securing Your Spot...';
        submitButton.disabled = true;
        
        // Collect form data
        const formData = new FormData(form);
        const interests = [];
        formData.getAll('interests').forEach(interest => interests.push(interest));
        
        const data = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            city: formData.get('city'),
            interests: interests,
            timestamp: new Date().toISOString(),
            source: 'pre-launch-website'
        };
        
        try {
            // Send to email (using EmailJS or similar service)
            await sendToEmail(data);
            
            // Store in localStorage as backup
            const existingData = JSON.parse(localStorage.getItem('earlyAccessSignups') || '[]');
            existingData.push(data);
            localStorage.setItem('earlyAccessSignups', JSON.stringify(existingData));
            
            // Show success message
            showSuccessMessage();
            form.reset();
            
        } catch (error) {
            console.error('Error submitting form:', error);
            showErrorMessage();
        } finally {
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}

// Send form data to email
async function sendToEmail(data) {
    // Create email content
    const emailContent = `
        New Early Access Signup - Helensvale Connect
        
        Name: ${data.fullName}
        Email: ${data.email}
        Phone: ${data.phone}
        City: ${data.city}
        Interests: ${data.interests.join(', ')}
        Timestamp: ${data.timestamp}
        Source: ${data.source}
        
        ---
        This signup was submitted through the pre-launch website.
    `;
    
    // For now, we'll use mailto (in production, use EmailJS or backend API)
    const subject = encodeURIComponent('New Early Access Signup - Helensvale Connect');
    const body = encodeURIComponent(emailContent);
    const mailtoLink = `mailto:helensvaleconnect@gmail.com?subject=${subject}&body=${body}`;
    
    // Open email client (fallback method)
    window.open(mailtoLink);
    
    // In production, replace with actual email service:
    /*
    const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error('Failed to submit form');
    }
    */
}

// Success message
function showSuccessMessage() {
    const form = document.getElementById('earlyAccessForm');
    const successHTML = `
        <div class="success-message" style="text-align: center; padding: 40px;">
            <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
            <h3 style="color: #4ade80; margin-bottom: 15px;">Welcome to the Revolution!</h3>
            <p style="color: #b0b0b0; margin-bottom: 20px;">
                You're now part of the exclusive early access list. We'll notify you as soon as 
                Helensvale Connect launches.
            </p>
            <div style="background: rgba(74, 222, 128, 0.1); border: 1px solid rgba(74, 222, 128, 0.3); 
                        border-radius: 12px; padding: 20px; margin: 20px 0;">
                <p style="color: #4ade80; font-weight: 600; margin-bottom: 10px;">
                    🎁 Your Early Adopter Benefits:
                </p>
                <ul style="color: #b0b0b0; text-align: left; margin: 0; padding-left: 20px;">
                    <li>50% lifetime discount on premium features</li>
                    <li>Free delivery for first 10 orders</li>
                    <li>VIP customer support priority</li>
                    <li>Exclusive community access</li>
                </ul>
            </div>
            <p style="color: #808080; font-size: 14px;">
                Follow us on <a href="https://instagram.com/helensvale.connect" 
                style="color: #667eea;">@helensvale.connect</a> for updates!
            </p>
        </div>
    `;
    
    form.innerHTML = successHTML;
    
    // Add confetti effect
    createConfetti();
}

// Error message
function showErrorMessage() {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 12px; padding: 20px; margin: 20px; color: #ef4444; text-align: center;">
            <i class="fas fa-exclamation-triangle" style="font-size: 24px; margin-bottom: 10px;"></i>
            <p style="margin: 0;">Something went wrong. Please try again or contact us directly at 
            <a href="mailto:helensvaleconnect@gmail.com" style="color: #ef4444;">helensvaleconnect@gmail.com</a></p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Confetti effect for success
function createConfetti() {
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
            { transform: `translateY(100vh) rotate(360deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 2000 + 1000,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

// Intersection Observer for animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Phone number formatting
function initPhoneFormatting() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
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
    }
}

// Statistics Counter Animation
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/\D/g, ''));
    const suffix = text.replace(/[\d,]/g, '');
    const duration = 2000;
    const steps = 60;
    const increment = number / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        
        const formattedNumber = Math.floor(current).toLocaleString();
        element.textContent = formattedNumber + suffix;
    }, duration / steps);
}


// Initialize role interactivity
function initializeRoleInteractivity() {
    const roleOptions = document.querySelectorAll('input[name="roleDisplay"]');
    const hiddenRoleInput = document.querySelector('input[name="role"].role-selector');
    
    roleOptions.forEach(option => {
        option.addEventListener('change', (e) => {
            const selectedRole = e.target.value;
            
            // Update hidden field
            if (hiddenRoleInput) {
                hiddenRoleInput.value = selectedRole;
            }
            
            // Update benefits display
            updateBenefitsDisplay(selectedRole);
            
            // Update form button text based on role
            updateFormButtonText(selectedRole);
        });
    });
}

// Update benefits display based on selected role
function updateBenefitsDisplay(role) {
    const benefitsContainer = document.querySelector('.role-benefits');
    if (!benefitsContainer) return;
    
    const benefits = {
        customer: [
            { icon: 'fas fa-star', title: 'VIP Shopping Lane', desc: 'Skip the queue with priority order processing' },
            { icon: 'fas fa-tag', title: 'Insider Pricing', desc: 'Access to member-only deals before anyone else' },
            { icon: 'fas fa-robot', title: 'Personal Shopping Assistant', desc: 'AI-powered recommendations just for you' },
            { icon: 'fas fa-shield-check', title: 'Zero-Risk Guarantee', desc: '30-day money-back guarantee on all purchases' }
        ],
        business: [
            { icon: 'fas fa-chart-line', title: 'Business Growth Accelerator', desc: 'Free marketing tools to boost your sales by 300%' },
            { icon: 'fas fa-analytics', title: 'Revenue Optimization Suite', desc: 'Advanced analytics to maximize your profits' },
            { icon: 'fas fa-headset', title: 'Priority Business Support', desc: 'Dedicated account manager for instant assistance' },
            { icon: 'fas fa-brain', title: 'Market Intelligence Access', desc: 'Exclusive insights into customer behavior and trends' }
        ],
        entrepreneur: [
            { icon: 'fas fa-rocket', title: 'Startup Success Kit', desc: 'Complete business setup in under 24 hours' },
            { icon: 'fas fa-users', title: 'Investor Network Access', desc: 'Connect with potential investors and mentors' },
            { icon: 'fas fa-chart-bar', title: 'Scale-Up Resources', desc: 'Tools and guidance to grow from startup to success' },
            { icon: 'fas fa-flask', title: 'Innovation Lab Access', desc: 'Beta test new features before public release' }
        ],
        delivery: [
            { icon: 'fas fa-crown', title: 'Premium Partner Status', desc: 'Higher commission rates and priority job assignments' },
            { icon: 'fas fa-tshirt', title: 'Professional Driver Kit', desc: 'Free branded gear and professional certification' },
            { icon: 'fas fa-route', title: 'Earnings Maximizer', desc: 'AI-powered route optimization for higher profits' },
            { icon: 'fas fa-truck', title: 'Growth Pathway Program', desc: 'Clear path to fleet ownership and expansion' }
        ]
    };
    
    const roleBenefits = benefits[role] || benefits.customer;
    
    benefitsContainer.innerHTML = roleBenefits.map(benefit => `
        <div class="benefit-item">
            <i class="${benefit.icon}"></i>
            <div>
                <h4>${benefit.title}</h4>
                <p>${benefit.desc}</p>
            </div>
        </div>
    `).join('');
}

// Update form button text based on role
function updateFormButtonText(role) {
    const submitButton = document.querySelector('#earlyAccessForm button[type="submit"]');
    if (!submitButton) return;
    
    const buttonTexts = {
        customer: 'Secure My VIP Access',
        business: 'Unlock Business Growth',
        entrepreneur: 'Join Startup Program',
        delivery: 'Become Partner Driver'
    };
    
    const buttonText = buttonTexts[role] || buttonTexts.customer;
    submitButton.innerHTML = `<i class="fas fa-rocket"></i> ${buttonText}`;
}

function createSpecialConfetti() {
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
            { transform: `translateY(100vh) rotate(360deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 2000 + 1000,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

function showEasterEgg() {
    const easterEgg = document.createElement('div');
    easterEgg.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: var(--card-bg); border: 2px solid var(--accent-primary);
                    border-radius: 20px; padding: 40px; text-align: center; z-index: 10000;
                    box-shadow: var(--shadow-large);">
            <h3 style="color: var(--accent-primary); margin-bottom: 20px;">🎮 Easter Egg Found!</h3>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">
                You've discovered the secret! As a true early adopter, you get an extra 
                <strong style="color: var(--accent-gold);">25% discount</strong> on top of your early access benefits!
            </p>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: var(--primary-gradient); border: none; color: white;
                           padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                Awesome! 🚀
            </button>
        </div>
    `;
    
    document.body.appendChild(easterEgg);
    createConfetti();
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (easterEgg.parentElement) {
            easterEgg.remove();
        }
    }, 10000);
}

// Performance optimization: Lazy load images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('loading');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.classList.add('loading');
        imageObserver.observe(img);
    });
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoading);
