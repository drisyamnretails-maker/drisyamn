"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

type Service = {
  id: string; author: string; avatar: string; name: string;
  works: string; subWorks: string; media: string; category: string;
  rating: number; jobs: number; price: string; oldPrice: string;
  location: string;
};

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("Salon");

  const categories = ["Salon","Doctor","Plumber","Electrician","Cleaning","Car Wash","AC Repair","Photography","Tuition","Carpenter","Painter"];
  const catIcons: Record<string,string> = {
    Plumber:"🚿", Electrician:"💡", Salon:"💇", Cleaning:"🧹",
    "Car Wash":"🚗", "AC Repair":"❄️", Photography:"📸",
    Tuition:"📚", Carpenter:"🪚", Painter:"🎨", Doctor:"🩺"
  };

  useEffect(() => {
    const global = safeParse("drisyamn_global_posts_v2", []);
    const serviceRaw = safeParse("drisyamn_service_products", []);
    const shopRaw = safeParse("service_posts", []);
    const allRaw = [...serviceRaw,...shopRaw,...global];

    const map: Service[] = allRaw.map((p:any,i:number)=>({
      id: p.id || genId(),
      author: p.author || `expert_${i}`,
      avatar: p.avatar || `https://i.pravatar.cc/100?img=${20+i}`,
      name: p.name || p.author || "Expert",
      works: p.works || p.title || p.text?.slice(0,28) || "Expert Service Work",
      subWorks: p.subWorks || p.desc?.slice(0,28) || "Verified • Fast service",
      media: (Array.isArray(p.media)? p.media[0] : p.media) || p.img || `https://images.unsplash.com/photo-${["1560869713-7d0a29430803","1559757148-5c350d0d3c56","1581578731548-c64695cc6952"][i%3]}?w=600`,
      category: p.serviceCategory || p.category || categories[i % categories.length],
      rating: Number(p.rating) || 4.7,
      jobs: p.jobs || 72,
      price: p.price || `₹${[1974,599,299,199,799][i%5]}`,
      oldPrice: p.oldPrice || `₹${[4191,999,599,399,1499][i%5]}`,
      location: p.location || "Matigara",
    })).filter((p:any)=> p.category!=="All" && p.category!=="Reels");

    if (map.length < 4) {
      const demo: Service[] = Array.from({length: 12}).map((_,i)=>({
        id: genId(),
        author: ["sunita_makeup","dr_vikash","ramesh_kumar","aman_elec","priya_clean","arjun_wash","suresh_ac","kajal_studio","anil_tuition","bikash_carp","pappu_paint","neha_doc"][i],
        avatar: `https://i.pravatar.cc/100?img=${30+i}`,
        name: ["Sunita Roy","Dr. Vikash Sharma","Ramesh Kumar","Aman Electrician","Priya Cleaning","Arjun Car Wash","Suresh AC Repair","Kajal Studio","Anil Tuition","Bikash Carpenter","Pappu Painter","Dr. Neha"][i],
        works: ["Bridal Makeup HD Work","Home Doctor Visit Expert","Plumbing Repair Work Pro","Wiring Lighting Work Pro","Deep House Cleaning Pro","Foam Car Wash At Home","AC Service Gas Fill Pro","Wedding Photography 4K","Maths Tuition Class 10-12","Furniture Door Repair","Wall Painting Interior","Home Visit 24x7 Doctor"][i],
        subWorks: ["5 Yrs Exp • Products Incl","MBBS • 10 yrs • 24x7","Pipe Leakage • 8 yrs exp","Licensed • Same Day Service","Kitchen Bathroom • 2 staff","Interior Cleaning Service","All Brands • 1 Yr Warranty","Pre-Wedding + Drone","CBSE ICSE • Maths Science","Bed Sofa Door Work","Interior Exterior Paint","Child Specialist MBBS"][i],
        media: `https://images.unsplash.com/photo-${["1560869713-7d0a29430803","1559757148-5c350d0d3c56","1581578731548-c64695cc6952","1621905251189-08b45d6a269e","1527515637462-d4ff94c8dc4a"][i%5]}?w=600`,
        category: categories[i % categories.length],
        rating: 4.7,
        jobs: 72,
        price: `₹${[1974,599,299,199,799,399,499,2999,999,499,1999,599][i]}`,
        oldPrice: `₹${[4191,999,599,399,1499,799,999,4999,1999,999,3999,999][i]}`,
        location: i%2===0? "Matigara" : "City Center",
      }));
      setServices(demo);
    } else {
      setServices(map);
    }
  }, []);

  const filtered = useMemo(()=>{
    let f = services.filter(s=> s.category===cat);
    if(search) f = f.filter(s=> s.name.toLowerCase().includes(search.toLowerCase()) || s.works.toLowerCase().includes(search.toLowerCase()) || s.author.toLowerCase().includes(search.toLowerCase()));
    return f;
  },[services, cat, search]);

  const isBookable = (c:string) => ["Salon","Doctor"].includes(c);

  return (
    <div className="min-h-screen pb-24" style={{background: PAGE_BG}}>
      <nav className="max-w-[1280px] mx-auto mt-4 h-[60px] flex items-center justify-between px-5 rounded-[20px] sticky top-4 z-50" style={prettyBox}>
        <Link href="/homefeed" className="font-black text-[19px]">Drisyamn<span className="text-[#E86A33]">.</span></Link>
        <div className="flex-1 max-w-[400px] mx-4 hidden md:flex">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search expert..." className="w-full bg-[#F6F1E6] border rounded-full px-4 py-2 text-[12px] outline-none" />
        </div>
        <div className="flex gap-2">
          <Link href="/homefeed" className="px-4 py-1.5 rounded-full bg-[#1F3A4A] text-white text-[11px] font-bold">Home</Link>
          <Link href="/homefeed/retails" className="px-4 py-1.5 rounded-full bg-[#F6F1E6] border text-[11px] font-bold">Retails</Link>
        </div>
      </nav>

      {/* Mobile Search - FIXED */}
      <div className="max-w-[1280px] mx-auto mt-3 px-4 md:hidden">
        <div className="rounded-[14px] p-2" style={prettyBox}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search expert, works..." className="w-full bg-[#F6F1E6] border rounded-full px-4 py-2.5 text-[12px] outline-none" />
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto mt-4 px-4">
        <div className="rounded-[18px] p-3 flex gap-2 overflow-x-auto scrollbar-hide" style={prettyBox}>
          {categories.map(c=>(
            <button key={c} onClick={()=>setCat(c)} className={`px-3.5 py-2 rounded-full text-[10px] font-bold whitespace-nowrap border-2 transition ${cat===c? "border-white shadow text-black":"bg-[#F6F1E6] border-transparent"}`} style={cat===c? {background:BOOK_COLOR}:{}}>
              {catIcons[c]} {c}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto mt-5 px-4 grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-9">
          <h2 className="font-black text-[15px] mb-4">{cat} • {filtered.length} Experts</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(s=>(
              <div key={s.id} className="bg-white rounded-[20px] border-[4px] border-white shadow-[0_8px_20px_rgba(0,0,0,0.10)] overflow-hidden flex flex-col hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)] transition">

                <div className="relative h-[210px] bg-[#F6F1E6] rounded-[14px] m-1 overflow-hidden">
                  <img src={s.media} alt="" className="w-full h-full object-cover" />
                  {/* FIX 1: News -> Category */}
                  <div className="absolute top-2.5 left-2.5 bg-[#E86A33] text-white text-[10px] font-black px-3 py-1 rounded-full shadow">{s.category}</div>
                  <div className="absolute top-2.5 right-2.5 bg-white text-black text-[10px] font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                    <span className="text-[#FFB400]">★</span> {s.rating} • {s.jobs} sold
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 bg-black/80 text-white text-[10px] font-bold px-3 py-1 rounded-full">📍 {s.location}</div>
                </div>

                <div className="px-4 pt-3 pb-4 flex flex-col flex-1">
                  {/* FIX 2: Name + @author both */}
                  <div className="flex items-center gap-2">
                    <img src={s.avatar} alt="" className="w-6 h-6 rounded-full border" />
                    <span className="text-[12px] font-black truncate">{s.name}</span>
                    <span className="text-[10px] text-[#6B7A8F] truncate">@{s.author}</span>
                  </div>

                  <h3 className="mt-2 font-bold text-[12px] leading-[16px] line-clamp-1 text-black">{s.works}</h3>
                  <p className="text-[11px] text-black/40 line-clamp-1 leading-[14px]">{s.subWorks}</p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-[#F6F1E6] text-[9px] font-bold border">{catIcons[s.category]} {s.category}</span>
                    <span className="text-[10px] font-bold">⭐ {s.rating}</span>
                    <span className="text-[10px] opacity-50">({s.jobs} jobs)</span>
                  </div>

                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="font-black text-[16px]">{s.price}</span>
                    <span className="text-[11px] line-through opacity-30">{s.oldPrice}</span>
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">50% OFF</span>
                  </div>

                  <div className="mt-3.5 grid grid-cols-2 gap-2">
                    {isBookable(s.category)? (
                      <>
                        <button onClick={()=> router.push(`/profile/services/${s.author}`)} className="py-2.5 rounded-full bg-[#FFF6E0] text-[11px] font-bold border hover:bg-[#FFEEC2]">View Shop</button>
                        <button onClick={(e)=>{e.stopPropagation(); router.push(`/profile/services/${s.author}/book?service=${s.id}`)}} className="py-2.5 rounded-full text-black text-[11px] font-black shadow border-2 border-white" style={{background:BOOK_COLOR}}>Book Now</button>
                      </>
                    ) : (
                      <>
                        <button onClick={()=> window.location.href=`tel:+919999999999`} className="py-2.5 rounded-full bg-[#FFF6E0] text-[11px] font-bold border hover:bg-[#FFEEC2]">📞 Call</button>
                        <button onClick={(e)=>{e.stopPropagation(); router.push(`/profile/services/${s.author}/book?service=${s.id}`)}} className="py-2.5 rounded-full bg-[#1F2A37] text-white text-[11px] font-bold shadow">💬 Message</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length===0 && <div className="mt-10 text-center py-20 bg-white rounded-[20px] border-4 border-white shadow opacity-40">No experts in {cat}</div>}
        </div>

        <div className="col-span-12 lg:col-span-3">
          <div className="rounded-[18px] p-3 sticky top-20 space-y-3" style={prettyBox}>
            <div className="bg-[#1F3A4A] text-white rounded-[14px] p-4 text-center">
              <div className="font-black text-[13px]">List Your Service Free</div>
              <div className="text-[10px] opacity-60 mt-1">Get 50+ bookings/month</div>
              <Link href="/profile/services/create" className="block mt-3 py-2 rounded-full bg-white text-black text-[11px] font-bold">Create Profile +</Link>
            </div>
            <div className="bg-[#FFB57D] text-black rounded-[14px] p-4 text-center border-2 border-white shadow">
              <div className="font-black text-[12px]">Promote Service</div>
              <div className="text-[10px] mt-1">Top pe dikho ₹300/day</div>
              <button className="w-full mt-2 py-2 rounded-full bg-black text-white text-[10px] font-bold">Promote Now</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}.line-clamp-1{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}`}</style>
    </div>
  );
}