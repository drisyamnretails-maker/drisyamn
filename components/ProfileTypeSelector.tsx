"use client";
import { Check } from 'lucide-react';

export type OfferingType = 'retail' | 'cafe' | 'hotel' | 'architect' | 'service' | 'media' | 'vlogger';

const TYPES = [
  { id: 'retail' as OfferingType,    label: 'Retail',    sub: 'store, shops' },
  { id: 'cafe' as OfferingType,      label: 'Cafe',      sub: 'restaurant, foods' },
  { id: 'hotel' as OfferingType,     label: 'Hotel',     sub: 'rooms, stays' },
  { id: 'architect' as OfferingType, label: 'Architect', sub: 'interior, exterior' },
  { id: 'service' as OfferingType,   label: 'Service',   sub: 'teacher, doctor' },
  { id: 'media' as OfferingType,     label: 'Media',     sub: 'news, media' },
  { id: 'vlogger' as OfferingType,   label: 'Vlogger',   sub: 'vlogs, videos' },
];

type Props = {
  selected?: OfferingType | null;
  currentType?: OfferingType | null;
  onSelect?: (t: OfferingType) => void;
  onSelected?: (t: OfferingType) => void;
  showSaveButton?: boolean;
};

export default function ProfileTypeSelector({ selected, currentType, onSelect, onSelected }: Props) {
  const activeType = selected ?? currentType ?? null;
  const handleSelect = (t: OfferingType) => {
    if (onSelect) onSelect(t);
    if (onSelected) onSelected(t);
  };

  return (
    <div className="pts-grid">
      <style>{`
        .pts-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .pts-card { background: #FFF; border: 1.5px solid #E8DCC3; border-radius: 14px; padding: 14px 12px; cursor: pointer; position: relative; min-height: 72px; display: flex; flex-direction: column; justify-content: center; }
        .pts-card.selected { border-color: #2D2415; background: #F3EBD9; }
        .pts-label { font-family: Georgia; font-weight: 700; font-size: 14px; color: #2D2415; }
        .pts-sub { font-family: Georgia; font-size: 11px; color: #8A7D6B; margin-top: 3px; }
        .pts-check { position: absolute; top: 8px; right: 8px; width: 18px; height: 18px; border-radius: 50%; background: #2D2415; display: flex; align-items: center; justify-content: center; }
        @media (max-width: 380px) { .pts-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>
      {TYPES.map(t => {
        const isActive = activeType === t.id;
        return (
          <div key={t.id} className={`pts-card ${isActive ? 'selected' : ''}`} onClick={() => handleSelect(t.id)}>
            {isActive && <div className="pts-check"><Check size={10} color="#FFF" /></div>}
            <div className="pts-label">{t.label}</div>
            <div className="pts-sub">{t.sub}</div>
          </div>
        );
      })}
    </div>
  );
}