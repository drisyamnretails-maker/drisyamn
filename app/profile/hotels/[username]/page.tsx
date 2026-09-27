"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const DARK_GREEN = "#0F4C3A";
const DARK_GREEN_HOVER = "#0A3326";
const BG_MAIN = "#FFFEFB";
const BG_SOFT = "#F6F1E6";
const CARD_SHADOW = "0 12px 32px rgba(0,0,0,0.07), 0 1.5px 4px rgba(0,0,0,0.05)";

export default function HotelProfileFinal650() {
  const params = useParams() as { username: string };
  const router = useRouter();
  const username = params?.username || "sobha_7704";
  const [data, setData] = useState<any>(null);
  const [coverIndex, setCoverIndex] = useState(0);
  const [activeInfoTab, setActiveInfoTab] = useState("photos");
  const [showBooks, setShowBooks] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [msgInput, setMsgInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "guest", text: "Hi! Room available hai kal ke liye?", time: "10:32 AM" },
    { from: "host", text: "Haan available hai. 2 guests?", time: "10:33 AM" },
    { from: "guest", text: "Haan 2 guests, price kya hai?", time: "10:34 AM" },
  ]);

  useEffect(() => {
    const raw = localStorage.getItem(`drisyamn_hotel_profile_${username}`);
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch {
        setData(null);
      }
    }
    if (!raw) {
      setData({
        businessName: "Sobha Hotel & Homestay",
        tagline: "A calm, clean and family-friendly stay in the heart of Siliguri. Not just a hotel, a home.",
        category: "Hotel & Homestay",
        location: {
          address: "Sevoke Road, Near City Center",
          city: "Siliguri",
          landmark: "Near City Center Mall",
          pincode: "734001",
          full: "Sevoke Road, Near City Center, Siliguri - 734001",
        },
        contact: {
          phone: "9876543210",
          whatsapp: "9876543210",
          email: "sobha@example.com",
        },
        stayInfo: {
          pricePerNight: "₹ 1,499",
          rooms: "8",
          checkIn: "12 PM",
          checkOut: "11 AM",
          guests: "2 Guests",
          type: "Entire Place",
        },
        content: {
          aboutUs:
            "Welcome to Sobha Hotel & Homestay — a family-run boutique stay in Siliguri. We started with a simple idea: give every traveler a clean room, warm food, and honest hospitality. Located just 2 minutes from the main bus terminus and city center, we are perfect for families, couples with ID, and solo travelers. Owner stays on property, so help is always 2 mins away. Our rooms have attached bathroom, hot water 24/7, fast WiFi, and work desk. We also provide home-cooked meals on request at very reasonable price.",
          ourStory:
            "In 2018, we had only 2 rooms. Our first guest was a backpacker from Germany. He left a note saying 'This feels like home, not a hotel.' That line became our vision. We slowly added rooms, built a small kitchen, and focused on one thing — cleanliness and kindness. We never spent on ads, guests brought guests. Today, after 500+ guests, 90% of our bookings come from repeat guests and referrals. Every corner of this house has been built by our family, with love. This is not a business for us, this is our home that we share with travelers.",
          whyChooseUs:
            "1. Prime Location — 2 mins walk from Tenzing Norgay Bus Terminus & City Center Mall, auto stand just outside\n2. Family & Couple Safe — Govt ID compulsory, CCTV in common areas, owner stays on same property 24/7\n3. Home-Cooked Food — Breakfast, lunch, dinner available, home style dal-chawal, roti-sabzi, also North Indian\n4. Clean & Calm — Daily cleaning, fresh white linen, quiet building, no party noise\n5. 24/7 Support — Hot water 24/7, WiFi 100 Mbps, power backup, quick response on WhatsApp within 5 mins\n6. Trusted by Locals — 527+ reviews on Google, 4.9 rating, verified by Drisyamn team personally visited\n7. Work Friendly — Work desk, chair, charging points, good for work from Siliguri\n8. Local Guidance — We help you with Darjeeling, Sikkim, Dooars sightseeing planning, taxi booking at local rates",
        },
        amenities: [
          "Free WiFi 100 Mbps",
          "Free Parking",
          "AC Rooms",
          "Non-AC Available",
          "Restaurant Nearby",
          "Room Service",
          "Hot Water 24/7",
          "Power Backup",
          "CCTV Security",
          "Kitchen Access",
          "Laundry Service",
          "Airport Pickup on Request",
          "Bonfire Nights in Winter",
          "Work Desk & Chair",
          "Mountain View Balcony (2 rooms)",
          "Daily Housekeeping",
        ],
        rules: [
          "Govt ID Required at Check-in for all guests",
          "Family & Couples with valid ID allowed, local ID also allowed",
          "No Smoking Inside Rooms, smoking area outside",
          "Check-in 12 PM / Check-out 11 AM, early check-in subject to availability",
          "Outside Food Not Allowed in Rooms, but home food available",
          "Pets Not Allowed",
          "No loud music after 10 PM",
        ],
        languages: ["Hindi", "English", "Bengali", "Nepali", "Bhojpuri"],
        media: {
          banner: "",
          logo: "",
          stories: [
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1551882547-b79c1141d0f0?w=800&auto=format&fit=crop&q=80",
          ],
          videos: [
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
          ],
        },
        rating: 4.9,
        totalReviews: 527,
        totalBooks: 312,
        hostName: "Sobha Devi",
        hostSince: "2018",
        verified: true,
        responseTime: "5 mins",
      });
    }
  }, [username]);

  const sendMessage = () => {
    if (!msgInput.trim()) return;
    setMessages([...messages, { from: "guest", text: msgInput, time: "Now" }]);
    setMsgInput("");
    setTimeout(() => {
      setMessages((prev) => [
       ...prev,
        { from: "host", text: "Got it, I will check and reply in 2 mins.", time: "Now" },
      ]);
    }, 800);
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG_MAIN, fontFamily: "Inter, sans-serif" }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mx-auto animate-pulse">D</div>
          <p className="mt-4 text-[14px] text-black/50">Loading hotel profile...</p>
        </div>
      </div>
    );
  }

  const covers = [
    data.media?.banner || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1551882547-b79c1141d0f0?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b597?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1400&auto=format&fit=crop&q=80",
  ];

  const allPhotos = [...covers,...(data.media?.stories || [])];
  const logoChar = data.businessName?.charAt(0)?.toUpperCase() || "S";

  return (
    <div className="min-h-screen text-[#222]" style={{ background: BG_MAIN, fontFamily: "Inter, 'Segoe UI', Helvetica Neue, system-ui, sans-serif", fontWeight: 400, letterSpacing: "-0.01em" }}>

      {/* ==================== NAV BAR - BIG DRISYAMN SIZE LIKE CREATE PAGE ==================== */}
      <div className="sticky top-0 z-[100] bg-white border-b border-black/[0.06]" style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.06)" }}>
        <div className="max-w-[1260px] mx-auto px-6 h-[82px] flex items-center justify-between">
          <Link href="/homefeed" className="flex items-center gap-4">
            <div className="w-[46px] h-[46px] rounded-full bg-black text-white flex items-center justify-center text-[18px]" style={{ fontWeight: 500, boxShadow: CARD_SHADOW }}>{logoChar}</div>
            <div className="leading-none">
              <p className="text-[20px] tracking-tight" style={{ fontWeight: 600, letterSpacing: "-0.02em" }}>Drisyamn</p>
              <p className="text-[14px] text-black/60 mt-1.5" style={{ fontWeight: 400 }}>Discover Everything Around You</p>
            </div>
          </Link>

          <div className="flex items-center gap-2.5">
            <button onClick={() => { setShowBooks(!showBooks); setShowMessage(false); setShowNotifications(false); }} className={`h-[38px] px-5 rounded-full text-[13px] border transition ${showBooks? "bg-[#0F4C3A] text-white border-[#0F4C3A]" : "bg-white border-black/10 hover:bg-black/[0.04]"}`} style={{ fontWeight: 500, boxShadow: CARD_SHADOW }}>Books</button>
            <button onClick={() => { setShowMessage(!showMessage); setShowBooks(false); setShowNotifications(false); }} className={`h-[38px] px-5 rounded-full text-[13px] border transition ${showMessage? "bg-[#0F4C3A] text-white border-[#0F4C3A]" : "bg-white border-black/10 hover:bg-black/[0.04]"}`} style={{ fontWeight: 500, boxShadow: CARD_SHADOW }}>Message</button>
            <button onClick={() => { setShowNotifications(!showNotifications); setShowBooks(false); setShowMessage(false); }} className={`h-[38px] px-5 rounded-full text-[13px] border transition ${showNotifications? "bg-[#0F4C3A] text-white border-[#0F4C3A]" : "bg-white border-black/10 hover:bg-black/[0.04]"}`} style={{ fontWeight: 500, boxShadow: CARD_SHADOW }}>Notifications</button>
            <Link href={`/profile/hotels/${username}/edit`} className="h-[38px] px-5 rounded-full bg-white border border-black/10 text-[13px] flex items-center justify-center hover:bg-black/[0.04] transition" style={{ fontWeight: 500, boxShadow: CARD_SHADOW }}>Edit</Link>
            <Link href="/our-hotels" className="h-[38px] px-5 rounded-full bg-[#0F4C3A] text-white text-[13px] flex items-center justify-center hover:bg-[#0A3326] transition" style={{ fontWeight: 500, boxShadow: CARD_SHADOW }}>Our Hotels</Link>
          </div>
        </div>
      </div>

      {/* ==================== MAIN LAYOUT ==================== */}
      <div className="max-w-[1260px] mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-[1.2fr_390px] gap-8 pb-24 items-start">

        {/* LEFT */}
        <div className="min-w-0">
          {/* COVER */}
          <div className="rounded-[28px] overflow-hidden bg-white border border-black/[0.06]" style={{ boxShadow: CARD_SHADOW }}>
            <div className="relative h-[420px] md:h-[520px] bg-[#F6F1E6]">
              <img src={covers[coverIndex]} alt="cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute top-5 left-5 right-5 flex justify-between">
                <div className="flex gap-2">
                  <span className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-[11px]" style={{ fontWeight: 500, boxShadow: CARD_SHADOW }}>● {data.stayInfo?.rooms} Rooms Available</span>
                  <span className="bg-[#0F4C3A] text-white px-3 py-1.5 rounded-full text-[11px]" style={{ fontWeight: 500 }}>★ {data.rating} Verified</span>
                </div>
                <span className="bg-black/50 backdrop-blur text-white px-3 py-1.5 rounded-full text-[11px]">{coverIndex + 1} / {covers.length} Cover Pics</span>
              </div>
              <div className="absolute bottom-7 left-8 right-8">
                <h1 className="text-white text-[30px] md:text-[42px] leading-[1.05]" style={{ fontWeight: 600, textShadow: "0 2px 24px rgba(0,0,0,0.5)" }}>{data.businessName}</h1>
                <p className="text-white/90 text-[15px] mt-3 max-w-[600px] leading-[1.4]" style={{ fontWeight: 400 }}>{data.tagline}</p>
                <p className="text-white/70 text-[13px] mt-2" style={{ fontWeight: 400 }}>📍 {data.location?.full} • {data.stayInfo?.type}</p>
              </div>
            </div>
            <div className="flex gap-2.5 p-3.5 bg-white overflow-x-auto">
              {covers.map((c: string, i: number) => (
                <button key={i} onClick={() => setCoverIndex(i)} className={`shrink-0 w-[90px] h-[64px] rounded-[12px] overflow-hidden border-2 transition-all ${i === coverIndex? "border-[#0F4C3A] scale-[1.02]" : "border-transparent opacity-80 hover:opacity-100"}`} style={{ boxShadow: i === coverIndex? CARD_SHADOW : "none" }}>
                  <img src={c} className="w-full h-full object-cover" alt="thumb" />
                </button>
              ))}
            </div>
          </div>

          {/* ABOUT */}
          <div className="mt-8 bg-white rounded-[24px] border border-black/[0.06] p-8 md:p-9" style={{ boxShadow: CARD_SHADOW }}>
            <p className="text-[12px] tracking-[0.15em] text-black/30">ABOUT</p>
            <h2 className="text-[26px] md:text-[32px] leading-[1.15] mt-4" style={{ fontWeight: 500, letterSpacing: "-0.02em" }}>A small place with a big heart in Siliguri.</h2>
            <p className="text-[15px] md:text-[16px] leading-[1.85] text-black/70 mt-6 whitespace-pre-wrap" style={{ fontWeight: 400 }}>{data.content?.aboutUs}</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-[16px] bg-[#FFFEFB] border border-black/[0.04] p-4">
                <p className="text-[11px] text-black/40">CHECK-IN / OUT</p>
                <p className="text-[14px] mt-1.5" style={{ fontWeight: 500 }}>{data.stayInfo?.checkIn} / {data.stayInfo?.checkOut}</p>
              </div>
              <div className="rounded-[16px] bg-[#FFFEFB] border border-black/[0.04] p-4">
                <p className="text-[11px] text-black/40">HOST SINCE</p>
                <p className="text-[14px] mt-1.5" style={{ fontWeight: 500 }}>{data.hostSince} • {data.totalBooks}+ bookings</p>
              </div>
              <div className="rounded-[16px] bg-[#FFFEFB] border border-black/[0.04] p-4">
                <p className="text-[11px] text-black/40">LANGUAGES</p>
                <p className="text-[14px] mt-1.5" style={{ fontWeight: 500 }}>{data.languages?.slice(0, 3).join(", ")}</p>
              </div>
            </div>
          </div>

          {/* OUR STORY */}
          <div className="mt-6 bg-[#0F4C3A] rounded-[24px] p-8 md:p-9 text-white" style={{ boxShadow: CARD_SHADOW }}>
            <p className="text-[12px] tracking-[0.15em] text-white/40">OUR STORY</p>
            <h2 className="text-[26px] md:text-[32px] leading-[1.15] mt-4" style={{ fontWeight: 500 }}>We started with 2 rooms. Our guests made us bigger.</h2>
            <p className="text-[15px] md:text-[16px] leading-[1.85] text-white/80 mt-6 whitespace-pre-wrap" style={{ fontWeight: 400 }}>"{data.content?.ourStory}"</p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <span className="bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[12px]">Since 2018</span>
              <span className="bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[12px]">500+ Happy Guests</span>
              <span className="bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[12px]">Family Built</span>
            </div>
          </div>

          {/* WHY PEOPLE CHOOSE US */}
          <div className="mt-6 bg-white rounded-[24px] border border-black/[0.06] p-8 md:p-9" style={{ boxShadow: CARD_SHADOW }}>
            <p className="text-[12px] tracking-[0.15em] text-black/30">WHY PEOPLE CHOOSE US</p>
            <h2 className="text-[26px] md:text-[32px] leading-[1.15] mt-4" style={{ fontWeight: 500 }}>Why travelers come back again and again.</h2>
            <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {data.content?.whyChooseUs?.split("\n").map((line: string, i: number) => (
                <div key={i} className="flex gap-3.5 p-4 rounded-[16px] bg-[#FFFEFB] border border-black/[0.04] hover:bg-[#F6F1E6] transition">
                  <div className="w-8 h-8 rounded-full bg-[#E6F4EA] text-[#0F4C3A] flex items-center justify-center text-[12px] shrink-0 mt-0.5" style={{ fontWeight: 500 }}>{i + 1}</div>
                  <p className="text-[13px] md:text-[14px] leading-[1.6] text-black/70" style={{ fontWeight: 400 }}>{line.replace(/^\d+\.\s*/, "")}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-[13px] text-black/40">Facilities</p>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2.5">
                {data.amenities?.map((a: string) => (
                  <div key={a} className="h-[46px] rounded-full bg-[#F6F1E6] border border-black/[0.04] px-4 flex items-center text-[12px] md:text-[13px] text-black/70" style={{ fontWeight: 400 }}>{a}</div>
                ))}
              </div>
            </div>
          </div>

          {/* PHOTOS / VIDEOS / REVIEWS */}
          <div className="mt-8">
            <div className="flex gap-2 bg-white p-1.5 rounded-full border border-black/[0.06] w-fit" style={{ boxShadow: CARD_SHADOW }}>
              {[
                { id: "photos", label: `Photos (${allPhotos.length})` },
                { id: "videos", label: "Videos" },
                { id: "reviews", label: `Reviews (${data.totalReviews})` },
              ].map((t) => (
                <button key={t.id} onClick={() => setActiveInfoTab(t.id)} className={`px-6 h-[38px] rounded-full text-[13px] transition ${activeInfoTab === t.id? "bg-[#0F4C3A] text-white" : "text-black/60 hover:bg-black/[0.04]"}`} style={{ fontWeight: 400 }}>{t.label}</button>
              ))}
            </div>

            {activeInfoTab === "photos" && (
              <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-3.5">
                {allPhotos.map((img: string, i: number) => (
                  <div key={i} className="h-[190px] rounded-[18px] overflow-hidden bg-white border border-black/[0.06]" style={{ boxShadow: CARD_SHADOW }}><img src={img} className="w-full h-full object-cover hover:scale-105 transition duration-700" alt="hotel" /></div>
                ))}
              </div>
            )}

            {activeInfoTab === "videos" && (
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="relative h-[300px] rounded-[20px] overflow-hidden bg-black border border-black/10" style={{ boxShadow: CARD_SHADOW }}>
                    <img src={covers[i % covers.length]} className="w-full h-full object-cover opacity-70" alt="video" />
                    <div className="absolute inset-0 flex items-center justify-center"><div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[18px]" style={{ boxShadow: CARD_SHADOW }}>▶</div></div>
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur text-white px-3 py-1.5 rounded-full text-[11px]">Room Tour • 0:{40 + i * 5}</div>
                  </div>
                ))}
              </div>
            )}

            {activeInfoTab === "reviews" && (
              <div className="mt-5 space-y-3.5">
                {[
                  { n: "Rahul Sharma • Delhi", d: "2 days ago", t: "Very clean, peaceful and home-like. Sobha aunty's food was amazing. Owner helped with sightseeing planning. Best budget stay near City Center.", r: 5 },
                  { n: "Anjali Family • Kolkata", d: "1 week ago", t: "Safe for family and kids. Rooms spacious, hot water working. Bonfire in winter was lovely. Will come again.", r: 5 },
                  { n: "John Muller • Germany", d: "2 weeks ago", t: "Feels like home, not a hotel. Perfect for solo travelers. Host is very kind and helpful.", r: 5 },
                  { n: "Pritam Roy • Siliguri", d: "3 weeks ago", t: "Work from Siliguri ke liye best. WiFi fast, desk available. WhatsApp booking easy.", r: 4 },
                ].map((x, i) => (
                  <div key={i} className="bg-white rounded-[18px] border border-black/[0.06] p-6" style={{ boxShadow: CARD_SHADOW }}>
                    <div className="flex items-center justify-between"><p className="text-[14px]" style={{ fontWeight: 500 }}>{x.n}</p><span className="text-[11px] px-2.5 py-1 rounded-full bg-[#E6F4EA] text-[#0F4C3A]">★ {x.r}.0</span></div>
                    <p className="text-[11px] text-black/40 mt-1">{x.d}</p>
                    <p className="text-[13px] md:text-[14px] text-black/65 mt-3 leading-[1.6]" style={{ fontWeight: 400 }}>{x.t}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ==================== RIGHT SIDE - BOOKS / MESSAGE / NOTIFICATIONS SAME PAGE ==================== */}
        <div className="lg:sticky lg:top-[106px] space-y-4">

          {/* DEFAULT BOOKING CARD */}
          {!showBooks &&!showMessage &&!showNotifications && (
            <div className="bg-white rounded-[28px] border border-black/[0.06] p-7" style={{ boxShadow: CARD_SHADOW }}>
              <p className="text-[12px] text-black/40">Starting from</p>
              <p className="text-[32px] mt-1.5" style={{ fontWeight: 600 }}>{data.stayInfo?.pricePerNight} <span className="text-[14px] text-black/40" style={{ fontWeight: 400 }}>/ night</span></p>
              <p className="text-[12px] text-black/50 mt-3" style={{ fontWeight: 400 }}>{data.stayInfo?.checkIn} Check-in • {data.stayInfo?.checkOut} Check-out • {data.stayInfo?.guests}</p>
              <button onClick={() => window.open(`https://wa.me/91${data.contact?.whatsapp}?text=Hi ${data.businessName}`)} className="mt-7 w-full h-[52px] rounded-full bg-[#0F4C3A] text-white text-[14px] hover:bg-[#0A3326] transition flex items-center justify-center gap-2" style={{ fontWeight: 500 }}>Book on WhatsApp ↗</button>
              <button onClick={() => setShowMessage(true)} className="mt-3 w-full h-[50px] rounded-full bg-[#E6F4EA] text-[#0F4C3A] text-[14px] hover:bg-[#D0E9D6] transition" style={{ fontWeight: 500 }}>Message Host</button>
              <button onClick={() => setShowBooks(true)} className="mt-3 w-full h-[46px] rounded-full bg-white border border-black/10 text-[13px] hover:bg-black/[0.03] transition" style={{ fontWeight: 400 }}>View My Books</button>
              <div className="mt-8 pt-7 border-t border-black/[0.06]"><p className="text-[11px] tracking-widest text-black/30">HOSTED BY</p><div className="mt-4 flex items-center gap-3"><div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center text-[15px]" style={{ fontWeight: 500 }}>{logoChar}</div><div><p className="text-[14px]" style={{ fontWeight: 500 }}>{data.hostName}</p><p className="text-[11px] text-black/50 mt-0.5" style={{ fontWeight: 400 }}>@{username} • Replies in {data.responseTime}</p></div></div></div>
            </div>
          )}

          {/* BOOKS PANEL */}
          {showBooks && (
            <div className="bg-white rounded-[28px] border border-black/[0.06] p-7" style={{ boxShadow: CARD_SHADOW }}>
              <div className="flex items-center justify-between"><h3 className="text-[16px]" style={{ fontWeight: 500 }}>Your Books</h3><button onClick={() => setShowBooks(false)} className="w-8 h-8 rounded-full bg-black/[0.06] flex items-center justify-center text-[12px]">✕</button></div>
              <p className="text-[12px] text-black/40 mt-2" style={{ fontWeight: 400 }}>All your bookings for this hotel</p>
              <div className="mt-6 space-y-3">
                <div className="p-4 rounded-[16px] bg-[#FFFEFB] border border-black/[0.06]"><div className="flex justify-between"><p className="text-[13px]" style={{ fontWeight: 500 }}>{data.businessName} • 12 Sep</p><span className="text-[10px] px-2 py-1 rounded-full bg-[#E6F4EA] text-[#0F4C3A]">CONFIRMED</span></div><p className="text-[12px] text-black/50 mt-2">2 guests • 1 night • ₹1,499 paid via UPI</p><div className="mt-3 flex gap-2"><button className="h-8 px-3 rounded-full bg-black text-white text-[11px]">View Receipt</button><button className="h-8 px-3 rounded-full bg-white border border-black/10 text-[11px]">Message Host</button></div></div>
                <div className="p-4 rounded-[16px] bg-white border border-black/[0.06]"><div className="flex justify-between"><p className="text-[13px]" style={{ fontWeight: 500 }}>{data.businessName} • 20 Aug</p><span className="text-[10px] px-2 py-1 rounded-full bg-black/5">COMPLETED</span></div><p className="text-[12px] text-black/50 mt-2">3 guests • 2 nights • ₹2,998</p></div>
              </div>
              <button onClick={() => setShowBooks(false)} className="mt-6 w-full h-[44px] rounded-full bg-[#0F4C3A] text-white text-[12px]" style={{ fontWeight: 500 }}>Back to Booking</button>
            </div>
          )}

          {/* MESSAGE PANEL */}
          {showMessage && (
            <div className="bg-white rounded-[28px] border border-black/[0.06] p-7" style={{ boxShadow: CARD_SHADOW }}>
              <div className="flex items-center justify-between"><h3 className="text-[16px]" style={{ fontWeight: 500 }}>Message @{username}</h3><button onClick={() => setShowMessage(false)} className="w-8 h-8 rounded-full bg-black/[0.06] flex items-center justify-center text-[12px]">✕</button></div>
              <div className="mt-5 h-[320px] bg-[#FFFEFB] border border-black/[0.06] rounded-[18px] p-4 overflow-y-auto space-y-3">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.from === "host"? "justify-end" : "justify-start"}`}>
                    <div className={`${m.from === "host"? "bg-[#0F4C3A] text-white rounded-br-none" : "bg-white border border-black/[0.06] rounded-bl-none"} p-3 rounded-[14px] max-w-[82%]`} style={{ boxShadow: m.from === "guest"? CARD_SHADOW : "none" }}>
                      <p className="text-[13px] leading-[1.5]" style={{ fontWeight: 400 }}>{m.text}</p>
                      <p className={`text-[10px] mt-1 ${m.from === "host"? "text-white/60" : "text-black/40"}`}>{m.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <input value={msgInput} onChange={(e) => setMsgInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder="Type a message..." className="flex-1 h-[44px] px-5 rounded-full bg-[#F6F1E6] border border-black/[0.06] text-[13px] outline-none" style={{ fontWeight: 400 }} />
                <button onClick={sendMessage} className="w-[44px] h-[44px] rounded-full bg-[#0F4C3A] text-white flex items-center justify-center hover:bg-[#0A3326] transition">↗</button>
              </div>
              <p className="text-[11px] text-black/30 text-center mt-3">Usually replies in 5 mins • WhatsApp also available</p>
            </div>
          )}

          {/* NOTIFICATIONS PANEL */}
          {showNotifications && (
            <div className="bg-white rounded-[28px] border border-black/[0.06] p-7" style={{ boxShadow: CARD_SHADOW }}>
              <div className="flex items-center justify-between"><h3 className="text-[16px]" style={{ fontWeight: 500 }}>Notifications</h3><button onClick={() => setShowNotifications(false)} className="w-8 h-8 rounded-full bg-black/[0.06] flex items-center justify-center text-[12px]">✕</button></div>
              <div className="mt-6 space-y-3">
                <div className="p-4 rounded-[16px] bg-[#E6F4EA] border border-[#0F4C3A]/10"><p className="text-[12px] text-[#0F4C3A]" style={{ fontWeight: 500 }}>New booking request • 2 mins ago</p><p className="text-[12px] text-black/60 mt-1.5" style={{ fontWeight: 400 }}>Rahul from Delhi requested 14-15 Sep, 2 guests. Confirm now?</p><button className="mt-3 h-8 px-4 rounded-full bg-[#0F4C3A] text-white text-[11px]">Confirm</button></div>
                <div className="p-4 rounded-[16px] bg-white border border-black/[0.06]"><p className="text-[12px]" style={{ fontWeight: 500 }}>Profile viewed 18 times today</p><p className="text-[11px] text-black/40 mt-1" style={{ fontWeight: 400 }}>3 hrs ago • 6 from Siliguri</p></div>
                <div className="p-4 rounded-[16px] bg-white border border-black/[0.06]"><p className="text-[12px]" style={{ fontWeight: 500 }}>You got a new review ★ 5.0</p><p className="text-[11px] text-black/40 mt-1" style={{ fontWeight: 400 }}>Yesterday • "Feels like home, best stay"</p></div>
                <div className="p-4 rounded-[16px] bg-white border border-black/[0.06]"><p className="text-[12px]" style={{ fontWeight: 500 }}>Payout credited ₹1,499</p><p className="text-[11px] text-black/40 mt-1" style={{ fontWeight: 400 }}>Yesterday • Booking #SOBHA-312</p></div>
              </div>
            </div>
          )}

          <p className="text-center text-[11px] text-black/25" style={{ fontWeight: 400 }}>Drisyamn • Discover Everything Around You • © 2026</p>
        </div>
      </div>
    </div>
  );
}