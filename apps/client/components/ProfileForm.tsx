"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthField } from "@/components/AuthField";
import { AuthSubmitButton } from "@/components/AuthSubmitButton";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { profileSchema, type ProfileValues } from "@/lib/authSchema";

export function ProfileForm({ user }: { user: User }) {
    const form = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: { name: user.name, email: user.email },
        mode: "onTouched",
    });

    const onSubmit = async (values: ProfileValues) => {
        // UI only: validation and feedback wired, persistence is not.
        await new Promise((resolve) => setTimeout(resolve, 400));
        form.reset(values);
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
                    Update your name and email address.
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

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                    asChild
                    variant="outline"
                    className="h-12 rounded-full border-zinc-300 bg-white px-7 text-sm font-medium text-zinc-900 transition hover:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-100"
                >
                    <Link href="/settings">Cancel</Link>
                </Button>
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
