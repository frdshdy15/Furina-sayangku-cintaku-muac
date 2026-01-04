const player = {
    name: localStorage.getItem('d_name') || "",
    lastTarget: ""
};

// --- LOGIKA LOGIN ---
function joinWorld() {
    const input = document.getElementById('playerName');
    const name = input.value.trim();

    if (name) {
        player.name = name;
        localStorage.setItem('d_name', name);
        
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('world').classList.add('active');
        document.getElementById('user-display').innerText = name;
    } else {
        alert("Isi nama dulu mang!");
    }
}

// Pasang event klik & enter sekaligus
document.getElementById('entryBtn').addEventListener('click', joinWorld);
document.getElementById('playerName').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') joinWorld();
});

// --- LOGIKA CHAT ---
function openChat(npc) {
    const box = document.getElementById('chat-box');
    box.style.display = 'flex';
    document.getElementById('chat-with').innerText = npc.toUpperCase();
    
    if (npc === 'daus' && player.lastTarget && player.lastTarget !== 'daus') {
        renderMsg('ai', `Bau-bau si ${player.lastTarget} nih... selingkuh ya lu?`);
    }
    player.lastTarget = npc;
}

function closeChat() {
    document.getElementById('chat-box').style.display = 'none';
}

function sendChat() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    renderMsg('user', text);
    input.value = '';

    setTimeout(() => {
        if (/(anjing|babi|goblok)/i.test(text)) {
            document.getElementById('fx-kiss').classList.remove('hidden');
            setTimeout(() => document.getElementById('fx-kiss').classList.add('hidden'), 1000);
            renderMsg('ai', "💋 Muach! Kasar amat mulutnya.");
        } else {
            renderMsg('ai', "Bener banget mang, saya setuju!");
        }
    }, 700);
}

function renderMsg(type, text) {
    const body = document.getElementById('chat-body');
    const div = document.createElement('div');
    div.className = `bubble ${type}`;
    div.innerText = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
}

document.getElementById('sendBtn').onclick = sendChat;
document.getElementById('chatInput').onkeypress = (e) => e.key === 'Enter' && sendChat();

// Chaos Event (Simpel & Gak Berat)
setInterval(() => {
    if (Math.random() > 0.8 && document.getElementById('world').classList.contains('active')) {
        console.log("BOOM!"); // Tambahin efek visual kalau mau
    }
}, 10000);
