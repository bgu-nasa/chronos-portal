/**
 * User Store
 * Zustand store for centralized user state management
 */

import { create } from "zustand";
import { userDataRepository } from "@/modules/auth/src/data/user-data-repository";
import type {
    UserResponse,
    CreateUserRequest,
    UserUpdateRequest,
} from "@/modules/auth/src/data/user.types";

interface UserStore {
    // State
    users: UserResponse[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchUsers: () => Promise<void>;
    createUser: (request: CreateUserRequest) => Promise<UserResponse | null>;
    updateUser: (
        userId: string,
        request: UserUpdateRequest,
    ) => Promise<boolean>;
    updateMyProfile: (request: UserUpdateRequest) => Promise<boolean>;
    deleteUser: (userId: string) => Promise<boolean>;

    // Utility actions
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
    // Initial state
    users: [],
    isLoading: false,
    error: null,

    // Fetch all users
    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await userDataRepository.getAllUsers();
            set({ users: data, isLoading: false });
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to fetch users";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error fetching users:", err);
        }
    },

    // Create a user and refetch
    createUser: async (request: CreateUserRequest) => {
        set({ isLoading: true, error: null });
        try {
            const newUser = await userDataRepository.createUser(request);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchUsers();

            return newUser;
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to create user";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error creating user:", err);
            return null;
        }
    },

    // Update a user and refetch
    updateUser: async (userId: string, request: UserUpdateRequest) => {
        set({ isLoading: true, error: null });
        try {
            await userDataRepository.updateUser(userId, request);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchUsers();

            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to update user";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error updating user:", err);
            return false;
        }
    },

    // Update the authenticated user's own profile
    updateMyProfile: async (request: UserUpdateRequest) => {
        set({ isLoading: true, error: null });
        try {
            await userDataRepository.updateMyProfile(request);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchUsers();

            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to update profile";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error updating profile:", err);
            return false;
        }
    },

    // Delete a user and refetch
    deleteUser: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
            await userDataRepository.deleteUser(userId);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchUsers();

            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to delete user";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error deleting user:", err);
            return false;
        }
    },

    // Utility actions
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),
}));
