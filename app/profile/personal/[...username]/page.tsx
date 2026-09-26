'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const params = useParams() as any
  const router = useRouter()
  const raw = params.username || params.slug || Object.values(params).flat().pop()
  const username = Array.isArray(raw)? raw[raw.length - 1] : raw as string

  const [profile, setProfile] = useState<any>(null)
  const [me, setMe] = useState<any>(null)
  const [stats, setStats] = useState({ posts: 0, friends: 0 })
  const [friendStatus, setFriendStatus] = useState<'none'|'requested'|'incoming'|'friends'>('none')
  const [posts, setPosts] = useState<any[]>([])
  const [tab, setTab] = useState('Posts')
  const [uploading, setUploading] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [isOnboarding, setIsOnboarding] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ full_name:'', username:'', bio:'' })
  const fileRef = useRef<HTMLInputElement>(null)
  const [fileType, setFileType] = useState<'photo'|'video'|'cover'>('photo')

  useEffect(()=>{ if(username) load() }, [username])

  const load = async () => {
    setNotFound(false); setIsOnboarding(false)
    const { data: { user } } = await supabase.auth.getUser()
    if(user){
      const { data: my } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
      setMe(my)
    }
    const { data: p } = await supabase.from('profiles').select('*').eq('username', username).maybeSingle()
    if(!p){
      // 10cr wala black onboarding dikhao
      const { data: { user: u } } = await supabase.auth.getUser()
      if(u){
        const { data: myProfile } = await supabase.from('profiles').select('*').eq('id', u.id).maybeSingle()
        if(!myProfile){ setIsOnboarding(true); setForm(f=>({...f, username: username || ''})); return }
      }
      setNotFound(true); return
    }
    setProfile(p)
    try {
      const [postC, friendsC, relation, allPosts] = await Promise.all([
        supabase.from('posts').select('id', { count:'exact', head:true }).eq('user_id', p.id),
        supabase.from('friendships').select('id', { count:'exact', head:true }).or(`user1.eq.${p.id},user2.eq.${p.id}`).eq('status','friends'),
        user? supabase.from('friendships').select('*').or(`and(user1.eq.${user.id},user2.eq.${p.id}),and(user1.eq.${p.id},user2.eq.${user.id})`).maybeSingle() : { data:null } as any,
        supabase.from('posts').select('*').eq('user_id', p.id).order('created_at',{ascending:false})
      ])
      setStats({ posts: postC.count||0, friends: friendsC.count||0 })
      setPosts(allPosts.data||[])
      if(relation?.data){
        if(relation.data.status==='pending' && relation.data.user1===user?.id) setFriendStatus('requested')
        else if(relation.data.status==='pending') setFriendStatus('incoming')
        else setFriendStatus('friends')
      }
    } catch(e){ console.log(e) }
  }

  const handleCreateProfile = async () => {
    if(!form.full_name ||!form.username) return alert('Naam aur username bharo')
    setCreating(true)
    try{
      const { data: { user } } = await supabase.auth.getUser()
      if(!user) throw new Error('Login nahi hai')
      const cleanUsername = form.username.toLowerCase().replace(/[^a-z0-9_]/g,'_')
      const { data: exist } = await supabase.from('profiles').select('id').eq('username', cleanUsername).maybeSingle()
      if(exist){ alert('Ye username le liya gaya'); setCreating(false); return }

      await supabase.from('profiles').insert({
        id: user.id,
        full_name: form.full_name,
        username: cleanUsername,
        bio: form.bio || 'Siliguri explorer building Drisyamn.',
        created_at: new Date().toISOString()
      })
      router.push(`/personal/${cleanUsername}`)
      setIsOnboarding(false)
      load()
    }catch(e:any){ alert(e.message) }
    setCreating(false)
  }

  const handleFriend = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if(!user) return alert('Login karo pehle')
    if(friendStatus==='none'){
      await supabase.from('friendships').insert({ user1: user.id, user2: profile.id, status:'pending' })
      setFriendStatus('requested')
    } else if(friendStatus==='incoming'){
      await supabase.from('friendships').update({ status:'friends' }).eq('user1', profile.id).eq('user2', user.id)
      setFriendStatus('friends')
      setStats(s=>({...s, friends: s.friends+1}))
    } else {
      await supabase.from('friendships').delete().or(`and(user1.eq.${user.id},user2.eq.${profile.id}),and(user1.eq.${profile.id},user2.eq.${user.id})`)
      setFriendStatus('none')
      setStats(s=>({...s, friends: Math.max(0,s.friends-1)}))
    }
  }

  const triggerUpload = (type:'photo'|'video'|'cover') => { setFileType(type); fileRef.current?.click() }
  const onFileChange = async (e:any) => {
    const file = e.target.files?.[0]
    if(!file ||!profile) return
    setUploading(true)
    try{
      const ext = file.name.split('.').pop()
      const path = `${profile.id}/${fileType}_${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('posts').upload(path, file, { upsert: true })
      if(error) throw error
      const { data } = supabase.storage.from('posts').getPublicUrl(path)
      const url = data.publicUrl
      if(fileType==='cover'){
        await supabase.from('profiles').update({ cover_url: url }).eq('id', profile.id)
        setProfile({...profile, cover_url: url })
      } else {
        await supabase.from('posts').insert({ user_id: profile.id, image_url: url, type: fileType })
        load()
      }
    }catch(err:any){ alert(err.message) }
    setUploading(false)
    if(fileRef.current) fileRef.current.value = ''
  }

  // ===== 10 CRORE BLACK ONBOARDING =====
  if(isOnboarding){
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden flex items-center justify-center p-5">
        {/* heavy gradient blobs */}
        <div className="absolute -top-[200px] -left-[200px] w-[600px] h-[600px] bg-[#FF7A45]/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[200px] -right-[200px] w-[600px] h-[600px] bg-[#0F4C5C]/30 rounded-full blur-[120px]" />

        <div className="w-full max-w-[400px] relative z-10">
          <div className="mb-10">
            <p className="text-[11px] tracking-[0.3em] opacity-30 font-bold">DRISYAMN • SILIGURI</p>
            <h1 className="font-brand text-[44px] leading-[0.9] mt-3 tracking-tight">Craft<br/>your identity.</h1>
            <p className="text-[14px] opacity-50 mt-4 leading-relaxed">Facebook & Instagram jaisa, par Siliguri ke liye. 10 crore ka feel.</p>
          </div>

          <div className="bg-[#141414] rounded-[28px] p-6 border border-white/[0.06] shadow-[0_30px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="space-y-5">
              <div>
                <p className="text-[10px] tracking-widest opacity-30 font-bold mb-2.5 uppercase">Full Name</p>
                <input value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})}
                  placeholder="Rahul Sharma"
                  className="w-full h-[56px] rounded-[16px] bg-[#1C1C1C] border border-white/[0.06] px-5 text-[16px] font-medium outline-none focus:border-white/20 focus:bg-[#222] transition-all placeholder:opacity-30" />
              </div>
              <div>
                <p className="text-[10px] tracking-widest opacity-30 font-bold mb-2.5 uppercase">Username</p>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30 text-[15px]">@</span>
                  <input value={form.username} onChange={e=>setForm({...form, username:e.target.value})}
                    placeholder="rahul_siliguri"
                    className="w-full h-[56px] rounded-[16px] bg-[#1C1C1C] border border-white/[0.06] pl-9 pr-5 text-[16px] font-medium outline-none focus:border-white/20 focus:bg-[#222] transition-all placeholder:opacity-30" />
                </div>
              </div>
              <div>
                <p className="text-[10px] tracking-widest opacity-30 font-bold mb-2.5 uppercase">Bio</p>
                <textarea value={form.bio} onChange={e=>setForm({...form, bio:e.target.value})}
                  placeholder="Siliguri explorer building Drisyamn..."
                  className="w-full h-[88px] rounded-[16px] bg-[#1C1C1C] border border-white/[0.06] p-4 px-5 text-[15px] outline-none focus:border-white/20 focus:bg-[#222] transition-all resize-none placeholder:opacity-30" />
              </div>
              <button onClick={handleCreateProfile} disabled={creating}
                className="w-full h-[56px] rounded-full bg-white text-black font-black text-[14px] tracking-wide active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(255,255,255,0.15)] disabled:opacity-50">
                {creating? 'Creating...' : 'Continue →'}
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] tracking-widest opacity-20 mt-6 uppercase">Premium • Heavy • Drisyamn</p>
        </div>
      </div>
    )
  }

  if(notFound) return (
    <div className="min-h-screen bg-[#EDE6D3] flex items-center justify-center p-6">
      <div className="bg-white rounded-[32px] p-8 text-center max-w-[360px] shadow-xl">
        <p className="text-[48px]">😕</p>
        <p className="font-black text-[20px] mt-2">User not found</p>
        <p className="text-[13px] opacity-60 mt-1">@{username}</p>
      </div>
    </div>
  )
  if(!profile) return <div className="min-h-screen bg-[#EDE6D3] flex items-center justify-center font-black">Loading {username}...</div>
  const isOwn = me?.id===profile.id

  return (
    <div className="min-h-screen bg-[#EDE6D3] pb-[130px]">
      <input ref={fileRef} type="file" hidden accept={fileType==='video'?'video/*':'image/*'} onChange={onFileChange} />
      <div className="max-w-[480px] mx-auto w-full">
        <div className="p-3">
          <div className="relative h-[200px] sm:h-[240px] rounded-[32px] overflow-hidden bg-[#EFE9DE] shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
            <img src={profile.cover_url || `https://picsum.photos/seed/${profile.id}/800/400`} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
            {isOwn && (
              <button onClick={()=>triggerUpload('cover')} className="absolute top-4 right-4 h-9 px-4 rounded-full bg-white/90 backdrop-blur-xl shadow-lg text-[12px] font-bold">✎ Change</button>
            )}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="w-[96px] h-[96px] rounded-full p-[3px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
                <div className="w-full h-full rounded-full bg-[#EDE6D3] flex items-center justify-center text-[42px] font-black text-[#2b1d14] font-brand">
                  {profile.full_name?.[0]?.toUpperCase() || username[0]?.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 space-y-3 mt-8">
          <div className="bg-white rounded-[32px] p-6 pt-14 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-white">
            <h1 className="font-brand text-[30px] font-bold tracking-tight text-center leading-none">{profile.full_name || username}</h1>
            <p className="text-center text-[11px] font-bold tracking-widest opacity-30 uppercase mt-2">@{profile.username} • Siliguri</p>
            <p className="text-center text-[15px] font-medium opacity-60 mt-3 leading-snug">{profile.bio}</p>
            <div className="grid grid-cols-2 mt-6 bg-[#F6F1E6] rounded-[20px] p-3 border border-black/[0.03]">
              <button onClick={()=>setTab('Posts')} className="text-center"><p className="text-[22px] font-black">{stats.posts}</p><p className="text-[10px] font-bold opacity-40 tracking-widest">POSTS</p></button>
              <button onClick={()=>setTab('Friends')} className="text-center border-l border-black/10"><p className="text-[22px] font-black">{stats.friends}</p><p className="text-[10px] font-bold opacity-40 tracking-widest">FRIENDS</p></button>
            </div>
            <div className="flex gap-2 mt-5">
              {!isOwn? (
                <>
                  <button onClick={handleFriend} className={`flex-1 h-[48px] rounded-full font-black text-[14px] active:scale-95 transition-all ${friendStatus==='friends'?'bg-[#EFE9DE] text-black':'bg-[#111] text-white shadow-xl'}`}>
                    {friendStatus==='none'?'Add Friend':friendStatus==='requested'?'Requested':friendStatus==='incoming'?'Accept':'Friends ✓'}
                  </button>
                  <button className="flex-1 h-[48px] rounded-full bg-white border border-black/10 font-black text-[14px]">Message</button>
                </>
              ) : (
                <button onClick={()=>triggerUpload('photo')} className="flex-1 h-[48px] rounded-full bg-[#111] text-white font-black text-[14px] shadow-xl">{uploading?'Uploading...':'+ Create Post'}</button>
              )}
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 -mx-1 px-1">
            {['Posts','About','Photos','Videos','Friends'].map(t=>(
              <button key={t} onClick={()=>setTab(t)} className={`h-11 px-6 rounded-full font-bold text-[13px] whitespace-nowrap shrink-0 border transition-all ${tab===t?'bg-black text-white shadow-md border-black':'bg-white border-black/5'}`}>{t}</button>
            ))}
          </div>

          {tab==='Posts' && (
            <div className="grid grid-cols-3 gap-1.5 rounded-[24px] overflow-hidden">
              {posts.map((p:any)=>(
                <div key={p.id} className="aspect-[4/5] bg-white relative overflow-hidden rounded-[2px]">
                  {p.type==='video'? <video src={p.image_url} className="w-full h-full object-cover" /> : <img src={p.image_url} className="w-full h-full object-cover" alt="" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(16px,env(safe-area-inset-bottom))] bg-gradient-to-t from-[#EDE6D3] via-[#EDE6D3] to-transparent pointer-events-none">
        <div className="max-w-[480px] mx-auto flex justify-center pointer-events-auto">
          <div className="bg-[#111] rounded-full p-1.5 flex gap-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10">
            <button onClick={()=>triggerUpload('photo')} className="h-11 px-6 rounded-full bg-white text-black font-bold text-[12px]">📷 Photo</button>
            <button onClick={()=>triggerUpload('video')} className="h-11 px-6 rounded-full bg-white/10 text-white font-bold text-[12px] border border-white/10">▶ Video</button>
          </div>
        </div>
      </div>
    </div>
  )
}