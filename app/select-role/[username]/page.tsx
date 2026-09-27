"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// =====================================================
// THEME - SAME AS SIGNUP STUDY
// =====================================================
const ORANGE = "#E86A33";
const PAGE_BG = "#EDE6D3";
const PURE_BLACK = "#0A0A0A";
const LABEL_BLACK = "#0F1A3A";
const GREEN = "#22C55E";
const CARD_BG = "#FFFEFB";
const INPUT_BG = "#F6F1E6";

// =====================================================
// TYPES
// =====================================================
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

interface RoleItem {
  id: RoleId;
  title: string;
  sub: string;
  tags: string[];
}

// =====================================================
// ROLES DATA - NO 12K USERS LINE
// =====================================================
const ROLES: RoleItem[] = [
  {
    id: "personal_retails",
    title: "Personal Retails",
    sub: "Personal shopping & daily needs",
    tags: ["Personal","Shopping","Daily"]
  },
  {
    id: "retail_wholesale",
    title: "Retail & Wholesale Trading",
    sub: "Shops, wholesalers, distributors",
    tags: ["Shops","Wholesale","Trading"]
  },
  {
    id: "food_beverage",
    title: "Food & Beverage",
    sub: "Food stalls, restaurants, cafes",
    tags: ["Restaurants","Cafes","Cloud Kitchen"]
  },
  {
    id: "furniture",
    title: "Furniture & Home Decor",
    sub: "Home furniture, interior designers",
    tags: ["Furniture","Decor","Interior"]
  },
  {
    id: "electronics",
    title: "Electronics & Mobile",
    sub: "Mobile shops, electronics stores",
    tags: ["Mobiles","Laptops","Repair"]
  },
  {
    id: "fashion",
    title: "Fashion & Lifestyle",
    sub: "Boutiques, fashion stores",
    tags: ["Clothing","Footwear","Boutique"]
  },
  {
    id: "grocery",
    title: "Grocery & Daily Needs",
    sub: "Grocery shops, supermarkets",
    tags: ["Kirana","Vegetables","Supermarket"]
  },
  {
    id: "beauty_salon",
    title: "Beauty & Salon",
    sub: "Beauty parlours, spa",
    tags: ["Salon","Spa","Cosmetics"]
  },
  {
    id: "services",
    title: "Professional Services",
    sub: "All professional services",
    tags: ["Doctors","Tutors","Services"]
  },
];

// =====================================================
// MAIN PAGE COMPONENT
// =====================================================
export default function Page(){

  // -----------------------------------------------------
  // HOOKS
  // -----------------------------------------------------
  const { username } = useParams() as { username: string };
  const router = useRouter();
  const [selected, setSelected] = useState<RoleId>("personal_retails");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState<RoleId | null>(null);

  // -----------------------------------------------------
  // MOUNT EFFECT
  // -----------------------------------------------------
  useEffect(()=>{
    setMounted(true);
  },[]);

  // -----------------------------------------------------
  // EARLY RETURN FOR SSR
  // -----------------------------------------------------
  if(!mounted) {
    return null;
  }

  // -----------------------------------------------------
  // MANUAL ROUTE - ALL TO PROFILE CREATE WITH ROLE WISE PUSH
  // -----------------------------------------------------
  const handleContinue = () => {
    setLoading(true);
    localStorage.setItem("drisyamn_role", selected);
    localStorage.setItem("drisyamn_username", username);
    const roleObj = ROLES.find(r=>r.id===selected);
    if(roleObj){
      localStorage.setItem("drisyamn_role_title", roleObj.title);
    }

    // ===== SAB ROLE KA ROUTE PUSH =====
    if(selected === "personal_retails"){
      router.push(`/create-profile/personal/${username}`);
    } else if(selected === "retail_wholesale"){
      router.push(`/create-profile/business/${username}?type=retail_wholesale`);
    } else if(selected === "food_beverage"){
      router.push(`/create-profile/business/${username}?type=food_beverage`);
    } else if(selected === "furniture"){
      router.push(`/create-profile/business/${username}?type=furniture`);
    } else if(selected === "electronics"){
      router.push(`/create-profile/business/${username}?type=electronics`);
    } else if(selected === "fashion"){
      router.push(`/create-profile/business/${username}?type=fashion`);
    } else if(selected === "grocery"){
      router.push(`/create-profile/business/${username}?type=grocery`);
    } else if(selected === "beauty_salon"){
      router.push(`/create-profile/business/${username}?type=beauty_salon`);
    } else if(selected === "services"){
      router.push(`/create-profile/business/${username}?type=services`);
    }
  };

  // -----------------------------------------------------
  // DERIVED STATE
  // -----------------------------------------------------
  const selectedRole = ROLES.find(r=>r.id===selected);

  // -----------------------------------------------------
  // RENDER
  // -----------------------------------------------------
  return(
    <div
      className="min-h-[100vh] w-full flex items-start justify-center p-4 pt-8 overflow-y-auto"
      style={{background: PAGE_BG}}
    >
      {/* CARD - SAME AS SIGNUP CARD */}
      <div
        className="w-full max-w-[400px] bg-[#FFFEFB] rounded-[24px] px-6 py-6 mb-8 border border-black/[0.05] shadow-[0_0_0_8px_#fff,0_0_0_9px_rgba(0,0,0,0.05),0_20px_50px_rgba(0,0,0,0.12)]"
      >
        {/* HEADER - NO HI HANUMAAN, NO STEP BOX */}
        <div className="text-center">
          <h1
            className="font-serif leading-none"
            style={{color: PURE_BLACK, fontSize: "44px", fontWeight: 800}}
          >
            Drisyamn
          </h1>
          <p
            className="mt-1"
            style={{color: "#4B5563", fontSize: "15px", fontWeight: 600}}
          >
            Discover everything around you
          </p>
          <h2
            className="mt-6"
            style={{color: PURE_BLACK, fontSize: "19px", fontWeight: 700}}
          >
            Choose Your Role
          </h2>
        </div>

        {/* ROLE LIST - HEIGHT DECREASED + GAPS */}
        <div className="mt-6 flex flex-col gap-4">
          {ROLES.map((r)=>{
            const active = selected===r.id;
            const isHovered = hovered===r.id;
            return(
              <button
                key={r.id}
                onClick={()=>setSelected(r.id)}
                onMouseEnter={()=>setHovered(r.id)}
                onMouseLeave={()=>setHovered(null)}
                className={`
                  w-full
                  text-left
                  rounded-[14px]
                  border
                  px-4
                  py-3
                  flex
                  justify-between
                  items-start
                  gap-3
                  outline-none
                  transition-all
                  duration-200
                  ${active
                  ? "bg-white border-black/20 shadow-[0_0_0_4px_rgba(0,0,0,0.05)]"
                    : "bg-[#F6F1E6] border-black/10 hover:bg-white hover:border-black/15"
                  }
                `}
              >
                {/* LEFT CONTENT */}
                <div className="flex-1 min-w-0">
                  <p
                    style={{
                      color: LABEL_BLACK,
                      fontSize: "15px",
                      fontWeight: 700,
                      lineHeight: "1.2"
                    }}
                  >
                    {r.title}
                  </p>
                  <p
                    style={{
                      color: "#9CA3AF",
                      fontSize: "11px",
                      fontWeight: 400,
                      marginTop: "3px",
                      lineHeight: "1.3"
                    }}
                  >
                    {r.sub}
                  </p>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {r.tags.map((t)=>(
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded-full border border-black/5"
                        style={{
                          backgroundColor: "#fff",
                          color: "#111827",
                          fontSize: "9.5px",
                          fontWeight: 500
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* RIGHT TICK */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all"
                  style={{
                    backgroundColor: active? GREEN : "#fff",
                    border: `1.5px solid ${active? GREEN : "rgba(0,0,0,0.1)"}`,
                    boxShadow: active? "0 2px 8px rgba(34,197,94,0.35)" : "none",
                    transform: isHovered? "scale(1.05)" : "scale(1)"
                  }}
                >
                  {active && (
                    <span
                      className="text-white font-black"
                      style={{fontSize: "12px"}}
                    >
                      ✓
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* CONTINUE BUTTON - ORANGE + ONLY CONTINUE */}
        <button
          onClick={handleContinue}
          disabled={loading}
          className="mt-7 w-full h-[52px] rounded-full text-white text-[14px] font-black tracking-[0.08em] uppercase flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70"
          style={{
            background: ORANGE,
            boxShadow: "0 0 0 6px white, 0 10px 24px rgba(232,106,51,0.35)",
          }}
        >
          {loading? "PLEASE WAIT..." : "CONTINUE →"}
        </button>

        {/* FOOTER SPACER */}
        <div className="h-2"></div>

      </div>
    </div>
  )
}