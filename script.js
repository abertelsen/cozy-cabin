(() => {
  // Audio controls
  const btn = document.getElementById('play');
  const vol = document.getElementById('volume');
  const music = new LofiMusic();
  music.setVolume(vol.value);
  vol.addEventListener('input', () => music.setVolume(vol.value));
  btn.addEventListener('click', async () => {
    if (music.playing) {
      music.pause();
      btn.textContent = '\u25B6'; btn.setAttribute('aria-label', 'Play music');
    } else {
      await music.play();
      btn.textContent = '\u275A\u275A'; btn.setAttribute('aria-label', 'Pause music');
    }
  });
})();
