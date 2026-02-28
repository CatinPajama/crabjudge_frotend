const ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
];

export function verifyCsrf(req: Request): { valid: boolean; error?: string } {
    const origin = req.headers.get("origin");
    const referer = req.headers.get("referer");

    if (origin) {
        if (ALLOWED_ORIGINS.includes(origin)) {
            return { valid: true };
        }
        return { valid: false, error: "Forbidden: invalid origin" };
    }

    if (referer) {
        try {
            const refererOrigin = new URL(referer).origin;
            if (ALLOWED_ORIGINS.includes(refererOrigin)) {
                return { valid: true };
            }
        } catch {
        }
        return { valid: false, error: "Forbidden: invalid referer" };
    }

    return { valid: false, error: "Forbidden: missing origin" };
}
