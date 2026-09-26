"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const PAGE_BG = "#EDE6D3";
const ORANGE = "#E86A33";
const CARD_BG = "#FFFEFB";
const INPUT_BG = "#F6F1E6";
const PURE_BLACK = "#0A0A0A";
const LABEL_BLACK = "#0F1A3A";

type RoleId =
  | "retail_wholesale"
  | "food_beverage"
  | "furniture"
  | "beauty_salon"
  | "interior_exterior"
  | "service_provider"
  | "hotel_homestay"
  | "media_creator"
  | "personal";

interface RoleItem {
  id: RoleId;
  title: string;
  subtitle: string;
  desc: string;
  icon: string;
  tags: string[];
  count: string;
}

const ROLES: RoleItem[] = [
  {
    id: "retail_wholesale",
    title: "Retail & Wholesale Trading",
    subtitle: "Buy, sell & trade products in bulk",
    desc: "Shops, wholesalers, distributors in Siliguri",
    icon: "💼",
    tags: ["Shops", "Wholesale", "Trading"],
    count: "2.4k+ businesses",
  },
  {
    id: "food_beverage",
    title: "Food & Beverage",
    subtitle: "Restaurants, cafes, clouds & eat-out",
    desc: "Food stalls, restaurants, cloud kitchens, cafes",
    icon: "🍽️",
    tags: ["Restaurants", "Cafes", "Cloud Kitchen"],
    count: "1.8k+ businesses",
  },
  {
    id: "furniture",
    title: "Furniture and Furnishings",
    subtitle: "Home furniture, decor & furnishing",
    desc: "Furniture shops, home decor, furnishing solutions",
    icon: "🛋️",
    tags: ["Furniture", "Home Decor", "Mattress"],
    count: "620+ businesses",
  },
  {
    id: "beauty_salon",
    title: "Beauty & Salons",
    subtitle: "Salons, spa, grooming & beauty services",
    desc: "Beauty parlours, salons, spa, makeup artists",
    icon: "💇‍♀️",
    tags: ["Salon", "Spa", "Makeup"],
    count: "950+ businesses",
  },
  {
    id: "interior_exterior",
    title: "Interiors & Exteriors",
    subtitle: "Design, construction & decor services",
    desc: "Interior designers, construction, exterior work",
    icon: "🏗️",
    tags: ["Interior", "Construction", "Architecture"],
    count: "430+ businesses",
  },
  {
    id: "service_provider",
    title: "Service Providers",
    subtitle: "Repair, maintenance & professional services",
    desc: "Electrician, plumber, tuition, repair, IT services",
    icon: "🛠️",
    tags: ["Repair", "Tuition", "Professional"],
    count: "1.2k+ businesses",
  },
  {
    id: "hotel_homestay",
    title: "Hotels, Homestays & Real Estate",
    subtitle: "Stay, rentals, properties & hospitality",
    desc: "Hotels, homestays, PG, real estate, rentals",
    icon: "🏨",
    tags: ["Hotels", "Homestays", "Real Estate"],
    count: "780+ businesses",
  },
  {
    id: "media_creator",
    title: "Media / Creators / Artists",
    subtitle: "Creative services, content & collaborations",
    desc: "Photographers, videographers, influencers, artists",
    icon: "🎨",
    tags: ["Creators", "Photography", "Artists"],
    count: "540+ businesses",
  },
  {
    id: "personal",
    title: "Personals",
    subtitle: "Personal care, wellness & lifestyle",
    desc: "For everyday users to explore Siliguri",
    icon: "👤",
    tags: ["Personal", "Explore", "Community"],
    count: "12k+ users",
  },
];

export default function SelectRolePage() {
  const params = useParams();
  const router = useRouter();
  const username = params?.username as string;

  const [selected, setSelected] = useState<RoleId>("personal");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [userNameDisplay, setUserNameDisplay] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      const { data } = await supabase.from("profiles").select("full_name").eq("id", session.user.id).single();
      if (data?.full_name) setUserNameDisplay(data.full_name);
      setChecking(false);
    })();
  }, [router]);

  const handleContinue = async () => {
    if (!username) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user session found");

      const { error } = await supabase
       .from("profiles")
       .update({ role: selected, onboarding_done: false })
       .eq("id", user.id);

      if (error) throw error;

      // FINAL ROUTE: select-role -> setup -> homefeed
      router.push(`/profile/setup/${username}?type=${selected}`);

    } catch (e: any) {
      alert(e.message || "Failed to save role");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: PAGE_BG }}>
        <div className="w-8 h-8 border-[3px] border-black/10 border-t-black rounded-full animate-spin" />
        <p className="text-[11px] font-black tracking-[0.2em] opacity-30">LOADING DRISYAMN</p>
      </div>
    );
  }

  const selectedRoleData = ROLES.find(r => r.id === selected);

  return (
    <div className="min-h-screen w-full flex justify-center p-4 pt-6 overflow-y-auto" style={{ background: PAGE_BG }}>
      <div className="w-full max-w-[520px] mb-10">

        {/* HEADER */}
        <div className="text-center px-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-black/10 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.18em] opacity-60">STEP 2 OF 3 • SECURE</span>
            <span className="w-px h-3 bg-black/10" />
            <span className="text-[10px] font-black tracking-[0.18em]" style={{ color: ORANGE }}>{username}</span>
          </div>

          <h1 className="mt-6 font-serif font-[900] leading-[0.85] tracking-[-0.04em] text-[38px] sm:text-[44px]" style={{ color: PURE_BLACK }}>
            Choose Your<br/>Role
          </h1>
          <p className="mt-3 text-[13px] font-medium opacity-50 leading-[1.4]">
            Hi {userNameDisplay || "there"}! Select what best describes you<br/>to personalize your Siliguri experience
          </p>
        </div>

        {/* SELECTED PREVIEW - 7CR WEIGHT */}
        {selectedRoleData && (
          <div className="mt-6 rounded-[24px] p-[2px] bg-gradient-to-br from-[#E86A33] to-[#E86A33]/40 shadow-[0_0_0_8px_#fff,0_12px_32px_rgba(232,106,51,0.25)]">
            <div className="rounded-[22px] bg-white px-5 py-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-[16px] bg-[#E86A33] text-white flex items-center justify-center text-[26px] shadow-[0_6px_16px_rgba(232,106,51,0.3)]">
                {selectedRoleData.icon}
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-black tracking-[0.15em] opacity-40">SELECTED</p>
                <h3 className="text-[16px] font-black" style={{ color: PURE_BLACK }}>{selectedRoleData.title}</h3>
                <p className="text-[11px] font-medium opacity-50">{selectedRoleData.count} in Siliguri</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[12px]">✓</div>
            </div>
          </div>
        )}

        {/* ROLES GRID */}
        <div className="mt-6 grid grid-cols-1 gap-3.5">
          {ROLES.map((role) => {
            const isActive = selected === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                className={`group text-left w-full rounded-[22px] p-[1.5px] transition-all duration-300 ${
                  isActive
                   ? "bg-[#E86A33] shadow-[0_0_0_6px_white,0_0_0_7px_rgba(232,106,51,0.15),0_16px_36px_rgba(232,106,51,0.25)] scale-[1.01]"
                    : "bg-black/[0.06] hover:bg-black/10 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
                }`}
              >
                <div className={`w-full rounded-[20px] px-5 py-4 flex gap-4 items-start transition-all ${isActive? "bg-white" : "bg-[#FFFEFB] group-hover:bg-white"}`}>
                  <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center text-[22px] shrink-0 border transition-all duration-300 ${
                    isActive? "bg-[#E86A33] text-white border-[#E86A33] shadow-[0_6px_14px_rgba(232,106,51,0.35)]" : "bg-[#F6F1E6] border-black/5 group-hover:border-black/10"
                  }`}>
                    {role.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[15px] font-black tracking-tight leading-tight" style={{ color: PURE_BLACK }}>
                        {role.title}
                      </h3>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full bg-black text-white text-[8px] font-black tracking-[0.12em]">ACTIVE</span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[12px] font-semibold opacity-60 leading-[1.3]">{role.subtitle}</p>
                    <p className="mt-1 text-[11px] font-medium opacity-40 leading-[1.3] hidden sm:block">{role.desc}</p>

                    <div className="mt-2.5 flex gap-1.5 flex-wrap">
                      {role.tags.map(tag => (
                        <span key={tag} className={`px-2.5 py-1 rounded-full text-[9.5px] font-bold tracking-wide border transition-all ${
                          isActive? "bg-[#FFF1EC] border-[#E86A33]/20 text-[#E86A33]" : "bg-[#F6F1E6] border-black/5 opacity-60"
                        }`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={`mt-1 w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    isActive? "bg-black border-black scale-110" : "border-black/15 bg-white"
                  }`}>
                    {isActive && <span className="text-white text-[11px] font-black">✓</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* CONTINUE */}
        <div className="mt-8 sticky bottom-4">
          <button
            onClick={handleContinue}
            disabled={loading}
            className="w-full h-[60px] rounded-full text-white font-black text-[12.5px] tracking-[0.14em] flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-60 transition-all"
            style={{
              background: `linear-gradient(135deg, ${ORANGE} 0%, #D85A24 100%)`,
              boxShadow: "0 0 0 8px white, 0 0 0 9px rgba(232,106,51,0.12), 0 16px 40px rgba(232,106,51,0.4)",
            }}
          >
            {loading? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                SAVING YOUR ROLE...
              </>
            ) : (
              <>
                CONTINUE TO SETUP
                <span className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-[16px]">→</span>
              </>
            )}
          </button>
          <p className="mt-4 text-center text-[11px] font-medium opacity-30 tracking-wide">
            You can change role anytime from Profile → Settings • Step 2 of 3
          </p>
        </div>
      </div>

      <style jsx global>{`
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
}