"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

// 7CR LOCK COLORS
const C = {
  bg: "#EDE6D3",
  card: "#FFFEFB",
  soft: "#F6F1E6",
  orange: "#E86A33",
  black: "#121212",
}

type Profile = {
  id: string
  username: string
  full_name: string
  bio: string
  avatar_url: string
  cover_url?: string
  friends_count: number
  location?: string
  is_me?: boolean
}

type Post = {
  id: string
  user_id: string
  image_url: string
  caption: string
  created_at: string
  likes: number
}

type Friend = {
  id: string
  username: string
  avatar_url: string
  full_name: string
}

export default function PersonalProfilePage() {
  const { username } = useParams() as { username: string }
  const router = useRouter()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"posts" | "about">("posts")
  const [showFriends, setShowFriends] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [isFriend, setIsFriend] = useState(false)
  const [isRequested, setIsRequested] = useState(false)
  const [myId, setMyId] = useState<string | null>(null)

  // EDIT STATE
  const [editName, setEditName] = useState("")
  const [editBio, setEditBio] = useState("")
  const [editAvatar, setEditAvatar] = useState("")

  useEffect(() => {
    init()
  }, [username])

  async function init() {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setMyId(user.id)

      // 1. GET PROFILE
      const { data: prof, error } = await supabase
       .from("profiles")
       .select("*")
       .eq("username", username)
       .single()

      if (error ||!prof) {
        console.log("Profile not found", error)
        setLoading(false)
        return
      }

      const isMe = user?.id === prof.id
      setProfile({...prof, is_me: isMe })
      setEditName(prof.full_name || "")
      setEditBio(prof.bio || "")
      setEditAvatar(prof.avatar_url || "")

      // 2. GET POSTS - SAME TABLE AS HOMEFEED
      const { data: postData } = await supabase
       .from("posts")
       .select("*")
       .eq("user_id", prof.id)
       .order("created_at", { ascending: false })

      setPosts(postData || [])

      // 3. GET FRIENDS LIST
      const { data: friendData } = await supabase
       .from("friends")
       .select("friend_id, profiles!friends_friend_id_fkey(id, username, avatar_url, full_name)")
       .eq("user_id", prof.id)
       .eq("status", "accepted")

      const formattedFriends = (friendData || []).map((f: any) => f.profiles)
      setFriends(formattedFriends)

      // 4. CHECK IF I AM FRIEND WITH THIS USER
      if (user &&!isMe) {
        const { data: check } = await supabase
         .from("friends")
         .select("*")
         .or(`and(user_id.eq.${user.id},friend_id.eq.${prof.id}),and(user_id.eq.${prof.id},friend_id.eq.${user.id})`)
         .maybeSingle()

        if (check) {
          if (check.status === "accepted") setIsFriend(true)
          if (check.status === "pending") setIsRequested(true)
        }
      }

    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleFriendAction() {
    if (!myId ||!profile) return
    if (isFriend || isRequested) return

    setIsRequested(true)
    await fetch("/api/friends/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "request",
        target_id: profile.id,
      }),
    })
  }

  async function handleEditSave() {
    if (!profile) return
    const { error } = await supabase
     .from("profiles")
     .update({
        full_name: editName,
        bio: editBio,
        avatar_url: editAvatar,
      })
     .eq("id", profile.id)

    if (!error) {
      setProfile({...profile, full_name: editName, bio: editBio, avatar_url: editAvatar })
      setShowEdit(false)
    }
  }

  async function handleDeletePost(id: string) {
    if (!confirm("Delete this post?")) return
    await supabase.from("posts").delete().eq("id", id)
    setPosts(posts.filter(p => p.id!== id))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EDE6D3] flex items-center justify-center">
        <p className="font-black text-[13px] tracking-widest uppercase animate-pulse">Drisyamn Loading...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#EDE6D3] flex flex-col items-center justify-center p-6">
        <div className="bg-[#FFFEFB] rounded-[32px] p-10 shadow-[0_0_0_12px_white] text-center max-w-[440px] w-full">
          <p className="font-black text-[26px] tracking-[-0.03em] uppercase">404</p>
          <p className="font-black text-[11px] tracking-widest uppercase opacity-60 mt-2">User @{username} not found</p>
          <button onClick={() => router.push("/")} className="mt-6 w-full bg-[#121212] text-white rounded-full py-3.5 text-[13px] font-black tracking-widest uppercase">Go Home</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#EDE6D3] flex justify-center">
      <div className="w-full max-w-[440px] p-3 pb-20">

        {/* COVER + PROFILE CARD */}
        <div className="bg-[#FFFEFB] rounded-[32px] shadow-[0_0_0_12px_white] overflow-hidden mt-4">
          {/* Cover */}
          <div className="h-[110px] bg-[#F6F1E6] w-full relative">
            {profile.cover_url && <img src={profile.cover_url} className="w-full h-full object-cover" alt="cover" />}
          </div>

          {/* Profile Info */}
          <div className="p-6 pt-0">
            <div className="flex justify-between items-end -mt-8">
              <img src={profile.avatar_url || "https://i.pravatar.cc/150"} className="w-[84px] h-[84px] rounded-full object-cover border-[4px] border-white shadow-sm" alt="avatar" />
              <div className="flex gap-2 mb-2">
                <button className="w-9 h-9 rounded-full bg-[#F6F1E6] flex items-center justify-center font-black text-[14px]">↗</button>
                <button className="w-9 h-9 rounded-full bg-[#F6F1E6] flex items-center justify-center font-black text-[14px]">...</button>
              </div>
            </div>

            <div className="mt-4">
              <h1 className="font-black text-[26px] tracking-[-0.03em] uppercase leading-[0.9]">{profile.full_name || profile.username}</h1>
              <p className="text-[11px] font-black tracking-widest uppercase opacity-50 mt-1.5">@{profile.username} {profile.location? `• ${profile.location}` : "• SILIGURI"}</p>
              <p className="text-[12px] font-medium mt-3 leading-[1.4] uppercase tracking-wide opacity-80">{profile.bio || "Drisyamn family member. No shop, only real connections."}</p>
            </div>

            {/* STATS BOX */}
            <div className="bg-[#F6F1E6] rounded-[22px] flex justify-between p-1 mt-5">
              <div className="text-center w-full py-3 cursor-pointer hover:opacity-70" onClick={() => setShowFriends(true)}>
                <p className="font-black text-[18px] tracking-[-0.02em] leading-none">{profile.friends_count || friends.length || 0}</p>
                <p className="text-[10px] font-black tracking-[0.2em] uppercase opacity-60 mt-1">Friends</p>
              </div>
              <div className="w-[1px] bg-black/10 my-3" />
              <div className="text-center w-full py-3">
                <p className="font-black text-[18px] tracking-[-0.02em] leading-none">{posts.length}</p>
                <p className="text-[10px] font-black tracking-[0.2em] uppercase opacity-60 mt-1">Posts</p>
              </div>
              <div className="w-[1px] bg-black/10 my-3" />
              <div className="text-center w-full py-3">
                <p className="font-black text-[18px] tracking-[-0.02em] leading-none">7CR</p>
                <p className="text-[10px] font-black tracking-[0.2em] uppercase opacity-60 mt-1">Vibe</p>
              </div>
            </div>

            {/* ACTION BUTTON */}
            {profile.is_me? (
              <button onClick={() => setShowEdit(true)} className="w-full mt-4 bg-[#121212] text-white rounded-full py-4 text-[13px] font-black tracking-[0.2em] uppercase">Edit Profile</button>
            ) : (
              <button onClick={handleFriendAction} disabled={isFriend || isRequested} className={`w-full mt-4 rounded-full py-4 text-[13px] font-black tracking-[0.2em] uppercase transition ${isFriend? "bg-[#F6F1E6] text-black/50" : isRequested? "bg-[#F6F1E6] text-black/50" : "bg-[#E86A33] text-white"}`}>
                {isFriend? "Friends ✓" : isRequested? "Requested" : "Add Friend +"}
              </button>
            )}
          </div>
        </div>

        {/* TABS */}
        <div className="bg-[#FFFEFB] rounded-full p-1.5 flex mt-5 shadow-[0_0_0_8px_white] w-fit mx-auto">
          <button onClick={() => setActiveTab("posts")} className={`px-7 py-2.5 rounded-full text-[11px] font-black tracking-widest uppercase transition ${activeTab === "posts"? "bg-[#121212] text-white" : "opacity-50"}`}>Posts</button>
          <button onClick={() => setActiveTab("about")} className={`px-7 py-2.5 rounded-full text-[11px] font-black tracking-widest uppercase transition ${activeTab === "about"? "bg-[#121212] text-white" : "opacity-50"}`}>About</button>
        </div>

        {/* CONTENT */}
        {activeTab === "posts"? (
          <div className="mt-5 grid gap-4">
            {posts.length === 0? (
              <div className="bg-[#FFFEFB] rounded-[32px] p-10 text-center shadow-[0_0_0_12px_white]">
                <p className="font-black uppercase tracking-widest text-[12px] opacity-50">No posts yet</p>
                <p className="font-black uppercase tracking-widest text-[10px] opacity-30 mt-2">Homefeed posts will appear here</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-[#FFFEFB] rounded-[32px] overflow-hidden shadow-[0_0_0_12px_white] group">
                  <div className="relative">
                    <img src={post.image_url} className="w-full object-cover min-h-[320px]" alt="post" />
                    {profile.is_me && (
                      <button onClick={() => handleDeletePost(post.id)} className="absolute top-3 right-3 bg-black/70 text-white w-8 h-8 rounded-full text-[12px] font-black opacity-0 group-hover:opacity-100 transition">X</button>
                    )}
                  </div>
                  <div className="p-4 flex justify-between items-start gap-3">
                    <p className="text-[11px] font-black tracking-widest uppercase leading-[1.4] flex-1">{post.caption || "DRISYAMN MOMENT"}</p>
                    <p className="text-[10px] font-black tracking-widest uppercase opacity-40 whitespace-nowrap">{new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="mt-5 bg-[#FFFEFB] rounded-[32px] p-6 shadow-[0_0_0_12px_white]">
            <h3 className="font-black text-[12px] tracking-widest uppercase">About @{profile.username}</h3>
            <div className="mt-4 space-y-3">
              <div className="bg-[#F6F1E6] rounded-[16px] p-4 flex justify-between">
                <span className="text-[10px] font-black tracking-widest uppercase opacity-50">Location</span>
                <span className="text-[11px] font-black tracking-widest uppercase">{profile.location || "Siliguri, WB"}</span>
              </div>
              <div className="bg-[#F6F1E6] rounded-[16px] p-4 flex justify-between">
                <span className="text-[10px] font-black tracking-widest uppercase opacity-50">Joined</span>
                <span className="text-[11px] font-black tracking-widest uppercase">Drisyamn 2026</span>
              </div>
              <div className="bg-[#F6F1E6] rounded-[16px] p-4">
                <span className="text-[10px] font-black tracking-widest uppercase opacity-50 block mb-2">Bio</span>
                <span className="text-[12px] font-bold uppercase tracking-wide leading-[1.4]">{profile.bio || "No bio. Just vibes."}</span>
              </div>
            </div>
          </div>
        )}

        {/* FRIENDS MODAL */}
        {showFriends && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50 p-3" onClick={() => setShowFriends(false)}>
            <div className="bg-[#FFFEFB] w-full max-w-[440px] rounded-t-[32px] rounded-b-[32px] p-6 min-h-[60vh] max-h-[80vh] overflow-y-auto shadow-[0_0_0_12px_white]" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center">
                <h2 className="font-black uppercase tracking-[0.2em] text-[13px]">Friends • {friends.length}</h2>
                <button onClick={() => setShowFriends(false)} className="w-8 h-8 rounded-full bg-[#F6F1E6] font-black">X</button>
              </div>
              <div className="mt-6 grid gap-3">
                {friends.length === 0? (
                  <p className="text-[11px] font-black tracking-widest uppercase opacity-40 text-center py-10">No friends yet</p>
                ) : (
                  friends.map((f) => (
                    <div key={f.id} className="flex items-center gap-3 bg-[#F6F1E6] p-3 rounded-[20px] cursor-pointer" onClick={() => { setShowFriends(false); router.push(`/personal/${f.username}`) }}>
                      <img src={f.avatar_url} className="w-11 h-11 rounded-full object-cover" alt={f.username} />
                      <div>
                        <p className="font-black text-[12px] uppercase tracking-widest">{f.full_name || f.username}</p>
                        <p className="text-[10px] font-black tracking-widest uppercase opacity-50">@{f.username}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {showEdit && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50 p-3">
            <div className="bg-[#FFFEFB] w-full max-w-[440px] rounded-[32px] p-6 shadow-[0_0_0_12px_white]">
              <h2 className="font-black uppercase tracking-[0.2em] text-[13px]">Edit Profile</h2>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-[10px] font-black tracking-widest uppercase opacity-50">Full Name</label>
                  <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full mt-2 bg-[#F6F1E6] rounded-full px-5 py-3.5 text-[12px] font-black uppercase tracking-widest outline-none" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-[10px] font-black tracking-widest uppercase opacity-50">Bio</label>
                  <textarea value={editBio} onChange={e => setEditBio(e.target.value)} className="w-full mt-2 bg-[#F6F1E6] rounded-[20px] px-5 py-3.5 text-[12px] font-bold uppercase tracking-wide outline-none min-h-[80px]" placeholder="Your bio" />
                </div>
                <div>
                  <label className="text-[10px] font-black tracking-widest uppercase opacity-50">Avatar URL</label>
                  <input value={editAvatar} onChange={e => setEditAvatar(e.target.value)} className="w-full mt-2 bg-[#F6F1E6] rounded-full px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide outline-none" placeholder="https://..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowEdit(false)} className="flex-1 bg-[#F6F1E6] rounded-full py-4 text-[12px] font-black tracking-widest uppercase">Cancel</button>
                  <button onClick={handleEditSave} className="flex-1 bg-[#121212] text-white rounded-full py-4 text-[12px] font-black tracking-widest uppercase">Save</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="text-center mt-10 text-[9px] font-black tracking-[0.3em] uppercase opacity-20">DRISYAMN SILIGURI • 7CR LOCK • NO SHOP NO SELLS</p>
      </div>
    </div>
  )
}