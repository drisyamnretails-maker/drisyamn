"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

const DARK_GREEN = "#1A4D2E";
const BG = "#E9E1C8";

export default function CafeProfileNew() {
  const { username } = useParams() as { username: string };
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("about");
  const [showMedia, setShowMedia] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`drisyamn_cafe_${username}`);
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      // fallback demo if nothing in localStorage
      setData({
        shopName: "sobha R",
        category: "Tea Stall",
        cat: "Tea Stall • Cafe • Hangout",
        address: "Matigara, Siliguri, WB 734010",
        phone: "9876543210",
        location: "",
        about: "We serve fresh chai, momos and fast food. Best place for friends and family. Clean, cozy, affordable.",
        story: "Founded in 2021 by Rohan, started as small tea stall near Matigara, now a favorite hangout for Siliguri youth.",
        whyChoose: "Best chai, quick service, cozy ambiance, affordable price, friendly staff.",
        cover: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200",
        dp: "",
        gallery: [],
        menu: [
          { name: "Masala Chai", desc: "Spiced tea with milk • Popular", price: "30", image: "" },
          { name: "Chicken Momo", desc: "Steamed juicy momos", price: "120", image: "" },
        ],
      });
    }
  }, [username]);

  if (!data) return <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>Loading...</div>;

  const handleCall = () => {
    window.location.href = `tel:${data.phone}`;
  };

  const handleDirections = () => {
    if (data.location && data.location.startsWith("http")) {
      window.open(data.location, "_blank");
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.shopName + " " + data.address)}`, "_blank");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: data.shopName, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  return (
    <div className="min-h-screen w-full pb-10" style={{ background: BG }}>
      {/* NAV BAR - SAME AS CREATE PAGE - DRISYAMN MIDDLE BIG + TAGLINE */}
      <div className="max-w-[1300px] mx-auto sticky top-2 z-20">
        <div className="mx-2 bg-white rounded-[14px] border border-black/5 shadow-sm h-[58px] px-3 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link href="/" className="flex flex-col items-center text-[11px] text-[#1A4D2E] font-bold">
              <span className="text-[18px]">🏠</span>Home
            </Link>
            <span className="flex flex-col items-center text-[11px] text-black/50">💬 Message</span>
            <span className="flex flex-col items-center text-[11px] text-black/50">🔔 Notification</span>
            <span className="hidden md:flex flex-col items-center text-[11px] text-black/50">📝 Notifica..</span>
            <span className="flex flex-col items-center text-[11px] text-black/50">📚 Books</span>
          </div>

          <div className="flex flex-col items-center">
            <h1 className="text-[26px] font-black leading-none tracking-tighter" style={{ fontFamily: "Georgia, serif", fontWeight: 900 }}>
              Drisyamn
            </h1>
            <p className="text-[8px] tracking-[0.18em] uppercase text-black/50 font-semibold">Discover Everything Around You</p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="hidden md:block px-3 py-1.5 rounded-full border text-[11px]">Share</button>
            <Link href={`/create-profile/cafe/${username}`} className="px-4 py-1.5 rounded-full text-white text-[12px] font-bold hover:opacity-90" style={{ background: DARK_GREEN }}>
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto p-2 md:p-4 grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-4 mt-3">
        {/* LEFT MAIN */}
        <div className="space-y-4">
          <div className="bg-white rounded-[20px] overflow-hidden border border-black/5 shadow-sm">
            {/* COVER FIT TO COVER */}
            <div className="relative h-[280px] md:h-[340px] w-full bg-black/5">
              <img src={data.cover} className="w-full h-full object-cover" alt="cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute -bottom-[36px] left-1/2 -translate-x-1/2">
                <div className="w-[76px] h-[76px] rounded-full bg-white border-[4px] border-white shadow-xl overflow-hidden flex items-center justify-center">
                  {data.dp? <img src={data.dp} className="w-full h-full object-cover" alt="dp" /> : <span className="text-[34px]">☕</span>}
                </div>
              </div>
            </div>

            <div className="pt-12 p-5 md:p-6 text-center">
              <h2 className="text-[22px] font-bold">{data.shopName} <span className="text-[#1A4D2E]">✓</span></h2>
              <p className="text-[13px] text-black/60 mt-1">{data.cat || `${data.category} • Cafe • Hangout`}</p>
              <p className="text-[13px] mt-2 flex items-center justify-center gap-2">
                <span>⭐ 4.6 (342 reviews)</span> <span>•</span> <span>📍 1.2km away</span> <span>•</span> <span className="text-green-600 font-semibold">Open now</span>
              </p>
              <p className="text-[12px] text-black/50 mt-1">{data.address}</p>

              {/* CALL + DIRECTIONS - DARK GREEN */}
              <div className="grid grid-cols-2 gap-3 mt-5 max-w-[420px] mx-auto">
                <button onClick={handleCall} className="h-[46px] rounded-[12px] text-white font-bold text-[14px] flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition" style={{ background: DARK_GREEN }}>
                  📞 Call Now
                </button>
                <button onClick={handleDirections} className="h-[46px] rounded-[12px] text-white font-bold text-[14px] flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition" style={{ background: DARK_GREEN }}>
                  📍 Directions
                </button>
              </div>

              {/* TABS - About / Story / Gallery / Reviews */}
              <div className="mt-6 flex gap-1.5 p-1.5 rounded-full bg-black/[0.04] overflow-x-auto scrollbar-hide justify-start md:justify-center">
                <button onClick={() => setActiveTab("about")} className={`px-5 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition ${activeTab==="about"? "bg-white shadow font-bold" : "text-black/50"}`}>ⓘ About Us</button>
                <button onClick={() => setActiveTab("story")} className={`px-5 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition ${activeTab==="story"? "bg-white shadow font-bold" : "text-black/50"}`}>📖 Our Story</button>
                <button onClick={() => setActiveTab("gallery")} className={`px-5 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition ${activeTab==="gallery"? "bg-white shadow font-bold" : "text-black/50"}`}>🖼️ Gallery</button>
                <button onClick={() => setActiveTab("reviews")} className={`px-5 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition ${activeTab==="reviews"? "bg-white shadow font-bold" : "text-black/50"}`}>💬 Reviews</button>
              </div>

              <div className="mt-6 text-left">
                {activeTab==="about" && (
                  <div className="space-y-4">
                    <p className="text-[14px] leading-7 text-black/70">{data.about}</p>
                    {data.whyChoose && (
                      <div className="p-4 rounded-[14px] bg-[#F7F5EB] border border-black/5">
                        <h4 className="font-bold text-[14px]">Why People Choose Us</h4>
                        <p className="text-[13px] leading-6 mt-1 text-black/60">{data.whyChoose}</p>
                      </div>
                    )}
                  </div>
                )}
                {activeTab==="story" && <p className="text-[14px] leading-7 text-black/70">{data.story}</p>}
                {activeTab==="gallery" && (
                  <div>
                    <p className="text-[11px] text-black/40 mb-3">Images fit to cover, videos playable - same flow as photo</p>
                    {(!data.gallery || data.gallery.length===0)? (
                      <div className="h-[120px] border-2 border-dashed rounded-[14px] flex items-center justify-center text-[13px] text-black/30">No Gallery Added</div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {data.gallery.map((g:any, i:number)=>(
                          <div key={i} onClick={()=>setShowMedia(g)} className="h-[130px] rounded-[14px] overflow-hidden cursor-pointer bg-black/5 border group">
                            {g.type==="video"? <video src={g.url} className="w-full h-full object-cover group-hover:scale-105 transition" muted /> : <img src={g.url} className="w-full h-full object-cover group-hover:scale-105 transition" alt="" />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {activeTab==="reviews" && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-[12px] bg-black/[0.02] border"><p className="text-[13px] font-bold">Rahul • ⭐⭐⭐⭐⭐</p><p className="text-[12px] text-black/60 mt-1">Best chai in Matigara, must try!</p></div>
                    <div className="p-3 rounded-[12px] bg-black/[0.02] border"><p className="text-[13px] font-bold">Anjali • ⭐⭐⭐⭐</p><p className="text-[12px] text-black/60 mt-1">Cozy ambience, quick service.</p></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - MENU + GALLERY SAME FLOW */}
        <div className="space-y-4">
          <div className="bg-white rounded-[20px] p-5 border border-black/5 shadow-sm">
            <div className="flex justify-between items-center"><h3 className="font-bold text-[16px]">Gallery</h3><span className="text-[11px] text-black/40">▼</span></div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {(data.gallery||[]).slice(0,4).map((g:any,i:number)=>(
                <div key={i} onClick={()=>setShowMedia(g)} className="h-[110px] rounded-[14px] overflow-hidden cursor-pointer bg-black/5">
                  {g.type==="video"? <video src={g.url} className="w-full h-full object-cover" muted /> : <img src={g.url} className="w-full h-full object-cover" alt="" />}
                </div>
              ))}
              {Array.from({length: Math.max(0,4-(data.gallery?.length||0))}).map((_,i)=>(
                <div key={`ph-${i}`} className="h-[110px] rounded-[14px] bg-black/5 flex items-center justify-center text-[10px] text-black/20">Photo</div>
              ))}
            </div>
            <button onClick={()=>setActiveTab("gallery")} className="mt-3 w-full h-[38px] rounded-full border text-[12px] font-medium">View All Gallery</button>
          </div>

          <div className="bg-white rounded-[20px] p-5 border border-black/5 shadow-sm">
            <h3 className="font-bold text-[16px]">Menu - Image / Name / Desc / Price</h3>
            <p className="text-[11px] text-black/40 mt-1">Single Menu Only</p>
            <div className="mt-4 divide-y divide-black/5">
              {(data.menu||[]).map((m:any,i:number)=>(
                <div key={i} className="py-3 flex gap-3 items-center">
                  <div className="w-[52px] h-[52px] rounded-[10px] overflow-hidden bg-black/5 shrink-0">
                    {m.image? <img src={m.image} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-[10px]">No Img</div>}
                  </div>
                  <div className="flex-1"><p className="font-bold text-[14px]">{m.name}</p><p className="text-[11px] text-black/50 line-clamp-1">{m.desc}</p></div>
                  <p className="font-black text-[14px]" style={{ color: DARK_GREEN }}>₹{m.price}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[20px] p-5 border border-black/5 shadow-sm">
            <h3 className="font-bold text-[14px]">Contact</h3>
            <p className="text-[13px] mt-2">📞 {data.phone}</p>
            <p className="text-[12px] mt-1 text-black/60">{data.address}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={handleCall} className="h-[40px] rounded-[10px] text-white text-[13px] font-bold" style={{ background: DARK_GREEN }}>Call</button>
              <button onClick={handleDirections} className="h-[40px] rounded-[10px] text-white text-[13px] font-bold" style={{ background: DARK_GREEN }}>Directions</button>
            </div>
          </div>
        </div>
      </div>

      {showMedia && (
        <div onClick={()=>setShowMedia(null)} className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">
          <div className="max-w-[90vw] max-h-[90vh]">
            {showMedia.type==="video"? <video src={showMedia.url} className="max-h-[90vh] rounded-[16px]" controls autoPlay /> : <img src={showMedia.url} className="max-h-[90vh] rounded-[16px]" alt="" />}
          </div>
        </div>
      )}
    </div>
  );
}