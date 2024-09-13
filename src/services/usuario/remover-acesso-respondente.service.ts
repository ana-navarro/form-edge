import { Types } from "mongoose";
import { ServiceResponse } from "../../models/service-response.model";
import Usuario, { UsuarioDocument } from "../../schemas/usuario.schema";
import { RemoverAcessoInput } from "./usuario.types";

export const removerAcessoRespondente = async ({ usuarioId, formularioId }: RemoverAcessoInput): Promise<ServiceResponse> => {
    try {
        if (!Types.ObjectId.isValid(usuarioId) || !Types.ObjectId.isValid(formularioId)) {
            return { error: 'IDs inválidos', status: 400 };
        }

        const usuario = await Usuario.findById(usuarioId).exec() as UsuarioDocument | null;
        if (!usuario) {
            return { error: 'Usuário não encontrado', status: 404 };
        }

        const temAcessoRespondente = usuario.acesso.some(acessoItem =>
            acessoItem.tipoAcesso === 'RESPONDENTE' &&
            acessoItem.acessoFormularios && acessoItem.acessoFormularios.toString() === formularioId 
        );

        if (!temAcessoRespondente) {
            return { error: 'O usuário não tem acesso RESPONDENTE para o formulário especificado', status: 404 };
        }

        usuario.acesso = usuario.acesso.filter(acessoItem =>
            !(acessoItem.tipoAcesso === 'RESPONDENTE' &&
                acessoItem.acessoFormularios && acessoItem.acessoFormularios.toString() === formularioId) 
        );

        await usuario.save();

        return { data: { message: 'Acesso RESPONDENTE removido com sucesso' }, status: 200 };
    } catch (error) {
        return { error: 'Erro ao remover o acesso RESPONDENTE', status: 500 };
    }
};
