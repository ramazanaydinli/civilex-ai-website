// Lenis Smooth Scroll Implementation
let lenis;

// Initialize Lenis smooth scrolling
function initLenis() {
    lenis = new Lenis({
        duration: 1.2,        // Scroll animasyon süresi (saniye)
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function
        orientation: 'vertical', // Scroll yönü
        gestureOrientation: 'vertical', // Gesture yönü
        smoothWheel: true,    // Mouse wheel için smooth scroll
        wheelMultiplier: 1,   // Wheel hızı çarpanı
        smoothTouch: false,   // Touch cihazlarda smooth scroll (mobil performans için)
        touchMultiplier: 2,   // Touch hızı çarpanı
        infinite: false,      // Sonsuz scroll
    });

    // RequestAnimationFrame ile sürekli güncelleme
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
}

// DOM Content Loaded event
document.addEventListener('DOMContentLoaded', function() {
    // Lenis'i başlat
    initLenis();
    // Mobile Menu Functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');
            
            if (mobileNav.classList.contains('active')) {
                body.classList.add('mobile-menu-open');
                body.style.overflow = 'hidden';
            } else {
                body.classList.remove('mobile-menu-open');
                body.style.overflow = '';
            }
        });
        
        // Close mobile menu when clicking on a link
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                body.classList.remove('mobile-menu-open');
                body.style.overflow = '';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                body.classList.remove('mobile-menu-open');
                body.style.overflow = '';
            }
        });
    }
    
    // Process Items Functionality
    document.querySelectorAll('.process-header').forEach(header => {
        header.addEventListener('click', function() {
            const clickedProcessItem = this.closest('.process-item');
            
            // Eğer tıklanan item zaten aktifse, sadece onu kapat
            if (clickedProcessItem.classList.contains('active')) {
                clickedProcessItem.classList.remove('active');
            } else {
                // Önce tüm process item'ları kapat
                document.querySelectorAll('.process-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Sonra tıklanan item'ı aç
                clickedProcessItem.classList.add('active');
            }
        });
    });

    // Pagination Functionality (sadece team sayfasında çalışır)
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const paginationDots = document.querySelectorAll('.pagination-dot');
    
    // Pagination sadece team sayfasında varsa çalıştır
    if (prevBtn && nextBtn && paginationDots.length > 0) {
        let currentPage = 1;
        const totalPages = 2; // Toplam sayfa sayısı
        let autoPlayInterval;
        const autoPlayDelay = 5000; // 5 saniye

    // Auto-play functionality
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            if (currentPage < totalPages) {
                currentPage++;
            } else {
                currentPage = 1; // Loop back to first page
            }
            updatePagination();
        }, autoPlayDelay);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // Start auto-play
    startAutoPlay();
    
    // Initialize first page display
    updatePagination();

    // Pagination dot click events
    paginationDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentPage = index + 1;
            updatePagination();
            // Reset auto-play timer after manual interaction
            resetAutoPlay();
        });
    });

    // Previous button click event
    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
        } else {
            currentPage = totalPages; // Loop to last page
        }
        updatePagination();
        // Reset auto-play timer after manual interaction
        resetAutoPlay();
    });

    // Next button click event
    nextBtn.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
        } else {
            currentPage = 1; // Loop to first page
        }
        updatePagination();
        // Reset auto-play timer after manual interaction
        resetAutoPlay();
    });

    // Pause auto-play on hover
    const paginationContainer = document.querySelector('.pagination-container');
    paginationContainer.addEventListener('mouseenter', stopAutoPlay);
    paginationContainer.addEventListener('mouseleave', startAutoPlay);

    // Update pagination state
    function updatePagination() {
        // Update pagination dots
        paginationDots.forEach((dot, index) => {
            dot.classList.toggle('active', index + 1 === currentPage);
        });

        // Buttons are always enabled for infinite loop navigation
        prevBtn.disabled = false;
        nextBtn.disabled = false;

        // Show/hide team cards based on current page
        const teamCards = document.querySelectorAll('.team-card');
        const cardsPerPage = 6;
        
        teamCards.forEach((card, index) => {
            const startIndex = (currentPage - 1) * cardsPerPage;
            const endIndex = startIndex + cardsPerPage;
            
            if (index >= startIndex && index < endIndex) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

    }
    
    } // Pagination if bloğu kapanışı
    
    // Case Studies Pagination Functionality (sadece projects sayfasında çalışır)
    const casePaginationDots = document.querySelectorAll('.case-pagination-dot');
    
    // Case Studies pagination sadece projects sayfasında varsa çalıştır
    if (casePaginationDots.length > 0) {
        let currentCasePage = 1;
        const totalCasePages = 3;



    // Case Studies Pagination dot click events - ALL dots in ALL containers
    function addDotClickEvents() {
        const allCaseDots = document.querySelectorAll('.case-pagination-dot');
        allCaseDots.forEach((dot, index) => {
            // Remove existing event listeners to prevent duplicates
            dot.removeEventListener('click', dotClickHandler);
            dot.addEventListener('click', dotClickHandler);
        });
    }

    function dotClickHandler() {
        // Bu dot'un data-page attribute'unu al
        const pageNumber = parseInt(this.getAttribute('data-page'));
        
        // Sayfa değişimini yap
        currentCasePage = pageNumber;
        updateCasePagination();
        
    }

    // Case Studies Arrow Button Events
    function addArrowClickEvents() {
        const prevBtns = document.querySelectorAll('.prev-case-btn');
        const nextBtns = document.querySelectorAll('.next-case-btn');
        
        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentCasePage > 1) {
                    currentCasePage--;
                    updateCasePagination();
                }
            });
        });
        
        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentCasePage < totalCasePages) {
                    currentCasePage++;
                    updateCasePagination();
                }
            });
        });
    }

    // Update arrow button states
    function updateArrowButtonStates() {
        const prevBtns = document.querySelectorAll('.prev-case-btn');
        const nextBtns = document.querySelectorAll('.next-case-btn');
        
        prevBtns.forEach(btn => {
            btn.disabled = currentCasePage === 1;
        });
        
        nextBtns.forEach(btn => {
            btn.disabled = currentCasePage === totalCasePages;
        });
    }



    // Update case studies pagination state
    function updateCasePagination() {
        // Update ALL pagination dots in ALL containers
        const allCaseDots = document.querySelectorAll('.case-pagination-dot');
        
        allCaseDots.forEach((dot, index) => {
            const dotPosition = index % 3;
            const shouldBeActive = dotPosition + 1 === currentCasePage;
            dot.classList.toggle('active', shouldBeActive);
        });

        // Update arrow button states
        updateArrowButtonStates();

        // Show/hide case study pages
        const caseStudyPages = document.querySelectorAll('.case-study-page');
        caseStudyPages.forEach((page, index) => {
            if (index + 1 === currentCasePage) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });

        
        // Re-add click events after updating
        addDotClickEvents();
    }

        // Initialize case studies first page display
        updateCasePagination();
        addDotClickEvents();
        addArrowClickEvents();
    } // Case Studies pagination if bloğu kapanışı
    
    // Video click events - play/pause functionality (sadece projects sayfasında çalışır)
    function addVideoClickEvents() {
        const allVideos = document.querySelectorAll('.case-study-video video');
        if (allVideos.length > 0) {
            allVideos.forEach(video => {
            const videoContainer = video.closest('.case-study-video');
            
            video.addEventListener('click', function() {
                if (this.paused) {
                    this.play();
                    videoContainer.classList.add('playing');
                } else {
                    this.pause();
                    videoContainer.classList.remove('playing');
                }
            });
            
            // Video durumunu takip et
            video.addEventListener('play', function() {
                videoContainer.classList.add('playing');
            });
            
            video.addEventListener('pause', function() {
                videoContainer.classList.remove('playing');
            });
            
            video.addEventListener('ended', function() {
                videoContainer.classList.remove('playing');
            });
            });
        }
    }

    // Initialize video click events
    addVideoClickEvents();
    
    // Phone Carousel Functionality (sadece home sayfasında çalışır)
    function initPhoneCarousel() {
        const slides = document.querySelectorAll('.phone-slide');
        if (slides.length > 0) {
            let currentSlide = 0;
            const totalSlides = slides.length;
            let autoPlayInterval;
            const autoPlayDelay = 6000; // 6 saniye

        // Auto-play functionality
        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % totalSlides;
                updatePhoneCarousel();
            }, autoPlayDelay);
        }

        function stopAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
            }
        }

        function resetAutoPlay() {
            stopAutoPlay();
            startAutoPlay();
        }

        // Update carousel state
        function updatePhoneCarousel() {
            // Update slides with smooth transition
            slides.forEach((slide, index) => {
                if (index === currentSlide) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
        }

            // Start auto-play
            startAutoPlay();
            
            // Initialize first slide
            updatePhoneCarousel();
        }
    }

    // Initialize phone carousel
    initPhoneCarousel();
    

    
    // Contact Form Functionality
    function initContactForm() {
        const radioButtons = document.querySelectorAll('input[name="contact-type"]');
        const contactForm = document.getElementById('contactForm');
        
        // Radio button change event
        radioButtons.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    updateFormForOption(this.value);
                }
            });
        });
        
        // Form submission
        if (contactForm) {
            // Invisible reCAPTCHA callback fonksiyonu (global olmalı)
            window.onSubmitForm = async function(token) {
                await submitContactForm(token);
            };
            
            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(this);
                const fullName = formData.get('fullName');
                const email = formData.get('email');
                const message = formData.get('message');
                const contactType = formData.get('contact-type');
                
                // Basic validation (reCAPTCHA tetiklenmeden önce)
                if (!fullName || !email || !message) {
                    showNotification('Please fill in all fields.', 'error');
                    return;
                }
                
                if (!isValidEmail(email)) {
                    showNotification('Please enter a valid email address.', 'error');
                    return;
                }
                
                // Form geçerliyse reCAPTCHA otomatik tetiklenecek
                // Butondaki g-recaptcha class sayesinde
            });
        }
    }
    
    // Form submit fonksiyonu (reCAPTCHA'dan sonra çalışacak)
    async function submitContactForm(recaptchaToken) {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;
        
        const formData = new FormData(contactForm);
        const fullName = formData.get('fullName');
        const email = formData.get('email');
        const message = formData.get('message');
        const contactType = formData.get('contact-type');
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Send to backend API
        try {
            const response = await fetch('https://civilex-ai.onrender.com/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contactType,
                    fullName,
                    email,
                    message,
                    recaptchaToken: recaptchaToken
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showNotification('Your message has been successfully sent!', 'success');
                
                // Reset form
                contactForm.reset();
                
                // Reset to first option
                const firstRadio = document.getElementById('say-hi');
                if (firstRadio) {
                    firstRadio.checked = true;
                    document.querySelectorAll('.form-option').forEach(option => {
                        option.classList.remove('active');
                    });
                    firstRadio.closest('.form-option').classList.add('active');
                    updateFormForOption('say-hi');
                }
            } else {
                showNotification(data.message || 'An error occurred while sending the message.', 'error');
            }
        } catch (error) {
            console.error('❌ Backend error:', error);
            showNotification('Connection error. Please try again.', 'error');
        }
        
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Reset reCAPTCHA
        grecaptcha.reset();
    }
    
    // Update form based on selected option
    function updateFormForOption(option) {
        const messageTextarea = document.getElementById('message');
        
        switch(option) {
            case 'say-hi':
                messageTextarea.placeholder = 'Write your message';
                break;
            case 'join-team':
                messageTextarea.placeholder = 'Tell us about yourself and why you want to join our team';
                break;
            case 'about-projects':
                messageTextarea.placeholder = 'Tell us about what do you want to know';
                break;
        }
    }
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        // Set background color based on type
        switch(type) {
            case 'success':
                notification.style.backgroundColor = '#3F73D8';
                break;
            case 'error':
                notification.style.backgroundColor = '#f44336';
                break;
            case 'warning':
                notification.style.backgroundColor = '#ff9800';
                break;
            default:
                notification.style.backgroundColor = '#2196F3';
        }
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }
    
    // Initialize contact form
    initContactForm();
    
    // Explore Button Animation Functionality
    function initExploreButtonAnimation() {
        const exploreBtn = document.querySelector('.explore-btn');
        
        if (exploreBtn) {
            exploreBtn.addEventListener('click', function(e) {
                // Prevent default action if needed
                e.preventDefault();
                
                // Don't trigger animation if already animating
                if (this.classList.contains('extending')) {
                    return;
                }
                
                // If button is extended, shrink it back
                if (this.classList.contains('extended')) {
                    this.classList.remove('extended');
                    this.classList.add('shrinking');
                    
                    // After shrinking animation completes
                    setTimeout(() => {
                        this.classList.remove('shrinking');
                    }, 600);
                    return;
                }
                
                // If button is normal, extend it
                this.classList.remove('extending', 'extended', 'shrinking');
                
                // Trigger reflow to ensure class removal is processed
                this.offsetHeight;
                
                // Add extending class to start animation
                this.classList.add('extending');
                
                // After animation completes, add extended class
                setTimeout(() => {
                    this.classList.remove('extending');
                    this.classList.add('extended');
                }, 600); // Match animation duration
            });
        }
    }
    
    // Initialize explore button animation
    initExploreButtonAnimation();
    
    // Lenis utility functions
    // Smooth scroll to specific element
    window.smoothScrollTo = function(target, offset = 0) {
        if (lenis) {
            const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
            if (targetElement) {
                const targetPosition = targetElement.offsetTop - offset;
                lenis.scrollTo(targetPosition, {
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            }
        }
    };
    
    // Smooth scroll to top
    window.scrollToTop = function() {
        if (lenis) {
            lenis.scrollTo(0, {
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        }
    };
    
    // Pause/Resume Lenis
    window.pauseLenis = function() {
        if (lenis) lenis.stop();
    };
    
    window.resumeLenis = function() {
        if (lenis) lenis.start();
    };
    
    // Email Form Functionality
    initEmailForm();
});

// Email Form Initialization
function initEmailForm() {
    const emailForm = document.querySelector('.email-form');
    const emailInput = document.querySelector('.email-form-input');
    const submitBtn = document.querySelector('.email-form-submit');
    
    if (emailForm && emailInput && submitBtn) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            
            // Email validation
            if (!email) {
                showMessage('Please enter your email address.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // CAPTCHA validation - Contact us sayfasındaki gibi
            const recaptchaResponse = grecaptcha.getResponse();
            if (!recaptchaResponse) {
                showMessage('Please complete the CAPTCHA verification.', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Send email with CAPTCHA token
            sendEmail(email, recaptchaResponse);
        });
    }
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Send email function
async function sendEmail(email, recaptchaToken) {
    try {
        console.log('Sending email to:', email);
        console.log('CAPTCHA token:', recaptchaToken ? 'Present' : 'Missing');
        
        const response = await fetch('https://civilex-ai.onrender.com/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                subject: 'PilatesAI Test Phase Registration',
                message: `New test phase registration:\nEmail: ${email}\nDate: ${new Date().toLocaleString()}`,
                recaptchaToken: recaptchaToken
            })
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (response.ok) {
            const result = await response.json();
            console.log('Success response:', result);
            showMessage('Email sent successfully! Your registration has been recorded.', 'success');
            document.querySelector('.email-form-input').value = '';
            // Reset CAPTCHA
            grecaptcha.reset();
        } else {
            const errorData = await response.json();
            console.log('Error response:', errorData);
            throw new Error(errorData.message || 'Email sending failed');
        }
    } catch (error) {
        console.error('Email sending error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        showMessage(`Error: ${error.message}`, 'error');
        // Reset CAPTCHA on error
        grecaptcha.reset();
    } finally {
        // Reset button
        const submitBtn = document.querySelector('.email-form-submit');
        submitBtn.textContent = 'Submit';
        submitBtn.disabled = false;
    }
}

// Show message function
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.email-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `email-message email-message-${type}`;
    messageDiv.textContent = message;
    
    // Add styles
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#10B981';
    } else if (type === 'error') {
        messageDiv.style.backgroundColor = '#EF4444';
    } else if (type === 'info') {
        messageDiv.style.backgroundColor = '#3B82F6';
    }
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Animate in
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 300);
    }, 5000);
}

// reCAPTCHA callback functions - Contact us sayfasındaki gibi
window.onRecaptchaSuccess = function(token) {
    console.log('CAPTCHA completed successfully');
    // CAPTCHA başarılı olduğunda form'u submit et
    const emailForm = document.querySelector('.email-form');
    if (emailForm) {
        emailForm.dispatchEvent(new Event('submit'));
    }
};

window.onRecaptchaExpired = function() {
    console.log('CAPTCHA expired');
    showMessage('CAPTCHA verification expired. Please try again.', 'error');
};
