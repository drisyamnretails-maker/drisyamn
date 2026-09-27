"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const ITEMS = [
    { name: "Discover", icon: "🧭", sub: "Around you" },
    { name: "Search", icon: "🔍", sub: "Anything" },
    { name: "Explore", icon: "✨", sub: "New places" },
    { name: "Connect", icon: "🤝", sub: "With shops" },
    { name: "Promote", icon: "📢", sub: "Your business" },
    { name: "Showcase", icon: "🏪", sub: "Products" },
  ];

  return (
    <div className="min-h-screen w-full flex justify-center" style={{ background: "#EDE6D3" }}>
      <div className="w-full max-w-[400px] min-h-screen bg-white md:min-h-[92vh] md:mt-[4vh] md:rounded-[32px] px-6 py-8 flex flex-col" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}>

        <div className="flex justify-center">
          <div className="px-4 py-2 rounded-full bg-[#F8F5EE] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
            <span className="text-[10px] tracking-[0.12em] text-[#64748B]" style={{ fontWeight: 400 }}>EST. 2026 • MATIGARA</span>
          </div>
        </div>

        {/* Only Drisyamn Heavy */}
        <div className="mt-10 text-center">
          <h1 className="font-serif text-[46px] leading-none text-[#1E293B]" style={{ fontWeight: 700, letterSpacing: "-0.04em", fontFamily: "serif" }}>Drisyamn</h1>
          <p className="mt-3 text-[11px] tracking-[0.28em] text-[#94A3B8] uppercase" style={{ fontWeight: 400 }}>Discover Everything Around You</p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3.5">
          {ITEMS.map((it) => (
            <div
              key={it.name}
              className="group aspect-[0.92] rounded-[20px] bg-[#F8FAFF] border border-[#EEF2FF] p-3.5 flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:border-[#E86A33]/20"
              style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 16px 32px rgba(0,0,0,0.10), 0 4px 12px rgba(232,106,51,0.12)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.04)"}
            >
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[17px] group-hover:scale-110 transition-all duration-300 border border-black/[0.04]">{it.icon}</div>
              <div className="mt-auto">
                <p className="text-[12px] text-[#1E293B]" style={{ fontWeight: 400 }}>{it.name}</p>
                <p className="text-[10px] text-[#94A3B8]" style={{ fontWeight: 400 }}>{it.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-8">
          <button onClick={() => router.push("/login")} className="w-full h-[54px] rounded-full text-white text-[13px] tracking-[0.14em] hover:bg-[#D45F2D] transition-all" style={{ background: "#E86A33", fontWeight: 400 }}>
            GET STARTED
          </button>
        </div>
      </div>
    </div>
  );
}