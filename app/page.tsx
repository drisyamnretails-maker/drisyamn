"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const DARK_GREEN = "#0F4C3A";
const BG_MAIN = "#FFFEFB";
const SHADOW = "0 12px 32px rgba(0,0,0,0.07), 0 1.5px 4px rgba(0,0,0,0.05)";

export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { setChecking(false); return; }
      const { data: profile } = await supabase.from('profiles').select('username, role, onboarding_done').eq('id', session.user.id).maybeSingle();
      if (!profile) { router.push(`/select-role/${session.user.user_metadata?.username || 'user'}`); return; }
      if (!profile.onboarding_done) { router.push(`/profile/setup/${profile.username}?type=${profile.role}`); return; }
      router.push('/homefeed');
    })();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: BG_MAIN }}>
        <h1 className="font-serif text-[52px] tracking-[-0.05em] text-black" style={{ fontWeight: 600 }}>Drisyamn</h1>
        <div className="mt-4 w-[120px] h-[1px] bg-black/10" />
        <p className="mt-3 text-[10px] tracking-[0.4em] text-black/30" style={{ fontWeight: 500 }}>LOADING</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: BG_MAIN }}>
      {/* Soft background glows - apna wala */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-[#E6F4EA]/60 rounded-full blur-[150px]" />
        <div className="absolute -bottom-[400px] -right-[200px] w-[800px] h-[800px] bg-[#F6F1E6]/80 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center px-6 py-12">

        {/* TOP BRAND - same size as create page */}
        <div className="w-full max-w-[420px] flex justify-between items-center">
          <p className="text-[10px] tracking-[0.3em] text-black/30" style={{ fontWeight: 500 }}>EST. 2026</p>
          <p className="text-[10px] tracking-[0.3em] text-black/30" style={{ fontWeight: 500 }}>MATIGARA • SILIGURI</p>
        </div>

        {/* HERO */}
        <div className="mt-16 text-center">
          <h1 className="font-serif text-[64px] leading-[0.85] tracking-[-0.06em] text-black" style={{ fontWeight: 600 }}>
            Drisyamn
          </h1>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="w-8 h-[1px] bg-black/10" />
            <p className="text-[11px] tracking-[0.35em] text-black/40" style={{ fontWeight: 500 }}>DISCOVER EVERYTHING</p>
            <div className="w-8 h-[1px] bg-black/10" />
          </div>
        </div>

        {/* 6 CARDS - white + shadow + dark green hover */}
        <div className="mt-14 grid grid-cols-3 gap-[14px] w-full max-w-[380px]">
          {[
            { k: 'Discover', d: '01' },
            { k: 'Search', d: '02' },
            { k: 'Explore', d: '03' },
            { k: 'Connect', d: '04' },
            { k: 'Promote', d: '05' },
            { k: 'Showcase', d: '06' },
          ].map((item) => (
            <div
              key={item.k}
              className="group relative aspect-[0.95] rounded-[24px] bg-white border border-black/[0.06] p-[1px] overflow-hidden hover:border-[#0F4C3A]/20 transition-all"
              style={{ boxShadow: SHADOW }}
            >
              <div className="w-full h-full rounded-[23px] bg-[#FFFEFB] flex flex-col items-start justify-between p-4">
                <span className="text-[10px] tracking-widest text-black/20" style={{ fontWeight: 500 }}>{item.d}</span>
                <div>
                  <div className="w-6 h-6 rounded-full bg-[#0F4C3A] text-white flex items-center justify-center text-[12px] group-hover:scale-110 transition-transform" style={{ fontWeight: 500 }}>↗</div>
                  <p className="mt-3 text-[13px] text-black tracking-tight leading-none" style={{ fontWeight: 500 }}>{item.k}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA - Dark Green wala button */}
        <div className="mt-auto w-full max-w-[380px]">
          <div className="relative group">
            <div className="absolute -inset-2 bg-[#0F4C3A]/10 rounded-full blur-[20px] group-hover:bg-[#0F4C3A]/15 transition-all" />
            <button
              onClick={() => router.push("/login")}
              className="relative w-full h-[60px] rounded-full bg-[#0F4C3A] text-white text-[12px] tracking-[0.18em] flex items-center justify-center gap-3 hover:bg-[#0A3326] active:scale-[0.98] transition-all"
              style={{ fontWeight: 500, boxShadow: SHADOW }}
            >
              GET STARTED
              <span className="w-7 h-7 rounded-full bg-white text-[#0F4C3A] flex items-center justify-center text-[12px]">→</span>
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-[#E6F4EA] border-2 border-white" style={{ boxShadow: SHADOW }} />
              <div className="w-7 h-7 rounded-full bg-[#F6F1E6] border-2 border-white" style={{ boxShadow: SHADOW }} />
              <div className="w-7 h-7 rounded-full bg-[#0F4C3A] border-2 border-white" style={{ boxShadow: SHADOW }} />
            </div>
            <p className="text-[11px] text-black/40" style={{ fontWeight: 400 }}>
              <span className="text-black" style={{ fontWeight: 600 }}>1,200+</span> people from Siliguri joined
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
      .font-serif { font-family: 'Times New Roman', Times, serif; }
      `}</style>
    </main>
  );
}