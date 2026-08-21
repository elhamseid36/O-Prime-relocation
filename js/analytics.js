/* ==================================================
   O-PRIME RELOCATION - ANALYTICS & ATTRIBUTION
   ================================================== */

const Analytics = {
    // Configuration Placeholders
    // CONNECT EXTERNAL SERVICES HERE LATER
    config: {
        GA_MEASUREMENT_ID: '[GA_MEASUREMENT_ID]',
        GOOGLE_ADS_ID: '[GOOGLE_ADS_ID]',
        debugMode: true // Set to false in production
    },

    init() {
        this.captureUTMs();
        this.trackPageView();
        this.setupAutomaticTracking();
        
        if (this.config.debugMode) {
            console.log("O-Prime Analytics initialized.");
        }
    },

    // Preserves marketing attribution across page navigations
    captureUTMs() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
        
        let foundUTMs = false;
        utmParams.forEach(param => {
            if (urlParams.has(param)) {
                sessionStorage.setItem(`oprime_${param}`, urlParams.get(param));
                foundUTMs = true;
            }
        });

        if (foundUTMs && this.config.debugMode) {
            console.log("Marketing UTMs captured and stored.");
        }
    },

    // Retrieves current session UTMs for lead submission
    getUTMs() {
        return {
            source: sessionStorage.getItem('oprime_utm_source') || 'direct',
            medium: sessionStorage.getItem('oprime_utm_medium') || 'none',
            campaign: sessionStorage.getItem('oprime_utm_campaign') || 'none',
            term: sessionStorage.getItem('oprime_utm_term') || '',
            content: sessionStorage.getItem('oprime_utm_content') || ''
        };
    },

    // Core event tracking function
    trackEvent(eventName, eventData = {}) {
        const payload = {
            event: eventName,
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            utms: this.getUTMs(),
            ...eventData
        };
        
        if (this.config.debugMode) {
            console.log(`[Event Tracked]: ${eventName}`, payload);
        }
        
        // ==========================================
        // FUTURE INTEGRATION POINTS
        // ==========================================
        
        // 1. Google Analytics 4 (dataLayer)
        if (typeof window !== 'undefined' && window.dataLayer) {
            window.dataLayer.push(payload);
        }

        // 2. Custom Backend / CRM Endpoint
        // fetch('https://api.yourdomain.com/track', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(payload)
        // });
    },

    trackPageView() {
        this.trackEvent('page_view', { title: document.title });
    },

    // Automatically binds tracking to elements with data-track attributes
    setupAutomaticTracking() {
        document.addEventListener('click', (e) => {
            const trackElement = e.target.closest('[data-track]');
            if (!trackElement) return;

            const action = trackElement.getAttribute('data-track');
            const label = trackElement.innerText || trackElement.getAttribute('aria-label') || 'button';

            if (action === 'phone-click') {
                this.trackEvent('phone_click', { location: window.location.pathname, text: label });
            } else if (action === 'quote-click') {
                this.trackEvent('quote_cta_clicked', { location: window.location.pathname, text: label });
            } else {
                this.trackEvent('ui_interaction', { action: action, label: label });
            }
        });
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => Analytics.init());

// Expose safely to window for inline or external scripts
window.OPrimeAnalytics = Analytics;