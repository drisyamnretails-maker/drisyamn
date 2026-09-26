"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// ================= HEAVY LUXURY THEME =================
const THEME = {
  pageBg: "#EDE6D3",
  cardBg: "#FFFFFF",
  inputBg: "#F5F1E6",
  orange: "#E86A33",
  black: "#0F172A",
  blackLight: "#334155",
  muted: "#64748B",
  lightMuted: "#94A3B8",
  green: "#10B981",
  greenShadow: "rgba(16,185,129,0.35)",
  orangeShadow: "rgba(232,106,51,0.18)",
};

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
  desc: string;
  sub: string;
  tags: string[];
  route: string;
  count: string;
}

// ================ ALL ROUTES =================
const ROLES: RoleItem[] = [
  {
    id: "personal_retails",
    title: "Personal Retails",
    desc: "12k+ users in Siliguri",
    sub: "Personal shopping & daily needs",
    tags: ["Personal", "Shopping", "Daily"],
    route: "profile",
    count: "12k+",
  },
  {
    id: "retail_wholesale",
    title: "Retail & Wholesale Trading",
    desc: "Buy, sell & trade products in bulk",
    sub: "Shops, wholesalers, distributors in Siliguri",
    tags: ["Shops", "Wholesale", "Trading"],
    route: "retail",
    count: "8k+",
  },
  {
    id: "food_beverage",
    title: "Food & Beverage",
    desc: "Restaurants, cafes, clouds & eat-out",
    sub: "Food stalls, restaurants, cloud kitchens, cafes",
    tags: ["Restaurants", "Cafes", "Cloud Kitchen"],
    route: "food",
    count: "5k+",
  },
  {
    id: "furniture",
    title: "Furniture & Home Decor",
    desc: "Sofas, beds, decor & interiors",
    sub: "Home furniture, interior designers in Siliguri",
    tags: ["Furniture", "Decor", "Interior"],
    route: "furniture",
    count: "2k+",
  },
  {
    id: "electronics",
    title: "Electronics & Mobile",
    desc: "Mobiles, laptops, gadgets & repair",
    sub: "Mobile shops, electronics stores, repair",
    tags: ["Mobiles", "Laptops", "Repair"],
    route: "electronics",
    count: "6k+",
  },
  {
    id: "fashion",
    title: "Fashion & Lifestyle",
    desc: "Clothing, footwear, accessories",
    sub: "Boutiques, fashion stores, tailors in Siliguri",
    tags: ["Clothing", "Footwear", "Boutique"],
    route: "fashion",
    count: "9k+",
  },
  {
    id: "grocery",
    title: "Grocery & Daily Needs",
    desc: "Kirana, vegetables, dairy & more",
    sub: "Grocery shops, supermarkets, daily needs",
    tags: ["Kirana", "Vegetables", "Supermarket"],
    route: "grocery",
    count: "7k+",
  },
  {
    id: "beauty_salon",
    title: "Beauty & Salon",
    desc: "Salons, parlours, cosmetics & spa",
    sub: "Beauty parlours, spa, cosmetic shops",
    tags: ["Salon", "Spa", "Cosmetics"],
    route: "beauty",
    count: "3k+",
  },
  {
    id: "services",
    title: "Professional Services",
    desc: "Doctors, tutors, repairs & more",
    sub: "All professional services in Siliguri",
    tags: ["Doctors", "Tutors", "Services"],
    route: "services",
    count: "4k+",
  },
];

export default function SelectRoleHeavyPage() {
  const params = useParams();
  const router = useRouter();
  const username = (params?.username as string) || "user_0000";
  const displayName = username.split("_")[0] || "there";

  const [selected, setSelected] = useState<RoleId>("personal_retails");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectAndRoute = (role: RoleItem) => {
    setSelected(role.id);
    setIsLoading(true);

    // Save for next pages
    try {
      localStorage.setItem("drisyamn_role", role.id);
      localStorage.setItem("drisyamn_username", username);
      localStorage.setItem("drisyamn_role_title", role.title);
      localStorage.setItem("drisyamn_role_route", role.route);
    } catch {}

    // Heavy smooth routing
    setTimeout(() => {
      // Personal -> /profile/[username], baaki -> /[route]/[username]
      router.push(`/${role.route}/${username}`);
    }, 450);
  };

  const selectedRole = ROLES.find((r) => r.id === selected);

  if (!mounted) return null;

  return (
    <div
      className="min-h-screen w-full flex justify-center"
      style={{ backgroundColor: THEME.pageBg }}
    >
      <div className="w-full max-w-[460px] px-5 py-7">
        {/* TOP SECURE PILL */}
        <div className="flex justify-center mb-8">
          <div
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white"
            style={{
              boxShadow:
                "0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: THEME.green }}
            ></span>
            <span
              style={{
                color: THEME.blackLight,
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.18em",
              }}
            >
              STEP 2 OF 3 • SECURE
            </span>
            <span
              style={{
                color: THEME.orange,
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.05em",
              }}
            >
              {username}
            </span>
          </div>
        </div>

        {/* BRAND HEAVY */}
        <div className="text-center">
          <h1
            className="font-serif font-black"
            style={{
              color: THEME.black,
              fontSize: "42px",
              lineHeight: "1",
              letterSpacing: "-0.04em",
              fontWeight: 900,
            }}
          >
            Drisyamn
          </h1>
          <p
            style={{
              color: THEME.blackLight,
              fontSize: "14.5px",
              letterSpacing: "0.04em",
              marginTop: "6px",
              fontWeight: 500,
            }}
          >
            Discover everything around you
          </p>
        </div>

        {/* ROLE HEADING HEAVY */}
        <div className="text-center mt-9">
          <h2
            className="font-bold"
            style={{
              color: THEME.black,
              fontSize: "26px",
              letterSpacing: "-0.02em",
              lineHeight: "1.2",
            }}
          >
            Choose Your Role
          </h2>
          <p
            style={{
              color: THEME.blackLight,
              fontSize: "14.5px",
              letterSpacing: "0.02em",
              lineHeight: "1.6",
              marginTop: "10px",
              fontWeight: 500,
            }}
          >
            Hi {displayName}! Select what best describes you
            <br />
            to personalize your Siliguri experience
          </p>
        </div>

        {/* CARDS HEAVY LOOK */}
        <div className="mt-9 flex flex-col gap-4.5">
          {ROLES.map((role) => {
            const active = selected === role.id;
            return (
              <button
                key={role.id}
                onClick={() => handleSelectAndRoute(role)}
                className="group w-full text-left rounded-[20px] p-[18px] bg-white border-[2.5px] text-left transition-all duration-300"
                style={{
                  borderColor: active? THEME.orange : "#FFFFFF",
                  backgroundColor: THEME.cardBg,
                  boxShadow: active
                   ? `0 12px 32px ${THEME.orangeShadow}, 0 4px 12px rgba(0,0,0,0.08)`
                    : "0 6px 20px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)",
                  transform: active? "scale(1.015)" : "scale(1)",
                }}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    {active && (
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-white"
                          style={{
                            backgroundColor: THEME.orange,
                            fontSize: "9px",
                            fontWeight: 800,
                            letterSpacing: "0.18em",
                          }}
                        >
                          SELECTED
                        </span>
                        <span
                          style={{
                            color: THEME.muted,
                            fontSize: "11px",
                            fontWeight: 600,
                            letterSpacing: "0.04em",
                          }}
                        >
                          {role.count} users
                        </span>
                      </div>
                    )}

                    {/* Title - bada signup jaisa */}
                    <h3
                      className="font-bold truncate"
                      style={{
                        color: THEME.black,
                        fontSize: "17px",
                        letterSpacing: "0.01em",
                        lineHeight: "1.3",
                        fontWeight: 800,
                      }}
                    >
                      {role.title}
                    </h3>

                    {/* Desc - letter spacing */}
                    <p
                      style={{
                        color: THEME.blackLight,
                        fontSize: "13.5px",
                        letterSpacing: "0.02em",
                        lineHeight: "1.5",
                        marginTop: "4px",
                        fontWeight: 500,
                      }}
                    >
                      {role.desc}
                    </p>
                    <p
                      style={{
                        color: THEME.lightMuted,
                        fontSize: "12px",
                        letterSpacing: "0.02em",
                        lineHeight: "1.4",
                        marginTop: "2px",
                      }}
                    >
                      {role.sub}
                    </p>

                    {/* Tags heavy */}
                    <div className="flex gap-2 mt-3.5 flex-wrap">
                      {role.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full font-semibold"
                          style={{
                            backgroundColor: active
                             ? THEME.inputBg
                              : "#F8F5EE",
                            color: THEME.black,
                            fontSize: "11px",
                            letterSpacing: "0.03em",
                            border: `1px solid ${active? "#F0E6D3" : "#F1F5F9"}`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* BEAUTIFUL GREEN TICK HEAVY */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div
                      className="w-[30px] h-[30px] rounded-full flex items-center justify-center transition-all duration-300"
                      style={{
                        backgroundColor: active
                         ? THEME.green
                          : "#FFFFFF",
                        border: `2.5px solid ${active? THEME.green : "#E2E8F0"}`,
                        boxShadow: active
                         ? `0 4px 12px ${THEME.greenShadow}`
                          : "0 1px 3px rgba(0,0,0,0.05)",
                      }}
                    >
                      {active && (
                        <span
                          className="text-white font-black"
                          style={{ fontSize: "15px", lineHeight: "1" }}
                        >
                          ✓
                        </span>
                      )}
                    </div>
                    {!active && (
                      <span
                        style={{
                          color: THEME.lightMuted,
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.05em",
                        }}
                      >
                        {role.count}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* CONTINUE HEAVY BUTTON */}
        <button
          onClick={() => {
            const r = ROLES.find((x) => x.id === selected)!;
            handleSelectAndRoute(r);
          }}
          disabled={isLoading}
          className="w-full mt-9 h-[56px] rounded-full font-bold text-white tracking-wide flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{
            backgroundColor: THEME.black,
            fontSize: "15.5px",
            letterSpacing: "0.03em",
            boxShadow: "0 8px 24px rgba(15,23,42,0.22)",
            opacity: isLoading? 0.8 : 1,
          }}
        >
          {isLoading? (
            "Routing..."
          ) : (
            <>
              Continue as {selectedRole?.title} <span>→</span>
            </>
          )}
        </button>

        <p
          className="text-center mt-5"
          style={{
            color: THEME.muted,
            fontSize: "11.5px",
            letterSpacing: "0.03em",
            fontWeight: 500,
          }}
        >
          You can change your role anytime from settings • Siliguri
        </p>

        <div className="h-10" />
      </div>
    </div>
  );
}