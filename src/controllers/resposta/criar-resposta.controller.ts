import { Request, Response } from 'express';
import { criarResposta } from '../../services/resposta/criar-resposta.service';
import Questao from '../../schemas/questao.schema';

export const criarRespostaController = async (req: Request, res: Response): Promise<Response> => {
    const { formularioId, questaoId } = req.params;
    const { resposta } = req.body;
    const loggedUser = req.user;

    if (!loggedUser) {
        return res.status(401).json({ msg: 'Usuário não autenticado' });
    }

    const isAdmin = loggedUser.acesso.some((acesso) => { acesso.tipoAcesso === 'ADMIN' && acesso.acessoFormularios === null });
    const isEdicao = loggedUser.acesso.some((acesso) => { acesso.tipoAcesso === 'EDICAO' && acesso.acessoFormularios === formularioId })
    const isRespondente = loggedUser.acesso.some((acesso) => { acesso.tipoAcesso === 'RESPONDENTE' && acesso.acessoFormularios === formularioId })

    if (!isAdmin || !isEdicao || !isRespondente) {
        return res.status(401).json({ msg: 'Usuário não tem permissão para criar a resposta dentro do formulario' });
    }

    const questaoExiste = await Questao.findById(questaoId);

    if (!questaoExiste) {
        return res.status(404).json({ error: 'Questao nao existente' });
    }

    try {
        const criar = await criarResposta({
            email: loggedUser.email,
            questao: questaoId,
            resposta,
        });

        return res.status(resposta.status).json({ resposta: criar.data })
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao criar resposta', details: error });
    }
}