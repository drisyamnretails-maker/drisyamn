"use client";
import { useRouter } from "next/navigation";

const ORANGE = "#E86A33";
const DARK = "#1F3A4A";
const PAGE_BG = "#EDE6D3";
const CARD_BG = "#FFFEFB";

const prettyBox: React.CSSProperties = {
  background: CARD_BG,
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 0 0 8px #FFFFFF, 0 0 0 9px rgba(0,0,0,0.10), 0 16px 40px rgba(62,42,20,0.14)",
};

export default function HomePage() {
  const router = useRouter();

  const items = [
    { label: "Discover", icon: DiscoverIcon },
    { label: "Search", icon: SearchIcon },
    { label: "Explore", icon: ExploreIcon },
    { label: "Connect", icon: ConnectIcon },
    { label: "Promote", icon: PromoteIcon },
    { label: "Showcase", icon: ShowcaseIcon },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center py-10 px-4" style={{background:PAGE_BG}}>
      {/* HEADER BOX */}
      <div className="w-full max-w-[620px] rounded-[22px] p-7 text-center" style={prettyBox}>
        <h1 className="font-serif text-[42px] md:text-[48px] font-bold leading-none" style={{color:DARK}}>
          Drisyamn
        </h1>
        <p className="mt-2 text-[11px] tracking-[0.22em] font-bold opacity-60" style={{color:DARK}}>
          DISCOVER EVERYTHING AROUND YOU
        </p>
      </div>

      {/* GRID - HAR BOX ME MOTI WHITE BORDER */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-[360px] md:max-w-[600px]">
        {items.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className="group rounded-[22px] h-[110px] md:h-[124px] flex flex-col items-center justify-center cursor-pointer hover:-translate-y-1 transition-all duration-300"
            style={prettyBox}
          >
            <div className="group-hover:scale-110 group-hover:rotate-[3deg] transition-transform duration-300">
              <Icon />
            </div>
            <span className="mt-3 text-[13px] md:text-[14px] font-bold" style={{color:DARK}}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* BUTTON */}
      <button
        onClick={() => router.push("/login")}
        className="mt-10 w-full max-w-[360px] md:max-w-[240px] h-[52px] rounded-full text-white text-[13px] font-black tracking-[0.14em] hover:-translate-y-0.5 active:scale-[0.98] transition-all"
        style={{background:ORANGE, boxShadow:"0 0 0 6px white, 0 10px 28px rgba(232,106,51,0.4)"}}
      >
        GET STARTED
      </button>

      <div className="mt-6 text-[11px] opacity-50">Matigara • Siliguri • Since 2026</div>
    </main>
  );
}

function DiscoverIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1F3A4A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-6-5.373-6-10a6 6 0 0 1 12 0c0 4.627-6 10-6 10z" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1F3A4A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
function ExploreIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1F3A4A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
function ConnectIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="#1F3A4A">
      <circle cx="8" cy="8" r="4" />
      <path d="M2 18c0-2.5 2-4.5 6-4.5s6 2 6 4.5v1H2v-1z" />
      <circle cx="16" cy="8" r="4" />
      <path d="M14 18c0-2.5 2-4.5 6-4.5s6 2 6 4.5v1h-12v-1z" transform="translate(-2 0)" />
    </svg>
  );
}
function PromoteIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1F3A4A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l18-5v12L3 13v-2z" />
      <path d="M11.5 16.5a2.5 2.5 0 0 1 0 4" />
    </svg>
  );
}
function ShowcaseIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1F3A4A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 16.8 6.4 19.2l1.1-6.2L3 8.6l6.2-.9L12 2z" />
    </svg>
  );
}