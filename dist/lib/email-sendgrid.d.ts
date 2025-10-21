export declare const sendOTPEmail: (to: string, otpCode: string) => Promise<{
    success: boolean;
    error?: string;
    provider?: string;
}>;
export default sendOTPEmail;
//# sourceMappingURL=email-sendgrid.d.ts.map