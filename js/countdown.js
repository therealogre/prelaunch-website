// Countdown Timer System
// Handles the 3-day countdown across all pages

class CountdownTimer {
    constructor(targetDate = null) {
        this.targetDate = targetDate || this.getDefaultTargetDate();
        this.init();
    }

    getDefaultTargetDate() {
        // Set to October 6, 2025 23:59:59 (end of registration period)
        return new Date('2025-10-06T23:59:59');
    }

    init() {
        this.updateCountdown();
        this.startInterval();
    }

    updateCountdown() {
        const now = new Date().getTime();
        const distance = this.targetDate - now;

        if (distance > 0) {
            const timeLeft = this.calculateTimeLeft(distance);
            this.updateDisplay(timeLeft);
            this.updateProgressBar(distance);
        } else {
            this.handleCountdownComplete();
        }
    }

    calculateTimeLeft(distance) {
        return {
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
            total: distance
        };
    }

    updateDisplay(timeLeft) {
        // Update main countdown display
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (daysEl) daysEl.textContent = timeLeft.days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = timeLeft.hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = timeLeft.minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = timeLeft.seconds.toString().padStart(2, '0');

        // Update alternative countdown displays
        this.updateAlternativeDisplays(timeLeft);
    }

    updateAlternativeDisplays(timeLeft) {
        // Update countdown in hero sections
        const heroCountdowns = document.querySelectorAll('.hero-countdown');
        heroCountdowns.forEach(countdown => {
            countdown.innerHTML = `
                <div class="time-unit">
                    <span class="time-value">${timeLeft.days}</span>
                    <span class="time-label">Days</span>
                </div>
                <div class="time-unit">
                    <span class="time-value">${timeLeft.hours}</span>
                    <span class="time-label">Hours</span>
                </div>
                <div class="time-unit">
                    <span class="time-value">${timeLeft.minutes}</span>
                    <span class="time-label">Minutes</span>
                </div>
            `;
        });
    }

    updateProgressBar(distance) {
        const progressBars = document.querySelectorAll('.countdown-progress');
        const totalDuration = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
        const elapsed = totalDuration - distance;
        const progress = (elapsed / totalDuration) * 100;

        progressBars.forEach(bar => {
            bar.style.width = `${Math.min(progress, 100)}%`;
        });
    }

    handleCountdownComplete() {
        // Hide countdown elements
        const countdownElements = document.querySelectorAll('.countdown-header, .countdown-container');
        countdownElements.forEach(el => {
            el.style.display = 'none';
        });

        // Show launch message
        this.showLaunchMessage();
    }

    showLaunchMessage() {
        const launchMessages = document.querySelectorAll('.launch-message-container');
        launchMessages.forEach(container => {
            container.innerHTML = `
                <div class="launch-message">
                    <i class="fas fa-rocket"></i>
                    <span>🚀 LAUNCH DAY IS HERE! 🚀</span>
                </div>
            `;
            container.style.display = 'block';
        });
    }

    startInterval() {
        // Update every second
        setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }

    // Public methods for external use
    setTargetDate(date) {
        this.targetDate = new Date(date);
        this.updateCountdown();
    }

    getTimeRemaining() {
        const now = new Date().getTime();
        const distance = this.targetDate - now;
        return distance > 0 ? distance : 0;
    }

    formatTimeRemaining(milliseconds) {
        const timeLeft = this.calculateTimeLeft(milliseconds);
        return `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`;
    }
}

// Auto-initialize if not already initialized
if (typeof window.helensvaleCountdown === 'undefined') {
    window.helensvaleCountdown = new CountdownTimer();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CountdownTimer;
}
