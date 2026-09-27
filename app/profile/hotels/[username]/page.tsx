"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const DARK_GREEN = "#0F4C3A";
const BG_MAIN = "#FFFEFB";
const SHADOW = "0 12px 32px rgba(0,0,0,0.07), 0 1.5px 4px rgba(0,0,0,0.05)";

type RoomType = {
  id: string;
  name: string;
  image: string;
  about: string;
  description: string;
  price: string;
  guests: string;
};

export default function HotelProfileFinalComplete() {
  const params = useParams() as { username: string };
  const username = params?.username || "tanka_7845";
  const [data, setData] = useState<any>(null);
  const [coverIndex, setCoverIndex] = useState(0);
  const [showBooks, setShowBooks] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newRoom, setNewRoom] = useState<RoomType>({ id: "", name: "", image: "", about: "", description: "", price: "₹ 1,499", guests: "2 Guests" });

  useEffect(() => {
    const raw = localStorage.getItem(`drisyamn_hotel_profile_${username}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.roomsList) {
        parsed.roomsList = [
          { id: "r1", name: "Deluxe Room with Balcony", image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop&q=80", about: "Spacious room with mountain view", description: "Attached bathroom, AC, 100 Mbps WiFi, work desk, hot water 24/7, fresh linen daily. Perfect for families and couples.", price: "₹ 1,499", guests: "2 Guests" },
          { id: "r2", name: "Standard Couple Room", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop&q=80", about: "Cozy & clean couple friendly", description: "Non-AC with cooler, attached bathroom, WiFi, power backup. Safe and calm building, owner stays on property.", price: "₹ 999", guests: "2 Guests" },
        ];
      }
      setData(parsed);
    } else {
      setData({
        businessName: "Tanka Hotel & Stay",
        tagline: "A calm, clean and family-friendly stay in the heart of Siliguri.",
        location: { address: "Sevoke Road", city: "Siliguri", full: "Sevoke Road, Near City Center, Siliguri - 734001" },
        contact: { phone: "9876543210", whatsapp: "9876543210" },
        stayInfo: { pricePerNight: "₹ 1,499", rooms: "8", checkIn: "12 PM", checkOut: "11 AM" },
        content: {
          aboutUs: "We are a family-run boutique stay in Siliguri. Clean rooms, home-cooked food, warm hospitality. Owner stays on property, so help is always 2 mins away.",
          ourStory: "Started in 2018 with 2 rooms. Our first guest said 'This feels like home'. That line became our vision. Today 500+ happy guests, 90% repeat guests.",
          whyChooseUs: "Prime Location near bus stand\nFamily & couple safe with CCTV\nHome-cooked food available\nClean & calm rooms\n24/7 WiFi, hot water, power backup\nTrusted by locals - 527+ reviews",
        },
        amenities: ["Free WiFi 100 Mbps", "Parking", "AC Rooms", "Hot Water 24/7", "CCTV", "Kitchen Access", "Laundry"],
        rating: 4.9, totalReviews: 527, hostName: "Tanka", verified: true,
        media: { banner: "", stories: [] },
        roomsList: [
          { id: "r1", name: "Deluxe Room with Balcony", image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop&q=80", about: "Spacious room with mountain view", description: "Attached bathroom, AC, 100 Mbps WiFi, work desk, hot water 24/7, fresh linen daily.", price: "₹ 1,499", guests: "2 Guests" },
          { id: "r2", name: "Standard Couple Room", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop&q=80", about: "Cozy & clean couple friendly", description: "Non-AC with cooler, attached bathroom, WiFi, power backup. Safe building.", price: "₹ 999", guests: "2 Guests" },
        ],
      });
    }
  }, [username]);

  const updateField = (path: string, value: any) => {
    const keys = path.split(".");
    setData((prev: any) => {
      const nd = {...prev };
      let cur: any = nd;
      for (let i = 0; i < keys.length - 1; i++) { cur[keys[i]] = {...cur[keys[i]] }; cur = cur[keys[i]]; }
      cur[keys[keys.length - 1]] = value;
      return nd;
    });
  };

  const handleSave = () => {
    setSaving(true);
    localStorage.setItem(`drisyamn_hotel_profile_${username}`, JSON.stringify(data));
    setTimeout(() => { setSaving(false); setShowEdit(false); }, 600);
  };

  const handleImageUpload = (e: any, isNewRoom = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (isNewRoom) setNewRoom({...newRoom, image: base64 });
      else updateField("media.banner", base64);
    };
    reader.readAsDataURL(file);
  };

  const handleRoomImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setNewRoom({...newRoom, image: reader.result as string });
    reader.readAsDataURL(file);
  };

  const addRoom = () => {
    if (!newRoom.name ||!newRoom.image) { alert("Name aur Image dono bharo"); return; }
    const roomToAdd = {...newRoom, id: Date.now().toString() };
    const updated = {...data, roomsList: [...(data.roomsList || []), roomToAdd] };
    setData(updated);
    localStorage.setItem(`drisyamn_hotel_profile_${username}`, JSON.stringify(updated));
    setNewRoom({ id: "", name: "", image: "", about: "", description: "", price: "₹ 1,499", guests: "2 Guests" });
    setShowAddRoom(false);
  };

  const deleteRoom = (id: string) => {
    const updated = {...data, roomsList: data.roomsList.filter((r: any) => r.id!== id) };
    setData(updated);
    localStorage.setItem(`drisyamn_hotel_profile_${username}`, JSON.stringify(updated));
  };

  if (!data) return <div className="min-h-screen flex items-center justify-center bg-[#FFFEFB]">Loading...</div>;

  const covers = [
    data.media?.banner || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1551882547-b79c1141d0f0?w=1400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1400&auto=format&fit=crop&q=80",
  ];
  const logoChar = data.businessName?.charAt(0)?.toUpperCase() || "T";
  const closeAll = () => { setShowBooks(false); setShowMessage(false); setShowNotifications(false); setShowEdit(false); setShowAddRoom(false); };

  return (
    <div className="min-h-screen text-[#222]" style={{ background: BG_MAIN, fontFamily: "Inter, Segoe UI, Helvetica Neue, sans-serif", fontWeight: 400 }}>
      {/* NAV BAR - CREATE PAGE JAISE BIG SIZE */}
      <div className="sticky top-0 z-[100] bg-white border-b border-black/[0.06]">
        <div className="max-w-[1260px] mx-auto px-6 h-[82px] flex items-center justify-between">
          <Link href="/homefeed" className="flex items-center gap-4">
            <div className="w-[46px] h-[46px] rounded-full bg-black text-white flex items-center justify-center text-[18px]" style={{ fontWeight: 500, boxShadow: SHADOW }}>{logoChar}</div>
            <div className="leading-none">
              <p className="text-[20px]" style={{ fontWeight: 600, letterSpacing: "-0.02em" }}>Drisyamn</p>
              <p className="text-[14px] text-black/60 mt-1.5" style={{ fontWeight: 400 }}>Discover Everything Around You</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={() => { closeAll(); setShowBooks(true); }} className={`h-[38px] px-5 rounded-full text-[13px] border ${showBooks? "bg-[#0F4C3A] text-white border-[#0F4C3A]" : "bg-white border-black/10"}`} style={{ fontWeight: 500, boxShadow: SHADOW }}>Books</button>
            <button onClick={() => { closeAll(); setShowMessage(true); }} className={`h-[38px] px-5 rounded-full text-[13px] border ${showMessage? "bg-[#0F4C3A] text-white border-[#0F4C3A]" : "bg-white border-black/10"}`} style={{ fontWeight: 500, boxShadow: SHADOW }}>Message</button>
            <button onClick={() => { closeAll(); setShowNotifications(true); }} className={`h-[38px] px-5 rounded-full text-[13px] border ${showNotifications? "bg-[#0F4C3A] text-white border-[#0F4C3A]" : "bg-white border-black/10"}`} style={{ fontWeight: 500, boxShadow: SHADOW }}>Notifications</button>
            <button onClick={() => { closeAll(); setShowEdit(true); }} className={`h-[38px] px-5 rounded-full text-[13px] border ${showEdit? "bg-black text-white border-black" : "bg-white border-black/10"}`} style={{ fontWeight: 500, boxShadow: SHADOW }}>Edit</button>
          </div>
        </div>
      </div>

      <div className="max-w-[1260px] mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-[1.2fr_390px] gap-8 pb-24">
        {/* LEFT */}
        <div className="min-w-0">
          {/* COVER */}
          <div className="rounded-[28px] overflow-hidden bg-white border border-black/[0.06]" style={{ boxShadow: SHADOW }}>
            <div className="relative h-[460px] bg-[#F6F1E6]">
              <img src={covers[coverIndex]} alt="cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-7 left-8 right-8">
                <h1 className="text-white text-[34px] md:text-[40px] leading-[1.05]" style={{ fontWeight: 600 }}>{data.businessName}</h1>
                <p className="text-white/90 text-[15px] mt-3" style={{ fontWeight: 400 }}>{data.tagline}</p>
              </div>
            </div>
            <div className="flex gap-2 p-3">
              {covers.map((c:string,i:number)=>(<button key={i} onClick={()=>setCoverIndex(i)} className={`w-[90px] h-[64px] rounded-[12px] overflow-hidden border-2 ${i===coverIndex? "border-[#0F4C3A]" : "border-transparent"}`}><img src={c} className="w-full h-full object-cover" alt="thumb"/></button>))}
            </div>
          </div>

          {/* ABOUT */}
          <div className="mt-8 bg-white rounded-[24px] border border-black/[0.06] p-8" style={{ boxShadow: SHADOW }}>
            <p className="text-[12px] tracking-[0.15em] text-black/30">ABOUT</p>
            <h2 className="text-[28px] mt-4" style={{ fontWeight: 500 }}>A small place with a big heart.</h2>
            <p className="text-[15px] leading-[1.8] text-black/70 mt-5 whitespace-pre-wrap" style={{ fontWeight: 400 }}>{data.content?.aboutUs}</p>
          </div>

          {/* OUR STORY */}
          <div className="mt-6 bg-[#0F4C3A] rounded-[24px] p-8 text-white" style={{ boxShadow: SHADOW }}>
            <p className="text-[12px] tracking-[0.15em] text-white/40">OUR STORY</p>
            <h2 className="text-[28px] mt-4" style={{ fontWeight: 500 }}>We started with 2 rooms.</h2>
            <p className="text-[15px] leading-[1.8] text-white/80 mt-5 whitespace-pre-wrap" style={{ fontWeight: 400 }}>{data.content?.ourStory}</p>
          </div>

          {/* WHY CHOOSE US */}
          <div className="mt-6 bg-white rounded-[24px] border border-black/[0.06] p-8" style={{ boxShadow: SHADOW }}>
            <p className="text-[12px] tracking-[0.15em] text-black/30">WHY PEOPLE CHOOSE US</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.content?.whyChooseUs?.split("\n").map((l:string,i:number)=>(<div key={i} className="flex gap-3 p-4 rounded-[14px] bg-[#FFFEFB] border border-black/[0.04]"><div className="w-7 h-7 rounded-full bg-[#E6F4EA] text-[#0F4C3A] flex items-center justify-center text-[11px]">{i+1}</div><p className="text-[13px] text-black/70">{l.replace(/^\d+\.\s*/,"")}</p></div>))}
            </div>
          </div>

          {/* ==================== ROOMS SECTION - BUTTON + BOX ==================== */}
          <div className="mt-8 bg-white rounded-[28px] border border-black/[0.06] p-8" style={{ boxShadow: SHADOW }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] tracking-[0.15em] text-black/30">ROOMS</p>
                <h2 className="text-[26px] mt-2" style={{ fontWeight: 500 }}>Our Rooms • {data.roomsList?.length || 0} rooms</h2>
              </div>
              <button onClick={() => { closeAll(); setShowAddRoom(true); }} className="h-[42px] px-6 rounded-full bg-[#0F4C3A] text-white text-[13px] hover:bg-[#0A3326] transition" style={{ fontWeight: 500, boxShadow: SHADOW }}>
                + Rooms
              </button>
            </div>

            {/* Add Room Box */}
            {showAddRoom && (
              <div className="mt-6 p-6 rounded-[20px] bg-[#FFFEFB] border border-dashed border-black/15">
                <p className="text-[14px]" style={{ fontWeight: 500 }}>Add New Room</p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-black/40">Room Image — Box</label>
                    <div className="mt-2">
                      {newRoom.image? (
                        <div className="relative w-full h-[160px] rounded-[14px] overflow-hidden border border-black/10">
                          <img src={newRoom.image} className="w-full h-full object-cover" alt="room" />
                          <button onClick={() => setNewRoom({...newRoom, image: "" })} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white text-[12px]">✕</button>
                        </div>
                      ) : (
                        <label className="w-full h-[160px] rounded-[14px] bg-white border border-dashed border-black/20 flex flex-col items-center justify-center cursor-pointer hover:bg-[#F6F1E6] transition">
                          <span className="text-[22px]">📷</span>
                          <span className="text-[12px] text-black/50 mt-1">Add Image</span>
                          <input type="file" accept="image/*" onChange={handleRoomImageUpload} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div><label className="text-[11px] text-black/40">Room Name</label><input value={newRoom.name} onChange={e => setNewRoom({...newRoom, name: e.target.value })} placeholder="Deluxe Room with Balcony" className="mt-1 w-full h-[42px] px-4 rounded-[12px] bg-white border border-black/10 text-[13px] outline-none" /></div>
                    <div><label className="text-[11px] text-black/40">About</label><input value={newRoom.about} onChange={e => setNewRoom({...newRoom, about: e.target.value })} placeholder="Spacious with mountain view" className="mt-1 w-full h-[42px] px-4 rounded-[12px] bg-white border border-black/10 text-[13px] outline-none" /></div>
                    <div><label className="text-[11px] text-black/40">Price</label><input value={newRoom.price} onChange={e => setNewRoom({...newRoom, price: e.target.value })} className="mt-1 w-full h-[42px] px-4 rounded-[12px] bg-white border border-black/10 text-[13px] outline-none" /></div>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-[11px] text-black/40">Descriptions</label>
                  <textarea value={newRoom.description} onChange={e => setNewRoom({...newRoom, description: e.target.value })} rows={3} placeholder="Attached bathroom, AC, WiFi, work desk..." className="mt-1 w-full p-3 rounded-[12px] bg-white border border-black/10 text-[13px] outline-none" />
                </div>
                <div className="mt-5 flex gap-2">
                  <button onClick={addRoom} className="flex-1 h-[44px] rounded-full bg-[#0F4C3A] text-white text-[13px]" style={{ fontWeight: 500 }}>Add Room</button>
                  <button onClick={() => setShowAddRoom(false)} className="w-[100px] h-[44px] rounded-full bg-white border border-black/10 text-[13px]">Cancel</button>
                </div>
              </div>
            )}

            {/* Rooms Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              {data.roomsList?.map((room: RoomType) => (
                <div key={room.id} className="rounded-[22px] overflow-hidden bg-[#FFFEFB] border border-black/[0.06] hover:shadow-lg transition" style={{ boxShadow: SHADOW }}>
                  <div className="relative h-[200px] bg-[#F6F1E6]">
                    <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[11px]" style={{ fontWeight: 500, boxShadow: SHADOW }}>{room.guests} • {room.price}/night</span>
                    <button onClick={() => deleteRoom(room.id)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center text-[12px] hover:bg-black">✕</button>
                  </div>
                  <div className="p-5">
                    <h3 className="text-[16px]" style={{ fontWeight: 500 }}>{room.name}</h3>
                    <p className="text-[12px] text-[#0F4C3A] mt-1" style={{ fontWeight: 500 }}>{room.about}</p>
                    <p className="text-[13px] text-black/60 mt-3 leading-[1.6]" style={{ fontWeight: 400 }}>{room.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-[18px]" style={{ fontWeight: 600 }}>{room.price} <span className="text-[11px] text-black/40" style={{ fontWeight: 400 }}>/ night</span></p>
                      <button onClick={() => window.open(`https://wa.me/91${data.contact?.whatsapp}?text=Hi, I want to book ${room.name} ${room.price}`)} className="h-[38px] px-5 rounded-full bg-[#0F4C3A] text-white text-[12px] hover:bg-[#0A3326] transition" style={{ fontWeight: 500 }}>
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANELS */}
        <div className="lg:sticky lg:top-[106px] space-y-4">
          {!showEdit &&!showBooks &&!showMessage &&!showNotifications &&!showAddRoom && (
            <div className="bg-white rounded-[28px] border p-7" style={{ boxShadow: SHADOW }}>
              <p className="text-[12px] text-black/40">Starting from</p>
              <p className="text-[32px] mt-1" style={{ fontWeight: 600 }}>{data.stayInfo?.pricePerNight} <span className="text-[14px] text-black/40" style={{ fontWeight: 400 }}>/ night</span></p>
              <button onClick={() => window.open(`https://wa.me/91${data.contact?.whatsapp}`)} className="mt-6 w-full h-[52px] rounded-full bg-[#0F4C3A] text-white text-[14px]" style={{ fontWeight: 500 }}>Book on WhatsApp ↗</button>
              <button onClick={() => { closeAll(); setShowEdit(true); }} className="mt-3 w-full h-[48px] rounded-full bg-black text-white text-[13px]" style={{ fontWeight: 500 }}>Edit Profile</button>
              <button onClick={() => { closeAll(); setShowAddRoom(true); }} className="mt-3 w-full h-[48px] rounded-full bg-[#E6F4EA] text-[#0F4C3A] text-[13px]" style={{ fontWeight: 500 }}>+ Add New Room</button>
            </div>
          )}

          {showEdit && (
            <div className="bg-white rounded-[28px] border p-7" style={{ boxShadow: SHADOW }}>
              <div className="flex justify-between"><h3 className="text-[16px]" style={{ fontWeight: 500 }}>Edit Profile</h3><button onClick={closeAll} className="w-8 h-8 rounded-full bg-black/5">✕</button></div>
              <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                <div><label className="text-[11px] text-black/40">Business Name</label><input value={data.businessName} onChange={e=>updateField("businessName", e.target.value)} className="mt-1 w-full h-[44px] px-4 rounded-[12px] bg-[#F6F1E6] border text-[13px] outline-none" /></div>
                <div><label className="text-[11px] text-black/40">Tagline</label><input value={data.tagline} onChange={e=>updateField("tagline", e.target.value)} className="mt-1 w-full h-[44px] px-4 rounded-[12px] bg-[#F6F1E6] border text-[13px] outline-none" /></div>
                <div><label className="text-[11px] text-black/40">Banner Image</label><label className="mt-1 w-full h-[44px] rounded-[12px] bg-[#F6F1E6] border flex items-center justify-center text-[12px] cursor-pointer">📷 Add Banner Image<input type="file" accept="image/*" onChange={e=>handleImageUpload(e)} className="hidden" /></label></div>
                <div><label className="text-[11px] text-black/40">About Us</label><textarea value={data.content?.aboutUs} onChange={e=>updateField("content.aboutUs", e.target.value)} rows={3} className="mt-1 w-full p-3 rounded-[12px] bg-[#FFFEFB] border text-[13px] outline-none" /></div>
                <div><label className="text-[11px] text-black/40">Our Story</label><textarea value={data.content?.ourStory} onChange={e=>updateField("content.ourStory", e.target.value)} rows={2} className="mt-1 w-full p-3 rounded-[12px] bg-[#FFFEFB] border text-[13px] outline-none" /></div>
                <div><label className="text-[11px] text-black/40">Why Choose Us</label><textarea value={data.content?.whyChooseUs} onChange={e=>updateField("content.whyChooseUs", e.target.value)} rows={4} className="mt-1 w-full p-3 rounded-[12px] bg-[#FFFEFB] border text-[13px] outline-none" /></div>
              </div>
              <button onClick={handleSave} className="mt-6 w-full h-[48px] rounded-full bg-[#0F4C3A] text-white text-[13px]" style={{ fontWeight: 500 }}>{saving? "Saving..." : "Save Changes"}</button>
            </div>
          )}

          {showBooks && (<div className="bg-white rounded-[28px] border p-7" style={{ boxShadow: SHADOW }}><div className="flex justify-between"><h3 className="text-[16px]" style={{ fontWeight: 500 }}>Your Books</h3><button onClick={closeAll} className="w-8 h-8 rounded-full bg-black/5">✕</button></div><div className="mt-5 p-4 rounded-[14px] bg-[#FFFEFB] border"><p className="text-[13px]" style={{ fontWeight: 500 }}>Booking • {data.businessName} • Confirmed</p><p className="text-[12px] text-black/50 mt-1">₹1,499 • 2 Guests • 12 Sep</p></div></div>)}
          {showMessage && (<div className="bg-white rounded-[28px] border p-7" style={{ boxShadow: SHADOW }}><div className="flex justify-between"><h3 className="text-[16px]" style={{ fontWeight: 500 }}>Message</h3><button onClick={closeAll} className="w-8 h-8 rounded-full bg-black/5">✕</button></div><div className="mt-5 h-[260px] bg-[#FFFEFB] border rounded-[14px] p-4"><p className="text-[12px] text-black/40">WhatsApp chat yaha ayega</p></div></div>)}
          {showNotifications && (<div className="bg-white rounded-[28px] border p-7" style={{ boxShadow: SHADOW }}><div className="flex justify-between"><h3 className="text-[16px]" style={{ fontWeight: 500 }}>Notifications</h3><button onClick={closeAll} className="w-8 h-8 rounded-full bg-black/5">✕</button></div><div className="mt-5 p-4 rounded-[14px] bg-[#E6F4EA] border"><p className="text-[12px] text-[#0F4C3A]">New booking request • 2 mins ago</p></div></div>)}
        </div>
      </div>
    </div>
  );
}