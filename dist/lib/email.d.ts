export interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}
export declare const sendOTPEmail: (to: string, otpCode: string, config?: EmailConfig) => Promise<{
    success: boolean;
    error?: string;
    provider?: string;
}>;
export declare const testEmailConnection: () => Promise<{
    success: boolean;
    provider: string;
    message: string;
    testAccount?: undefined;
    error?: undefined;
    details?: undefined;
} | {
    success: boolean;
    provider: string;
    message: string;
    testAccount: {
        user: string;
        pass: string;
    };
    error?: undefined;
    details?: undefined;
} | {
    success: boolean;
    error: string;
    provider?: undefined;
    message?: undefined;
    testAccount?: undefined;
    details?: undefined;
} | {
    success: boolean;
    error: string;
    details: unknown;
    provider?: undefined;
    message?: undefined;
    testAccount?: undefined;
}>;
export default sendOTPEmail;
//# sourceMappingURL=email.d.ts.map