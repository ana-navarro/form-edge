import { Request, Response } from 'express';
import { JwtPayload } from '../../routes/middlewares/auth.middleware';
import Usuario from '../../schemas/usuario.schema';
import { Types } from 'mongoose';
import { removerAcessoRespondente } from '../../services/usuario/remover-acesso-respondente.service';

export const removerAcessoController = async (req: Request, res: Response): Promise<Response> => {
    const { formularioId } = req.params;
    const { usuarioId } = req.body;
    const loggedUser = req.user as JwtPayload | undefined;

    if (!loggedUser) {
        return res.status(401).json({ msg: 'Usuário não autenticado' });
    }

    if (!Types.ObjectId.isValid(formularioId)) {
        return res.status(400).json({ msg: 'ID de formulário inválido' });
    }

    try {
        const usuario = await Usuario.findOne({
            'acesso.acessoFormularios': formularioId,
            'acesso.tipoAcesso': { $in: ['EDICAO', 'ADMIN'] }
        }).exec();

        if (!usuario) {
            return res.status(403).json({ msg: 'Permissão negada. Você não tem acesso para remover permissões desse formulário.' });
        }

        const response = await removerAcessoRespondente({ usuarioId, formularioId });

        if (response.error) {
            return res.status(response.status).json({ msg: response.error });
        }

        return res.status(response.status).json({ msg: response.data?.message || 'Permissão removida com sucesso.' });
    } catch (error) {
        console.error('Error removing access:', error);
        return res.status(500).json({ msg: 'Erro interno do servidor' });
    }
};
