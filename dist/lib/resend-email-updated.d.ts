interface SendOTPEmailParams {
    to: string;
    otpCode: string;
}
export declare function sendOTPEmail({ to, otpCode }: SendOTPEmailParams): Promise<{
    success: boolean;
    error: string;
} | {
    success: boolean;
    error?: undefined;
}>;
export {};
//# sourceMappingURL=resend-email-updated.d.ts.map