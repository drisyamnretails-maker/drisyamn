"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// COLORS
const ORANGE = "#E86A33";
const PAGE_BG = "#EDE6D3";
const PURE_BLACK = "#0A0A0A";
const LIGHT_BG = "#F6F1E6";
const WHITE_BG = "#FFFFFF";
const BORDER_COLOR = "rgba(0,0,0,0.08)";

// MAIN COMPONENT
export default function PersonalProfilePage() {
  const params = useParams() as { username: string };
  const username = params.username;
  const router = useRouter();

  // STATES
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [followCount, setFollowCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // FORM STATE
  const [form, setForm] = useState({
    displayName: "",
    bio: "",
    location: "",
    website: "",
    dob: "",
  });

  // FETCH PROFILE
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
         .from("profiles")
         .select("*")
         .eq("username", username)
         .single();

        if (error) {
          console.log("Supabase error:", error.message);
        }

        if (data) {
          setProfile(data);
          setForm({
            displayName: data.full_name || "",
            bio: data.bio || "",
            location: data.location || "",
            website: data.website || "",
            dob: data.dob || "",
          });
          setFollowCount(data.followers_count || 1248);
          setFollowingCount(data.following_count || 320);
          setPostCount(data.posts_count || 24);
        } else {
          const fallbackData = {
            full_name: username,
            username: username,
            bio: "This is my personal profile on Drisyam. No bio added yet. Welcome to my page.",
            location: "Siliguri, West Bengal",
            website: "drisyam.app",
            dob: "2000-01-01",
            interests: ["Shopping", "Travel", "Food", "Fashion", "Tech", "Music", "Books", "Movies"],
            avatar_url: null,
            cover_url: null,
            posts_count: 24,
            followers_count: 1248,
            following_count: 320,
            joined: "Jan 2026",
            verified: true,
            account_type: "personal",
          };
          setProfile(fallbackData);
          setForm({
            displayName: fallbackData.full_name,
            bio: fallbackData.bio,
            location: fallbackData.location,
            website: fallbackData.website,
            dob: fallbackData.dob,
          });
          setFollowCount(fallbackData.followers_count);
          setFollowingCount(fallbackData.following_count);
          setPostCount(fallbackData.posts_count);
        }
      } catch (err) {
        console.log("Catch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfileData();
    }
  }, [username]);

  // NAVIGATION FUNCTIONS
  const goToHomeFeed = () => {
    router.push("/");
  };

  const goToFeedRoute = () => {
    router.push("/");
  };

  const goToExplore = () => {
    router.push("/");
  };

  // FOLLOW HANDLER
  const handleFollowToggle = () => {
    if (isFollowing) {
      setFollowCount((prev) => prev - 1);
    } else {
      setFollowCount((prev) => prev + 1);
    }
    setIsFollowing(!isFollowing);
  };

  // SAVE PROFILE
  const handleSaveProfile = async () => {
    setSaveLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
         .from("profiles")
         .update({
            full_name: form.displayName,
            bio: form.bio,
            location: form.location,
            website: form.website,
            dob: form.dob,
          })
         .eq("id", user.id);

        if (!error) {
          setProfile({
           ...profile,
            full_name: form.displayName,
            bio: form.bio,
            location: form.location,
            website: form.website,
            dob: form.dob,
          });
        }
      } else {
        setProfile({
         ...profile,
          full_name: form.displayName,
          bio: form.bio,
          location: form.location,
          website: form.website,
          dob: form.dob,
        });
      }
    } catch (e) {
      console.log("Save error:", e);
    } finally {
      setSaveLoading(false);
      setEditMode(false);
    }
  };

  // CANCEL EDIT
  const handleCancelEdit = () => {
    setForm({
      displayName: profile.full_name || "",
      bio: profile.bio || "",
      location: profile.location || "",
      website: profile.website || "",
      dob: profile.dob || "",
    });
    setEditMode(false);
  };

  // LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ background: PAGE_BG }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-black/10 border-t-black animate-spin"></div>
          <p className="text-[11px] font-black tracking-[0.2em]">LOADING PROFILE</p>
          <p className="text-[10px] font-bold opacity-50">@{username}</p>
        </div>
      </div>
    );
  }

  // STATS DATA
  const statsData = [
    { label: "POSTS", value: postCount },
    { label: "FOLLOWERS", value: followCount },
    { label: "FOLLOWING", value: followingCount },
  ];

  // POSTS MOCK
  const postsList = Array.from({ length: 18 }).map((_, index) => ({
    id: index,
    title: `POST ${index + 1}`,
    likes: Math.floor(Math.random() * 100),
  }));

  // HIGHLIGHTS
  const highlightsList = [
    { id: 1, label: "Travel" },
    { id: 2, label: "Food" },
    { id: 3, label: "Work" },
    { id: 4, label: "Life" },
    { id: 5, label: "New" },
  ];

  return (
    <div className="min-h-screen w-full flex justify-center" style={{ background: PAGE_BG }}>
      <div className="w-full max-w-[480px] bg-white min-h-screen md:mt-6 md:rounded-[24px] md:min-h-[90vh] overflow-hidden border border-black/5 flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.08)]">

        {/* TOP HEADER - ARROW TO HOME FEED */}
        <div className="h-[56px] w-full flex items-center justify-between px-5 bg-white border-b border-black/5 sticky top-0 z-20">
          <button
            onClick={goToHomeFeed}
            className="w-[72px] h-[36px] rounded-full bg-[#F6F1E6] flex items-center justify-center font-black text-[11px] tracking-widest active:scale-95 transition-transform border border-black/5"
          >
            BACK
          </button>

          <div className="flex flex-col items-center">
            <p className="text-[12px] font-black tracking-[0.15em]">{username?.toString().toUpperCase()}</p>
            <p className="text-[9px] font-bold opacity-40 tracking-widest">PERSONAL PROFILE</p>
          </div>

          <button
            onClick={goToFeedRoute}
            className="w-[72px] h-[36px] rounded-full bg-black text-white flex items-center justify-center font-black text-[11px] tracking-widest active:scale-95 transition-transform"
          >
            HOME FEED
          </button>
        </div>

        {/* COVER AREA */}
        <div className="w-full h-[200px] bg-[#F6F1E6] relative overflow-hidden border-b border-black/5">
          {profile.cover_url? (
            <img src={profile.cover_url} alt="cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#EDE6D3]">
              <p className="text-[10px] font-black tracking-widest opacity-20">COVER PHOTO AREA</p>
            </div>
          )}
        </div>

        {/* PROFILE HEADER */}
        <div className="px-6 pb-2">
          <div className="flex items-end justify-between -mt-10 relative z-10">
            <div className="w-[88px] h-[88px] rounded-full bg-white border-4 border-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] overflow-hidden">
              {profile.avatar_url? (
                <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#F6F1E6] flex items-center justify-center">
                  <p className="text-[10px] font-black">NO PHOTO</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 mb-1">
              <button
                onClick={handleFollowToggle}
                className="px-5 h-[36px] rounded-full text-[11px] font-black tracking-wide active:scale-95 transition-all"
                style={{
                  background: isFollowing? LIGHT_BG : ORANGE,
                  color: isFollowing? PURE_BLACK : WHITE_BG,
                  border: isFollowing? `1px solid ${BORDER_COLOR}` : "none",
                }}
              >
                {isFollowing? "FOLLOWING" : "FOLLOW"}
              </button>

              <button
                onClick={() => setEditMode(!editMode)}
                className="px-5 h-[36px] rounded-full bg-[#F6F1E6] border border-black/10 text-[11px] font-black tracking-wide active:scale-95"
              >
                {editMode? "CLOSE" : "EDIT"}
              </button>
            </div>
          </div>

          {/* NAME AND BIO */}
          <div className="mt-4">
            <h1 className="text-[24px] font-black leading-none" style={{ color: PURE_BLACK }}>
              {profile.full_name}
            </h1>
            <p className="text-[11px] font-bold mt-1 tracking-wide" style={{ color: ORANGE }}>
              @{username}
            </p>
            <p className="text-[13px] mt-3 leading-[1.6] text-[#444] font-medium">
              {profile.bio}
            </p>
          </div>

          {/* STATS GRID */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {statsData.map((item) => (
              <div
                key={item.label}
                className="h-[68px] rounded-[16px] bg-[#F6F1E6] border border-black/5 flex flex-col items-center justify-center"
              >
                <p className="text-[16px] font-black">{item.value}</p>
                <p className="text-[9px] font-black tracking-[0.15em] opacity-50 mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          {/* LOCATION AND WEBSITE */}
          <div className="mt-5 flex flex-wrap gap-2">
            <div className="px-3 h-[30px] rounded-full bg-white border border-black/10 flex items-center text-[11px] font-bold">
              {profile.location}
            </div>
            <div className="px-3 h-[30px] rounded-full bg-white border border-black/10 flex items-center text-[11px] font-bold">
              {profile.website}
            </div>
            <div className="px-3 h-[30px] rounded-full bg-white border border-black/10 flex items-center text-[11px] font-bold">
              Joined {profile.joined}
            </div>
          </div>

          {/* HIGHLIGHTS ROW */}
          <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
            {highlightsList.map((hl) => (
              <div key={hl.id} className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="w-[56px] h-[56px] rounded-full bg-[#F6F1E6] border-2 border-white shadow-sm flex items-center justify-center">
                  <p className="text-[9px] font-black">{hl.label.toUpperCase()}</p>
                </div>
                <p className="text-[9px] font-bold opacity-60">{hl.label}</p>
              </div>
            ))}
          </div>

          {/* INTERESTS */}
          <div className="mt-6">
            <p className="text-[10px] font-black tracking-[0.15em] opacity-40">INTERESTS AND TAGS</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.interests?.map((tag: string, idx: number) => (
                <div
                  key={tag}
                  className="px-4 h-[32px] rounded-full flex items-center text-[11px] font-black border"
                  style={{
                    background: idx === 0? ORANGE : LIGHT_BG,
                    color: idx === 0? WHITE_BG : PURE_BLACK,
                    borderColor: idx === 0? ORANGE : BORDER_COLOR,
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* ABOUT CARD */}
          <div className="mt-6 p-4 rounded-[16px] bg-[#F6F1E6] border border-black/5">
            <p className="text-[10px] font-black tracking-widest opacity-50">ABOUT THIS ACCOUNT</p>
            <p className="text-[12px] mt-2 leading-[1.6] text-[#444] font-medium">
              Living in {profile.location}. Building Drisyam community. Personal account, verified.
              Love to connect with people from Siliguri and West Bengal.
            </p>
            <div className="mt-3 flex gap-2">
              <div className="px-2 py-1 rounded-full bg-white border text-[10px] font-bold">Verified</div>
              <div className="px-2 py-1 rounded-full bg-white border text-[10px] font-bold">Personal</div>
            </div>
          </div>

          {/* EDIT FORM */}
          {editMode && (
            <div className="mt-6 p-5 rounded-[16px] border border-black/10 bg-white shadow-sm">
              <p className="text-[11px] font-black tracking-[0.15em]">EDIT PROFILE DETAILS</p>

              <p className="mt-4 text-[10px] font-black opacity-50 tracking-widest">DISPLAY NAME</p>
              <input
                value={form.displayName}
                onChange={(e) => setForm({...form, displayName: e.target.value })}
                className="mt-2 w-full h-[44px] px-4 rounded-[12px] bg-[#F6F1E6] border border-black/5 text-[13px] font-semibold outline-none"
                placeholder="Enter display name"
              />

              <p className="mt-4 text-[10px] font-black opacity-50 tracking-widest">BIO</p>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({...form, bio: e.target.value })}
                rows={3}
                className="mt-2 w-full px-4 py-3 rounded-[12px] bg-[#F6F1E6] border border-black/5 text-[13px] font-medium outline-none resize-none"
                placeholder="Enter bio"
              />

              <p className="mt-4 text-[10px] font-black opacity-50 tracking-widest">LOCATION</p>
              <input
                value={form.location}
                onChange={(e) => setForm({...form, location: e.target.value })}
                className="mt-2 w-full h-[44px] px-4 rounded-[12px] bg-[#F6F1E6] border border-black/5 text-[13px] font-semibold outline-none"
                placeholder="Enter location"
              />

              <p className="mt-4 text-[10px] font-black opacity-50 tracking-widest">WEBSITE</p>
              <input
                value={form.website}
                onChange={(e) => setForm({...form, website: e.target.value })}
                className="mt-2 w-full h-[44px] px-4 rounded-[12px] bg-[#F6F1E6] border border-black/5 text-[13px] font-semibold outline-none"
                placeholder="Enter website"
              />

              <button
                onClick={handleSaveProfile}
                disabled={saveLoading}
                className="mt-5 w-full h-[46px] rounded-full text-white font-black text-[11px] tracking-widest active:scale-[0.98] transition-transform"
                style={{ background: ORANGE }}
              >
                {saveLoading? "SAVING" : "SAVE CHANGES"}
              </button>

              <button
                onClick={handleCancelEdit}
                className="mt-2 w-full h-[46px] rounded-full bg-[#F6F1E6] border border-black/10 font-black text-[11px] tracking-widest active:scale-[0.98] transition-transform"
              >
                CANCEL
              </button>
            </div>
          )}
        </div>

        {/* TABS */}
        <div className="mt-8 flex border-y border-black/5 bg-white sticky top-[56px] z-10">
          <button
            onClick={() => setActiveTab("posts")}
            className="flex-1 h-[46px] text-[11px] font-black tracking-widest border-b-2 transition-colors"
            style={{ borderColor: activeTab === "posts"? ORANGE : "transparent" }}
          >
            POSTS
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className="flex-1 h-[46px] text-[11px] font-black tracking-widest border-b-2 transition-colors"
            style={{ borderColor: activeTab === "media"? ORANGE : "transparent" }}
          >
            MEDIA
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className="flex-1 h-[46px] text-[11px] font-black tracking-widest border-b-2 transition-colors"
            style={{ borderColor: activeTab === "about"? ORANGE : "transparent" }}
          >
            ABOUT
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="p-[2px] bg-white">
          {activeTab === "posts" && (
            <div className="grid grid-cols-3 gap-[2px]">
              {postsList.map((p) => (
                <div
                  key={p.id}
                  className="aspect-square bg-[#F6F1E6] rounded-[10px] border border-black/5 flex flex-col items-center justify-center gap-1"
                >
                  <p className="text-[10px] font-black">{p.title}</p>
                  <p className="text-[9px] font-bold opacity-40">LIKES {p.likes}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "media" && (
            <div className="h-[220px] flex flex-col items-center justify-center gap-2">
              <p className="text-[11px] font-black tracking-widest opacity-30">NO MEDIA YET</p>
              <p className="text-[10px] font-bold opacity-30">Media will appear here</p>
            </div>
          )}

          {activeTab === "about" && (
            <div className="p-5">
              <div className="flex justify-between py-3 border-b border-black/5">
                <span className="text-[12px] font-bold opacity-50">Username</span>
                <span className="text-[12px] font-black">@{username}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-black/5">
                <span className="text-[12px] font-bold opacity-50">Full Name</span>
                <span className="text-[12px] font-black">{profile.full_name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-black/5">
                <span className="text-[12px] font-bold opacity-50">Location</span>
                <span className="text-[12px] font-black">{profile.location}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-black/5">
                <span className="text-[12px] font-bold opacity-50">Website</span>
                <span className="text-[12px] font-black">{profile.website}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-black/5">
                <span className="text-[12px] font-bold opacity-50">DOB</span>
                <span className="text-[12px] font-black">{profile.dob || form.dob}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-[12px] font-bold opacity-50">Joined</span>
                <span className="text-[12px] font-black">{profile.joined}</span>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-auto p-4 flex gap-3 border-t border-black/5 bg-white sticky bottom-0 z-20">
          <button
            onClick={goToHomeFeed}
            className="flex-1 h-[48px] rounded-full bg-[#F6F1E6] border border-black/10 text-[11px] font-black tracking-widest active:scale-95"
          >
            BACK TO FEED
          </button>
          <button
            onClick={handleFollowToggle}
            className="flex-1 h-[48px] rounded-full text-white text-[11px] font-black tracking-widest active:scale-95"
            style={{ background: isFollowing? PURE_BLACK : ORANGE }}
          >
            {isFollowing? "FOLLOWING" : "FOLLOW"}
          </button>
        </div>

        {/* FOOTER */}
        <div className="p-5 text-center bg-[#F6F1E6]/40 border-t border-black/5">
          <p className="text-[10px] font-black tracking-[0.15em] opacity-20">DRISYAM 2026 - SILIGURI</p>
          <p className="text-[9px] font-bold opacity-20 mt-1 tracking-widest">PERSONAL PROFILE PAGE</p>
        </div>
      </div>
    </div>
  );
}