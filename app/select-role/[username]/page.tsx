"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

// =====================================================
// THEME - DO NOT CHANGE - DRISYAMN THEME
// =====================================================
const ORANGE = "#E86A33";
const PAGE_BG = "#EDE6D3";
const PURE_BLACK = "#0A0A0A";
const LABEL_BLACK = "#0F1A3A";
const GREEN = "#22C55E";
const CARD_BG = "#FFFEFB";
const INPUT_BG = "#F6F1E6";
const BORDER_LIGHT = "rgba(0,0,0,0.08)";
const TEXT_GRAY = "#6B7280";
const TEXT_LIGHT = "#9CA3AF";

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
  | "beauty_salon"
  | "services"
  | "stays_property";

interface RoleItem {
  id: RoleId;
  title: string;
  sub: string;
  tags: string[];
  routeType: string;
  description: string;
  count: string;
}

// =====================================================
// ROLES DATA - 9 ROLES TOTAL
// 8 OLD + 1 NEW COMBINED (HOTELS+HOMESTAYS+REAL ESTATE)
// =====================================================
const ROLES: RoleItem[] = [
  {
    id: "personal_retails",
    title: "Personal Retails",
    sub: "Personal shopping & daily needs",
    tags: ["Personal", "Shopping", "Daily"],
    routeType: "personal",
    description: "For personal buyers and shoppers",
    count: "2.1k users",
  },
  {
    id: "retail_wholesale",
    title: "Retail & Wholesale Trading",
    sub: "Shops, wholesalers, distributors",
    tags: ["Shops", "Wholesale", "Trading"],
    routeType: "retail_wholesale",
    description: "Shops and wholesale business",
    count: "1.8k users",
  },
  {
    id: "food_beverage",
    title: "Food & Beverage",
    sub: "Food stalls, restaurants, cafes",
    tags: ["Restaurants", "Cafes", "Kitchen"],
    routeType: "food_beverage",
    description: "Food business and cloud kitchens",
    count: "3.2k users",
  },
  {
    id: "furniture",
    title: "Furniture & Home Decor",
    sub: "Home furniture, interior designers",
    tags: ["Furniture", "Decor", "Interior"],
    routeType: "furniture",
    description: "Furniture and home decor stores",
    count: "890 users",
  },
  {
    id: "electronics",
    title: "Electronics & Mobile",
    sub: "Mobile shops, electronics stores",
    tags: ["Mobiles", "Laptops", "Repair"],
    routeType: "electronics",
    description: "Electronics and mobile shops",
    count: "1.5k users",
  },
  {
    id: "fashion",
    title: "Fashion & Lifestyle",
    sub: "Boutiques, fashion stores",
    tags: ["Clothing", "Footwear", "Boutique"],
    routeType: "fashion",
    description: "Fashion boutiques and lifestyle",
    count: "2.4k users",
  },
  {
    id: "beauty_salon",
    title: "Beauty & Salon",
    sub: "Beauty parlours, spa & cosmetics",
    tags: ["Salon", "Spa", "Cosmetics"],
    routeType: "beauty_salon",
    description: "Beauty parlours and salons",
    count: "1.1k users",
  },
  {
    id: "services",
    title: "Professional Services",
    sub: "All professional services",
    tags: ["Doctors", "Tutors", "Services"],
    routeType: "services",
    description: "Professional service providers",
    count: "2.9k users",
  },
  // =====================================================
  // NEW COMBINED ROLE - SINGLE ROLE FOR 3 CATEGORIES
  // HOTELS + HOMESTAYS + REAL ESTATE = ONE ROLE
  // =====================================================
  {
    id: "stays_property",
    title: "Hotels, Homestays & Real Estate",
    sub: "Hotels, homestays, rent, sale - unified profile",
    tags: ["Hotels", "Homestays", "Real Estate"],
    routeType: "stays_property",
    description: "Hotels, homestays, PG, rent and sale properties",
    count: "New • Trending",
  },
];

// =====================================================
// HELPER - GET ROLE BY ID
// =====================================================
function getRoleById(id: RoleId): RoleItem | undefined {
  return ROLES.find((r) => r.id === id);
}

// =====================================================
// HELPER - SAVE TO LOCAL STORAGE
// =====================================================
function saveRoleToStorage(role: RoleItem, username: string) {
  try {
    localStorage.setItem("drisyamn_role", role.id);
    localStorage.setItem("drisyamn_username", username);
    localStorage.setItem("drisyamn_role_title", role.title);
    localStorage.setItem("drisyamn_role_type", role.routeType);
    localStorage.setItem("drisyamn_role_sub", role.sub);
    localStorage.setItem("drisyamn_role_saved_at", new Date().toISOString());
  } catch (e) {
    console.log("storage error", e);
  }
}

// =====================================================
// MAIN PAGE COMPONENT - 500 LINES
// =====================================================
export default function Page() {
  // -----------------------------------------------------
  // HOOKS & PARAMS
  // -----------------------------------------------------
  const { username } = useParams() as { username: string };
  const router = useRouter();
  const [selected, setSelected] = useState<RoleId>("personal_retails");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState<RoleId | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  // -----------------------------------------------------
  // MOUNT EFFECT
  // -----------------------------------------------------
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("drisyamn_role") as RoleId | null;
    if (saved && ROLES.some((r) => r.id === saved)) {
      setSelected(saved);
    }
  }, []);

  // -----------------------------------------------------
  // DERIVED
  // -----------------------------------------------------
  const selectedRole = useMemo(() => getRoleById(selected), [selected]);
  const isStaysProperty = selected === "stays_property";

  // -----------------------------------------------------
  // EARLY RETURN
  // -----------------------------------------------------
  if (!mounted) {
    return null;
  }

  // -----------------------------------------------------
  // HANDLE CONTINUE - FINAL ROUTING LOGIC
  // -----------------------------------------------------
  const handleContinue = () => {
    if (loading) return;
    setLoading(true);

    const roleObj = getRoleById(selected);
    if (!roleObj) {
      setLoading(false);
      return;
    }

    saveRoleToStorage(roleObj, username);

    // Small delay for UX
    setTimeout(() => {
      if (selected === "personal_retails") {
        router.push(`/create-profile/personal/${username}`);
      } else if (selected === "stays_property") {
        // Unified profile for hotels, homestays, real estate
        // Inside create-profile page we will show 4 sub-options:
        // HOTEL / HOMESTAY / RENT / SALE
        router.push(
          `/create-profile/business/${username}?type=stays_property&category=all`
        );
      } else {
        router.push(
          `/create-profile/business/${username}?type=${roleObj.routeType}`
        );
      }
    }, 400);
  };

  // -----------------------------------------------------
  // HANDLE ROLE SELECT
  // -----------------------------------------------------
  const handleSelect = (id: RoleId) => {
    setSelected(id);
    // Haptic feedback for mobile
    if (typeof navigator!== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(10);
      } catch {}
    }
  };

  // -----------------------------------------------------
  // RENDER
  // -----------------------------------------------------
  return (
    <div
      className="min-h-[100vh] w-full flex items-start justify-center p-4 pt-8 overflow-y-auto"
      style={{
        background: PAGE_BG,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* MAIN CARD */}
      <div
        className="w-full max-w-[400px] bg-[#FFFEFB] rounded-[24px] px-6 py-6 mb-10 border border-black/[0.05]"
        style={{
          boxShadow:
            "0 0 0 8px #fff, 0 0 0 9px rgba(0,0,0,0.05), 0 20px 50px rgba(0,0,0,0.12)",
        }}
      >
        {/* HEADER - BRAND */}
        <div className="text-center">
          <h1
            className="font-serif leading-none tracking-tight"
            style={{
              color: PURE_BLACK,
              fontSize: "44px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Drisyamn
          </h1>
          <p
            className="mt-1"
            style={{
              color: TEXT_GRAY,
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            Discover everything around you
          </p>

          {/* TITLE */}
          <h2
            className="mt-6"
            style={{
              color: PURE_BLACK,
              fontSize: "19px",
              fontWeight: 700,
            }}
          >
            Choose Your Role
          </h2>
          <p
            className="mt-1"
            style={{
              color: TEXT_LIGHT,
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            {selectedRole?.sub}
          </p>

          {/* SPECIAL BADGE FOR STAYS */}
          {isStaysProperty && (
            <div className="mt-3 flex justify-center">
              <span
                className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wide"
                style={{
                  background: ORANGE,
                  color: "#fff",
                }}
              >
                HOTELS • HOMESTAYS • REAL ESTATE • UNIFIED
              </span>
            </div>
          )}
        </div>

        {/* ROLES LIST */}
        <div className="mt-6 flex flex-col gap-[14px]">
          {ROLES.map((r) => {
            const active = selected === r.id;
            const isHovered = hovered === r.id;
            const isNew = r.id === "stays_property";

            return (
              <button
                key={r.id}
                onClick={() => handleSelect(r.id)}
                onMouseEnter={() => setHovered(r.id)}
                onMouseLeave={() => setHovered(null)}
                className={`
                  w-full
                  text-left
                  rounded-[16px]
                  border
                  px-4
                  py-[14px]
                  flex
                  justify-between
                  items-start
                  gap-3
                  outline-none
                  transition-all
                  duration-200
                  relative
                  overflow-hidden
                  ${
                    active
                     ? "bg-white border-black/20"
                      : "bg-[#F6F1E6] border-black/10 hover:bg-white hover:border-black/15"
                  }
                `}
                style={{
                  boxShadow: active
                   ? "0 0 0 4px rgba(0,0,0,0.05), 0 8px 20px rgba(0,0,0,0.06)"
                    : "none",
                  transform: isHovered? "translateY(-1px)" : "translateY(0px)",
                }}
              >
                {/* NEW INDICATOR LINE */}
                {isNew && active && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[4px]"
                    style={{ background: ORANGE }}
                  />
                )}

                {/* LEFT */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      style={{
                        color: LABEL_BLACK,
                        fontSize: "15px",
                        fontWeight: 700,
                        lineHeight: "1.2",
                      }}
                    >
                      {r.title}
                    </p>
                    {isNew && (
                      <span
                        className="px-1.5 py-0.5 rounded text-[8px] font-black"
                        style={{
                          background: "#FEF3C7",
                          color: ORANGE,
                          border: `1px solid ${ORANGE}20`,
                        }}
                      >
                        NEW
                      </span>
                    )}
                  </div>

                  <p
                    style={{
                      color: TEXT_LIGHT,
                      fontSize: "11px",
                      fontWeight: 400,
                      marginTop: "3px",
                      lineHeight: "1.3",
                    }}
                  >
                    {r.sub}
                  </p>

                  {/* TAGS */}
                  <div className="flex gap-1.5 mt-2.5 flex-wrap">
                    {r.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded-full border border-black/5"
                        style={{
                          backgroundColor: "#fff",
                          color: "#111827",
                          fontSize: "9.5px",
                          fontWeight: 500,
                          letterSpacing: "0.02em",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* COUNT */}
                  <p
                    className="mt-2"
                    style={{
                      color: TEXT_LIGHT,
                      fontSize: "9px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {r.count}
                  </p>
                </div>

                {/* RIGHT - TICK */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all"
                  style={{
                    backgroundColor: active? GREEN : "#fff",
                    border: `1.5px solid ${
                      active? GREEN : "rgba(0,0,0,0.12)"
                    }`,
                    boxShadow: active
                     ? "0 2px 8px rgba(34,197,94,0.35)"
                      : "0 1px 3px rgba(0,0,0,0.05)",
                    transform: isHovered? "scale(1.08)" : "scale(1)",
                  }}
                >
                  {active && (
                    <span
                      className="text-white font-black"
                      style={{ fontSize: "12px" }}
                    >
                      ✓
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* INFO BOX FOR STAYS_PROPERTY */}
        {isStaysProperty && (
          <div
            className="mt-5 rounded-[14px] p-3 border"
            style={{
              background: "#FFF7ED",
              borderColor: `${ORANGE}30`,
            }}
          >
            <p
              style={{
                color: PURE_BLACK,
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              Unified Profile Includes:
            </p>
            <p
              className="mt-1"
              style={{
                color: TEXT_GRAY,
                fontSize: "11px",
                lineHeight: "1.4",
                fontWeight: 500,
              }}
            >
              • Cover Slider (4-5 photos sliding)
              <br />
              • Logo fit in cover (rounded square)
              <br />
              • About Us, Our Story, Why Choose Us
              <br />
              • Address, Phone, Locations
            </p>
          </div>
        )}

        {/* CONTINUE BUTTON */}
        <button
          onClick={handleContinue}
          disabled={loading}
          className="mt-7 w-full h-[52px] rounded-full text-white text-[14px] font-black tracking-[0.08em] uppercase flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70"
          style={{
            background: loading? "#9CA3AF" : ORANGE,
            boxShadow: loading
             ? "0 0 0 6px white"
              : "0 0 0 6px white, 0 10px 24px rgba(232,106,51,0.35)",
          }}
        >
          {loading? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              PLEASE WAIT...
            </>
          ) : (
            <>CONTINUE →</>
          )}
        </button>

        {/* FOOTER */}
        <div className="mt-5 flex flex-col items-center gap-2">
          <p className="text-[10px] text-black/30 font-medium tracking-wide">
            {ROLES.length} ROLES • GROCERY REMOVED • STAYS ADDED
          </p>
          <div className="flex gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-black/10" />
            <span className="w-1.5 h-1.5 rounded-full bg-black/20" />
            <span className="w-1.5 h-1.5 rounded-full bg-black/10" />
          </div>
        </div>

        {/* BOTTOM SPACER */}
        <div className="h-1" />
      </div>
    </div>
  );
}
// =====================================================
// END OF FILE - 500 LINES COMPLETE
// =====================================================
// ROLES = 9 TOTAL (8 OLD + 1 NEW COMBINED)
// NEW ROLE = stays_property = hotels + homestays + real estate
// ROUTE = /create-profile/business/[username]?type=stays_property&category=all
// UNIFIED PROFILE - COVER SLIDER + LOGO FIT + ABOUT + STORY + WHY + ADDRESS + PHONE + LOCATIONS
// =====================================================