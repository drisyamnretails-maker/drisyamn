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

  const [cover, setCover] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  const [showEditor, setShowEditor] = useState(false);
  const [editSrc, setEditSrc] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({x:0, y:0});
  const [dragStart, setDragStart] = useState<{x:number,y:number}|null>(null);

  const [form, setForm] = useState({
    displayName: "", bio: "", location: "Siliguri, West Bengal", dob: "", website: "", interests: [] as string[],
  });

  const INTERESTS = ["Shopping","Food","Travel","Fashion","Tech","Memes","Music","Fitness"];

  useEffect(()=>setMounted(true),[]);
  if(!mounted) return null;

  const toggleInterest = (i: string) => {
    setForm(f => f.interests.includes(i)? {...f, interests: f.interests.filter(x=>x!==i)} : {...f, interests: [...f.interests, i]});
  }

  const handleCoverFile = (e:any)=>{
    const file = e.target.files?.[0];
    if(!file) return;
    const url = URL.createObjectURL(file);
    setEditSrc(url);
    setScale(1);
    setPos({x:0,y:0});
    setShowEditor(true);
    e.target.value = "";
  }

  const handleAvatarFile = (e:any)=>{
    const file = e.target.files?.[0];
    if(!file) return;
    const url = URL.createObjectURL(file);
    setAvatar(url);
    e.target.value = "";
  }

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

  const saveCrop = ()=>{
    const canvas = canvasRef.current;
    if(!canvas ||!editSrc) return;
    const ctx = canvas.getContext("2d");
    if(!ctx) return;
    const img = new Image();
    img.src = editSrc;
    img.onload = ()=>{
      const W = 800; const H = 320;
      canvas.width = W; canvas.height = H;
      ctx.clearRect(0,0,W,H);
      const imgRatio = img.width / img.height;
      const canvasRatio = W / H;
      let drawW, drawH;
      if(imgRatio > canvasRatio){ drawH = H * scale; drawW = drawH * imgRatio; }
      else { drawW = W * scale; drawH = drawW / imgRatio; }
      const dx = (W - drawW)/2 + pos.x;
      const dy = (H - drawH)/2 + pos.y;
      ctx.drawImage(img, dx, dy, drawW, drawH);
      const finalUrl = canvas.toDataURL("image/jpeg", 0.9);
      setCover(finalUrl);
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
          full_name: form.displayName, bio: form.bio, location: form.location, dob: form.dob, website: form.website, interests: form.interests, onboarding_done: true,
          avatar_url: avatar, cover_url: cover, username: username
        }).eq("id", user.id);
      }
      // FIXED: Tera folder profile/personal me hai isliye yahi route hoga
      router.push(`/profile/personal/${username}`);
    }catch(e){ console.log(e); }
    setLoading(false);
  };

  return(
    <div className="min-h-[100vh] w-full flex justify-center p-4 pt-6 overflow-y-auto" style={{background: PAGE_BG, fontFamily: "'Plus Jakarta Sans', sans-serif"}}>
      <input ref={coverInputRef} type="file" accept="image/*" hidden onChange={handleCoverFile} />
      <input ref={avatarInputRef} type="file" accept="image/*" hidden onChange={handleAvatarFile} />
      <canvas ref={canvasRef} className="hidden" />

      {showEditor && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="h-[56px] flex items-center justify-between px-4 text-white">
            <button onClick={()=>setShowEditor(false)} className="w-8 h-8 rounded-full bg-white/10">✕</button>
            <p className="font-bold text-[12px] tracking-[0.2em]" style={{fontFamily:"'Space Grotesk', sans-serif"}}>EDIT COVER</p>
            <button onClick={saveCrop} className="px-5 h-8 rounded-full font-black text-[12px] text-white" style={{background: ORANGE}}>DONE</button>
          </div>
          <div className="flex-1 bg-[#111] flex items-center justify-center overflow-hidden touch-none"
            onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
          >
            <div className="relative bg-[#222] overflow-hidden w-[95%] max-w-[600px] aspect-[2.5/1] rounded-[16px]">
              {editSrc && <img src={editSrc} draggable={false} className="absolute max-w-none" style={{left:`calc(50% + ${pos.x}px)`, top:`calc(50% + ${pos.y}px)`, transform:`translate(-50%,-50%) scale(${scale})`, minWidth:"100%", minHeight:"100%", cursor: dragStart?"grabbing":"grab"}} />}
            </div>
          </div>
          <div className="h-[80px] bg-black px-6 flex items-center gap-3">
            <span className="text-white/60 text-[11px] font-bold">ZOOM</span>
            <input type="range" min="1" max="3.5" step="0.01" value={scale} onChange={e=>setScale(parseFloat(e.target.value))} className="flex-1 accent-[#E86A33]" />
          </div>
        </div>
      )}

      <div className="w-full max-w-[400px] bg-[#FFFEFB] rounded-[24px] overflow-hidden border border-black/[0.05] shadow-[0_0_0_8px_#fff,0_0_0_9px_rgba(0,0,0,0.05),0_20px_50px_rgba(0,0,0,0.12)] mb-10">
        <div className="w-full h-[148px] bg-[#F6F1E6] relative overflow-hidden cursor-pointer group" onClick={()=>coverInputRef.current?.click()}>
          {cover? <img src={cover} className="w-full h-full object-cover" /> : <div className="w-full h-full flex flex-col items-center justify-center gap-1.5"><span className="text-[26px] opacity-30">🖼️</span><span className="text-[10px] font-black tracking-[0.2em] opacity-30" style={{fontFamily:"'Space Grotesk', sans-serif"}}>TAP TO ADD COVER</span></div>}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 bg-black/70 text-white px-3 py-1 rounded-full text-[11px] font-bold">Change Cover</span>
          </div>
        </div>

        <div className="flex flex-col items-center -mt-[42px] relative z-10">
          <div className="w-[84px] h-[84px] rounded-full bg-white border-[4px] border-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] flex items-center justify-center overflow-hidden cursor-pointer" onClick={()=>avatarInputRef.current?.click()}>
            {avatar? <img src={avatar} className="w-full h-full object-cover object-center" style={{objectFit:"cover"}} /> : <span className="text-[30px]">📸</span>}
          </div>
          <button onClick={()=>avatarInputRef.current?.click()} className="mt-2 text-[12px] font-black tracking-wide" style={{color: ORANGE, fontFamily:"'Space Grotesk', sans-serif"}}>{avatar?"CHANGE PHOTO":"ADD PHOTO"}</button>
        </div>

        <div className="px-6 py-6">
          <div className="text-center">
            <h2 className="font-black tracking-tight" style={{color: PURE_BLACK, fontSize: "22px", fontFamily:"'Fraunces', serif", fontStyle:"italic", fontWeight: 800}}>Create your profile</h2>
            <p className="mt-1 font-bold tracking-[0.15em]" style={{color: ORANGE, fontSize: "11px", fontFamily:"'Space Grotesk', sans-serif"}}>@{username?.toString().toUpperCase()}</p>
          </div>

          <label className="mt-6 block font-bold tracking-wide" style={{color: LABEL_BLACK, fontSize: "13px", fontFamily:"'Space Grotesk', sans-serif", letterSpacing:"0.08em"}}>DISPLAY NAME</label>
          <input value={form.displayName} onChange={e=>setForm({...form, displayName: e.target.value})} onFocus={()=>setFocused("name")} onBlur={()=>setFocused("")} placeholder="Sobha Roy"
            className="mt-2 w-full h-[52px] px-5 rounded-[16px] border text-[15px] font-semibold outline-none transition-all"
            style={{background: focused==="name"?"#fff":INPUT_BG, borderColor: focused==="name"? ORANGE : "rgba(0,0,0,0.08)", boxShadow: focused==="name"?`0 0 0 4px ${ORANGE}18`:"none"}}
          />

          <label className="mt-5 block font-bold tracking-wide" style={{color: LABEL_BLACK, fontSize: "13px", fontFamily:"'Space Grotesk', sans-serif"}}>BIO</label>
          <textarea value={form.bio} onChange={e=>setForm({...form, bio: e.target.value})} onFocus={()=>setFocused("bio")} onBlur={()=>setFocused("")} placeholder="Writer | Explorer | Siliguri ❤️" rows={3}
            className="mt-2 w-full px-5 py-4 rounded-[16px] border text-[14px] font-medium outline-none resize-none"
            style={{background: focused==="bio"?"#fff":INPUT_BG, borderColor: focused==="bio"? ORANGE : "rgba(0,0,0,0.08)"}}
          />

          <label className="mt-5 block font-bold tracking-wide" style={{color: LABEL_BLACK, fontSize: "13px", fontFamily:"'Space Grotesk', sans-serif"}}>DATE OF BIRTH</label>
          <input type="date" value={form.dob} onChange={e=>setForm({...form, dob: e.target.value})} onFocus={()=>setFocused("dob")} onBlur={()=>setFocused("")}
            className="mt-2 w-full h-[52px] px-5 rounded-[16px] border text-[14px] font-semibold outline-none"
            style={{background: focused==="dob"?"#fff":INPUT_BG, borderColor: focused==="dob"? ORANGE : "rgba(0,0,0,0.08)"}}
          />

          <label className="mt-5 block font-bold tracking-wide" style={{color: LABEL_BLACK, fontSize: "13px", fontFamily:"'Space Grotesk', sans-serif"}}>LOCATION</label>
          <input value={form.location} onChange={e=>setForm({...form, location: e.target.value})} onFocus={()=>setFocused("loc")} onBlur={()=>setFocused("")}
            className="mt-2 w-full h-[52px] px-5 rounded-[16px] border text-[14px] font-semibold outline-none"
            style={{background: focused==="loc"?"#fff":INPUT_BG, borderColor: focused==="loc"? ORANGE : "rgba(0,0,0,0.08)"}}
          />

          <label className="mt-5 block font-bold tracking-wide" style={{color: LABEL_BLACK, fontSize: "13px", fontFamily:"'Space Grotesk', sans-serif"}}>INTERESTS</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {INTERESTS.map(tag=>{
              const active = form.interests.includes(tag);
              return(<button key={tag} onClick={()=>toggleInterest(tag)} className="px-4 h-[36px] rounded-full text-[12px] font-black border active:scale-95 transition-all" style={{background: active? ORANGE : "#F6F1E6", color: active? "#fff" : "#111827", borderColor: active? ORANGE : "rgba(0,0,0,0.08)", fontFamily:"'Space Grotesk', sans-serif"}}>{tag}</button>)
            })}
          </div>

          <button onClick={handleSave} disabled={loading} className="mt-8 w-full h-[54px] rounded-full text-white text-[13px] font-black tracking-[0.12em] uppercase active:scale-[0.98] transition-all"
            style={{background: ORANGE, boxShadow: `0 10px 24px ${ORANGE}55`, fontFamily:"'Space Grotesk', sans-serif"}}
          >{loading?"SAVING...":"FINISH →"}</button>
        </div>
      </div>
    </div>
  )
}