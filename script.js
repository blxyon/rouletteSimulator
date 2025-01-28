const historyLength = 5;
let balance = 1000;
let history = [];
let currentBet = '';
let betAmount = 0;
let isSpinning = false;

// Define a more accurate roulette wheel pattern (37 slots for European roulette)
const rouletteColors = [
    'green', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red',
    'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red',
    'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red',
    'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red'
];

let wheelContents = [...rouletteColors]; // Initialize the wheel contents

const wheel = document.getElementById('roulette');

// Initialize the visible slots array (middle color + 4 left + 4 right)
let visibleColors = [
    '', '', '', '', '', '', '', '', ''  // 9 slots in total (middle + 4 left + 4 right)
];

function getRandomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Render the current wheel state
function renderWheel() {
    const wheelHTML = [];
    visibleColors.forEach(color => {
        wheelHTML.push(`<div class="box ${color}"></div>`);
    });
    wheel.innerHTML = wheelHTML.join('');
}

// Button selection for betting
document.querySelectorAll('.bet-btn').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('.bet-btn').forEach(btn => btn.classList.remove('selected'));
        this.classList.add('selected');
        currentBet = this.dataset.color;
    });
});

// Spin and simulate roulette
document.getElementById('spin-btn').addEventListener('click', function () {
    if (isSpinning) {
        document.getElementById('message').textContent = 'Roulette is spinning. Please wait!';
        return;
    }

    betAmount = parseInt(document.getElementById('bet-amount').value);

    if (isNaN(betAmount) || betAmount <= 0) {
        alert('Please enter a valid bet amount!');
        return;
    }

    if (betAmount > balance) {
        alert('Insufficient balance!');
        return;
    }

    if (!currentBet) {
        alert('Please select a bet option (Red, Black, or Green)');
        return;
    }

    balance -= betAmount;
    updateBalance();

    isSpinning = true;
    document.getElementById('spin-btn').disabled = true;

    // Update the message to indicate that spinning has started
    document.getElementById('message').textContent = 'The roulette is spinning...';

    // Determine the outcome
    const outcome = getRouletteOutcome();  // Randomly determine the outcome
    console.log(`Outcome determined: ${outcome}`);  // You can remove this console log later

    // Initialize the visible colors array with the first 9 values from wheelContents
    visibleColors = [
        wheelContents[wheelContents.length - 4],
        wheelContents[wheelContents.length - 3],
        wheelContents[wheelContents.length - 2],
        wheelContents[wheelContents.length - 1],
        wheelContents[0], // Middle
        wheelContents[1],
        wheelContents[2],
        wheelContents[3],
        wheelContents[4]
    ];

    renderWheel();

    // Start the spin process with phases
    spinPhases(outcome);
});

function getRouletteOutcome() {
    // Calculate the outcome (red/black/green) with the desired probabilities
    // For now, let's just choose green for testing
    const randomValue = Math.random();
    if (randomValue <= 0.487) {
        return 'red';  // 48.7% chance for red
    } else if (randomValue <= 0.974) {
        return 'black';  // 48.7% chance for black
    } else {
        return 'green';  // 2.6% chance for green
    }
}

function spinPhases(outcome) {
    const fastSpinDuration = getRandomBetween(5000, 10000);
    const mediumSpinDuration = getRandomBetween(4000, 6000);
    const moderateSpinDuration = getRandomBetween(3000, 4000);
    const slowSpinDuration = getRandomBetween(2000, 3000);
    const finalSpinDuration = getRandomBetween(1000, 2000);

    let startTime = Date.now();

    function startSpinning() {
        requestAnimationFrame(spinFrame);
    }

    function spinFrame() {
        const elapsedTime = Date.now() - startTime;

        let currentInterval;
        let phase;

        // Transition between different phases smoothly
        if (elapsedTime < fastSpinDuration) {
            phase = 'fast';
            currentInterval = 100; // Fast spin interval
        } else if (elapsedTime < fastSpinDuration + mediumSpinDuration) {
            phase = 'medium';
            currentInterval = 200; // Medium spin interval
        } else if (elapsedTime < fastSpinDuration + mediumSpinDuration + moderateSpinDuration) {
            phase = 'moderate';
            currentInterval = 300; // Moderate spin interval
        } else if (elapsedTime < fastSpinDuration + mediumSpinDuration + moderateSpinDuration + slowSpinDuration) {
            phase = 'slow';
            currentInterval = 400; // Slow spin interval
        } else if (elapsedTime < fastSpinDuration + mediumSpinDuration + moderateSpinDuration + slowSpinDuration + finalSpinDuration) {
            phase = 'final';
            currentInterval = 500; // Final spin interval
        } else {
            // Final phase (stopping phase)
            stopSpinningSmoothly(outcome);
            return;
        }

        // Continue spinning by rotating the wheel
        wheelContents.push(wheelContents.shift());
        updateVisibleColors();

        // Continue requesting the next animation frame with the new interval
        setTimeout(() => requestAnimationFrame(spinFrame), currentInterval);
    }

    startSpinning();
}
function getStepsToReachOutcome(outcome) {
    // Find the position of the outcome (red, black, green) in the wheel
    const outcomeIndex = wheelContents.indexOf(outcome);
    
    // Get the current position of the visible middle slot (visibleColors[4] corresponds to the middle)
    const currentIndex = wheelContents.indexOf(visibleColors[4]);

    // Calculate the number of steps to reach the outcome
    let stepsRequired = outcomeIndex - currentIndex;
    
    // If the steps required is negative, it means we've crossed over the start, so we loop around
    if (stepsRequired < 0) {
        stepsRequired += wheelContents.length;
    }

    return stepsRequired;
}

function stopSpinningSmoothly(outcome) {
    // Calculate the steps needed for wheelContents[4] to match the next occurrence of the outcome
    let stepsToMatch = -1;

    for (let i = 1; i < wheelContents.length; i++) { // Start from i = 1 to skip the current wheelContents[4]
        if (wheelContents[(4 + i) % wheelContents.length] === outcome) {
            stepsToMatch = i; // Found the required steps to the next occurrence
            break;
        }
    }

    if (stepsToMatch === -1) {
        console.error("Outcome not found in wheelContents!");
        return;
    }

    console.log("Wheel Contents (initial):", [...wheelContents]);
    console.log(`Steps to reach next outcome (${outcome}):`, stepsToMatch);

    // Deceleration process
    let currentInterval = 500; // Start with a fast spin interval (500ms)
    let decelerationStep = (2000 - 500) / stepsToMatch; // Incremental increase for each step
    let stepCount = 0;

    function decelerateSpin() {
        if (stepCount >= stepsToMatch) {
            // Stopping the spin and handling the result
            console.log("Final Wheel Contents:", [...wheelContents]);
            handleResult(outcome); // Call the function to process the outcome
            isSpinning = false;
            document.getElementById('spin-btn').disabled = false;
            return;
        }

        // Shift the wheelContents and update visible colors
        wheelContents.push(wheelContents.shift());
        updateVisibleColors();

        console.log(`Step ${stepCount + 1}:`);
        console.log("Wheel Contents:", [...wheelContents]); // Debugging log for each step

        stepCount++;
        currentInterval += decelerationStep; // Incrementally increase the interval
        setTimeout(decelerateSpin, currentInterval); // Schedule the next spin
    }

    // Start the deceleration process
    decelerateSpin();
}



function getFinalOutcomePosition(outcome) {
    // Find the position of the outcome (red, black, green) in the wheel
    const outcomeIndex = rouletteColors.indexOf(outcome);
    return outcomeIndex;
}

function handleResult(outcome) {
    const winMultiplier = outcome === 'green' ? 14 : 2;
    if (outcome === currentBet) {
        balance += betAmount * winMultiplier;
        document.getElementById('message').textContent = `You won! Outcome: ${outcome}`;
    } else {
        document.getElementById('message').textContent = `You lost! Outcome: ${outcome}`;
    }

    updateHistory(outcome);
    updateBalance();
}

function updateBalance() {
    document.getElementById('balance').textContent = `$${balance}`;
}

function updateHistory(color) {
    history.unshift(color);
    if (history.length > historyLength) history.pop();

    const historyBox = document.getElementById('history-boxes');
    historyBox.innerHTML = '';
    history.forEach(outcome => {
        const div = document.createElement('div');
        div.className = outcome;
        historyBox.appendChild(div);
    });
}

// Update the visible colors array to shift the wheel
function updateVisibleColors() {
    // Calculate the correct starting index to shift the wheel
    const shiftAmount = 4; // We want "green" to be in the middle, and it's at index 4 in the array
    const rotatedWheel = [...wheelContents.slice(shiftAmount), ...wheelContents.slice(0, shiftAmount)];

    // Set the visible colors based on the shifted wheel
    visibleColors = [
        rotatedWheel[rotatedWheel.length - 4],
        rotatedWheel[rotatedWheel.length - 3],
        rotatedWheel[rotatedWheel.length - 2],
        rotatedWheel[rotatedWheel.length - 1],
        rotatedWheel[0],  // Middle
        rotatedWheel[1],
        rotatedWheel[2],
        rotatedWheel[3],
        rotatedWheel[4]
    ];

    renderWheel();
}


// Initial render
renderWheel();
