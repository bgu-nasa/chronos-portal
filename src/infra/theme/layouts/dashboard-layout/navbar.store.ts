/** @author aaron-iz */
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NavbarState {
    collapsed: boolean;
    openItems: Record<string, boolean>;
    toggleCollapsed: () => void;
    setCollapsed: (collapsed: boolean) => void;
    toggleItem: (itemKey: string) => void;
    setItemOpen: (itemKey: string, isOpen: boolean) => void;
}

export const useNavbarStore = create<NavbarState>()(
    persist(
        (set) => ({
            collapsed: false,
            openItems: {},
            toggleCollapsed: () =>
                set((state) => ({
                    collapsed: !state.collapsed,
                })),
            setCollapsed: (collapsed: boolean) => set({ collapsed }),
            toggleItem: (itemKey: string) =>
                set((state) => ({
                    openItems: {
                        ...state.openItems,
                        [itemKey]: !state.openItems[itemKey],
                    },
                })),
            setItemOpen: (itemKey: string, isOpen: boolean) =>
                set((state) => ({
                    openItems: {
                        ...state.openItems,
                        [itemKey]: isOpen,
                    },
                })),
        }),
        {
            name: "navbar-storage",
        },
    ),
);
