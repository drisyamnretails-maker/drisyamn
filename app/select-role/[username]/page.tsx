"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

const PAGE_BG = "#EDE6D3";
const CARD_BG = "#FFFFFF";
const INPUT_BG = "#F5F1E6";
const ORANGE = "#E86A33";
const BLACK = "#1E293B"; // <-- Yahi tera Create Account wala same colour
const BLACK_LIGHT = "#334155";

type RoleId = "personal_retails" | "retail_wholesale" | "food_beverage" | "furniture" | "electronics" | "fashion" | "grocery" | "beauty_salon" | "services";

const ROLES = [
  { id: "personal_retails" as RoleId, title: "Personal Retails", desc: "12k+ users in Siliguri", sub: "Personal shopping & daily needs", tags: ["Personal","Shopping","Daily"], icon: "👤" },
  { id: "retail_wholesale" as RoleId, title: "Retail & Wholesale Trading", desc: "Buy, sell & trade products in bulk", sub: "Shops, wholesalers, distributors in Siliguri", tags: ["Shops","Wholesale","Trading"], icon: "💼" },
  { id: "food_beverage" as RoleId, title: "Food & Beverage", desc: "Restaurants, cafes, clouds & eat-out", sub: "Food stalls, restaurants, cloud kitchens, cafes", tags: ["Restaurants","Cafes","Cloud Kitchen"], icon: "🍽️" },
  { id: "furniture" as RoleId, title: "Furniture & Home Decor", desc: "Sofas, beds, decor & interiors", sub: "Home furniture in Siliguri", tags: ["Furniture","Decor","Interior"], icon: "🛋️" },
  { id: "electronics" as RoleId, title: "Electronics & Mobile", desc: "Mobiles, laptops, gadgets", sub: "Mobile shops, electronics stores", tags: ["Mobiles","Laptops","Repair"], icon: "📱" },
  { id: "fashion" as RoleId, title: "Fashion & Lifestyle", desc: "Clothing, footwear, accessories", sub: "Boutiques, fashion stores", tags: ["Clothing","Footwear","Boutique"], icon: "👗" },
  { id: "grocery" as RoleId, title: "Grocery & Daily Needs", desc: "Kirana, vegetables, dairy", sub: "Grocery shops, supermarkets", tags: ["Kirana","Vegetables","Supermarket"], icon: "🛒" },
  { id: "beauty_salon" as RoleId, title: "Beauty & Salon", desc: "Salons, parlours, cosmetics", sub: "Beauty parlours, spa", tags: ["Salon","Spa","Cosmetics"], icon: "💄" },
  { id: "services" as RoleId, title: "Professional Services", desc: "Doctors, tutors, repairs", sub: "All professional services", tags: ["Doctors","Tutors","Services"], icon: "🛠️" },
];

export default function Page(){
  const { username } = useParams() as { username: string };
  const router = useRouter();
  const name = username?.split('_')[0] || "there";
  const [selected, setSelected] = useState<RoleId>("personal_retails");

  return(
    <div className="min-h-screen flex justify-center" style={{backgroundColor: PAGE_BG}}>
      <div className="w-full max-w-[420px] px-4 py-5">

        {/* Same pill as before */}
        <div className="flex justify-center mb-5">
          <div className="bg-white px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest flex gap-2 items-center shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span style={{color: BLACK_LIGHT}}>STEP 2 OF 3 • SECURE</span>
            <span style={{color: ORANGE}}>{username}</span>
          </div>
        </div>

        {/* SAME FONT & SIZE AS CREATE ACCOUNT PAGE */}
        <h1 className="text-center font-serif font-bold" style={{color: BLACK, fontSize: "36px", lineHeight: "1.1", letterSpacing: "-0.02em"}}>
          Drisyamn
        </h1>
        <p className="text-center mt-1" style={{color: BLACK_LIGHT, fontSize: "14px"}}>Discover everything around you</p>

        <h2 className="text-center mt-6 font-bold" style={{color: BLACK, fontSize: "18px"}}>Choose Your Role</h2>
        <p className="text-center mt-1" style={{color: BLACK_LIGHT, fontSize: "13px", lineHeight: "1.4"}}>
          Hi {name}! Select what best describes you<br/>to personalize your Siliguri experience
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {ROLES.map(r=>{
            const active = selected===r.id;
            return(
              <button key={r.id} onClick={()=>setSelected(r.id)}
                className="text-left rounded-[16px] p-3.5 flex gap-3 bg-white border-2"
                style={{borderColor: active? ORANGE : "transparent", boxShadow: "0 1px 6px rgba(0,0,0,0.05)"}}>
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[18px]" style={{backgroundColor: active? ORANGE : INPUT_BG, color: active? "white" : BLACK}}>{r.icon}</div>
                <div className="flex-1">
                  {active && <p className="text-[9px] font-bold tracking-[0.2em] mb-1" style={{color: BLACK_LIGHT}}>SELECTED</p>}
                  {/* Yahi Full Name wala same size & colour */}
                  <p className="font-bold" style={{color: BLACK, fontSize: "14px"}}>{r.title}</p>
                  <p style={{color: BLACK_LIGHT, fontSize: "12px"}}>{r.desc}</p>
                  <p style={{color: "#94A3B8", fontSize: "11px"}} className="mt-0.5">{r.sub}</p>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {r.tags.map(t=><span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{backgroundColor: INPUT_BG, color: BLACK}}>{t}</span>)}
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border flex items-center justify-center" style={{borderColor: active? BLACK : "#CBD5E1", backgroundColor: active? BLACK : "white"}}>
                  {active && <span className="text-white text-[10px]">✓</span>}
                </div>
              </button>
            )
          })}
        </div>

        <button onClick={()=>router.push(`/feed?user=${username}&role=${selected}`)}
          className="w-full mt-6 h-[48px] rounded-full font-bold text-white" style={{backgroundColor: BLACK, fontSize: "14px"}}>
          Continue as {ROLES.find(x=>x.id===selected)?.title} →
        </button>
      </div>
    </div>
  )
}