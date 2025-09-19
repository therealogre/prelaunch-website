// Enhanced Scroll Animations and Micro-interactions
class ScrollAnimations {
    constructor() {
        this.init();
        this.setupIntersectionObserver();
        this.setupScrollEffects();
        this.setupMicroInteractions();
    }

    init() {
        // Add animation classes to elements
        this.addAnimationClasses();
        
        // Setup stagger animations
        this.setupStaggerAnimations();
        
        // Initialize parallax effects
        this.setupParallaxEffects();
    }

    addAnimationClasses() {
        // Add hover effects to cards
        document.querySelectorAll('.card, .feature-card, .pricing-card, .partnership-card').forEach(card => {
            card.classList.add('card-hover', 'hover-lift');
        });

        // Add button animations
        document.querySelectorAll('.btn').forEach(btn => {
            if (!btn.classList.contains('btn-animated')) {
                btn.classList.add('btn-animated', 'hover-lift');
            }
        });

        // Add icon animations
        document.querySelectorAll('.feature-icon, .benefit-icon, .stat-icon').forEach(icon => {
            icon.classList.add('icon-bounce');
        });

        // Add interactive elements
        document.querySelectorAll('input, textarea, select').forEach(element => {
            element.classList.add('interactive-element');
        });
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Add stagger delay for child elements
                    const children = entry.target.querySelectorAll('.stagger-child');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate-fade-in-up');
                        }, index * 100);
                    });
                }
            });
        }, options);

        // Observe elements for scroll reveal
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });

        // Add scroll-reveal class to sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('scroll-reveal');
            observer.observe(section);
        });
    }

    setupStaggerAnimations() {
        // Add stagger animation to feature grids
        document.querySelectorAll('.features-grid, .pricing-grid, .partnership-grid').forEach(grid => {
            grid.classList.add('stagger-animation');
            
            const items = grid.children;
            Array.from(items).forEach((item, index) => {
                item.style.animationDelay = `${(index + 1) * 0.1}s`;
                item.classList.add('stagger-child');
            });
        });

        // Add stagger to FAQ items
        document.querySelectorAll('.faq-item').forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('animate-fade-in-up');
        });
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.hero-background, .section-bg');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }

    setupScrollEffects() {
        let ticking = false;
        
        const updateScrollEffects = () => {
            const scrollY = window.scrollY;
            
            // Navbar scroll effect
            const navbar = document.getElementById('navbar');
            if (navbar) {
                if (scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
            
            // Progress bar for reading
            this.updateReadingProgress();
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
    }

    updateReadingProgress() {
        const progressBar = document.querySelector('.reading-progress');
        if (progressBar) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        }
    }

    setupMicroInteractions() {
        // Form input focus effects
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('focus', (e) => {
                e.target.parentElement.classList.add('focused');
                e.target.classList.add('animate-scale-in');
            });

            input.addEventListener('blur', (e) => {
                e.target.parentElement.classList.remove('focused');
                e.target.classList.remove('animate-scale-in');
            });
        });

        // Button ripple effect
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Card tilt effect
        document.querySelectorAll('.card-hover').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });

        // Smooth scroll for anchor links
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
    }

    // Loading states for forms
    addLoadingState(element, text = 'Loading...') {
        element.classList.add('loading');
        element.disabled = true;
        
        const originalText = element.textContent;
        element.innerHTML = `
            <span class="loading-spinner"></span>
            <span>${text}</span>
        `;
        
        return () => {
            element.classList.remove('loading');
            element.disabled = false;
            element.textContent = originalText;
        };
    }

    // Notification system
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} notification-enter`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove
        setTimeout(() => {
            notification.classList.add('notification-exit');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.add('notification-exit');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }

    // Skeleton loading for content
    createSkeleton(container, lines = 3) {
        container.innerHTML = '';
        for (let i = 0; i < lines; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'loading-skeleton';
            skeleton.style.height = '20px';
            skeleton.style.marginBottom = '10px';
            skeleton.style.width = `${Math.random() * 40 + 60}%`;
            container.appendChild(skeleton);
        }
    }

    // Performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.scrollAnimations = new ScrollAnimations();
});

// Add CSS for ripple effect
const rippleCSS = `
.btn {
    position: relative;
    overflow: hidden;
}

.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--card-bg);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    max-width: 400px;
}

.notification-info {
    border-left: 4px solid var(--accent-primary);
}

.notification-success {
    border-left: 4px solid #10b981;
}

.notification-error {
    border-left: 4px solid #ef4444;
}

.notification-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.notification-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 18px;
    padding: 0;
    margin-left: 12px;
}

.reading-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: var(--accent-primary);
    z-index: 9999;
    transition: width 0.3s ease;
}

.focused {
    transform: scale(1.02);
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);
