/** @author aaron-iz */
import { Button } from "@mantine/core";
import { useNavigate } from "react-router";

const DemoRequestPagePath = "/auth/register";

export default function PublicLayoutSpecialAction() {
    const navigate = useNavigate();

    const handleRequestDemoClick = () => {
        navigate(DemoRequestPagePath);
    };

    return (
        <Button variant="outline" onClick={handleRequestDemoClick}>
            Request Demo
        </Button>
    );
}
