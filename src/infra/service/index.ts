/**
 * Infrastructure service layer exports
 * Public API for the $app singleton and related types
 */

export { $app } from "./app";
export type {
    IAjaxService,
    AjaxRequestConfig,
    ApiError,
    StoredToken,
} from "./ajax/types";
export { tokenService } from "./ajax/token.service";
