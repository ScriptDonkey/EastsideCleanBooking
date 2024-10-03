document.addEventListener('DOMContentLoaded', () => {
    const stages = [
        document.getElementById('stage1'),
        document.getElementById('stage2'),
        document.getElementById('stage3')
    ];
    const results = document.getElementById('results');
    const nextStepBtn1 = document.getElementById('next-step-1');
    const nextStepBtn2 = document.getElementById('next-step-2');
    const calculateSavingsBtn = document.getElementById('calculate-savings');
    const progressBar = document.querySelector('.progress');
    const currentStepSpan = document.getElementById('current-step');

    let currentStage = 0;

    // Update slider values in real-time
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.addEventListener('input', updateSliderValue);
    });

    function updateSliderValue(e) {
        const valueSpan = document.getElementById(`${e.target.id}-value`);
        if (!valueSpan) return;
        let value = e.target.value;
        
        switch (e.target.id) {
            case 'time-spent':
                valueSpan.textContent = `${value} hours`;
                break;
            case 'hourly-wage':
            case 'monthly-spending':
                valueSpan.textContent = `$${value}`;
                break;
            case 'square-footage':
                valueSpan.textContent = `${value} sq ft`;
                break;
            default:
                valueSpan.textContent = value;
        }
    }

    // Transition between stages
    nextStepBtn1.addEventListener('click', () => {
        stages[0].classList.add('hidden');
        stages[1].classList.remove('hidden');
        currentStage = 1;
        updateProgress();
    });

    nextStepBtn2.addEventListener('click', () => {
        stages[1].classList.add('hidden');
        stages[2].classList.remove('hidden');
        currentStage = 2;
        updateProgress();
    });

    calculateSavingsBtn.addEventListener('click', calculateSavings);

    function updateProgress() {
        currentStepSpan.textContent = currentStage + 1;
        progressBar.style.width = `${((currentStage + 1) / 3) * 100}%`;
        progressBar.classList.add('animated');
        setTimeout(() => {
            progressBar.classList.remove('animated');
        }, 500);
    }

    function calculateSavings() {
        // Retrieve input values
        const timeSpent = parseFloat(document.getElementById('time-spent').value);
        const hourlyWage = parseFloat(document.getElementById('hourly-wage').value);
        const monthlySpending = parseFloat(document.getElementById('monthly-spending').value);
        const squareFootage = parseFloat(document.getElementById('square-footage').value);
        const bathrooms = parseFloat(document.getElementById('bathrooms').value);
        const stories = parseInt(document.getElementById('stories').value);
        const serviceLevel = document.getElementById('service-level').value;
        const cleaningFrequency = document.getElementById('cleaning-frequency').value;
        const garageSize = document.getElementById('garage-size').value;
        const extraKitchens = parseInt(document.getElementById('extra-kitchens').value);
        const extraOffices = parseInt(document.getElementById('extra-offices').value);

        // Perform calculations
        const basePrice = calculateBasePrice(squareFootage, bathrooms, serviceLevel, cleaningFrequency);
        const extraCosts = calculateExtraCosts(stories, garageSize, extraKitchens, extraOffices);
        const yearlyServiceCost = calculateYearlyServiceCost(basePrice + extraCosts, cleaningFrequency);
        const annualTimeSaved = (timeSpent * 52) / 24; // Convert to days
        const annualMoneySavedSupplies = monthlySpending * 12;
        const annualValueTimeSaved = timeSpent * 52 * hourlyWage;
        const totalSavings = annualMoneySavedSupplies + annualValueTimeSaved;
        const timeReclaimedValue = (totalSavings - yearlyServiceCost) / annualTimeSaved;
        const netTimeValue = totalSavings - yearlyServiceCost;

        // Update results
        document.getElementById('time-saved').textContent = annualTimeSaved.toFixed(1);
        document.getElementById('money-saved-supplies').textContent = annualMoneySavedSupplies.toFixed(2);
        document.getElementById('value-time-saved').textContent = annualValueTimeSaved.toFixed(2);
        document.getElementById('yearly-service-cost').textContent = yearlyServiceCost.toFixed(2);
        document.getElementById('total-savings').textContent = totalSavings.toFixed(2);
        document.getElementById('net-time-value').textContent = netTimeValue.toFixed(2);

        // Update time reclaimed value
        const timeReclaimedElement = document.getElementById('time-reclaimed-value');
        if (timeReclaimedValue < 0) {
            timeReclaimedElement.textContent = `You can reclaim your time for $${Math.abs(timeReclaimedValue).toFixed(2)}`;
        } else {
            timeReclaimedElement.textContent = `You're making $${timeReclaimedValue.toFixed(2)} every saved day across ${annualTimeSaved.toFixed(1)} days saved annually.`;
        }

        // Add time-saved suggestion
        const suggestion = getTimeSavedSuggestion(annualTimeSaved);
        document.getElementById('time-saved-suggestion').textContent = `${suggestion}`;

        // Show results
        stages[currentStage].classList.add('hidden');
        results.classList.remove('hidden');
        currentStage = 3;
        updateProgress();
    }

    function calculateBasePrice(squareFootage, bathrooms, serviceLevel, cleaningFrequency) {
        // Implement the pricing logic based on the provided pricing sheet
        // This is a simplified version and should be expanded based on the full pricing details
        let basePrice = 150; // Starting price

        if (squareFootage > 1000) basePrice += 50;
        if (squareFootage > 2000) basePrice += 50;
        if (squareFootage > 3000) basePrice += 50;

        basePrice += (bathrooms - 1) * 20;

        switch (serviceLevel) {
            case 'basic':
                basePrice *= 0.9;
                break;
            case 'premium':
                basePrice *= 1.2;
                break;
            case 'deep-clean':
                basePrice *= 1.5;
                break;
        }

        switch (cleaningFrequency) {
            case 'weekly':
                basePrice *= 0.9;
                break;
            case 'monthly':
                basePrice *= 1.1;
                break;
        }

        return basePrice;
    }

    function calculateExtraCosts(stories, garageSize, extraKitchens, extraOffices) {
        let extraCosts = 0;

        switch (stories) {
            case 2:
                extraCosts += 55;
                break;
            case 3:
                extraCosts += 75;
                break;
            case 4:
                extraCosts += 95;
                break;
            case 5:
                extraCosts += 250;
                break;
        }

        switch (garageSize) {
            case '2-car':
                extraCosts += 35;
                break;
            case '3-car':
                extraCosts += 50;
                break;
            case '4-car':
                extraCosts += 53;
                break;
            case '5-plus-car':
                extraCosts += 325;
                break;
        }

        extraCosts += extraKitchens * 98;
        extraCosts += extraOffices * 65;

        return extraCosts;
    }

    function calculateYearlyServiceCost(basePrice, cleaningFrequency) {
        switch (cleaningFrequency) {
            case 'weekly':
                return basePrice * 52;
            case 'bi-weekly':
                return basePrice * 26;
            case 'monthly':
                return basePrice * 12;
        }
    }

    function getTimeSavedSuggestion(days) {
        const suggestions = [
            "6 days could be spent exploring Redmond's scenic Farrel-McWhirter Park, or Marymoor Park on your weekends!",
            "Take advantage of your time by joining a weekly wine tasting tour in Woodinville.",
            "Start learning to play the guitar with lessons spread throughout the year.",
            "7 days could give you time to regularly paddleboard at Kirkland's Marina Park after work.",
            "Spend your Saturdays at a yoga class in Bellevue's top wellness centers.",
            "Dedicate your weekends to a fun, photography course and document local scenery.",
            "20 days could give you time to complete day hikes on Washington's best trails throughout the year.",
            "Write and self-publish your own local travel guide over weekends and evenings.",
            "Spread out your time to complete a full home renovation project, one room at a time."
        ];

        const index = Math.min(Math.floor(days) - 6, suggestions.length - 1);
        return suggestions[Math.max(0, index)];
    }

    // Initialize slider values
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        updateSliderValue({ target: slider });
    });

    // Add event listeners for result page buttons
    document.getElementById('book-clean').addEventListener('click', () => {
        window.open('https://wordpress-883581-4536405.cloudwaysapps.com/booking-form/', '_blank');
    });

    document.getElementById('have-question').addEventListener('click', () => {
        window.open('https://wordpress-883581-4536405.cloudwaysapps.com/contact-us', '_blank');
    });
});