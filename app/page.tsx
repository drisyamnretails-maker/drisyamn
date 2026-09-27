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
    <div className="min-h-screen w-full flex justify-center" style={{ background: "#EDE6D3", fontFamily: "Inter, sans-serif" }}>
      {/* Main white card - same like your login screenshot */}
      <div className="w-full max-w-[400px] min-h-screen bg-white md:min-h-[92vh] md:mt-[4vh] md:rounded-[32px] px-6 py-8 flex flex-col" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 2px 12px rgba(0,0,0,0.06)" }}>

        {/* Top pill */}
        <div className="flex justify-center">
          <div className="px-4 py-2 rounded-full bg-[#F8F5EE] border border-black/[0.04] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
            <span className="text-[10px] tracking-[0.12em] text-[#94A3B8]" style={{ fontWeight: 400 }}>EST. 2026 • MATIGARA</span>
          </div>
        </div>

        {/* Logo - same style as login */}
        <div className="mt-10 text-center">
          <h1 className="font-serif text-[42px] tracking-[-0.03em] text-[#2E3A59]" style={{ fontWeight: 400, fontFamily: "serif" }}>Drisyamn</h1>
          <p className="mt-1 text-[13px] text-[#94A3B8]" style={{ fontWeight: 400 }}>Discover everything around you</p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[15px] text-[#1E293B]" style={{ fontWeight: 500 }}>Welcome to Siliguri's</p>
          <p className="text-[15px] text-[#64748B]" style={{ fontWeight: 400 }}>own discovery platform</p>
        </div>

        {/* Heavy boxes with icons */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {ITEMS.map((it, i) => (
            <div key={it.name} className="aspect-[0.9] rounded-[18px] bg-[#F8FAFF] border border-[#EEF2FF] p-3 flex flex-col" style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[16px] border border-black/[0.04]" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                {it.icon}
              </div>
              <div className="mt-auto">
                <p className="text-[12px] text-[#1E293B]" style={{ fontWeight: 400 }}>{it.name}</p>
                <p className="text-[9.5px] text-[#94A3B8]" style={{ fontWeight: 400 }}>{it.sub}</p>
              </div>
              <span className="absolute hidden" />
            </div>
          ))}
        </div>

        {/* Info box */}
        <div className="mt-6 rounded-[16px] bg-[#F8F5EE] border border-black/[0.03] p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[14px]">📍</div>
          <div>
            <p className="text-[12px] text-[#1E293B]" style={{ fontWeight: 400 }}>Siliguri • Matigara • Shivmandir</p>
            <p className="text-[10px] text-[#94A3B8]" style={{ fontWeight: 400 }}>12k+ shops and services around you</p>
          </div>
        </div>

        {/* Button - same orange as your login */}
        <div className="mt-auto pt-8">
          <button
            onClick={() => router.push("/login")}
            className="w-full h-[52px] rounded-full text-white text-[13px] tracking-[0.14em] flex items-center justify-center"
            style={{ background: "#E86A33", fontWeight: 500, boxShadow: "0 8px 24px rgba(232,106,51,0.28)" }}
          >
            GET STARTED
          </button>
          <p className="mt-3 text-center text-[10px] tracking-[0.12em] text-[#94A3B8]" style={{ fontWeight: 400 }}>SECURE • FAST • LOCAL</p>
        </div>

      </div>
    </div>
  );
}