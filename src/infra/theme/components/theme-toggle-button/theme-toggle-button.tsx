/** @author aaron-iz */
import { ActionIcon } from "@mantine/core";
import { useThemeStore } from "../../state";
import { MoonIcon, SunIcon } from "../../../../common/icons";

export const ThemeToggleButton = () => {
    const { colorScheme, toggleColorScheme } = useThemeStore();
    const isDark = colorScheme === "dark";

    return (
        <ActionIcon
            onClick={toggleColorScheme}
            variant="default"
            size="lg"
            aria-label="Toggle color scheme"
        >
            {isDark ? <SunIcon size={20} /> : <MoonIcon size={20} />}
        </ActionIcon>
    );
};
