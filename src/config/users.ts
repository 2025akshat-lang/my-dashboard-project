// ═══════════════════════════════════════════════════════════════════
//  KNOWLEDGE OS — USER MANAGEMENT
//  ─────────────────────────────────────────────────────────────────
//  Manages viewer accounts stored in localStorage.
//  Admin credentials are fixed in src/config.ts (PERSONAL_CREDENTIALS).
//  Viewers can browse the dashboard but cannot edit content.
// ═══════════════════════════════════════════════════════════════════

const USERS_KEY = "knowledgeos_users";

export type UserRole = "admin" | "viewer";

export interface AppUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  note?: string;        // optional label (e.g. "College friend", "Study group")
  addedAt: string;
}

export function getUsers(): AppUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveUsers(users: AppUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function addUser(data: Omit<AppUser, "id" | "addedAt">): AppUser {
  const existing = getUsers();
  if (existing.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
    throw new Error("A user with this email already exists.");
  }
  const newUser: AppUser = {
    ...data,
    id: Date.now().toString(),
    addedAt: new Date().toLocaleString(),
  };
  saveUsers([...existing, newUser]);
  return newUser;
}

export function updateUser(id: string, changes: Partial<Omit<AppUser, "id" | "addedAt">>): void {
  saveUsers(getUsers().map(u => u.id === id ? { ...u, ...changes } : u));
}

export function removeUser(id: string): void {
  saveUsers(getUsers().filter(u => u.id !== id));
}

// Returns the matching user or null. Used at login.
export function findUser(email: string, password: string): AppUser | null {
  const norm = email.trim().toLowerCase();
  return getUsers().find(
    u => u.email.toLowerCase() === norm && u.password === password
  ) || null;
}
