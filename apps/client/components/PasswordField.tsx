"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { AuthField } from "@/components/AuthField";
import { InputGroupButton } from "@/components/ui/input-group";

type PasswordFieldProps<T extends FieldValues> = {
    control: Control<T>;
    name: FieldPath<T>;
    label?: string;
    placeholder?: string;
    autoComplete?: string;
    action?: ReactNode;
};

export function PasswordField<T extends FieldValues>({
    label = "Password",
    placeholder = "••••••••",
    autoComplete = "current-password",
    action,
    ...props
}: PasswordFieldProps<T>) {
    const [visible, setVisible] = useState(false);

    return (
        <AuthField
            {...props}
            label={label}
            action={action}
            type={visible ? "text" : "password"}
            placeholder={placeholder}
            autoComplete={autoComplete}
            endAddon={
                <InputGroupButton
                    type="button"
                    size="icon-sm"
                    aria-label={visible ? "Hide password" : "Show password"}
                    onClick={() => setVisible((value) => !value)}
                    className="me-1.5 rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                    {visible ? (
                        <EyeOff className="size-4" />
                    ) : (
                        <Eye className="size-4" />
                    )}
                </InputGroupButton>
            }
        />
    );
}
