import { Request, Response } from 'express';
import { editarUsuarioService } from '../../services/usuario/editar-usuario.service';
import { JwtPayload } from '../../routes/middlewares/auth.middleware';
import { Types } from 'mongoose';

export const editarUsuarioEdicao = async (req: Request, res: Response): Promise<Response> => {
    const { usuarioId, formularioId } = req.params;
    const loggedUser = req.user as JwtPayload | undefined;

    if (!loggedUser || !loggedUser.acesso.some((acesso) => { acesso.tipoAcesso=== 'ADMIN' && acesso.acessoFormularios === null })) {
        return res.status(403).json({ msg: 'Permissão negada. Somente administradores podem editar usuários.' });
    }

    if (!usuarioId || !Types.ObjectId.isValid(usuarioId)) {
        return res.status(400).json({ msg: 'ID do usuário inválido.' });
    }

    const acesso = loggedUser.acesso;

    try {
        const response = await editarUsuarioService({ usuarioId, formularioId,  acesso: { tipoAcesso: 'EDICAO', acessoFormularios: formularioId } });

        if (response.error) {
            return res.status(response.status || 500).json({ error: response.error });
        }

        return res.status(response.status || 200).json({ msg: 'Usuário editado com sucesso', data: response.data });
    } catch (error) {
        console.error('Error editing user:', error);
        return res.status(500).json({ msg: 'Erro ao editar usuário', error: error });
    }
};
