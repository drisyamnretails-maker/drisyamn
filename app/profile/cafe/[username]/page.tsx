"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

const RED = "#C1272D";
const BG = "#E9E1C8";
const CARD = "#FFFEF9";

export default function CafeProfileExact() {
  const { username } = useParams() as { username: string };
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("menu");
  const [showBook, setShowBook] = useState(false);
  const [showImg, setShowImg] = useState<string | null>(null);
  const [booking, setBooking] = useState({ name: "", phone: "", date: "", guests: "2" });
  const [reviewText, setReviewText] = useState("");

  const [reviews, setReviews] = useState([
    { id:1, name:"Ananya S.", initial:"A", rating:5, time:"2 days ago", text:"Love the masala chai, so soothing and flavorful! Service is quick and the ambiance is very cozy." },
    { id:2, name:"Rahul K.", initial:"R", rating:5, time:"1 week ago", text:"Chicken momos are delicious and spicy. Great place to hang out in the evenings." },
  ]);

  const menu = [
    { id:1, name:"Masala Chai", desc:"Spiced tea with milk • Popular", price:"30", img:"https://images.unsplash.com/photo-1544787219-7f47cc556762?w=200" },
    { id:2, name:"Chicken Momo", desc:"Steamed momos with spicy chutney • 8pcs", price:"120", img:"https://images.unsplash.com/photo-1534422298391-e4f640380802?w=200" },
    { id:3, name:"Veg Puff", desc:"Crispy baked puff • Fresh", price:"40", img:"https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=200" },
    { id:4, name:"Cold Coffee", desc:"Iced coffee with cream • Cold", price:"90", img:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200" },
  ];

  const gallery = [
    "https://images.unsplash.com/photo-1544787219-7f47cc556762?w=400",
    "https://images.unsplash.com/photo-1534422298391-e4f640380802?w=400",
    "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400",
    "https://images.unsplash.com/photo-1589307004173-3c95204d99d2?w=400",
    "https://images.unsplash.com/photo-1534422298391-e4f640380802?w=400",
    "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400",
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400",
    "https://images.unsplash.com/photo-1593001872095-a2f2e2a6d6c6?w=400",
  ];

  useEffect(() => {
    const saved = localStorage.getItem(`drisyamn_cafe_${username}`);
    if (saved) setData(JSON.parse(saved));
    else setData({ shopName:"Chai Break Matigara", cat:"Tea Stall • Cafe • Hangout", address:"Matigara, Siliguri", phone:"9876543210", about:"We serve fresh chai, momos, puffs and fast food. Best place for friends, couples and family.", story:"Founded in 2021 by Rohan Pradhan, Chai Break began as a small tea stall in a small lane. Now we serve tradition with a modern twist, serving authentic snacks and tea." });
  }, [username]);

  if (!data) return <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>Loading...</div>;

  // BUTTON LOGICS
  const handleCall = () => window.location.href = `tel:${data.phone}`;
  const handleDirections = () => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.shopName+" "+data.address)}`, "_blank");
  const handleBook = () => { if(!booking.name||!booking.phone) return alert("Name & Phone required"); alert(`Booked! ${booking.name} for ${booking.guests} guests on ${booking.date}. We will call you.`); setShowBook(false); };
  const handleAddReview = () => { if(!reviewText.trim()) return; setReviews([{ id:Date.now(), name:username, initial:username[0].toUpperCase(), rating:5, time:"Just now", text:reviewText },...reviews]); setReviewText(""); };

  return (
    <div className="min-h-screen w-full flex justify-center" style={{ background: BG }}>
      <div className="w-full max-w-[1240px] p-2 md:p-4">

        {/* TOP NAV - Desktop + Mobile Same */}
        <div className="w-full bg-white rounded-[16px] border border-black/5 shadow-sm h-[58px] px-3 md:px-6 flex items-center justify-between mb-4">
          <div className="flex items-center gap-5 md:gap-8">
            <Link href="/" className="flex flex-col items-center text-[#C1272D]"><span className="text-[18px]">🏠</span><span className="text-[11px] font-bold">Home</span></Link>
            <button onClick={()=>alert("Messages coming soon")} className="flex flex-col items-center text-black/60 hover:text-black"><span className="text-[16px]">💬</span><span className="text-[11px]">Message</span></button>
            <button onClick={()=>alert("Notifications coming soon")} className="flex flex-col items-center text-black/60 hover:text-black"><span className="text-[16px]">🔔</span><span className="text-[11px]">Notification</span></button>
            <button onClick={()=>alert("Notifications")} className="hidden md:flex flex-col items-center text-black/60"><span className="text-[16px]">🔖</span><span className="text-[11px]">Notification</span></button>
            <button onClick={()=>setActiveTab("menu")} className="flex flex-col items-center text-black/60 hover:text-black"><span className="text-[16px]">📚</span><span className="text-[11px]">Books</span></button>
          </div>
          <Link href={`/create-profile/cafe/${username}`} className="px-4 py-2 rounded-full text-white text-[13px] font-bold" style={{ background: RED }}>Edit Profile</Link>
        </div>

        {/* MAIN GRID - Desktop 2 col, Mobile 1 col */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-4 items-start">

          {/* LEFT CARD */}
          <div className="bg-white rounded-[20px] overflow-hidden border border-black/5 shadow-sm">
            {/* COVER IMAGE */}
            <div className="relative h-[190px] md:h-[240px] w-full bg-cover bg-center" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=80)` }}>
              {/* CENTER COFFEE ICON - Like Image */}
              <div className="absolute -bottom-[32px] left-1/2 -translate-x-1/2 w-[68px] h-[68px] rounded-full bg-white border-[6px] border-white shadow-lg flex items-center justify-center text-[32px] z-10">☕</div>
            </div>

            <div className="pt-12 px-4 md:px-6 pb-4 text-center">
              <h1 className="text-[20px] md:text-[22px] font-bold flex items-center justify-center gap-1.5">{data.shopName} <span className="text-blue-500 text-[16px]">✔</span></h1>
              <p className="text-[13px] text-black/60">{data.cat}</p>
              <div className="flex items-center justify-center gap-2 mt-2 text-[12px]">
                <span>⭐ 4.6 (342 reviews)</span><span>•</span><span>📍 1.2km away</span><span>•</span><span className="text-green-600 font-medium">● Open now</span>
              </div>

              {/* CALL / DIRECTIONS BUTTONS WORKING */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button onClick={handleCall} className="h-[44px] rounded-[10px] text-white font-semibold flex items-center justify-center gap-2 active:scale-95 transition" style={{ background: RED }}>📞 Call Now</button>
                <button onClick={handleDirections} className="h-[44px] rounded-[10px] text-white font-semibold flex items-center justify-center gap-2 active:scale-95 transition" style={{ background: RED }}>📍 Directions</button>
              </div>

              {/* TABS BAR - Like Image */}
              <div className="mt-4 flex gap-1.5 p-1 rounded-full bg-black/[0.04] overflow-x-auto">
                {[
                  { id:"about", label:"About Us" },
                  { id:"story", label:"Our Story" },
                  { id:"gallery", label:"Gallery" },
                  { id:"reviews", label:"Reviews" },
                ].map(t=>(
                  <button key={t.id} onClick={()=>setActiveTab(t.id)} className={`flex items-center gap-1 px-3 py-2 rounded-full text-[11px] font-medium whitespace-nowrap transition ${activeTab===t.id? "bg-white shadow text-black" : "text-black/60"}`}> {t.id==="about"&&"ⓘ"} {t.id==="story"&&"📖"} {t.id==="gallery"&&"🖼️"} {t.id==="reviews"&&"💬"} {t.label} <span className="text-[10px]">▼</span></button>
                ))}
              </div>

              {/* MENU LIST - DEFAULT SHOW LIKE IMAGE */}
              {(activeTab==="menu" || activeTab==="about") && (
                <div className="mt-4 text-left">
                  <h3 className="font-bold text-[14px]">Menu</h3>
                  <div className="mt-3 divide-y divide-black/5">
                    {menu.slice(0,3).map(m=>(
                      <div key={m.id} className="py-3 flex justify-between items-start">
                        <div><p className="text-[14px] font-semibold">{m.name}</p><p className="text-[11px] text-black/50">{m.desc}</p></div>
                        <p className="text-[14px] font-bold">₹{m.price}</p>
                      </div>
                    ))}
                  </div>
                  {/* Mini Gallery Inside Mobile View - Like Screenshot */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {gallery.slice(0,6).map((g,i)=><img key={i} onClick={()=>setShowImg(g)} src={g} className="h-[86px] w-full object-cover rounded-[12px] cursor-pointer" alt="" />)}
                  </div>
                </div>
              )}

              {activeTab==="gallery" && (
                <div className="mt-4 grid grid-cols-3 gap-2 text-left">
                  {gallery.map((g,i)=><img key={i} onClick={()=>setShowImg(g)} src={g} className="h-[86px] object-cover rounded-[12px] cursor-pointer" alt="" />)}
                </div>
              )}

              {activeTab==="about" && (
                <div className="mt-4 text-left"><h3 className="font-bold">About Us</h3><p className="mt-2 text-[13px] leading-6 text-black/70">{data.about}</p><p className="mt-3 text-[12px]">📞 {data.phone} • 📍 {data.address}</p></div>
              )}
              {activeTab==="story" && (
                <div className="mt-4 text-left"><h3 className="font-bold">Our Story</h3><p className="mt-2 text-[13px] leading-6 text-black/70">{data.story}</p></div>
              )}
              {activeTab==="reviews" && (
                <div className="mt-4 text-left space-y-3">
                  {reviews.map(r=><div key={r.id} className="flex gap-3 p-3 bg-black/[0.03] rounded-[12px]"><div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center font-bold text-[12px]">{r.initial}</div><div><p className="text-[13px] font-semibold flex gap-2">{r.name} <span className="text-yellow-500 text-[11px]">{"★".repeat(r.rating)}</span></p><p className="text-[10px] text-black/40">{r.time}</p><p className="text-[12px] mt-1 text-black/70">{r.text}</p></div></div>)}
                </div>
              )}
            </div>

            {/* BOTTOM NAV FOR MOBILE - Like Image */}
            <div className="md:hidden flex gap-1.5 p-2 rounded-full bg-black/[0.04] m-3">
              <button onClick={()=>setActiveTab("about")} className="flex-1 h-[36px] rounded-full bg-white text-[11px] font-medium">About Us ▼</button>
              <button onClick={()=>setActiveTab("story")} className="flex-1 h-[36px] rounded-full bg-white text-[11px] font-medium">Our Story ▼</button>
              <button onClick={()=>setActiveTab("gallery")} className="flex-1 h-[36px] rounded-full bg-white text-[11px] font-medium">Gallery ▼</button>
              <button onClick={()=>setActiveTab("reviews")} className="flex-1 h-[36px] rounded-full bg-white text-[11px] font-medium">Reviews ▼</button>
            </div>
          </div>

          {/* RIGHT SIDE - Desktop Only Stack */}
          <div className="flex flex-col gap-4">
            {/* GALLERY CARD */}
            <div className="bg-white rounded-[20px] border border-black/5 p-4 shadow-sm hidden lg:block">
              <div className="flex justify-between items-center"><h3 className="font-bold">Gallery <span className="text-[11px]">▼</span></h3><button onClick={()=>setActiveTab("gallery")} className="text-[11px] text-black/40">⌄</button></div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {gallery.slice(0,9).map((g,i)=><img key={i} src={g} onClick={()=>setShowImg(g)} className="h-[84px] object-cover rounded-[10px] cursor-pointer hover:opacity-80" alt="" />)}
              </div>
            </div>

            {/* FULL MENU CARD DESKTOP */}
            <div className="bg-white rounded-[20px] border border-black/5 p-4 shadow-sm hidden lg:block">
              <h3 className="font-bold">Menu</h3>
              <div className="mt-3 divide-y divide-black/5">
                {menu.map(m=><div key={m.id} className="py-3 flex justify-between"><div><p className="text-[14px] font-semibold">{m.name}</p><p className="text-[11px] text-black/50">{m.desc}</p></div><p className="font-bold text-[14px]">₹{m.price}</p></div>)}
              </div>
              <div className="mt-4"><h3 className="font-bold">About Us <span className="text-[11px]">▼</span></h3><div className="mt-2 flex gap-1 p-1 bg-black/[0.04] rounded-full w-fit"><button className="px-3 py-1.5 bg-white rounded-full text-[11px]">About Us ▼</button><button className="px-3 py-1.5 text-[11px] text-black/50">Our Story ▼</button></div></div>
              <div className="mt-4"><h3 className="font-bold">Our Story <span className="text-[11px]">▼</span></h3><p className="mt-2 text-[11px] leading-5 text-black/60 line-clamp-4">{data.story}</p></div>
            </div>

            {/* REVIEWS + BOOK TABLE */}
            <div className="bg-white rounded-[20px] border border-black/5 p-4 shadow-sm">
              <div className="flex justify-between"><h3 className="font-bold">Reviews <span className="text-[11px]">▼</span></h3><span className="text-[11px]">⌄</span></div>
              <div className="mt-3 space-y-4">
                {reviews.map(r=>(
                  <div key={r.id} className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center font-bold">{r.initial}</div>
                    <div className="flex-1"><p className="text-[13px] font-bold flex gap-2">{r.name} <span className="text-yellow-500 text-[11px]">{"★".repeat(5)}</span></p><p className="text-[11px] text-black/40">{r.time}</p><p className="text-[12px] mt-1 text-black/70 leading-5">{r.text}</p></div>
                  </div>
                ))}
                <div className="flex gap-2 mt-3"><input value={reviewText} onChange={e=>setReviewText(e.target.value)} placeholder="Write a review..." className="flex-1 h-[40px] border rounded-full px-4 text-[12px]" /><button onClick={handleAddReview} className="px-4 h-[40px] rounded-full bg-black text-white text-[12px]">Post</button></div>
              </div>
              <button onClick={()=>setShowBook(true)} className="mt-5 w-full h-[44px] rounded-[10px] text-white font-bold" style={{ background: RED }}>Book Table</button>
            </div>
          </div>
        </div>

        {/* MOBILE REVIEWS - Show in Mobile */}
        <div className="lg:hidden mt-4 bg-white rounded-[20px] border border-black/5 p-4 shadow-sm">
          <div className="flex justify-between"><h3 className="font-bold">Reviews</h3><span>▼</span></div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {reviews.map(r=><div key={r.id} className="p-3 rounded-[12px] bg-black/[0.03]"><div className="flex gap-2 items-center"><div className="w-7 h-7 rounded-full bg-white flex items-center justify-center font-bold text-[11px]">{r.initial}</div><div><p className="text-[12px] font-bold">{r.name}</p><p className="text-[10px] text-yellow-500">★★★★★</p></div></div><p className="text-[10px] text-black/40 mt-1">{r.time}</p><p className="text-[11px] mt-1 text-black/70">{r.text.slice(0,80)}...</p></div>)}
          </div>
          <button onClick={()=>setShowBook(true)} className="md:hidden mt-4 w-full h-[44px] rounded-[10px] text-white font-bold" style={{ background: RED }}>Book Table</button>
        </div>

        {/* BOOK MODAL */}
        {showBook && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="w-full max-w-[380px] bg-white rounded-[20px] p-5">
              <div className="flex justify-between items-center"><h3 className="font-bold text-[18px]">Book Table</h3><button onClick={()=>setShowBook(false)} className="w-8 h-8 rounded-full bg-black/5">✕</button></div>
              <p className="text-[12px] text-black/60 mt-1">{data.shopName} • {data.address}</p>
              <input value={booking.name} onChange={e=>setBooking({...booking, name:e.target.value})} placeholder="Your Name *" className="mt-4 w-full h-[44px] border rounded-[12px] px-4 text-[13px]" />
              <input value={booking.phone} onChange={e=>setBooking({...booking, phone:e.target.value})} placeholder="Phone *" className="mt-3 w-full h-[44px] border rounded-[12px] px-4 text-[13px]" />
              <div className="grid grid-cols-2 gap-2 mt-3"><input type="date" value={booking.date} onChange={e=>setBooking({...booking, date:e.target.value})} className="h-[44px] border rounded-[12px] px-3 text-[13px]" /><select value={booking.guests} onChange={e=>setBooking({...booking, guests:e.target.value})} className="h-[44px] border rounded-[12px] px-3 text-[13px]"><option value="1">1 Guest</option><option value="2">2 Guests</option><option value="4">4 Guests</option><option value="6">6+ Guests</option></select></div>
              <button onClick={handleBook} className="mt-5 w-full h-[48px] rounded-full text-white font-bold" style={{ background: RED }}>Confirm Booking</button>
              <button onClick={()=>setShowBook(false)} className="mt-2 w-full h-[44px] rounded-full bg-black/5 text-[13px]">Cancel</button>
            </div>
          </div>
        )}

        {showImg && (
          <div onClick={()=>setShowImg(null)} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"><img src={showImg} className="max-h-[90vh] max-w-full rounded-[16px]" alt="" /></div>
        )}

      </div>
    </div>
  );
}