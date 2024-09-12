import Usuario, { UsuarioDocument } from "../../schemas/usuario.schema";

interface ResetSenhaServiceResponse {
    status?: number;
    error?: string;
    user?: UsuarioDocument;
}

export const resetSenhaService = async (email: string): Promise<ResetSenhaServiceResponse> => {
    try {
        const user = await Usuario.findOne({ email });
        if (!user) {
            return { status: 404, error: 'Usuário não encontrado' };
        }
        return { user };
    } catch (err) {
        throw new Error('Error during password reset');
    }
};
