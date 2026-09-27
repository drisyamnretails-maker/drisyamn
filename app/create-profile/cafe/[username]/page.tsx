"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

const ORANGE = "#E86A33";
const PAGE_BG = "#EDE6D3";
const BLACK = "#0A0A0A";
const BORDER = "rgba(0,0,0,0.08)";

export default function CreateCafePage() {
  const { username } = useParams() as { username: string };
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    phone: "",
    whatsapp: "",
    address: "",
    landmark: "",
    about: "",
    story: "",
    openTime: "08:00 AM",
    closeTime: "10:00 PM",
    category: "Tea Stall • Cafe • Hangout",
  });

  const [menu, setMenu] = useState<{name:string, price:string, desc:string, popular:boolean}[]>([
    { name: "Masala Chai", price: "30", desc: "Spiced tea with milk", popular: true },
  ]);
  const [item, setItem] = useState({ name: "", price: "", desc: "" });

  const [gallery, setGallery] = useState<string[]>([]);

  const addMenuItem = () => {
    if(!item.name ||!item.price) return alert("Name & price required");
    setMenu([...menu, {...item, popular: false }]);
    setItem({ name: "", price: "", desc: "" });
  };

  const handleCreate = async () => {
    if(!form.shopName ||!form.phone ||!form.address){
      return alert("Shop name, phone, address required hai");
    }
    setLoading(true);
    const payload = {
      username,
      role: "food_beverage",
     ...form,
      menu,
      gallery,
      rating: "4.5",
      reviews: 0,
      createdAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(`drisyamn_cafe_${username}`, JSON.stringify(payload));
      localStorage.setItem("drisyamn_last_profile", JSON.stringify(payload));
      // Supabase ke liye ready - jab chahiye uncomment karna
      // await supabase.from("cafe_profiles").insert(payload);
    } catch(e){ console.log(e) }

    setTimeout(() => {
      router.push(`/create-profile/cafe/${username}/preview`);
      // ya direct profile display: router.push(`/profile/cafe/${username}`)
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex justify-center p-3 md:p-4" style={{ background: PAGE_BG }}>
      <div className="w-full max-w-[480px] bg-[#FFFEFB] rounded-[24px] px-5 py-5 border border-black/[0.05] shadow-[0_0_0_8px_#fff,0_20px_50px_rgba(0,0,0,0.12)]">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[20px] font-bold" style={{ color: BLACK, fontFamily: "Georgia, serif" }}>Create Cafe Profile</h1>
            <p className="text-[11px] text-black/40 mt-0.5 uppercase tracking-widest">Welcome, {username} • Food & Beverage</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold text-black/60">STEP {step}/4</p>
            <div className="w-[70px] h-1.5 bg-black/10 rounded-full mt-1 overflow-hidden">
              <div className="h-full transition-all duration-300" style={{ width: `${step*25}%`, background: ORANGE }} />
            </div>
          </div>
        </div>

        {/* PROGRESS TABS */}
        <div className="mt-5 grid grid-cols-4 gap-1.5 p-1 rounded-full bg-black/[0.04] border border-black/5">
          {["Basic", "About", "Menu", "Gallery"].map((t,i)=>(
            <div key={t} className={`text-center py-2 rounded-full text-[11px] font-medium transition-all ${step===i+1? "bg-black text-white" : "text-black/40"}`}>{i+1}. {t}</div>
          ))}
        </div>

        {/* STEP 1 - BASIC DETAILS */}
        {step===1 && (
          <div className="mt-6">
            <h3 className="text-[15px] font-semibold">Basic Details</h3>
            <p className="text-[11px] text-black/50 mt-1">Ye info banner me dikhegi - Chai Break Matigara jaise</p>

            <div className="mt-4 flex flex-col gap-3.5">
              <div>
                <label className="text-[10px] font-bold tracking-widest text-black/50">SHOP / CAFE NAME *</label>
                <input value={form.shopName} onChange={e=>setForm({...form, shopName:e.target.value})} placeholder="Ex: Chai Break Matigara" className="mt-1.5 w-full h-[48px] rounded-[14px] border px-4 text-[14px] outline-none bg-[#F6F1E6] focus:bg-white" style={{ borderColor: BORDER }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-black/50">OWNER NAME</label>
                  <input value={form.ownerName} onChange={e=>setForm({...form, ownerName:e.target.value})} placeholder="Rohan" className="mt-1.5 w-full h-[48px] rounded-[14px] border px-4 text-[14px] bg-[#F6F1E6] outline-none" style={{ borderColor: BORDER }} />
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-black/50">CATEGORY</label>
                  <input value={form.category} onChange={e=>setForm({...form, category:e.target.value})} className="mt-1.5 w-full h-[48px] rounded-[14px] border px-4 text-[13px] bg-[#F6F1E6]" style={{ borderColor: BORDER }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-black/50">PHONE *</label>
                  <input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} placeholder="98765..." type="tel" className="mt-1.5 w-full h-[48px] rounded-[14px] border px-4 text-[14px] bg-[#F6F1E6] outline-none" style={{ borderColor: BORDER }} />
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-black/50">WHATSAPP</label>
                  <input value={form.whatsapp} onChange={e=>setForm({...form, whatsapp:e.target.value})} placeholder="Same as phone" className="mt-1.5 w-full h-[48px] rounded-[14px] border px-4 text-[14px] bg-[#F6F1E6]" style={{ borderColor: BORDER }} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest text-black/50">FULL ADDRESS *</label>
                <input value={form.address} onChange={e=>setForm({...form, address:e.target.value})} placeholder="Matigara, Siliguri, Near..." className="mt-1.5 w-full h-[48px] rounded-[14px] border px-4 text-[14px] bg-[#F6F1E6]" style={{ borderColor: BORDER }} />
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest text-black/50">LANDMARK</label>
                <input value={form.landmark} onChange={e=>setForm({...form, landmark:e.target.value})} placeholder="Opposite City Centre" className="mt-1.5 w-full h-[46px] rounded-[14px] border px-4 text-[13px] bg-[#F6F1E6]" style={{ borderColor: BORDER }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] font-bold text-black/50">OPEN</label><input value={form.openTime} onChange={e=>setForm({...form, openTime:e.target.value})} className="mt-1.5 w-full h-[46px] rounded-[14px] border px-3 text-[13px] bg-white" style={{ borderColor: BORDER }} /></div>
                <div><label className="text-[10px] font-bold text-black/50">CLOSE</label><input value={form.closeTime} onChange={e=>setForm({...form, closeTime:e.target.value})} className="mt-1.5 w-full h-[46px] rounded-[14px] border px-3 text-[13px] bg-white" style={{ borderColor: BORDER }} /></div>
              </div>
            </div>
            <button onClick={()=>setStep(2)} className="mt-6 w-full h-[52px] rounded-full text-white font-bold text-[13px] tracking-widest uppercase" style={{ background: ORANGE, boxShadow: "0 10px 20px rgba(232,106,51,0.3)" }}>Continue → About Us</button>
          </div>
        )}

        {/* STEP 2 - ABOUT STORY */}
        {step===2 && (
          <div className="mt-6">
            <h3 className="text-[15px] font-semibold">About & Story</h3>
            <p className="text-[11px] text-black/50 mt-1">Ye About Us / Our Story tab me khulega</p>
            <div className="mt-4 flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-bold tracking-widest text-black/50">ABOUT US *</label>
                <textarea value={form.about} onChange={e=>setForm({...form, about:e.target.value})} rows={4} placeholder="We serve best chai in Matigara since 2021..." className="mt-1.5 w-full rounded-[14px] border p-4 text-[13px] bg-[#F6F1E6] outline-none resize-none" style={{ borderColor: BORDER }} />
                <p className="text-[10px] text-black/30 mt-1">{form.about.length}/300</p>
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest text-black/50">OUR STORY</label>
                <textarea value={form.story} onChange={e=>setForm({...form, story:e.target.value})} rows={4} placeholder="Founded in 2021 by Rohan Pradhan..." className="mt-1.5 w-full rounded-[14px] border p-4 text-[13px] bg-[#F6F1E6] outline-none resize-none" style={{ borderColor: BORDER }} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={()=>setStep(1)} className="flex-1 h-[52px] rounded-full border bg-white font-medium text-[13px]" style={{ borderColor: BORDER }}>Back</button>
              <button onClick={()=>setStep(3)} className="flex-1 h-[52px] rounded-full text-white font-bold text-[13px]" style={{ background: ORANGE }}>Next → Menu</button>
            </div>
          </div>
        )}

        {/* STEP 3 - MENU */}
        {step===3 && (
          <div className="mt-6">
            <h3 className="text-[15px] font-semibold">Create Menu</h3>
            <p className="text-[11px] text-black/50 mt-1">Menu list - Masala Chai ₹30 jaise dikhega</p>

            <div className="mt-4 flex flex-col gap-2 max-h-[180px] overflow-auto">
              {menu.map((m,i)=>(
                <div key={i} className="flex justify-between items-center p-3 rounded-[12px] bg-[#F6F1E6] border" style={{ borderColor: BORDER }}>
                  <div><p className="text-[13px] font-medium">{m.name} <span className="text-black/40">₹{m.price}</span></p><p className="text-[11px] text-black/50">{m.desc}</p></div>
                  <button onClick={()=>setMenu(menu.filter((_,idx)=>idx!==i))} className="text-[11px] text-red-600 font-medium">Remove</button>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-[14px] border-2 border-dashed bg-white" style={{ borderColor: BORDER }}>
              <div className="grid grid-cols-[1fr_80px] gap-2">
                <input value={item.name} onChange={e=>setItem({...item, name:e.target.value})} placeholder="Item name *" className="h-[42px] rounded-[10px] border px-3 text-[13px] bg-[#FFFEFB]" style={{ borderColor: BORDER }} />
                <input value={item.price} onChange={e=>setItem({...item, price:e.target.value})} placeholder="₹ Price *" type="number" className="h-[42px] rounded-[10px] border px-3 text-[13px] bg-[#FFFEFB]" style={{ borderColor: BORDER }} />
              </div>
              <input value={item.desc} onChange={e=>setItem({...item, desc:e.target.value})} placeholder="Short description (spiced tea with milk • Popular)" className="mt-2 w-full h-[42px] rounded-[10px] border px-3 text-[12px] bg-[#FFFEFB]" style={{ borderColor: BORDER }} />
              <button onClick={addMenuItem} className="mt-2 w-full h-[40px] rounded-[10px] bg-black text-white text-[12px] font-medium">+ Add to Menu</button>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={()=>setStep(2)} className="flex-1 h-[52px] rounded-full border bg-white" style={{ borderColor: BORDER }}>Back</button>
              <button onClick={()=>setStep(4)} className="flex-1 h-[52px] rounded-full text-white font-bold" style={{ background: ORANGE }}>Next → Gallery</button>
            </div>
          </div>
        )}

        {/* STEP 4 - GALLERY & FINISH */}
        {step===4 && (
          <div className="mt-6">
            <h3 className="text-[15px] font-semibold">Gallery & Finish</h3>
            <p className="text-[11px] text-black/50 mt-1">Photos add karo - optional hai</p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="h-[90px] rounded-[12px] border-2 border-dashed flex flex-col items-center justify-center bg-white cursor-pointer" style={{ borderColor: BORDER }}>
                <span className="text-[20px]">+</span><span className="text-[10px]">Add Photo</span>
              </div>
              {gallery.map((g,i)=><div key={i} className="h-[90px] rounded-[12px] bg-black/5" />)}
            </div>

            <div className="mt-6 p-4 rounded-[14px] bg-black/[0.03] border" style={{ borderColor: BORDER }}>
              <p className="text-[13px] font-semibold">{form.shopName || "Your Cafe Name"}</p>
              <p className="text-[11px] text-black/60 mt-1">{form.category} • {form.address || "Matigara, Siliguri"}</p>
              <p className="text-[11px] text-black/60 mt-2">Menu: {menu.length} items • {form.openTime} - {form.closeTime}</p>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={()=>setStep(3)} className="flex-1 h-[52px] rounded-full border bg-white" style={{ borderColor: BORDER }}>Back</button>
              <button onClick={handleCreate} disabled={loading} className="flex-1 h-[52px] rounded-full text-white font-bold text-[13px] uppercase tracking-widest flex items-center justify-center gap-2" style={{ background: loading? "#9CA3AF" : ORANGE }}>
                {loading? "Creating..." : "Create Profile ✓"}
              </button>
            </div>
            <p className="text-center text-[10px] text-black/30 mt-3">After create → /profile/cafe/{username}</p>
          </div>
        )}
      </div>
    </div>
  );
}