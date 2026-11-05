"use client";
import { useRouter, usePathname } from "next/navigation";

export default function BottomTab() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      id: "home",
      label: "Home",
      path: "/",
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "1.8"}><path d="M3 9L12 2L21 9V20C21 20.55 20.55 21 20 21H15V14H9V21H4C3.45 21 3 20.55 3 20V9Z" /></svg>
      ),
    },
    {
      id: "message",
      label: "Message",
      path: "/messages",
      icon: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 11.5a8.5 8.5 0 0 1-12.5 7.5L3 21l2-5.5A8.5 8.5 0 0 1 21 11.5Z" /></svg>
      ),
    },
    {
      id: "create",
      label: "Create",
      path: "/createreels",
      icon: () => (
        <div className="w-[38px] h-[38px] rounded-[12px] bg-[#C9A86A] border border-[#C9A86A] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(201,168,106,0.35)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14" /></svg>
        </div>
      ),
    },
    {
      id: "notifications",
      label: "Alerts",
      path: "/notifications",
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8"><path d="M12 2a7 7 0 0 0-7 7v4l-1 3h16l-1-3V9a7 7 0 0 0-7-7Z" /><path d="M9 20a3 3 0 0 0 6 0" /></svg>
      ),
    },
    {
      id: "profile",
      label: "Profile",
      path: "/profilesettings",
      icon: (active: boolean) => (
        <div className={`w-[24px] h-[24px] rounded-full overflow-hidden border-[1.5px] ${active ? "border-[#C9A86A]" : "border-[#E5E7EB]"}`}>
          <img src="https://i.pravatar.cc/100?img=12" alt="profile" className="w-full h-full object-cover" />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="h-[110px]" />
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div className="pointer-events-auto w-full max-w-[680px] bg-[#FFFFFF]/95 backdrop-blur-xl border-t border-[#E5E7EB] px-2 pt-4 pb-[calc(8px+env(safe-area-inset-bottom))] flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.04)] md:rounded-t-[20px] md:border md:mb-2">
          {tabs.map((tab) => {
            const isActive = pathname === tab.path;
            const isCreate = tab.id === "create";
            return (
              <button key={tab.id} onClick={() => router.push(tab.path)} className={`flex flex-col items-center justify-center min-w-[56px] py-1 ${isCreate ? "-mt-1" : ""}`}>
                <div className={`${isActive && !isCreate ? "text-[#111827]" : "text-[#9CA3AF]"} transition-colors`}>
                  {tab.icon(isActive)}
                </div>
                {!isCreate && <span className={`mt-[3px] text-[9px] ${isActive ? "text-[#111827] font-semibold" : "text-[#9CA3AF] font-medium"}`}>{tab.label}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}