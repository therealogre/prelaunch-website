// Role-Based Registration System
class RoleBasedRegistration {
    constructor() {
        this.accessKey = '5c0b9311-f7eb-4a05-b1bd-c690b73f463d';
        this.locations = {
            harare: {
                name: 'Harare',
                suburbs: [
                    'Avondale', 'Belvedere', 'Borrowdale', 'Chisipite', 'Glen Lorne',
                    'Greendale', 'Highlands', 'Marlborough', 'Mount Pleasant', 'Newlands',
                    'Pomona', 'Ridgeview', 'Strathaven', 'The Grange', 'Waterfalls',
                    'Westgate', 'Woodlands', 'Arcadia', 'Ashdown Park', 'Ballantyne Park'
                ]
            },
            bulawayo: {
                name: 'Bulawayo',
                suburbs: [
                    'Ascot', 'Barham Green', 'Belmont', 'Burnside', 'Cowdray Park',
                    'Emakhandeni', 'Entumbane', 'Famona', 'Hillside', 'Hyde Park'
                ]
            }
        };
        this.init();
    }

    init() {
        this.createRegistrationButtons();
        this.bindEvents();
    }

    createRegistrationButtons() {
        // Replace existing registration forms with role-based buttons
        const existingForms = document.querySelectorAll('#earlyAccessForm');
        existingForms.forEach(form => {
            const container = form.parentElement;
            container.innerHTML = `
                <div class="role-selection-container">
                    <h3>🚀 Choose Your Registration Type</h3>
                    <div class="role-buttons">
                        <button class="role-btn customer-btn" data-role="customer">
                            <div class="role-icon">👤</div>
                            <div class="role-info">
                                <h4>Join as Customer</h4>
                                <p>Shop and discover amazing products</p>
                                <small>Free & Premium options available</small>
                            </div>
                        </button>
                        <button class="role-btn business-btn" data-role="business">
                            <div class="role-icon">🏪</div>
                            <div class="role-info">
                                <h4>Join as Business</h4>
                                <p>Sell and grow your business</p>
                                <small>Choose your package at launch</small>
                            </div>
                        </button>
                    </div>
                </div>
            `;
        });
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-role="customer"]')) {
                this.showCustomerRegistration();
            }
            if (e.target.closest('[data-role="business"]')) {
                this.showBusinessRegistration();
            }
        });
    }

    showCustomerRegistration() {
        // Simple customer registration modal
        const modal = document.createElement('div');
        modal.className = 'simple-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h2>Customer Registration</h2>
                <div class="registration-options">
                    <div class="option free-option">
                        <h3>🎉 Free Registration</h3>
                        <p>Get notified at launch</p>
                        <button class="btn btn-primary" onclick="this.showFreeForm()">Register Free</button>
                    </div>
                    <div class="option premium-option">
                        <h3>👑 Premium Registration</h3>
                        <p>$1.99/month - Premium benefits</p>
                        <button class="btn btn-premium" onclick="this.showPremiumForm()">Go Premium</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.classList.add('active');
        
        // Close modal
        modal.querySelector('.modal-close').onclick = () => {
            modal.remove();
        };
    }

    showBusinessRegistration() {
        // Simple business registration
        window.location.href = 'business-registration.html';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new RoleBasedRegistration();
});

// Simple CSS
const css = `
.role-selection-container {
    text-align: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.role-buttons {
    display: grid;
    gap: 1rem;
    margin-top: 2rem;
}

.role-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
}

.role-btn:hover {
    border-color: var(--accent-primary);
    background: rgba(59, 130, 246, 0.1);
    transform: translateY(-2px);
}

.role-icon {
    font-size: 2rem;
}

.role-info h4 {
    margin: 0 0 0.5rem 0;
    color: var(--text-primary);
}

.role-info p {
    margin: 0 0 0.25rem 0;
    color: var(--text-secondary);
}

.role-info small {
    color: var(--text-secondary);
    opacity: 0.8;
}

.simple-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.simple-modal.active {
    opacity: 1;
}

.modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
}

.modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--card-bg);
    padding: 2rem;
    border-radius: 16px;
    max-width: 500px;
    width: 90%;
}

.modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-secondary);
    cursor: pointer;
}

.registration-options {
    display: grid;
    gap: 1rem;
    margin-top: 1.5rem;
}

.option {
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    text-align: center;
}

.premium-option {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 237, 78, 0.1));
    border-color: rgba(255, 215, 0, 0.3);
}

@media (max-width: 768px) {
    .role-btn {
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;
    }
}
`;

const style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);
