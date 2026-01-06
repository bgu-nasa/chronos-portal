import { useEffect, useState } from "react";
import {
    Drawer,
    TextInput,
    Button,
    Stack,
    Group,
    Modal,
    Text,
    FileButton,
    Avatar,
    Alert,
} from "@mantine/core";
import { useUserEditorStore } from "@/modules/auth/src/state/user-editor.store";
import {
    useCreateUser,
    useUpdateUser,
} from "@/modules/auth/src/hooks/use-users";
import { useImageUpload } from "@/modules/auth/src/hooks/use-image-upload";
import { generateSecurePassword } from "@/modules/auth/src/common/password-generator";
import {
    validateEmail,
    validateFirstName,
    validateLastName,
} from "@/modules/auth/src/common/validation.service";
import { CopiableInput } from "@/common/components/copiable-input";
import resources from "./user-editor.resources.json";

interface UserFormValues {
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
}

interface FormErrors {
    email?: string;
    firstName?: string;
    lastName?: string;
}

export function UserEditor() {
    const {
        isOpen,
        mode,
        editingUser,
        generatedPassword,
        close,
        setGeneratedPassword,
        clearGeneratedPassword,
    } = useUserEditorStore();
    const { createUser, isLoading: isCreating } = useCreateUser();
    const { updateUser, isLoading: isUpdating } = useUpdateUser();
    const { uploadImage, isUploading, error: uploadError } = useImageUpload();

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [formValues, setFormValues] = useState<UserFormValues>({
        email: "",
        firstName: "",
        lastName: "",
        avatarUrl: null,
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    // Reset form when drawer opens/closes or editing user changes
    useEffect(() => {
        if (isOpen && mode === "edit" && editingUser) {
            setFormValues({
                email: editingUser.email,
                firstName: editingUser.firstName,
                lastName: editingUser.lastName,
                avatarUrl: editingUser.avatarUrl || null,
            });
            setAvatarPreview(editingUser.avatarUrl || null);
        } else if (isOpen && mode === "create") {
            setFormValues({
                email: "",
                firstName: "",
                lastName: "",
                avatarUrl: null,
            });
            setAvatarPreview(null);
        }
        setAvatarFile(null);
        setFormErrors({});
    }, [isOpen, mode, editingUser]);

    const handleAvatarChange = (file: File | null) => {
        if (file) {
            setAvatarFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
        setFormValues((prev) => ({ ...prev, avatarUrl: null }));
    };

    const validateForm = (): boolean => {
        const errors: FormErrors = {};

        const emailError = validateEmail(formValues.email);
        if (emailError) errors.email = emailError;

        const firstNameError = validateFirstName(formValues.firstName);
        if (firstNameError) errors.firstName = firstNameError;

        const lastNameError = validateLastName(formValues.lastName);
        if (lastNameError) errors.lastName = lastNameError;

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        let uploadedAvatarUrl = formValues.avatarUrl;

        // Upload avatar if a new file was selected
        if (avatarFile) {
            uploadedAvatarUrl = await uploadImage(avatarFile);
            if (!uploadedAvatarUrl) {
                // Upload failed, error is already set in the hook
                return;
            }
        }

        if (mode === "create") {
            // Generate password for new user
            const password = generateSecurePassword();

            const result = await createUser({
                email: formValues.email,
                firstName: formValues.firstName,
                lastName: formValues.lastName,
                password: password,
            });

            if (result) {
                setGeneratedPassword(password);
                setShowPasswordModal(true);
            }
        } else if (mode === "edit" && editingUser) {
            const success = await updateUser(editingUser.userId, {
                firstName: formValues.firstName,
                lastName: formValues.lastName,
                avatarUrl: uploadedAvatarUrl,
            });

            if (success) {
                close();
            }
        }
    };

    const handlePasswordModalClose = () => {
        setShowPasswordModal(false);
        clearGeneratedPassword();
        close();
    };

    const isLoading = isCreating || isUpdating || isUploading;

    return (
        <>
            <Drawer
                opened={isOpen}
                onClose={close}
                title={resources.drawerTitle[mode]}
                position="right"
                size="md"
            >
                <form onSubmit={handleSubmit}>
                    <Stack gap="md">
                        {uploadError && (
                            <Alert
                                color="red"
                                title={resources.errors.uploadFailed}
                            >
                                {uploadError}
                            </Alert>
                        )}

                        <TextInput
                            label={resources.form.email}
                            placeholder="user@example.com"
                            required
                            disabled={mode === "edit"}
                            value={formValues.email}
                            onChange={(e) =>
                                setFormValues((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                }))
                            }
                            error={formErrors.email}
                        />

                        <TextInput
                            label={resources.form.firstName}
                            placeholder="John"
                            required
                            value={formValues.firstName}
                            onChange={(e) =>
                                setFormValues((prev) => ({
                                    ...prev,
                                    firstName: e.target.value,
                                }))
                            }
                            error={formErrors.firstName}
                        />

                        <TextInput
                            label={resources.form.lastName}
                            placeholder="Doe"
                            required
                            value={formValues.lastName}
                            onChange={(e) =>
                                setFormValues((prev) => ({
                                    ...prev,
                                    lastName: e.target.value,
                                }))
                            }
                            error={formErrors.lastName}
                        />

                        {mode === "edit" && (
                            <Stack gap="xs">
                                <Text size="sm" fw={500}>
                                    {resources.form.avatarUrl}
                                </Text>

                                <Group gap="md">
                                    <Avatar
                                        src={avatarPreview}
                                        size="lg"
                                        radius="md"
                                    />

                                    <Stack gap="xs">
                                        <FileButton
                                            onChange={handleAvatarChange}
                                            accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                                        >
                                            {(props) => (
                                                <Button
                                                    {...props}
                                                    variant="light"
                                                    size="xs"
                                                    disabled={isUploading}
                                                >
                                                    {isUploading
                                                        ? resources.form
                                                              .uploadingImage
                                                        : avatarPreview
                                                        ? resources.form
                                                              .changeImage
                                                        : resources.form
                                                              .uploadImage}
                                                </Button>
                                            )}
                                        </FileButton>

                                        {avatarPreview && (
                                            <Button
                                                variant="subtle"
                                                color="red"
                                                size="xs"
                                                onClick={handleRemoveAvatar}
                                            >
                                                {resources.form.removeImage}
                                            </Button>
                                        )}
                                    </Stack>
                                </Group>
                            </Stack>
                        )}

                        <Group justify="flex-end" mt="md">
                            <Button
                                variant="default"
                                onClick={close}
                                disabled={isLoading}
                            >
                                {resources.buttons.cancel}
                            </Button>
                            <Button type="submit" loading={isLoading}>
                                {mode === "create"
                                    ? resources.buttons.create
                                    : resources.buttons.save}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Drawer>

            {/* Password Display Modal */}
            <Modal
                opened={showPasswordModal}
                onClose={handlePasswordModalClose}
                title={resources.passwordModal.title}
                closeOnClickOutside={false}
                closeOnEscape={false}
            >
                <Stack gap="md">
                    <Alert color="blue">
                        {resources.passwordModal.message}
                    </Alert>

                    <CopiableInput
                        label={resources.passwordModal.emailLabel}
                        value={formValues.email}
                    />

                    <CopiableInput
                        label={resources.passwordModal.passwordLabel}
                        value={generatedPassword || ""}
                    />

                    <Button fullWidth onClick={handlePasswordModalClose}>
                        {resources.passwordModal.closeButton}
                    </Button>
                </Stack>
            </Modal>
        </>
    );
}
