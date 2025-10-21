export interface SessionState {
    isAuthenticated: boolean;
    userRole?: string;
    timestamp: number;
}
export declare class SessionSync {
    private static readonly STORAGE_KEY;
    private static readonly LOGOUT_EVENT;
    static setSessionState(state: SessionState): void;
    static getSessionState(): SessionState | null;
    static clearSessionState(): void;
    static onSessionChange(callback: (state: SessionState | null) => void): () => void;
    static getRedirectPath(currentPath: string): string;
}
//# sourceMappingURL=session-sync.d.ts.map