import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Acesso } from '../../models/acesso.model';

dotenv.config();

export interface JwtPayload {
    _id: string;
    acesso: Acesso[];
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['x-auth-token'] || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'No token found! You are not authorized!' });
    }

    try {
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ msg: 'Token is invalid!' });
    }
};

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No token found! You are not authorized!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ msg: 'Token is invalid!' });
    }
};