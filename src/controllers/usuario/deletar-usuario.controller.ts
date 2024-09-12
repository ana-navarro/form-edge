import { Request, Response } from 'express';
import { deletarUsuario } from '../../services/usuario/deletar-usuario.service';
import { DeletarUsuarioInput } from '../../services/usuario/usuario.types';

export const deletarUsuarioController = async (req: Request, res: Response): Promise<Response> => {
    const dados: DeletarUsuarioInput = {
        usuarioId: req.params.id,
        tipoAcesso: req.body.tipoAcesso
    };

    const loggedUser = req.user;

    if (!loggedUser) {
        return res.status(401).json({ msg: 'Usuário não autenticado' });
    }

    if (loggedUser.tipoAcesso !== 'ADMIN') {
        return res.status(403).json({ msg: 'Permissão negada. Apenas usuários com tipo de acesso ADMIN podem deletar outros usuarios.' });
    }

    try {
        const response = await deletarUsuario(dados);

        if (response.error) {
            return res.status(response.status || 500).json({ msg: response.error });
        }

        return res.status(response.status || 200).json({
            msg: response.data?.message || 'Usuário deletado com sucesso',
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ msg: 'Erro interno do servidor' });
    }
};
