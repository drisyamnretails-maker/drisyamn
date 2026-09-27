"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const ORANGE = "#E86A33";
const PAGE_BG = "#EDE6D3";

export default function PersonalCreateProfile(){
  const { username } = useParams() as { username: string };
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    displayName: "", bio: "", location: "Siliguri, West Bengal",
  });

  useEffect(()=>setMounted(true),[]);
  if(!mounted) return null;

  const onCoverChange = (e:any)=>{
    const file = e.target.files?.[0];
    if(file){
      console.log("cover selected", file.name);
      setCover(URL.createObjectURL(file));
    }
  }
  const onAvatarChange = (e:any)=>{
    const file = e.target.files?.[0];
    if(file){
      console.log("avatar selected", file.name);
      setAvatar(URL.createObjectURL(file));
    }
  }

  const handleSave = async ()=>{
    if(!form.displayName){ alert("Display Name daal"); return; }
    setLoading(true);
    try{
      const { data: { user } } = await supabase.auth.getUser();
      if(user){
        await supabase.from("profiles").update({
          full_name: form.displayName,
          bio: form.bio,
          location: form.location,
          onboarding_done: true,
        }).eq("id", user.id);
      }
      router.push(`/profile/personal/${username}`);
    }catch(e){ alert("Error"); console.log(e); }
    setLoading(false);
  };

  return(
    <div className="min-h-[100vh] w-full flex justify-center p-4" style={{background: PAGE_BG}}>
      {/* HIDDEN INPUTS */}
      <input ref={coverRef} type="file" accept="image/*" hidden onChange={onCoverChange} />
      <input ref={avatarRef} type="file" accept="image/*" hidden onChange={onAvatarChange} />

      <div className="w-full max-w-[400px] bg-[#FFFEFB] rounded-[24px] overflow-hidden border border-black/10 shadow-xl mb-10">

        {/* COVER */}
        <div className="w-full h-[150px] bg-[#F6F1E6] relative border-b border-black/5 overflow-hidden cursor-pointer" onClick={()=>coverRef.current?.click()}>
          {cover? <img src={cover} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl opacity-30">🖼️</div>}
          <button onClick={(e)=>{e.stopPropagation(); coverRef.current?.click()}} className="absolute bottom-3 right-3 px-4 h-[32px] rounded-full bg-black text-white text-[11px] font-bold">
            {cover? "Change Cover" : "Add Cover"}
          </button>
        </div>

        {/* AVATAR */}
        <div className="flex flex-col items-center -mt-[44px] relative z-10">
          <div className="w-[88px] h-[88px] rounded-full bg-white border-[4px] border-white shadow-lg overflow-hidden flex items-center justify-center cursor-pointer" onClick={()=>avatarRef.current?.click()}>
            {avatar? <img src={avatar} className="w-full h-full object-cover" /> : <span className="text-[34px]">📸</span>}
          </div>
          <button onClick={()=>avatarRef.current?.click()} className="mt-2 text-[13px] font-bold" style={{color: ORANGE}}>
            {avatar? "Change Photo" : "Add Profile Photo"}
          </button>
        </div>

        <div className="px-6 py-6">
          <h2 className="text-center font-black text-[18px]">@{username}</h2>

          <input value={form.displayName} onChange={e=>setForm({...form, displayName: e.target.value})} placeholder="Display Name - Sobha Roy"
            className="mt-6 w-full h-[52px] px-5 rounded-[14px] border bg-[#F6F1E6] text-[15px] font-medium outline-none focus:bg-white focus:border-[#E86A33]"
          />
          <textarea value={form.bio} onChange={e=>setForm({...form, bio: e.target.value})} placeholder="Bio - Writer | Explorer ❤️" rows={3}
            className="mt-4 w-full px-5 py-4 rounded-[14px] border bg-[#F6F1E6] text-[14px] font-medium outline-none focus:bg-white resize-none"
          />
          <input value={form.location} onChange={e=>setForm({...form, location: e.target.value})} placeholder="Location"
            className="mt-4 w-full h-[52px] px-5 rounded-[14px] border bg-[#F6F1E6] text-[15px] font-medium outline-none focus:bg-white"
          />

          <button onClick={handleSave} className="mt-8 w-full h-[54px] rounded-full text-white text-[14px] font-black uppercase active:scale-[0.98] transition-all"
            style={{background: ORANGE}}>{loading?"SAVING...":"FINISH →"}</button>
        </div>
      </div>
    </div>
  )
}