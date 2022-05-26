// Don't import __tsubotanka_injected__ as constant. These functions are expected to be serialized.

export function isInjected(): boolean {
    return !!(window as any).__tsubotanka_injected__;
}

export function markAsInjected(): void {
    (window as any).__tsubotanka_injected__ = true;
}
