export declare function sendTwilioOTP(phone: string): Promise<{
    success: boolean;
    error?: string;
    verificationSid?: string;
}>;
export declare function verifyTwilioOTP(phone: string, code: string): Promise<{
    success: boolean;
    error?: string;
    status?: string;
}>;
//# sourceMappingURL=twilio-sms.d.ts.map