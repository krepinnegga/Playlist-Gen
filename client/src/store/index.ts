import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    set => ({
      user: null,
      // Function to update the whole user object
      setUserData: data =>
        set(state => ({
          user: {
            ...state.user,
            ...data,
          },
        })),
      clearUserData: () => set(() => ({ user: null })),
    }),
    {
      name: 'TMUserStore',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export { useUserStore };
