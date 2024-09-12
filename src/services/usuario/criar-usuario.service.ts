import { ServiceResponse } from "../../models/service-response.model";
import Usuario, { UsuarioDocument } from "../../schemas/usuario.schema";
import { CriarUsuarioInput } from "./usuario.types";
import bcrypt from 'bcrypt';

export const criarUsuario = async (dados: CriarUsuarioInput): Promise<ServiceResponse> => {
    const { nome, email, senha, confirmarSenha } = dados;

    try {
        if (senha !== confirmarSenha) {
            return {
                error: 'As senhas não coincidem',
                status: 400
            };
        }

        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return {
                error: 'Email já cadastrado',
                status: 400
            };
        }

        const saltRounds = 10;
        const senhaHashed = await bcrypt.hash(senha, saltRounds);

        const novoUsuario: UsuarioDocument = await Usuario.create({
            nome,
            email,
            senha: senhaHashed,
            tipoAcesso: 'RESPONDENTE',
            acessoFormularios: []
        });

        return {
            data: { id: novoUsuario._id },
            status: 201
        };
    } catch (error) {
        return {
            error,
            status: 500
        };
    }
};