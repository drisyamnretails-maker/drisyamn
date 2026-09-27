"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const ORANGE = "#E86A33";
const PAGE_BG = "#EDE6D3";
const PURE_BLACK = "#0A0A0A";
const LABEL_BLACK = "#0F1A3A";
const TEXT_GRAY = "#6B7280";
const TEXT_LIGHT = "#9CA3AF";
const GREEN = "#22C55E";
const BORDER_LIGHT = "rgba(0,0,0,0.08)";
const CARD_BG = "#F6F1E6";
const WHITE_CARD = "#FFFEFB";

type RoleId =
  | "personal_retails"
  | "retail_wholesale"
  | "food_beverage"
  | "furniture"
  | "electronics"
  | "fashion"
  | "beauty_salon"
  | "services"
  | "stays_property";

interface RoleItem {
  id: RoleId;
  title: string;
  sub: string;
  tags: string[];
  count: string;
}

export default function SelectRolePage() {
  const { username } = useParams() as { username: string };
  const router = useRouter();
  const [selected, setSelected] = useState<RoleId>("personal_retails");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const ROLES: RoleItem[] = [
    { id: "personal_retails", title: "Personal Retails", sub: "Personal shopping & daily needs", tags: ["Personal", "Shopping", "Daily"], count: "2.1K USERS" },
    { id: "retail_wholesale", title: "Retail & Wholesale Trading", sub: "Shops, wholesalers, distributors", tags: ["Shops", "Wholesale", "Trading"], count: "1.8K USERS" },
    { id: "food_beverage", title: "Food & Beverage", sub: "Food stalls, restaurants, cafes", tags: ["Restaurants", "Cafes", "Kitchen"], count: "3.2K USERS" },
    { id: "furniture", title: "Furniture & Home Decor", sub: "Home furniture, interior decoration", tags: ["Furniture", "Decor", "Interior"], count: "890 USERS" },
    { id: "electronics", title: "Electronics & Mobile", sub: "Mobile shops, electronics, repair", tags: ["Mobiles", "Laptops", "Repair"], count: "1.5K USERS" },
    { id: "fashion", title: "Fashion & Lifestyle", sub: "Boutiques, fashion stores, clothing", tags: ["Clothing", "Footwear", "Boutique"], count: "2.4K USERS" },
    { id: "beauty_salon", title: "Beauty & Salon", sub: "Beauty parlours, spa, cosmetics", tags: ["Salon", "Spa", "Cosmetics"], count: "1.1K USERS" },
    { id: "services", title: "Professional Services", sub: "Doctors, tutors, all services", tags: ["Doctors", "Tutors", "Services"], count: "2.9K USERS" },
    { id: "stays_property", title: "Hotels, Homestays & Real Estate", sub: "Hotels, homestays, rent, sale properties", tags: ["Hotels", "Homestays", "Real Estate"], count: "1.2K USERS" },
  ];

  const handleContinue = () => {
    setLoading(true);
    try {
      localStorage.setItem("drisyamn_role", selected);
      localStorage.setItem("drisyamn_username", username);
      localStorage.setItem("drisyamn_role_title", ROLES.find((r) => r.id === selected)?.title || "");
    } catch {}

    let finalRoute = "";
    if (selected === "food_beverage") {
      finalRoute = `/create-profile/cafe/${username}`;
    } else if (selected === "stays_property") {
      finalRoute = `/create-profile/hotels/${username}`;
    } else if (selected === "services") {
      finalRoute = `/profile/service/${username}`;
    } else {
      finalRoute = `/create-profile/personal/${username}?type=${selected}`;
    }

    setTimeout(() => router.push(finalRoute), 400);
  };

  return (
    <div className="min-h-[100vh] w-full flex justify-center p-4 pt-8 overflow-y-auto" style={{ background: PAGE_BG }}>
      <div className="w-full max-w-[420px] bg-[#FFFEFB] rounded-[24px] px-6 py-6 mb-10 border border-black/[0.05]" style={{ boxShadow: "0 0 0 8px #fff, 0 0 0 9px rgba(0,0,0,0.05), 0 20px 50px rgba(0,0,0,0.12)" }}>

        <div className="text-center">
          <h1 className="font-serif" style={{ color: PURE_BLACK, fontSize: "42px", fontWeight: 700, lineHeight: "1", fontFamily: "Georgia, serif", letterSpacing: "-0.03em" }}>Drisyamn</h1>
          <p className="mt-1.5" style={{ color: TEXT_GRAY, fontSize: "14px", fontWeight: 400 }}>Discover everything around you</p>
          <div className="mt-6">
            <h2 style={{ color: PURE_BLACK, fontSize: "18px", fontWeight: 600 }}>Choose Your Role</h2>
            <p style={{ color: TEXT_LIGHT, fontSize: "12px", fontWeight: 400, marginTop: "2px" }}>Select what best describes your business</p>
            <p className="mt-2 text-[10px] text-black/40 uppercase tracking-widest" style={{ fontWeight: 400 }}>Welcome, {username}</p>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-[11px]">
          {ROLES.map((r) => {
            const active = selected === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelected(r.id)}
                className="w-full text-left rounded-[16px] border px-4 py-[13px] flex justify-between items-start gap-3 transition-all active:scale-[0.98]"
                style={{
                  backgroundColor: active? WHITE_CARD : CARD_BG,
                  borderColor: active? "rgba(0,0,0,0.15)" : BORDER_LIGHT,
                  boxShadow: active? "0 0 0 3px rgba(0,0,0,0.05)" : "none",
                }}
              >
                <div className="flex-1">
                  <p style={{ color: LABEL_BLACK, fontSize: "13.5px", fontWeight: 500 }}>{r.title}</p>
                  <p style={{ color: TEXT_LIGHT, fontSize: "11px", fontWeight: 400, marginTop: "2px" }}>{r.sub}</p>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {r.tags.map((t) => (
                      <span key={t} className="px-2.5 py-[2px] rounded-full border text-[9px]" style={{ background: "#fff", borderColor: "rgba(0,0,0,0.06)", color: "#6B7280", fontWeight: 400 }}>{t}</span>
                    ))}
                  </div>
                  <p className="mt-1.5" style={{ color: TEXT_LIGHT, fontSize: "9.5px", fontWeight: 400 }}>{r.count}</p>
                </div>
                <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 mt-1" style={{ backgroundColor: active? GREEN : "#fff", border: `1.5px solid ${active? GREEN : "rgba(0,0,0,0.12)"}` }}>
                  {active && <span className="text-white text-[10px]">✓</span>}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleContinue}
          disabled={loading}
          className="mt-7 w-full h-[52px] rounded-full text-white text-[13px] tracking-wide flex items-center justify-center"
          style={{ background: loading? "#9CA3AF" : ORANGE, fontWeight: 500, boxShadow: loading? "none" : "0 8px 20px rgba(232,106,51,0.25)" }}
        >
          {loading? "PLEASE WAIT..." : "CONTINUE →"}
        </button>

        <p className="mt-4 text-center text-[10px] text-black/30" style={{ fontWeight: 400 }}>9 ROLES • PERSONAL + BUSINESS + STAYS</p>
      </div>
    </div>
  );
}