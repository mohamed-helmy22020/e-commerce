const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type FetchOptions = RequestInit & {
    skipAuth?: boolean;
};

let accessToken: string | null = null;
const pendingRequests: Array<() => void> = [];
let isRefreshing = false;

export function setAccessToken(token: string | null) {
    accessToken = token;
}

export function getAccessToken(): string | null {
    return accessToken;
}

async function refreshAccessToken(): Promise<string | null> {
    try {
        const res = await fetch(`${API_BASE}/api/auth/refresh`, {
            method: "POST",
            credentials: "include",
        });
        if (!res.ok) return null;
        const data = (await res.json()) as { accessToken?: string };
        if (data.accessToken) {
            setAccessToken(data.accessToken);
            return data.accessToken;
        }
        return null;
    } catch {
        return null;
    }
}

function queueRequest(cb: () => void) {
    pendingRequests.push(cb);
}

function flushPendingRequests() {
    const requests = [...pendingRequests];
    pendingRequests.length = 0;
    requests.forEach((cb) => cb());
}

export async function api<T = Record<string, unknown>>(
    endpoint: string,
    options: FetchOptions = {},
): Promise<T> {
    const { skipAuth, headers, ...rest } = options;
    const url = endpoint.startsWith("http")
        ? endpoint
        : `${API_BASE}${endpoint}`;

    const finalHeaders = new Headers(headers);
    if (
        !finalHeaders.has("Content-Type") &&
        rest.body &&
        typeof rest.body === "string"
    ) {
        finalHeaders.set("Content-Type", "application/json");
    }
    if (!skipAuth && accessToken) {
        finalHeaders.set("Authorization", `Bearer ${accessToken}`);
    }

    const fetchOptions: RequestInit = {
        credentials: "include",
        ...rest,
        headers: finalHeaders,
    };

    let res = await fetch(url, fetchOptions);

    if (res.status === 401 && !skipAuth) {
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                queueRequest(async () => {
                    try {
                        const retryRes = await api<T>(endpoint, {
                            ...options,
                            skipAuth: false,
                        });
                        resolve(retryRes);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        }

        isRefreshing = true;
        const newToken = await refreshAccessToken();
        isRefreshing = false;

        if (newToken) {
            flushPendingRequests();
            const retryHeaders = new Headers(headers);
            if (
                !retryHeaders.has("Content-Type") &&
                rest.body &&
                typeof rest.body === "string"
            ) {
                retryHeaders.set("Content-Type", "application/json");
            }
            retryHeaders.set("Authorization", `Bearer ${newToken}`);
            res = await fetch(url, {
                ...fetchOptions,
                headers: retryHeaders,
            });
            if (!res.ok)
                throw await res.json().catch(() => ({ error: res.statusText }));
            return (await res.json()) as T;
        } else {
            flushPendingRequests();
            throw await res.json().catch(() => ({ error: "Unauthorized" }));
        }
    }

    if (!res.ok) {
        throw await res.json().catch(() => ({ error: res.statusText }));
    }

    if (res.status === 204) {
        return {} as T;
    }

    return (await res.json()) as T;
}
