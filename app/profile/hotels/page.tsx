"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const BLACK = "#0A0A0A";
const ORANGE = "#E86A33";

export default function HotelProfileWorldClass() {
  const params = useParams() as { username: string };
  const username = params?.username || "tanka_7845";
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    const saved = localStorage.getItem(`drisyamn_hotel_profile_${username}`);
    if (saved) setData(JSON.parse(saved));
    else {
      // DEMO DATA FOR PREVIEW - jab tak create nahi kiya
      setData({
        businessName: "Tanka Homestay & Retreat",
        tagline: "A home in the heart of Siliguri, where every guest is family",
        category: "Homestay",
        location: { address: "Sevoke Road, Near City Center", city: "Siliguri", landmark: "Opp. City Center Mall" },
        contact: { phone: "98xxxxxxxx", whatsapp: "98xxxxxxxx" },
        stayInfo: { pricePerNight: "₹ 1,499", rooms: "8", checkIn: "12 PM", checkOut: "11 AM" },
        content: {
          aboutUs: "We are a family-run boutique homestay nestled in the heart of Siliguri, serving travelers since 2018. What started as two extra rooms in our ancestral home has now become a warm sanctuary for over 2000 guests. We believe travel is not about places, it's about people. Our rooms are minimal, clean, and filled with natural light, with handpicked local art and home-cooked Bengali meals that taste like maa ke haath ka khana.",
          ourStory: "In 2018, my father retired and we had this big house with empty rooms. I was working in Bangalore, tired of city life. I came back and thought — why not open our home? First guest was a solo backpacker from Germany. He stayed for 3 days, we cooked together, he taught us pasta, we taught him momo. When he left he said 'This doesn't feel like a hotel, it feels like home'. That line became our philosophy. From struggling to get 2 bookings a month to now being fully booked in season — every brick has a story.",
          whyChooseUs: "1. Location that saves you hours — 2 mins walk from Tenzing Norgay Bus Terminus, 5 mins from City Center\n2. We don't give you a room, we give you a home — kitchen access, late night chai, local guidance free\n3. 24/7 hot water, high-speed WiFi (100Mbps), power backup — because comfort is non-negotiable\n4. Home-cooked food included — Bengali thali, not canteen food\n5. 500+ verified 5-star reviews, family & couple safe, pet friendly"
        },
        amenities: ["Free WiFi", "Parking", "AC Rooms", "Restaurant", "Room Service", "Hot Water", "Power Backup", "CCTV"],
        rules: ["Family Only", "ID Required", "No Smoking"],
        languages: ["Hindi", "English", "Bengali", "Nepali"],
        media: { banner: null, logo: null, stories: [] },
        rating: 4.9,
        verified: true
      });
    }
  }, [username]);

  if (!data) return <div className="min-h-screen bg-[#FFFEFB] flex items-center justify-center text-[11px] tracking-widest font-bold">LOADING PROFILE...</div>;

  const bannerUrl = data.media?.banner || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400";
  const logoChar = data.businessName?.charAt(0) || "T";

  return (
    <div className="min-h-screen bg-[#FFFEFB] text-[#0A0A0A] selection:bg-black selection:text-white">

      {/* TOP NAV LIKE LUXURY HOTEL SITE */}
      <div className="sticky top-0 z-50 bg-[#FFFEFB]/80 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-[1280px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-black text-[14px]">{logoChar}</div>
            <div className="leading-none">
              <p className="font-black tracking-tight text-[13px]">{data.businessName.toUpperCase()}</p>
              <p className="text-[10px] tracking-widest text-black/50 font-bold mt-0.5">{data.location?.city?.toUpperCase()} • ESTD 2018</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest">★ {data.rating} • VERIFIED</div>
            <a href={`tel:${data.contact?.phone}`} className="h-9 px-4 rounded-full bg-black text-white text-[11px] font-bold tracking-widest flex items-center">BOOK NOW</a>
          </div>
        </div>
      </div>

      {/* HERO - CINEMATIC BANNER LIKE AMAN HOTELS */}
      <div className="max-w-[1280px] mx-auto px-3 md:px-6 mt-3 md:mt-6">
        <div className="relative h-[58vh] md:h-[72vh] rounded-[24px] md:rounded-[32px] overflow-hidden bg-[#EDE6D3]">
          <img src={bannerUrl} alt="Hotel Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent hidden md:block" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-[640px]">
              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black tracking-widest mb-4">● AVAILABLE TODAY • {data.stayInfo?.rooms} ROOMS • {data.category?.toUpperCase()}</div>
              <h1 className="text-white text-[32px] md:text-[64px] font-black leading-[0.9] tracking-[-0.03em]">{data.businessName}</h1>
              <p className="text-white/80 text-[14px] md:text-[18px] font-medium leading-snug mt-3 max-w-[520px]">{data.tagline}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="bg-white text-black px-3 py-1.5 rounded-full text-[11px] font-bold">📍 {data.location?.address}</span>
                <span className="bg-black/60 backdrop-blur text-white border border-white/20 px-3 py-1.5 rounded-full text-[11px] font-bold">From {data.stayInfo?.pricePerNight}/night</span>
              </div>
            </div>
            <div className="hidden md:flex bg-white rounded-[20px] p-3 gap-3 items-center shadow-2xl">
              <div className="w-12 h-12 rounded-[14px] bg-black text-white flex items-center justify-center font-black">{logoChar}</div>
              <div className="pr-4 leading-tight">
                <p className="text-[12px] font-black">{data.businessName}</p>
                <p className="text-[10px] text-black/50">@{username} • Hosted by Tanka</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#F6F1E6] flex items-center justify-center">↗</div>
            </div>
          </div>
        </div>
      </div>

      {/* EDITORIAL NAV */}
      <div className="max-w-[1280px] mx-auto px-6 mt-8 md:mt-10">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide border-b border-black/5 pb-0">
          {[
            { id: "about", label: "ABOUT US" },
            { id: "story", label: "OUR STORY" },
            { id: "why", label: "WHY CHOOSE US" },
            { id: "stay", label: "STAY & FACILITIES" },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`whitespace-nowrap px-5 py-3 text-[11px] font-black tracking-widest border-b-2 transition-all ${activeTab===t.id? "border-black text-black" : "border-transparent text-black/30 hover:text-black/60"}`}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT GRID - LIKE WORLD'S BEST HOTEL PAGES */}
      <div className="max-w-[1280px] mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 md:gap-16 pb-24">

        {/* LEFT - EDITORIAL */}
        <div className="min-w-0">
          {activeTab==="about" && (
            <div className="animate-in fade-in">
              <p className="text-[11px] font-black tracking-[0.2em] text-black/30">ABOUT US — 01</p>
              <h2 className="mt-3 text-[28px] md:text-[44px] font-black leading-[0.95] tracking-[-0.03em]">Not a hotel.<br/>A home that<br/>happens to host.</h2>
              <div className="mt-6 text-[15px] leading-[1.7] text-black/70 font-medium whitespace-pre-wrap">{data.content?.aboutUs}</div>

              <div className="mt-10 grid grid-cols-3 gap-4">
                <div className="bg-[#F6F1E6] rounded-[18px] p-4">
                  <p className="text-[28px] font-black leading-none">{data.stayInfo?.rooms}+</p><p className="text-[10px] font-bold tracking-widest text-black/40 mt-2">ROOMS &<br/>SUITES</p>
                </div>
                <div className="bg-black text-white rounded-[18px] p-4">
                  <p className="text-[28px] font-black leading-none">2018</p><p className="text-[10px] font-bold tracking-widest text-white/50 mt-2">SINCE<br/>HOSTING</p>
                </div>
                <div className="bg-[#FFF7ED] border border-orange-100 rounded-[18px] p-4">
                  <p className="text-[28px] font-black leading-none">2K+</p><p className="text-[10px] font-bold tracking-widest text-black/40 mt-2">HAPPY<br/>GUESTS</p>
                </div>
              </div>
            </div>
          )}

          {activeTab==="story" && (
            <div className="animate-in fade-in">
              <p className="text-[11px] font-black tracking-[0.2em] text-black/30">OUR STORY — 02</p>
              <h2 className="mt-3 text-[28px] md:text-[44px] font-black leading-[0.95] tracking-[-0.03em]">Started with 2 rooms.<br/>Built with heart.</h2>
              <div className="mt-6 text-[15px] leading-[1.8] text-black/70 font-medium whitespace-pre-wrap font-serif italic">“{data.content?.ourStory}”</div>
              <div className="mt-8 p-5 rounded-[20px] bg-[#0A0A0A] text-white flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">❝</div>
                <div>
                  <p className="text-[13px] leading-relaxed text-white/80">Every guest is taught one thing on checkout — Siliguri is not a stopover, it's a feeling. Most of them come back.</p>
                  <p className="text-[11px] font-bold tracking-widest text-white/40 mt-3">— TANKA, FOUNDER</p>
                </div>
              </div>
            </div>
          )}

          {activeTab==="why" && (
            <div className="animate-in fade-in">
              <p className="text-[11px] font-black tracking-[0.2em] text-black/30">WHY CHOOSE US — 03</p>
              <h2 className="mt-3 text-[28px] md:text-[44px] font-black leading-[0.95] tracking-[-0.03em]">Why 500+ travelers<br/>choose us again<br/>and again.</h2>
              <div className="mt-8 flex flex-col gap-4">
                {data.content?.whyChooseUs?.split("\n").map((line: string, i: number) => (
                  <div key={i} className="group flex gap-4 p-4 rounded-[16px] border border-black/5 hover:border-black hover:bg-black hover:text-white transition-all">
                    <div className="w-8 h-8 rounded-full bg-[#F6F1E6] group-hover:bg-white/10 flex items-center justify-center font-black text-[12px] shrink-0">{i+1}</div>
                    <p className="text-[13px] font-bold leading-snug pt-1">{line.replace(/^\d+\.\s*/, "")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab==="stay" && (
            <div className="animate-in fade-in">
              <p className="text-[11px] font-black tracking-[0.2em] text-black/30">STAY & FACILITIES</p>
              <h2 className="mt-3 text-[28px] md:text-[44px] font-black leading-[0.95]">Everything you need.<br/>Nothing you don't.</h2>
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-2.5">
                {data.amenities?.map((a: string) => (
                  <div key={a} className="h-[56px] bg-[#F6F1E6] rounded-[14px] px-4 flex items-center gap-2 text-[12px] font-bold"><span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[12px]">✓</span>{a}</div>
                ))}
              </div>
              <div className="mt-6">
                <p className="text-[11px] font-black tracking-widest text-black/40">HOUSE RULES</p>
                <div className="mt-3 flex flex-wrap gap-2">{data.rules?.map((r: string) => <span key={r} className="px-3 py-1.5 rounded-full bg-black text-white text-[11px] font-bold">{r}</span>)}</div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT - BOOKING CARD - STICKY LIKE AIRBNB + HOTEL.COM COMBO */}
        <div className="lg:sticky lg:top-[88px] h-fit">
          <div className="rounded-[28px] border border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden">
            <div className="p-6">
              <div className="flex items-end justify-between">
                <div><p className="text-[11px] font-black tracking-widest text-black/30">STARTING FROM</p><p className="text-[32px] font-black leading-none mt-1">{data.stayInfo?.pricePerNight}<span className="text-[14px] font-bold text-black/40"> / night</span></p></div>
                <div className="text-right"><p className="text-[11px] font-bold bg-[#FFF7ED] border border-orange-100 px-2.5 py-1 rounded-full">★ {data.rating} • 127 REVIEWS</p><p className="text-[10px] text-black/40 mt-1 font-bold">{data.stayInfo?.checkIn} - {data.stayInfo?.checkOut}</p></div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2">
                <div className="h-[56px] rounded-[14px] border bg-[#FFFEFB] px-3 flex flex-col justify-center"><p className="text-[10px] font-black tracking-widest text-black/40">CHECK-IN</p><p className="text-[13px] font-bold mt-0.5">{data.stayInfo?.checkIn}</p></div>
                <div className="h-[56px] rounded-[14px] border bg-[#FFFEFB] px-3 flex flex-col justify-center"><p className="text-[10px] font-black tracking-widest text-black/40">CHECK-OUT</p><p className="text-[13px] font-bold mt-0.5">{data.stayInfo?.checkOut}</p></div>
              </div>

              <div className="mt-3 h-[56px] rounded-[14px] border bg-[#FFFEFB] px-3 flex items-center justify-between">
                <div><p className="text-[10px] font-black tracking-widest text-black/40">GUESTS</p><p className="text-[13px] font-bold mt-0.5">2 Guests • 1 Room</p></div><div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-[10px]">▼</div>
              </div>

              <button className="mt-5 w-full h-[56px] rounded-full bg-black text-white font-black tracking-widest text-[12px] hover:bg-[#1A1A1A] transition-all flex items-center justify-center gap-2">CHECK AVAILABILITY — WHATSAPP ↗</button>
              <button className="mt-2.5 w-full h-[50px] rounded-full bg-[#F6F1E6] border border-black/5 font-bold text-[11px] tracking-widest">CALL {data.contact?.phone} TO BOOK</button>

              <div className="mt-6 pt-6 border-t border-black/5">
                <p className="text-[11px] font-black tracking-widest">HOSTED BY</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-black text-[16px]">{logoChar}</div>
                  <div className="leading-tight"><p className="text-[14px] font-black">Tanka • Superhost</p><p className="text-[11px] text-black/50 font-medium">@{username} • Responds in 5 mins • Speaks {data.languages?.join(", ")}</p></div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-[#F6F1E6] rounded-[12px] p-3"><p className="font-black">📍 {data.location?.city}</p><p className="text-black/50 mt-1 leading-snug">{data.location?.address}</p></div>
                  <div className="bg-[#F6F1E6] rounded-[12px] p-3"><p className="font-black">🛡️ Safe Stay</p><p className="text-black/50 mt-1 leading-snug">CCTV • ID Verified • Family Safe</p></div>
                </div>
              </div>
            </div>

            <div className="bg-[#0A0A0A] text-white px-6 py-4 flex items-center justify-between">
              <p className="text-[11px] font-bold tracking-widest text-white/60">SHARE THIS PROFILE</p>
              <div className="flex gap-2"><div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[12px]">⧉</div><div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[12px]">♡</div></div>
            </div>
          </div>

          <p className="mt-4 text-center text-[10px] font-bold tracking-widest text-black/20">WORLD-CLASS DESIGN • DRISYAMN HOTELS • © 2026</p>
        </div>
      </div>
    </div>
  );
}