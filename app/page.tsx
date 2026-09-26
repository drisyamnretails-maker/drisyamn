"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center">
        <h1 className="font-serif text-[52px] font-[900] tracking-[-0.05em] text-white">Drisyamn</h1>
        <div className="mt-4 w-[120px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <p className="mt-3 text-[10px] tracking-[0.4em] text-white/30 font-bold">CRAFTING</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden selection:bg-white selection:text-black">
      {/* PREMIUM BACKGROUND GRADIENTS - 7 CRORE WALA DEPTH */}
      <div className="absolute inset-0">
        <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-[#E86A33]/[0.15] rounded-full blur-[150px]" />
        <div className="absolute -bottom-[400px] -right-[200px] w-[800px] h-[800px] bg-[#1F3A4A]/[0.4] rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center px-6 py-12">

        {/* TOP BRAND MARK - ROLEX STYLE */}
        <div className="w-full max-w-[420px] flex justify-between items-center">
          <p className="text-[10px] tracking-[0.3em] font-bold text-white/20">EST. 2026</p>
          <p className="text-[10px] tracking-[0.3em] font-bold text-white/20">MATIGARA • SILIGURI</p>
        </div>

        {/* HERO - BHARI WEIGHT */}
        <div className="mt-16 text-center">
          <h1 className="font-serif text-[64px] leading-[0.85] tracking-[-0.06em] font-[900]">
            Drisyamn
            <span className="block text-[64px] font-[200] italic tracking-[-0.04em] text-white/60 -mt-2">.</span>
          </h1>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="w-8 h-[1px] bg-white/10" />
            <p className="text-[11px] tracking-[0.35em] font-bold text-white/40">DISCOVER EVERYTHING</p>
            <div className="w-8 h-[1px] bg-white/10" />
          </div>
        </div>

        {/* 6 CARDS - APPLE GLASS + WEIGHT */}
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
              className="group relative aspect-[0.95] rounded-[24px] bg-[#141414] border border-white/[0.06] p-[1px] overflow-hidden"
            >
              {/* Inner glass */}
              <div className="w-full h-full rounded-[23px] bg-gradient-to-b from-white/[0.08] to-white/[0.01] flex flex-col items-start justify-between p-4">
                <span className="text-[10px] font-bold tracking-widest text-white/20">{item.d}</span>
                <div>
                  <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-[12px] font-black group-hover:scale-110 transition-transform">↗</div>
                  <p className="mt-3 text-[13px] font-bold tracking-tight leading-none">{item.k}</p>
                </div>
              </div>
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-[24px] bg-gradient-to-b from-white/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>

        {/* CTA - 7 CRORE WALA BUTTON */}
        <div className="mt-auto w-full max-w-[380px]">
          <div className="relative group">
            {/* Button shadow weight */}
            <div className="absolute -inset-2 bg-white/10 rounded-full blur-[20px] group-hover:bg-white/15 transition-all" />
            <button
              onClick={() => router.push("/login")}
              className="relative w-full h-[60px] rounded-full bg-white text-black font-black text-[12px] tracking-[0.18em] flex items-center justify-center gap-3 hover:bg-[#F5F5F5] active:scale-[0.98] transition-all"
            >
              GET STARTED
              <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-[12px]">→</span>
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-[#222] border-2 border-black" />
              <div className="w-7 h-7 rounded-full bg-[#333] border-2 border-black" />
              <div className="w-7 h-7 rounded-full bg-[#444] border-2 border-black" />
            </div>
            <p className="text-[11px] font-medium text-white/40">
              <span className="text-white font-bold">1,200+</span> people from Siliguri joined
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