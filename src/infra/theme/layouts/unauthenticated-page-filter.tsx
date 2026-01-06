/** @author aaron-iz */
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { $app } from "@/infra/service";

const DashboardHomeRoute = "/dashboard/home";

/**
 * Higher-order component that requires user to be unauthenticated
 * Redirects to dashboard if user is already authenticated
 */
export default function UnauthenticatedPageFilter() {
    const navigate = useNavigate();
    const isAuthenticated = $app.isAuthenticated();

    useEffect(() => {
        if (isAuthenticated) {
            navigate(DashboardHomeRoute, { replace: true });
        }
    }, [isAuthenticated, navigate]);

    if (isAuthenticated) {
        return null;
    }

    return <Outlet />;
}
