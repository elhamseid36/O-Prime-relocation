/* ==================================================
   O-PRIME RELOCATION - COST ESTIMATOR LOGIC
   ================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const calculatorForm = document.getElementById('calculator-form');
    const resultBox = document.getElementById('calculator-result');
    const priceOutput = document.getElementById('calculator-price');

    if (!calculatorForm) return;

    // Pricing Logic Variables (Easily adjustable for business changes)
    const PRICING_MODEL = {
        baseRate: 350, // Base truck & travel fee
        sizeMultiplier: {
            'studio': 1.0,   // ~ 3-4 hours
            '2bed': 1.6,     // ~ 5-6 hours
            '3bed': 2.3,     // ~ 7-8 hours
            '4bed': 3.2      // ~ 9-11 hours
        },
        distanceMultiplier: {
            'local': 1.0,    // Standard GTA
            'long': 1.5      // Outside GTA boundaries
        },
        variance: 0.3 // 30% range for unforeseen variables (stairs, heavy items)
    };

    // Currency Formatter (Canadian Dollars)
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-CA', { 
            style: 'currency', 
            currency: 'CAD',
            maximumFractionDigits: 0 
        }).format(amount);
    };

    calculatorForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const propertySize = document.getElementById('property-size').value;
        const moveType = document.getElementById('move-type').value;

        // Validation
        if (!propertySize || !moveType) return;

        // Track that a user engaged with the calculator
        if (window.OPrimeAnalytics) {
            window.OPrimeAnalytics.trackEvent('calculator_completed', {
                property_size: propertySize,
                move_type: moveType
            });
        }

        // Calculate Estimate
        const lowEnd = PRICING_MODEL.baseRate * 
                       PRICING_MODEL.sizeMultiplier[propertySize] * 
                       PRICING_MODEL.distanceMultiplier[moveType];
                       
        const highEnd = lowEnd + (lowEnd * PRICING_MODEL.variance);

        // Display Results
        priceOutput.textContent = `${formatCurrency(lowEnd)} - ${formatCurrency(highEnd)}`;
        
        // Show the result box with a fade-in effect
        resultBox.style.display = 'block';
        resultBox.style.opacity = '0';
        
        // Trigger reflow
        void resultBox.offsetWidth; 
        
        resultBox.style.transition = 'opacity 0.5s ease';
        resultBox.style.opacity = '1';

        // Scroll slightly to ensure it's in view
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});