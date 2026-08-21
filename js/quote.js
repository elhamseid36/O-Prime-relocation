
/* ==================================================
   O-PRIME RELOCATION - MULTI-STEP QUOTE SYSTEM
   ================================================== */

const QuoteSystem = {
    currentStep: 1,
    totalSteps: 4,
    formData: {},

    init() {
        this.form = document.getElementById('oprime-quote-form');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.submitBtn = document.getElementById('submit-btn');
        this.progressSteps = document.querySelectorAll('.progress-step');
        this.panels = document.querySelectorAll('.form-panel');
        
        if (!this.form) return;

        // Log initiation
        if (window.OPrimeAnalytics) {
            window.OPrimeAnalytics.trackEvent('quote_started');
        }

        this.bindEvents();
    },

    bindEvents() {
        this.nextBtn.addEventListener('click', () => this.handleNext());
        this.prevBtn.addEventListener('click', () => this.handlePrev());
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Clear error styling on input change
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('input-error');
                const errorMsg = input.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.style.display = 'none';
                }
            });
        });
    },

    validateStep(stepIndex) {
        const currentPanel = document.getElementById(`panel-${stepIndex}`);
        const requiredInputs = currentPanel.querySelectorAll('[required]');
        let isValid = true;

        requiredInputs.forEach(input => {
            // HTML5 checkValidity handles basic empty strings and email formatting
            if (!input.checkValidity()) {
                isValid = false;
                input.classList.add('input-error');
                const errorMsg = input.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.style.display = 'block';
                }
            }
        });

        return isValid;
    },

    updateUI() {
        // Toggle Panels
        this.panels.forEach((panel, index) => {
            if (index + 1 === this.currentStep) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        // Update Progress Bar
        this.progressSteps.forEach((stepIndicator, index) => {
            const stepNum = index + 1;
            stepIndicator.classList.remove('active', 'completed');
            
            if (stepNum === this.currentStep) {
                stepIndicator.classList.add('active');
            } else if (stepNum < this.currentStep) {
                stepIndicator.classList.add('completed');
            }
        });

        // Toggle Buttons
        this.prevBtn.style.display = this.currentStep === 1 ? 'none' : 'block';
        
        if (this.currentStep === this.totalSteps) {
            this.nextBtn.style.display = 'none';
            this.submitBtn.style.display = 'block';
        } else {
            this.nextBtn.style.display = 'block';
            this.submitBtn.style.display = 'none';
        }
        
        // Scroll to top of form smoothly on step change
        this.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    handleNext() {
        if (this.validateStep(this.currentStep)) {
            // Track successful step completion
            if (window.OPrimeAnalytics) {
                window.OPrimeAnalytics.trackEvent('quote_step_completed', { step: this.currentStep });
            }
            
            this.currentStep++;
            this.updateUI();
        } else {
            if (window.OPrimeAnalytics) {
                window.OPrimeAnalytics.trackEvent('quote_validation_error', { step: this.currentStep });
            }
        }
    },

    handlePrev() {
        this.currentStep--;
        this.updateUI();
    },

    handleSubmit(e) {
        e.preventDefault();

        // Final validation check for step 4
        if (!this.validateStep(this.currentStep)) return;

        this.collectData();
        this.processSubmission();
    },

    collectData() {
        // Gather all inputs
        const formDataObj = new FormData(this.form);
        this.formData = Object.fromEntries(formDataObj.entries());
        
        // Handle multiple checkboxes (Services)
        const services = [];
        this.form.querySelectorAll('input[name="services"]:checked').forEach(cb => {
            services.push(cb.value);
        });
        this.formData.services = services;

        // Append Marketing Attribution
        if (window.OPrimeAnalytics) {
            this.formData.utms = window.OPrimeAnalytics.getUTMs();
        }
        this.formData.timestamp = new Date().toISOString();
        this.formData.source = 'Website_MultiStep_Quote';
    },

   processSubmission() {
        // Track final successful completion for your analytics
        if (window.OPrimeAnalytics) {
            window.OPrimeAnalytics.trackEvent('quote_completed', { 
                destination: this.formData.destination,
                property_type: this.formData.property_type
            });
        }

        // ==================================================
        // NETLIFY AJAX SUBMISSION LOGIC
        // ==================================================
        
        // 1. Netlify requires data to be URL-encoded for JS submissions
        const netlifyData = new URLSearchParams();
        
        // 2. You MUST append the exact form name used in the HTML
        netlifyData.append("form-name", "quote");
        
        // 3. Loop through your collected formData and format it for Netlify
        for (const key in this.formData) {
            // Handle arrays (like the multiple checkboxes for services)
            if (Array.isArray(this.formData[key])) {
                netlifyData.append(key, this.formData[key].join(', '));
            } 
            // Handle the nested UTM marketing attribution object
            else if (typeof this.formData[key] === 'object' && this.formData[key] !== null) {
                for (const nestedKey in this.formData[key]) {
                    netlifyData.append(`utm_${nestedKey}`, this.formData[key][nestedKey]);
                }
            } 
            // Handle standard text, date, and select inputs
            else {
                netlifyData.append(key, this.formData[key]);
            }
        }

        // 4. Send the POST request directly to Netlify
        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: netlifyData.toString()
        })
        .then(() => {
            // Transition UI to Success State
            this.form.style.display = 'none';
            const successPanel = document.getElementById('quote-success');
            successPanel.style.display = 'block';
            successPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch((error) => console.error("Netlify form submission error:", error));
    }
};



document.addEventListener('DOMContentLoaded', () => QuoteSystem.init()); 