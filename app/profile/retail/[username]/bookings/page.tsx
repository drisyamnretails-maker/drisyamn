"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const ORANGE = "#E86A33";
const DARK = "#1F3A4A";
const PAGE_BG = "#EDE6D3";
const CARD_BG = "#FFFEFB";

const prettyBox: React.CSSProperties = {
  background: CARD_BG,
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 0 0 8px #FFFFFF, 0 0 0 9px rgba(0,0,0,0.10), 0 16px 40px rgba(62,42,20,0.14)",
};

type Booking = {
  id: number;
  product: string;
  name: string;
  contact: string;
  qty: number;
  total: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: number;
  eventType?: string;
  location?: string;
};

const KEYS = {
  BOOKINGS: "bookings",
  DMS: "drisyamn_dms",
  NOTIF: "drisyamn_notifs",
  FOLLOWING: "drisyamn_following",
};

const safeParse = (k: string, f: any) => {
  try {
    const v = typeof window!== "undefined"? localStorage.getItem(k) : null;
    return v? JSON.parse(v) : f;
  } catch {
    return f;
  }
};

export default function RetailBookingsPage() {
  const params = useParams();
  const router = useRouter();
  const username = (params as any)?.username || "retail";

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Confirmed" | "Completed" | "Cancelled">("All");
  const [notifs, setNotifs] = useState<any[]>([]);
  const [dms, setDms] = useState<any[]>([]);
  const [followers] = useState(3421);

  useEffect(() => {
    setBookings(safeParse(KEYS.BOOKINGS, []));
    setNotifs(safeParse(KEYS.NOTIF, []));
    setDms(safeParse(KEYS.DMS, []));
  }, []);

  useEffect(() => {
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
    localStorage.setItem(KEYS.NOTIF, JSON.stringify(notifs));
    localStorage.setItem(KEYS.DMS, JSON.stringify(dms));
  }, [bookings, notifs, dms]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === "Pending").length;
    const confirmed = bookings.filter((b) => b.status === "Confirmed").length;
    const completed = bookings.filter((b) => b.status === "Completed").length;
    const revenue = bookings.filter((b) => b.status!== "Cancelled").reduce((s, b) => s + (b.total || 0), 0);
    const todayRevenue = bookings.filter((b) => {
      const d = new Date(b.createdAt);
      const now = new Date();
      return d.toDateString() === now.toDateString() && b.status!== "Cancelled";
    }).reduce((s, b) => s + b.total, 0);
    return { total, pending, confirmed, completed, revenue, todayRevenue };
  }, [bookings]);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch = search === "" || b.name.toLowerCase().includes(search.toLowerCase()) || b.product.toLowerCase().includes(search.toLowerCase()) || b.contact.includes(search);
      const matchStatus = statusFilter === "All" || b.status === statusFilter;
      return matchSearch && matchStatus;
    }).sort((a,b)=> b.createdAt - a.createdAt);
  }, [bookings, search, statusFilter]);

  const updateStatus = (id: number, status: Booking["status"]) => {
    setBookings((prev) => prev.map((b) => (b.id === id? {...b, status } : b)));
    const booking = bookings.find((b) => b.id === id);
    if (booking) {
      if (status === "Confirmed") {
        setNotifs((n) => [{ id: Date.now().toString(), type: "booking", from: booking.name, text: `Booking Confirmed - ${booking.product}`, time: "Just now", read: false },...n]);
        setDms((d) => [{ id: Date.now().toString(), user: booking.name, lastMsg: `Your booking for ${booking.product} is Confirmed!`, avatar: `https://i.pravatar.cc/150?img=32`, unread: 1 },...d]);
      }
      if (status === "Completed") {
        setNotifs((n) => [{ id: Date.now().toString(), type: "booking", from: booking.name, text: `Booking Completed - ${booking.product}`, time: "Just now", read: false },...n]);
      }
    }
  };

  const deleteBooking = (id: number) => {
    if (!confirm("Delete this booking?")) return;
    setBookings((prev) => prev.filter((b) => b.id!== id));
  };

  const unreadNotif = notifs.filter((n) =>!n.read).length;

  return (
    <div className="min-h-screen pb-24 px-4" style={{ background: PAGE_BG }}>
      {/* NAV - Home | Message | Notification | Bookings - WITH LOGIC */}
      <nav className="w-full max-w-[1280px] mx-auto mt-6 h-[64px] flex justify-between items-center px-7 rounded-[22px] sticky top-6 z-40" style={prettyBox}>
        <Link href={`/profile/retail/${username}`} className="font-serif font-bold text-[22px]" style={{ color: DARK }}>DRISYAMN</Link>
        <div className="flex gap-1.5 items-center text-[12px] font-bold">
          <Link href="/homefeed" className="px-4 py-2 rounded-full bg-[#F6F1E6] border">Home</Link>
          <Link href="/messages" className="relative px-4 py-2 rounded-full bg-[#F6F1E6] border">Message{dms.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full grid place-items-center">{dms.length}</span>}</Link>
          <button onClick={() => setNotifs((prev) => prev.map((n) => ({...n, read: true })))} className="relative px-4 py-2 rounded-full bg-[#F6F1E6] border">🔔 Notification{unreadNotif > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF7A45] text-white text-[10px] rounded-full grid place-items-center">{unreadNotif}</span>}</button>
          <div className="px-5 py-2 rounded-full text-white" style={{ background: DARK }}>{bookings.length} Bookings</div>
        </div>
      </nav>

      <div className="w-full max-w-[1280px] mx-auto mt-10">
        {/* HEADER STATS */}
        <div className="rounded-[22px] p-6" style={prettyBox}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-black text-[22px]" style={{ color: DARK }}>Bookings Management</h1>
              <p className="text-[12px] opacity-60 mt-1">{username} • {followers} followers • Total Revenue ₹{stats.revenue}</p>
            </div>
            <Link href={`/profile/retail/${username}`} className="px-5 py-2 rounded-full bg-[#F6F1E6] border text-[12px] font-bold">← Back to Store</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-6">
            <div className="bg-[#F6F1E6] rounded-[14px] p-3 border text-center"><div className="font-black text-[20px]" style={{ color: DARK }}>{stats.total}</div><div className="text-[10px] font-bold opacity-60">TOTAL</div></div>
            <div className="bg-yellow-50 rounded-[14px] p-3 border border-yellow-200 text-center"><div className="font-black text-[20px] text-yellow-700">{stats.pending}</div><div className="text-[10px] font-bold text-yellow-700">PENDING</div></div>
            <div className="bg-green-50 rounded-[14px] p-3 border border-green-200 text-center"><div className="font-black text-[20px] text-green-700">{stats.confirmed}</div><div className="text-[10px] font-bold text-green-700">CONFIRMED</div></div>
            <div className="bg-blue-50 rounded-[14px] p-3 border border-blue-200 text-center"><div className="font-black text-[20px] text-blue-700">{stats.completed}</div><div className="text-[10px] font-bold text-blue-700">COMPLETED</div></div>
            <div className="bg-[#FFFBF2] rounded-[14px] p-3 border text-center"><div className="font-black text-[20px]" style={{ color: ORANGE }}>₹{stats.revenue}</div><div className="text-[10px] font-bold opacity-60">TOTAL REVENUE</div></div>
            <div className="bg-[#0F4C5C] text-white rounded-[14px] p-3 border text-center"><div className="font-black text-[20px]">₹{stats.todayRevenue}</div><div className="text-[10px] font-bold opacity-80">TODAY</div></div>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, product, phone..." className="flex-1 min-w-[200px] border rounded-full px-4 py-2.5 text-[13px] bg-[#F6F1E6] outline-none" />
            <div className="flex gap-1.5 bg-[#F6F1E6] rounded-full p-1 border">
              {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map((s) => (
                <button key={s} onClick={() => setStatusFilter(s as any)} className={`px-4 py-1.5 rounded-full text-[11px] font-bold ${statusFilter === s? "bg-black text-white" : "bg-white border"}`}>{s}</button>
              ))}
            </div>
            <button onClick={() => { if(confirm("Clear all bookings?")){ setBookings([]); } }} className="px-4 py-2 rounded-full bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold">Clear All</button>
          </div>
        </div>

        {/* BOOKINGS LIST */}
        <div className="mt-6 rounded-[22px] p-6" style={prettyBox}>
          <div className="font-black text-[13px] tracking-widest mb-4" style={{ color: DARK }}>ALL BOOKINGS - {filtered.length} / {bookings.length}</div>

          {filtered.length === 0? (
            <div className="py-16 text-center"><div className="text-[48px]">📦</div><p className="text-[14px] font-bold mt-2" style={{ color: DARK }}>No bookings found</p><p className="text-[12px] opacity-60 mt-1">{search || statusFilter!== "All"? "Try changing filter" : "When customers book, it will show here"}</p><Link href={`/profile/retail/${username}`} className="inline-block mt-4 px-6 py-2 rounded-full text-white text-[12px] font-bold" style={{ background: ORANGE }}>Go to Store</Link></div>
          ) : (
            <div className="space-y-3">
              {filtered.map((b) => (
                <div key={b.id} className="bg-[#F6F1E6] rounded-[16px] border p-4 flex flex-col md:flex-row justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-white border shadow grid place-items-center font-black text-[14px]" style={{ color: DARK }}>{b.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <p className="font-bold text-[14px]">{b.name} • {b.contact}</p>
                      <p className="text-[12px] mt-0.5"><b>{b.product}</b> • Qty: {b.qty} • ₹{b.total}</p>
                      <p className="text-[11px] opacity-60 mt-1">📅 {new Date(b.createdAt).toLocaleString()} {b.location? `• 📍 ${b.location}` : ""} {b.eventType? `• ${b.eventType}` : ""}</p>
                      <div className="flex gap-1.5 mt-2">
                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold border ${b.status === "Pending"? "bg-yellow-100 text-yellow-700 border-yellow-200" : b.status === "Confirmed"? "bg-green-100 text-green-700 border-green-200" : b.status === "Completed"? "bg-blue-100 text-blue-700 border-blue-200" : "bg-red-100 text-red-700 border-red-200"}`}>{b.status}</span>
                        <span className="text-[10px] px-2 py-1 rounded-full bg-white border">ID: {b.id.toString().slice(-6)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:items-end">
                    <div className="flex gap-1.5">
                      <select value={b.status} onChange={(e) => updateStatus(b.id, e.target.value as any)} className="text-[11px] border rounded-full px-3 py-1.5 bg-white font-bold outline-none">
                        <option>Pending</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option>
                      </select>
                      <button onClick={() => deleteBooking(b.id)} className="w-8 h-8 rounded-full bg-red-50 border border-red-200 text-red-600 grid place-items-center">✕</button>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => { router.push(`/messages?user=${b.name}`); setDms((d) => [{ id: Date.now().toString(), user: b.name, lastMsg: `Hi ${b.name}, about ${b.product}`, avatar: `https://i.pravatar.cc/150?img=32` },...d]); }} className="px-3 py-1.5 rounded-full bg-white border text-[11px] font-bold">💬 Message</button>
                      <a href={`tel:${b.contact}`} className="px-3 py-1.5 rounded-full bg-black text-white text-[11px] font-bold">📞 Call</a>
                    </div>
                    {b.status === "Pending" && <button onClick={() => updateStatus(b.id, "Confirmed")} className="w-full md:w-auto px-6 py-2 rounded-full text-white text-[11px] font-bold" style={{ background: ORANGE }}>Confirm Booking →</button>}
                    {b.status === "Confirmed" && <button onClick={() => updateStatus(b.id, "Completed")} className="w-full md:w-auto px-6 py-2 rounded-full text-white text-[11px] font-bold" style={{ background: DARK }}>Mark Completed ✓</button>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SOCIAL ANALYTICS */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="rounded-[22px] p-5" style={prettyBox}><h3 className="font-black text-[12px]">Recent Notifications</h3><div className="mt-3 space-y-2 max-h-[160px] overflow-auto">{notifs.slice(0, 5).map((n) => <div key={n.id} className="text-[11px] bg-[#F6F1E6] rounded-full px-3 py-2 border"><b>{n.from}</b> {n.text} • {n.time}</div>)}{notifs.length === 0 && <p className="text-[11px] opacity-40">No notifications</p>}</div></div>
          <div className="rounded-[22px] p-5" style={prettyBox}><h3 className="font-black text-[12px]">Recent Messages</h3><div className="mt-3 space-y-2">{dms.slice(0, 4).map((m) => <div key={m.id} className="flex gap-2 items-center bg-[#F6F1E6] rounded-full px-3 py-2 border"><img src={m.avatar || `https://i.pravatar.cc/150?img=32`} className="w-6 h-6 rounded-full" alt="" /><span className="text-[11px]"><b>{m.user}</b> • {m.lastMsg?.slice(0, 20)}</span></div>)}{dms.length === 0 && <p className="text-[11px] opacity-40">No messages</p>}</div></div>
          <div className="rounded-[22px] p-5 text-white" style={{ background: DARK, boxShadow: "0 0 0 8px white, 0 0 0 9px rgba(0,0,0,0.10)" }}><h3 className="font-black text-[12px]">Sales Analytics</h3><div className="mt-4"><p className="text-[11px] opacity-70">Total Revenue</p><p className="font-black text-[24px]">₹{stats.revenue}</p><p className="text-[11px] opacity-70 mt-3">Pending Amount</p><p className="font-bold text-[16px]">₹{bookings.filter((b) => b.status === "Pending").reduce((s, b) => s + b.total, 0)}</p></div></div>
        </div>
      </div>
    </div>
  );
}