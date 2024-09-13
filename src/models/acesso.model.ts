export interface Acesso {
    tipoAcesso: 'ADMIN' | 'RESPONDENTE' | 'VISUALIZACAO' | 'EDICAO'; 
    acessoFormularios: string |null;
}