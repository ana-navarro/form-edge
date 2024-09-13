import { Request, Response } from 'express';
import { adicionarFormularioAcesso } from '../../services/usuario/adicionar-formulario.service';

export const adicionarFormularioController = async (req: Request, res: Response): Promise<void> => {
    const { email, formularioId } = req.body;
    
    if (!req.user || !req.user.acesso) {
        res.status(401).json({ error: 'Usuário não autenticado ou dados do usuário não encontrados' });
        return;
    }

    const usuarioLogado = req.user.acesso;

    try {
        const serviceResponse = await adicionarFormularioAcesso({
            email,
            formularioId,
            usuarioLogado
        });

        if (serviceResponse.error) {
            res.status(serviceResponse.status).json({ error: serviceResponse.error });
        } else {
            res.status(serviceResponse.status).json(serviceResponse.data);
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
