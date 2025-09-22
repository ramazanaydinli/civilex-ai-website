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

        console.log(`Current page: ${currentPage}`);
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
        
        console.log(`Dot clicked! Page: ${pageNumber}`);
        console.log('Current page set to:', currentCasePage);
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
        console.log('Updating case studies pagination...');
        console.log('Current page:', currentCasePage);
        
        // Update ALL pagination dots in ALL containers
        const allCaseDots = document.querySelectorAll('.case-pagination-dot');
        console.log('Total dots found:', allCaseDots.length);
        
        allCaseDots.forEach((dot, index) => {
            const dotPosition = index % 3; // 0, 1, 2
            const shouldBeActive = dotPosition + 1 === currentCasePage;
            dot.classList.toggle('active', shouldBeActive);
            console.log(`Dot ${index + 1} (position ${dotPosition + 1}): ${shouldBeActive ? 'active' : 'inactive'}`);
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

        console.log(`Current case study page: ${currentCasePage}`);
        
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
                    console.log('Radio button changed to:', this.value);
                    updateFormForOption(this.value);
                }
            });
        });
        
        // Form submission
        if (contactForm) {
            console.log('✅ Contact form found and event listener added');
            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                console.log('📝 Form submit event triggered');
                
                // Get form data
                const formData = new FormData(this);
                const fullName = formData.get('fullName');
                const email = formData.get('email');
                const message = formData.get('message');
                const contactType = formData.get('contact-type');
                
                console.log('📋 Form data collected:', {
                    fullName,
                    email,
                    message: message?.substring(0, 50) + '...',
                    contactType
                });
                
                // Basic validation
                if (!fullName || !email || !message) {
                    showNotification('Lütfen tüm alanları doldurun.', 'error');
                    return;
                }
                
                if (!isValidEmail(email)) {
                    showNotification('Lütfen geçerli bir e-posta adresi girin.', 'error');
                    return;
                }
                
                // Show loading state
                const submitBtn = this.querySelector('.submit-btn');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Gönderiliyor...';
                submitBtn.disabled = true;
                
                // Simulate form submission (no backend)
                console.log('📝 Form submitted successfully (simulation)');
                showNotification('Mesajınız alındı! En kısa sürede size dönüş yapacağız.', 'success');
                
                // Reset form
                this.reset();
                
                // Reset to first option
                const firstRadio = document.getElementById('say-hi');
                if (firstRadio) {
                    firstRadio.checked = true;
                    // Remove active class from all options
                    document.querySelectorAll('.form-option').forEach(option => {
                        option.classList.remove('active');
                    });
                    // Add active class to first option
                    firstRadio.closest('.form-option').classList.add('active');
                    updateFormForOption('say-hi');
                }
                
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        }
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
                notification.style.backgroundColor = '#4CAF50';
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
    console.log('🔧 Initializing contact form...');
    initContactForm();
    
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
});
