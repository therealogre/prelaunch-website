document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('businessInquiryForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Combine country code and phone number
            if (formObject.countryCode && formObject.phone) {
                formObject.fullPhone = `${formObject.countryCode}${formObject.phone}`;
            }
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // In a real application, you would send this data to your server
            // For now, we'll simulate a successful submission
            setTimeout(() => {
                // Show success message
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                
                // Reset form
                contactForm.reset();
                
                // Reset button state
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }, 1500);
        });
    }
    
    // Function to show notification
    function showNotification(message, type = 'success') {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
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
});
