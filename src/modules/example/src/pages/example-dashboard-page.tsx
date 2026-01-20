import { useEffect, useState } from "react";
import { exampleDataRepository } from "../data";

export default function ExampleDashboardPage() {
    const [data, setData] = useState<string | null>(null);

    useEffect(() => {
        exampleDataRepository.getExampleData().then(setData);
    }, []);

    const showNotification = () => {
        $app.notifications.showSuccess(
            "Data Loaded",
            "The example data has been loaded successfully.",
        );
    };

    return (
        <div>
            <h1>Example Page</h1>
            <p>{data ? data : "Loading..."}</p>

            <button onClick={showNotification}>Show Notification</button>
        </div>
    );
}
