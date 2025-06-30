import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

// Define your user type
interface User {
  id?: string;
  name?: string;
  email?: string;
  accessToken?: string;
  refreshToken?: string;
  // Add other user properties as needed
}

// Define the store's state and actions
interface UserStoreState {
  user: User | null;
  setUserData: (data: Partial<User>) => void;
  clearUserData: () => void;
}

// Custom cookie storage adapter for Zustand
const cookieStorage = {
  getItem: (name: string): string | null => {
    const value = Cookies.get(name);
    return value ?? null;
  },
  setItem: (name: string, value: string): void => {
    Cookies.set(name, value, {
      expires: 7,
      secure: true,
      sameSite: 'strict',
    });
  },
  removeItem: (name: string): void => {
    Cookies.remove(name);
  },
};

// Create the store with TypeScript typing
const useUserStore = create<UserStoreState>()(
  persist(
    set => ({
      user: null,
      setUserData: (data: Partial<User>) =>
        set(state => ({
          user: state.user ? { ...state.user, ...data } : { ...data },
        })),
      clearUserData: () => set({ user: null }),
    }),
    {
      name: 'user', // Cookie name
      storage: createJSONStorage(() => cookieStorage),
      partialize: state => ({ user: state.user }), // Only persist the user field
    }
  )
);

export { useUserStore };
