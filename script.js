const year = document.getElementById("year");
const bomb = document.getElementById("bomb");

const bombSound = document.getElementById("bombSound");
const fireworkSound = document.getElementById("fireworkSound");

const muteBtn = document.getElementById("muteBtn");
const shareBtn = document.getElementById("shareBtn");

let isMuted = false;
let exploded = false;

/* 🔇 Mute */
muteBtn.onclick = () => {
  isMuted = !isMuted;
  bombSound.muted = isMuted;
  fireworkSound.muted = isMuted;
  muteBtn.innerText = isMuted ? "🔇" : "🔊";
};

/* 📤 Share */
shareBtn.onclick = () => {
  if (navigator.share) {
    navigator.share({
      title: "Happy New Year 2026 🎆",
      text: "Tap 2025 💣 to explode and welcome 2026 🎉",
      url: window.location.href
    });
  }
};

/* 💣 Interaction */
document.querySelector(".container").onclick = () => {
  if (exploded) return;
  exploded = true;

  bomb.style.display = "block";

  if (!isMuted) {
    bombSound.currentTime = 0;
    bombSound.play().catch(() => {});
  }

  if (navigator.vibrate) navigator.vibrate([200,100,200]);

  setTimeout(() => {
    bomb.classList.add("explosion");
    year.style.opacity = "0";
  }, 1000);

  setTimeout(() => {
    bomb.style.display = "none";
    year.innerText = "Happy New Year 2026 🎉✨";
    year.innerHTML = year.innerHTML.replace("2026", "<span class='highlight'>2026</span>");
    year.style.opacity = "1";
    year.classList.add("glow");

    if (!isMuted) {
      fireworkSound.currentTime = 0;
      fireworkSound.play().catch(() => {});
    }

    startFireworks();
  }, 2000);
};

/* 🎇 FIREWORKS CANVAS */
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.onresize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createFirework() {
  const x = random(0, canvas.width);
  const y = random(0, canvas.height / 2);
  const particles = [];

  for (let i = 0; i < 50; i++) {
    particles.push({
      x, y,
      angle: random(0, Math.PI * 2),
      speed: random(2, 6),
      radius: random(2, 3),
      life: 100
    });
  }
  return particles;
}

let fireworks = [];

function startFireworks() {
  setInterval(() => {
    fireworks.push(createFirework());
  }, 800);
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach((fw, index) => {
    fw.forEach(p => {
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      p.life--;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = "gold";
      ctx.fill();
    });

    fireworks[index] = fw.filter(p => p.life > 0);
  });

  requestAnimationFrame(animate);
}

animate();

/* ⏳ Countdown */
let count = 5;
year.innerText = count;
const timer = setInterval(() => {
  count--;
  year.innerText = count > 0 ? count : "2025";
  if (count === 0) clearInterval(timer);
}, 1000);