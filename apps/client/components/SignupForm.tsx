"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { AuthField } from "@/components/AuthField";
import { AuthSubmitButton } from "@/components/AuthSubmitButton";
import { PasswordField } from "@/components/PasswordField";
import { FieldGroup } from "@/components/ui/field";
import { createAccount } from "@/lib/actions/auth-actions";
import { signupSchema, type SignupValues } from "@/lib/authSchema";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { toast } from "sonner";

export function SignupForm() {
    const router = useRouter();
    const form = useForm<SignupValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: { name: "", email: "", password: "" },
        mode: "onTouched",
    });
    useLayoutEffect(() => {
        form.reset();
    }, []);
    const onSubmit = async (values: SignupValues) => {
        const result = await createAccount(values);
        if (!result.ok) {
            if (result.fieldErrors) {
                if (result.fieldErrors.properties?.name?.errors) {
                    form.setError("name", {
                        message: result.fieldErrors.properties?.name?.errors[0],
                    });
                }
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
        toast.success("Account created successfully");
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

            {form.formState.errors.root && (
                <p className="text-sm text-destructive">
                    {form.formState.errors.root.message}
                </p>
            )}

            <AuthSubmitButton disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account
                    </>
                ) : (
                    "Create account"
                )}
            </AuthSubmitButton>

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
