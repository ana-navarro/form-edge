import { Request, Response } from 'express';
import { editarUsuarioService } from '../../services/usuario/editar-usuario.service';
import { JwtPayload } from '../../routes/middlewares/auth.middleware';

export const editarUsuarioAdmin = async (req: Request, res: Response) => {
    const { usuarioId } = req.params;
    const { nome, email, tipoAcesso } = req.body;
    const loggedUser = req.user as JwtPayload | undefined; 

    if (!loggedUser || loggedUser.tipoAcesso !== 'ADMIN') {
        return res.status(403).json({ msg: 'Permissão negada. Somente administradores podem editar usuários.' });
    }

    try {
        const response = await editarUsuarioService({ usuarioId, nome, email, tipoAcesso });
        
        if (response.status !== 200) {
            return res.status(response.status).json({ error: response.error });
        }

        return res.status(200).json({ msg: 'Usuário editado com sucesso', data: response.data });
    } catch (error) {
        return res.status(500).json({ msg: 'Erro ao editar usuário', error });
    }
};
