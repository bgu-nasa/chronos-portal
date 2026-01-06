/**
 * Common utilities and components
 * Exports shared functionality across the application
 */

// Components
export { ConfirmationDialog } from "./components/confirmation-dialog";
export type { ConfirmationDialogProps } from "./components/confirmation-dialog";

// Hooks
export { useConfirmation } from "./hooks/use-confirmation";
export type {
    ConfirmationState,
    UseConfirmationReturn,
} from "./hooks/use-confirmation";
