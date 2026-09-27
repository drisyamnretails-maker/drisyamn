"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const BG_MAIN = "#FFFEFB";
const DARK_GREEN = "#0F4C3A";
const SHADOW = "0 12px 32px rgba(0,0,0,0.07), 0 1.5px 4px rgba(0,0,0,0.05)";
const SHADOW_ACTIVE = "0 12px 32px rgba(15,76,58,0.18), 0 4px 12px rgba(0,0,0,0.08)";

type RoleId = "personal_retails" | "retail_wholesale" | "food_beverage" | "furniture" | "electronics" | "fashion" | "grocery" | "beauty_salon" | "services";

const ROLES = [
  { id: "personal_retails" as RoleId, title: "Personal Retails", desc: "12k+ users in Siliguri", sub: "Personal shopping & daily needs", tags: ["Personal","Shopping","Daily"], route: "profile" },
  { id: "retail_wholesale" as RoleId, title: "Retail & Wholesale Trading", desc: "Buy, sell & trade products in bulk", sub: "Shops, wholesalers, distributors", tags: ["Shops","Wholesale","Trading"], route: "retail" },
  { id: "food_beverage" as RoleId, title: "Food & Beverage", desc: "Restaurants, cafes, clouds & eat-out", sub: "Food stalls, restaurants, cloud kitchens", tags: ["Restaurants","Cafes","Cloud"], route: "food" },
  { id: "furniture" as RoleId, title: "Furniture & Home Decor", desc: "Sofas, beds, decor & interiors", sub: "Home furniture, interior designers", tags: ["Furniture","Decor","Interior"], route: "furniture" },
  { id: "electronics" as RoleId, title: "Electronics & Mobile", desc: "Mobiles, laptops, gadgets & repair", sub: "Mobile shops, electronics stores", tags: ["Mobiles","Laptops","Repair"], route: "electronics" },
  { id: "fashion" as RoleId, title: "Fashion & Lifestyle", desc: "Clothing, footwear, accessories", sub: "Boutiques, fashion stores", tags: ["Clothing","Footwear","Boutique"], route: "fashion" },
  { id: "grocery" as RoleId, title: "Grocery & Daily Needs", desc: "Kirana, vegetables, dairy & more", sub: "Grocery shops, supermarkets", tags: ["Kirana","Vegetables","Supermarket"], route: "grocery" },
  { id: "beauty_salon" as RoleId, title: "Beauty & Salon", desc: "Salons, parlours, cosmetics", sub: "Beauty parlours, spa", tags: ["Salon","Spa","Cosmetics"], route: "beauty" },
  { id: "services" as RoleId, title: "Professional Services", desc: "Doctors, tutors, repairs & more", sub: "All professional services", tags: ["Doctors","Tutors","Services"], route: "services" },
];

export default function Page(){
  const { username } = useParams() as { username: string };
  const router = useRouter();
  const [selected, setSelected] = useState<RoleId>("personal_retails");
  const [mounted, setMounted] = useState(false);
  useEffect(()=>setMounted(true),[]);
  if(!mounted) return null;

  const go = (role: typeof ROLES[0]) => {
    setSelected(role.id);
    localStorage.setItem("drisyamn_role", role.id);
    setTimeout(()=> router.push(`/${role.route}/${username}`), 200);
  };

  return(
    <div className="min-h-screen flex justify-center" style={{background: BG_MAIN, fontFamily: "Inter, sans-serif"}}>
      <div className="w-full max-w-[400px] px-5 py-6">

        {/* Top pill - same as login */}
        <div className="flex justify-center mb-6">
          <div className="bg-white px-4 py-2 rounded-full flex items-center gap-2 border border-black/[0.05]" style={{boxShadow: SHADOW}}>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span style={{color: "rgba(0,0,0,0.4)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.12em"}}>STEP 2 OF 3 • SECURE</span>
            <span style={{color: DARK_GREEN, fontSize: "10px", fontWeight: 500}}>{username}</span>
          </div>
        </div>

        <h1 className="text-center font-serif text-[34px] text-black" style={{fontWeight: 600, letterSpacing: "-0.02em"}}>Drisyamn</h1>
        <p className="text-center text-[13px] text-black/40" style={{fontWeight: 400}}>Discover everything around you</p>

        <h2 className="text-center mt-6 text-[20px] text-black" style={{fontWeight: 600}}>Choose Your Role</h2>
        <p className="text-center mt-1 text-[12.5px] text-black/50 leading-[1.4]" style={{fontWeight: 400}}>Hi {username?.split('_')[0]}! Select what best describes you<br/>to personalize your Siliguri experience</p>

        <div className="mt-6 flex flex-col gap-3">
          {ROLES.map(r=>{
            const active = selected===r.id;
            return(
              <button key={r.id} onClick={()=>go(r)}
                className="w-full text-left bg-white rounded-[20px] p-4 transition-all border"
                style={{
                  boxShadow: active? SHADOW_ACTIVE : SHADOW,
                  borderColor: active? DARK_GREEN : "rgba(0,0,0,0.06)",
                  background: active? "#F7FAF8" : "white"
                }}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    {active && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-white mb-2" style={{backgroundColor: DARK_GREEN, fontSize: "8px", fontWeight: 500, letterSpacing: "0.12em"}}>SELECTED</span>
                    )}
                    <p className="text-black" style={{fontSize: "13.5px", fontWeight: 500, lineHeight: "1.2"}}>{r.title}</p>
                    <p className="text-black/50" style={{fontSize: "11px", fontWeight: 400, marginTop: "3px"}}>{r.desc}</p>
                    <p className="text-black/30" style={{fontSize: "10.5px", fontWeight: 400}}>{r.sub}</p>
                    <div className="flex gap-1.5 mt-2.5 flex-wrap">
                      {r.tags.map(t=>(
                        <span key={t} className="px-2.5 py-1 rounded-full border border-black/5" style={{backgroundColor: "#F6F1E6", color: "rgba(0,0,0,0.6)", fontSize: "9px", fontWeight: 500}}>{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="w-[24px] h-[24px] rounded-full flex items-center justify-center shrink-0 border" style={{
                    backgroundColor: active? DARK_GREEN : "white",
                    borderColor: active? DARK_GREEN : "rgba(0,0,0,0.08)",
                  }}>
                    {active? <span className="text-white text-[12px]">✓</span> : <span className="text-black/20 text-[10px]">›</span>}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <button onClick={()=>go(ROLES.find(x=>x.id===selected)!)}
          className="w-full mt-6 h-[52px] rounded-full text-white hover:bg-[#0A3326] transition-all"
          style={{backgroundColor: DARK_GREEN, fontSize: "14px", fontWeight: 500, boxShadow: SHADOW}}>
          Continue as {ROLES.find(x=>x.id===selected)?.title} →
        </button>
      </div>
    </div>
  )
}