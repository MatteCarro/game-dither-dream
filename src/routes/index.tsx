import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Home, Redo2, Undo2, Search, FilePlus2, FolderOpen, Save, Moon,
  Pencil, Layers, Image as ImageIcon, Sliders, Palette as PaletteIcon,
  GitCompare, Monitor, Download, Settings, Keyboard, Info, Play, Grid3x3,
  Star, ChevronDown, Box, Sun, Sparkles, Share2,
  X, Heart, Clapperboard, Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { ALGORITHMS, PALETTES, dither, makeSampleImage, type Algorithm, type Palette } from "@/lib/dither";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: DitherForge,
  head: () => ({
    meta: [
      { title: "Dither Forge — Retro Pixel Dithering Studio" },
      { name: "description", content: "Convert any image into beautiful retro dithered art using authentic console palettes (Game Boy, NES, C64, PICO-8) and classic algorithms." },
    ],
  }),
});

const CATEGORIES = ["All", "Retro Gaming", "Consoles", "Computers", "Arcade", "TV / Monitors", "Custom"] as const;
const ALGORITHM_WARNING_STORAGE_KEY = "ditherForge.hideAlgorithmExpertWarning";
const ALGORITHM_GUIDE_STORAGE_KEY = "ditherForge.hideAlgorithmMiniGuide";
const CUSTOM_ALGORITHMS_STORAGE_KEY = "ditherForge.customAlgorithms";
const CUSTOM_PALETTES_STORAGE_KEY = "ditherForge.customPalettes";
type CustomAlgorithm = {
  name: string;
  base: Algorithm;
  patternSize: number;
  thresholdBias: number;
  diffusionAmount: number;
  expertMode: boolean;
  diffusionWeight: number;
  tonalProtection: number;
  edgePreservation: number;
  grainShaping: number;
};
const SOCIAL_ALGORITHMS = [
  { name: "Neon Ghost Diffusion", author: "pixel_mara", base: "Floyd–Steinberg", color: "#29adff", tags: ["cyber", "blue", "photo"], likes: 128 },
  { name: "Amber Terminal Bloom", author: "crt_works", base: "Atkinson", color: "#ffbb33", tags: ["amber", "terminal", "soft"], likes: 94 },
  { name: "Arcade Ink Storm", author: "arcade_luca", base: "Halftone", color: "#ff004d", tags: ["halftone", "print", "bold"], likes: 211 },
  { name: "Pocket LCD Mist", author: "dmg_sara", base: "Bayer 4x4", color: "#9bbc0f", tags: ["gameboy", "green", "ordered"], likes: 177 },
];
const SOCIAL_DECK_SIZE = 20;

function DitherForge() {
  const [algo, setAlgo] = useState<string>("Floyd–Steinberg");
  const [intensity, setIntensity] = useState(75);
  const [bitDepth, setBitDepth] = useState<1 | 2 | 4 | 8 | 16>(1);
  const [paletteName, setPaletteName] = useState("Game Boy (DMG)");
  const [serpentine, setSerpentine] = useState(true);
  const [errorDiffusion, setErrorDiffusion] = useState(true);
  const [noise, setNoise] = useState(10);
  const [sharpen, setSharpen] = useState(0);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["Game Boy (DMG)"]));
  const [zoom, setZoom] = useState(100);
  const [source, setSource] = useState<ImageData | null>(null);
  const [crtPreview, setCrtPreview] = useState(false);
  const [crtScanlines, setCrtScanlines] = useState(35);
  const [crtVignette, setCrtVignette] = useState(70);
  const [crtCurvature, setCrtCurvature] = useState(6);
  const [crtGlow, setCrtGlow] = useState(35);
  const [crtChromatic, setCrtChromatic] = useState(12);
  const [crtNoise, setCrtNoise] = useState(8);
  const [showCrtControls, setShowCrtControls] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [pixelGrid, setPixelGrid] = useState(false);
  const [activeView, setActiveView] = useState<string>("Editor");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoName, setVideoName] = useState("");
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoExporting, setVideoExporting] = useState(false);
  const [videoExportSize, setVideoExportSize] = useState("original");
  const [videoBrightness, setVideoBrightness] = useState(100);
  const [videoContrast, setVideoContrast] = useState(100);
  const [videoSaturation, setVideoSaturation] = useState(100);
  const [videoGamma, setVideoGamma] = useState(100);
  const [videoHighlights, setVideoHighlights] = useState(0);
  const [videoShadows, setVideoShadows] = useState(0);
  const [videoTemperature, setVideoTemperature] = useState(0);
  const [videoPixelSize, setVideoPixelSize] = useState(1);
  const [socialTab, setSocialTab] = useState("PulseDeck");
  const [pulseDeckIndex, setPulseDeckIndex] = useState(0);
  const [pulseSwipeDirection, setPulseSwipeDirection] = useState<null | "left" | "right">(null);
  const [pulseSwipeActive, setPulseSwipeActive] = useState(false);
  const [socialColorSearch, setSocialColorSearch] = useState("#29adff");
  const [socialAlgorithmSearch, setSocialAlgorithmSearch] = useState("Floyd–Steinberg");
  const [dialog, setDialog] = useState<null | "preferences" | "shortcuts" | "about" | "comingsoon" | "export" | "videoExport" | "algorithmWarning" | "algorithmGuide">(null);
  const [comingSoonLabel, setComingSoonLabel] = useState("");
  const [dark, setDark] = useState(true);
  const [hideAlgorithmWarning, setHideAlgorithmWarning] = useState(false);
  const [customAlgorithmName, setCustomAlgorithmName] = useState("My Custom Dither");
  const [customAlgorithmBase, setCustomAlgorithmBase] = useState<Algorithm>("Floyd–Steinberg");
  const [patternSize, setPatternSize] = useState(4);
  const [thresholdBias, setThresholdBias] = useState(0);
  const [diffusionAmount, setDiffusionAmount] = useState(60);
  const [expertAlgorithmMode, setExpertAlgorithmMode] = useState(false);
  const [diffusionWeight, setDiffusionWeight] = useState(75);
  const [tonalProtection, setTonalProtection] = useState(40);
  const [edgePreservation, setEdgePreservation] = useState(50);
  const [grainShaping, setGrainShaping] = useState(25);
  const [hideAlgorithmGuide, setHideAlgorithmGuide] = useState(false);
  const [showEditorGuide, setShowEditorGuide] = useState(true);
  const [customAlgorithms, setCustomAlgorithms] = useState<CustomAlgorithm[]>([]);
  const [algorithmSaved, setAlgorithmSaved] = useState(false);
  const [customPalettes, setCustomPalettes] = useState<Palette[]>([]);
  const [customPaletteName, setCustomPaletteName] = useState("My Custom Palette");
  const [customPaletteColors, setCustomPaletteColors] = useState(["#0b0f1a", "#26324a", "#577590", "#f3ca40", "#f2a65a", "#f25c54"]);
  const [paletteSaved, setPaletteSaved] = useState(false);

  function openComingSoon(label: string) {
    setComingSoonLabel(label);
    setDialog("comingsoon");
  }

  function openAlgorithmLab() {
    if (typeof window !== "undefined" && window.localStorage.getItem(ALGORITHM_WARNING_STORAGE_KEY) === "true") {
      openAlgorithmGuideOrEditor();
      return;
    }
    setHideAlgorithmWarning(false);
    setDialog("algorithmWarning");
  }

  function continueToAlgorithmLab() {
    if (hideAlgorithmWarning && typeof window !== "undefined") {
      window.localStorage.setItem(ALGORITHM_WARNING_STORAGE_KEY, "true");
    }
    openAlgorithmGuideOrEditor();
  }

  function openAlgorithmGuideOrEditor() {
    if (typeof window !== "undefined" && window.localStorage.getItem(ALGORITHM_GUIDE_STORAGE_KEY) === "true") {
      setActiveView("Algorithms");
      setDialog(null);
      return;
    }
    setHideAlgorithmGuide(false);
    setDialog("algorithmGuide");
  }

  function continueFromAlgorithmGuide() {
    if (hideAlgorithmGuide && typeof window !== "undefined") {
      window.localStorage.setItem(ALGORITHM_GUIDE_STORAGE_KEY, "true");
      setShowEditorGuide(false);
    }
    setActiveView("Algorithms");
    setDialog(null);
  }

  const paletteOptions = useMemo(() => [...PALETTES, ...customPalettes], [customPalettes]);
  const palette = useMemo(() => paletteOptions.find((p) => p.name === paletteName) ?? paletteOptions[0], [paletteName, paletteOptions]);
  const paletteFixedBitDepth = useMemo(() => {
    const match = palette.name.match(/\b(1|2|4|8|16)-bit\b/i);
    return match ? (Number(match[1]) as 1 | 2 | 4 | 8 | 16) : null;
  }, [palette.name]);
  const selectedCustomAlgorithm = useMemo(() => customAlgorithms.find((a) => a.name === algo) ?? null, [customAlgorithms, algo]);
  const renderAlgorithm = selectedCustomAlgorithm?.base ?? (ALGORITHMS.includes(algo as Algorithm) ? (algo as Algorithm) : "Floyd–Steinberg");
  const algorithmOptions = useMemo(() => [...ALGORITHMS, ...customAlgorithms.map((a) => a.name)], [customAlgorithms]);
  const pulseDeckItem = SOCIAL_ALGORITHMS[pulseDeckIndex % SOCIAL_ALGORITHMS.length];
  const pulseDeckNextItem = SOCIAL_ALGORITHMS[(pulseDeckIndex + 1) % SOCIAL_ALGORITHMS.length];
  const pulseDeckDepthItem = SOCIAL_ALGORITHMS[(pulseDeckIndex + 2) % SOCIAL_ALGORITHMS.length];
  const pulseDeckProgress = (pulseDeckIndex % SOCIAL_DECK_SIZE) + 1;
  const pulseDeckProgressPct = (pulseDeckProgress / SOCIAL_DECK_SIZE) * 100;

  useEffect(() => {
    document.documentElement.classList.toggle("light", !dark);
  }, [dark]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(CUSTOM_ALGORITHMS_STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as CustomAlgorithm[];
      if (Array.isArray(parsed)) setCustomAlgorithms(parsed);
    } catch {
      window.localStorage.removeItem(CUSTOM_ALGORITHMS_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(CUSTOM_PALETTES_STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as Palette[];
      if (Array.isArray(parsed)) setCustomPalettes(parsed);
    } catch {
      window.localStorage.removeItem(CUSTOM_PALETTES_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (paletteFixedBitDepth && bitDepth !== paletteFixedBitDepth) {
      setBitDepth(paletteFixedBitDepth);
    }
  }, [paletteFixedBitDepth, bitDepth]);

  function saveCustomAlgorithm() {
    const name = customAlgorithmName.trim() || "Untitled Custom Dither";
    const saved: CustomAlgorithm = {
      name,
      base: customAlgorithmBase,
      patternSize,
      thresholdBias,
      diffusionAmount,
      expertMode: expertAlgorithmMode,
      diffusionWeight,
      tonalProtection,
      edgePreservation,
      grainShaping,
    };
    const next = [...customAlgorithms.filter((a) => a.name !== name), saved];
    setCustomAlgorithms(next);
    setAlgo(name);
    setAlgorithmSaved(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CUSTOM_ALGORITHMS_STORAGE_KEY, JSON.stringify(next));
    }
    window.setTimeout(() => setAlgorithmSaved(false), 1600);
  }

  function updateCustomPaletteColor(index: number, value: string) {
    setCustomPaletteColors((colors) => colors.map((color, i) => i === index ? value : color));
  }

  function addCustomPaletteColor() {
    setCustomPaletteColors((colors) => [...colors, "#ffffff"]);
  }

  function removeCustomPaletteColor(index: number) {
    setCustomPaletteColors((colors) => colors.length <= 2 ? colors : colors.filter((_, i) => i !== index));
  }

  function saveCustomPalette() {
    const name = customPaletteName.trim() || "Untitled Custom Palette";
    const saved: Palette = {
      name,
      category: "Custom",
      colors: customPaletteColors,
    };
    const next = [...customPalettes.filter((p) => p.name !== name), saved];
    setCustomPalettes(next);
    setPaletteName(name);
    setCategory("Custom");
    setPaletteSaved(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CUSTOM_PALETTES_STORAGE_KEY, JSON.stringify(next));
    }
    window.setTimeout(() => setPaletteSaved(false), 1600);
  }

  const sourceCanvas = useRef<HTMLCanvasElement>(null);
  const previewCanvas = useRef<HTMLCanvasElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const videoElement = useRef<HTMLVideoElement>(null);

  // initialize sample
  useEffect(() => { setSource(makeSampleImage(320, 200)); }, []);

  // draw source
  useEffect(() => {
    if (!source || !sourceCanvas.current) return;
    const c = sourceCanvas.current;
    c.width = source.width; c.height = source.height;
    c.getContext("2d")!.putImageData(source, 0, 0);
  }, [source]);

  // dither
  useEffect(() => {
    if (!source || !previewCanvas.current) return;
    const out = dither(source, palette.colors, renderAlgorithm, {
      intensity, bitDepth, serpentine, errorDiffusion, noise, sharpen,
    });
    const c = previewCanvas.current;
    c.width = out.width; c.height = out.height;
    c.getContext("2d")!.putImageData(out, 0, 0);
  }, [source, palette, renderAlgorithm, intensity, bitDepth, serpentine, errorDiffusion, noise, sharpen]);

  function loadFile(file: File) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const max = 480;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      setSource(ctx.getImageData(0, 0, w, h));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function captureVideoFrame() {
    const video = videoElement.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) return;
    const max = 480;
    const scale = Math.min(1, max / Math.max(video.videoWidth, video.videoHeight));
    const w = Math.max(1, Math.round(video.videoWidth * scale));
    const h = Math.max(1, Math.round(video.videoHeight * scale));
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(video, 0, 0, w, h);

    const pixelBlock = Math.max(1, Math.round(videoPixelSize));
    if (pixelBlock > 1) {
      const small = document.createElement("canvas");
      small.width = Math.max(1, Math.round(w / pixelBlock));
      small.height = Math.max(1, Math.round(h / pixelBlock));
      const sctx = small.getContext("2d");
      if (sctx) {
        sctx.imageSmoothingEnabled = false;
        sctx.drawImage(c, 0, 0, small.width, small.height);
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(small, 0, 0, small.width, small.height, 0, 0, w, h);
      }
    }

    const frame = ctx.getImageData(0, 0, w, h);
    const data = frame.data;
    const brightness = videoBrightness / 100;
    const contrast = videoContrast / 100;
    const saturation = videoSaturation / 100;
    const gamma = Math.max(0.1, videoGamma / 100);
    const highlights = videoHighlights / 100;
    const shadows = videoShadows / 100;
    const temperature = videoTemperature / 100;
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i] / 255;
      let g = data[i + 1] / 255;
      let b = data[i + 2] / 255;

      // brightness + contrast in linearized normalized space
      r = ((r - 0.5) * contrast + 0.5) * brightness;
      g = ((g - 0.5) * contrast + 0.5) * brightness;
      b = ((b - 0.5) * contrast + 0.5) * brightness;

      // saturation
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      r = luma + (r - luma) * saturation;
      g = luma + (g - luma) * saturation;
      b = luma + (b - luma) * saturation;

      // highlights / shadows shaping
      if (highlights !== 0 && luma > 0.5) {
        const boost = (luma - 0.5) * 2 * highlights;
        r += boost * (1 - r);
        g += boost * (1 - g);
        b += boost * (1 - b);
      }
      if (shadows !== 0 && luma < 0.5) {
        const lift = (0.5 - luma) * 2 * shadows;
        r += lift * (1 - r);
        g += lift * (1 - g);
        b += lift * (1 - b);
      }

      // temperature: warm up reds / cool down blues
      r += temperature * 0.08;
      b -= temperature * 0.08;

      // gamma correction
      r = Math.pow(Math.max(0, r), 1 / gamma);
      g = Math.pow(Math.max(0, g), 1 / gamma);
      b = Math.pow(Math.max(0, b), 1 / gamma);

      data[i] = Math.max(0, Math.min(255, Math.round(r * 255)));
      data[i + 1] = Math.max(0, Math.min(255, Math.round(g * 255)));
      data[i + 2] = Math.max(0, Math.min(255, Math.round(b * 255)));
    }
    setSource(frame);
  }

  function loadVideo(file: File) {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    const nextUrl = URL.createObjectURL(file);
    setVideoUrl(nextUrl);
    setVideoName(file.name);
    setVideoDuration(0);
    setVideoCurrentTime(0);
    setVideoPlaying(false);
  }

  function formatTime(seconds: number) {
    const safe = Math.max(0, Math.floor(seconds));
    const mm = Math.floor(safe / 60);
    const ss = safe % 60;
    return `${mm}:${String(ss).padStart(2, "0")}`;
  }

  function exportImage() {
    if (!previewCanvas.current) return;
    previewCanvas.current.toBlob((b) => {
      if (!b) return;
      const url = URL.createObjectURL(b);
      const a = document.createElement("a");
      a.href = url; a.download = `dither-${palette.name.replace(/\W+/g, "_")}.png`; a.click();
      URL.revokeObjectURL(url);
    });
  }

  async function exportVideoMp4(sizePreset: string = "original") {
    const video = videoElement.current;
    const canvas = previewCanvas.current;
    if (!video || !canvas || !videoUrl || videoExporting) return;
    if (typeof MediaRecorder === "undefined") return;

    const presetScale: Record<string, number> = {
      original: 1,
      "0.5x": 0.5,
      "2x": 2,
      "3x": 3,
      "4x": 4,
    };
    const scale = presetScale[sizePreset] ?? 1;
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = Math.max(1, Math.round(canvas.width * scale));
    exportCanvas.height = Math.max(1, Math.round(canvas.height * scale));
    const exportCtx = exportCanvas.getContext("2d");
    if (!exportCtx) return;
    exportCtx.imageSmoothingEnabled = false;
    exportCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, exportCanvas.width, exportCanvas.height);

    const stream = exportCanvas.captureStream(30);
    const mp4MimeCandidates = [
      "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
      "video/mp4;codecs=avc1",
      "video/mp4",
    ];
    const mimeType = mp4MimeCandidates.find((m) => MediaRecorder.isTypeSupported(m));
    if (!mimeType) {
      window.alert("Export MP4 non supportato in questo browser/runtime. Servirebbe un encoder MP4 dedicato.");
      return;
    }

    const chunks: BlobPart[] = [];
    const recorder = new MediaRecorder(stream, { mimeType });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    try {
      setVideoExporting(true);
      setDialog(null);
      setVideoPlaying(false);
      video.pause();
      video.currentTime = 0;
      setVideoCurrentTime(0);
      captureVideoFrame();

      recorder.start(250);
      const drawTimer = window.setInterval(() => {
        exportCtx.clearRect(0, 0, exportCanvas.width, exportCanvas.height);
        exportCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, exportCanvas.width, exportCanvas.height);
      }, 33);

      try {
        await video.play();
      } catch {
        // If autoplay policy or runtime blocks playback, abort export cleanly.
        if (recorder.state !== "inactive") recorder.stop();
        window.clearInterval(drawTimer);
        window.alert("Impossibile avviare la riproduzione durante l'export.");
        return;
      }
      setVideoPlaying(true);

      // Wait for end or fallback timeout (duration + 2s buffer).
      await new Promise<void>((resolve) => {
        const timeoutMs = Math.max(3000, Math.ceil((video.duration || 0) * 1000) + 2000);
        const timeout = window.setTimeout(() => resolve(), timeoutMs);
        const finish = () => {
          window.clearTimeout(timeout);
          resolve();
        };
        video.addEventListener("ended", finish, { once: true });
      });

      setVideoPlaying(false);
      video.pause();
      window.clearInterval(drawTimer);

      await new Promise<void>((resolve) => {
        recorder.onstop = () => resolve();
        if (recorder.state !== "inactive") recorder.stop();
        else resolve();
      });

      if (chunks.length === 0) {
        window.alert("Export fallito: nessun frame registrato.");
        return;
      }

      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const base = (videoName || "dither-video").replace(/\.[^/.]+$/, "").replace(/\W+/g, "_");
      a.download = `${base}-dither.mp4`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setVideoExporting(false);
    }
  }

  function swipePulseDeck(direction: "left" | "right", applyPreset: boolean) {
    if (pulseSwipeActive) return;
    setPulseSwipeDirection(direction);
    setPulseSwipeActive(true);
    window.setTimeout(() => {
      if (applyPreset) setAlgo(pulseDeckItem.base);
      setPulseDeckIndex((i) => i + 1);
      setPulseSwipeActive(false);
      setPulseSwipeDirection(null);
    }, 220);
  }

  useEffect(() => {
    if (!videoPlaying) return;
    const timer = window.setInterval(() => {
      const video = videoElement.current;
      if (!video) return;
      setVideoCurrentTime(video.currentTime);
      captureVideoFrame();
      if (video.ended) setVideoPlaying(false);
    }, 80);
    return () => window.clearInterval(timer);
  }, [videoPlaying, videoBrightness, videoContrast, videoSaturation, videoGamma, videoHighlights, videoShadows, videoTemperature, videoPixelSize]);

  useEffect(() => {
    if (activeView === "Video" && videoUrl) captureVideoFrame();
  }, [videoBrightness, videoContrast, videoSaturation, videoGamma, videoHighlights, videoShadows, videoTemperature, videoPixelSize, activeView, videoUrl]);

  const filteredPalettes = paletteOptions.filter((p) => {
    if (category !== "All" && p.category !== category) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const fileSizeKb = source
    ? ((source.width * source.height * bitDepth) / 8 / 1024).toFixed(2)
    : "0";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-sidebar">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-cream/15 text-cream">
            <Box className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Dither Forge</h1>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-6 text-sm">
          <SidebarSection label="Workspace">
            <NavItem icon={Pencil} label="Editor" active={activeView === "Editor"} onClick={() => setActiveView("Editor")} />
            <NavItem icon={Clapperboard} label="Video Workspace" active={activeView === "Video"} onClick={() => setActiveView("Video")} />
            <NavItem icon={Layers} label="Batch Processor" active={activeView === "Batch Processor"} onClick={() => { setActiveView("Batch Processor"); openComingSoon("Batch Processor"); }} />
            <NavItem icon={ImageIcon} label="Gallery" active={activeView === "Gallery"} onClick={() => { setActiveView("Gallery"); openComingSoon("Gallery"); }} />
            <NavItem icon={Share2} label="Social" active={activeView === "Social"} onClick={() => setActiveView("Social")} />
          </SidebarSection>
          <SidebarSection label="Dither">
            <NavItem icon={Sliders} label="Algorithms" active={activeView === "Algorithms" || dialog === "algorithmWarning" || dialog === "algorithmGuide"} onClick={openAlgorithmLab} />
            <NavItem icon={PaletteIcon} label="Palettes" active={activeView === "Palettes"} onClick={() => setActiveView("Palettes")} />
          </SidebarSection>
          <SidebarSection label="Tools">
            <NavItem icon={GitCompare} label="Compare" active={compareMode} onClick={() => setCompareMode((v) => !v)} />
            <NavItem icon={Monitor} label="Preview (CRT)" active={activeView === "CRT" || crtPreview} onClick={() => setActiveView("CRT")} />
            <NavItem icon={Download} label="Export" onClick={() => setDialog("export")} />
          </SidebarSection>
          <SidebarSection label="Settings">
            <NavItem icon={Settings} label="Preferences" onClick={() => setDialog("preferences")} />
            <NavItem icon={Keyboard} label="Keyboard Shortcuts" onClick={() => setDialog("shortcuts")} />
            <NavItem icon={Info} label="About" onClick={() => setDialog("about")} />
          </SidebarSection>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Toolbar */}
        <header className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-1">
            <ToolButton icon={Home} />
            <ToolButton icon={Redo2} />
            <ToolButton icon={Undo2} />
            <div className="ml-2 flex items-center gap-1 rounded-md border border-border bg-panel px-2 py-1 text-xs">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="bg-transparent pr-1 text-xs outline-none"
              >
                {[25, 50, 75, 100, 150, 200, 400].map((z) => <option key={z} value={z}>{z}%</option>)}
              </select>
            </div>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setZoom(100)}>Fit</Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={() => setSource(makeSampleImage())}>
              <FilePlus2 className="h-3.5 w-3.5" /> New Project
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => (activeView === "Video" ? videoInput.current?.click() : fileInput.current?.click())}
            >
              <FolderOpen className="h-3.5 w-3.5" /> {activeView === "Video" ? "Open Video" : "Open"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => (activeView === "Video" ? setDialog("videoExport") : exportImage())}
            >
              <Save className="h-3.5 w-3.5" /> Save
            </Button>
            <ToolButton icon={dark ? Sun : Moon} onClick={() => setDark((v) => !v)} />
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])}
            />
            <input
              ref={videoInput}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && loadVideo(e.target.files[0])}
            />
          </div>
        </header>

        {/* Workspace */}
        {activeView === "Algorithms" ? (
          <div className="flex-1 overflow-y-auto p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-cream">Dither / Algorithms</div>
                <h2 className="mt-1 text-2xl font-semibold">Algorithm Lab</h2>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  Crea un algoritmo custom selezionabile partendo da un preset reale e salvando una blueprint tecnica riutilizzabile.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setActiveView("Editor")}>Torna all'Editor</Button>
            </div>

            <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
              <div className="space-y-5">
                {showEditorGuide && (
                  <Panel title="TECHNICAL GUIDE">
                    <div className="grid gap-3 text-sm text-muted-foreground lg:grid-cols-2">
                      <div className="rounded-md border border-border bg-panel/50 p-3">
                        <div className="mb-1 font-medium text-foreground">Diffusion vs Ordered</div>
                        Usa preset come Floyd–Steinberg, Stucki o Sierra per immagini fotografiche e gradienti morbidi. Usa Bayer, Halftone o Threshold per pattern più grafici e leggibili su palette ridotte.
                      </div>
                      <div className="rounded-md border border-border bg-panel/50 p-3">
                        <div className="mb-1 font-medium text-foreground">Pattern Size</div>
                        Valori piccoli producono texture fitte e pixel-art friendly. Valori alti rendono celle più visibili, utili per halftone, posterizzazione e look stampa.
                      </div>
                      <div className="rounded-md border border-border bg-panel/50 p-3">
                        <div className="mb-1 font-medium text-foreground">Threshold Bias</div>
                        Bias negativo scurisce e conserva ombre. Bias positivo apre le alte luci e riduce l'inchiostro visivo. Usalo per bilanciare palette molto contrastate.
                      </div>
                      <div className="rounded-md border border-border bg-panel/50 p-3">
                        <div className="mb-1 font-medium text-foreground">Diffusion Amount</div>
                        Sotto il 40% ottieni look più puliti e posterizzati. Sopra il 70% aumenti dettaglio percepito, ma anche grana e instabilità nei bordi.
                      </div>
                      <div className="rounded-md border border-border bg-panel/50 p-3 lg:col-span-2">
                        <div className="mb-1 font-medium text-foreground">Uso esperto</div>
                        `Diffusion Weight` controlla quanta energia d'errore viene propagata. `Tonal Protection` limita danni su ombre/luci. `Edge Preservation` evita bordi impastati. `Grain Shaping` rende la grana più organica o più digitale.
                      </div>
                    </div>
                    <label className="mt-4 flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                      <Checkbox
                        checked={false}
                        onCheckedChange={(v) => {
                          if (v === true) {
                            setShowEditorGuide(false);
                            if (typeof window !== "undefined") window.localStorage.setItem(ALGORITHM_GUIDE_STORAGE_KEY, "true");
                          }
                        }}
                      />
                      Non mostrare più questa guida
                    </label>
                  </Panel>
                )}

                <Panel title="ALGORITHM BUILDER">
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Algorithm Name">
                      <Input value={customAlgorithmName} onChange={(e) => setCustomAlgorithmName(e.target.value)} />
                    </Field>
                    <Field label="Starting Preset">
                      <Select value={customAlgorithmBase} onValueChange={(v) => setCustomAlgorithmBase(v as Algorithm)}>
                        <SelectTrigger className="h-9 bg-panel"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {ALGORITHMS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Pattern Size" value={`${patternSize}×${patternSize}`}>
                      <Slider value={[patternSize]} onValueChange={(v) => setPatternSize(v[0])} min={2} max={16} step={1} />
                    </Field>
                    <Field label="Threshold Bias" value={`${thresholdBias}`}>
                      <Slider value={[thresholdBias]} onValueChange={(v) => setThresholdBias(v[0])} min={-100} max={100} step={1} />
                    </Field>
                    <Field label="Diffusion Amount" value={`${diffusionAmount}%`}>
                      <Slider value={[diffusionAmount]} onValueChange={(v) => setDiffusionAmount(v[0])} max={100} step={1} />
                    </Field>
                    <label className="flex cursor-pointer items-center justify-between rounded-md border border-border bg-panel/50 p-3 text-sm">
                      <div>
                        <div className="font-medium">Uso esperto</div>
                        <div className="text-xs text-muted-foreground">Mostra controlli professionali di shaping.</div>
                      </div>
                      <Checkbox checked={expertAlgorithmMode} onCheckedChange={(v) => setExpertAlgorithmMode(v === true)} />
                    </label>
                  </div>
                  {expertAlgorithmMode && (
                    <div className="mt-5 grid gap-5 rounded-md border border-border bg-panel/50 p-4 md:grid-cols-2">
                      <Field label="Diffusion Weight" value={`${diffusionWeight}%`}>
                        <Slider value={[diffusionWeight]} onValueChange={(v) => setDiffusionWeight(v[0])} max={100} step={1} />
                      </Field>
                      <Field label="Tonal Protection" value={`${tonalProtection}%`}>
                        <Slider value={[tonalProtection]} onValueChange={(v) => setTonalProtection(v[0])} max={100} step={1} />
                      </Field>
                      <Field label="Edge Preservation" value={`${edgePreservation}%`}>
                        <Slider value={[edgePreservation]} onValueChange={(v) => setEdgePreservation(v[0])} max={100} step={1} />
                      </Field>
                      <Field label="Grain Shaping" value={`${grainShaping}%`}>
                        <Slider value={[grainShaping]} onValueChange={(v) => setGrainShaping(v[0])} max={100} step={1} />
                      </Field>
                    </div>
                  )}
                </Panel>
              </div>

              <aside className="space-y-5">
                <Panel title="CUSTOM BLUEPRINT">
                  <div className="text-xs">
                    <Info2 label="Name" value={customAlgorithmName || "Untitled"} />
                    <Info2 label="Base" value={customAlgorithmBase} />
                    <Info2 label="Pattern" value={`${patternSize}×${patternSize}`} />
                    <Info2 label="Bias" value={String(thresholdBias)} />
                    <Info2 label="Diffusion" value={`${diffusionAmount}%`} />
                    <Info2 label="Expert" value={expertAlgorithmMode ? "Enabled" : "Off"} />
                    {expertAlgorithmMode && (
                      <>
                        <Info2 label="Weight" value={`${diffusionWeight}%`} />
                        <Info2 label="Tonal" value={`${tonalProtection}%`} />
                        <Info2 label="Edges" value={`${edgePreservation}%`} />
                        <Info2 label="Grain" value={`${grainShaping}%`} />
                      </>
                    )}
                    <Button className="mt-3 w-full" size="sm" onClick={saveCustomAlgorithm}>
                      <Save className="h-4 w-4" /> Salva algoritmo
                    </Button>
                    {algorithmSaved && (
                      <div className="mt-2 rounded border border-cream/30 bg-cream/10 p-2 text-center text-cream">
                        Salvato e aggiunto al menu.
                      </div>
                    )}
                  </div>
                </Panel>
                <Panel title="SAVED CUSTOMS">
                  <div className="space-y-2 text-xs">
                    {customAlgorithms.length === 0 ? (
                      <div className="text-muted-foreground">Nessun algoritmo custom salvato.</div>
                    ) : customAlgorithms.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => setAlgo(item.name)}
                        className={cn("w-full rounded border p-2 text-left", algo === item.name ? "border-cream bg-cream/5" : "border-border bg-panel/50 hover:border-cream/40")}
                      >
                        <div className="font-medium">{item.name}</div>
                        <div className="text-muted-foreground">{item.base} · {item.patternSize}×{item.patternSize}</div>
                      </button>
                    ))}
                  </div>
                </Panel>
              </aside>
            </div>
          </div>
        ) : activeView === "Palettes" ? (
          <div className="flex-1 overflow-y-auto p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-cream">Dither / Palettes</div>
                <h2 className="mt-1 text-2xl font-semibold">Custom Palette</h2>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  Esplora le palette disponibili, scegli quella attiva e prepara lo spazio per costruire palette custom riutilizzabili.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setActiveView("Editor")}>Torna all'Editor</Button>
            </div>

            <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
              <div className="space-y-5">
                <Panel title="PALETTE LIBRARY">
                  <div className="flex flex-wrap items-center gap-2 pb-4">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={cn(
                          "rounded-md px-3 py-1 text-xs transition-colors",
                          category === c ? "bg-cream text-cream-foreground" : "bg-panel text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {c === "Retro Gaming" && "🎮 "}{c}
                      </button>
                    ))}
                    <div className="ml-auto flex items-center gap-2 rounded-md border border-border bg-panel px-2">
                      <Search className="h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search palettes..."
                        className="h-8 w-56 border-0 bg-transparent p-0 text-xs focus-visible:ring-0"
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredPalettes.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => setPaletteName(p.name)}
                        className={cn(
                          "group rounded-md border p-3 text-left transition-colors",
                          paletteName === p.name ? "border-cream/60 bg-cream/5" : "border-border bg-panel hover:border-cream/40",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium">{p.name}</div>
                            <div className="text-[11px] text-muted-foreground">{p.category} · {p.colors.length} colors</div>
                          </div>
                          <Star className={cn("h-3.5 w-3.5", favorites.has(p.name) ? "fill-cream text-cream" : "text-muted-foreground")} />
                        </div>
                        <div className="mt-3 flex h-8 overflow-hidden rounded">
                          {p.colors.slice(0, 12).map((c, i) => (
                            <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </Panel>
              </div>

              <aside className="space-y-5">
                <Panel title="ACTIVE PALETTE">
                  <div className="text-xs">
                    <div
                      className="mb-3 h-28 rounded-md border border-border"
                      style={{ background: `linear-gradient(135deg, ${palette.colors.slice(0, 12).join(", ")})` }}
                    />
                    <Info2 label="Name" value={palette.name} />
                    <Info2 label="Category" value={palette.category} />
                    <Info2 label="Colors" value={String(palette.colors.length)} />
                    <Info2 label="Bit Depth" value={paletteFixedBitDepth ? `${paletteFixedBitDepth} Bit locked` : "Flexible"} />
                  </div>
                </Panel>
                <Panel title="CUSTOM PALETTE">
                  <div className="space-y-4 text-xs">
                    <Field label="Palette Name">
                      <Input value={customPaletteName} onChange={(e) => setCustomPaletteName(e.target.value)} />
                    </Field>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-foreground">Colors</span>
                        <Button size="sm" variant="ghost" onClick={addCustomPaletteColor}>Add Color</Button>
                      </div>
                      <div className="space-y-2">
                        {customPaletteColors.map((color, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="color"
                              value={color}
                              onChange={(e) => updateCustomPaletteColor(index, e.target.value)}
                              className="h-9 w-10 cursor-pointer rounded border border-border bg-panel"
                            />
                            <Input value={color} onChange={(e) => updateCustomPaletteColor(index, e.target.value)} className="h-9 font-mono text-xs" />
                            <Button size="sm" variant="ghost" onClick={() => removeCustomPaletteColor(index)} disabled={customPaletteColors.length <= 2}>Remove</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-md border border-border">
                      <div className="flex h-10">
                        {customPaletteColors.map((color, index) => (
                          <div key={index} className="flex-1" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                    </div>
                    <Button className="w-full" size="sm" onClick={saveCustomPalette}>
                      <Save className="h-4 w-4" /> Salva palette
                    </Button>
                    {paletteSaved && (
                      <div className="rounded border border-cream/30 bg-cream/10 p-2 text-center text-cream">
                        Palette salvata e selezionata.
                      </div>
                    )}
                  </div>
                </Panel>
                <Panel title="SAVED CUSTOMS">
                  <div className="space-y-2 text-xs">
                    {customPalettes.length === 0 ? (
                      <div className="text-muted-foreground">Nessuna palette custom salvata.</div>
                    ) : customPalettes.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => setPaletteName(item.name)}
                        className={cn("w-full rounded border p-2 text-left", paletteName === item.name ? "border-cream bg-cream/5" : "border-border bg-panel/50 hover:border-cream/40")}
                      >
                        <div className="font-medium">{item.name}</div>
                        <div className="mt-2 flex h-4 overflow-hidden rounded">
                          {item.colors.map((color, index) => (
                            <div key={index} className="flex-1" style={{ backgroundColor: color }} />
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </Panel>
              </aside>
            </div>
          </div>
        ) : activeView === "CRT" ? (
          <div className="flex-1 overflow-y-auto p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-cream">Tools / Preview CRT</div>
                <h2 className="mt-1 text-2xl font-semibold">CRT Effects Lab</h2>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  Simula un monitor CRT con scanline, vignette, curvatura dello schermo, glow fosfori, aberrazione cromatica e rumore analogico.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setActiveView("Editor")}>Torna all'Editor</Button>
            </div>

            <div className="space-y-5">
              <Panel title="CRT PRESETS">
                <div className="grid gap-3 text-xs md:grid-cols-3">
                  <button className="rounded border border-border bg-panel/50 p-3 text-left hover:border-cream/40" onClick={() => { setCrtScanlines(45); setCrtVignette(80); setCrtCurvature(8); setCrtGlow(45); setCrtChromatic(10); setCrtNoise(6); setCrtPreview(true); }}>
                    <div className="font-medium text-foreground">Arcade Cabinet</div>
                    <div className="mt-1 text-muted-foreground">Scanline marcate, glow medio e curvatura da cabinato.</div>
                  </button>
                  <button className="rounded border border-border bg-panel/50 p-3 text-left hover:border-cream/40" onClick={() => { setCrtScanlines(25); setCrtVignette(55); setCrtCurvature(4); setCrtGlow(25); setCrtChromatic(6); setCrtNoise(12); setCrtPreview(true); }}>
                    <div className="font-medium text-foreground">Consumer TV</div>
                    <div className="mt-1 text-muted-foreground">Look domestico più morbido con rumore analogico leggero.</div>
                  </button>
                  <button className="rounded border border-border bg-panel/50 p-3 text-left hover:border-cream/40" onClick={() => { setCrtScanlines(60); setCrtVignette(90); setCrtCurvature(14); setCrtGlow(70); setCrtChromatic(22); setCrtNoise(18); setCrtPreview(true); }}>
                    <div className="font-medium text-foreground">Worn Broadcast</div>
                    <div className="mt-1 text-muted-foreground">Distorsione più aggressiva, glow forte e shift cromatico visibile.</div>
                  </button>
                </div>
              </Panel>

              <Panel title="EFFECT DIFFERENCES">
                <div className="grid gap-3 text-xs md:grid-cols-3">
                  {[
                    ["Scanline Focus", "Aumenta linee orizzontali e look pixel-through-glass.", 60, 45, 3, 20, 5, 4],
                    ["Curved Glass", "Evidenzia curvatura, vignette e profondità del tubo.", 30, 85, 18, 35, 8, 8],
                    ["Analog Drift", "Mostra glow, aberrazione cromatica e rumore del segnale.", 35, 65, 8, 75, 28, 24],
                  ].map(([title, description, scan, vignette, curve, glow, chroma, analogNoise]) => (
                    <button
                      key={title}
                      className="overflow-hidden rounded-md border border-border bg-panel/50 text-left hover:border-cream/40"
                      onClick={() => {
                        setCrtScanlines(Number(scan)); setCrtVignette(Number(vignette)); setCrtCurvature(Number(curve));
                        setCrtGlow(Number(glow)); setCrtChromatic(Number(chroma)); setCrtNoise(Number(analogNoise)); setCrtPreview(true);
                      }}
                    >
                      <div
                        className="h-24"
                        style={{
                          backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,${Number(scan) / 100}) 0px, rgba(0,0,0,${Number(scan) / 100}) 1px, transparent 1px, transparent 4px), radial-gradient(circle, ${palette.colors[1] ?? "#9bbc0f"}, ${palette.colors[0] ?? "#0f380f"})`,
                          boxShadow: `inset 0 0 ${Number(vignette)}px rgba(0,0,0,0.85), 0 0 ${Number(glow) / 2}px rgba(154,188,15,0.35)`,
                          transform: `skewX(${Number(curve) / 12}deg)`,
                        }}
                      />
                      <div className="p-3">
                        <div className="font-medium text-foreground">{title}</div>
                        <div className="mt-1 text-muted-foreground">{description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </Panel>

              <Panel title="CRT PREVIEW">
                <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-md bg-black/40 p-5">
                  <div
                    className="relative overflow-hidden rounded-xl border border-cream/20 bg-black p-2"
                    style={{
                      transform: `perspective(900px) rotateX(${crtCurvature / 8}deg)`,
                      boxShadow: `0 0 ${crtGlow}px rgba(154,188,15,0.35), inset 0 0 ${crtVignette}px rgba(0,0,0,0.85)`,
                    }}
                  >
                    <canvas
                      ref={(el) => {
                        if (el && previewCanvas.current) {
                          el.width = previewCanvas.current.width;
                          el.height = previewCanvas.current.height;
                          const ctx = el.getContext("2d");
                          if (ctx) ctx.drawImage(previewCanvas.current, 0, 0);
                        }
                      }}
                      className="block max-h-[360px] max-w-full"
                      style={{
                        imageRendering: "pixelated",
                        transform: `scale(${zoom / 100}) skewX(${crtCurvature / 20}deg)`,
                        filter: `saturate(${1 + crtGlow / 180}) contrast(${1 + crtGlow / 260}) drop-shadow(${crtChromatic / 6}px 0 rgba(255,0,0,0.32)) drop-shadow(-${crtChromatic / 6}px 0 rgba(0,120,255,0.28))`,
                        transformOrigin: "center",
                      }}
                    />
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,${crtScanlines / 100}) 0px, rgba(0,0,0,${crtScanlines / 100}) 1px, transparent 1px, transparent 3px), radial-gradient(circle at center, transparent 45%, rgba(0,0,0,${crtVignette / 100}) 100%)`,
                        mixBlendMode: "multiply",
                      }}
                    />
                    <div
                      className="pointer-events-none absolute inset-0 opacity-40"
                      style={{
                        backgroundImage: `radial-gradient(circle at 30% 20%, rgba(255,255,255,${crtGlow / 220}), transparent 28%), repeating-linear-gradient(90deg, rgba(255,255,255,${crtNoise / 400}) 0px, transparent 1px, transparent 4px)`,
                      }}
                    />
                  </div>
                </div>
              </Panel>

              <Panel
                title="CRT CONTROLS"
                right={
                  <button onClick={() => setShowCrtControls((v) => !v)} className="flex items-center gap-1 rounded border border-border px-2 py-1 text-xs hover:bg-accent">
                    {showCrtControls ? "Nascondi" : "Mostra"} <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showCrtControls && "rotate-180")} />
                  </button>
                }
              >
                {showCrtControls ? (
                  <div className="space-y-4">
                    <Row label="Enable CRT" trailing={crtPreview ? "On" : "Off"}>
                      <Switch checked={crtPreview} onCheckedChange={setCrtPreview} />
                    </Row>
                    <Field label="Scanlines" value={`${crtScanlines}%`}>
                      <Slider value={[crtScanlines]} onValueChange={(v) => setCrtScanlines(v[0])} max={100} step={1} />
                    </Field>
                    <Field label="Screen Curvature" value={`${crtCurvature}%`}>
                      <Slider value={[crtCurvature]} onValueChange={(v) => setCrtCurvature(v[0])} max={30} step={1} />
                    </Field>
                    <Field label="Vignette" value={`${crtVignette}%`}>
                      <Slider value={[crtVignette]} onValueChange={(v) => setCrtVignette(v[0])} max={100} step={1} />
                    </Field>
                    <Field label="Phosphor Glow" value={`${crtGlow}%`}>
                      <Slider value={[crtGlow]} onValueChange={(v) => setCrtGlow(v[0])} max={100} step={1} />
                    </Field>
                    <Field label="Chromatic Shift" value={`${crtChromatic}%`}>
                      <Slider value={[crtChromatic]} onValueChange={(v) => setCrtChromatic(v[0])} max={40} step={1} />
                    </Field>
                    <Field label="Analog Noise" value={`${crtNoise}%`}>
                      <Slider value={[crtNoise]} onValueChange={(v) => setCrtNoise(v[0])} max={50} step={1} />
                    </Field>
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
                    Controlli nascosti. Usa la freccetta per abbassare la sezione e modificare manualmente ogni parametro CRT.
                  </div>
                )}
              </Panel>
            </div>
          </div>
        ) : activeView === "Video" ? (
          <div className="grid flex-1 grid-cols-[1fr_320px] overflow-hidden">
            <div className="flex flex-col overflow-y-auto p-5">
              <div className="grid flex-1 grid-cols-2 gap-5 overflow-hidden">
                <Panel title="VIDEO FRAME">
                  <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-md bg-black/30 p-3">
                    <canvas
                      ref={sourceCanvas}
                      className="max-h-full max-w-full"
                      style={{ imageRendering: "pixelated", transform: `scale(${zoom / 100})` }}
                    />
                  </div>
                  <div className="px-1 pt-2 text-xs text-muted-foreground">
                    {videoName ? `${videoName} · ${formatTime(videoCurrentTime)} / ${formatTime(videoDuration)}` : "Carica un video per iniziare"}
                  </div>
                </Panel>
                <Panel
                  title="DITHER PREVIEW"
                  right={
                    <Select value={algo} onValueChange={setAlgo}>
                      <SelectTrigger className="h-7 w-44 bg-panel text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {algorithmOptions.map((a) => <SelectItem key={a} value={a} className="text-xs">{a}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  }
                >
                  <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-md bg-black/30 p-3">
                    <canvas
                      ref={previewCanvas}
                      className="block max-h-full max-w-full"
                      style={{ imageRendering: "pixelated", transform: `scale(${zoom / 100})`, transformOrigin: "center" }}
                    />
                  </div>
                </Panel>
              </div>

              <Panel className="mt-5" title="VIDEO TIMELINE">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const video = videoElement.current;
                        if (!video) return;
                        if (videoPlaying) {
                          video.pause();
                          setVideoPlaying(false);
                        } else {
                          void video.play();
                          setVideoPlaying(true);
                        }
                      }}
                      className="grid h-8 w-8 place-items-center rounded-md border border-border bg-panel text-muted-foreground hover:text-foreground"
                    >
                      {videoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <div className="w-24 text-xs text-muted-foreground">{formatTime(videoCurrentTime)}</div>
                    <input
                      type="range"
                      min={0}
                      max={Math.max(videoDuration, 0.001)}
                      step={0.01}
                      value={Math.min(videoCurrentTime, videoDuration || 0)}
                      onChange={(e) => {
                        const next = Number(e.target.value);
                        const video = videoElement.current;
                        if (!video) return;
                        video.currentTime = next;
                        setVideoCurrentTime(next);
                        captureVideoFrame();
                      }}
                      className="h-2 flex-1 cursor-pointer accent-[hsl(var(--cream))]"
                    />
                    <div className="w-24 text-right text-xs text-muted-foreground">{formatTime(videoDuration)}</div>
                  </div>
                  <div className="rounded-md border border-border/70 bg-panel/40 p-2 text-xs text-muted-foreground">
                    Stesso workflow dell'Editor, ma con timeline video per scrub frame-by-frame e preview dithering in tempo reale.
                  </div>
                </div>
              </Panel>

              <Panel className="mt-5" title="PALETTE LIBRARY">
                <div className="flex items-center gap-2 pb-3">
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={cn(
                          "rounded-md px-3 py-1 text-xs transition-colors",
                          category === c
                            ? "bg-cream text-cream-foreground"
                            : "bg-panel text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {c === "Retro Gaming" && "🎮 "}{c}
                      </button>
                    ))}
                  </div>
                  <div className="ml-auto flex items-center gap-2 rounded-md border border-border bg-panel px-2">
                    <Search className="h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search palettes..."
                      className="h-7 w-44 border-0 bg-transparent p-0 text-xs focus-visible:ring-0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 overflow-y-auto md:grid-cols-3 lg:grid-cols-5">
                  {filteredPalettes.map((p) => (
                    <button
                      key={`video-${p.name}`}
                      onClick={() => setPaletteName(p.name)}
                      className={cn(
                        "group rounded-md border p-2 text-left transition-colors",
                        paletteName === p.name
                          ? "border-cream/60 bg-cream/5"
                          : "border-border bg-panel hover:border-cream/40",
                      )}
                    >
                      <div className="text-xs font-medium">{p.name}</div>
                      <div className="text-[10px] text-muted-foreground">{p.colors.length} colors</div>
                      <div className="mt-2 flex h-4 overflow-hidden rounded">
                        {p.colors.slice(0, 12).map((c, i) => (
                          <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </Panel>

              {videoUrl && (
                <video
                  ref={videoElement}
                  src={videoUrl}
                  className="hidden"
                  onLoadedMetadata={(e) => {
                    setVideoDuration(e.currentTarget.duration || 0);
                    setVideoCurrentTime(0);
                    captureVideoFrame();
                  }}
                  onTimeUpdate={(e) => {
                    setVideoCurrentTime(e.currentTarget.currentTime);
                  }}
                  onSeeked={captureVideoFrame}
                  onEnded={() => setVideoPlaying(false)}
                />
              )}
            </div>

            <aside className="flex flex-col gap-4 overflow-y-auto border-l border-border p-5">
              <Field label="Algorithm">
                <Select value={algo} onValueChange={setAlgo}>
                  <SelectTrigger className="h-9 bg-panel"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {algorithmOptions.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Palette">
                <Select value={paletteName} onValueChange={setPaletteName}>
                  <SelectTrigger className="h-9 bg-panel"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {paletteOptions.map((p) => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Bit Depth">
                <div className="grid grid-cols-5 gap-1 rounded-md border border-border bg-panel p-1">
                  {([1, 2, 4, 8, 16] as const).map((b) => (
                    <button
                      key={`video-bit-${b}`}
                      disabled={paletteFixedBitDepth !== null && b !== paletteFixedBitDepth}
                      onClick={() => setBitDepth(b)}
                      className={cn(
                        "rounded px-2 py-1 text-xs transition-colors",
                        bitDepth === b && "bg-cream text-cream-foreground",
                        bitDepth !== b && "text-muted-foreground hover:text-foreground",
                        paletteFixedBitDepth !== null && b !== paletteFixedBitDepth && "cursor-not-allowed opacity-30 hover:text-muted-foreground",
                      )}
                    >
                      {b} Bit
                    </button>
                  ))}
                </div>
              </Field>
              <div className="rounded-md border border-border bg-panel/50 p-3">
                <div className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Video Tone</div>
                <Field label="Brightness" value={`${videoBrightness}%`}>
                  <Slider value={[videoBrightness]} onValueChange={(v) => setVideoBrightness(v[0])} min={50} max={150} step={1} />
                </Field>
                <Field label="Contrast" value={`${videoContrast}%`}>
                  <Slider value={[videoContrast]} onValueChange={(v) => setVideoContrast(v[0])} min={50} max={170} step={1} />
                </Field>
                <Field label="Saturation" value={`${videoSaturation}%`}>
                  <Slider value={[videoSaturation]} onValueChange={(v) => setVideoSaturation(v[0])} min={0} max={180} step={1} />
                </Field>
                <Field label="Gamma" value={`${videoGamma}%`}>
                  <Slider value={[videoGamma]} onValueChange={(v) => setVideoGamma(v[0])} min={60} max={180} step={1} />
                </Field>
                <Field label="Highlights" value={`${videoHighlights > 0 ? "+" : ""}${videoHighlights}%`}>
                  <Slider value={[videoHighlights]} onValueChange={(v) => setVideoHighlights(v[0])} min={-40} max={40} step={1} />
                </Field>
                <Field label="Shadows" value={`${videoShadows > 0 ? "+" : ""}${videoShadows}%`}>
                  <Slider value={[videoShadows]} onValueChange={(v) => setVideoShadows(v[0])} min={-40} max={40} step={1} />
                </Field>
                <Field label="Temperature" value={`${videoTemperature > 0 ? "+" : ""}${videoTemperature}%`}>
                  <Slider value={[videoTemperature]} onValueChange={(v) => setVideoTemperature(v[0])} min={-50} max={50} step={1} />
                </Field>
                <Field label="Pixel Size" value={`${videoPixelSize}x`}>
                  <Slider value={[videoPixelSize]} onValueChange={(v) => setVideoPixelSize(v[0])} min={1} max={8} step={1} />
                </Field>
              </div>
              <Field label="Intensity" value={`${intensity}%`}>
                <Slider value={[intensity]} onValueChange={(v) => setIntensity(v[0])} max={100} step={1} />
              </Field>
              <Field label="Noise" value={`${noise}%`}>
                <Slider value={[noise]} onValueChange={(v) => setNoise(v[0])} max={100} step={1} />
              </Field>
              <Field label="Sharpen" value={`${sharpen}%`}>
                <Slider value={[sharpen]} onValueChange={(v) => setSharpen(v[0])} max={100} step={1} />
              </Field>
              <div className="rounded-md border border-border bg-panel/50 p-3 text-xs">
                <Info2 label="Clip" value={videoName || "No video"} />
                <Info2 label="Time" value={`${formatTime(videoCurrentTime)} / ${formatTime(videoDuration)}`} />
                <Info2 label="Algorithm" value={algo} />
                <Info2 label="Palette" value={palette.name} />
                <Info2 label="Brightness" value={`${videoBrightness}%`} />
                <Info2 label="Contrast" value={`${videoContrast}%`} />
                <Info2 label="Pixel Size" value={`${videoPixelSize}x`} />
              </div>
              <button
                onClick={() => setDialog("videoExport")}
                disabled={!videoUrl || videoExporting}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-semibold transition-opacity",
                  !videoUrl || videoExporting
                    ? "cursor-not-allowed bg-panel text-muted-foreground opacity-70"
                    : "bg-cream text-cream-foreground hover:opacity-90",
                )}
              >
                <Download className="h-4 w-4" />
                {videoExporting ? "Exporting Video..." : "EXPORT VIDEO (.MP4)"}
              </button>
            </aside>
          </div>
        ) : activeView === "Social" ? (
          <div className="relative flex-1 overflow-y-auto p-5">
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute -left-24 top-12 h-56 w-56 rounded-full bg-cream/10 blur-3xl" />
              <div className="absolute right-8 top-36 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
              <div className="absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
            </div>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-cream">Workspace / Social</div>
                <h2 className="mt-1 text-2xl font-semibold">DitherVerse</h2>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  Scopri algoritmi creati dalla community, cerca per colore dominante o trova preset compatibili con il tuo algoritmo preferito.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setActiveView("Editor")}>Torna all'Editor</Button>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {["PulseDeck", "Color Search", "Algorithm Search"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSocialTab(tab)}
                  className={cn("rounded-md px-3 py-1.5 text-xs transition-colors", socialTab === tab ? "bg-cream text-cream-foreground" : "bg-panel text-muted-foreground hover:text-foreground")}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] text-cream backdrop-blur">PulseDeck Mode</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur">#{pulseDeckItem.tags[0]}</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur">{pulseDeckItem.base}</span>
            </div>

            {socialTab === "PulseDeck" && (
              <div className="space-y-5">
                <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
                  <Panel title="PULSEDECK">
                    <div className="mx-auto max-w-lg">
                    <div className="mb-3 rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur">
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Deck progress</span>
                        <span className="font-medium text-foreground">{pulseDeckProgress}/{SOCIAL_DECK_SIZE}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-cream via-orange-300 to-pink-400 transition-all duration-300" style={{ width: `${pulseDeckProgressPct}%` }} />
                      </div>
                    </div>
                    <div className="relative rounded-[1.75rem] border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-3 shadow-2xl shadow-black/40 backdrop-blur-md">
                      <div className="pointer-events-none absolute -inset-5 rounded-[2rem] border border-cream/10 opacity-70" />
                      <div className="pointer-events-none absolute inset-x-8 top-8 h-12 rounded-full bg-cream/20 blur-2xl" />
                      <div className="pointer-events-none absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-wider text-white/80 backdrop-blur">
                        Swipe Deck
                      </div>
                      <div className="relative h-[36.5rem] [perspective:1100px]">
                        <div className="pointer-events-none absolute inset-x-6 top-12 rounded-[1.25rem] border border-white/10 bg-white/5 p-2 opacity-35 blur-md">
                          <div
                            className="h-[21rem] rounded-[0.9rem] scale-[0.96]"
                            style={{
                              backgroundImage: `radial-gradient(circle at 25% 20%, ${pulseDeckDepthItem.color}, transparent 30%), repeating-linear-gradient(45deg, ${pulseDeckDepthItem.color} 0 2px, transparent 2px 9px), linear-gradient(135deg, #050505, #202020)`,
                            }}
                          />
                        </div>
                        <div className="pointer-events-none absolute inset-x-3 top-6 rounded-[1.25rem] border border-white/15 bg-white/5 p-2 opacity-60 blur-[1.5px]">
                          <div
                            className="h-[21rem] rounded-[0.9rem] scale-[0.985]"
                            style={{
                              backgroundImage: `radial-gradient(circle at 25% 20%, ${pulseDeckNextItem.color}, transparent 30%), repeating-linear-gradient(45deg, ${pulseDeckNextItem.color} 0 2px, transparent 2px 9px), linear-gradient(135deg, #050505, #202020)`,
                            }}
                          />
                        </div>
                        <div
                          className={cn(
                            "absolute inset-x-0 top-0 overflow-hidden rounded-[1.25rem] border border-white/10 bg-background/80 backdrop-blur transition-all duration-200",
                            pulseSwipeActive && pulseSwipeDirection === "left" && "-translate-x-14 rotate-[-7deg] opacity-20",
                            pulseSwipeActive && pulseSwipeDirection === "right" && "translate-x-14 rotate-[7deg] opacity-20",
                          )}
                          style={{ transformStyle: "preserve-3d" }}
                        >
                          <div
                            className="relative h-[21rem]"
                            style={{
                              backgroundImage: `radial-gradient(circle at 25% 20%, ${pulseDeckItem.color}, transparent 30%), repeating-linear-gradient(45deg, ${pulseDeckItem.color} 0 2px, transparent 2px 9px), linear-gradient(135deg, #050505, #202020)`,
                            }}
                          >
                            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full border border-white/20 bg-white/10 blur-xl" />
                            <div className="pointer-events-none absolute -bottom-10 left-5 h-24 w-24 rounded-full bg-black/30 blur-2xl" />
                            <div className="flex h-full flex-col justify-between bg-gradient-to-t from-black/90 via-transparent to-black/30 p-5">
                              <div className="flex justify-between text-xs">
                                <span className="rounded-full border border-white/20 bg-black/35 px-3 py-1 text-cream backdrop-blur">Community preset</span>
                                <span className="rounded-full border border-white/20 bg-black/35 px-3 py-1 text-white backdrop-blur">{pulseDeckItem.likes} ♥</span>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-white">{pulseDeckItem.name}</div>
                                <div className="mt-1 text-sm text-white/70">by @{pulseDeckItem.author} · {pulseDeckItem.base}</div>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3 p-4">
                            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                              <div className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-muted-foreground">
                                Likes
                                <div className="mt-0.5 text-xs font-semibold text-foreground">{pulseDeckItem.likes}</div>
                              </div>
                              <div className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-muted-foreground">
                                Base
                                <div className="mt-0.5 truncate text-xs font-semibold text-foreground">{pulseDeckItem.base}</div>
                              </div>
                              <div className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-muted-foreground">
                                Tags
                                <div className="mt-0.5 text-xs font-semibold text-foreground">{pulseDeckItem.tags.length}</div>
                              </div>
                            </div>
                            <div className="flex flex-wrap justify-center gap-1">
                              {pulseDeckItem.tags.map((tag) => <span key={tag} className="rounded-full border border-white/10 bg-background/70 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur">#{tag}</span>)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-center gap-8">
                      <button
                        className="grid h-14 w-14 place-items-center rounded-full border border-border bg-panel text-muted-foreground shadow-lg transition hover:-translate-y-0.5 hover:border-red-400 hover:text-red-400"
                        onClick={() => swipePulseDeck("left", false)}
                      >
                        <X className="h-6 w-6" />
                      </button>
                      <button
                        className="grid h-16 w-16 place-items-center rounded-full bg-cream text-cream-foreground shadow-lg shadow-cream/30 transition hover:scale-105 hover:shadow-xl hover:shadow-cream/40"
                        onClick={() => swipePulseDeck("right", true)}
                      >
                        <Heart className="h-7 w-7 fill-current" />
                      </button>
                    </div>
                    <div className="mt-3 text-center text-xs text-muted-foreground">
                      Premi X per scartare o cuore per usare il preset base e passare alla prossima carta.
                    </div>
                    </div>
                  </Panel>
                  <aside className="space-y-5">
                    <Panel title="NEXT IN STACK">
                      <div className="rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur">
                        <div
                          className="h-36 rounded-lg"
                          style={{
                            backgroundImage: `radial-gradient(circle at 25% 20%, ${pulseDeckNextItem.color}, transparent 30%), repeating-linear-gradient(45deg, ${pulseDeckNextItem.color} 0 2px, transparent 2px 9px), linear-gradient(135deg, #050505, #202020)`,
                          }}
                        />
                        <div className="p-2">
                          <div className="truncate text-sm font-medium">{pulseDeckNextItem.name}</div>
                          <div className="text-[11px] text-muted-foreground">@{pulseDeckNextItem.author}</div>
                        </div>
                      </div>
                    </Panel>
                    <Panel title="QUICK ACTIONS">
                      <div className="space-y-2 text-xs">
                        <button className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-left text-muted-foreground transition hover:border-cream/40 hover:text-foreground">
                          Segui creator simili a @{pulseDeckItem.author}
                        </button>
                        <button className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-left text-muted-foreground transition hover:border-cream/40 hover:text-foreground">
                          Apri collezione #{pulseDeckItem.tags[0]}
                        </button>
                        <button className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-left text-muted-foreground transition hover:border-cream/40 hover:text-foreground">
                          Genera variante da {pulseDeckItem.base}
                        </button>
                      </div>
                    </Panel>
                    <Panel title="DECK SIGNAL">
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                        <div className="rounded-md border border-white/10 bg-white/5 p-2">
                          <div className="text-muted-foreground">Current</div>
                          <div className="mt-1 h-2 rounded-full" style={{ backgroundColor: pulseDeckItem.color }} />
                        </div>
                        <div className="rounded-md border border-white/10 bg-white/5 p-2">
                          <div className="text-muted-foreground">Next</div>
                          <div className="mt-1 h-2 rounded-full" style={{ backgroundColor: pulseDeckNextItem.color }} />
                        </div>
                        <div className="rounded-md border border-white/10 bg-white/5 p-2">
                          <div className="text-muted-foreground">Depth</div>
                          <div className="mt-1 h-2 rounded-full" style={{ backgroundColor: pulseDeckDepthItem.color }} />
                        </div>
                      </div>
                    </Panel>
                  </aside>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <Panel title="TRENDING STYLES">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {SOCIAL_ALGORITHMS.map((item) => (
                        <button
                          key={`trend-${item.name}`}
                          onClick={() => setAlgo(item.base)}
                          className="overflow-hidden rounded-lg border border-white/10 bg-white/5 text-left transition hover:-translate-y-0.5 hover:border-cream/40"
                        >
                          <div
                            className="h-20"
                            style={{
                              backgroundImage: `radial-gradient(circle at 30% 30%, ${item.color}, transparent 45%), linear-gradient(135deg, #050505, #252525)`,
                            }}
                          />
                          <div className="p-3">
                            <div className="truncate text-sm font-medium">{item.name}</div>
                            <div className="text-[11px] text-muted-foreground">{item.base}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </Panel>
                  <Panel title="TAG CLOUD">
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(SOCIAL_ALGORITHMS.flatMap((item) => item.tags))).map((tag) => (
                        <button
                          key={`tag-${tag}`}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur transition hover:border-cream/40 hover:text-foreground"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {SOCIAL_ALGORITHMS.slice(0, 4).map((item) => (
                        <div key={`chip-${item.name}`} className="rounded-md border border-white/10 bg-white/5 p-2">
                          <div className="h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <div className="mt-1 truncate text-[10px] text-muted-foreground">{item.author}</div>
                        </div>
                      ))}
                    </div>
                  </Panel>
                </div>
              </div>
            )}

            {socialTab === "Color Search" && (
              <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
                <Panel title="SEARCH BY COLOR">
                  <div className="space-y-4 text-xs">
                    <Field label="Target Color">
                      <div className="flex gap-2">
                        <input type="color" value={socialColorSearch} onChange={(e) => setSocialColorSearch(e.target.value)} className="h-9 w-12 rounded border border-border bg-panel" />
                        <Input value={socialColorSearch} onChange={(e) => setSocialColorSearch(e.target.value)} className="h-9 font-mono text-xs" />
                      </div>
                    </Field>
                    <div className="rounded-md border border-border p-3" style={{ backgroundColor: socialColorSearch }}>
                      <div className="mix-blend-difference text-white">Dominant color probe</div>
                    </div>
                  </div>
                </Panel>
                <Panel title="MATCHING COMMUNITY LOOKS">
                  <div className="grid gap-3 md:grid-cols-2">
                    {SOCIAL_ALGORITHMS.map((item) => (
                      <button key={item.name} className="rounded-md border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-3 text-left backdrop-blur transition-all hover:-translate-y-0.5 hover:border-cream/40 hover:shadow-lg hover:shadow-black/20" onClick={() => setAlgo(item.base)}>
                        <div className="mb-2 h-8 rounded" style={{ background: `linear-gradient(90deg, ${socialColorSearch}, ${item.color})` }} />
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.base} · matched against {socialColorSearch}</div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 rounded border border-white/10 bg-white/5 p-3 text-xs text-muted-foreground">
                    Suggerimento: scegli un colore saturo per trovare preset con contrasto forte, o un colore medio-desaturato per look più cinematici.
                  </div>
                </Panel>
              </div>
            )}

            {socialTab === "Algorithm Search" && (
              <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
                <Panel title="SEARCH BY ALGORITHM">
                  <Field label="Algorithm">
                    <Select value={socialAlgorithmSearch} onValueChange={setSocialAlgorithmSearch}>
                      <SelectTrigger className="h-9 bg-panel"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ALGORITHMS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                </Panel>
                <Panel title="COMMUNITY RESULTS">
                  <div className="grid gap-3 md:grid-cols-2">
                    {SOCIAL_ALGORITHMS.filter((item) => item.base === socialAlgorithmSearch || socialAlgorithmSearch === "Floyd–Steinberg").map((item) => (
                      <button key={item.name} className="rounded-md border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-3 text-left backdrop-blur transition-all hover:-translate-y-0.5 hover:border-cream/40 hover:shadow-lg hover:shadow-black/20" onClick={() => setAlgo(item.base)}>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">Base: {item.base} · @{item.author}</div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.tags.map((tag) => <span key={tag} className="rounded border border-white/10 bg-background/70 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur">#{tag}</span>)}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 rounded border border-white/10 bg-white/5 p-3 text-xs text-muted-foreground">
                    Tip: combina `Algorithm Search` con la palette attiva per costruire una pipeline coerente tra feed social e output finale.
                  </div>
                </Panel>
              </div>
            )}
          </div>
        ) : (
        <div className="grid flex-1 grid-cols-[1fr_320px] overflow-hidden">
          <div className="flex flex-col overflow-hidden p-5">
            <div className="grid flex-1 grid-cols-2 gap-5 overflow-hidden">
              <Panel title="SOURCE IMAGE">
                <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-md bg-black/30 p-3">
                  <canvas
                    ref={sourceCanvas}
                    className="max-h-full max-w-full"
                    style={{ imageRendering: "pixelated", transform: `scale(${zoom / 100})` }}
                  />
                </div>
                <div className="px-1 pt-2 text-xs text-muted-foreground">
                  {source ? `${source.width} × ${source.height}` : "—"}
                </div>
              </Panel>
              <Panel
                title="DITHER PREVIEW"
                right={
                  <Select value={algo} onValueChange={setAlgo}>
                    <SelectTrigger className="h-7 w-44 bg-panel text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {algorithmOptions.map((a) => <SelectItem key={a} value={a} className="text-xs">{a}</SelectItem>)}
                    </SelectContent>
                  </Select>
                }
              >
                <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-md bg-black/30 p-3">
                  <div className="relative">
                    <canvas
                      ref={previewCanvas}
                      className="block max-h-full max-w-full"
                      style={{ imageRendering: "pixelated", transform: `scale(${zoom / 100})`, transformOrigin: "center" }}
                    />
                    {crtPreview && (
                      <>
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{
                            backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,${crtScanlines / 100}) 0px, rgba(0,0,0,${crtScanlines / 100}) 1px, transparent 1px, transparent 3px), radial-gradient(circle at center, transparent 45%, rgba(0,0,0,${crtVignette / 100}) 100%)`,
                            boxShadow: `inset 0 0 ${crtVignette}px 10px rgba(0,0,0,0.7), 0 0 ${crtGlow}px rgba(154,188,15,0.25)`,
                            mixBlendMode: "multiply",
                          }}
                        />
                        <div
                          className="pointer-events-none absolute inset-0 opacity-40"
                          style={{
                            backgroundImage: `radial-gradient(circle at 30% 20%, rgba(255,255,255,${crtGlow / 220}), transparent 28%), repeating-linear-gradient(90deg, rgba(255,255,255,${crtNoise / 400}) 0px, transparent 1px, transparent 4px)`,
                          }}
                        />
                      </>
                    )}
                    {pixelGrid && (
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                          backgroundSize: `${Math.max(2, zoom / 25)}px ${Math.max(2, zoom / 25)}px`,
                        }}
                      />
                    )}
                    {compareMode && (
                      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 overflow-hidden border-r-2 border-cream">
                        <canvas
                          ref={(el) => {
                            if (el && source) {
                              el.width = source.width; el.height = source.height;
                              el.getContext("2d")!.putImageData(source, 0, 0);
                            }
                          }}
                          className="block max-h-full max-w-full"
                          style={{ imageRendering: "pixelated", transform: `scale(${zoom / 100})`, transformOrigin: "center" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <ToolButton icon={Play} onClick={() => setSource(makeSampleImage())} />
                    <ToolButton icon={Grid3x3} active={pixelGrid} onClick={() => setPixelGrid((v) => !v)} />
                    <button onClick={() => setZoom(100)} className="rounded border border-border px-2 py-1 text-xs hover:bg-accent">1:1</button>
                    <button onClick={() => setCompareMode((v) => !v)} className={cn("rounded border px-2 py-1 text-xs hover:bg-accent", compareMode ? "border-cream text-foreground" : "border-border")}>
                      Compare
                    </button>
                  </div>
                  <button
                    onClick={() => setCrtPreview((v) => !v)}
                    className={cn("flex items-center gap-1 rounded border px-2 py-1 hover:bg-accent", crtPreview ? "border-cream text-foreground" : "border-border")}
                  >
                    <Monitor className="h-3.5 w-3.5" /> CRT Preview
                  </button>
                </div>
              </Panel>
            </div>

            {/* Palette Library */}
            <Panel className="mt-5" title="PALETTE LIBRARY">
              <div className="flex items-center gap-2 pb-3">
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={cn(
                        "rounded-md px-3 py-1 text-xs transition-colors",
                        category === c
                          ? "bg-cream text-cream-foreground"
                          : "bg-panel text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {c === "Retro Gaming" && "🎮 "}{c}
                    </button>
                  ))}
                </div>
                <div className="ml-auto flex items-center gap-2 rounded-md border border-border bg-panel px-2">
                  <Search className="h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search palettes..."
                    className="h-7 w-44 border-0 bg-transparent p-0 text-xs focus-visible:ring-0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 overflow-y-auto md:grid-cols-3 lg:grid-cols-6">
                {filteredPalettes.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setPaletteName(p.name)}
                    className={cn(
                      "group rounded-md border p-2 text-left transition-colors",
                      paletteName === p.name
                        ? "border-cream/60 bg-cream/5"
                        : "border-border bg-panel hover:border-cream/40",
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-medium">{p.name}</div>
                        <div className="text-[10px] text-muted-foreground">{p.colors.length} colors</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const f = new Set(favorites);
                          f.has(p.name) ? f.delete(p.name) : f.add(p.name);
                          setFavorites(f);
                        }}
                      >
                        <Star
                          className={cn(
                            "h-3 w-3",
                            favorites.has(p.name) ? "fill-cream text-cream" : "text-muted-foreground",
                          )}
                        />
                      </button>
                    </div>
                    <div className="mt-2 flex h-3 overflow-hidden rounded">
                      {p.colors.slice(0, 8).map((c, i) => (
                        <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </Panel>
          </div>

          {/* Right inspector */}
          <aside className="flex flex-col gap-4 overflow-y-auto border-l border-border p-5">
            <Field label="Algorithm">
              <Select value={algo} onValueChange={setAlgo}>
                <SelectTrigger className="h-9 bg-panel"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {algorithmOptions.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Intensity" value={`${intensity}%`}>
              <Slider value={[intensity]} onValueChange={(v) => setIntensity(v[0])} max={100} step={1} />
            </Field>

            <Field label="Bit Depth">
              <div className="grid grid-cols-5 gap-1 rounded-md border border-border bg-panel p-1">
                {([1, 2, 4, 8, 16] as const).map((b) => (
                  <button
                    key={b}
                    disabled={paletteFixedBitDepth !== null && b !== paletteFixedBitDepth}
                    onClick={() => setBitDepth(b)}
                    className={cn(
                      "rounded px-2 py-1 text-xs transition-colors",
                      bitDepth === b && "bg-cream text-cream-foreground",
                      bitDepth !== b && "text-muted-foreground hover:text-foreground",
                      paletteFixedBitDepth !== null && b !== paletteFixedBitDepth && "cursor-not-allowed opacity-30 hover:text-muted-foreground",
                    )}
                  >
                    {b} Bit
                  </button>
                ))}
              </div>
            </Field>

            <div className="overflow-hidden rounded-md border border-border bg-panel/50">
              <div className="relative h-24">
                <div
                  className="absolute inset-0 opacity-80"
                  style={{
                    background: `linear-gradient(135deg, ${palette.colors.slice(0, 8).join(", ")})`,
                  }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_35%),linear-gradient(rgba(0,0,0,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.15)_1px,transparent_1px)] bg-[length:100%_100%,8px_8px,8px_8px]" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-3">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-cream">Palette Signal</div>
                  <div className="truncate text-sm font-semibold">{palette.name}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-border text-center text-xs">
                <div className="p-2">
                  <div className="text-muted-foreground">Source</div>
                  <div className="font-medium">{palette.category}</div>
                </div>
                <div className="p-2">
                  <div className="text-muted-foreground">Colors</div>
                  <div className="font-medium">{palette.colors.length}</div>
                </div>
                <div className="p-2">
                  <div className="text-muted-foreground">Active</div>
                  <div className="font-medium">{Math.min(palette.colors.length, Math.pow(2, bitDepth))}</div>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-border bg-panel/50 p-3">
              <div className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Dither Options
              </div>
              <Row label="Serpentine">
                <Switch checked={serpentine} onCheckedChange={setSerpentine} />
              </Row>
              <Row label="Error Diffusion">
                <Switch checked={errorDiffusion} onCheckedChange={setErrorDiffusion} />
              </Row>
              <Row label="Noise" trailing={`${noise}%`}>
                <Slider value={[noise]} onValueChange={(v) => setNoise(v[0])} max={100} step={1} className="w-32" />
              </Row>
              <Row label="Sharpen" trailing={`${sharpen}%`}>
                <Slider value={[sharpen]} onValueChange={(v) => setSharpen(v[0])} max={100} step={1} className="w-32" />
              </Row>
            </div>

            <div className="rounded-md border border-border bg-panel/50 p-3 text-xs">
              <div className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Information
              </div>
              <Info2 label="Resolution" value={source ? `${source.width} × ${source.height}` : "—"} />
              <Info2 label="Colors" value={String(Math.min(palette.colors.length, Math.pow(2, bitDepth)))} />
              <Info2 label="Bit Depth" value={`${bitDepth} Bit`} />
              <Info2 label="Algorithm" value={algo} />
              <Info2 label="Palette" value={palette.name} />
              <Info2 label="File Size (est.)" value={`${fileSizeKb} KB`} />
            </div>

            <button
              onClick={exportImage}
              className="flex items-center justify-center gap-2 rounded-md bg-cream py-2.5 text-sm font-semibold text-cream-foreground transition-opacity hover:opacity-90"
            >
              <Download className="h-4 w-4" /> EXPORT IMAGE
              <ChevronDown className="ml-auto h-4 w-4 opacity-60" />
            </button>
          </aside>
        </div>
        )}
      </main>

      <Dialog open={dialog === "preferences"} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preferences</DialogTitle>
            <DialogDescription>Configure your Dither Forge workspace.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Dark theme</div>
                <div className="text-xs text-muted-foreground">Use the dark retro UI.</div>
              </div>
              <Switch checked={dark} onCheckedChange={setDark} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Serpentine scan (default)</div>
                <div className="text-xs text-muted-foreground">Alternate scan direction per row.</div>
              </div>
              <Switch checked={serpentine} onCheckedChange={setSerpentine} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Error diffusion</div>
                <div className="text-xs text-muted-foreground">Spread quantization error to neighbors.</div>
              </div>
              <Switch checked={errorDiffusion} onCheckedChange={setErrorDiffusion} />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-medium">Default intensity</span>
                <span className="text-xs text-muted-foreground">{intensity}%</span>
              </div>
              <Slider value={[intensity]} onValueChange={(v) => setIntensity(v[0])} max={100} step={1} />
            </div>
            <div className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
              <Sparkles className="mr-1 inline h-3 w-3" /> Cloud sync, custom hotkeys & color profiles — coming soon.
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "shortcuts"} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </DialogHeader>
          <div className="space-y-1 py-2 text-sm">
            {[
              ["Open file", "⌘ O"], ["Save / Export", "⌘ S"], ["New project", "⌘ N"],
              ["Toggle CRT preview", "C"], ["Toggle pixel grid", "G"], ["Toggle compare", "K"],
              ["Reset zoom (1:1)", "0"], ["Random palette", "R"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">{k}</span>
                <kbd className="rounded border border-border bg-panel px-2 py-0.5 font-mono text-xs">{v}</kbd>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "about"} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About Dither Forge</DialogTitle>
            <DialogDescription>Retro pixel dithering studio inspired by classic consoles & home computers.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2 text-sm text-muted-foreground">
            <p>Version 0.1 · Built with TanStack Start.</p>
            <p>{paletteOptions.length} palettes · {algorithmOptions.length} algorithms.</p>
            <p>Convert any image into authentic Game Boy, NES, C64, PICO-8, CRT and broadcast looks.</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "export"} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Image</DialogTitle>
            <DialogDescription>Save the dithered preview as a PNG file.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm">
            <div className="rounded-md border border-border bg-panel/50 p-3 text-xs">
              <Info2 label="Resolution" value={source ? `${source.width} × ${source.height}` : "—"} />
              <Info2 label="Palette" value={palette.name} />
              <Info2 label="Algorithm" value={algo} />
              <Info2 label="Bit Depth" value={`${bitDepth} Bit`} />
            </div>
            <button
              onClick={() => { exportImage(); setDialog(null); }}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-cream py-2.5 text-sm font-semibold text-cream-foreground hover:opacity-90"
            >
              <Download className="h-4 w-4" /> Download PNG
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "videoExport"} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Video MP4</DialogTitle>
            <DialogDescription>Scegli la dimensione di export (include originale).</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm">
            <Field label="Export Size">
              <Select value={videoExportSize} onValueChange={setVideoExportSize}>
                <SelectTrigger className="h-9 bg-panel"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="original">Originale</SelectItem>
                  <SelectItem value="0.5x">0.5x</SelectItem>
                  <SelectItem value="2x">2x</SelectItem>
                  <SelectItem value="3x">3x</SelectItem>
                  <SelectItem value="4x">4x</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <div className="rounded-md border border-border bg-panel/50 p-3 text-xs">
              <Info2 label="Clip" value={videoName || "No video"} />
              <Info2 label="Size" value={videoExportSize === "original" ? "Originale" : videoExportSize} />
            </div>
            <button
              onClick={() => void exportVideoMp4(videoExportSize)}
              disabled={!videoUrl || videoExporting}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-cream py-2.5 text-sm font-semibold text-cream-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> {videoExporting ? "Exporting..." : "Start Export MP4"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "algorithmWarning"} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sliders className="h-4 w-4" /> Advanced Algorithm Lab</DialogTitle>
            <DialogDescription>
              Questa sezione è pensata per un uso esperto: qui potrai creare un algoritmo di dithering personalizzato partendo da preset e parametri manuali.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 text-sm">
            <div className="rounded-md border border-cream/30 bg-cream/10 p-3 text-xs text-muted-foreground">
              Modifiche troppo spinte possono generare pattern aggressivi, perdita di dettaglio o risultati poco prevedibili. Usala come laboratorio creativo.
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
              <Checkbox checked={hideAlgorithmWarning} onCheckedChange={(v) => setHideAlgorithmWarning(v === true)} />
              Non mostrare più questo avviso
            </label>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" size="sm" onClick={() => setDialog(null)}>Annulla</Button>
              <Button size="sm" onClick={continueToAlgorithmLab}>Continua</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "algorithmGuide"} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Info className="h-4 w-4" /> Mini guida Algorithm Lab</DialogTitle>
            <DialogDescription>
              Questa guida ti aiuta a scegliere preset e parametri in base al tipo di immagine, palette e risultato visivo desiderato.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 text-sm">
            <div className="grid gap-2 text-xs text-muted-foreground">
              <div className="rounded-md border border-border bg-panel/50 p-3"><span className="font-medium text-foreground">Foto e gradienti:</span> parti da Floyd–Steinberg, Stucki o Sierra. Mantieni `Diffusion Amount` tra 55–80% per preservare dettaglio senza creare troppo rumore.</div>
              <div className="rounded-md border border-border bg-panel/50 p-3"><span className="font-medium text-foreground">Pixel art e UI:</span> usa Atkinson, Bayer 4x4 o Threshold. Pattern piccoli e bias leggermente negativo aiutano a mantenere silhouette nette.</div>
              <div className="rounded-md border border-border bg-panel/50 p-3"><span className="font-medium text-foreground">Look stampa / halftone:</span> usa Halftone o Bayer 8x8. Aumenta `Pattern Size` per celle più visibili e riduci la diffusione per evitare grana casuale.</div>
              <div className="rounded-md border border-border bg-panel/50 p-3"><span className="font-medium text-foreground">Palette ridotte:</span> con 1–2 bit proteggi toni e bordi. Con 8–16 bit puoi spingere diffusione e sharpening perché hai più colori disponibili.</div>
              <div className="rounded-md border border-border bg-panel/50 p-3"><span className="font-medium text-foreground">Uso esperto:</span> regola peso diffusione, protezione tonale, edge preservation e grain shaping solo dopo aver trovato una base stabile.</div>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
              <Checkbox checked={hideAlgorithmGuide} onCheckedChange={(v) => setHideAlgorithmGuide(v === true)} />
              Non mostrare più questa mini guida
            </label>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" size="sm" onClick={() => setDialog(null)}>Chiudi</Button>
              <Button size="sm" onClick={continueFromAlgorithmGuide}>Apri Algorithm Lab</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "comingsoon"} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> {comingSoonLabel}</DialogTitle>
            <DialogDescription>Coming soon.</DialogDescription>
          </DialogHeader>
          <p className="py-2 text-sm text-muted-foreground">
            This feature is on the roadmap. In the meantime keep using the Editor — palettes, algorithms, CRT preview and compare mode are all live.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SidebarSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }: { icon: React.ComponentType<{ className?: string }>; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        active ? "bg-panel text-foreground" : "text-muted-foreground hover:bg-panel/60 hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function ToolButton({ icon: Icon, onClick, active }: { icon: React.ComponentType<{ className?: string }>; onClick?: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-md hover:bg-panel hover:text-foreground",
        active ? "bg-panel text-foreground" : "text-muted-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function Panel({
  title, right, children, className,
}: { title: string; right?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("flex flex-col rounded-lg border border-border bg-panel/40 p-3", className)}>
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}

function Field({ label, value, children }: { label: string; value?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
        {value && <span className="text-xs text-muted-foreground">{value}</span>}
      </div>
      {children}
    </div>
  );
}

function Row({ label, trailing, children }: { label: string; trailing?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-xs">
      <span>{label}</span>
      <div className="flex items-center gap-2">
        {children}
        {trailing && <span className="w-9 text-right text-muted-foreground">{trailing}</span>}
      </div>
    </div>
  );
}

function Info2({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
