import { ServiceResponse } from "../../models/service-response.model";
import Usuario from "../../schemas/usuario.schema";
import Formulario from "../../schemas/formulario.schema";
import { AdicionarFormularioInput } from "./usuario.types";

export const adicionarFormularioAcesso = async ({
    email, formularioId, usuarioLogado
}: AdicionarFormularioInput): Promise<ServiceResponse> => {
    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return {
                error: 'Usuário não encontrado',
                status: 404
            };
        }

        const formulario = await Formulario.findById(formularioId);
        if (!formulario) {
            return {
                error: 'Formulário não encontrado',
                status: 404
            };
        }

        if (!usuarioLogado.some((acesso) => acesso.tipoAcesso === 'EDICAO' && acesso.acessoFormularios === formularioId)) {
            return {
                error: 'Você não tem permissão para adicionar usuarios a este formulario',
                status: 403
            };
        } else if (!usuarioLogado.some((acesso) => acesso.tipoAcesso === 'ADMIN')) {
            return {
                error: 'Permissão negada. Somente administradores podem adicionar formulários a outros usuários.',
                status: 403
            };
        }

        const acessoExistente = usuario.acesso.find(a =>  a.acessoFormularios &&
            a.acessoFormularios.toString() === formularioId.toString()
        );

        if (!acessoExistente) {
            usuario.acesso.push({
                tipoAcesso: 'RESPONDENTE',
                acessoFormularios: formularioId
            });

            await usuario.save();
        }

        return {
            data: { message: 'Formulário adicionado com sucesso ao acesso do usuário' },
            status: 200
        };
    } catch (error) {
        return {
            error: 'Erro ao adicionar formulário ao acesso do usuário',
            status: 500
        };
    }
};
