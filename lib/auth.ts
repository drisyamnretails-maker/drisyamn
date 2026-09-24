// FAKE AUTH - Final Fix for Drisyamn
export type User = { name: string; email: string; phone?: string; password?: string };

function saveUser(user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem("drisyamn_user", JSON.stringify(user));
    localStorage.setItem("drisyamn_current_user", JSON.stringify(user));
  }
  return { success: true, user };
}

export function register(user: User) {
  // koi bhi email/phone chalega, Supabase nahi lagega
  if (!user.email) {
    return { success: false, message: "Email missing" };
  }
  return saveUser(user);
}

export function login(identifier: string, password: string) {
  // fake login - koi bhi password chalega
  const isEmail = identifier.includes("@");
  const user: User = isEmail 
    ? { name: "User", email: identifier, password } 
    : { name: "User", email: `${identifier}@drisyamn.local`, phone: identifier, password };
  return saveUser(user);
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("drisyamn_user");
  return data ? JSON.parse(data) : null;
}

export function logout() {
  localStorage.removeItem("drisyamn_user");
  localStorage.removeItem("drisyamn_current_user");
  window.location.href = "/login";
  return true;
}

export function isLoggedIn() {
  return !!getUser();
}