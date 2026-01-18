/**
 * Constraint Store
 * Zustand store for constraint state management
 */

import { create } from "zustand";
import { constraintDataRepository } from "@/modules/schedule/src/data/constraint-repository";
import type {
    ActivityConstraintResponse,
    CreateActivityConstraintRequest,
    UpdateActivityConstraintRequest,
    UserConstraintResponse,
    CreateUserConstraintRequest,
    UpdateUserConstraintRequest,
    UserPreferenceResponse,
    CreateUserPreferenceRequest,
    UpdateUserPreferenceRequest,
    OrganizationPolicyResponse,
    CreateOrganizationPolicyRequest,
    UpdateOrganizationPolicyRequest,
} from "@/modules/schedule/src/data/constraint.types";

interface ConstraintStore {
    // State
    activityConstraints: ActivityConstraintResponse[];
    userConstraints: UserConstraintResponse[];
    userPreferences: UserPreferenceResponse[];
    organizationPolicies: OrganizationPolicyResponse[];
    isLoading: boolean;
    error: string | null;

    // Actions - Activity
    fetchActivityConstraints: () => Promise<void>;
    createActivityConstraint: (request: CreateActivityConstraintRequest) => Promise<boolean>;
    updateActivityConstraint: (id: string, request: UpdateActivityConstraintRequest) => Promise<boolean>;
    deleteActivityConstraint: (id: string) => Promise<boolean>;

    // Actions - User
    fetchUserConstraints: () => Promise<void>;
    createUserConstraint: (request: CreateUserConstraintRequest) => Promise<boolean>;
    updateUserConstraint: (id: string, request: UpdateUserConstraintRequest) => Promise<boolean>;
    deleteUserConstraint: (id: string) => Promise<boolean>;

    // Actions - Preference
    fetchUserPreferences: () => Promise<void>;
    createUserPreference: (request: CreateUserPreferenceRequest) => Promise<boolean>;
    updateUserPreference: (userId: string, schedulingPeriodId: string, key: string, request: UpdateUserPreferenceRequest) => Promise<boolean>;
    deleteUserPreference: (id: string) => Promise<boolean>;

    // Actions - Policy
    fetchOrganizationPolicies: () => Promise<void>;
    createOrganizationPolicy: (request: CreateOrganizationPolicyRequest) => Promise<boolean>;
    updateOrganizationPolicy: (id: string, request: UpdateOrganizationPolicyRequest) => Promise<boolean>;
    deleteOrganizationPolicy: (id: string) => Promise<boolean>;

    // Utility
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useConstraintStore = create<ConstraintStore>((set, get) => ({
    activityConstraints: [],
    userConstraints: [],
    userPreferences: [],
    organizationPolicies: [],
    isLoading: false,
    error: null,

    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    // Activity
    fetchActivityConstraints: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await constraintDataRepository.getAllActivityConstraints();
            set({ activityConstraints: data, isLoading: false });
        } catch (err: any) {
            set({ error: err.message || "Failed to fetch activity constraints", isLoading: false });
        }
    },
    createActivityConstraint: async (request) => {
        set({ isLoading: true, error: null });
        try {
            await constraintDataRepository.createActivityConstraint(request);
            await get().fetchActivityConstraints();
            return true;
        } catch (err: any) {
            set({ error: err.message || "Failed to create activity constraint", isLoading: false });
            return false;
        }
    },
    updateActivityConstraint: async (id, request) => {
        set({ isLoading: true, error: null });
        try {
            await constraintDataRepository.updateActivityConstraint(id, request);
            await get().fetchActivityConstraints();
            return true;
        } catch (err: any) {
            set({ error: err.message || "Failed to update activity constraint", isLoading: false });
            return false;
        }
    },
    deleteActivityConstraint: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await constraintDataRepository.deleteActivityConstraint(id);
            await get().fetchActivityConstraints();
            return true;
        } catch (err: any) {
            set({ error: err.message || "Failed to delete activity constraint", isLoading: false });
            return false;
        }
    },

    // User
    fetchUserConstraints: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await constraintDataRepository.getAllUserConstraints();
            set({ userConstraints: data, isLoading: false });
        } catch (err: any) {
            set({ error: err.message || "Failed to fetch user constraints", isLoading: false });
        }
    },
    createUserConstraint: async (request) => {
        set({ isLoading: true, error: null });
        try {
            await constraintDataRepository.createUserConstraint(request);
            await get().fetchUserConstraints();
            return true;
        } catch (err: any) {
            set({ error: err.message || "Failed to create user constraint", isLoading: false });
            return false;
        }
    },
    updateUserConstraint: async (id, request) => {
        set({ isLoading: true, error: null });
        try {
            await constraintDataRepository.updateUserConstraint(id, request);
            await get().fetchUserConstraints();
            return true;
        } catch (err: any) {
            set({ error: err.message || "Failed to update user constraint", isLoading: false });
            return false;
        }
    },
    deleteUserConstraint: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await constraintDataRepository.deleteUserConstraint(id);
            await get().fetchUserConstraints();
            return true;
        } catch (err: any) {
            set({ error: err.message || "Failed to delete user constraint", isLoading: false });
            return false;
        }
    },

    // Preference
    fetchUserPreferences: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await constraintDataRepository.getAllUserPreferences();
            set({ userPreferences: data, isLoading: false });
        } catch (err: any) {
            set({ error: err.message || "Failed to fetch user preferences", isLoading: false });
        }
    },
    createUserPreference: async (request) => {
        set({ isLoading: true, error: null });
        try {
            await constraintDataRepository.createUserPreference(request);
            await get().fetchUserPreferences();
            return true;
        } catch (err: any) {
            set({ error: err.message || "Failed to create user preference", isLoading: false });
            return false;
        }
    },
    updateUserPreference: async (userId, schedulingPeriodId, key, request) => {
        set({ isLoading: true, error: null });
        try {
            await constraintDataRepository.updateUserPreference(userId, schedulingPeriodId, key, request);
            await get().fetchUserPreferences();
            return true;
        } catch (err: any) {
            set({ error: err.message || "Failed to update user preference", isLoading: false });
            return false;
        }
    },
    deleteUserPreference: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await constraintDataRepository.deleteUserPreference(id);
            await get().fetchUserPreferences();
            return true;
        } catch (err: any) {
            set({ error: err.message || "Failed to delete user preference", isLoading: false });
            return false;
        }
    },

    // Policy
    fetchOrganizationPolicies: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await constraintDataRepository.getAllOrganizationPolicies();
            set({ organizationPolicies: data, isLoading: false });
        } catch (err: any) {
            set({ error: err.message || "Failed to fetch organization policies", isLoading: false });
        }
    },
    createOrganizationPolicy: async (request) => {
        set({ isLoading: true, error: null });
        try {
            await constraintDataRepository.createOrganizationPolicy(request);
            await get().fetchOrganizationPolicies();
            return true;
        } catch (err: any) {
            set({ error: err.message || "Failed to create organization policy", isLoading: false });
            return false;
        }
    },
    updateOrganizationPolicy: async (id, request) => {
        set({ isLoading: true, error: null });
        try {
            await constraintDataRepository.updateOrganizationPolicy(id, request);
            await get().fetchOrganizationPolicies();
            return true;
        } catch (err: any) {
            set({ error: err.message || "Failed to update organization policy", isLoading: false });
            return false;
        }
    },
    deleteOrganizationPolicy: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await constraintDataRepository.deleteOrganizationPolicy(id);
            await get().fetchOrganizationPolicies();
            return true;
        } catch (err: any) {
            set({ error: err.message || "Failed to delete organization policy", isLoading: false });
            return false;
        }
    },
}));
