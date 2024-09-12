import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Formulario from '../../schemas/formulario.schema';

export const finalizarFormularioController = async (req: Request, res: Response): Promise<Response> => {
    const { formularioId } = req.params;

    const loggedUser = req.user;

    if (!loggedUser) {
        return res.status(401).json({ msg: 'Usuário não autenticado' });
    }

    const emailUsuario = loggedUser.email;

    try {
        if (!Types.ObjectId.isValid(formularioId)) {
            return res.status(400).json({ error: 'ID do formulário inválido' });
        }

        const formulario = await Formulario.findById(formularioId);
        if (!formulario) {
            return res.status(404).json({ error: 'Formulário não encontrado' });
        }

        if (formulario.finalizado) {
            return res.status(400).json({ error: 'Formulário já foi finalizado' });
        }

        if (emailUsuario !== formulario.email) {
            return res.status(401).json({ error: 'Usuario nao tem permissao para finalizar um formulario que nao e dele!' });
        }

        formulario.finalizado = true;
        await formulario.save();

        return res.status(200).json({
            message: 'Formulário finalizado com sucesso',
            formularioId: formulario._id,
        });
    } catch (err) {
        return res.status(500).json({ error: 'Erro ao finalizar o formulário', details: err });
    }
};
