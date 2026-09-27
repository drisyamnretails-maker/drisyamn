"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// COLORS - DRISYAMN THEME
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

// ROLE TYPE DEFINITION
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

// ROLE ITEM INTERFACE
interface RoleItem {
  id: RoleId;
  title: string;
  sub: string;
  tags: string[];
  count: string;
  icon: string;
  desc: string;
}

// MAIN COMPONENT
export default function SelectRolePage() {
  const { username } = useParams() as { username: string };
  const router = useRouter();
  const [selected, setSelected] = useState<RoleId>("personal_retails");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // ALL 9 ROLES DATA
  const ROLES: RoleItem[] = [
    {
      id: "personal_retails",
      title: "Personal Retails",
      sub: "Personal shopping & daily needs",
      tags: ["Personal", "Shopping", "Daily"],
      count: "2.1K USERS",
      icon: "🛍️",
      desc: "For personal retail shops",
    },
    {
      id: "retail_wholesale",
      title: "Retail & Wholesale Trading",
      sub: "Shops, wholesalers, distributors",
      tags: ["Shops", "Wholesale", "Trading"],
      count: "1.8K USERS",
      icon: "🏪",
      desc: "For wholesale business",
    },
    {
      id: "food_beverage",
      title: "Food & Beverage",
      sub: "Food stalls, restaurants, cafes",
      tags: ["Restaurants", "Cafes", "Kitchen"],
      count: "3.2K USERS",
      icon: "🍔",
      desc: "For food business",
    },
    {
      id: "furniture",
      title: "Furniture & Home Decor",
      sub: "Home furniture, interior decoration",
      tags: ["Furniture", "Decor", "Interior"],
      count: "890 USERS",
      icon: "🛋️",
      desc: "For furniture shops",
    },
    {
      id: "electronics",
      title: "Electronics & Mobile",
      sub: "Mobile shops, electronics, repair",
      tags: ["Mobiles", "Laptops", "Repair"],
      count: "1.5K USERS",
      icon: "📱",
      desc: "For electronics shops",
    },
    {
      id: "fashion",
      title: "Fashion & Lifestyle",
      sub: "Boutiques, fashion stores, clothing",
      tags: ["Clothing", "Footwear", "Boutique"],
      count: "2.4K USERS",
      icon: "👗",
      desc: "For fashion business",
    },
    {
      id: "beauty_salon",
      title: "Beauty & Salon",
      sub: "Beauty parlours, spa, cosmetics",
      tags: ["Salon", "Spa", "Cosmetics"],
      count: "1.1K USERS",
      icon: "💇",
      desc: "For beauty parlours",
    },
    {
      id: "services",
      title: "Professional Services",
      sub: "Doctors, tutors, all professional services",
      tags: ["Doctors", "Tutors", "Services"],
      count: "2.9K USERS",
      icon: "👨‍⚕️",
      desc: "For service providers",
    },
    {
      id: "stays_property",
      title: "Hotels, Homestays & Real Estate",
      sub: "Hotels, homestays, rent, sale properties",
      tags: ["Hotels", "Homestays", "Real Estate"],
      count: "1.2K USERS",
      icon: "🏨",
      desc: "For hotels and property",
    },
  ];

  // HANDLE CONTINUE CLICK
  const handleContinue = () => {
    setLoading(true);

    try {
      localStorage.setItem("drisyamn_role", selected);
      localStorage.setItem("drisyamn_username", username);
      localStorage.setItem(
        "drisyamn_role_title",
        ROLES.find((r) => r.id === selected)?.title || ""
      );
    } catch (e) {
      console.log("localStorage error", e);
    }

    let finalRoute = "";

    // FINAL ROUTES - FIXED FOR 404
    // No business folder, only hotels and personal
    if (selected === "personal_retails") {
      finalRoute = `/create-profile/personal/${username}`;
    } else if (selected === "retail_wholesale") {
      finalRoute = `/create-profile/personal/${username}?type=retail_wholesale`;
    } else if (selected === "food_beverage") {
      finalRoute = `/create-profile/cafe/${username}?type=food_beverage`;
    } else if (selected === "furniture") {
      finalRoute = `/create-profile/personal/${username}?type=furniture`;
    } else if (selected === "electronics") {
      finalRoute = `/create-profile/personal/${username}?type=electronics`;
    } else if (selected === "fashion") {
      finalRoute = `/create-profile/personal/${username}?type=fashion`;
    } else if (selected === "beauty_salon") {
      finalRoute = `/create-profile/personal/${username}?type=beauty_salon`;
    } else if (selected === "services") {
      finalRoute = `/profile/service/${username}`;
    } else if (selected === "stays_property") {
      // THIS IS YOUR ROUTE - FIXED
      // create-profile/hotels/[username]/page.tsx
      finalRoute = `/create-profile/hotels/${username}`;
    } else {
      finalRoute = `/create-profile/personal/${username}`;
    }

    console.log("Final Route:", finalRoute);

    setTimeout(() => {
      router.push(finalRoute);
    }, 400);
  };

  // RENDER UI
  return (
    <div
      className="min-h-[100vh] w-full flex justify-center p-4 pt-8 overflow-y-auto"
      style={{
        background: PAGE_BG,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        className="w-full max-w-[420px] bg-[#FFFEFB] rounded-[24px] px-6 py-6 mb-10 border border-black/[0.05] relative"
        style={{
          boxShadow:
            "0 0 0 8px #fff, 0 0 0 9px rgba(0,0,0,0.05), 0 20px 50px rgba(0,0,0,0.12)",
        }}
      >
        {/* HEADER SECTION */}
        <div className="text-center">
          <h1
            className="font-serif tracking-tight"
            style={{
              color: PURE_BLACK,
              fontSize: "44px",
              fontWeight: 800,
              lineHeight: "1",
              fontFamily: "Georgia, serif",
            }}
          >
            Drisyamn
          </h1>
          <p
            className="mt-1.5"
            style={{
              color: TEXT_GRAY,
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            Discover everything around you
          </p>
          <div className="mt-6 flex flex-col items-center gap-1">
            <h2
              style={{
                color: PURE_BLACK,
                fontSize: "20px",
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              Choose Your Role
            </h2>
            <p
              style={{
                color: TEXT_LIGHT,
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              Select what best describes your business
            </p>
            <p className="mt-2 text-[10px] text-black/40 uppercase tracking-widest font-bold">
              Welcome, {username}
            </p>
          </div>
        </div>

        {/* ROLES LIST SECTION */}
        <div className="mt-7 flex flex-col gap-[14px]">
          {ROLES.map((r) => {
            const active = selected === r.id;
            const isHovered = hovered === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelected(r.id)}
                onMouseEnter={() => setHovered(r.id)}
                onMouseLeave={() => setHovered(null)}
                className="w-full text-left rounded-[16px] border px-4 py-[14px] flex justify-between items-start gap-3 transition-all duration-200 active:scale-[0.98]"
                style={{
                  backgroundColor: active? WHITE_CARD : CARD_BG,
                  borderColor: active? "rgba(0,0,0,0.18)" : BORDER_LIGHT,
                  boxShadow: active
                   ? "0 0 0 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)"
                    : isHovered
                   ? "0 2px 10px rgba(0,0,0,0.05)"
                    : "none",
                  transform: active? "scale(1.01)" : "scale(1)",
                }}
              >
                <div className="flex gap-3 flex-1">
                  <div
                    className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 text-[18px]"
                    style={{
                      background: active? PURE_BLACK : "#FFFFFF",
                      border: `1px solid ${BORDER_LIGHT}`,
                    }}
                  >
                    <span style={{ filter: active? "invert(1)" : "none" }}>
                      {r.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p
                      style={{
                        color: LABEL_BLACK,
                        fontSize: "14.5px",
                        fontWeight: 750,
                        lineHeight: "1.2",
                      }}
                    >
                      {r.title}
                    </p>
                    <p
                      style={{
                        color: TEXT_LIGHT,
                        fontSize: "11.5px",
                        marginTop: "3px",
                        lineHeight: "1.3",
                        fontWeight: 500,
                      }}
                    >
                      {r.sub}
                    </p>
                    <div className="flex gap-1.5 mt-2.5 flex-wrap">
                      {r.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-[3px] rounded-full border text-[9.5px] font-semibold tracking-wide"
                          style={{
                            background: "#FFFFFF",
                            borderColor: "rgba(0,0,0,0.06)",
                            color: "#374151",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <p
                      className="mt-2"
                      style={{
                        color: TEXT_LIGHT,
                        fontSize: "10px",
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {r.count}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
                    style={{
                      backgroundColor: active? GREEN : "#fff",
                      border: `1.5px solid ${
                        active? GREEN : "rgba(0,0,0,0.12)"
                      }`,
                      boxShadow: active? `0 0 0 3px ${GREEN}20` : "none",
                    }}
                  >
                    {active && (
                      <span className="text-white font-black text-[12px]">
                        ✓
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* CONTINUE BUTTON */}
        <button
          onClick={handleContinue}
          disabled={loading}
          className="mt-8 w-full h-[54px] rounded-full text-white text-[14px] font-black tracking-[0.08em] uppercase flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
          style={{
            background: loading? "#9CA3AF" : ORANGE,
            boxShadow: loading
             ? "none"
              : "0 0 0 6px white, 0 10px 24px rgba(232,106,51,0.35), 0 2px 8px rgba(232,106,51,0.2)",
          }}
        >
          {loading? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              PLEASE WAIT...
            </>
          ) : (
            <>CONTINUE →</>
          )}
        </button>

        {/* FOOTER */}
        <div className="mt-5 text-center">
          <p className="text-[10px] text-black/30 font-medium tracking-wide">
            9 ROLES • PERSONAL + BUSINESS + STAYS + PROPERTY
          </p>
          <p className="mt-1 text-[9px] text-black/20">
            {username} • Drisyamn Siliguri
          </p>
        </div>
      </div>
    </div>
  );
}