"use strict";
// lib/session-sync.ts
// ระบบสำหรับ sync session state ระหว่างแท็บต่างๆ
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionSync = void 0;
class SessionSync {
    static STORAGE_KEY = "tedin_session_state";
    static LOGOUT_EVENT = "tedin_logout";
    // บันทึก session state
    static setSessionState(state) {
        const stateWithTimestamp = {
            ...state,
            timestamp: Date.now(),
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stateWithTimestamp));
        // ส่ง event ไปยังแท็บอื่นๆ
        window.dispatchEvent(new CustomEvent("session_change", {
            detail: stateWithTimestamp,
        }));
    }
    // ดึง session state ปัจจุบัน
    static getSessionState() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (!stored)
                return null;
            const state = JSON.parse(stored);
            // ตรวจสอบว่า state ไม่เก่าเกินไป (5 นาที)
            const now = Date.now();
            const maxAge = 5 * 60 * 1000; // 5 minutes
            if (now - state.timestamp > maxAge) {
                localStorage.removeItem(this.STORAGE_KEY);
                return null;
            }
            return state;
        }
        catch {
            return null;
        }
    }
    // ล้าง session state และแจ้งแท็บอื่นๆ
    static clearSessionState() {
        localStorage.removeItem(this.STORAGE_KEY);
        // แจ้ง logout event ไปยังแท็บอื่นๆ
        localStorage.setItem(this.LOGOUT_EVENT, Date.now().toString());
        localStorage.removeItem(this.LOGOUT_EVENT);
        window.dispatchEvent(new CustomEvent("session_logout"));
    }
    // ฟังการเปลี่ยนแปลง session ใน storage
    static onSessionChange(callback) {
        const handleStorageChange = (e) => {
            if (e.key === this.STORAGE_KEY) {
                const newState = e.newValue ? JSON.parse(e.newValue) : null;
                callback(newState);
            }
            else if (e.key === this.LOGOUT_EVENT) {
                // มีการ logout ในแท็บอื่น
                callback(null);
            }
        };
        const handleCustomEvent = (e) => {
            if (e.type === "session_change") {
                callback(e.detail);
            }
            else if (e.type === "session_logout") {
                callback(null);
            }
        };
        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("session_change", handleCustomEvent);
        window.addEventListener("session_logout", handleCustomEvent);
        // Return cleanup function
        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("session_change", handleCustomEvent);
            window.removeEventListener("session_logout", handleCustomEvent);
        };
    }
    // ตรวจสอบว่าควร redirect ไปไหนเมื่อไม่มี session
    static getRedirectPath(currentPath) {
        // ถ้าอยู่ในหน้า super-admin ไป super-admin-login
        if (currentPath.startsWith("/super-admin")) {
            return "/super-admin-login";
        }
        // ถ้าอยู่ในหน้าอื่นๆ ไปหน้าแรก
        return "/";
    }
}
exports.SessionSync = SessionSync;
//# sourceMappingURL=session-sync.js.map