"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const ORANGE = "#E86A33";
const PAGE_BG = "#EDE6D3";
const PURE_BLACK = "#0A0A0A";
const LABEL_BLACK = "#0F1A3A";
const INPUT_BG = "#F6F1E6";

export default function PersonalCreateProfile(){
  const { username } = useParams() as { username: string };
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [focused, setFocused] = useState("");
  const [loading, setLoading] = useState(false);
  const [cover, setCover] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [form, setForm] = useState({
    displayName: "",
    bio: "",
    location: "Siliguri, West Bengal",
    website: "",
    interests: [] as string[],
  });

  const INTERESTS = ["Shopping","Food","Travel","Fashion","Tech","Memes","Music","Fitness","Books","Gaming"];

  useEffect(()=>{ setMounted(true); },[]);
  if(!mounted) return null;

  const toggleInterest = (i: string) => {
    setForm(f => f.interests.includes(i)? {...f, interests: f.interests.filter(x=>x!==i)} : {...f, interests: [...f.interests, i]});
  }

  const handleCover = (e:any)=>{
    const file = e.target.files[0];
    if(file) setCover(URL.createObjectURL(file));
  }
  const handleAvatar = (e:any)=>{
    const file = e.target.files[0];
    if(file) setAvatar(URL.createObjectURL(file));
  }

  const handleSave = async () => {
    if(!form.displayName){ alert("Display Name daal"); return; }
    setLoading(true);
    try{
      const { data: { user } } = await supabase.auth.getUser();
      if(user){
        await supabase.from("profiles").update({
          full_name: form.displayName,
          bio: form.bio,
          location: form.location,
          website: form.website,
          interests: form.interests,
          onboarding_done: true,
        }).eq("id", user.id);
      }
      localStorage.setItem("drisyamn_username", username);
      router.push(`/profile/personal/${username}`);
    }catch(err){
      console.log(err);
      alert("Error saving");
    }
    setLoading(false);
  };

  return(
    <div className="min-h-[100vh] w-full flex justify-center p-4 pt-6 overflow-y-auto" style={{background: PAGE_BG}}>
      <div className="w-full max-w-[400px] bg-[#FFFEFB] rounded-[24px] overflow-hidden border border-black/[0.05] shadow-[0_0_0_8px_#fff,0_0_0_9px_rgba(0,0,0,0.05),0_20px_50px_rgba(0,0,0,0.12)] mb-10">

        {/* COVER */}
        <div className="w-full h-[150px] bg-[#F6F1E6] relative border-b border-black/5 overflow-hidden">
          {cover? (
            <img src={cover} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-[32px] opacity-30">🖼️</span>
            </div>
          )}
          <label className="absolute bottom-3 right-3 px-3 h-[30px] rounded-full bg-black text-white text-[11px] font-bold flex items-center cursor-pointer">
            Add Cover
            <input type="file" accept="image/*" hidden onChange={handleCover} />
          </label>
        </div>

        {/* AVATAR */}
        <div className="flex flex-col items-center -mt-[46px] relative z-10">
          <div className="w-[88px] h-[88px] rounded-full bg-white border-[4px] border-white shadow-[0_8px_24px_rgba(0,0,0,0.15)] overflow-hidden flex items-center justify-center">
            {avatar? (
              <img src={avatar} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[34px]">📸</span>
            )}
          </div>
          <label className="mt-2 text-[13px] font-bold cursor-pointer" style={{color: ORANGE}}>
            Add Profile Photo
            <input type="file" accept="image/*" hidden onChange={handleAvatar} />
          </label>
        </div>

        <div className="px-6 py-6">
          <div className="text-center">
            <h2 style={{color: PURE_BLACK, fontSize: "19px", fontWeight: 800}}>Create your profile</h2>
            <p className="mt-1" style={{color: "#6B7280", fontSize: "12.5px", fontWeight: 600}}>@{username}</p>
          </div>

          <label className="mt-6 block" style={{color: LABEL_BLACK, fontSize: "15px", fontWeight: 700}}>Display Name</label>
          <input value={form.displayName} onChange={e=>setForm({...form, displayName: e.target.value})} onFocus={()=>setFocused("name")} onBlur={()=>setFocused("")} placeholder="Sobha Roy"
            className="mt-2 w-full h-[52px] px-5 rounded-[14px] border text-[15px] font-medium outline-none transition-all"
            style={{background: focused==="name"?"#fff":INPUT_BG, color: "#111827", borderColor: focused==="name"? ORANGE : "rgba(0,0,0,0.1)", boxShadow: focused==="name"? `0 0 0 4px ${ORANGE}15` : "none"}}
          />

          <label className="mt-5 block" style={{color: LABEL_BLACK, fontSize: "15px", fontWeight: 700}}>Bio</label>
          <textarea value={form.bio} onChange={e=>setForm({...form, bio: e.target.value})} onFocus={()=>setFocused("bio")} onBlur={()=>setFocused("")} placeholder="Writer | Explorer | Siliguri ❤️" rows={3}
            className="mt-2 w-full px-5 py-4 rounded-[14px] border text-[14px] font-medium outline-none resize-none transition-all"
            style={{background: focused==="bio"?"#fff":INPUT_BG, color: "#111827", borderColor: focused==="bio"? ORANGE : "rgba(0,0,0,0.1)", boxShadow: focused==="bio"? `0 0 0 4px ${ORANGE}15` : "none"}}
          />

          <label className="mt-5 block" style={{color: LABEL_BLACK, fontSize: "15px", fontWeight: 700}}>Location</label>
          <input value={form.location} onChange={e=>setForm({...form, location: e.target.value})} onFocus={()=>setFocused("loc")} onBlur={()=>setFocused("")} placeholder="Siliguri, West Bengal"
            className="mt-2 w-full h-[52px] px-5 rounded-[14px] border text-[15px] font-medium outline-none transition-all"
            style={{background: focused==="loc"?"#fff":INPUT_BG, color: "#111827", borderColor: focused==="loc"? ORANGE : "rgba(0,0,0,0.1)"}}
          />

          <label className="mt-5 block" style={{color: LABEL_BLACK, fontSize: "15px", fontWeight: 700}}>Website (Optional)</label>
          <input value={form.website} onChange={e=>setForm({...form, website: e.target.value})} placeholder="https://..."
            className="mt-2 w-full h-[52px] px-5 rounded-[14px] border text-[15px] font-medium outline-none"
            style={{background: INPUT_BG, color: "#111827", borderColor: "rgba(0,0,0,0.1)"}}
          />

          <label className="mt-5 block" style={{color: LABEL_BLACK, fontSize: "15px", fontWeight: 700}}>Interests</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {INTERESTS.map(tag=>{
              const active = form.interests.includes(tag);
              return(<button key={tag} onClick={()=>toggleInterest(tag)} className="px-4 h-[36px] rounded-full text-[13px] font-bold border transition-all active:scale-95" style={{background: active? PURE_BLACK : "#F6F1E6", color: active? "#fff" : "#111827", borderColor: active? PURE_BLACK : "rgba(0,0,0,0.08)"}}>{tag}</button>)
            })}
          </div>

          <button onClick={handleSave} disabled={loading} className="mt-8 w-full h-[54px] rounded-full text-white text-[14px] font-black tracking-[0.08em] uppercase active:scale-[0.98] transition-all disabled:opacity-70"
            style={{background: ORANGE, boxShadow: "0 0 0 6px white, 0 10px 24px rgba(232,106,51,0.35)"}}
          >{loading?"SAVING...":"FINISH →"}</button>
          <div className="h-2"></div>
        </div>
      </div>
    </div>
  )
}