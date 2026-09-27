"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

const DARK_GREEN = "#1A4D2E";
const BG = "#E9E1C8";

export default function CreateCafePageFinal() {
  const { username } = useParams() as { username: string };
  const router = useRouter();

  // Images
  const [cover, setCover] = useState<string>("");
  const [dp, setDp] = useState<string>("");
  const [gallery, setGallery] = useState<any[]>([]);

  // Details
  const [form, setForm] = useState({
    shopName: "",
    address: "",
    phone: "",
    location: "",
    category: "Tea Stall",
    about: "",
    story: "",
    whyChoose: "",
  });

  // SINGLE MENU ONLY - 1 hi menu
  const [menu, setMenu] = useState<any[]>([
    { id: 1, name: "", desc: "", price: "", image: "" },
  ]);

  // Load existing
  useEffect(() => {
    const saved = localStorage.getItem(`drisyamn_cafe_${username}`);
    if (saved) {
      const d = JSON.parse(saved);
      setForm({
        shopName: d.shopName || "",
        address: d.address || "",
        phone: d.phone || "",
        location: d.location || "",
        category: d.category || "Tea Stall",
        about: d.about || "",
        story: d.story || "",
        whyChoose: d.whyChoose || "",
      });
      setCover(d.cover || "");
      setDp(d.dp || "");
      if (d.menu && d.menu.length > 0) setMenu(d.menu);
      if (d.gallery) setGallery(d.gallery);
    }
  }, [username]);

  // Cover / DP / Menu Image Handler - fit to cover/dp
  const handleImage = (e: any, type: "cover" | "dp" | "menu", index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert("File too big, max 5MB");
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (type === "cover") setCover(result);
      if (type === "dp") setDp(result);
      if (type === "menu" && index!== undefined) {
        const newMenu = [...menu];
        newMenu[index].image = result;
        setMenu(newMenu);
      }
    };
    reader.readAsDataURL(file);
  };

  // Gallery Image / Video from files - working conditions
  const handleGalleryUpload = (e: any) => {
    const files = Array.from(e.target.files as FileList);
    if (gallery.length + files.length > 20) return alert("Max 20 gallery items");

    files.forEach((file: any) => {
      if (file.size > 15 * 1024 * 1024) return alert(`${file.name} too big, max 15MB`);
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");
      if (!isVideo &&!isImage) return alert("Only image/video allowed");

      const reader = new FileReader();
      reader.onload = () => {
        setGallery((prev) => [
         ...prev,
          {
            id: Date.now() + Math.random(),
            url: reader.result as string,
            type: isVideo? "video" : "image",
            name: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  // Menu Logic - Single Menu Only
  const addMenuItem = () => {
    setMenu([...menu, { id: Date.now(), name: "", desc: "", price: "", image: "" }]);
  };
  const removeMenuItem = (i: number) => {
    if (menu.length === 1) return alert("Atleast 1 menu item required");
    setMenu(menu.filter((_, idx) => idx!== i));
  };
  const updateMenu = (i: number, field: string, val: string) => {
    const newMenu = [...menu];
    newMenu[i][field] = val;
    setMenu(newMenu);
  };
  const removeGallery = (id: number) => {
    setGallery(gallery.filter((g) => g.id!== id));
  };

  // Save & Redirect to Profile
  const handleSave = () => {
    if (!form.shopName.trim()) return alert("Shop Name required *");
    if (!form.phone.trim()) return alert("Contact Number required *");
    if (!cover) return alert("Cover image select karo");
    if (!dp) return alert("DP image select karo");

    const filteredMenu = menu.filter((m) => m.name.trim() && m.price);
    if (filteredMenu.length === 0) return alert("Atleast 1 Menu item with name & price add karo");

    const finalData = {
      username,
      shopName: form.shopName,
      address: form.address,
      phone: form.phone,
      location: form.location,
      category: form.category,
      about: form.about,
      story: form.story,
      whyChoose: form.whyChoose,
      cover,
      dp,
      gallery,
      menu: filteredMenu,
      cat: `${form.category} • Cafe • Hangout`,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(`drisyamn_cafe_${username}`, JSON.stringify(finalData));
    alert("Profile Saved Successfully!");
    router.push(`/profile/cafe/${username}`);
  };

  return (
    <div className="min-h-screen w-full flex justify-center" style={{ background: BG }}>
      <div className="w-full max-w-[780px] p-2 md:p-4">

        {/* DRISYAMN NAV BAR - SAME PLACE AS PROFILE PHOTO */}
        <div className="w-full bg-white rounded-[14px] border border-black/5 shadow-sm h-[56px] px-3 md:px-5 flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/" className="flex flex-col items-center text-[#1A4D2E]">
              <span className="text-[16px]">🏠</span>
              <span className="text-[10px] font-bold">Home</span>
            </Link>
            <button className="flex flex-col items-center text-black/50 hover:text-black">
              <span className="text-[15px]">💬</span>
              <span className="text-[10px]">Message</span>
            </button>
            <button className="flex flex-col items-center text-black/50 hover:text-black">
              <span className="text-[15px]">🔔</span>
              <span className="text-[10px]">Notification</span>
            </button>
            <button className="flex flex-col items-center text-black/50 hover:text-black">
              <span className="text-[15px]">📚</span>
              <span className="text-[10px]">Books</span>
            </button>
          </div>

          <div className="flex flex-col items-center justify-center">
            <span className="text-[24px] md:text-[26px] font-black tracking-tighter leading-none" style={{ fontFamily: "Georgia, serif", fontWeight: 900 }}>
              Drisyamn
            </span>
            <span className="text-[7px] md:text-[8px] tracking-[0.15em] text-black/50 uppercase font-medium">
              Discover Everything Around You
            </span>
          </div>

          <div className="flex items-center">
            <div className="px-3 py-1.5 rounded-full text-white text-[11px] font-bold" style={{ background: DARK_GREEN }}>
              {username}
            </div>
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-[22px] overflow-hidden border border-black/5 shadow-sm">

          {/* COVER - SELECT IMAGE FROM FILE, FIT TO COVER */}
          <div className="relative h-[240px] w-full bg-[#F5F5F0] group">
            {cover? (
              <img src={cover} className="w-full h-full object-cover" alt="cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-black/30">
                <span className="text-[28px]">🖼️</span>
                <span className="text-[13px] mt-1">No Cover Selected</span>
                <span className="text-[11px]">Image will fit to cover</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition" />
            <label className="absolute bottom-3 right-3 px-5 py-2.5 rounded-full text-white text-[12px] font-bold cursor-pointer shadow-lg hover:scale-105 transition" style={{ background: DARK_GREEN }}>
              Select Cover Image
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e, "cover")} />
            </label>

            {/* DP IMAGE FROM GALLERY FIT WITH DP */}
            <div className="absolute -bottom-[44px] left-1/2 -translate-x-1/2">
              <div className="relative w-[92px] h-[92px] rounded-full bg-white border-[5px] border-white shadow-xl overflow-hidden flex items-center justify-center">
                {dp? (
                  <img src={dp} className="w-full h-full object-cover" alt="dp" />
                ) : (
                  <span className="text-[38px]">☕</span>
                )}
                <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-[10px] font-bold opacity-0 hover:opacity-100 cursor-pointer transition">
                  <span>📷</span>
                  <span className="mt-0.5">DP</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e, "dp")} />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-[60px] p-5 md:p-7">

            {/* DETAILS */}
            <h2 className="font-bold text-[18px] flex items-center gap-2">Details <span className="text-[11px] font-normal text-black/40">— Name / Address / Contact / Location / Category</span></h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div>
                <label className="text-[11px] font-bold text-black/60 tracking-wide">SHOP / CAFE NAME *</label>
                <input value={form.shopName} onChange={(e) => setForm({...form, shopName: e.target.value })} placeholder="Chai Break Matigara" className="mt-1.5 w-full h-[48px] border border-black/10 rounded-[12px] px-4 text-[14px] outline-none focus:border-black focus:ring-1 focus:ring-black" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-black/60 tracking-wide">CATEGORY DROP-DOWN</label>
                <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value })} className="mt-1.5 w-full h-[48px] border border-black/10 rounded-[12px] px-4 text-[14px] bg-white outline-none focus:border-black">
                  <option>Tea Stall</option>
                  <option>Cafe</option>
                  <option>Restaurant</option>
                  <option>Bakery</option>
                  <option>Fast Food</option>
                  <option>Hangout Spot</option>
                  <option>Cloud Kitchen</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-[11px] font-bold text-black/60 tracking-wide">ADDRESS</label>
                <input value={form.address} onChange={(e) => setForm({...form, address: e.target.value })} placeholder="Matigara, Siliguri, WB 734010" className="mt-1.5 w-full h-[48px] border border-black/10 rounded-[12px] px-4 text-[14px] outline-none focus:border-black" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-black/60 tracking-wide">CONTACT NUMBER *</label>
                <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value })} placeholder="9876543210" type="tel" className="mt-1.5 w-full h-[48px] border border-black/10 rounded-[12px] px-4 text-[14px] outline-none focus:border-black" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-black/60 tracking-wide">LOCATION / MAP LINK</label>
                <input value={form.location} onChange={(e) => setForm({...form, location: e.target.value })} placeholder="https://maps.app.goo.gl/..." className="mt-1.5 w-full h-[48px] border border-black/10 rounded-[12px] px-4 text-[14px] outline-none focus:border-black" />
              </div>
            </div>

            {/* ABOUT US / OUR STORIES / WHY CHOOSE US */}
            <div className="mt-10 space-y-6">
              <div>
                <label className="text-[11px] font-bold text-black/60 tracking-wide">ABOUT US</label>
                <textarea value={form.about} onChange={(e) => setForm({...form, about: e.target.value })} placeholder="We serve fresh chai, momos, puffs and fast food. Best place for friends, couples and family..." className="mt-1.5 w-full h-[100px] border border-black/10 rounded-[12px] p-4 text-[14px] resize-none outline-none focus:border-black" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-black/60 tracking-wide">OUR STORIES</label>
                <textarea value={form.story} onChange={(e) => setForm({...form, story: e.target.value })} placeholder="Founded in 2021 by Rohan Pradhan, started as small tea stall..." className="mt-1.5 w-full h-[100px] border border-black/10 rounded-[12px] p-4 text-[14px] resize-none outline-none focus:border-black" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-black/60 tracking-wide">WHY PEOPLE CHOOSE US</label>
                <textarea value={form.whyChoose} onChange={(e) => setForm({...form, whyChoose: e.target.value })} placeholder="Best chai, cozy ambiance, quick service, affordable price..." className="mt-1.5 w-full h-[100px] border border-black/10 rounded-[12px] p-4 text-[14px] resize-none outline-none focus:border-black" />
              </div>
            </div>

            {/* SINGLE MENU - IMAGE / NAME / DESCRIPTION / PRICE */}
            <div className="mt-10">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-[18px]">Add Menu <span className="text-[11px] font-normal text-black/40">(Image / Name / Description / Price) - SINGLE</span></h2>
                <button onClick={addMenuItem} className="px-5 h-[38px] rounded-full text-white text-[13px] font-bold hover:opacity-90 active:scale-95 transition" style={{ background: DARK_GREEN }}>+ Add Item</button>
              </div>

              <div className="mt-5 space-y-4">
                {menu.map((item, i) => (
                  <div key={item.id} className="p-4 rounded-[16px] border border-black/10 bg-[#FFFEF9] flex flex-col md:flex-row gap-4">
                    <label className="w-full md:w-[120px] h-[120px] rounded-[14px] bg-white border-2 border-dashed border-black/15 flex flex-col items-center justify-center cursor-pointer overflow-hidden shrink-0 hover:border-black/30 transition">
                      {item.image? (
                        <img src={item.image} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <>
                          <span className="text-[22px]">📷</span>
                          <span className="text-[10px] mt-1 font-bold">Menu Image</span>
                          <span className="text-[8px] text-black/40">fit to box</span>
                        </>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e, "menu", i)} />
                    </label>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input value={item.name} onChange={(e) => updateMenu(i, "name", e.target.value)} placeholder="Item Name e.g. Masala Chai *" className="h-[46px] border border-black/10 rounded-[12px] px-4 text-[13px] bg-white outline-none focus:border-black" />
                      <input value={item.price} onChange={(e) => updateMenu(i, "price", e.target.value)} placeholder="Price e.g. 30 *" type="number" className="h-[46px] border border-black/10 rounded-[12px] px-4 text-[13px] bg-white outline-none focus:border-black" />
                      <input value={item.desc} onChange={(e) => updateMenu(i, "desc", e.target.value)} placeholder="Description e.g. Spiced tea with milk • Popular" className="md:col-span-2 h-[46px] border border-black/10 rounded-[12px] px-4 text-[13px] bg-white outline-none focus:border-black" />
                      <button onClick={() => removeMenuItem(i)} className="md:col-span-2 text-left text-[11px] text-red-500 font-medium hover:underline">Remove Item ✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GALLERY - IMAGE / VIDEOS FROM FILES WORKING */}
            <div className="mt-10">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-[18px]">Add Gallery <span className="text-[11px] font-normal text-black/40">(Image / Videos from files)</span></h2>
                <label className="px-5 h-[38px] rounded-full text-white text-[13px] font-bold flex items-center cursor-pointer hover:opacity-90 active:scale-95 transition" style={{ background: DARK_GREEN }}>
                  + Add Gallery
                  <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleGalleryUpload} />
                </label>
              </div>
              <p className="text-[11px] text-black/40 mt-2">Select from files — images fit to cover, videos playable — working conditions: max 20 files, image 5MB, video 15MB</p>

              {gallery.length === 0? (
                <div className="mt-4 h-[110px] rounded-[14px] border-2 border-dashed border-black/10 flex flex-col items-center justify-center text-black/30">
                  <span className="text-[20px]">🖼️</span>
                  <span className="text-[12px] mt-1">No gallery added yet</span>
                  <span className="text-[10px]">Same flow as photo - 3 columns</span>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {gallery.map((g) => (
                    <div key={g.id} className="relative group">
                      <div className="h-[110px] w-full rounded-[14px] overflow-hidden bg-black/5 border border-black/5">
                        {g.type === "video"? (
                          <video src={g.url} className="w-full h-full object-cover" muted playsInline />
                        ) : (
                          <img src={g.url} className="w-full h-full object-cover" alt="" />
                        )}
                      </div>
                      <button onClick={() => removeGallery(g.id)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black text-white text-[10px] flex items-center justify-center shadow-lg opacity-90 hover:bg-red-600">✕</button>
                      <span className="absolute bottom-1 left-1 text-[8px] bg-black/70 text-white px-1.5 py-0.5 rounded-full">{g.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SAVE BUTTON - DARK GREEN */}
            <button onClick={handleSave} className="mt-10 w-full h-[54px] rounded-full text-white font-bold text-[15px] shadow-lg hover:opacity-90 active:scale-[0.98] transition-all" style={{ background: DARK_GREEN }}>
              Save & Create Profile →
            </button>
            <p className="mt-3 text-center text-[11px] text-black/40">Cover fit to cover • DP fit to circle • Gallery same flow as photo • Single Menu only • All Dark Green</p>

          </div>
        </div>
      </div>
    </div>
  );
}