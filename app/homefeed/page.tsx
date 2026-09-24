"use client";
import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const ORANGE = "#E86A33";
const DARK = "#1F3A4A";
const PAGE_BG = "#EDE6D3";
const CARD_BG = "#FFFEFB";
const prettyBox: React.CSSProperties = {
  background: CARD_BG,
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 0 0 8px #FFFFFF, 0 0 0 9px rgba(0,0,0,0.10), 0 16px 40px rgba(62,42,20,0.14)"
};

async function uploadFile(bucket: string, file: File) {
  const name = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g,'_')}`;
  const { error } = await supabase.storage.from(bucket).upload(name, file);
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(name);
  return data.publicUrl;
}

type Post = { id:string; author:string; avatar:string; text:string; media?:string[]; mediaType?:("image"|"video")[]; likes:number; liked:boolean; saved:boolean; comments:any[]; shares:number; time:string; createdAt:number; location:string; hashtags:string[]; category?:string; };

export default function HomeFeedProPlus() {
  const router = useRouter();
  const [username, setUsername] = useState("drisyamn");
  const [text, setText] = useState("");
  const [medias, setMedias] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaTypes, setMediaTypes] = useState<("image"|"video")[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentMap, setCommentMap] = useState<Record<string,string>>({});
  const [following, setFollowing] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"latest"|"trending">("latest");
  const [visible, setVisible] = useState(6);
  const [showMenu, setShowMenu] = useState<string|null>(null);
  const [editingId, setEditingId] = useState<string|null>(null);
  const [editText, setEditText] = useState("");
  const uploadRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const u = localStorage.getItem("drisyamn_username") || "drisyamn";
    setUsername(u);
    setFollowing(JSON.parse(localStorage.getItem("drisyamn_following")||"[]"));
    setSavedIds(JSON.parse(localStorage.getItem("drisyamn_saved")||"[]"));
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', {ascending:false}).limit(100);
    if(data){
      setPosts(data.map((p:any)=>({
        id: p.id, author: p.user_id, avatar: `https://i.pravatar.cc/100?u=${p.user_id}`,
        text: p.title || p.description || "", media: p.media_url? [p.media_url] : [], mediaType: [p.media_type || 'image'],
        likes:0, liked:false, saved:false, comments:[], shares:0,
        time: new Date(p.created_at).toLocaleTimeString(), createdAt: new Date(p.created_at).getTime(),
        location: "Siliguri", hashtags:[], category: p.category
      })));
    }
  };

  const handleUpload = async (files: FileList | null) => {
    if(!files) return;
    const nMedia:string[]=[]; const nFiles:File[]=[]; const nTypes:("image"|"video")[]=[];
    for(let file of Array.from(files).slice(0,4)){
      nMedia.push(URL.createObjectURL(file)); nFiles.push(file);
      nTypes.push(file.type.startsWith("video/")? "video":"image");
    }
    setMedias(prev=> [...prev,...nMedia].slice(0,4));
    setMediaFiles(prev=> [...prev,...nFiles].slice(0,4));
    setMediaTypes(prev=> [...prev,...nTypes].slice(0,4));
  };
  const removeMedia = (idx:number) => { setMedias(prev=> prev.filter((_,i)=>i!==idx)); setMediaFiles(prev=> prev.filter((_,i)=>i!==idx)); setMediaTypes(prev=> prev.filter((_,i)=>i!==idx)); };
  const handlePost = async () => {
    if(!text.trim() && mediaFiles.length===0) return;
    setUploading(true);
    try {
      let mediaUrl=""; let mediaType="text";
      if(mediaFiles.length>0){ mediaUrl=await uploadFile('post_media', mediaFiles[0]); mediaType=mediaTypes[0]; }
      await supabase.from('posts').insert([{ user_id: username, title: text, description: text, media_url: mediaUrl, media_type: mediaType, category: 'homefeed' }]);
      await loadPosts(); setText(""); setMedias([]); setMediaFiles([]); setMediaTypes([]);
    } catch(e:any){ alert(e.message) }
    setUploading(false);
  };
  const deletePost = async (id:string) => { if(!confirm("Delete?")) return; await supabase.from('posts').delete().eq('id', id); setPosts(posts.filter(p=>p.id!==id)); setShowMenu(null); };
  const startEdit = (p:Post) => { setEditingId(p.id); setEditText(p.text); setShowMenu(null); };
  const saveEdit = async () => { await supabase.from('posts').update({title: editText, description: editText}).eq('id', editingId); setPosts(posts.map(p=> p.id===editingId? {...p, text:editText}:p)); setEditingId(null); };
  const toggleLike = (id:string) => setPosts(posts.map(p=> p.id===id? {...p, liked:!p.liked, likes:p.liked?p.likes-1:p.likes+1}:p));
  const toggleSave = (id:string) => { const upd = savedIds.includes(id)? savedIds.filter(x=>x!==id):[...savedIds,id]; setSavedIds(upd); localStorage.setItem("drisyamn_saved",JSON.stringify(upd)); };
  const toggleFollow = (author:string) => { const upd = following.includes(author)? following.filter(x=>x!==author):[...following,author]; setFollowing(upd); localStorage.setItem("drisyamn_following",JSON.stringify(upd)); };
  const sharePost = async (p:Post) => { const url=`${window.location.origin}/post/${p.id}`; try{ if(navigator.share) await navigator.share({title:`Post by @${p.author}`, text:p.text, url}); else{ await navigator.clipboard.writeText(url); alert("Link copied!"); } }catch{} };
  const addComment = (postId:string) => { const t=commentMap[postId]; if(!t?.trim()) return; setPosts(posts.map(p=> p.id===postId? {...p, comments:[...p.comments, {id:Date.now(), user:username, text:t}]}:p)); setCommentMap({...commentMap,[postId]:""}); };
  const filtered = useMemo(()=>{ let f=posts; if(search) f=f.filter(p=> p.text.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase())); if(locationFilter!=="All") f=f.filter(p=> p.location===locationFilter); if(sortBy==="trending") f=[...f].sort((a,b)=> b.likes - a.likes); else f=[...f].sort((a,b)=> b.createdAt - a.createdAt); return f; },[posts, search, locationFilter, sortBy]);
  useEffect(()=>{ const obs=new IntersectionObserver(e=>{ if(e[0].isIntersecting) setVisible(v=>v+4); },{threshold:1}); if(loaderRef.current) obs.observe(loaderRef.current); return()=>obs.disconnect(); },[]);

  return (
    <div className="min-h-screen px-4 pb-28 relative" style={{background:PAGE_BG, color:DARK}}>
      <nav className="max-w-[1280px] mx-auto mt-6 h-[68px] flex items-center justify-between px-3 md:px-6 rounded-[22px] sticky top-6 z-50" style={prettyBox}>
        <Link href="/homefeed" className="font-serif font-black text-[22px] md:text-[26px]" style={{color:DARK}}>Drisyamn<span style={{color:ORANGE}}>.</span></Link>
        <div className="flex items-center gap-1.5">
          <button onClick={()=>router.push("/homefeed")} className="hidden md:block px-4 py-2 rounded-full text-white text-[12px] font-bold border-[3px] border-white shadow" style={{background:DARK}}>Home</button>
          <button onClick={()=>router.push("/homefeed/reels")} className="px-3 py-2 rounded-full bg-black text-white border-[3px] border-white shadow text-[11px] font-bold">🎬 Reels</button>
          <button onClick={()=>router.push(`/profile/retail/${username}`)} className="px-3 py-2 rounded-full bg-[#F6F1E6] border text-[11px] font-bold">Shops</button>
          <button onClick={()=>router.push(`/profile/service/${username}`)} className="px-3 py-2 rounded-full bg-[#F6F1E6] border text-[11px] font-bold">Services</button>
        </div>
        <Link href={`/personal/${username}`} className="w-9 h-9 rounded-full border-[3px] border-white shadow overflow-hidden"><img src={`https://i.pravatar.cc/100?u=${username}`} className="w-full h-full object-cover" alt="" /></Link>
      </nav>

      {showMenu && <div className="fixed inset-0 z-40" onClick={()=>setShowMenu(null)}></div>}

      <div className="max-w-[1280px] mx-auto mt-8 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3 space-y-6 hidden lg:block">
          <div className="rounded-[22px] p-5" style={prettyBox}>
            <div className="flex gap-3 items-center"><img src={`https://i.pravatar.cc/100?u=${username}`} className="w-12 h-12 rounded-full border-[3px] border-white shadow" alt="" /><div><div className="font-bold text-[14px]">@{username}</div><div className="text-[11px] opacity-60">🟢 Online • Matigara</div></div></div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center"><div className="bg-[#F6F1E6] rounded-xl p-2 border"><div className="font-black">{posts.filter(p=>p.author===username).length}</div><div className="text-[10px]">Posts</div></div><div className="bg-[#F6F1E6] rounded-xl p-2 border"><div className="font-black">{following.length}</div><div className="text-[10px]">Following</div></div><div className="bg-[#F6F1E6] rounded-xl p-2 border"><div className="font-black">{savedIds.length}</div><div className="text-[10px]">Saved</div></div></div>
            <div className="mt-4">
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search #hashtag, user..." className="w-full bg-[#F6F1E6] border rounded-full px-4 py-2.5 text-[12px] outline-none" />
              <div className="flex gap-2 mt-2"><select value={locationFilter} onChange={e=>setLocationFilter(e.target.value)} className="flex-1 bg-[#F6F1E6] border rounded-full px-3 py-2 text-[11px] font-bold"><option>All</option><option>Matigara</option><option>City Center</option></select><select value={sortBy} onChange={e=>setSortBy(e.target.value as any)} className="flex-1 bg-[#F6F1E6] border rounded-full px-3 py-2 text-[11px] font-bold"><option value="latest">Latest</option><option value="trending">Trending</option></select></div>
            </div>

            {/* SETTINGS / PRIVACY / TERMS - WAPAS LA DIYA */}
            <div className="mt-4 space-y-2">
              <div className="text-[11px] font-black opacity-40 tracking-widest">SETTINGS</div>
              <Link href="/settings" className="block py-2.5 px-4 rounded-full bg-[#F6F1E6] border text-[12px] font-bold hover:bg-white transition">🔐 Settings & Privacy</Link>
              <Link href="/settings/privacy" className="block py-2.5 px-4 rounded-full bg-[#F6F1E6] border text-[12px] font-bold hover:bg-white transition">🛡️ Privacy Settings</Link>
              <Link href="/terms" className="block py-2.5 px-4 rounded-full bg-[#F6F1E6] border text-[12px] font-bold hover:bg-white transition">📜 Terms & Conditions</Link>
              <Link href="/privacy-policy" className="block py-2.5 px-4 rounded-full bg-[#F6F1E6] border text-[12px] font-bold hover:bg-white transition">🔒 Privacy Policy</Link>
              <Link href="/about" className="block py-2.5 px-4 rounded-full bg-[#F6F1E6] border text-[12px] font-bold hover:bg-white transition">ℹ️ About Drisyamn</Link>
              <Link href="/help" className="block py-2.5 px-4 rounded-full bg-[#F6F1E6] border text-[12px] font-bold hover:bg-white transition">❓ Help & Support</Link>
              <button onClick={()=>{ localStorage.clear(); alert("Logged out"); router.push("/"); }} className="w-full text-left py-2.5 px-4 rounded-full bg-red-50 border border-red-200 text-red-600 text-[12px] font-bold hover:bg-red-100 transition">🚪 Logout</button>
            </div>

            <div className="mt-4 pt-4 border-t"><div className="text-[11px] font-black opacity-40">HASHTAGS</div><div className="flex flex-wrap gap-2 mt-2">{["#siliguri","#matigara","#food","#fashion"].map(h=><button key={h} onClick={()=>setSearch(h)} className="px-3 py-1 rounded-full bg-[#F6F1E6] border text-[11px] font-bold hover:bg-white">{h}</button>)}</div></div>
            <div className="mt-4 text-[10px] opacity-40 text-center">© 2026 Drisyamn • Made in Siliguri</div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 space-y-6">
          <div className="rounded-[22px] p-5" style={prettyBox}>
            <div className="flex gap-3"><img src={`https://i.pravatar.cc/100?u=${username}`} className="w-10 h-10 rounded-full border-[3px] border-white shadow" alt="" /><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="What's happening? Photo/Video -> Supabase" className="flex-1 bg-[#F6F1E6] rounded-[16px] p-4 text-[13px] outline-none border min-h-[90px] resize-none" /></div>
            {medias.length>0 && <div className="grid grid-cols-2 gap-2 mt-3">{medias.map((m,i)=>(<div key={i} className="relative">{mediaTypes[i]==="video"? <video src={m} className="w-full h-[200px] object-cover rounded-xl border-2 border-white shadow bg-black" controls /> : <img src={m} className="w-full h-[200px] object-cover rounded-xl border-2 border-white shadow" alt="" />}<button onClick={()=>removeMedia(i)} className="absolute top-1 right-1 bg-black text-white rounded-full w-6 h-6 text-xs grid place-items-center">x</button></div>))}</div>}
            <div className="flex justify-between mt-4">
              <label className="px-5 py-2.5 rounded-full bg-[#F6F1E6] border text-[12px] font-bold cursor-pointer">{uploading? "Uploading...": "📁 Upload"}<input ref={uploadRef} type="file" hidden multiple accept="image/*,video/*" onChange={e=> handleUpload(e.target.files)} /></label>
              <button onClick={handlePost} disabled={uploading} className="px-8 py-2.5 rounded-full text-white text-[12px] font-black border-[3px] border-white shadow disabled:opacity-50" style={{background:DARK}}>{uploading? "Posting..." : "Post to Supabase"}</button>
            </div>
          </div>

          {filtered.slice(0,visible).map((post)=>(
            <div key={post.id} className="rounded-[22px] p-5" style={prettyBox}>
              <div className="flex gap-3 items-center relative">
                <img src={post.avatar} className="w-10 h-10 rounded-full border-[3px] border-white shadow" alt="" />
                <div className="flex-1"><div className="font-bold text-[13px]">@{post.author} <span className="opacity-50 text-[10px]">• {post.category}</span></div><div className="text-[11px] opacity-50">{post.time}</div></div>
                <button onClick={()=>setShowMenu(showMenu===post.id?null:post.id)} className="w-8 h-8 rounded-full bg-[#F6F1E6] grid place-items-center">•••</button>
                {showMenu===post.id && <div className="absolute right-0 top-10 bg-white border rounded-[14px] shadow-xl p-2 z-[60] w-[160px] text-[12px] font-bold">{post.author===username? (<><button onClick={()=>startEdit(post)} className="w-full text-left px-3 py-2 hover:bg-[#F6F1E6] rounded-lg">✏️ Edit</button><button onClick={()=>deletePost(post.id)} className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 rounded-lg">🗑️ Delete</button></>): (<button onClick={()=>{toggleFollow(post.author); setShowMenu(null);}} className="w-full text-left px-3 py-2 hover:bg-[#F6F1E6] rounded-lg">{following.includes(post.author)?"Unfollow":"Follow"}</button>)}<button onClick={()=>sharePost(post)} className="w-full text-left px-3 py-2 hover:bg-[#F6F1E6] rounded-lg">🔗 Share</button></div>}
              </div>
              {editingId===post.id? <div className="mt-4 flex gap-2"><textarea value={editText} onChange={e=>setEditText(e.target.value)} className="flex-1 bg-[#F6F1E6] border rounded-xl p-3 text-[13px]" /><button onClick={saveEdit} className="px-4 py-2 rounded-full bg-black text-white text-xs font-bold">Save</button></div> : <p className="mt-4 text-[14px] whitespace-pre-wrap">{post.text}</p>}
              {post.media && post.media[0] && <div className="mt-4">{post.mediaType?.[0]==="video"? <video src={post.media[0]} className="w-full rounded-[16px] border-[4px] border-white shadow bg-black" controls /> : <img src={post.media[0]} className="w-full rounded-[16px] border-[4px] border-white shadow max-h-[400px] object-cover" alt="" />}</div>}
              <div className="flex gap-5 mt-4 text-[13px] font-bold border-t pt-3">
                <button onClick={()=>toggleLike(post.id)} style={{color:post.liked?ORANGE:DARK}}>{post.liked?"❤️":"🤍"} {post.likes}</button>
                <button className="opacity-60">💬 {post.comments.length}</button>
                <button onClick={()=>toggleSave(post.id)} className="ml-auto opacity-70">{savedIds.includes(post.id)?"🔖 Saved":"🔖 Save"}</button>
              </div>
              <div className="mt-3 flex gap-2"><input value={commentMap[post.id]||""} onChange={e=>setCommentMap({...commentMap,[post.id]:e.target.value})} placeholder="Write a comment..." className="flex-1 bg-[#F6F1E6] rounded-full px-5 py-2.5 text-[12px] outline-none border" /><button onClick={()=>addComment(post.id)} className="px-5 py-2.5 rounded-full text-white text-[11px] font-bold border-[3px] border-white shadow" style={{background:ORANGE}}>Post</button></div>
            </div>
          ))}
          <div ref={loaderRef} className="text-center py-6 opacity-40 text-[12px]">Scroll for more • Supabase Live ✓</div>
        </div>

        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="rounded-[22px] p-5" style={prettyBox}>
            <div className="font-bold text-[13px]">Quick Links</div>
            <div className="mt-3 space-y-2 text-[12px]">
              <Link href="/settings" className="block bg-[#F6F1E6] p-3 rounded-xl border font-bold">🔐 Settings & Privacy</Link>
              <Link href="/terms" className="block bg-[#F6F1E6] p-3 rounded-xl border font-bold">📜 Terms & Conditions</Link>
              <Link href="/privacy-policy" className="block bg-[#F6F1E6] p-3 rounded-xl border font-bold">🔒 Privacy Policy</Link>
              <div className="bg-[#F6F1E6] p-3 rounded-xl border">Total Posts: <b>{posts.length}</b> - Supabase Live</div>
            </div>
          </div>
          <div className="rounded-[22px] p-4" style={prettyBox}>
            <div className="font-bold text-[13px]">Advertisement</div>
            <div className="mt-3 bg-[#1F3A4A] text-white rounded-[14px] p-3 text-center border-[3px] border-white shadow">
              <div className="text-[12px] font-bold">Want to Advertise Here?</div>
              <div className="text-[10px] opacity-70 mt-1">Reach 12k+ people in Siliguri</div>
              <button className="w-full mt-2 py-2 rounded-full bg-white text-black text-[11px] font-bold">Contact • ₹500/day</button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
        <div className="flex justify-around items-center px-2 py-3 rounded-full" style={prettyBox}>
          <button onClick={()=>router.push("/homefeed")} className="px-4 py-2 rounded-full bg-[#1F3A4A] text-white text-[11px] font-bold">Home</button>
          <button onClick={()=>router.push("/settings")} className="px-3 py-2 rounded-full bg-[#F6F1E6] text-[11px] font-bold">⚙️ Settings</button>
          <button onClick={()=>uploadRef.current?.click()} className="px-4 py-2 rounded-full bg-[#F6F1E6] text-[11px] font-bold">📁 Upload</button>
          <button onClick={()=>router.push("/privacy-policy")} className="px-3 py-2 rounded-full bg-[#F6F1E6] text-[11px] font-bold">🔒 Privacy</button>
        </div>
      </div>
    </div>
  );
}