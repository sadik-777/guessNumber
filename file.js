// Initialize game state
let allRandoms = Array.from({length: 4}, () => Math.floor(Math.random() * 10));
console.log('Secret Code:', allRandoms.join('')); // For debugging/cheating

let tryN = 0;
const maxTries = 4;
let button = document.getElementById('guess-button');
let stopButton = document.getElementById('stop-button');
let res = document.getElementById('letRes');
let triesDisplay = document.getElementById('tries-display');
let timerDisplay = document.getElementById('timer');
let inputs = [
    document.getElementById('input1'),
    document.getElementById('input2'),
    document.getElementById('input3'),
    document.getElementById('input4')
];

let timeLeft = 60;
let timerInterval;
let gameActive = true;

// Start Timer
function startTimer() {
    timerInterval = setInterval(() => {
        if (!gameActive) return;
        
        timeLeft--;
        let minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        let seconds = (timeLeft % 60).toString().padStart(2, '0');
        timerDisplay.innerText = `${minutes}:${seconds}`;
        
        if (timeLeft <= 10) {
            timerDisplay.classList.add('timer-danger');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame(false, 'TIME EXPIRED');
        }
    }, 1000);
}
startTimer();

// UI helpers
const showMessage = (msg, type) => {
    res.innerHTML = msg;
    res.className = `show status-${type}`;
    if (window.trigger3DFeedback) {
        window.trigger3DFeedback(type);
    }
};

const showModal = (isWin, titleOverride) => {
    const modal = document.getElementById('result-modal');
    const title = document.getElementById('modal-title');
    const desc = document.getElementById('modal-desc');
    
    if (isWin) {
        title.innerHTML = titleOverride || 'Access Granted!';
        title.className = 'win-text';
        desc.innerText = `You successfully cracked the code with ${timeLeft} seconds left.`;
    } else {
        title.innerHTML = titleOverride || 'Access Denied';
        title.className = 'lose-text';
        desc.innerText = `The correct code was ${allRandoms.join('')}.`;
    }
    
    modal.classList.add('active');
};

window.closeModal = () => {
    document.getElementById('result-modal').classList.remove('active');
};

const endGame = (isWin, titleOverride) => {
    gameActive = false;
    clearInterval(timerInterval);
    button.disabled = true;
    stopButton.disabled = true;
    inputs.forEach(input => input.disabled = true);
    
    if (!isWin) {
        button.innerText = 'System Locked';
        showMessage('Lockout Initiated ❌', 'error');
    }
    setTimeout(() => showModal(isWin, titleOverride), 500);
};

// Auto-advance inputs for better UX
inputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        if (input.value.length > 1) {
            input.value = input.value.slice(-1);
        }
        if (input.value !== '' && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value === '' && index > 0) {
            inputs[index - 1].focus();
            inputs[index - 1].value = '';
        }
        if (e.key === 'Enter') {
            button.click();
        }
    });
});

button.addEventListener('click', function(e) {
    e.preventDefault();
    if (!gameActive) return;
    
    let allInputs = inputs.map(input => parseInt(input.value));
    
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
    
    // First pass
    for (let i = 0; i < 4; i++) {
        if (allInputs[i] === allRandoms[i]) {
            correctP++;
            positionN[i] = true;
        }
    }
    
    // Second pass
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
        endGame(true);
    } else {
        if (tryN >= maxTries) {
            endGame(false, 'OUT OF ATTEMPTS');
        } else {
            showMessage(`🎯 Correct position: ${correctP} <br> 🔄 Wrong position: ${wrongP}`, 'warning');
            
            setTimeout(() => {
                inputs.forEach(input => input.value = '');
                inputs[0].focus();
            }, 1000);
        }
    }
});

stopButton.addEventListener('click', function(e) {
    e.preventDefault();
    if (!gameActive) return;
    
    endGame(false, 'GAME STOPPED');
});