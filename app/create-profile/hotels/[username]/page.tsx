"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const ORANGE = "#E86A33";
const PAGE_BG = "#EDE6D3";
const BLACK = "#0A0A0A";
const WHITE = "#FFFEFB";
const BORDER = "rgba(0,0,0,0.08)";
const SOFT = "#F6F1E6";

export default function CreateHotelProfileFinal() {
  const params = useParams() as { username: string };
  const username = params?.username || "tanka_7845";
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Media States
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [storyImages, setStoryImages] = useState<string[]>([]);

  // Form States
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    category: "Hotel",
    tagline: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    city: "Siliguri",
    landmark: "",
    pricePerNight: "",
    rooms: "",
    totalFloors: "",
    established: "",
    checkIn: "12:00 PM",
    checkOut: "11:00 AM",
    gst: "",
    aboutUs: "",
    ourStory: "",
    whyChooseUs: "",
    amenities: [] as string[],
    rules: [] as string[],
    languages: [] as string[],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const AMENITIES_LIST = [
    "Free WiFi", "Parking", "AC Rooms", "Restaurant",
    "Room Service", "Hot Water", "TV", "Geyser",
    "Power Backup", "CCTV", "Lift", "Kitchen",
    "Laundry", "Airport Pickup", "Pet Friendly", "Bonfire"
  ];

  const RULES_LIST = [
    "Unmarried Couples Allowed", "Family Only", "No Smoking",
    "No Alcohol", "Pets Allowed", "ID Required"
  ];

  const LANG_LIST = ["Hindi", "English", "Bengali", "Nepali", "Bhojpuri"];

  // --- BANNER HANDLER FIXED ---
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) {
      alert("Banner 6MB se kam rakho bhai");
      return;
    }
    setBannerFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setBannerPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
  };

  // --- LOGO HANDLER FIXED ---
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  // --- STORY IMAGE UPLOAD ---
  const handleStoryImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoryImages(prev => [...prev, reader.result as string].slice(0, 6));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleInput = (field: string, value: any) => {
    setForm(prev => ({...prev, [field]: value }));
  };

  const toggleArray = (field: "amenities" | "rules" | "languages", item: string) => {
    setForm(prev => {
      const arr = prev[field] as string[];
      return {
       ...prev,
        [field]: arr.includes(item)? arr.filter(i => i!== item) : [...arr, item]
      };
    });
  };

  // FINAL CREATE AND PUSH TO HIS PROFILE PAGE
  const handleCreateProfile = async () => {
    if (!form.businessName ||!form.phone ||!form.address ||!form.aboutUs) {
      alert("Business Name, Phone, Address aur About Us bharna zaruri hai");
      setStep(1);
      return;
    }
    if (!form.ourStory) {
      alert("Our Story likh de bhai");
      setStep(2);
      return;
    }
    if (!form.whyChooseUs) {
      alert("Why People Choose Us likh de");
      setStep(2);
      return;
    }

    setLoading(true);

    try {
      const finalProfileData = {
        username: username,
        role: "stays_property",
        businessName: form.businessName,
        ownerName: form.ownerName,
        category: form.category,
        tagline: form.tagline,
        contact: {
          phone: form.phone,
          whatsapp: form.whatsapp,
          email: form.email,
        },
        location: {
          address: form.address,
          city: form.city,
          landmark: form.landmark,
        },
        stayInfo: {
          pricePerNight: form.pricePerNight,
          rooms: form.rooms,
          floors: form.totalFloors,
          established: form.established,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          gst: form.gst,
        },
        content: {
          aboutUs: form.aboutUs,
          ourStory: form.ourStory,
          whyChooseUs: form.whyChooseUs,
        },
        amenities: form.amenities,
        rules: form.rules,
        languages: form.languages,
        media: {
          banner: bannerPreview,
          logo: logoPreview,
          stories: storyImages,
        },
        verified: false,
        rating: 0,
        createdAt: new Date().toISOString(),
      };

      // Local Storage Save
      localStorage.setItem(`drisyamn_hotel_profile_${username}`, JSON.stringify(finalProfileData));
      localStorage.setItem(`drisyamn_last_hotel_${username}`, JSON.stringify(finalProfileData));
      localStorage.setItem("drisyamn_current_user", username);
      localStorage.setItem("drisyamn_current_role", "hotels");

      console.log("Hotel Profile Created Final:", finalProfileData);

      // Simulate Upload Delay
      await new Promise(res => setTimeout(res, 1200));

      // ROUTE TO HIS PROFILE PAGE
      router.push(`/profile/hotels/${username}`);

    } catch (error) {
      console.log("Create Error:", error);
      alert("Error aa gaya, dubara try kar bhai");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center px-3 py-4 md:py-8" style={{ background: PAGE_BG }}>
      <div className="w-full max-w-[560px] bg-white rounded-[28px] border overflow-hidden" style={{ borderColor: BORDER, boxShadow: "0 0 0 8px #fff, 0 24px 64px rgba(0,0,0,0.14)" }}>

        {/* TOP BANNER WITH FIXED UPLOAD */}
        <div className="relative w-full h-[200px] md:h-[220px] bg-[#F6F1E6] overflow-hidden">
          {bannerPreview? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover" />
              <button onClick={removeBanner} className="absolute top-3 right-3 w-8 h-8 bg-black/70 backdrop-blur rounded-full text-white flex items-center justify-center text-[12px] hover:bg-black transition-colors">✕</button>
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur text-white text-[10px] px-2.5 py-1 rounded-full tracking-widest font-bold">BANNER ADDED ✓</div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[22px]">🏨</div>
              <p className="text-[11px] font-bold tracking-widest text-black/30">NO BANNER SELECTED</p>
              <p className="text-[10px] text-black/20">Recommended 1200x400</p>
            </div>
          )}

          <label className="absolute bottom-3 right-3 bg-white px-3.5 py-2 rounded-full text-[11px] font-black tracking-widest shadow-md cursor-pointer hover:bg-black hover:text-white transition-all border">
            {bannerPreview? "CHANGE BANNER" : "ADD BANNER"}
            <input type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
          </label>

          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest flex items-center gap-2 border">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            @{username}
          </div>
        </div>

        {/* LOGO + BASIC */}
        <div className="px-6 -mt-10 relative z-10 flex items-end gap-4">
          <div className="w-[80px] h-[80px] rounded-[20px] bg-white border-[4px] border-white shadow-xl overflow-hidden flex items-center justify-center">
            {logoPreview? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[32px]">🏨</span>
            )}
          </div>
          <div className="pb-2 flex items-center gap-2">
            <label className="bg-black text-white px-3 py-1.5 rounded-full text-[10px] font-bold cursor-pointer hover:bg-zinc-800">
              {logoPreview? "CHANGE LOGO" : "ADD LOGO"}
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            </label>
            {logoPreview && (
              <button onClick={removeLogo} className="text-[10px] font-bold text-red-500 hover:underline">REMOVE</button>
            )}
          </div>
        </div>

        {/* STEP INDICATOR */}
        <div className="px-6 mt-6 flex gap-2">
          <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 1? "bg-black" : "bg-black/10"}`} />
          <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 2? "bg-black" : "bg-black/10"}`} />
          <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 3? "bg-orange-500" : "bg-black/10"}`} />
        </div>

        <div className="px-6 py-6">
          <h1 className="text-[24px] font-black tracking-tight leading-none" style={{ color: BLACK }}>Create Hotel Profile</h1>
          <p className="text-[12px] text-black/50 mt-2 font-medium">Step {step} of 3 • Build your property presence on Drisyamn</p>

          {/* STEP 1 - BASIC INFO */}
          {step === 1 && (
            <div className="mt-6 flex flex-col gap-4 animate-in fade-in">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[11px] font-bold tracking-widest text-black/60">BUSINESS NAME *</label>
                  <input value={form.businessName} onChange={e => handleInput("businessName", e.target.value)} placeholder="Ex: Tanka Homestay, Siliguri" className="mt-1.5 w-full h-[52px] px-4 rounded-[14px] bg-[#F6F1E6] border border-black/5 text-[14px] font-bold outline-none focus:bg-white focus:border-black/15 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold tracking-widest text-black/60">OWNER NAME</label>
                    <input value={form.ownerName} onChange={e => handleInput("ownerName", e.target.value)} placeholder="Your Name" className="mt-1.5 w-full h-[52px] px-4 rounded-[14px] bg-[#F6F1E6] border border-black/5 text-[14px] font-semibold outline-none focus:bg-white" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold tracking-widest text-black/60">CATEGORY</label>
                    <select value={form.category} onChange={e => handleInput("category", e.target.value)} className="mt-1.5 w-full h-[52px] px-3 rounded-[14px] bg-[#F6F1E6] border border-black/5 text-[13px] font-bold outline-none">
                      <option>Hotel</option><option>Homestay</option><option>Resort</option><option>Guest House</option><option>Villa</option><option>Real Estate</option><option>Rent / PG</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold tracking-widest text-black/60">TAGLINE</label>
                  <input value={form.tagline} onChange={e => handleInput("tagline", e.target.value)} placeholder="Ex: Stay in the heart of Siliguri" className="mt-1.5 w-full h-[52px] px-4 rounded-[14px] bg-[#F6F1E6] border border-black/5 text-[13px] outline-none focus:bg-white" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold tracking-widest text-black/60">PHONE *</label>
                    <input value={form.phone} onChange={e => handleInput("phone", e.target.value)} placeholder="98xxxxxxxx" className="mt-1.5 w-full h-[52px] px-4 rounded-[14px] bg-[#F6F1E6] border border-black/5 text-[14px] outline-none focus:bg-white" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold tracking-widest text-black/60">WHATSAPP</label>
                    <input value={form.whatsapp} onChange={e => handleInput("whatsapp", e.target.value)} placeholder="Same as phone" className="mt-1.5 w-full h-[52px] px-4 rounded-[14px] bg-[#F6F1E6] border border-black/5 text-[14px] outline-none focus:bg-white" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold tracking-widest text-black/60">EMAIL</label>
                  <input value={form.email} onChange={e => handleInput("email", e.target.value)} placeholder="hotel@gmail.com" className="mt-1.5 w-full h-[52px] px-4 rounded-[14px] bg-[#F6F1E6] border border-black/5 text-[14px] outline-none focus:bg-white" />
                </div>
                <div>
                  <label className="text-[11px] font-bold tracking-widest text-black/60">FULL ADDRESS *</label>
                  <input value={form.address} onChange={e => handleInput("address", e.target.value)} placeholder="Sevoke Road, Near City Center, Siliguri" className="mt-1.5 w-full h-[52px] px-4 rounded-[14px] bg-[#F6F1E6] border border-black/5 text-[14px] outline-none focus:bg-white" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="text-[10px] font-bold tracking-widest text-black/60">CITY</label><input value={form.city} onChange={e => handleInput("city", e.target.value)} className="mt-1.5 w-full h-[48px] px-3 rounded-[12px] bg-[#F6F1E6] border border-black/5 text-[13px] font-bold" /></div>
                  <div><label className="text-[10px] font-bold tracking-widest text-black/60">LANDMARK</label><input value={form.landmark} onChange={e => handleInput("landmark", e.target.value)} placeholder="Near..." className="mt-1.5 w-full h-[48px] px-3 rounded-[12px] bg-[#F6F1E6] border border-black/5 text-[13px]" /></div>
                  <div><label className="text-[10px] font-bold tracking-widest text-black/60">ESTD.</label><input value={form.established} onChange={e => handleInput("established", e.target.value)} placeholder="2020" className="mt-1.5 w-full h-[48px] px-3 rounded-[12px] bg-[#F6F1E6] border border-black/5 text-[13px]" /></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <div><label className="text-[10px] font-bold tracking-widest text-black/60">PRICE / NIGHT</label><input value={form.pricePerNight} onChange={e => handleInput("pricePerNight", e.target.value)} placeholder="₹ 1499" className="mt-1.5 w-full h-[48px] px-3 rounded-[12px] bg-white border text-[13px] font-bold" /></div>
                <div><label className="text-[10px] font-bold tracking-widest text-black/60">TOTAL ROOMS</label><input value={form.rooms} onChange={e => handleInput("rooms", e.target.value)} placeholder="12" className="mt-1.5 w-full h-[48px] px-3 rounded-[12px] bg-white border text-[13px] font-bold" /></div>
              </div>

              <button onClick={() => setStep(2)} className="mt-4 w-full h-[54px] rounded-full bg-black text-white font-black tracking-widest text-[12px] hover:bg-zinc-900 transition-all">NEXT — ABOUT & STORY →</button>
            </div>
          )}

          {/* STEP 2 - ABOUT US, OUR STORY, WHY CHOOSE US */}
          {step === 2 && (
            <div className="mt-6 flex flex-col gap-5 animate-in fade-in">
              <div className="bg-[#FFF7ED] border border-orange-100 rounded-[16px] p-3">
                <p className="text-[11px] font-bold text-orange-600">🔥 YE 3 SECTION PROFILE PAGE PE DIKHEGA</p>
                <p className="text-[10px] text-black/50 mt-1">Customer ko trust dilane ke liye sabse important hai</p>
              </div>

              <div>
                <label className="text-[11px] font-black tracking-widest text-black flex items-center gap-2">ABOUT US * <span className="bg-black text-white text-[8px] px-1.5 py-0.5 rounded">MAIN</span></label>
                <p className="text-[10px] text-black/40 mt-1">Apne hotel ke baare me batao - kya karte ho, kya special hai</p>
                <textarea value={form.aboutUs} onChange={e => handleInput("aboutUs", e.target.value)} placeholder="Ex: We are a family-run homestay in the heart of Siliguri, serving guests since 2018. We provide clean, affordable rooms with home-cooked food and warm hospitality..." rows={5} className="mt-2 w-full p-4 rounded-[14px] bg-[#F6F1E6] border border-black/5 text-[13px] leading-relaxed resize-none outline-none focus:bg-white focus:border-black/15" />
                <div className="mt-1 text-right text-[10px] text-black/30">{form.aboutUs.length}/400 chars</div>
              </div>

              <div>
                <label className="text-[11px] font-black tracking-widest text-black flex items-center gap-2">OUR STORY * <span className="bg-orange-500 text-white text-[8px] px-1.5 py-0.5 rounded">EMOTIONAL</span></label>
                <p className="text-[10px] text-black/40 mt-1">Kaise shuru hua? Journey kya thi? Emotional connect banao</p>
                <textarea value={form.ourStory} onChange={e => handleInput("ourStory", e.target.value)} placeholder="Ex: Started with just 2 rooms in my father's house... My dream was to give travelers a home away from home. Every guest is family for us. From struggles to now hosting 1000+ happy guests..." rows={5} className="mt-2 w-full p-4 rounded-[14px] bg-[#F6F1E6] border border-black/5 text-[13px] leading-relaxed resize-none outline-none focus:bg-white" />
                <div className="mt-2 flex gap-2">
                  <label className="text-[10px] font-bold bg-white border px-3 py-1.5 rounded-full cursor-pointer hover:bg-black hover:text-white">
                    + ADD STORY IMAGES ({storyImages.length}/6)
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleStoryImage} />
                  </label>
                  {storyImages.length > 0 && <button onClick={() => setStoryImages([])} className="text-[10px] font-bold text-red-500">CLEAR</button>}
                </div>
                {storyImages.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {storyImages.map((img, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} src={img} alt="story" className="w-full h-16 object-cover rounded-[10px] border" />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-black tracking-widest text-black flex items-center gap-2">WHY PEOPLE CHOOSE US * <span className="bg-green-600 text-white text-[8px] px-1.5 py-0.5 rounded">TRUST</span></label>
                <p className="text-[10px] text-black/40 mt-1">Log tumhe hi kyu choose kare? 3-4 strong points likho</p>
                <textarea value={form.whyChooseUs} onChange={e => handleInput("whyChooseUs", e.target.value)} placeholder="Ex: 1. Prime location - 2 mins from bus stand&#10;2. 24x7 hot water & WiFi&#10;3. Home-cooked Bengali food included&#10;4. 500+ 5-star reviews on Google&#10;5. Family safe & couple friendly" rows={5} className="mt-2 w-full p-4 rounded-[14px] bg-[#F6F1E6] border border-black/5 text-[13px] leading-relaxed resize-none outline-none focus:bg-white" />
              </div>

              <div className="flex gap-3 mt-2">
                <button onClick={() => setStep(1)} className="flex-1 h-[50px] rounded-full bg-white border border-black/10 font-bold text-[11px] tracking-widest">← BACK</button>
                <button onClick={() => setStep(3)} className="flex-1 h-[50px] rounded-full bg-black text-white font-black tracking-widest text-[11px]">NEXT — FACILITIES →</button>
              </div>
            </div>
          )}

          {/* STEP 3 - AMENITIES & FINAL */}
          {step === 3 && (
            <div className="mt-6 flex flex-col gap-5 animate-in fade-in">
              <div>
                <label className="text-[11px] font-bold tracking-widest text-black/60">AMENITIES & FACILITIES</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {AMENITIES_LIST.map(item => {
                    const active = form.amenities.includes(item);
                    return <button key={item} onClick={() => toggleArray("amenities", item)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${active? "bg-black text-white border-black" : "bg-white text-black/60 border-black/10 hover:border-black/20"}`}>{active? "✓ " : "+ "}{item}</button>;
                  })}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold tracking-widest text-black/60">HOUSE RULES</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {RULES_LIST.map(item => {
                    const active = form.rules.includes(item);
                    return <button key={item} onClick={() => toggleArray("rules", item)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${active? "bg-orange-500 text-white border-orange-500" : "bg-white text-black/60 border-black/10"}`}>{active? "✓ " : "+ "}{item}</button>;
                  })}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold tracking-widest text-black/60">LANGUAGES SPOKEN</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {LANG_LIST.map(item => {
                    const active = form.languages.includes(item);
                    return <button key={item} onClick={() => toggleArray("languages", item)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${active? "bg-black text-white border-black" : "bg-white text-black/60 border-black/10"}`}>{item}</button>;
                  })}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-[10px] font-bold tracking-widest text-black/60">CHECK-IN</label><select value={form.checkIn} onChange={e => handleInput("checkIn", e.target.value)} className="mt-1.5 w-full h-[44px] px-2 rounded-[10px] bg-[#F6F1E6] border border-black/5 text-[12px] font-bold"><option>12:00 PM</option><option>11:00 AM</option><option>2:00 PM</option><option>Flexible</option></select></div>
                <div><label className="text-[10px] font-bold tracking-widest text-black/60">CHECK-OUT</label><select value={form.checkOut} onChange={e => handleInput("checkOut", e.target.value)} className="mt-1.5 w-full h-[44px] px-2 rounded-[10px] bg-[#F6F1E6] border border-black/5 text-[12px] font-bold"><option>11:00 AM</option><option>10:00 AM</option><option>12:00 PM</option><option>Flexible</option></select></div>
                <div><label className="text-[10px] font-bold tracking-widest text-black/60">GST</label><input value={form.gst} onChange={e => handleInput("gst", e.target.value)} placeholder="Optional" className="mt-1.5 w-full h-[44px] px-2 rounded-[10px] bg-[#F6F1E6] border border-black/5 text-[12px]" /></div>
              </div>

              <div className="bg-black text-white rounded-[16px] p-4 mt-2">
                <p className="text-[11px] font-bold tracking-widest">PREVIEW SUMMARY</p>
                <div className="mt-2 text-[11px] leading-relaxed text-white/70">
                  <p>🏨 <b className="text-white">{form.businessName || "Your Hotel Name"}</b> • {form.category}</p>
                  <p className="mt-1">📍 {form.address || "Address"} • {form.city}</p>
                  <p className="mt-1 line-clamp-2">💬 About: {form.aboutUs.slice(0, 60) || "Not added yet"}...</p>
                  <p className="mt-1">✨ Why Choose: {form.whyChooseUs.slice(0, 60) || "Not added yet"}...</p>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button onClick={() => setStep(2)} className="flex-1 h-[50px] rounded-full bg-white border border-black/10 font-bold text-[11px] tracking-widest">← BACK</button>
                <button onClick={handleCreateProfile} disabled={loading} className="flex-[1.8] h-[54px] rounded-full text-white font-black tracking-widest text-[12px] flex items-center justify-center gap-2 transition-all" style={{ background: loading? "#9CA3AF" : ORANGE, boxShadow: loading? "none" : "0 12px 28px rgba(232,106,51,0.4)" }}>
                  {loading? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> CREATING...</>) : (<>CREATE & VIEW PROFILE →</>)}
                </button>
              </div>

              <p className="text-center text-[10px] text-black/30 mt-1">Profile banne ke baad aapko aapke hotels profile page pe le jaya jayega:<br /><b className="text-black/50">/profile/hotels/{username}</b></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}