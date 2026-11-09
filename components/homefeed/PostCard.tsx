"use client";
import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, Bookmark, Sparkles, Trash2, Link2, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PostCard({ post, onDeleted }: { post: any, onDeleted?: () => void }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.like_count || 0);
  const [showMenu, setShowMenu] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLikeCount(post?.like_count || 0);
    setComments([]);
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setCurrentUserId(data.user.id);
        supabase.from('post_likes').select('id').eq('post_id', post.id).eq('user_id', data.user.id).maybeSingle().then(({ data: l }) => setLiked(!!l));
        supabase.from('saved_posts').select('id').eq('post_id', post.id).eq('user_id', data.user.id).maybeSingle().then(({ data: s }) => setSaved(!!s));
      }
    });
    supabase.from('post_likes').select('*', { count: 'exact', head: true }).eq('post_id', post.id).then(({ count }) => setLikeCount(count || 0));
    fetchComments();
  }, [post.id]);

  const fetchComments = async () => {
    const { data: comms } = await supabase.from('post_comments').select('*').eq('post_id', post.id).order('created_at', { ascending: true });
    if (!comms || comms.length === 0) { setComments([]); return; }
    const userIds = [...new Set(comms.map((c: any) => c.user_id))];
    const { data: profs } = await supabase.from('profiles').select('id, username, avatar_url').in('id', userIds);
    const merged = comms.map((c: any) => ({ ...c, profiles: profs?.find((p: any) => p.id === c.user_id) || { username: 'user' } }));
    setComments(merged);
  };

  const handleLike = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (liked) {
      await supabase.from('post_likes').delete().eq('post_id', post.id).eq('user_id', user.id);
      setLiked(false); setLikeCount((c: number) => c - 1);
    } else {
      await supabase.from('post_likes').insert({ post_id: post.id, user_id: user.id });
      setLiked(true); setLikeCount((c: number) => c + 1);
      if (post.user_id !== user.id) await supabase.from('notifications').insert({ user_id: post.user_id, actor_id: user.id, post_id: post.id, type: 'like', message: 'liked your post' });
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('post_comments').insert({ post_id: post.id, user_id: user.id, content: commentText });
    if (post.user_id !== user.id) await supabase.from('notifications').insert({ user_id: post.user_id, actor_id: user.id, post_id: post.id, type: 'comment', message: commentText.slice(0, 40) });
    setCommentText(""); fetchComments(); setShowComments(true);
  };

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (saved) { await supabase.from('saved_posts').delete().eq('post_id', post.id).eq('user_id', user.id); setSaved(false); }
    else { await supabase.from('saved_posts').insert({ post_id: post.id, user_id: user.id }); setSaved(true); }
  };

  const handleDelete = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== post.user_id) return alert("Not allowed");
    const { error } = await supabase.from('posts').delete().eq('id', post.id).eq('user_id', user.id);
    if (error) return alert(error.message);
    setShowMenu(false);
    if (onDeleted) onDeleted();
  };

  const isOwner = currentUserId === post.user_id;

  return (
    <>
      <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto 16px' }}>
        <div style={{ background: '#FFF', borderRadius: 20, border: '1px solid #EFE5D2', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Link href={`/profile/${post.user_id}`} style={{ width: 38, height: 38, borderRadius: '50%', background: '#F8F2E6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontWeight: 700, textDecoration: 'none', color: '#2D2415' }}>
                {post.profiles?.avatar_url ? <img src={post.profiles.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : post.profiles?.full_name?.[0] || 'U'}
              </Link>
              <div><div style={{ fontSize: 14, fontWeight: 700 }}>{post.profiles?.full_name || 'User'}</div><div style={{ fontSize: 11, color: '#888' }}>{new Date(post.created_at).toLocaleDateString()}</div></div>
            </div>
            <div onClick={() => setShowMenu(true)} style={{ padding: '6px 10px', cursor: 'pointer' }}>•••</div>
          </div>

          {post.content && (
            <div style={{ padding: '0 14px 12px' }}>
              <p style={{ margin: 0, fontSize: 14.5, fontWeight: 500, lineHeight: 1.45, color: '#2D2415', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{post.content}</p>
            </div>
          )}

          {post.image_url && (
            <div style={{ padding: '0 6px' }}>
              <div style={{ width: '100%', borderRadius: 16, overflow: 'hidden', background: '#eee' }}>
                <img src={post.image_url} style={{ width: '100%', height: 'auto', maxHeight: 650, objectFit: 'cover', display: 'block' }} alt="" />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px 6px' }}>
            <div style={{ display: 'flex', gap: 18 }}>
              <button onClick={handleLike} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <Heart size={24} fill={liked ? '#FF3040' : 'none'} color={liked ? '#FF3040' : '#111'} strokeWidth={1.8} />
              </button>
              <button onClick={() => { setShowComments(!showComments); if(!showComments) fetchComments(); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <MessageCircle size={24} strokeWidth={1.8} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: 18 }}>
              <button onClick={() => setShowMenu(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Send size={24} strokeWidth={1.8} /></button>
              <button onClick={handleSave} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Bookmark size={24} fill={saved ? '#111' : 'none'} strokeWidth={1.8} /></button>
            </div>
          </div>

          <div style={{ padding: '0 14px' }}>
            {likeCount > 0 && <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{likeCount} likes</div>}
            {comments.length > 0 && !showComments && (
              <div onClick={() => { setShowComments(true); fetchComments(); }} style={{ fontSize: 13, color: '#888', cursor: 'pointer', paddingBottom: 10 }}>
                View all {comments.length} comments
              </div>
            )}
          </div>

          {showComments && (
            <div style={{ borderTop: '1px solid #F0E6D3', background: '#FFFEFB' }}>
              <div style={{ maxHeight: 240, overflowY: 'auto', padding: '10px 14px' }}>
                {comments.length === 0 && <div style={{ fontSize: 13, color: '#999', textAlign: 'center', padding: 10 }}>No comments yet, be first!</div>}
                {comments.map((c: any) => (
                  <div key={c.id} style={{ display: 'flex', gap: 8, padding: '6px 0' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#F0E6D3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, overflow: 'hidden' }}>
                      {c.profiles?.avatar_url ? <img src={c.profiles.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : (c.profiles?.username?.[0] || 'U')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{c.profiles?.username || 'user'}</span>
                      <span style={{ fontSize: 13, marginLeft: 6, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{c.content}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, padding: '10px 14px', borderTop: '1px solid #F0E6D3', alignItems: 'center' }}>
                <input value={commentText} onChange={e=>setCommentText(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') handleComment(); }} placeholder="Add a comment..." style={{ flex: 1, height: 38, background: '#FFF', border: '1px solid #EDE2CD', borderRadius: 20, padding: '0 14px', outline: 'none', fontSize: 13 }} />
                <button onClick={handleComment} style={{ background: 'none', border: 'none', color: '#2D86FF', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Post</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showMenu && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowMenu(false)}>
          <div style={{ width: '100%', background: '#FFFEFB', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '12px 0 30px' }} onClick={e=>e.stopPropagation()}>
            <div style={{ width: 44, height: 5, background: '#D8CFC0', borderRadius: 10, margin: '0 auto 12px' }} />
            {isOwner && (
              <>
                <div onClick={() => { setShowMenu(false); router.push(`/create?editBeauty=${post.id}`); }} style={{ display: 'flex', gap: 16, padding: '16px 20px', borderBottom: '1px solid #F0E6D3', cursor: 'pointer' }}><Sparkles size={22} /> Edit Beauty</div>
                <div onClick={handleDelete} style={{ display: 'flex', gap: 16, padding: '16px 20px', borderBottom: '1px solid #F0E6D3', cursor: 'pointer', color: '#C94B2A' }}><Trash2 size={22} /> Delete Post</div>
              </>
            )}
            <div onClick={() => { setShowMenu(false); router.push(`/followers?share=${post.id}`); }} style={{ display: 'flex', gap: 16, padding: '16px 20px', borderBottom: '1px solid #F0E6D3', cursor: 'pointer' }}><Users size={22} /> Share to Profile</div>
            <div onClick={async () => { await navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`); alert("Link copied!"); setShowMenu(false); }} style={{ display: 'flex', gap: 16, padding: '16px 20px', borderBottom: '1px solid #F0E6D3', cursor: 'pointer' }}><Link2 size={22} /> Copy Link</div>
            <div onClick={() => { setShowMenu(false); router.push('/homefeed/saved'); }} style={{ display: 'flex', gap: 16, padding: '16px 20px', cursor: 'pointer' }}><Bookmark size={22} /> {saved ? 'Go to Saved' : 'Save Post'}</div>
          </div>
        </div>
      )}
    </>
  );
}