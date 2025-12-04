import React, { useEffect, useRef, useState } from "react";


const MODES = ["bars", "radial", "particles", "retro"]  ;

export default function Music() {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const rafRef = useRef(null);

  const [mode, setMode] = useState("radial");
  const [color, setColor] = useState("#ff5a5f");
  const [intensity, setIntensity] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fileName, setFileName] = useState("");
  const [useMic, setUseMic] = useState(false);

  const particlesRef = useRef([]);

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
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.85;
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
      particlesRef.current = new Array(80).fill().map(() => randomParticle(canvas));
    }

    const render = () => {
      analyser.getByteFrequencyData(data);
      const sum = data.reduce((a, b) => a + b, 0);
      const energy = (sum / (255 * data.length)) * intensity;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      ctx.fillStyle = "#06070b";
      ctx.fillRect(0, 0, width, height);

      if (mode === "bars") {
        drawBars(ctx, data, width, height, color, energy);
      } else if (mode === "radial") {
        drawRadial(ctx, data, width, height, color, energy);
      } else if (mode === "particles") {
        drawParticles(ctx, data, width, height, color, energy);
      } else if (mode === "retro") {
        drawRetro(ctx, data, width, height, color, energy);
      }

      ctx.save();
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = "#e6edf3";
      ctx.font = "12px Inter, system-ui, Arial";
      ctx.fillText(fileName || (useMic ? "Microphone" : "No audio"), 12, height - 12);
      ctx.restore();

      rafRef.current = requestAnimationFrame(render);
    };

    render();
  };

  function drawBars(ctx, data, w, h, colorHex, energy) {
    const bars = 64;
    const step = Math.floor(data.length / bars);
    const gap = 4;
    const barWidth = (w - gap * (bars - 1)) / bars;
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, colorHex);
    g.addColorStop(1, "#1b1f27");

    for (let i = 0; i < bars; i++) {
      const v = data[i * step] / 255;
      const bh = Math.max(2, v * h * (0.9 + energy * 0.8));
      const x = i * (barWidth + gap);
      const y = h - bh;
      ctx.fillStyle = g;
      ctx.shadowColor = colorHex;
      ctx.shadowBlur = 8 + v * 24;
      ctx.fillRect(x, y, barWidth, bh);
    }
    ctx.shadowBlur = 0;
  }

  function drawRadial(ctx, data, w, h, colorHex, energy) {
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(cx, cy) * 0.45;
    const bars = 120;
    const step = Math.floor(data.length / bars);
    ctx.save();
    ctx.translate(cx, cy);

    for (let i = 0; i < bars; i++) {
      const v = data[i * step] / 255;
      const length = v * (radius * (0.8 + energy));
      const angle = (i / bars) * Math.PI * 2;
      const x1 = Math.cos(angle) * radius;
      const y1 = Math.sin(angle) * radius;
      const x2 = Math.cos(angle) * (radius + length);
      const y2 = Math.sin(angle) * (radius + length);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = colorHex;
      ctx.lineWidth = Math.max(1, 2 * v + energy);
      ctx.shadowColor = colorHex;
      ctx.shadowBlur = 8 * v + energy * 12;
      ctx.stroke();
    }

    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.6);
    glow.addColorStop(0, colorHex);
    glow.addColorStop(1, "transparent");
    ctx.globalAlpha = 0.15 + energy * 0.35;
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;
  }

  function randomParticle(canvas) {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 3 + 1,
      life: Math.random() * 200 + 100,
    };
  }

  function drawParticles(ctx, data, w, h, colorHex, energy) {
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = "#000812";
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1.0;

    const bass = data[10] / 255;
    const particles = particlesRef.current;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx * (1 + bass * 6 * energy);
      p.y += p.vy * (1 + bass * 6 * energy);

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.globalAlpha = 0.6 * (0.4 + bass);
      ctx.fillStyle = colorHex;
      ctx.shadowColor = colorHex;
      ctx.shadowBlur = 6 * (1 + bass * energy);
      ctx.arc(p.x, p.y, p.size + bass * 6 * energy, 0, Math.PI * 2);
      ctx.fill();
    }

    if (Math.random() < bass * 0.12 * intensity) {
      particlesRef.current.push(randomParticle(canvasRef.current));
      if (particlesRef.current.length > 200) {
        particlesRef.current.shift();
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

    const rows = 40;
    const step = Math.floor(data.length / rows);
    for (let i = 0; i < rows; i++) {
      const v = data[i * step] / 255;
      const rowH = h / rows;
      const y = i * rowH;
      ctx.globalAlpha = 0.25 + v * 0.75 * energy;
      ctx.fillStyle = colorHex;
      ctx.fillRect(0, y, w * (0.2 + v * 0.8), rowH * 0.85);
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgba(255,255,255,0.02)";
    for (let y = 0; y < h; y += 2) {
      ctx.fillRect(0, y, w, 1);
    }

    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = colorHex;
    ctx.globalAlpha = 0.05 + energy * 0.12;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";
  }

  return (
    <section style={{ padding: 18 }}>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Music Visualizer</h1>
      <p style={{ marginTop: 8, color: "#6b7280" }}>
      </p>

      {}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 18, flexWrap: "wrap" }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="file" accept="audio/*" onChange={handleFile} />
        </label>

        <button onClick={togglePlay} style={btnStyle}>
          {isPlaying ? "Pause" : "Play"}
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
          style={btnStyle}
        >
          {useMic ? "Stop Micro" : "Use Microphone"}
        </button>

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          Mode
          <select value={mode} onChange={(e) => setMode(e.target.value)} style={{ padding: "6px 8px" }}>
            {MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          Color
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          Intensity
          <input
            type="range"
            min="0.2"
            max="2.0"
            step="0.1"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
          />
        </label>
      </div>

      {}
      <div
        style={{
          marginTop: 18,
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.04)",
          background: "#05060a",
          height: 420,
        }}
      >
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
      </div>

      {}
      <audio ref={audioRef} style={{ display: "none" }} />
    </section>
  );
}

const btnStyle = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "none",
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
};
