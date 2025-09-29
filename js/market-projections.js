/**
 * Market Projections - Interactive Growth Visualization
 * Handles the interactive elements of the market projections section
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the growth metrics counter animation
    function initGrowthMetrics() {
        const metricValues = document.querySelectorAll('.metric-value');
        
        metricValues.forEach(metric => {
            const target = parseInt(metric.getAttribute('data-target'));
            const suffix = metric.getAttribute('data-suffix') || '';
            const duration = 2000; // Animation duration in ms
            const step = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateMetric = () => {
                current += step;
                
                if (current >= target) {
                    metric.textContent = target.toLocaleString() + suffix;
                    return;
                }
                
                // Format number with commas
                metric.textContent = Math.floor(current).toLocaleString() + suffix;
                requestAnimationFrame(updateMetric);
            };
            
            // Start animation when element is in viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateMetric();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(metric);
        });
    }
    
    // Initialize the timeline progress bar
    function initTimeline() {
        const timelineProgress = document.querySelector('.timeline-progress-bar');
        const milestones = document.querySelectorAll('.milestone');
        
        // Set initial active milestone
        milestones[0].classList.add('active');
        
        // Update timeline progress on scroll
        const updateTimeline = () => {
            const scrollPosition = window.scrollY;
            const section = document.querySelector('.market-projections');
            const sectionTop = section.offsetTop - 300;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
                const progress = ((scrollPosition - sectionTop) / sectionHeight) * 100;
                const boundedProgress = Math.min(Math.max(progress, 0), 100);
                timelineProgress.style.width = `${boundedProgress}%`;
                
                // Update active milestone based on scroll position
                const milestoneIndex = Math.floor((boundedProgress / 100) * (milestones.length - 1));
                milestones.forEach((milestone, index) => {
                    if (index <= milestoneIndex) {
                        milestone.classList.add('active');
                    } else {
                        milestone.classList.remove('active');
                    }
                });
            }
        };
        
        // Add click handler for milestones
        milestones.forEach((milestone, index) => {
            milestone.addEventListener('click', () => {
                const section = document.querySelector('.market-projections');
                const sectionHeight = section.offsetHeight;
                const targetScroll = section.offsetTop - 100 + ((index / (milestones.length - 1)) * sectionHeight * 0.8);
                
                window.scrollTo({
                    top: targetScroll,
                    behavior: 'smooth'
                });
            });
        });
        
        window.addEventListener('scroll', updateTimeline);
        updateTimeline(); // Initial call
    }
    
    // Initialize the growth path animation
    function initGrowthPath() {
        const growthStages = document.querySelectorAll('.growth-stage');
        
        growthStages.forEach((stage, index) => {
            // Add delay based on index for staggered animation
            stage.style.animationDelay = `${index * 0.1}s`;
            
            // Add hover effect
            stage.addEventListener('mouseenter', () => {
                stage.style.transform = 'translateX(10px)';
                stage.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            });
            
            stage.addEventListener('mouseleave', () => {
                stage.style.transform = 'translateX(0)';
                stage.style.boxShadow = 'none';
            });
        });
    }
    
    // Initialize all components
    function init() {
        initGrowthMetrics();
        initTimeline();
        initGrowthPath();
    }
    
    // Wait for all resources to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Expose functions for potential manual initialization
    window.MarketProjections = {
        init,
        initGrowthMetrics,
        initTimeline,
        initGrowthPath
    };
});
