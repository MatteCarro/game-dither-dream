<div align="center">

<br />

<!-- LOGO / BANNER AREA -->
<img src="gif.gif" alt="Dither Forge" width="100%" />

<br />
<br />

# Dither Forge

**The complete dithering studio for retro pixel aesthetics.**

Floyd–Steinberg, Atkinson, Bayer, Halftone, Stevenson–Arce, Blue Noise — and 30+ historical hardware palettes from Game Boy to CRT phosphor. Built for pixel artists, designers, photographers and indie developers who care about authenticity.

<br />

<p align="center">
  <a href="https://github.com/MatteCarro/game-dither-dream/releases">
    <img src="https://img.shields.io/badge/STATUS-ALPHA-FF6B35?style=for-the-badge&labelColor=0d1117" alt="Status: Alpha" />
  </a>
  <a href="https://github.com/MatteCarro/game-dither-dream/releases">
    <img src="https://img.shields.io/badge/VERSION-0.1.0-F4D35E?style=for-the-badge&labelColor=0d1117" alt="Version 0.1.0" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/LICENSE-MIT-83C5BE?style=for-the-badge&labelColor=0d1117" alt="License: MIT" />
  </a>
</p>

<p align="center">
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" /></a>
  <a href="https://tanstack.com/start"><img src="https://img.shields.io/badge/TanStack_Start-FF4154?style=flat-square&logo=react-query&logoColor=white" alt="TanStack Start" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="https://bun.sh/"><img src="https://img.shields.io/badge/Bun-000000?style=flat-square&logo=bun&logoColor=white" alt="Bun" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://ui.shadcn.com/"><img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=flat-square&logo=shadcnui&logoColor=white" alt="shadcn/ui" /></a>
  <a href="https://workers.cloudflare.com/"><img src="https://img.shields.io/badge/Cloudflare_Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white" alt="Cloudflare Workers" /></a>
</p>

<p align="center">
  <a href="#getting-started"><b>Quick Start</b></a> ·
  <a href="#features"><b>Features</b></a> ·
  <a href="#tech-stack"><b>Tech Stack</b></a> ·
  <a href="#roadmap"><b>Roadmap</b></a> ·
  <a href="https://github.com/MatteCarro/game-dither-dream/issues"><b>Report Bug</b></a>
</p>

</div>

<br />

---

## Why Dither Forge?

Most online dithering tools give you three sliders and a "Floyd-Steinberg" button. **Dither Forge treats dithering as the craft it is.**

- **Authenticity over approximation.** Every palette is extracted from real hardware — not eyeballed from screenshots. Game Boy DMG, NES, Amiga OCS, MS-DOS CGA modes, NTSC and PAL broadcast standards, CRT phosphor profiles. The colors you'd actually have seen in 1989.
- **The full algorithm catalog.** Twelve dithering algorithms from the classic Floyd–Steinberg to recent additions like Riemersma, Blue Noise and Shiau–Fan. Each with proper parameter controls, not pre-baked presets.
- **Pro workflow built-in.** Batch processing, side-by-side comparison, CRT preview with scanlines and analog drift, and an Algorithm Lab to design your own dither from scratch.
- **Made for the modern web.** TypeScript + React + TanStack Start, deployed on Cloudflare Workers. Fast everywhere, no installation needed.

<br />

---

## Demo

<div align="center">

<img src="gif.gif" alt="Dither Forge — live demo" width="85%" />

<br />
<sub><i>Real-time dithering with palette switching, algorithm comparison, and CRT preview.</i></sub>

</div>

<br />

> [!NOTE]
> Dither Forge is in **active alpha development**. APIs and UI may change between versions. Bug reports and palette suggestions are very welcome.

<br />

---

## Features

### Dithering Algorithms

<table>
<tr>
<th align="left" width="50%">Error Diffusion</th>
<th align="left" width="50%">Ordered & Pattern</th>
</tr>
<tr>
<td valign="top">

- **Floyd–Steinberg** — the canonical 1976 algorithm
- **Stucki** — wider error spread, smoother gradients
- **Sierra** — gentle, photographic
- **Atkinson** — sharper, classic Macintosh feel
- **Burkes** — fast, balanced
- **Stevenson–Arce** — designed for offset print
- **Shiau–Fan** — reduces directional artifacts
- **Riemersma** — Hilbert curve scan, no bias
- **Blue Noise** — perceptually uniform stippling

</td>
<td valign="top">

- **Bayer 2×2 / 4×4 / 8×8** — predictable, demoscene-friendly
- **Halftone** — print and comic-book look
- **Threshold** — pure bitmap conversion

<br />

**Custom Algorithms** *(Algorithm Lab)*

Tune `Pattern Size`, `Threshold Bias`, `Diffusion Amount`, plus expert controls: `Diffusion Weight`, `Tonal Protection`, `Edge Preservation`, `Grain Shaping`.

</td>
</tr>
</table>

<br />

### Palette Library

<table>
<tr>
<td valign="top" width="33%">

**Consoles**

- Game Boy (DMG) — 4
- NES — 4
- Sega Master System — 8
- Atari 2600 — 16
- Neo Geo — 16
- PICO-8 — 16

</td>
<td valign="top" width="33%">

**Computers**

- Commodore 64 — 16
- Amiga OCS — 16
- Apple II — 16
- ZX Spectrum — 15
- Macintosh 1-bit / 4-bit
- Atari ST · MSX
- BBC Micro · TRS-80

</td>
<td valign="top" width="33%">

**Display & Broadcast**

- NTSC / PAL Broadcast — 16
- Trinitron — 10
- TV Composite — 8
- CRT Phosphor Green — 8
- CRT Amber — 8
- Plasma Burn — 8
- MS-DOS CGA / EGA / VGA

</td>
</tr>
</table>

<sub><i>All palettes are extracted from real hardware specifications. Custom palettes can be imported from Lospec.</i></sub>

<br />

### Workspace Modules

| Module | What it does |
|--------|--------------|
| **Editor** | Single-image dithering with real-time preview and full parameter control |
| **Batch Processor** | Apply presets to entire folders — perfect for asset pipelines |
| **Gallery** | Browse, organize and tag your processed outputs |
| **Compare** | Side-by-side comparison between any two algorithms or palettes |
| **CRT Preview** | Simulate vintage monitors — scanlines, glow, curvature, analog drift |
| **Algorithm Lab** | Design custom dithering algorithms with expert-level controls |
| **Export** | Multiple formats and resolutions, ready for production |

<br />

### Coming Soon — DitherVerse

A community space to discover, search and share community-made presets:

- **PulseDeck** — swipe-based preset discovery
- **Color Search** — find presets by dominant color
- **Algorithm Search** — find presets compatible with your favorite algorithm

<br />

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [TanStack Start](https://tanstack.com/start) — React with full SSR |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite](https://vitejs.dev/) |
| **Runtime / Package Manager** | [Bun](https://bun.sh/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Deployment** | [Cloudflare Workers](https://workers.cloudflare.com/) |
| **Quality** | ESLint + Prettier |

<br />

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) `≥ 1.0` *(or Node 18+ with npm/pnpm/yarn)*

### Installation

```bash
# Clone the repository
git clone https://github.com/MatteCarro/game-dither-dream.git
cd game-dither-dream

# Install dependencies
bun install

# Start the development server
bun run dev
```

Open **`http://localhost:3000`** and start dithering.

### Available Scripts

```bash
bun run dev        # Start the development server
bun run build      # Build for production
bun run preview    # Preview the production build
bun run lint       # Run ESLint
bun run deploy     # Deploy to Cloudflare Workers
```

> [!TIP]
> Prefer npm or pnpm? Replace `bun` with your package manager — all scripts are standard.

<br />

---

## Project Structure

```
game-dither-dream/
├── src/
│   ├── components/ui/    # shadcn/ui components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Dithering algorithms & core logic
│   ├── routes/           # File-based routing (TanStack Router)
│   ├── router.tsx        # Router configuration
│   ├── server.ts         # SSR entry point
│   ├── start.ts          # Application bootstrap
│   └── styles.css        # Global styles
├── components.json       # shadcn/ui config
├── vite.config.ts        # Vite configuration
├── wrangler.jsonc        # Cloudflare Workers config
└── tsconfig.json         # TypeScript configuration
```

<br />

---

## Roadmap

**Shipped**
- [x] Core dithering engine
- [x] 12 dithering algorithms (incl. Stevenson–Arce, Shiau–Fan, Riemersma, Blue Noise)
- [x] 30+ historical palettes
- [x] Algorithm Lab with expert controls
- [x] Batch processor
- [x] CRT preview module

**In Progress**
- [ ] PulseDeck — drag gestures and swipe interactions
- [ ] DitherVerse community search
- [ ] User profiles + preset sharing

**Planned**
- [ ] Animation / GIF dithering support
- [ ] Plugin SDK for custom algorithms
- [ ] Cloudflare Workers production deploy
- [ ] Lospec palette import

<br />

---

## Contributing

Contributions, issue reports and palette suggestions are very welcome.

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/amazing-palette

# 3. Commit your changes
git commit -m "Add Amiga AGA palette"

# 4. Push to the branch
git push origin feature/amazing-palette

# 5. Open a Pull Request
```

For larger changes, please open an issue first to discuss what you'd like to change.

<br />

---

## Acknowledgments

- **Robert W. Floyd & Louis Steinberg** — for the 1976 paper that started it all
- **Bill Atkinson** — for the Atkinson dither (and a lot more)
- **Christoph Peters & Bart Wronski** — for foundational work on blue noise dithering
- **The Lospec community** — for documenting historical palettes
- **PICO-8** by Lexaloffle — palette inspiration
- All retro hardware engineers who, decades ago, accidentally invented an aesthetic

<br />

---

## License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

<br />

---

<div align="center">

<sub>
Built with ☕ and a lot of pixels by <a href="https://github.com/MatteCarro">@MatteCarro</a> · 2026
</sub>

<br /><br />

<a href="#dither-forge"><sub>↑ Back to top</sub></a>

</div>
