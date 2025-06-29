// Gallery page functionality
document.addEventListener('DOMContentLoaded', function() {
    initGalleryFilters();
    initLightbox();
    loadCartFromStorage();
});

let currentImageIndex = 0;
let galleryImages = [];

// Gallery filtering
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Update gallery images array for lightbox navigation
            updateGalleryImages();
        });
    });
    
    // Initialize gallery images array
    updateGalleryImages();
}

function updateGalleryImages() {
    const visibleItems = document.querySelectorAll('.gallery-item[style*="block"], .gallery-item:not([style*="none"])');
    galleryImages = Array.from(visibleItems).map(item => {
        const img = item.querySelector('img');
        return {
            src: img.src,
            alt: img.alt
        };
    });
}

// Lightbox functionality
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    
    // Close lightbox when clicking outside image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });
}

function openLightbox(imgElement) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    
    if (!lightbox || !lightboxImage) return;
    
    // Find current image index
    const imgSrc = imgElement.src;
    currentImageIndex = galleryImages.findIndex(img => img.src === imgSrc);
    
    if (currentImageIndex === -1) {
        currentImageIndex = 0;
    }
    
    // Set image and show lightbox
    lightboxImage.src = imgSrc;
    lightboxImage.alt = imgElement.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function prevImage() {
    if (galleryImages.length === 0) return;
    
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
}

function nextImage() {
    if (galleryImages.length === 0) return;
    
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    const lightboxImage = document.getElementById('lightbox-image');
    if (lightboxImage && galleryImages[currentImageIndex]) {
        lightboxImage.src = galleryImages[currentImageIndex].src;
        lightboxImage.alt = galleryImages[currentImageIndex].alt;
    }
}

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
        touchStartX = e.changedTouches[0].screenX;
    }
});

document.addEventListener('touchend', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextImage(); // Swipe left - next image
        } else {
            prevImage(); // Swipe right - previous image
        }
    }
}

// Lazy loading for gallery images
function initLazyLoading() {
    const images = document.querySelectorAll('.gallery-item img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if needed
document.addEventListener('DOMContentLoaded', initLazyLoading);

// Gallery data for reference
const galleryData = {
    produits: [
        {
            src: 'https://images.pexels.com/photos/9558583/pexels-photo-9558583.jpeg?auto=compress&cs=tinysrgb&w=600',
            alt: 'Collection robes africaines',
            title: 'Collection Robes',
            description: 'Robes traditionnelles en wax'
        },
        // Add more gallery items as needed
    ],
    services: [
        {
            src: 'https://images.pexels.com/photos/6663542/pexels-photo-6663542.jpeg?auto=compress&cs=tinysrgb&w=600',
            alt: 'Tresses africaines',
            title: 'Tresses Africaines',
            description: 'Coiffures traditionnelles'
        },
        // Add more gallery items as needed
    ],
    // Add more categories as needed
};