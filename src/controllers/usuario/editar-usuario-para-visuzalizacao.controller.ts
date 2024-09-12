import { Request, Response } from 'express';
import { editarUsuarioService } from '../../services/usuario/editar-usuario.service';

export const editarUsuarioVisualizacao = async (req: Request, res: Response) => {
    const { usuarioId } = req.params;
    const { nome, email } = req.body;
    const loggedUser = req.user;

    if (!loggedUser) {
        return res.status(401).json({ msg: 'Usuário não autenticado' });
    }

    if (loggedUser.tipoAcesso !== 'ADMIN') {
        return res.status(403).json({ msg: 'Permissão negada. Apenas usuários com tipo de acesso ADMIN podem editar perfil.' });
    }

    try {
        const response = await editarUsuarioService({ usuarioId, nome, email, tipoAcesso: loggedUser.tipoAcesso });

        if (response.status !== 200) {
            return res.status(response.status).json({ error: response.error });
        }

        return res.status(200).json({ msg: 'Usuário editado com sucesso', data: response.data });
    } catch (error) {
        return res.status(500).json({ msg: 'Erro ao editar usuário', error });
    }
};