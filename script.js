document.addEventListener('DOMContentLoaded', () => {
    // 1. Page Loader Logic
    const loader = document.getElementById('loader');

    // Hide loader after load
    const hideLoader = () => {
        if (loader) {
            loader.classList.add('hidden');
            document.body.style.overflow = ''; // Release scroll
        }
    };

    // Show loader for internal navigation
    const showLoader = () => {
        if (loader) {
            loader.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    };

    // Auto-hide loader initially
    if (loader) {
        document.body.style.overflow = 'hidden';
        setTimeout(hideLoader, 1000);
    }

    // 2. Clear Page Transitions
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && link.target !== '_blank') {
                e.preventDefault();
                showLoader();
                setTimeout(() => { window.location.href = href; }, 400);
            }
        });
    });



    // 3. Mobile Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavClose = document.getElementById('mobileNavClose');

    const openMobileNav = () => {
        if (hamburger) hamburger.classList.add('open');
        if (mobileNavOverlay) mobileNavOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeMobileNav = () => {
        if (hamburger) hamburger.classList.remove('open');
        if (mobileNavOverlay) mobileNavOverlay.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (hamburger) hamburger.addEventListener('click', openMobileNav);
    if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);

    // Close on overlay link click
    if (mobileNavOverlay) {
        mobileNavOverlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileNav);
        });
    }

    // 4. Accordion Logic (FAQ)
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (header) {
            header.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');

                // Close others
                accordionItems.forEach(other => {
                    other.classList.remove('active');
                    const content = other.querySelector('.accordion-content');
                    if (content) content.style.maxHeight = null;
                });

                // Toggle current
                if (!isOpen) {
                    item.classList.add('active');
                    const content = item.querySelector('.accordion-content');
                    if (content) content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        }
    });

    // 5. Scroll Performance (Header & Reveal)
    const header = document.querySelector('header');
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // Header styles
        if (header) {
            header.classList.toggle('scrolled', currentScrollY > 20);
            header.classList.toggle('nav-hidden', currentScrollY > lastScrollY && currentScrollY > 150);
        }

        lastScrollY = currentScrollY;
    };

    // Efficient scroll listener
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Intersection Observer for reveal elements
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('is-visible'));
    }

    // 6. Special Offers Carousel Logic
    const carouselSection = document.querySelector('.offers-carousel-container');
    const offerSlides = document.querySelectorAll('.offer-slide');
    const dots = document.querySelectorAll('.carousel-dot');

    if (offerSlides.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        const showSlide = (index) => {
            offerSlides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            offerSlides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        };

        const nextSlide = () => {
            let index = (currentSlide + 1) % offerSlides.length;
            showSlide(index);
        };

        const startSlideShow = () => {
            stopSlideShow();
            slideInterval = setInterval(nextSlide, 8000); // 8 seconds to allow plenty of time to read
        };

        const stopSlideShow = () => {
            if (slideInterval) clearInterval(slideInterval);
        };

        // Event Listeners
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                startSlideShow();
            });
        });

        // Pause on hover
        if (carouselSection) {
            carouselSection.addEventListener('mouseenter', stopSlideShow);
            carouselSection.addEventListener('mouseleave', startSlideShow);
        }

        // Initialize
        startSlideShow();
    }

    handleScroll();
});

