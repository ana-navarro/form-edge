import { Request, Response } from 'express';
import { editarUsuarioService } from '../../services/usuario/editar-usuario.service';
import { JwtPayload } from '../../routes/middlewares/auth.middleware';

export const editarUsuarioRespondente = async (req: Request, res: Response) => {
    const { usuarioId, formularioId } = req.params;
    const loggedUser = req.user as JwtPayload | undefined;

    if (!loggedUser) {
        return res.status(401).json({ msg: 'Usuário não autenticado' });
    }

    if (!loggedUser.acesso.some((acesso) => { acesso.tipoAcesso === 'ADMIN' && acesso.acessoFormularios === null })) {
        if (!loggedUser.acesso.some((acesso) => { acesso.tipoAcesso === 'EDICAO' && acesso.acessoFormularios === formularioId })) {
            return res.status(403).json({ msg: 'Permissão negada. Apenas usuários com tipo de acesso EDICAO podem editar outros usuários.' });
        }
        return res.status(403).json({ msg: 'Permissão negada. Apenas usuários com tipo de acesso ADMIN podem editar outros usuários.' });
    }

    try {
        const response = await editarUsuarioService({ usuarioId, formularioId, acesso: { tipoAcesso: 'RESPONDENTE', acessoFormularios: formularioId } });

        if (response.status !== 200) {
            return res.status(response.status).json({ error: response.error });
        }

        return res.status(200).json({ msg: 'Usuário editado com sucesso', data: response.data });
    } catch (error) {
        return res.status(500).json({ msg: 'Erro ao editar usuário', error });
    }
};
