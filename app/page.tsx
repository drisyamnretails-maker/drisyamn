"use client";
import { useRouter } from "next/navigation";
const BG_MAIN = "#FFFEFB";
const SHADOW = "0 12px 32px rgba(0,0,0,0.07), 0 1.5px 4px rgba(0,0,0,0.05)";
export default function HomePage() {
  const router = useRouter();
  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: BG_MAIN }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-[#E6F4EA]/60 rounded-full blur-[150px]" />
        <div className="absolute -bottom-[400px] -right-[200px] w-[800px] h-[800px] bg-[#F6F1E6]/80 rounded-full blur-[140px]" />
      </div>
      <div className="relative z-10 min-h-screen flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-[420px] flex justify-between items-center">
          <p className="text-[10px] tracking-[0.3em] text-black/30" style={{ fontWeight: 500 }}>EST. 2026</p>
          <p className="text-[10px] tracking-[0.3em] text-black/30" style={{ fontWeight: 500 }}>MATIGARA • SILIGURI</p>
        </div>
        <div className="mt-16 text-center">
          <h1 className="font-serif text-[64px] leading-[0.85] tracking-[-0.06em] text-black" style={{ fontWeight: 600 }}>Drisyamn</h1>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="w-8 h-[1px] bg-black/10" />
            <p className="text-[11px] tracking-[0.35em] text-black/40" style={{ fontWeight: 500 }}>DISCOVER EVERYTHING</p>
            <div className="w-8 h-[1px] bg-black/10" />
          </div>
        </div>
        <div className="mt-14 grid grid-cols-3 gap-[14px] w-full max-w-[380px]">
          {['Discover','Search','Explore','Connect','Promote','Showcase'].map((k,i) => (
            <div key={k} className="aspect-[0.95] rounded-[24px] bg-white border border-black/[0.06] p-4 flex flex-col justify-between" style={{ boxShadow: SHADOW }}>
              <span className="text-[10px] text-black/20">0{i+1}</span>
              <p className="text-[13px] text-black" style={{ fontWeight: 500 }}>{k}</p>
            </div>
          ))}
        </div>
        <div className="mt-auto w-full max-w-[380px]">
          <button onClick={() => router.push("/login")} className="w-full h-[60px] rounded-full bg-[#0F4C3A] text-white text-[12px] tracking-[0.18em] flex items-center justify-center gap-3" style={{ fontWeight: 500, boxShadow: SHADOW }}>
            GET STARTED <span className="w-7 h-7 rounded-full bg-white text-[#0F4C3A] flex items-center justify-center">→</span>
          </button>
        </div>
      </div>
    </main>
  );
}