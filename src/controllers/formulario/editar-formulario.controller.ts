import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Formulario from '../../schemas/formulario.schema';
import { criarQuestao } from '../../services/questao/criar-questao.service';
import { deletarQuestao } from '../../services/questao/deletar-questao.service';
import { editarQuestao } from '../../services/questao/editar-questao.service';

export const editarFormularioController = async (req: Request, res: Response): Promise<Response> => {
    const { acao, questaoId, enunciado, numAlternativas, alternativas } = req.body;
    const { formularioId } = req.params;

    const loggedUser = req.user;

    if (!loggedUser) {
        return res.status(401).json({ msg: 'Usuário não autenticado' });
    }

    const emailUsuario = loggedUser.email;

    try {
        if (!loggedUser.acesso.some((acesso) => { acesso.tipoAcesso === 'ADMIN' && acesso.acessoFormularios === null })) {
            if (!loggedUser.acesso.some((acesso) => { acesso.tipoAcesso === 'EDICAO' && acesso.acessoFormularios === formularioId })) {
                return res.status(403).json({ msg: 'Permissão negada. Apenas usuários com tipo de acesso EDICAO podem editar outros usuários.' });
            }
            return res.status(403).json({ msg: 'Permissão negada. Apenas usuários com tipo de acesso ADMIN podem editar outros usuários.' });
        }

        if (!Types.ObjectId.isValid(formularioId)) {
            return res.status(400).json({ error: 'ID do formulário inválido' });
        }

        const formulario = await Formulario.findById(formularioId);
        if (!formulario) {
            return res.status(404).json({ error: 'Formulário não encontrado' });
        }

        if (formulario.finalizado) {
            return res.status(400).json({ error: 'Formulário já foi finalizado, não é possível editá-lo' });
        }

        if (emailUsuario !== formulario.email) {
            return res.status(401).json({ error: 'Usuario nao tem permissao para editar um formulario que nao e dele!' });
        }

        let questaoResponse;

        if (acao === 'adicionar') {
            questaoResponse = await criarQuestao(enunciado, numAlternativas, alternativas);

            if (questaoResponse.status !== 201) {
                return res.status(questaoResponse.status).json({ error: questaoResponse.error });
            }

            formulario.questoes.push(questaoResponse.data.id);
            await formulario.save();

            return res.status(201).json({
                message: 'Questão adicionada com sucesso ao formulário',
                questaoId: questaoResponse.data.id,
                formularioId: formulario._id,
            });

        } else if (acao === 'editar') {
            questaoResponse = await editarQuestao(questaoId, enunciado, numAlternativas, alternativas);

            if (questaoResponse.status !== 200) {
                return res.status(questaoResponse.status).json({ error: questaoResponse.error });
            }

            return res.status(200).json({
                message: 'Questão atualizada com sucesso',
                questao: questaoResponse.data,
            });

        } else if (acao === 'deletar') {
            const deleteResponse = await deletarQuestao(questaoId);

            if (deleteResponse.status !== 200) {
                return res.status(deleteResponse.status).json({ error: deleteResponse.error });
            }

            formulario.questoes = formulario.questoes.filter(qId => qId.toString() !== questaoId);
            await formulario.save();

            return res.status(200).json({
                message: 'Questão deletada com sucesso do formulário',
                formularioId: formulario._id,
            });

        } else {
            return res.status(400).json({ error: 'Ação inválida' });
        }

    } catch (err) {
        return res.status(500).json({ error: 'Erro ao editar o formulário', details: err });
    }
};
