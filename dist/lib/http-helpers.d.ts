import { Request, Response, NextFunction } from 'express';
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
export declare const sendSuccess: (res: Response, data: any, status?: number) => Response<any, Record<string, any>>;
export declare const sendError: (res: Response, message: string, status?: number) => Response<any, Record<string, any>>;
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
//# sourceMappingURL=http-helpers.d.ts.map