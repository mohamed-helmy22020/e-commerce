import { UserRole } from "shared";

export type RbacRule = {
    method: string;
    path: string;
    roles: UserRole[];
};

export const publicRoutes = [
    {
        method: "POST",
        path: "/auth/register",
    },
    {
        method: "POST",
        path: "/auth/login",
    },
    {
        method: "GET",
        path: "/auth/verify-email/:token",
    },
    {
        method: "POST",
        path: "/auth/refresh-token",
    },
    {
        method: "POST",
        path: "/auth/forgot-password",
    },
    {
        method: "POST",
        path: "/auth/reset-password",
    },
] as const;

const rbacRules: RbacRule[] = [
    {
        method: "GET",
        path: "/auth/me",
        roles: ["USER", "ADMIN"],
    },
    {
        method: "POST",
        path: "/auth/logout",
        roles: ["USER", "ADMIN"],
    },
    {
        method: "POST",
        path: "/auth/2fa-setup",
        roles: ["USER", "ADMIN"],
    },
    {
        method: "POST",
        path: "/auth/2fa-verify",
        roles: ["USER", "ADMIN"],
    },
];

function matchPath(pattern: string, actualPath: string): boolean {
    if (pattern === actualPath) {
        return true;
    }
    const patternParts = pattern.split("/");
    const actualPathParts = actualPath.split("/");
    if (patternParts.length !== actualPathParts.length) {
        return false;
    }
    return patternParts.every((part, index) => {
        if (part.startsWith(":")) {
            return true;
        }
        return part === actualPathParts[index];
    });
}

export function isPublicRoute(method: string, path: string): boolean {
    return publicRoutes.some(
        (route) => matchPath(route.path, path) && route.method === method,
    );
}

export function getAllowedRoles(
    method: string,
    path: string,
): UserRole[] | null {
    const rule = rbacRules.find(
        (rule) => matchPath(rule.path, path) && rule.method === method,
    );
    return rule?.roles ?? null;
}
