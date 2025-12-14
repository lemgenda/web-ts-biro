(function () {
    'use strict';

    const TSBiroSEO = {
        init: function () {
            try {
                this.updateSEOMetaTags();
                this.initializeBreadcrumbs();
                this.addStructuredData();
            } catch (error) {
                // Silent fail
            }
        },

        updateSEOMetaTags: function () {
            try {
                const currentPath = window.location.pathname;
                const pageMappings = {
                    '/knjigovodstvo-racunovodstvo.html': {
                        title: 'Knjigovodstvo Sisak | Računovodstvene usluge za tvrtke - TS-Biro',
                        description: 'Profesionalno knjigovodstvo u Sisku. Vođenje knjiga, porezne prijave, 30+ godina iskustva.',
                        keywords: 'knjigovodstvo Sisak, računovodstvo Sisak, vođenje knjiga, porezne prijave'
                    },
                    '/place-kadrovska-evidencija.html': {
                        title: 'Obračun Plaća Sisak | Kadrovska evidencija za tvrtke - TS-Biro',
                        description: 'Profesionalan obračun plaća u Sisku. Kadrovska administracija, pravovremeno i točno.',
                        keywords: 'obračun plaća Sisak, kadrovska evidencija, prijave radnika, isplatne liste'
                    },
                    '/financijsko-poslovno-savjetovanje.html': {
                        title: 'Financijsko Savjetovanje Sisak | Poslovno planiranje za tvrtke - TS-Biro',
                        description: 'Stručno financijsko savjetovanje u Sisku. Analiza poslovanja, planiranje rasta, optimizacija troškova.',
                        keywords: 'financijsko savjetovanje Sisak, poslovno savjetovanje, analiza poslovanja, optimizacija troškova'
                    },
                    '/sudsko-vjestacenje.html': {
                        title: 'Financijska Vještačenja Sisak | Sudska i privatna vještačenja - TS-Biro',
                        description: 'Stručna financijska vještačenja u Sisku. Za sudske postupke, nepristrano, brzi rokovi.',
                        keywords: 'vještačenja Sisak, sudska vještačenja, financijska vještačenja, računovodstvena vještačenja'
                    },
                    '/privatnost.html': {
                        title: 'Politika Privatnosti | TS-Biro Sisak',
                        description: 'Politika privatnosti TS-Biro knjigovodstvenog servisa u Sisku.',
                        keywords: 'politika privatnosti, zaštita podataka, GDPR, privatnost, TS-Biro Sisak'
                    },
                    '/uvjeti.html': {
                        title: 'Uvjeti Korištenja | TS-Biro Sisak',
                        description: 'Uvjeti korištenja web stranice TS-Biro knjigovodstvenog servisa u Sisku.',
                        keywords: 'uvjeti korištenja, pravila, odredbe, korištenje web stranice, TS-Biro Sisak'
                    },
                    '/404.html': {
                        title: 'Stranica nije pronađena | TS-Biro Sisak',
                        description: 'Stranica koju tražite ne postoji na TS-Biro web stranici.',
                        keywords: '404, stranica nije pronađena, error, TS-Biro Sisak'
                    }
                };

                if (pageMappings[currentPath]) {
                    const pageInfo = pageMappings[currentPath];
                    document.title = pageInfo.title;

                    // Update meta description
                    let metaDescription = document.querySelector('meta[name="description"]');
                    if (!metaDescription) {
                        metaDescription = document.createElement('meta');
                        metaDescription.name = 'description';
                        document.head.appendChild(metaDescription);
                    }
                    // Skrati opis ako je predug
                    const shortDescription = pageInfo.description.length > 160
                        ? pageInfo.description.substring(0, 157) + '...'
                        : pageInfo.description;
                    metaDescription.content = shortDescription;

                    // Update keywords
                    let metaKeywords = document.querySelector('meta[name="keywords"]');
                    if (!metaKeywords) {
                        metaKeywords = document.createElement('meta');
                        metaKeywords.name = 'keywords';
                        document.head.appendChild(metaKeywords);
                    }
                    metaKeywords.content = pageInfo.keywords;
                }
            } catch (error) {
                // Silent fail
            }
        },

        initializeBreadcrumbs: function () {
            try {
                const currentUrl = window.location.pathname;
                const pageMappings = {
                    '/knjigovodstvo-racunovodstvo.html': 'Računovodstvo Sisak',
                    '/place-kadrovska-evidencija.html': 'Obračun Plaća Sisak',
                    '/financijsko-poslovno-savjetovanje.html': 'Savjetovanje Sisak',
                    '/sudsko-vjestacenje.html': 'Vještačenje Sisak',
                    '/privatnost.html': 'Politika Privatnosti',
                    '/uvjeti.html': 'Uvjeti Korištenja',
                    '/index.html': 'Početna',
                    '/': 'Početna'
                };

                const breadcrumbData = {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Početna",
                            "item": "https://www.ts-biro.hr/"
                        }
                    ]
                };

                if (currentUrl !== '/' && currentUrl !== '/index.html' && pageMappings[currentUrl]) {
                    breadcrumbData.itemListElement.push({
                        "@type": "ListItem",
                        "position": 2,
                        "name": pageMappings[currentUrl],
                        "item": `https://www.ts-biro.hr${currentUrl}`
                    });
                }

                const existingScript = document.querySelector('script[data-type="breadcrumb"]');
                if (existingScript) {
                    existingScript.remove();
                }

                const script = document.createElement('script');
                script.setAttribute('type', 'application/ld+json');
                script.setAttribute('data-type', 'breadcrumb');
                script.textContent = JSON.stringify(breadcrumbData);
                document.head.appendChild(script);
            } catch (error) {
                // Silent fail
            }
        },

        addStructuredData: function () {
            try {
                // Organization structured data
                const organizationData = {
                    "@context": "https://schema.org",
                    "@type": "AccountingService",
                    "name": "TS-Biro",
                    "description": "Knjigovodstveni servis Sisak sa 30+ godina iskustva. Računovodstvo, obračun plaća, savjetovanje, vještačenje.",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "Ferde Livadića 29",
                        "addressLocality": "Sisak",
                        "addressCountry": "HR"
                    },
                    "telephone": "+385915212770",
                    "email": "info@ts-biro.hr",
                    "url": "https://www.ts-biro.hr",
                    "openingHours": "Mo-Fr 08:00-16:00",
                    "priceRange": "$$",
                    "areaServed": "Sisak, Sisak-Moslavina County"
                };

                const script = document.createElement('script');
                script.setAttribute('type', 'application/ld+json');
                script.setAttribute('data-type', 'organization');
                script.textContent = JSON.stringify(organizationData);
                document.head.appendChild(script);
            } catch (error) {
                // Silent fail
            }
        }
    };

    // Initialize SEO module when DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        TSBiroSEO.init();
    });

    // Export to global scope
    window.TSBiroSEO = TSBiroSEO;
})();