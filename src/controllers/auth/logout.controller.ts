import { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export const logout = (req: Request, res: Response) => {
    res.removeHeader('x-auth-token');
    res.send('Você foi deslogado!');
};