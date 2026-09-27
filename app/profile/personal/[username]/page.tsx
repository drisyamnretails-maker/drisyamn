"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// THEME CONSTANTS - DO NOT DELETE
const ORANGE = "#E86A33";
const PAGE_BG = "#EDE6D3";
const PURE_BLACK = "#0A0A0A";
const LABEL_BLACK = "#0F1A3A";
const INPUT_BG = "#F6F1E6";
const CARD_BG = "#FFFEFB";
const BORDER_LIGHT = "rgba(0,0,0,0.06)";
const BORDER_MEDIUM = "rgba(0,0,0,0.1)";

export default function PersonalProfilePage() {
  const { username } = useParams() as { username: string };
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CORE STATES
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [followersCount, setFollowersCount] = useState(1248);
  const [isScrolled, setIsScrolled] = useState(false);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  // EDIT FORM STATE
  const [editForm, setEditForm] = useState({
    displayName: "",
    bio: "",
    location: "",
    website: "",
  });

  // FETCH PROFILE FROM SUPABASE
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();
        if (data) {
          setProfile(data);
          setEditForm({
            displayName: data.full_name || "",
            bio: data.bio || "",
            location: data.location || "",
            website: data.website || "",
          });
          setFollowersCount(data.followers_count || 1248);
        } else {
          // FALLBACK MOCK IF NOT FOUND
          setProfile({
            full_name: username,
            username: username,
            bio: "Writer | Explorer | Siliguri ❤️ | Building Drisyam",
            location: "Siliguri, West Bengal",
            dob: "1998-05-12",
            website: "drisyam.app",
            interests: ["Shopping", "Travel", "Food", "Fashion", "Tech", "Music"],
            avatar_url: null,
            cover_url: null,
            followers_count: 1248,
            following_count: 320,
            posts_count: 42,
            verified: true,
            joined: "Jan 2026",
          });
        }
      } catch (e) {
        console.log("fetch error", e);
      }
      setLoading(false);
    };
    if (username) fetchProfile();
  }, [username]);

  // SCROLL LISTENER
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // HELPERS
  const toggleLike = (id: number) => {
    setLikedPosts((prev) =>
      prev.includes(id)? prev.filter((x) => x!== id) : [...prev, id]
    );
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowersCount((c) => (isFollowing? c - 1 : c + 1));
  };

  const handleShare = () => {
    setShowShare(true);
    setTimeout(() => setShowShare(false), 2500);
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({
          full_name: editForm.displayName,
          bio: editForm.bio,
          location: editForm.location,
          website: editForm.website,
        }).eq("id", user.id);
        setProfile({...profile, full_name: editForm.displayName, bio: editForm.bio, location: editForm.location, website: editForm.website });
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
    setShowEdit(false);
  };

  // LOADING SCREEN
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ background: PAGE_BG }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-[3px] border-black/10 border-t-[#E86A33] animate-spin" />
          <p className="font-black tracking-[0.25em] text-[11px] opacity-60" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>LOADING @{username?.toUpperCase()}</p>
        </div>
      </div>
    );
  }

  // STATS ARRAY
  const stats = [
    { label: "POSTS", value: profile?.posts_count || "42", icon: "📸" },
    { label: "FOLLOWERS", value: followersCount.toLocaleString(), icon: "👥" },
    { label: "FOLLOWING", value: profile?.following_count || "320", icon: "💫" },
  ];

  const mockPosts = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    likes: Math.floor(Math.random() * 100) + 5,
    color: i % 4 === 0? "#F6F1E6" : i % 4 === 1? "#EDE6D3" : i % 4 === 2? "#FFFEFB" : "#F2E8CF",
    type: i % 3 === 0? "image" : i % 3 === 1? "video" : "text",
  }));

  const highlights = [
    { id: 1, label: "Travel", emoji: "✈️" },
    { id: 2, label: "Food", emoji: "🍜" },
    { id: 3, label: "Work", emoji: "💼" },
    { id: 4, label: "Music", emoji: "🎵" },
    { id: 5, label: "New", emoji: "➕" },
  ];

  return (
    <div className="min-h-screen w-full flex justify-center" style={{ background: PAGE_BG, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* SHARE TOAST */}
      {showShare && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-5 h-10 rounded-full bg-black text-white flex items-center gap-2 text-[12px] font-bold shadow-2xl animate-bounce">
          <span>🔗</span> Link copied: drisyam.app/{username}
        </div>
      )}

      {/* EDIT MODAL */}
      {showEdit && (
        <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="w-full max-w-[440px] bg-white rounded-t-[24px] md:rounded-[24px] p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-black" style={{ fontFamily: "'Fraunces', serif" }}>Edit Profile</h2>
              <button onClick={() => setShowEdit(false)} className="w-8 h-8 rounded-full bg-[#F6F1E6] flex items-center justify-center">✕</button>
            </div>
            <label className="text-[11px] font-black tracking-widest opacity-50">DISPLAY NAME</label>
            <input value={editForm.displayName} onChange={(e) => setEditForm({...editForm, displayName: e.target.value })} className="mt-2 w-full h-[48px] px-4 rounded-[14px] border bg-[#F6F1E6] outline-none text-[14px] font-semibold" />
            <label className="mt-4 block text-[11px] font-black tracking-widest opacity-50">BIO</label>
            <textarea value={editForm.bio} onChange={(e) => setEditForm({...editForm, bio: e.target.value })} rows={3} className="mt-2 w-full px-4 py-3 rounded-[14px] border bg-[#F6F1E6] outline-none text-[13px] font-medium resize-none" />
            <label className="mt-4 block text-[11px] font-black tracking-widest opacity-50">LOCATION</label>
            <input value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value })} className="mt-2 w-full h-[48px] px-4 rounded-[14px] border bg-[#F6F1E6] outline-none text-[14px] font-semibold" />
            <label className="mt-4 block text-[11px] font-black tracking-widest opacity-50">WEBSITE</label>
            <input value={editForm.website} onChange={(e) => setEditForm({...editForm, website: e.target.value })} className="mt-2 w-full h-[48px] px-4 rounded-[14px] border bg-[#F6F1E6] outline-none text-[14px] font-semibold" />
            <button onClick={handleSaveEdit} className="mt-6 w-full h-[48px] rounded-full text-white font-black text-[12px] tracking-widest" style={{ background: ORANGE }}>SAVE CHANGES</button>
          </div>
        </div>
      )}

      <div className="w-full max-w-[480px] bg-[#FFFEFB] min-h-screen md:min-h-[90vh] md:mt-6 md:rounded-[28px] overflow-hidden border border-black/[0.05] shadow-[0_0_0_8px_#fff,0_0_0_9px_rgba(0,0,0,0.05),0_25px_60px_rgba(0,0,0,0.15)] flex flex-col relative">

        {/* STICKY HEADER */}
        <div className={`h-[56px] w-full flex items-center justify-between px-5 backdrop-blur sticky top-0 z-20 border-b transition-all ${isScrolled? "bg-white/90 shadow-sm" : "bg-white/80 border-black/[0.05]"}`}>
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-[#F6F1E6] flex items-center justify-center active:scale-95 transition-transform font-bold">←</button>
          <div className="flex flex-col items-center">
            <p className="font-black tracking-[0.15em] text-[12px]" style={{ fontFamily: "'Space Grotesk', sans-serif", color: LABEL_BLACK }}>@{username?.toUpperCase()}</p>
            {isScrolled && <p className="text-[10px] font-bold opacity-60 -mt-1">{profile.full_name}</p>}
          </div>
          <button onClick={handleShare} className="w-9 h-9 rounded-full bg-[#F6F1E6] flex items-center justify-center active:scale-95 transition-transform font-bold">↗</button>
        </div>

        {/* COVER SECTION */}
        <div className="w-full h-[210px] bg-[#F6F1E6] relative overflow-hidden">
          {profile.cover_url? (
            <img src={profile.cover_url} className="w-full h-full object-cover" alt="cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#F6F1E6] via-[#EDE6D3] to-[#E86A33]/20 flex items-center justify-center">
              <div className="text-center opacity-20">
                <p className="text-[32px]">🖼️</p>
                <p className="text-[10px] font-black tracking-[0.2em] mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>COVER PHOTO</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center">
            <div className="px-3 h-7 rounded-full bg-black/50 backdrop-blur text-white text-[10px] font-bold flex items-center gap-1">● LIVE</div>
            <div className="px-3 h-7 rounded-full bg-white/90 backdrop-blur text-black text-[10px] font-black">📍 SILIGURI</div>
          </div>
        </div>

        {/* PROFILE HEAD */}
        <div className="px-6 relative pb-2">
          <div className="flex items-end justify-between -mt-[48px] relative z-10">
            <div className="w-[96px] h-[96px] rounded-full bg-white border-[5px] border-white shadow-[0_12px_24px_rgba(0,0,0,0.18)] overflow-hidden relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {profile.avatar_url? (
                <img src={profile.avatar_url} className="w-full h-full object-cover" alt="avatar" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[38px] bg-[#F6F1E6]">👤</div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <span className="text-[10px] font-bold bg-black text-white px-2 py-1 rounded-full">EDIT</span>
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <button onClick={handleFollow} className="px-6 h-[38px] rounded-full text-[11px] font-black tracking-[0.12em] active:scale-95 transition-all shadow-sm" style={{ background: isFollowing? "#F6F1E6" : ORANGE, color: isFollowing? PURE_BLACK : "#fff", border: isFollowing? "1px solid rgba(0,0,0,0.08)" : "none", fontFamily: "'Space Grotesk', sans-serif" }}>{isFollowing? "FOLLOWING ✓" : "FOLLOW +"}</button>
              <button onClick={() => setShowEdit(true)} className="px-5 h-[38px] rounded-full bg-[#F6F1E6] border border-black/[0.08] text-[11px] font-black tracking-[0.1em] active:scale-95 transition-all" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>EDIT</button>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-2">
              <h1 className="font-black leading-[0.9] tracking-tight" style={{ fontSize: "26px", fontFamily: "'Fraunces', serif", fontStyle: "italic", color: PURE_BLACK }}>{profile.full_name}</h1>
              {profile.verified && <span className="w-5 h-5 rounded-full bg-[#1D9BF0] text-white flex items-center justify-center text-[12px]">✓</span>}
            </div>
            <p className="mt-2 text-[13.5px] leading-[1.5] font-medium text-[#444]">{profile.bio}</p>
          </div>

          {/* STATS */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="h-[72px] rounded-[18px] bg-[#F6F1E6] border border-black/[0.04] flex flex-col items-center justify-center hover:bg-[#EDE6D3] transition-colors cursor-pointer group">
                <p className="text-[13px] group-hover:scale-110 transition-transform">{s.icon}</p>
                <p className="font-black text-[16px] mt-1" style={{ color: PURE_BLACK, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
                <p className="text-[9px] font-black tracking-[0.16em] opacity-50" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* META PILLS */}
          <div className="mt-5 flex flex-wrap gap-2">
            {profile.location && <div className="px-3.5 h-[30px] rounded-full bg-white border border-black/10 flex items-center gap-1.5 text-[11px] font-bold shadow-sm"><span>📍</span>{profile.location}</div>}
            {profile.dob && <div className="px-3.5 h-[30px] rounded-full bg-white border border-black/10 flex items-center gap-1.5 text-[11px] font-bold shadow-sm"><span>🎂</span>{profile.dob}</div>}
            <div className="px-3.5 h-[30px] rounded-full bg-white border border-black/10 flex items-center gap-1.5 text-[11px] font-bold shadow-sm"><span>🔗</span>drisyam.app/{username}</div>
            <div className="px-3.5 h-[30px] rounded-full bg-white border border-black/10 flex items-center gap-1.5 text-[11px] font-bold shadow-sm"><span>📅</span>Joined {profile.joined || "Jan 2026"}</div>
          </div>

          {/* HIGHLIGHTS */}
          <div className="mt-6 flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {highlights.map((h) => (
              <div key={h.id} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer">
                <div className="w-[60px] h-[60px] rounded-full bg-[#F6F1E6] border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center text-[22px] hover:scale-105 transition-transform" style={{ borderColor: h.label === "New"? ORANGE : "white" }}>{h.emoji}</div>
                <p className="text-[10px] font-bold tracking-wide opacity-70">{h.label}</p>
              </div>
            ))}
          </div>

          {/* INTERESTS */}
          <div className="mt-6">
            <h3 className="font-black tracking-[0.18em] text-[10px] opacity-40 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>INTERESTS & TAGS <span className="w-6 h-[1px] bg-black/10" /></h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {(profile.interests && profile.interests.length > 0? profile.interests : ["Shopping", "Travel", "Music", "Tech", "Food", "Fashion"]).map((tag: string, idx: number) => (
                <span key={tag} className="px-4 h-[36px] rounded-full flex items-center text-[11px] font-black border hover:scale-105 transition-transform cursor-pointer shadow-sm" style={{ background: idx === 0? ORANGE : idx === 1? PURE_BLACK : "#F6F1E6", color: idx === 0 || idx === 1? "#fff" : "#111827", borderColor: idx === 0? ORANGE : idx === 1? PURE_BLACK : "rgba(0,0,0,0.08)", fontFamily: "'Space Grotesk', sans-serif" }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* ABOUT CARD */}
          <div className="mt-6 p-5 rounded-[20px] bg-gradient-to-br from-[#F6F1E6]/80 to-[#EDE6D3]/60 border border-black/[0.04]">
            <h4 className="font-black text-[11px] tracking-[0.15em] opacity-50 flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>ABOUT THIS PROFILE <span className="ml-auto text-[14px]">✦</span></h4>
            <p className="mt-3 text-[12.5px] leading-[1.7] font-medium text-[#444]">Living in {profile.location || "Siliguri, West Bengal"}. Passionate about creating content and exploring new places. Joined Drisyam community in 2026. Love to connect with like-minded people from North Bengal and beyond. Currently working on personal projects.</p>
            <div className="mt-4 flex gap-2 flex-wrap">
              <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-white border shadow-sm">✦ Verified Profile</span>
              <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-white border shadow-sm">✦ Personal Account</span>
              <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-white border shadow-sm">✦ Siliguri 📍</span>
            </div>
          </div>
        </div>

        {/* TABS HEADER */}
        <div className="mt-8 px-2 flex gap-2 border-b border-black/[0.06] sticky top-[56px] bg-[#FFFEFB]/90 backdrop-blur z-10">
          {[
            { id: "posts", label: "POSTS", count: "12" },
            { id: "media", label: "MEDIA", count: "8" },
            { id: "likes", label: "LIKES", count: "124" },
            { id: "about", label: "ABOUT", count: "" },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="flex-1 h-[46px] font-black text-[11px] tracking-[0.14em] border-b-[2.5px] transition-all flex items-center justify-center gap-1" style={{ fontFamily: "'Space Grotesk', sans-serif", borderColor: activeTab === tab.id? ORANGE : "transparent", color: activeTab === tab.id? PURE_BLACK : "#999" }}>{tab.label} {tab.count && <span className="text-[10px] opacity-50">({tab.count})</span>}</button>
          ))}
        </div>

        {/* POSTS GRID */}
        <div className="p-[3px] bg-white">
          {activeTab === "posts" && (
            <div className="grid grid-cols-3 gap-[3px]">
              {mockPosts.map((p) => (
                <div key={p.id} className="aspect-square rounded-[14px] overflow-hidden relative group cursor-pointer bg-[#F6F1E6] border border-black/[0.03]" style={{ background: p.color }} onClick={() => toggleLike(p.id)}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-40 group-hover:opacity-80 transition-opacity">
                    <span className="text-[22px]">{p.type === "video"? "▶️" : p.type === "text"? "📝" : "🖼️"}</span>
                    <span className="text-[9px] font-black tracking-widest">{p.type.toUpperCase()}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex justify-between items-center">
                    <span className="text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-full flex items-center gap-1">❤️ {p.likes + (likedPosts.includes(p.id)? 1 : 0)}</span>
                    {likedPosts.includes(p.id) && <span className="text-[10px]">🔥</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === "media" && (
            <div className="h-[240px] flex flex-col items-center justify-center gap-3 opacity-40 p-6 text-center">
              <span className="text-[32px]">🎬</span>
              <p className="text-[12px] font-black tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>NO MEDIA YET</p>
              <p className="text-[11px] font-medium max-w-[200px] leading-[1.4]">Videos and photos will appear here when {username} posts them</p>
            </div>
          )}
          {activeTab === "likes" && (
            <div className="h-[240px] flex flex-col items-center justify-center gap-3 opacity-40 p-6 text-center">
              <span className="text-[32px]">❤️</span>
              <p className="text-[12px] font-black tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>124 LIKES PRIVATE</p>
              <p className="text-[11px] font-medium">Likes are hidden for privacy</p>
            </div>
          )}
          {activeTab === "about" && (
            <div className="p-5 space-y-4">
              <div className="flex justify-between py-3 border-b border-black/5"><span className="text-[12px] font-bold opacity-50">Username</span><span className="text-[12px] font-black">@{username}</span></div>
              <div className="flex justify-between py-3 border-b border-black/5"><span className="text-[12px] font-bold opacity-50">Full Name</span><span className="text-[12px] font-black">{profile.full_name}</span></div>
              <div className="flex justify-between py-3 border-b border-black/5"><span className="text-[12px] font-bold opacity-50">Location</span><span className="text-[12px] font-black">{profile.location}</span></div>
              <div className="flex justify-between py-3 border-b border-black/5"><span className="text-[12px] font-bold opacity-50">Joined</span><span className="text-[12px] font-black">{profile.joined || "Jan 2026"}</span></div>
              <div className="flex justify-between py-3"><span className="text-[12px] font-bold opacity-50">Account Type</span><span className="text-[12px] font-black">Personal • Verified</span></div>
            </div>
          )}
        </div>

        {/* ACTION BAR */}
        <div className="mt-2 p-4 flex gap-3 border-t border-black/[0.06] bg-[#FFFEFB] sticky bottom-0">
          <button onClick={handleFollow} className="flex-1 h-[48px] rounded-full text-white text-[12px] font-black tracking-[0.12em] active:scale-[0.98] transition-all shadow-[0_8px_20px_rgba(232,106,51,0.3)]" style={{ background: isFollowing? PURE_BLACK : ORANGE, fontFamily: "'Space Grotesk', sans-serif" }}>{isFollowing? "FOLLOWING ✓" : "FOLLOW USER"}</button>
          <button className="w-[48px] h-[48px] rounded-full bg-[#F6F1E6] border border-black/10 flex items-center justify-center active:scale-95 transition-transform">💬</button>
          <button onClick={handleShare} className="w-[48px] h-[48px] rounded-full bg-[#F6F1E6] border border-black/10 flex items-center justify-center active:scale-95 transition-transform">↗</button>
        </div>

        {/* FOOTER */}
        <div className="p-6 text-center bg-[#F6F1E6]/30">
          <p className="text-[10px] font-black tracking-[0.2em] opacity-20" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>DRISYAM • SILIGURI • WEST BENGAL • 2026 • @{username?.toUpperCase()}</p>
          <p className="mt-2 text-[9px] font-bold opacity-20 tracking-widest">MADE WITH ❤️ IN INDIA</p>
        </div>
      </div>
      <input ref={fileInputRef} type="file" hidden accept="image/*" />
    </div>
  );
}