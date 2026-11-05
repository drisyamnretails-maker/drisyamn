"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AddSlider({ storeName = "MY LUXURY STORE" }) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const router = useRouter();

  const slides = [
    {
      id: 1,
      h1: "NEW SEASON",
      h2: "JUST FOR\nYOU",
      h3: "30% OFF • Online Exclusive",
      h4: "SHOP NOW →",
      img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&fit=crop",
      link: "/shop/new",
    },
    {
      id: 2,
      h1: "QUIET LUXURY",
      h2: "BEIGE\nLUXE",
      h3: "New Arrivals • Limited Stock",
      h4: "EXPLORE →",
      img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&fit=crop",
      link: "/shop/luxe",
    },
    {
      id: 3,
      h1: "DAILY ESSENTIALS",
      h2: "SOFT\nEDIT",
      h3: "Curated For Everyday Wear",
      h4: "SHOP NOW →",
      img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&fit=crop",
      link: "/shop/daily",
    },
  ];

  const next = () => setCurrent((p) => (p + 1) % slides.length);
  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);

  return (
    <div className="w-full px-3 my-3 box-border">
      <div
        onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 50) { if (diff > 0) next(); else prev(); }
        }}
        className="relative w-full overflow-hidden rounded-[16px] h-[200px] sm:h-[260px] md:h-[300px] bg-[#E8DDD0]"
      >
        {slides.map((s, i) => (
          <div
            key={s.id}
            onClick={() => router.push(s.link)}
            className={`absolute inset-0 w-full h-full cursor-pointer transition-opacity duration-700 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <img src={s.img} alt={s.h2} className="absolute inset-0 w-full h-full object-cover object-[center_20%]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />

            {/* POSITION FIXED AS YOU SAID */}
            <div className="absolute inset-0">
              {/* H1 - UPAR */}
              <p className="absolute top-[16px] left-[56px] sm:left-[68px] text-white/80 text-[8px] sm:text-[9px] tracking-[0.4em] uppercase font-medium">
                {s.h1}
              </p>

              {/* STORE NAME - H1 KE NICHE */}
              <h3 className="absolute top-[32px] left-[56px] sm:left-[68px] text-white text-[11px] sm:text-[13px] font-bold tracking-[0.12em] uppercase">
                {storeName}
              </h3>

              {/* H2 - MIDDLE ME */}
              <h2 className="absolute top-[52%] left-[56px] sm:left-[68px] -translate-y-1/2 text-white text-[26px] sm:text-[34px] md:text-[40px] font-serif font-bold leading-[0.85] whitespace-pre-line">
                {s.h2}
              </h2>

              {/* H3 - BADA KIYA, BAHUT NICHE */}
              <p className="absolute bottom-[42px] left-[56px] sm:left-[68px] text-white text-[13px] sm:text-[15px] md:text-[16px] font-medium tracking-wide">
                {s.h3}
              </p>

              {/* H4 - NICHE */}
              <span className="absolute bottom-[18px] left-[56px] sm:left-[68px] text-white text-[10px] sm:text-[11px] tracking-[0.25em] uppercase border-b border-white/80 pb-[2px]">
                {s.h4}
              </span>
            </div>
          </div>
        ))}

        <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-black/30 text-white text-[12px] flex items-center justify-center">‹</button>
        <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-black/30 text-white text-[12px] flex items-center justify-center">›</button>

        <div className="absolute bottom-[8px] left-[56px] sm:left-[68px] z-20 flex gap-1.5">
          {slides.map((_, idx) => (
            <button key={idx} onClick={(e) => { e.stopPropagation(); setCurrent(idx); }} className={`h-[2px] rounded-full transition-all ${idx === current ? "w-5 bg-white" : "w-2.5 bg-white/40"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}