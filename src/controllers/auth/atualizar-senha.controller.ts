import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { editarSenhaService } from '../../services/auth/editar-senha.service';

dotenv.config();

export const atualizarSenhaUsuario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        const updatedUser = await editarSenhaService(id, password);

        if (updatedUser) {
            res.status(201).json(updatedUser);
        } else {
            res.status(401).json({ msg: 'Usuário não existe!' });
        }
    } catch (error) {
        res.status(500).json({ msg: 'Error during password update' });
    }
};