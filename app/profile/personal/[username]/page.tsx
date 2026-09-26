'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const params = useParams() as any
  const router = useRouter()
  const raw = params.username || params['username'] || Object.values(params).flat().pop()
  const username = (Array.isArray(raw)? raw[raw.length-1] : raw) as string

  const [profile, setProfile] = useState<any>(null)
  const [me, setMe] = useState<any>(null)
  const [stats, setStats] = useState({ posts: 0, friends: 0 })
  const [friendStatus, setFriendStatus] = useState<'none'|'requested'|'incoming'|'friends'>('none')
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOnboarding, setIsOnboarding] = useState(false)
  const [creating, setCreating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ full_name:'', username:'', bio:'' })
  const fileRef = useRef<HTMLInputElement>(null)
  const [fileType, setFileType] = useState<'photo'|'video'|'cover'>('photo')

  useEffect(()=>{ if(username) load() }, [username])

  const load = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if(user){
      const { data: my } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
      setMe(my)
    }
    const { data: p } = await supabase.from('profiles').select('*').eq('username', username).maybeSingle()
    if(!p){
      const { data: { user: u } } = await supabase.auth.getUser()
      if(u){
        const { data: myProfile } = await supabase.from('profiles').select('*').eq('id', u.id).maybeSingle()
        if(!myProfile){
          setIsOnboarding(true);
          setForm(f=>({...f, username: username || ''}));
          setLoading(false);
          return
        }
      }
      setProfile(null); setLoading(false); return
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
    } catch(e){}
    setLoading(false)
  }

  const handleCreate = async () => {
    if(!form.full_name ||!form.username) return alert('Naam aur username bhar')
    setCreating(true)
    try{
      const { data: { user } } = await supabase.auth.getUser()
      if(!user) throw new Error('Login nahi hai')
      const clean = form.username.toLowerCase().replace(/[^a-z0-9_]/g,'_')
      const { data: exist } = await supabase.from('profiles').select('id').eq('username', clean).maybeSingle()
      if(exist){ alert('Username taken'); setCreating(false); return }
      await supabase.from('profiles').insert({
        id: user.id,
        full_name: form.full_name,
        username: clean,
        bio: form.bio || 'Siliguri explorer • Building Drisyamn',
        created_at: new Date().toISOString()
      })
      router.push(`/profile/personal/${clean}`)
    }catch(e:any){ alert(e.message) }
    setCreating(false)
  }

  const handleFriend = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if(!user) return alert('Login kar pehle')
    if(friendStatus==='none'){
      await supabase.from('friendships').insert({ user1: user.id, user2: profile.id, status:'pending' })
      setFriendStatus('requested')
    } else if(friendStatus==='incoming'){
      await supabase.from('friendships').update({ status:'friends' }).eq('user1', profile.id).eq('user2', user.id)
      setFriendStatus('friends')
    } else {
      await supabase.from('friendships').delete().or(`and(user1.eq.${user.id},user2.eq.${profile.id}),and(user1.eq.${profile.id},user2.eq.${user.id})`)
      setFriendStatus('none')
    }
  }

  const triggerUpload = (type:'photo'|'video'|'cover') => { setFileType(type); fileRef.current?.click() }
  const onFileChange = async (e:any) => {
    const file = e.target.files?.[0]; if(!file ||!profile) return
    setUploading(true)
    try{
      const ext = file.name.split('.').pop()
      const path = `${profile.id}/${fileType}_${Date.now()}.${ext}`
      await supabase.storage.from('posts').upload(path, file, { upsert:true })
      const { data } = supabase.storage.from('posts').getPublicUrl(path)
      if(fileType==='cover'){
        await supabase.from('profiles').update({ cover_url: data.publicUrl }).eq('id', profile.id)
        setProfile({...profile, cover_url: data.publicUrl})
      } else {
        await supabase.from('posts').insert({ user_id: profile.id, image_url: data.publicUrl, type: fileType })
        load()
      }
    }catch(err:any){ alert(err.message) }
    setUploading(false)
  }

  if(loading) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white font-black">Loading...</div>

  if(isOnboarding){
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute -top-[200px] -left-[200px] w-[600px] h-[600px] bg-[#FF7A45]/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[200px] -right-[200px] w-[600px] h-[600px] bg-[#0F4C5C]/30 rounded-full blur-[120px]" />
        <div className="w-full max-w-[400px] relative z-10">
          <p className="text-[11px] tracking-[0.3em] opacity-30 font-bold">DRISYAMN • SILIGURI</p>
          <h1 className="text-[46px] leading-[0.9] mt-3 tracking-tight font-black">Craft<br/>your<br/>identity.</h1>
          <div className="bg-[#141414] rounded-[28px] p-6 border border-white/[0.06] mt-8">
            <div className="space-y-5">
              <input value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} placeholder="Full Name - Rahul Sharma" className="w-full h-[56px] rounded-[16px] bg-[#1C1C1C] border border-white/10 px-5 outline-none" />
              <input value={form.username} onChange={e=>setForm({...form, username:e.target.value})} placeholder="Username - rahul_siliguri" className="w-full h-[56px] rounded-[16px] bg-[#1C1C1C] border border-white/10 px-5 outline-none" />
              <textarea value={form.bio} onChange={e=>setForm({...form, bio:e.target.value})} placeholder="Bio..." className="w-full h-[88px] rounded-[16px] bg-[#1C1C1C] border border-white/10 p-4 px-5 outline-none resize-none" />
              <button onClick={handleCreate} disabled={creating} className="w-full h-[56px] rounded-full bg-white text-black font-black">{creating?'Creating...':'Continue →'}</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if(!profile) return <div className="min-h-screen bg-[#EDE6D3] flex items-center justify-center"><div className="bg-white rounded-[32px] p-8 text-center shadow-xl"><p className="text-[48px]">😕</p><p className="font-black text-[20px]">User not found @{username}</p><button onClick={()=>router.push('/')} className="mt-4 bg-black text-white px-6 py-2 rounded-full text-[12px] font-bold">Go Home</button></div></div>

  const isOwn = me?.id===profile.id

  return (
    <div className="min-h-screen bg-[#EDE6D3] pb-[130px]">
      <input ref={fileRef} type="file" hidden accept={fileType==='video'?'video/*':'image/*'} onChange={onFileChange} />
      <div className="max-w-[480px] mx-auto">
        <div className="p-3">
          <div className="relative h-[220px] rounded-[32px] overflow-hidden bg-[#EFE9DE] shadow-xl">
            <img src={profile.cover_url || `https://picsum.photos/seed/${profile.id}/800/400`} className="w-full h-full object-cover" alt="" />
            {isOwn && <button onClick={()=>triggerUpload('cover')} className="absolute top-4 right-4 h-9 px-4 rounded-full bg-white/90 backdrop-blur-xl text-[12px] font-bold shadow">{uploading?'...':'✎ Change'}</button>}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2"><div className="w-[96px] h-[96px] rounded-full p-[3px] bg-white shadow-xl"><div className="w-full h-full rounded-full bg-[#EDE6D3] flex items-center justify-center text-[40px] font-black">{profile.full_name?.[0]?.toUpperCase()}</div></div></div>
          </div>
        </div>
        <div className="px-3 space-y-3 mt-12">
          <div className="bg-white rounded-[32px] p-6 pt-10 shadow-[0_12px_40px_rgba(0,0,0,0.06)] text-center">
            <h1 className="text-[32px] font-black tracking-tight leading-none">{profile.full_name}</h1>
            <p className="text-[11px] font-bold tracking-widest opacity-30 uppercase mt-2">@{profile.username} • SILIGURI</p>
            <p className="text-[15px] opacity-60 mt-3">{profile.bio}</p>
            <div className="grid grid-cols-2 mt-6 bg-[#F6F1E6] rounded-[20px] p-3">
              <div className="text-center"><p className="text-[22px] font-black">{stats.posts}</p><p className="text-[10px] font-bold opacity-40">POSTS</p></div>
              <div className="text-center border-l border-black/10"><p className="text-[22px] font-black">{stats.friends}</p><p className="text-[10px] font-bold opacity-40">FRIENDS</p></div>
            </div>
            {!isOwn && <button onClick={handleFriend} className={`mt-5 w-full h-[52px] rounded-full font-black text-[13px] ${friendStatus==='friends'?'bg-[#F6F1E6] text-black':'bg-black text-white'}`}>{friendStatus==='none'?'Add Friend':friendStatus==='requested'?'Requested':friendStatus==='incoming'?'Accept Request':'Friends ✓'}</button>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {posts.map((po:any)=><div key={po.id} className="bg-white rounded-[24px] overflow-hidden aspect-square"><img src={po.image_url} className="w-full h-full object-cover" /></div>)}
          </div>
        </div>
      </div>
      {isOwn && <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(16px,env(safe-area-inset-bottom))] bg-gradient-to-t from-[#EDE6D3] to-transparent"><div className="max-w-[480px] mx-auto flex justify-center"><div className="bg-[#111] rounded-full p-1.5 flex gap-1.5 shadow-xl"><button onClick={()=>triggerUpload('photo')} className="h-11 px-6 rounded-full bg-white text-black font-bold text-[12px]">📷 Photo</button><button onClick={()=>triggerUpload('video')} className="h-11 px-6 rounded-full bg-white/10 text-white font-bold text-[12px]">▶ Video</button></div></div></div>}
    </div>
  )
}