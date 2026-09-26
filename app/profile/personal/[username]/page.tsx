'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const PAGE_BG = "#EDE6D3"

export default function PersonalProfilePage() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string

  const [profile, setProfile] = useState<any>(null)
  const [me, setMe] = useState<any>(null)
  const [stats, setStats] = useState({ posts: 0, friends: 0 })
  const [friendStatus, setFriendStatus] = useState<'none'|'requested'|'incoming'|'friends'>('none')
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
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

    const { data: p, error } = await supabase.from('profiles').select('*').eq('username', username).maybeSingle()

    if(error ||!p){
      console.log("Profile not found:", error)
      setProfile(null)
      setLoading(false)
      return
    }

    setProfile(p)

    // Stats
    const { count: postCount } = await supabase.from('posts').select('id', { count:'exact', head:true }).eq('user_id', p.id)
    const { count: friendsCount } = await supabase.from('friendships').select('id', { count:'exact', head:true }).or(`user1.eq.${p.id},user2.eq.${p.id}`).eq('status','friends')

    const { data: allPosts } = await supabase.from('posts').select('*').eq('user_id', p.id).order('created_at',{ascending:false})

    setStats({ posts: postCount||0, friends: friendsCount||0 })
    setPosts(allPosts||[])

    if(user && user.id!== p.id){
      const { data: rel } = await supabase.from('friendships').select('*').or(`and(user1.eq.${user.id},user2.eq.${p.id}),and(user1.eq.${p.id},user2.eq.${user.id})`).maybeSingle()
      if(rel){
        if(rel.status==='pending' && rel.user1===user.id) setFriendStatus('requested')
        else if(rel.status==='pending') setFriendStatus('incoming')
        else setFriendStatus('friends')
      }
    }

    setLoading(false)
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

  if(loading) return <div className="min-h-screen flex items-center justify-center font-black" style={{background:PAGE_BG}}>Loading {username}...</div>

  if(!profile) return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background:PAGE_BG}}>
      <div className="bg-white rounded-[32px] p-8 text-center shadow-xl max-w-[360px] w-full">
        <p className="text-[48px]">😕</p>
        <p className="font-black text-[18px] mt-2">User not found</p>
        <p className="text-[13px] opacity-50 mt-1">@{username}</p>
        <p className="text-[11px] opacity-40 mt-3">Thoda wait kar, Supabase me profile banne me 2 sec lagta hai. Refresh mar.</p>
        <button onClick={()=>router.push('/')} className="mt-5 w-full h-12 bg-black text-white rounded-full text-[12px] font-bold">Go Home</button>
        <button onClick={()=>load()} className="mt-3 w-full h-12 bg-[#F6F1E6] text-black rounded-full text-[12px] font-bold">Refresh</button>
      </div>
    </div>
  )

  const isOwn = me?.id===profile.id

  return (
    <div className="min-h-screen pb-[130px]" style={{background:PAGE_BG}}>
      <input ref={fileRef} type="file" hidden accept={fileType==='video'?'video/*':'image/*'} onChange={onFileChange} />
      <div className="max-w-[480px] mx-auto">
        <div className="p-3">
          <div className="relative h-[220px] rounded-[32px] overflow-hidden bg-[#EFE9DE] shadow-xl">
            <img src={profile.cover_url || `https://picsum.photos/seed/${profile.id}/800/400`} className="w-full h-full object-cover" alt="" />
            {isOwn && <button onClick={()=>triggerUpload('cover')} className="absolute top-4 right-4 h-9 px-4 rounded-full bg-white/90 backdrop-blur-xl text-[12px] font-bold shadow">{uploading?'...':'✎ Change'}</button>}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="w-[96px] h-[96px] rounded-full p-[3px] bg-white shadow-xl">
                <div className="w-full h-full rounded-full bg-[#EDE6D3] flex items-center justify-center text-[36px] font-black text-[#1F3A4A]">
                  {profile.full_name?.[0]?.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-3 space-y-3 mt-14">
          <div className="bg-white rounded-[32px] p-6 pt-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)] text-center">
            <h1 className="text-[28px] font-black tracking-tight leading-none text-[#1F3A4A]">{profile.full_name}</h1>
            <p className="text-[11px] font-bold tracking-widest opacity-30 uppercase mt-2">@{profile.username} • SILIGURI</p>
            <p className="text-[14px] opacity-60 mt-3">{profile.bio || `Hi, I am ${profile.full_name}`}</p>
            <div className="grid grid-cols-2 mt-6 bg-[#F6F1E6] rounded-[20px] p-3">
              <div className="text-center"><p className="text-[22px] font-black text-[#1F3A4A]">{stats.posts}</p><p className="text-[10px] font-bold opacity-40">POSTS</p></div>
              <div className="text-center border-l border-black/10"><p className="text-[22px] font-black text-[#1F3A4A]">{stats.friends}</p><p className="text-[10px] font-bold opacity-40">FRIENDS</p></div>
            </div>
            {!isOwn && <button onClick={handleFriend} className={`mt-5 w-full h-[52px] rounded-full font-black text-[13px] ${friendStatus==='friends'?'bg-[#F6F1E6] text-black':'bg-black text-white'}`}>{friendStatus==='none'?'Add Friend':friendStatus==='requested'?'Requested':friendStatus==='incoming'?'Accept Request':'Friends ✓'}</button>}
            {isOwn && <button onClick={()=>router.push('/')} className="mt-5 w-full h-[52px] rounded-full font-black text-[12px] bg-[#F6F1E6] text-black">GO TO HOMEFEED</button>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {posts.length===0 && <div className="col-span-2 bg-white rounded-[24px] p-10 text-center opacity-40 text-[13px] font-bold">No posts yet. Add a photo!</div>}
            {posts.map((po:any)=><div key={po.id} className="bg-white rounded-[24px] overflow-hidden aspect-square"><img src={po.image_url} className="w-full h-full object-cover" /></div>)}
          </div>
        </div>
      </div>
      {isOwn && <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(16px,env(safe-area-inset-bottom))] bg-gradient-to-t from-[#EDE6D3] to-transparent"><div className="max-w-[480px] mx-auto flex justify-center"><div className="bg-[#111] rounded-full p-1.5 flex gap-1.5 shadow-xl"><button onClick={()=>triggerUpload('photo')} className="h-11 px-6 rounded-full bg-white text-black font-bold text-[12px]">📷 Photo</button><button onClick={()=>triggerUpload('video')} className="h-11 px-6 rounded-full bg-white/10 text-white font-bold text-[12px]">▶ Video</button></div></div></div>}
    </div>
  )
}