/**
 * Subject Store
 * Zustand store for centralized subject state management
 */

import { create } from "zustand";
import { subjectDataRepository } from "@/modules/resources/src/data";
import type {
    SubjectResponse,
    CreateSubjectRequest,
    UpdateSubjectRequest,
} from "@/modules/resources/src/data";

interface SubjectStore {
    // State
    subjects: SubjectResponse[];
    currentDepartmentId: string | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setCurrentDepartment: (departmentId: string) => void;
    getDepartmentId: () => string;
    fetchSubjects: () => Promise<void>;
    createSubject: (request: CreateSubjectRequest) => Promise<SubjectResponse | null>;
    updateSubject: (subjectId: string, request: UpdateSubjectRequest) => Promise<boolean>;
    deleteSubject: (subjectId: string) => Promise<boolean>;

    // Utility actions
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useSubjectStore = create<SubjectStore>((set, get) => ({
    // Initial state
    subjects: [],
    currentDepartmentId: null,
    isLoading: false,
    error: null,

    // Set current department
    setCurrentDepartment: (departmentId: string) => {
        set({ currentDepartmentId: departmentId });
    },

    // Helper to get department ID
    getDepartmentId: (): string => {
        const { currentDepartmentId } = get();
        if (!currentDepartmentId) {
            throw new Error("No department context set. Call setCurrentDepartment first.");
        }
        return currentDepartmentId;
    },

    // Fetch all subjects
    fetchSubjects: async () => {
        set({ isLoading: true, error: null });
        try {
            const departmentId = get().getDepartmentId();
            const data = await subjectDataRepository.getAllSubjects(departmentId);
            set({ subjects: data, isLoading: false });
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to fetch subjects";
            set({ error: errorMessage, isLoading: false });
            console.error("Error fetching subjects:", err);
        }
    },

    // Create a subject and refetch
    createSubject: async (request: CreateSubjectRequest) => {
        set({ isLoading: true, error: null });
        try {
            const departmentId = get().getDepartmentId();
            const newSubject = await subjectDataRepository.createSubject(
                departmentId,
                request
            );
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchSubjects();

            return newSubject;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to create subject";
            set({ error: errorMessage, isLoading: false });
            console.error("Error creating subject:", err);
            return null;
        }
    },

    // Update a subject and refetch
    updateSubject: async (
        subjectId: string,
        request: UpdateSubjectRequest
    ) => {
        set({ isLoading: true, error: null });
        try {
            const departmentId = get().getDepartmentId();
            await subjectDataRepository.updateSubject(
                departmentId,
                subjectId,
                request
            );
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchSubjects();

            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to update subject";
            set({ error: errorMessage, isLoading: false });
            console.error("Error updating subject:", err);
            return false;
        }
    },

    // Delete a subject and refetch
    deleteSubject: async (subjectId: string) => {
        set({ isLoading: true, error: null });
        try {
            const departmentId = get().getDepartmentId();
            await subjectDataRepository.deleteSubject(departmentId, subjectId);
            set({ isLoading: false });

            // Refetch to update the list
            await get().fetchSubjects();

            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to delete subject";
            set({ error: errorMessage, isLoading: false });
            console.error("Error deleting subject:", err);
            return false;
        }
    },

    // Utility actions
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),
}));
