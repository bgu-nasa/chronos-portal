import {
    Button,
    Card,
    PasswordInput,
    Select,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { useState } from "react";
import { PLANS, type PlanType } from "@/modules/auth/.mock/plans";
import styles from "./register-page.module.css";
import resources from "./register-page.resources.json";

export function RegisterPage() {
    // User info
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Organization info
    const [organizationName, setOrganizationName] = useState("");
    const [plan, setPlan] = useState<PlanType | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            // TODO: Show error notification
            console.error("Passwords do not match");
            return;
        }

        if (!plan) {
            // TODO: Show error notification
            console.error("Please select a plan");
            return;
        }

        setIsLoading(true);

        // TODO: Implement registration logic with backend
        const registerRequest = {
            AdminUser: {
                Email: email,
                FirstName: firstName,
                LastName: lastName,
                Password: password,
            },
            OrganizationName: organizationName,
            Plan: plan,
        };

        console.log("Registration attempt:", registerRequest);

        setIsLoading(false);
    };

    return (
        <div className={styles.registerContainer}>
            <Card
                className={styles.registerCard}
                shadow="xl"
                padding="xl"
                radius="md"
            >
                <div className={styles.registerHeader}>
                    <Title order={2}>{resources.title}</Title>
                    <Text c="dimmed" size="sm">
                        {resources.subtitle}
                    </Text>
                </div>

                <form onSubmit={handleSubmit} className={styles.registerForm}>
                    <div className={styles.formSplit}>
                        {/* Left side - User Info */}
                        <div className={styles.formSection}>
                            <Title order={4} className={styles.sectionTitle}>
                                {resources.userInfoTitle}
                            </Title>

                            <TextInput
                                label={resources.emailLabel}
                                placeholder={resources.emailPlaceholder}
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.currentTarget.value)
                                }
                                required
                                size="md"
                            />

                            <TextInput
                                label={resources.firstNameLabel}
                                placeholder={resources.firstNamePlaceholder}
                                value={firstName}
                                onChange={(e) =>
                                    setFirstName(e.currentTarget.value)
                                }
                                required
                                size="md"
                            />

                            <TextInput
                                label={resources.lastNameLabel}
                                placeholder={resources.lastNamePlaceholder}
                                value={lastName}
                                onChange={(e) =>
                                    setLastName(e.currentTarget.value)
                                }
                                required
                                size="md"
                            />

                            <PasswordInput
                                label={resources.passwordLabel}
                                placeholder={resources.passwordPlaceholder}
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.currentTarget.value)
                                }
                                required
                                size="md"
                            />

                            <PasswordInput
                                label={resources.confirmPasswordLabel}
                                placeholder={
                                    resources.confirmPasswordPlaceholder
                                }
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.currentTarget.value)
                                }
                                required
                                size="md"
                            />
                        </div>

                        {/* Right side - Organization Info */}
                        <div className={styles.formSection}>
                            <Title order={4} className={styles.sectionTitle}>
                                {resources.orgInfoTitle}
                            </Title>

                            <TextInput
                                label={resources.orgNameLabel}
                                placeholder={resources.orgNamePlaceholder}
                                value={organizationName}
                                onChange={(e) =>
                                    setOrganizationName(e.currentTarget.value)
                                }
                                required
                                size="md"
                            />

                            <Select
                                label={resources.planLabel}
                                placeholder={resources.planPlaceholder}
                                value={plan}
                                onChange={(value) => setPlan(value as PlanType)}
                                data={PLANS.map((p) => ({
                                    value: p.id,
                                    label: p.name,
                                }))}
                                required
                                size="md"
                            />

                            {plan && (
                                <Card
                                    className={styles.planDescription}
                                    padding="md"
                                    radius="sm"
                                >
                                    <Text size="sm" c="dimmed">
                                        {
                                            PLANS.find((p) => p.id === plan)
                                                ?.description
                                        }
                                    </Text>
                                </Card>
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        size="md"
                        loading={isLoading}
                        className={styles.registerButton}
                    >
                        {resources.registerButton}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
