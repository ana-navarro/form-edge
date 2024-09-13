import { Request, Response } from 'express';
import { criarUsuario } from '../../services/usuario/criar-usuario.service'; // ajuste o caminho conforme necessário
import { CriarUsuarioInput } from '../../services/usuario/usuario.types';

export const criarUsuarioController = async (req: Request, res: Response): Promise<Response> => {
    const dados: CriarUsuarioInput = req.body;

    try {
        const response = await criarUsuario(dados);

        if (response.error) {
            return res.status(response.status || 500).json({ msg: response.error });
        }

        return res.status(response.status || 201).json({
            msg: 'Usuário criado com sucesso!',
            data: response.data,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ msg: 'Erro interno do servidor' });
    }
};