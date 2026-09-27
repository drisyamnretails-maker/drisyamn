"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const ORANGE = "#E86A33";
const BG = "#EDE6D3";
const BLACK = "#0A0A0A";
const BORDER = "rgba(0,0,0,0.08)";

export default function CreateCafePage() {
  const { username } = useParams() as { username: string };
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    shopName: "", ownerName: "", phone: "", address: "", about: "", story: "",
    openTime: "08:00 AM", closeTime: "10:00 PM", category: "Tea Stall • Cafe • Hangout"
  });
  const [menu, setMenu] = useState([{ name: "Masala Chai", price: "30", desc: "Spiced tea with milk" }]);
  const [item, setItem] = useState({ name: "", price: "", desc: "" });

  const handleCreate = () => {
    if(!form.shopName ||!form.phone) return alert("Shop name & phone required");
    setLoading(true);
    const payload = {...form, menu, username, role: "food_beverage", createdAt: new Date().toISOString()};
    localStorage.setItem(`drisyamn_cafe_${username}`, JSON.stringify(payload));
    setTimeout(()=> router.push(`/profile/cafe/${username}`), 800);
  };

  return (
    <div className="min-h-screen w-full flex justify-center p-3" style={{ background: BG }}>
      <div className="w-full max-w-[480px] bg-[#FFFEFB] rounded-[24px] px-5 py-5 border border-black/5 shadow-[0_0_0_8px_#fff,0_20px_50px_rgba(0,0,0,0.12)]">

        {/* DRISYAMN HEAVY + HOVER */}
        <div className="text-center">
          <Link href="/" className="inline-block group">
            <h1 className="font-black tracking-[-0.04em] leading-none transition-all duration-300 group-hover:tracking-[-0.02em] group-hover:scale-[1.03] group-hover:text-[#E86A33] cursor-pointer"
              style={{ color: BLACK, fontSize: "46px", fontWeight: 900, fontFamily: "Georgia, serif", textShadow: "0 1px 0 rgba(0,0,0,0.1)" }}>
              Drisyamn
            </h1>
          </Link>
          <p className="mt-1 text-[12px] text-black/50 tracking-wide">Discover everything around you</p>
        </div>

        <div className="mt-5 flex justify-between items-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-black/40">Create Cafe • {username}</p>
          <div className="w-[70px] h-1.5 bg-black/10 rounded-full overflow-hidden">
            <div className="h-full transition-all" style={{ width: `${step*33.3}%`, background: ORANGE }} />
          </div>
        </div>

        <div className="mt-6">
          {step===1 && (
            <>
              <input value={form.shopName} onChange={e=>setForm({...form, shopName:e.target.value})} placeholder="Shop Name *" className="w-full h-[48px] rounded-[14px] border px-4 text-[14px] bg-[#F6F1E6] outline-none" style={{ borderColor: BORDER }} />
              <div className="grid grid-cols-2 gap-2 mt-3">
                <input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} placeholder="Phone *" className="h-[48px] rounded-[14px] border px-4 text-[14px] bg-[#F6F1E6]" style={{ borderColor: BORDER }} />
                <input value={form.address} onChange={e=>setForm({...form, address:e.target.value})} placeholder="Address *" className="h-[48px] rounded-[14px] border px-4 text-[14px] bg-[#F6F1E6]" style={{ borderColor: BORDER }} />
              </div>
              <button onClick={()=>setStep(2)} className="mt-4 w-full h-[52px] rounded-full text-white font-bold" style={{ background: ORANGE }}>Next → About</button>
            </>
          )}
          {step===2 && (
            <>
              <textarea value={form.about} onChange={e=>setForm({...form, about:e.target.value})} rows={3} placeholder="About Us" className="w-full rounded-[14px] border p-4 text-[13px] bg-[#F6F1E6]" style={{ borderColor: BORDER }} />
              <textarea value={form.story} onChange={e=>setForm({...form, story:e.target.value})} rows={3} placeholder="Our Story" className="mt-3 w-full rounded-[14px] border p-4 text-[13px] bg-[#F6F1E6]" style={{ borderColor: BORDER }} />
              <div className="flex gap-2 mt-4"><button onClick={()=>setStep(1)} className="flex-1 h-[48px] rounded-full border bg-white">Back</button><button onClick={()=>setStep(3)} className="flex-1 h-[48px] rounded-full text-white" style={{ background: ORANGE }}>Next → Menu</button></div>
            </>
          )}
          {step===3 && (
            <>
              {menu.map((m,i)=><div key={i} className="flex justify-between p-2.5 rounded-[10px] bg-black/5 mt-2 text-[13px]"><span>{m.name} ₹{m.price}</span><button onClick={()=>setMenu(menu.filter((_,idx)=>idx!==i))} className="text-red-600 text-[11px]">X</button></div>)}
              <div className="mt-3 grid grid-cols-[1fr_80px] gap-2"><input value={item.name} onChange={e=>setItem({...item, name:e.target.value})} placeholder="Item" className="h-[42px] border rounded-[10px] px-3 text-[13px]" style={{ borderColor: BORDER }} /><input value={item.price} onChange={e=>setItem({...item, price:e.target.value})} placeholder="₹" className="h-[42px] border rounded-[10px] px-3" style={{ borderColor: BORDER }} /></div>
              <button onClick={()=>{ if(item.name&&item.price){ setMenu([...menu,item]); setItem({name:"",price:"",desc:""}) } }} className="mt-2 w-full h-[40px] rounded-[10px] bg-black text-white text-[12px]">+ Add</button>
              <button onClick={handleCreate} disabled={loading} className="mt-4 w-full h-[52px] rounded-full text-white font-bold" style={{ background: loading?"#999":ORANGE }}>{loading?"Creating...":"Create Profile ✓"}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}