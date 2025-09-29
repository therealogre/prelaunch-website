// Navigation Component
document.addEventListener('DOMContentLoaded', function() {
    // Create navigation HTML
    const navHTML = `
    <nav class="navbar">
        <div class="container">
            <div class="nav-brand">
                <a href="/" class="logo-link">
                    <img src="./assets/logo.svg" alt="Helensvale Connect" class="nav-logo">
                    <span>Helensvale Connect</span>
                </a>
            </div>
            
            <!-- Mobile Menu Button -->
            <button class="mobile-menu-btn" aria-label="Toggle navigation">
                <i class="fas fa-bars"></i>
            </button>
            
            <div class="nav-menu">
                <!-- For Shoppers Dropdown -->
                <div class="nav-dropdown">
                    <button class="nav-link dropdown-toggle">
                        For Shoppers <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="dropdown-menu">
                        <a href="#customers" class="dropdown-item">Browse Stores</a>
                        <a href="customer-vip.html" class="dropdown-item">VIP Membership</a>
                        <a href="#deals" class="dropdown-item">Exclusive Deals</a>
                        <a href="#how-it-works" class="dropdown-item">How It Works</a>
                    </div>
                </div>
                
                <!-- For Businesses Dropdown -->
                <div class="nav-dropdown">
                    <button class="nav-link dropdown-toggle">
                    </a>
                </div>
                
                <div class="nav-links">
                    <div class="nav-item">
                        <a href="/" class="nav-link active">Home</a>
                    </div>
                    
                    <div class="nav-item dropdown">
                        <a href="#" class="nav-link dropdown-toggle">For Shoppers <i class="fas fa-chevron-down"></i></a>
                        <div class="dropdown-menu">
                            <a href="/customer-dashboard.html" class="dropdown-item">Browse Stores</a>
                            <a href="/customer-vip.html" class="dropdown-item">VIP Membership</a>
                            <a href="/deals.html" class="dropdown-item">Exclusive Deals</a>
                            <div class="dropdown-divider"></div>
                            <a href="/how-it-works.html" class="dropdown-item">How It Works</a>
                        </div>
                    </div>
                    
                    <div class="nav-item dropdown">
                        <a href="#" class="nav-link dropdown-toggle">For Businesses <i class="fas fa-chevron-down"></i></a>
                        <div class="dropdown-menu">
                            <a href="/business-registration-new.html" class="dropdown-item">Register Your Business</a>
                            <a href="/business.html" class="dropdown-item">Business Dashboard</a>
                            <a href="/business/success-stories.html" class="dropdown-item">Success Stories</a>
                            <div class="dropdown-divider"></div>
                            <a href="/pricing.html" class="dropdown-item">Pricing Plans</a>
                        </div>
                    </div>
                    
                    <div class="nav-item dropdown">
                        <a href="#" class="nav-link dropdown-toggle">About Us <i class="fas fa-chevron-down"></i></a>
                        <div class="dropdown-menu">
                            <a href="/about.html" class="dropdown-item">Our Story</a>
                            <a href="/team.html" class="dropdown-item">Our Team</a>
                            <a href="/blog" class="dropdown-item">Blog</a>
                            <a href="/press.html" class="dropdown-item">Press</a>
                        </div>
                    </div>
                    
                    <a href="#contact" class="nav-link">Contact</a>
                </div>
                
                <div class="nav-actions">
                    <a href="/login.html" class="btn btn-outline">Log In</a>
                    <a href="/register.html" class="btn btn-primary">Sign Up</a>
                </div>
                
                <button class="mobile-menu-toggle" aria-label="Toggle menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    `;

    // Insert navigation at the beginning of the body
    document.body.insertAdjacentHTML('afterbegin', navHTML);

    // Mobile menu toggle functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    // Toggle mobile menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            navActions.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    }

    // Handle dropdown toggles on desktop
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth > 992) { // Desktop
                e.preventDefault();
                const dropdown = this.nextElementSibling;
                const isOpen = this.classList.contains('active');
                
                // Close all other dropdowns
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    if (menu !== dropdown) {
                        menu.classList.remove('show');
                    }
                });
                
                document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
                    if (toggle !== this) {
                        toggle.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                this.classList.toggle('active');
                dropdown.classList.toggle('show');
            // Toggle current dropdown
            if (isActive) {
                dropdown.classList.remove('show');
            } else {
                dropdown.classList.add('show');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
});
