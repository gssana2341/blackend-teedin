export declare const sendOTPEmail: (to: string, otpCode: string) => Promise<{
    success: boolean;
    error?: string;
    provider?: string;
    previewUrl?: string;
}>;
export default sendOTPEmail;
//# sourceMappingURL=email-ethereal.d.ts.map