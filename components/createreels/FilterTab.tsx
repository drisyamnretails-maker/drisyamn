"use client";
import { useState } from "react";

type FilterVals = { normal: number; warm: number; cool: number; bw: number; vintage: number };

export default function FilterTab({
  vals,
  setVals,
  onClose,
}: {
  vals: FilterVals;
  setVals: (v: FilterVals) => void;
  onClose: () => void;
}) {
  const [active, setActive] = useState<keyof FilterVals>("normal");

  const tabs = [
    { key: "normal" as const, label: "Normal" },
    { key: "warm" as const, label: "Warm" },
    { key: "cool" as const, label: "Cool" },
    { key: "bw" as const, label: "B&W" },
    { key: "vintage" as const, label: "Vintage" },
  ];

  return (
    // SAME TRANSPARENT BOX - BADA WIDTH
    <div className="absolute bottom-[108px] left-1/2 -translate-x-1/2 z-30 w-[94%] max-w-[400px] bg-black/15 backdrop-blur-[18px] rounded-[22px] border border-white/15 overflow-visible shadow-[0_8px_32px_rgba(0,0,0,0.25)]">

      <div className="px-5 py-4 flex flex-col gap-4">
        
        <h2 className="text-center text-white text-[14px] font-bold tracking-wide">Choose Filter</h2>

        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`flex-1 h-[40px] rounded-[14px] text-[11px] font-semibold border transition-all
                ${active === t.key ? "bg-[#FF2D2D] text-white border-[#FF2D2D]" : "bg-white/10 text-white/80 border-white/10"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-white text-[13px] font-black tracking-[0.15em] pl-1">{active.toUpperCase()}</span>
            <span className="bg-[#FF2D2D] text-white text-[11px] font-bold min-w-[32px] h-[20px] flex items-center justify-center rounded-full px-2">
              {vals[active]}
            </span>
          </div>

          <div className="relative h-[4px] bg-white/20 rounded-full w-full">
            <div className="absolute h-full bg-[#FF2D2D] rounded-full" style={{ width: `${vals[active]}%` }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-[14px] h-[14px] bg-white rounded-full border-2 border-[#FF2D2D] shadow-sm" style={{ left: `calc(${vals[active]}% - 7px)` }} />
            <input type="range" min={0} max={100} value={vals[active]} onChange={(e) => setVals({ ...vals, [active]: Number(e.target.value) })} className="absolute inset-0 h-[24px] -top-[10px] w-full opacity-0 cursor-pointer" />
          </div>

          <div className="flex justify-between text-white/50 text-[10px] px-1">
            <span>0</span><span>50</span><span>100</span>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button onClick={() => setVals({ normal: 0, warm: 0, cool: 0, bw: 0, vintage: 0 })} className="flex-1 h-[44px] rounded-full bg-white/15 backdrop-blur-md text-white text-[13px] font-semibold border border-white/10">Reset</button>
          <button onClick={onClose} className="flex-1 h-[44px] rounded-full bg-[#FF2D2D] text-white text-[13px] font-bold">Apply</button>
        </div>

      </div>
    </div>
  );
}