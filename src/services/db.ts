import { UserPersona, UserProfile } from '../types';

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string; // Plain/simple hash for client-side demo persistence
  name: string;
  persona: UserPersona;
  title: string;
  avatar: string;
  restaurantName?: string;
  savedFoodKg: number;
  recipesCreatedCount: number;
  createdAt: string;
}

const STORAGE_USERS_KEY = 'waste2menu_users_db_v1';
const STORAGE_SESSION_KEY = 'waste2menu_session_v1';

// Initial Seed Users in the Database
const SEED_USERS: StoredUser[] = [
  {
    id: 'usr-chef-aarav',
    email: 'chef@waste2menu.com',
    passwordHash: 'chef123',
    name: 'Chef Aarav Singhania',
    persona: 'chef',
    title: 'Executive Culinary Director',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200',
    restaurantName: 'The Zero-Waste Brasserie',
    savedFoodKg: 142.8,
    recipesCreatedCount: 6,
    createdAt: '2026-01-15T08:00:00.000Z'
  },
  {
    id: 'usr-home-priya',
    email: 'user@waste2menu.com',
    passwordHash: 'user123',
    name: 'Priya Sharma',
    persona: 'normal_user',
    title: 'Home Cook & Zero-Waste Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    savedFoodKg: 12.4,
    recipesCreatedCount: 0,
    createdAt: '2026-02-01T10:30:00.000Z'
  }
];

class DatabaseService {
  private users: StoredUser[] = [];

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    try {
      const stored = localStorage.getItem(STORAGE_USERS_KEY);
      if (stored) {
        this.users = JSON.parse(stored);
      } else {
        this.users = [...SEED_USERS];
        this.persistUsers();
      }
    } catch {
      this.users = [...SEED_USERS];
    }
  }

  private persistUsers() {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(this.users));
    } catch (e) {
      console.warn('LocalStorage not available, falling back to memory database', e);
    }
  }

  public getUsers(): StoredUser[] {
    return this.users;
  }

  public getUserByEmail(email: string): StoredUser | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  public authenticate(email: string, passwordPlain: string): { success: boolean; user?: StoredUser; error?: string } {
    const user = this.getUserByEmail(email);
    if (!user) {
      return { success: false, error: 'No account found with this email address.' };
    }
    if (user.passwordHash !== passwordPlain.trim()) {
      return { success: false, error: 'Incorrect password. Please verify your credentials.' };
    }

    // Save active session
    this.saveSession(user);
    return { success: true, user };
  }

  public registerUser(input: {
    email: string;
    passwordPlain: string;
    name: string;
    persona: UserPersona;
    title?: string;
    restaurantName?: string;
  }): { success: boolean; user?: StoredUser; error?: string } {
    const existing = this.getUserByEmail(input.email);
    if (existing) {
      return { success: false, error: 'An account with this email address already exists. Please sign in.' };
    }

    // Generate random suitable avatar based on persona
    const defaultChefAvatar = 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200';
    const defaultUserAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';

    const newUser: StoredUser = {
      id: `usr-${Date.now()}`,
      email: input.email.trim().toLowerCase(),
      passwordHash: input.passwordPlain.trim(),
      name: input.name.trim(),
      persona: input.persona,
      title: input.title || (input.persona === 'chef' ? 'Head Chef & Culinary Creator' : 'Zero-Waste Home Cook'),
      avatar: input.persona === 'chef' ? defaultChefAvatar : defaultUserAvatar,
      restaurantName: input.restaurantName,
      savedFoodKg: 0,
      recipesCreatedCount: 0,
      createdAt: new Date().toISOString()
    };

    this.users.unshift(newUser);
    this.persistUsers();
    this.saveSession(newUser);

    return { success: true, user: newUser };
  }

  public saveSession(user: StoredUser) {
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify({
        userId: user.id,
        email: user.email,
        persona: user.persona,
        timestamp: Date.now()
      }));
    } catch {}
  }

  public getSavedSession(): { userId: string; email: string; persona: UserPersona } | null {
    try {
      const stored = localStorage.getItem(STORAGE_SESSION_KEY);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  public clearSession() {
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch {}
  }

  public toProfile(user: StoredUser): UserProfile {
    return {
      id: user.id,
      name: user.name,
      persona: user.persona,
      title: user.title,
      avatar: user.avatar,
      savedFoodKg: user.savedFoodKg,
      recipesCreatedCount: user.recipesCreatedCount
    };
  }
}

export const db = new DatabaseService();
