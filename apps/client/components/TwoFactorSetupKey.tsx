"use client";

import { Check, Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

/** Group the base32 secret into readable chunks (e.g. "abcd efgh ..."). */
function formatSecret(secret: string) {
    return secret.match(/.{1,4}/g)?.join(" ") ?? secret;
}

type TwoFactorSetupKeyProps = {
    otpauthURI: string;
    secret: string;
};

/** The scan-or-type setup key shown during the enable flow. */
export function TwoFactorSetupKey({
    otpauthURI,
    secret,
}: TwoFactorSetupKeyProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(secret);
            setCopied(true);
            toast.success("Setup key copied");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Couldn't copy the setup key");
        }
    };

    return (
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="w-fit rounded-2xl border border-zinc-200 bg-white p-4">
                <QRCodeSVG
                    value={otpauthURI}
                    size={168}
                    level="M"
                    marginSize={0}
                    title="Two-factor authentication QR code"
                />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Can&apos;t scan the code?
                </p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Enter this setup key in your authenticator app instead.
                </p>
                <div className="mt-3 flex items-center gap-2">
                    <code className="min-w-0 flex-1 truncate rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
                        {formatSecret(secret)}
                    </code>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label="Copy setup key"
                        onClick={handleCopy}
                        className="size-10 shrink-0 rounded-full border-zinc-300 bg-white text-zinc-900 transition hover:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-100"
                    >
                        {copied ? (
                            <Check className="size-4" />
                        ) : (
                            <Copy className="size-4" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
