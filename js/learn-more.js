// Learn More Interactive Feature
class LearnMoreSystem {
    constructor() {
        this.isOpen = false;
        this.currentSection = 0;
        this.sections = [
            {
                title: "🚀 Revolutionary Marketplace",
                content: "Experience Zimbabwe's first AI-powered marketplace with advanced features designed for the modern economy.",
                features: [
                    "Smart product recommendations",
                    "Real-time inventory tracking", 
                    "Automated pricing optimization",
                    "Multi-currency support (USD, ZWL, Bond)"
                ]
            },
            {
                title: "💎 Premium User Experience",
                content: "Built with cutting-edge technology to provide seamless shopping and selling experiences.",
                features: [
                    "Lightning-fast search results",
                    "Mobile-first responsive design",
                    "One-click checkout process",
                    "Advanced security & fraud protection"
                ]
            },
            {
                title: "🌍 Local Impact, Global Reach",
                content: "Connecting Zimbabwean businesses with local and international customers.",
                features: [
                    "Local delivery network integration",
                    "International shipping options",
                    "Community-driven reviews",
                    "Support for local entrepreneurs"
                ]
            },
            {
                title: "📈 Business Growth Tools",
                content: "Comprehensive analytics and marketing tools to help businesses thrive.",
                features: [
                    "Real-time sales analytics",
                    "Customer behavior insights",
                    "Automated marketing campaigns",
                    "Performance optimization tips"
                ]
            }
        ];
        this.init();
    }

    init() {
        this.createLearnMoreModal();
        this.bindEvents();
    }

    createLearnMoreModal() {
        const modalHTML = `
            <div class="learn-more-modal" id="learnMoreModal">
                <div class="modal-backdrop" id="modalBackdrop"></div>
                <div class="modal-container">
                    <div class="modal-header">
                        <h2 class="modal-title">Discover the Future of Commerce</h2>
                        <button class="modal-close" id="modalClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="progress-indicator">
                            <div class="progress-bar">
                                <div class="progress-fill" id="progressFill"></div>
                            </div>
                            <span class="progress-text" id="progressText">1 of 4</span>
                        </div>
                        
                        <div class="section-content" id="sectionContent">
                            <!-- Dynamic content will be inserted here -->
                        </div>
                        
                        <div class="modal-navigation">
                            <button class="nav-btn prev-btn" id="prevBtn" disabled>
                                <i class="fas fa-chevron-left"></i>
                                Previous
                            </button>
                            <button class="nav-btn next-btn" id="nextBtn">
                                Next
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <div class="cta-section">
                            <p class="cta-text">Ready to join the revolution?</p>
                            <button class="cta-button" onclick="scrollToEarlyAccess(); window.learnMore.close();">
                                🚀 Get Early Access
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    bindEvents() {
        // Open modal events
        const learnMoreBtns = document.querySelectorAll('[onclick*="openLearnMore"]');
        learnMoreBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        });

        // Close modal events
        document.getElementById('modalClose').addEventListener('click', () => this.close());
        document.getElementById('modalBackdrop').addEventListener('click', () => this.close());

        // Navigation events
        document.getElementById('prevBtn').addEventListener('click', () => this.previousSection());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextSection());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            switch(e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowLeft':
                    this.previousSection();
                    break;
                case 'ArrowRight':
                    this.nextSection();
                    break;
            }
        });
    }

    open() {
        this.isOpen = true;
        this.currentSection = 0;
        const modal = document.getElementById('learnMoreModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        this.updateContent();
        this.trackEvent('learn_more_opened');
    }

    close() {
        this.isOpen = false;
        const modal = document.getElementById('learnMoreModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        this.trackEvent('learn_more_closed', { sections_viewed: this.currentSection + 1 });
    }

    nextSection() {
        if (this.currentSection < this.sections.length - 1) {
            this.currentSection++;
            this.updateContent();
            this.trackEvent('section_advanced', { section: this.currentSection });
        }
    }

    previousSection() {
        if (this.currentSection > 0) {
            this.currentSection--;
            this.updateContent();
            this.trackEvent('section_back', { section: this.currentSection });
        }
    }

    updateContent() {
        const section = this.sections[this.currentSection];
        const contentEl = document.getElementById('sectionContent');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        // Update progress
        const progress = ((this.currentSection + 1) / this.sections.length) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${this.currentSection + 1} of ${this.sections.length}`;

        // Update navigation buttons
        prevBtn.disabled = this.currentSection === 0;
        nextBtn.textContent = this.currentSection === this.sections.length - 1 ? 'Finish' : 'Next';
        if (this.currentSection === this.sections.length - 1) {
            nextBtn.innerHTML = 'Finish <i class="fas fa-check"></i>';
            nextBtn.onclick = () => this.close();
        } else {
            nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
            nextBtn.onclick = () => this.nextSection();
        }

        // Update content with animation
        contentEl.style.opacity = '0';
        contentEl.style.transform = 'translateY(20px)';

        setTimeout(() => {
            contentEl.innerHTML = `
                <div class="section-header">
                    <div class="section-icon">${section.title.split(' ')[0]}</div>
                    <h3 class="section-title">${section.title.substring(2)}</h3>
                </div>
                
                <p class="section-description">${section.content}</p>
                
                <div class="features-grid">
                    ${section.features.map((feature, index) => `
                        <div class="feature-item" style="animation-delay: ${index * 0.1}s">
                            <div class="feature-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <span class="feature-text">${feature}</span>
                        </div>
                    `).join('')}
                </div>
                
                ${this.currentSection === this.sections.length - 1 ? `
                    <div class="final-cta">
                        <div class="highlight-box">
                            <h4>🎯 Ready to Transform Your Business?</h4>
                            <p>Join 15,000+ forward-thinking entrepreneurs who are already preparing for Zimbabwe's digital commerce revolution.</p>
                            <div class="stats-mini">
                                <span class="stat-mini">⚡ 2x faster growth</span>
                                <span class="stat-mini">💰 30% more revenue</span>
                                <span class="stat-mini">🌟 98% satisfaction</span>
                            </div>
                        </div>
                    </div>
                ` : ''}
            `;

            contentEl.style.opacity = '1';
            contentEl.style.transform = 'translateY(0)';
        }, 150);
    }

    trackEvent(eventName, data = {}) {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'learn_more',
                ...data
            });
        }
        
        // Console log for development
        console.log(`Learn More Event: ${eventName}`, data);
    }
}

// Initialize Learn More system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.learnMore = new LearnMoreSystem();
});

// Global function for backward compatibility
function openLearnMore() {
    if (window.learnMore) {
        window.learnMore.open();
    }
}

// CSS for Learn More Modal
const learnMoreCSS = `
.learn-more-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.learn-more-modal.active {
    opacity: 1;
    visibility: visible;
}

.learn-more-modal .modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
}

.modal-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.9);
    background: var(--card-bg);
    border-radius: 20px;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    transition: transform 0.3s ease;
}

.learn-more-modal.active .modal-container {
    transform: translate(-50%, -50%) scale(1);
}

.modal-header {
    padding: 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
}

.modal-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
}

.modal-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.modal-close:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
}

.modal-body {
    padding: 2rem;
    overflow-y: auto;
    max-height: 60vh;
}

.progress-indicator {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.progress-bar {
    flex: 1;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
    margin-right: 1rem;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent-primary), #10b981);
    border-radius: 3px;
    transition: width 0.5s ease;
    width: 0%;
}

.progress-text {
    font-size: 0.9rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.section-content {
    transition: all 0.3s ease;
}

.section-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.section-icon {
    font-size: 3rem;
    line-height: 1;
}

.section-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
}

.section-description {
    font-size: 1.1rem;
    line-height: 1.6;
    color: var(--text-secondary);
    margin-bottom: 2rem;
}

.features-grid {
    display: grid;
    gap: 1rem;
    margin-bottom: 2rem;
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    animation: slideInUp 0.5s ease forwards;
    opacity: 0;
    transform: translateY(20px);
}

@keyframes slideInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.feature-icon {
    color: #10b981;
    font-size: 1.2rem;
}

.feature-text {
    color: var(--text-primary);
    font-weight: 500;
}

.final-cta {
    margin-top: 2rem;
}

.highlight-box {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1));
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 15px;
    padding: 2rem;
    text-align: center;
}

.highlight-box h4 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.highlight-box p {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
}

.stats-mini {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.stat-mini {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-primary);
}

.modal-navigation {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 2rem;
}

.nav-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-primary);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
}

.nav-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

.nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.next-btn {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
    color: white;
}

.next-btn:hover {
    background: #2563eb;
    box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);
}

.modal-footer {
    padding: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.2);
}

.cta-section {
    text-align: center;
}

.cta-text {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-bottom: 1rem;
}

.cta-button {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.cta-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
}

@media (max-width: 768px) {
    .modal-container {
        width: 95%;
        max-height: 95vh;
    }
    
    .modal-header,
    .modal-body,
    .modal-footer {
        padding: 1.5rem;
    }
    
    .modal-title {
        font-size: 1.5rem;
    }
    
    .section-title {
        font-size: 1.5rem;
    }
    
    .modal-navigation {
        flex-direction: column;
    }
    
    .nav-btn {
        justify-content: center;
    }
    
    .stats-mini {
        flex-direction: column;
        align-items: center;
    }
}
`;

// Inject CSS
const learnMoreStyle = document.createElement('style');
learnMoreStyle.textContent = learnMoreCSS;
document.head.appendChild(learnMoreStyle);
