"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// BRAND COLORS
const CREAM = "#FFFEFB";
const CREAM_DARK = "#EDE6D3";
const GREEN = "#25D366";
const GREEN_DARK = "#128C7E";
const BLACK = "#111111";

export default function HotelProfileFinalComplete() {
  const params = useParams() as { username: string };
  const router = useRouter();
  const username = params?.username || "sobha_7704";
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("about");
  const [coverIndex, setCoverIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const galleryRef = useRef<HTMLDivElement>(null);

  // LOAD DATA
  useEffect(() => {
    const saved = localStorage.getItem(`drisyamn_hotel_profile_${username}`);
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      // fallback demo data so page never breaks
      setData({
        businessName: "Sobha Hotel & Homestay",
        tagline: "A home in the heart of Siliguri, not just a hotel.",
        category: "Hotel & Homestay",
        location: { address: "Sevoke Road, Near City Center, Siliguri", city: "Siliguri", landmark: "City Center", pincode: "734001" },
        contact: { phone: "9876543210", whatsapp: "9876543210", email: "sobha@example.com" },
        stayInfo: { pricePerNight: "₹ 1,499", rooms: "8", checkIn: "12 PM", checkOut: "11 AM", guests: "2 Guests" },
        content: {
          aboutUs: "We are a family-run boutique homestay in Siliguri serving guests since 2018. Clean rooms, home-cooked food and warm hospitality is what we promise. Located 2 mins from bus terminus, we host solo travelers, families and couples with full safety.",
          ourStory: "Started with 2 rooms in 2018. First guest was a backpacker from Germany. He said 'This feels like home'. That became our philosophy. Today we have 8 rooms and 500+ happy guests.",
          whyChooseUs: "1. 2 mins walk from Bus Terminus\n2. Home-cooked food included\n3. 24/7 WiFi & hot water\n4. 500+ 5-star reviews on Google\n5. Family & couple safe, CCTV secured\n6. Owner stays on property 24/7"
        },
        amenities: ["Free WiFi", "Parking", "AC Rooms", "Restaurant", "Room Service", "Hot Water", "Power Backup", "CCTV", "Kitchen Access", "Laundry", "Airport Pickup", "Bonfire"],
        rules: ["Family Only / Couples with ID", "Govt ID Required at Check-in", "No Smoking Inside Rooms", "Check-in 12 PM - Check-out 11 AM", "Outside Food Not Allowed"],
        languages: ["Hindi", "English", "Bengali", "Nepali", "Bhojpuri"],
        media: {
          banner: null,
          logo: null,
          stories: [
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"
          ],
          videos: [
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"
          ]
        },
        rating: 4.9,
        totalReviews: 527,
        hostName: "Sobha",
      });
    }
  }, [username]);

  // AUTO SLIDE COVER
  useEffect(() => {
    const interval = setInterval(() => {
      setCoverIndex((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFEFB]" style={{ fontFamily: "'Helvetica Neue', 'Segoe UI', Inter, sans-serif" }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-black mx-auto animate-pulse">D</div>
          <p className="mt-4 font-black tracking-widest text-[11px]">LOADING HOTEL...</p>
        </div>
      </div>
    );
  }

  const banners = [
    data.media?.banner || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1551882547-b79c1141d0f0?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b597?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1400&auto=format&fit=crop&q=80",
  ];

  const logoChar = data.businessName?.charAt(0)?.toUpperCase() || "S";
  const allPhotos = [...banners,...(data.media?.stories || [])];

  const handleWhatsApp = () => {
    const num = (data.contact?.whatsapp || "").replace(/\D/g, "");
    const msg = `Hi ${data.businessName}, I found you on Drisyamn /our-hotels. Is room available? Check-in: ${bookingDate || "Today"} - @${username}`;
    window.open(`https://wa.me/91${num}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleCall = () => {
    window.location.href = `tel:${data.contact?.phone}`;
  };

  return (
    <div className="min-h-screen text-black selection:bg-[#25D366] selection:text-white" style={{ background: CREAM, fontFamily: "'Helvetica Neue','Segoe UI',Inter,-apple-system,BlinkMacSystemFont,sans-serif" }}>

      {/* ==================== NAV BAR - DRISYAMN + HOME BOOKS MESSAGE NOTIFICATIONS ==================== */}
      <div className="sticky top-0 z-[100] bg-white/95 backdrop-blur-xl border-b border-black/10">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 h-[68px] flex items-center justify-between gap-4">
          {/* LEFT */}
          <Link href="/homefeed" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-black text-[15px]">{logoChar}</div>
            <div className="leading-none hidden md:block">
              <p className="font-black tracking-tight text-[14px]">{data.businessName}</p>
              <p className="text-[10px] font-bold tracking-widest text-black/50 mt-0.5 uppercase">{data.location?.city} • {data.category}</p>
            </div>
          </Link>

          {/* CENTER - DRISYAMN TAGLINE */}
          <div className="hidden lg:flex items-center gap-3 border-l border-black/10 pl-6 ml-2">
            <div className="w-9 h-9 rounded-full bg-[#EDE6D3] flex items-center justify-center font-black text-[12px]">D</div>
            <div className="leading-none">
              <p className="font-black tracking-[0.18em] text-[12px]">DRISYAMN</p>
              <p className="text-[9px] font-bold tracking-[0.2em] text-black/50 mt-1">SILIGURI KI AAWAAZ • सच्ची कहानियां</p>
            </div>
          </div>

          {/* RIGHT - ROUTES */}
          <div className="flex items-center gap-2 md:gap-6">
            <Link href="/homefeed" className="hidden md:block text-[11px] font-black tracking-widest hover:text-black/60 transition">HOME</Link>
            <Link href="/bookings" className="hidden md:block text-[11px] font-black tracking-widest hover:text-black/60 transition">BOOKS</Link>
            <Link href="/messages" className="hidden md:block text-[11px] font-black tracking-widest hover:text-black/60 transition">MESSAGE</Link>
            <Link href="/notifications" className="hidden md:block text-[11px] font-black tracking-widest hover:text-black/60 transition">NOTIFICATIONS</Link>
            <Link href="/our-hotels" className="bg-black text-white px-4 md:px-5 py-2.5 rounded-full text-[10px] md:text-[11px] font-black tracking-widest hover:bg-black/80 transition">OUR HOTELS</Link>
          </div>
        </div>
      </div>

      {/* ==================== COVER PICS GALLERY ==================== */}
      <div className="max-w-[1320px] mx-auto px-3 md:px-8 mt-3 md:mt-6">
        <div className="relative h-[58vh] md:h-[72vh] rounded-[20px] md:rounded-[32px] overflow-hidden bg-[#EDE6D3] border border-black/10 group">
          <div ref={galleryRef} className="w-full h-full relative">
            <img src={banners[coverIndex]} alt="cover" className="w-full h-full object-cover transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          </div>

          {/* ARROWS */}
          <button onClick={() => setCoverIndex((coverIndex - 1 + banners.length) % banners.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center font-bold hover:bg-white transition">‹</button>
          <button onClick={() => setCoverIndex((coverIndex + 1) % banners.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center font-bold hover:bg-white transition">›</button>

          {/* DOTS */}
          <div className="absolute bottom-24 md:bottom-28 left-6 md:left-10 flex gap-2">
            {banners.map((_, i) => (
              <button key={i} onClick={() => setCoverIndex(i)} className={`transition-all h-1.5 rounded-full ${i === coverIndex? "w-8 bg-white" : "w-4 bg-white/40"}`} />
            ))}
          </div>

          {/* CONTENT OVERLAY */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-[680px]">
              <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest mb-4">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span> LIVE • {data.stayInfo?.rooms} ROOMS • {data.totalReviews} REVIEWS
              </div>
              <h1 className="text-white text-[32px] md:text-[64px] font-black leading-[0.9] tracking-[-0.03em]">{data.businessName}</h1>
              <p className="text-white/80 text-[13px] md:text-[16px] font-medium leading-snug mt-3 max-w-[520px]">{data.tagline}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="bg-white text-black px-3.5 py-2 rounded-full text-[11px] font-bold">📍 {data.location?.address}</span>
                <span className="bg-black/60 backdrop-blur text-white border border-white/20 px-3.5 py-2 rounded-full text-[11px] font-bold">★ {data.rating} • VERIFIED BY DRISYAMN</span>
              </div>
            </div>
          </div>

          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur text-white px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest">
            {coverIndex + 1} / {banners.length} COVER PICS
          </div>
        </div>

        {/* THUMBNAIL STRIP */}
        <div className="mt-3 flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {banners.map((b, i) => (
            <button key={i} onClick={() => setCoverIndex(i)} className={`shrink-0 w-[88px] h-[64px] rounded-[12px] overflow-hidden border-2 transition ${i === coverIndex? "border-black" : "border-transparent opacity-70"}`}>
              <img src={b} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* ==================== TABS ==================== */}
      <div className="max-w-[1320px] mx-auto px-6 md:px-8 mt-8 sticky top-[68px] z-40 bg-[#FFFEFB]/95 backdrop-blur-xl border-b border-black/10">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {[
            { id: "about", label: "ABOUT US" },
            { id: "story", label: "OUR STORY" },
            { id: "why", label: "WHY CHOOSE US" },
            { id: "photos", label: `PHOTOS (${allPhotos.length})` },
            { id: "videos", label: "VIDEOS" },
            { id: "reviews", label: `REVIEWS (${data.totalReviews})` },
            { id: "facilities", label: "FACILITIES" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`whitespace-nowrap px-5 py-4 text-[11px] font-black tracking-widest border-b-2 transition-all ${activeTab === t.id? "border-black text-black" : "border-transparent text-black/40 hover:text-black/70"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ==================== MAIN GRID ==================== */}
      <div className="max-w-[1320px] mx-auto px-6 md:px-8 mt-10 grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-10 md:gap-14 pb-24">

        {/* LEFT CONTENT */}
        <div className="min-w-0">
          {activeTab === "about" && (
            <div className="animate-in">
              <p className="text-[11px] font-black tracking-[0.2em] text-black/30">ABOUT US — 01</p>
              <h2 className="mt-4 text-[30px] md:text-[48px] font-black leading-[0.95] tracking-[-0.03em]">Not a hotel.<br />A home that<br />happens to host.</h2>
              <div className="mt-8 text-[15px] leading-[1.8] text-black/70 font-medium whitespace-pre-wrap bg-white border border-black/10 rounded-[20px] p-6 md:p-8">{data.content?.aboutUs}</div>
              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="bg-[#EDE6D3] rounded-[16px] p-4 text-center"><p className="text-[22px] font-black">{data.rating}</p><p className="text-[10px] font-black tracking-widest text-black/50">RATING</p></div>
                <div className="bg-[#EDE6D3] rounded-[16px] p-4 text-center"><p className="text-[22px] font-black">{data.totalReviews}+</p><p className="text-[10px] font-black tracking-widest text-black/50">REVIEWS</p></div>
                <div className="bg-[#EDE6D3] rounded-[16px] p-4 text-center"><p className="text-[22px] font-black">{data.stayInfo?.rooms}</p><p className="text-[10px] font-black tracking-widest text-black/50">ROOMS</p></div>
              </div>
            </div>
          )}

          {activeTab === "story" && (
            <div>
              <p className="text-[11px] font-black tracking-[0.2em] text-black/30">OUR STORY — 02</p>
              <h2 className="mt-4 text-[30px] md:text-[48px] font-black leading-[0.95]">Started with 2 rooms.<br />Built with heart.</h2>
              <div className="mt-8 text-[16px] leading-[1.9] text-black/70 font-medium whitespace-pre-wrap italic bg-white border border-black/10 rounded-[20px] p-8">“{data.content?.ourStory}”</div>
            </div>
          )}

          {activeTab === "why" && (
            <div>
              <p className="text-[11px] font-black tracking-[0.2em] text-black/30">WHY CHOOSE US — 03</p>
              <h2 className="mt-4 text-[30px] md:text-[48px] font-black leading-[0.95]">Why travelers<br />choose us again<br />and again.</h2>
              <div className="mt-8 flex flex-col gap-3">
                {data.content?.whyChooseUs?.split("\n").map((line: string, i: number) => (
                  <div key={i} className="flex gap-4 p-5 rounded-[16px] border border-black/10 bg-white hover:bg-[#EDE6D3]/50 transition">
                    <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-black text-[12px] shrink-0">{i + 1}</div>
                    <p className="text-[13px] font-bold leading-snug pt-1.5">{line.replace(/^\d+\.\s*/, "")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "photos" && (
            <div>
              <div className="flex items-center justify-between"><h2 className="text-[24px] font-black">All Photos</h2><button onClick={() => setShowAllPhotos(!showAllPhotos)} className="text-[11px] font-black tracking-widest underline">{showAllPhotos? "SHOW LESS" : "SHOW ALL"}</button></div>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                {(showAllPhotos? allPhotos : allPhotos.slice(0, 9)).map((img: string, i: number) => (
                  <div key={i} className="group h-[200px] rounded-[16px] overflow-hidden bg-[#EDE6D3] border border-black/10"><img src={img} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /></div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "videos" && (
            <div>
              <h2 className="text-[24px] font-black">Videos & Reels</h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0, 1].map((i) => (
                  <div key={i} className="relative h-[360px] rounded-[20px] overflow-hidden bg-black border border-black/10 flex items-center justify-center group cursor-pointer">
                    <img src={data.media?.videos?.[i] || banners[i]} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition" />
                    <div className="relative z-10 w-16 h-16 rounded-full bg-white flex items-center justify-center font-black text-[20px]">▶</div>
                    <p className="absolute bottom-4 left-4 text-white font-black text-[12px] tracking-widest bg-black/50 px-3 py-1 rounded-full">{i === 0? "ROOM TOUR • 0:45" : "PROPERTY REEL • 0:30"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h2 className="text-[24px] font-black">Guest Reviews • {data.totalReviews}+</h2>
              <div className="mt-6 space-y-3">
                {[
                  { name: "Rahul from Delhi", text: "Super clean, home food was amazing. Owner is very helpful. Will come again. Best in Siliguri budget.", rating: 5 },
                  { name: "Anjali & Family", text: "Family safe, kids loved it. Bonfire at night was special. Thank you Sobha didi.", rating: 5 },
                  { name: "Backpacker from Germany", text: "This feels like home. Not a hotel. Perfect location near station.", rating: 5 },
                  { name: "Pritam from Kolkata", text: "Value for money. AC worked, hot water 24/7. WhatsApp booking was smooth.", rating: 4 },
                ].map((r, i) => (
                  <div key={i} className="p-5 rounded-[16px] bg-white border border-black/10">
                    <div className="flex items-center justify-between"><p className="text-[13px] font-black">{r.name}</p><p className="text-[11px] font-black bg-[#EDE6D3] px-2 py-1 rounded-full">★ {r.rating}.0</p></div>
                    <p className="text-[13px] text-black/60 mt-2 leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "facilities" && (
            <div>
              <h2 className="text-[24px] font-black">Stay & Facilities</h2>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-2.5">
                {data.amenities?.map((a: string) => (
                  <div key={a} className="h-[56px] bg-white border border-black/10 rounded-[14px] px-4 flex items-center gap-2 text-[12px] font-bold hover:bg-[#EDE6D3] transition">{a}</div>
                ))}
              </div>
              <h3 className="mt-10 text-[16px] font-black">House Rules</h3>
              <div className="mt-3 space-y-2">{data.rules?.map((r: string) => (<div key={r} className="text-[12px] font-medium bg-white border border-black/10 rounded-full px-4 py-2.5 inline-block mr-2 mb-2">• {r}</div>))}</div>
              <h3 className="mt-10 text-[16px] font-black">Languages Spoken</h3>
              <div className="mt-3 flex flex-wrap gap-2">{data.languages?.map((l: string) => (<span key={l} className="text-[11px] font-black tracking-widest bg-black text-white px-3 py-2 rounded-full">{l.toUpperCase()}</span>))}</div>
            </div>
          )}
        </div>

        {/* RIGHT - BOOKING CARD - GREEN BUTTONS */}
        <div className="lg:sticky lg:top-[88px] h-fit">
          <div className="rounded-[28px] border border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="p-7">
              <div className="flex items-end justify-between">
                <div><p className="text-[11px] font-black tracking-widest text-black/40">STARTING FROM</p><p className="text-[36px] font-black leading-none mt-1">{data.stayInfo?.pricePerNight}<span className="text-[14px] font-bold text-black/40"> / night</span></p></div>
                <div className="text-right"><p className="text-[11px] font-black bg-black text-white px-3 py-1.5 rounded-full">★ {data.rating} • VERIFIED</p><p className="text-[10px] font-bold text-black/40 mt-1">{data.totalReviews} reviews</p></div>
              </div>

              <div className="mt-6 bg-[#FFFEFB] border border-black/10 rounded-[16px] p-4">
                <p className="text-[11px] font-black tracking-widest text-black/40">CHECK-IN DATE</p>
                <input type="date" value={bookingDate} onChange={e=>setBookingDate(e.target.value)} className="mt-2 w-full h-[44px] px-4 rounded-full bg-white border border-black/10 text-[13px] font-bold outline-none" />
                <div className="mt-3 flex gap-2 text-[11px] font-bold text-black/60"><span>✓ {data.stayInfo?.checkIn} Check-in</span><span>•</span><span>{data.stayInfo?.checkOut} Check-out</span></div>
              </div>

              {/* GREEN BUTTONS */}
              <button onClick={handleWhatsApp} className="mt-6 w-full h-[56px] rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black tracking-widest text-[12px] transition flex items-center justify-center gap-2">
                <span>BOOK ON WHATSAPP</span><span>↗</span>
              </button>
              <button onClick={handleCall} className="mt-3 w-full h-[52px] rounded-full bg-[#128C7E] hover:bg-[#0E6F62] text-white font-black tracking-widest text-[11px] transition">
                CALL NOW — {data.contact?.phone}
              </button>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link href="/our-hotels" className="h-[44px] rounded-full bg-[#EDE6D3] flex items-center justify-center font-black text-[10px] tracking-widest hover:bg-[#DDD5C0] transition">← OUR HOTELS</Link>
                <Link href="/messages" className="h-[44px] rounded-full bg-black text-white flex items-center justify-center font-black text-[10px] tracking-widest hover:bg-black/80 transition">MESSAGE HOST</Link>
              </div>

              <div className="mt-7 pt-6 border-t border-black/10">
                <p className="text-[11px] font-black tracking-widest text-black/40">HOSTED BY</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-black text-[16px]">{logoChar}</div>
                  <div className="leading-tight"><p className="text-[14px] font-black">{data.hostName || data.businessName} • Superhost</p><p className="text-[11px] text-black/50 font-medium">@{username} • Responds in 5 mins • Speaks {data.languages?.[0]}</p></div>
                  <div className="ml-auto w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                </div>
              </div>

              <div className="mt-6 p-4 rounded-[14px] bg-[#FFFEFB] border border-dashed border-black/15">
                <p className="text-[10px] font-black tracking-widest text-black/40">LOCATION</p>
                <p className="text-[12px] font-bold mt-1">{data.location?.address}, {data.location?.landmark}, {data.location?.city} - {data.location?.pincode}</p>
                <button onClick={()=> window.open(`https://maps.google.com/?q=${encodeURIComponent(data.location?.address + " " + data.location?.city)}`)} className="mt-3 w-full h-[40px] rounded-full bg-white border border-black/10 font-black text-[10px] tracking-widest">OPEN IN GOOGLE MAPS ↗</button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest text-black/30">
            <span>DRISYAMN</span><span>•</span><span>SECURE BOOKING</span><span>•</span><span>© 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}