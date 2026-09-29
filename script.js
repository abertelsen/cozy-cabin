(() => {
  // String lights
  const lights = document.getElementById('lights');
  const colors = ['#ff5a5a', '#ffd04a', '#5adf8a', '#5ab0ff'];
  const NS = 'http://www.w3.org/2000/svg';
  for (let i = 0; i < 24; i++) {
    const x = 30 + i * 66;
    // approximate the sagging curve
    const y = 40 + Math.abs(Math.sin((x / 400) * Math.PI)) * 32 + 4;
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 7);
    c.setAttribute('fill', colors[i % colors.length]);
    c.style.animationDelay = (-Math.random() * 2.4) + 's';
    lights.appendChild(c);
  }

  // Snowfall
  const canvas = document.getElementById('snow');
  const ctx = canvas.getContext('2d');
  const flakes = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2.2 + 0.6,
    v: Math.random() * 0.8 + 0.4,
    p: Math.random() * Math.PI * 2,
  }));
  function snow(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    for (const f of flakes) {
      f.y += f.v;
      f.x += Math.sin(t / 900 + f.p) * 0.4;
      if (f.y > canvas.height) { f.y = -5; f.x = Math.random() * canvas.width; }
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
    }
    requestAnimationFrame(snow);
  }
  requestAnimationFrame(snow);

  // Audio controls
  const btn = document.getElementById('play');
  const vol = document.getElementById('volume');
  const music = new LofiMusic();
  music.setVolume(vol.value);
  vol.addEventListener('input', () => music.setVolume(vol.value));
  btn.addEventListener('click', async () => {
    if (music.playing) {
      music.pause();
      btn.textContent = '▶'; btn.setAttribute('aria-label', 'Play music');
    } else {
      await music.play();
      btn.textContent = '❚❚'; btn.setAttribute('aria-label', 'Pause music');
    }
  });
})();
