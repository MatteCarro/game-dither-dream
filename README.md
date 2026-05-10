<div align="center">

<img src="https://img.shields.io/badge/status-alpha-orange?style=for-the-badge" alt="Status: Alpha" />

# 🎮 Dither Forge

### Retro Pixel Dithering Studio

*A desktop editor for authentic retro dithering — pixel art, halftone, CRT monitors and 80s/90s console aesthetics.*

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Photoshop](https://img.shields.io/badge/Adobe%20UXP-31A8FF?style=for-the-badge&logo=adobephotoshop&logoColor=white)

![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Version](https://img.shields.io/badge/version-0.1.0--alpha-blue?style=flat-square)
![Platform](https://img.shields.io/badge/platform-web%20%7C%20photoshop-lightgrey?style=flat-square)

</div>

---

## ✨ Overview

**Dither Forge** is an editor dedicated to **dithering** — the image-processing technique that reduces a picture's color palette while creating the iconic textures of retro digital aesthetics: 80s/90s computers and consoles, offset print, phosphor monitors.

Built in two phases:
- **Phase A** — standalone browser-based sandbox (zero toolchain, pure HTML + JS)
- **Phase B** — Photoshop UXP plugin port

---

## 🚀 Features

### 🎨 Dither Algorithms
Classic, professional-grade algorithms ready to use:
- **Error Diffusion** — Floyd–Steinberg, Stucki, Sierra, Atkinson, Burkes
- **Ordered** — Bayer 2×2 / 4×4 / 8×8, Halftone, Threshold
- **Custom** — build your own with the integrated Algorithm Lab

### 🌈 Palette Library
Historical palettes from real hardware:
- **Consoles** — Game Boy (DMG), NES, Sega Master System, Atari 2600, Neo Geo, PICO-8
- **Computers** — C64, Amiga OCS, Apple II, ZX Spectrum, MS-DOS CGA, VGA, Macintosh 1-bit / 4-bit, Atari ST, MSX, BBC Micro, TRS-80
- **Arcade & Display** — EGA, NTSC / PAL Broadcast, Trinitron, TV Composite, CRT Phosphor Green, CRT Amber, Plasma Burn

### 🛠️ Workspace Tools
- **Editor** — single-image dithering with real-time preview
- **Batch Processor** — apply presets to multiple images at once
- **Gallery** — browse and manage processed outputs
- **Compare** — side-by-side comparison between algorithms
- **CRT Preview** — simulate rendering on vintage monitors (scanlines, glow, curvature, analog drift)
- **Export** — multiple formats and resolutions

### 🧪 Algorithm Lab
Fine-tune every aspect of your dither:
- `Pattern Size` · `Threshold Bias` · `Diffusion Amount`
- **Expert mode**: `Diffusion Weight` · `Tonal Protection` · `Edge Preservation` · `Grain Shaping`

### 🌐 DitherVerse *(coming soon)*
Community space to discover, search and share community-made presets:
- **PulseDeck** — Tinder-style preset discovery
- **Color Search** — find presets by dominant color
- **Algorithm Search** — find presets compatible with your favorite algorithm

---

## 🖼️ Preview

> *Screenshots coming soon — the alpha is in active development.*

---

## 🏗️ Project Structure

```
dither-forge/
├── src/
│   ├── core/              # Pure dithering engine (portable)
│   │   ├── algorithms/    # Floyd-Steinberg, Bayer, Atkinson, ...
│   │   ├── palettes/      # Historical palette definitions
│   │   └── pipeline/      # Image processing pipeline
│   └── ui/                # UI layer (browser / UXP)
│       ├── components/
│       └── views/
├── assets/
└── docs/
```

The clean `core/` ↔ `ui/` separation keeps the dithering engine portable between the browser sandbox and the Photoshop UXP target.

---

## 🚦 Getting Started

### Phase A — Browser Sandbox

No build step required.

```bash
# Clone the repo
git clone https://github.com/MatteCarro/game-dither-dream.git
cd game-dither-dream

# Serve locally (any static server works)
python3 -m http.server 8080
# or
npx serve .
```

Open `http://localhost:8080` in your browser.

### Phase B — Photoshop UXP Plugin

*Coming soon — see [`docs/uxp.md`](docs/uxp.md) for the porting plan.*

---

## 🗺️ Roadmap

- [x] Core dithering engine (Phase A)
- [x] Palette library (30+ historical palettes)
- [x] Algorithm Lab with expert controls
- [x] Batch processor
- [x] CRT preview
- [ ] Real drag gestures in PulseDeck
- [ ] User profiles + community blueprint import
- [ ] Photoshop UXP port (Phase B)
- [ ] Animation / GIF support
- [ ] Plugin SDK for custom algorithms

---

## 🤝 Contributing

This project is in **alpha** and the API is unstable. Bug reports, palette suggestions and feedback on the UX are very welcome — open an [issue](https://github.com/MatteCarro/game-dither-dream/issues) or a discussion.

---

## 📄 License

[MIT](LICENSE) © Matteo Carrozzino

---

<div align="center">

**Made with ☕ and a lot of pixels**

[Report Bug](https://github.com/MatteCarro/game-dither-dream/issues) · [Request Feature](https://github.com/MatteCarro/game-dither-dream/issues) · [Discussions](https://github.com/MatteCarro/game-dither-dream/discussions)

</div>
