import { useEffect } from "react";

function isMobileDevice(): boolean {
    if (typeof window === "undefined" || typeof navigator === "undefined")
        return false;

    try {
        if (window.matchMedia && window.matchMedia("(pointer:coarse)").matches)
            return true;
        if (
            (navigator as any).maxTouchPoints &&
            (navigator as any).maxTouchPoints > 1
        )
            return true;
        if ("ontouchstart" in window) return true;

        const ua =
            navigator.userAgent ||
            navigator.vendor ||
            (window as any).opera ||
            "";
        return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|BlackBerry|webOS|Mobile/i.test(
            ua
        );
    } catch {
        return false;
    }
}

export function MobileRedirectSimple({ to }: { to: string }) {
    useEffect(() => {
        if (isMobileDevice()) {
            window.location.href = to;
        }
    }, [to]);

    return null;
}
