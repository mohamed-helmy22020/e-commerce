"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { AuthField } from "@/components/AuthField";
import { PasswordField } from "@/components/PasswordField";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { signupSchema, type SignupValues } from "@/lib/authSchema";

export function SignupForm() {
    const form = useForm<SignupValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: { name: "", email: "", password: "" },
        mode: "onTouched",
    });

    const onSubmit = (values: SignupValues) => {
        // UI only — account creation is not wired up yet.
        void values;
    };

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-6"
        >
            <FieldGroup className="gap-5">
                <AuthField
                    control={form.control}
                    name="name"
                    label="Name"
                    placeholder="Jane Doe"
                    autoComplete="name"
                />
                <AuthField
                    control={form.control}
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                />
                <PasswordField
                    control={form.control}
                    name="password"
                    label="Password"
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                />
            </FieldGroup>

            <Button
                type="submit"
                className="h-12 w-full rounded-full bg-zinc-900 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
                Create account
            </Button>

            <p className="text-center text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                By creating an account you agree to our{" "}
                <Link
                    href="#"
                    className="font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-100"
                >
                    Terms
                </Link>{" "}
                and{" "}
                <Link
                    href="#"
                    className="font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-100"
                >
                    Privacy Policy
                </Link>
                .
            </p>
        </form>
    );
}
