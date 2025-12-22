// Awards Section JavaScript - Animation and Interaction Effects

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all animations and interactions
    initScrollAnimations();
    initHoverEffects();
    initImageLazyLoading();
    
    // Enhanced scroll-based animations with performance optimization
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        // Use passive event listeners for better performance
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Use requestAnimationFrame for smooth animations
                    requestAnimationFrame(() => {
                        entry.target.classList.add('animate-in');
                        
                        // Add staggered animation for cards in the same container
                        const container = entry.target.closest('.awards-grid, .staff-grid');
                        if (container) {
                            const cards = Array.from(container.querySelectorAll('.award-card, .staff-card'));
                            cards.forEach((card, index) => {
                                requestAnimationFrame(() => {
                                    setTimeout(() => {
                                        card.classList.add('animate-in');
                                    }, index * 100); // Reduced delay for faster animation
                                });
                            });
                        }
                    });
                    
                    // Unobserve after animation to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all award and staff cards
        const cards = document.querySelectorAll('.award-card, .staff-card');
        cards.forEach(card => {
            observer.observe(card);
        });

        // Observe section titles for fade-in effect
        const titles = document.querySelectorAll('.section-title, .category-title');
        titles.forEach(title => {
            observer.observe(title);
        });
    }

    // Enhanced hover effects
    function initHoverEffects() {
        const cards = document.querySelectorAll('.award-card, .staff-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                // Add subtle scale effect to images
                const img = this.querySelector('img');
                if (img) {
                    img.style.transform = 'scale(1.05)';
                }
                
                // Add glow effect to award badges
                const badge = this.querySelector('.award-badge');
                if (badge) {
                    badge.style.boxShadow = '0 5px 20px rgba(255, 215, 0, 0.6)';
                }
            });

            card.addEventListener('mouseleave', function() {
                // Reset image scale
                const img = this.querySelector('img');
                if (img) {
                    img.style.transform = 'scale(1)';
                }
                
                // Reset badge glow
                const badge = this.querySelector('.award-badge');
                if (badge) {
                    badge.style.boxShadow = '0 3px 10px rgba(255, 215, 0, 0.4)';
                }
            });
        });

        // Award tag hover effects
        const awardTags = document.querySelectorAll('.award-tag');
        awardTags.forEach(tag => {
            tag.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.4)';
            });

            tag.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 2px 5px rgba(0, 123, 255, 0.3)';
            });
        });
    }

    // Enhanced lazy loading for images with better performance
    function initImageLazyLoading() {
        const images = document.querySelectorAll('img[src]');
        
        // Preload images that are likely to be viewed soon
        const preloadImages = () => {
            images.forEach((img, index) => {
                if (index < 3) { // Preload first 3 images
                    const link = document.createElement('link');
                    link.rel = 'preload';
                    link.as = 'image';
                    link.href = img.src;
                    document.head.appendChild(link);
                }
            });
        };
        preloadImages();
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Use requestIdleCallback for better performance
                    const loadImage = () => {
                        // Add loading class
                        img.classList.add('loading');
                        
                        // Handle image load
                        const handleLoad = () => {
                            img.classList.remove('loading');
                            img.classList.add('loaded');
                            // Remove inline style to use CSS class
                            img.style.opacity = '';
                        };
                        
                        // Handle image error
                        const handleError = () => {
                            img.classList.remove('loading');
                            img.style.opacity = '0.5';
                            console.warn('Image failed to load:', img.src);
                        };
                        
                        // Check if already loaded
                        if (img.complete && img.naturalHeight !== 0) {
                            handleLoad();
                        } else {
                            img.addEventListener('load', handleLoad, { once: true });
                            img.addEventListener('error', handleError, { once: true });
                        }
                    };
                    
                    // Use requestIdleCallback if available, otherwise setTimeout
                    if ('requestIdleCallback' in window) {
                        requestIdleCallback(loadImage, { timeout: 2000 });
                    } else {
                        setTimeout(loadImage, 0);
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px', // Start loading images 50px before they come into view
            threshold: 0.01
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Enhanced smooth scrolling for internal links
    function initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Calculate offset for better positioning
                    const headerOffset = 80;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    // Use smooth scroll with better control
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }, { passive: true });
        });
        
        // Add smooth scroll to window for better navigation
        let isScrolling = false;
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    isScrolling = false;
                });
                isScrolling = true;
            }
        }, { passive: true });
    }

    // Initialize smooth scrolling
    initSmoothScrolling();

    // Add parallax effect to section backgrounds (optional)
    function initParallaxEffect() {
        const section = document.querySelector('.awards-section');
        
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = section.querySelector('.section-title');
            
            if (parallax) {
                const speed = scrolled * 0.5;
                parallax.style.transform = `translateY(${speed}px)`;
            }
        });
    }

    // Uncomment to enable parallax effect
    // initParallaxEffect();

    // Add click handlers for award cards (for potential modal or detail view)
    function initCardClickHandlers() {
        const cards = document.querySelectorAll('.award-card, .staff-card');
        
        cards.forEach(card => {
            card.addEventListener('click', function() {
                // Add click animation
                this.style.transform = 'scale(0.98)';
                
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                // Here you can add functionality to open a modal or navigate to detail page
                console.log('Card clicked:', this.querySelector('h4').textContent);
            });
        });
    }

    // Initialize card click handlers
    initCardClickHandlers();

    // Performance optimization: Debounce and throttle functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Add scroll progress indicator (optional)
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #007bff, #fd7e14);
            z-index: 1000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        const updateProgress = throttle(() => {
            requestAnimationFrame(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);
                progressBar.style.width = scrollPercent + '%';
            });
        }, 16); // ~60fps

        window.addEventListener('scroll', updateProgress);
    }

    // Initialize scroll progress indicator
    initScrollProgress();
});

// Export functions for potential external use
window.AwardsSection = {
    // Function to add new award card dynamically
    addAwardCard: function(awardData) {
        const grid = document.querySelector('.awards-grid');
        const cardHTML = `
            <div class="award-card">
                <div class="award-image">
                    <img src="${awardData.image}" alt="${awardData.title}" />
                    <div class="award-badge">${awardData.badge}</div>
                </div>
                <div class="award-content">
                    <h4>${awardData.title}</h4>
                    <p class="award-organization">${awardData.organization}</p>
                    <p class="award-description">${awardData.description}</p>
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', cardHTML);
    },

    // Function to add new staff card dynamically
    addStaffCard: function(staffData) {
        const grid = document.querySelector('.staff-grid');
        const awardsHTML = staffData.awards.map(award => 
            `<span class="award-tag">${award}</span>`
        ).join('');
        
        const cardHTML = `
            <div class="staff-card">
                <div class="staff-image">
                    <img src="${staffData.image}" alt="${staffData.name}" />
                </div>
                <div class="staff-content">
                    <h4>${staffData.name}</h4>
                    <p class="staff-position">${staffData.position}</p>
                    <div class="staff-awards">${awardsHTML}</div>
                    <p class="staff-description">${staffData.description}</p>
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', cardHTML);
    }
};