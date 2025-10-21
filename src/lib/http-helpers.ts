import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const sendSuccess = (res: Response, data: any, status = 200) => {
  return res.status(status).json({ success: true, data });
};

export const sendError = (res: Response, message: string, status = 400) => {
  return res.status(status).json({ success: false, error: message });
};

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
