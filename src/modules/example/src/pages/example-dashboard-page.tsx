import { useEffect, useState } from "react";
import { exampleDataRepository } from "../data";

export default function ExampleDashboardPage() {
    const [data, setData] = useState<string | null>(null);

    useEffect(() => {
        exampleDataRepository.getExampleData().then(setData);
    }, []);

    return (
        <div>
            <h1>Example Page</h1>
            <p>{data ? data : "Loading..."}</p>
        </div>
    );
}
