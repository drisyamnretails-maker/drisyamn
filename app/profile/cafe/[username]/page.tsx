"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

const RED = "#DC2626";
const BG = "#EDE6D3";
const BLACK = "#0A0A0A";

export default function CafeProfileFinal() {
  const { username } = useParams() as { username: string };
  const [data, setData] = useState<any>(null);
  const [tab, setTab] = useState("about");
  const [liked, setLiked] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [showBook, setShowBook] = useState(false);
  const [showImg, setShowImg] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState<any[]>([
    { name: "Ananya S", rating: 5, text: "Love the masala chai, very cozy place!", time: "2d ago" },
    { name: "Rahul K", rating: 4, text: "Best momo in Matigara. Must try!", time: "5d ago" },
  ]);
  const [booking, setBooking] = useState({ name: "", phone: "", date: "", time: "", guests: "2" });
  const [isOpen, setIsOpen] = useState(true);

  // LOAD DATA
  useEffect(() => {
    const saved = localStorage.getItem(`drisyamn_cafe_${username}`);
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      setData({
        shopName: "Chai Break Matigara",
        ownerName: "Rohan Pradhan",
        category: "Tea Stall • Cafe • Hangout",
        address: "Matigara, Siliguri, WB 734010",
        phone: "9876543210",
        openTime: "08:00 AM",
        closeTime: "10:00 PM",
        about: "Chai Break is the most loved hangout spot in Matigara. We serve fresh chai, momos, puffs and fast food. Best place for friends, couples and family.",
        story: "Founded in 2021 by Rohan Pradhan with a small tea stall. Now we serve 500+ customers daily. Our mission is to give best chai with adda. Started from one kettle, now 15+ items.",
        menu: [
          { id: 1, name: "Masala Chai", price: 30, desc: "Spiced tea with milk", veg: true, popular: true },
          { id: 2, name: "Chicken Momo", price: 120, desc: "Steamed momos with chutney", veg: false, popular: true },
          { id: 3, name: "Veg Puff", price: 40, desc: "Crispy baked puff", veg: true, popular: false },
          { id: 4, name: "Cold Coffee", price: 80, desc: "Chilled coffee with ice cream", veg: true, popular: true },
          { id: 5, name: "Chicken Roll", price: 90, desc: "Kathi roll with chicken", veg: false, popular: false },
          { id: 6, name: "French Fries", price: 70, desc: "Crispy salted fries", veg: true, popular: false },
        ],
      });
    }
    const likeSaved = localStorage.getItem(`like_${username}`);
    if (likeSaved) setLiked(true);

    // Open/Close logic
    const hour = new Date().getHours();
    setIsOpen(hour >= 8 && hour < 22);
  }, [username]);

  // BUTTON LOGIC
  const handleCall = () => {
    window.location.href = `tel:${data.phone}`;
  };

  const handleDirections = () => {
    const query = encodeURIComponent(data.address + " " + data.shopName);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: data.shopName, text: `Check ${data.shopName} on Drisyamn`, url }); } catch {}
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied: " + url);
    }
  };

  const handleLike = () => {
    const newLiked =!liked;
    setLiked(newLiked);
    if (newLiked) localStorage.setItem(`like_${username}`, "1");
    else localStorage.removeItem(`like_${username}`);
  };

  const addToCart = (item: any) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i!== index));
  };

  const getTotal = () => cart.reduce((sum, i) => sum + Number(i.price), 0);

  const handleAddReview = () => {
    if (!reviewText.trim()) return;
    const newRev = { name: username, rating: 5, text: reviewText, time: "Just now" };
    setReviews([newRev,...reviews]);
    setReviewText("");
  };

  const handleBooking = () => {
    if (!booking.name ||!booking.phone) return alert("Name & Phone required");
    alert(`Booking confirmed for ${booking.name} on ${booking.date} at ${booking.time} for ${booking.guests} guests. We will call you at ${booking.phone}`);
    setShowBook(false);
    setBooking({ name: "", phone: "", date: "", time: "", guests: "2" });
  };

  const handleOrder = () => {
    if (cart.length === 0) return alert("Cart empty");
    alert(`Order placed: ${cart.map(c=>c.name).join(", ")} - Total ₹${getTotal()}. Shop will call you at ${data.phone}`);
    setCart([]);
  };

  if (!data) return <div className="min-h-screen flex items-center justify-center bg-[#EDE6D3]"><p>Loading {username}...</p></div>;

  return (
    <div className="min-h-screen w-full" style={{ background: BG }}>
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-black/5">
        <div className="max-w-[1280px] mx-auto h-[62px] px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="group flex items-center">
            <span className="text-[34px] font-black tracking-[-0.04em] transition-all duration-300 group-hover:text-[#E86A33] group-hover:tracking-[-0.01em] group-hover:scale-[1.04] inline-block" style={{ fontFamily: "Georgia, serif", fontWeight: 900, color: BLACK }}>
              Drisyamn
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="w-[38px] h-[38px] rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10">↗</button>
            <button onClick={handleLike} className={`w-[38px] h-[38px] rounded-full flex items-center justify-center ${liked? "bg-red-500 text-white" : "bg-black/5"}`}>♥</button>
            <Link href={`/create-profile/cafe/${username}`} className="px-4 h-[38px] rounded-full bg-black text-white text-[13px] flex items-center font-medium hover:bg-black/80">Edit</Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto p-3 md:p-6 grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-5">
        {/* LEFT MAIN */}
        <div className="bg-white rounded-[22px] overflow-hidden border border-black/5 shadow-sm">
          {/* COVER */}
          <div className="relative h-[220px] md:h-[300px] w-full bg-cover bg-center" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=80)` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${isOpen? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>{isOpen? "● OPEN NOW" : "● CLOSED"}</span>
              <span className="px-3 py-1 rounded-full bg-white/90 text-[11px] font-bold">⭐ 4.6 (342)</span>
            </div>
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 flex items-end gap-3">
              <div className="w-[84px] h-[84px] rounded-[18px] bg-white border-[4px] border-white shadow-xl flex items-center justify-center text-[40px]">☕</div>
              <div className="hidden md:block pb-2 bg-white px-3 py-1 rounded-full text-[11px] font-bold shadow">VERIFIED</div>
            </div>
          </div>

          <div className="pt-16 p-5 md:p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-[24px] md:text-[26px] font-bold leading-tight flex items-center gap-2">{data.shopName} <span className="text-blue-500 text-[18px]">✔</span></h1>
                <p className="text-[13px] text-black/60 mt-1">{data.category} • Owned by {data.ownerName}</p>
                <p className="text-[12px] mt-2 text-black/70">📍 {data.address} • 1.2km away</p>
                <p className="text-[12px] mt-1"><span className="text-black/50">Hours:</span> <span className={isOpen? "text-green-600 font-medium" : "text-red-600"}>{data.openTime} - {data.closeTime}</span></p>
              </div>
            </div>

            {/* ACTION BUTTONS WORKING */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              <button onClick={handleCall} className="h-[46px] rounded-[14px] text-white font-semibold flex items-center justify-center gap-2 active:scale-95 transition" style={{ background: RED }}>📞 Call Now</button>
              <button onClick={handleDirections} className="h-[46px] rounded-[14px] text-white font-semibold flex items-center justify-center gap-2 active:scale-95 transition" style={{ background: RED }}>📍 Directions</button>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <button onClick={()=>setShowBook(true)} className="h-[42px] rounded-[12px] bg-black text-white text-[13px] font-medium">Book Table</button>
              <button onClick={handleShare} className="h-[42px] rounded-[12px] bg-black/5 text-[13px] font-medium">Share</button>
              <button onClick={()=>setTab("menu")} className="h-[42px] rounded-[12px] bg-black/5 text-[13px] font-medium">View Menu</button>
            </div>

            {/* TABS ROUTES */}
            <div className="mt-6 flex gap-2 p-1.5 rounded-full bg-black/[0.04] overflow-x-auto scrollbar-none">
              {[
                { id: "about", l: "About Us", route: `/profile/cafe/${username}?tab=about` },
                { id: "story", l: "Our Story", route: `/profile/cafe/${username}?tab=story` },
                { id: "menu", l: "Menu", route: `/profile/cafe/${username}?tab=menu` },
                { id: "gallery", l: "Gallery", route: `/profile/cafe/${username}?tab=gallery` },
                { id: "reviews", l: "Reviews", route: `/profile/cafe/${username}?tab=reviews` },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} className={`px-5 py-2.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all ${tab === t.id? "bg-white shadow text-black scale-[1.02]" : "text-black/50 hover:text-black"}`}>{t.l}</button>
              ))}
            </div>

            {/* TAB CONTENT */}
            <div className="mt-6 min-h-[180px]">
              {tab === "about" && (
                <div>
                  <h3 className="font-bold text-[16px]">About {data.shopName}</h3>
                  <p className="mt-3 text-[14px] leading-[1.7] text-black/70">{data.about}</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-[12px] bg-black/[0.03]"><p className="text-[11px] text-black/50">PHONE</p><p className="text-[13px] font-semibold mt-1">{data.phone}</p></div>
                    <div className="p-3 rounded-[12px] bg-black/[0.03]"><p className="text-[11px] text-black/50">ADDRESS</p><p className="text-[13px] font-semibold mt-1">{data.address}</p></div>
                  </div>
                  <Link href={`/profile/cafe/${username}/edit`} className="mt-4 inline-block text-[12px] text-blue-600">Edit About →</Link>
                </div>
              )}
              {tab === "story" && (
                <div>
                  <h3 className="font-bold text-[16px]">Our Story</h3>
                  <p className="mt-3 text-[14px] leading-[1.7] text-black/70">{data.story}</p>
                  <div className="mt-4 p-4 rounded-[14px] bg-[#FFF7ED] border border-orange-200"><p className="text-[13px] italic">“We started with a dream to serve best chai in Siliguri” — {data.ownerName}</p></div>
                </div>
              )}
              {tab === "menu" && (
                <div>
                  <div className="flex justify-between items-center"><h3 className="font-bold text-[16px]">Full Menu ({data.menu.length})</h3><span className="text-[11px] px-2 py-1 bg-green-100 text-green-700 rounded-full">{cart.length} in cart • ₹{getTotal()}</span></div>
                  <div className="mt-4 divide-y divide-black/5">
                    {data.menu.map((m: any) => (
                      <div key={m.id} className="py-4 flex justify-between items-center group">
                        <div className="flex gap-3"><div className={`w-2 h-2 rounded-full mt-2 ${m.veg? "bg-green-600" : "bg-red-600"}`} /><div><p className="text-[14px] font-semibold flex gap-2">{m.name} {m.popular && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full">POPULAR</span>}</p><p className="text-[12px] text-black/50 mt-0.5">{m.desc}</p></div></div>
                        <div className="flex items-center gap-3"><p className="font-bold">₹{m.price}</p><button onClick={() => addToCart(m)} className="px-3 py-1.5 rounded-full border border-black/10 text-[12px] font-bold hover:bg-black hover:text-white transition">ADD</button></div>
                      </div>
                    ))}
                  </div>
                  {cart.length > 0 && <button onClick={handleOrder} className="mt-5 w-full h-[50px] rounded-full text-white font-bold" style={{ background: RED }}>Place Order ₹{getTotal()} • {cart.length} items</button>}
                </div>
              )}
              {tab === "gallery" && (
                <div className="grid grid-cols-3 gap-2">
                  {[1,2,3,4,5,6,7,8,9].map(i=>(
                    <img key={i} onClick={()=>setShowImg(`https://picsum.photos/400?random=${i}`)} src={`https://picsum.photos/200?random=${i}`} className="h-[110px] w-full object-cover rounded-[14px] cursor-pointer hover:opacity-80" alt="" />
                  ))}
                </div>
              )}
              {tab === "reviews" && (
                <div>
                  <h3 className="font-bold">Customer Reviews</h3>
                  <div className="mt-3 flex gap-2"><input value={reviewText} onChange={e=>setReviewText(e.target.value)} placeholder="Write your review..." className="flex-1 h-[44px] border rounded-full px-4 text-[13px] outline-none" /><button onClick={handleAddReview} className="px-6 h-[44px] rounded-full bg-black text-white text-[13px]">Post</button></div>
                  <div className="mt-5 space-y-4">{reviews.map((r,i)=><div key={i} className="flex gap-3 p-3 rounded-[12px] bg-black/[0.02]"><div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-[12px]">{r.name[0]}</div><div className="flex-1"><div className="flex justify-between"><p className="text-[13px] font-semibold">{r.name}</p><p className="text-[11px] text-black/40">{r.time}</p></div><p className="text-[11px] text-yellow-500">{"★".repeat(r.rating)}</p><p className="text-[13px] mt-1 text-black/70">{r.text}</p></div></div>)}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-[20px] p-4 border border-black/5">
            <h3 className="font-semibold flex justify-between">Cart ({cart.length}) <button onClick={()=>setCart([])} className="text-[11px] text-red-500">Clear</button></h3>
            {cart.length===0? <p className="text-[12px] text-black/40 mt-3">No items. Add from Menu.</p> : <><div className="mt-3 space-y-2 max-h-[200px] overflow-auto">{cart.map((c,i)=><div key={i} className="flex justify-between text-[13px]"><span>{c.name}</span><span className="flex gap-2">₹{c.price} <button onClick={()=>removeFromCart(i)} className="text-red-500">x</button></span></div>)}</div><div className="mt-3 pt-3 border-t flex justify-between font-bold"><span>Total</span><span>₹{getTotal()}</span></div><button onClick={handleOrder} className="mt-3 w-full h-[44px] rounded-[12px] text-white font-bold" style={{ background: RED }}>Checkout</button></>}
          </div>
          <div className="bg-white rounded-[20px] p-4 border border-black/5"><h3 className="font-semibold">Gallery</h3><div className="grid grid-cols-3 gap-2 mt-3">{[10,11,12,13,14,15].map(i=><img key={i} onClick={()=>setShowImg(`https://picsum.photos/400?random=${i}`)} src={`https://picsum.photos/200?random=${i}`} className="h-[80px] w-full object-cover rounded-[12px] cursor-pointer" alt="" />)}<button onClick={()=>setTab("gallery")} className="col-span-3 mt-2 h-[36px] rounded-[10px] bg-black/5 text-[12px]">View All 24 Photos</button></div></div>
          <div className="bg-white rounded-[20px] p-4 border border-black/5"><h3 className="font-semibold">Location</h3><div className="mt-3 h-[140px] rounded-[12px] bg-black/5 flex items-center justify-center text-[12px] text-black/50">📍 {data.address}</div><button onClick={handleDirections} className="mt-3 w-full h-[42px] rounded-[12px] bg-black text-white text-[13px]">Open in Google Maps</button></div>
        </div>
      </div>

      {/* BOOKING MODAL */}
      {showBook && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-[400px] bg-white rounded-[20px] p-6">
            <div className="flex justify-between"><h3 className="font-bold text-[18px]">Book Table at {data.shopName}</h3><button onClick={()=>setShowBook(false)} className="w-8 h-8 rounded-full bg-black/5">✕</button></div>
            <input value={booking.name} onChange={e=>setBooking({...booking, name:e.target.value})} placeholder="Your Name *" className="mt-4 w-full h-[44px] border rounded-[12px] px-4 text-[13px]" />
            <input value={booking.phone} onChange={e=>setBooking({...booking, phone:e.target.value})} placeholder="Phone *" className="mt-3 w-full h-[44px] border rounded-[12px] px-4 text-[13px]" />
            <div className="grid grid-cols-2 gap-2 mt-3"><input type="date" value={booking.date} onChange={e=>setBooking({...booking, date:e.target.value})} className="h-[44px] border rounded-[12px] px-3 text-[13px]" /><input type="time" value={booking.time} onChange={e=>setBooking({...booking, time:e.target.value})} className="h-[44px] border rounded-[12px] px-3 text-[13px]" /></div>
            <select value={booking.guests} onChange={e=>setBooking({...booking, guests:e.target.value})} className="mt-3 w-full h-[44px] border rounded-[12px] px-3 text-[13px]"><option>1 Guest</option><option>2 Guests</option><option>3 Guests</option><option>4 Guests</option><option>5+ Guests</option></select>
            <button onClick={handleBooking} className="mt-5 w-full h-[48px] rounded-full text-white font-bold" style={{ background: RED }}>Confirm Booking</button>
          </div>
        </div>
      )}

      {/* IMAGE LIGHTBOX */}
      {showImg && (
        <div onClick={()=>setShowImg(null)} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"><img src={showImg} className="max-w-full max-h-[90vh] rounded-[16px]" alt="" /></div>
      )}
    </div>
  );
}