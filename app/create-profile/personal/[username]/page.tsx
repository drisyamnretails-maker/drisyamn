"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const ORANGE = "#E86A33";
const PAGE_BG = "#EDE6D3";
const PURE_BLACK = "#0A0A0A";
const LABEL_BLACK = "#0F1A3A";
const INPUT_BG = "#F6F1E6";

export default function CreateProfilePersonal(){
  const { username } = useParams() as { username: string };
  const router = useRouter();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mounted, setMounted] = useState(false);
  const [focused, setFocused] = useState("");
  const [loading, setLoading] = useState(false);

  // Files & Preview
  const [cover, setCover] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  // Editor
  const [showEditor, setShowEditor] = useState(false);
  const [editSrc, setEditSrc] = useState<string | null>(null);
  const [editType, setEditType] = useState<"cover"|"avatar">("cover");
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({x:0, y:0});
  const [dragStart, setDragStart] = useState<{x:number,y:number}|null>(null);

  const [form, setForm] = useState({
    displayName: "", bio: "", location: "Siliguri, West Bengal", website: "", interests: [] as string[],
  });

  const INTERESTS = ["Shopping","Food","Travel","Fashion","Tech","Memes","Music","Fitness"];

  useEffect(()=>setMounted(true),[]);
  if(!mounted) return null;

  const toggleInterest = (i: string) => {
    setForm(f => f.interests.includes(i)? {...f, interests: f.interests.filter(x=>x!==i)} : {...f, interests: [...f.interests, i]});
  }

  // --- FILE SELECT ---
  const handleFile = (e:any, type:"cover"|"avatar")=>{
    const file = e.target.files?.[0];
    if(!file) return;
    const url = URL.createObjectURL(file);
    setEditSrc(url);
    setEditType(type);
    setScale(1);
    setPos({x:0,y:0});
    setShowEditor(true);
    e.target.value = "";
  }

  // --- DRAG ---
  const onDown = (e:any)=>{
    const cx = e.touches? e.touches[0].clientX : e.clientX;
    const cy = e.touches? e.touches[0].clientY : e.clientY;
    setDragStart({x: cx - pos.x, y: cy - pos.y});
  }
  const onMove = (e:any)=>{
    if(!dragStart) return;
    const cx = e.touches? e.touches[0].clientX : e.clientX;
    const cy = e.touches? e.touches[0].clientY : e.clientY;
    setPos({x: cx - dragStart.x, y: cy - dragStart.y});
  }
  const onUp = ()=> setDragStart(null);

  // --- CROP SAVE ---
  const saveCrop = ()=>{
    const canvas = canvasRef.current;
    if(!canvas ||!editSrc) return;
    const ctx = canvas.getContext("2d");
    if(!ctx) return;
    const img = new Image();
    img.src = editSrc;
    img.onload = ()=>{
      const isCover = editType==="cover";
      const W = isCover? 800 : 400;
      const H = isCover? 320 : 400;
      canvas.width = W; canvas.height = H;
      ctx.clearRect(0,0,W,H);

      const imgRatio = img.width / img.height;
      const canvasRatio = W / H;
      let drawW, drawH;
      if(imgRatio > canvasRatio){ drawH = H * scale; drawW = drawH * imgRatio; }
      else { drawW = W * scale; drawH = drawW / imgRatio; }

      const dx = (W - drawW)/2 + pos.x;
      const dy = (H - drawH)/2 + pos.y;

      if(!isCover){
        ctx.save();
        ctx.beginPath();
        ctx.arc(W/2, H/2, W/2, 0, Math.PI*2);
        ctx.clip();
      }
      ctx.drawImage(img, dx, dy, drawW, drawH);
      if(!isCover) ctx.restore();

      const finalUrl = canvas.toDataURL("image/jpeg", 0.9);
      if(isCover) setCover(finalUrl);
      else setAvatar(finalUrl);
      setShowEditor(false);
    }
  }

  const handleSave = async () => {
    if(!form.displayName.trim()) return alert("Display Name likh");
    setLoading(true);
    try{
      const { data: { user } } = await supabase.auth.getUser();
      if(user){
        await supabase.from("profiles").update({
          full_name: form.displayName, bio: form.bio, location: form.location, website: form.website, interests: form.interests, onboarding_done: true,
          avatar_url: avatar, cover_url: cover
        }).eq("id", user.id);
      }
      router.push(`/personal/${username}`);
    }catch(e){ console.log(e); alert("Error"); }
    setLoading(false);
  };

  return(
    <div className="min-h-[100vh] w-full flex justify-center p-4 pt-6 overflow-y-auto" style={{background: PAGE_BG}}>
      {/* Hidden Inputs */}
      <input ref={coverInputRef} type="file" accept="image/*" hidden onChange={e=>handleFile(e,"cover")} />
      <input ref={avatarInputRef} type="file" accept="image/*" hidden onChange={e=>handleFile(e,"avatar")} />
      <canvas ref={canvasRef} className="hidden" />

      {/* EDITOR MODAL - WhatsApp Style */}
      {showEditor && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="h-[56px] flex items-center justify-between px-4 text-white">
            <button onClick={()=>setShowEditor(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✕</button>
            <p className="font-black text-[12px] tracking-widest">{editType==="cover"?"MOVE & SCALE COVER":"MOVE & SCALE AVATAR"}</p>
            <button onClick={saveCrop} className="px-5 h-8 rounded-full font-black text-[12px]" style={{background: ORANGE}}>DONE</button>
          </div>
          <div className="flex-1 bg-[#111] flex items-center justify-center relative overflow-hidden touch-none"
            onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
            onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
          >
            <div className={`relative bg-[#222] overflow-hidden ${editType==="cover"?"w-[95%] max-w-[600px] aspect-[2.5/1] rounded-[12px]":"w-[300px] h-[300px] rounded-full"}`}>
              {editSrc && (
                <img src={editSrc} draggable={false} className="absolute max-w-none"
                  style={{
                    left:`calc(50% + ${pos.x}px)`, top:`calc(50% + ${pos.y}px)`,
                    transform:`translate(-50%,-50%) scale(${scale})`,
                    minWidth:"100%", minHeight:"100%", cursor: dragStart?"grabbing":"grab"
                  }}
                />
              )}
            </div>
          </div>
          <div className="h-[90px] bg-black px-6 flex flex-col justify-center gap-2">
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-[11px] font-bold">ZOOM</span>
              <input type="range" min="1" max="3.5" step="0.01" value={scale} onChange={e=>setScale(parseFloat(e.target.value))} className="flex-1 accent-[#E86A33]" />
            </div>
            <p className="text-white/40 text-[10px] text-center">Drag to move • Like WhatsApp</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-[400px] bg-[#FFFEFB] rounded-[24px] overflow-hidden border border-black/[0.05] shadow-[0_0_0_8px_#fff,0_0_0_9px_rgba(0,0,0,0.05),0_20px_50px_rgba(0,0,0,0.12)] mb-10">

        {/* COVER */}
        <div className="w-full h-[140px] bg-[#F6F1E6] relative border-b border-black/5 overflow-hidden cursor-pointer" onClick={()=>coverInputRef.current?.click()}>
          {cover? <img src={cover} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="text-[28px] opacity-40">🖼️</span></div>}
          <button onClick={(e)=>{e.stopPropagation(); coverInputRef.current?.click()}} className="absolute bottom-3 right-3 px-3 h-[28px] rounded-full bg-black text-white text-[11px] font-bold active:scale-95 transition-transform">
            {cover?"Edit Cover":"Add Cover"}
          </button>
        </div>

        {/* AVATAR */}
        <div className="flex flex-col items-center -mt-[42px] relative z-10">
          <div className="w-[84px] h-[84px] rounded-full bg-white border-[4px] border-white shadow flex items-center justify-center overflow-hidden cursor-pointer" onClick={()=>avatarInputRef.current?.click()}>
            {avatar? <img src={avatar} className="w-full h-full object-cover" /> : <span className="text-[32px]">📸</span>}
          </div>
          <button onClick={()=>avatarInputRef.current?.click()} className="mt-2 text-[13px] font-bold active:scale-95 transition-transform" style={{color: ORANGE}}>
            {avatar?"Change Photo":"Add Profile Photo"}
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="text-center">
            <h2 style={{color: PURE_BLACK, fontSize: "19px", fontWeight: 700}}>Create your profile</h2>
            <p className="mt-1" style={{color: "#6B7280", fontSize: "12.5px"}}>@{username}</p>
          </div>

          <label className="mt-6 block" style={{color: LABEL_BLACK, fontSize: "16px", fontWeight: 700}}>Display Name</label>
          <input value={form.displayName} onChange={e=>setForm({...form, displayName: e.target.value})} onFocus={()=>setFocused("name")} onBlur={()=>setFocused("")} placeholder="Sobha Roy"
            className="mt-2 w-full h-[52px] px-5 rounded-[14px] border text-[15.5px] font-medium outline-none transition-all"
            style={{background: focused==="name"?"#fff":INPUT_BG, color: "#111827", borderColor: focused==="name"? ORANGE : "rgba(0,0,0,0.1)", boxShadow: focused==="name"?`0 0 0 4px ${ORANGE}15`:"none"}}
          />

          <label className="mt-5 block" style={{color: LABEL_BLACK, fontSize: "16px", fontWeight: 700}}>Bio</label>
          <textarea value={form.bio} onChange={e=>setForm({...form, bio: e.target.value})} onFocus={()=>setFocused("bio")} onBlur={()=>setFocused("")} placeholder="Writer | Explorer | Siliguri ❤️" rows={3}
            className="mt-2 w-full px-5 py-4 rounded-[14px] border text-[15.5px] font-medium outline-none resize-none transition-all"
            style={{background: focused==="bio"?"#fff":INPUT_BG, color: "#111827", borderColor: focused==="bio"? ORANGE : "rgba(0,0,0,0.1)", boxShadow: focused==="bio"?`0 0 0 4px ${ORANGE}15`:"none"}}
          />

          <label className="mt-5 block" style={{color: LABEL_BLACK, fontSize: "16px", fontWeight: 700}}>Location</label>
          <input value={form.location} onChange={e=>setForm({...form, location: e.target.value})} onFocus={()=>setFocused("loc")} onBlur={()=>setFocused("")}
            className="mt-2 w-full h-[52px] px-5 rounded-[14px] border text-[15.5px] font-medium outline-none transition-all"
            style={{background: focused==="loc"?"#fff":INPUT_BG, color: "#111827", borderColor: focused==="loc"? ORANGE : "rgba(0,0,0,0.1)"}}
          />

          <label className="mt-5 block" style={{color: LABEL_BLACK, fontSize: "16px", fontWeight: 700}}>Interests</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {INTERESTS.map(tag=>{
              const active = form.interests.includes(tag);
              return(<button key={tag} onClick={()=>toggleInterest(tag)} className="px-4 h-[36px] rounded-full text-[13px] font-bold border active:scale-95 transition-all" style={{background: active? PURE_BLACK : "#F6F1E6", color: active? "#fff" : "#111827", borderColor: active? PURE_BLACK : "rgba(0,0,0,0.08)"}}>{tag}</button>)
            })}
          </div>

          <button onClick={handleSave} disabled={loading} className="mt-8 w-full h-[52px] rounded-full text-white text-[14px] font-black tracking-[0.08em] uppercase active:scale-[0.98] transition-all disabled:opacity-60"
            style={{background: ORANGE, boxShadow: "0 0 0 6px white, 0 10px 24px rgba(232,106,51,0.35)"}}
          >{loading?"SAVING...":"FINISH →"}</button>
        </div>
      </div>
    </div>
  )
}