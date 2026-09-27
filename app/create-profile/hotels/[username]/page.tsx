"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const ORANGE = "#E86A33";
const PAGE_BG = "#EDE6D3";
const BLACK = "#0A0A0A";
const WHITE = "#FFFEFB";
const BORDER = "rgba(0,0,0,0.08)";

export default function CreateHotelProfilePage() {
  const { username } = useParams() as { username: string };
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    category: "Hotel",
    phone: "",
    whatsapp: "",
    address: "",
    city: "Siliguri",
    description: "",
    pricePerNight: "",
    rooms: "",
    amenities: [] as string[],
    checkIn: "12:00 PM",
    checkOut: "11:00 AM",
  });

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const AMENITIES_LIST = [
    "Free WiFi", "Parking", "AC Rooms", "Restaurant",
    "Room Service", "Hot Water", "TV", "Geyser",
    "Power Backup", "CCTV", "Lift", "Kitchen"
  ];

  // BANNER UPLOAD FIX
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Banner image 5MB se kam hona chahiye");
      return;
    }
    setBannerFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
  };

  // LOGO UPLOAD FIX
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const toggleAmenity = (item: string) => {
    setForm(prev => ({
     ...prev,
      amenities: prev.amenities.includes(item)
       ? prev.amenities.filter(a => a!== item)
        : [...prev.amenities, item]
    }));
  };

  const handleInput = (field: string, value: string) => {
    setForm(prev => ({...prev, [field]: value }));
  };

  // FINAL SUBMIT - PUSH TO HOMEFEED
  const handleCreateProfile = async () => {
    if (!form.businessName ||!form.phone ||!form.address) {
      alert("Business Name, Phone aur Address bharna zaruri hai");
      return;
    }

    setLoading(true);

    try {
      // YAHAN SUPABASE UPLOAD KA CODE AAYEGA
      // Banner + Logo upload logic
      const profileData = {
        username,
        role: "stays_property",
       ...form,
        banner: bannerPreview,
        logo: logoPreview,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(`drisyamn_hotel_${username}`, JSON.stringify(profileData));
      localStorage.setItem("drisyamn_last_profile", JSON.stringify(profileData));

      console.log("Profile Created:", profileData);

      // SUCCESS - PUSH TO HOMEFEED / FEED
      setTimeout(() => {
        router.push(`/feed?user=${username}&welcome=hotel`);
        // Agar tera homefeed ka route /homefeed hai to niche wala use kar
        // router.push(`/homefeed?user=${username}`);
      }, 800);

    } catch (err) {
      console.log(err);
      alert("Kuch error aaya, dubara try kar");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center p-4" style={{ background: PAGE_BG }}>
      <div className="w-full max-w-[480px] bg-white rounded-[24px] border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 0 0 8px #fff, 0 20px 50px rgba(0,0,0,0.12)" }}>

        {/* BANNER SECTION WITH FIX */}
        <div className="relative w-full h-[180px] bg-[#F6F1E6] group">
          {bannerPreview? (
            <>
              <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
              <button onClick={removeBanner} className="absolute top-3 right-3 w-8 h-8 bg-black/60 backdrop-blur rounded-full text-white flex items-center justify-center text-[14px] hover:bg-black/80">✕</button>
              <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full">BANNER ADDED ✓</div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <span className="text-[32px]">🏨</span>
              <p className="text-[12px] text-black/40 font-semibold">No Banner Selected</p>
            </div>
          )}

          <label className="absolute bottom-3 right-3 bg-white px-3 py-1.5 rounded-full text-[11px] font-bold shadow cursor-pointer hover:bg-black hover:text-white transition-all">
            {bannerPreview? "CHANGE BANNER" : "ADD BANNER"}
            <input type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
          </label>
        </div>

        {/* LOGO SECTION */}
        <div className="px-6 -mt-8 relative z-10 flex items-end gap-4">
          <div className="w-[72px] h-[72px] rounded-[18px] bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
            {logoPreview? (
              <img src={logoPreview} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[28px]">🏨</span>
            )}
          </div>
          <label className="mb-2 bg-black text-white px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer">
            {logoPreview? "CHANGE LOGO" : "ADD LOGO"}
            <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
          </label>
          {logoPreview && <button onClick={removeLogo} className="mb-2 text-[10px] text-red-500 font-bold">REMOVE</button>}
        </div>

        <div className="px-6 py-6">
          <h1 className="text-[22px] font-black tracking-tight" style={{ color: BLACK }}>Create Hotel Profile</h1>
          <p className="text-[12px] text-black/50 mt-1">@{username} • Hotels, Homestays & Real Estate</p>

          <div className="mt-6 flex flex-col gap-4">
            <div>
              <label className="text-[11px] font-bold tracking-widest text-black/60">BUSINESS NAME *</label>
              <input value={form.businessName} onChange={(e)=>handleInput("businessName", e.target.value)} placeholder="Ex: Tanka Homestay Siliguri" className="mt-1.5 w-full h-[48px] px-4 rounded-[12px] bg-[#F6F1E6] border border-black/5 text-[14px] font-semibold outline-none focus:bg-white focus:border-black/15" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold tracking-widest text-black/60">CATEGORY</label>
                <select value={form.category} onChange={(e)=>handleInput("category", e.target.value)} className="mt-1.5 w-full h-[48px] px-3 rounded-[12px] bg-[#F6F1E6] border border-black/5 text-[13px] font-semibold">
                  <option>Hotel</option>
                  <option>Homestay</option>
                  <option>Resort</option>
                  <option>Guest House</option>
                  <option>Real Estate</option>
                  <option>Rent / PG</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold tracking-widest text-black/60">CITY</label>
                <input value={form.city} onChange={(e)=>handleInput("city", e.target.value)} className="mt-1.5 w-full h-[48px] px-4 rounded-[12px] bg-[#F6F1E6] border border-black/5 text-[14px] font-semibold" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold tracking-widest text-black/60">PHONE *</label>
                <input value={form.phone} onChange={(e)=>handleInput("phone", e.target.value)} placeholder="98xxxxxxxx" className="mt-1.5 w-full h-[48px] px-4 rounded-[12px] bg-[#F6F1E6] border border-black/5 text-[14px]" />
              </div>
              <div>
                <label className="text-[11px] font-bold tracking-widest text-black/60">WHATSAPP</label>
                <input value={form.whatsapp} onChange={(e)=>handleInput("whatsapp", e.target.value)} placeholder="98xxxxxxxx" className="mt-1.5 w-full h-[48px] px-4 rounded-[12px] bg-[#F6F1E6] border border-black/5 text-[14px]" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold tracking-widest text-black/60">ADDRESS *</label>
              <input value={form.address} onChange={(e)=>handleInput("address", e.target.value)} placeholder="Full address, Siliguri" className="mt-1.5 w-full h-[48px] px-4 rounded-[12px] bg-[#F6F1E6] border border-black/5 text-[14px]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold tracking-widest text-black/60">PRICE / NIGHT</label>
                <input value={form.pricePerNight} onChange={(e)=>handleInput("pricePerNight", e.target.value)} placeholder="₹ 1200" className="mt-1.5 w-full h-[48px] px-4 rounded-[12px] bg-[#F6F1E6] border border-black/5 text-[14px]" />
              </div>
              <div>
                <label className="text-[11px] font-bold tracking-widest text-black/60">TOTAL ROOMS</label>
                <input value={form.rooms} onChange={(e)=>handleInput("rooms", e.target.value)} placeholder="Ex: 5" className="mt-1.5 w-full h-[48px] px-4 rounded-[12px] bg-[#F6F1E6] border border-black/5 text-[14px]" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold tracking-widest text-black/60">DESCRIPTION</label>
              <textarea value={form.description} onChange={(e)=>handleInput("description", e.target.value)} placeholder="Apne hotel ke baare me likho..." rows={3} className="mt-1.5 w-full p-4 rounded-[12px] bg-[#F6F1E6] border border-black/5 text-[13px] resize-none outline-none" />
            </div>

            <div>
              <label className="text-[11px] font-bold tracking-widest text-black/60">AMENITIES</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {AMENITIES_LIST.map(item => {
                  const active = form.amenities.includes(item);
                  return (
                    <button key={item} onClick={()=>toggleAmenity(item)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${active? "bg-black text-white border-black" : "bg-white text-black/70 border-black/10"}`}>
                      {active? "✓ " : "+ "}{item}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <button onClick={handleCreateProfile} disabled={loading} className="mt-8 w-full h-[54px] rounded-full text-white font-black tracking-widest text-[13px] flex items-center justify-center gap-2" style={{ background: loading? "#9CA3AF" : ORANGE, boxShadow: loading? "none" : "0 10px 24px rgba(232,106,51,0.35)" }}>
            {loading? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> CREATING...</>
            ) : (
              <>CREATE & GO TO HOMEFEED →</>
            )}
          </button>

          <p className="mt-3 text-center text-[10px] text-black/30">After create you will be redirected to homefeed</p>
        </div>
      </div>
    </div>
  );
}