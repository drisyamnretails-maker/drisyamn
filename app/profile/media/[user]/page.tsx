"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const ORANGE = "#E86A33";
const DARK = "#1F3A4A";
const PAGE_BG = "#EDE6D3";
const CARD_BG = "#FFFEFB";

const prettyBox: React.CSSProperties = {
  background: CARD_BG,
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 0 0 8px #FFFFFF, 0 0 0 9px rgba(0,0,0,0.10), 0 16px 40px rgba(62,42,20,0.14)",
};

type Category = "Live News" | "News" | "Articles" | "Local Events";
type Post = {
  id: number; category: Category; title: string; desc: string; img: string; date: string; author: string;
  likes: number; liked: boolean; saved: boolean; views: number; shares: number;
  comments: { id: string; name: string; text: string; avatar: string; time: string }[];
  createdAt: number;
};

const KEYS = {
  HOMEFEED: "homefeed_posts",
  GLOBAL: "drisyamn_global_posts_v2",
  MEDIA: "drisyamn_posts",
  FOLLOWING: "drisyamn_following",
  NOTIF: "drisyamn_notifs",
  DMS: "drisyamn_dms",
  FOLLOWERS_LIST: "drisyamn_followers_list",
  PROFILE: "drisyamn_media_profile_v3"
};
const safeParse = (k:string,f:any)=>{ try{ const v=typeof window!=="undefined"? localStorage.getItem(k):null; return v? JSON.parse(v):f; }catch{ return f; } };

const calculateScore = (post: any) => {
  const now = Date.now();
  const ageHours = (now - (post.createdAt || now)) / (1000*60*60);
  const engagement = (post.likes||0)*2 + (post.views||0)*0.3 + (post.shares||0)*3 + (post.comments?.length||0)*1.5;
  const recencyBoost = Math.max(0, 48 - ageHours) * 2;
  const decay = Math.pow(ageHours + 2, 1.5);
  return (engagement + recencyBoost + 10) / decay;
};

async function uploadFile(bucket: string, file: File) {
  const name = `${Date.now()}_${file.name}`;
  const { error } = await supabase.storage.from(bucket).upload(name, file);
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(name);
  return data.publicUrl;
}

export default function UsernameMediaPage() {
  const params = useParams();
  const username = (params?.username as string) || "drisyamn";
  const currentUser = "drisyamn";
  const isOwner = username.toLowerCase() === currentUser.toLowerCase();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [followersList, setFollowersList] = useState<any[]>([]);
  const [showEdit, setShowEdit] = useState(false);
  const [editTab, setEditTab] = useState<"cover" | "profile" | "creator" | "feed">("creator");
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [toast, setToast] = useState("");
  const [notifs, setNotifs] = useState<any[]>([]);
  const [dms, setDms] = useState<any[]>([]);
  const [commentText, setCommentText] = useState<Record<number, string>>({});

  const [showMsgPopup, setShowMsgPopup] = useState(false);
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  const [showFollowersPopup, setShowFollowersPopup] = useState(false);

  const [coverImg, setCoverImg] = useState("https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=80");
  const [profileImg, setProfileImg] = useState("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200");
  const [headerTitle, setHeaderTitle] = useState("How I Build Communities as a Solo Creator in 2026");
  const [subHeader, setSubHeader] = useState("Solo Creator • Bengaluru");
  const [bio, setBio] = useState("I am Drisyamn solo creator, storyteller & journalist from Bengaluru.");

  const [creatorName, setCreatorName] = useState("Drisyamn");
  const [address, setAddress] = useState("Bengaluru, Karnataka, India");
  const [contactEmail, setContactEmail] = useState("drisyamn@example.com");
  const [contactPhone, setContactPhone] = useState("+91 98765 43210");
  const [nicheArea, setNicheArea] = useState("Local Journalism • Community Stories • Live News");

  const [newPost, setNewPost] = useState({ category: "News" as Category, title: "", desc: "", img: "", file: null as File | null });
  const [previewImg, setPreviewImg] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const loadSupabase = async () => {
      const { data: profile } = await supabase.from('profiles').select('*').eq('username', username).single();
      if(profile){
        if(profile.avatar_url) setProfileImg(profile.avatar_url);
        if(profile.cover_url) setCoverImg(profile.cover_url);
        if(profile.display_name) setCreatorName(profile.display_name);
        if(profile.bio) setBio(profile.bio);
        if(profile.location) setAddress(profile.location);
      }
      const { data: supaPosts } = await supabase.from('posts').select('*').eq('user_id', username).order('created_at', {ascending:false});
      if(supaPosts && supaPosts.length){
        const mapped = supaPosts.map((p:any)=>({
          id: Number(p.id.slice(0,8).replace(/-/g,'')) || Date.now(),
          category: (p.category as Category) || "News",
          title: p.title, desc: p.description, img: p.media_url,
          date: "Just now", author: p.user_id, likes:0, liked:false, saved:false, views:0, shares:0, comments:[], createdAt: new Date(p.created_at).getTime()
        }));
        setPosts(mapped);
      }
    };
    loadSupabase();

    const savedProfile = safeParse(KEYS.PROFILE, null);
    if (savedProfile) {
      setCoverImg(savedProfile.coverImg || coverImg);
      setProfileImg(savedProfile.profileImg || profileImg);
      setHeaderTitle(savedProfile.headerTitle || headerTitle);
      setSubHeader(savedProfile.subHeader || subHeader);
      setBio(savedProfile.bio || bio);
      setCreatorName(savedProfile.creatorName || creatorName);
      setAddress(savedProfile.address || address);
      setContactEmail(savedProfile.contactEmail || contactEmail);
      setContactPhone(savedProfile.contactPhone || contactPhone);
      setNicheArea(savedProfile.nicheArea || nicheArea);
    }
    const saved = safeParse(KEYS.MEDIA, []);
    if (saved.length && posts.length===0) {
      const ranked = saved.map((p:any)=> ({...p, createdAt: p.createdAt || Date.now() - Math.random()*10000000})).sort((a:any,b:any)=> calculateScore(b) - calculateScore(a));
      setPosts(ranked);
    }
    setNotifs(safeParse(KEYS.NOTIF, []));
    setDms(safeParse(KEYS.DMS, []));
    const flist = safeParse(KEYS.FOLLOWERS_LIST, []);
    setFollowersList(flist);
    setFollowers(flist.length || 0);
    setIsFollowing(safeParse(KEYS.FOLLOWING, []).includes(username));
  }, [username]);

  useEffect(() => { localStorage.setItem(KEYS.MEDIA, JSON.stringify(posts)); }, [posts]);
  useEffect(()=>{ localStorage.setItem(KEYS.PROFILE, JSON.stringify({coverImg, profileImg, headerTitle, subHeader, bio, creatorName, address, contactEmail, contactPhone, nicheArea})); }, [coverImg, profileImg, headerTitle, subHeader, bio, creatorName, address, contactEmail, contactPhone, nicheArea]);
  useEffect(()=>{ localStorage.setItem(KEYS.NOTIF, JSON.stringify(notifs)); localStorage.setItem(KEYS.DMS, JSON.stringify(dms)); localStorage.setItem(KEYS.FOLLOWERS_LIST, JSON.stringify(followersList)); }, [notifs, dms, followersList]);

  const todaysNews = useMemo(() => {
    return [...posts].sort((a,b)=> calculateScore(b) - calculateScore(a)).slice(0,5).map(p=> ({
      time: new Date(p.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
      title: p.title,
      tag: p.category
    }));
  }, [posts]);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const pushToHomefeed = (post: Post) => {
    const home = safeParse(KEYS.HOMEFEED, []);
    const global = safeParse(KEYS.GLOBAL, []);
    const homeObj = { id: post.id, category: post.category, type: post.category, media: post.img, url: post.img, img: post.img, title: post.title, caption: post.title, desc: post.desc, text: post.desc, author: username, avatar: profileImg, likes: post.likes, views: post.views, date: "Just now", time: "Just now", createdAt: Date.now(), fromMedia: true, creatorName, nicheArea };
    const newHome = [homeObj,...home].sort((a:any,b:any)=> calculateScore(b) - calculateScore(a)).slice(0,100);
    const newGlobal = [homeObj,...global].sort((a:any,b:any)=> calculateScore(b) - calculateScore(a)).slice(0,100);
    localStorage.setItem(KEYS.HOMEFEED, JSON.stringify(newHome));
    localStorage.setItem(KEYS.GLOBAL, JSON.stringify(newGlobal));
  };

  const startCamera = async () => { try { const s = await navigator.mediaDevices.getUserMedia({ video: true }); setStream(s); if (videoRef.current) videoRef.current.srcObject = s; setCameraOn(true); } catch { showToast("Camera permission dena padega"); } };
  const stopCamera = () => { stream?.getTracks().forEach(t => t.stop()); setCameraOn(false); setStream(null); };
  const capturePhoto = () => { if (!videoRef.current ||!canvasRef.current) return; const canvas = canvasRef.current; canvas.width = videoRef.current.videoWidth; canvas.height = videoRef.current.videoHeight; canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0); const url = canvas.toDataURL("image/jpeg"); setPreviewImg(url); setNewPost({...newPost, img: url, file: null, category: "Live News" } as any); showToast("Live photo captured"); stopCamera(); };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPost({...newPost, file} as any);
      const reader = new FileReader();
      reader.onload = (ev) => { const url = ev.target?.result as string; setPreviewImg(url); };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePost = async () => {
    if (!newPost.title.trim()) { showToast("Header likh bhai"); return; }
    if (!previewImg &&!newPost.file) { showToast("Photo ya Camera se capture karo"); return; }
    try {
      let finalUrl = previewImg;
      if (newPost.file) {
        finalUrl = await uploadFile('post_media', newPost.file);
      } else if (previewImg.startsWith('data:')) {
        const res = await fetch(previewImg);
        const blob = await res.blob();
        const file = new File([blob], `live_${Date.now()}.jpg`, {type: "image/jpeg"});
        finalUrl = await uploadFile('post_media', file);
      }
      await supabase.from('posts').insert([{
        user_id: username,
        title: newPost.title,
        description: newPost.desc,
        media_url: finalUrl,
        media_type: 'photo',
        category: newPost.category,
      }]);
      const post: Post = { id: Date.now(), category: newPost.category, title: newPost.title, desc: newPost.desc, img: finalUrl, date: "Just now", author: username, likes: 0, liked: false, saved: false, views: 1, shares: 0, comments: [], createdAt: Date.now() };
      const updated = [post,...posts].sort((a,b)=> calculateScore(b) - calculateScore(a));
      setPosts(updated);
      pushToHomefeed(post);
      setNewPost({ category: "News" as Category, title: "", desc: "", img: "", file: null });
      setPreviewImg("");
      setShowEdit(false);
      stopCamera();
      showToast(`${post.category} → Supabase + Homefeed pe gaya ✓`);
    } catch(e:any){ showToast(e.message) }
  };

  const toggleLike = (id:number)=> setPosts(prev=> prev.map(p=> { if(p.id!==id) return p; const liked =!p.liked; const likes = liked? p.likes+1 : Math.max(0, p.likes-1); return {...p, liked, likes, views: p.views+1}; }).sort((a,b)=> calculateScore(b) - calculateScore(a)));
  const toggleSave = (id:number)=> setPosts(prev=> prev.map(p=> p.id===id? {...p, saved:!p.saved}:p));
  const sharePost = async(p:Post)=>{ const url = `${window.location.origin}/profile/media/${username}?post=${p.id}`; try{ if(navigator.share){ await navigator.share({title:p.title, text:p.desc, url}); } else { await navigator.clipboard.writeText(url); showToast("Link copied!"); } setPosts(prev=> prev.map(x=> x.id===p.id? {...x, shares:x.shares+1, views:x.views+1}:x).sort((a:any,b:any)=> calculateScore(b) - calculateScore(a))); }catch{} };
  const addComment = (id:number)=>{ const txt = commentText[id]; if(!txt?.trim()) return; setPosts(prev=> prev.map(p=> p.id===id? {...p, comments:[...p.comments, {id:Date.now().toString(), name:"You", text:txt, avatar:"https://i.pravatar.cc/150?img=32", time:"Just now"}], views:p.views+1}:p).sort((a:any,b:any)=> calculateScore(b) - calculateScore(a))); setCommentText({...commentText, [id]:""}); };
  const toggleFollow = ()=>{ const f = safeParse(KEYS.FOLLOWING, []); let upd; if(isFollowing){ upd=f.filter((x:string)=>x!==username); setFollowers(s=> Math.max(0, s-1)); setFollowersList(prev=> prev.filter((p:any)=> p.name!==currentUser)); } else { upd=[...f, username]; const newFollower = {id:Date.now(), name:currentUser, avatar:"https://i.pravatar.cc/150?img=32", bio:"New follower", verified:false, followedAt: Date.now()}; setFollowers(s=> s+1); setFollowersList(prev=> [newFollower,...prev]); setNotifs(n=> [{id:Date.now().toString(), type:"follow", from:currentUser, text:"started following you", time:"Just now", read:false, avatar:"https://i.pravatar.cc/150?img=32"},...n]); } localStorage.setItem(KEYS.FOLLOWING, JSON.stringify(upd)); setIsFollowing(!isFollowing); showToast(isFollowing? "Unfollowed":"Following ✓"); };

  const categories: Category[] = ["Live News", "News", "Articles", "Local Events"];
  const displayPosts = useMemo(()=> { let filtered = activeCategory === "All"? posts : posts.filter(p => p.category === activeCategory); return filtered.sort((a,b)=> calculateScore(b) - calculateScore(a)); }, [posts, activeCategory]);
  const unreadNotif = notifs.filter((n:any)=>!n.read).length;
  const unreadMsg = dms.filter((d:any)=>d.unread>0).reduce((s:any,d:any)=>s+d.unread,0);

  return (
    <div className="min-h-screen pb-10 px-4 relative" style={{background:PAGE_BG, color:DARK}}>
      <nav className="w-full max-w-[1280px] mx-auto mt-6 px-7 h-[64px] flex justify-between items-center rounded-[22px] sticky top-6 z-50" style={prettyBox}>
        <Link href="/homefeed" className="font-serif font-bold text-[24px]" style={{color:DARK}}>Drisyamn</Link>
        <div className="flex items-center gap-2 relative">
          <Link href="/homefeed" className="px-5 py-2 rounded-full text-[12px] font-bold bg-[#F6F1E6] border">Home</Link>
          <div className="relative">
            <button onClick={()=>{ setShowMsgPopup(!showMsgPopup); setShowNotifPopup(false); setShowFollowersPopup(false); }} className="relative px-5 py-2 rounded-full text-[12px] font-bold bg-[#F6F1E6] border">Message{unreadMsg>0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full grid place-items-center">{unreadMsg}</span>}</button>
            {showMsgPopup && (<div className="absolute top-[48px] right-0 w-[320px] rounded-[18px] p-3 z-[100]" style={prettyBox}><div className="flex justify-between items-center mb-3"><span className="font-black text-[13px]">Messages</span><button onClick={()=>setShowMsgPopup(false)} className="w-6 h-6 rounded-full bg-[#F6F1E6] grid place-items-center text-[11px]">✕</button></div><div className="space-y-2 max-h-[320px] overflow-y-auto">{dms.length===0? <p className="text-[11px] opacity-50 text-center py-6">No messages</p> : dms.map((m:any)=>(<div key={m.id} className="flex gap-2.5 bg-[#F6F1E6] border rounded-[14px] p-2.5"><img src={m.avatar} className="w-9 h-9 rounded-full border-2 border-white shadow" alt=""/><div className="flex-1"><span className="font-bold text-[12px]">{m.user}</span><p className="text-[11px] opacity-60 truncate">{m.lastMsg}</p></div></div>))}</div></div>)}
          </div>
          <div className="relative">
            <button onClick={()=>{ setShowNotifPopup(!showNotifPopup); setShowMsgPopup(false); setShowFollowersPopup(false); setNotifs(prev=>prev.map((n:any)=>({...n,read:true}))); }} className="relative px-5 py-2 rounded-full text-[12px] font-bold bg-[#F6F1E6] border">🔔 Notifications{unreadNotif>0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF7A45] text-white text-[10px] rounded-full grid place-items-center">{unreadNotif}</span>}</button>
            {showNotifPopup && (<div className="absolute top-[48px] right-0 w-[340px] rounded-[18px] p-3 z-[100]" style={prettyBox}><div className="flex justify-between items-center mb-3"><span className="font-black text-[13px]">Notifications</span><button onClick={()=>setShowNotifPopup(false)} className="w-6 h-6 rounded-full bg-[#F6F1E6] grid place-items-center text-[11px]">✕</button></div><div className="space-y-2 max-h-[360px] overflow-y-auto">{notifs.length===0? <p className="text-[11px] opacity-50 text-center py-6">No notifications</p> : notifs.map((n:any)=>(<div key={n.id} className="flex gap-2.5 bg-[#F6F1E6] border rounded-[14px] p-2.5"><img src={n.avatar} className="w-9 h-9 rounded-full border-2 border-white shadow" alt=""/><div className="flex-1"><p className="text-[12px]"><b>{n.from}</b> {n.text}</p></div></div>))}</div></div>)}
          </div>
          <div className="relative"><button onClick={()=>setShowFollowersPopup(!showFollowersPopup)} className="px-5 py-2 rounded-full text-[12px] font-bold text-white border-[3px] border-white shadow" style={{background:DARK}}>{followers.toLocaleString()} Followers</button>
            {showFollowersPopup && (<div className="absolute top-[48px] right-0 w-[360px] rounded-[18px] p-4 z-[100]" style={prettyBox}><div className="flex justify-between items-center mb-3"><span className="font-black text-[14px]">Followers • {followersList.length}</span><button onClick={()=>setShowFollowersPopup(false)} className="w-7 h-7 rounded-full bg-[#F6F1E6] grid place-items-center">✕</button></div><div className="space-y-2 max-h-[340px] overflow-y-auto">{followersList.length===0? <p className="text-[11px] opacity-50 text-center py-10">No followers yet</p> : followersList.map((f:any)=>(<div key={f.id} className="flex gap-3 bg-[#F6F1E6] border rounded-[14px] p-2.5"><img src={f.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow" alt=""/><div className="flex-1"><span className="font-bold text-[12px]">{f.name}</span><p className="text-[11px] opacity-60">{f.bio}</p></div></div>))}</div></div>)}
          </div>
        </div>
      </nav>

      {(showMsgPopup || showNotifPopup || showFollowersPopup) && <div className="fixed inset-0 z-40" onClick={()=>{ setShowMsgPopup(false); setShowNotifPopup(false); setShowFollowersPopup(false); }}></div>}

      <div className="w-full max-w-[1280px] mx-auto mt-8">
        <div className="rounded-[22px] p-3" style={prettyBox}>
          <div className="relative rounded-[16px] overflow-hidden border-[4px] border-white shadow">
            <img src={coverImg} className="w-full h-[300px] object-cover" alt="cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-5 text-white">
              <h2 className="font-black text-[20px]">@{username} • {posts.length} posts • {followers.toLocaleString()} followers</h2>
              <p className="text-[12px] opacity-90">{subHeader}</p>
            </div>
          </div>
          <div className="px-3 py-4 flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-[22px] font-bold leading-tight" style={{color:DARK}}>{headerTitle}</h1>
              <p className="text-[12px] opacity-60 mt-1.5 leading-relaxed">{bio}</p>
            </div>
            {isOwner && <button onClick={()=>{ setEditTab("creator"); setShowEdit(true); }} className="ml-4 px-5 py-2 rounded-full text-[11px] font-bold text-white border-[3px] border-white shadow shrink-0" style={{background:DARK}}>Edit Profile</button>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_0.6fr_0.7fr] gap-6 mt-6">
          <div className="rounded-[22px] p-5" style={prettyBox}>
            <div className="flex justify-between items-center">
              <div className="font-bold text-[15px]" style={{color:DARK}}>Timeline - @{username}</div>
              {isOwner && <button onClick={() => { setEditTab("feed"); setShowEdit(true); }} className="text-white px-5 py-1.5 rounded-full text-[11px] font-bold border-[3px] border-white shadow" style={{background:ORANGE}}>+ Add</button>}
            </div>
            <div className="flex flex-wrap gap-2 mt-4 p-1">
              <button onClick={() => setActiveCategory("All")} className="px-4 py-2 rounded-full text-[11px] font-bold border" style={activeCategory==="All"?{background:DARK,color:"white"}:{background:"#F6F1E6"}}>All ({posts.length})</button>
              {categories.map(cat => (<button key={cat} onClick={() => setActiveCategory(cat)} className="px-4 py-2 rounded-full text-[11px] font-bold border" style={activeCategory===cat?{background:DARK,color:"white"}:{background:"#F6F1E6"}}>{cat} ({posts.filter(p=>p.category===cat).length})</button>))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              {displayPosts.length===0? <div className="col-span-2 text-center py-16"><p className="text-[14px] font-bold opacity-60">No posts yet</p>{isOwner && <button onClick={()=>{ setEditTab("feed"); setShowEdit(true); }} className="mt-4 px-6 py-2 rounded-full text-white text-[12px] font-bold" style={{background:ORANGE}}>+ Create First Post</button>}</div> : displayPosts.map(p => (
                <div key={p.id} className="rounded-[18px] overflow-hidden bg-[#F6F1E6] border-[4px] border-white shadow group relative hover:-translate-y-1 transition">
                  <div className="relative"><img src={p.img} className="w-full h-[140px] object-cover cursor-pointer" alt="" onClick={()=> { setPosts(prev=> prev.map(x=> x.id===p.id? {...x, views:x.views+1}:x).sort((a:any,b:any)=> calculateScore(b) - calculateScore(a))); }} /><div className="absolute top-3 left-3 text-white text-[9px] px-2.5 py-1 rounded-full font-bold border border-white/20" style={{background:DARK}}>{p.category}</div><div className="absolute top-3 right-10 bg-black/60 text-white text-[9px] px-2 py-1 rounded-full">👁️ {p.views}</div>{isOwner && <button onClick={() => setPosts(posts.filter(x => x.id!== p.id))} className="absolute top-3 right-3 w-6 h-6 bg-red-500 text-white rounded-full text-[10px] opacity-0 group-hover:opacity-100 grid place-items-center border border-white">x</button>}</div>
                  <div className="p-3.5 bg-[#FFFEFB]"><h4 className="font-bold text-[13px] line-clamp-2 leading-tight">{p.title}</h4><p className="text-[11px] opacity-60 mt-1 line-clamp-2">{p.desc}</p><div className="flex gap-1 mt-2"><button onClick={()=>toggleLike(p.id)} className={`flex-1 py-1 rounded-full text-[10px] font-bold border ${p.liked? "bg-red-50 text-red-600 border-red-200":"bg-[#F6F1E6]"}`}>{p.liked? "❤️":"🤍"} {p.likes}</button><button onClick={()=>toggleSave(p.id)} className={`w-7 h-7 rounded-full border grid place-items-center text-[10px] ${p.saved? "bg-black text-white":"bg-[#F6F1E6]"}`}>{p.saved? "★":"☆"}</button><button onClick={()=>sharePost(p)} className="w-7 h-7 rounded-full bg-[#F6F1E6] border grid place-items-center text-[10px]">↗ {p.shares>0? p.shares:""}</button></div><div className="mt-2">{p.comments.slice(0,1).map(c=> <div key={c.id} className="text-[10px] bg-[#F6F1E6] rounded-full px-2 py-1 border"><b>{c.name}:</b> {c.text}</div>)}<div className="flex gap-1 mt-1.5"><input value={commentText[p.id]||""} onChange={e=>setCommentText({...commentText, [p.id]:e.target.value})} placeholder="Comment..." className="flex-1 bg-[#F6F1E6] border rounded-full px-2 py-1 text-[10px] outline-none"/><button onClick={()=>addComment(p.id)} className="px-3 py-1 rounded-full bg-black text-white text-[9px] font-bold">Post</button></div></div></div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[22px] p-5 h-fit sticky top-[90px]" style={prettyBox}>
            <div className="font-bold text-[14px] flex justify-between items-center" style={{color:DARK}}>Today's News <span className="text-[9px] bg-red-500 text-white px-2 py-1 rounded-full animate-pulse border border-white shadow">LIVE</span></div>
            <div className="mt-4 space-y-3">
              {todaysNews.length===0? <p className="text-[11px] opacity-50 text-center py-8">No news yet</p> : todaysNews.map((n, i) => (
                <div key={i} className="bg-[#F6F1E6] rounded-[14px] p-3 border"><div className="flex justify-between"><span className="text-[10px] font-bold" style={{color:DARK}}>{n.time}</span><span className="text-[9px] bg-white px-2 py-0.5 rounded-full border font-bold">{n.tag}</span></div><div className="text-[12px] font-semibold mt-1 leading-tight">{n.title}</div></div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[22px] p-5" style={prettyBox}>
              <div className="flex gap-3"><img src={profileImg} className="w-12 h-12 rounded-full object-cover border-[3px] border-white shadow" alt="" /><div className="flex-1"><div className="font-bold text-[13px]" style={{color:DARK}}>{creatorName}</div><div className="text-[11px] opacity-60">{nicheArea}</div><div className="text-[10px] opacity-50 mt-1">📍 {address}</div></div></div>
              <div className="mt-4 space-y-2 bg-[#F6F1E6] rounded-[14px] p-3 border">
                <div className="text-[11px] font-bold" style={{color:DARK}}>Creator Details</div>
                <div className="text-[11px]"><span className="opacity-60">Name:</span> <b>{creatorName}</b></div>
                <div className="text-[11px]"><span className="opacity-60">Address:</span> {address}</div>
                <div className="text-[11px]"><span className="opacity-60">Email:</span> {contactEmail}</div>
                <div className="text-[11px]"><span className="opacity-60">Phone:</span> {contactPhone}</div>
                <div className="text-[11px]"><span className="opacity-60">Niche:</span> {nicheArea}</div>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={toggleFollow} className="flex-1 py-2.5 rounded-full text-[11px] font-bold border-[3px] border-white shadow" style={isFollowing?{background:CARD_BG,color:DARK}:{background:DARK,color:"white"}}>{isFollowing? "Following" : "Follow"}</button>
                <button onClick={() => { setIsSubscribed(!isSubscribed); showToast(isSubscribed? "Unsubscribed":"Subscribed ✓"); }} className="flex-1 py-2.5 rounded-full text-[11px] font-bold border-[3px] border-white shadow" style={isSubscribed?{background:DARK,color:"white"}:{background:CARD_BG}}>{isSubscribed? "Subscribed" : "Subscribe"}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEdit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm grid place-items-center z-[100] p-4" onClick={() => { setShowEdit(false); stopCamera(); }}>
          <div className="w-full max-w-[500px] rounded-[22px] p-6 max-h-[90vh] overflow-y-auto" style={prettyBox} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center"><h2 className="text-[16px] font-bold" style={{color:DARK}}>Edit Profile</h2><button onClick={() => { setShowEdit(false); stopCamera(); }} className="w-7 h-7 grid place-items-center bg-[#F6F1E6] rounded-full">✕</button></div>
            <div className="flex gap-1.5 mt-4 bg-[#F6F1E6] p-1 rounded-full w-fit overflow-x-auto">
              <button onClick={() => setEditTab("creator")} className="px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap" style={editTab==="creator"?{background:DARK,color:"white"}:{}}>Creator Info</button>
              <button onClick={() => setEditTab("cover")} className="px-4 py-1.5 rounded-full text-[11px] font-bold" style={editTab==="cover"?{background:DARK,color:"white"}:{}}>Cover</button>
              <button onClick={() => setEditTab("profile")} className="px-4 py-1.5 rounded-full text-[11px] font-bold" style={editTab==="profile"?{background:DARK,color:"white"}:{}}>Profile</button>
              <button onClick={() => setEditTab("feed")} className="px-4 py-1.5 rounded-full text-[11px] font-bold" style={editTab==="feed"?{background:DARK,color:"white"}:{}}>Timeline Add</button>
            </div>
            <div className="mt-5">
              {editTab === "creator" && (
                <div className="space-y-3">
                  <input value={creatorName} onChange={e => setCreatorName(e.target.value)} placeholder="Creator Name *" className="w-full bg-[#F6F1E6] border px-3 py-2.5 rounded-xl text-sm" />
                  <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address *" className="w-full bg-[#F6F1E6] border px-3 py-2.5 rounded-xl text-sm" />
                  <input value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="Email" className="w-full bg-[#F6F1E6] border px-3 py-2.5 rounded-xl text-sm" />
                  <input value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="Phone" className="w-full bg-[#F6F1E6] border px-3 py-2.5 rounded-xl text-sm" />
                  <input value={nicheArea} onChange={e => setNicheArea(e.target.value)} placeholder="Niche Area" className="w-full bg-[#F6F1E6] border px-3 py-2.5 rounded-xl text-sm" />
                  <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Bio" className="w-full bg-[#F6F1E6] border px-3 py-2.5 rounded-xl text-sm" />
                  <button onClick={async()=>{ await supabase.from('profiles').update({display_name:creatorName, bio, location:address}).eq('username', username); showToast("Saved to Supabase ✓"); setShowEdit(false); }} className="w-full text-white py-2.5 rounded-full text-sm font-bold" style={{background:DARK}}>Save to Supabase →</button>
                </div>
              )}
              {editTab === "cover" && (
                <div className="space-y-3">
                  <img src={coverImg} className="w-full h-[140px] object-cover rounded-xl border-[3px] border-white shadow" alt="" />
                  <input type="file" accept="image/*" onChange={async e => { const f = e.target.files?.[0]; if (f) { const url = await uploadFile('covers', f); setCoverImg(url); await supabase.from('profiles').update({cover_url:url}).eq('username', username); showToast("Cover → Supabase ✓"); } }} className="w-full bg-[#F6F1E6] border px-3 py-2 rounded-xl text-[11px]" />
                  <input value={headerTitle} onChange={e => setHeaderTitle(e.target.value)} placeholder="Header Title" className="w-full bg-[#F6F1E6] border px-3 py-2.5 rounded-xl text-sm" />
                  <input value={subHeader} onChange={e => setSubHeader(e.target.value)} placeholder="Sub Header" className="w-full bg-[#F6F1E6] border px-3 py-2.5 rounded-xl text-sm" />
                </div>
              )}
              {editTab === "profile" && (
                <div className="space-y-3 text-center">
                  <img src={profileImg} className="w-20 h-20 rounded-full mx-auto shadow border-[4px] border-white" alt="" />
                  <input type="file" accept="image/*" onChange={async e => { const f = e.target.files?.[0]; if (f) { const url = await uploadFile('avatars', f); setProfileImg(url); await supabase.from('profiles').update({avatar_url:url}).eq('username', username); showToast("DP → Supabase ✓"); } }} className="w-full bg-[#F6F1E6] border px-3 py-2 rounded-xl text-[11px]" />
                </div>
              )}
              {editTab === "feed" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-1.5">{categories.map(cat => (<button key={cat} onClick={() => { setNewPost({...newPost, category: cat } as any); if (cat === "Live News") startCamera(); else stopCamera(); }} className="py-2 rounded-full text-[11px] font-bold border" style={newPost.category===cat?{background:DARK,color:"white"}:{background:"#F6F1E6"}}>{cat}</button>))}</div>
                  {newPost.category === "Live News" && (
                    <div className="bg-black rounded-xl p-2 border-[3px] border-white shadow">
                      {!cameraOn? <button onClick={startCamera} className="w-full bg-red-600 text-white py-2 rounded-full text-xs font-bold">Camera On - Live News</button> : <><video ref={videoRef} autoPlay playsInline className="w-full h-[150px] rounded-lg"></video><div className="flex gap-2 mt-2"><button onClick={capturePhoto} className="flex-1 bg-red-600 text-white py-2 rounded-full text-xs font-bold">Capture</button><button onClick={stopCamera} className="flex-1 bg-white py-2 rounded-full text-xs">Off</button></div></>}
                      <canvas ref={canvasRef} className="hidden"></canvas>
                    </div>
                  )}
                  <input value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value })} placeholder="Header" className="w-full bg-[#F6F1E6] border px-3 py-2 rounded-xl text-sm" />
                  <input type="file" accept="image/*" onChange={handleFile} className="w-full bg-[#F6F1E6] border px-3 py-2 rounded-xl text-[11px]" />
                  {previewImg && <img src={previewImg} className="w-full h-[110px] object-cover rounded-xl border-[3px] border-white shadow" alt="" />}
                  <textarea value={newPost.desc} onChange={e => setNewPost({...newPost, desc: e.target.value })} placeholder="Article..." rows={3} className="w-full bg-[#F6F1E6] border px-3 py-2 rounded-xl text-sm" />
                  <button onClick={handleSavePost} className="w-full text-white py-2.5 rounded-full text-sm font-bold" style={{background:DARK}}>Save {newPost.category} → Supabase + Homefeed</button>
                </div>
              )}
            </div>
            <button onClick={() => { setShowEdit(false); stopCamera(); }} className="w-full mt-5 bg-[#F6F1E6] py-2.5 rounded-full text-sm font-bold">Close</button>
          </div>
        </div>
      )}
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-white px-6 py-2.5 rounded-full text-xs z-[200] border-[3px] border-white shadow" style={{background:DARK}}>{toast}</div>}
    </div>
  );
}