import { Acesso } from "../../models/acesso.model";

export interface CriarUsuarioInput {
    nome: string;
    email: string;
    senha: string;
    confirmarSenha: string;
    acesso: Acesso
}

export interface DeletarUsuarioInput {
    usuarioId: string;
    acesso: Acesso
}

export interface EditarUsuarioInput {
    usuarioId: string;
    formularioId: string;
    acesso?: Acesso;
}

export interface CriarUsuarioRespondenteInput {
    nome: string;
    email: string;
    senha: string;
    confirmarSenha: string;
    formularioId: string;
    acesso?: Acesso
    loggedUserEmail: string;
}

export interface RemoverAcessoInput {
    usuarioId: string;
    formularioId: string;
}

export interface AdicionarFormularioInput {
    formularioId: string;
    email: string; 
    usuarioLogado: Acesso[];
}