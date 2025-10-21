"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRateLimitStats = exports.resetRateLimit = exports.cleanupExpiredEntries = exports.checkRateLimit = exports.PASSWORD_RESET_RATE_LIMIT = exports.OTP_RATE_LIMIT = void 0;
// เก็บข้อมูลการ rate limit ใน memory
const rateLimitStore = new Map();
// กำหนดค่าเริ่มต้นสำหรับ OTP requests
exports.OTP_RATE_LIMIT = {
    windowMs: 15 * 60 * 1000, // 15 นาที
    maxRequests: 5, // สูงสุด 5 ครั้งใน 15 นาที
};
exports.PASSWORD_RESET_RATE_LIMIT = {
    windowMs: 60 * 60 * 1000, // 1 ชั่วโมง
    maxRequests: 10, // สูงสุด 10 ครั้งใน 1 ชั่วโมง
};
/**
 * ตรวจสอบ rate limit สำหรับ IP หรือ email
 * @param key - คีย์สำหรับ rate limit (เช่น IP address หรือ email)
 * @param config - การกำหนดค่า rate limit
 * @returns { allowed: boolean, remaining: number, resetTime: number }
 */
const checkRateLimit = (key, config) => {
    const now = Date.now();
    const entry = rateLimitStore.get(key);
    // ถ้าไม่มีข้อมูลหรือเวลาหมดแล้ว ให้รีเซ็ต
    if (!entry || now >= entry.resetTime) {
        const newEntry = {
            count: 1,
            resetTime: now + config.windowMs,
        };
        rateLimitStore.set(key, newEntry);
        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetTime: newEntry.resetTime,
        };
    }
    // ถ้ายังไม่เกินขำกำหนด
    if (entry.count < config.maxRequests) {
        entry.count++;
        rateLimitStore.set(key, entry);
        return {
            allowed: true,
            remaining: config.maxRequests - entry.count,
            resetTime: entry.resetTime,
        };
    }
    // เกินขีดจำกัดแล้ว
    return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000), // seconds
    };
};
exports.checkRateLimit = checkRateLimit;
/**
 * ล้างข้อมูล rate limit ที่หมดอายุแล้ว
 */
const cleanupExpiredEntries = () => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now >= entry.resetTime) {
            rateLimitStore.delete(key);
        }
    }
};
exports.cleanupExpiredEntries = cleanupExpiredEntries;
/**
 * รีเซ็ต rate limit สำหรับ key ที่กำหนด (สำหรับการทดสอบ)
 */
const resetRateLimit = (key) => {
    rateLimitStore.delete(key);
};
exports.resetRateLimit = resetRateLimit;
/**
 * ดูข้อมูล rate limit ปัจจุบันทั้งหมด (สำหรับการ debug)
 */
const getRateLimitStats = () => {
    (0, exports.cleanupExpiredEntries)();
    return Array.from(rateLimitStore.entries()).map(([key, entry]) => ({
        key,
        count: entry.count,
        resetTime: new Date(entry.resetTime).toISOString(),
        remainingTime: Math.max(0, entry.resetTime - Date.now()),
    }));
};
exports.getRateLimitStats = getRateLimitStats;
// ทำความสะอาดทุก 10 นาที
setInterval(exports.cleanupExpiredEntries, 10 * 60 * 1000);
//# sourceMappingURL=rate-limiter.js.map