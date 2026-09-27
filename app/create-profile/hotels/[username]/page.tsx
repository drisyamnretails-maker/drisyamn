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
  icon: string;
}

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

  if (!mounted) return null;

  const ROLES: RoleItem[] = [
    {
      id: "personal_retails",
      title: "Personal Retails",
      sub: "Personal shopping & daily needs",
      tags: ["Personal", "Shopping", "Daily"],
      count: "2.1k+",
      icon: "🛍️",
    },
    {
      id: "retail_wholesale",
      title: "Retail & Wholesale Trading",
      sub: "Shops, wholesalers, distributors",
      tags: ["Shops", "Wholesale", "Trading"],
      count: "1.8k+",
      icon: "🏪",
    },
    {
      id: "food_beverage",
      title: "Food & Beverage",
      sub: "Food stalls, restaurants, cafes",
      tags: ["Restaurants", "Cafes", "Kitchen"],
      count: "3.2k+",
      icon: "🍔",
    },
    {
      id: "furniture",
      title: "Furniture & Home Decor",
      sub: "Home furniture, interior decoration",
      tags: ["Furniture", "Decor", "Interior"],
      count: "890+",
      icon: "🛋️",
    },
    {
      id: "electronics",
      title: "Electronics & Mobile",
      sub: "Mobile shops, electronics, repair",
      tags: ["Mobiles", "Laptops", "Repair"],
      count: "1.5k+",
      icon: "📱",
    },
    {
      id: "fashion",
      title: "Fashion & Lifestyle",
      sub: "Boutiques, fashion stores, clothing",
      tags: ["Clothing", "Footwear", "Boutique"],
      count: "2.4k+",
      icon: "👗",
    },
    {
      id: "beauty_salon",
      title: "Beauty & Salon",
      sub: "Beauty parlours, spa, cosmetics",
      tags: ["Salon", "Spa", "Cosmetics"],
      count: "1.1k+",
      icon: "💇",
    },
    {
      id: "services",
      title: "Professional Services",
      sub: "Doctors, tutors, all professional services",
      tags: ["Doctors", "Tutors", "Services"],
      count: "2.9k+",
      icon: "👨‍⚕️",
    },
    {
      id: "stays_property",
      title: "Hotels, Homestays & Real Estate",
      sub: "Hotels, homestays, rent, sale - sliding cover + logo profile",
      tags: ["Hotels", "Homestays", "Real Estate"],
      count: "NEW",
      icon: "🏨",
    },
  ];

  const handleContinue = () => {
    setLoading(true);
    try {
      localStorage.setItem("drisyamn_role", selected);
      localStorage.setItem("drisyamn_username", username);
      localStorage.setItem("drisyamn_selected_role_data", JSON.stringify(ROLES.find((r) => r.id === selected)));
    } catch (e) {
      console.log("localStorage error", e);
    }

    let finalRoute = "";

    // YAHI ROUTES HAI BHAI - TERE SCREENSHOT KE HISAB SE
    switch (selected) {
      case "personal_retails":
        finalRoute = `/create-profile/personal/${username}`;
        break;
      case "retail_wholesale":
        finalRoute = `/create-profile/personal/${username}?type=retail_wholesale`;
        break;
      case "food_beverage":
        finalRoute = `/create-profile/personal/${username}?type=food_beverage`;
        break;
      case "furniture":
        finalRoute = `/create-profile/personal/${username}?type=furniture`;
        break;
      case "electronics":
        finalRoute = `/create-profile/personal/${username}?type=electronics`;
        break;
      case "fashion":
        finalRoute = `/create-profile/personal/${username}?type=fashion`;
        break;
      case "beauty_salon":
        finalRoute = `/create-profile/personal/${username}?type=beauty_salon`;
        break;
      case "services":
        finalRoute = `/profile/service/${username}`;
        break;
      case "stays_property":
        // YE TERA WALA ROUTE - create-profile/hotels/[username]/page.tsx
        finalRoute = `/create-profile/hotels/${username}`;
        break;
      default:
        finalRoute = `/create-profile/personal/${username}`;
    }

    console.log("Navigating to:", finalRoute);

    setTimeout(() => {
      router.push(finalRoute);
    }, 500);
  };

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
        {/* HEADER */}
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
          <div className="mt-5 flex flex-col items-center gap-2">
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
            <p className="mt-1 text-[11px] text-black/30 uppercase tracking-widest font-bold">
              Welcome, {username}
            </p>
          </div>
        </div>

        {/* ROLES LIST */}
        <div className="mt-7 flex flex-col gap-[14px]">
          {ROLES.map((r) => {
            const active = selected === r.id;
            const isHovered = hovered === r.id;
            const isNew = r.count === "NEW";
            return (
              <button
                key={r.id}
                onClick={() => setSelected(r.id)}
                onMouseEnter={() => setHovered(r.id)}
                onMouseLeave={() => setHovered(null)}
                className={`w-full text-left rounded-[16px] border px-4 py-[14px] flex justify-between items-start gap-3 transition-all duration-200 active:scale-[0.98]`}
                style={{
                  backgroundColor: active? "#FFFFFF" : "#F6F1E6",
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
                    <span style={{ filter: active? "invert(1)" : "none" }}>{r.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
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
                      {isNew && (
                        <span
                          className="px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest"
                          style={{
                            background: ORANGE,
                            color: "#fff",
                          }}
                        >
                          NEW
                        </span>
                      )}
                    </div>
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
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
                    style={{
                      backgroundColor: active? GREEN : "#fff",
                      border: `1.5px solid ${active? GREEN : "rgba(0,0,0,0.12)"}`,
                      boxShadow: active? `0 0 0 3px ${GREEN}20` : "none",
                    }}
                  >
                    {active && <span className="text-white font-black text-[12px]">✓</span>}
                  </div>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{
                      color: isNew? ORANGE : TEXT_LIGHT,
                      background: isNew? `${ORANGE}15` : "transparent",
                    }}
                  >
                    {r.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* SELECTED INFO BOX */}
        <div
          className="mt-6 rounded-[14px] border p-3 flex items-start gap-3"
          style={{
            background: "#FFF7ED",
            borderColor: `${ORANGE}20`,
          }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-black text-[12px]"
            style={{ background: ORANGE }}
          >
           !
          </div>
          <div>
            <p
              style={{
                color: PURE_BLACK,
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              Selected: {ROLES.find((r) => r.id === selected)?.title}
            </p>
            <p
              style={{
                color: TEXT_GRAY,
                fontSize: "11px",
                marginTop: "2px",
                lineHeight: "1.4",
              }}
            >
              {selected === "stays_property"
               ? "You will be redirected to /create-profile/hotels/[username] - Cover slider + Logo + About + Story form"
                : `You will be redirected to /create-profile/personal/${username} with ${selected} type`}
            </p>
          </div>
        </div>

        {/* CONTINUE BUTTON */}
        <button
          onClick={handleContinue}
          disabled={loading}
          className="mt-7 w-full h-[54px] rounded-full text-white text-[14px] font-black tracking-[0.08em] uppercase flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
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

        <p className="mt-4 text-center text-[10px] text-black/30 font-medium tracking-wide">
          9 ROLES • PERSONAL + BUSINESS + STAYS + PROPERTY
        </p>

        <p className="mt-2 text-center text-[10px] text-black/20">
          Route: /create-profile/hotels/[username]/page.tsx
        </p>
      </div>
    </div>
  );
}