'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const eventsData = [
  { id: 1, title: 'Bloom & Brew Opening', loc: 'City Centre', time: '11AM', tags: ['HOT', 'NEW SHOP'], image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800', type: 'new' },
  { id: 2, title: 'Siliguri Book Fair', loc: 'City Centre', time: 'Till 15th Sep', tags: ['MELA'], image: 'https://images.unsplash.com/photo-1526243741027-d5585c4e06d4?w=800', type: 'mela' },
  { id: 3, title: 'ISKCON Aarti', loc: 'Sevoke Rd', time: '6PM', tags: ['PUJA'], image: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=800', type: 'puja' },
  { id: 4, title: 'Fashion Sale - 50% OFF', loc: 'Hillcart Rd', time: '10AM-9PM', tags: ['SALE'], image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800', type: 'sale' },
  { id: 5, title: 'Street Food Fest', loc: 'Hong Kong Market', time: '5PM', tags: ['HOT'], image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', type: 'sale' },
  { id: 6, title: 'Durga Puja Pandal', loc: 'City Center', time: '7PM', tags: ['PUJA'], image: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=800', type: 'puja' },
]

const tagColor: any = { HOT: '#FF3B3B', 'NEW SHOP': '#FF3B3B', MELA: '#FFC94A', PUJA: '#C5C6FF', SALE: '#FF4D8D' }

export default function HomePage() {
  const router = useRouter()
  const [filter, setFilter] = useState('ALL')
  const [menuOpen, setMenuOpen] = useState(false)

  const filtered = filter === 'ALL'? eventsData : eventsData.filter(e => e.type === filter.toLowerCase() || e.tags.includes(filter))
  const userRole = typeof window!== 'undefined'? localStorage.getItem('userRole') : 'personal'

  return (
    <>
      <style>{`
       .header-wrap { background: linear-gradient(90deg, #4A4A4A 0%, #2A2A2A 25%, #1A1A1A 50%, #5A0F14 80%, #7A121A 100%); }
       .nav-item { display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.85); font-size: 14px; font-weight: 600; padding: 9px 18px; border-radius: 999px; cursor: pointer; transition: all 0.25s ease; }
       .nav-item:hover { background: #7A121A; color: white; box-shadow: 0 0 20px rgba(122,18,26,0.6); transform: translateY(-1px); }
       .nav-item.active { background: #7A121A; color: white; box-shadow: 0 0 15px rgba(122,18,26,0.5); }
       .event-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 768px) {.event-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1100px) {.event-grid { grid-template-columns: repeat(3, 1fr); }.main-width { max-width: 1200px!important; } }
       .chip-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', justifyContent: 'center' }}>
        <div className="main-width" style={{ width: '100%', maxWidth: '450px', background: '#000', minHeight: '100vh', borderLeft: '1px solid rgba(255,255,255,0.05)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>

          {/* HEADER */}
          <div className="header-wrap" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <h1 onClick={() => router.push('/home')} style={{ color: 'white', fontSize: '26px', fontWeight: '900', cursor: 'pointer', letterSpacing: '-0.5px' }}>Drisyamn</h1>

            {/* Desktop Menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
              <div onClick={() => router.push('/home')} className="nav-item active">🏠 Home</div>
              <div onClick={() => router.push('/messages')} className="nav-item">💬 Message</div>
              <div onClick={() => router.push('/notifications')} className="nav-item">🔔 Notifications</div>
              <div onClick={() => router.push(`/profile/${userRole}`)} style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#333', marginLeft: '10px', cursor: 'pointer', border: '2px solid rgba(255,255,255,0.2)', overflow: 'hidden' }}>
                <img src="https://i.pravatar.cc/100?img=12" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>

            {/* Mobile Hamburger */}
            <div onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none' }} className="mob-ham">
              {/* Will show via media query */}
            </div>
          </div>

          {/* Mobile Dropdown Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', background: '#111' }} className="md:hidden-flex">
             <div style={{ display: 'flex', gap: '16px' }}>
                <span onClick={() => router.push('/home')} style={{ color: 'white', fontWeight: '700', borderBottom: '2px solid #7A121A' }}>Home</span>
                <span onClick={() => router.push('/messages')} style={{ color: 'rgba(255,255,255,0.6)' }}>Message</span>
                <span onClick={() => router.push('/notifications')} style={{ color: 'rgba(255,255,255,0.6)' }}>Notifications</span>
             </div>
          </div>

          {/* HOME HERO */}
          <div style={{ padding: '24px 20px 10px' }}>
            <h2 style={{ color: 'white', fontSize: '30px', fontWeight: '800', lineHeight: '1.1' }}>Discover<br/>Siliguri</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '8px' }}>Local shops, events & people around you</p>
          </div>

          {/* TODAY'S HEADER */}
          <div style={{ padding: '20px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: 'white', fontSize: '17px', fontWeight: '700' }}>🔥 Today's in Siliguri</h2>
            <span onClick={() => router.push('/events')} style={{ color: '#FF3B3B', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>See all</span>
          </div>

          {/* FILTER CHIPS */}
          <div className="chip-scroll" style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '0 20px 16px', scrollbarWidth: 'none' }}>
            {['ALL', 'SALE', 'PUJA', 'MELA', 'NEW SHOP'].map(chip => (
              <div key={chip} onClick={() => setFilter(chip)} style={{ whiteSpace: 'nowrap', background: filter === chip? 'white' : '#1E1E1E', color: filter === chip? 'black' : 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '7px 14px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>{chip}</div>
            ))}
          </div>

          {/* EVENTS GRID - Responsive */}
          <div style={{ padding: '0 16px 100px' }}>
            <div className="event-grid">
              {filtered.map(ev => (
                <div key={ev.id} onClick={() => router.push(`/events/${ev.id}`)} style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{ position: 'relative', height: '180px' }}>
                    <img src={ev.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                      {ev.tags.map(t => <span key={t} style={{ background: tagColor[t], color: t === 'MELA' || t === 'PUJA'? 'black' : 'white', fontSize: '10px', fontWeight: '900', padding: '4px 10px', borderRadius: '999px' }}>{t}</span>)}
                    </div>
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <p style={{ color: 'white', fontWeight: '700', fontSize: '14px' }}>{ev.title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '4px' }}>{ev.loc} • {ev.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Fix for desktop nav visibility */}
      <style>{`
        @media (max-width: 768px) {.desktop-nav { display: none!important; } }
        @media (min-width: 769px) {.md\\:hidden-flex { display: none!important; } }
      `}</style>
    </>
  )
}