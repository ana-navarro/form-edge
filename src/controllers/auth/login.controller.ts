import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { loginService } from '../../services/auth/login.service';

dotenv.config();

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const userResponse = await loginService(email, password);

        if (userResponse) {
            res.status(200).json({
                msg: 'Usuário conectado com sucesso!',
                data: userResponse.token,
                user: userResponse.user,
            });
        } else {
            res.status(401).json({ msg: 'Email ou senha inválido!' });
        }
    } catch (err) {
        res.status(500).json({ msg: 'Ocorreu um erro desconhecido' });
    }
};