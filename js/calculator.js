/* ==================================================
   O-PRIME RELOCATION - EXPANDED COST ESTIMATOR LOGIC
   ================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const calculatorForm = document.getElementById('calculator-form');
    const resultBox = document.getElementById('calculator-result');
    const priceOutput = document.getElementById('calculator-price');

    if (!calculatorForm) return;

    // Advanced Pricing Model incorporating industry standards
    const PRICING_MODEL = {
        hourlyRates: {
            '2': 140, // 2 movers per hour (CAD)
            '3': 185, // 3 movers per hour
            '4': 240  // 4 movers per hour
        },
        estimatedHours: {
            'studio': 3.5,
            '2bed': 5.5,
            '3bed': 7.5,
            '4bed': 10.0
        },
        distanceMultiplier: {
            'local': 1.0,
            'long': 1.4
        },
        accessSurcharge: {
            'easy': 0,
            'moderate': 75,
            'difficult': 150
        },
        addOnCost: {
            'none': 0,
            'packing': 350,
            'assembly': 120
        },
        variance: 0.2 // 20% estimated range buffer
    };

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
        const crewSize = document.getElementById('crew-size').value;
        const moveType = document.getElementById('move-type').value;
        const accessDifficulty = document.getElementById('access-difficulty').value;
        const addOnService = document.getElementById('add-on-service').value;

        if (!propertySize || !crewSize || !moveType) return;

        // Analytics tracking
        if (window.OPrimeAnalytics) {
            window.OPrimeAnalytics.trackEvent('calculator_completed', {
                property_size: propertySize,
                crew_size: crewSize,
                move_type: moveType,
                add_on: addOnService
            });
        }

        // Calculation: (Hourly Rate * Hours) factored by distance + stairs/access + add-ons
        const hourlyRate = PRICING_MODEL.hourlyRates[crewSize];
        const baseHours = PRICING_MODEL.estimatedHours[propertySize];
        
        let subtotal = (hourlyRate * baseHours) * PRICING_MODEL.distanceMultiplier[moveType];
        subtotal += PRICING_MODEL.accessSurcharge[accessDifficulty];
        subtotal += PRICING_MODEL.addOnCost[addOnService];

        const lowEnd = Math.round(subtotal);
        const highEnd = Math.round(subtotal + (subtotal * PRICING_MODEL.variance));

        // Display Results
        priceOutput.textContent = `${formatCurrency(lowEnd)} - ${formatCurrency(highEnd)}`;

        resultBox.style.display = 'block';
        resultBox.style.opacity = '0';
        void resultBox.offsetWidth; 
        resultBox.style.transition = 'opacity 0.5s ease';
        resultBox.style.opacity = '1';

        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});