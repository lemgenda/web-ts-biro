(function () {
    'use strict';

    // Configuration
    const CONFIG = {
        modules: {
            main: true,
            forms: true,
            seo: true,
            analytics: true
        },
        siteInfo: {
            name: 'TS-Biro Knjigovodstvo Sisak',
            baseUrl: window.location.hostname === '127.0.0.1' ?
                'http://127.0.0.1:5500' : 'https://www.ts-biro.hr',
            logo: 'images/TS-Biro-Circle-logo.svg',
            currentYear: new Date().getFullYear(),
            phone: '+385 91 521 2770',
            email: 'info@ts-biro.hr',
            address: 'Ferde Livadića 29, 44000 Sisak'
        },
        analytics: {
            enabled: false,
            trackingId: 'G-5XPS37WT1X',
            measurementId: 'G-5XPS37WT1X'
        },
        contact: {
            endpoint: 'https://formspree.io/f/xxxxxxxx'
        }
    };

    // Dynamic module loader
    function loadModule(moduleName) {
        if (!CONFIG.modules[moduleName]) return Promise.resolve();

        return new Promise((resolve, reject) => {
            try {
                // Check if module is already loaded
                if (window[`TSBiro${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`]) {
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.src = `js/${moduleName}.js?v=${CONFIG.siteInfo.currentYear}`;
                script.defer = true;
                script.onload = () => {
                    resolve();
                };
                script.onerror = (error) => {
                    console.warn(`Module ${moduleName} failed to load:`, error);
                    reject(new Error(`Module ${moduleName} failed to load`));
                };
                document.head.appendChild(script);
            } catch (error) {
                console.warn(`Error loading module ${moduleName}:`, error);
                reject(error);
            }
        });
    }

    // Generate header with navigation
    function generateHeader() {
        const header = document.querySelector('header');
        if (!header) return;

        header.innerHTML = `
            <div class="container">
                <div class="header-container">
                    <a href="./" class="logo" aria-label="TS-Biro Knjigovodstvo Sisak - Početna stranica" title="TS-Biro - Obiteljska računovodstvena tvrtka u Sisku">
                        <img src="${CONFIG.siteInfo.logo}" width="128" height="50"
                             alt="TS-Biro Knjigovodstvo Sisak - Profesionalno računovodstvo"
                             title="TS-Biro - Obiteljska računovodstvena tvrtka u Sisku"
                             loading="eager" class="logo-img">
                    </a>
                </div>
            </div>
        `;

        generateNavigation();
    }

    // Generate navigation with SEO-optimized links
    function generateNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const isLegalPage = ['404.html', 'privatnost.html', 'uvjeti.html'].includes(currentPage);
        const isHomePage = currentPage === 'index.html' || currentPage === '';

        const navItems = [
            {
                text: 'O nama',
                href: isHomePage ? '#onama' : './#onama',
                title: 'O nama - TS-Biro računovodstvena tvrtka Sisak'
            },
            {
                text: 'Klijenti',
                href: isHomePage ? '#klijenti' : './#klijenti',
                title: 'Iskustva klijenata - TS-Biro knjigovodstvo Sisak'
            },
            {
                text: 'Kontakt',
                href: isLegalPage || isHomePage ? './#kontakt' : '#kontakt',
                title: 'Kontaktirajte TS-Biro knjigovodstvo Sisak'
            },
            {
                text: 'Računovodstvo',
                href: './knjigovodstvo-racunovodstvo.html',
                title: 'Knjigovodstvo i računovodstvene usluge Sisak - TS-Biro'
            },
            {
                text: 'Plaće',
                href: './place-kadrovska-evidencija.html',
                title: 'Obračun plaća i kadrovska evidencija Sisak - TS-Biro'
            },
            {
                text: 'Savjetovanje',
                href: './financijsko-poslovno-savjetovanje.html',
                title: 'Financijsko i poslovno savjetovanje Sisak - TS-Biro'
            },
            {
                text: 'Vještačenje',
                href: './sudsko-vjestacenje.html',
                title: 'Financijska i računovodstvena vještačenja Sisak - TS-Biro'
            }
        ];

        const headerContainer = document.querySelector('.header-container');
        if (!headerContainer) return;

        const nav = document.createElement('nav');
        nav.setAttribute('aria-label', 'Glavna navigacija TS-Biro knjigovodstvo');

        nav.innerHTML = `
            <button class="mobile-menu-btn" aria-expanded="false" aria-controls="primary-navigation"
                    aria-label="Otvori navigacijski izbornik TS-Biro" title="Navigacijski izbornik">
                <span class="sr-only">Meni</span>
                <i class="fa-solid fa-bars" aria-hidden="true"></i>
            </button>
            <ul class="nav-menu" id="primary-navigation">
                ${navItems.map(item => `
                    <li class="nav-item">
                        <a href="${item.href}" class="nav-link" title="${item.title}">
                            ${item.text}
                        </a>
                    </li>
                `).join('')}
            </ul>
        `;

        headerContainer.appendChild(nav);
    }

    // Generate navigation breadcrumbs
    function generateBreadcrumbs() {
        try {
            const breadcrumbsElement = document.querySelector('.breadcrumbs');
            if (!breadcrumbsElement) return;

            let container = breadcrumbsElement.querySelector('.container');
            if (!container) {
                container = document.createElement('div');
                container.className = 'container';
                breadcrumbsElement.appendChild(container);
            }

            const currentPage = window.location.pathname.split('/').pop() || 'index.html';

            const pageMappings = {
                'knjigovodstvo-racunovodstvo.html': {
                    name: 'Knjigovodstvo i računovodstvene usluge Sisak',
                    icon: 'fa-book',
                    url: 'knjigovodstvo-racunovodstvo.html',
                    keyword: 'knjigovodstvo Sisak'
                },
                'place-kadrovska-evidencija.html': {
                    name: 'Obračun Plaća i Kadrovska Evidencija Sisak',
                    icon: 'fa-calculator',
                    url: 'place-kadrovska-evidencija.html',
                    keyword: 'obračun plaća Sisak'
                },
                'financijsko-poslovno-savjetovanje.html': {
                    name: 'Financijsko i Poslovno Savjetovanje Sisak',
                    icon: 'fa-chart-line',
                    url: 'financijsko-poslovno-savjetovanje.html',
                    keyword: 'financijsko savjetovanje Sisak'
                },
                'sudsko-vjestacenje.html': {
                    name: 'Financijska i Računovodstvena Vještačenja Sisak',
                    icon: 'fa-balance-scale',
                    url: 'sudsko-vjestacenje.html',
                    keyword: 'vještačenja Sisak'
                },
                'privatnost.html': {
                    name: 'Politika Privatnosti',
                    icon: 'fa-shield-alt',
                    url: 'privatnost.html',
                    keyword: 'politika privatnosti'
                },
                'uvjeti.html': {
                    name: 'Uvjeti Korištenja',
                    icon: 'fa-file-contract',
                    url: 'uvjeti.html',
                    keyword: 'uvjeti korištenja'
                },
                '404.html': {
                    name: 'Stranica nije pronađena',
                    icon: 'fa-exclamation-triangle',
                    url: '404.html',
                    keyword: '404 stranica'
                },
                'index.html': {
                    name: 'Početna - TS-Biro Knjigovodstvo Sisak',
                    icon: 'fa-home',
                    url: 'index.html',
                    keyword: 'početna stranica'
                }
            };

            const pageInfo = pageMappings[currentPage];
            if (!pageInfo) {
                breadcrumbsElement.style.display = 'none';
                return;
            }

            const isHomePage = currentPage === 'index.html' || currentPage === '';

            let breadcrumbHTML = `
            <nav aria-label="Navigacijski put" class="breadcrumb-container">
                <ol class="breadcrumb-nav" aria-label="Navigacijski put TS-Biro" itemscope itemtype="https://schema.org/BreadcrumbList">
                    <li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                        <a href="./" class="breadcrumb-link" itemprop="item" title="Početna stranica TS-Biro knjigovodstvo">
                            <i class="fas fa-home" aria-hidden="true"></i>
                            <span itemprop="name">Početna - TS-Biro Sisak</span>
                        </a>
                        <meta itemprop="position" content="1" />
                    </li>
            `;

            if (!isHomePage) {
                breadcrumbHTML += `
                    <li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                        <span class="breadcrumb-current" aria-current="page" itemprop="item">
                            <i class="fas ${pageInfo.icon}" aria-hidden="true"></i>
                            <span itemprop="name">${pageInfo.name}</span>
                        </span>
                        <meta itemprop="position" content="2" />
                    </li>
                `;
            }

            breadcrumbHTML += `
                </ol>
            </nav>
            `;

            container.innerHTML = breadcrumbHTML;

            // Update breadcrumb structured data
            updateBreadcrumbStructuredData(currentPage, pageInfo);
        } catch (error) {
            console.warn('Breadcrumb generation error:', error);
        }
    }

    // Update breadcrumb structured data
    function updateBreadcrumbStructuredData(currentPage, pageInfo) {
        try {
            const isHomePage = currentPage === 'index.html' || currentPage === '';
            const baseUrl = CONFIG.siteInfo.baseUrl;

            const breadcrumbData = {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Početna - TS-Biro Knjigovodstvo Sisak",
                        "item": baseUrl + "/"
                    }
                ]
            };

            if (!isHomePage) {
                breadcrumbData.itemListElement.push({
                    "@type": "ListItem",
                    "position": 2,
                    "name": pageInfo.name,
                    "item": baseUrl + "/" + pageInfo.url
                });
            }

            // Remove existing breadcrumb structured data
            const existingScript = document.querySelector('script[data-type="breadcrumb-dynamic"]');
            if (existingScript) {
                existingScript.remove();
            }

            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.setAttribute('data-type', 'breadcrumb-dynamic');
            script.textContent = JSON.stringify(breadcrumbData);
            document.head.appendChild(script);
        } catch (error) {
            console.warn('Breadcrumb structured data error:', error);
        }
    }

    // Generate footer with optimized content
    function generateFooter() {
        const footer = document.querySelector('footer');
        if (!footer) return;

        footer.innerHTML = `
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <div class="logo" itemscope itemtype="https://schema.org/AccountingService">
                            <img src="${CONFIG.siteInfo.logo}" width="255" height="100"
                                 alt="TS-Biro Knjigovodstvo Sisak - Logo"
                                 title="TS-Biro - Obiteljska računovodstvena tvrtka"
                                 loading="lazy" class="logo-img">
                        </div>
                        <p>Tvoja sigurnost. Tvoj servis. Tvoje savjetništvo.</p>
                        <div class="social-links">
                            <a href="https://facebook.com/tsbiro" aria-label="TS-Biro Facebook stranica" title="TS-Biro na Facebooku" rel="noopener noreferrer">
                                <i class="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://linkedin.com/company/ts-biro" aria-label="TS-Biro LinkedIn profil" title="TS-Biro na LinkedInu" rel="noopener noreferrer">
                                <i class="fab fa-linkedin-in"></i>
                            </a>
                            <a href="https://instagram.com/tsbiro" aria-label="TS-Biro Instagram profil" title="TS-Biro na Instagramu" rel="noopener noreferrer">
                                <i class="fab fa-instagram"></i>
                            </a>
                        </div>
                    </div>
                    <div class="footer-section">
                        <h3>Usluge</h3>
                        <ul>
                            <li><a href="./knjigovodstvo-racunovodstvo.html" title="Knjigovodstvo Sisak">Računovodstvo Sisak</a></li>
                            <li><a href="./place-kadrovska-evidencija.html" title="Obračun plaća Sisak">Obračun Plaća Sisak</a></li>
                            <li><a href="./financijsko-poslovno-savjetovanje.html" title="Financijsko savjetovanje Sisak">Savjetovanje Sisak</a></li>
                            <li><a href="./sudsko-vjestacenje.html" title="Vještačenja Sisak">Vještačenje Sisak</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h3>Linkovi</h3>
                        <ul>
                            <li><a href="./#onama" title="O nama TS-Biro">O nama</a></li>
                            <li><a href="./#klijenti" title="Iskustva klijenata">Klijenti</a></li>
                            <li><a href="./#kontakt" title="Kontakt TS-Biro">Kontakt</a></li>
                            <li><a href="./privatnost.html" title="Politika privatnosti">Privatnost</a></li>
                            <li><a href="./uvjeti.html" title="Uvjeti korištenja">Uvjeti</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h3>Kontakt</h3>
                        <ul>
                            <li><i class="fas fa-map-marker-alt"></i> ${CONFIG.siteInfo.address}</li>
                            <li><i class="fas fa-phone"></i> <a href="tel:${CONFIG.siteInfo.phone.replace(/\s/g, '')}" title="Nazovite TS-Biro">${CONFIG.siteInfo.phone}</a></li>
                            <li><i class="fas fa-phone"></i> <a href="tel:+38598376475" title="Alternativni telefon TS-Biro">+385 98 376 475</a></li>
                            <li><i class="fas fa-envelope"></i> <a href="mailto:${CONFIG.siteInfo.email}" title="Pošaljite email TS-Biro">${CONFIG.siteInfo.email}</a></li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; ${CONFIG.siteInfo.currentYear} ${CONFIG.siteInfo.name}. Sva prava pridržana.</p>
                    <p><small>TS-Biro d.o.o. - Obrtni sud u Zagrebu, MBS: 123456789, OIB: 12345678901</small></p>
                </div>
            </div>
        `;

        // Add structured data for footer
        addFooterStructuredData();
    }

    // Add structured data for footer
    function addFooterStructuredData() {
        try {
            const structuredData = {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "TS-Biro Knjigovodstvo Sisak",
                "url": CONFIG.siteInfo.baseUrl,
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": `${CONFIG.siteInfo.baseUrl}/?s={search_term_string}`,
                    "query-input": "required name=search_term_string"
                }
            };

            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.setAttribute('data-footer', 'true');
            script.textContent = JSON.stringify(structuredData);
            document.querySelector('footer').appendChild(script);
        } catch (error) {
            console.warn('Footer structured data error:', error);
        }
    }

    function generateBackToTop() {
        // Check if back-to-top already exists in HTML
        let backToTop = document.querySelector('.back-to-top');

        if (!backToTop) {
            // Create new one if it doesn't exist
            backToTop = document.createElement('a');
            backToTop.href = '#';
            backToTop.id = 'backToTop';
            backToTop.className = 'back-to-top';
            backToTop.setAttribute('aria-label', 'Povratak na vrh stranice TS-Biro');
            backToTop.setAttribute('title', 'Vrati se na vrh stranice');
            document.body.appendChild(backToTop);
        }

        // Always ensure the icon is added
        if (!backToTop.querySelector('i')) {
            backToTop.innerHTML = '<i class="fas fa-chevron-up" aria-hidden="true"></i>';
        }
    }

    // Cookie consent banner
    function generateCookieConsent() {
        // Check if cookie consent already exists in HTML
        let cookieConsent = document.querySelector('#cookieConsent');

        if (!cookieConsent) {
            // Create new one if it doesn't exist
            cookieConsent = document.createElement('div');
            cookieConsent.id = 'cookieConsent';
            cookieConsent.className = 'cookie-consent';
            cookieConsent.setAttribute('role', 'dialog');
            cookieConsent.setAttribute('aria-labelledby', 'cookie-heading');
            document.body.appendChild(cookieConsent);
        }

        // Always ensure the content is added (but only if empty)
        if (!cookieConsent.innerHTML.trim() || cookieConsent.innerHTML.includes('<!-- Dynamic content -->')) {
            cookieConsent.innerHTML = `
                <h3 id="cookie-heading">Kolačići na TS-Biro stranici</h3>
                <p id="cookie-desc">Ova web stranica koristi kolačiće kako bi osigurala najbolje iskustvo na našoj web stranici i poboljšala naše usluge knjigovodstva u Sisku.</p>
                <div class="cookie-buttons">
                    <button id="acceptCookies" class="btn btn-small" aria-label="Prihvati kolačiće">
                        Prihvati sve kolačiće
                    </button>
                    <button id="rejectCookies" class="btn btn-small btn-secondary" aria-label="Odbij kolačiće">
                        Odbij nepotrebne kolačiće
                    </button>
                    <p class="cookie-info">
                        <a href="./privatnost.html" title="Politika privatnosti TS-Biro" class="cookie-info-link">
                            <i class="fas fa-info-circle" aria-hidden="true"></i> Saznajte više o kolačićima</a>
                    </p>
                </div>
        `;
        }
    }

    // Generate common elements
    function generateCommonElements() {
        try {
            // Skip link for accessibility
            if (!document.querySelector('.skip-link')) {
                const skipLink = document.createElement('a');
                skipLink.href = '#main-content';
                skipLink.className = 'skip-link';
                skipLink.textContent = 'Preskoči na glavni sadržaj';
                skipLink.setAttribute('aria-label', 'Preskoči navigaciju i idi na glavni sadržaj');
                document.body.insertBefore(skipLink, document.body.firstChild);
            }

            // Back to top button
            generateBackToTop();

            // Cookie consent banner
            generateCookieConsent();

            // Add viewport meta tag if missing
            if (!document.querySelector('meta[name="viewport"]')) {
                const viewport = document.createElement('meta');
                viewport.name = 'viewport';
                viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0';
                document.head.appendChild(viewport);
            }
        } catch (error) {
            console.warn('Common elements generation error:', error);
        }
    }

    // Initialize Google Analytics GA4
    function initializeGoogleAnalyticsGA4() {
        if (!CONFIG.analytics.enabled) return;

        try {
            window.dataLayer = window.dataLayer || [];
            window.gtag = function () {
                window.dataLayer.push(arguments);
            };
            window.gtag('js', new Date());

            window.gtag('config', CONFIG.analytics.trackingId, {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname,
                send_page_view: true
            });

            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.analytics.trackingId}`;
            script.onload = () => {
                trackEvent('analytics_loaded', { type: 'ga4' });
            };
            document.head.appendChild(script);
        } catch (error) {
            console.warn('Google Analytics initialization error:', error);
        }
    }

    // Service Worker Registration
    function initializeServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                try {
                    navigator.serviceWorker.register('./js/service-worker.js', {
                        scope: './js/'
                    })
                        .then(function (registration) {

                            // Check for updates
                            registration.addEventListener('updatefound', () => {
                                const newWorker = registration.installing;

                                newWorker.addEventListener('statechange', () => {
                                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    }
                                });
                            });

                            if (window.TSBiro && window.TSBiro.trackEvent) {
                                window.TSBiro.trackEvent('pwa', 'service_worker_registered');
                            }
                        })
                        .catch(function (error) {
                            console.warn('ServiceWorker registration failed:', error);
                            if (window.TSBiro && window.TSBiro.trackEvent) {
                                window.TSBiro.trackEvent('pwa', 'service_worker_failed', error.message);
                            }
                        });
                } catch (error) {
                    console.warn('ServiceWorker error:', error);
                }
            });
        }
    }

    // Track events for analytics
    function trackEvent(eventName, eventParams = {}) {
        if (!CONFIG.analytics.enabled) return;

        try {
            if (window.gtag) {
                window.gtag('event', eventName, {
                    ...eventParams,
                    send_to: CONFIG.analytics.trackingId,
                    page_title: document.title,
                    page_location: window.location.href
                });
            }

            if (window.dataLayer) {
                window.dataLayer.push({
                    'event': eventName,
                    ...eventParams,
                    'page_title': document.title,
                    'page_location': window.location.href,
                    'timestamp': new Date().toISOString()
                });
            }
        } catch (error) {
            console.warn('Event tracking error:', error);
        }
    }

    // Notification system
    function showNotification(message, type = 'info', duration = 5000) {
        try {
            // Remove existing notifications
            document.querySelectorAll('.notification').forEach(notification => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            });

            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.setAttribute('role', 'alert');
            notification.setAttribute('aria-live', 'polite');
            notification.setAttribute('aria-atomic', 'true');
            notification.innerHTML = `
                <div class="notification-content">
                    <span>${message}</span>
                    <button class="notification-close" aria-label="Zatvori obavijest" title="Zatvori">
                        <i class="fas fa-times" aria-hidden="true"></i>
                    </button>
                </div>
            `;

            document.body.appendChild(notification);

            // Add entrance animation
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);

            // Close button
            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            });

            // Auto dismiss
            if (duration > 0) {
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.style.animation = 'slideOut 0.3s ease';
                        setTimeout(() => notification.remove(), 300);
                    }
                }, duration);
            }

            // Track notification
            trackEvent('notification_shown', {
                notification_type: type,
                notification_message: message.substring(0, 100)
            });
        } catch (error) {
            console.warn('Notification error:', error);
        }
    }

    // Get checkbox values
    function getCheckboxValues(name) {
        try {
            const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
            return Array.from(checkboxes).map(cb => cb.value);
        } catch (error) {
            console.warn('Checkbox values error:', error);
            return [];
        }
    }

    // Form validation helper
    function validateFormField(field) {
        if (window.TSBiroForms && window.TSBiroForms.validateFormField) {
            return window.TSBiroForms.validateFormField(field);
        }

        // Basic validation
        if (!field.value.trim() && field.required) {
            field.classList.add('error');
            return false;
        }

        field.classList.remove('error');
        return true;
    }

    // Optimize headings for SEO
    function optimizeHeadings() {
        try {
            // Ensure proper heading hierarchy
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            let lastLevel = 0;

            headings.forEach((heading, index) => {
                const level = parseInt(heading.tagName.charAt(1));

                // Add ID if missing for anchor links
                if (!heading.id) {
                    const text = heading.textContent
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .trim();
                    heading.id = `heading-${text}-${index}`;
                }

                // Track heading structure
                if (level > lastLevel + 1) {
                    console.warn('Heading hierarchy jump detected:', heading.textContent);
                }
                lastLevel = level;
            });
        } catch (error) {
            console.warn('Headings optimization error:', error);
        }
    }

    // Main initialization
    async function init() {
        try {

            // Generate page elements
            generateHeader();
            generateFooter();
            generateCommonElements();
            generateBreadcrumbs();

            // Optimize headings
            setTimeout(optimizeHeadings, 100);

            // Initialize service worker
            initializeServiceWorker();

            // Check cookies consent
            if (localStorage.getItem('cookiesAccepted') === 'true') {
                CONFIG.analytics.enabled = true;
                initializeGoogleAnalyticsGA4();
            }

            // Load modules
            const modules = ['main', 'forms', 'seo', 'analytics'];
            for (const module of modules) {
                if (CONFIG.modules[module]) {
                    try {
                        await loadModule(module);
                    } catch (error) {
                        console.warn(`Module ${module} failed to load:`, error);
                    }
                }
            }

            // Initialize main module
            if (window.TSBiroMain && typeof window.TSBiroMain.init === 'function') {
                window.TSBiroMain.init();
            }

            // Track page view
            setTimeout(() => {
                trackEvent('page_view', {
                    page_title: document.title,
                    page_location: window.location.href,
                    page_path: window.location.pathname,
                    referrer: document.referrer || 'direct'
                });
            }, 1000);

        } catch (error) {
            console.error('TS-Biro initialization error:', error);
            showNotification('Došlo je do greške pri učitavanju stranice', 'error', 5000);
        }
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded
        setTimeout(init, 0);
    }

    // Expose global API
    window.TSBiro = {
        CONFIG,
        init,
        showNotification,
        trackEvent,
        getCheckboxValues,
        validateFormField,
        generateHeader,
        generateFooter,
        generateBreadcrumbs,
        optimizeHeadings
    };
})();