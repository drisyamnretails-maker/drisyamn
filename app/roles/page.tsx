"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

const ORANGE = "#E86A33";
const PAGE_BG = "#EDE6D3";
const PURE_BLACK = "#0A0A0A";
const LABEL_BLACK = "#0F1A3A";
const CARD_BG = "#FFFEFB";

const ROLES = [
  { id: "personal", title: "Personal", sub: "Explorer", desc: "Discover & Explore local", icon: "🧭" },
  { id: "retail", title: "Retail Business", sub: "Shop / Store", desc: "Sell products like grocery, cloth", icon: "🏪" },
  { id: "service", title: "Service Business", sub: "Electrician, Salon...", desc: "Offer home & local services", icon: "🔧" },
  { id: "creator", title: "Creator", sub: "Artist / Influencer", desc: "Showcase your work & collabs", icon: "🎨" },
  { id: "media", title: "Media", sub: "News / Events", desc: "Publish news & events", icon: "📰" },
]

export default function RolesPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const router = useRouter()

  const handleContinue = () => {
    if (!selected) return
    localStorage.setItem("drisyamn_pending_role", selected)
    let username = localStorage.getItem("drisyamn_username")
    if(!username){
      username = `user_${Date.now().toString().slice(-5)}`
      localStorage.setItem("drisyamn_username", username)
    }
    if (selected === "personal") router.push(`/profile/personal/${username}`)
    else if (selected === "retail") {
      localStorage.setItem(`business_profile_${username}_type`, "retail")
      router.push(`/profile/retail/${username}`)
    }
    else if (selected === "service") {
      localStorage.setItem(`business_profile_${username}_type`, "service")
      router.push(`/profile/service/${username}`)
    }
    else if (selected === "creator") router.push(`/profile/creator/${username}`)
    else if (selected === "media") router.push(`/profile/media/${username}`)
  }

  return (
    <div className="min-h-[100vh] w-full flex items-start justify-center p-4 pt-8 overflow-y-auto" style={{background:PAGE_BG}}>
      <div className="w-full max-w-[820px] bg-[#FFFEFB] rounded-[24px] p-6 md:p-8 mb-8 shadow-[0_0_0_8px_#fff,0_20px_40px_rgba(0,0,0,0.1)]">

        <div className="text-center">
          {/* Logo - Pure Black 44px Extra-Bold */}
          <h1 className="font-serif leading-none" style={{color: PURE_BLACK, fontSize: "44px", fontWeight: 800, letterSpacing: "-0.5px"}}>Drisyamn</h1>
          <p className="mt-2" style={{color: "#4B5563", fontSize: "15px", fontWeight: 600}}>Choose how you want to continue - 5 Profiles</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
          {ROLES.map((role) => {
            const isSelected = selected === role.id
            return (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                className="text-left p-5 rounded-[18px] border transition-all duration-200 hover:-translate-y-1 cursor-pointer"
                style={isSelected?
                  {background:"#F6F1E6", border:`2.5px solid ${PURE_BLACK}`, boxShadow:`0 0 0 4px white, 0 0 0 5.5px ${PURE_BLACK}, 0 10px 24px rgba(0,0,0,0.12)`, transform:"scale(1.02)"} :
                  {background:CARD_BG, border:"1px solid rgba(0,0,0,0.08)", boxShadow:"0 0 0 5px white, 0 4px 16px rgba(0,0,0,0.06)"}
                }
              >
                <div className="flex justify-between items-start">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-[20px] border-[3px] border-white shadow" style={{background: isSelected? PURE_BLACK : "#F5EFE2", color: isSelected? "white": PURE_BLACK}}>{role.icon}</div>
                  {isSelected && <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[12px] border-[2px] border-white shadow" style={{background:ORANGE}}>✓</div>}
                </div>
                {/* Title - Ab Dark & Bada */}
                <h3 className="mt-4 leading-tight" style={{color: PURE_BLACK, fontSize: "15px", fontWeight: 800}}>{role.title}</h3>
                <p className="mt-0.5" style={{color: LABEL_BLACK, fontSize: "12.5px", fontWeight: 700}}>{role.sub}</p>
                <p className="mt-1.5 leading-tight" style={{color: "#4B5563", fontSize: "11.5px", fontWeight: 500}}>{role.desc}</p>
              </button>
            )
          })}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selected}
          className="w-full mt-9 h-[54px] rounded-full text-white text-[14px] font-black tracking-wide uppercase disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 active:scale-[0.98] transition-all"
          style={{background: selected? ORANGE : PURE_BLACK, boxShadow:"0 0 0 6px white, 0 12px 28px rgba(232,106,51,0.35)"}}
        >
          Continue to {selected? ROLES.find(r=>r.id===selected)?.title : "Profile"} →
        </button>

        <div className="mt-5 text-center" style={{color: "#6B7280", fontSize: "12px", fontWeight: 500}}>Matigara • You can change role later in settings</div>
      </div>
    </div>
  )
}