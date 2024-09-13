import { Request, Response } from 'express';
import { consultarResposta } from '../../services/resposta/consultar-resposta.service';
import Questao from '../../schemas/questao.schema';

export const consultarRespostaController = async (req: Request, res: Response): Promise<Response> => {
    const { formularioId, respostaId, questaoId } = req.params;
    const loggedUser = req.user;

    if (!loggedUser) {
        return res.status(401).json({ msg: 'Usuário não autenticado' });
    }

    const isAdmin = loggedUser.acesso.some((acesso) => { acesso.tipoAcesso === 'ADMIN' && acesso.acessoFormularios === null });
    const isEdicao = loggedUser.acesso.some((acesso) => { acesso.tipoAcesso === 'EDICAO' && acesso.acessoFormularios === formularioId })
    const isRespondente = loggedUser.acesso.some((acesso) => { acesso.tipoAcesso === 'RESPONDENTE' && acesso.acessoFormularios === formularioId })

    if (!isAdmin || !isEdicao || !isRespondente) {
        return res.status(401).json({ msg: 'Usuário não tem permissão para consultar a resposta da pessoa' });
    }

    const questaoExiste = await Questao.findById(questaoId);

    if (!questaoExiste) {
        return res.status(404).json({ error: 'Questao nao existente' });
    }

    try {
        const resposta = await consultarResposta(respostaId);

        return res.status(resposta.status).json({ resposta: resposta.data })
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao consultar resposta', details: error });
    }
}