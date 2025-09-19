// Dynamic Navigation System for Helensvale Connect
// Enterprise-level navigation with modern features

class NavigationSystem {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.navigationData = this.getNavigationStructure();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page.replace('.html', '') || 'index';
    }

    getNavigationStructure() {
        return {
            main: [
                { id: 'index', label: 'Home', url: 'index.html', icon: 'fas fa-home' },
                { id: 'features', label: 'Features', url: 'features.html', icon: 'fas fa-star' },
                { id: 'pricing', label: 'Pricing', url: 'pricing.html', icon: 'fas fa-tags' },
                { id: 'partnerships', label: 'Partners', url: 'partnerships.html', icon: 'fas fa-handshake' }
            ],
            company: [
                { id: 'about', label: 'About Us', url: 'about.html', icon: 'fas fa-info-circle' },
                { id: 'contact', label: 'Contact', url: 'contact.html', icon: 'fas fa-envelope' },
                { id: 'guides', label: 'Guides', url: 'guides.html', icon: 'fas fa-book' }
            ],
            support: [
                { id: 'help', label: 'Help Center', url: 'help.html', icon: 'fas fa-question-circle' },
                { id: 'faq', label: 'FAQ', url: 'faq.html', icon: 'fas fa-comments' }
            ]
        };
    }

    init() {
        this.createDynamicNavigation();
        this.addNavigationEvents();
        this.updateActiveStates();
        this.addBreadcrumbs();
        this.addPageTransitions();
    }

    createDynamicNavigation() {
        // Update all navigation bars across the site
        const navbars = document.querySelectorAll('.navbar, nav');
        
        navbars.forEach(navbar => {
            this.enhanceNavbar(navbar);
        });

        // Create mobile navigation if it doesn't exist
        this.createMobileNavigation();
    }

    enhanceNavbar(navbar) {
        const navLinks = navbar.querySelector('.nav-links, .desktop-nav');
        if (!navLinks) return;

        // Clear existing links and rebuild with dynamic structure
        const existingCTA = navbar.querySelector('.nav-cta');
        
        navLinks.innerHTML = '';
        
        // Add main navigation items
        this.navigationData.main.forEach(item => {
            const link = this.createNavLink(item);
            navLinks.appendChild(link);
        });

        // Add dropdown for company pages
        const companyDropdown = this.createDropdown('Company', this.navigationData.company);
        navLinks.appendChild(companyDropdown);

        // Add dropdown for support pages
        const supportDropdown = this.createDropdown('Support', this.navigationData.support);
        navLinks.appendChild(supportDropdown);
    }

    createNavLink(item) {
        const link = document.createElement('a');
        link.href = item.url;
        link.className = 'nav-link';
        link.innerHTML = `<i class="${item.icon}"></i> ${item.label}`;
        
        if (item.id === this.currentPage) {
            link.classList.add('active');
        }

        return link;
    }

    createDropdown(title, items) {
        const dropdown = document.createElement('div');
        dropdown.className = 'nav-dropdown';
        
        dropdown.innerHTML = `
            <a href="#" class="nav-link dropdown-toggle">
                <i class="fas fa-chevron-down"></i> ${title}
            </a>
            <div class="dropdown-menu">
                ${items.map(item => `
                    <a href="${item.url}" class="dropdown-item ${item.id === this.currentPage ? 'active' : ''}">
                        <i class="${item.icon}"></i> ${item.label}
                    </a>
                `).join('')}
            </div>
        `;

        return dropdown;
    }

    createMobileNavigation() {
        let mobileSidebar = document.querySelector('.mobile-sidebar');
        
        if (!mobileSidebar) {
            mobileSidebar = document.createElement('div');
            mobileSidebar.className = 'mobile-sidebar';
            mobileSidebar.id = 'mobileSidebar';
            document.body.appendChild(mobileSidebar);
        }

        mobileSidebar.innerHTML = `
            <div class="sidebar-header">
                <img src="./assets/logo.svg" alt="Helensvale Connect" class="sidebar-logo">
                <button class="sidebar-close" id="sidebarClose">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="sidebar-content">
                <div class="sidebar-section">
                    <h4>Platform</h4>
                    ${this.navigationData.main.map(item => `
                        <a href="${item.url}" class="sidebar-link ${item.id === this.currentPage ? 'active' : ''}">
                            <i class="${item.icon}"></i> ${item.label}
                        </a>
                    `).join('')}
                </div>
                <div class="sidebar-section">
                    <h4>Company</h4>
                    ${this.navigationData.company.map(item => `
                        <a href="${item.url}" class="sidebar-link ${item.id === this.currentPage ? 'active' : ''}">
                            <i class="${item.icon}"></i> ${item.label}
                        </a>
                    `).join('')}
                </div>
                <div class="sidebar-section">
                    <h4>Support</h4>
                    ${this.navigationData.support.map(item => `
                        <a href="${item.url}" class="sidebar-link ${item.id === this.currentPage ? 'active' : ''}">
                            <i class="${item.icon}"></i> ${item.label}
                        </a>
                    `).join('')}
                </div>
                <div class="sidebar-cta">
                    <a href="index.html#early-access" class="btn btn-primary btn-full">
                        <i class="fas fa-rocket"></i> Get Early Access
                    </a>
                    <div class="social-links">
                        <a href="https://instagram.com/helensvale.connect" target="_blank" class="social-link">
                            <i class="fab fa-instagram"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    addNavigationEvents() {
        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const mobileSidebar = document.getElementById('mobileSidebar');
        const sidebarClose = document.getElementById('sidebarClose');

        if (mobileToggle && mobileSidebar) {
            mobileToggle.addEventListener('click', () => {
                mobileSidebar.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        if (sidebarClose && mobileSidebar) {
            sidebarClose.addEventListener('click', () => {
                mobileSidebar.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileSidebar && !mobileSidebar.contains(e.target) && !mobileToggle?.contains(e.target)) {
                mobileSidebar.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Dropdown functionality
        document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');

            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('active');
                }
            });
        });

        // Smooth page transitions
        document.querySelectorAll('a[href$=".html"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('http') && !href.startsWith('mailto')) {
                    e.preventDefault();
                    this.navigateToPage(href);
                }
            });
        });
    }

    updateActiveStates() {
        // Update active states for all navigation elements
        document.querySelectorAll('.nav-link, .sidebar-link, .dropdown-item').forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                const linkPage = href.replace('.html', '').split('/').pop() || 'index';
                if (linkPage === this.currentPage) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }

    addBreadcrumbs() {
        const breadcrumbContainer = document.querySelector('.breadcrumbs');
        if (!breadcrumbContainer) return;

        const pageInfo = this.getPageInfo(this.currentPage);
        const breadcrumbs = [
            { label: 'Home', url: 'index.html' },
            { label: pageInfo.label, url: pageInfo.url }
        ];

        breadcrumbContainer.innerHTML = breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return `
                <span class="breadcrumb-item ${isLast ? 'active' : ''}">
                    ${isLast ? crumb.label : `<a href="${crumb.url}">${crumb.label}</a>`}
                </span>
            `;
        }).join('<span class="breadcrumb-separator">/</span>');
    }

    getPageInfo(pageId) {
        const allPages = [...this.navigationData.main, ...this.navigationData.company, ...this.navigationData.support];
        return allPages.find(page => page.id === pageId) || { label: 'Page', url: '#' };
    }

    addPageTransitions() {
        // Add loading indicator for page transitions
        const style = document.createElement('style');
        style.textContent = `
            .page-transition {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--bg-primary);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .page-transition.active {
                opacity: 1;
                visibility: visible;
            }
            
            .transition-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(59, 130, 246, 0.3);
                border-top: 3px solid #3b82f6;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        // Create transition overlay
        const transitionOverlay = document.createElement('div');
        transitionOverlay.className = 'page-transition';
        transitionOverlay.innerHTML = '<div class="transition-spinner"></div>';
        document.body.appendChild(transitionOverlay);
    }

    navigateToPage(url) {
        const transitionOverlay = document.querySelector('.page-transition');
        
        if (transitionOverlay) {
            transitionOverlay.classList.add('active');
            
            setTimeout(() => {
                window.location.href = url;
            }, 300);
        } else {
            window.location.href = url;
        }
    }

    // Method to update navigation when page changes
    updateNavigation() {
        this.currentPage = this.getCurrentPage();
        this.updateActiveStates();
        this.addBreadcrumbs();
    }
}

// Initialize navigation system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigationSystem = new NavigationSystem();
});

// Update navigation on page load (for SPA-like behavior)
window.addEventListener('load', () => {
    if (window.navigationSystem) {
        window.navigationSystem.updateNavigation();
    }
});
