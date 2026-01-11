const audio = document.getElementById('bg-music');
const musicIcon = document.getElementById('music-icon');
let isPlaying = false;
let truthsRevealed = 0;

function toggleMusic(forcePlay = false) {
    if (forcePlay || !isPlaying) {
        audio.play().then(() => {
            musicIcon.innerText = '🎵';
            isPlaying = true;
        }).catch(() => {});
    } else {
        audio.pause();
        musicIcon.innerText = '🔇';
        isPlaying = false;
    }
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });
    const target = document.getElementById(screenId);
    target.classList.remove('hidden');
    target.classList.add('active');
}

function startJourney() {
    toggleMusic(true);
    showScreen('screen-meter');
    runCutenessMeter();
}

// SPEED UP LOGIC: This function gets faster every stage
function runCutenessMeter() {
    let percentage = 0;
    let stage = 1;
    const display = document.getElementById('percentage-display');
    const progress = document.getElementById('progress-fill');
    const levelText = document.getElementById('level-text');
    const box = document.getElementById('shake-target');

    function update() {
        percentage += 2;
        if(percentage > 100) percentage = 100;
        display.innerText = (percentage + ((stage - 1) * 100)) + "%";
        progress.style.width = percentage + '%';

        if (percentage >= 100) {
            if (stage < 5) {
                stage++;
                percentage = 0;
                levelText.innerText = ["JUST A SIS", "VERY CUTE", "DANGEROUS", "MAXIMUM", "AUTHAI"][stage-1];
                
                clearInterval(meterInterval);
                
                // Acceleration: Level 1=40ms, Level 5=5ms
                let speeds = [0, 40, 25, 15, 8, 4]; 
                let currentSpeed = speeds[stage];
                
                if (stage === 5) {
                    box.classList.add('shake-intense');
                    document.getElementById('main-body').style.animation = "flashScreen 0.1s infinite";
                }
                meterInterval = setInterval(update, currentSpeed);
            } else {
                clearInterval(meterInterval);
                triggerExplosion();
            }
        }
    }
    let meterInterval = setInterval(update, 50);
}

function triggerExplosion() {
    document.getElementById('explosion-text').classList.remove('hidden');
    createConfetti(100);
    setTimeout(() => {
        document.getElementById('explosion-text').classList.add('hidden');
        document.getElementById('main-body').style.animation = "none";
        showScreen('screen-evolution');
    }, 4000);
}

function telepathy(choice) {
    const win = Math.floor(Math.random() * 4) + 1;
    const msg = document.getElementById('tele-msg');
    msg.style.opacity = "1";
    msg.innerText = (choice == win) ? "Telepathy confirmed. Best sister." : "Wrong! I was thinking of " + win;
    createConfetti(20);
    setTimeout(() => showScreen('quiz-1'), 2500);
}

function uniqueQuiz(screenId, message, nextScreenId) {
    const res = document.getElementById(`res-${screenId}`);
    const box = document.getElementById(`box-${screenId}`);
    res.innerText = message;
    box.classList.add('show');
    createConfetti(25);
    setTimeout(() => {
        box.classList.remove('show');
        showScreen(nextScreenId);
    }, 2800);
}

function revealTruth(orb, text) {
    if(orb.classList.contains('clicked')) return;
    orb.classList.add('clicked');
    orb.innerText = "❤️";
    document.getElementById('truth-display').innerText = text;
    truthsRevealed++;
    createConfetti(15);
    if(truthsRevealed === 5) {
        document.getElementById('truth-next').classList.remove('hidden');
        document.getElementById('truth-next').classList.add('pulse');
    }
}

function plantFlower(e) {
    const garden = document.getElementById('garden-area');
    const rect = garden.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    const f = document.createElement('div');
    f.style.position = 'absolute'; f.style.left = x + 'px'; f.style.top = y + 'px';
    f.innerText = Math.random() > 0.5 ? '💙' : '💗';
    f.style.fontSize = '28px'; f.style.transform = 'translate(-50%, -50%)';
    garden.appendChild(f);
}

function openEnvelope() { document.getElementById('envelope').classList.add('open'); }

function createParticle() {
    const container = document.getElementById('particle-container');
    if (container.childElementCount > 12) return; 
    const p = document.createElement('div');
    p.style.position = 'absolute';
    p.style.bottom = '-20px';
    p.innerText = Math.random() > 0.5 ? '💙' : '💗';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.opacity = '0.3';
    p.style.fontSize = '20px';
    let duration = (Math.random() * 4 + 4);
    p.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 0 },
        { opacity: 0.3, offset: 0.2 },
        { transform: `translateY(-110vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], { duration: duration * 1000, easing: 'linear' });
    container.appendChild(p);
    setTimeout(() => p.remove(), duration * 1000);
}
setInterval(createParticle, 800);

function createConfetti(count) {
    for (let i = 0; i < count; i++) {
        const c = document.createElement('div');
        c.style.position = 'fixed'; c.style.left = '50%'; c.style.top = '50%';
        c.style.width = '8px'; c.style.height = '8px';
        c.style.backgroundColor = Math.random() > 0.5 ? '#00d2ff' : '#ff007f';
        c.style.borderRadius = '2px';
        c.style.zIndex = '5000';
        document.body.appendChild(c);
        setTimeout(() => {
            c.style.transform = `translate(${(Math.random()-0.5)*600}px, ${(Math.random()-0.5)*600}px) rotate(720deg)`;
            c.style.opacity = '0'; c.style.transition = '1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }, 20);
        setTimeout(() => c.remove(), 1600);
    }
}

function restart() { location.reload(); }