"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// ===== SAME COLORS AS SIGNUP STUDY =====
const ORANGE = "#E86A33";
const PAGE_BG = "#EDE6D3";
const PURE_BLACK = "#0A0A0A";
const LABEL_BLACK = "#0F1A3A";
const INPUT_BG = "#F6F1E6";
const GREEN = "#22C55E";

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
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(()=>setMounted(true),[]);
  if(!mounted) return null;

  // MANUAL ROUTE - sirf Continue pe hoga
  const handleContinue = () => {
    setLoading(true);
    const role = ROLES.find(r=>r.id===selected)!;
    localStorage.setItem("drisyamn_role", role.id);
    localStorage.setItem("drisyamn_username", username);
    localStorage.setItem("drisyamn_role_title", role.title);
    router.push(`/${role.route}/${username}`);
  };

  const selectedRole = ROLES.find(r=>r.id===selected);

  return(
    <div className="min-h-[100vh] w-full flex items-start justify-center p-4 pt-8 overflow-y-auto" style={{background: PAGE_BG}}>
      {/* SAME CARD AS SIGNUP */}
      <div className="w-full max-w-[400px] bg-[#FFFEFB] rounded-[24px] px-6 py-6 mb-8 border border-black/[0.05] shadow-[0_0_0_8px_#fff,0_0_0_9px_rgba(0,0,0,0.05),0_20px_50px_rgba(0,0,0,0.12)]">

        {/* TOP */}
        <div className="text-center">
          <h1 className="font-serif leading-none" style={{color: PURE_BLACK, fontSize: "44px", fontWeight: 800}}>Drisyamn</h1>
          <p className="mt-1" style={{color: "#4B5563", fontSize: "15px", fontWeight: 600}}>Discover everything around you</p>
          <h2 className="mt-6" style={{color: PURE_BLACK, fontSize: "19px", fontWeight: 700}}>Choose Your Role</h2>
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6F1E6] border border-black/5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] font-black tracking-[0.15em] opacity-50">STEP 2 OF 3</span>
            <span className="text-[10px] font-bold" style={{color: ORANGE}}>{username?.split('_')[0]}</span>
          </div>
          <p className="mt-3" style={{color: "#6B7280", fontSize: "13px", fontWeight: 500, lineHeight: "1.4"}}>
            Hi {username?.split('_')[0]}! Select what best describes you
          </p>
        </div>

        {/* ROLES - SAME INPUT STYLE AS SIGNUP */}
        <div className="mt-6 flex flex-col gap-3">
          {ROLES.map(r=>{
            const active = selected===r.id;
            return(
              <button
                key={r.id}
                onClick={()=>setSelected(r.id)}
                className={`w-full text-left rounded-[14px] border px-5 py-3.5 flex justify-between items-start gap-3 text-left transition-all outline-none
                  ${active? "bg-white border-black/20 shadow-[0_0_0_4px_rgba(0,0,0,0.05)]" : "bg-[#F6F1E6] border-black/10 hover:bg-white hover:border-black/15"}`}
              >
                <div className="flex-1 min-w-0">
                  {/* Label style same as signup - 16px 700 #0F1A3A */}
                  <p style={{color: LABEL_BLACK, fontSize: "16px", fontWeight: 700, lineHeight: "1.2"}}>{r.title}</p>
                  <p style={{color: "#4B5563", fontSize: "13px", fontWeight: 500, marginTop: "3px", lineHeight: "1.3"}}>{r.desc}</p>
                  <p style={{color: "#9CA3AF", fontSize: "11px", fontWeight: 400, marginTop: "2px"}}>{r.sub}</p>
                  <div className="flex gap-1.5 mt-2.5 flex-wrap">
                    {r.tags.map(t=>(
                      <span key={t} className="px-2.5 py-1 rounded-full border border-black/5" style={{backgroundColor: "#fff", color: "#111827", fontSize: "10px", fontWeight: 500}}>{t}</span>
                    ))}
                  </div>
                </div>

                {/* Beautiful green tick */}
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 transition-all" style={{
                  backgroundColor: active? GREEN : "#fff",
                  border: `1.5px solid ${active? GREEN : "rgba(0,0,0,0.1)"}`,
                  boxShadow: active? "0 2px 8px rgba(34,197,94,0.35)" : "none"
                }}>
                  {active && <span className="text-white font-black" style={{fontSize: "13px"}}>✓</span>}
                </div>
              </button>
            )
          })}
        </div>

        {/* SAME BUTTON AS SIGNUP */}
        <button
          onClick={handleContinue}
          disabled={loading}
          className="mt-6 w-full h-[52px] rounded-full text-white text-[14px] font-black tracking-[0.08em] uppercase disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all"
          style={{
            background: PURE_BLACK,
            boxShadow: "0 0 0 6px white, 0 10px 24px rgba(0,0,0,0.18)",
          }}
        >
          {loading? "ROUTING..." : `CONTINUE AS ${selectedRole?.title.toUpperCase()} →`}
        </button>

        <p className="mt-5 text-center" style={{color: "#9CA3AF", fontSize: "11px", fontWeight: 500}}>
          You can change your role anytime from settings • Siliguri
        </p>
      </div>
    </div>
  )
}