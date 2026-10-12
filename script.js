function showToast(msg) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.className = 'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#323054] text-white font-bold text-xs md:text-sm border border-white/20 shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-all duration-300 transform translate-y-10 opacity-0 flex items-center gap-2 pointer-events-none';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fas fa-circle-check text-emerald-400 text-base"></i> <span>${msg}</span>`;
    toast.classList.remove('translate-y-10', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-10', 'opacity-0');
    }, 2500);
}

function copyUsername(btn) {
    const handle = 'karthikparambil9@gmail.com';
    navigator.clipboard.writeText(handle).then(() => {
        showToast('Email copied to clipboard!');
    }).catch(() => {
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = handle;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        showToast('Email copied to clipboard!');
    });

    const icon = document.getElementById('copy-icon');
    const text = document.getElementById('copy-text');
    if (icon) icon.className = 'fas fa-check text-sm text-green-600';
    if (text) text.textContent = 'Copied!';
    setTimeout(() => {
        if (icon) icon.className = 'fas fa-copy text-sm text-[#5E5B86]';
        if (text) text.textContent = 'Copy handle';
    }, 2000);
}

function shareProfile() {
    const shareData = {
        title: 'Karthik P - Cybersecurity Researcher & Jr. Penetration Tester',
        text: 'Check out the cybersecurity research and penetration testing portfolio of Karthik P!',
        url: window.location.href
    };

    const iconElement = document.getElementById('share-icon');

    if (navigator.share) {
        navigator.share(shareData).catch((err) => {
            if (err.name !== 'AbortError') {
                copyLinkFallback(iconElement);
            }
        });
    } else {
        copyLinkFallback(iconElement);
    }
}

function copyLinkFallback(iconElement) {
    const shareUrl = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(showSuccessFeedback).catch(() => legacyCopy(shareUrl));
    } else {
        legacyCopy(shareUrl);
    }

    function showSuccessFeedback() {
        showToast('Link copied to clipboard!');
        if (!iconElement) return;
        const originalClass = iconElement.className;
        iconElement.className = 'fas fa-check text-green-600';
        setTimeout(() => {
            iconElement.className = originalClass;
        }, 2000);
    }

    function legacyCopy(text) {
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        showSuccessFeedback();
    }
}

let isMp3Sound = false;
let lastTouchToggleTime = 0;

function toggleRocketSound() {
    isMp3Sound = !isMp3Sound;
    showToast(isMp3Sound ? 'Sound: MP3' : 'Sound: JS');
}

const rocket = document.getElementById('rocket');
let startY = 0;
let startX = 0;
let lastTapTime = 0;

if (rocket) {
    rocket.addEventListener('dblclick', (e) => {
        e.preventDefault();
        if (Date.now() - lastTouchToggleTime < 600) return;
        toggleRocketSound();
    });

    rocket.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length > 0) {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        }
        getAudioContext();
    }, { passive: true });

    rocket.addEventListener('touchend', (e) => {
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        const endY = e.changedTouches[0].clientY;
        const endX = e.changedTouches[0].clientX;
        const deltaY = startY - endY;
        const deltaX = Math.abs(startX - endX);
        const now = Date.now();
        const tapLength = now - lastTapTime;

        if (deltaY > 30 && deltaY > deltaX) {
            launchRocket();
            lastTapTime = 0;
        } else {
            if (tapLength > 0 && tapLength < 500) {
                lastTouchToggleTime = now;
                toggleRocketSound();
                lastTapTime = 0;
            } else {
                lastTapTime = now;
            }
        }
    });

    rocket.addEventListener('mousedown', (e) => {
        startY = e.clientY;
        getAudioContext();
    });

    rocket.addEventListener('mouseup', (e) => {
        let endY = e.clientY;
        if (startY - endY > 40) {
            launchRocket();
        }
    });
}

const mp3AudioElement = new Audio('assets/Weeee Sound .mp3');
mp3AudioElement.preload = 'auto';
let mp3AudioBuffer = null;


let globalAudioCtx = null;

function getAudioContext() {
    if (!globalAudioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
            globalAudioCtx = new AudioCtx();
        }
    }
    if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
        globalAudioCtx.resume();
    }
    return globalAudioCtx;
}

fetch('assets/Weeee Sound .mp3')
    .then(res => res.arrayBuffer())
    .then(data => {
        const ctx = getAudioContext();
        if (ctx) {
            return ctx.decodeAudioData(data);
        }
    })
    .then(buffer => {
        if (buffer) mp3AudioBuffer = buffer;
    })
    .catch(err => {
        console.log('Preloading MP3 buffer failed:', err);
    });

function unlockMobileAudio() {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
        ctx.resume();
    }
}

document.addEventListener('touchstart', unlockMobileAudio, { passive: true });
document.addEventListener('touchend', unlockMobileAudio, { passive: true });
document.addEventListener('pointerdown', unlockMobileAudio, { passive: true });
document.addEventListener('click', unlockMobileAudio, { passive: true });

function playLaunchSound() {
    if (isMp3Sound) {
        playMp3Sound();
    } else {
        playSynthesizedSound();
    }
}

function playMp3Sound() {
    const ctx = getAudioContext();
    if (ctx && mp3AudioBuffer) {
        try {
            const source = ctx.createBufferSource();
            source.buffer = mp3AudioBuffer;
            source.connect(ctx.destination);
            source.start(0);
            return;
        } catch (e) {
            console.log('Web Audio MP3 play failed, falling back to Audio element:', e);
        }
    }

    try {
        mp3AudioElement.currentTime = 0;
        mp3AudioElement.play().catch((err) => {
            console.log('MP3 element play failed:', err);
            playSynthesizedSound();
        });
    } catch (e) {
        playSynthesizedSound();
    }
}

function playSynthesizedSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();

        const bufferSize = ctx.sampleRate * 1.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(50, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.3);
        filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.2);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        noise.start();
    } catch (e) {
        console.log("Web Audio API not supported or blocked by browser.", e);
    }
}

function launchRocket() {
    if (!rocket) return;
    if (rocket.classList.contains('fly-away-active') || rocket.classList.contains('rocket-arrive-active')) return;

    playLaunchSound();

    rocket.classList.remove('float-animation-delayed');
    rocket.classList.add('fly-away-active');

    setTimeout(() => {
        rocket.classList.remove('fly-away-active');
        rocket.classList.add('rocket-arrive-active');

        setTimeout(() => {
            rocket.classList.remove('rocket-arrive-active');
            rocket.classList.add('float-animation-delayed');
        }, 1000);

    }, 1200);
}

// Toggle Hero Bio More/Less
function toggleHeroBio() {
    const shortEl = document.getElementById('bio-short');
    const fullEl = document.getElementById('bio-full');
    const toggleBtn = document.getElementById('bio-toggle');
    if (!shortEl || !fullEl || !toggleBtn) return;

    if (fullEl.classList.contains('hidden')) {
        shortEl.classList.add('hidden');
        fullEl.classList.remove('hidden');
        toggleBtn.textContent = 'Less';
    } else {
        fullEl.classList.add('hidden');
        shortEl.classList.remove('hidden');
        toggleBtn.textContent = 'More';
    }
}


