import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Home, Redo2, Undo2, Search, FilePlus2, FolderOpen, Save, Moon,
  Pencil, Layers, Image as ImageIcon, Sliders, Palette as PaletteIcon,
  GitCompare, Monitor, Download, Settings, Keyboard, Info, Play, Grid3x3,
  Shuffle, Star, ChevronDown, Box, Sun, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { ALGORITHMS, PALETTES, dither, makeSampleImage, type Algorithm } from "@/lib/dither";
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

function DitherForge() {
  const [algo, setAlgo] = useState<Algorithm>("Floyd–Steinberg");
  const [intensity, setIntensity] = useState(75);
  const [bitDepth, setBitDepth] = useState<1 | 2 | 4 | 8>(1);
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
  const [compareMode, setCompareMode] = useState(false);
  const [pixelGrid, setPixelGrid] = useState(false);
  const [activeView, setActiveView] = useState<string>("Editor");
  const [dialog, setDialog] = useState<null | "preferences" | "shortcuts" | "about" | "comingsoon" | "export">(null);
  const [comingSoonLabel, setComingSoonLabel] = useState("");
  const [dark, setDark] = useState(true);

  function openComingSoon(label: string) {
    setComingSoonLabel(label);
    setDialog("comingsoon");
  }

  useEffect(() => {
    document.documentElement.classList.toggle("light", !dark);
  }, [dark]);

  const palette = useMemo(() => PALETTES.find((p) => p.name === paletteName) ?? PALETTES[0], [paletteName]);
  const sourceCanvas = useRef<HTMLCanvasElement>(null);
  const previewCanvas = useRef<HTMLCanvasElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

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
    const out = dither(source, palette.colors, algo, {
      intensity, bitDepth, serpentine, errorDiffusion, noise, sharpen,
    });
    const c = previewCanvas.current;
    c.width = out.width; c.height = out.height;
    c.getContext("2d")!.putImageData(out, 0, 0);
  }, [source, palette, algo, intensity, bitDepth, serpentine, errorDiffusion, noise, sharpen]);

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

  const filteredPalettes = PALETTES.filter((p) => {
    if (category !== "All" && category !== "Custom" && p.category !== category) return false;
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
            <NavItem icon={Layers} label="Batch Processor" active={activeView === "Batch Processor"} onClick={() => { setActiveView("Batch Processor"); openComingSoon("Batch Processor"); }} />
            <NavItem icon={ImageIcon} label="Gallery" active={activeView === "Gallery"} onClick={() => { setActiveView("Gallery"); openComingSoon("Gallery"); }} />
          </SidebarSection>
          <SidebarSection label="Dither">
            <NavItem icon={Sliders} label="Algorithms" onClick={() => openComingSoon("Algorithms manager")} />
            <NavItem icon={PaletteIcon} label="Palettes" onClick={() => openComingSoon("Palette editor")} />
          </SidebarSection>
          <SidebarSection label="Tools">
            <NavItem icon={GitCompare} label="Compare" active={compareMode} onClick={() => setCompareMode((v) => !v)} />
            <NavItem icon={Monitor} label="Preview (CRT)" active={crtPreview} onClick={() => setCrtPreview((v) => !v)} />
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
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={() => fileInput.current?.click()}>
              <FolderOpen className="h-3.5 w-3.5" /> Open
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={exportImage}>
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
          </div>
        </header>

        {/* Workspace */}
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
                  <Select value={algo} onValueChange={(v) => setAlgo(v as Algorithm)}>
                    <SelectTrigger className="h-7 w-44 bg-panel text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ALGORITHMS.map((a) => <SelectItem key={a} value={a} className="text-xs">{a}</SelectItem>)}
                    </SelectContent>
                  </Select>
                }
              >
                <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-md bg-black/30 p-3">
                  <canvas
                    ref={previewCanvas}
                    className="max-h-full max-w-full"
                    style={{ imageRendering: "pixelated", transform: `scale(${zoom / 100})` }}
                  />
                </div>
                <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <ToolButton icon={Play} />
                    <ToolButton icon={Grid3x3} />
                    <button className="rounded border border-border px-2 py-1 text-xs hover:bg-accent">1:1</button>
                  </div>
                  <button className="flex items-center gap-1 rounded border border-border px-2 py-1 hover:bg-accent">
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
              <Select value={algo} onValueChange={(v) => setAlgo(v as Algorithm)}>
                <SelectTrigger className="h-9 bg-panel"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ALGORITHMS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Intensity" value={`${intensity}%`}>
              <Slider value={[intensity]} onValueChange={(v) => setIntensity(v[0])} max={100} step={1} />
            </Field>

            <Field label="Bit Depth">
              <div className="grid grid-cols-4 gap-1 rounded-md border border-border bg-panel p-1">
                {([1, 2, 4, 8] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBitDepth(b)}
                    className={cn(
                      "rounded px-2 py-1 text-xs transition-colors",
                      bitDepth === b ? "bg-cream text-cream-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {b} Bit
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Palette">
              <div className="flex items-center gap-2">
                <Select value={paletteName} onValueChange={setPaletteName}>
                  <SelectTrigger className="h-9 bg-panel"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PALETTES.map((p) => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <button
                  onClick={() => setPaletteName(PALETTES[Math.floor(Math.random() * PALETTES.length)].name)}
                  className="grid h-9 w-9 place-items-center rounded-md border border-border bg-panel text-muted-foreground hover:text-foreground"
                >
                  <Shuffle className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 flex h-6 overflow-hidden rounded">
                {palette.colors.slice(0, 8).map((c, i) => (
                  <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                ))}
              </div>
            </Field>

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
      </main>
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
