// Global Countdown Timer System
class CountdownTimer {
    constructor() {
        this.launchDate = this.calculateLaunchDate();
        this.init();
    }

    calculateLaunchDate() {
        // Set launch date to 21 days from now
        const now = new Date();
        const launchDate = new Date(now.getTime() + (21 * 24 * 60 * 60 * 1000));
        return launchDate;
    }

    init() {
        this.updateAllTimers();
        // Update every minute
        setInterval(() => this.updateAllTimers(), 60000);
    }

    updateAllTimers() {
        const now = new Date().getTime();
        const timeLeft = this.launchDate.getTime() - now;

        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

            // Update main countdown on index page
            this.updateTimer('countdownDays', days);
            this.updateTimer('countdownHours', hours);
            this.updateTimer('countdownMinutes', minutes);

            // Update holographic countdown
            this.updateTimer('days', days);
            this.updateTimer('hours', hours);
            this.updateTimer('minutes', minutes);

            // Update any other countdown timers
            this.updateTimer('launch-days', days);
            this.updateTimer('launch-hours', hours);
            this.updateTimer('launch-minutes', minutes);
        } else {
            // Launch day reached
            this.handleLaunchDay();
        }
    }

    updateTimer(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value.toString().padStart(2, '0');
        }
    }

    handleLaunchDay() {
        // Replace countdown with launch message
        const countdownElements = document.querySelectorAll('.countdown-timer, .holographic-countdown');
        countdownElements.forEach(element => {
            element.innerHTML = `
                <div class="launch-message">
                    <div class="launch-icon">🚀</div>
                    <h3>We're Live!</h3>
                    <p>Helensvale Connect is now available</p>
                    <a href="#" class="btn btn-primary">Enter Marketplace</a>
                </div>
            `;
        });
    }

    // Static method to get days until launch
    static getDaysUntilLaunch() {
        const now = new Date();
        const launchDate = new Date(now.getTime() + (21 * 24 * 60 * 60 * 1000));
        const timeLeft = launchDate.getTime() - now.getTime();
        return Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    }
}

// Initialize countdown timer
document.addEventListener('DOMContentLoaded', () => {
    new CountdownTimer();
});

// Export for use in other scripts
window.CountdownTimer = CountdownTimer;
