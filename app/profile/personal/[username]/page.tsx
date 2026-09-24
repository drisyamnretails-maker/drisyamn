"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const ORANGE = "#E86A33";
const PURE_BLACK = "#0A0A0A";
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

type Post = {
  id: string; author: string; text: string; media?: string;
  type: "text" | "photo" | "video";
  likes: number; liked: boolean;
  commentsList: { user: string; text: string }[];
  createdAt: number;
};

export default function PersonalProfilePage() {
  const { username } = useParams() as { username: string };
  const router = useRouter();
  const coverRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const postMediaRef = useRef<HTMLInputElement>(null);
  const coverBoxRef = useRef<HTMLDivElement>(null);

  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"Posts" | "About" | "Photos" | "Videos" | "Saved">("Posts");
  const [about, setAbout] = useState({ name: "", username: "", dob: "", gender: "Male", hobby: "", works: "", positions: "", bio: "", joinDate: "" });
  const [cover, setCover] = useState("");
  const [avatar, setAvatar] = useState("");
  const [coverPos, setCoverPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostText, setNewPostText] = useState("");
  const [newPostMedia, setNewPostMedia] = useState("");
  const [newPostFile, setNewPostFile] = useState<File | null>(null);
  const [newPostType, setNewPostType] = useState<"text"|"photo"|"video">("text");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: profile } = await supabase.from('profiles').select('*').eq('username', username).single();
      if (profile) {
        setAbout({ name: profile.display_name || "", username: profile.username, dob: "", gender: "Male", hobby: "", works: profile.bio || "", positions: "", bio: profile.bio || "", joinDate: new Date(profile.created_at).toLocaleDateString() });
        if (profile.avatar_url) setAvatar(profile.avatar_url);
        if (profile.cover_url) setCover(profile.cover_url);
        setIsNew(false);
      } else {
        setIsNew(true);
      }
      const { data: p } = await supabase.from('posts').select('*').eq('user_id', username).order('created_at', {ascending:false});
      if (p) setPosts(p.map((x:any)=>({ id:x.id, author:x.user_id, text:x.title || x.description, media:x.media_url, type:x.media_type, likes:0, liked:false, commentsList:[], createdAt: new Date(x.created_at).getTime() })));
      setLoading(false);
    };
    load();
  }, [username]);

  const handleCreate = async () => {
    if (!about.name.trim()) { alert("Name required"); return; }
    setLoading(true);
    const { error } = await supabase.from('profiles').upsert([{
      username: username,
      display_name: about.name,
      bio: about.bio || about.works,
      avatar_url: avatar,
      cover_url: cover,
      location: about.works
    }], { onConflict: 'username' });
    setLoading(false);
    if(error){ alert(error.message); return; }
    setIsNew(false);
  };

  const handlePostMedia = (file: File) => {
    const isVideo = file.type.startsWith("video");
    setNewPostFile(file);
    setNewPostMedia(URL.createObjectURL(file));
    setNewPostType(isVideo? "video" : "photo");
  };

  const createPost = async () => {
    if(!newPostText.trim() &&!newPostFile) return;
    setUploading(true);
    try {
      let mediaUrl = "";
      if (newPostFile) mediaUrl = await uploadFile('post_media', newPostFile);
      const { data, error } = await supabase.from('posts').insert([{
        user_id: username,
        title: newPostText || (newPostType==="photo"? "Shared a photo 📸" : "Shared a video 🎬"),
        description: newPostText,
        media_url: mediaUrl,
        media_type: newPostType,
        category: 'personal'
      }]).select().single();
      if(error) throw error;
      const newPost: Post = { id: data.id, author: username, text: newPostText, media: mediaUrl, type: newPostType, likes:0, liked:false, commentsList:[], createdAt: Date.now() };
      setPosts([newPost,...posts]);
      setNewPostText(""); setNewPostMedia(""); setNewPostFile(null); setNewPostType("text");
    } catch(e:any){ alert(e.message) }
    setUploading(false);
  };

  const goHome = () => router.push("/homefeed");
  const handleCoverDragStart = () => { if (cover) setIsDragging(true); };
  const handleCoverDragging = (e: any) => {
    if (!isDragging ||!coverBoxRef.current) return;
    const rect = coverBoxRef.current.getBoundingClientRect();
    const clientY = e.touches? e.touches[0].clientY : e.clientY;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setCoverPos(Math.max(0, Math.min(100, y)));
  };
  const handleCoverDragEnd = () => setIsDragging(false);

  const myPosts = useMemo(() => posts.sort((a, b) => b.createdAt - a.createdAt), [posts]);
  const myPhotos = useMemo(() => myPosts.filter((p) => p.type === "photo"), [myPosts]);
  const myVideos = useMemo(() => myPosts.filter((p) => p.type === "video"), [myPosts]);

  if (loading) return <div className="min-h-screen grid place-items-center font-bold" style={{ background: PAGE_BG }}>Loading...</div>;

  if (isNew) {
    return (
      <div className="min-h-[100vh] w-full flex items-start justify-center p-4 pt-6 overflow-y-auto" style={{ background: PAGE_BG }}>
        <input ref={coverRef} type="file" hidden accept="image/*" onChange={async (e) => { const f=e.target.files?.[0]; if(f){ const url=await uploadFile('covers', f); setCover(url); }}} />
        <input ref={avatarRef} type="file" hidden accept="image/*" onChange={async (e) => { const f=e.target.files?.[0]; if(f){ const url=await uploadFile('avatars', f); setAvatar(url); }}} />
        <div className="rounded-[24px] p-6 w-full max-w-[500px] mb-8" style={prettyBox}>
          <h1 className="text-[26px] font-black">Create Personal Profile</h1>
          <p className="text-[12px] opacity-60">/{username}</p>
          <div onClick={() => coverRef.current?.click()} className="h-[180px] bg-[#F6F1E6] rounded-[16px] overflow-hidden relative border-[4px] border-white shadow cursor-pointer mt-5 group">
            {cover? <img src={cover} alt="" className="w-full h-full object-cover" /> : <div className="grid place-items-center h-full text-[13px] font-bold opacity-60">Choose cover photo - Supabase</div>}
          </div>
          <div onClick={() => avatarRef.current?.click()} className="w-24 h-24 -mt-10 ml-6 rounded-full border-[5px] border-white bg-[#F6F1E6] grid place-items-center overflow-hidden cursor-pointer z-10 shadow relative"><span className="text-[11px] font-bold text-center">Choose<br/>photo</span>{avatar && <img src={avatar} alt="" className="absolute inset-0 w-full h-full object-cover" />}</div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <input value={about.name} onChange={(e) => setAbout({...about, name: e.target.value })} placeholder="Full Name *" className="border rounded-[14px] p-3.5 text-[14px] col-span-2 bg-[#F6F1E6]" />
            <input value={about.works} onChange={(e) => setAbout({...about, works: e.target.value })} placeholder="💼 Works at" className="border rounded-[14px] p-3.5 text-[13px] col-span-2 bg-[#F6F1E6]" />
            <textarea value={about.bio} onChange={(e) => setAbout({...about, bio: e.target.value })} placeholder="Bio..." className="border rounded-[14px] p-3.5 text-[13px] col-span-2 bg-[#F6F1E6]" rows={3} />
          </div>
          <button onClick={handleCreate} className="w-full mt-6 text-white rounded-full py-3.5 font-black text-[13px]" style={{ background: ORANGE }}>Create & Save to Supabase →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-3 px-4 pb-24" style={{ background: PAGE_BG }} onMouseMove={handleCoverDragging} onMouseUp={handleCoverDragEnd} onTouchMove={handleCoverDragging} onTouchEnd={handleCoverDragEnd}>
      <input ref={coverRef} type="file" hidden accept="image/*" onChange={async (e) => { const f=e.target.files?.[0]; if(f){ const url=await uploadFile('covers', f); setCover(url); await supabase.from('profiles').update({cover_url:url}).eq('username', username); }}} />
      <input ref={avatarRef} type="file" hidden accept="image/*" onChange={async (e) => { const f=e.target.files?.[0]; if(f){ const url=await uploadFile('avatars', f); setAvatar(url); await supabase.from('profiles').update({avatar_url:url}).eq('username', username); }}} />
      <input ref={postMediaRef} type="file" hidden accept="image/*,video/*" onChange={(e) => e.target.files?.[0] && handlePostMedia(e.target.files[0])} />

      <header className="max-w-[1100px] mx-auto mt-3 rounded-[22px] flex justify-between items-center px-6 h-[60px] sticky top-4 z-20" style={prettyBox}>
        <span onClick={goHome} className="font-black cursor-pointer text-[22px]">Drisyamn<span className="text-[#E86A33]">.</span></span>
        <div className="flex gap-2"><button onClick={() => setIsNew(true)} className="px-4 py-1.5 rounded-full border text-[11px] font-bold bg-[#F6F1E6]">Edit</button><button onClick={goHome} className="text-white px-4 py-1.5 rounded-full text-[11px] font-bold" style={{ background: PURE_BLACK }}>Home</button></div>
      </header>

      <div className="max-w-[1100px] mx-auto grid grid-cols-12 gap-5 mt-6">
        <div className="col-span-12 md:col-span-4">
          <div className="rounded-[20px] overflow-hidden p-2" style={prettyBox}>
            <div ref={coverBoxRef} onMouseDown={handleCoverDragStart} onTouchStart={handleCoverDragStart} className="h-[200px] w-full bg-[#F6F1E6] relative overflow-hidden rounded-[14px] border-[4px] border-white shadow">
              {cover? <img src={cover} alt="" className="w-full h-full object-cover" style={{ objectPosition: `center ${coverPos}%` }} /> : <div className="grid place-items-center h-full text-[12px] font-bold opacity-60">No Cover</div>}
              <button onClick={() => coverRef.current?.click()} className="absolute top-2.5 right-2.5 bg-white text-black text-[10px] px-3 py-1.5 rounded-full font-bold shadow border">Change cover</button>
            </div>
            <div className="p-4">
              <div onClick={()=>avatarRef.current?.click()} className="w-24 h-24 -mt-12 rounded-full border-[4px] border-white bg-white shadow-xl overflow-hidden relative cursor-pointer"><div className="w-full h-full bg-[#F6F1E6] grid place-items-center font-black text-2xl">{about.name?.[0] || username[0].toUpperCase()}</div>{avatar && <img src={avatar} alt="" className="absolute inset-0 w-full h-full object-cover" />}</div>
              <h2 className="font-black mt-3 text-[18px]">{about.name}</h2>
              <p className="text-[11px] opacity-60">@{about.username} • {about.works}</p>
              <p className="text-[13px] mt-2">{about.bio}</p>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-8">
          <div className="rounded-[18px] p-2.5 flex gap-2 overflow-x-auto sticky top-[85px] z-10" style={prettyBox}>
            {["Posts", "About", "Photos", "Videos"].map((t) => (
              <button key={t} onClick={() => setTab(t as any)} className="px-4 py-2 rounded-full text-[11px] font-bold border shrink-0" style={tab === t? { background: PURE_BLACK, color: "white" } : { background: "#F6F1E6" }}>{t} ({t === "Posts"? myPosts.length : t === "Photos"? myPhotos.length : t === "Videos"? myVideos.length : ""})</button>
            ))}
          </div>

          <div className="mt-5 space-y-4">
            {tab === "Posts" && (
              <>
                <div className="rounded-[18px] p-4" style={prettyBox}>
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-black text-white grid place-items-center font-bold text-[13px] shrink-0">{about.name?.[0] || username[0].toUpperCase()}</div>
                    <div className="flex-1">
                      <textarea value={newPostText} onChange={(e)=> setNewPostText(e.target.value)} placeholder={`What's on your mind, ${about.name || username}?`} className="w-full bg-[#F6F1E6] rounded-[14px] p-3 text-[13px] outline-none min-h-[60px] resize-none" />
                      {newPostMedia && (
                        <div className="mt-3 relative">
                          {newPostType==="video"? <video src={newPostMedia} controls className="w-full rounded-[12px] border-2 border-white shadow max-h-[400px]" /> : <img src={newPostMedia} alt="" className="w-full rounded-[12px] border-2 border-white shadow max-h-[400px] object-cover" />}
                          <button onClick={()=> { setNewPostMedia(""); setNewPostFile(null); }} className="absolute top-2 right-2 bg-black text-white w-7 h-7 rounded-full grid place-items-center">✕</button>
                        </div>
                      )}
                      <div className="mt-3 flex justify-between items-center">
                        <div className="flex gap-2">
                          <button onClick={()=> postMediaRef.current?.click()} className="px-3 py-1.5 rounded-full bg-[#F6F1E6] border text-[11px] font-bold">📷 Photo</button>
                          <button onClick={()=> postMediaRef.current?.click()} className="px-3 py-1.5 rounded-full bg-[#F6F1E6] border text-[11px] font-bold">🎬 Video</button>
                        </div>
                        <button onClick={createPost} disabled={uploading || (!newPostText.trim() &&!newPostFile)} className="px-6 py-2 rounded-full bg-black text-white text-[12px] font-bold disabled:opacity-40">{uploading? "Uploading..." : "Post to Supabase"}</button>
                      </div>
                    </div>
                  </div>
                </div>

                {myPosts.length === 0? <div className="rounded-[18px] p-10 text-center opacity-40" style={prettyBox}>No posts yet - Supabase me post karo</div> : myPosts.map((post) => (
                  <div key={post.id} className="rounded-[18px] p-4" style={prettyBox}>
                    <div className="flex gap-2 items-center"><b className="text-[13px]">@{post.author}</b><span className="text-[10px] opacity-40 ml-auto">{new Date(post.createdAt).toLocaleDateString()}</span></div>
                    {post.text && <p className="text-[13px] mt-3">{post.text}</p>}
                    {post.media && (post.type==="video"? <video src={post.media} controls className="mt-3 rounded-[14px] w-full border-2 border-white shadow" /> : <img src={post.media} alt="" className="mt-3 rounded-[14px] w-full border-2 border-white shadow" />)}
                  </div>
                ))}
              </>
            )}
            {tab === "Photos" && <div className="rounded-[18px] p-3" style={prettyBox}><div className="grid grid-cols-3 gap-2">{myPhotos.map(p=> <img key={p.id} src={p.media} alt="" className="rounded-[12px] h-32 w-full object-cover border-2 border-white shadow" />)}</div></div>}
            {tab === "Videos" && <div className="rounded-[18px] p-3" style={prettyBox}><div className="grid grid-cols-2 gap-2">{myVideos.map(p=> <video key={p.id} src={p.media} controls className="rounded-[12px] w-full h-40 object-cover border-2 border-white shadow" />)}</div></div>}
            {tab === "About" && <div className="rounded-[18px] p-5 space-y-2 text-[13px]" style={prettyBox}><p><b>Name:</b> {about.name}</p><p><b>Works:</b> {about.works}</p><p><b>Bio:</b> {about.bio}</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}