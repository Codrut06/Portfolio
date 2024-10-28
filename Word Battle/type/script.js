// const blueWords = ["cat", "dog", "fish", "bird", "tree"];
// const greenWords = ["planet", "flower", "butterfly", "forest"];
// const orangeWords = ["universe", "mountain", "rainforest", "continent"];
// const redWords = ["phenomenon", "extraterrestrial", "multidimensional", "encyclopedia"];

const blueWords = ["ant", "bat", "cow", "fox", "pig", "rat", "bee", "owl", "hen", "elk", "mole", "hare", "crab", "frog", "gnat", "lion", "duck", "lark", "wolf", "seal", "leaf", "rock", "bush", "vine", "root", "cloud", "snow", "rain", "sun", "mist", "wave", "sand", "dirt", "seed", "fern", "bark", "twig", "pond", "hill", "marsh", "field", "coast", "cave", "sky", "moon", "star", "fire", "lake", "wind", "root"];
const greenWords = ["planet", "flower", "butterfly", "forest", "ocean", "garden", "desert", "mountain", "valley", "stream", "glacier", "meadow", "creek", "canyon", "cliff", "lake", "bloom", "petal", "stem", "root", "bark", "thorn", "shade", "moss", "fern", "grass", "leaf", "branch", "seed", "soil", "wind", "cloud", "sunlight", "rainbow", "horizon", "nightfall", "sunrise", "wildflower", "breeze", "insect", "caterpillar", "pollen", "beetle", "hive", "nest", "sparkle", "dew", "mist", "canopy", "wildlife"];
const orangeWords = ["universe", "mountain", "rainforest", "continent", "galaxy", "island", "plateau", "desert", "ocean", "canyon", "volcano", "archipelago", "valley", "plate", "shore", "tundra", "savanna", "steppe", "basin", "ridge", "crater", "cliff", "hill", "pyramid", "glacier", "gorge", "cape", "delta", "bay", "fjord", "peninsula", "seas", "current", "atoll", "marsh", "prairie", "landmass", "ecosystem", "terrain", "climate", "habitat", "landscape", "environment", "biodiversity", "flora", "fauna", "biome", "topography"];
const redWords = ["phenomenon", "extraterrestrial", "multidimensional", "encyclopedia", "theory", "quantum", "cosmology", "neutrino", "simulation", "paradox", "dimension", "gravity", "singularity", "blackhole", "evolution", "galaxy", "biomechanics", "genetics", "neuroscience", "astrobiology", "hypothesis", "antimatter", "teleportation", "relativity", "celestial", "metaphysics", "supernova", "particle", "telescope", "observation", "spectroscopy", "radiation", "infinitesimal", "algorithm", "cybernetics", "informatics", "dynamism", "synergy", "epistemology", "axiom", "paradigm", "existential", "phenotype", "cognition", "simulation", "phenotype", "anthropology"];

let score = 0;
let health = 100;
let timer = 0;
let timerInterval;
let currentWave = 0;
let totalSquares;
let squaresAlive = 0;

const waves = [
    { blue: 10, green: 0, orange: 0, red: 0 },         // Wave 1
    { blue: 12, green: 2, orange: 0, red: 0 },          // Wave 2
    { blue: 8, green: 8, orange: 0, red: 0 },           // Wave 3
    { blue: 10, green: 10, orange: 0, red: 0 },         // Wave 4
    { blue: 5, green: 5, orange: 5, red: 0 },           // Wave 5
    { blue: 2, green: 10, orange: 8, red: 0 },          // Wave 6
    { blue: 0, green: 12, orange: 10, red: 2 },         // Wave 7
    { blue: 0, green: 15, orange: 15, red: 5 },         // Wave 8
    { blue: 0, green: 30, orange: 0, red: 8 },          // Wave 9
    { blue: 30, green: 30, orange: 30, red: 15 }        // Wave 10
];

function showWaveMessage(waveNumber) {
    const waveMessage = document.createElement('div');
    waveMessage.classList.add('wave-message');
    waveMessage.innerText = `Wave ${waveNumber + 1}`;
    document.body.appendChild(waveMessage);

    setTimeout(() => {
        waveMessage.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(waveMessage);
        }, 1000);
    }, 5000);
}

function startWave() {
    if (currentWave >= waves.length) {
        alert("Game Over! You survived all 10 waves!");
        clearInterval(timerInterval);
        return;
    }

    const waveConfig = waves[currentWave];
    totalSquares = waveConfig.blue + waveConfig.green + waveConfig.orange + waveConfig.red;

    if (currentWave === 0) {
        showWaveMessage(currentWave);
    } else {

        if (squaresAlive > 0) {
            return;
        }
        showWaveMessage(currentWave);
    }

    setTimeout(() => {
        spawnSquares(waveConfig);
    }, 5000);
}

function spawnSquares(waveConfig) {
    let spawnedSquares = 0;

    const minSpawnInterval = Math.max(2000 - currentWave * 150, 500);
    const maxSpawnInterval = minSpawnInterval + 1000;

    function spawnSquare() {
        if (spawnedSquares >= totalSquares) {
            if (squaresAlive === 0) {
                currentWave++;
                startWave();
            }
            return;
        }

        let squareType = '';
        if (waveConfig.blue > 0) {
            squareType = 'blue';
            waveConfig.blue--;
        } else if (waveConfig.green > 0) {
            squareType = 'green';
            waveConfig.green--;
        } else if (waveConfig.orange > 0) {
            squareType = 'orange';
            waveConfig.orange--;
        } else if (waveConfig.red > 0) {
            squareType = 'red';
            waveConfig.red--;
        }

        createSquare(squareType);
        spawnedSquares++;

        const nextSpawnInterval = Math.floor(Math.random() * (maxSpawnInterval - minSpawnInterval + 1)) + minSpawnInterval;
        setTimeout(spawnSquare, nextSpawnInterval);
    }

    spawnSquare();
}

function createSquare(squareType) {
    let word;
    if (squareType === 'blue') {
        word = getUniqueWord(blueWords);
    } else if (squareType === 'green') {
        word = getUniqueWord(greenWords);
    } else if (squareType === 'orange') {
        word = getUniqueWord(orangeWords);
    } else if (squareType === 'red') {
        word = getUniqueWord(redWords);
    }

    const wrapper = document.createElement('div');
    wrapper.classList.add('square-wrapper');

    const square = document.createElement('div');
    square.classList.add('square', squareType);
    wrapper.appendChild(square);

    const squareText = document.createElement('div');
    squareText.classList.add('square-text');
    squareText.innerText = word;
    wrapper.appendChild(squareText);

    square.dataset.word = word;

    squaresAlive++;

    const maxWidth = window.innerWidth - 50;
    const randomX = Math.floor(Math.random() * maxWidth);
    const randomY = Math.floor(Math.random() * (window.innerHeight / 2 - 50));

    wrapper.style.left = randomX + 'px';
    wrapper.style.top = randomY + 'px';

    document.body.appendChild(wrapper);

    const interval = setInterval(function() {
        const wrapperRect = wrapper.getBoundingClientRect();
        const inputRect = document.getElementById("wordInput").getBoundingClientRect();

        const dx = (inputRect.left + inputRect.width / 2) - (wrapperRect.left + wrapperRect.width / 2);
        const dy = inputRect.top - (wrapperRect.top + wrapperRect.height);
        const distance = Math.sqrt(dx * dx + dy * dy);

        const moveX = (dx / distance) * 2;
        const moveY = (dy / distance) * 2;

        if (distance < 5) {
            document.body.removeChild(wrapper);
            squaresAlive--;
            updateHealth(squareType);
            clearInterval(interval);
            checkEndWave();
        } else {
            wrapper.style.left = wrapperRect.left + moveX + 'px';
            wrapper.style.top = wrapperRect.top + moveY + 'px';
        }
    }, 20);
}

function getUniqueWord(wordList) {
    return wordList[Math.floor(Math.random() * wordList.length)];
}

// Timer function
function startTimer() {
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timer++;

        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;

        document.getElementById("timer").innerText = `Time Played: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}

function updateScore(points) {
    score = Math.max(0, score + points);
    document.getElementById("score").innerText = score;
}

function updateHealth(squareType) {
    let damage = 0;
    if (squareType === 'blue') {
        damage = 1;
    } else if (squareType === 'green') {
        damage = 2;
    } else if (squareType === 'orange') {
        damage = 4;
    } else if (squareType === 'red') {
        damage = 10;
    }
    health -= damage;
    document.getElementById("health").innerText = health;
    if (health <= 0) {
        alert("Game Over! Your score: " + score);
        clearInterval(timerInterval);
        resetGame();
    }
}

function checkEndWave() {
    if (squaresAlive === 0) {
        currentWave++;
        startWave();
    }
}

function checkInput(event) {
    const input = event.target.value.toLowerCase();
    let wordFound = false;

    document.querySelectorAll('.square-wrapper').forEach(wrapper => {
        const word = wrapper.querySelector('.square').dataset.word;

        if (word.startsWith(input)) {
            const remainingLetters = word.slice(input.length);
            const squareText = wrapper.querySelector('.square-text');
            squareText.innerText = remainingLetters;
            squareText.style.color = 'purple';

            if (word === input) {
                document.body.removeChild(wrapper);
                squaresAlive--;
                wordFound = true;

                const squareType = wrapper.querySelector('.square').classList[1];
                if (squareType === 'blue') {
                    updateScore(25);
                } else if (squareType === 'green') {
                    updateScore(50);
                } else if (squareType === 'orange') {
                    updateScore(100);
                } else if (squareType === 'red') {
                    updateScore(500);
                }

                document.getElementById("wordInput").value = "";
            }
        }
    });

    if (!wordFound && event.key === "Enter") {
        updateScore(-25);
    }

    if (event.key === "Enter") {
        document.getElementById("wordInput").value = "";
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === "Tab") {
        event.preventDefault();
        activateAbility();
    }
});

function activateAbility() {
    if (score >= 3000) {
        updateScore(-3000);

        const allSquares = document.querySelectorAll('.square-wrapper');
        allSquares.forEach(wrapper => {
            squaresAlive--; // Decrease the count of alive squares
            document.body.removeChild(wrapper);
        });
    }
}

startTimer();
startWave();

document.getElementById("wordInput").addEventListener("input", checkInput);
document.getElementById("wordInput").addEventListener("keydown", checkInput);