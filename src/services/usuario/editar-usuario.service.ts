import { Types } from 'mongoose';
import { ServiceResponse } from '../../models/service-response.model';
import Usuario, { UsuarioDocument } from '../../schemas/usuario.schema';
import { EditarUsuarioInput } from './usuario.types';

export const editarUsuarioService = async (dados: EditarUsuarioInput): Promise<ServiceResponse> => {
    const { usuarioId, acesso, formularioId } = dados;

    try {
        if (!Types.ObjectId.isValid(usuarioId)) {
            return { error: 'ID de usuário inválido', status: 400 };
        }

        if (!Types.ObjectId.isValid(formularioId)) {
            return { error: 'ID de formulário inválido', status: 400 };
        }

        const usuario = await Usuario.findById(usuarioId).exec() as UsuarioDocument | null;
        if (!usuario) {
            return { error: 'Usuário não encontrado', status: 404 };
        }

        if (!usuario.acesso.some((acesso) => { acesso.tipoAcesso=== 'ADMIN' && acesso.acessoFormularios === null }) || !usuario.acesso.some((acesso) => { acesso.tipoAcesso === 'EDICAO' && acesso.acessoFormularios === formularioId })) {
            return { error: 'Usuario nao possui permissao necessario!', status: 400 };
        }

        const acessoAtualizado = usuario.acesso.map(acessoItem => {
            if (acessoItem.acessoFormularios && acessoItem.acessoFormularios.toString() === formularioId.toString()) {
                return acesso;
            }
            return acessoItem;
        });

        const usuarioAtualizado = await Usuario.findByIdAndUpdate(usuarioId, { acesso: acessoAtualizado }, { new: true }).exec() as UsuarioDocument;

        return { data: usuarioAtualizado, status: 200 };
    } catch (error) {
        return { error: 'Erro ao atualizar as permissões de acesso', status: 500 };
    }
};
