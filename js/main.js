// Helensvale Connect - Main JavaScript
// Handles countdown, navigation, and general functionality

class HelensvaleConnect {
    constructor() {
        this.init();
    }

    init() {
        this.setupCountdown();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupFormAnalytics();
    }

    setupCountdown() {
        // Set launch date (3 days from now)
        const launchDate = new Date();
        launchDate.setDate(launchDate.getDate() + 3);
        launchDate.setHours(0, 0, 0, 0);

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = launchDate - now;

            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Update countdown display
                const daysEl = document.getElementById('days');
                const hoursEl = document.getElementById('hours');
                const minutesEl = document.getElementById('minutes');
                const secondsEl = document.getElementById('seconds');

                if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
                if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
                if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
                if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
            } else {
                // Launch day - redirect or show special message
                this.handleLaunch();
            }
        };

        // Update countdown every second
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    handleLaunch() {
        // Hide countdown and show launch message
        const countdownHeader = document.querySelector('.countdown-header');
        if (countdownHeader) {
            countdownHeader.innerHTML = `
                <div class="container">
                    <div class="launch-message">
                        <i class="fas fa-rocket"></i>
                        <span>🎉 LAUNCH DAY! 🎉</span>
                    </div>
                </div>
            `;
        }
    }

    setupNavigation() {
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

        // Mobile menu toggle (if needed)
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });
        }
    }

    setupScrollEffects() {
        // Add scroll effects for better UX
        let lastScrollTop = 0;
        const navbar = document.querySelector('.navbar');

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Add shadow to navbar when scrolling
            if (navbar) {
                if (scrollTop > 10) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }

            lastScrollTop = scrollTop;
        });
    }

    setupFormAnalytics() {
        // Track form interactions for analytics
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                // Track form submission
                console.log('Form submitted:', form.id || form.className);

                // Add conversion tracking here
                this.trackConversion('form_submission', {
                    form_type: form.id || 'unknown',
                    timestamp: new Date().toISOString()
                });
            });
        });
    }

    trackConversion(eventType, data) {
        // In a real application, send this to your analytics service
        console.log(`[Analytics] ${eventType}:`, data);

        // Example: Google Analytics
        if (window.gtag) {
            gtag('event', eventType, data);
        }

        // Example: Facebook Pixel
        if (window.fbq) {
            fbq('track', eventType, data);
        }
    }

    // Utility methods
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HelensvaleConnect();
});
