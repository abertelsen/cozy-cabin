(() => {
  // Audio controls
  const btn = document.getElementById('play');
  const vol = document.getElementById('volume');
  const music = new LofiMusic();
  music.setVolume(vol.value);
  vol.addEventListener('input', () => music.setVolume(vol.value));
  let userPaused = false;
  const showPlaying = () => {
    btn.textContent = '\u275A\u275A'; btn.setAttribute('aria-label', 'Pause music');
  };
  const showPaused = () => {
    btn.textContent = '\u25B6'; btn.setAttribute('aria-label', 'Play music');
  };
  async function start() {
    if (userPaused || music.playing) return;
    await music.play();
    if (!userPaused) showPlaying();
  }
  btn.addEventListener('click', async () => {
    if (music.playing) {
      userPaused = true;
      music.pause();
      showPaused();
    } else {
      userPaused = false;
      await music.play();
      showPlaying();
    }
  });

  // Autoplay: try immediately; browsers may block it until the first user gesture.
  start().catch(() => {});
  const events = ['pointerdown', 'keydown', 'touchstart'];
  const onGesture = (e) => {
    if (e.target === btn) { cleanup(); return; }
    start().catch(() => {});
    cleanup();
  };
  const cleanup = () => events.forEach((ev) => window.removeEventListener(ev, onGesture, true));
  events.forEach((ev) => window.addEventListener(ev, onGesture, true));
})();
