import { Types } from "mongoose";
import { ServiceResponse } from "../../models/service-response.model";
import Usuario from "../../schemas/usuario.schema";
import { EditarUsuarioInput } from "./usuario.types";

export const editarUsuarioService = async (dados: EditarUsuarioInput): Promise<ServiceResponse> => {
    const { usuarioId, nome, email, tipoAcesso } = dados;

    try {
        if (!Types.ObjectId.isValid(usuarioId)) {
            return { error: 'ID inválido', status: 400 };
        }

        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
            return { error: 'Usuário não encontrado', status: 404 };
        }
        
        const updateData: any = {};
        if (nome) updateData.nome = nome;
        if (email) updateData.email = email;
        if (tipoAcesso) updateData.tipoAcesso = tipoAcesso;

        const usuarioAtualizado = await Usuario.findByIdAndUpdate(usuarioId, updateData, { new: true });

        return { data: usuarioAtualizado, status: 200 };
    } catch (error) {
        return { error, status: 500 };
    }
};