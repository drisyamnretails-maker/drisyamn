'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const cats = ["All","Cafe","Fashion","Grocery","Electronics","Bakery","Books","Street Food"]

const shopsData = [
  {id:1, name:"Baker's Dozen", cat:"Bakery", rating:4.6, reviews:"1.2k", dist:"0.8 km", loc:"City Centre", time:"OPEN • Closes at 10pm", offer:"20% OFF above ₹300", delivery:"Free delivery • 20-25 min", img:"https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=600", verified:true},
  {id:2, name:"Urban Threads", cat:"Fashion", rating:4.4, reviews:"890", dist:"1.2 km", loc:"Sevoke Rd", time:"OPEN • Closes at 9:30pm", offer:"", delivery:"COD • 7 days return", img:"https://images.unsplash.com/photo-1445205170230-053b83016050?w=600", verified:true},
  {id:3, name:"FreshMart", cat:"Grocery", rating:4.5, reviews:"2.1k", dist:"1.9 km", loc:"Pradhan Nagar", time:"OPEN • Closes at 11pm", offer:"", delivery:"Delivery in 15-20 min", img:"https://images.unsplash.com/photo-1542838132-92c53300491e?w=600", verified:true},
  {id:4, name:"Momo Ghar", cat:"Street Food", rating:4.9, reviews:"340", dist:"0.6 km", loc:"Hill Cart Rd", time:"OPEN • Till 11:30pm", offer:"Buy 1 Get 1", delivery:"25 min delivery", img:"https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600", verified:false},
]

export default function NearbyShops(){
  const router = useRouter()
  const [active,setActive]=useState("All")
  const [liked,setLiked]=useState<number[]>([])
  const [showMap,setShowMap]=useState(false)

  const filtered = active==="All" ? shopsData : shopsData.filter(s=>s.cat===active)
  
  const goBusiness = (id:number) => {
    // Direct business profile — tere existing structure
    router.push(`/profile/business?id=${id}`)
  }

  return (
    <>
    <style>{`
      *{box-sizing:border-box} body{margin:0; background:#080808; font-family:Inter}
      .card{background:#141414; border:1px solid #232323; border-radius:18px; transition:0.25s}
      .card:hover{border-color:#333; transform:translateY(-2px)}
      .chip{padding:7px 14px; border-radius:20px; font-size:12px; border:1px solid #232323; background:#141414; color:#888; cursor:pointer; white-space:nowrap; transition:0.2s}
      .chip.active{background:#ff2d3f; color:white; border-color:#ff2d3f}
      .chip:hover{color:white; border-color:#444}
      .icon{width:36px; height:36px; border-radius:50%; background:#141414; border:1px solid #232323; display:flex; align-items:center; justifyContent:center; cursor:pointer; transition:0.2s}
      .icon:hover{background:#1e1e1e; transform:scale(1.05)}
    `}</style>

    <div style={{minHeight:"100vh", background:"#080808", color:"white"}}>
      {/* HEADER - Home + Message + Notifications */}
      <div style={{position:"sticky", top:0, zIndex:20, background:"rgba(8,8,8,0.9)", backdropFilter:"blur(20px)", borderBottom:"1px solid #1a1a1a", height:56, display:"flex", alignItems:"center"}}>
        <div style={{maxWidth:1200, margin:"0 auto", width:"100%", padding:"0 16px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div style={{display:"flex", gap:12, alignItems:"center"}}>
            <b onClick={()=>router.push("/home")} style={{fontSize:19, cursor:"pointer"}}>Drisyamn<span style={{color:"#ff2d3f"}}>.</span></b>
            <span style={{fontSize:11, color:"#00e6a8", background:"rgba(0,230,168,0.1)", border:"1px solid rgba(0,230,168,0.2)", padding:"3px 8px", borderRadius:20}}>📍 Siliguri</span>
          </div>
          <div style={{display:"flex", gap:8, alignItems:"center"}}>
            <button onClick={()=>router.push("/home")} style={{background:"#141414", border:"1px solid #232323", color:"#aaa", padding:"7px 12px", borderRadius:20, fontSize:12, cursor:"pointer"}}>Home</button>
            <div className="icon" onClick={()=>router.push("/messages")}>💬</div>
            <div className="icon" onClick={()=>router.push("/notifications")}>🔔</div>
            <button onClick={()=>setShowMap(!showMap)} style={{background:showMap?"white":"#141414", color:showMap?"black":"#aaa", border:"1px solid #232323", padding:"7px 12px", borderRadius:20, fontSize:12, fontWeight:700, cursor:"pointer"}}>{showMap?"List":"Map"}</button>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1200, margin:"0 auto", padding:"14px 16px"}}>
        {/* SEARCH */}
        <div style={{display:"flex", gap:10, overflowX:"auto", marginBottom:12}}>
          <div style={{position:"relative", flex:1, minWidth:200}}>
            <span style={{position:"absolute", left:12, top:9, color:"#666"}}>🔍</span>
            <input placeholder="Search shops, cafe..." style={{width:"100%", background:"#141414", border:"1px solid #232323", borderRadius:20, padding:"8px 12px 8px 32px", color:"white", fontSize:12, outline:"none"}}/>
          </div>
          {cats.map(c=><div key={c} className={`chip ${active===c?'active':''}`} onClick={()=>setActive(c)}>{c}</div>)}
        </div>

        <div style={{display:"flex", justifyContent:"space-between", marginBottom:12}}>
          <b>Nearby Shops</b><span style={{fontSize:12, color:"#666"}}>{filtered.length} places • 2.4 km</span>
        </div>

        {showMap ? (
          <div className="card" style={{height:500, overflow:"hidden"}}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3564!2d88.429!3d26.727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e44104!2sCity%20Centre%20Siliguri!5e0!3m2!1sen!2sin" width="100%" height="100%" style={{border:0, filter:"invert(90%) hue-rotate(180deg)"}} loading="lazy"></iframe>
          </div>
        ) : (
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:12}}>
            {filtered.map(s=>(
              <div key={s.id} className="card" style={{overflow:"hidden", cursor:"pointer"}}>
                <div style={{height:140, position:"relative", overflow:"hidden"}} onClick={()=>goBusiness(s.id)}>
                  <img src={s.img} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
                  <div style={{position:"absolute", top:8, left:8, background:"#ff2d3f", color:"white", fontSize:9, fontWeight:800, padding:"3px 7px", borderRadius:20}}>🔥 TRENDING</div>
                  <div onClick={(e)=>{e.stopPropagation(); setLiked(p=>p.includes(s.id)?p.filter(x=>x!==s.id):[...p,s.id])}} style={{position:"absolute", top:8, right:8, width:32, height:32, borderRadius:"50%", background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer"}}>{liked.includes(s.id)?"❤️":"🤍"}</div>
                </div>
                <div style={{padding:12}} onClick={()=>goBusiness(s.id)}>
                  <div style={{fontWeight:700, fontSize:15, display:"flex", gap:6}}>{s.name} {s.verified && <span style={{width:16, height:16, background:"#ff2d3f", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"white"}}>✓</span>}</div>
                  <div style={{fontSize:11, color:"#888", marginTop:2}}>{s.cat} • {s.loc}</div>
                  <div style={{fontSize:11, marginTop:8, display:"flex", gap:6, flexWrap:"wrap", alignItems:"center"}}>
                    <b>⭐ {s.rating}</b><span style={{color:"#666"}}>• {s.reviews} • 📍 {s.dist}</span>
                    <span style={{background:"rgba(0,230,168,0.15)", border:"1px solid rgba(0,230,168,0.2)", color:"#00e6a8", padding:"2px 6px", borderRadius:20, fontSize:10, fontWeight:700}}>● {s.time}</span>
                  </div>
                  <div style={{fontSize:11, color:"#aaa", marginTop:8}}>{s.delivery} {s.offer && <span style={{color:"#ff8a8a", background:"rgba(255,45,63,0.1)", border:"1px solid rgba(255,45,63,0.2)", padding:"2px 6px", borderRadius:20, marginLeft:6}}>🏷️ {s.offer}</span>}</div>
                  <div style={{display:"flex", gap:8, marginTop:10}}>
                    <button onClick={(e)=>{e.stopPropagation(); goBusiness(s.id)}} style={{flex:1, background:"white", color:"black", border:"none", padding:"8px", borderRadius:20, fontSize:12, fontWeight:700, cursor:"pointer"}}>View Profile</button>
                    <button onClick={(e)=>{e.stopPropagation(); window.location.href="tel:+91XXXXXXXXXX"}} style={{background:"#1e1e1e", border:"1px solid #2a2a2a", color:"white", padding:"8px 12px", borderRadius:20, fontSize:12, cursor:"pointer"}}>📞 Call</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  )
}