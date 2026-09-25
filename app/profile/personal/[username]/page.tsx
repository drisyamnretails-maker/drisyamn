'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const { username } = useParams() as { username: string }
  const [profile, setProfile] = useState<any>(null)
  const [me, setMe] = useState<any>(null)
  const [stats, setStats] = useState({ posts: 0, friends: 0 })
  const [friendStatus, setFriendStatus] = useState<'none'|'requested'|'incoming'|'friends'>('none')
  const [posts, setPosts] = useState<any[]>([])
  const [tab, setTab] = useState('Posts')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [fileType, setFileType] = useState<'photo'|'video'|'cover'>('photo')

  useEffect(()=>{ if(username) load() }, [username])

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if(user){
      const { data: my } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setMe(my)
    }
    const { data: p } = await supabase.from('profiles').select('*').eq('username', username).single()
    if(!p) return
    setProfile(p)

    const [postC, friendsC, relation, allPosts] = await Promise.all([
      supabase.from('posts').select('id', { count:'exact', head:true }).eq('user_id', p.id),
      supabase.from('friendships').select('id', { count:'exact', head:true }).or(`user1.eq.${p.id},user2.eq.${p.id}`).eq('status','friends'),
      user? supabase.from('friendships').select('*').or(`and(user1.eq.${user.id},user2.eq.${p.id}),and(user1.eq.${p.id},user2.eq.${user.id})`).maybeSingle() : { data:null } as any,
      supabase.from('posts').select('*').eq('user_id', p.id).order('created_at',{ascending:false})
    ])

    setStats({ posts: postC.count||0, friends: friendsC.count||0 })
    setPosts(allPosts.data||[])

    if(relation.data){
      if(relation.data.status==='pending' && relation.data.user1===user?.id) setFriendStatus('requested')
      else if(relation.data.status==='pending') setFriendStatus('incoming')
      else setFriendStatus('friends')
    }

    if(user && user.id!==p.id){
      await supabase.from('profile_views').insert({ viewer_id: user.id, viewed_id: p.id })
    }
  }

  const handleFriend = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if(!user) return alert('Login karo')
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

  const triggerUpload = (type:'photo'|'video'|'cover') => {
    setFileType(type)
    fileRef.current?.click()
  }

  const onFileChange = async (e:any) => {
    const file = e.target.files?.[0]
    if(!file ||!profile) return
    setUploading(true)
    try{
      const ext = file.name.split('.').pop()
      const path = `${profile.id}/${fileType}_${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('posts').upload(path, file)
      if(error) throw error
      const { data } = supabase.storage.from('posts').getPublicUrl(path)
      const url = data.publicUrl

      if(fileType==='cover'){
        await supabase.from('profiles').update({ cover_url: url }).eq('id', profile.id)
        setProfile({...profile, cover_url: url })
      } else {
        await supabase.from('posts').insert({ user_id: profile.id, image_url: url, type: fileType, likes:0, views:0 })
        load()
      }
    }catch(err:any){ alert(err.message) }
    setUploading(false)
  }

  if(!profile) return <div className="min-h-screen bg-[#E8DCC5] flex items-center justify-center font-black">Loading {username}...</div>

  const isOwn = me?.id===profile.id

  return (
    <div className="min-h-screen bg-[#E8DCC5] pb-24">
      <input ref={fileRef} type="file" hidden accept={fileType==='video'?'video/*':'image/*'} onChange={onFileChange} />

      <div className="max-w-[480px] mx-auto">
        <div className="p-3">
          <div className="relative h-[260px] rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] bg-[#EFE9DE]">
            <img src={profile.cover_url || `https://picsum.photos/seed/${profile.id}/800/400`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            {isOwn && (
              <button onClick={()=>triggerUpload('cover')} className="absolute top-4 right-4 h-9 px-4 rounded-full bg-white/90 backdrop-blur-xl shadow-lg text-[12px] font-bold flex items-center gap-1">
                {uploading && fileType==='cover'? '...' : '✎ Change cover'}
              </button>
            )}
            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
              <div className="w-[112px] h-[112px] rounded-full p-1 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
                <div className="w-full h-full rounded-full bg-[#E8DCC5] flex items-center justify-center text-[52px] font-black text-[#2b1d14]">
                  {profile.full_name?.[0]?.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 space-y-3 mt-2">
          <div className="bg-white rounded-[32px] p-6 pt-20 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white">
            <h1 className="text-[32px] font-black tracking-tight text-center leading-none">{profile.full_name}</h1>
            <p className="text-center text-[13px] font-bold tracking-widest opacity-40 uppercase mt-2">@{profile.username} • Siliguri</p>
            <p className="text-center text-[15px] font-medium opacity-70 mt-3 leading-snug">{profile.bio || 'Siliguri explorer building Drisyamn.'}</p>

            <div className="grid grid-cols-2 mt-6 bg-[#F6F1E6] rounded-[20px] p-3">
              <button onClick={()=>setTab('Posts')} className="text-center"><p className="text-[22px] font-black">{stats.posts}</p><p className="text-[10px] font-bold opacity-40">POSTS</p></button>
              <button onClick={()=>setTab('Friends')} className="text-center border-l border-black/10"><p className="text-[22px] font-black">{stats.friends}</p><p className="text-[10px] font-bold opacity-40">FRIENDS</p></button>
            </div>

            <div className="flex gap-2 mt-5">
              {!isOwn? (
                <>
                  <button onClick={handleFriend} className={`flex-1 h-[48px] rounded-full font-black text-[14px] active:scale-95 transition-all ${friendStatus==='friends'?'bg-[#EFE9DE] text-black':'bg-[#1a120e] text-white shadow-xl'}`}>
                    {friendStatus==='none'?'Add Friend':friendStatus==='requested'?'Requested':friendStatus==='incoming'?'Accept':'Friends ✓'}
                  </button>
                  <button className="flex-1 h-[48px] rounded-full bg-white border border-black/10 font-black text-[14px]">Message</button>
                </>
              ) : (
                <button onClick={()=>triggerUpload('photo')} className="flex-1 h-[48px] rounded-full bg-[#1a120e] text-white font-black text-[14px]">{uploading?'Uploading...':'+ Create Post'}</button>
              )}
              <button className="w-12 h-[48px] rounded-full bg-white border border-black/10 font-bold">⋯</button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
            {['Posts','About','Photos','Videos','Friends'].map(t=>(
              <button key={t} onClick={()=>setTab(t)} className={`h-11 px-6 rounded-full font-black text-[13px] whitespace-nowrap ${tab===t?'bg-black text-white shadow-md':'bg-white border border-black/5'}`}>{t}</button>
            ))}
          </div>

          {tab==='Posts' && (
            <div className="space-y-3">
              {isOwn && (
                <div className="bg-white rounded-[24px] p-4 shadow-sm flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-[#E8DCC5] flex items-center justify-center font-black">{profile.full_name?.[0]}</div>
                  <button onClick={()=>triggerUpload('photo')} className="flex-1 h-11 rounded-full bg-[#F6F1E6] text-left px-4 text-[14px] opacity-60">What's on your mind, {profile.full_name}?</button>
                </div>
              )}
              <div className="grid grid-cols-3 gap-1.5 rounded-[24px] overflow-hidden">
                {posts.map((p:any)=>(
                  <div key={p.id} className="aspect-[3/4] bg-white relative">
                    {p.type==='video'? <video src={p.image_url} className="w-full h-full object-cover" /> : <img src={p.image_url} className="w-full h-full object-cover" />}
                  </div>
                ))}
              </div>
              {posts.length===0 && <div className="bg-white/60 rounded-[24px] p-12 text-center text-[14px] opacity-40 border border-dashed">No posts yet</div>}
            </div>
          )}

          {tab==='Photos' && (
            <div className="grid grid-cols-3 gap-1.5 rounded-[24px] overflow-hidden">
              {posts.filter(p=>p.type!=='video').map(p=><img key={p.id} src={p.image_url} className="aspect-square object-cover" alt="" />)}
            </div>
          )}

          {tab==='Videos' && (
            <div className="grid grid-cols-2 gap-2">
              {posts.filter(p=>p.type==='video').map(p=><video key={p.id} src={p.image_url} controls className="rounded-[16px] w-full" />)}
            </div>
          )}

          {tab==='About' && (
            <div className="bg-white rounded-[24px] p-6 shadow-sm space-y-4 text-[14px]">
              <div><p className="font-bold opacity-40 text-[11px] uppercase">Bio</p><p className="mt-1 font-medium">{profile.bio}</p></div>
              <div><p className="font-bold opacity-40 text-[11px] uppercase">Location</p><p className="mt-1 font-medium">Siliguri, West Bengal</p></div>
              <div><p className="font-bold opacity-40 text-[11px] uppercase">Joined</p><p className="mt-1 font-medium">{new Date(profile.created_at).toDateString()}</p></div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#1a120e] rounded-full p-2 flex gap-2 shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
        <button onClick={()=>triggerUpload('photo')} className="h-11 px-6 rounded-full bg-white text-black font-black text-[13px]">📷 Photo</button>
        <button onClick={()=>triggerUpload('video')} className="h-11 px-6 rounded-full bg-white/20 text-white font-black text-[13px]">▶ Video</button>
      </div>
    </div>
  )
}