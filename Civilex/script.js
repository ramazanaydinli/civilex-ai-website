// ========================================
// CIVILEX.AI - MAIN JAVASCRIPT FILE
// ========================================

// Process item'ları header kısmına tıklanabilir yap (title, numara, boşluklar dahil)
document.addEventListener('DOMContentLoaded', function() {
    // Process Items Functionality
    document.querySelectorAll('.process-header').forEach(header => {
        header.addEventListener('click', function() {
            const processItem = this.closest('.process-item');
            processItem.classList.toggle('active');
        });
    });

    // Team Slider Functionality
    let currentSlide = 0;
    const slides = document.querySelectorAll('.team-slide');
    const dots = document.querySelectorAll('.pagination-dot');
    const totalSlides = slides.length;

    function showSlide(slideIndex) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide
        slides[slideIndex].classList.add('active');
        dots[slideIndex].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    // Auto-advance slides every 5 seconds
    // setInterval(nextSlide, 5000); // Otomatik değişim kaldırıldı

    // Add click event to pagination dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Initialize first slide
    showSlide(0);
});
