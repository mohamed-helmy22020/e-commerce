"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { AuthField } from "@/components/AuthField";
import { PasswordField } from "@/components/PasswordField";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { loginSchema, type LoginValues } from "@/lib/authSchema";

export function LoginForm() {
    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
        mode: "onTouched",
    });

    const onSubmit = (values: LoginValues) => {
        // UI only — authentication is not wired up yet.
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
                    autoComplete="current-password"
                    action={
                        <Link
                            href="#"
                            className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                            Forgot password?
                        </Link>
                    }
                />
            </FieldGroup>

            <Button
                type="submit"
                className="h-12 w-full rounded-full bg-zinc-900 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
                Sign in
            </Button>
        </form>
    );
}
