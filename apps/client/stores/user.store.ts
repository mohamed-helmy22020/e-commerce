import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState = {
    user: null,
};

type UserStore = {
    user: User | null;
} & {
    setUser: (user: User | null) => void;
    reset: () => void;
};

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            ...initialState,
            setUser: (user) => set({ user }),
            reset: () => set(initialState),
        }),
        {
            name: "userStore",
        },
    ),
);
