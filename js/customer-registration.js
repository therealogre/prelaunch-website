// Customer Registration System
class CustomerRegistration {
    constructor() {
        this.accessKey = '5c0b9311-f7eb-4a05-b1bd-c690b73f463d';
        this.locations = {
            harare: ['Avondale', 'Belvedere', 'Borrowdale', 'Chisipite', 'Glen Lorne', 'Greendale', 'Highlands', 'Marlborough', 'Mount Pleasant', 'Newlands', 'Pomona', 'Ridgeview', 'Strathaven', 'The Grange', 'Waterfalls', 'Westgate', 'Woodlands', 'Arcadia', 'Ashdown Park', 'Ballantyne Park', 'Braeside', 'Eastlea', 'Greystone Park', 'Hatfield', 'Hillside', 'Kensington', 'Kopje', 'Lewisam', 'Mabelreign', 'Milton Park', 'Msasa', 'Prospect', 'Queensdale', 'Rietfontein', 'Southerton', 'Tafara', 'Warren Park', 'Zengeza'],
            bulawayo: ['Ascot', 'Barham Green', 'Belmont', 'Burnside', 'Cowdray Park', 'Emakhandeni', 'Entumbane', 'Famona', 'Hillside', 'Hyde Park', 'Khumalo', 'Kumalo', 'Llewellin', 'Lobengula', 'Mahatshula', 'Matsheumhlope', 'Nketa', 'North End', 'Northlea', 'Parklands', 'Queens Park', 'Richmond', 'Riverside', 'Sizinda', 'Suburbs', 'Tshabalala', 'Waterford'],
            mutare: ['Chikanga', 'Dangamvura', 'Fairbridge Park', 'Florida', 'Greenside', 'Hobhouse', 'Murambi', 'Palmerston', 'Sakubva', 'Tiger Reef', 'Zimunya Park'],
            gweru: ['Ascot', 'Athlone', 'Kopje', 'Lochview', 'Mkoba', 'Northlea', 'Ridgemont', 'Riverside', 'Senga', 'Woodlands'],
            kwekwe: ['Amaveni', 'Fitchlea', 'Goldross', 'Mbizo', 'Newtown', 'Redcliff', 'Torwood', 'Zishagwe']
        };
        this.init();
    }

    init() {
        this.setupLocationSelectors();
        this.bindFormEvents();
        this.addCustomCSS();
    }

    setupLocationSelectors() {
        document.addEventListener('change', (e) => {
            if (e.target.matches('.city-select')) {
                this.updateSuburbOptions(e.target);
            }
        });
    }

    updateSuburbOptions(citySelect) {
        const selectedCity = citySelect.value;
        const form = citySelect.closest('form');
        const suburbGroup = form.querySelector('.suburb-group');
        const suburbSelect = suburbGroup.querySelector('.suburb-select');

        if (selectedCity && this.locations[selectedCity]) {
            const suburbs = this.locations[selectedCity];
            suburbSelect.innerHTML = '<option value="">Select Suburb/Area</option>';
            
            suburbs.forEach(suburb => {
                const option = document.createElement('option');
                option.value = suburb.toLowerCase().replace(/\s+/g, '-');
                option.textContent = suburb;
                suburbSelect.appendChild(option);
            });
            
            suburbGroup.style.display = 'block';
        } else {
            suburbGroup.style.display = 'none';
        }
    }

    bindFormEvents() {
        document.addEventListener('submit', (e) => {
            if (e.target.matches('#freeCustomerForm')) {
                e.preventDefault();
                this.handleFreeRegistration(e.target);
            }
            if (e.target.matches('#premiumCustomerForm')) {
                e.preventDefault();
                this.handlePremiumRegistration(e.target);
            }
        });
    }

    async handleFreeRegistration(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(form);
            const data = {
                access_key: this.accessKey,
                subject: 'New Free Customer Registration - Helensvale Connect',
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                city: formData.get('city'),
                suburb: formData.get('suburb'),
                registration_type: 'free_customer',
                timestamp: new Date().toISOString()
            };

            await this.submitToWeb3Forms(data);
            this.showSuccess(form, 'free');
            
        } catch (error) {
            this.showError(form, 'Registration failed. Please try again.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handlePremiumRegistration(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(form);
            
            // Store registration data for after payment
            const registrationData = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                city: formData.get('city'),
                suburb: formData.get('suburb'),
                registration_type: 'premium_customer'
            };
            
            localStorage.setItem('pendingPremiumRegistration', JSON.stringify(registrationData));
            
            // Redirect to PayNow for payment
            this.redirectToPayNow(registrationData.email);
            
        } catch (error) {
            this.showError(form, 'Registration failed. Please try again.');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    redirectToPayNow(email) {
        const paymentData = {
            amount: 1.99,
            reference: `PREMIUM_${Date.now()}`,
            additionalinfo: `Premium Customer Registration - ${email}`,
            returnurl: `${window.location.origin}/premium-success.html`,
            resulturl: `${window.location.origin}/payment-result.html`,
            authemail: email,
            type: 'premium_customer'
        };
        
        localStorage.setItem('paymentData', JSON.stringify(paymentData));
        window.location.href = 'payment.html';
    }

    async submitToWeb3Forms(data) {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Submission failed');
        return response.json();
    }

    showSuccess(form, type) {
        const messages = {
            free: {
                icon: '🎉',
                title: 'Welcome to Helensvale Connect!',
                message: 'You\'re now registered for launch notifications.',
                sub: 'We\'ll notify you 24 hours before launch with exclusive early access.'
            }
        };

        const msg = messages[type];
        form.innerHTML = `
            <div class="success-message">
                <div class="success-icon">${msg.icon}</div>
                <h3>${msg.title}</h3>
                <p>${msg.message}</p>
                <small>${msg.sub}</small>
                <div class="success-actions">
                    <a href="index.html" class="btn btn-secondary">Back to Home</a>
                </div>
            </div>
        `;
    }

    showError(form, message) {
        const errorEl = document.createElement('div');
        errorEl.className = 'form-error';
        errorEl.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        form.insertBefore(errorEl, form.firstChild);
        
        setTimeout(() => errorEl.remove(), 5000);
    }

    addCustomCSS() {
        const css = `
            .registration-section {
                padding: 4rem 0;
                background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
            }

            .registration-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 2rem;
                max-width: 1000px;
                margin: 0 auto;
            }

            .registration-card {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 2rem;
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
            }

            .registration-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }

            .premium-card {
                border-color: rgba(255, 215, 0, 0.3);
                background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 237, 78, 0.1));
                position: relative;
            }

            .premium-badge {
                position: absolute;
                top: -10px;
                right: 1rem;
                background: linear-gradient(135deg, #ffd700, #ffed4e);
                color: #1a1a1a;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
                box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
            }

            .card-header {
                text-align: center;
                margin-bottom: 2rem;
            }

            .card-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }

            .card-header h3 {
                margin: 0 0 0.5rem 0;
                color: var(--text-primary);
                font-size: 1.5rem;
            }

            .card-header p {
                color: var(--text-secondary);
                margin: 0;
            }

            .price {
                font-size: 2rem;
                font-weight: 700;
                color: var(--accent-primary);
                margin-top: 0.5rem;
            }

            .price span {
                font-size: 1rem;
                color: var(--text-secondary);
            }

            .card-benefits {
                margin-bottom: 2rem;
            }

            .card-benefits h4 {
                color: var(--text-primary);
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }

            .card-benefits ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .card-benefits li {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.5rem 0;
                color: var(--text-secondary);
                font-size: 0.9rem;
            }

            .card-benefits li i {
                color: #10b981;
                width: 16px;
            }

            .premium-card .card-benefits li i {
                color: #ffd700;
            }

            .form-group {
                margin-bottom: 1.5rem;
            }

            .form-group input,
            .form-group select {
                width: 100%;
                padding: 1rem;
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.05);
                color: var(--text-primary);
                font-size: 1rem;
                transition: all 0.3s ease;
            }

            .form-group input:focus,
            .form-group select:focus {
                outline: none;
                border-color: var(--accent-primary);
                background: rgba(255, 255, 255, 0.1);
            }

            .form-group input::placeholder {
                color: var(--text-secondary);
            }

            .btn-premium {
                background: linear-gradient(135deg, #ffd700, #ffed4e);
                color: #1a1a1a;
                border: none;
                font-weight: 600;
            }

            .btn-premium:hover {
                background: linear-gradient(135deg, #ffed4e, #ffd700);
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
            }

            .form-note {
                text-align: center;
                margin-top: 1rem;
                color: var(--text-secondary);
                font-size: 0.9rem;
            }

            .success-message {
                text-align: center;
                padding: 2rem;
            }

            .success-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }

            .success-message h3 {
                color: var(--text-primary);
                margin-bottom: 1rem;
            }

            .success-message p {
                color: var(--text-secondary);
                margin-bottom: 0.5rem;
            }

            .success-message small {
                color: var(--text-secondary);
                opacity: 0.8;
            }

            .success-actions {
                margin-top: 2rem;
            }

            .form-error {
                background: rgba(239, 68, 68, 0.1);
                border: 1px solid rgba(239, 68, 68, 0.3);
                color: #ef4444;
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            @media (max-width: 768px) {
                .registration-options {
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }
                
                .registration-card {
                    padding: 1.5rem;
                }
            }
        `;

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CustomerRegistration();
});
