"use client";

import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { TwoFactorSetupCard } from "@/components/TwoFactorSetupCard";
import { TwoFactorStatusCard } from "@/components/TwoFactorStatusCard";
import { useUserStore } from "@/stores/user.store";

/**
 * Two-factor authentication settings. Owns the on/off state and keeps the
 * client user mirror in sync; the actual flows live in the two cards below.
 */
export function TwoFactorSettings({ user }: { user: User }) {
    const [enabled, setEnabled] = useState(user.twoFactorEnabled);
    const { setUser } = useUserStore(
        useShallow((state) => ({ setUser: state.setUser })),
    );

    // The server is the source of truth; mirror the new flag into the store.
    const setTwoFactorEnabled = (value: boolean) => {
        setEnabled(value);
        setUser({ ...user, twoFactorEnabled: value });
    };

    if (enabled) {
        return (
            <TwoFactorStatusCard
                onDisabled={() => setTwoFactorEnabled(false)}
            />
        );
    }

    return (
        <TwoFactorSetupCard onEnabled={() => setTwoFactorEnabled(true)} />
    );
}
