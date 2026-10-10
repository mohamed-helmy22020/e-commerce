"use client";

import type { ReactNode } from "react";
import {
    Controller,
    type Control,
    type FieldPath,
    type FieldValues,
} from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";

const inputClassName =
    "h-12 rounded-full border-zinc-200 bg-zinc-50 ps-5 pe-5 text-base text-zinc-900 placeholder:text-zinc-400 focus-visible:border-zinc-400 focus-visible:bg-white focus-visible:ring-0 md:text-base dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus-visible:border-zinc-600 dark:focus-visible:bg-zinc-900";

const inputGroupClassName =
    "h-12 rounded-full border-zinc-200 bg-zinc-50 has-[[data-slot=input-group-control]:focus-visible]:border-zinc-400 has-[[data-slot=input-group-control]:focus-visible]:ring-0 dark:border-zinc-800 dark:bg-zinc-950 dark:has-[[data-slot=input-group-control]:focus-visible]:border-zinc-600";

const inputGroupInputClassName =
    "h-full ps-5 pe-5 text-base text-zinc-900 placeholder:text-zinc-400 md:text-base dark:text-zinc-100 dark:placeholder:text-zinc-500";

type AuthFieldProps<T extends FieldValues> = {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
    autoComplete?: string;
    /** Optional content rendered at the end of the label row (e.g. a link). */
    action?: ReactNode;
    /** Optional content rendered at the end of the input (e.g. a button). */
    endAddon?: ReactNode;
};

export function AuthField<T extends FieldValues>({
    control,
    name,
    label,
    type = "text",
    placeholder,
    autoComplete,
    action,
    endAddon,
}: AuthFieldProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <div className="flex w-full items-center justify-between gap-2">
                        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                        {action}
                    </div>

                    {endAddon ? (
                        <InputGroup className={inputGroupClassName}>
                            <InputGroupInput
                                {...field}
                                id={field.name}
                                type={type}
                                placeholder={placeholder}
                                autoComplete={autoComplete}
                                aria-invalid={fieldState.invalid}
                                className={inputGroupInputClassName}
                            />
                            <InputGroupAddon align="inline-end">
                                {endAddon}
                            </InputGroupAddon>
                        </InputGroup>
                    ) : (
                        <Input
                            {...field}
                            id={field.name}
                            type={type}
                            placeholder={placeholder}
                            autoComplete={autoComplete}
                            aria-invalid={fieldState.invalid}
                            className={inputClassName}
                        />
                    )}

                    {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                    ) : null}
                </Field>
            )}
        />
    );
}
