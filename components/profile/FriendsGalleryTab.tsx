"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Images } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

type Props = { profileId?: string; };

export default function FriendsGalleryTab({ profileId = "" }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab') as 'friends' | 'gallery' | null;
  
  const [activeTab, setActiveTab] = useState<'friends' | 'gallery'>(tabFromUrl === 'gallery' ? 'gallery' : 'friends');
  const [realId, setRealId] = useState<string>(profileId);

  useEffect(() => {
    if (profileId) setRealId(profileId);
    else {
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) setRealId(data.user.id);
      });
    }
  }, [profileId]);

  useEffect(() => { if (tabFromUrl) setActiveTab(tabFromUrl); }, [tabFromUrl]);

  return (
    <>
      <style>{`
        .fg-wrap { 
          width: 100%; 
          max-width: 100%;
          margin-top: 18px; 
          padding: 0 12px; 
          box-sizing: border-box; 
          overflow: hidden;
        }
        .fg-tabs { 
          display: grid; 
          grid-template-columns: 1fr 1fr;
          gap: 8px; 
          background: #FFFFFF; 
          border: 1px solid #D9C9A8; 
          border-radius: 14px; 
          padding: 5px; 
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        .fg-btn { 
          width: 100%;
          min-width: 0;
          height: 42px; 
          border-radius: 10px; 
          font-family: Georgia, serif; 
          font-size: 13px; 
          font-weight: 700; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 6px; 
          cursor: pointer; 
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }
        .fg-btn:active { transform: scale(0.97); }

        /* Mobile chota screen */
        @media (max-width: 380px) { 
          .fg-wrap { padding: 0 10px !important; }
          .fg-btn { font-size: 12px; gap: 4px; height: 40px; }
        }

        /* Desktop - center me */
        @media (min-width: 768px) { 
          .fg-wrap { 
            max-width: 800px; 
            margin: 18px auto 0; 
            padding: 0 24px;
          } 
          .fg-tabs { max-width: 500px; margin: 0 auto; }
        }
      `}</style>

      <div className="fg-wrap">
        <div className="fg-tabs">
          <button onClick={()=>{
            setActiveTab('friends');
            const p = new URLSearchParams(searchParams.toString()); p.set('tab','friends'); router.replace(`?${p.toString()}`,{scroll:false});
          }} className="fg-btn" style={{ 
            border: activeTab==='friends' ? '1px solid #C8A86A' : '1px solid transparent', 
            background: activeTab==='friends' ? '#F3EBD9' : 'transparent', 
            color: '#2D2415',
            boxShadow: activeTab==='friends' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
          }}>
            <Users size={15} /> Friends & Family
          </button>
          <button onClick={()=>{
            setActiveTab('gallery');
            const p = new URLSearchParams(searchParams.toString()); p.set('tab','gallery'); router.replace(`?${p.toString()}`,{scroll:false});
          }} className="fg-btn" style={{ 
            border: activeTab==='gallery' ? '1px solid #C8A86A' : '1px solid transparent', 
            background: activeTab==='gallery' ? '#F3EBD9' : 'transparent', 
            color: '#2D2415',
            boxShadow: activeTab==='gallery' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
          }}>
            <Images size={15} /> Gallery
          </button>
        </div>
      </div>
    </>
  );
}