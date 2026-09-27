"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const DARK_GREEN = "#0F4C3A";
const BG_MAIN = "#FFFEFB";
const SHADOW = "0 12px 32px rgba(0,0,0,0.07), 0 1.5px 4px rgba(0,0,0,0.05)";

type RoomType = { id: string; name: string; image: string; about: string; description: string; price: string; guests: string; };

export default function HotelProfileCompleteWorking() {
  const params = useParams() as { username: string };
  const username = params?.username || "tanka_7845";
  const [data, setData] = useState<any>(null);
  const [coverIndex, setCoverIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("photos");
  const [showBooks, setShowBooks] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lightBoxImg, setLightBoxImg] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [newRoom, setNewRoom] = useState<RoomType>({ id: "", name: "", image: "", about: "", description: "", price: "₹ 1,499", guests: "2 Guests" });

  const defaultRooms: RoomType[] = [
    { id: "r1", name: "Deluxe Room with Balcony", image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800", about: "Spacious room with mountain view", description: "Attached bathroom, AC, 100 Mbps WiFi, work desk, hot water 24/7.", price: "₹ 1,499", guests: "2 Guests" },
    { id: "r2", name: "Standard Couple Room", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800", about: "Cozy & clean couple friendly", description: "Non-AC with cooler, attached bathroom, WiFi, power backup.", price: "₹ 999", guests: "2 Guests" },
  ];

  useEffect(() => {
    const raw = localStorage.getItem(`drisyamn_hotel_profile_${username}`);
    if (raw) {
      const p = JSON.parse(raw);
      if (!p.roomsList) p.roomsList = defaultRooms;
      if (!p.media) p.media = { banner: "", stories: [], videos: [] };
      if (!p.media.videos) p.media.videos = ["https://www.w3schools.com/html/mov_bbb.mp4"];
      setData(p);
    } else {
      setData({
        businessName: "Tanka Hotel & Homestay",
        tagline: "A calm, clean and family-friendly stay in the heart of Siliguri.",
        location: { full: "Sevoke Road, Near City Center, Siliguri - 734001" },
        contact: { whatsapp: "9876543210" },
        stayInfo: { pricePerNight: "₹ 1,499" },
        content: {
          aboutUs: "Family-run boutique stay in Siliguri. Clean rooms, home-cooked food, warm hospitality.",
          ourStory: "Started in 2018 with 2 rooms. First guest said 'This feels like home'. Today 500+ happy guests.",
          whyChooseUs: "Prime Location near bus stand\nFamily & couple safe\nHome-cooked food\nClean & calm\n24/7 Support",
        },
        amenities: ["Free WiFi", "Parking", "AC Rooms", "Hot Water"],
        rating: 4.9, totalReviews: 527, hostName: "Tanka",
        media: {
          banner: "",
          stories: [
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
          ],
          videos: ["https://www.w3schools.com/html/mov_bbb.mp4"],
        },
        roomsList: defaultRooms,
      });
    }
  }, [username]);

  const saveData = (updated: any) => {
    setData(updated);
    localStorage.setItem(`drisyamn_hotel_profile_${username}`, JSON.stringify(updated));
  };

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

  const handleSave = () => { setSaving(true); localStorage.setItem(`drisyamn_hotel_profile_${username}`, JSON.stringify(data)); setTimeout(() => { setSaving(false); setShowEdit(false); }, 600); };

  const handleImageUpload = (e: any, type: "banner" | "photo" | "room" | "newRoom") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (type === "banner") updateField("media.banner", base64);
      if (type === "photo") {
        const updated = {...data, media: {...data.media, stories: [...(data.media.stories || []), base64] } };
        saveData(updated);
      }
      if (type === "room") setNewRoom({...newRoom, image: base64 });
      if (type === "newRoom") setNewRoom({...newRoom, image: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleVideoUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const updated = {...data, media: {...data.media, videos: [...(data.media.videos || []), url] } };
    saveData(updated);
  };

  const addRoom = () => {
    if (!newRoom.name ||!newRoom.image) { alert("Name + Image bharo bhai"); return; }
    const roomToAdd = {...newRoom, id: Date.now().toString() };
    const updated = {...data, roomsList: [...(data.roomsList || []), roomToAdd] };
    saveData(updated);
    setNewRoom({ id: "", name: "", image: "", about: "", description: "", price: "₹ 1,499", guests: "2 Guests" });
    setShowAddRoom(false);
  };

  const deleteRoom = (id: string) => { saveData({...data, roomsList: data.roomsList.filter((r: any) => r.id!== id) }); };
  const deletePhoto = (index: number) => { saveData({...data, media: {...data.media, stories: data.media.stories.filter((_: any, i: number) => i!== index) } }); };
  const deleteVideo = (index: number) => { saveData({...data, media: {...data.media, videos: data.media.videos.filter((_: any, i: number) => i!== index) } }); };

  if (!data) return <div className="min-h-screen flex items-center justify-center bg-[#FFFEFB]">Loading...</div>;

  const covers = [data.media?.banner || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400", "https://images.unsplash.com/photo-1551882547-b79c1141d0f0?w=1400", "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1400"];
  const allPhotos = [...covers,...(data.media?.stories || [])];
  const allVideos = data.media?.videos || [];
  const logoChar = data.businessName?.charAt(0)?.toUpperCase() || "T";
  const closeAll = () => { setShowBooks(false); setShowMessage(false); setShowNotifications(false); setShowEdit(false); setShowAddRoom(false); };

  return (
    <div className="min-h-screen text-[#222]" style={{ background: BG_MAIN, fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
      <div className="sticky top-0 z-[100] bg-white border-b border-black/[0.06]">
        <div className="max-w-[1260px] mx-auto px-6 h-[82px] flex items-center justify-between">
          <Link href="/homefeed" className="flex items-center gap-4">
            <div className="w-[46px] h-[46px] rounded-full bg-black text-white flex items-center justify-center text-[18px]" style={{ fontWeight: 500, boxShadow: SHADOW }}>{logoChar}</div>
            <div className="leading-none"><p className="text-[20px]" style={{ fontWeight: 600 }}>Drisyamn</p><p className="text-[14px] text-black/60 mt-1.5">Discover Everything Around You</p></div>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={() => { closeAll(); setShowBooks(true); }} className={`h-[38px] px-5 rounded-full text-[13px] border ${showBooks? "bg-[#0F4C3A] text-white border-[#0F4C3A]" : "bg-white border-black/10"}`} style={{ fontWeight: 500, boxShadow: SHADOW }}>Books</button>
            <button onClick={() => { closeAll(); setShowMessage(true); }} className={`h-[38px] px-5 rounded-full text-[13px] border ${showMessage? "bg-[#0F4C3A] text-white border-[#0F4C3A]" : "bg-white border-black/10"}`} style={{ fontWeight: 500, boxShadow: SHADOW }}>Message</button>
            <button onClick={() => { closeAll(); setShowNotifications(true); }} className={`h-[38px] px-5 rounded-full text-[13px] border ${showNotifications? "bg-[#0F4C3A] text-white border-[#0F4C3A]" : "bg-white border-black/10"}`} style={{ fontWeight: 500, boxShadow: SHADOW }}>Notifications</button>
            <button onClick={() => { closeAll(); setShowEdit(true); }} className="h-[38px] px-5 rounded-full bg-black text-white text-[13px]" style={{ fontWeight: 500, boxShadow: SHADOW }}>Edit</button>
          </div>
        </div>
      </div>

      <div className="max-w-[1260px] mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-[1.2fr_390px] gap-8 pb-24">
        <div className="min-w-0">
          <div className="rounded-[28px] overflow-hidden bg-white border border-black/[0.06]" style={{ boxShadow: SHADOW }}>
            <div className="relative h-[460px] bg-[#F6F1E6]">
              <img src={covers[coverIndex]} alt="cover" className="w-full h-full object-cover cursor-pointer" onClick={() => setLightBoxImg(covers[coverIndex])} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
              <div className="absolute bottom-7 left-8 right-8 pointer-events-none"><h1 className="text-white text-[38px] leading-[1.05]" style={{ fontWeight: 600 }}>{data.businessName}</h1><p className="text-white/90 text-[15px] mt-3">{data.tagline}</p></div>
            </div>
            <div className="flex gap-2 p-3 overflow-x-auto">
              {covers.map((c: string, i: number) => (<button key={i} onClick={() => setCoverIndex(i)} className={`shrink-0 w-[90px] h-[64px] rounded-[12px] overflow-hidden border-2 ${i === coverIndex? "border-[#0F4C3A]" : "border-transparent"}`}><img src={c} className="w-full h-full object-cover" alt="thumb" /></button>))}
            </div>
          </div>

          <div className="mt-8 bg-white rounded-[24px] border p-8" style={{ boxShadow: SHADOW }}><p className="text-[12px] tracking-[0.15em] text-black/30">ABOUT</p><p className="text-[15px] leading-[1.8] text-black/70 mt-5 whitespace-pre-wrap">{data.content?.aboutUs}</p></div>
          <div className="mt-6 bg-[#0F4C3A] rounded-[24px] p-8 text-white" style={{ boxShadow: SHADOW }}><p className="text-[12px] tracking-[0.15em] text-white/40">OUR STORY</p><p className="text-[15px] leading-[1.8] text-white/80 mt-5 whitespace-pre-wrap">{data.content?.ourStory}</p></div>

          <div className="mt-8 bg-white rounded-[28px] border p-8" style={{ boxShadow: SHADOW }}>
            <div className="flex items-center justify-between"><div><p className="text-[12px] tracking-[0.15em] text-black/30">ROOMS</p><h2 className="text-[26px] mt-2" style={{ fontWeight: 500 }}>Our Rooms • {data.roomsList?.length}</h2></div><button onClick={() => { closeAll(); setShowAddRoom(true); }} className="h-[42px] px-6 rounded-full bg-[#0F4C3A] text-white text-[13px]" style={{ fontWeight: 500, boxShadow: SHADOW }}>+ Rooms</button></div>
            {showAddRoom && (
              <div className="mt-6 p-6 rounded-[20px] bg-[#FFFEFB] border border-dashed">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-[11px] text-black/40">Room Image — Box</label><div className="mt-2">{newRoom.image? <div className="relative h-[160px] rounded-[14px] overflow-hidden"><img src={newRoom.image} className="w-full h-full object-cover" /><button onClick={() => setNewRoom({...newRoom, image: "" })} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white">✕</button></div> : <label className="h-[160px] rounded-[14px] bg-white border border-dashed flex flex-col items-center justify-center cursor-pointer"><span>📷</span><span className="text-[12px] text-black/50">Add Image</span><input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "newRoom")} className="hidden" /></label>}</div></div>
                  <div className="space-y-3"><input value={newRoom.name} onChange={e => setNewRoom({...newRoom, name: e.target.value })} placeholder="Room Name" className="w-full h-[42px] px-4 rounded-[12px] bg-white border text-[13px] outline-none" /><input value={newRoom.about} onChange={e => setNewRoom({...newRoom, about: e.target.value })} placeholder="About" className="w-full h-[42px] px-4 rounded-[12px] bg-white border text-[13px] outline-none" /><input value={newRoom.price} onChange={e => setNewRoom({...newRoom, price: e.target.value })} placeholder="Price ₹ 1,499" className="w-full h-[42px] px-4 rounded-[12px] bg-white border text-[13px] outline-none" /></div>
                </div>
                <textarea value={newRoom.description} onChange={e => setNewRoom({...newRoom, description: e.target.value })} rows={3} placeholder="Descriptions" className="mt-4 w-full p-3 rounded-[12px] bg-white border text-[13px] outline-none" />
                <div className="mt-4 flex gap-2"><button onClick={addRoom} className="flex-1 h-[44px] rounded-full bg-[#0F4C3A] text-white text-[13px]">Add Room</button><button onClick={() => setShowAddRoom(false)} className="w-[100px] h-[44px] rounded-full bg-white border text-[13px]">Cancel</button></div>
              </div>
            )}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              {data.roomsList?.map((room: RoomType) => (
                <div key={room.id} className="rounded-[22px] overflow-hidden bg-[#FFFEFB] border" style={{ boxShadow: SHADOW }}>
                  <div className="relative h-[200px] cursor-pointer" onClick={() => setLightBoxImg(room.image)}><img src={room.image} className="w-full h-full object-cover" alt={room.name} /><button onClick={(e) => { e.stopPropagation(); deleteRoom(room.id); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white">✕</button></div>
                  <div className="p-5"><h3 className="text-[16px]" style={{ fontWeight: 500 }}>{room.name}</h3><p className="text-[12px] text-[#0F4C3A] mt-1">{room.about}</p><p className="text-[13px] text-black/60 mt-3 leading-[1.6]">{room.description}</p><div className="mt-4 flex items-center justify-between"><p className="text-[18px]" style={{ fontWeight: 600 }}>{room.price} <span className="text-[11px] text-black/40">/ night</span></p><button onClick={() => window.open(`https://wa.me/91${data.contact?.whatsapp}?text=Book ${room.name}`)} className="h-[38px] px-5 rounded-full bg-[#0F4C3A] text-white text-[12px]" style={{ fontWeight: 500 }}>Book Now</button></div></div>
                </div>
              ))}
            </div>
          </div>

          {/* PHOTOS / VIDEOS / REVIEWS WITH WORKING BUTTONS */}
          <div className="mt-10">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex gap-2 bg-white p-1.5 rounded-full border w-fit" style={{ boxShadow: SHADOW }}>
                {[{ id: "photos", label: `Photos (${allPhotos.length})` }, { id: "videos", label: `Videos (${allVideos.length})` }, { id: "reviews", label: `Reviews (${data.totalReviews})` }].map((t) => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-6 h-[38px] rounded-full text-[13px] transition ${activeTab === t.id? "bg-[#0F4C3A] text-white" : "text-black/60 hover:bg-black/[0.04]"}`} style={{ fontWeight: 400 }}>{t.label}</button>
                ))}
              </div>
              <label className="h-[38px] px-5 rounded-full bg-black text-white text-[13px] flex items-center justify-center cursor-pointer" style={{ fontWeight: 500, boxShadow: SHADOW }}>+ Add Photo<input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "photo")} className="hidden" /></label>
              <label className="h-[38px] px-5 rounded-full bg-white border border-black/10 text-[13px] flex items-center justify-center cursor-pointer" style={{ fontWeight: 500, boxShadow: SHADOW }}>+ Add Video<input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" /></label>
            </div>

            {activeTab === "photos" && (
              <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-3.5">
                {allPhotos.map((img: string, i: number) => (
                  <div key={i} className="group relative h-[190px] rounded-[18px] overflow-hidden bg-white border cursor-pointer" style={{ boxShadow: SHADOW }} onClick={() => setLightBoxImg(img)}>
                    <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="photo" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                    {i >= 3 && <button onClick={(e) => { e.stopPropagation(); deletePhoto(i - covers.length); }} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition">✕</button>}
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition">Click to view</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "videos" && (
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {allVideos.map((vid: string, i: number) => (
                  <div key={i} className="relative h-[300px] rounded-[20px] overflow-hidden bg-black border" style={{ boxShadow: SHADOW }}>
                    {playingVideo === vid? (
                      <video src={vid} controls autoPlay className="w-full h-full object-cover" onEnded={() => setPlayingVideo(null)} />
                    ) : (
                      <>
                        <video src={vid} className="w-full h-full object-cover opacity-70" muted />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                          <button onClick={() => setPlayingVideo(vid)} className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[20px] hover:scale-105 transition" style={{ boxShadow: SHADOW }}>▶</button>
                          <p className="text-white text-[12px] bg-black/50 px-3 py-1 rounded-full">Click to Play</p>
                        </div>
                      </>
                    )}
                    <button onClick={() => deleteVideo(i)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white">✕</button>
                    <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1 rounded-full text-[11px]">Video {i + 1}</div>
                  </div>
                ))}
                {allVideos.length === 0 && <div className="col-span-2 h-[200px] rounded-[20px] bg-white border flex items-center justify-center text-[13px] text-black/40">No videos yet — Add Video button se upload karo</div>}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="mt-5 space-y-3">
                {[{ n: "Rahul Sharma", t: "Very clean, peaceful and home-like. Best stay." }, { n: "Anjali Family", t: "Safe for family, spacious rooms." }].map((x, i) => (
                  <div key={i} className="bg-white rounded-[18px] border p-6" style={{ boxShadow: SHADOW }}><p className="text-[14px]" style={{ fontWeight: 500 }}>{x.n}</p><p className="text-[13px] text-black/60 mt-2">{x.t}</p></div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-[106px] space-y-4">
          {!showEdit &&!showBooks &&!showMessage &&!showNotifications &&!showAddRoom && (
            <div className="bg-white rounded-[28px] border p-7" style={{ boxShadow: SHADOW }}>
              <p className="text-[12px] text-black/40">Starting from</p><p className="text-[32px] mt-1" style={{ fontWeight: 600 }}>{data.stayInfo?.pricePerNight} <span className="text-[14px] text-black/40">/ night</span></p>
              <button onClick={() => window.open(`https://wa.me/91${data.contact?.whatsapp}`)} className="mt-7 w-full h-[52px] rounded-full bg-[#0F4C3A] text-white text-[14px]">Book on WhatsApp ↗</button>
              <button onClick={() => { closeAll(); setShowEdit(true); }} className="mt-3 w-full h-[48px] rounded-full bg-black text-white text-[13px]">Edit Profile</button>
              <button onClick={() => { closeAll(); setShowAddRoom(true); }} className="mt-3 w-full h-[48px] rounded-full bg-[#E6F4EA] text-[#0F4C3A] text-[13px]">+ Add New Room</button>
            </div>
          )}
          {showEdit && (
            <div className="bg-white rounded-[28px] border p-7" style={{ boxShadow: SHADOW }}>
              <div className="flex justify-between"><h3 className="text-[16px]" style={{ fontWeight: 500 }}>Edit</h3><button onClick={closeAll} className="w-8 h-8 rounded-full bg-black/5">✕</button></div>
              <div className="mt-6 space-y-3 max-h-[60vh] overflow-y-auto"><input value={data.businessName} onChange={e => updateField("businessName", e.target.value)} className="w-full h-[44px] px-4 rounded-[12px] bg-[#F6F1E6] border text-[13px] outline-none" placeholder="Business Name" /><textarea value={data.content?.aboutUs} onChange={e => updateField("content.aboutUs", e.target.value)} rows={3} className="w-full p-3 rounded-[12px] bg-[#FFFEFB] border text-[13px] outline-none" /><label className="w-full h-[44px] rounded-[12px] bg-[#F6F1E6] border flex items-center justify-center text-[12px] cursor-pointer">📷 Add Banner<input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "banner")} className="hidden" /></label></div>
              <button onClick={handleSave} className="mt-6 w-full h-[48px] rounded-full bg-[#0F4C3A] text-white text-[13px]">{saving? "Saving..." : "Save Changes"}</button>
            </div>
          )}
          {showBooks && <div className="bg-white rounded-[28px] border p-7" style={{ boxShadow: SHADOW }}><div className="flex justify-between"><h3 className="text-[16px]" style={{ fontWeight: 500 }}>Your Books</h3><button onClick={closeAll} className="w-8 h-8 rounded-full bg-black/5">✕</button></div><div className="mt-5 p-4 rounded-[14px] bg-[#FFFEFB] border"><p className="text-[13px]">Booking Confirmed • {data.businessName}</p></div></div>}
          {showMessage && <div className="bg-white rounded-[28px] border p-7" style={{ boxShadow: SHADOW }}><div className="flex justify-between"><h3 className="text-[16px]" style={{ fontWeight: 500 }}>Message</h3><button onClick={closeAll} className="w-8 h-8 rounded-full bg-black/5">✕</button></div></div>}
          {showNotifications && <div className="bg-white rounded-[28px] border p-7" style={{ boxShadow: SHADOW }}><div className="flex justify-between"><h3 className="text-[16px]" style={{ fontWeight: 500 }}>Notifications</h3><button onClick={closeAll} className="w-8 h-8 rounded-full bg-black/5">✕</button></div></div>}
        </div>
      </div>

      {/* LIGHTBOX FOR PHOTO CLICK */}
      {lightBoxImg && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-6" onClick={() => setLightBoxImg(null)}>
          <img src={lightBoxImg} className="max-w-[90vw] max-h-[90vh] rounded-[18px] object-contain" alt="full" />
          <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 text-white backdrop-blur">✕</button>
        </div>
      )}
    </div>
  );
}