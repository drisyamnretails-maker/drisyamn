'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const reels = [
  {
    id:1,
    username:"breadby_drisyamn",
    name:"Baker's Dozen",
    verified:true,
    avatar:"🥐",
    img:"https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800",
    video:"https://videos.pexels.com/video-files/3048527/3048527-hd_1920_1080_30fps.mp4",
    caption:"Fresh bread baked daily at 7am 🥖✨ #siliguri #bakery",
    likes:"128.4k",
    liked:false,
    comments:"1.2k",
    shares:"904",
    audio:"Original Sound • breadby_drisyamn",
    loc:"City Centre, Siliguri"
  },
  {
    id:2,
    username:"urban_threads",
    name:"Urban Threads",
    verified:true,
    avatar:"👕",
    img:"https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
    video:"https://videos.pexels.com/video-files/5310859/5310859-hd_1920_1080_25fps.mp4",
    caption:"New winter drop is live 🔥 First in Siliguri!",
    likes:"89.2k",
    liked:false,
    comments:"342",
    shares:"210",
    audio:"Trending • winter vibes",
    loc:"Sevoke Road"
  },
  {
    id:3,
    username:"momo_ghar",
    name:"Momo Ghar",
    verified:false,
    avatar:"🥟",
    img:"https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800",
    video:"https://videos.pexels.com/video-files/4498318/4498318-hd_1920_1080_25fps.mp4",
    caption:"Chicken momo challenge 😋 1 plate in 2 mins",
    likes:"45k",
    liked:true,
    comments:"890",
    shares:"1.1k",
    audio:"Original • momo lover",
    loc:"Hill Cart Road"
  },
]

export default function ReelsPage(){
  const router = useRouter()
  const [data,setData]=useState(reels)
  const [muted,setMuted]=useState(true)
  const [current,setCurrent]=useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // auto detect current reel on scroll
  useEffect(()=>{
    const el = containerRef.current
    if(!el) return
    const onScroll = () => {
      const idx = Math.round(el.scrollTop / window.innerHeight)
      setCurrent(idx)
    }
    el.addEventListener("scroll", onScroll)
    return ()=> el.removeEventListener("scroll", onScroll)
  },[])

  const toggleLike = (id:number) => {
    setData(p=>p.map(r=> r.id===id ? {...r, liked:!r.liked} : r))
  }

  const goBusiness = (id:number) => router.push(`/profile/business?id=${id}`)

  return (
    <>
    <style>{`
      *{box-sizing:border-box} html,body{margin:0; background:#000; font-family:Inter}
      .reels-wrap{height:100vh; overflow-y:scroll; scroll-snap-type:y mandatory; scrollbar-width:none}
      .reels-wrap::-webkit-scrollbar{display:none}
      .reel{height:100vh; width:100%; scroll-snap-align:start; position:relative; background:#000; display:flex; justify-content:center; overflow:hidden}
      .reel-media{height:100%; width:100%; max-width:430px; object-fit:cover; background:#111}
      .grad{position:absolute; inset:0; background:linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 25%, transparent 60%, rgba(0,0,0,0.85) 100%)}
      .action{width:52px; height:52px; border-radius:50%; background:rgba(30,30,30,0.6); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.12); display:flex; align-items:center; justifyContent:center; cursor:pointer; transition:all 0.2s; flex-direction:column}
      .action:hover{transform:scale(1.08); background:rgba(50,50,50,0.8); border-color:rgba(255,255,255,0.2)}
      .action:active{transform:scale(0.96)}
      .follow{ background:white; color:black; border:none; padding:5px 14px; border-radius:20px; font-size:12px; font-weight:800; cursor:pointer; transition:0.2s}
      .follow:hover{transform:scale(1.05)}
      .pill{ background:rgba(255,255,255,0.14); border:1px solid rgba(255,255,255,0.18); color:white; padding:7px 14px; border-radius:20px; font-size:12px; cursor:pointer; transition:0.2s}
      .pill:hover{background:rgba(255,255,255,0.22); transform:translateY(-1px)}
      .pill.primary{background:#ff2d3f; border-color:#ff2d3f; font-weight:700}
      .pill.primary:hover{background:#ff1a2e}
      @media(max-width:768px){ .reel-media{max-width:100%} }
    `}</style>

    <div style={{background:"#000", color:"white"}}>
      {/* HEADER */}
      <div style={{position:"fixed", top:0, left:0, right:0, zIndex:50, height:56, background:"rgba(0,0,0,0.72)", backdropFilter:"blur(18px)", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center"}}>
        <div style={{maxWidth:1300, margin:"0 auto", width:"100%", padding:"0 16px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div style={{display:"flex", alignItems:"center", gap:10}}>
            <b onClick={()=>router.push("/home")} style={{fontSize:20, cursor:"pointer"}}>Drisyamn<span style={{color:"#ff2d3f"}}>.</span></b>
            <span style={{fontSize:12, color:"#888", marginLeft:6}}>Reels</span>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:8}}>
            <button onClick={()=>router.push("/home")} style={{background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.1)", color:"white", padding:"7px 14px", borderRadius:20, fontSize:12, cursor:"pointer"}}>🏠 Home</button>
            <div onClick={()=>router.push("/messages")} style={{width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer"}}>💬</div>
            <div onClick={()=>router.push("/notifications")} style={{width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", position:"relative"}}>🔔<span style={{position:"absolute", top:-2, right:-2, width:8, height:8, background:"#ff2d3f", borderRadius:"50%"}}></span></div>
            <button onClick={()=>router.push("/shops")} style={{background:"#141414", border:"1px solid #232323", color:"#aaa", padding:"7px 12px", borderRadius:20, fontSize:12, cursor:"pointer"}}>🛍️ Shops</button>
          </div>
        </div>
      </div>

      {/* FEED */}
      <div ref={containerRef} className="reels-wrap">
        {data.map((r, idx)=>(
          <div key={r.id} className="reel">
            {/* Video / Image */}
            <video
              src={r.video}
              poster={r.img}
              autoPlay={current===idx}
              muted={muted}
              loop
              playsInline
              className="reel-media"
              onClick={()=>setMuted(!muted)}
            />

            <div className="grad"></div>

            {/* Top mute indicator */}
            <div style={{position:"absolute", top:70, left:"50%", transform:"translateX(-50%)", zIndex:5, background:"rgba(0,0,0,0.5)", padding:"6px 12px", borderRadius:20, fontSize:11, display:muted? "flex":"none", gap:6, alignItems:"center"}}>
              🔇 Tap to unmute
            </div>

            {/* RIGHT ACTIONS - like comment share */}
            <div style={{position:"absolute", right:10, bottom:90, display:"flex", flexDirection:"column", gap:16, alignItems:"center", zIndex:10}}>
              <div style={{textAlign:"center"}}>
                <div className="action" onClick={()=>toggleLike(r.id)} style={{background:r.liked?"#ff2d3f":"rgba(30,30,30,0.6)", borderColor:r.liked?"#ff2d3f":"rgba(255,255,255,0.12)"}}>
                  <span style={{fontSize:22}}>{r.liked?"❤️":"🤍"}</span>
                </div>
                <div style={{fontSize:12, fontWeight:700, marginTop:6}}>{r.likes}</div>
              </div>
              <div style={{textAlign:"center"}}>
                <div className="action">💬</div>
                <div style={{fontSize:11, marginTop:6}}>{r.comments}</div>
              </div>
              <div style={{textAlign:"center"}}>
                <div className="action">↗️</div>
                <div style={{fontSize:11, marginTop:6}}>{r.shares}</div>
              </div>
              <div className="action" style={{width:36, height:36}}>⋯</div>
              <div style={{width:46, height:46, borderRadius:10, overflow:"hidden", border:"2px solid white", boxShadow:"0 4px 20px rgba(0,0,0,0.5)"}}>
                <img src={r.img} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
              </div>
            </div>

            {/* BOTTOM INFO */}
            <div style={{position:"absolute", left:12, right:76, bottom:18, zIndex:10}}>
              <div style={{display:"flex", alignItems:"center", gap:8}}>
                <div style={{width:34, height:34, borderRadius:"50%", background:"#222", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, border:"1px solid rgba(255,255,255,0.2)"}}>{r.avatar}</div>
                <span style={{fontWeight:700, fontSize:13}}>@{r.username}</span>
                {r.verified && <span style={{width:16, height:16, background:"#ff2d3f", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9}}>✓</span>}
                <button className="follow" onClick={()=>goBusiness(r.id)}>Follow</button>
              </div>
              <div style={{fontSize:13, marginTop:10, lineHeight:1.35, maxWidth:320}}>{r.caption}</div>
              <div style={{display:"flex", alignItems:"center", gap:8, marginTop:8, fontSize:11, color:"#ddd"}}>
                <span>🎵 {r.audio}</span>
                <span style={{opacity:0.6}}>•</span>
                <span>📍 {r.loc}</span>
              </div>
              <div style={{display:"flex", gap:8, marginTop:12}}>
                <button className="pill" onClick={()=>goBusiness(r.id)}>View Profile</button>
                <button className="pill primary" onClick={()=>window.location.href="tel:+91XXXXXXXXXX"}>📞 Call</button>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{position:"absolute", top:56, left:0, right:0, height:2, background:"rgba(255,255,255,0.15)", zIndex:20}}>
              <div style={{height:"100%", background:"white", width: current===idx ? "100%" : "0%", transition: current===idx ? "width 15s linear" : "none"}}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}