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
import type { ApiError } from "@/infra/service/ajax/types";

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
            const apiError = err as ApiError;
            const errorMessage = apiError.message || "Failed to fetch users";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error fetching users:", err);
            $app.notifications.showError(
                "Failed to fetch users",
                apiError.details ? String(apiError.details) : undefined,
            );
        }
    },

    // Create a user and refetch
    createUser: async (request: CreateUserRequest) => {
        set({ isLoading: true, error: null });
        const loadingNotification =
            $app.notifications.showLoading("Creating user...");
        try {
            const newUser = await userDataRepository.createUser(request);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchUsers();

            $app.notifications.remove(loadingNotification);
            $app.notifications.showSuccess("User created successfully");
            return newUser;
        } catch (err) {
            const apiError = err as ApiError;
            const errorMessage = apiError.message || "Failed to create user";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error creating user:", err);
            $app.notifications.remove(loadingNotification);
            $app.notifications.showError(
                "Failed to create user",
                apiError.details ? String(apiError.details) : undefined,
            );
            return null;
        }
    },

    // Update a user and refetch
    updateUser: async (userId: string, request: UserUpdateRequest) => {
        set({ isLoading: true, error: null });
        const loadingNotification =
            $app.notifications.showLoading("Updating user...");
        try {
            await userDataRepository.updateUser(userId, request);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchUsers();

            $app.notifications.remove(loadingNotification);
            $app.notifications.showSuccess("User updated successfully");
            return true;
        } catch (err) {
            const apiError = err as ApiError;
            const errorMessage = apiError.message || "Failed to update user";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error updating user:", err);
            $app.notifications.remove(loadingNotification);
            $app.notifications.showError(
                "Failed to update user",
                apiError.details ? String(apiError.details) : undefined,
            );
            return false;
        }
    },

    // Update the authenticated user's own profile
    updateMyProfile: async (request: UserUpdateRequest) => {
        set({ isLoading: true, error: null });
        const loadingNotification = $app.notifications.showLoading(
            "Updating profile...",
        );
        try {
            await userDataRepository.updateMyProfile(request);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchUsers();

            $app.notifications.remove(loadingNotification);
            $app.notifications.showSuccess("Profile updated successfully");
            return true;
        } catch (err) {
            const apiError = err as ApiError;
            const errorMessage = apiError.message || "Failed to update profile";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error updating profile:", err);
            $app.notifications.remove(loadingNotification);
            $app.notifications.showError(
                "Failed to update profile",
                apiError.details ? String(apiError.details) : undefined,
            );
            return false;
        }
    },

    // Delete a user and refetch
    deleteUser: async (userId: string) => {
        set({ isLoading: true, error: null });
        const loadingNotification =
            $app.notifications.showLoading("Deleting user...");
        try {
            await userDataRepository.deleteUser(userId);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchUsers();

            $app.notifications.remove(loadingNotification);
            $app.notifications.showSuccess("User deleted successfully");
            return true;
        } catch (err) {
            const apiError = err as ApiError;
            const errorMessage = apiError.message || "Failed to delete user";
            set({ error: errorMessage, isLoading: false });
            $app.logger.error("Error deleting user:", err);
            $app.notifications.remove(loadingNotification);
            $app.notifications.showError(
                "Failed to delete user",
                apiError.details ? String(apiError.details) : undefined,
            );
            return false;
        }
    },

    // Utility actions
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),
}));
