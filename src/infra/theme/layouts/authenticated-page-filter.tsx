/** @author aaron-iz */
import { useCallback } from "react";
import { Outlet, useNavigate } from "react-router";

const LoginPageRoute = "/login";

export default function AuthenticatedPageFilter() {
    const navigate = useNavigate();

    // TODO: Mocked authentication check, replace with real one
    const isAuthenticated = useCallback(() => true, []);

    if (!isAuthenticated()) {
        navigate(LoginPageRoute);
        return null;
    }

    return <Outlet />;
}
