import Usuario from "../../schemas/usuario.schema";
import bcrypt from 'bcrypt';

export const editarSenhaService = async (userId: string, password: string) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return await Usuario.findByIdAndUpdate(userId, { password: hash }, { new: true });
    } catch (err) {
        throw new Error('Error during password update');
    }
};