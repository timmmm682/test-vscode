const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let time = 0;
const mouse = { x: undefined, y: undefined };

// Custom Cursor
const cursor = document.querySelector('.cursor');
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
    if (cursor) {
        cursor.style.left = e.x + 'px';
        cursor.style.top = e.y + 'px';
    }
});

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    init();
}

window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        
        // Speed depends on page
        const isExperiencePage = window.location.pathname.includes('experience.html');
        const speedMultiplier = isExperiencePage ? 3 : 1;
        
        this.speedX = (Math.random() * 2 - 1) * speedMultiplier;
        this.speedY = (Math.random() * 2 - 1) * speedMultiplier;
        this.baseHue = Math.random() * 60 + 260; 
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Interaction with mouse
        if (mouse.x !== undefined && mouse.y !== undefined) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) {
                this.x -= dx * 0.02;
                this.y -= dy * 0.02;
            }
        }

        if (this.x > width) this.x = 0;
        else if (this.x < 0) this.x = width;

        if (this.y > height) this.y = 0;
        else if (this.y < 0) this.y = height;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const currentHue = (this.baseHue + time * 20) % 360;
        ctx.fillStyle = `hsl(${currentHue}, 100%, 70%)`;
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = ctx.fillStyle;
    }
}

function init() {
    particles = [];
    const numParticles = Math.floor((width * height) / 9000);
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}

function connect() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                let opacity = 1 - (distance / 150);
                const connectionHue = (time * 50) % 360;
                ctx.strokeStyle = `hsla(${connectionHue}, 100%, 50%, ${opacity * 0.2})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.fillStyle = 'rgba(5, 0, 20, 0.15)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    
    ctx.shadowBlur = 0;
    connect();

    time += 0.01;
    requestAnimationFrame(animate);
}

animate();

// Form Handling (Submitting is just visual for this test)
const form = document.querySelector('.neon-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        btn.textContent = 'TRANSMITTED';
        btn.style.background = 'var(--neon-magenta)';
        btn.style.borderColor = 'var(--neon-magenta)';
        btn.style.color = '#fff';
        form.reset();
    });
}