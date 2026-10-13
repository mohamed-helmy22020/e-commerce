"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import { AuthField } from "@/components/AuthField";
import { AuthSubmitButton } from "@/components/AuthSubmitButton";
import { PasswordField } from "@/components/PasswordField";
import { SecondaryButton } from "@/components/SecondaryButton";
import { FieldGroup } from "@/components/ui/field";
import { updateUser } from "@/lib/actions/user.actions";
import { profileSchema, type ProfileValues } from "@/lib/authSchema";
import { useUserStore } from "@/stores/user.store";

export function ProfileForm({ user }: { user: User }) {
    const form = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            password: "",
            newPassword: "",
            confirmNewPassword: "",
        },
        mode: "onTouched",
    });

    const { setUser } = useUserStore(
        useShallow((state) => ({ setUser: state.setUser })),
    );

    // The backend requires the current password whenever the email or the
    // password changes, so surface that field only when it is needed.
    const emailChanged =
        form.watch("email").trim().toLowerCase() !==
        user.email.trim().toLowerCase();
    const wantsPasswordChange = Boolean(form.watch("newPassword"));
    const needsCurrentPassword = emailChanged || wantsPasswordChange;

    const onSubmit = async (values: ProfileValues) => {
        if (needsCurrentPassword && !values.password) {
            form.setError("password", {
                message: emailChanged
                    ? "Enter your current password to change your email."
                    : "Enter your current password to change your password.",
            });
            return;
        }

        const result = await updateUser(values);

        if (!result.ok) {
            if (result.fieldErrors) {
                const properties = result.fieldErrors.properties;
                if (properties?.name?.errors?.[0]) {
                    form.setError("name", {
                        message: properties.name.errors[0],
                    });
                }
                if (properties?.email?.errors?.[0]) {
                    form.setError("email", {
                        message: properties.email.errors[0],
                    });
                }
                if (properties?.password?.errors?.[0]) {
                    form.setError("password", {
                        message: properties.password.errors[0],
                    });
                }
                if (properties?.newPassword?.errors?.[0]) {
                    form.setError("newPassword", {
                        message: properties.newPassword.errors[0],
                    });
                }
                if (properties?.confirmNewPassword?.errors?.[0]) {
                    form.setError("confirmNewPassword", {
                        message: properties.confirmNewPassword.errors[0],
                    });
                }
            } else {
                form.setError("root", { message: result.message });
            }
            return;
        }

        const updatedUser = result.data.user;
        form.reset({
            name: updatedUser.name,
            email: updatedUser.email,
            password: "",
            newPassword: "",
            confirmNewPassword: "",
        });
        // Mirror the server (source of truth) into the client store so the
        // header and other client components pick the change up immediately.
        setUser(updatedUser);
        toast.success("Profile updated");
    };

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900"
        >
            <header>
                <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Edit profile
                </h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Update your name, email address and password.
                </p>
            </header>

            <FieldGroup className="mt-6 gap-5">
                <AuthField
                    control={form.control}
                    name="name"
                    label="Full name"
                    placeholder="Jane Doe"
                    autoComplete="name"
                />
                <AuthField
                    control={form.control}
                    name="email"
                    label="Email address"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                />
            </FieldGroup>

            <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
                <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                    Change password
                </h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Leave the new password fields blank to keep your current
                    password.
                </p>

                <FieldGroup className="mt-5 gap-5">
                    <PasswordField
                        control={form.control}
                        name="newPassword"
                        label="New password"
                        placeholder="Enter a new password"
                        autoComplete="new-password"
                    />
                    <PasswordField
                        control={form.control}
                        name="confirmNewPassword"
                        label="Confirm new password"
                        placeholder="Re-enter your new password"
                        autoComplete="new-password"
                    />
                </FieldGroup>
            </div>

            {needsCurrentPassword ? (
                <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
                    <div className="flex items-start gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                            <Lock className="size-4" />
                        </span>
                        <div className="min-w-0">
                            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                Confirm your identity
                            </h3>
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                You need your current password to change your
                                email or password.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5">
                        <PasswordField
                            control={form.control}
                            name="password"
                            label="Current password"
                            placeholder="Enter your current password"
                            autoComplete="current-password"
                        />
                    </div>
                </div>
            ) : null}

            {form.formState.errors.root ? (
                <p className="mt-4 text-sm text-destructive">
                    {form.formState.errors.root.message}
                </p>
            ) : null}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <SecondaryButton asChild>
                    <Link href="/settings">Cancel</Link>
                </SecondaryButton>
                <AuthSubmitButton
                    className="w-full sm:w-auto"
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? (
                        <>
                            <Loader2 className="me-2 size-4 animate-spin" />
                            Saving
                        </>
                    ) : (
                        "Save changes"
                    )}
                </AuthSubmitButton>
            </div>
        </form>
    );
}
