import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { criarUsuarioRespondente } from '../../services/usuario/criar-usuario-respondente.service';
import { CriarUsuarioDto } from './criar-usuario.dto';

export const criarUsuarioRespondenteController = async (req: Request, res: Response): Promise<Response> => {
    const dados: CriarUsuarioDto & { formularioId: string } = {
        ...plainToClass(CriarUsuarioDto, req.body),
        formularioId: req.params.formularioId
    };

    const loggedUser = req.user;

    if (!loggedUser) {
        return res.status(401).json({ msg: 'Usuário não autenticado' });
    }

    if (!loggedUser.acesso.includes({ tipoAcesso: 'ADMIN', acessoFormularios: null }) && !loggedUser.acesso.includes({ tipoAcesso: 'EDICAO', acessoFormularios: dados.formularioId })) {
        return res.status(403).json({ msg: 'Permissão negada. Apenas usuários com tipo de acesso ADMIN ou EDICAO podem criar usuários respondentes.' });
    }

    const checkEdicao = loggedUser.acesso.some((acesso) => { acesso.tipoAcesso === 'EDICAO' && acesso.acessoFormularios === dados.formularioId }) ? 'EDICAO' : 'VISUALIZACAO';

    const tipoAcesso = loggedUser.acesso.some((acesso) => { acesso.tipoAcesso=== 'ADMIN' && acesso.acessoFormularios === null }) ? 'ADMIN' : checkEdicao;

    const dadosComEmail = {
        ...dados,
        loggedUserEmail: loggedUser.email,
        tipoAcesso,
    };

    const errors = await validate(plainToClass(CriarUsuarioDto, dados));

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
        const response = await criarUsuarioRespondente(dadosComEmail);

        if (response.error) {
            return res.status(response.status || 500).json({ msg: response.error });
        }

        return res.status(response.status || 201).json({
            msg: 'Usuário respondente criado com sucesso!',
            data: response.data,
        });
    } catch (error) {
        console.error('Error creating respondent user:', error);
        return res.status(500).json({ msg: 'Erro interno do servidor' });
    }
};
