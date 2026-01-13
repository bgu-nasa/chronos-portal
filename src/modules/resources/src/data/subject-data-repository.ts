/**
 * Subject data repository
 * Handles subject API calls with organization context
 */

import type {
    SubjectResponse,
    CreateSubjectRequest,
    UpdateSubjectRequest,
} from "@/modules/resources/src/data/subject.types";

/**
 * Subject repository class
 * Provides methods for CRUD operations on subjects
 */
export class SubjectDataRepository {
    /**
     * Get organization ID from the current organization context
     * @throws Error if no organization is loaded
     */
    private getOrganizationId(): string {
        const organization = $app.organization.getOrganization();
        if (!organization) {
            throw new Error("No organization context available");
        }
        return organization.id;
    }

    /**
     * Get headers with organization ID
     */
    private getHeaders() {
        return {
            "x-org-id": this.getOrganizationId(),
        };
    }

    /**
     * Build the base URL for subject endpoints
     * @param departmentId - The department ID (required in route)
     */
    private getBaseUrl(departmentId: string): string {
        return `/api/department/${departmentId}/resources/subjects/subject`;
    }

    /**
     * Fetch all subjects for the current organization
     * @param departmentId - The department ID
     * @returns Array of subjects
     */
    async getAllSubjects(departmentId: string): Promise<SubjectResponse[]> {
        const response = await $app.ajax.get<SubjectResponse[]>(
            this.getBaseUrl(departmentId),
            { headers: this.getHeaders() }
        );
        return response;
    }

    /**
     * Fetch subjects by department
     * @param departmentId - The department ID
     * @returns Array of subjects
     */
    async getSubjectsByDepartment(
        departmentId: string
    ): Promise<SubjectResponse[]> {
        const response = await $app.ajax.get<SubjectResponse[]>(
            `${this.getBaseUrl(departmentId)}?departmentId=${departmentId}`,
            { headers: this.getHeaders() }
        );
        return response;
    }

    /**
     * Fetch a single subject by ID
     * @param departmentId - The department ID
     * @param subjectId - The ID of the subject to fetch
     * @returns Subject details
     */
    async getSubjectById(
        departmentId: string,
        subjectId: string
    ): Promise<SubjectResponse> {
        const response = await $app.ajax.get<SubjectResponse>(
            `${this.getBaseUrl(departmentId)}/${subjectId}`,
            { headers: this.getHeaders() }
        );
        return response;
    }

    /**
     * Create a new subject
     * @param departmentId - The department ID
     * @param request - Subject creation request
     * @returns Created subject details
     */
    async createSubject(
        departmentId: string,
        request: CreateSubjectRequest
    ): Promise<SubjectResponse> {
        const response = await $app.ajax.post<SubjectResponse>(
            this.getBaseUrl(departmentId),
            request,
            { headers: this.getHeaders() }
        );
        return response;
    }

    /**
     * Update an existing subject
     * @param departmentId - The department ID
     * @param subjectId - The ID of the subject to update
     * @param request - Subject update request
     * @returns void (HTTP 204 No Content)
     */
    async updateSubject(
        departmentId: string,
        subjectId: string,
        request: UpdateSubjectRequest
    ): Promise<void> {
        await $app.ajax.patch<void>(
            `${this.getBaseUrl(departmentId)}/${subjectId}`,
            request,
            { headers: this.getHeaders() }
        );
    }

    /**
     * Delete a subject
     * @param departmentId - The department ID
     * @param subjectId - The ID of the subject to delete
     * @returns void (HTTP 204 No Content)
     */
    async deleteSubject(
        departmentId: string,
        subjectId: string
    ): Promise<void> {
        await $app.ajax.delete<void>(
            `${this.getBaseUrl(departmentId)}/${subjectId}`,
            { headers: this.getHeaders() }
        );
    }
}

// Export singleton instance
export const subjectDataRepository = new SubjectDataRepository();
