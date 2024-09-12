import { Types } from 'mongoose';
import Usuario from '../../schemas/usuario.schema';
import { ServiceResponse } from '../../models/service-response.model';
import bcrypt from 'bcrypt';
import { DeletarUsuarioInput } from './usuario.types';

export const deletarUsuario = async (dados: DeletarUsuarioInput): Promise<ServiceResponse> => {
    const { usuarioId, tipoAcesso } = dados;

    try {
        if (!Types.ObjectId.isValid(usuarioId)) {
            return {
                error: 'ID inválido',
                status: 400
            };
        }

        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
            return {
                error: 'Usuário não encontrado',
                status: 404
            };
        }

        if (tipoAcesso !== 'ADMIN') {
            return {
                error: 'O usuario nao possui permissao para deletar usuarios',
                status: 400
            };
        }

        await Usuario.findByIdAndDelete(usuarioId);

        return {
            data: { message: 'Usuário deletado com sucesso' },
            status: 200
        };
    } catch (error) {
        return {
            error,
            status: 500
        };
    }
};