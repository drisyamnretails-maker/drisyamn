"use client"
import { useState, useEffect, useRef } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

const ORANGE = "#E86A33";
const DARK = "#1F3A4A";
const PAGE_BG = "#EDE6D3";
const CARD_BG = "#FFFEFB";
const prettyBox: React.CSSProperties = {
  background: CARD_BG,
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 0 0 8px #FFFFFF, 0 0 0 9px rgba(0,0,0,0.10), 0 16px 40px rgba(62,42,20,0.14)",
};

async function uploadFile(bucket: string, file: File) {
  const name = `${Date.now()}_${file.name}`;
  const { error } = await supabase.storage.from(bucket).upload(name, file);
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(name);
  return data.publicUrl;
}

export default function OneFileFinalProfile() {
  const { username } = useParams() as { username: string }
  const router = useRouter()
  const searchParams = useSearchParams()
  const [profile, setProfile] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [tab, setTab] = useState<"Our Works" | "Our Services" | "Photo" | "Video" | "Reviews">("Our Services")
  const [allPosts, setAllPosts] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [newReview, setNewReview] = useState("")
  const [rating, setRating] = useState(5)
  const [showShare, setShowShare] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [showBookings, setShowBookings] = useState(false)
  const [bookings, setBookings] = useState<any[]>([])
  const [bookingForm, setBookingForm] = useState({ name: "", contact: "", date: "", time: "" })
  const [dp, setDp] = useState("")
  const [banner, setBanner] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [about, setAbout] = useState("")
  const [story, setStory] = useState("")
  const [exp, setExp] = useState("")
  const [loc, setLoc] = useState("")
  const [address, setAddress] = useState("")
  const [contactNo, setContactNo] = useState("")
  const [bookingNo, setBookingNo] = useState("")
  const [speciality, setSpeciality] = useState("")
  const [avail, setAvail] = useState("")
  const [services, setServices] = useState([{ id: Date.now(), name: "", desc: "", price: "", image: "", video: "" }])

  useEffect(() => {
    const load = async () => {
      const { data: prof } = await supabase.from('profiles').select('*').eq('username', username).single();
      if (prof) {
        setProfile(prof); setDp(prof.avatar_url || ""); setBanner(prof.cover_url || "");
        setBusinessName(prof.display_name || ""); setAbout(prof.bio || ""); setLoc(prof.location || "");
        setContactNo(prof.phone || ""); setAddress(prof.location || "");
        setIsEditing(searchParams.get("mode") === "edit");
      } else setIsEditing(true);

      const { data: posts } = await supabase.from('posts').select('*').eq('user_id', username).order('created_at', {ascending:false});
      if(posts) setAllPosts(posts.map((p:any)=>({ id:p.id, owner:p.user_id, type: p.media_type==='video'? 'video':'photo', url:p.media_url, createdAt: new Date(p.created_at).getTime() })));
    };
    load();
  }, [username, searchParams])

  const handleSave = async () => {
    if (!businessName ||!contactNo) return alert("Business Name + Contact required")
    const { error } = await supabase.from('profiles').upsert([{
      username: username,
      display_name: businessName,
      bio: about,
      location: loc || address,
      phone: contactNo,
      avatar_url: dp,
      cover_url: banner,
    }], { onConflict: 'username' });
    if(error) return alert(error.message);
    setIsEditing(false);
    router.push(`/profile/service/${username}`);
  }

  const pushPost = async (type: string, file: File) => {
    const url = await uploadFile('post_media', file);
    await supabase.from('posts').insert([{ user_id: username, title: businessName, description: type, media_url: url, media_type: type, category: 'service' }]);
    setAllPosts([{ id: Date.now(), owner: username, type, url, createdAt: Date.now() },...allPosts]);
  }

  if (isEditing) {
    return (
      <div className="min-h-screen px-4 pb-10" style={{background:PAGE_BG}}>
        <div className="max-w-[1280px] mx-auto mt-6 h-[64px] flex justify-between items-center px-7 rounded-[22px] sticky top-6 z-50" style={prettyBox}><h1 className="font-serif font-bold text-xl" style={{color:DARK}}>Drisyamn</h1></div>
        <div className="max-w-6xl mx-auto rounded-[22px] p-6 md:p-8 mt-8" style={prettyBox}>
          <h2 className="text-[22px] font-bold" style={{color:DARK}}>{profile? "Edit Service Profile - Supabase" : "Service Profile Setup - Supabase"}</h2>
          <div className="grid md:grid-cols-[35%_65%] gap-8 mt-6">
            <div className="space-y-6">
              <div className="text-center rounded-[20px] p-4 border"><p className="font-bold mb-2 text-[13px]">DP - Supabase Upload</p><div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-[4px] border-white shadow bg-[#F6F1E6] relative">{dp && <img src={dp} className="w-full h-full object-cover" />}<input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={async e => { const f=e.target.files?.[0]; if(f){ const url=await uploadFile('avatars', f); setDp(url); }}} /></div></div>
              <div className="text-center rounded-[20px] p-4 border"><p className="font-bold mb-2 text-[13px]">Cover - Supabase</p><div className="w-full h-32 rounded-[16px] overflow-hidden border-[4px] border-white shadow bg-[#F6F1E6] relative">{banner && <img src={banner} className="w-full h-full object-cover" />}<input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={async e => { const f=e.target.files?.[0]; if(f){ const url=await uploadFile('covers', f); setBanner(url); }}} /></div></div>
            </div>
            <div className="space-y-3">
              <input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Business Name*" className="w-full p-3 rounded-[14px] border bg-[#F6F1E6] outline-none" />
              <input value={contactNo} onChange={e => setContactNo(e.target.value)} placeholder="Contact Number*" className="w-full p-3 rounded-[14px] border bg-[#F6F1E6] outline-none" />
              <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Full Address" className="w-full p-3 rounded-[14px] border bg-[#F6F1E6] outline-none" />
              <input value={loc} onChange={e => setLoc(e.target.value)} placeholder="City" className="w-full p-3 rounded-[14px] border bg-[#F6F1E6] outline-none" />
              <textarea value={about} onChange={e => setAbout(e.target.value)} placeholder="About Us" className="w-full p-3 rounded-[14px] border min-h-[60px] bg-[#F6F1E6] outline-none" />
              <textarea value={story} onChange={e => setStory(e.target.value)} placeholder="Our Story" className="w-full p-3 rounded-[14px] border min-h-[80px] bg-[#FFFEFB] outline-none" />
              <button onClick={handleSave} className="w-full text-white py-4 rounded-full font-black text-[14px]" style={{background:ORANGE}}>Save to Supabase →</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) return null
  const myMedia = allPosts.filter((p: any) => p.owner === username)

  return (
    <div className="min-h-screen px-4 pb-24" style={{background:PAGE_BG}}>
      <div className="max-w-[1280px] mx-auto mt-6 h-[64px] px-7 rounded-[22px] flex justify-between items-center sticky top-6 z-50" style={prettyBox}>
        <h1 className="font-serif font-bold text-[20px] cursor-pointer" style={{color:DARK}} onClick={() => router.push("/homefeed")}>Drisyamn</h1>
        <div className="flex gap-2 text-[12px] font-bold items-center">
          <span onClick={() => router.push("/homefeed")} className="cursor-pointer px-4 py-2 rounded-full bg-[#F6F1E6] border">Home</span>
          <span onClick={() => setShowBookings(true)} className="cursor-pointer text-white px-4 py-2 rounded-full border-[3px] border-white shadow" style={{background:DARK}}>Bookings</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto mt-8">
        <div className="relative rounded-[22px] p-3" style={prettyBox}>
          <div className="h-[340px] overflow-hidden bg-[#F6F1E6] rounded-[16px] border-[4px] border-white shadow"><img src={banner} className="w-full h-full object-cover" /></div>
          <div className="absolute left-1/2 -bottom-24 -translate-x-1/2 rounded-[24px] p-6 w-[92%] md:w-[560px] text-center" style={prettyBox}><div className="flex justify-center -mt-16"><div className="w-28 h-28 rounded-full overflow-hidden border-[5px] border-white shadow bg-[#F6F1E6]"><img src={dp} className="w-full h-full object-cover" /></div></div><h2 className="font-bold text-xl mt-3" style={{color:DARK}}>{businessName}</h2><p className="text-xs mt-1 opacity-60">{loc} - {address}</p><div className="flex gap-2 mt-4 justify-center"><button onClick={() => setShowContact(true)} className="text-white px-5 py-2 rounded-full text-xs font-bold border-[3px] border-white shadow" style={{background:ORANGE}}>Contact Now</button><button onClick={() => setIsEditing(true)} className="text-white px-5 py-2 rounded-full text-xs font-bold border-[3px] border-white shadow" style={{background:DARK}}>Edit</button></div></div>
        </div>

        <div className="h-28"></div>
        <div className="grid md:grid-cols-[32%_68%] gap-6">
          <div className="rounded-[22px] p-6 h-fit" style={prettyBox}>
            <h3 className="font-bold text-[16px]" style={{color:DARK}}>About Us</h3>
            <div className="text-[13px] mt-4 space-y-2.5">
              <div className="bg-[#F6F1E6] rounded-xl p-2.5"><span className="font-bold">Location:</span> {loc}</div>
              <div className="bg-[#F6F1E6] rounded-xl p-2.5"><span className="font-bold">Address:</span> {address}</div>
              <div className="bg-white rounded-xl p-2.5 border"><span className="font-bold">Contact:</span> {contactNo}</div>
              <div className="pt-3 border-t"><p className="font-bold">About</p><p className="text-xs mt-2 bg-[#FFFEFB] p-3 rounded-xl border opacity-70">{about || "No about yet"}</p></div>
              <div className="pt-3"><p className="font-bold">Our Story</p><p className="text-xs mt-2 bg-[#F6F1E6] p-3 rounded-xl border opacity-70">{story || "Our story..."}</p></div>
            </div>
          </div>

          <div className="rounded-[22px] p-6" style={prettyBox}>
            <div className="flex gap-2 mb-6 overflow-auto pb-2">{["Our Services", "Photo", "Video"].map((t: any) => (<button key={t} onClick={() => setTab(t as any)} className="px-5 py-2.5 rounded-full text-[13px] font-bold whitespace-nowrap border shrink-0" style={tab === t? {background:DARK, color:"white"} : {background:"#F6F1E6"}}>{t}</button>))}</div>
            {tab === "Photo" && (<div className="grid grid-cols-3 gap-4">{myMedia.filter((p: any) => p.type === "photo").map((p: any) => (<img key={p.id} src={p.url} className="h-36 w-full object-cover rounded-[16px] border-[4px] border-white shadow" />))}<div onClick={() => { const i=document.createElement('input'); i.type='file'; i.accept='image/*'; i.onchange=(e:any)=>{ const f=e.target.files?.[0]; if(f) pushPost('photo', f); }; i.click(); }} className="h-36 border-2 border-dashed rounded-[16px] flex items-center justify-center cursor-pointer bg-[#F6F1E6]">+ Add Photo</div></div>)}
            {tab === "Video" && (<div className="grid grid-cols-3 gap-4">{myMedia.filter((p: any) => p.type === "video").map((p: any) => (<video key={p.id} src={p.url} controls className="h-36 w-full rounded-[16px] bg-black border-[4px] border-white shadow" />))}<div onClick={() => { const i=document.createElement('input'); i.type='file'; i.accept='video/*'; i.onchange=(e:any)=>{ const f=e.target.files?.[0]; if(f) pushPost('video', f); }; i.click(); }} className="h-36 border-2 border-dashed rounded-[16px] flex items-center justify-center cursor-pointer bg-[#F6F1E6]">+ Add Video</div></div>)}
            {tab === "Our Services" && (<div className="text-center py-20 opacity-50">Services coming from posts - Photo/Video tab se add karo</div>)}
          </div>
        </div>
      </div>
    </div>
  )
}