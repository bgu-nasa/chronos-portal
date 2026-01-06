/**
 * User hooks
 * React hooks for user CRUD operations using Zustand store
 */

import { useUserStore } from "@/modules/auth/src/state/user.store";

/**
 * Hook for accessing users state and actions
 */
export function useUsers() {
    const users = useUserStore((state) => state.users);
    const isLoading = useUserStore((state) => state.isLoading);
    const error = useUserStore((state) => state.error);
    const fetchUsers = useUserStore((state) => state.fetchUsers);

    return {
        users,
        isLoading,
        error,
        fetchUsers,
    };
}

/**
 * Hook for creating a user
 */
export function useCreateUser() {
    const createUser = useUserStore((state) => state.createUser);
    const isLoading = useUserStore((state) => state.isLoading);
    const error = useUserStore((state) => state.error);

    return {
        createUser,
        isLoading,
        error,
    };
}

/**
 * Hook for updating a user
 */
export function useUpdateUser() {
    const updateUser = useUserStore((state) => state.updateUser);
    const isLoading = useUserStore((state) => state.isLoading);
    const error = useUserStore((state) => state.error);

    return {
        updateUser,
        isLoading,
        error,
    };
}

/**
 * Hook for updating the authenticated user's profile
 */
export function useUpdateMyProfile() {
    const updateMyProfile = useUserStore((state) => state.updateMyProfile);
    const isLoading = useUserStore((state) => state.isLoading);
    const error = useUserStore((state) => state.error);

    return {
        updateMyProfile,
        isLoading,
        error,
    };
}

/**
 * Hook for deleting a user
 */
export function useDeleteUser() {
    const deleteUser = useUserStore((state) => state.deleteUser);
    const isLoading = useUserStore((state) => state.isLoading);
    const error = useUserStore((state) => state.error);

    return {
        deleteUser,
        isLoading,
        error,
    };
}
