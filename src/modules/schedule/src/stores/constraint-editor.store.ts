import { create } from "zustand";
import type {
    ActivityConstraintResponse,
    UserConstraintResponse,
    UserPreferenceResponse,
    OrganizationPolicyResponse
} from "@/modules/schedule/src/data/constraint.types";

export type ConstraintType = "activity" | "user" | "preference" | "policy";

export type AnyConstraintResponse =
    | ActivityConstraintResponse
    | UserConstraintResponse
    | UserPreferenceResponse
    | OrganizationPolicyResponse;

export interface ConstraintEditorState {
    isOpen: boolean;
    mode: "create" | "edit";
    type: ConstraintType;
    constraint: AnyConstraintResponse | null;

    openCreate: (type: ConstraintType) => void;
    openEdit: (type: ConstraintType, constraint: AnyConstraintResponse) => void;
    close: () => void;
}

export const useConstraintEditorStore = create<ConstraintEditorState>((set) => ({
    isOpen: false,
    mode: "create",
    type: "activity",
    constraint: null,

    openCreate: (type) => set({ isOpen: true, mode: "create", type, constraint: null }),
    openEdit: (type, constraint) => set({ isOpen: true, mode: "edit", type, constraint }),
    close: () => set({ isOpen: false, constraint: null }),
}));
