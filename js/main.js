(function () {
    'use strict';

    const TSBiroMain = {
        init: function () {
            // Initialize in specific order
            this.initializeMobileMenu();
            this.initializeFAQ();
            this.initializeTestimonialCarousel();
            this.initializeHeroSlider();
            this.initializeBackToTop();
            this.initializeSmoothScrolling();
            this.initializeCookieConsent();
            this.initializeKeyboardNavigation();
            this.initializeLazyLoading();

            // Check if forms module exists and initialize
            if (window.TSBiroForms && typeof window.TSBiroForms.init === 'function') {
                window.TSBiroForms.init();
            }
        },

        // Mobile menu - FIXED
        initializeMobileMenu: function () {
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const navMenu = document.querySelector('.nav-menu');

            if (mobileMenuBtn && navMenu) {
                mobileMenuBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const isExpanded = this.getAttribute('aria-expanded') === 'true';
                    this.setAttribute('aria-expanded', !isExpanded);
                    navMenu.classList.toggle('active');

                    const icon = this.querySelector('i');
                    if (icon) {
                        icon.className = navMenu.classList.contains('active')
                            ? 'fa-solid fa-times'
                            : 'fa-solid fa-bars';
                    }
                });

                // Close menu when clicking on links
                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        if (navMenu.classList.contains('active')) {
                            mobileMenuBtn.setAttribute('aria-expanded', 'false');
                            navMenu.classList.remove('active');
                            const icon = mobileMenuBtn.querySelector('i');
                            if (icon) icon.className = 'fa-solid fa-bars';
                        }
                    });
                });

                // Close menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (navMenu.classList.contains('active') &&
                        !e.target.closest('.nav-menu') &&
                        !e.target.closest('.mobile-menu-btn')) {
                        mobileMenuBtn.setAttribute('aria-expanded', 'false');
                        navMenu.classList.remove('active');
                        const icon = mobileMenuBtn.querySelector('i');
                        if (icon) icon.className = 'fa-solid fa-bars';
                    }
                });
            }
        },

        // FAQ - FIXED
        initializeFAQ: function () {
            const faqQuestions = document.querySelectorAll('.faq-question');
            if (faqQuestions.length === 0) return;

            faqQuestions.forEach(question => {
                // Set initial state
                question.setAttribute('aria-expanded', 'false');

                question.addEventListener('click', function () {
                    const isExpanded = this.getAttribute('aria-expanded') === 'true';
                    const answer = this.nextElementSibling;

                    if (!answer || !answer.classList.contains('faq-answer')) return;

                    this.setAttribute('aria-expanded', !isExpanded);
                    answer.classList.toggle('active');

                    const icon = this.querySelector('.faq-icon');
                    if (icon) {
                        icon.textContent = isExpanded ? '+' : '−';
                    }
                });
            });
        },

        // Testimonial carousel - FIXED
        initializeTestimonialCarousel: function () {
            const testimonials = document.querySelectorAll('.testimonial');
            if (testimonials.length === 0) return;

            const prevBtn = document.querySelector('.testimonial-prev');
            const nextBtn = document.querySelector('.testimonial-next');
            const dots = document.querySelectorAll('.testimonial-dot');

            let currentIndex = 0;
            let autoPlayInterval;

            function showTestimonial(index) {
                // Ensure index is within bounds
                if (index < 0) index = testimonials.length - 1;
                if (index >= testimonials.length) index = 0;

                testimonials.forEach(testimonial => {
                    testimonial.classList.remove('active');
                });

                dots.forEach(dot => {
                    dot.classList.remove('active');
                });

                testimonials[index].classList.add('active');
                if (dots[index]) dots[index].classList.add('active');

                currentIndex = index;
                updateButtonStates();
            }

            function updateButtonStates() {
                if (prevBtn) {
                    prevBtn.disabled = currentIndex === 0;
                }
                if (nextBtn) {
                    nextBtn.disabled = currentIndex === testimonials.length - 1;
                }
            }

            function nextTestimonial() {
                showTestimonial(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
            }

            function prevTestimonial() {
                showTestimonial(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
            }

            function startAutoPlay() {
                if (!autoPlayInterval) {
                    autoPlayInterval = setInterval(nextTestimonial, 5000);
                }
            }

            function stopAutoPlay() {
                if (autoPlayInterval) {
                    clearInterval(autoPlayInterval);
                    autoPlayInterval = null;
                }
            }

            // Event listeners
            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    stopAutoPlay();
                    prevTestimonial();
                    startAutoPlay();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    stopAutoPlay();
                    nextTestimonial();
                    startAutoPlay();
                });
            }

            // Event listeners for dots
            dots.forEach((dot, index) => {
                dot.addEventListener('click', (e) => {
                    e.preventDefault();
                    stopAutoPlay();
                    showTestimonial(index);
                    startAutoPlay();
                });
            });

            // Initialize
            showTestimonial(0);
            startAutoPlay();
        },

        // Hero slider - FIXED
        initializeHeroSlider: function () {
            const heroSlides = document.querySelectorAll('.hero-slide');
            if (heroSlides.length === 0) return;

            const prevButton = document.querySelector('.slider-prev');
            const nextButton = document.querySelector('.slider-next');
            const dots = document.querySelectorAll('.slider-dot');

            let currentSlide = 0;
            let heroAutoPlayInterval;

            function showSlide(index) {
                heroSlides.forEach(slide => slide.classList.remove('active'));
                dots.forEach(dot => dot.classList.remove('active'));

                heroSlides[index].classList.add('active');
                if (dots[index]) dots[index].classList.add('active');

                currentSlide = index;
            }

            function nextSlide() {
                const nextIndex = currentSlide === heroSlides.length - 1 ? 0 : currentSlide + 1;
                showSlide(nextIndex);
            }

            function prevSlide() {
                const prevIndex = currentSlide === 0 ? heroSlides.length - 1 : currentSlide - 1;
                showSlide(prevIndex);
            }

            function startHeroAutoPlay() {
                if (!heroAutoPlayInterval) {
                    heroAutoPlayInterval = setInterval(nextSlide, 6000);
                }
            }

            function stopHeroAutoPlay() {
                if (heroAutoPlayInterval) {
                    clearInterval(heroAutoPlayInterval);
                    heroAutoPlayInterval = null;
                }
            }

            // Event listeners
            if (prevButton) {
                prevButton.addEventListener('click', () => {
                    stopHeroAutoPlay();
                    prevSlide();
                    startHeroAutoPlay();
                });
            }

            if (nextButton) {
                nextButton.addEventListener('click', () => {
                    stopHeroAutoPlay();
                    nextSlide();
                    startHeroAutoPlay();
                });
            }

            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    stopHeroAutoPlay();
                    showSlide(index);
                    startHeroAutoPlay();
                });
            });

            // Start auto-play
            startHeroAutoPlay();
        },

        // Back to top - FIXED
        initializeBackToTop: function () {
            const backToTopButton = document.querySelector('.back-to-top');
            if (!backToTopButton) return;

            // Check scroll position on load
            window.addEventListener('load', () => {
                const isVisible = window.pageYOffset > 300;
                backToTopButton.classList.toggle('visible', isVisible);
            });

            window.addEventListener('scroll', () => {
                const isVisible = window.pageYOffset > 300;
                backToTopButton.classList.toggle('visible', isVisible);
            });

            backToTopButton.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        },

        // Smooth scrolling - FIXED
        initializeSmoothScrolling: function () {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;

                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const header = document.querySelector('header');
                        const headerHeight = header ? header.offsetHeight : 0;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        },

        // Cookie consent - FIXED
        initializeCookieConsent: function () {
            const cookieConsent = document.querySelector('.cookie-consent');
            if (!cookieConsent) return;

            // Check if already accepted/rejected
            const cookiesAccepted = localStorage.getItem('cookiesAccepted');
            if (cookiesAccepted !== null) {
                cookieConsent.style.display = 'none';

                // Enable analytics if accepted
                if (cookiesAccepted === 'true' && window.TSBiroAnalytics) {
                    window.TSBiroAnalytics.enable();
                }
                return;
            }

            // Show after delay
            setTimeout(() => {
                cookieConsent.style.display = 'block';
            }, 2000);

            const acceptCookies = document.querySelector('#acceptCookies');
            const rejectCookies = document.querySelector('#rejectCookies');

            if (acceptCookies) {
                acceptCookies.addEventListener('click', () => {
                    localStorage.setItem('cookiesAccepted', 'true');
                    cookieConsent.style.display = 'none';

                    // Enable analytics
                    if (window.TSBiroAnalytics) {
                        window.TSBiroAnalytics.enable();
                    }
                });
            }

            if (rejectCookies) {
                rejectCookies.addEventListener('click', () => {
                    localStorage.setItem('cookiesAccepted', 'false');
                    cookieConsent.style.display = 'none';
                });
            }
        },

        // Keyboard navigation - FIXED
        initializeKeyboardNavigation: function () {
            document.addEventListener('keydown', function (e) {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                    return;
                }

                // Escape key closes mobile menu and FAQ
                if (e.key === 'Escape') {
                    const mobileMenu = document.querySelector('.nav-menu.active');
                    if (mobileMenu) {
                        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                        mobileMenuBtn.setAttribute('aria-expanded', 'false');
                        mobileMenu.classList.remove('active');
                        const icon = mobileMenuBtn.querySelector('i');
                        if (icon) icon.className = 'fa-solid fa-bars';
                    }

                    const openFAQ = document.querySelector('.faq-question[aria-expanded="true"]');
                    if (openFAQ) {
                        const answer = openFAQ.nextElementSibling;
                        const icon = openFAQ.querySelector('.faq-icon');
                        openFAQ.setAttribute('aria-expanded', 'false');
                        answer.classList.remove('active');
                        if (icon) icon.textContent = '+';
                    }
                }
            });
        },

        // Lazy loading - FIXED
        initializeLazyLoading: function () {
            const lazyImages = document.querySelectorAll('img[data-src]');
            if (lazyImages.length === 0) return;

            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            if (img.dataset.srcset) img.srcset = img.dataset.srcset;
                            img.removeAttribute('data-src');
                            img.removeAttribute('data-srcset');
                            imageObserver.unobserve(img);
                        }
                    });
                });

                lazyImages.forEach(img => imageObserver.observe(img));
            } else {
                // Fallback for older browsers
                lazyImages.forEach(img => {
                    img.src = img.dataset.src;
                    if (img.dataset.srcset) img.srcset = img.dataset.srcset;
                    img.removeAttribute('data-src');
                    img.removeAttribute('data-srcset');
                });
            }
        }
    };

    // Export to global scope
    window.TSBiroMain = TSBiroMain;

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        if (window.TSBiroMain && typeof window.TSBiroMain.init === 'function') {
            window.TSBiroMain.init();
        }
    });
})();