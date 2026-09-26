"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const C = {
  bg: "#EDE6D3",
  white: "#FFFFFF",
  orange: "#E86A33",
  black: "#1E293B",
  gray: "#64748B",
  light: "#94A3B8",
  green: "#22C55E",
  tagBg: "#F8F5EE",
};

type RoleId = "personal_retails" | "retail_wholesale" | "food_beverage" | "furniture" | "electronics" | "fashion" | "grocery" | "beauty_salon" | "services";

const ROLES = [
  { id: "personal_retails" as RoleId, title: "Personal Retails", desc: "12k+ users in Siliguri", sub: "Personal shopping & daily needs", tags: ["Personal","Shopping","Daily"], route: "profile" },
  { id: "retail_wholesale" as RoleId, title: "Retail & Wholesale Trading", desc: "Buy, sell & trade products in bulk", sub: "Shops, wholesalers, distributors", tags: ["Shops","Wholesale","Trading"], route: "retail" },
  { id: "food_beverage" as RoleId, title: "Food & Beverage", desc: "Restaurants, cafes, clouds & eat-out", sub: "Food stalls, restaurants, cafes", tags: ["Restaurants","Cafes","Cloud Kitchen"], route: "food" },
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
  const [m, setM] = useState(false);
  useEffect(()=>setM(true),[]);
  if(!m) return null;

  const go = (r: typeof ROLES[0]) => {
    setSelected(r.id);
    localStorage.setItem("drisyamn_role", r.id);
    localStorage.setItem("drisyamn_username", username);
    router.push(`/${r.route}/${username}`);
  };

  return(
    <div className="min-h-screen flex justify-center" style={{backgroundColor: C.bg}}>
      <div className="w-full max-w-[380px] px-4 py-6">

        <div className="flex justify-center mb-6">
          <div className="bg-white px-4 py-2 rounded-full flex items-center gap-2" style={{boxShadow: "0 4px 16px rgba(0,0,0,0.06)"}}>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span style={{color: C.gray, fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em"}}>STEP 2 OF 3 • SECURE</span>
            <span style={{color: C.orange, fontSize: "10px", fontWeight: 600}}>{username}</span>
          </div>
        </div>

        <h1 className="text-center font-serif" style={{color: C.black, fontSize: "36px", fontWeight: 500}}>Drisyamn</h1>
        <p className="text-center" style={{color: C.gray, fontSize: "13px", fontWeight: 400}}>Discover everything around you</p>

        <h2 className="text-center mt-6" style={{color: C.black, fontSize: "19px", fontWeight: 600}}>Choose Your Role</h2>
        <p className="text-center mt-1.5" style={{color: C.gray, fontSize: "12.5px", fontWeight: 400, lineHeight: "1.4"}}>
          Hi {username?.split('_')[0]}! Select what best describes you<br/>to personalize your Siliguri experience
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          {ROLES.map(r=>{
            const active = selected===r.id;
            return(
              <button key={r.id} onClick={()=>go(r)}
                className="w-full text-left bg-white rounded-[16px] px-3.5 py-3 flex justify-between items-start gap-3"
                style={{
                  boxShadow: active? "0 8px 20px rgba(232,106,51,0.15), 0 2px 8px rgba(0,0,0,0.06)" : "0 4px 12px rgba(0,0,0,0.05)",
                  border: `1.5px solid ${active? C.orange : "#fff"}`,
                }}
              >
                <div className="flex-1">
                  {active && <span className="text-white px-2 py-0.5 rounded-full inline-block mb-1" style={{backgroundColor: C.orange, fontSize: "8px", fontWeight: 600, letterSpacing: "0.1em"}}>SELECTED</span>}
                  <p style={{color: C.black, fontSize: "13.5px", fontWeight: 500, lineHeight: "1.2"}}>{r.title}</p>
                  <p style={{color: C.gray, fontSize: "11px", fontWeight: 400, marginTop: "2px"}}>{r.desc}</p>
                  <p style={{color: C.light, fontSize: "10px", fontWeight: 400}}>{r.sub}</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {r.tags.map(t=> <span key={t} className="px-2 py-0.5 rounded-full" style={{backgroundColor: C.tagBg, color: C.black, fontSize: "9px", fontWeight: 400}}>{t}</span>)}
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{
                  backgroundColor: active? C.green : "#fff",
                  border: `1.5px solid ${active? C.green : "#E2E8F0"}`,
                  boxShadow: active? "0 2px 8px rgba(34,197,94,0.3)" : "none"
                }}>
                  {active && <span className="text-white" style={{fontSize: "11px", fontWeight: 700}}>✓</span>}
                </div>
              </button>
            )
          })}
        </div>

        <button onClick={()=>go(ROLES.find(x=>x.id===selected)!)}
          className="w-full mt-6 h-[46px] rounded-full text-white" style={{backgroundColor: C.black, fontSize: "13.5px", fontWeight: 500}}>
          Continue as {ROLES.find(x=>x.id===selected)?.title} →
        </button>

        <p className="text-center mt-4" style={{color: C.light, fontSize: "10px"}}>You can change your role anytime from settings</p>
      </div>
    </div>
  )
}