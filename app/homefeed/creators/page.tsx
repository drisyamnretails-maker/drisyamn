"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ORANGE = "#E86A33";
const DARK = "#1F3A4A";
const PAGE_BG = "#EDE6D3";
const CARD_BG = "#FFFEFB";
const BOOK_COLOR = "#FFB57D";

const prettyBox: React.CSSProperties = {
  background: CARD_BG,
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 0 0 8px #FFFFFF, 0 0 0 9px rgba(0,0,0,0.10), 0 16px 40px rgba(62,42,20,0.14)",
};

const safeParse = (k: string, f: any) => {
  try { const v = localStorage.getItem(k); return v? JSON.parse(v) : f; } catch { return f; }
};
const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2,8)}`;

type CreatorItem = {
  id: string; name: string; handle: string; city: string;
  title: string; img: string; views: string; likes: number;
  duration: string; verified: boolean; category: string; works: string;
};

export default function CreatorsPage() {
  const router = useRouter();
  const [sidebar, setSidebar] = useState(true);
  const [liked, setLiked] = useState<string[]>([]);
  const [filter, setFilter] = useState("Trending");
  const [search, setSearch] = useState("");
  const [creators, setCreators] = useState<CreatorItem[]>([]);

  const tabs = ["Trending","New","Verified","Dance","Food","Travel","Education"] as const;
  const catIcons: Record<string,string> = {
    Trending:"🔥", New:"✨", Verified:"✔️", Dance:"💃", Food:"🍔", Travel:"✈️", Education:"📚"
  };

  useEffect(() => {
    const savedLikes = safeParse("drisyamn_liked_creators", []);
    setLiked(savedLikes);

    const global = safeParse("drisyamn_global_posts_v2", []);
    const creatorRaw = safeParse("drisyamn_creator_posts", []);
    const allRaw = [...creatorRaw,...global].filter((p:any)=>
      p.category==="Creators" || p.category==="Reels" || p.type==="creator" || p.category==="Dance" || p.category==="Food"
    );

    let map: CreatorItem[] = allRaw.map((p:any,i:number)=>({
      id: p.id || genId(),
      name: p.name || p.author || `Creator ${i}`,
      handle: p.handle || `@${(p.author||"creator"+i).toLowerCase()}`,
      city: p.city || p.location || "Siliguri",
      title: p.title || p.text?.slice(0,40) || "My new vlog - must watch",
      works: p.works || p.title || "Video Editing • Vlogging",
      img: (Array.isArray(p.media)? p.media[0] : p.media) || p.img || `https://images.unsplash.com/photo-${["1506905925346-21bda4d32df4","1555939594-58d7cb561ad1","1603006905003-be475563bc59","1452587925148-ce544e77e70d"][i%4]}?w=500&q=80`,
      views: p.views || `${Math.floor(Math.random()*50+1)}k`,
      likes: p.likes || Math.floor(Math.random()*900+50),
      duration: p.duration || `0:${Math.floor(Math.random()*50+10)}`,
      verified: p.verified || i%2===0,
      category: p.serviceCategory || p.category || (["Dance","Food","Travel","Education","Trending"][i%5]),
    }));

    if(map.length < 4){
      map = [
        { id: genId(), name: "Maya Chen", handle: "@mayachen", city: "Manali", title: "Sunset Trail Trek - 15s you need to see", works:"Travel Vlog • Trekking", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80", views: "12.4k", likes: 210, duration: "0:42", verified: true, category:"Travel" },
        { id: genId(), name: "Arjun Mehra", handle: "@arjun", city: "Delhi", title: "Street Food Challenge - Momos 100 pcs", works:"Food • Challenge Video", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80", views: "45k", likes: 892, duration: "1:20", verified: true, category:"Food" },
        { id: genId(), name: "Lina Cruz", handle: "@linacruz", city: "Jaipur", title: "My handmade candle process - full vlog", works:"DIY • Handmade", img: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&q=80", views: "8.1k", likes: 124, duration: "0:55", verified: false, category:"Education" },
        { id: genId(), name: "Zaid Khan", handle: "@zaid", city: "Mumbai", title: "Photography tips - Golden hour trick", works:"Photography • Tips", img: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=500&q=80", views: "22k", likes: 445, duration: "0:30", verified: true, category:"Education" },
        { id: genId(), name: "Sneha Patel", handle: "@sneha", city: "Pune", title: "Makeup Transition - Before/After", works:"Makeup • Transition", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80", views: "31k", likes: 672, duration: "0:18", verified: false, category:"Dance" },
        { id: genId(), name: "Rohit Vlog", handle: "@rohitvlog", city: "Siliguri", title: "Bike Ride to Darjeeling - Day 1", works:"Bike Ride • Vlog", img: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&q=80", views: "18k", likes: 321, duration: "2:10", verified: false, category:"Travel" },
      ];
    }
    setCreators(map);
  }, []);

  const toggleLike = (id: string) => {
    setLiked(prev=>{
      const next = prev.includes(id)? prev.filter(i=>i!==id) : [...prev, id];
      localStorage.setItem("drisyamn_liked_creators", JSON.stringify(next));
      return next;
    });
  };

  const filtered = useMemo(()=>{
    let f = creators.filter(c=>{
      if(filter==="Verified") return c.verified;
      if(filter==="Trending") return c.likes>300;
      if(filter==="New") return true;
      return c.category===filter;
    });
    if(search) f = f.filter(c=> c.name.toLowerCase().includes(search.toLowerCase()) || c.title.toLowerCase().includes(search.toLowerCase()) || c.handle.toLowerCase().includes(search.toLowerCase()));
    return f;
  },[creators, filter, search]);

  return (
    <div className="min-h-screen px-4 pb-24" style={{background:PAGE_BG}}>
      <nav className="w-full max-w-[1280px] mx-auto mt-4 h-[60px] flex items-center justify-between px-5 rounded-[20px] sticky top-4 z-50" style={prettyBox}>
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebar(!sidebar)} className="w-9 h-9 rounded-full bg-[#F5EFE2] grid place-items-center text-[14px]">☰</button>
          <Link href="/homefeed" className="font-black text-[19px]">Drisyamn<span className="text-[#E86A33]">.</span></Link>
          <div className="hidden md:flex gap-2 ml-2">
            <Link href="/homefeed" className="px-4 py-1.5 rounded-full bg-[#F6F1E6] text-[11px] font-bold border">Home</Link>
            <Link href="/homefeed/retails" className="px-4 py-1.5 rounded-full bg-[#F6F1E6] text-[11px] font-bold border">Retails</Link>
            <Link href="/homefeed/services" className="px-4 py-1.5 rounded-full bg-[#F6F1E6] text-[11px] font-bold border">Services</Link>
            <span className="px-4 py-1.5 rounded-full text-white text-[11px] font-bold" style={{background:DARK}}>Creators</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search creator..." className="w-[220px] bg-[#F6F1E6] border rounded-full px-4 py-2 text-[11px] outline-none" />
          </div>
          <Link href="/create?type=creator" className="px-5 py-2 rounded-full text-white text-[11px] font-bold shadow" style={{background:ORANGE}}>+ Post</Link>
        </div>
      </nav>

      <div className="md:hidden max-w-[1280px] mx-auto mt-3">
        <div className="rounded-[14px] p-2" style={prettyBox}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search creator, video..." className="w-full bg-[#F6F1E6] border rounded-full px-4 py-2.5 text-[12px] outline-none" />
        </div>
      </div>

      <div className="w-full max-w-[1280px] mx-auto mt-4 flex gap-5">
        {sidebar && (
          <div className="w-[280px] hidden lg:block sticky top-[90px] h-fit space-y-4">
            <div className="rounded-[18px] p-5" style={prettyBox}>
              <div className="flex gap-3 items-center">
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80" className="w-11 h-11 rounded-full border-[3px] border-white shadow" alt="" />
                <div><div className="text-[10px] opacity-60">Creator</div><div className="font-bold text-[13px]">Alex Rivera</div></div>
              </div>
              <div className="mt-5 space-y-1 text-[12px]">
                <Link href="/homefeed" className="block px-4 py-2.5 rounded-[12px] hover:bg-[#F6F1E6]">🏠 Home Feed</Link>
                <div className="block px-4 py-2.5 rounded-[12px] text-white font-bold" style={{background:DARK}}>🎬 Creators</div>
                <Link href="/privacy-policy" className="block px-4 py-2.5 rounded-[12px] hover:bg-[#F6F1E6]">📄 Privacy</Link>
                <Link href="/terms-conditions" className="block px-4 py-2.5 rounded-[12px] hover:bg-[#F6F1E6]">📜 Terms</Link>
              </div>
            </div>
            <div className="rounded-[18px] p-4 text-center" style={prettyBox}>
              <div className="font-black text-[12px]">Become a Creator</div>
              <div className="text-[10px] opacity-60 mt-1">Earn from views</div>
              <Link href="/create?type=creator" className="block mt-3 py-2 rounded-full bg-black text-white text-[11px] font-bold">Start Creating</Link>
            </div>
          </div>
        )}

        <div className="flex-1">
          <div className="rounded-[18px] p-3 flex gap-2 overflow-x-auto scrollbar-hide mb-4" style={prettyBox}>
            {tabs.map(t=>(
              <button key={t} onClick={()=> setFilter(t)} className={`px-3.5 py-2 rounded-full text-[10px] font-bold whitespace-nowrap border-2 transition shrink-0 ${filter===t? "border-white shadow text-black":"bg-[#F6F1E6] border-transparent"}`} style={filter===t? {background:BOOK_COLOR}:{}}>
                {catIcons[t]} {t}
              </button>
            ))}
          </div>

          <h2 className="font-black text-[14px] mb-3">{filter} • {filtered.length} Videos</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-10">
            {filtered.map(c => (
              <div key={c.id} className="bg-white rounded-[20px] border-[4px] border-white shadow-[0_8px_20px_rgba(0,0,0,0.10)] overflow-hidden flex flex-col hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)] transition">

                {/* IMAGE 210px - FIXED SMALL */}
                <div className="relative h-[210px] bg-[#F6F1E6] rounded-[14px] m-1 overflow-hidden">
                  <img src={c.img} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-2.5 left-2.5 bg-[#E86A33] text-white text-[10px] font-black px-3 py-1 rounded-full shadow">{c.category}</div>
                  <div className="absolute top-2.5 right-2.5 bg-white text-black text-[10px] font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                    <span className="text-[#FFB400]">★</span> {c.likes} likes
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 bg-black/80 text-white text-[10px] font-bold px-3 py-1 rounded-full">📍 {c.city}</div>
                  <div className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">{c.duration}</div>
                  <div className="absolute inset-0 bg-black/10 grid place-items-center opacity-0 hover:opacity-100 transition">
                    <div className="w-10 h-10 bg-white rounded-full grid place-items-center shadow border-2 border-white text-[14px]">▶</div>
                  </div>
                </div>

                <div className="px-4 pt-3 pb-4 flex flex-col flex-1">
                  {/* Name + Handle */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#F5EFE2] border grid place-items-center text-[10px] font-bold">{c.name[0]}</div>
                    <span className="text-[12px] font-black truncate flex items-center gap-1">{c.name} {c.verified && <span className="text-white bg-[#2A8CFF] w-3 h-3 rounded-full grid place-items-center text-[7px]">✔</span>}</span>
                    <span className="text-[10px] opacity-50 truncate">{c.handle}</span>
                  </div>

                  <h3 className="mt-2 font-bold text-[12px] leading-[15px] line-clamp-1">{c.title}</h3>
                  <p className="text-[11px] text-black/40 line-clamp-1">{c.works}</p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-[#F6F1E6] text-[9px] font-bold border">{catIcons[c.category]||"🎬"} {c.category}</span>
                    <span className="text-[10px]">👁 {c.views}</span>
                    <span className="text-[10px]">❤️ {c.likes + (liked.includes(c.id)?1:0)}</span>
                  </div>

                  <div className="mt-3.5 grid grid-cols-2 gap-2">
                    <button onClick={()=> toggleLike(c.id)} className={`py-2.5 rounded-full text-[11px] font-bold border ${liked.includes(c.id)?'bg-black text-white':'bg-[#FFF6E0] hover:bg-[#FFEEC2]'}`}>
                      {liked.includes(c.id)?'❤️ Liked':'🤍 Like'}
                    </button>
                    <button onClick={()=> router.push(`/homefeed/creators/${c.id}`)} className="py-2.5 rounded-full text-black text-[11px] font-black shadow border-2 border-white" style={{background:BOOK_COLOR}}>
                      Watch
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length===0 && <div className="text-center py-20 bg-white rounded-[20px] border-4 border-white shadow opacity-40">No videos in {filter}</div>}
        </div>
      </div>

      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}.line-clamp-1{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}`}</style>
    </div>
  );
}