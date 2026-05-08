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
];

export const ALGORITHMS = [
  "Floyd–Steinberg",
  "Atkinson",
  "Jarvis",
  "Stucki",
  "Burkes",
  "Sierra",
  "Bayer 4x4",
  "Bayer 8x8",
  "Ordered (Halftone)",
  "Threshold",
] as const;
export type Algorithm = (typeof ALGORITHMS)[number];

const hexToRgb = (h: string) => {
  const c = h.replace("#", "");
  return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)] as [number, number, number];
};

function nearest(palette: number[][], r: number, g: number, b: number) {
  let best = 0, bd = Infinity;
  for (let i = 0; i < palette.length; i++) {
    const [pr, pg, pb] = palette[i];
    const d = (pr - r) ** 2 + (pg - g) ** 2 + (pb - b) ** 2;
    if (d < bd) { bd = d; best = i; }
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
  const m: number[][] = Array.from({ length: 8 }, () => Array(8).fill(0));
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
    let v = 0, mask = 4;
    for (let i = 0; i < 3; i++) {
      const bx = (x >> i) & 1, by = (y >> i) & 1;
      v |= ((bx ^ by) | (by << 1)) << (2 * (2 - i)) >> 0;
      mask = mask;
    }
    // standard formula
    let n = 0;
    for (let i = 0; i < 3; i++) {
      const bx = (x >> i) & 1, by = (y >> i) & 1;
      n = n * 4 + ((3 * bx) ^ by) + by * 2 - (3 * bx * by);
    }
    m[y][x] = n & 63;
  }
  return m;
})();

type Diffusion = { divisor: number; matrix: [number, number, number][] };
const DIFFUSIONS: Record<string, Diffusion> = {
  "Floyd–Steinberg": { divisor: 16, matrix: [[1, 0, 7], [-1, 1, 3], [0, 1, 5], [1, 1, 1]] },
  Atkinson: { divisor: 8, matrix: [[1, 0, 1], [2, 0, 1], [-1, 1, 1], [0, 1, 1], [1, 1, 1], [0, 2, 1]] },
  Jarvis: { divisor: 48, matrix: [[1,0,7],[2,0,5],[-2,1,3],[-1,1,5],[0,1,7],[1,1,5],[2,1,3],[-2,2,1],[-1,2,3],[0,2,5],[1,2,3],[2,2,1]] },
  Stucki: { divisor: 42, matrix: [[1,0,8],[2,0,4],[-2,1,2],[-1,1,4],[0,1,8],[1,1,4],[2,1,2],[-2,2,1],[-1,2,2],[0,2,4],[1,2,2],[2,2,1]] },
  Burkes: { divisor: 32, matrix: [[1,0,8],[2,0,4],[-2,1,2],[-1,1,4],[0,1,8],[1,1,4],[2,1,2]] },
  Sierra: { divisor: 32, matrix: [[1,0,5],[2,0,3],[-2,1,2],[-1,1,4],[0,1,5],[1,1,4],[2,1,2],[-1,2,2],[0,2,3],[1,2,2]] },
};

export function dither(
  src: ImageData,
  paletteHex: string[],
  algo: Algorithm,
  options: { intensity: number; bitDepth: 1 | 2 | 4 | 8; serpentine: boolean; errorDiffusion: boolean; noise: number; sharpen: number },
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

  const isOrdered = algo.startsWith("Bayer") || algo === "Ordered (Halftone)" || algo === "Threshold";

  if (isOrdered) {
    const matrix = algo === "Bayer 8x8" || algo === "Ordered (Halftone)" ? BAYER8 : BAYER4;
    const size = matrix.length;
    const denom = size * size;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const t = algo === "Threshold" ? 0 : (matrix[y % size][x % size] / denom - 0.5) * 255 * intensity;
        const r = Math.max(0, Math.min(255, data[i] + t));
        const g = Math.max(0, Math.min(255, data[i + 1] + t));
        const b = Math.max(0, Math.min(255, data[i + 2] + t));
        const [nr, ng, nb] = nearest(palette, r, g, b);
        out.data[i] = nr; out.data[i + 1] = ng; out.data[i + 2] = nb; out.data[i + 3] = 255;
      }
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
      const [nr, ng, nb] = nearest(palette, r, g, b);
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
