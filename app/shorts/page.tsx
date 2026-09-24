'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const shortsData = [
  { id:1, user:"@nature.capture", cap:"Evening calm at the lake #nature", likes:"24k", comments:"342", bg:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4", music:"Evening calm • Ambient Nature" },
  { id:2, user:"@chef.hacks", cap:"3 min pasta hack 🍝 #food", likes:"18.2k", comments:"210", bg:"https://images.unsplash.com/photo-1552611052-33e04de08191", music:"Cooking beats • Original" },
  { id:3, user:"@travel.bug", cap:"Mountain sunrise #travel", likes:"102k", comments:"1.2k", bg:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b", music:"Hills • LoFi" },
]

export default function ShortsPage(){
  const router = useRouter()
  const [idx, setIdx] = useState(0)
  const [liked, setLiked] = useState<number[]>([])
  const cur = shortsData[idx]

  const next = ()=> setIdx((i)=> (i+1)%shortsData.length)

  return (
    <>
    <style>{`
    .glass{backdrop-filter:blur(14px); background:rgba(20,20,20,0.55); border:1px solid rgba(255,255,255,0.12); border-radius:18px}
    .action{width:64px; height:72px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; cursor:pointer; transition:0.25s}
    .action:hover{transform:scale(1.08); border-color:rgba(255,45,63,0.5)!important}
    `}</style>

    <div style={{height:"100vh", background:"black", position:"relative", overflow:"hidden"}}>

      {/* TOP BAR - No Logo import, inline */}
      <div className="glass" style={{position:"absolute", top:12, left:12, right:12, zIndex:20, padding:"10px 14px", display:"flex", alignItems:"center", gap:12}}>
        <button onClick={()=> router.push("/home")} style={{width:42, height:42, borderRadius:"50%", background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", color:"white", fontSize:20, cursor:"pointer"}}>←</button>
        <div style={{display:"flex", alignItems:"center", gap:8}}>
          <div style={{width:32, height:32, background:"linear-gradient(135deg,#7A121A,#ff2d3f)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:900}}>D</div>
          <span style={{color:"white", fontWeight:800}}>Drisyamn</span>
        </div>
        <div style={{marginLeft:"auto", width:120, height:6, background:"rgba(255,255,255,0.15)", borderRadius:6, overflow:"hidden"}}>
          <div style={{width:`${((idx+1)/shortsData.length)*100}%`, height:"100%", background:"linear-gradient(90deg,#7A121A,#ff2d3f)", transition:"0.4s"}}></div>
        </div>
      </div>

      {/* VIDEO */}
      <div onClick={next} style={{height:"100vh", backgroundImage:`url(${cur.bg})`, backgroundSize:"cover", backgroundPosition:"center", cursor:"pointer", position:"relative"}}>
        <div style={{position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%, rgba(0,0,0,0.7) 100%)"}}></div>

        {/* RIGHT ACTIONS */}
        <div style={{position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", display:"flex", flexDirection:"column", gap:12, zIndex:10}}>
          <div className="glass action" onClick={(e)=>{e.stopPropagation(); setLiked(liked.includes(cur.id)? liked.filter(x=>x!==cur.id) : [...liked, cur.id])}}>
            <span style={{fontSize:28, color: liked.includes(cur.id)? "#ff2d3f" : "white"}}>❤️</span>
            <span style={{color:"white", fontSize:12, fontWeight:700}}>{cur.likes}</span>
          </div>
          <div className="glass action" onClick={(e)=>{e.stopPropagation(); alert("Comments")}}>
            <span style={{fontSize:26}}>💬</span><span style={{color:"white", fontSize:12, fontWeight:700}}>{cur.comments}</span>
          </div>
          <div className="glass action" onClick={(e)=>{e.stopPropagation(); alert("Shared!")}}>
            <span style={{fontSize:24, color:"white"}}>↗</span><span style={{color:"white", fontSize:12}}>Share</span>
          </div>
          <div className="glass action"><span style={{fontSize:24, color:"white"}}>🔖</span><span style={{color:"white", fontSize:12}}>Save</span></div>
        </div>

        {/* BOTTOM */}
        <div className="glass" style={{position:"absolute", bottom:18, left:12, right:90, padding:"16px 18px", zIndex:10}}>
          <span style={{color:"white", fontWeight:800}}>{cur.user}</span>
          <p style={{color:"white", fontSize:14, marginTop:6}}>{cur.cap}</p>
          <p style={{color:"rgba(255,255,255,0.7)", fontSize:12, marginTop:8}}>🎵 {cur.music}</p>
        </div>
      </div>
    </div>
    </>
  )
}