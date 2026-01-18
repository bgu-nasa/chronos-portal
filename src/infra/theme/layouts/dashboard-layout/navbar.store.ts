/** @author aaron-iz */
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NavbarState {
    collapsed: boolean;
    toggleCollapsed: () => void;
    setCollapsed: (collapsed: boolean) => void;
}

export const useNavbarStore = create<NavbarState>()(
    persist(
        (set) => ({
            collapsed: false,
            toggleCollapsed: () =>
                set((state) => ({
                    collapsed: !state.collapsed,
                })),
            setCollapsed: (collapsed: boolean) => set({ collapsed }),
        }),
        {
            name: "navbar-storage",
        }
    )
);
