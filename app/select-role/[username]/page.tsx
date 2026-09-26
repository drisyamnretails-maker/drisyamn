"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Apna wala 7cr colours
const PAGE_BG = "#EDE6D3";
const ORANGE = "#E86A33";
const CARD_BG = "#FFFFFF";
const INPUT_BG = "#F5F1E6";
const PURE_BLACK = "#0A0A0A";
const LABEL_BLACK = "#0F1A2A";
const MUTED = "#6B7280";

type RoleId =
  | "personal_retails"
  | "retail_wholesale"
  | "food_beverage"
  | "furniture"
  | "electronics"
  | "fashion"
  | "grocery"
  | "beauty_salon"
  | "services";

const ROLES = [
  {
    id: "personal_retails" as RoleId,
    title: "Personal Retails",
    desc: "12k+ users in Siliguri",
    sub: "Personal shopping & daily needs",
    tags: ["Personal", "Shopping", "Daily"],
    icon: "👤",
  },
  {
    id: "retail_wholesale" as RoleId,
    title: "Retail & Wholesale Trading",
    desc: "Buy, sell & trade products in bulk",
    sub: "Shops, wholesalers, distributors in Siliguri",
    tags: ["Shops", "Wholesale", "Trading"],
    icon: "💼",
  },
  {
    id: "food_beverage" as RoleId,
    title: "Food & Beverage",
    desc: "Restaurants, cafes, clouds & eat-out",
    sub: "Food stalls, restaurants, cloud kitchens, cafes",
    tags: ["Restaurants", "Cafes", "Cloud Kitchen"],
    icon: "🍽️",
  },
  {
    id: "furniture" as RoleId,
    title: "Furniture & Home Decor",
    desc: "Sofas, beds, decor & interiors",
    sub: "Home furniture, interior designers in Siliguri",
    tags: ["Furniture", "Decor", "Interior"],
    icon: "🛋️",
  },
  {
    id: "electronics" as RoleId,
    title: "Electronics & Mobile",
    desc: "Mobiles, laptops, gadgets & repair",
    sub: "Mobile shops, electronics stores",
    tags: ["Mobiles", "Laptops", "Repair"],
    icon: "📱",
  },
  {
    id: "fashion" as RoleId,
    title: "Fashion & Lifestyle",
    desc: "Clothing, footwear, accessories",
    sub: "Boutiques, fashion stores, tailors",
    tags: ["Clothing", "Footwear", "Boutique"],
    icon: "👗",
  },
  {
    id: "grocery" as RoleId,
    title: "Grocery & Daily Needs",
    desc: "Kirana, vegetables, dairy & more",
    sub: "Grocery shops, supermarkets",
    tags: ["Kirana", "Vegetables", "Supermarket"],
    icon: "🛒",
  },
  {
    id: "beauty_salon" as RoleId,
    title: "Beauty & Salon",
    desc: "Salons, parlours, cosmetics",
    sub: "Beauty parlours, spa, cosmetic shops",
    tags: ["Salon", "Spa", "Cosmetics"],
    icon: "💄",
  },
  {
    id: "services" as RoleId,
    title: "Professional Services",
    desc: "Doctors, tutors, repairs & more",
    sub: "All professional services in Siliguri",
    tags: ["Doctors", "Tutors", "Services"],
    icon: "🛠️",
  },
];

export default function SelectRolePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const displayName = username?.split('_')[0] || "there";

  const [selected, setSelected] = useState<RoleId>("personal_retails");

  const handleContinue = () => {
    // yaha apna logic - localStorage me save karke feed pe bhej
    localStorage.setItem("drisyamn_role", selected);
    localStorage.setItem("drisyamn_username", username);
    router.push(`/feed?user=${username}&role=${selected}`);
  };

  return (
    <div className="min-h-screen w-full flex justify-center" style={{ backgroundColor: PAGE_BG }}>
      <div className="w-full max-w-[480px] px-5 py-6">

        {/* Top Pill */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm text-[11px] tracking-widest">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#2BB5A5" }}></span>
            <span style={{ color: MUTED, fontWeight: 600 }}>STEP 2 OF 3 • SECURE</span>
            <span style={{ color: ORANGE, fontWeight: 700 }}>{username}</span>
          </div>
        </div>

        {/* Heading - Apna wala Pure Black Letters */}
        <h1 className="text-center text-[44px] leading-[0.9] font-serif font-black" style={{ color: PURE_BLACK }}>
          Choose Your <br /> Role
        </h1>
        <p className="text-center mt-3 text-[14px]" style={{ color: LABEL_BLACK }}>
          Hi {displayName}! Select what best describes you<br />
          to personalize your Siliguri experience
        </p>

        {/* Cards */}
        <div className="mt-8 flex flex-col gap-4">
          {ROLES.map((role) => {
            const isSelected = selected === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                className="w-full text-left rounded-[18px] p-4 flex gap-3 items-start transition-all border-2 bg-white"
                style={{
                  backgroundColor: CARD_BG,
                  borderColor: isSelected? ORANGE : "transparent",
                  boxShadow: isSelected? `0 0 0 1px ${ORANGE}20` : "0 2px 10px rgba(0,0,0,0.04)",
                }}
              >
                <div className="w-12 h-12 rounded-[12px] flex items-center justify-center text-[20px] shrink-0"
                  style={{ backgroundColor: isSelected? ORANGE : INPUT_BG, color: isSelected? "white" : PURE_BLACK }}>
                  {role.icon}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      {isSelected && <p className="text-[10px] tracking-[0.2em] font-bold mb-1" style={{ color: MUTED }}>SELECTED</p>}
                      <h3 className="text-[15px] font-bold leading-tight" style={{ color: PURE_BLACK }}>{role.title}</h3>
                      <p className="text-[12px] mt-0.5" style={{ color: MUTED }}>{role.desc}</p>
                      <p className="text-[11px] mt-1" style={{ color: MUTED }}>{role.sub}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full border flex items-center justify-center ml-2 mt-1"
                      style={{ borderColor: isSelected? PURE_BLACK : "#D1D5DB", backgroundColor: isSelected? PURE_BLACK : "transparent" }}>
                      {isSelected && <span className="text-white text-[12px]">✓</span>}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-2.5 flex-wrap">
                    {role.tags.map(t => (
                      <span key={t} className="text-[10px] px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: INPUT_BG, color: LABEL_BLACK }}>{t}</span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue */}
        <button
          onClick={handleContinue}
          className="w-full mt-8 h-[52px] rounded-full font-bold text-white text-[15px] tracking-wide"
          style={{ backgroundColor: PURE_BLACK }}
        >
          Continue as {ROLES.find(r => r.id === selected)?.title} →
        </button>

        <p className="text-center text-[11px] mt-4" style={{ color: MUTED }}>
          You can change your role anytime from settings
        </p>
      </div>
    </div>
  );
}