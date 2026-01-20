import { useEffect, useState } from "react";
import { exampleDataRepository } from "../data";

export default function ExamplePage() {
    const [data, setData] = useState<string | null>(null);

    useEffect(() => {
        exampleDataRepository.getExampleData().then(setData);
    }, []);

    const showNotification = () => {
        $app.notifications.showSuccess(
            "Data Loaded",
            "The example data has been loaded successfully.",
        );

        $app.notifications.showError(
            "Error Occurred",
            "There was an error loading the example data.",
        );

        $app.notifications.showWarning(
            "Warning",
            "This is a warning about the example data.",
        );

        $app.notifications.showLoading(
            "Loading Data",
            "The example data is currently loading.",
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
