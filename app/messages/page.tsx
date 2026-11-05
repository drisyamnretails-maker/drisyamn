"use client";
import { useRouter } from 'next/navigation';

export default function MessagesPage() {
  const router = useRouter();

  const onlineUsers = [
    { id: 'you', name: 'You', img: 'https://i.pravatar.cc/100?img=5' },
    { id: '2', name: 'Emma', img: 'https://i.pravatar.cc/100?img=32' },
    { id: '3', name: 'Noah', img: 'https://i.pravatar.cc/100?img=11' },
    { id: '4', name: 'Olivia', img: 'https://i.pravatar.cc/100?img=8' },
    { id: '5', name: 'Liam', img: 'https://i.pravatar.cc/100?img=15' },
    { id: '6', name: 'Ava', img: 'https://i.pravatar.cc/100?img=6' },
    { id: '7', name: 'James', img: 'https://i.pravatar.cc/100?img=12' },
  ];

  const chats = [
    { id: '2', name: 'Emma', msg: "Sounds good! I'll send it over now 💌", time: '2m', img: 'https://i.pravatar.cc/100?img=32' },
    { id: '4', name: 'Noah', msg: 'Got it, thank you — see you tomorrow', time: '12m', img: 'https://i.pravatar.cc/100?img=8' },
    { id: '5', name: 'Liam', msg: 'The design looks great ✨', time: '1h', img: 'https://i.pravatar.cc/100?img=15' },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'#F6F1E8', display:'flex', justifyContent:'center' }}>
      <div style={{ width:'100%', maxWidth:'720px', minHeight:'100vh', background:'#FFFEFB' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          * { font-family:'Inter', sans-serif !important; }
          
          .m-top { background:#F6F1E8; padding:16px 20px 18px; border-bottom:1px solid #EFE5D3; }
          .m-head { display:flex; justify-content:space-between; align-items:center; }
          .m-title { font-size:26px; font-weight:700; letter-spacing:-0.6px; color:#121212; }
          .m-icons { display:flex; gap:16px; }
          
          .m-slider-wrap { background:#FFFEFB; padding:14px 0 12px; border-bottom:1px solid #F0E6D3; }
          .m-slider { display:flex; gap:18px; overflow-x:auto; padding:0 16px; scrollbar-width:none; }
          .m-slider::-webkit-scrollbar { display:none; }
          .m-user { display:flex; flex-direction:column; align-items:center; gap:7px; min-width:58px; cursor:pointer; }
          .m-avatar-wrap { position:relative; width:58px; height:58px; }
          .m-avatar { width:58px; height:58px; border-radius:50%; object-fit:cover; border:1.2px solid #E8DCC3; padding:2px; background:#fff; }
          .m-dot { position:absolute; bottom:2px; right:2px; width:12px; height:12px; background:#22C55E; border-radius:50%; border:2px solid #fff; }
          .m-uname { font-size:11.5px; font-weight:500; color:#2D2415; }

          .m-recent-head { padding:16px 20px 8px; font-size:11px; font-weight:600; letter-spacing:1.8px; text-transform:uppercase; color:#B8A994; }
          
          .m-card { display:flex; gap:12px; padding:14px 20px; cursor:pointer; }
          .m-card:active { background:#F6F1E8; }
          .m-card-img-wrap { position:relative; width:48px; height:48px; flex-shrink:0; }
          .m-card-img { width:48px; height:48px; border-radius:50%; object-fit:cover; border:1px solid #E8DCC3; padding:2px; background:#fff; }
          .m-card-dot { position:absolute; bottom:0; right:0; width:11px; height:11px; background:#22C55E; border-radius:50%; border:2px solid #fff; }
          .m-card-name { font-size:14.5px; font-weight:600; color:#121212; line-height:1.1; }
          .m-card-msg { font-size:12.5px; font-weight:400; color:#6B5E4A; margin-top:3px; line-height:1.3; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:220px; }
          .m-card-time { font-size:11px; font-weight:400; color:#B8A994; margin-left:auto; margin-top:2px; }
        `}</style>

        <div className="m-top">
          <div className="m-head">
            <div className="m-title">Messages</div>
            <div className="m-icons">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth="1.7"><circle cx="11" cy="11" r="6"/><path d="M21 21l-4.3-4.3"/></svg>
              <div onClick={()=>router.push('/messages/new')}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth="1.7"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="m-slider-wrap">
          <div className="m-slider">
            {onlineUsers.map(u => (
              <div key={u.id} className="m-user" onClick={()=>router.push(`/messages/${u.id}`)}>
                <div className="m-avatar-wrap">
                  <img src={u.img} className="m-avatar" alt="" />
                  <div className="m-dot" />
                </div>
                <div className="m-uname">{u.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="m-recent-head">Recent</div>
        {chats.map(c => (
          <div key={c.id} className="m-card" onClick={()=>router.push(`/messages/${c.id}`)}>
            <div className="m-card-img-wrap">
              <img src={c.img} className="m-card-img" alt="" />
              <div className="m-card-dot" />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <div className="m-card-name">{c.name}</div>
                <div className="m-card-time">{c.time}</div>
              </div>
              <div className="m-card-msg">{c.msg}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}