import {
    Button,
    Card,
    PasswordInput,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { useState } from "react";
import { useLogin } from "@/modules/auth/src/hooks";
import styles from "./login-page.module.css";
import resources from "./login-page.resources.json";

export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoading, error } = useLogin();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await login(email, password);
            // TODO: Navigate to dashboard or home page after successful login
            console.log("Login successful");
        } catch (err) {
            // Error is already handled by the hook
            console.error("Login error:", err);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <Card
                className={styles.loginCard}
                shadow="xl"
                padding="xl"
                radius="md"
            >
                <div className={styles.loginHeader}>
                    <Title order={2}>{resources.title}</Title>
                    <Text c="dimmed" size="sm">
                        {resources.subtitle}
                    </Text>
                </div>

                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    {error && (
                        <Text c="red" size="sm">
                            {error}
                        </Text>
                    )}

                    <TextInput
                        label={resources.emailLabel}
                        placeholder={resources.emailPlaceholder}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        required
                        size="md"
                    />

                    <PasswordInput
                        label={resources.passwordLabel}
                        placeholder={resources.passwordPlaceholder}
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        required
                        size="md"
                    />

                    <Button
                        type="submit"
                        fullWidth
                        size="md"
                        loading={isLoading}
                        className={styles.loginButton}
                    >
                        {resources.loginButton}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
