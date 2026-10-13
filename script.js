.
/* =====================================
   1. PERSONALIZATION
===================================== */

const CONFIG = {
    name: "My Love",
    pin: "130626",
    pinClue: "Our first meet",
    loveLetter: `Happy birthday, sayang! Thank you for being part of my life and making so many ordinary moments feel special. I hope this new chapter brings you peace, good health, exciting opportunities, and every little thing you have been wishing for. Please remember that you are loved, appreciated, and never have to figure everything out alone. I’m proud of you, and I’ll keep cheering for you. Here’s to more memories, more laughter, and many more birthdays together. I love you, always. ♡`
};

/* =====================================
   2. DISPLAY PERSONAL INFORMATION
===================================== */

const pinClueElement = document.getElementById("pinClue");
if (pinClueElement) {
    pinClueElement.textContent = CONFIG.pinClue;
}

/* =====================================
   3. PAGE NAVIGATION
===================================== */
const screens = [...document.querySelectorAll(".screen")];

function go(id) {
    screens.forEach((screen) => {
        screen.classList.toggle("active", screen.id === id);
    });

    if (id === "pin" && pinInput) {
        pinInput.focus({ preventScroll: true });
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

document.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", () => {
        go(button.dataset.go);
    });
});

/* =====================================
   4. GIFT POPUP ANIMATION
===================================== */

const giftButton = document.getElementById("giftButton");
const giftScreen = document.getElementById("gift-screen");

if (giftButton && giftScreen) {
    giftButton.addEventListener("click", () => {
        if (giftButton.classList.contains("gift-opening")) {
            return;
        }

        giftButton.classList.add("gift-opening");

        const symbols = ["♡", "♥", "💗", "💞", "💕"];

        for (let i = 0; i < 24; i++) {
            const heart = document.createElement("span");

            heart.className = "gift-heart";
            heart.textContent =
                symbols[Math.floor(Math.random() * symbols.length)];

            heart.style.setProperty(
                "--heart-size",
                `${16 + Math.random() * 18}px`
            );

            heart.style.setProperty(
                "--heart-drift",
                `${Math.random() * 180 - 90}px`
            );

            heart.style.animationDelay =
                `${Math.random() * 0.35}s`;

            giftScreen.appendChild(heart);

            setTimeout(() => heart.remove(), 2000);
        }

        setTimeout(() => {
            go("welcome-screen");
        }, 1400);
    });
}



/* =====================================
   5. BUTTON SOUND EFFECT
===================================== */

const buttonSound = new Audio("./assets/sounds/click.mp3");
buttonSound.preload = "auto";
buttonSound.volume = 0.7;

const blingSound = new Audio("./assets/sounds/bling.mp3");
blingSound.preload = "auto";
blingSound.volume = 0.8;

function playSound(sound, label) {
    const audio = sound.cloneNode();

    audio.volume = sound.volume;
    audio.currentTime = 0;

    audio.play().catch((error) => {
        console.warn(label + " sound failed:", error);
    });
}

// Suara klik ketika tombol disentuh
document.addEventListener("pointerdown", (event) => {
    const button = event.target.closest("button");

    if (!button) return;

    playSound(buttonSound, "Click");
});

// Fungsi untuk memainkan suara Bling
function playBling() {
    playSound(blingSound, "Bling");
}



/* =====================================
   6. BACKGROUND MUSIC
===================================== */

const backgroundMusic = new Audio("./assets/sounds/HeyLover.mp3");

backgroundMusic.loop = true;
backgroundMusic.volume = 0.35;
backgroundMusic.preload = "auto";
backgroundMusic.playsInline = true;

const musicBtn = document.getElementById("musicBtn");
const musicNote = document.getElementById("musicNote");

if (musicBtn && musicNote) {
    musicBtn.addEventListener("click", async () => {
        try {
            if (backgroundMusic.paused) {
                await backgroundMusic.play();
            } else {
                backgroundMusic.pause();
            }
        } catch (error) {
            console.error("Music playback failed:", error);
            musicNote.textContent = "Tap to try again ♡";
        }
    });

    backgroundMusic.addEventListener("play", () => {
        musicNote.textContent = "Now playing ♡";
        musicBtn.textContent = "Ⅱ";
    });

    backgroundMusic.addEventListener("pause", () => {
        musicNote.textContent = "Music paused ♡";
        musicBtn.textContent = "♫";
    });
}

/* =====================================
   7. TOAST NOTIFICATION
===================================== */

function toast(message) {
    const element = document.getElementById("toast");

    element.textContent = message;
    element.classList.add("show");

    setTimeout(() => {
        element.classList.remove("show");
    }, 2200);
}


/* =====================================
   8. CATCH ME GAME
===================================== */

let catches = 0;
let lives = 3;
let catchTimer = null;
let catchAnimationFrame = null;
let gameRunning = false;
let bucketX = 0;
let draggingBucket = false;

const catchField = document.getElementById("catchField");
const basket = document.getElementById("basket");
const catchCount = document.getElementById("catchCount");

// Update score
function updateCatches() {
    catchCount.textContent = `Photos: ${catches} / 10 · Lives: ${lives} ♡`;
}

// Show small message when catching a photo or bomb
function showCatchMessage(message, x, y) {
    const pop = document.createElement("span");
    pop.className = "catch-pop";
    pop.textContent = message;
    pop.style.left = `${x}px`;
    pop.style.top = `${y}px`;

    catchField.appendChild(pop);

    setTimeout(() => pop.remove(), 850);
}

// Play sound when catching a photo
function playBling() {
    playSound(blingSound, "Bling");
}

// Move basket horizontally
function moveBucket(clientX) {
    const rect = catchField.getBoundingClientRect();
    const bucketWidth = basket.offsetWidth;
    const pointerX = clientX - rect.left;

    bucketX = Math.max(
        bucketWidth / 2,
        Math.min(rect.width - bucketWidth / 2, pointerX)
    );

    basket.style.left = `${bucketX}px`;
    basket.style.transform = "translateX(-50%)";
}

// Start dragging the basket.
// Clicking or touching a falling object will NOT catch it.
catchField.addEventListener("pointerdown", (event) => {
    if (!gameRunning) return;
    if (event.target !== basket && !basket.contains(event.target)) return;

    draggingBucket = true;
    basket.classList.add("dragging");

    moveBucket(event.clientX);
    catchField.setPointerCapture(event.pointerId);
});

catchField.addEventListener("pointermove", (event) => {
    if (!gameRunning || !draggingBucket) return;

    moveBucket(event.clientX);
});

function stopDragging() {
    draggingBucket = false;
    basket.classList.remove("dragging");
}

catchField.addEventListener("pointerup", stopDragging);
catchField.addEventListener("pointercancel", stopDragging);
catchField.addEventListener("lostpointercapture", stopDragging);

// Spawn falling photos or bombs
function spawnCatchObject() {
    if (!gameRunning) return;

    const object = document.createElement("div");
    const isBomb = Math.random() < 0.22;

    object.className = `catch-object${isBomb ? " bomb" : ""}`;

    if (isBomb) {
        object.textContent = "💣";
        object.setAttribute("aria-label", "Bomb");
    } else {
        const photo = document.createElement("img");
        photo.src = "assets/photos/CatchMe.png";
        photo.alt = "Catch me";
        photo.draggable = false;

        object.appendChild(photo);
        object.setAttribute("aria-label", "Catch my photo");
    }

    const maxLeft = Math.max(0, catchField.clientWidth - 58);

    object.dataset.kind = isBomb ? "bomb" : "photo";
    object.dataset.y = "0";
    object.style.left = `${Math.random() * maxLeft}px`;
    object.style.pointerEvents = "none";

    catchField.appendChild(object);

    // IMPORTANT:
    // No click or pointerdown event on falling objects.
    // They can only be caught through collision detection.
}

// Handle a collision between a falling object and the basket
function catchObject(object) {
    if (!gameRunning || !object.isConnected) return;

    const kind = object.dataset.kind;
    const x = parseFloat(object.style.left) || 0;
    const y = parseFloat(object.dataset.y) || 0;

    if (kind === "photo") {
        catches++;

        playBling();
        showCatchMessage("Yay! ♡", x, Math.max(20, y - 10));
        confetti({ mode: "love-lite" });

        object.remove();
        updateCatches();

        if (catches >= 10) {
            finishCatchGame(true);
        }
    } else if (kind === "bomb") {
        lives--;

        showCatchMessage("Oops!", x, Math.max(20, y - 10));

        object.remove();
        updateCatches();

        if (lives <= 0) {
            finishCatchGame(false);
        }
    }
}

// Finish the game
function finishCatchGame(won) {
    gameRunning = false;
    draggingBucket = false;

    clearInterval(catchTimer);

    if (catchAnimationFrame !== null) {
        cancelAnimationFrame(catchAnimationFrame);
        catchAnimationFrame = null;
    }

    basket.classList.remove("dragging");

    catchField.querySelectorAll(".catch-object").forEach((object) => {
        object.remove();
    });

    if (won) {
        document.getElementById("catchWin").classList.add("active");
    } else {
        toast("Game over! Let's try again ♡");

        catches = 0;
        lives = 3;
        updateCatches();

        setTimeout(() => {
            if (document.getElementById("catch").classList.contains("active")) {
                startCatch();
            }
        }, 1200);
    }
}

// Animate falling objects and detect basket collisions
function animateCatchObjects() {
    if (!gameRunning) return;

    const fieldRect = catchField.getBoundingClientRect();
    const bucketRect = basket.getBoundingClientRect();

    catchField.querySelectorAll(".catch-object").forEach((object) => {
        let y = parseFloat(object.dataset.y || "0");

        y += object.dataset.kind === "bomb" ? 2.8 : 2.4;

        object.dataset.y = String(y);
        object.style.top = `${y}px`;

        const objectRect = object.getBoundingClientRect();

        const overlaps =
            objectRect.bottom >= bucketRect.top &&
            objectRect.top <= bucketRect.bottom &&
            objectRect.right >= bucketRect.left &&
            objectRect.left <= bucketRect.right;

        // Only collision with the basket can catch an object
        if (overlaps) {
            catchObject(object);
            return;
        }

        // Remove objects that fall past the bottom
        if (y > fieldRect.height) {
            object.remove();
        }
    });

    if (gameRunning) {
        catchAnimationFrame = requestAnimationFrame(animateCatchObjects);
    }
}

// Start or restart the game
function startCatch() {
    clearInterval(catchTimer);

    if (catchAnimationFrame !== null) {
        cancelAnimationFrame(catchAnimationFrame);
        catchAnimationFrame = null;
    }

    catchField.querySelectorAll(".catch-object, .catch-pop").forEach((item) => {
        item.remove();
    });

    catches = 0;
    lives = 3;
    gameRunning = true;
    draggingBucket = false;
    bucketX = catchField.clientWidth / 2;

    basket.style.left = `${bucketX}px`;
    basket.style.transform = "translateX(-50%)";

    updateCatches();

    catchTimer = setInterval(spawnCatchObject, 850);
    spawnCatchObject();

    catchAnimationFrame = requestAnimationFrame(animateCatchObjects);
}

// Start the game when entering the Catch Me screen
document.querySelector('[data-go="catch"]').addEventListener("click", () => {
    setTimeout(() => {
        if (document.getElementById("catch").classList.contains("active")) {
            startCatch();
        }
    }, 150);
});

// Keyboard controls for desktop
document.addEventListener("keydown", (event) => {
    if (!gameRunning) return;

    if (event.key === "ArrowLeft") {
        bucketX -= 25;
    } else if (event.key === "ArrowRight") {
        bucketX += 25;
    } else {
        return;
    }

    const half = basket.offsetWidth / 2;

    bucketX = Math.max(
        half,
        Math.min(catchField.clientWidth - half, bucketX)
    );

    basket.style.left = `${bucketX}px`;
    basket.style.transform = "translateX(-50%)";
});



/* =====================================
   9. WORD SEARCH GAME
===================================== */
const WORD_SEARCH_CONFIG = {
    minGridSize: 8,
    words: [
        "GORGEOUS",
        "SEXY",
        "ADORABLE",
        "WITTY",
        "SWEET",
        "HANDSOME"
    ]
};

const words = WORD_SEARCH_CONFIG.words
    .map((word) => word.trim().toUpperCase().replace(/[^A-Z]/g, ""))
    .filter(Boolean);

const MIN_GRID_SIZE = WORD_SEARCH_CONFIG.minGridSize;
const gridSize = Math.max(
    MIN_GRID_SIZE,
    ...words.map((word) => word.length)
);
const gridEl = document.getElementById("letterGrid");
const listEl = document.getElementById("wordList");
const wordCount = document.getElementById("wordCount");
const wordFeedback = document.getElementById("wordFeedback");

let puzzle = [];
let placements = [];
let foundWords = new Set();
let usedCells = new Set();
let isSelecting = false;
let currentCells = [];

const directions = [
    [0, 1],    // left -> right
    [1, 0],    // top -> bottom
    [1, 1],    // diagonal down-right
    [-1, 1]    // diagonal up-right
];

function isStraightLineSelection(cells) {
    if (cells.length < 2) return true;

    const first = cells[0];
    const horizontal = cells.every(({ r, c }) => r === first.r);
    const vertical = cells.every(({ r, c }) => c === first.c);
    const diagonal = cells.every(({ r, c }) =>
        Math.abs(r - first.r) === Math.abs(c - first.c)
    );

    return horizontal || vertical || diagonal;
}

function cellKey(r, c) {
    return `${r},${c}`;
}

function setWordFeedback(message) {
    if (wordFeedback) {
        wordFeedback.textContent = message;
    }
}

function buildPuzzle() {
    puzzle = Array.from(
        { length: gridSize },
        () => Array(gridSize).fill("")
    );

    placements = [];

    const shuffledWords = [...words].sort(
        (a, b) => b.length - a.length
    );

    for (const word of shuffledWords) {
        const candidatesByDirection = directions.map(() => []);

        directions.forEach(([dr, dc], directionIndex) => {
            for (let r = 0; r < gridSize; r++) {
                for (let c = 0; c < gridSize; c++) {
                    const endR = r + dr * (word.length - 1);
                    const endC = c + dc * (word.length - 1);

                    if (
                        endR < 0 || endR >= gridSize ||
                        endC < 0 || endC >= gridSize
                    ) {
                        continue;
                    }

                    const cells = [];
                    let valid = true;

                    for (let i = 0; i < word.length; i++) {
                        const rr = r + dr * i;
                        const cc = c + dc * i;
                        const existing = puzzle[rr][cc];

                        if (existing && existing !== word[i]) {
                            valid = false;
                            break;
                        }

                        cells.push({ r: rr, c: cc });
                    }

                    if (valid) {
                        candidatesByDirection[directionIndex].push(cells);
                    }
                }
            }
        });

        const validDirections = candidatesByDirection
            .map((candidates, index) => ({ candidates, index }))
            .filter((item) => item.candidates.length > 0);

        if (validDirections.length === 0) {
            return false;
        }

        const pickedDirection =
            validDirections[
                Math.floor(Math.random() * validDirections.length)
            ];

        const cells =
            pickedDirection.candidates[
                Math.floor(Math.random() * pickedDirection.candidates.length)
            ];

        cells.forEach((cell, i) => {
            puzzle[cell.r][cell.c] = word[i];
        });

        placements.push({ word, cells });
    }

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (!puzzle[r][c]) {
                puzzle[r][c] =
                    alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
    }

    return true;
}

function renderWordList() {
    listEl.innerHTML = "";

    words.forEach((word) => {
        const chip = document.createElement("span");
        chip.className = "word-chip";
        chip.textContent = word;
        chip.dataset.word = word;
        listEl.appendChild(chip);
    });
}

function renderGrid() {
    gridEl.innerHTML = "";
    gridEl.style.setProperty("--grid-size", gridSize);

    puzzle.forEach((row, r) => {
        row.forEach((character, c) => {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "letter";
            button.textContent = character;
            button.dataset.r = r;
            button.dataset.c = c;
            button.setAttribute("aria-label", character);

            gridEl.appendChild(button);
        });
    });
}

function getCellFromPoint(x, y) {
    const element = document.elementFromPoint(x, y);
    const cell = element?.closest(".letter");

    return cell && gridEl.contains(cell) ? cell : null;
}

function clearPreview() {
    gridEl.querySelectorAll(".letter.preview").forEach((cell) => {
        cell.classList.remove("preview");
    });
}

function refreshPreviewPath() {
    clearPreview();
    currentCells.forEach(({ r, c }) => {
        const cell = gridEl.querySelector(
            `.letter[data-r="${r}"][data-c="${c}"]`
        );

        if (cell && !cell.classList.contains("used")) {
            cell.classList.add("preview");
        }
    });
}

function parseCellPosition(cell) {
    return {
        r: Number(cell.dataset.r),
        c: Number(cell.dataset.c)
    };
}

function isAdjacentCell(a, b) {
    const rowDiff = Math.abs(a.r - b.r);
    const colDiff = Math.abs(a.c - b.c);

    return rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0);
}

function isStraightLineStep(a, b) {
    const rowDiff = b.r - a.r;
    const colDiff = b.c - a.c;

    return (
        rowDiff === 0 ||
        colDiff === 0 ||
        Math.abs(rowDiff) === Math.abs(colDiff)
    );
}

function extendSelectionTo(cell) {
    const next = parseCellPosition(cell);
    const last = currentCells[currentCells.length - 1];

    if (!last) {
        currentCells = [next];
        refreshPreviewPath();
        return;
    }

    if (next.r === last.r && next.c === last.c) return;

    const previous = currentCells[currentCells.length - 2];

    if (
        previous &&
        next.r === previous.r &&
        next.c === previous.c
    ) {
        currentCells.pop();
        refreshPreviewPath();
        return;
    }

    const alreadyIncluded = currentCells.some(
        (item) => item.r === next.r && item.c === next.c
    );

    if (alreadyIncluded || !isAdjacentCell(last, next)) {
        return;
    }

    const pathPreview = [...currentCells, next];
    if (!isStraightLineSelection(pathPreview) || !isStraightLineStep(last, next)) {
        return;
    }

    currentCells.push(next);
    refreshPreviewPath();
}

function finishSelection() {
    if (!isSelecting) return;

    isSelecting = false;

    if (!isStraightLineSelection(currentCells)) {
        currentCells = [];
        clearPreview();
        setWordFeedback("Try a straight line from left to right, top to bottom, or diagonal. ♡");
        return;
    }

    const selectedWord = currentCells
        .map(({ r, c }) => puzzle[r][c])
        .join("");

    const reversedSelectedWord = [...selectedWord].reverse().join("");
    const matchWord = words.find((word) => {
        if (foundWords.has(word)) return false;

        return selectedWord === word || reversedSelectedWord === word;
    });

    clearPreview();

    if (matchWord) {
        foundWords.add(matchWord);
        playBling();

        currentCells.forEach(({ r, c }) => {
            usedCells.add(cellKey(r, c));

            const cell = gridEl.querySelector(
                `.letter[data-r="${r}"][data-c="${c}"]`
            );

            if (cell) {
                cell.classList.add("used");
                cell.classList.remove("preview");
            }
        });

        const chip = listEl.querySelector(
            `[data-word="${matchWord}"]`
        );

        if (chip) chip.classList.add("found");

        wordCount.textContent =
            `Words found: ${foundWords.size} / ${words.length}`;

        setWordFeedback(`Found ${matchWord}! ♡`);
        confetti({ mode: "love-lite" });

        if (foundWords.size === words.length) {
            setWordFeedback("You found every word! 🩵");

            setTimeout(() => {
                document.getElementById("wordWin").classList.add("active");
            }, 500);
        }
    } else {
        setWordFeedback(
            "Not quite! Try sliding across another word. ♡"
        );
    }

    currentCells = [];
}

gridEl.addEventListener("pointerdown", (event) => {
    const cell = event.target.closest(".letter");
    if (!cell || !gridEl.contains(cell)) return;

    event.preventDefault();

    isSelecting = true;
    currentCells = [parseCellPosition(cell)];
    refreshPreviewPath();
});

gridEl.addEventListener("pointermove", (event) => {
    if (!isSelecting) return;

    const cell = getCellFromPoint(event.clientX, event.clientY);
    if (cell) extendSelectionTo(cell);
});

gridEl.addEventListener("pointerup", (event) => {
    if (!isSelecting) return;

    const cell = getCellFromPoint(event.clientX, event.clientY);

    if (cell) {
        extendSelectionTo(cell);
    }

    finishSelection();
});

gridEl.addEventListener("pointercancel", () => {
    isSelecting = false;
    currentCells = [];
    clearPreview();
});

document.getElementById("wordWinNext").addEventListener("click", () => {
    document.getElementById("wordWin").classList.remove("active");
    go("pin");
});

function initializeWordSearch() {
    if (words.length === 0) {
        setWordFeedback("Add at least one word in WORD_SEARCH_CONFIG.words.");
        return;
    }

    let success = false;

    for (let attempt = 0; attempt < 120 && !success; attempt++) {
        success = buildPuzzle();
    }

    if (!success) {
        setWordFeedback(
            "Couldn't build this puzzle yet. Try shorter words or refresh."
        );
        return;
    }

    foundWords = new Set();
    usedCells = new Set();

    wordCount.textContent = `Words found: 0 / ${words.length}`;
    setWordFeedback("Slide through neighboring letters to form a word. ♡");

    renderWordList();
    renderGrid();
}

initializeWordSearch();


/* =====================================
   10. PIN GAME
===================================== */

const pinSend = document.getElementById("pinSend");
const pinFeedback = document.getElementById("pinFeedback");
const pinDots = document.getElementById("pinDots");
const pinScreen = document.getElementById("pin");
const pinInput = document.getElementById("pinInput");
const pinMustBeNumeric = /^\d+$/.test(CONFIG.pin);
let pinValue = "";

pinInput.inputMode = pinMustBeNumeric ? "numeric" : "text";
pinInput.maxLength = CONFIG.pin.length;

function isPinScreenActive() {
    return pinScreen && pinScreen.classList.contains("active");
}

function updatePinDots() {
    const typedLength = Math.min(
        pinValue.length,
        CONFIG.pin.length
    );

    pinDots.textContent = Array.from(
        { length: CONFIG.pin.length },
        (_, index) => index < typedLength ? "♥" : "♡"
    ).join(" ");
}

function submitPin() {
    if (pinValue === CONFIG.pin) {
        pinFeedback.textContent = "";
        pinValue = "";
        pinInput.value = "";
        updatePinDots();
        go("letter");
        return;
    }

    pinFeedback.textContent = "Not quite! Try again, sayang 💙";
    pinValue = "";
    pinInput.value = "";
    updatePinDots();
}

if (pinSend && pinDots) {
    updatePinDots();

    pinSend.addEventListener("click", submitPin);
}

pinInput.addEventListener("input", () => {
    if (!isPinScreenActive()) return;

    pinValue = pinMustBeNumeric
        ? pinInput.value.replace(/\D/g, "").slice(0, CONFIG.pin.length)
        : pinInput.value.slice(0, CONFIG.pin.length);
    pinInput.value = pinValue;
    pinFeedback.textContent = "";
    updatePinDots();
});

pinInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        submitPin();
    }
});

/* =====================================
   11. FINAL HUG BUTTON
===================================== */

document.getElementById("hugBtn").addEventListener("click", () => {
    document.getElementById("hugMessage").textContent =
        "Hug delivered successfully! (づ｡◕‿‿◕｡)づ 🩵";

    confetti({ mode: "love-lite" });
});

/* =====================================
   12. CONFETTI ANIMATION
===================================== */

function confetti(options = {}) {
    const mode = options.mode || "default";
    const isLoveLite = mode === "love-lite";
    const symbols = isLoveLite
        ? ["♡", "♥", "❤"]
        : ["🩵", "✨", "♡", "☁️"];
    const pinkPalette = ["#f7a8c6", "#f48fb8", "#f27db0", "#f9bfd6"];
    const count = isLoveLite ? 8 : 24;
    const minSize = isLoveLite ? 14 : 16;
    const sizeRange = isLoveLite ? 8 : 14;
    const minDuration = isLoveLite ? 1.6 : 2;
    const durationRange = isLoveLite ? 1.2 : 2;
    const maxLife = isLoveLite ? 3200 : 4500;

    for (let i = 0; i < count; i++) {
        const element = document.createElement("span");

        element.textContent = symbols[
            Math.floor(Math.random() * symbols.length)
        ];

        element.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}vw;
            top: -20px;
            font-size: ${minSize + Math.random() * sizeRange}px;
            z-index: 20;
            pointer-events: none;
            animation: falling ${minDuration + Math.random() * durationRange}s linear forwards;
        `;

        if (isLoveLite) {
            element.style.color =
                pinkPalette[Math.floor(Math.random() * pinkPalette.length)];
        }

        document.body.appendChild(element);

        setTimeout(() => {
            element.remove();
        }, maxLife);
    }
}

/* =====================================
   13. GLOBAL SNOW BACKGROUND
===================================== */

function initSnowfall() {
    const snowLayer = document.querySelector(".sparkles");

    if (!snowLayer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const snowSymbols = ["❄", "✦", "•"];
    const maxSnowflakes = 80;

    window.setInterval(() => {
        if (document.hidden) return;
        if (snowLayer.childElementCount >= maxSnowflakes) return;

        const flake = document.createElement("span");
        const duration = 6 + Math.random() * 5;
        const delay = Math.random() * 1.2;

        flake.className = "snowflake";
        flake.textContent =
            snowSymbols[Math.floor(Math.random() * snowSymbols.length)];

        flake.style.setProperty("--snow-x", `${Math.random() * 100}%`);
        flake.style.setProperty("--snow-size", `${10 + Math.random() * 14}px`);
        flake.style.setProperty(
            "--snow-drift",
            `${Math.random() * 80 - 40}px`
        );
        flake.style.setProperty("--snow-duration", `${duration}s`);
        flake.style.setProperty("--snow-delay", `${delay}s`);

        snowLayer.appendChild(flake);

        window.setTimeout(() => {
            flake.remove();
        }, (duration + delay + 0.5) * 1000);
    }, 220);
}

initSnowfall();
