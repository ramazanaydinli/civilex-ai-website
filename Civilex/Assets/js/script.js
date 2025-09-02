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

// Page load scroll to top
window.addEventListener('load', function() {
    // Scroll to top when page is loaded
    window.scrollTo(0, 0);
});

// Also scroll to top when page is refreshed
window.addEventListener('beforeunload', function() {
    // Scroll to top before page refresh
    window.scrollTo(0, 0);
});

// Force scroll to top on page refresh
if (window.performance && window.performance.navigation && window.performance.navigation.type === 1) {
    // Page was refreshed, scroll to top
    window.scrollTo(0, 0);
}

// Additional method - check if page was refreshed
let isPageRefreshed = false;

// Check if page was refreshed using sessionStorage
if (sessionStorage.getItem('pageRefreshed') === 'true') {
    isPageRefreshed = true;
    sessionStorage.removeItem('pageRefreshed');
}

// If page was refreshed, scroll to top
if (isPageRefreshed) {
    window.scrollTo(0, 0);
}

// Set flag when page is about to refresh
window.addEventListener('beforeunload', function() {
    sessionStorage.setItem('pageRefreshed', 'true');
});

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

    // Pagination Functionality
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const paginationDots = document.querySelectorAll('.pagination-dot');
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
    
    // Case Studies Pagination Functionality
    const casePaginationDots = document.querySelectorAll('.case-pagination-dot');
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
    
    // Video click events - play/pause functionality
    function addVideoClickEvents() {
        const allVideos = document.querySelectorAll('.case-study-video video');
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

    // Initialize video click events
    addVideoClickEvents();
    
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
