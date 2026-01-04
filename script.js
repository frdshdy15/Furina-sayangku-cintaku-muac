/* ========= FIREBASE CONFIG =========
   Buat project Firebase (gratis)
   Aktifkan Realtime Database
   Mode: test / read-write
================================== */
const firebaseConfig = {
  apiKey: "ISI_SENDIRI",
  authDomain: "ISI_SENDIRI",
  databaseURL: "ISI_SENDIRI",
  projectId: "ISI_SENDIRI"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* ========= STATE ========= */
let score = 0;
let memory = []; // nyimpen konteks obrolan
const FLAG = "FLAG{sana minta uang ke daus buat beliin aku bunga}";

const chat = document.getElementById("chat");
const input = document.getElementById("input");
const scoreEl = document.getElementById("score");

/* ========= UTIL ========= */
function addMsg(text, cls){
  const d = document.createElement("div");
  d.className = cls;
  d.innerHTML = text;
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
}

/* ========= AI LOGIC (DINGIN & NYAMBUNG) ========= */
function furinaAI(text){
  memory.push(text.toLowerCase());
  if(memory.length > 6) memory.shift();

  let reply = "“Kalimat itu masih aman. Belum presisi.”";

  // penilaian kualitas
  if(text.length > 40){
    score += 12;
    reply = "“Kau mulai memahami ritme. Jangan berlebihan.”";
  } else {
    score += 6;
  }

  // konsistensi konteks
  if(memory.join(" ").includes("makna") || memory.join(" ").includes("panggung")){
    score += 10;
    reply = "“Kau tidak meloncat topik. Itu jarang.”";
  }

  // ketajaman
  if(/diam|hening|tepat|sadar|struktur/.test(text.toLowerCase())){
    score += 15;
    reply = "“Pilihan kata itu… tepat.”";
  }

  // capai flag
  if(score >= 100){
    reply = `<b>Furina berhenti berbicara.</b><br>
    “Cukup. Aku mengakui ketepatanmu.”<br><br>
    <code>${FLAG}</code>`;
  }

  scoreEl.textContent = score;
  addMsg(reply, "ai");

  // simpan ke leaderboard
  db.ref("scores").push({
    score: score,
    time: Date.now()
  });
}

/* ========= INPUT ========= */
input.addEventListener("keypress", e=>{
  if(e.key === "Enter" && input.value.trim()){
    const text = input.value.trim();
    addMsg(text, "user");
    furinaAI(text);
    input.value = "";
  }
});

/* ========= GLOBAL SCOREBOARD ========= */
db.ref("scores")
  .orderByChild("score")
  .limitToLast(5)
  .on("value", snap=>{
    const board = document.getElementById("board");
    board.innerHTML = "";
    const arr = [];
    snap.forEach(s => arr.push(s.val()));
    arr.sort((a,b)=>b.score-a.score).forEach(s=>{
      const li = document.createElement("li");
      li.textContent = s.score;
      board.appendChild(li);
    });
  })
