export class ExampleDataRepository {
    async getExampleData(): Promise<string> {
        return "This is some example data.";
    }
}

export const exampleDataRepository = new ExampleDataRepository();
