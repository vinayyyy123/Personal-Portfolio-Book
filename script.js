const pages = document.querySelectorAll(".book-page");
const nextButtons = document.querySelectorAll(".nav.next");
const prevButtons = document.querySelectorAll(".nav.prev");

// Page flip sound
const pageSound = document.getElementById("pageSound");

// Always points to LEFT page of active spread (0, 2, 4...)
let currentIndex = 0;

// Audio unlock flag (REQUIRED by browsers)
let audioUnlocked = false;

/* ===================== AUDIO UNLOCK ===================== */

function unlockAudio() {
    if (!pageSound || audioUnlocked) return;

    pageSound.play()
        .then(() => {
            pageSound.pause();
            pageSound.currentTime = 0;
            audioUnlocked = true;
        })
        .catch(() => {});
}

// Unlock audio on first user interaction
document.addEventListener("click", unlockAudio, { once: true });
document.addEventListener("keydown", unlockAudio, { once: true });
document.addEventListener("touchstart", unlockAudio, { once: true });

/* ===================== SOUND ===================== */

function playSound(delay = 120) {
    if (!pageSound || !audioUnlocked) return;

    setTimeout(() => {
        pageSound.currentTime = 0;
        pageSound.play().catch(() => {});
    }, delay);
}


/* ===================== CORE NAVIGATION ===================== */

function goNext() {
    const rightPage = pages[currentIndex + 1];
    const nextLeft = pages[currentIndex + 2];
    const nextRight = pages[currentIndex + 3];

    if (!rightPage || !nextLeft || !nextRight) return;

    nextLeft.classList.add("active");
    nextRight.classList.add("active");

    // Flip FIRST
    rightPage.classList.add("flipped");

    // THEN play sound synced to flip
    playSound();

    currentIndex += 2;
    updateNavButtons();
}


function goPrev() {
    if (currentIndex === 0) return;

    const prevRight = pages[currentIndex - 1];
    const currentLeft = pages[currentIndex];
    const currentRight = pages[currentIndex + 1];

    // Unflip FIRST
    prevRight.classList.remove("flipped");

    // Sound synced with unflip
    playSound();

    currentLeft.classList.remove("active");
    currentRight?.classList.remove("active");

    currentIndex -= 2;
    updateNavButtons();
}


/* ===================== NAV BUTTON STATE ===================== */

function updateNavButtons() {
    nextButtons.forEach(btn => {
        btn.style.visibility =
            currentIndex + 3 >= pages.length ? "hidden" : "visible";
    });

    prevButtons.forEach(btn => {
        btn.style.visibility =
            currentIndex === 0 ? "hidden" : "visible";
    });
}

/* ===================== PAGE NUMBER AUTO-SYNC ===================== */

function updatePageNumbers() {
    pages.forEach((page, index) => {
        const num = page.querySelector(".page-number");
        if (num) num.textContent = index + 1;
    });
}

/* ===================== KEYBOARD NAVIGATION ===================== */

document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
});

/* ===================== TOUCH SWIPE SUPPORT ===================== */

let startX = 0;

document.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
});

document.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (diff > 60) goNext();      // swipe left
    if (diff < -60) goPrev();    // swipe right
});
/* =====================
   GO BACK TO PROFILE
   ===================== */

function goToProfile() {
    if (currentIndex === 0) return;

    // Unflip all pages
    pages.forEach(page => {
        page.classList.remove("flipped");
        page.classList.remove("active");
    });

    // Activate first spread (Profile)
    pages[0].classList.add("active");
    pages[1]?.classList.add("active");

    // Reset index
    currentIndex = 0;

    // Sync UI
    updateNavButtons();

    // Optional sound for consistency
    playSound(0);
}


/* ===================== INIT ===================== */

updatePageNumbers();
updateNavButtons();
