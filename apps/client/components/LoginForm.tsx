"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { AuthField } from "@/components/AuthField";
import { AuthSubmitButton } from "@/components/AuthSubmitButton";
import { PasswordField } from "@/components/PasswordField";
import { FieldGroup } from "@/components/ui/field";
import { login } from "@/lib/actions/auth-actions";
import { loginSchema, type LoginValues } from "@/lib/authSchema";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LoginForm() {
    const router = useRouter();
    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
        mode: "onTouched",
    });

    const onSubmit = async (values: LoginValues) => {
        const result = await login(values);
        console.log({ result });
        if (!result.ok) {
            if (result.fieldErrors) {
                if (result.fieldErrors.properties?.email?.errors) {
                    form.setError("email", {
                        message:
                            result.fieldErrors.properties?.email?.errors[0],
                    });
                }
                if (result.fieldErrors.properties?.password?.errors) {
                    form.setError("password", {
                        message:
                            result.fieldErrors.properties?.password?.errors[0],
                    });
                }
            } else {
                form.setError("root", {
                    message: result.message,
                });
            }
            return;
        }
        form.reset();
        toast.success(result.data?.message);
        router.push("/login");
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
                            href="/forgot-password"
                            className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                            Forgot password?
                        </Link>
                    }
                />
            </FieldGroup>

            {form.formState.errors.root && (
                <p className="text-sm text-destructive">
                    {form.formState.errors.root.message}
                </p>
            )}

            <AuthSubmitButton disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in
                    </>
                ) : (
                    "Sign in"
                )}
            </AuthSubmitButton>
        </form>
    );
}
