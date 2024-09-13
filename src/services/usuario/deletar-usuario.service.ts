import { Types } from 'mongoose';
import Usuario from '../../schemas/usuario.schema';
import { ServiceResponse } from '../../models/service-response.model';
import { DeletarUsuarioInput } from './usuario.types';

export const deletarUsuario = async (dados: DeletarUsuarioInput): Promise<ServiceResponse> => {
    const { usuarioId, acesso } = dados;

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

        if (acesso.tipoAcesso !== 'ADMIN') {
            return {
                error: 'O usuário não possui permissão para deletar outros usuários',
                status: 403
            };
        }

        await Usuario.findByIdAndDelete(usuarioId);

        return {
            data: { message: 'Usuário deletado com sucesso' },
            status: 200
        };
    } catch (error) {
        return {
            error: 'Erro ao deletar o usuário',
            status: 500
        };
    }
};
