"use client";
import React, { useState, useRef, useEffect, use } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const FOLLOW_BTN = "#BD6517";
const BOOK_BTN = "#BD6517";
const REST_BTN = "#0b2b26";
const PAGE_BG = "#F5EFE0";
const FB_FONT = `"Facebook Sans", "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;

async function uploadFile(bucket: string, file: File) {
  const name = `${Date.now()}_${file.name}`;
  const { error } = await supabase.storage.from(bucket).upload(name, file);
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(name);
  return data.publicUrl;
}

export default function RetailPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [loading, setLoading] = useState(true);
  const [isNew, setIsNew] = useState(false);
  const [store, setStore] = useState<any>({
    name: "My Retail Store", address: "Matigara, Siliguri", contact: "9876543210",
    cover1: "", cover2: "", dp: "",
    about: "Premium Retail With Trusted Quality", story: "Small Shop To Trusted Brand Journey",
    value: "Quality, Honesty And Fast Delivery", whyChoose: "Trusted By Thousands",
    welcomeTitle: "Welcome", welcomeDesc: "Trusted Quality Products For Your Daily Needs",
    welcomeBg: "#0b2b26", verified: false
  });
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["General", "Electronics", "Fashion", "Grocery"]);
  const [selectedCat, setSelectedCat] = useState("All");
  const [newCat, setNewCat] = useState("");
  const [showCatBox, setShowCatBox] = useState(false);
  const [editForm, setEditForm] = useState<any>(store);
  const [showProducts, setShowProducts] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [prodForm, setProdForm] = useState({ name: "", desc: "", price: 0, img: "", file: null as File | null, category: "General" });
  const [editMode, setEditMode] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedProd, setSelectedProd] = useState<any>(null);
  const [showBookForm, setShowBookForm] = useState(false);
  const [bookForm, setBookForm] = useState({ name: "", address: "", contact: "", qty: 1 });
  const [zoomImg, setZoomImg] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(1243);

  const cover1Ref = useRef<any>(null); const dpRef = useRef<any>(null); const prodImgRef = useRef<any>(null); const newDpRef = useRef<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data: profile } = await supabase.from('profiles').select('*').eq('username', username).single();
      if (profile) {
        setStore({ name: profile.display_name || "My Retail Store", address: profile.location || "Matigara, Siliguri", contact: profile.phone || "9876543210", dp: profile.avatar_url || "", cover1: profile.cover_url || "", about: profile.bio || "", welcomeTitle: "Welcome", welcomeDesc: profile.bio || "", welcomeBg: "#0b2b26" });
        setEditForm({ name: profile.display_name || "", address: profile.location || "", contact: profile.phone || "", dp: profile.avatar_url || "", cover1: profile.cover_url || "", about: profile.bio || "", welcomeTitle: "Welcome", welcomeDesc: profile.bio || "", welcomeBg: "#0b2b26" });
        setIsNew(false);
      } else {
        setIsNew(true);
      }
      const { data: posts } = await supabase.from('posts').select('*').eq('user_id', username).eq('category', 'retail').order('created_at', {ascending:false});
      if (posts) setProducts(posts.map((p:any)=>({ id:p.id, name:p.title, desc:p.description, price: 899, img:p.media_url, category: p.title?.split(' ')[0] || "General", createdAt: new Date(p.created_at).getTime() })));
      setLoading(false);
    };
    load();
  }, [username]);

  const handleCreate = async () => {
    if (!store.name) return alert("Name Required");
    const { error } = await supabase.from('profiles').upsert([{
      username: username,
      display_name: store.name,
      bio: store.about,
      location: store.address,
      avatar_url: store.dp,
      cover_url: store.cover1,
    }], { onConflict: 'username' });
    if(error) return alert(error.message);
    setIsNew(false);
  };

  const handleFile = async (e: any, k: string) => {
    const f = e.target.files?.[0]; if (!f) return;
    const url = await uploadFile(k==='dp'? 'avatars' : 'covers', f);
    setEditForm((p: any) => ({...p, [k]: url }));
  };

  const handleProdFile = (e: any) => {
    const f = e.target.files?.[0]; if (!f) return;
    setProdForm((p: any) => ({...p, img: URL.createObjectURL(f), file: f }));
  };

  const addProduct = async () => {
    if(!prodForm.file ||!prodForm.name.trim()) return alert("Image + Header required");
    try {
      const url = await uploadFile('post_media', prodForm.file);
      const { data, error } = await supabase.from('posts').insert([{
        user_id: username,
        title: prodForm.name,
        description: prodForm.desc,
        media_url: url,
        media_type: 'photo',
        category: 'retail',
      }]).select().single();
      if(error) throw error;
      const newP = { id:data.id, name:prodForm.name.trim(), desc:prodForm.desc.trim(), price:prodForm.price||899, img:url, category:prodForm.category, createdAt:Date.now() };
      setProducts([newP,...products]);
      setProdForm({ name:"", desc:"", price:0, img:"", file:null, category:"General" });
    } catch(e:any){ alert(e.message) }
  };

  const filteredProducts = products.filter((p: any) => (selectedCat === "All" || p.category === selectedCat) && p.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="min-h-screen grid place-items-center font-bold" style={{ background: PAGE_BG, fontFamily: FB_FONT }}>Loading...</div>;
  if (isNew) {
    return (
      <div className="min-h-screen flex justify-center p-4 pt-8" style={{ background: PAGE_BG, fontFamily: FB_FONT }}>
        <input ref={newDpRef} type="file" hidden accept="image/*" onChange={async e => { const f=e.target.files?.[0]; if(!f) return; const url=await uploadFile('avatars', f); setStore((p:any)=>({...p, dp:url})); }} />
        <div className="w-full max-w-[520px] bg-white rounded-[20px] p-6 border shadow"><h1 className="text-[22px] font-bold" style={{ fontWeight: 800 }}>Create Retail Profile</h1><div className="mt-4 space-y-3"><button onClick={() => newDpRef.current?.click()} className="w-full h-12 bg-gray-50 rounded-xl border-2 border-dashed text-[13px] font-semibold">{store.dp? "Logo Uploaded ✓" : "Choose Logo - Supabase"}</button><input value={store.name} onChange={e => setStore({...store, name: e.target.value })} placeholder="Store Name" className="w-full border rounded-full px-4 py-3 bg-gray-50 font-semibold outline-none" /><button onClick={handleCreate} className="w-full py-3 rounded-full text-white font-semibold" style={{ background: REST_BTN }}>Save to Supabase</button></div></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: PAGE_BG, fontFamily: FB_FONT }}>
      <style>{`* { font-family: ${FB_FONT}!important; } h1,h2,h3{font-weight:800!important;}`}</style>
      <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-5 h-[60px] flex justify-between items-center">
          <Link href={`/profile/retail/${username}`} className="flex items-center gap-2"><div className="w-8 h-8 rounded-full text-white grid place-items-center font-bold text-[12px]" style={{ background: REST_BTN }}>{store.dp? <img src={store.dp} className="w-full h-full object-cover rounded-full" alt="" /> : username[0].toUpperCase()}</div><span className="font-bold text-[20px]">Drisyamn</span></Link>
          <div className="hidden md:flex gap-5 text-[13px] font-medium absolute left-1/2 -translate-x-1/2"><button onClick={() => { setShowProducts(false); setShowAnalytics(false); setShowBookings(false); }}>Home</button><button onClick={() => setShowProducts(true)} className={`${showProducts? "font-bold border-b-2 pb-1" : ""}`} style={{ borderColor: REST_BTN }}>Our Products</button><button onClick={() => setShowBookings(true)}>Bookings ({bookings.length})</button></div>
          <div className="flex gap-2 items-center"><button onClick={() => { setIsFollowing(!isFollowing); setFollowers(c => isFollowing? c-1 : c+1); }} className="px-4 py-1.5 rounded-full text-white text-[11px] font-bold" style={{ background: FOLLOW_BTN }}>{isFollowing? "Following" : "Follow"} • {followers}</button></div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4">
        {showBookings? (
          <div className="mt-5 max-w-[900px] mx-auto"><div className="bg-white rounded-[14px] border p-4 flex justify-between items-center"><span className="font-bold text-[16px]">Bookings • {bookings.length}</span></div></div>
        ) : showProducts? (
          <div className="mt-5">
            <div className="bg-white rounded-[14px] border p-3 flex flex-wrap gap-2 justify-between items-center">
              <div className="flex items-center gap-1.5 flex-wrap"><button onClick={()=>setSelectedCat("All")} className={`px-3 py-1.5 rounded-full text-[11px] font-bold border ${selectedCat==="All"? "text-white" : "bg-gray-50"}`} style={selectedCat==="All"? { background: REST_BTN } : {}}>All</button>{categories.map(c=>(<button key={c} onClick={()=>setSelectedCat(c)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold border ${selectedCat===c? "text-white" : "bg-gray-50"}`} style={selectedCat===c? { background: REST_BTN } : {}}>{c}</button>))}</div>
              <div className="flex gap-2 items-center"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="bg-gray-100 rounded-full px-3 py-1.5 text-[11px] outline-none w-[140px]" /><button onClick={()=>setShowCatBox(!showCatBox)} className="px-4 py-2 rounded-full text-white text-[11px] font-bold" style={{ background: REST_BTN }}>+ Categories</button></div>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="w-full max-w-[680px] bg-white rounded-[20px] border shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 relative">
                <div className="flex justify-between items-start"><div><h3 className="font-bold text-[16px]">+ Add New Product - Supabase</h3><p className="text-[11px] text-gray-500 mt-1">Upload to post_media bucket</p></div></div>
                <div className="mt-5 grid grid-cols-[150px_1fr] gap-5">
                  <div><button onClick={()=>prodImgRef.current?.click()} className="w-full h-[142px] rounded-[16px] border-2 border-dashed bg-[#FFFBF2]/60 grid place-items-center overflow-hidden"><div className="w-full h-full grid place-items-center">{prodForm.img? <img src={prodForm.img} className="w-full h-full object-cover" alt="" /> : <div className="text-center"><div className="text-[10px] font-bold">Click to upload</div></div>}</div></button><input ref={prodImgRef} type="file" hidden accept="image/*" onChange={handleProdFile} /></div>
                  <div className="space-y-3">
                    <input value={prodForm.name} onChange={e=>setProdForm({...prodForm, name:e.target.value})} placeholder="Header / Title *" className="w-full bg-[#F9FAFB] border rounded-full px-4 py-2.5 text-[13px] font-semibold outline-none" />
                    <textarea value={prodForm.desc} onChange={e=>setProdForm({...prodForm, desc:e.target.value})} placeholder="Description..." rows={3} className="w-full bg-[#F9FAFB] border rounded-[14px] px-4 py-2.5 text-[12px] outline-none resize-none" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="number" value={prodForm.price} onChange={e=>setProdForm({...prodForm, price:parseInt(e.target.value)||0})} placeholder="Price ₹" className="w-full bg-[#F9FAFB] border rounded-full px-4 py-2.5 text-[13px] font-bold outline-none" />
                      <select value={prodForm.category} onChange={e=>setProdForm({...prodForm, category:e.target.value})} className="w-full bg-[#F9FAFB] border rounded-full px-4 py-2.5 text-[12px] font-semibold outline-none"><option>General</option>{categories.map(c=><option key={c} value={c}>{c}</option>)}</select>
                    </div>
                    <button onClick={addProduct} className="w-full py-3 rounded-full text-white font-bold text-[13px]" style={{ background: REST_BTN }}>+ Upload to Supabase → Homefeed</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
              {filteredProducts.map((p:any)=>(<div key={p.id} className="bg-white rounded-[14px] border overflow-hidden"><div className="h-[150px] bg-gray-50 cursor-pointer" onClick={()=>setZoomImg(p.img)}><img src={p.img} className="w-full h-full object-cover" alt="" /></div><div className="p-3"><div className="font-semibold text-[13px] truncate">{p.name}</div><div className="text-[11px] text-gray-500 truncate">{p.desc}</div><div className="flex justify-between items-center mt-2.5"><span className="font-bold text-[13px]">₹{p.price}</span><button onClick={()=>{ setSelectedProd(p); setShowBookForm(true); }} className="px-3.5 py-1.5 rounded-full text-white text-[10px] font-bold" style={{ background: BOOK_BTN }}>Book Now</button></div></div></div>))}
            </div>
          </div>
        ) : (
          <>
            <div className="mt-5 grid lg:grid-cols-[1.6fr_0.9fr] gap-3">
              <div className="relative rounded-[14px] bg-white border p-1.5 h-[300px]"><div onClick={()=>cover1Ref.current?.click()} className="w-full h-full rounded-[10px] bg-gray-50 grid place-items-center cursor-pointer overflow-hidden border">{store.cover1? <img src={store.cover1} className="w-full h-full object-cover" alt="" /> : <span className="text-[12px] text-gray-400">Cover Photo - Supabase</span>}</div><div className="absolute -bottom-6 left-4 w-[360px] rounded-[12px] bg-white border shadow p-3 flex gap-3 items-center"><div className="w-12 h-12 rounded-full text-white grid place-items-center font-bold" style={{ background: REST_BTN }}>{store.dp? <img src={store.dp} className="w-full h-full object-cover rounded-full" alt="" /> : username[0].toUpperCase()}</div><div className="flex-1"><div className="font-bold text-[14px]">{store.name}</div><div className="text-[11px] text-gray-500">{store.address}</div></div><button onClick={()=>{ setEditForm(store); setEditMode(true); }} className="px-3 py-1 rounded-full text-white text-[10px] font-bold" style={{ background: REST_BTN }}>Edit</button></div><input ref={cover1Ref} type="file" hidden accept="image/*" onChange={async e=>{ const f=e.target.files?.[0]; if(!f) return; const url=await uploadFile('covers', f); setStore((p:any)=>({...p, cover1:url})); await supabase.from('profiles').update({cover_url:url}).eq('username', username); }} /><input ref={dpRef} type="file" hidden accept="image/*" onChange={async e=>{ const f=e.target.files?.[0]; if(!f) return; const url=await uploadFile('avatars', f); setStore((p:any)=>({...p, dp:url})); await supabase.from('profiles').update({avatar_url:url}).eq('username', username); }} /></div>
              <div className="rounded-[14px] p-5 text-white flex flex-col justify-center h-[300px]" style={{ background: store.welcomeBg||REST_BTN }}><div className="text-[10px] font-semibold tracking-widest opacity-70">Our Store</div><div className="text-[24px] font-bold leading-none mt-1">{store.welcomeTitle}</div><div className="text-[12px] mt-2 opacity-90">{store.welcomeDesc}</div><button onClick={()=>setShowProducts(true)} className="mt-4 w-fit px-5 py-2 rounded-full text-white text-[11px] font-bold" style={{ background: BOOK_BTN }}>Book Now</button></div>
            </div>
          </>
        )}
      </div>
      {zoomImg && (<div className="fixed inset-0 bg-black/80 z-[200] grid place-items-center p-4" onClick={()=>setZoomImg(null)}><img src={zoomImg} className="max-h-[85vh] max-w-[90vw] rounded-[14px] border-4 border-white" alt="" /></div>)}
    </div>
  );
}