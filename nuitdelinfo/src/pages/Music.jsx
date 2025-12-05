import React, { useEffect, useRef, useState } from "react";

const MODES = [
  "radial",
  "bars",
  "particles",
  "retro",
  "waveform",
  "galaxy",
  "matrix",
  "plasma",
  "tunnel",
  "dna"
];

export default function Music() {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const rafRef = useRef(null);

  const [mode, setMode] = useState("galaxy");
  const [color, setColor] = useState("#ff5a5f");
  const [intensity, setIntensity] = useState(1.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fileName, setFileName] = useState("");
  const [useMic, setUseMic] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const particlesRef = useRef([]);
  const timeRef = useRef(0);
  const historyRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
      if (sourceRef.current && sourceRef.current.mediaStream) {
        const tracks = sourceRef.current.mediaStream.getTracks();
        tracks.forEach((t) => t.stop());
      }
    };
  }, []);

  const ensureAudioContext = async () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === "suspended") {
      try {
        await audioCtxRef.current.resume();
      } catch {}
    }
    if (!analyserRef.current) {
      const analyser = audioCtxRef.current.createAnalyser();
      analyser.fftSize = 4096;
      analyser.smoothingTimeConstant = 0.75;
      analyserRef.current = analyser;
    }
  };

  const connectAudioElement = async (audioElement) => {
    await ensureAudioContext();
    disconnectSource();
    const source = audioCtxRef.current.createMediaElementSource(audioElement);
    sourceRef.current = source;
    source.connect(analyserRef.current);
    analyserRef.current.connect(audioCtxRef.current.destination);
  };

  const connectMicrophone = async () => {
    await ensureAudioContext();
    disconnectSource();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioCtxRef.current.createMediaStreamSource(stream);
      sourceRef.current = source;
      source.mediaStream = stream;
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioCtxRef.current.destination);
      setUseMic(true);
      setFileName("Microphone");
      startRendering();
    } catch (err) {
      console.error("Microphone access denied", err);
      setUseMic(false);
    }
  };

  const disconnectSource = () => {
    try {
      if (sourceRef.current) {
        try {
          sourceRef.current.disconnect();
        } catch {}
        if (sourceRef.current.mediaStream) {
          const tracks = sourceRef.current.mediaStream.getTracks();
          tracks.forEach((t) => t.stop());
        }
      }
    } catch {}
    sourceRef.current = null;
    if (analyserRef.current && audioCtxRef.current) {
      try {
        analyserRef.current.disconnect();
      } catch {}
    }
    cancelAnimationFrame(rafRef.current);
  };

  const handleFile = async (ev) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    setUseMic(false);
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous";
    }
    audioRef.current.src = url;
    audioRef.current.loop = true;
    await connectAudioElement(audioRef.current);
    playAudio();
  };

  const playAudio = async () => {
    if (!audioRef.current && !useMic) return;
    await ensureAudioContext();
    if (useMic) {
      startRendering();
      setIsPlaying(true);
      return;
    }
    try {
      await audioRef.current.play();
      if (audioCtxRef.current.state === "suspended") await audioCtxRef.current.resume();
      startRendering();
      setIsPlaying(true);
    } catch (err) {
      console.error("play failed", err);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current && !useMic) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    cancelAnimationFrame(rafRef.current);
  };

  const togglePlay = () => {
    if (isPlaying) pauseAudio();
    else playAudio();
  };

  const startRendering = () => {
    cancelAnimationFrame(rafRef.current);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const analyser = analyserRef.current;
    if (!analyser) return;
    const bufferLength = analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLength);

    if (mode === "particles" && particlesRef.current.length === 0) {
      particlesRef.current = new Array(120).fill().map(() => randomParticle(canvas));
    }
    if (mode === "galaxy" && particlesRef.current.length === 0) {
      particlesRef.current = new Array(200).fill().map(() => randomStar(canvas));
    }

    const render = () => {
      timeRef.current += 0.016;
      analyser.getByteFrequencyData(data);
      
      const sum = data.reduce((a, b) => a + b, 0);
      const energy = (sum / (255 * data.length)) * intensity;
      
      const bass = data.slice(0, 30).reduce((a, b) => a + b, 0) / (255 * 30);
      const mid = data.slice(30, 100).reduce((a, b) => a + b, 0) / (255 * 70);
      const treble = data.slice(100, 200).reduce((a, b) => a + b, 0) / (255 * 100);

      historyRef.current.push({ bass, mid, treble, energy });
      if (historyRef.current.length > 60) historyRef.current.shift();

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      switch (mode) {
        case "bars":
          drawBars(ctx, data, width, height, color, energy, bass);
          break;
        case "radial":
          drawRadial(ctx, data, width, height, color, energy, bass);
          break;
        case "particles":
          drawParticles(ctx, data, width, height, color, energy, bass);
          break;
        case "retro":
          drawRetro(ctx, data, width, height, color, energy);
          break;
        case "waveform":
          drawWaveform(ctx, data, width, height, color, energy, bass, treble);
          break;
        case "galaxy":
          drawGalaxy(ctx, data, width, height, color, energy, bass, mid, treble);
          break;
        case "matrix":
          drawMatrix(ctx, data, width, height, color, energy, bass);
          break;
        case "plasma":
          drawPlasma(ctx, data, width, height, color, energy, timeRef.current);
          break;
        case "tunnel":
          drawTunnel(ctx, data, width, height, color, energy, bass, timeRef.current);
          break;
        case "dna":
          drawDNA(ctx, data, width, height, color, energy, bass, timeRef.current);
          break;
      }

      if (showControls) {
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 13px Inter, system-ui, Arial";
        ctx.shadowColor = "#000000";
        ctx.shadowBlur = 8;
        ctx.fillText(fileName || (useMic ? "🎤 Microphone" : "No audio"), 16, height - 16);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    render();
  };

  function drawBars(ctx, data, w, h, colorHex, energy, bass) {
    const bars = 80;
    const step = Math.floor(data.length / bars);
    const gap = 3;
    const barWidth = (w - gap * (bars - 1)) / bars;
    
    for (let i = 0; i < bars; i++) {
      const v = data[i * step] / 255;
      const bh = Math.max(4, v * h * (0.85 + energy * 0.9 + bass * 0.4));
      const x = i * (barWidth + gap);
      const y = h - bh;
      
      const g = ctx.createLinearGradient(x, y, x, h);
      g.addColorStop(0, colorHex);
      g.addColorStop(0.5, adjustColor(colorHex, 0.6));
      g.addColorStop(1, "#0a0a0f");
      
      ctx.fillStyle = g;
      ctx.shadowColor = colorHex;
      ctx.shadowBlur = 12 + v * 32 + bass * 20;
      ctx.fillRect(x, y, barWidth, bh);
      
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = colorHex;
      ctx.fillRect(x, y, barWidth, 3);
      ctx.globalAlpha = 1;
    }
    ctx.shadowBlur = 0;
  }

  function drawRadial(ctx, data, w, h, colorHex, energy, bass) {
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(cx, cy) * 0.4;
    const bars = 180;
    const step = Math.floor(data.length / bars);
    
    ctx.save();
    ctx.translate(cx, cy);

    const bgGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 2);
    bgGlow.addColorStop(0, adjustColor(colorHex, 0.15));
    bgGlow.addColorStop(1, "transparent");
    ctx.globalAlpha = 0.3 + bass * 0.4;
    ctx.fillStyle = bgGlow;
    ctx.fillRect(-w/2, -h/2, w, h);
    ctx.globalAlpha = 1;

    for (let i = 0; i < bars; i++) {
      const v = data[i * step] / 255;
      const length = v * (radius * (1.2 + energy * 0.8 + bass * 0.5));
      const angle = (i / bars) * Math.PI * 2;
      const x1 = Math.cos(angle) * radius;
      const y1 = Math.sin(angle) * radius;
      const x2 = Math.cos(angle) * (radius + length);
      const y2 = Math.sin(angle) * (radius + length);

      const g = ctx.createLinearGradient(x1, y1, x2, y2);
      g.addColorStop(0, adjustColor(colorHex, 0.3));
      g.addColorStop(1, colorHex);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = g;
      ctx.lineWidth = Math.max(1.5, 3 * v + energy * 2);
      ctx.shadowColor = colorHex;
      ctx.shadowBlur = 12 * v + energy * 18 + bass * 15;
      ctx.stroke();
    }

    for (let r = 0; r < 3; r++) {
      const ringRadius = radius * (0.3 + r * 0.2);
      ctx.beginPath();
      ctx.arc(0, 0, ringRadius + bass * 30, 0, Math.PI * 2);
      ctx.strokeStyle = colorHex;
      ctx.lineWidth = 1 + bass * 3;
      ctx.globalAlpha = 0.4 - r * 0.1 + bass * 0.3;
      ctx.shadowBlur = 20;
      ctx.stroke();
    }

    ctx.restore();
    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;
  }

  function randomParticle(canvas) {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 0.5 + 0.2;
    return {
      x: w / 2,
      y: h / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 2 + 1,
      life: 255,
      maxLife: 255,
    };
  }

  function drawParticles(ctx, data, w, h, colorHex, energy, bass) {
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1.0;

    const particles = particlesRef.current;
    
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      const velocity = 1 + bass * 8 * energy;
      p.x += p.vx * velocity;
      p.y += p.vy * velocity;
      p.life -= 1;

      if (p.life <= 0 || p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
        particles.splice(i, 1);
        continue;
      }

      const alpha = p.life / p.maxLife;
      ctx.beginPath();
      ctx.globalAlpha = alpha * (0.7 + bass * 0.3);
      ctx.fillStyle = colorHex;
      ctx.shadowColor = colorHex;
      ctx.shadowBlur = 8 * (1 + bass * energy);
      ctx.arc(p.x, p.y, p.size * (1 + bass * 2), 0, Math.PI * 2);
      ctx.fill();
    }

    const spawnRate = Math.floor(bass * 15 * intensity + energy * 5);
    for (let i = 0; i < spawnRate; i++) {
      if (particles.length < 400) {
        particles.push(randomParticle(canvasRef.current));
      }
    }

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }

  function drawRetro(ctx, data, w, h, colorHex, energy) {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#001021");
    g.addColorStop(1, "#110017");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const rows = 50;
    const step = Math.floor(data.length / rows);
    for (let i = 0; i < rows; i++) {
      const v = data[i * step] / 255;
      const rowH = h / rows;
      const y = i * rowH;
      const barW = w * (0.15 + v * 0.85);
      
      const gradient = ctx.createLinearGradient(0, y, barW, y);
      gradient.addColorStop(0, colorHex);
      gradient.addColorStop(1, adjustColor(colorHex, 0.3));
      
      ctx.globalAlpha = 0.3 + v * 0.7 * energy;
      ctx.fillStyle = gradient;
      ctx.shadowColor = colorHex;
      ctx.shadowBlur = v * 20;
      ctx.fillRect(0, y, barW, rowH * 0.9);
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgba(255,255,255,0.015)";
    for (let y = 0; y < h; y += 3) {
      ctx.fillRect(0, y, w, 1);
    }
  }

  function drawWaveform(ctx, data, w, h, colorHex, energy, bass, treble) {
    const cx = w / 2;
    const cy = h / 2;
    
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) / 2);
    g.addColorStop(0, "#000511");
    g.addColorStop(1, "#000000");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const waves = 5;
    for (let wave = 0; wave < waves; wave++) {
      ctx.beginPath();
      const amplitude = (50 + wave * 30) * (1 + energy);
      const frequency = 0.01 + wave * 0.003;
      const phase = timeRef.current * (1 + wave * 0.5);
      
      for (let x = 0; x <= w; x += 3) {
        const dataIdx = Math.floor((x / w) * data.length);
        const v = data[dataIdx] / 255;
        const y = cy + Math.sin(x * frequency + phase) * amplitude * (0.3 + v * 0.7);
        
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      
      ctx.strokeStyle = colorHex;
      ctx.lineWidth = 2 + wave * 0.5;
      ctx.globalAlpha = (1 - wave / waves) * (0.5 + energy * 0.5);
      ctx.shadowColor = colorHex;
      ctx.shadowBlur = 15 + bass * 25;
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  function randomStar(canvas) {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * Math.min(w, h) / 3;
    return {
      x: w / 2 + Math.cos(angle) * distance,
      y: h / 2 + Math.sin(angle) * distance,
      z: Math.random() * 1000,
      size: Math.random() * 2 + 0.5,
      angle: angle,
      distance: distance,
    };
  }

  function drawGalaxy(ctx, data, w, h, colorHex, energy, bass, mid, treble) {
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;

    const cx = w / 2;
    const cy = h / 2;

    const bgGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) / 2);
    bgGlow.addColorStop(0, adjustColor(colorHex, 0.08));
    bgGlow.addColorStop(0.5, adjustColor(colorHex, 0.03));
    bgGlow.addColorStop(1, "transparent");
    ctx.globalAlpha = 0.5 + bass * 0.5;
    ctx.fillStyle = bgGlow;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;

    const stars = particlesRef.current;
    const rotation = timeRef.current * 0.3;
    
    stars.forEach((star, i) => {
      const bassEffect = data[i % 30] / 255;
      star.angle += 0.001 + bass * 0.008;
      star.distance += (mid * 0.5 - 0.25) * 2;
      
      if (star.distance < 50) star.distance = Math.min(w, h) / 2;
      if (star.distance > Math.min(w, h) / 2) star.distance = 50;
      
      const spiralAngle = star.angle + rotation + star.distance * 0.002;
      const x = cx + Math.cos(spiralAngle) * star.distance * (1 + bass * 0.2);
      const y = cy + Math.sin(spiralAngle) * star.distance * (1 + bass * 0.2);
      
      const size = star.size * (1 + bassEffect * 3 * energy);
      
      ctx.beginPath();
      ctx.fillStyle = colorHex;
      ctx.shadowColor = colorHex;
      ctx.shadowBlur = 8 + bassEffect * 20;
      ctx.globalAlpha = 0.5 + bassEffect * 0.5;
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      if (bassEffect > 0.7) {
        ctx.beginPath();
        ctx.strokeStyle = colorHex;
        ctx.lineWidth = 1;
        ctx.globalAlpha = bassEffect * 0.5;
        ctx.arc(x, y, size * 3, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }

  function drawMatrix(ctx, data, w, h, colorHex, energy, bass) {
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;

    const cols = 40;
    const colWidth = w / cols;
    const rows = Math.ceil(h / colWidth);

    ctx.font = `${colWidth * 0.8}px monospace`;
    
    for (let col = 0; col < cols; col++) {
      const dataIdx = Math.floor((col / cols) * data.length);
      const v = data[dataIdx] / 255;
      const chars = Math.floor(v * rows * (1 + energy));
      
      for (let i = 0; i < chars; i++) {
        const char = String.fromCharCode(0x30A0 + Math.random() * 96);
        const x = col * colWidth;
        const y = (i + timeRef.current * v * 10) % h;
        const alpha = 1 - (i / chars);
        
        ctx.globalAlpha = alpha * v;
        ctx.fillStyle = i === 0 ? "#ffffff" : colorHex;
        ctx.shadowColor = colorHex;
        ctx.shadowBlur = i === 0 ? 20 : 5;
        ctx.fillText(char, x, y);
      }
    }

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }

  function drawPlasma(ctx, data, w, h, colorHex, energy, time) {
    const imageData = ctx.createImageData(w, h);
    const d = imageData.data;
    
    const bass = data.slice(0, 30).reduce((a, b) => a + b, 0) / (255 * 30);
    const mid = data.slice(30, 100).reduce((a, b) => a + b, 0) / (255 * 70);
    
    const rgb = hexToRgb(colorHex);
    
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        
        const dataIdx = Math.floor(((x + y) / (w + h)) * data.length);
        const audioVal = data[dataIdx] / 255;
        
        const v1 = Math.sin(x / 40 + time + bass * 10);
        const v2 = Math.sin(y / 30 + time * 1.3 + mid * 8);
        const v3 = Math.sin((x + y) / 50 + time * 0.8);
        const v4 = Math.sin(Math.sqrt(x * x + y * y) / 40 + time * 1.5);
        
        const plasma = (v1 + v2 + v3 + v4) / 4;
        const intensity = (plasma + 1) / 2 * audioVal * energy;
        
        d[idx] = rgb.r * intensity;
        d[idx + 1] = rgb.g * intensity;
        d[idx + 2] = rgb.b * intensity;
        d[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }

  function drawTunnel(ctx, data, w, h, colorHex, energy, bass, time) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const rings = 30;

    for (let i = 0; i < rings; i++) {
      const t = i / rings;
      const dataIdx = Math.floor(t * data.length);
      const v = data[dataIdx] / 255;
      
      const radius = ((i + time * 50 * (1 + bass)) % rings) / rings * Math.min(w, h);
      const alpha = 1 - (radius / Math.min(w, h));
      
      if (radius < Math.min(w, h)) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius * (1 + v * energy * 0.5), 0, Math.PI * 2);
        ctx.strokeStyle = colorHex;
        ctx.lineWidth = 2 + v * 10 * energy;
        ctx.globalAlpha = alpha * (0.4 + v * 0.6);
        ctx.shadowColor = colorHex;
        ctx.shadowBlur = 15 + v * 30;
        ctx.stroke();
      }
    }

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }

  function drawDNA(ctx, data, w, h, colorHex, energy, bass, time) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#000408");
    g.addColorStop(1, "#000000");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const helixCount = 2;
    const points = 100;
    const amplitude = Math.min(w, h) / 6;
    const frequency = 0.05;

    for (let helix = 0; helix < helixCount; helix++) {
      const offset = helix * Math.PI;
      
      ctx.beginPath();
      for (let i = 0; i < points; i++) {
        const t = i / points;
        const x = (t * w);
        const dataIdx = Math.floor(t * data.length);
        const v = data[dataIdx] / 255;
        
        const y = h / 2 + Math.sin(i * frequency + time * 2 + offset) * amplitude * (1 + bass * 0.5);
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        
        if (i % 5 === 0) {
          ctx.save();
          const size = 3 + v * 8 * energy;
          ctx.fillStyle = colorHex;
          ctx.shadowColor = colorHex;
          ctx.shadowBlur = 10 + v * 20;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      
      ctx.strokeStyle = colorHex;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6;
      ctx.shadowColor = colorHex;
      ctx.shadowBlur = 10;
      ctx.stroke();
    }

    for (let i = 0; i < points; i += 8) {
      const t = i / points;
      const x = t * w;
      
      const y1 = h / 2 + Math.sin(i * frequency + time * 2) * amplitude * (1 + bass * 0.5);
      const y2 = h / 2 + Math.sin(i * frequency + time * 2 + Math.PI) * amplitude * (1 + bass * 0.5);
      
      const dataIdx = Math.floor(t * data.length);
      const v = data[dataIdx] / 255;
      
      ctx.beginPath();
      ctx.moveTo(x, y1);
      ctx.lineTo(x, y2);
      ctx.strokeStyle = colorHex;
      ctx.lineWidth = 1 + v * 3;
      ctx.globalAlpha = 0.3 + v * 0.5;
      ctx.shadowBlur = 8;
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }

  function adjustColor(hex, factor) {
    const rgb = hexToRgb(hex);
    return `rgba(${Math.floor(rgb.r * factor)}, ${Math.floor(rgb.g * factor)}, ${Math.floor(rgb.b * factor)}, 1)`;
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 90, b: 95 };
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)",
      padding: "24px",
      fontFamily: "Inter, system-ui, Arial"
    }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: 32, 
              fontWeight: 800,
              background: `linear-gradient(135deg, ${color} 0%, ${adjustColor(color, 0.6)} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Music Visualizer Pro
            </h1>
            <p style={{ marginTop: 8, color: "#9ca3af", fontSize: 14 }}>
              Visualisez votre musique avec des effets spectaculaires
            </p>
          </div>
          
          <button 
            onClick={() => setShowControls(!showControls)}
            style={{
              ...btnStyle,
              background: showControls ? color : "#1f2937",
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600
            }}
          >
            {showControls ? "Masquer" : "Afficher"} Contrôles
          </button>
        </div>

        {showControls && (
          <div style={{ 
            background: "rgba(17, 24, 39, 0.6)", 
            backdropFilter: "blur(12px)",
            borderRadius: 16, 
            padding: 20,
            marginBottom: 24,
            border: "1px solid rgba(255,255,255,0.05)"
          }}>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              alignItems: "center"
            }}>
              <div>
                <label style={{ 
                  display: "block", 
                  color: "#d1d5db", 
                  fontSize: 13, 
                  fontWeight: 600,
                  marginBottom: 8 
                }}>
                  Fichier Audio
                </label>
                <input 
                  type="file" 
                  accept="audio/*" 
                  onChange={handleFile}
                  style={{
                    fontSize: 12,
                    color: "#9ca3af",
                    width: "100%"
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: "block", 
                  color: "#d1d5db", 
                  fontSize: 13, 
                  fontWeight: 600,
                  marginBottom: 8 
                }}>
                  Contrôles
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={togglePlay} style={{
                    ...btnStyle,
                    background: isPlaying ? "#ef4444" : "#10b981",
                    flex: 1,
                    fontWeight: 600
                  }}>
                    {isPlaying ? "⏸ Pause" : "▶ Play"}
                  </button>

                  <button
                    onClick={() => {
                      if (useMic) {
                        disconnectSource();
                        setUseMic(false);
                        setIsPlaying(false);
                        setFileName("");
                      } else {
                        connectMicrophone();
                      }
                    }}
                    style={{
                      ...btnStyle,
                      background: useMic ? "#ef4444" : "#6366f1",
                      flex: 1,
                      fontWeight: 600
                    }}
                  >
                    {useMic ? "🔴 Stop" : "🎤 Micro"}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ 
                  display: "block", 
                  color: "#d1d5db", 
                  fontSize: 13, 
                  fontWeight: 600,
                  marginBottom: 8 
                }}>
                  Mode de Visualisation
                </label>
                <select 
                  value={mode} 
                  onChange={(e) => setMode(e.target.value)} 
                  style={{ 
                    ...btnStyle,
                    width: "100%",
                    cursor: "pointer",
                    fontWeight: 600
                  }}
                >
                  {MODES.map((m) => (
                    <option key={m} value={m}>
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ 
                  display: "block", 
                  color: "#d1d5db", 
                  fontSize: 13, 
                  fontWeight: 600,
                  marginBottom: 8 
                }}>
                  Couleur Principale
                </label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input 
                    type="color" 
                    value={color} 
                    onChange={(e) => setColor(e.target.value)}
                    style={{ 
                      width: 50, 
                      height: 38, 
                      border: "none", 
                      borderRadius: 8,
                      cursor: "pointer"
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <input 
                      type="text" 
                      value={color} 
                      onChange={(e) => setColor(e.target.value)}
                      style={{
                        ...btnStyle,
                        width: "100%",
                        fontFamily: "monospace"
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ 
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#d1d5db", 
                  fontSize: 13, 
                  fontWeight: 600,
                  marginBottom: 8 
                }}>
                  <span>Intensité</span>
                  <span style={{ color: color }}>{intensity.toFixed(1)}x</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  style={{
                    width: "100%",
                    height: 6,
                    borderRadius: 3,
                    background: `linear-gradient(to right, ${color} 0%, ${color} ${(intensity - 0.5) / 2.5 * 100}%, #374151 ${(intensity - 0.5) / 2.5 * 100}%, #374151 100%)`,
                    outline: "none",
                    cursor: "pointer"
                  }}
                />
              </div>

              <div style={{ 
                gridColumn: "1 / -1",
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                paddingTop: 8,
                borderTop: "1px solid rgba(255,255,255,0.05)"
              }}>
                <span style={{ color: "#9ca3af", fontSize: 12, fontWeight: 600 }}>Présélections:</span>
                {[
                  { name: "Néon", color: "#00ff9f", mode: "galaxy" },
                  { name: "Cyberpunk", color: "#ff0080", mode: "tunnel" },
                  { name: "Rétro", color: "#ffd700", mode: "retro" },
                  { name: "Ocean", color: "#00d9ff", mode: "waveform" },
                  { name: "Plasma", color: "#a855f7", mode: "plasma" },
                  { name: "Matrix", color: "#00ff41", mode: "matrix" }
                ].map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setColor(preset.color);
                      setMode(preset.mode);
                    }}
                    style={{
                      ...btnStyle,
                      padding: "6px 12px",
                      fontSize: 12,
                      fontWeight: 600,
                      background: `linear-gradient(135deg, ${preset.color}22 0%, ${preset.color}11 100%)`,
                      border: `1px solid ${preset.color}44`,
                      color: preset.color
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            borderRadius: 20,
            overflow: "hidden",
            border: `2px solid ${adjustColor(color, 0.3)}`,
            background: "#000000",
            height: showControls ? 520 : "calc(100vh - 140px)",
            boxShadow: `0 20px 60px ${adjustColor(color, 0.3)}, 0 0 100px ${adjustColor(color, 0.1)}`,
            position: "relative"
          }}
        >
          <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
          
          {!isPlaying && !useMic && (
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              color: "#ffffff",
              background: "rgba(0,0,0,0.7)",
              padding: "32px 48px",
              borderRadius: 16,
              backdropFilter: "blur(10px)"
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎵</div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Prêt à visualiser</h2>
              <p style={{ marginTop: 12, color: "#9ca3af" }}>
                Chargez un fichier audio ou utilisez votre microphone
              </p>
            </div>
          )}
        </div>

        <div style={{ 
          marginTop: 16, 
          textAlign: "center", 
          color: "#6b7280",
          fontSize: 12 
        }}>
          <p style={{ margin: 0 }}>
            Raccourcis: Espace = Play/Pause | M = Micro | C = Masquer contrôles
          </p>
        </div>
      </div>

      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
}

const btnStyle = {
  padding: "8px 14px",
  borderRadius: 10,
  border: "none",
  background: "#1f2937",
  color: "#fff",
  cursor: "pointer",
  fontSize: 14,
  transition: "all 0.2s",
  fontWeight: 500
};