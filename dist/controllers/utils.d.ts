import { Request, Response } from 'express';
export declare function sendOTP(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function sendOTPSMS(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function verifyOTP(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function verifyOTPSMS(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function resetPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function trackView(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function checkDuplicate(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function checkOTP(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getClientIP(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function trackViewGet(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=utils.d.ts.map