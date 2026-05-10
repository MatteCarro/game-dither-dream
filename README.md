<div align="center">

```
██████╗ ██╗████████╗██╗  ██╗███████╗██████╗     ███████╗ ██████╗ ██████╗  ██████╗ ███████╗
██╔══██╗██║╚══██╔══╝██║  ██║██╔════╝██╔══██╗    ██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝
██║  ██║██║   ██║   ███████║█████╗  ██████╔╝    █████╗  ██║   ██║██████╔╝██║  ███╗█████╗  
██║  ██║██║   ██║   ██╔══██║██╔══╝  ██╔══██╗    ██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝  
██████╔╝██║   ██║   ██║  ██║███████╗██║  ██║    ██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗
╚═════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝    ╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
```

### **Retro Pixel Dithering Studio**

*Forge authentic retro aesthetics — pixel art, halftone, CRT phosphor, 8-bit consoles.*

<br />

[![Status](https://img.shields.io/badge/STATUS-ALPHA-FF6B35?style=for-the-badge&labelColor=1a1a1a)](https://github.com/MatteCarro/game-dither-dream)
[![Version](https://img.shields.io/badge/VERSION-0.1.0-F4D35E?style=for-the-badge&labelColor=1a1a1a)](https://github.com/MatteCarro/game-dither-dream/releases)
[![License](https://img.shields.io/badge/LICENSE-MIT-83C5BE?style=for-the-badge&labelColor=1a1a1a)](LICENSE)

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Canvas API](https://img.shields.io/badge/Canvas_API-FF6B6B?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

[**🎮 Demo**](#) · [**📖 Docs**](#-getting-started) · [**🐛 Report Bug**](https://github.com/MatteCarro/game-dither-dream/issues) · [**💡 Request Feature**](https://github.com/MatteCarro/game-dither-dream/issues)

---

</div>

## 🌟 What is Dither Forge?

**Dither Forge** is a creative editor built around **dithering** — the image-processing technique that reduces a picture's color palette while producing the iconic textures of retro digital aesthetics. From Game Boy greens to phosphor-glow CRT monitors, from offset-print halftones to demoscene-style ordered patterns, Dither Forge gives you the tools to recreate them all.

Whether you're a **pixel artist** chasing authenticity, a **designer** working on retro-themed branding, a **photographer** looking for analog-style processing, or an **indie game dev** preparing assets — this is your forge.

<br />

> [!NOTE]
> Dither Forge is in **active alpha development**. Features and APIs may change. Feedback and bug reports are extremely welcome.

---

## ⚡ Highlights

<table>
<tr>
<td width="33%" valign="top">

### 🎨 Real Algorithms
Floyd–Steinberg, Stucki, Sierra, Atkinson, Burkes, Bayer, Halftone, Threshold and more — each with fine-grained parameter controls.

</td>
<td width="33%" valign="top">

### 🎮 Authentic Palettes
30+ historical palettes from real hardware: Game Boy, NES, C64, Amiga, ZX Spectrum, EGA, CRT phosphor and more.

</td>
<td width="33%" valign="top">

### 🛠️ Pro Workflow
Batch processing, side-by-side comparison, CRT preview, custom algorithm builder, and gallery management.

</td>
</tr>
</table>

---

## 🚀 Features

### 🧬 Dithering Algorithms

<details open>
<summary><b>Error Diffusion</b></summary>

| Algorithm | Best for | Notes |
|-----------|----------|-------|
| **Floyd–Steinberg** | Photos, gradients | The classic — balanced detail and noise |
| **Stucki** | High-detail photography | Wider error spread, smoother result |
| **Sierra** | Soft photos | Gentle, creamy look |
| **Atkinson** | Pixel art, UI | Sharper, classic Mac aesthetic |
| **Burkes** | General purpose | Faster Stucki variant |

</details>

<details>
<summary><b>Ordered Dithering</b></summary>

| Algorithm | Best for | Notes |
|-----------|----------|-------|
| **Bayer 2×2 / 4×4 / 8×8** | Pixel art, demoscene | Predictable repeating pattern |
| **Halftone** | Print look, posterization | Newspaper / comic-book vibe |
| **Threshold** | Bitmap conversion | Pure black & white logic |

</details>

<details>
<summary><b>Custom Algorithms (Algorithm Lab)</b></summary>

Build your own dither by combining:
- `Pattern Size` · `Threshold Bias` · `Diffusion Amount`
- **Expert mode**: `Diffusion Weight` · `Tonal Protection` · `Edge Preservation` · `Grain Shaping`

</details>

<br />

### 🎨 Palette Library

<table>
<tr>
<td valign="top" width="50%">

**🕹️ Consoles**
- Game Boy (DMG) — *4 colors*
- NES — *4 colors*
- Sega Master System — *8 colors*
- Atari 2600 — *16 colors*
- Neo Geo — *16 colors*
- PICO-8 — *16 colors*

**💻 Computers**
- Commodore 64 — *16 colors*
- Amiga OCS — *16 colors*
- Apple II — *16 colors*
- ZX Spectrum — *15 colors*
- Macintosh 1-bit / 4-bit
- Atari ST · MSX · BBC Micro · TRS-80

</td>
<td valign="top" width="50%">

**🖥️ MS-DOS / PC**
- MS-DOS CGA — *4 colors*
- MS-DOS CGA Mode 0 — *4 colors*
- EGA — *16 colors*
- VGA 16 — *16 colors*

**📺 Display & Broadcast**
- NTSC Broadcast — *16 colors*
- PAL Broadcast — *16 colors*
- Trinitron — *10 colors*
- TV Composite — *8 colors*
- CRT Phosphor Green — *8 colors*
- CRT Amber — *8 colors*
- Plasma Burn — *8 colors*

</td>
</tr>
</table>

> All palettes are extracted from real hardware specifications, not approximations.

<br />

### 🛠️ Workspace

| Module | Purpose |
|--------|---------|
| 🖊️ **Editor** | Single-image dithering with real-time preview |
| 📚 **Batch Processor** | Apply presets to entire folders at once |
| 🖼️ **Gallery** | Browse and manage processed outputs |
| 🔀 **Compare** | Side-by-side comparison between algorithms |
| 📺 **CRT Preview** | Simulate vintage monitors — scanlines, glow, curvature, analog drift |
| 💾 **Export** | Multiple formats and resolutions |
| 🧪 **Algorithm Lab** | Design your own algorithms with expert controls |

<br />

### 🌐 DitherVerse — *Coming Soon*

A community space to discover, search and share community-made presets:

- 💫 **PulseDeck** — swipe-based preset discovery
- 🎨 **Color Search** — find presets by dominant color
- ⚙️ **Algorithm Search** — find presets compatible with your favorite algorithm

---

## 🖼️ Screenshots

> *Live screenshots coming soon — alpha is in active visual development.*

<!-- Once you have screenshots, drop them like this:
<div align="center">
  <img src="docs/screenshots/editor.png" width="80%" alt="Editor view" />
  <img src="docs/screenshots/algorithm-lab.png" width="80%" alt="Algorithm Lab" />
</div>
-->

---

## 🚦 Getting Started

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/MatteCarro/game-dither-dream.git
cd game-dither-dream

# 2. Open in your browser
# Option A — using Python's built-in server
python3 -m http.server 8080

# Option B — using Node's serve package
npx serve .

# Option C — just open index.html directly
```

Then visit **`http://localhost:8080`** and start dithering.

> [!TIP]
> No build step, no dependencies, no toolchain. Pure web standards — open the file and it just works.

---

## 🗺️ Roadmap

- [x] Core dithering engine
- [x] Palette library (30+ historical palettes)
- [x] Algorithm Lab with expert controls
- [x] Batch processor
- [x] CRT preview module
- [ ] Real drag gestures for PulseDeck
- [ ] User profiles + community preset sharing
- [ ] Animation / GIF dithering support
- [ ] Plugin SDK for custom algorithms
- [ ] Native desktop app (Tauri / Electron)

---

## 🤝 Contributing

Contributions, issue reports and palette suggestions are very welcome.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-palette`)
3. Commit your changes (`git commit -m 'Add Amiga AGA palette'`)
4. Push to the branch (`git push origin feature/amazing-palette`)
5. Open a Pull Request

For larger changes, please open an issue first to discuss what you'd like to change.

---

## 📜 Acknowledgments

- **Robert W. Floyd & Louis Steinberg** — for the 1976 paper that started it all
- **Bill Atkinson** — for the Atkinson dither (and a lot more)
- **The Lospec community** — for documenting historical palettes
- **PICO-8** by Lexaloffle — palette inspiration
- All retro hardware engineers who, decades ago, accidentally created an aesthetic

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

### Made with ☕ and a lot of pixels

**[⬆ back to top](#)**

<sub>Built by [@MatteCarro](https://github.com/MatteCarro) · 2026</sub>

</div>
