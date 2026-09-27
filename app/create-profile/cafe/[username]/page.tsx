"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

const DARK_GREEN = "#1A4D2E";
const BG = "#E9E1C8";

export default function CreateCafePage() {
  const { username } = useParams() as { username: string };
  const router = useRouter();

  const [cover, setCover] = useState<string>("");
  const [dp, setDp] = useState<string>("");
  const [gallery, setGallery] = useState<any[]>([]);
  const [form, setForm] = useState({
    shopName: "", address: "", phone: "", location: "", category: "Tea Stall",
    about: "", story: "", whyChoose: "",
  });
  const [menu, setMenu] = useState<any[]>([
    { id: 1, name: "", desc: "", price: "", image: "" }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem(`drisyamn_cafe_${username}`);
    if (saved) {
      const d = JSON.parse(saved);
      setForm({ shopName: d.shopName||"", address: d.address||"", phone: d.phone||"", location: d.location||d.address||"", category: d.category||"Tea Stall", about: d.about||"", story: d.story||"", whyChoose: d.whyChoose||"" });
      setCover(d.cover||""); setDp(d.dp||"");
      if (d.menu) setMenu(d.menu);
      if (d.gallery) setGallery(d.gallery);
    }
  }, [username]);

  const handleImage = (e: any, type: "cover" | "dp" | "menu", index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (type === "cover") setCover(result);
      if (type === "dp") setDp(result);
      if (type === "menu" && index!== undefined) {
        const newMenu = [...menu]; newMenu[index].image = result; setMenu(newMenu);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGallery = (e: any) => {
    const files = Array.from(e.target.files as FileList);
    files.forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = () => {
        const isVideo = file.type.startsWith("video/");
        setGallery(prev => [...prev, { id: Date.now()+Math.random(), url: reader.result as string, type: isVideo? "video" : "image" }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const addMenuItem = () => setMenu([...menu, { id: Date.now(), name: "", desc: "", price: "", image: "" }]);
  const removeMenuItem = (i: number) => setMenu(menu.filter((_, idx) => idx!== i));
  const updateMenu = (i: number, field: string, val: string) => { const n = [...menu]; n[i][field] = val; setMenu(n); };
  const removeGallery = (id: number) => setGallery(gallery.filter(g => g.id!== id));

  const handleSave = () => {
    if (!form.shopName ||!form.phone) return alert("Shop Name & Phone required");
    const finalData = { username, shopName: form.shopName, address: form.address, phone: form.phone, location: form.location, category: form.category, about: form.about, story: form.story, whyChoose: form.whyChoose, cover, dp, gallery, menu: menu.filter(m => m.name && m.price), cat: `${form.category} • Cafe • Hangout` };
    localStorage.setItem(`drisyamn_cafe_${username}`, JSON.stringify(finalData));
    router.push(`/profile/cafe/${username}`);
  };

  return (
    <div className="min-h-screen w-full flex justify-center" style={{ background: BG }}>
      <div className="w-full max-w-[720px] p-2 md:p-4">

        {/* DRISYAMN NAV BAR - SAME PLACE AS PROFILE */}
        <div className="w-full bg-white rounded-[16px] border border-black/5 shadow-sm h-[58px] px-4 flex items-center justify-between mb-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-[#1A4D2E] flex flex-col items-center"><span className="text-[18px]">🏠</span><span className="text-[11px] font-bold">Home</span></Link>
            <button className="flex flex-col items-center text-black/60"><span className="text-[16px]">💬</span><span className="text-[11px]">Message</span></button>
            <button className="flex flex-col items-center text-black/60"><span className="text-[16px]">🔔</span><span className="text-[11px]">Notification</span></button>
            <button className="flex flex-col items-center text-black/60"><span className="text-[16px]">📚</span><span className="text-[11px]">Books</span></button>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[22px] font-black tracking-tighter leading-none" style={{ fontFamily: "Georgia, serif", fontWeight: 900 }}>Drisyamn</span>
            <span className="text-[8px] tracking-widest text-black/50 uppercase">Discover Everything Around You</span>
          </div>
          <div className="px-3 py-1.5 rounded-full text-white text-[11px]" style={{ background: DARK_GREEN }}>Edit</div>
        </div>

        <div className="bg-white rounded-[20px] overflow-hidden border border-black/5 shadow-sm">
          {/* COVER - fit to cover */}
          <div className="relative h-[220px] w-full bg-black/5">
            {cover? <img src={cover} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-black/30 text-[13px]">No Cover Selected</div>}
            <label className="absolute bottom-3 right-3 px-4 py-2 rounded-full text-white text-[12px] font-bold cursor-pointer" style={{ background: DARK_GREEN }}>
              Select Cover Image
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e, "cover")} />
            </label>
            <div className="absolute -bottom-[42px] left-1/2 -translate-x-1/2">
              <div className="relative w-[90px] h-[90px] rounded-full bg-white border-[4px] border-white shadow-xl overflow-hidden flex items-center justify-center">
                {dp? <img src={dp} className="w-full h-full object-cover" alt="" /> : <span className="text-[36px]">☕</span>}
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[10px] font-bold opacity-0 hover:opacity-100 cursor-pointer transition">
                  DP
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e, "dp")} />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-14 p-5">
            <h2 className="font-bold text-[18px]">Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div><label className="text-[11px] font-bold text-black/60">SHOP NAME *</label><input value={form.shopName} onChange={e => setForm({...form, shopName: e.target.value })} placeholder="Chai Break Matigara" className="mt-1 w-full h-[46px] border rounded-[12px] px-4 text-[14px]" /></div>
              <div><label className="text-[11px] font-bold text-black/60">CATEGORY</label><select value={form.category} onChange={e => setForm({...form, category: e.target.value })} className="mt-1 w-full h-[46px] border rounded-[12px] px-4 text-[14px] bg-white"><option>Tea Stall</option><option>Cafe</option><option>Restaurant</option><option>Bakery</option><option>Fast Food</option></select></div>
              <div className="md:col-span-2"><label className="text-[11px] font-bold text-black/60">ADDRESS</label><input value={form.address} onChange={e => setForm({...form, address: e.target.value })} placeholder="Matigara, Siliguri" className="mt-1 w-full h-[46px] border rounded-[12px] px-4 text-[14px]" /></div>
              <div><label className="text-[11px] font-bold text-black/60">CONTACT *</label><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value })} placeholder="9876543210" className="mt-1 w-full h-[46px] border rounded-[12px] px-4 text-[14px]" /></div>
              <div><label className="text-[11px] font-bold text-black/60">LOCATION LINK</label><input value={form.location} onChange={e => setForm({...form, location: e.target.value })} placeholder="https://maps.app.goo.gl/..." className="mt-1 w-full h-[46px] border rounded-[12px] px-4 text-[14px]" /></div>
            </div>

            <div className="mt-8 space-y-5">
              <div><label className="text-[11px] font-bold text-black/60">ABOUT US</label><textarea value={form.about} onChange={e => setForm({...form, about: e.target.value })} placeholder="About your cafe..." className="mt-1 w-full h-[90px] border rounded-[12px] p-3 text-[14px]" /></div>
              <div><label className="text-[11px] font-bold text-black/60">OUR STORIES</label><textarea value={form.story} onChange={e => setForm({...form, story: e.target.value })} placeholder="Your story..." className="mt-1 w-full h-[90px] border rounded-[12px] p-3 text-[14px]" /></div>
              <div><label className="text-[11px] font-bold text-black/60">WHY PEOPLE CHOOSE US</label><textarea value={form.whyChoose} onChange={e => setForm({...form, whyChoose: e.target.value })} placeholder="Why choose us..." className="mt-1 w-full h-[90px] border rounded-[12px] p-3 text-[14px]" /></div>
            </div>

            {/* SINGLE MENU - EK HI */}
            <div className="mt-8">
              <div className="flex justify-between items-center"><h2 className="font-bold text-[16px]">Menu - Image / Name / Description / Price</h2><button onClick={addMenuItem} className="px-4 h-[36px] rounded-full text-white text-[12px]" style={{ background: DARK_GREEN }}>+ Add</button></div>
              <div className="mt-4 space-y-3">
                {menu.map((item, i) => (
                  <div key={item.id} className="p-3 rounded-[16px] border bg-black/[0.02] flex gap-3">
                    <label className="w-[90px] h-[90px] rounded-[12px] bg-white border border-dashed flex items-center justify-center cursor-pointer overflow-hidden shrink-0">
                      {item.image? <img src={item.image} className="w-full h-full object-cover" alt="" /> : <span className="text-[10px]">📷 Image</span>}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e, "menu", i)} />
                    </label>
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input value={item.name} onChange={e => updateMenu(i, "name", e.target.value)} placeholder="Name" className="h-[40px] border rounded-[10px] px-3 text-[13px] bg-white" />
                      <input value={item.price} onChange={e => updateMenu(i, "price", e.target.value)} placeholder="Price" type="number" className="h-[40px] border rounded-[10px] px-3 text-[13px] bg-white" />
                      <input value={item.desc} onChange={e => updateMenu(i, "desc", e.target.value)} placeholder="Description" className="col-span-2 h-[40px] border rounded-[10px] px-3 text-[13px] bg-white" />
                      <button onClick={() => removeMenuItem(i)} className="col-span-2 text-left text-[11px] text-red-500">Remove ✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GALLERY - IMAGE / VIDEOS FROM FILES WORKING */}
            <div className="mt-8">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-[16px]">Add Gallery - Image / Videos</h2>
                <label className="px-4 h-[36px] rounded-full text-white text-[12px] flex items-center cursor-pointer" style={{ background: DARK_GREEN }}>
                  + Add Gallery
                  <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleGallery} />
                </label>
              </div>
              <p className="text-[11px] text-black/40 mt-1">Select from files — images and videos will fit to gallery</p>

              {gallery.length === 0? (
                <div className="mt-3 h-[100px] rounded-[12px] border border-dashed flex items-center justify-center text-[12px] text-black/30">No gallery added yet</div>
              ) : (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {gallery.map((g) => (
                    <div key={g.id} className="relative group">
                      {g.type === "video"? <video src={g.url} className="h-[90px] w-full object-cover rounded-[12px]" muted /> : <img src={g.url} className="h-[90px] w-full object-cover rounded-[12px]" alt="" />}
                      <button onClick={() => removeGallery(g.id)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white text-[10px]">✕</button>
                      <span className="absolute bottom-1 left-1 text-[8px] bg-black/60 text-white px-1 rounded">{g.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={handleSave} className="mt-8 w-full h-[52px] rounded-full text-white font-bold" style={{ background: DARK_GREEN }}>
              Save & Create Profile →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}