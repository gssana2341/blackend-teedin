export interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
}
export declare const OTP_RATE_LIMIT: RateLimitConfig;
export declare const PASSWORD_RESET_RATE_LIMIT: RateLimitConfig;
/**
 * ตรวจสอบ rate limit สำหรับ IP หรือ email
 * @param key - คีย์สำหรับ rate limit (เช่น IP address หรือ email)
 * @param config - การกำหนดค่า rate limit
 * @returns { allowed: boolean, remaining: number, resetTime: number }
 */
export declare const checkRateLimit: (key: string, config: RateLimitConfig) => {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    retryAfter?: number;
};
/**
 * ล้างข้อมูล rate limit ที่หมดอายุแล้ว
 */
export declare const cleanupExpiredEntries: () => void;
/**
 * รีเซ็ต rate limit สำหรับ key ที่กำหนด (สำหรับการทดสอบ)
 */
export declare const resetRateLimit: (key: string) => void;
/**
 * ดูข้อมูล rate limit ปัจจุบันทั้งหมด (สำหรับการ debug)
 */
export declare const getRateLimitStats: () => {
    key: string;
    count: number;
    resetTime: string;
    remainingTime: number;
}[];
//# sourceMappingURL=rate-limiter.d.ts.map