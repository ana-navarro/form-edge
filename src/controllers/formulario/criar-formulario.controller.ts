import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Formulario from '../../schemas/formulario.schema';
import { criarQuestao } from '../../services/questao/criar-questao.service';

export const criarFormularioController = async (req: Request, res: Response): Promise<Response> => {
    const { enunciado, numAlternativas, alternativas } = req.body;
    const loggedUser = req.user;

    if (!loggedUser) {
        return res.status(401).json({ msg: 'Usuário não autenticado' });
    }

    const emailUsuario = loggedUser.email;

    try {
        const formularioId = (await Formulario.create({ questoes: [], finalizado: false, email: emailUsuario })).id;

        if (!Types.ObjectId.isValid(formularioId)) {
            return res.status(400).json({ error: 'ID do formulário inválido' });
        }

        const formulario = await Formulario.findById(formularioId);
        if (!formulario) {
            return res.status(404).json({ error: 'Formulário não encontrado' });
        }

        if (formulario.finalizado) {
            return res.status(400).json({ error: 'Formulário já foi finalizado, não é possível adicionar mais questões' });
        }

        const questaoResponse = await criarQuestao(enunciado, numAlternativas, alternativas);
        
        if (questaoResponse.status !== 201) {
            return res.status(questaoResponse.status).json({ error: questaoResponse.error  });
        }

        formulario.questoes.push(questaoResponse.data.id);
        await formulario.save();

        return res.status(201).json({
            message: 'Questão criada e adicionada ao formulário com sucesso',
            questaoId: questaoResponse.data.id,
            formularioId: formulario._id,
        });
    } catch (err) {
        return res.status(500).json({ error: 'Erro ao adicionar questão ao formulário', details: err });
    }
};
