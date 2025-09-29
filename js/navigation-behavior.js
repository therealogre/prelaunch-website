/**
 * Navigation Behavior
 * Handles scroll effects, dropdowns, and mobile menu functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.main-nav');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    // Add scroll class to navbar on scroll
    function handleScroll() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
    
    // Initialize scroll event
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once on load
    
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            document.body.classList.toggle('nav-open');
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            navActions.classList.toggle('active');
            
            // Toggle aria-expanded for accessibility
            const isExpanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !isExpanded);
        });
    }
    
    // Handle dropdown toggles
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== this.nextElementSibling) {
                    menu.classList.remove('show');
                }
            });
            
            document.querySelectorAll('.dropdown-toggle').forEach(t => {
                if (t !== this) {
                    t.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            this.classList.toggle('active');
            const dropdown = this.nextElementSibling;
            dropdown.classList.toggle('show');
            
            // For mobile, close other dropdowns when opening a new one
            if (window.innerWidth <= 992 && this.classList.contains('active')) {
                const otherDropdowns = document.querySelectorAll('.dropdown-menu:not(.show)');
                otherDropdowns.forEach(dd => dd.classList.remove('show'));
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.matches('.dropdown-toggle') && !e.target.closest('.dropdown-menu')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
            
            document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
                toggle.classList.remove('active');
            });
        }
    });
    
    // Smooth scrolling for anchor links
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's a dropdown toggle or external link
            if (targetId === '#' || targetId.startsWith('http') || targetId.startsWith('mailto:')) {
                return;
            }
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 100; // Adjust based on your header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (window.innerWidth <= 992) {
                    document.body.classList.remove('nav-open');
                    mobileMenuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    navActions.classList.remove('active');
                }
            }
        });
    });
    
    // Add active class to current section in viewport
    const sections = document.querySelectorAll('section[id]');
    
    function setActiveSection() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Run on scroll and resize
    window.addEventListener('scroll', setActiveSection);
    window.addEventListener('resize', setActiveSection);
    setActiveSection(); // Run once on load
    
    // Initialize dropdown arrows
    function initDropdownArrows() {
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        dropdownToggles.forEach(toggle => {
            // Add chevron icon if not already present
            if (!toggle.querySelector('i')) {
                const icon = document.createElement('i');
                icon.className = 'fas fa-chevron-down';
                toggle.appendChild(icon);
            }
            
            // Toggle arrow rotation
            toggle.addEventListener('click', function() {
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = this.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
                }
            });
        });
    }
    
    initDropdownArrows();
});

// Handle window resize events
let resizeTimer;
window.addEventListener('resize', function() {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('resize-animation-stopper');
    }, 400);
});
