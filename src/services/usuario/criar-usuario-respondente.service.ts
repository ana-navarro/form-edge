import { ServiceResponse } from "../../models/service-response.model";
import Usuario, { UsuarioDocument } from "../../schemas/usuario.schema";
import Formulario from "../../schemas/formulario.schema";
import bcrypt from 'bcrypt';
import { CriarUsuarioRespondenteInput } from "./usuario.types";

export const criarUsuarioRespondente = async (dados: CriarUsuarioRespondenteInput): Promise<ServiceResponse> => {
    const { nome, email, senha, confirmarSenha, formularioId, acesso, loggedUserEmail } = dados;

    try {
        if (senha !== confirmarSenha) {
            return {
                error: 'As senhas não coincidem',
                status: 400
            };
        }

        const formulario = await Formulario.findById(formularioId);
        if (!formulario) {
            return {
                error: 'Formulário não encontrado',
                status: 404
            };
        }

        const saltRounds = 10;
        const senhaHashed = await bcrypt.hash(senha, saltRounds);

        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            const formularioObjectId = formularioId;
            const acessoExistente = usuario.acesso.find(a => 
                a.tipoAcesso === 'RESPONDENTE' && a.acessoFormularios && a.acessoFormularios.toString() === formularioObjectId.toString()
            );
            if (!acessoExistente) {
                usuario.acesso.push({
                    tipoAcesso: 'RESPONDENTE',
                    acessoFormularios: formularioId
                });
                await usuario.save();
            }

            return {
                data: { id: usuario._id },
                status: 200,
            };
        }

        usuario = await Usuario.create({
            nome,
            email,
            senha: senhaHashed,
            acesso: [{
                tipoAcesso: 'RESPONDENTE',
                acessoFormularios: [formularioId]
            }]
        });

        return {
            data: { id: usuario._id },
            status: 201
        };

    } catch (error) {
        return {
            error: 'Erro ao criar ou atualizar o usuário',
            status: 500
        };
    }
};
