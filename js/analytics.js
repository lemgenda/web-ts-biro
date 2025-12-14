(function () {
    'use strict';

    const TSBiroAnalytics = {
        config: {
            enabled: false,
            trackingId: 'G-5XPS37WT1X'
        },

        init: function () {
            // Check if cookies were already accepted
            if (localStorage.getItem('cookiesAccepted') === 'true') {
                this.enable();
            }

            this.initializeEventTracking();
        },

        initializeGA4: function () {
            if (!this.config.enabled) return;

            try {
                // Create dataLayer if it doesn't exist
                window.dataLayer = window.dataLayer || [];

                // Define gtag function
                window.gtag = function gtag() {
                    window.dataLayer.push(arguments);
                };

                // Initialize GA4
                window.gtag('js', new Date());
                window.gtag('config', this.config.trackingId, {
                    page_title: document.title,
                    page_location: window.location.href,
                    page_path: window.location.pathname
                });

                // Load GA4 script
                const script = document.createElement('script');
                script.async = true;
                script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.trackingId}`;
                document.head.appendChild(script);

            } catch (error) {
                console.error('GA4 initialization error:', error);
            }
        },

        initializeEventTracking: function () {
            // Event tracking will be set up after GA4 is initialized
            if (!this.config.enabled) return;

            this.setupFormTracking();
            this.setupLinkTracking();
            this.setupScrollTracking();
            this.setupVisibilityTracking();
        },

        setupFormTracking: function () {
            // Track form focus
            document.querySelectorAll('input, textarea, select').forEach(field => {
                field.addEventListener('focus', () => {
                    if (this.config.enabled && window.gtag) {
                        window.gtag('event', 'form_field_focus', {
                            field_name: field.name || field.id || 'unknown',
                            field_type: field.type,
                            form_id: field.form?.id || 'unknown'
                        });
                    }
                });
            });

            // Track form submissions
            document.addEventListener('submit', (e) => {
                if (e.target.tagName === 'FORM' && this.config.enabled && window.gtag) {
                    const form = e.target;
                    window.gtag('event', 'form_submit', {
                        form_id: form.id || 'unknown',
                        form_name: form.getAttribute('name') || 'unknown',
                        form_method: form.method || 'post'
                    });
                }
            });
        },

        setupLinkTracking: function () {
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a');
                if (!link || !link.href || !this.config.enabled || !window.gtag) return;

                const href = link.href;
                const currentHost = window.location.hostname;

                // Track external links
                if (href.includes('://') && !href.includes(currentHost)) {
                    window.gtag('event', 'outbound_click', {
                        link_url: href,
                        link_text: link.textContent.substring(0, 100)
                    });
                }

                // Track internal navigation
                if (href.includes(currentHost) || href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) {
                    window.gtag('event', 'internal_click', {
                        link_url: href,
                        link_text: link.textContent.substring(0, 100)
                    });
                }
            });
        },

        setupScrollTracking: function () {
            let lastScrollPercentage = 0;
            const milestones = [25, 50, 75, 100];

            window.addEventListener('scroll', () => {
                if (!this.config.enabled || !window.gtag) return;

                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrollPercentage = Math.round((scrollTop / scrollHeight) * 100);

                milestones.forEach(milestone => {
                    if (scrollPercentage >= milestone && lastScrollPercentage < milestone) {
                        window.gtag('event', 'scroll_depth', {
                            scroll_percentage: milestone,
                            page_title: document.title,
                            page_url: window.location.href
                        });
                    }
                });

                lastScrollPercentage = scrollPercentage;
            });
        },

        setupVisibilityTracking: function () {
            document.addEventListener('visibilitychange', () => {
                if (this.config.enabled && window.gtag) {
                    const state = document.visibilityState;
                    window.gtag('event', 'page_visibility', {
                        visibility_state: state,
                        page_title: document.title,
                        page_url: window.location.href
                    });
                }
            });
        },

        // Enable analytics
        enable: function () {
            this.config.enabled = true;
            this.initializeGA4();

            // Track that cookies were accepted
            if (window.gtag) {
                window.gtag('event', 'cookies_accepted');
            }
        },

        // GA4 event tracking
        trackEvent: function (eventName, eventParams = {}) {
            if (!this.config.enabled || !window.gtag) return;

            try {
                window.gtag('event', eventName, {
                    ...eventParams,
                    send_to: this.config.trackingId
                });
            } catch (error) {
                console.warn('GA4 event tracking error:', error);
            }
        }
    };

    // Initialize analytics module when DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        TSBiroAnalytics.init();
    });

    // Export to global scope
    window.TSBiroAnalytics = TSBiroAnalytics;
})();