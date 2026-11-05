// components/createreels/CreateReels.tsx - FIXED & THEMED
"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FILTER_PRESETS, LIPS_OUTER, LIPS_INNER, LEFT_EYE, RIGHT_EYE, LEFT_CHEEK, RIGHT_CHEEK } from "./BeautyEngine";

const WOMAN = [
  { id: "natural", label: "Natural", img: "/filters/natural.jpg" },
  { id: "soft", label: "Soft", img: "/filters/soft.jpg" },
  { id: "glam", label: "Glam", img: "/filters/glam.jpg" },
  { id: "bold", label: "Bold", img: "/filters/bold.jpg" },
  { id: "baby", label: "Baby", img: "/filters/baby.jpg" },
];
const MAN = [
  { id: "man_natural", label: "Natural", img: "/filters/man_natural.jpg" },
  { id: "man_clear", label: "Clear", img: "/filters/man_clear.jpg" },
  { id: "man_sharp", label: "Sharp", img: "/filters/man_sharp.jpg" },
  { id: "man_cool", label: "Cool", img: "/filters/man_cool.jpg" },
  { id: "man_baby", label: "Baby", img: "/filters/man_baby.jpg" },
];

export default function CreateReels() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const mrRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const [isRec, setIsRec] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [gender, setGender] = useState<"woman" | "man">("woman");
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeRef = useRef(activeId); activeRef.current = activeId;
  const presetRef = useRef<any>(null);
  presetRef.current = activeId ? FILTER_PRESETS[activeId] : null;
  const current = gender === "woman" ? WOMAN : MAN;

  useEffect(() => {
    let a = true;
    (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: facing, width: { ideal: 1080 }, height: { ideal: 1920 } }, 
          audio: true 
        });
        if (!a) return; 
        setStream(s);
        if (videoRef.current) { 
          videoRef.current.srcObject = s; 
          await videoRef.current.play().catch(() => {}); 
        }
      } catch (e) {
        console.error("Camera access error:", e);
      }
    })();
    return () => { 
      a = false; 
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [facing]);

  // ==== INSTA ENGINE - FIXED ====
  useEffect(() => {
    let raf: number; 
    let faceMesh: any; 
    let running = true;
    let smoothLm: any = null;

    (async () => {
      try {
        const { FaceMesh } = await import("@mediapipe/face_mesh");
        faceMesh = new FaceMesh({ locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}` });
        faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.6, minTrackingConfidence: 0.6 });

        faceMesh.onResults((results: any) => {
          if (!running) return;
          const canvas = canvasRef.current; if (!canvas) return;
          const ctx = canvas.getContext("2d"); if (!ctx) return;
          
          const W = canvas.width || 720;
          const H = canvas.height || 1280;
          const preset = presetRef.current;

          ctx.save();
          ctx.clearRect(0, 0, W, H);
          
          if (facing === "user") { 
            ctx.translate(W, 0); 
            ctx.scale(-1, 1); 
          }
          if (results.image) {
            ctx.drawImage(results.image, 0, 0, W, H);
          }

          if (preset && results.multiFaceLandmarks?.[0]) {
            let lm = results.multiFaceLandmarks[0];
            if (!smoothLm) smoothLm = JSON.parse(JSON.stringify(lm));
            else {
              for (let i = 0; i < lm.length; i++) {
                smoothLm[i].x += (lm[i].x - smoothLm[i].x) * 0.35;
                smoothLm[i].y += (lm[i].y - smoothLm[i].y) * 0.35;
                smoothLm[i].z += (lm[i].z - smoothLm[i].z) * 0.35;
              }
              lm = smoothLm;
            }

            const px = (i: number) => ({ x: lm[i].x * W, y: lm[i].y * H });

            // 1. SKIN SMOOTH
            if (preset.smooth > 0) {
              ctx.save();
              ctx.beginPath();
              const faceOval = [10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109];
              faceOval.forEach((idx, i) => { const p = px(idx); if(i===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y); });
              ctx.closePath(); ctx.clip();
              ctx.globalAlpha = preset.smooth * 0.55;
              ctx.filter = `blur(${preset.smooth * 12}px) brightness(${preset.bright})`;
              if (results.image) ctx.drawImage(results.image, 0, 0, W, H);
              ctx.filter = "none"; ctx.globalAlpha = 1;
              ctx.restore();
            }

            // 2. BLUSH
            if (preset.blush > 0) {
              [LEFT_CHEEK, RIGHT_CHEEK].forEach(cheek => {
                const c = px(cheek[0]);
                const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, W * 0.09);
                grad.addColorStop(0, `rgba(255,110,120,${preset.blush * 0.35})`);
                grad.addColorStop(1, `rgba(255,110,120,0)`);
                ctx.fillStyle = grad;
                ctx.beginPath(); ctx.arc(c.x, c.y, W * 0.09, 0, Math.PI * 2); ctx.fill();
              });
            }

            // 3. EYESHADOW
            if (preset.eyeShadow) {
              [LEFT_EYE, RIGHT_EYE].forEach(eye => {
                ctx.save();
                ctx.beginPath();
                eye.forEach((idx: number, i: number)=>{ const p=px(idx); if(i===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y); });
                ctx.closePath();
                ctx.fillStyle = "rgba(90,40,50,0.18)";
                ctx.fill(); ctx.restore();
              });
            }

            // 4. LIPS
            if (preset.lipColor?.[3] > 0) {
              const [r, g, b, alpha] = preset.lipColor;
              ctx.save();
              ctx.beginPath();
              LIPS_OUTER.forEach((idx: number, i: number)=>{ const p=px(idx); if(i===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y); });
              ctx.closePath();
              ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.6})`;
              ctx.filter = "blur(1.5px)";
              ctx.fill(); ctx.filter = "none"; ctx.restore();
              
              ctx.save();
              ctx.beginPath();
              LIPS_INNER.forEach((idx: number, i: number)=>{ const p=px(idx); if(i===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y); });
              ctx.closePath();
              ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
              ctx.fill(); ctx.restore();
            }

            // 5. WARM TONE
            if (preset.warm) {
              ctx.fillStyle = preset.warm > 0 ? `rgba(255,180,100,${preset.warm * 0.12})` : `rgba(100,180,255,${Math.abs(preset.warm) * 0.12})`;
              ctx.fillRect(0, 0, W, H);
            }
          }
          ctx.restore();
        });

        const loop = async () => {
          if (!running || !videoRef.current) return;
          if (videoRef.current.readyState >= 2) { 
            const canvas = canvasRef.current;
            if (canvas && canvas.width !== videoRef.current.videoWidth) {
              canvas.width = videoRef.current.videoWidth || 720;
              canvas.height = videoRef.current.videoHeight || 1280;
            }
            try { await faceMesh.send({ image: videoRef.current }); } catch (e) {} 
          }
          raf = requestAnimationFrame(loop);
        };
        loop();
      } catch (err) {
        console.error("FaceMesh initialization error:", err);
      }
    })();

    return () => { 
      running = false; 
      cancelAnimationFrame(raf); 
      faceMesh?.close(); 
    };
  }, [facing]);

  const flip = () => setFacing(f => f === "user" ? "environment" : "user");
  
  const startRec = () => {
    if (!canvasRef.current) return; 
    setIsRec(true); 
    chunksRef.current = [];
    try {
      const cs = (canvasRef.current as any).captureStream(30);
      if (stream) {
        const at = stream.getAudioTracks()[0]; 
        if (at) cs.addTrack(at);
      }
      const mr = new MediaRecorder(cs, { mimeType: "video/webm;codecs=vp9" }); 
      mrRef.current = mr;
      mr.ondataavailable = e => e.data.size && chunksRef.current.push(e.data);
      mr.onstop = () => { 
        const b = new Blob(chunksRef.current, { type: "video/webm" }); 
        if (b.size) setUrl(URL.createObjectURL(b)); 
      };
      mr.start(100);
    } catch (e) {
      console.error("Recording start error:", e);
      setIsRec(false);
    }
  };

  const stopRec = () => { 
    setIsRec(false); 
    try {
      mrRef.current?.stop(); 
    } catch(e) {}
  };

  return (
    <div className="w-full h-[100dvh] bg-[#F5F0EB] flex justify-center overflow-hidden">
      <div className="relative w-full max-w-[390px] h-full bg-[#F5F0EB] overflow-hidden rounded-[20px] shadow-2xl">
        <div className="absolute inset-0 bg-black">
          {!url ? (
            <>
              <video ref={videoRef} autoPlay muted playsInline className="hidden" />
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
            </>
          ) : (
            <video src={url} autoPlay loop controls playsInline className="w-full h-full object-cover" />
          )}
        </div>

        {/* Top Bar */}
        {!url && (
          <div className="absolute top-[12px] left-0 right-0 z-20 flex items-center justify-between px-3 pt-4">
            <button 
              onClick={() => router.back()} 
              className="w-[40px] h-[40px] rounded-[12px] bg-black/40 backdrop-blur-xl border border-[#D4AF37]/30 flex items-center justify-center text-white"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 bg-[#D4AF37] text-black font-semibold backdrop-blur-xl rounded-full px-4 py-[7px] shadow-md">
              <span className="text-[13px]">♪ Add music</span>
            </div>
            <div className="w-[40px]" />
          </div>
        )}

        {/* Right Sidebar */}
        {!url && (
          <div className="absolute right-3 top-[128px] z-20 flex flex-col gap-[14px]">
            <button 
              onClick={flip} 
              className="w-[60px] h-[60px] rounded-[20px] bg-black/40 backdrop-blur-xl border border-[#D4AF37]/40 text-white flex flex-col items-center justify-center text-xs font-medium"
            >
              <span>🔄</span> Flip
            </button>
            <button 
              className="w-[60px] h-[60px] rounded-[20px] bg-black/40 backdrop-blur-xl border border-[#D4AF37]/40 text-white flex flex-col items-center justify-center text-xs font-medium"
            >
              <span>⏱️</span> Timer
            </button>
          </div>
        )}

        {/* Gender & Filters Picker */}
        {!url && (
          <div className="absolute bottom-[112px] left-0 right-0 z-20 px-3">
            <div className="flex justify-center mb-2">
              <div className="flex bg-black/60 backdrop-blur-xl border border-[#D4AF37]/40 rounded-full p-1">
                {(["woman", "man"] as const).map(g => (
                  <button 
                    key={g} 
                    onClick={() => { setGender(g); setActiveId(null); }} 
                    className={`px-5 py-1.5 rounded-full text-[12px] font-bold transition-all ${gender === g ? "bg-[#D4AF37] text-black shadow" : "text-white/80"}`}
                  >
                    {g === "woman" ? "Woman" : "Man"}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-black/50 backdrop-blur-xl border border-[#D4AF37]/30 rounded-[22px] px-3 py-3">
              <div className="flex gap-3 overflow-x-auto no-scrollbar">
                <button 
                  onClick={() => setActiveId(null)} 
                  className="flex flex-col items-center gap-1 shrink-0"
                >
                  <div className={`w-[56px] h-[56px] rounded-[16px] flex items-center justify-center border-2 text-[20px] ${!activeId ? "border-[#D4AF37] bg-white" : "border-white/20 bg-black/40"}`}>
                    🚫
                  </div>
                  <span className="text-[10px] font-bold text-white/80">None</span>
                </button>
                {current.map(f => {
                  const isActive = activeId === f.id;
                  return (
                    <button 
                      key={f.id} 
                      onClick={() => setActiveId(f.id)} 
                      className="flex flex-col items-center gap-1 shrink-0"
                    >
                      <div className={`w-[56px] h-[56px] rounded-[16px] overflow-hidden border-2 transition-transform ${isActive ? "border-[#D4AF37] scale-110 shadow-lg" : "border-white/20"}`}>
                        <img src={f.img} className="w-full h-full object-cover" alt={f.label} />
                      </div>
                      <span className={`text-[10px] font-bold ${isActive ? "text-[#D4AF37]" : "text-white/80"}`}>{f.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Recording Action Bar */}
        <div className="absolute bottom-4 left-1 right-1 z-20">
          <div className="w-full bg-black/60 backdrop-blur-xl border border-[#D4AF37]/30 rounded-[26px] px-7 py-[10px] flex items-center">
            <button 
              onClick={() => fileRef.current?.click()} 
              className="w-[44px] h-[44px] rounded-[10px] overflow-hidden border-[2px] border-[#D4AF37] bg-black/40 shrink-0 ml-3 shadow"
            >
              <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200" className="w-full h-full object-cover" alt="Upload" />
            </button>
            <div className="flex-1 flex justify-center">
              <button 
                onMouseDown={startRec} 
                onMouseUp={stopRec} 
                onTouchStart={startRec} 
                onTouchEnd={stopRec} 
                className="w-[68px] h-[68px] rounded-full border-2 border-[#D4AF37] bg-white flex items-center justify-center shadow-xl active:scale-95 transition-transform"
              >
                <div className="w-[60px] h-[60px] rounded-full bg-black flex items-center justify-center">
                  <div className={`bg-[#800020] rounded-full transition-all ${isRec ? "w-[24px] h-[24px] rounded-[5px]" : "w-[46px] h-[46px]"}`} />
                </div>
              </button>
            </div>
            <div className="w-[44px] shrink-0 mr-3" />
          </div>
        </div>

        <input ref={fileRef} hidden type="file" accept="video/*,image/*" onChange={e => { const f = e.target.files?.[0]; if (f) setUrl(URL.createObjectURL(f)); }} />
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}