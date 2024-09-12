import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { criarUsuario } from '../../services/usuario/criar-usuario.service';
import { CriarUsuarioDto } from './criar-usuario.dto';

export const criarUsuarioController = async (req: Request, res: Response): Promise<Response> => {
    const dados: CriarUsuarioDto = plainToClass(CriarUsuarioDto, req.body);

    const loggedUser = req.user;

    if (!loggedUser) {
        return res.status(401).json({ msg: 'Usuário não autenticado' });
    }

    if (loggedUser.tipoAcesso !== 'ADMIN') {
        return res.status(403).json({ msg: 'Permissão negada. Apenas usuários com tipo de acesso ADMIN podem criar outros usuários.' });
    }

    const errors = await validate(dados);

    if (errors.length > 0) {
        return res.status(400).json({
            msg: 'Erro de validação',
            errors: errors.map(error => ({
                property: error.property,
                constraints: error.constraints
            }))
        });
    }

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
