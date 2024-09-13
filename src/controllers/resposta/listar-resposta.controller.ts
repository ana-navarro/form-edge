import { Request, Response } from 'express';
import { deletarResposta } from '../../services/resposta/deletar-resposta.service';
import { listarResposta } from '../../services/resposta/listar-resposta.service';
import Questao from '../../schemas/questao.schema';

export const listarRespostaController = async (req: Request, res: Response): Promise<Response> => {
    const { formularioId, questaoId } = req.params;
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
       const respsta = await listarResposta(questaoId);

        return res.status(respsta.status).json({ respostas: respsta.data });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao deletar resposta', details: error });
    }
}