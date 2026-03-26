// ===== THEME TOGGLE LOGIC =====
const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

// Check local storage or system preference
const currentMode = localStorage.getItem('theme-mode');

if (currentMode === 'light-mode') {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('light-mode')) {
        localStorage.setItem('theme-mode', 'light-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        localStorage.setItem('theme-mode', 'dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
});

// ===== 3D TILT EFFECT =====
const tiltCards = document.querySelectorAll('[data-tilt]');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5; // Reduced intensity
        const rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.scroll-reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

// ===== INTELLIGENT DOCK SWAP (TELEPORT) =====
const mainDock = document.getElementById('mainDock');
const ghostDock = document.getElementById('ghostDock');
const footer = document.querySelector('footer');

const dockObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // הגענו לפוטר: תסתיר את הראשי, תציג את העליון
            mainDock.classList.add('dock-hidden');
            ghostDock.classList.add('active');
        } else {
            // יצאנו מהפוטר: תחזיר את הראשי, תסתיר את העליון
            mainDock.classList.remove('dock-hidden');
            ghostDock.classList.remove('active');
        }
    });
}, {
    threshold: 0.1, // מפעיל כשרק קצת מהפוטר נכנס
    rootMargin: "0px 0px 0px 0px"
});

dockObserver.observe(footer);

// ===== SMART VAULT FILTERING =====
const filterBtns = document.querySelectorAll('.filter-btn');
const vaultItems = document.querySelectorAll('.vault-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        vaultItems.forEach(item => {
            const tags = item.getAttribute('data-tags');
            if (filter === 'all' || tags.includes(filter)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = this.getAttribute('href') === '#core' ? 0 : 100;
            window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        }
    });
});

function openVideoModal(videoPath) {
    const modal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('modalVideoPlayer');
    if (!modal || !videoPlayer) return;

    videoPlayer.src = videoPath;
    modal.classList.remove('hidden');
    // אופציונלי: התחלה אוטומטית
    // videoPlayer.play();
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('modalVideoPlayer');
    if (!modal || !videoPlayer) return;

    modal.classList.add('hidden');
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
    videoPlayer.src = ""; // ניקוי המקור
}

// סגירה עם מקש ESC
document.addEventListener('keydown', function (event) {
    if (event.key === "Escape") closeVideoModal();
});

// ===== CURSOR GLOW =====
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow && window.innerWidth > 768) {
    let glowX = 0, glowY = 0, currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
        glowX = e.clientX;
        glowY = e.clientY;
    });

    function animateGlow() {
        currentX += (glowX - currentX) * 0.1;
        currentY += (glowY - currentY) * 0.1;
        cursorGlow.style.left = currentX + 'px';
        cursorGlow.style.top = currentY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
}

// ===== MAGNETIC DOCK =====
const dock = document.getElementById('mainDock');
const dockIcons = dock.querySelectorAll('.dock-icon');

dock.addEventListener('mousemove', (e) => {
    dockIcons.forEach(icon => {
        const rect = icon.getBoundingClientRect();
        const iconCenterX = rect.left + rect.width / 2;
        const distance = Math.abs(e.clientX - iconCenterX);
        const maxDistance = 120;

        if (distance < maxDistance) {
            const scale = 1 + 0.35 * (1 - distance / maxDistance);
            const translateY = -8 * (1 - distance / maxDistance);
            icon.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        } else {
            icon.style.transform = 'scale(1) translateY(0)';
        }
    });
});

dock.addEventListener('mouseleave', () => {
    dockIcons.forEach(icon => {
        icon.style.transform = 'scale(1) translateY(0)';
    });
});

// ===== HERO CHARACTER PARALLAX =====
const heroCharacters = document.querySelectorAll('.hero-character');
if (heroCharacters.length > 0 && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        heroCharacters.forEach((char, i) => {
            const speed = 0.03 + (i * 0.015);
            char.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }, { passive: true });
}
