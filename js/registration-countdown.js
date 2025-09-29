// Registration Countdown Timer
// Handles the 7-day registration countdown on the registration page

document.addEventListener('DOMContentLoaded', function() {
    // Set the target date to October 6, 2025 23:59:59
    const targetDate = new Date('2025-10-06T23:59:59');
    
    // Update the countdown every second
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    // Initial call to avoid delay
    updateCountdown();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        // If the countdown is over
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.querySelector('.countdown-banner').innerHTML = 
                '<span style="font-weight: 600; color: #4f46e5;">⚠️ Registration period has ended. Contact support for late registration options.</span>';
            return;
        }
        
        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update the display
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
});
