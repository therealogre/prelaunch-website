document.addEventListener('DOMContentLoaded', async () => {
    const statusCard = document.getElementById('payment-status-card');
    const statusIcon = statusCard.querySelector('.status-icon');
    const statusTitle = document.getElementById('status-title');
    const statusMessage = document.getElementById('status-message');
    const homeButton = document.getElementById('home-button');
    const retryButton = document.getElementById('retry-button');
    const businessDashBtn = document.getElementById('business-dash-button');
    const customerDashBtn = document.getElementById('customer-dash-button');

    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');

    if (!reference) {
        updateStatus('error', 'Invalid Payment Reference', 'No payment reference was found. Please return to the homepage and try again.');
        return;
    }

    await verifyOnce();

    // Attach retry handler
    if (retryButton) {
        retryButton.addEventListener('click', async () => {
            updateStatus('verifying', 'Re-checking Payment...', 'We are trying again to confirm your transaction.');
            await verifyOnce();
        });
    }

    function updateStatus(status, title, message) {
        statusIcon.className = `status-icon ${status}`;
        statusTitle.textContent = title;
        statusMessage.textContent = message;

        if (status === 'success') {
            statusIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
        } else if (status === 'error') {
            statusIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
        } else {
            statusIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        }

        // Default hide
        if (homeButton) homeButton.style.display = 'none';
        if (retryButton) retryButton.style.display = 'none';
        if (businessDashBtn) businessDashBtn.style.display = 'none';
        if (customerDashBtn) customerDashBtn.style.display = 'none';

        if (status === 'error') {
            if (homeButton) homeButton.style.display = 'inline-block';
            if (retryButton) retryButton.style.display = 'inline-block';
        }
    }

    async function verifyOnce() {
        try {
            const response = await fetch('/.netlify/functions/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reference }),
            });
            const data = await response.json();

            if (response.ok && data.planId) {
                // Store user data to be used by the dashboard
                const userData = {
                    name: (data.metadata && data.metadata.full_name) || '',
                    email: (data.customer && data.customer.email) || '',
                    planId: data.planId,
                    role: (data.metadata && data.metadata.role) || 'business',
                };
                localStorage.setItem('currentUser', JSON.stringify(userData));

                updateStatus('success', 'Payment Successful!', 'You can continue to your dashboard. A magic login link has also been emailed to you for future logins.');

                // Reveal appropriate buttons
                const roleLower = (userData.role || '').toLowerCase();
                if (roleLower === 'customer') {
                    if (customerDashBtn) customerDashBtn.style.display = 'inline-block';
                } else {
                    if (businessDashBtn) businessDashBtn.style.display = 'inline-block';
                }

                // Optional auto-redirect after a short delay
                setTimeout(() => {
                    if (roleLower === 'customer') {
                        window.location.href = '/customer-dashboard.html';
                    } else {
                        window.location.href = '/business-dashboard.html';
                    }
                }, 2500);
            } else {
                throw new Error((data && (data.error || data.message)) || 'Payment verification failed');
            }
        } catch (error) {
            updateStatus('error', 'Payment Verification Failed', `There was an issue verifying your payment: ${error.message}`);
        }
    }
});
