import { Request, Response } from 'express';
export declare function getDashboardStats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getAdminProperties(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getAdminStats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getAdminAgents(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateAgentStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getAdminAnnouncements(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function createAnnouncement(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateAnnouncement(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deleteAnnouncement(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getAdminSettings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateAdminSettings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=admin.d.ts.map