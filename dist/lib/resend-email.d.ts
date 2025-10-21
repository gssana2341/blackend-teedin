import { Resend } from "resend";
declare const resend: Resend;
interface SendOTPEmailParams {
    to: string;
    otpCode: string;
}
export declare function sendOTPEmail({ to, otpCode }: SendOTPEmailParams): Promise<{
    success: boolean;
    error: string;
    provider: string;
    messageId?: undefined;
} | {
    success: boolean;
    messageId: string;
    provider: string;
    error?: undefined;
}>;
export declare function testResendConnection(): Promise<{
    success: boolean;
    message: string;
    result: {
        success: boolean;
        error: string;
        provider: string;
        messageId?: undefined;
    } | {
        success: boolean;
        messageId: string;
        provider: string;
        error?: undefined;
    };
    error?: undefined;
} | {
    success: boolean;
    message: string;
    error: unknown;
    result?: undefined;
}>;
export default resend;
//# sourceMappingURL=resend-email.d.ts.map