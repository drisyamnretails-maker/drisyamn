"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

const safeParse = (k:string,f:any)=>{ try{ const v=localStorage.getItem(k); return v? JSON.parse(v):f; }catch{ return f; } };
const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2,8)}`;

type Reel = {
  id:string; author:string; avatar:string; text:string;
  media:string; likes:number; liked:boolean; comments:{user:string; text:string}[];
  shares:number; time:string; verified?:boolean; song?:string;
};

export default function ReelsPage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [username, setUsername] = useState("drisyamn");
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [uploading, setUploading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement|null)[]>([]);
  const uploadRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{
    setUsername(localStorage.getItem("drisyamn_username")||"drisyamn");
    const all = safeParse("drisyamn_global_posts_v2",[]);
    const onlyReels = all.filter((p:any)=> p.isReel || p.category==="Reels").map((p:any)=>({
      id:p.id, author:p.author, avatar:p.avatar,
      text:p.text || "Check this out 🔥",
      media: p.media?.[0] || p.media,
      likes:p.likes|| Math.floor(Math.random()*5000)+100,
      liked:false, comments:p.comments||[], shares:p.shares||0,
      time:p.time||"Just now", verified: Math.random()>0.5,
      song: `Original Audio • @${p.author}`
    }));
    // Demo reels agar koi nahi hai
    const demo: Reel[] = [
      { id:"d1", author:"riya_singh", avatar:"https://i.pravatar.cc/150?img=5", text:"Siliguri vibes at City Center 😍 #siliguri #fashion", media:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", likes:4231, liked:false, comments:[{user:"aman", text:"Wow location 🔥"}], shares:12, time:"2h ago", verified:true, song:"Siliguri Anthem • DJ Riya" },
      { id:"d2", author:"food_corner", avatar:"https://i.pravatar.cc/150?img=8", text:"Matigara ka best momo 🥟🔥", media:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", likes:8923, liked:false, comments:[{user:"foodie", text:"Kaha pe hai?"}], shares:45, time:"5h ago", verified:false, song:"Food Lover • Food Corner" },
    ];
    setReels(onlyReels.length? onlyReels : demo);
  },[]);

  // Auto play current video, pause others - TikTok logic
  useEffect(()=>{
    videoRefs.current.forEach((v, i)=>{
      if(!v) return;
      if(i===currentIdx){ v.play().catch(()=>{}); } else { v.pause(); }
    });
  },[currentIdx]);

  // Scroll snap logic
  const handleScroll = () => {
    if(!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const height = window.innerHeight;
    const idx = Math.round(scrollTop / height);
    if(idx!==currentIdx) setCurrentIdx(idx);
  };

  const toggleLike = (id:string) => {
    setReels(prev=> prev.map(r=> r.id===id? {...r, liked:!r.liked, likes: r.liked? r.likes-1 : r.likes+1} : r));
  };

  const addComment = () => {
    if(!commentText.trim()) return;
    setReels(prev=> prev.map((r,i)=> i===currentIdx? {...r, comments:[...r.comments, {user:username, text:commentText}]}:r));
    setCommentText("");
  };

  const handleUploadReel = async (files: FileList | null) => {
    if(!files ||!files[0]) return;
    const file = files[0];
    if(!file.type.startsWith("video/")){ alert("Sirf video"); return; }
    if(file.size>100*1024*1024){ alert("100MB se kam"); return; }
    setUploading(true);
    const url = URL.createObjectURL(file);
    const newReel: Reel = {
      id: genId(), author: username, avatar:`https://i.pravatar.cc/100?u=${username}`,
      text: "My new reel 🔥 #reels #siliguri", media: url,
      likes:0, liked:false, comments:[], shares:0, time:"Just now", verified:false, song:`Original Audio • @${username}`
    };
    const all = safeParse("drisyamn_global_posts_v2",[]);
    const updated = [{...newReel, isReel:true, media:[url], mediaType:["video"], category:"Reels", createdAt:Date.now()},...all];
    localStorage.setItem("drisyamn_global_posts_v2", JSON.stringify(updated));
    setReels(prev=> [newReel,...prev]);
    setUploading(false);
    setCurrentIdx(0);
    containerRef.current?.scrollTo({top:0, behavior:"smooth"});
  };

  const currentReel = reels[currentIdx];

  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative">
      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/70 to-transparent">
        <Link href="/homefeed" className="text-white font-black text-[20px]">Drisyamn<span className="text-[#E86A33]">.</span> <span className="text-[12px] font-bold opacity-70 ml-2">Reels</span></Link>
        <div className="flex gap-2">
          <label className="px-4 py-2 rounded-full bg-white text-black text-[11px] font-bold cursor-pointer">
            {uploading? "Uploading...": "+ Reel"}
            <input ref={uploadRef} type="file" hidden accept="video/*,.mp4,.mov" onChange={e=>handleUploadReel(e.target.files)} />
          </label>
          <Link href="/homefeed" className="w-9 h-9 rounded-full bg-white/20 backdrop-blur text-white grid place-items-center">✕</Link>
        </div>
      </div>

      {/* REELS CONTAINER - SNAP SCROLL */}
      <div ref={containerRef} onScroll={handleScroll} className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        {reels.map((reel, idx)=>(
          <div key={reel.id} className="h-screen w-screen snap-start relative flex items-center justify-center bg-black">
            <video
              ref={el=>{ videoRefs.current[idx]=el; }}
              src={reel.media}
              className="h-full w-full lg:w-[400px] object-cover"
              loop playsInline muted={idx!==currentIdx}
              onClick={e=>{ const v=e.currentTarget; v.paused? v.play() : v.pause(); }}
              preload="metadata"
            />

            {/* Bottom Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

            {/* Right Actions - Insta style */}
            <div className="absolute right-3 bottom-28 flex flex-col gap-6 items-center z-20">
              <button onClick={()=>toggleLike(reel.id)} className="flex flex-col items-center gap-1">
                <div className={`w-12 h-12 rounded-full grid place-items-center backdrop-blur border border-white/20 ${reel.liked? "bg-[#E86A33] text-white" : "bg-white/20 text-white"}`}>
                  <span className="text-[22px]">{reel.liked? "❤️":"🤍"}</span>
                </div>
                <span className="text-white text-[12px] font-bold drop-shadow">{reel.likes>1000? `${(reel.likes/1000).toFixed(1)}K` : reel.likes}</span>
              </button>

              <button onClick={()=>setShowComments(true)} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur border border-white/20 grid place-items-center text-white text-[20px]">💬</div>
                <span className="text-white text-[12px] font-bold drop-shadow">{reel.comments.length}</span>
              </button>

              <button className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur border border-white/20 grid place-items-center text-white text-[18px]">↗️</div>
                <span className="text-white text-[12px] font-bold drop-shadow">{reel.shares}</span>
              </button>

              <button className="flex flex-col items-center gap-1 mt-2">
                <img src={reel.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-lg" alt="" />
                <span className="w-5 h-5 rounded-full bg-[#E86A33] text-white text-[12px] grid place-items-center -mt-3 border-2 border-black">+</span>
              </button>

              <div className="w-12 h-12 rounded-[12px] bg-white/20 backdrop-blur border border-white/20 grid place-items-center animate-spin" style={{animationDuration:"3s"}}>
                <div className="w-7 h-7 rounded-full bg-black border border-white/30 grid place-items-center text-[10px]">🎵</div>
              </div>
            </div>

            {/* Left Bottom Info - Insta style */}
            <div className="absolute left-3 bottom-6 right-20 z-20 text-white">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[15px]">@{reel.author}</span>
                {reel.verified && <span className="bg-[#0095F6] text-white text-[10px] w-4 h-4 rounded-full grid place-items-center">✓</span>}
                <button className="ml-2 px-3 py-1 rounded-full border border-white text-[11px] font-bold">Follow</button>
              </div>
              <p className="mt-2 text-[13px] leading-[18px] line-clamp-2 drop-shadow">{reel.text}</p>
              <div className="mt-2 flex items-center gap-2 text-[12px] opacity-90">
                <span>🎵</span>
                <span className="truncate">{reel.song}</span>
                <span className="opacity-60">• {reel.time}</span>
              </div>
              {/* Progress bar */}
              <div className="mt-3 w-full h-[3px] bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white w-[35%] rounded-full"></div>
              </div>
            </div>

            {/* Double tap heart animation placeholder */}
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <span className="text-[100px] opacity-0">❤️</span>
            </div>
          </div>
        ))}
      </div>

      {/* Comments Sheet - Insta style */}
      {showComments && currentReel && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setShowComments(false)}></div>
          <div className="relative bg-[#121212] rounded-t-[20px] max-h-[60vh] flex flex-col border-t border-white/10">
            <div className="p-4 flex justify-between items-center border-b border-white/10">
              <span className="text-white font-bold text-[14px]">{currentReel.comments.length} Comments</span>
              <button onClick={()=>setShowComments(false)} className="text-white/60">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentReel.comments.length===0? <div className="text-white/40 text-[13px] text-center py-10">No comments yet. Be first! 👇</div> :
                currentReel.comments.map((c,i)=>(
                  <div key={i} className="flex gap-3">
                    <img src={`https://i.pravatar.cc/100?u=${c.user}`} className="w-8 h-8 rounded-full" alt="" />
                    <div><span className="text-white font-bold text-[12px]">@{c.user}</span><span className="text-white/80 text-[12px] ml-2">{c.text}</span></div>
                  </div>
                ))
              }
            </div>
            <div className="p-3 flex gap-2 border-t border-white/10 bg-black">
              <img src={`https://i.pravatar.cc/100?u=${username}`} className="w-8 h-8 rounded-full" alt="" />
              <input value={commentText} onChange={e=>setCommentText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addComment()} placeholder={`Add comment as @${username}...`} className="flex-1 bg-white/10 rounded-full px-4 py-2 text-[12px] text-white outline-none" />
              <button onClick={addComment} className="text-[#0095F6] font-bold text-[13px]">Post</button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop - Side preview dots */}
      <div className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 flex-col gap-2 z-20">
        {reels.map((_,i)=>(
          <button key={i} onClick={()=>{ setCurrentIdx(i); containerRef.current?.scrollTo({top:i*window.innerHeight, behavior:"smooth"}); }} className={`w-1.5 transition-all ${i===currentIdx? "h-8 bg-white" : "h-1.5 bg-white/40"} rounded-full`}></button>
        ))}
      </div>

      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none; scrollbar-width:none}`}</style>
    </div>
  );
}