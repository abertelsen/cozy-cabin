# Cozy Winter Cabin

A static, full-screen image of a cozy winter cabin interior (`assets/magnific_the-interior-of-a-cozy-ca_p85ufTZehw.png`) with generative chillout music. The music tries to autoplay on load; if the browser blocks it, it starts on the first click, key press or touch. Audio controls: play/pause and volume.

Pure static site (HTML/CSS/JS). The only asset is the background image; music is synthesized in the browser with the Web Audio API, so there are no audio files.

## Run locally
Open `index.html` in a browser, or run `python -m http.server`.

## Deploy to GitHub Pages
1. Create a GitHub repository and push this folder to the `main` branch.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. The workflow in `.github/workflows/pages.yml` publishes the site on every push.
