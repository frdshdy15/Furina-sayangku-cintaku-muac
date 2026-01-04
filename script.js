let namaUser = "";
let trust = 0;
let isEnding = false;

// 1. Start Game
function startGame() {
    const input = document.getElementById('input-nama');
    if (input.value.length < 2) return alert("Nama jangan dikosongin bos!");
    
    namaUser = input.value;
    document.getElementById('screen-welcome').classList.add('hidden');
    document.getElementById('screen-game').classList.remove('hidden');
    
    setTimeout(() => {
        appendChat(`Oi ${namaUser}! Akhirnya dateng juga. Jangan cuma diri disitu, masuk!`, 'daus');
    }, 800);
}

// 2. Update Jam & Mood
setInterval(() => {
    const now = new Date();
    document.getElementById('clock-display').innerText = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    
    const bg = document.getElementById('body-bg');
    const hr = now.getHours();
    if (hr >= 5 && hr < 11) bg.style.background = "var(--pagi)";
    else if (hr >= 11 && hr < 18) bg.style.background = "var(--siang)";
    else bg.style.background = "var(--malam)";
}, 1000);

// 3. Chat Logic
document.getElementById('btn-kirim').addEventListener('click', () => {
    const input = document.getElementById('user-input');
    const msg = input.value.trim();
    if (!msg) return;

    appendChat(msg, 'user');
    input.value = "";

    setTimeout(() => {
        const respon = hitungAI(msg);
        appendChat(respon, 'daus');
    }, 1000);
});

function hitungAI(msg) {
    const m = msg.toLowerCase();
    
    // Logic Trust
    if (m.includes("halo") || m.includes("apa kabar")) {
        trust += 10;
        return `Kabar baik, ${namaUser}. Tumben lu nanya kabar, biasanya langsung minta hotspot.`;
    }

    if (m.includes("daus ganteng") || m.includes("keren")) {
        trust += 20;
        return "Waduh, tau aja lu. Emang dari lahir sih.";
    }

    if (m.includes("mie ayam") || m.includes("duit")) {
        if (trust < 80) {
            trust -= 5;
            return "Duit mulu pikiran lu. Usaha dong!";
        } else {
            return "Karena lu udah gue anggep sodara, nih FLAG: 'minta uang ke daus buat beli mie ayam'. Gas beli!";
        }
    }

    // Absurd Event Trigger (15% chance)
    if (Math.random() < 0.15) {
        triggerAbsurd();
        return "EH BUSYET! Lu denger suara dentuman barusan gak??";
    }

    return "Terus? Cerita lagi lah.";
}

function triggerAbsurd() {
    const overlay = document.getElementById('absurd-overlay');
    const icons = ['🐊', '🍗', '💥', '🚲', '👻'];
    const pick = icons[Math.floor(Math.random() * icons.length)];
    
    const div = document.createElement('div');
    div.className = 'jump';
    div.innerText = pick;
    overlay.appendChild(div);

    // Getar HP (Haptic Feedback)
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    document.body.style.filter = "invert(1)";

    setTimeout(() => {
        div.remove();
        document.body.style.filter = "none";
    }, 1500);
}

function appendChat(txt, sender) {
    const box = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.className = `msg ${sender}`;
    div.innerText = txt;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}
