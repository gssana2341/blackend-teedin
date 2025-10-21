import { Request, Response } from 'express';
export declare function testSMTP(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function testTwilio(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function testResend(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getEmailDiagnostics(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getSMSDiagnostics(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function simpleResend(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function debugNotifications(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function debugResend(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function debugProperties(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=testing.d.ts.map