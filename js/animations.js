document.addEventListener('DOMContentLoaded', function() {
    initParallaxEffects();
    initCounterAnimations();
    initTextAnimations();
    initHoverEffects();
    initPageTransitions();
    initScrollAnimations();
    // initCustomCursor(); // Disabled for performance
    // initParticleSystem(); // Disabled for performance
});

function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rate = scrolled * -0.5;
            element.style.transform = `translateY(${rate}px)`;
        });
    }
    
    let ticking = false;
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', function() {
        requestTick();
        ticking = false;
    });
}

function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-counter]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-counter'));
    const duration = 2000;
    const start = Date.now();
    const startValue = 0;
    
    function updateCounter() {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(startValue + (target - startValue) * easeOut);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    updateCounter();
}

function initTextAnimations() {
    const textElements = document.querySelectorAll('[data-text-animation]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animationType = entry.target.getAttribute('data-text-animation');
                animateText(entry.target, animationType);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    textElements.forEach(element => observer.observe(element));
}

function animateText(element, type) {
    switch (type) {
        case 'fadeInWords':
            animateWords(element);
            break;
        case 'typewriter':
            animateTypewriter(element);
            break;
        default:
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
    }
}

function animateWords(element) {
    const text = element.textContent;
    const words = text.split(' ');
    
    element.innerHTML = words.map(word => 
        `<span class="word" style="opacity: 0; transform: translateY(20px); display: inline-block;">${word}</span>`
    ).join(' ');
    
    const wordElements = element.querySelectorAll('.word');
    
    wordElements.forEach((word, index) => {
        setTimeout(() => {
            word.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            word.style.opacity = '1';
            word.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function animateTypewriter(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.opacity = '1';
    
    let index = 0;
    
    function typeChar() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(typeChar, 50);
        }
    }
    
    typeChar();
}

function initHoverEffects() {
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    
    magneticElements.forEach(element => {
        // Ensure pointer events are not blocked
        element.style.pointerEvents = 'auto';
        
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const strength = 0.3;
            const moveX = x * strength;
            const moveY = y * strength;
            
            this.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
        
        // Prevent mousemove from blocking click events
        element.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        });
    });
    
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            const rotateX = (mouseY / rect.height) * 20;
            const rotateY = (mouseX / rect.width) * -20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}

function initPageTransitions() {
    const links = document.querySelectorAll('a[href$=".html"]:not([target="_blank"])');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-scroll-animation]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animationType = entry.target.getAttribute('data-scroll-animation');
                entry.target.classList.add('animate-' + animationType);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => observer.observe(element));
}