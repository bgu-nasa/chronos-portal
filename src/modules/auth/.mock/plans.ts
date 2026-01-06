export type PlanType = "Free" | "Consumption" | "Enterprise";

export interface Plan {
    id: PlanType;
    name: string;
    description: string;
}

export const PLANS: Plan[] = [
    {
        id: "Free",
        name: "Free",
        description: "Perfect for individuals and small teams getting started",
    },
    {
        id: "Consumption",
        name: "Consumption",
        description: "Pay as you grow with flexible usage-based pricing",
    },
    {
        id: "Enterprise",
        name: "Enterprise",
        description: "Advanced features and support for large organizations",
    },
];
