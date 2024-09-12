export interface CriarUsuarioInput {
    nome: string;
    email: string;
    senha: string;
    confirmarSenha: string;
}

export interface DeletarUsuarioInput {
    usuarioId: string;
    tipoAcesso: 'ADMIN' | 'RESPONDENTE' | 'VISUALIZACAO';
}

export interface EditarUsuarioInput {
    usuarioId: string;
    nome?: string;
    email?: string;
    tipoAcesso?: 'ADMIN' | 'RESPONDENTE' | 'VISUALIZACAO';
}