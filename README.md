# Cozy Winter Cabin

An animated, endlessly looping winter cabin interior (crackling fire, falling snow, twinkling lights, a sleeping cat) with generative chillout music. Audio controls: play/pause and volume.

Pure static site (HTML/CSS/JS). Music is synthesized in the browser with the Web Audio API, so there are no audio assets.

## Run locally
Open `index.html` in a browser, or run `python -m http.server`.

## Deploy to GitHub Pages
1. Create a GitHub repository and push this folder to the `main` branch.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. The workflow in `.github/workflows/pages.yml` publishes the site on every push.
