import { Request } from "express";

export interface TokenPayload {
    id: number;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

export interface AuthenticatedRequest extends Request {
    user?: TokenPayload;
}
