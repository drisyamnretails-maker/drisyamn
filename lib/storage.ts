// lib/storage.ts
export const KEYS = {
  POSTS: "drisyamn_global_posts_v2",
  HOME: "homefeed_posts",
  MEDIA: "drisyamn_posts",
  USER: "drisyamn_username",
  SETTINGS: "drisyamn_settings_all",
};

export const safeGet = (key: string, fallback: any) => {
  try {
    if (typeof window === "undefined") return fallback;
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback }
};

export const safeSet = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
  // Ye event fire karega taaki homefeed auto refresh ho jaye
  window.dispatchEvent(new CustomEvent("drisyamn_update", { detail: key }));
};

export const savePost = (post: any) => {
  const all = safeGet(KEYS.POSTS, []);
  const updated = [post, ...all];
  const deduped = Array.from(new Map(updated.map((p:any)=>[p.id, p])).values());
  safeSet(KEYS.POSTS, deduped);
  safeSet(KEYS.HOME, deduped);
};