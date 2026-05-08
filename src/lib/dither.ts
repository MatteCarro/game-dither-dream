export type Palette = { name: string; category: string; colors: string[] };

export const PALETTES: Palette[] = [
  { name: "Game Boy (DMG)", category: "Consoles", colors: ["#0f380f", "#306230", "#8bac0f", "#9bbc0f"] },
  { name: "NES", category: "Consoles", colors: ["#000000", "#fcfcfc", "#0078f8", "#f83800"] },
  { name: "C64", category: "Computers", colors: ["#000000", "#ffffff", "#883932", "#67b6bd", "#8b3f96", "#55a049", "#40318d", "#bfce72", "#8b5429", "#574200", "#b86962", "#505050", "#787878", "#94e089", "#7869c4", "#9f9f9f"] },
  { name: "Amiga OCS", category: "Computers", colors: ["#000000","#ffffff","#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#888888","#444444","#aa5500","#005533","#330055","#553300","#ff8800","#0088ff"] },
  { name: "Sega Master System", category: "Consoles", colors: ["#000000","#555555","#aaaaaa","#ffffff","#ff5555","#55ff55","#5555ff","#ffff55"] },
  { name: "Atari 2600", category: "Consoles", colors: ["#000000","#404040","#6c6c6c","#909090","#b0b0b0","#c8c8c8","#dcdcdc","#ececec","#444400","#646410","#848424","#a0a034","#b8b840","#d0d050","#e8e85c","#fcfc68"] },
  { name: "ZX Spectrum", category: "Computers", colors: ["#000000","#0000d8","#d80000","#d800d8","#00d800","#00d8d8","#d8d800","#d8d8d8","#0000ff","#ff0000","#ff00ff","#00ff00","#00ffff","#ffff00","#ffffff"] },
  { name: "Neo Geo", category: "Arcade", colors: ["#000000","#ffffff","#ff2222","#22ff22","#2222ff","#ffff22","#ff22ff","#22ffff","#882222","#228822","#222288","#888822","#882288","#228888","#444444","#bbbbbb"] },
  { name: "Apple II", category: "Computers", colors: ["#000000","#722640","#40337f","#e434fe","#0e5940","#808080","#1b9afe","#bfb3ff","#404c00","#e46501","#808080","#f1a6bf","#1bcb01","#bfcc80","#8dd9bf","#ffffff"] },
  { name: "EGA", category: "Computers", colors: ["#000000","#0000aa","#00aa00","#00aaaa","#aa0000","#aa00aa","#aa5500","#aaaaaa","#555555","#5555ff","#55ff55","#55ffff","#ff5555","#ff55ff","#ffff55","#ffffff"] },
  { name: "PICO-8", category: "Retro Gaming", colors: ["#000000","#1d2b53","#7e2553","#008751","#ab5236","#5f574f","#c2c3c7","#fff1e8","#ff004d","#ffa300","#ffec27","#00e436","#29adff","#83769c","#ff77a8","#ffccaa"] },
  { name: "TV Composite", category: "TV / Monitors", colors: ["#000000","#222222","#444444","#666666","#888888","#aaaaaa","#cccccc","#ffffff"] },
  { name: "CRT Phosphor Green", category: "TV / Monitors", colors: ["#001100","#003300","#006622","#00aa44","#22dd66","#66ff99","#aaffcc","#e6ffe6"] },
  { name: "CRT Amber", category: "TV / Monitors", colors: ["#1a0a00","#3a1a00","#663300","#996600","#cc9900","#ffbb33","#ffd680","#fff0cc"] },
  { name: "NTSC Broadcast", category: "TV / Monitors", colors: ["#000000","#1d1d1d","#3b3b3b","#5a5a5a","#787878","#969696","#b4b4b4","#d2d2d2","#f0f0f0","#5e2e1c","#3a5e1c","#1c3a5e","#5e1c3a","#1c5e3a","#3a1c5e","#5e5e1c"] },
  { name: "PAL Broadcast", category: "TV / Monitors", colors: ["#000000","#202020","#404040","#606060","#808080","#a0a0a0","#c0c0c0","#e0e0e0","#ffffff","#7a3030","#307a30","#30307a","#7a7a30","#7a307a","#307a7a","#a04040"] },
  { name: "Trinitron", category: "TV / Monitors", colors: ["#0a0a0a","#222222","#444444","#777777","#aaaaaa","#dddddd","#ffffff","#ff3030","#30ff30","#3030ff"] },
  { name: "Plasma Burn", category: "TV / Monitors", colors: ["#000000","#330011","#660033","#992255","#cc4477","#ee77aa","#ffaadd","#ffe0f0"] },
  { name: "MS-DOS CGA", category: "Computers", colors: ["#000000","#55ffff","#ff55ff","#ffffff"] },
  { name: "MS-DOS CGA Mode 0", category: "Computers", colors: ["#000000","#00aa00","#aa0000","#aa5500"] },
  { name: "VGA 16", category: "Computers", colors: ["#000000","#0000aa","#00aa00","#00aaaa","#aa0000","#aa00aa","#aa5500","#aaaaaa","#555555","#5555ff","#55ff55","#55ffff","#ff5555","#ff55ff","#ffff55","#ffffff"] },
  { name: "Macintosh 1-bit", category: "Computers", colors: ["#000000","#ffffff"] },
  { name: "Macintosh 4-bit", category: "Computers", colors: ["#ffffff","#fbf305","#ff6403","#dd0907","#f20884","#4700a5","#0000d3","#02abea","#1fb714","#006412","#562c05","#90713a","#c0c0c0","#808080","#404040","#000000"] },
  { name: "Atari ST", category: "Computers", colors: ["#000000","#202020","#404040","#606060","#808080","#a0a0a0","#c0c0c0","#ffffff","#a00000","#00a000","#0000a0","#a0a000","#a000a0","#00a0a0","#e08000","#0080e0"] },
  { name: "MSX", category: "Computers", colors: ["#000000","#010101","#3eb849","#74d07d","#5955e0","#8076f1","#b95e51","#65dbef","#db6559","#ff897d","#ccc35e","#ded087","#3aa241","#b766b5","#cccccc","#ffffff"] },
  { name: "BBC Micro", category: "Computers", colors: ["#000000","#ff0000","#00ff00","#ffff00","#0000ff","#ff00ff","#00ffff","#ffffff"] },
  { name: "TRS-80", category: "Computers", colors: ["#000000","#404040","#808080","#c0c0c0","#ffffff","#00aa44"] },
];

export const ALGORITHMS = [
  "Floyd–Steinberg",
  "Atkinson",
  "Jarvis",
  "Stucki",
  "Burkes",
  "Sierra",
  "Sierra-2",
  "Sierra Lite",
  "Stevenson-Arce",
  "Shiau-Fan",
  "Riemersma",
  "Halftone",
  "Bayer 4x4",
  "Bayer 8x8",
  "Bayer 16x16",
  "Blue Noise",
  "Threshold",
] as const;
export type Algorithm = (typeof ALGORITHMS)[number];

const hexToRgb = (h: string) => {
  const c = h.replace("#", "");
  return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)] as [number, number, number];
};

function applyBlur(data: Float32Array, width: number, height: number, radius: number): Float32Array {
  if (radius <= 0) return data;
  const out = new Float32Array(data.length);
  const r = Math.max(1, Math.round(radius));
  const size = r * 2 + 1;
  const area = size * size;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sr = 0, sg = 0, sb = 0;
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const ny = Math.min(height - 1, Math.max(0, y + dy));
          const nx = Math.min(width - 1, Math.max(0, x + dx));
          const j = (ny * width + nx) * 4;
          sr += data[j]; sg += data[j + 1]; sb += data[j + 2];
        }
      }
      const i = (y * width + x) * 4;
      out[i] = sr / area; out[i + 1] = sg / area; out[i + 2] = sb / area;
      out[i + 3] = data[i + 3];
    }
  }
  return out;
}

function applyGlow(data: Float32Array, width: number, height: number, amount: number, threshold = 0.55): Float32Array {
  if (amount <= 0) return data;
  const bright = new Float32Array(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
    const t = Math.max(0, lum - threshold) / (1 - threshold + 1e-6);
    const k = t * t;
    bright[i] = data[i] * k;
    bright[i + 1] = data[i + 1] * k;
    bright[i + 2] = data[i + 2] * k;
    bright[i + 3] = 0;
  }
  const radius = Math.max(2, Math.round(2 + amount / 14));
  const blurred = applyBlur(bright, width, height, radius);
  const gain = amount / 60;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] + blurred[i] * gain);
    data[i + 1] = Math.min(255, data[i + 1] + blurred[i + 1] * gain);
    data[i + 2] = Math.min(255, data[i + 2] + blurred[i + 2] * gain);
  }
  return data;
}

export function preprocessImage(
  src: ImageData,
  options: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    gamma?: number;
    highlights?: number;
    shadows?: number;
    temperature?: number;
    blur?: number;
    glow?: number;
  }
): ImageData {
  const { width, height } = src;
  let data: Float32Array = new Float32Array(src.data.length);
  for (let i = 0; i < src.data.length; i++) data[i] = src.data[i];

  if (options.blur && options.blur > 0) {
    data = applyBlur(data, width, height, options.blur);
  }

  if (options.glow && options.glow > 0) {
    data = applyGlow(data, width, height, options.glow);
  }

  const out = new ImageData(width, height);
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i] / 255;
    let g = data[i + 1] / 255;
    let b = data[i + 2] / 255;

    if (options.brightness !== undefined && options.brightness !== 100) {
      const br = options.brightness / 100;
      r *= br; g *= br; b *= br;
    }

    if (options.contrast !== undefined && options.contrast !== 100) {
      const c = options.contrast / 100;
      r = (r - 0.5) * c + 0.5;
      g = (g - 0.5) * c + 0.5;
      b = (b - 0.5) * c + 0.5;
    }

    if (options.gamma !== undefined && options.gamma !== 100) {
      const gma = Math.max(0.1, options.gamma / 100);
      r = Math.pow(Math.max(0, r), gma);
      g = Math.pow(Math.max(0, g), gma);
      b = Math.pow(Math.max(0, b), gma);
    }

    if (options.saturation !== undefined && options.saturation !== 100) {
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const s = options.saturation / 100;
      r = lum + (r - lum) * s;
      g = lum + (g - lum) * s;
      b = lum + (b - lum) * s;
    }

    if (options.shadows !== undefined || options.highlights !== undefined) {
      const shadows = (options.shadows || 0) / 100;
      const highlights = (options.highlights || 0) / 100;
      const tone = (v: number) => {
        let out = v;
        if (shadows > 0) out = out + shadows * (1 - out) * (1 - out);
        else if (shadows < 0) out = out * (1 + shadows * (1 - out));
        if (highlights > 0) out = out * (1 - highlights * out * out);
        else if (highlights < 0) out = out + (-highlights) * out * out * (1 - out);
        return out;
      };
      r = tone(r); g = tone(g); b = tone(b);
    }

    if (options.temperature !== undefined && options.temperature !== 0) {
      const temp = options.temperature / 100;
      r += temp * 0.15;
      b -= temp * 0.15;
    }

    out.data[i] = Math.max(0, Math.min(255, Math.round(r * 255)));
    out.data[i + 1] = Math.max(0, Math.min(255, Math.round(g * 255)));
    out.data[i + 2] = Math.max(0, Math.min(255, Math.round(b * 255)));
    out.data[i + 3] = 255;
  }
  return out;
}

function nearest(palette: number[][], r: number, g: number, b: number, colorGamma = 2.2) {
  const gma = Math.max(0.1, colorGamma);
  const rg = Math.pow(r / 255, gma);
  const gg = Math.pow(g / 255, gma);
  const bg = Math.pow(b / 255, gma);
  let best = 0, bd = Infinity;
  for (let i = 0; i < palette.length; i++) {
    const [pr, pg, pb] = palette[i];
    const prg = Math.pow(pr / 255, gma);
    const pgg = Math.pow(pg / 255, gma);
    const pbg = Math.pow(pb / 255, gma);
    const d = (prg - rg) ** 2 + (pgg - gg) ** 2 + (pbg - bg) ** 2;
    if (d < bd - 1e-9) { bd = d; best = i; }
    else if (Math.abs(d - bd) < 1e-9 && Math.random() > 0.5) { best = i; }
  }
  return palette[best];
}

const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];
const BAYER8 = (() => {
  const m4 = BAYER4;
  const m: number[][] = Array.from({ length: 8 }, () => Array(8).fill(0));
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      m[y][x] = m4[y][x] * 4 + 0;
      m[y][x + 4] = m4[y][x] * 4 + 2;
      m[y + 4][x] = m4[y][x] * 4 + 3;
      m[y + 4][x + 4] = m4[y][x] * 4 + 1;
    }
  }
  return m;
})();

const BAYER16 = (() => {
  const m8 = BAYER8;
  const m: number[][] = Array.from({ length: 16 }, () => Array(16).fill(0));
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      m[y][x] = m8[y][x] * 4 + 0;
      m[y][x + 8] = m8[y][x] * 4 + 2;
      m[y + 8][x] = m8[y][x] * 4 + 3;
      m[y + 8][x + 8] = m8[y][x] * 4 + 1;
    }
  }
  return m;
})();

const HALFTONE8 = [
  [24, 10, 12, 26, 35, 47, 49, 37],
  [8, 0, 2, 14, 45, 59, 61, 51],
  [22, 6, 4, 16, 43, 57, 63, 53],
  [30, 20, 18, 28, 33, 41, 55, 39],
  [34, 46, 48, 36, 25, 11, 13, 27],
  [44, 58, 60, 50, 9, 1, 3, 15],
  [42, 56, 62, 52, 23, 7, 5, 17],
  [32, 40, 54, 38, 31, 21, 19, 29],
];

type Diffusion = { divisor: number; matrix: [number, number, number][] };
const DIFFUSIONS: Record<string, Diffusion> = {
  "Floyd–Steinberg": { divisor: 16, matrix: [[1, 0, 7], [-1, 1, 3], [0, 1, 5], [1, 1, 1]] },
  Atkinson: { divisor: 8, matrix: [[1, 0, 1], [2, 0, 1], [-1, 1, 1], [0, 1, 1], [1, 1, 1], [0, 2, 1]] },
  Jarvis: { divisor: 48, matrix: [[1,0,7],[2,0,5],[-2,1,3],[-1,1,5],[0,1,7],[1,1,5],[2,1,3],[-2,2,1],[-1,2,3],[0,2,5],[1,2,3],[2,2,1]] },
  Stucki: { divisor: 42, matrix: [[1,0,8],[2,0,4],[-2,1,2],[-1,1,4],[0,1,8],[1,1,4],[2,1,2],[-2,2,1],[-1,2,2],[0,2,4],[1,2,2],[2,2,1]] },
  Burkes: { divisor: 32, matrix: [[1,0,8],[2,0,4],[-2,1,2],[-1,1,4],[0,1,8],[1,1,4],[2,1,2]] },
  Sierra: { divisor: 32, matrix: [[1,0,5],[2,0,3],[-2,1,2],[-1,1,4],[0,1,5],[1,1,4],[2,1,2],[-1,2,2],[0,2,3],[1,2,2]] },
  "Sierra-2": { divisor: 16, matrix: [[1,0,4],[2,0,3],[-2,1,1],[-1,1,2],[0,1,3],[1,1,2],[2,1,1]] },
  "Sierra Lite": { divisor: 4, matrix: [[1,0,2],[-1,1,1],[0,1,1]] },
  "Stevenson-Arce": { divisor: 200, matrix: [[2,0,32],[-3,1,12],[-1,1,26],[1,1,30],[3,1,16],[-2,2,12],[0,2,26],[2,2,12],[-3,3,5],[-1,3,12],[1,3,12],[3,3,5]] },
  "Shiau-Fan": { divisor: 8, matrix: [[1,0,4],[-2,1,1],[-1,1,1],[0,1,2]] },
};

// Hilbert curve coordinates for d in [0, n*n) on 2^k square
function hilbertD2XY(n: number, d: number): [number, number] {
  let x = 0, y = 0, t = d;
  for (let s = 1; s < n; s *= 2) {
    const rx = 1 & (t >> 1);
    const ry = 1 & (t ^ rx);
    if (ry === 0) {
      if (rx === 1) {
        x = s - 1 - x;
        y = s - 1 - y;
      }
      const tmp = x; x = y; y = tmp;
    }
    x += s * rx;
    y += s * ry;
    t >>= 2;
  }
  return [x, y];
}

// Interleaved Gradient Noise (Jorge Jimenez) - blue-noise-like, fast
function ign(x: number, y: number): number {
  const v = 52.9829189 * (((0.06711056 * x + 0.00583715 * y) % 1) + 1);
  return ((v % 1) + 1) % 1;
}

export function dither(
  src: ImageData,
  paletteHex: string[],
  algo: Algorithm,
  options: { intensity: number; bitDepth: 1 | 2 | 4 | 8 | 16; serpentine: boolean; errorDiffusion: boolean; noise: number; sharpen: number; colorGamma?: number },
): ImageData {
  const { width, height } = src;
  const out = new ImageData(width, height);
  const data = new Float32Array(src.data.length);
  for (let i = 0; i < src.data.length; i++) data[i] = src.data[i];

  // noise
  if (options.noise > 0) {
    const n = options.noise * 2.55;
    for (let i = 0; i < data.length; i += 4) {
      const r = (Math.random() - 0.5) * n;
      data[i] += r; data[i + 1] += r; data[i + 2] += r;
    }
  }
  // sharpen (simple unsharp-ish)
  if (options.sharpen > 0) {
    const amt = options.sharpen / 100;
    const copy = new Float32Array(data);
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = (y * width + x) * 4;
        for (let c = 0; c < 3; c++) {
          const center = copy[i + c];
          const lap = 4 * center - copy[i - 4 + c] - copy[i + 4 + c] - copy[i - width * 4 + c] - copy[i + width * 4 + c];
          data[i + c] = center + lap * amt;
        }
      }
    }
  }

  let palette = paletteHex.map(hexToRgb);
  // bit depth limits palette size
  const maxColors = Math.pow(2, options.bitDepth);
  if (palette.length > maxColors) palette = palette.slice(0, maxColors);

  const intensity = options.intensity / 100;

  const isOrdered = algo.startsWith("Bayer") || algo === "Halftone" || algo === "Threshold" || algo === "Blue Noise";

  if (isOrdered) {
    if (algo === "Blue Noise") {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const t = (ign(x, y) - 0.5) * 255 * intensity;
          const r = Math.max(0, Math.min(255, data[i] + t));
          const g = Math.max(0, Math.min(255, data[i + 1] + t));
          const b = Math.max(0, Math.min(255, data[i + 2] + t));
          const [nr, ng, nb] = nearest(palette, r, g, b, options.colorGamma);
          out.data[i] = nr; out.data[i + 1] = ng; out.data[i + 2] = nb; out.data[i + 3] = 255;
        }
      }
      return out;
    }
    const matrix = algo === "Halftone" ? HALFTONE8 : algo === "Bayer 16x16" ? BAYER16 : algo === "Bayer 8x8" ? BAYER8 : BAYER4;
    const size = matrix.length;
    const denom = size * size;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const t = algo === "Threshold" ? 0 : (matrix[y % size][x % size] / denom - 0.5) * 255 * intensity;
        const r = Math.max(0, Math.min(255, data[i] + t));
        const g = Math.max(0, Math.min(255, data[i + 1] + t));
        const b = Math.max(0, Math.min(255, data[i + 2] + t));
        const [nr, ng, nb] = nearest(palette, r, g, b, options.colorGamma);
        out.data[i] = nr; out.data[i + 1] = ng; out.data[i + 2] = nb; out.data[i + 3] = 255;
      }
    }
    return out;
  }

  // Riemersma dither: traverse along Hilbert curve with weighted error queue
  if (algo === "Riemersma") {
    const N = 16;
    const B = 16; // exponential base
    const weights: number[] = [];
    let wsum = 0;
    for (let k = 0; k < N; k++) {
      const w = Math.pow(B, k / (N - 1));
      weights.push(w);
      wsum += w;
    }
    const qr = new Float32Array(N), qg = new Float32Array(N), qb = new Float32Array(N);
    let qhead = 0;
    let n = 1;
    while (n < width || n < height) n *= 2;
    const total = n * n;
    for (let d = 0; d < total; d++) {
      const [x, y] = hilbertD2XY(n, d);
      if (x >= width || y >= height) continue;
      const i = (y * width + x) * 4;
      let er = 0, eg = 0, eb = 0;
      for (let k = 0; k < N; k++) {
        const idx = (qhead + k) % N;
        const w = weights[k] / wsum;
        er += qr[idx] * w; eg += qg[idx] * w; eb += qb[idx] * w;
      }
      const r = Math.max(0, Math.min(255, data[i] + er * intensity));
      const g = Math.max(0, Math.min(255, data[i + 1] + eg * intensity));
      const b = Math.max(0, Math.min(255, data[i + 2] + eb * intensity));
      const [nr, ng, nb] = nearest(palette, r, g, b, options.colorGamma);
      out.data[i] = nr; out.data[i + 1] = ng; out.data[i + 2] = nb; out.data[i + 3] = 255;
      qr[qhead] = r - nr; qg[qhead] = g - ng; qb[qhead] = b - nb;
      qhead = (qhead + 1) % N;
    }
    return out;
  }

  const diff = DIFFUSIONS[algo] ?? DIFFUSIONS["Floyd–Steinberg"];
  for (let y = 0; y < height; y++) {
    const ltr = options.serpentine ? y % 2 === 0 : true;
    const xs = ltr ? 0 : width - 1;
    const xe = ltr ? width : -1;
    const xd = ltr ? 1 : -1;
    for (let x = xs; x !== xe; x += xd) {
      const i = (y * width + x) * 4;
      const r = Math.max(0, Math.min(255, data[i]));
      const g = Math.max(0, Math.min(255, data[i + 1]));
      const b = Math.max(0, Math.min(255, data[i + 2]));
      const [nr, ng, nb] = nearest(palette, r, g, b, options.colorGamma);
      out.data[i] = nr; out.data[i + 1] = ng; out.data[i + 2] = nb; out.data[i + 3] = 255;
      if (!options.errorDiffusion) continue;
      const er = (r - nr) * intensity, eg = (g - ng) * intensity, eb = (b - nb) * intensity;
      for (const [dx, dy, w] of diff.matrix) {
        const nx = x + dx * (ltr ? 1 : -1);
        const ny = y + dy;
        if (nx < 0 || nx >= width || ny >= height) continue;
        const j = (ny * width + nx) * 4;
        const f = w / diff.divisor;
        data[j] += er * f; data[j + 1] += eg * f; data[j + 2] += eb * f;
      }
    }
  }
  return out;
}

export function makeSampleImage(width = 320, height = 200): ImageData {
  const img = new ImageData(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      // gradient sky + moon + horizon + figure silhouette
      const skyT = y / (height * 0.7);
      let r = 30 + skyT * 80;
      let g = 35 + skyT * 90;
      let b = 60 + skyT * 110;
      // moon
      const mx = width * 0.7, my = height * 0.3, mr = 35;
      const dm = Math.hypot(x - mx, y - my);
      if (dm < mr) {
        const t = 1 - dm / mr;
        r = 220 * t + r * (1 - t);
        g = 220 * t + g * (1 - t);
        b = 200 * t + b * (1 - t);
      }
      // stars
      if (y < height * 0.5 && Math.random() < 0.002) { r = g = b = 230; }
      // ground
      if (y > height * 0.65) {
        const gt = (y - height * 0.65) / (height * 0.35);
        const noise = (Math.sin(x * 0.3) + Math.cos(y * 0.4)) * 10;
        r = 20 + gt * 40 + noise;
        g = 25 + gt * 45 + noise;
        b = 35 + gt * 55 + noise;
      }
      // figure
      const fx = width * 0.55, fbase = height * 0.85;
      if (x > fx - 8 && x < fx + 8 && y > fbase - 60 && y < fbase) {
        r = g = b = 10;
      }
      if ((x - fx) ** 2 + (y - (fbase - 65)) ** 2 < 36) { r = g = b = 10; }
      img.data[i] = Math.max(0, Math.min(255, r));
      img.data[i + 1] = Math.max(0, Math.min(255, g));
      img.data[i + 2] = Math.max(0, Math.min(255, b));
      img.data[i + 3] = 255;
    }
  }
  return img;
}
