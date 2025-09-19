// Advanced User Experience Features
class UXEnhancements {
    constructor() {
        this.init();
        this.setupProgressTracking();
        this.setupSmartFeatures();
        this.setupAccessibilityEnhancements();
    }

    init() {
        this.setupReadingProgress();
        this.setupScrollToTop();
        this.setupImageLazyLoading();
        this.setupTooltips();
        this.setupKeyboardNavigation();
        this.setupDarkModeToggle();
    }

    setupReadingProgress() {
        // Create reading progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.setAttribute('aria-label', 'Reading progress');
        document.body.appendChild(progressBar);

        // Update progress on scroll
        const updateProgress = () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        };

        window.addEventListener('scroll', this.throttle(updateProgress, 10));
    }

    setupScrollToTop() {
        // Create scroll to top button
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        scrollBtn.style.display = 'none';
        document.body.appendChild(scrollBtn);

        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.style.display = 'flex';
                scrollBtn.classList.add('animate-fade-in-up');
            } else {
                scrollBtn.style.display = 'none';
                scrollBtn.classList.remove('animate-fade-in-up');
            }
        });

        // Scroll to top functionality
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    setupImageLazyLoading() {
        // Intersection Observer for lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        // Observe all lazy images
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    setupTooltips() {
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.style.display = 'none';
        document.body.appendChild(tooltip);

        // Handle tooltip events
        document.addEventListener('mouseenter', (e) => {
            const element = e.target.closest('[data-tooltip]');
            if (element) {
                const text = element.dataset.tooltip;
                tooltip.textContent = text;
                tooltip.style.display = 'block';
                this.positionTooltip(tooltip, element);
            }
        });

        document.addEventListener('mouseleave', (e) => {
            const element = e.target.closest('[data-tooltip]');
            if (element) {
                tooltip.style.display = 'none';
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (tooltip.style.display === 'block') {
                tooltip.style.left = e.pageX + 10 + 'px';
                tooltip.style.top = e.pageY - 30 + 'px';
            }
        });
    }

    positionTooltip(tooltip, element) {
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 10;

        // Adjust if tooltip goes off screen
        if (left < 0) left = 10;
        if (left + tooltipRect.width > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 0) {
            top = rect.bottom + 10;
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Skip links with Tab
            if (e.key === 'Tab' && !e.shiftKey) {
                const focusableElements = this.getFocusableElements();
                const currentIndex = focusableElements.indexOf(document.activeElement);
                
                if (currentIndex === focusableElements.length - 1) {
                    e.preventDefault();
                    focusableElements[0].focus();
                }
            }

            // Navigate with arrow keys in menus
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                const activeElement = document.activeElement;
                if (activeElement.closest('.dropdown-menu')) {
                    e.preventDefault();
                    this.navigateMenu(activeElement, e.key === 'ArrowDown' ? 1 : -1);
                }
            }

            // Close modals with Escape
            if (e.key === 'Escape') {
                const modal = document.querySelector('.modal.active');
                if (modal) {
                    this.closeModal(modal);
                }
                
                const dropdown = document.querySelector('.dropdown.active');
                if (dropdown) {
                    dropdown.classList.remove('active');
                }
            }

            // Quick navigation shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'k':
                        e.preventDefault();
                        this.openSearch();
                        break;
                    case '/':
                        e.preventDefault();
                        this.focusSearchInput();
                        break;
                }
            }
        });
    }

    getFocusableElements() {
        return Array.from(document.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter(el => {
            return el.offsetWidth > 0 && el.offsetHeight > 0;
        });
    }

    navigateMenu(currentElement, direction) {
        const menuItems = Array.from(currentElement.closest('.dropdown-menu').querySelectorAll('a, button'));
        const currentIndex = menuItems.indexOf(currentElement);
        const nextIndex = (currentIndex + direction + menuItems.length) % menuItems.length;
        menuItems[nextIndex].focus();
    }

    setupDarkModeToggle() {
        // Create dark mode toggle
        const toggle = document.createElement('button');
        toggle.className = 'dark-mode-toggle';
        toggle.innerHTML = '<i class="fas fa-moon"></i>';
        toggle.setAttribute('aria-label', 'Toggle dark mode');
        toggle.setAttribute('data-tooltip', 'Toggle dark mode');
        
        // Add to navigation or create floating button
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.appendChild(toggle);
        } else {
            toggle.classList.add('floating-toggle');
            document.body.appendChild(toggle);
        }

        // Check for saved preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            toggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        // Toggle functionality
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            
            toggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            // Announce to screen readers
            this.announceToScreenReader(`Switched to ${isDark ? 'dark' : 'light'} mode`);
        });
    }

    setupProgressTracking() {
        // Track user progress through forms
        this.setupFormProgress();
        
        // Track reading progress for articles
        this.setupArticleProgress();
        
        // Track onboarding progress
        this.setupOnboardingProgress();
    }

    setupFormProgress() {
        document.querySelectorAll('form[data-validate]').forEach(form => {
            const fields = form.querySelectorAll('input, textarea, select');
            const progressBar = this.createProgressBar(form);
            
            fields.forEach(field => {
                field.addEventListener('input', () => {
                    this.updateFormProgress(form, progressBar);
                });
                
                field.addEventListener('blur', () => {
                    this.updateFormProgress(form, progressBar);
                });
            });
        });
    }

    createProgressBar(form) {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'form-progress-container';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'form-progress-bar';
        
        const progressText = document.createElement('span');
        progressText.className = 'form-progress-text';
        progressText.textContent = '0% Complete';
        
        progressContainer.appendChild(progressText);
        progressContainer.appendChild(progressBar);
        
        form.insertBefore(progressContainer, form.firstChild);
        return { bar: progressBar, text: progressText };
    }

    updateFormProgress(form, progressElements) {
        const fields = form.querySelectorAll('input[required], textarea[required], select[required]');
        let completed = 0;
        
        fields.forEach(field => {
            if (field.value.trim() !== '' && !field.classList.contains('error')) {
                completed++;
            }
        });
        
        const percentage = Math.round((completed / fields.length) * 100);
        progressElements.bar.style.width = percentage + '%';
        progressElements.text.textContent = `${percentage}% Complete`;
        
        // Add visual feedback
        if (percentage === 100) {
            progressElements.bar.classList.add('complete');
            this.showCompletionAnimation(form);
        } else {
            progressElements.bar.classList.remove('complete');
        }
    }

    showCompletionAnimation(form) {
        // Create success checkmark animation
        const checkmark = document.createElement('div');
        checkmark.className = 'completion-checkmark';
        checkmark.innerHTML = '<i class="fas fa-check"></i>';
        
        form.appendChild(checkmark);
        
        setTimeout(() => {
            checkmark.classList.add('animate-scale-in');
        }, 100);
        
        setTimeout(() => {
            checkmark.remove();
        }, 2000);
    }

    setupSmartFeatures() {
        this.setupSmartSearch();
        this.setupAutoSave();
        this.setupSmartNotifications();
        this.setupContextualHelp();
    }

    setupSmartSearch() {
        // Create search overlay
        const searchOverlay = document.createElement('div');
        searchOverlay.className = 'search-overlay';
        searchOverlay.innerHTML = `
            <div class="search-container">
                <input type="text" class="search-input" placeholder="Search...">
                <div class="search-results"></div>
            </div>
        `;
        document.body.appendChild(searchOverlay);
        
        const searchInput = searchOverlay.querySelector('.search-input');
        const searchResults = searchOverlay.querySelector('.search-results');
        
        // Search functionality
        searchInput.addEventListener('input', this.debounce((e) => {
            const query = e.target.value.trim();
            if (query.length > 2) {
                this.performSearch(query, searchResults);
            } else {
                searchResults.innerHTML = '';
            }
        }, 300));
        
        // Close search on escape or outside click
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                this.closeSearch();
            }
        });
    }

    openSearch() {
        const searchOverlay = document.querySelector('.search-overlay');
        searchOverlay.classList.add('active');
        searchOverlay.querySelector('.search-input').focus();
    }

    closeSearch() {
        const searchOverlay = document.querySelector('.search-overlay');
        searchOverlay.classList.remove('active');
        searchOverlay.querySelector('.search-input').value = '';
        searchOverlay.querySelector('.search-results').innerHTML = '';
    }

    performSearch(query, resultsContainer) {
        // Search through page content
        const searchableElements = document.querySelectorAll('h1, h2, h3, h4, p, a');
        const results = [];
        
        searchableElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes(query.toLowerCase())) {
                results.push({
                    element,
                    text: element.textContent.trim(),
                    type: element.tagName.toLowerCase()
                });
            }
        });
        
        // Display results
        if (results.length > 0) {
            resultsContainer.innerHTML = results.slice(0, 10).map(result => `
                <div class="search-result" data-element="${result.element.id || ''}">
                    <span class="result-type">${result.type}</span>
                    <span class="result-text">${this.highlightQuery(result.text, query)}</span>
                </div>
            `).join('');
            
            // Add click handlers
            resultsContainer.querySelectorAll('.search-result').forEach((result, index) => {
                result.addEventListener('click', () => {
                    const element = results[index].element;
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    this.closeSearch();
                    
                    // Highlight the found element
                    element.classList.add('search-highlight');
                    setTimeout(() => {
                        element.classList.remove('search-highlight');
                    }, 3000);
                });
            });
        } else {
            resultsContainer.innerHTML = '<div class="no-results">No results found</div>';
        }
    }

    highlightQuery(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    setupAutoSave() {
        // Auto-save form data to localStorage
        document.querySelectorAll('form').forEach(form => {
            const formId = form.id || 'form_' + Date.now();
            
            // Load saved data
            this.loadFormData(form, formId);
            
            // Save data on input
            form.addEventListener('input', this.debounce(() => {
                this.saveFormData(form, formId);
            }, 1000));
        });
    }

    saveFormData(form, formId) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        localStorage.setItem(`form_${formId}`, JSON.stringify(data));
        
        // Show auto-save indicator
        this.showAutoSaveIndicator(form);
    }

    loadFormData(form, formId) {
        const savedData = localStorage.getItem(`form_${formId}`);
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.entries(data).forEach(([name, value]) => {
                const field = form.querySelector(`[name="${name}"]`);
                if (field) {
                    field.value = value;
                }
            });
        }
    }

    showAutoSaveIndicator(form) {
        let indicator = form.querySelector('.auto-save-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'auto-save-indicator';
            indicator.innerHTML = '<i class="fas fa-save"></i> Auto-saved';
            form.appendChild(indicator);
        }
        
        indicator.classList.add('show');
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 2000);
    }

    setupAccessibilityEnhancements() {
        this.setupScreenReaderAnnouncements();
        this.setupFocusManagement();
        this.setupHighContrastMode();
        this.setupReducedMotion();
    }

    setupScreenReaderAnnouncements() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    }

    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    setupFocusManagement() {
        // Trap focus in modals
        document.addEventListener('keydown', (e) => {
            const modal = document.querySelector('.modal.active');
            if (modal && e.key === 'Tab') {
                this.trapFocus(modal, e);
            }
        });
    }

    trapFocus(container, event) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                event.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                event.preventDefault();
            }
        }
    }

    // Utility methods
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
}

// Initialize UX enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.uxEnhancements = new UXEnhancements();
});

// Add CSS for UX enhancements
const uxCSS = `
.reading-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
    z-index: 9999;
    transition: width 0.3s ease;
}

.scroll-to-top {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: var(--accent-primary);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    transition: all 0.3s ease;
}

.scroll-to-top:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.tooltip {
    position: absolute;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 14px;
    z-index: 10000;
    pointer-events: none;
    max-width: 200px;
    word-wrap: break-word;
}

.dark-mode-toggle {
    background: none;
    border: none;
    color: var(--text-primary);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.dark-mode-toggle:hover {
    background: rgba(255, 255, 255, 0.1);
}

.floating-toggle {
    position: fixed;
    top: 20px;
    right: 80px;
    z-index: 1000;
}

.dark-mode {
    --text-primary: #ffffff;
    --text-secondary: #b3b3b3;
    --bg-primary: #1a1a1a;
    --bg-secondary: #2a2a2a;
    --card-bg: #2a2a2a;
    --border-color: #404040;
}

.form-progress-container {
    margin-bottom: 1rem;
}

.form-progress-text {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
    display: block;
}

.form-progress-bar {
    width: 0%;
    height: 4px;
    background: var(--accent-primary);
    border-radius: 2px;
    transition: width 0.3s ease;
    position: relative;
    overflow: hidden;
}

.form-progress-bar.complete {
    background: #10b981;
}

.completion-checkmark {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    background: #10b981;
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: translateY(-50%) scale(0);
    transition: all 0.3s ease;
}

.completion-checkmark.animate-scale-in {
    opacity: 1;
    transform: translateY(-50%) scale(1);
}

.search-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 10000;
    display: none;
    align-items: flex-start;
    justify-content: center;
    padding-top: 100px;
}

.search-overlay.active {
    display: flex;
}

.search-container {
    background: var(--card-bg);
    border-radius: 8px;
    padding: 20px;
    width: 90%;
    max-width: 600px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.search-input {
    width: 100%;
    padding: 15px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 1.1rem;
    margin-bottom: 20px;
}

.search-results {
    max-height: 400px;
    overflow-y: auto;
}

.search-result {
    padding: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: background 0.2s ease;
}

.search-result:hover {
    background: rgba(255, 255, 255, 0.05);
}

.result-type {
    background: var(--accent-primary);
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    margin-right: 10px;
}

.search-highlight {
    background: rgba(255, 255, 0, 0.3);
    transition: background 3s ease;
}

.auto-save-indicator {
    position: absolute;
    top: -30px;
    right: 0;
    background: #10b981;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
}

.auto-save-indicator.show {
    opacity: 1;
    transform: translateY(0);
}

.no-results {
    text-align: center;
    color: var(--text-secondary);
    padding: 20px;
}

@media (prefers-reduced-motion: reduce) {
    .reading-progress,
    .scroll-to-top,
    .form-progress-bar,
    .completion-checkmark {
        transition: none;
    }
}
`;

// Inject UX CSS
const uxStyle = document.createElement('style');
uxStyle.textContent = uxCSS;
document.head.appendChild(uxStyle);
