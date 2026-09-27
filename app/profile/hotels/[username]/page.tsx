"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const BG_MAIN = "#FFFEFB";
const BG_SOFT = "#F6F1E6";
const DARK_GREEN = "#0F4C3A"; // dark green
const DARK_GREEN_HOVER = "#0A3326";

export default function HotelProfileSettled() {
  const params = useParams() as { username: string };
  const router = useRouter();
  const username = params?.username || "sobha_7704";
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("photos");
  const [coverIndex, setCoverIndex] = useState(0);
  const [isOwner, setIsOwner] = useState(true); // check logic later

  useEffect(() => {
    const saved = localStorage.getItem(`drisyamn_hotel_profile_${username}`);
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      setData({
        businessName: "Sobha Hotel & Homestay",
        tagline: "A calm, clean and family-friendly stay in the heart of Siliguri.",
        location: { address: "Sevoke Road, Near City Center", city: "Siliguri", landmark: "City Center", pincode: "734001" },
        contact: { phone: "9876543210", whatsapp: "9876543210" },
        stayInfo: { pricePerNight: "₹ 1,499", rooms: "8", checkIn: "12 PM", checkOut: "11 AM", guests: "2 Guests" },
        content: {
          aboutUs: "We are a small family-run stay. Our rooms are clean, well-ventilated and perfect for families, couples and solo travellers. We serve home-cooked food and provide 24/7 support.",
          ourStory: "We started in 2018 with just two rooms. Our first guest said 'this feels like home' and that became our promise. Since then we have hosted 500+ guests from across India.",
        },
        amenities: ["Free WiFi", "Parking", "AC Rooms", "Restaurant", "Room Service", "Hot Water", "CCTV", "Kitchen Access", "Laundry"],
        media: {
          stories: [
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
          ],
        },
        rating: 4.9,
        totalReviews: 527,
        languages: ["Hindi", "English", "Bengali", "Nepali"],
      });
    }
    // owner check - if you want only owner can see edit
    const loggedUser = localStorage.getItem("drisyamn_current_user");
    if (loggedUser === username) setIsOwner(true);
  }, [username]);

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: BG_MAIN, fontFamily: "Inter, Segoe UI, Helvetica Neue, sans-serif" }}>Loading...</div>;
  }

  const covers = [
    data.media?.banner || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1551882547-b79c1141d0f0?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b597?w=1400&auto=format&fit=crop&q=80",
  ];

  const allPhotos = [...covers,...(data.media?.stories || [])];
  const logoChar = data.businessName?.charAt(0)?.toUpperCase() || "S";

  const handleWhatsApp = () => {
    const num = (data.contact?.whatsapp || "").replace(/\D/g, "");
    const msg = `Hi ${data.businessName}, I saw your profile on Drisyamn. Is room available? @${username}`;
    window.open(`https://wa.me/91${num}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen text-[#1a1a1a]" style={{ background: BG_MAIN, fontFamily: "'Inter','Segoe UI','Helvetica Neue',system-ui,sans-serif", fontWeight: 400, letterSpacing: "-0.01em" }}>

      {/* NAV BAR - SETTLED */}
      <div className="sticky top-0 z-50 bg-white border-b border-black/[0.06]">
        <div className="max-w-[1180px] mx-auto px-5 h-[64px] flex items-center justify-between">
          {/* left */}
          <div className="flex items-center gap-5">
            <Link href="/homefeed" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[13px]">{logoChar}</div>
              <div className="leading-none">
                <p className="text-[14px] tracking-tight" style={{ fontWeight: 600 }}>Drisyamn</p>
                <p className="text-[11px] text-black/50 mt-[2px]" style={{ fontWeight: 400 }}>Discover Everything Around You</p>
              </div>
            </Link>
          </div>

          {/* right */}
          <div className="flex items-center gap-6">
            <Link href="/homefeed" className="hidden md:block text-[13px] text-black/70 hover:text-black" style={{ fontWeight: 400 }}>Home</Link>
            <Link href="/bookings" className="hidden md:block text-[13px] text-black/70 hover:text-black" style={{ fontWeight: 400 }}>Books</Link>
            <Link href="/messages" className="hidden md:block text-[13px] text-black/70 hover:text-black" style={{ fontWeight: 400 }}>Message</Link>
            <Link href="/notifications" className="hidden md:block text-[13px] text-black/70 hover:text-black" style={{ fontWeight: 400 }}>Notifications</Link>

            {isOwner && (
              <Link href={`/profile/hotels/${username}/edit`} className="h-8 px-4 rounded-full bg-white border border-black/10 text-[12px] flex items-center justify-center hover:bg-black/[0.03] transition" style={{ fontWeight: 500 }}>
                Edit
              </Link>
            )}
            <Link href="/our-hotels" className="h-8 px-4 rounded-full bg-[#0F4C3A] text-white text-[12px] flex items-center justify-center hover:bg-[#0A3326] transition" style={{ fontWeight: 500 }}>
              Our Hotels
            </Link>
          </div>
        </div>
      </div>

      {/* PAGE WRAPPER - CENTERED & SETTLED */}
      <div className="max-w-[1180px] mx-auto px-5 mt-6">

        {/* COVER - CLEAN SINGLE CARD */}
        <div className="relative rounded-[24px] overflow-hidden bg-white border border-black/[0.06]">
          <div className="relative h-[380px] md:h-[480px] bg-[#EDE6D3]">
            <img src={covers[coverIndex]} alt="cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            {/* cover dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 backdrop-blur-md px-3 py-2 rounded-full">
              {covers.map((_:any,i:number)=>(
                <button key={i} onClick={()=>setCoverIndex(i)} className={`h-1.5 rounded-full transition-all ${i===coverIndex? "w-6 bg-white" : "w-3 bg-white/40"}`} />
              ))}
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <h1 className="text-white text-[24px] md:text-[32px] leading-[1.1]" style={{ fontWeight: 600 }}>{data.businessName}</h1>
                <p className="text-white/80 text-[13px] mt-1.5 max-w-[460px]" style={{ fontWeight: 400 }}>{data.location?.city} • {data.stayInfo?.rooms} rooms • {data.stayInfo?.pricePerNight}/night</p>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <button onClick={()=>setCoverIndex((coverIndex-1+covers.length)%covers.length)} className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center">‹</button>
                <button onClick={()=>setCoverIndex((coverIndex+1)%covers.length)} className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center">›</button>
              </div>
            </div>
          </div>

          {/* cover thumbnails */}
          <div className="flex gap-2 p-3 bg-white">
            {covers.map((c:string,i:number)=>(
              <button key={i} onClick={()=>setCoverIndex(i)} className={`w-[72px] h-[52px] rounded-[10px] overflow-hidden border ${i===coverIndex? "border-black" : "border-black/5"} shrink-0`}>
                <img src={c} className="w-full h-full object-cover" />
              </button>
            ))}
            <div className="ml-auto flex items-center text-[11px] text-black/40 pr-2" style={{ fontWeight: 400 }}>{covers.length} cover pics</div>
          </div>
        </div>

        {/* MAIN CONTENT - 2 COL GRID SETTLED */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.2fr_360px] gap-8 items-start pb-20">

          {/* LEFT */}
          <div className="min-w-0">

            {/* PROFILE HEADER */}
            <div className="bg-white border border-black/[0.06] rounded-[20px] p-6 flex gap-4">
              <div className="w-14 h-14 rounded-full bg-[#0F4C3A] text-white flex items-center justify-center text-[18px]" style={{ fontWeight: 600 }}>{logoChar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[17px]" style={{ fontWeight: 600 }}>{data.businessName}</p>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#E6F4EA] text-[#0F4C3A]">Verified</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/[0.04] text-black/60">★ {data.rating} • {data.totalReviews} reviews</span>
                </div>
                <p className="text-[13px] text-black/60 mt-2 leading-[1.5]" style={{ fontWeight: 400 }}>{data.tagline}</p>
                <p className="text-[12px] text-black/40 mt-2" style={{ fontWeight: 400 }}>{data.location?.address}, {data.location?.city}</p>
              </div>
            </div>

            {/* TABS */}
            <div className="mt-6 bg-white border border-black/[0.06] rounded-[16px] p-1.5 flex gap-1 w-fit">
              {[
                { id: "about", label: "About" },
                { id: "photos", label: "Photos" },
                { id: "videos", label: "Videos" },
                { id: "reviews", label: "Reviews" },
              ].map(t=>(
                <button key={t.id} onClick={()=>setActiveTab(t.id)} className={`px-5 h-8 rounded-full text-[13px] transition ${activeTab===t.id? "bg-[#0F4C3A] text-white" : "text-black/60 hover:bg-black/[0.04]"}`} style={{ fontWeight: activeTab===t.id? 500 : 400 }}>{t.label}</button>
              ))}
            </div>

            {/* TAB CONTENTS */}
            <div className="mt-6">
              {activeTab==="about" && (
                <div className="space-y-6">
                  <div className="bg-white border border-black/[0.06] rounded-[20px] p-6">
                    <p className="text-[13px] text-black/40" style={{ fontWeight: 400 }}>About us</p>
                    <p className="text-[14px] leading-[1.7] text-black/80 mt-3 whitespace-pre-wrap" style={{ fontWeight: 400 }}>{data.content?.aboutUs}</p>
                  </div>
                  <div className="bg-white border border-black/[0.06] rounded-[20px] p-6">
                    <p className="text-[13px] text-black/40" style={{ fontWeight: 400 }}>Amenities</p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {data.amenities?.map((a:string)=>(
                        <div key={a} className="h-10 rounded-full bg-[#F6F1E6] px-4 flex items-center text-[12px] text-black/70" style={{ fontWeight: 400 }}>{a}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab==="photos" && (
                <div className="bg-white border border-black/[0.06] rounded-[20px] p-4">
                  <div className="flex items-center justify-between px-2 pb-3">
                    <p className="text-[13px] text-black/40" style={{ fontWeight: 400 }}>{allPhotos.length} photos</p>
                    <p className="text-[12px] text-black/40">Swipe to see</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {allPhotos.map((img:string,i:number)=>(
                      <div key={i} className="h-[160px] rounded-[14px] overflow-hidden bg-[#F6F1E6]"><img src={img} className="w-full h-full object-cover hover:scale-[1.03] transition duration-500" /></div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab==="videos" && (
                <div className="bg-white border border-black/[0.06] rounded-[20px] p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[0,1].map(i=>(
                    <div key={i} className="relative h-[280px] rounded-[14px] overflow-hidden bg-black">
                      <img src={covers[i]} className="w-full h-full object-cover opacity-70" />
                      <div className="absolute inset-0 flex items-center justify-center"><div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">▶</div></div>
                      <div className="absolute bottom-3 left-3 text-white text-[12px] bg-black/50 px-3 py-1 rounded-full">Room tour {i+1}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab==="reviews" && (
                <div className="space-y-3">
                  {[
                    { n: "Rahul, Delhi", t: "Very clean and peaceful. Owner helped with local sightseeing. Food was homely." },
                    { n: "Anjali Family", t: "Safe for family and kids. Rooms are spacious. Will visit again." },
                    { n: "Arjun, Kolkata", t: "Best budget stay near city center. WhatsApp booking was easy." },
                  ].map((r,i)=>(
                    <div key={i} className="bg-white border border-black/[0.06] rounded-[20px] p-5">
                      <p className="text-[13px]" style={{ fontWeight: 500 }}>{r.n}</p>
                      <p className="text-[13px] text-black/60 mt-2 leading-[1.6]" style={{ fontWeight: 400 }}>{r.t}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - BOOKING CARD SETTLED */}
          <div className="lg:sticky lg:top-[88px]">
            <div className="bg-white border border-black/[0.06] rounded-[24px] p-6">
              <p className="text-[12px] text-black/40" style={{ fontWeight: 400 }}>Price per night</p>
              <p className="text-[26px] mt-1" style={{ fontWeight: 600 }}>{data.stayInfo?.pricePerNight} <span className="text-[13px] text-black/40" style={{ fontWeight: 400 }}>/ night</span></p>

              <div className="mt-5 bg-[#F6F1E6] rounded-[14px] p-4 flex justify-between text-[12px]" style={{ fontWeight: 400 }}>
                <span className="text-black/50">Check-in</span><span>{data.stayInfo?.checkIn}</span>
              </div>
              <div className="mt-2 bg-[#F6F1E6] rounded-[14px] p-4 flex justify-between text-[12px]" style={{ fontWeight: 400 }}>
                <span className="text-black/50">Check-out</span><span>{data.stayInfo?.checkOut}</span>
              </div>

              <button onClick={handleWhatsApp} className="mt-6 w-full h-[48px] rounded-full bg-[#0F4C3A] text-white text-[13px] hover:bg-[#0A3326] transition flex items-center justify-center gap-2" style={{ fontWeight: 500 }}>
                Book on WhatsApp
              </button>
              <button onClick={()=> window.location.href=`tel:${data.contact?.phone}`} className="mt-3 w-full h-[48px] rounded-full bg-[#E6F4EA] text-[#0F4C3A] text-[13px] hover:bg-[#D0E9D6] transition" style={{ fontWeight: 500 }}>
                Call host
              </button>
              <button onClick={()=> router.push("/our-hotels")} className="mt-3 w-full h-[44px] rounded-full bg-white border border-black/10 text-[13px] hover:bg-black/[0.03] transition" style={{ fontWeight: 400 }}>
                View all hotels
              </button>

              <div className="mt-6 pt-6 border-t border-black/[0.06] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-[14px]" style={{ fontWeight: 500 }}>{logoChar}</div>
                <div className="leading-tight">
                  <p className="text-[13px]" style={{ fontWeight: 500 }}>Hosted by {data.businessName?.split(" ")[0]}</p>
                  <p className="text-[11px] text-black/50 mt-0.5" style={{ fontWeight: 400 }}>@{username} • Usually replies in 5 mins</p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-[11px] text-black/30" style={{ fontWeight: 400 }}>Drisyamn • Discover Everything Around You</p>
          </div>
        </div>
      </div>
    </div>
  );
}