// Initialize game state
let allRandoms = Array.from({length: 4}, () => Math.floor(Math.random() * 10));
console.log('Secret Code:', allRandoms.join('')); // For debugging/cheating

let tryN = 0;
const maxTries = 4;
let button = document.getElementById('guess-button');
let res = document.getElementById('letRes');
let triesDisplay = document.getElementById('tries-display');
let inputs = [
    document.getElementById('input1'),
    document.getElementById('input2'),
    document.getElementById('input3'),
    document.getElementById('input4')
];

// UI helpers
const showMessage = (msg, type) => {
    res.innerHTML = msg;
    res.className = `show status-${type}`;
};

const showModal = (isWin) => {
    const modal = document.getElementById('result-modal');
    const title = document.getElementById('modal-title');
    const desc = document.getElementById('modal-desc');
    
    if (isWin) {
        title.innerHTML = 'Access Granted!';
        title.className = 'win-text';
        desc.innerText = 'You successfully cracked the code.';
    } else {
        title.innerHTML = 'Access Denied';
        title.className = 'lose-text';
        desc.innerText = `The correct code was ${allRandoms.join('')}.`;
    }
    
    modal.classList.add('active');
};

// Auto-advance inputs for better UX
inputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        // Ensure only one digit
        if (input.value.length > 1) {
            input.value = input.value.slice(-1);
        }
        
        // Auto-advance
        if (input.value !== '' && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });

    input.addEventListener('keydown', (e) => {
        // Allow backspace to go to previous input
        if (e.key === 'Backspace' && input.value === '' && index > 0) {
            inputs[index - 1].focus();
            inputs[index - 1].value = '';
        }
        
        // Allow Enter to submit
        if (e.key === 'Enter') {
            button.click();
        }
    });
});

button.addEventListener('click', function(e) {
    e.preventDefault();
    
    let allInputs = inputs.map(input => parseInt(input.value));
    
    // Validate inputs
    if (allInputs.some(num => isNaN(num) || num < 0 || num > 9)) {
        showMessage('Please enter a number between 0 and 9 in all boxes.', 'error');
        return;
    }
    
    tryN++;
    let triesRemaining = maxTries - tryN;
    triesDisplay.innerText = `Attempts remaining: ${triesRemaining}`;
    
    let correctP = 0;
    let wrongP = 0;
    let positionN = [false, false, false, false];
    
    // First pass: Find correct positions
    for (let i = 0; i < 4; i++) {
        if (allInputs[i] === allRandoms[i]) {
            correctP++;
            positionN[i] = true;
        }
    }
    
    // Second pass: Find wrong positions (correct number, wrong place)
    for (let i = 0; i < 4; i++) {
        if (allInputs[i] !== allRandoms[i]) {
            for (let j = 0; j < 4; j++) {
                if (!positionN[j] && allInputs[i] === allRandoms[j]) {
                    wrongP++;
                    positionN[j] = true;
                    break;
                }
            }
        }
    }
    
    if (correctP === 4) {
        showMessage('Access Granted! ✅', 'success');
        button.disabled = true;
        setTimeout(() => showModal(true), 500); // Small delay before modal
    } else {
        if (tryN >= maxTries) {
            showMessage('Lockout Initiated ❌', 'error');
            button.disabled = true;
            button.innerText = 'System Locked';
            setTimeout(() => showModal(false), 500);
        } else {
            showMessage(`🎯 Correct position: ${correctP} <br> 🔄 Wrong position: ${wrongP}`, 'warning');
            
            // Clear inputs and focus first for next try
            setTimeout(() => {
                inputs.forEach(input => input.value = '');
                inputs[0].focus();
            }, 1000);
        }
    }
});