 "strict mode";

const mysteryNumberBtn = document.querySelector("#generateNumberBtn");
const mysteryNumberField = document.querySelector("#myInput");
const processEntryBtn = document.querySelector("#processEntry");
const startGameBtn = document.querySelector("#startGame");
const startRoundBtn = document.querySelector("#startRound");

const roundCountSpan = document.querySelector("#roundCount");
const guessesSpan = document.querySelector("#guesses");
const guessStatsSpan = document.querySelector("#guessStats");
const roundsWonSpan = document.querySelector("#roundsWon");
const roundsLostSpan = document.querySelector("#roundsLost");
const gameStatsSpan = document.querySelector("#gameStats");

let mysteryNumber = undefined;
let roundCount = 0;
let lostRoundCount = 0;
let wonRoundCount = 0;
let guesses = [];
let attemptCount = 0
setInputButtonsMode(false, true, true);

function resetRound() {
    attemptCount = 0;
    mysteryNumber = undefined;
    guesses = [];
    mysteryNumberField.value = "";
    guessesSpan.textContent = "";
    guessStatsSpan.textContent = "";
    setInputButtonsMode(false, true, true);       
}

//--------------------------------------------------------------------



function setInputButtonsMode(mysteryNumberBtnMode, inputFieldMode, processEntryBtnMode) {
    mysteryNumberBtn.disabled = mysteryNumberBtnMode;
    mysteryNumberField.disabled = inputFieldMode;
    processEntryBtn.disabled = processEntryBtnMode;
}

function generateMysteryNumber() {
    ++roundCount;
    roundCountSpan.textContent = roundCount;
    setInputButtonsMode(true, false, false);
    mysteryNumber = Math.floor(Math.random() * 20) + 1;
    console.log(mysteryNumber);
    return mysteryNumber;
}

function getGameStats() {
    if (wonRoundCount >= 2) {
        gameStatsSpan.style.color = 'blue';
        gameStatsSpan.textContent = 'Won! Congrats!';
        new Audio("./sounds/victory.wav").play();
    } else if (lostRoundCount >= 2) {
        gameStatsSpan.style.color = 'red';
        gameStatsSpan.textContent = 'Sorry, you lost.';
        new Audio("./sounds/defeat.wav").play();
    }
    startGameBtn.style.display = 'block';
}

function getRoundStats(stats) {
    if (stats == "lost") {
        roundsLostSpan.textContent = lostRoundCount;
    }
    else {
        roundsWonSpan.textContent = wonRoundCount;
    }
    if (roundCount == 3) {
        setInputButtonsMode(true, true, true);
        startRoundBtn.style.display = 'none';
        getGameStats();
    }
}

function guessMysteryNumber(val) {
    const MAX_GUESSES_ALLOWED = 4;
    if (guesses.includes(val)) {
        guessStatsSpan.textContent = "You've already tried that guess.";
        return;
    }
    if (val < 1 || val > 20) {
        guessStatsSpan.textContent = "Guess must be between 1 and 20.";
        return;
    }
    if (attemptCount < MAX_GUESSES_ALLOWED) {
        ++attemptCount;
        guesses.push(val);
        guessesSpan.textContent = guesses.join(" - ");
        if (val < mysteryNumber) {
            guessStatsSpan.textContent = "Lower than mystery number.";
        } else if (val > mysteryNumber) {
            guessStatsSpan.textContent = "Larger than mystery number.";
        } else if (val === mysteryNumber) {
            ++wonRoundCount;
            guessStatsSpan.textContent = `Correct. The mystery number is ${mysteryNumber}.`;
            setInputButtonsMode(true, true, true);
            startRoundBtn.style.display = 'block';
            getRoundStats("won");
        }
    }
    if (attemptCount == MAX_GUESSES_ALLOWED) {
        ++lostRoundCount;
        setInputButtonsMode(true, true, true);
        guessStatsSpan.textContent += " No more guesses allowed.";
        startRoundBtn.style.display = 'block';
        getRoundStats("lost");
    }
}

//-------------------------------------------------------------------- 

startGameBtn.addEventListener("click", function () {
    location.reload();
    this.style.display = 'none';
});

startRoundBtn.addEventListener("click", function () {
    resetRound();
    setInputButtonsMode(false, true, true);
    this.style.display = 'none';
});

mysteryNumberBtn.addEventListener("click", function () {
    mysteryNumber = generateMysteryNumber();
    setInputButtonsMode(true, false, false);
});

processEntryBtn.addEventListener("click", function () {
    let val = mysteryNumberField.value.trim();
    let intVal = parseInt(val);
    if (!isNaN(intVal) && isFinite(intVal)) {
        guessMysteryNumber(intVal);
    }
});

let buttons = document.getElementsByTagName('button');
for (let i = 0; i < buttons.length; ++i) {
    buttons[i].addEventListener('mousedown', function () {
        this.classList.add('no-shadow');
    });
    buttons[i].addEventListener('mouseup', function () {
        this.classList.remove('no-shadow');
    });
}
