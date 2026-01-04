"use strict";

const STATE = {
    player: localStorage.getItem('daus_player') || "",
    trust: parseInt(localStorage.getItem('daus_trust')) || 50,
    lastNPC: localStorage.getItem('daus_last_npc') || "",
    history: JSON.parse(localStorage.getItem('daus_history')) || { daus:[], ayam:[], buaya:[], pohon:[], ember:[] }
};

const BRAIN = {
    daus: ["Idup itu kayak rante motor, kalo kering ya berisik.", "Lu tau gak kenapa donat bolong? Kalo gak bolong namanya bakwan.", "Tadi ada pesawat lewat, bau knalpotnya kayak mendoan."],
    ayam: ["Petok! (Dia nanya: lu punya beras gak?)", "Petoook! (Katanya: Daus mah jomblo abadi)"],
    buaya: ["Kamu beda deh hari ini, lebih silau...", "Aku gak selingkuh, aku cuma ramah ke semua orang."],
    pohon: ["Akar gue pegel lur...", "Jangan kencing di sini, ntar lu bintitan."],
    ember: ["Hati gue bocor...", "Byur! Seger bener idup."]
};

window.onload = () => {
    if (STATE.player) masukDunia(STATE.player);
    document.getElementById('btnMulai').onclick = () => masukDunia(document.getElementById('inputNama').value);
    document.getElementById('btnGas').onclick = handleChat;
    document.getElementById('msgInput').onkeydown = (e) => e.key === 'Enter' && handleChat();
    setInterval(chaosMode, 15000);
};

function masukDunia(nama) {
    if (!nama) return alert("Isi nama dulu!");
    STATE.player = nama;
    localStorage.setItem('daus_player', nama);
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');
    document.getElementById('display-nama').textContent = nama;
    document.getElementById('display-trust').textContent = STATE.trust;
}

function bukaObrolan(npc) {
    document.getElementById('floating-chat').classList.remove('hidden');
    document.getElementById('target-info').textContent = npc.toUpperCase();
    
    if (npc === 'daus' && STATE.lastNPC && STATE.lastNPC !== 'daus') {
        renderMsg('ai', `Bau bau si ${STATE.lastNPC} nih... abis dari sana ya lu?`, 'daus');
    }
    STATE.lastNPC = npc;
    localStorage.setItem('daus_last_npc', npc);
    loadHistory(npc);
}

function tutupObrolan() { document.getElementById('floating-chat').classList.add('hidden'); }

function handleChat() {
    const input = document.getElementById('msgInput');
    const npc = document.getElementById('target-info').textContent.toLowerCase();
    const txt = input.value.trim();
    if (!txt) return;

    renderMsg('user', txt, npc);
    input.value = '';

    setTimeout(() => {
        if (/(anjing|babi|goblok|tolol|bangsat|kontol)/i.test(txt)) {
            triggerKiss();
            renderMsg('ai', "Cup! 💋 Muach! Kasar amat sih sayang...", npc);
        } else {
            const reply = npc === 'daus' ? BRAIN.daus[Math.floor(Math.random()*BRAIN.daus.length)] : BRAIN[npc][0];
            renderMsg('ai', reply, npc);
        }
    }, 1000);
}

function renderMsg(type, text, npc) {
    const box = document.getElementById('chat-content');
    const div = document.createElement('div');
    div.className = `bubble ${type}`;
    div.textContent = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    STATE.history[npc].push({type, text});
    localStorage.setItem('daus_history', JSON.stringify(STATE.history));
}

function loadHistory(npc) {
    const box = document.getElementById('chat-content');
    box.innerHTML = '';
    STATE.history[npc].forEach(m => {
        const div = document.createElement('div');
        div.className = `bubble ${m.type}`;
        div.textContent = m.text;
        box.appendChild(div);
    });
}

function triggerKiss() {
    const fx = document.getElementById('kiss-overlay');
    fx.classList.remove('hidden');
    setTimeout(() => fx.classList.add('hidden'), 1000);
}

function chaosMode() {
    const rand = Math.random();
    if (rand > 0.7) {
        const boom = document.createElement('div');
        boom.className = 'explosion';
        boom.textContent = '💥';
        boom.style.left = Math.random() * 80 + '%';
        boom.style.bottom = '10%';
        document.getElementById('kejadian-darat').appendChild(boom);
        setTimeout(() => boom.remove(), 1000);
        if(!document.getElementById('floating-chat').classList.contains('hidden')) renderMsg('ai', "WADUH APAAN TUH MELEDAK?!", STATE.lastNPC);
    }
}
