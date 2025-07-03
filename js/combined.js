/**
 * Combined JavaScript for the Necron Portfolio
 * Consolidates main.js, image-expand.js, contact-form.js, project-data.js, project-loader.js, and lazy-load.js
 */

// ====== MAIN APP INITIALIZATION ======
const initApp = () => {
    // Use passive event listeners for better scrolling performance
    const passiveOptions = { passive: true };

    // Optimized smooth scrolling for anchor links
    const handleSmoothScroll = (e) => {
        const targetId = e.currentTarget.getAttribute('href');
        if (targetId === '#' || !targetId.startsWith('#')) return;

        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    };

    // Initialize smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll, passiveOptions);
    });

    // Project filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));

                // Add active class to clicked button
                this.classList.add('active');

                const filterValue = this.getAttribute('data-category');

                // Filter projects
                projectItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Add animation class to project items on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.project-item, .project-card');

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial styles for animation
    document.querySelectorAll('.project-item, .project-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Run once on load
    animateOnScroll();

    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Add active class to current navigation item
    const currentLocation = location.href;
    const menuItems = document.querySelectorAll('nav ul li a');
    const menuLength = menuItems.length;

    for (let i = 0; i < menuLength; i++) {
        if (menuItems[i].href === currentLocation) {
            menuItems[i].classList.add('active');
        }
    }

    // ====== IMAGE EXPANSION FUNCTIONALITY ======
    // Add expand hint to all project images
    const projectImages = document.querySelectorAll('.project-image');
    projectImages.forEach(container => {
        // Add expand hint element
        const expandHint = document.createElement('span');
        expandHint.className = 'expand-hint';
        expandHint.textContent = 'Click to expand';
        container.appendChild(expandHint);
        
        // Add click event to expand image
        container.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (!this.classList.contains('expanded')) {
                // Create expanded view
                this.classList.add('expanded');
                this.style.zIndex = '1000';
                
                // Add close hint
                const closeHint = document.createElement('span');
                closeHint.className = 'close-hint';
                closeHint.textContent = 'Click anywhere to close';
                closeHint.style.position = 'absolute';
                closeHint.style.top = '20px';
                closeHint.style.left = '50%';
                closeHint.style.transform = 'translateX(-50%)';
                closeHint.style.color = 'var(--primary)';
                closeHint.style.padding = '10px 20px';
                closeHint.style.borderRadius = '4px';
                closeHint.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                this.appendChild(closeHint);
                
                // Disable page scrolling
                document.body.style.overflow = 'hidden';
                
                // Add escape key functionality
                document.addEventListener('keydown', closeOnEscape);
            } else {
                closeExpandedImage(this);
            }
        });
    });
    
    // Function to close expanded image with escape key
    function closeOnEscape(e) {
        if (e.key === 'Escape') {
            const expandedImage = document.querySelector('.project-image.expanded');
            if (expandedImage) {
                closeExpandedImage(expandedImage);
            }
            document.removeEventListener('keydown', closeOnEscape);
        }
    }
    
    // Function to close expanded image
    function closeExpandedImage(element) {
        element.classList.remove('expanded');
        element.style.zIndex = '';
        
        // Remove close hint if it exists
        const closeHint = element.querySelector('.close-hint');
        if (closeHint) {
            closeHint.remove();
        }
        
        // Re-enable page scrolling
        document.body.style.overflow = '';
    }

    // ====== CONTACT FORM FUNCTIONALITY ======
    const form = document.getElementById('contactForm');
    if (form) {
        // Form elements
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        const messageCount = document.getElementById('message-count');
        const submitButton = form.querySelector('button[type="submit"]');
        const buttonText = submitButton.querySelector('.button-text');
        const buttonSpinner = submitButton.querySelector('.button-spinner');
        const formSuccess = document.getElementById('form-success');
        
        // Regular expressions for validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const nameRegex = /^[a-zA-Z\s'-]+$/;
        
        // Character limits
        const CHAR_LIMITS = {
            name: { min: 2, max: 100 },
            email: { min: 5, max: 100 },
            subject: { min: 5, max: 200 },
            message: { min: 10, max: 2000 }
        };
        
        // Initialize character count
        if (messageInput && messageCount) {
            // Track when form becomes interactive (for spam detection)
            window.formLoadTime = performance.now();
            
            updateCharacterCount();
            messageInput.addEventListener('input', updateCharacterCount);
        }
        
        // Function to show fake success to bots (honeypot triggered)
        function showFakeSuccess() {
            submitButton.disabled = false;
            submitButton.removeAttribute('aria-busy');
            buttonText.textContent = 'Transmit Message';
            
            // Show fake success without actually sending
            const fakeSuccess = document.createElement('div');
            fakeSuccess.style.cssText = 'margin-top: 1rem; padding: 1rem; background: #00ff9d; color: #000; border-radius: 4px;';
            fakeSuccess.textContent = 'Message sent successfully!';
            form.appendChild(fakeSuccess);
            form.reset();
            
            setTimeout(() => {
                if (fakeSuccess.parentNode) {
                    fakeSuccess.remove();
                }
            }, 3000);
        }
        
        // Form submission handler
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate all fields
            const isNameValid = validateField(nameInput, validateName);
            const isEmailValid = validateField(emailInput, validateEmail);
            const isSubjectValid = validateField(subjectInput, validateSubject);
            const isMessageValid = validateField(messageInput, validateMessage);
            
            if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
                await submitForm();
            } else {
                // Focus on first invalid field
                const firstError = form.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
        
        // Real-time validation on blur
        [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
            if (input) {
                input.addEventListener('blur', () => {
                    validateOnBlur(input);
                });
                
                // Clear error on input
                input.addEventListener('input', () => {
                    clearError(input);
                });
            }
        });
        
        // Validation functions
        function validateName(value) {
            if (!value.trim()) return 'Name is required';
            if (value.length < CHAR_LIMITS.name.min) return `Name must be at least ${CHAR_LIMITS.name.min} characters`;
            if (value.length > CHAR_LIMITS.name.max) return `Name must be less than ${CHAR_LIMITS.name.max} characters`;
            if (!nameRegex.test(value)) return 'Name contains invalid characters';
            return '';
        }
        
        function validateEmail(value) {
            if (!value.trim()) return 'Email is required';
            if (!emailRegex.test(value)) return 'Please enter a valid email address';
            return '';
        }
        
        function validateSubject(value) {
            if (!value.trim()) return 'Subject is required';
            if (value.length < CHAR_LIMITS.subject.min) return `Subject must be at least ${CHAR_LIMITS.subject.min} characters`;
            if (value.length > CHAR_LIMITS.subject.max) return `Subject must be less than ${CHAR_LIMITS.subject.max} characters`;
            return '';
        }
        
        function validateMessage(value) {
            if (!value.trim()) return 'Message is required';
            if (value.length < CHAR_LIMITS.message.min) return `Message must be at least ${CHAR_LIMITS.message.min} characters`;
            if (value.length > CHAR_LIMITS.message.max) return `Message must be less than ${CHAR_LIMITS.message.max} characters`;
            return '';
        }
        
        // Field validation
        function validateField(input, validationFn) {
            if (!input) return true; // Skip if element doesn't exist
            
            const errorElement = document.getElementById(`${input.id}-error`);
            const errorMessage = validationFn(input.value);
            
            if (errorMessage) {
                showError(input, errorElement, errorMessage);
                return false;
            } else {
                clearError(input, errorElement);
                return true;
            }
        }
        
        // Validate on blur with debounce
        let blurTimeout;
        function validateOnBlur(input) {
            clearTimeout(blurTimeout);
            
            blurTimeout = setTimeout(() => {
                // Determine which validation function to use
                let validationFn;
                switch(input.id) {
                    case 'name':
                        validationFn = validateName;
                        break;
                    case 'email':
                        validationFn = validateEmail;
                        break;
                    case 'subject':
                        validationFn = validateSubject;
                        break;
                    case 'message':
                        validationFn = validateMessage;
                        break;
                }
                
                if (validationFn) {
                    validateField(input, validationFn);
                }
            }, 200);
        }
        
        // Show error message
        function showError(input, errorElement, message) {
            if (!input || !errorElement) return;
            
            input.classList.add('error');
            input.setAttribute('aria-invalid', 'true');
            
            errorElement.textContent = message;
            errorElement.classList.add('visible');
            
            // Announce error to screen readers
            const liveRegion = document.createElement('div');
            liveRegion.setAttribute('role', 'alert');
            liveRegion.setAttribute('aria-live', 'assertive');
            liveRegion.className = 'sr-only';
            liveRegion.textContent = message;
            document.body.appendChild(liveRegion);
            
            // Remove after announcement
            setTimeout(() => {
                document.body.removeChild(liveRegion);
            }, 1000);
        }
        
        // Clear error message
        function clearError(input, errorElement) {
            if (!input) return;
            
            input.classList.remove('error');
            input.setAttribute('aria-invalid', 'false');
            
            const error = errorElement || document.getElementById(`${input.id}-error`);
            if (error) {
                error.textContent = '';
                error.classList.remove('visible');
            }
        }
        
        // Update character count
        function updateCharacterCount() {
            if (!messageInput || !messageCount) return;
            
            const currentLength = messageInput.value.length;
            messageCount.textContent = currentLength;
            
            // Update visual feedback
            const maxLength = CHAR_LIMITS.message.max;
            const limitPercentage = currentLength / maxLength;
            
            if (limitPercentage > 0.9) {
                messageCount.style.color = 'var(--error)';
            } else if (limitPercentage > 0.7) {
                messageCount.style.color = 'orange';
            } else {
                messageCount.style.color = 'var(--text-secondary)';
            }
            
            // Announce to screen readers when approaching limit
            if (currentLength === maxLength - 100 || currentLength === maxLength - 50 || currentLength === maxLength - 10) {
                const countMessage = `You have ${maxLength - currentLength} characters remaining.`;
                const liveRegion = document.createElement('div');
                liveRegion.setAttribute('role', 'status');
                liveRegion.setAttribute('aria-live', 'polite');
                liveRegion.className = 'sr-only';
                liveRegion.textContent = countMessage;
                document.body.appendChild(liveRegion);
                
                // Remove after announcement
                setTimeout(() => {
                    document.body.removeChild(liveRegion);
                }, 1000);
            }
        }
        
        // Form submission
        async function submitForm() {
            // ANTI-SPAM CHECKS (user-friendly)
            const formStartTime = performance.now();
            const timeTaken = formStartTime - (window.formLoadTime || formStartTime - 2000);
            
            // 1. Time-based spam check (too fast = likely bot)
            if (timeTaken < 3000) { // Less than 3 seconds is suspicious
                console.log('Submission too fast, likely bot');
                await new Promise(resolve => setTimeout(resolve, 2000)); // Slow down bots
            }
            
            // 2. Content spam detection
            const messageText = messageInput.value.toLowerCase();
            const spamKeywords = ['crypto', 'bitcoin', 'investment', 'earn money', 'guaranteed', 'click here', 'free money', 'viagra', 'casino'];
            const spamScore = spamKeywords.filter(keyword => messageText.includes(keyword)).length;
            
            if (spamScore >= 2) {
                // Instead of blocking, add extra verification
                const extraVerify = confirm('Your message contains content that might be flagged as spam. Are you sure you want to send this message?');
                if (!extraVerify) return;
            }
            
            // 3. Honeypot check (invisible field bots might fill)
            const honeypot = document.getElementById('website'); // We'll add this field
            if (honeypot && honeypot.value !== '') {
                console.log('Honeypot triggered - likely bot');
                // Silently fail for bots
                await new Promise(resolve => setTimeout(resolve, 3000));
                showFakeSuccess();
                return;
            }
            
            // Disable submit button
            submitButton.disabled = true;
            submitButton.setAttribute('aria-busy', 'true');
            buttonText.textContent = submitButton.getAttribute('data-loading-text');
            
            try {
                // Use Formspree for form submission
                const formData = new FormData();
                formData.append('name', nameInput.value.trim());
                formData.append('email', emailInput.value.trim());
                formData.append('subject', subjectInput.value.trim());
                formData.append('message', messageInput.value.trim());
                
                const response = await fetch('https://formspree.io/f/xjkrzwlq', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Show success message
                    formSuccess.hidden = false;
                    form.reset();
                    
                    // Enhanced success message
                    formSuccess.innerHTML = `
                        <i class="fas fa-check-circle" aria-hidden="true"></i>
                        <strong>Message Transmitted Successfully!</strong><br>
                        <small>Thank you for reaching out. I personally read every message and typically respond within 24-48 hours on business days. 
                        You'll receive my response at the email address you provided.</small>
                    `;
                    
                    // Announce success to screen readers
                    const successMessage = formSuccess.textContent.trim();
                    const liveRegion = document.createElement('div');
                    liveRegion.setAttribute('role', 'alert');
                    liveRegion.setAttribute('aria-live', 'polite');
                    liveRegion.className = 'sr-only';
                    liveRegion.textContent = successMessage;
                    document.body.appendChild(liveRegion);
                    
                    // Remove after announcement
                    setTimeout(() => {
                        document.body.removeChild(liveRegion);
                    }, 1000);
                    
                    // Focus on success message for screen readers
                    formSuccess.focus();
                } else {
                    throw new Error('Both email services failed');
                }
                
            } catch (error) {
                // Show error message
                console.error('Form submission error:', error);
                
                // If both methods fail, show helpful error message
                const errorMessage = `Unable to send your message at this time. Please email me directly at miko.amos@proton.me or try again later.`;
                
                // Show error in the UI
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.style.marginTop = '1rem';
                errorDiv.style.padding = '1rem';
                errorDiv.style.backgroundColor = '#ff4444';
                errorDiv.style.color = 'white';
                errorDiv.style.borderRadius = '4px';
                errorDiv.textContent = errorMessage;
                
                // Remove any existing error messages
                const existingError = form.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
                
                form.appendChild(errorDiv);
                
                // Announce error to screen readers
                const liveRegion = document.createElement('div');
                liveRegion.setAttribute('role', 'alert');
                liveRegion.setAttribute('aria-live', 'assertive');
                liveRegion.className = 'sr-only';
                liveRegion.textContent = errorMessage;
                document.body.appendChild(liveRegion);
                
                // Remove after announcement
                setTimeout(() => {
                    document.body.removeChild(liveRegion);
                    if (errorDiv.parentNode) {
                        errorDiv.remove();
                    }
                }, 5000);
                
            } finally {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.removeAttribute('aria-busy');
                buttonText.textContent = 'Transmit Message';
            }
        }
        
        // Initialize form with ARIA attributes
        function initForm() {
            // Add ARIA attributes to form controls
            [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
                if (input) {
                    input.setAttribute('aria-describedby', `${input.id}-error`);
                    input.setAttribute('aria-required', 'true');
                }
            });
            
            // Add loading state styles
            const style = document.createElement('style');
            style.textContent = `
                button[aria-busy="true"] {
                    position: relative;
                    color: transparent !important;
                    pointer-events: none;
                }
                
                button[aria-busy="true"] .button-spinner {
                    display: inline-block;
                    width: 1.5em;
                    height: 1.5em;
                    border: 2px solid currentColor;
                    border-radius: 50%;
                    border-top-color: transparent;
                    animation: spin 1s linear infinite;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin: -0.75em 0 0 -0.75em;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Initialize the form
        initForm();
    }
};

// ====== PAGE TRANSITIONS ======
// Page transition handling
const handlePageTransition = (e) => {
    // Only handle internal links that aren't anchors
    if (e.target.tagName === 'A' && 
        e.target.href &&
        e.target.href.startsWith(window.location.origin) &&
        !e.target.href.includes('#') &&
        e.target.target !== '_blank') {
        e.preventDefault();
        
        // Save target URL before manipulating the DOM
        const targetUrl = e.target.href;
        
        // Create and inject black background style first
        const styleTag = document.createElement('style');
        styleTag.textContent = `
            html, body {
                background-color: #050505 !important;
                transition: none !important;
            }
        `;
        document.head.appendChild(styleTag);
        
        // Force reflow to apply the styles immediately
        void document.documentElement.offsetWidth;
        
        // Create transition overlay if it doesn't exist
        let transitionOverlay = document.querySelector('.page-transition');
        if (!transitionOverlay) {
            transitionOverlay = document.createElement('div');
            transitionOverlay.className = 'page-transition';
            // Add loading spinner to the overlay
            const spinner = document.createElement('div');
            spinner.className = 'loader-spinner';
            transitionOverlay.appendChild(spinner);
            
            // Add loading text
            const loadingText = document.createElement('div');
            loadingText.className = 'loading-text';
            loadingText.textContent = 'LOADING';
            transitionOverlay.appendChild(loadingText);
            
            document.body.appendChild(transitionOverlay);
        }
        
        // Set background colors explicitly
        document.documentElement.style.backgroundColor = '#050505';
        document.body.style.backgroundColor = '#050505';
        
        // Force reflow to ensure the element is in the DOM
        void transitionOverlay.offsetWidth;
        
        // Show the transition overlay
        transitionOverlay.style.opacity = '1';
        transitionOverlay.style.visibility = 'visible';
        
        // Immediately attach a state-saving object to the window
        // This survives across page transitions in many browsers
        try {
            window.name = JSON.stringify({transitioning: true});
            localStorage.setItem('pageTransitioning', 'true');
            sessionStorage.setItem('pageTransitioning', 'true');
        } catch (e) {
            // Ignore storage errors
        }
        
        // Try to preload the target page
        const prefetch = document.createElement('link');
        prefetch.rel = 'prefetch';
        prefetch.href = targetUrl;
        document.head.appendChild(prefetch);
        
        // Navigate after a brief delay to allow CSS to take effect
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 50);
    }
};

// Initialize page transitions and prefetching
function initPageTransitions() {
    // Handle page transitions
    document.addEventListener('click', handlePageTransition);

    // Prefetch pages on hover for faster navigation
    const links = document.getElementsByTagName('a');
    Array.from(links).forEach(link => {
        if (link.href &&
            link.href.startsWith(window.location.origin) &&
            !link.href.includes('#') &&
            link.target !== '_blank') {

            link.addEventListener('mouseenter', () => {
                const prefetchLink = document.createElement('link');
                prefetchLink.rel = 'prefetch';
                prefetchLink.href = link.href;
                document.head.appendChild(prefetchLink);
            }, { once: true });
        }
    });
}

// Handle page load and hide any existing transition overlay
function handlePageLoad() {
    // Check if we were in a page transition
    let wasTransitioning = false;
    try {
        // Check all possible ways the transition state might be saved
        if (window.name) {
            try {
                const state = JSON.parse(window.name);
                wasTransitioning = state.transitioning === true;
                // Reset window.name
                window.name = '';
            } catch (e) {}
        }
        
        if (!wasTransitioning && localStorage.getItem('pageTransitioning') === 'true') {
            wasTransitioning = true;
            localStorage.removeItem('pageTransitioning');
        }
        
        if (!wasTransitioning && sessionStorage.getItem('pageTransitioning') === 'true') {
            wasTransitioning = true;
            sessionStorage.removeItem('pageTransitioning');
        }
    } catch (e) {}
    
    // Set background colors immediately to ensure no white flash
    document.documentElement.style.backgroundColor = '#050505';
    document.body.style.backgroundColor = '#050505';
    
    // Create a style tag to set initial page background with high priority
    const style = document.createElement('style');
    style.textContent = `
        html, body {
            background-color: #050505 !important;
            transition: none !important;
        }
    `;
    document.head.insertBefore(style, document.head.firstChild);
    
    // Create transition overlay immediately if coming from another page
    let transitionOverlay = document.querySelector('.page-transition');
    if (!transitionOverlay && wasTransitioning) {
        transitionOverlay = document.createElement('div');
        transitionOverlay.className = 'page-transition';
        transitionOverlay.style.opacity = '1';
        transitionOverlay.style.visibility = 'visible';
        
        // Add loading spinner to the overlay
        const spinner = document.createElement('div');
        spinner.className = 'loader-spinner';
        transitionOverlay.appendChild(spinner);
        
        // Add loading text
        const loadingText = document.createElement('div');
        loadingText.className = 'loading-text';
        loadingText.textContent = 'LOADING';
        transitionOverlay.appendChild(loadingText);
        
        document.body.appendChild(transitionOverlay);
    }
    
    // Handle existing transition overlay
    if (transitionOverlay) {
        // Ensure overlay is visible before fading out for smoother transition
        if (getComputedStyle(transitionOverlay).opacity === '0') {
            transitionOverlay.style.opacity = '1';
            transitionOverlay.style.visibility = 'visible';
            
            // Force reflow
            void transitionOverlay.offsetWidth;
        }
        
        // Fade out the transition overlay after styles have been applied
        setTimeout(() => {
            // Allow transitions now that page is loaded
            style.textContent = `
                html, body {
                    background-color: #050505 !important;
                }
            `;
            
            transitionOverlay.style.opacity = '0';
            // Remove the overlay after the fade out completes
            setTimeout(() => {
                if (transitionOverlay && transitionOverlay.parentNode) {
                    transitionOverlay.parentNode.removeChild(transitionOverlay);
                }
            }, 300);
        }, 100);
    }
}

// ====== PROJECT DATA ======
/**
 * Project data has been moved to project-data.js for better maintainability
 * and consistency across pages.
 */

// ====== PROJECT LOADER ======
/**
 * Project loading functionality has been moved to project-loader.js
 * for better organization and maintainability.
 */

// ====== IMAGE LOADING AND MODAL ======
// Enhanced image loading with aggressive preloading and click-to-expand
function initImagesAndModal() {
    // Immediately set src for all images without waiting for preload
    const images = document.querySelectorAll('img[data-src]');
    const projectImages = document.querySelectorAll('.project-image img');
    
    // IMMEDIATE LOADING: Apply src directly without waiting for preload event
    // This ensures images start loading as soon as possible
    images.forEach(img => {
        // Set a loading placeholder
        img.classList.add('loading');
        
        // Set priority fetch hint for critical images
        img.fetchPriority = 'high';
        
        // Set src immediately instead of waiting for preload
        if (img.dataset.src) {
            img.src = img.dataset.src;
            
            // Add onload handler directly to the image
            img.onload = function() {
                img.classList.remove('loading');
                img.classList.add('loaded');
                img.removeAttribute('data-src');
            };
            
            img.onerror = function() {
                img.classList.remove('loading');
                img.classList.add('error');
                img.alt = 'Failed to load image';
            };
        }
    });
    
    // Only create modal if it doesn't exist yet
    if (!document.querySelector('.image-modal')) {
        // Create modal for expanded images
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <img class="modal-image" alt="Expanded image">
                <div class="modal-caption"></div>
            </div>
        `;
        document.body.appendChild(modal);
        
        const modalImage = modal.querySelector('.modal-image');
        const modalCaption = modal.querySelector('.modal-caption');
        const modalClose = modal.querySelector('.modal-close');
        
        // Add click handlers to all project images
        projectImages.forEach(img => {
            img.style.cursor = 'pointer';
            img.title = 'Click to expand';
            
            img.addEventListener('click', function() {
                modal.style.display = 'flex';
                modalImage.src = this.src;
                modalCaption.textContent = this.alt || 'Project Image';
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });
        });
        
        // Close modal handlers
        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // ESC key to close modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeModal();
            }
        });
        
        function closeModal() {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }
        
        // Add CSS for the modal if not already added
        if (!document.querySelector('style#modal-styles')) {
            const modalStyles = document.createElement('style');
            modalStyles.id = 'modal-styles';
            modalStyles.textContent = `
                .image-modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.95);
                    z-index: 9999;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s ease;
                }
                
                .modal-content {
                    position: relative;
                    max-width: 90vw;
                    max-height: 90vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                
                .modal-image {
                    max-width: 100%;
                    max-height: calc(90vh - 60px);
                    object-fit: contain;
                    border: 2px solid var(--primary);
                    box-shadow: 0 0 30px rgba(0, 255, 157, 0.3);
                    animation: zoomIn 0.3s ease;
                }
                
                .modal-caption {
                    color: var(--text);
                    text-align: center;
                    padding: 10px;
                    font-size: 1rem;
                    margin-top: 10px;
                }
                
                .modal-close {
                    position: absolute;
                    top: -40px;
                    right: 0;
                    color: var(--primary);
                    font-size: 40px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    z-index: 10000;
                }
                
                .modal-close:hover {
                    color: var(--primary-light);
                    text-shadow: 0 0 10px var(--primary);
                    transform: scale(1.1);
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes zoomIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                
                /* Hover effect for clickable images */
                .project-image img {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                .project-image img:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 15px rgba(0, 255, 157, 0.3);
                }
                
                @media (max-width: 768px) {
                    .modal-close {
                        top: 10px;
                        right: 10px;
                        font-size: 30px;
                        background: rgba(0, 0, 0, 0.7);
                        width: 40px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                    }
                }
            `;
            document.head.appendChild(modalStyles);
        }
    }
}

// ====== PROJECT PAGE INITIALIZATION ======
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the index or projects page
    const isIndexPage = document.querySelector('.featured-projects .project-grid');
    const isProjectsPage = document.querySelector('.project-list');
    
    if (isIndexPage) {
        renderFeaturedProjects();
    }
    
    if (isProjectsPage) {
        renderProjectsList();
        initializeProjectFilters();
    }
});

// ====== INITIALIZE EVERYTHING ======
// When the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initApp();
        initPageTransitions();
        handlePageLoad();
    });
} else {
    // DOMContentLoaded has already fired
    initApp();
    initPageTransitions();
    handlePageLoad();
}

// Also handle pages loaded from cache (back/forward navigation)
window.addEventListener('pageshow', handlePageLoad);

// Add a class to body when page is fully loaded
window.addEventListener('load', () => {
    document.body.classList.add('page-loaded');
});
