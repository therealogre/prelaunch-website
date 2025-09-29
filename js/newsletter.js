// MailerLite integration is now handled server-side via /.netlify/functions/subscribe

document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('newsletter-email');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const email = emailInput.value.trim();
            const subscriptionType = document.querySelector('input[name="subscriptionType"]:checked').value;
            
            // Validate email
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                emailInput.focus();
                return;
            }
            
            // Show loading state
            const submitButton = newsletterForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            
            try {
                // Subscribe via serverless function (keeps API key secure)
                const response = await subscribeViaBackend(email, subscriptionType);
                
                // Show success message
                const message = subscriptionType === 'business' 
                    ? 'Thank you for subscribing as a business owner! We\'ll be in touch with exclusive offers.'
                    : 'Thank you for subscribing! Check your inbox for the latest updates and offers.';
                
                showNotification(message, 'success');
                
                // Reset form
                newsletterForm.reset();
                
            } catch (error) {
                console.error('Subscription error:', error);
                showNotification('Failed to subscribe. Please try again later.', 'error');
            } finally {
                // Reset button state
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    }
    
    // Email validation function
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Function to show notification
    function showNotification(message, type = 'success') {
        // Reuse the notification function from contact.js if available
        if (window.showNotification) {
            window.showNotification(message, type);
            return;
        }
        
        // Fallback notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-hide after 5 seconds
        const autoHide = setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
        
        // Close button functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            clearTimeout(autoHide);
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
    
    // Expose the notification function for other scripts
    window.showNotification = showNotification;
});

// Function to subscribe via backend
async function subscribeViaBackend(email, type) {
    const response = await fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type }),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to subscribe');
    }
    return response.json();
}
