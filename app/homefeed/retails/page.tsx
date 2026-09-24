"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PAGE_BG = "#EDE6D3";
const CARD_BG = "#FFFEFB";
const prettyBox: React.CSSProperties = { background: CARD_BG, border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 0 0 8px #FFFFFF, 0 0 0 9px rgba(0,0,0,0.10), 0 16px 40px rgba(62,42,20,0.14)" };
const safeParse = (k:string,f:any)=>{ try{ const v=localStorage.getItem(k); return v? JSON.parse(v):f; }catch{ return f; } };
const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2,8)}`;

type Product = { id:string; author:string; avatar:string; title:string; desc:string; price:string; oldPrice?:string; media:string[]; location:string; category:string; rating:number; sales:number; createdAt:number };

export default function RetailsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [bannerIdx, setBannerIdx] = useState(0);

  const categories = ["All","Fashion","Electronics","Food","Grocery","Beauty","Footwear","Mobile","Home Decor","Kids"];
  const banners = [
    { id:1, title:"MEGA FASHION SALE", sub:"50-80% OFF • Siliguri Stores", img:"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200", cta:"Shop Now", color:"#FF3B30" },
    { id:2, title:"Matigara Food Fest", sub:"Free Delivery on ₹299+", img:"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200", cta:"Order Now", color:"#FF9500" },
    { id:3, title:"New Winter Collection", sub:"Trending in Siliguri", img:"https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200", cta:"Explore", color:"#1F3A4A" },
  ];

  useEffect(()=>{
    // Retail profile users ke products - drisyamn_global_posts + drisyamn_posts + retail_products
    const global = safeParse("drisyamn_global_posts_v2",[]);
    const retailRaw = safeParse("drisyamn_retail_products",[]);
    const shopRaw = safeParse("retail_posts",[]);
    const allRaw = [...retailRaw,...shopRaw,...global];

    const map: Product[] = allRaw.map((p:any, i:number)=>({
      id: p.id || genId(),
      author: p.author || `shop_${i}`,
      avatar: p.avatar || `https://i.pravatar.cc/100?u=${p.author}`,
      title: p.title || p.text?.slice(0,40) || p.productName || `Product ${i+1}`,
      desc: p.desc || p.text || "Best quality product in Siliguri",
      price: p.price || `₹${Math.floor(Math.random()*2000)+299}`,
      oldPrice: p.oldPrice || `₹${Math.floor(Math.random()*3000)+1500}`,
      media: p.media || (p.img? [p.img] : p.image? [p.image] : [`https://images.unsplash.com/photo-${[1523275335684,1445205170230,1542291026][i%3]}?w=500`]),
      location: p.location || "Matigara",
      category: p.retailCategory || p.category || categories[Math.floor(Math.random()*categories.length)],
      rating: p.rating || (4 + Math.random()).toFixed(1) as any,
      sales: p.sales || Math.floor(Math.random()*500)+10,
      createdAt: p.createdAt || Date.now()-i*10000
    })).filter((p:any)=> p.category!=="Reels");

    // Agar koi product nahi toh demo 12 products
    if(map.length < 3){
      const demo: Product[] = Array.from({length:12}).map((_,i)=>({
        id: genId(), author: `fashion_hub_${i}`, avatar:`https://i.pravatar.cc/100?img=${i+10}`,
        title: ["Winter Jacket","Nike Shoes","Saree Collection","iPhone Cover","Organic Honey","Lipstick Combo","Kids Dress","Home Lamp","Grocery Pack","Beauty Kit","Watch Men","Backpack"][i%12],
        desc: "Premium quality • Siliguri delivery • 7 day return",
        price: `₹${[899,1299,499,1999,299,699,899,1299,199,499,999,799][i]}`,
        oldPrice: `₹${[1999,2599,1299,2999,599,1299,1999,2499,399,999,1999,1599][i]}`,
        media: [`https://images.unsplash.com/photo-${["1489987707025-afc232f7ea0f","1542291026-7eec264c27ff","1485230895345-700a8d3dc397","1525598912003-14be4a28c4d1","1556228578-0d85b1a4d571","1596462502278-27bfdc403348"][i%6]}?w=500`],
        location: i%2? "City Center":"Matigara", category: categories[(i%9)+1], rating: (4.2 + Math.random()*0.7).toFixed(1) as any, sales: Math.floor(Math.random()*1000)+20, createdAt: Date.now()-i*100000
      }));
      setProducts(demo);
    } else {
      setProducts(map.sort((a,b)=> b.createdAt - a.createdAt));
    }

    // Banner auto slide
    const it = setInterval(()=> setBannerIdx(s=> (s+1)%banners.length), 4000);
    return ()=> clearInterval(it);
  },[]);

  const filtered = useMemo(()=>{
    let f = products;
    if(cat!=="All") f = f.filter(p=> p.category===cat);
    if(search) f = f.filter(p=> p.title.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase()));
    return f;
  },[products, cat, search]);

  const handleProductClick = (p: Product) => {
    // Visitor click -> respective owner profile
    router.push(`/profile/retails/${p.author}`);
  };
  const handleBookNow = (e: any, p: Product) => {
    e.stopPropagation();
    // Book now -> respective owner ke books/bookings me
    router.push(`/profile/retails/${p.author}/book?product=${p.id}`);
  };

  const ads = [
    { title:"Your Shop Here?", desc:"Reach 15k+ buyers in Siliguri", img:"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400", cta:"Advertise ₹500/day" },
    { title:"Boost Your Product", desc:"Top pe dikhao", img:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400", cta:"Promote Now" },
  ];

  return (
    <div className="min-h-screen pb-24" style={{background:PAGE_BG}}>
      {/* NAV */}
      <nav className="max-w-[1280px] mx-auto mt-6 h-[68px] flex items-center justify-between px-6 rounded-[22px] sticky top-6 z-50" style={prettyBox}>
        <Link href="/homefeed" className="font-black text-[22px]">Drisyamn<span className="text-[#E86A33]">.</span></Link>
        <div className="flex-1 max-w-[500px] mx-6 hidden md:flex">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products, shops, fashion..." className="w-full bg-[#F6F1E6] border rounded-full px-5 py-2.5 text-[13px] outline-none" />
        </div>
        <div className="flex gap-2">
          <Link href="/homefeed" className="px-4 py-2 rounded-full bg-[#1F3A4A] text-white text-[11px] font-bold">Home</Link>
          <Link href="/homefeed/reels" className="px-4 py-2 rounded-full bg-black text-white text-[11px] font-bold">🎬 Reels</Link>
          <Link href="/homefeed/retails" className="px-4 py-2 rounded-full bg-[#E86A33] text-white text-[11px] font-bold border-2 border-white shadow">🛍️ Retails</Link>
        </div>
      </nav>

      {/* BANNER - Top Shopping Style */}
      <div className="max-w-[1280px] mx-auto mt-8 px-4">
        <div className="rounded-[22px] overflow-hidden relative h-[220px] md:h-[340px] border-[8px] border-white shadow-xl" style={prettyBox}>
          {banners.map((b,i)=>(
            <div key={b.id} className={`absolute inset-0 transition-opacity duration-700 ${i===bannerIdx? "opacity-100":"opacity-0"}`}>
              <img src={b.img} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 text-white">
                <div className="inline-block px-3 py-1 rounded-full bg-white text-black text-[10px] font-black mb-3">🔥 LIMITED OFFER</div>
                <h1 className="text-[28px] md:text-[48px] font-black leading-[0.9]">{b.title}</h1>
                <p className="mt-2 text-[14px] md:text-[18px] opacity-90">{b.sub}</p>
                <button className="mt-4 px-6 py-2.5 rounded-full bg-white text-black text-[12px] font-black">{b.cta} →</button>
              </div>
            </div>
          ))}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_,i)=><button key={i} onClick={()=>setBannerIdx(i)} className={`h-2 rounded-full transition-all ${i===bannerIdx? "w-8 bg-white":"w-2 bg-white/50"}`}></button>)}
          </div>
        </div>
      </div>

      {/* CATEGORIES - Amazon Style */}
      <div className="max-w-[1280px] mx-auto mt-6 px-4">
        <div className="rounded-[22px] p-4 overflow-x-auto scrollbar-hide" style={prettyBox}>
          <div className="flex gap-3 min-w-max">
            {categories.map(c=>(
              <button key={c} onClick={()=>setCat(c)} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border whitespace-nowrap transition ${cat===c? "bg-[#1F3A4A] text-white border-white shadow border-[3px]":"bg-[#F6F1E6] hover:bg-white"}`}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto mt-6 px-4 grid grid-cols-12 gap-6">
        {/* PRODUCTS GRID */}
        <div className="col-span-12 lg:col-span-9">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-black text-[18px]">{cat} • {filtered.length} Products</h2>
            <span className="text-[11px] opacity-60">Siliguri • Fast Delivery</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {filtered.map(p=>(
              <div key={p.id} onClick={()=>handleProductClick(p)} className="rounded-[18px] overflow-hidden bg-white border-[4px] border-white shadow hover:shadow-xl transition cursor-pointer group">
                <div className="relative h-[180px] md:h-[220px] overflow-hidden bg-[#F6F1E6]">
                  <img src={p.media[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="" />
                  <div className="absolute top-2 left-2 bg-[#E86A33] text-white text-[9px] font-black px-2 py-1 rounded-full">{p.category}</div>
                  <div className="absolute top-2 right-2 bg-white text-black text-[9px] font-bold px-2 py-1 rounded-full">⭐ {p.rating} • {p.sales} sold</div>
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[9px] px-2 py-1 rounded-full">📍 {p.location}</div>
                </div>
                <div className="p-3">
                  <div className="flex gap-2 items-center mb-1">
                    <img src={p.avatar} className="w-5 h-5 rounded-full border" alt="" />
                    <span className="text-[11px] font-bold opacity-60 truncate">@{p.author}</span>
                  </div>
                  <h3 className="font-bold text-[13px] line-clamp-1">{p.title}</h3>
                  <p className="text-[11px] opacity-60 line-clamp-1">{p.desc}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-black text-[15px]">{p.price}</span>
                    <span className="text-[11px] line-through opacity-40">{p.oldPrice}</span>
                    <span className="ml-auto text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">50% OFF</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button onClick={(e)=>{ e.stopPropagation(); handleProductClick(p); }} className="py-2 rounded-full bg-[#F6F1E6] border text-[11px] font-bold">View Shop</button>
                    <button onClick={(e)=>handleBookNow(e,p)} className="py-2 rounded-full bg-[#1F3A4A] text-white text-[11px] font-black border-2 border-white shadow">Book Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length===0 && <div className="text-center py-20 opacity-40">No products in {cat} • Retail users upload karenge to yaha dikhega</div>}
        </div>

        {/* RIGHT SIDE - ADVERTISE */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <div className="rounded-[22px] p-4" style={prettyBox}>
            <h3 className="font-bold text-[13px] flex justify-between">Advertisement <span className="text-[9px] bg-[#F6F1E6] border px-2 py-1 rounded-full">Sponsored</span></h3>
            <div className="mt-4 space-y-4">
              {ads.map((ad,i)=>(
                <div key={i} className="rounded-[16px] overflow-hidden border-[3px] border-white shadow bg-[#F6F1E6]">
                  <img src={ad.img} className="w-full h-[140px] object-cover" alt="" />
                  <div className="p-3">
                    <div className="font-bold text-[13px]">{ad.title}</div>
                    <div className="text-[11px] opacity-60">{ad.desc}</div>
                    <button className="w-full mt-3 py-2 rounded-full bg-black text-white text-[11px] font-bold">{ad.cta} →</button>
                  </div>
                </div>
              ))}
              <div className="bg-[#1F3A4A] text-white rounded-[16px] p-4 text-center border-[3px] border-white shadow">
                <div className="text-[14px] font-black">List Your Shop Free</div>
                <div className="text-[11px] opacity-70 mt-1">Retail profile banao, product upload karo, yaha auto show hoga</div>
                <Link href="/profile/retails/create" className="block mt-3 py-2 rounded-full bg-white text-black text-[11px] font-bold text-center">Create Retail Profile +</Link>
              </div>
              <div className="bg-[#E86A33] text-white rounded-[16px] p-4 text-center border-[3px] border-white shadow">
                <div className="text-[13px] font-black">Need 1 Lakh+ Reach?</div>
                <div className="text-[10px] opacity-90 mt-1">Banner + Top Listing • Siliguri</div>
                <button className="w-full mt-2 py-2 rounded-full bg-white text-black text-[11px] font-bold">Contact Ads Team</button>
              </div>
            </div>
          </div>

          <div className="rounded-[22px] p-4" style={prettyBox}>
            <div className="font-bold text-[12px]">Top Sellers in Siliguri</div>
            <div className="mt-3 space-y-2">
              {products.slice(0,5).map(p=>(
                <button key={p.id} onClick={()=>handleProductClick(p)} className="w-full flex gap-3 items-center p-2 rounded-xl hover:bg-[#F6F1E6] text-left">
                  <img src={p.avatar} className="w-9 h-9 rounded-full border-2 border-white shadow" alt="" />
                  <div className="flex-1"><div className="font-bold text-[12px]">@{p.author}</div><div className="text-[10px] opacity-60">{p.sales} sales • ⭐ {p.rating}</div></div>
                  <span className="text-[10px] bg-black text-white px-2 py-1 rounded-full">Visit</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none; scrollbar-width:none}`}</style>
    </div>
  );
}