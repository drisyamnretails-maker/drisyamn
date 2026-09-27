"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const ORANGE = "#E86A33";
const PAGE_BG = "#EDE6D3";

export default function PersonalCreateProfile(){
  const { username } = useParams() as { username: string };
  const router = useRouter();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverCanvasRef = useRef<HTMLCanvasElement>(null);

  const [mounted, setMounted] = useState(false);
  const [cover, setCover] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Cover Editor State
  const [showCoverEditor, setShowCoverEditor] = useState(false);
  const [editSrc, setEditSrc] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{x:number,y:number} | null>(null);
  const [form, setForm] = useState({ displayName: "", bio: "", location: "Siliguri" });

  useEffect(()=>setMounted(true),[]);
  if(!mounted) return null;

  // Cover Select -> Open Editor
  const onCoverFile = (e:any)=>{
    const file = e.target.files?.[0];
    if(!file) return;
    const url = URL.createObjectURL(file);
    setEditSrc(url);
    setScale(1);
    setPos({x:0, y:0});
    setShowCoverEditor(true);
    e.target.value = "";
  }

  const onAvatarFile = (e:any)=>{
    const file = e.target.files?.[0];
    if(file) setAvatar(URL.createObjectURL(file));
    e.target.value = "";
  }

  // Drag Logic for Cover
  const handlePointerDown = (e:any)=>{
    const clientX = e.touches? e.touches[0].clientX : e.clientX;
    const clientY = e.touches? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - pos.x, y: clientY - pos.y });
  }
  const handlePointerMove = (e:any)=>{
    if(!dragStart) return;
    const clientX = e.touches? e.touches[0].clientX : e.clientX;
    const clientY = e.touches? e.touches[0].clientY : e.clientY;
    setPos({ x: clientX - dragStart.x, y: clientY - dragStart.y });
  }
  const handlePointerUp = ()=> setDragStart(null);

  // Save Cropped Cover
  const saveCroppedCover = ()=>{
    const canvas = coverCanvasRef.current;
    if(!canvas ||!editSrc) return;
    const ctx = canvas.getContext("2d");
    if(!ctx) return;
    const img = new Image();
    img.src = editSrc;
    img.onload = ()=>{
      const W = 800; const H = 300; // final cover size
      canvas.width = W; canvas.height = H;
      ctx.clearRect(0,0,W,H);
      // calculate draw
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
      setShowCoverEditor(false);
    }
  }

  const handleSave = async ()=>{
    if(!form.displayName) return alert("Display name likh");
    setLoading(true);
    try{
      const { data: { user } } = await supabase.auth.getUser();
      if(user){
        await supabase.from("profiles").update({
          full_name: form.displayName, bio: form.bio, location: form.location, onboarding_done: true
        }).eq("id", user.id);
      }
      router.push(`/profile/personal/${username}`);
    }catch(e){ console.log(e); alert("Error"); }
    setLoading(false);
  }

  return(
    <div className="min-h-screen w-full flex justify-center p-4 bg-[#EDE6D3] overflow-y-auto">
      <input ref={coverInputRef} type="file" accept="image/*" hidden onChange={onCoverFile} />
      <input ref={avatarInputRef} type="file" accept="image/*" hidden onChange={onAvatarFile} />
      <canvas ref={coverCanvasRef} className="hidden" />

      {/* COVER EDITOR MODAL - WhatsApp Style */}
      {showCoverEditor && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="h-[56px] flex items-center justify-between px-4 text-white">
            <button onClick={()=>setShowCoverEditor(false)} className="text-[20px]">✕</button>
            <p className="font-bold text-[14px] tracking-widest">MOVE & SCALE</p>
            <button onClick={saveCroppedCover} className="font-black text-[14px]" style={{color: ORANGE}}>DONE</button>
          </div>

          <div className="flex-1 flex items-center justify-center bg-[#111] relative overflow-hidden"
            onMouseDown={handlePointerDown} onMouseMove={handlePointerMove} onMouseUp={handlePointerUp}
            onTouchStart={handlePointerDown} onTouchMove={handlePointerMove} onTouchEnd={handlePointerUp}
          >
            {/* Viewport - Cover Ratio */}
            <div className="w-[95%] max-w-[600px] aspect-[8/3] bg-[#222] relative overflow-hidden border border-white/20">
              {editSrc && (
                <img src={editSrc} draggable={false} className="absolute max-w-none select-none"
                  style={{
                    left: `calc(50% + ${pos.x}px)`,
                    top: `calc(50% + ${pos.y}px)`,
                    transform: `translate(-50%, -50%) scale(${scale})`,
                    minWidth: "100%", minHeight: "100%",
                    objectFit: "cover",
                    cursor: dragStart? "grabbing" : "grab"
                  }}
                />
              )}
              {/* Grid */}
              <div className="absolute inset-0 border border-white/10 pointer-events-none grid grid-cols-3 grid-rows-2">
                <div className="border-r border-white/10"></div><div className="border-r border-white/10"></div>
              </div>
            </div>
          </div>

          <div className="h-[90px] bg-black px-6 flex items-center gap-4">
            <span className="text-white text-[12px]">ZOOM</span>
            <input type="range" min="1" max="3" step="0.01" value={scale} onChange={e=>setScale(parseFloat(e.target.value))} className="flex-1 accent-[#E86A33]" />
          </div>
        </div>
      )}

      {/* MAIN CARD */}
      <div className="w-full max-w-[400px] bg-[#FFFEFB] rounded-[24px] overflow-hidden border border-black/10 shadow-xl h-fit mb-10">
        <div className="w-full h-[160px] bg-[#F6F1E6] relative border-b border-black/5 overflow-hidden cursor-pointer" onClick={()=>coverInputRef.current?.click()}>
          {cover? <img src={cover} className="w-full h-full object-cover" /> : <div className="w-full h-full flex flex-col items-center justify-center opacity-40"><span className="text-[28px]">🖼️</span><span className="text-[11px] font-bold mt-1">Tap to add cover</span></div>}
          <button onClick={(e)=>{e.stopPropagation(); coverInputRef.current?.click()}} className="absolute bottom-3 right-3 px-4 h-[32px] rounded-full bg-black text-white text-[11px] font-bold shadow-lg">
            {cover? "Edit Cover" : "Add Cover"}
          </button>
        </div>

        <div className="flex flex-col items-center -mt-[44px] relative z-10">
          <div className="w-[88px] h-[88px] rounded-full bg-white border-[4px] border-white shadow-lg overflow-hidden flex items-center justify-center cursor-pointer" onClick={()=>avatarInputRef.current?.click()}>
            {avatar? <img src={avatar} className="w-full h-full object-cover" /> : <span className="text-[30px]">📸</span>}
          </div>
          <button onClick={()=>avatarInputRef.current?.click()} className="mt-2 text-[13px] font-bold" style={{color: ORANGE}}>{avatar? "Change Photo" : "Add Photo"}</button>
        </div>

        <div className="px-6 py-6">
          <p className="text-center font-black">@{username}</p>
          <input value={form.displayName} onChange={e=>setForm({...form, displayName: e.target.value})} placeholder="Display Name" className="mt-5 w-full h-[52px] px-5 rounded-[14px] border bg-[#F6F1E6] outline-none focus:bg-white focus:border-[#E86A33]" />
          <textarea value={form.bio} onChange={e=>setForm({...form, bio: e.target.value})} placeholder="Bio" rows={3} className="mt-3 w-full px-5 py-4 rounded-[14px] border bg-[#F6F1E6] outline-none focus:bg-white resize-none" />
          <input value={form.location} onChange={e=>setForm({...form, location: e.target.value})} placeholder="Location" className="mt-3 w-full h-[52px] px-5 rounded-[14px] border bg-[#F6F1E6] outline-none focus:bg-white" />
          <button onClick={handleSave} className="mt-6 w-full h-[54px] rounded-full text-white font-black uppercase" style={{background: ORANGE}}>{loading? "SAVING..." : "FINISH →"}</button>
        </div>
      </div>
    </div>
  )
}