"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const C = {
  bg: "#EDE6D3",
  card: "#FFFEFB",
  soft: "#F6F1E6",
  orange: "#E86A33",
  black: "#121212",
};

export default function PersonalPage(){
  const { username } = useParams() as {username: string};
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [myId, setMyId] = useState("");
  const [status, setStatus] = useState("none");
  const [tab, setTab] = useState("posts");
  const [showFriends, setShowFriends] = useState(false);

  useEffect(()=>{ load(); }, [username]);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if(user) setMyId(user.id);

    // 1. Profile
    const { data: prof } = await supabase.from("profiles").select("*").eq("username", username).single();
    if(!prof) return;
    setProfile(prof);

    // 2. Posts - HOMEFEED WALA HI - Yahi main point
    const { data: postData } = await supabase.from("posts").select("*")
     .eq("user_id", prof.id).order("created_at", {ascending:false});
    setPosts(postData || []);

    // 3. Friends + Status
    if(user){
      const res = await fetch(`/api/friends/action?userId=${prof.id}&myId=${user.id}`);
      const j = await res.json();
      setFriends(j.friends || []);
      setStatus(j.status);
    }
  };

  const handleFriend = async (action: string) => {
    await fetch("/api/friends/action",{method:"POST", body: JSON.stringify({ action, myId, otherId: profile.id })});
    if(action==="request") setStatus("requested");
    if(action==="accept") setStatus("friends");
    if(action==="cancel"||action==="reject"||action==="unfriend") setStatus("none");
    load();
  };

  if(!profile) return <div style={{background:C.bg}} className="min-h-screen p-10 font-black">LOADING...</div>;
  const isOwn = myId === profile.id;

  return (
    <div className="min-h-screen flex justify-center p-3" style={{background:C.bg}}>
      <div className="w-full max-w-[440px] rounded-[32px] overflow-hidden shadow-[0_0_0_12px_white]" style={{background:C.card}}>
        {/* COVER */}
        <div className="h-[168px] w-full relative" style={{background:`linear-gradient(135deg, ${C.soft}, #fff)`}}>
          <div className="absolute -bottom-6 left-6 w-[96px] h-[96px] rounded-[28px] border-[5px] border-white bg-white shadow-xl" style={{background:C.soft}} />
        </div>

        {/* INFO */}
        <div className="px-6 pt-10 pb-6">
          <h1 className="text-[26px] font-black tracking-[-0.03em] leading-none" style={{color:C.black}}>{profile.full_name || profile.username}</h1>
          <p className="text-[12px] font-bold tracking-widest opacity-50 mt-1">@{profile.username?.toUpperCase()} • SILIGURI</p>
          <p className="mt-3 text-[14px] leading-[1.4] font-medium opacity-80">{profile.bio || "Drisyamn creator. Living the vibe."}</p>

          {/* STATS - Tera 7cr wala box style */}
          <div className="mt-5 grid grid-cols-4 gap-2">
            <div className="rounded-[16px] h-[64px] flex flex-col items-center justify-center" style={{background:C.black, color:"white"}}><b className="text-[16px]">{posts.length}</b><span className="text-[9px] font-black tracking-widest">POSTS</span></div>
            <div className="rounded-[16px] h-[64px] flex flex-col items-center justify-center" style={{background:C.soft}}><b className="text-[16px]">{profile.followers_count || "12k"}</b><span className="text-[9px] font-black tracking-widest opacity-60">FOLLOWERS</span></div>
            <div className="rounded-[16px] h-[64px] flex flex-col items-center justify-center" style={{background:C.soft}}><b className="text-[16px]">{profile.following_count || "340"}</b><span className="text-[9px] font-black tracking-widest opacity-60">FOLLOWING</span></div>
            <button onClick={()=>setShowFriends(true)} className="rounded-[16px] h-[64px] flex flex-col items-center justify-center border" style={{background:C.soft}}><b className="text-[16px]">{friends.length}</b><span className="text-[9px] font-black tracking-widest opacity-60">FRIENDS →</span></button>
          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex gap-2">
            {isOwn? (
              <>
                <button className="flex-1 h-[48px] rounded-full font-black text-[13px] tracking-widest text-white" style={{background:C.black}}>EDIT PROFILE</button>
                <button className="w-[48px] h-[48px] rounded-full font-black" style={{background:C.soft}}>↗</button>
              </>
            ) : status==="none"? (
              <>
                <button onClick={()=>handleFriend("request")} className="flex-1 h-[48px] rounded-full font-black text-[13px] tracking-widest text-white" style={{background:C.orange}}>+ ADD FRIEND</button>
                <button className="flex-1 h-[48px] rounded-full font-black text-[13px] tracking-widest" style={{background:C.soft}}>FOLLOW</button>
              </>
            ) : status==="requested"? (
              <button onClick={()=>handleFriend("cancel")} className="flex-1 h-[48px] rounded-full font-black text-[13px]" style={{background:C.soft}}>REQUESTED • TAP TO CANCEL</button>
            ) : status==="incoming"? (
              <>
                <button onClick={()=>handleFriend("accept")} className="flex-1 h-[48px] rounded-full font-black text-white" style={{background:C.orange}}>ACCEPT</button>
                <button onClick={()=>handleFriend("reject")} className="flex-1 h-[48px] rounded-full font-black" style={{background:C.soft}}>REJECT</button>
              </>
            ) : (
              <>
                <button onClick={()=>handleFriend("unfriend")} className="flex-1 h-[48px] rounded-full font-black text-white text-[13px]" style={{background:C.black}}>FRIENDS ✓</button>
                <button className="flex-1 h-[48px] rounded-full font-black text-white text-[13px]" style={{background:C.orange}}>MESSAGE</button>
              </>
            )}
          </div>

          {/* TABS */}
          <div className="mt-8 p-1 rounded-full flex" style={{background:C.soft}}>
            {["posts","friends","about"].map(t=>(
              <button key={t} onClick={()=>setTab(t)} className={`flex-1 h-[36px] rounded-full text-[11px] font-black tracking-widest ${tab===t?"text-white":"opacity-40"}`} style={{background: tab===t?C.black:"transparent"}}>{t.toUpperCase()}</button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="px-3 pb-6 min-h-[320px]">
          {tab==="posts" && (
            <div className="grid grid-cols-2 gap-2">
              {posts.map((p:any)=>(
                <div key={p.id} className="aspect-[4/5] rounded-[20px] overflow-hidden relative" style={{background:C.soft}}>
                  {p.image_url? <img src={p.image_url} className="w-full h-full object-cover"/> : <div className="p-4 text-[12px] font-bold">{p.caption}</div>}
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] font-black">
                    <span className="px-2 py-1 rounded-full bg-white/90">♥ {p.likes || 0}</span>
                    <span className="px-2 py-1 rounded-full bg-white/90">💬 {p.comments || 0}</span>
                  </div>
                </div>
              ))}
              {posts.length===0 && <div className="col-span-2 py-20 text-center opacity-30 font-black text-[12px] tracking-widest">NO POSTS YET<br/>HOMEFEED PE POST DALO, YAHI DIKHEGA</div>}
            </div>
          )}

          {tab==="friends" && (
            <div className="space-y-2">
              {friends.map((_:any,i:number)=>(<div key={i} className="h-[56px] rounded-[16px] px-4 flex items-center justify-between" style={{background:C.soft}}><div className="flex gap-3 items-center"><div className="w-8 h-8 rounded-full bg-white"/><span className="font-bold text-[13px]">Friend {i+1}</span></div><span>→</span></div>))}
              {friends.length===0 && <p className="text-center py-10 opacity-30 font-black text-[12px]">NO FRIENDS YET</p>}
            </div>
          )}

          {tab==="about" && (
            <div className="rounded-[20px] p-5 space-y-3" style={{background:C.soft}}>
              <p className="text-[13px] font-medium"><b className="font-black">BIO:</b> {profile.bio}</p>
              <p className="text-[13px] font-medium"><b className="font-black">LOCATION:</b> Siliguri, West Bengal</p>
              <p className="text-[13px] font-medium"><b className="font-black">JOINED:</b> {new Date(profile.created_at).toDateString()}</p>
            </div>
          )}
        </div>
      </div>

      {/* FRIENDS MODAL */}
      {showFriends && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-end justify-center p-3">
          <div className="w-full max-w-[440px] rounded-[28px] bg-white max-h-[70vh] overflow-hidden">
            <div className="p-5 flex justify-between items-center border-b"><b className="font-black tracking-widest">FRIENDS {friends.length}</b><button onClick={()=>setShowFriends(false)} className="w-9 h-9 rounded-full" style={{background:C.soft}}>✕</button></div>
            <div className="p-3 space-y-2 overflow-auto">{friends.map((_:any,i:number)=>(<div key={i} className="flex gap-3 p-3 rounded-xl" style={{background:C.soft}}><div className="w-10 h-10 rounded-full bg-white"/><div><p className="font-black text-[13px]">Friend {i+1}</p><p className="text-[11px] opacity-50">@username</p></div></div>))}</div>
          </div>
        </div>
      )}
    </div>
  )
}