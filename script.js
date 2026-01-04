const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let width, height, field;
let particles = [];
const particleCount = 2500; // Jumlah gila untuk performa tinggi

class Particle {
    constructor(x, y) {
        this.pos = { x, y };
        this.vel = { x: 0, y: 0 };
        this.acc = { x: 0, y: 0 };
        this.maxSpeed = 2;
        this.h = Math.random() * 360;
    }

    update() {
        // Algoritma Flow Field berdasarkan Perlin Noise (Simulasi)
        let angle = (Math.sin(this.pos.x * 0.005) + Math.cos(this.pos.y * 0.005)) * Math.PI * 2;
        this.acc.x = Math.cos(angle) * 0.1;
        this.acc.y = Math.sin(angle) * 0.1;

        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;
        
        // Limit speed
        const speed = Math.sqrt(this.vel.x**2 + this.vel.y**2);
        if (speed > this.maxSpeed) {
            this.vel.x = (this.vel.x / speed) * this.maxSpeed;
            this.vel.y = (this.vel.y / speed) * this.maxSpeed;
        }

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        if (this.pos.x > width) this.pos.x = 0;
        if (this.pos.x < 0) this.pos.x = width;
        if (this.pos.y > height) this.pos.y = 0;
        if (this.pos.y < 0) this.pos.y = height;
    }

    draw() {
        // Dinamika warna berdasarkan waktu & posisi (Realtime jam)
        const hour = new Date().getHours();
        ctx.strokeStyle = `hsla(${(this.h + hour * 10) % 360}, 80%, 50%, 0.15)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(this.pos.x - this.vel.x * 5, this.pos.y - this.vel.y * 5);
        ctx.stroke();
    }
}

function setup() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(Math.random() * width, Math.random() * height));
    }
    ctx.backgroundColor = 'black';
    ctx.fillRect(0, 0, width, height);
}

function animate() {
    // Memberikan efek "Ghosting" alam semesta
    ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
    ctx.fillRect(0, 0, width, height);

    // Update UI Stats
    document.getElementById('coord').innerText = 
        `${Math.floor(particles[0].pos.x)}, ${Math.floor(particles[0].pos.y)}, ${new Date().getMilliseconds()}`;

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

window.addEventListener('resize', setup);
setup();
animate();
