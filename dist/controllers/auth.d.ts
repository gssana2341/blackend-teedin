import { Request, Response } from 'express';
export declare function getCurrentUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function logoutUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function forceLogout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=auth.d.ts.map