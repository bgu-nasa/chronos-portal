/**
 * Department hooks
 * React hooks for department CRUD operations
 */

import { useState } from "react";
import { departmentDataRepository } from "@/modules/management/src/data/department-data-repository";
import type {
    DepartmentResponse,
    DepartmentRequest,
} from "@/modules/management/src/data/department.types";

/**
 * Hook for fetching all departments
 */
export function useDepartments() {
    const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDepartments = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await departmentDataRepository.getAllDepartments();
            setDepartments(data);
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to fetch departments";
            setError(errorMessage);
            console.error("Error fetching departments:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        departments,
        isLoading,
        error,
        fetchDepartments,
        setDepartments,
    };
}

/**
 * Hook for creating a department
 */
export function useCreateDepartment() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createDepartment = async (
        request: DepartmentRequest
    ): Promise<DepartmentResponse | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const newDepartment =
                await departmentDataRepository.createDepartment(request);
            return newDepartment;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to create department";
            setError(errorMessage);
            console.error("Error creating department:", err);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        createDepartment,
        isLoading,
        error,
    };
}

/**
 * Hook for updating a department
 */
export function useUpdateDepartment() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateDepartment = async (
        departmentId: string,
        request: DepartmentRequest
    ): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        try {
            await departmentDataRepository.updateDepartment(
                departmentId,
                request
            );
            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to update department";
            setError(errorMessage);
            console.error("Error updating department:", err);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        updateDepartment,
        isLoading,
        error,
    };
}

/**
 * Hook for deleting a department
 */
export function useDeleteDepartment() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteDepartment = async (departmentId: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        try {
            await departmentDataRepository.deleteDepartment(departmentId);
            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to delete department";
            setError(errorMessage);
            console.error("Error deleting department:", err);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        deleteDepartment,
        isLoading,
        error,
    };
}

/**
 * Hook for restoring a department
 */
export function useRestoreDepartment() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const restoreDepartment = async (
        departmentId: string
    ): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        try {
            await departmentDataRepository.restoreDepartment(departmentId);
            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to restore department";
            setError(errorMessage);
            console.error("Error restoring department:", err);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        restoreDepartment,
        isLoading,
        error,
    };
}
