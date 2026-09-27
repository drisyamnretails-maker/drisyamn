"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const ORANGE = "#E86A33";
const BLACK = "#0A0A0A";

export default function CreateProfileFinal() {
  const { username } = useParams() as { username: string };
  const router = useRouter();
  const coverInput = useRef<HTMLInputElement>(null);
  const avatarInput = useRef<HTMLInputElement>(null);

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  // Data
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Form
  const [form, setForm] = useState({
    displayName: "",
    bio: "",
    location: "",
    website: "",
    interests: [] as string[],
  });

  // Editor
  const [showEditor, setShowEditor] = useState(false);
  const [editSrc, setEditSrc] = useState<string | null>(null);
  const [editType, setEditType] = useState<"cover" | "avatar">("cover");
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const INTERESTS = ["Shopping", "Food", "Travel", "Fashion", "Tech", "Memes", "Music", "Fitness", "Art", "Gaming"];

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // --- FILE HANDLERS ---
  const handleFileSelect = (e: any, type: "cover" | "avatar") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === "avatar") setAvatarFile(file);
    else setCoverFile(file);

    const url = URL.createObjectURL(file);
    setEditSrc(url);
    setEditType(type);
    setScale(1);
    setPos({ x: 0, y: 0 });
    setShowEditor(true);
    e.target.value = "";
  };

  // --- DRAG LOGIC ---
  const onDown = (e: any) => {
    const cx = e.touches? e.touches[0].clientX : e.clientX;
    const cy = e.touches? e.touches[0].clientY : e.clientY;
    setIsDragging(true);
    setDragStart({ x: cx - pos.x, y: cy - pos.y });
  };
  const onMove = (e: any) => {
    if (!isDragging) return;
    const cx = e.touches? e.touches[0].clientX : e.clientX;
    const cy = e.touches? e.touches[0].clientY : e.clientY;
    setPos({ x: cx - dragStart.x, y: cy - dragStart.y });
  };
  const onUp = () => setIsDragging(false);

  // --- CROP & SAVE ---
  const handleCropSave = () => {
    const canvas = canvasRef.current;
    if (!canvas ||!editSrc) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.src = editSrc;
    img.onload = () => {
      const isCover = editType === "cover";
      const W = isCover? 900 : 400;
      const H = isCover? 340 : 400;
      canvas.width = W;
      canvas.height = H;
      ctx.clearRect(0, 0, W, H);

      // WhatsApp style fill logic
      const imgRatio = img.width / img.height;
      const canvasRatio = W / H;
      let drawW, drawH;
      if (imgRatio > canvasRatio) {
        drawH = H * scale;
        drawW = drawH * imgRatio;
      } else {
        drawW = W * scale;
        drawH = drawW / imgRatio;
      }
      const dx = (W - drawW) / 2 + pos.x;
      const dy = (H - drawH) / 2 + pos.y;

      if (!isCover) {
        // Avatar circle clip
        ctx.save();
        ctx.beginPath();
        ctx.arc(W/2, H/2, W/2, 0, Math.PI*2);
        ctx.clip();
      }

      ctx.drawImage(img, dx, dy, drawW, drawH);
      if (!isCover) ctx.restore();

      const final = canvas.toDataURL("image/jpeg", 0.9);
      if (isCover) setCoverUrl(final);
      else setAvatarUrl(final);
      setShowEditor(false);
    };
  };

  const toggleInterest = (t: string) => {
    setForm(f => ({
     ...f,
      interests: f.interests.includes(t)? f.interests.filter(i => i!== t) : [...f.interests, t]
    }));
  };

  const handleFinalSave = async () => {
    if (!form.displayName.trim()) return alert("Display Name likh bhai");
    setLoading(true);
    try {
      // Upload to supabase storage if bucket exists (optional, fallback to base64)
      let finalCover = coverUrl;
      let finalAvatar = avatarUrl;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Try upload avatar
        if (avatarUrl) {
          const res = await fetch(avatarUrl);
          const blob = await res.blob();
          const path = `avatars/${user.id}_${Date.now()}.jpg`;
          const { data: up } = await supabase.storage.from("profiles").upload(path, blob, { upsert: true });
          if (up) {
            const { data } = supabase.storage.from("profiles").getPublicUrl(path);
            finalAvatar = data.publicUrl;
          }
        }
        if (coverUrl) {
          const res = await fetch(coverUrl);
          const blob = await res.blob();
          const path = `covers/${user.id}_${Date.now()}.jpg`;
          const { data: up } = await supabase.storage.from("profiles").upload(path, blob, { upsert: true });
          if (up) {
            const { data } = supabase.storage.from("profiles").getPublicUrl(path);
            finalCover = data.publicUrl;
          }
        }

        await supabase.from("profiles").update({
          full_name: form.displayName,
          bio: form.bio,
          location: form.location,
          website: form.website,
          avatar_url: finalAvatar,
          cover_url: finalCover,
          interests: form.interests,
          onboarding_done: true,
        }).eq("id", user.id);
      }
      localStorage.setItem("drisyamn_username", username as string);
      router.push(`/profile/personal/${username}`);
    } catch (e) {
      console.error(e);
      alert("Save failed, check console");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#EDE6D3] p-0 sm:p-4 overflow-y-auto">
      <input ref={coverInput} type="file" accept="image/*" hidden onChange={e => handleFileSelect(e, "cover")} />
      <input ref={avatarInput} type="file" accept="image/*" hidden onChange={e => handleFileSelect(e, "avatar")} />
      <canvas ref={canvasRef} className="hidden" />

      {/* EDITOR MODAL */}
      {showEditor && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          <div className="h-[56px] flex items-center justify-between px-4 text-white shrink-0">
            <button onClick={() => setShowEditor(false)} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">✕</button>
            <p className="font-black text-[13px] tracking-[0.15em]">{editType === "cover"? "EDIT COVER" : "EDIT AVATAR"}</p>
            <button onClick={handleCropSave} className="px-5 h-9 rounded-full font-black text-[12px]" style={{ background: ORANGE }}>DONE</button>
          </div>

          <div className="flex-1 flex items-center justify-center bg-[#0f0f0f] relative overflow-hidden select-none touch-none"
            onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
            onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
          >
            <div className={`relative overflow-hidden bg-[#1a1a1a] shadow-2xl ${editType === "cover"? "w-[92%] max-w-[650px] aspect-[2.7/1] rounded-[12px]" : "w-[320px] h-[320px] rounded-full"}`}>
              {editSrc && (
                <img src={editSrc} draggable={false}
                  className="absolute max-w-none will-change-transform"
                  style={{
                    left: `calc(50% + ${pos.x}px)`,
                    top: `calc(50% + ${pos.y}px)`,
                    transform: `translate(-50%,-50%) scale(${scale})`,
                    minWidth: "100%", minHeight: "100%",
                    cursor: isDragging? "grabbing" : "grab"
                  }}
                />
              )}
              {editType === "cover" && (
                <div className="absolute inset-0 pointer-events-none opacity-30">
                  <div className="w-full h-full grid grid-cols-3 grid-rows-2 border border-white/20">
                    <div className="border-r border-white/20"></div><div className="border-r border-white/20"></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="h-[96px] bg-black px-6 flex flex-col justify-center gap-2">
            <div className="flex items-center gap-4">
              <span className="text-white/60 text-[11px] font-bold tracking-widest">ZOOM</span>
              <input type="range" min="1" max="3.5" step="0.01" value={scale} onChange={e => setScale(parseFloat(e.target.value))} className="flex-1 accent-[#E86A33] h-1" />
              <span className="text-white text-[11px] font-bold w-8">{scale.toFixed(1)}x</span>
            </div>
            <p className="text-white/40 text-[11px] text-center">Drag to reposition • Pinch to zoom • WhatsApp style</p>
          </div>
        </div>
      )}

      {/* CARD */}
      <div className="w-full max-w-[420px] bg-[#FFFEFB] sm:rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-black/5 h-fit mb-10">
        {/* Cover */}
        <div className="w-full h-[168px] bg-[#F6F1E6] relative border-b border-black/[0.06] group cursor-pointer" onClick={() => coverInput.current?.click()}>
          {coverUrl? <img src={coverUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex flex-col items-center justify-center gap-2"><div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-[18px]">🖼️</div><span className="text-[11px] font-bold tracking-widest opacity-40">ADD COVER</span></div>}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
          <button onClick={(e) => { e.stopPropagation(); coverInput.current?.click() }} className="absolute bottom-3 right-3 px-4 h-[34px] rounded-full bg-black text-white text-[11px] font-black tracking-wide shadow-[0_4px_12px_rgba(0,0,0,0.2)] active:scale-95 transition-transform">
            {coverUrl? "EDIT COVER" : "+ COVER"}
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center -mt-[48px] relative z-10">
          <div className="w-[92px] h-[92px] rounded-full bg-white border-[5px] border-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] overflow-hidden flex items-center justify-center cursor-pointer" onClick={() => avatarInput.current?.click()}>
            {avatarUrl? <img src={avatarUrl} className="w-full h-full object-cover" /> : <span className="text-[30px]">📸</span>}
          </div>
          <button onClick={() => avatarInput.current?.click()} className="mt-2.5 px-3 py-1 rounded-full bg-black text-white text-[11px] font-bold">
            {avatarUrl? "Change" : "Add Photo"}
          </button>
        </div>

        <div className="px-6 pt-5 pb-8">
          <div className="text-center">
            <h1 className="font-black text-[20px] tracking-tight" style={{ color: BLACK }}>Create Profile</h1>
            <p className="mt-1 text-[12px] font-bold tracking-widest text-black/40">@{username}</p>
          </div>

          {/* Inputs */}
          <div className="mt-7 space-y-4">
            <div>
              <label className="text-[13px] font-black tracking-wide" style={{ color: "#0F1A3A" }}>Display Name *</label>
              <input value={form.displayName} onChange={e => setForm({...form, displayName: e.target.value })} onFocus={() => setFocused("name")} onBlur={() => setFocused("")} placeholder="Sobha Roy"
                className="mt-2 w-full h-[52px] px-5 rounded-[14px] border text-[15px] font-semibold outline-none transition-all"
                style={{ background: focused === "name"? "#fff" : "#F6F1E6", borderColor: focused === "name"? ORANGE : "rgba(0,0,0,0.08)", boxShadow: focused === "name"? `0 0 0 4px ${ORANGE}18` : "none" }}
              />
            </div>

            <div>
              <label className="text-[13px] font-black tracking-wide" style={{ color: "#0F1A3A" }}>Bio</label>
              <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value })} onFocus={() => setFocused("bio")} onBlur={() => setFocused("")} placeholder="Writer | Explorer | Siliguri ❤️" rows={3}
                className="mt-2 w-full px-5 py-3.5 rounded-[14px] border text-[14px] font-medium outline-none resize-none transition-all"
                style={{ background: focused === "bio"? "#fff" : "#F6F1E6", borderColor: focused === "bio"? ORANGE : "rgba(0,0,0,0.08)" }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[13px] font-black">Location</label>
                <input value={form.location} onChange={e => setForm({...form, location: e.target.value })} placeholder="Siliguri" className="mt-2 w-full h-[50px] px-4 rounded-[14px] border bg-[#F6F1E6] text-[14px] font-semibold outline-none focus:bg-white" />
              </div>
              <div>
                <label className="text-[13px] font-black">Website</label>
                <input value={form.website} onChange={e => setForm({...form, website: e.target.value })} placeholder="link.me/sobha" className="mt-2 w-full h-[50px] px-4 rounded-[14px] border bg-[#F6F1E6] text-[14px] font-semibold outline-none focus:bg-white" />
              </div>
            </div>

            <div>
              <label className="text-[13px] font-black">Interests</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {INTERESTS.map(t => {
                  const active = form.interests.includes(t);
                  return <button key={t} onClick={() => toggleInterest(t)} className="px-4 h-[36px] rounded-full text-[12px] font-black border transition-all active:scale-95" style={{ background: active? BLACK : "#F6F1E6", color: active? "#fff" : "#111", borderColor: active? BLACK : "rgba(0,0,0,0.06)" }}>{t}</button>
                })}
              </div>
            </div>
          </div>

          <button onClick={handleFinalSave} disabled={loading} className="mt-8 w-full h-[56px] rounded-full text-white text-[13px] font-black tracking-[0.12em] uppercase active:scale-[0.98] disabled:opacity-60 transition-all shadow-[0_10px_24px_rgba(232,106,51,0.35)]" style={{ background: ORANGE }}>
            {loading? "SAVING..." : "CREATE PROFILE →"}
          </button>
          <p className="mt-3 text-center text-[11px] font-semibold text-black/30">You can change this later</p>
        </div>
      </div>
    </div>
  );
}