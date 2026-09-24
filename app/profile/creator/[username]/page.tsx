"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { uploadFile } from "@/lib/upload";

type WorkItem = { id: string; url: string; type: "photo" | "video"; title: string; desc: string; createdAt: number; likes: number; liked: boolean; views: number; saved: boolean };
type MediaItem = { id: string; url: string; title: string; desc: string; createdAt: number; likes: number; liked: boolean };
type Review = { id: string; name: string; avatar: string; rating: number; text: string; date: string; likes: number; ownerReply?: string };
type Booking = { id: string; clientName: string; phone: string; eventType: string; eventDate: string; location: string; budget: string; status: "Pending" | "Confirmed" | "Completed"; createdAt: number };
type Notif = { id: string; type: string; from: string; text: string; time: string; read: boolean };

export default function CreatorFinalFull() {
  const params = useParams(); const router = useRouter();
  const username = (params as any)?.id || (params as any)?.username || "1";
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("Our Works");
  const [popup, setPopup] = useState<null | "booknow">(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const [dp, setDp] = useState("https://i.pravatar.cc/150?img=32");
  const [cover, setCover] = useState("https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000");
  const [coverPos, setCoverPos] = useState({ y: 50, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(0); const startY = useRef(50);

  const [creator, setCreator] = useState({
    name: "Drisyamn", bio: "Interior & Lifestyle Photographer", servingSince: "2018",
    address: "Mumbai, India", areaOfWorks: ["Wedding", "Portrait", "Commercial"],
    aboutUs: "We capture spaces with natural light and creativity.",
    ourStory: "Started in 2018 with a small camera, now 100+ weddings done.",
    ourValue: "Honesty, Creativity, On Time Delivery.",
    whyChooseUs: "100+ weddings, 5 years exp, affordable pricing.",
    verified: true, rating: 4.9
  });

  const [works, setWorks] = useState<WorkItem[]>([]);
  const [photos, setPhotos] = useState<MediaItem[]>([]);
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [dms, setDms] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(1243);

  const [newWork, setNewWork] = useState({ title: "", desc: "", file: null as File | null, preview: "", type: "photo" as "photo" | "video" });
  const [visitorForm, setVisitorForm] = useState({ name: "", phone: "", eventType: "Wedding", date: "", location: "", details: "" });

  // LOAD FROM SUPABASE
  useEffect(() => {
    const load = async () => {
      const { data: profile } = await supabase.from('profiles').select('*').eq('username', username).single();
      if (profile) {
        setCreator(c => ({...c, name: profile.display_name || c.name, bio: profile.bio || c.bio, address: profile.location || c.address }));
        if (profile.avatar_url) setDp(profile.avatar_url);
        if (profile.cover_url) setCover(profile.cover_url);
      }
      const { data: posts } = await supabase.from('posts').select('*').eq('user_id', username).order('created_at', {ascending:false});
      if (posts) {
        setWorks(posts.filter(p=>p.category==='works').map(p=>({id:p.id, url:p.media_url, type:p.media_type as any, title:p.title, desc:p.description, createdAt: new Date(p.created_at).getTime(), likes:0, liked:false, views:0, saved:false})));
        setPhotos(posts.filter(p=>p.category==='photos').map(p=>({id:p.id, url:p.media_url, title:p.title, desc:p.description, createdAt: new Date(p.created_at).getTime(), likes:0, liked:false})));
        setVideos(posts.filter(p=>p.category==='videos').map(p=>({id:p.id, url:p.media_url, title:p.title, desc:p.description, createdAt: new Date(p.created_at).getTime(), likes:0, liked:false})));
      }
    };
    load();
  }, [username]);

  const handleAdd = async (target: "works" | "photos" | "videos") => {
    if (!newWork.file ||!newWork.title.trim()) return alert("File + Header required");
    try {
      const url = await uploadFile('post_media', newWork.file);
      const { data, error } = await supabase.from('posts').insert([{
        user_id: username,
        title: newWork.title,
        description: newWork.desc,
        media_url: url,
        media_type: newWork.type,
        category: target,
      }]).select().single();
      if (error) throw error;
      const item = { id: data.id, url, type: newWork.type, title: newWork.title, desc: newWork.desc, createdAt: Date.now(), likes:0, liked:false, views:0, saved:false } as any;
      if (target==='works') setWorks(p=>[item,...p]);
      if (target==='photos') setPhotos(p=>[item,...p]);
      if (target==='videos') setVideos(p=>[item,...p]);
      setNewWork({ title: "", desc: "", file: null, preview: "", type: "photo" });
      alert("Uploaded to Supabase ✓ - Homefeed pe bhi dikhega");
    } catch(e:any){ alert(e.message) }
  };

  const handleSaveProfile = async () => {
    await supabase.from('profiles').update({
      display_name: creator.name,
      bio: creator.bio,
      location: creator.address,
      avatar_url: dp,
      cover_url: cover
    }).eq('username', username);
    setIsEditMode(false);
    alert("Profile Saved to Supabase ✓");
  };

  const onCoverDown = (e: any) => { setIsDragging(true); dragStart.current = e.clientY || e.touches?.[0]?.clientY; startY.current = coverPos.y; };
  const onCoverMove = (e: any) => { if (!isDragging) return; const cur = e.clientY || e.touches?.[0]?.clientY; let ny = startY.current + (cur - dragStart.current) * 0.25; ny = Math.max(0, Math.min(100, ny)); setCoverPos({...coverPos, y: ny }); };
  const toggleVideo = (id: string) => { const v = videoRefs.current[id]; if (!v) return; if (playingId === id) { v.pause(); setPlayingId(null); } else { if (playingId && videoRefs.current[playingId]) videoRefs.current[playingId]?.pause(); v.play().then(() => setPlayingId(id)).catch(() => { v.muted = true; v.play().then(() => setPlayingId(id)); }); } };

  const AddBox = ({ target }: { target: "works" | "photos" | "videos" }) => (
    <div className="bg-[#FFFBF2] rounded-[16px] border-2 border-dashed border-[#FF7A45]/30 p-3 mb-4">
      <p className="font-bold text-[12px] mb-2">Add {target} - Upload to Supabase</p>
      <div className="grid md:grid-cols-[140px_1fr] gap-3">
        <div>
          <div className="w-full h-[120px] bg-white rounded-xl border grid place-items-center overflow-hidden">
            {newWork.preview? (newWork.type === "photo"? <img src={newWork.preview} className="w-full h-full object-cover" alt="" /> : <video src={newWork.preview} className="w-full h-full object-cover" muted />) : <span className="text-[11px] opacity-40">Preview</span>}
          </div>
          <div className="flex gap-1 mt-2">
            <label className="flex-1 bg-white border text-center py-1.5 rounded-full text-[11px] font-bold cursor-pointer">📷 Photo<input type="file" hidden accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (!f) return; setNewWork({...newWork, file: f, preview: URL.createObjectURL(f), type: "photo" }); }} /></label>
            <label className="flex-1 bg-[#0F4C5C] text-white text-center py-1.5 rounded-full text-[11px] font-bold cursor-pointer">🎥 Video<input type="file" hidden accept="video/*" onChange={e => { const f = e.target.files?.[0]; if (!f) return; setNewWork({...newWork, file: f, preview: URL.createObjectURL(f), type: "video" }); }} /></label>
          </div>
        </div>
        <div className="space-y-2">
          <input value={newWork.title} onChange={e => setNewWork({...newWork, title: e.target.value })} placeholder="Header / Title *" className="w-full bg-white border rounded-full px-4 py-2.5 text-[13px] outline-none font-bold" />
          <textarea value={newWork.desc} onChange={e => setNewWork({...newWork, desc: e.target.value })} placeholder="Description..." className="w-full bg-white border rounded-[12px] px-4 py-2.5 text-[13px] h-[70px] outline-none resize-none" />
          <button onClick={() => handleAdd(target)} className="w-full bg-[#FF7A45] text-white py-2.5 rounded-full font-bold text-[13px]">+ Upload to Supabase</button>
        </div>
      </div>
    </div>
  );

  if (isEditMode) {
    return (
      <div className="min-h-screen bg-[#FDF8F0] pb-20" onMouseMove={onCoverMove} onMouseUp={() => setIsDragging(false)} onTouchMove={onCoverMove} onTouchEnd={() => setIsDragging(false)}>
        <div className="p-3 sticky top-0 z-30"><div className="max-w-[860px] mx-auto bg-white rounded-full border shadow px-5 py-3 flex justify-between items-center"><span className="font-bold">Edit Profile</span><div className="flex gap-2"><button onClick={() => setIsEditMode(false)} className="px-4 py-2 rounded-full bg-[#F5EFE7] text-[12px] font-bold">Cancel</button><button onClick={handleSaveProfile} className="px-6 py-2 rounded-full bg-[#FF7A45] text-white text-[12px] font-bold">Save to Supabase ✓</button></div></div></div>
        <div className="max-w-[860px] mx-auto p-3 space-y-4">
          <div className="bg-white rounded-[16px] p-3 shadow">
            <p className="font-bold text-[13px] px-1 pb-2">Cover & DP - Supabase Upload</p>
            <div className="relative w-full h-[220px] rounded-[12px] overflow-hidden bg-[#F5EFE7] cursor-grab" onMouseDown={onCoverDown} onTouchStart={onCoverDown}><img src={cover} className="absolute left-0 w-full h-auto max-w-none" style={{ top: `${coverPos.y}%`, transform: `translateY(-50%) scale(${coverPos.scale})` }} alt="" draggable={false} /></div>
            <div className="flex items-center gap-2 mt-3"><label className="bg-white border px-4 py-2 rounded-full text-[12px] font-bold cursor-pointer">Change DP<input type="file" hidden accept="image/*" onChange={async e => { const f=e.target.files?.[0]; if(!f) return; const url=await uploadFile('avatars', f); setDp(url); }} /></label><label className="bg-white border px-4 py-2 rounded-full text-[12px] font-bold cursor-pointer">Change Cover<input type="file" hidden accept="image/*" onChange={async e => { const f=e.target.files?.[0]; if(!f) return; const url=await uploadFile('covers', f); setCover(url); }} /></label></div>
          </div>
          <div className="bg-white rounded-[14px] p-4 shadow">
            <p className="font-bold text-[14px] mb-3">All Profile Fields</p>
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="Name" value={creator.name} onChange={(v: string) => setCreator({...creator, name: v })} />
              <Field label="Bio" value={creator.bio} onChange={(v: string) => setCreator({...creator, bio: v })} />
              <Field label="Address" value={creator.address} onChange={(v: string) => setCreator({...creator, address: v })} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E9DCCB] pb-16" onMouseMove={onCoverMove} onMouseUp={() => setIsDragging(false)}>
      <div className="p-2 sticky top-0 z-40">
        <nav className="bg-white/95 backdrop-blur rounded-full shadow border flex justify-between items-center px-5 py-2.5 max-w-[1200px] mx-auto">
          <Link href="/" className="text-[18px] font-serif font-bold text-[#0F4C5C]">Drisyamn</Link>
          <div className="flex items-center gap-1.5">
            <Link href="/homefeed" className="px-4 py-2 rounded-full bg-[#F9F3EB] border text-[12px] font-bold">Home</Link>
            <button onClick={() => router.push("/messages")} className="px-4 py-2 rounded-full bg-[#F9F3EB] border text-[12px] font-bold">Message</button>
            <button onClick={() => setActiveTab("Bookings")} className="px-4 py-2 rounded-full bg-[#0F4C5C] text-white text-[12px] font-bold">{bookings.length} Bookings</button>
          </div>
        </nav>
      </div>
      <div className="px-3 md:px-8">
        <div className="relative w-full h-[320px] rounded-[22px] border-[6px] border-white shadow overflow-hidden">
          <img src={cover} style={{ objectPosition: `center ${coverPos.y}%`, transform: `scale(${coverPos.scale})` }} className="w-full h-full object-cover" alt="" />
          <button onClick={() => setIsEditMode(true)} className="absolute top-3 right-3 bg-white px-6 py-2.5 rounded-full text-[13px] font-bold shadow">✏️ Edit Profile</button>
        </div>
      </div>
      <div className="relative -mt-12 z-10 flex justify-center px-3">
        <div className="bg-white rounded-[16px] shadow w-full max-w-[780px] p-4 flex justify-between items-center">
          <div className="flex gap-4">
            <img src={dp} className="w-[72px] h-[72px] rounded-full border-2 border-white shadow object-cover" alt="" />
            <div><h2 className="font-bold text-[16px]">{creator.name}</h2><p className="text-[13px] opacity-60">{creator.bio}</p><p className="text-[12px] opacity-50">{creator.address}</p></div>
          </div>
          <button onClick={() => setPopup("booknow")} className="bg-[#FF7A45] text-white px-8 py-3 rounded-full text-[13px] font-bold shadow">Book Now</button>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto grid md:grid-cols-[320px_1fr] gap-4 p-4">
        <div className="space-y-3">
          <div className="bg-white rounded-[14px] p-3.5 shadow"><h3 className="font-bold">Details</h3><p className="text-[13px] mt-2">Bio: {creator.bio}</p><p className="text-[13px]">Address: {creator.address}</p></div>
        </div>
        <div>
          <div className="flex gap-1.5 mb-3 bg-white rounded-full p-1.5 shadow w-fit">{["Our Works", "Photos", "Videos"].map(t => <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded-full text-[13px] font-bold ${activeTab === t? "bg-[#0F4C5C] text-white" : "bg-[#FFFBF2] border"}`}>{t}</button>)}</div>
          {activeTab === "Our Works" && <><AddBox target="works" /><div className="grid grid-cols-2 gap-3">{works.map(w => <div key={w.id} className="bg-white rounded-[12px] overflow-hidden shadow"><div className="h-[160px] bg-black relative">{w.type === "photo"? <img src={w.url} className="w-full h-full object-cover" alt="" /> : <video ref={el => { videoRefs.current[w.id] = el; }} src={w.url} className="w-full h-full object-cover" loop playsInline controls={playingId === w.id} onEnded={() => setPlayingId(null)} />}</div><div className="p-2.5"><p className="font-bold text-[13px]">{w.title}</p><p className="text-[12px] opacity-60 truncate">{w.desc}</p></div></div>)}</div></>}
          {activeTab === "Photos" && <><AddBox target="photos" /><div className="grid grid-cols-3 gap-2">{photos.map(p => <div key={p.id} className="bg-white rounded-[10px] overflow-hidden shadow"><img src={p.url} className="w-full aspect-square object-cover" alt="" /><div className="p-2"><p className="font-bold text-[12px] truncate">{p.title}</p></div></div>)}</div></>}
          {activeTab === "Videos" && <><AddBox target="videos" /><div className="grid grid-cols-3 gap-2">{videos.map(v => <div key={v.id} className="bg-white rounded-[10px] overflow-hidden shadow"><div className="aspect-square bg-black"><video src={v.url} className="w-full h-full object-cover" controls /></div><div className="p-2"><p className="font-bold text-[12px] truncate">{v.title}</p></div></div>)}</div></>}
        </div>
      </div>
    </div>
  );
}
function Field({ label, value, onChange }: any) { return <div><p className="text-[11px] font-bold uppercase mb-1">{label}</p><input value={value} onChange={e => onChange(e.target.value)} className="w-full bg-[#F9F3EB] border rounded-full px-3 py-2.5 text-[13px] outline-none" /></div>; }