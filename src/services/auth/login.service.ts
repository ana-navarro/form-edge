import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Usuario from '../../schemas/usuario.schema';

dotenv.config();

const generateToken = (_id: string): string => {
    return jwt.sign({ _id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

export const loginService = async (email: string, password: string) => {
    try {
        const user = await Usuario.findOne({ email }).exec();
        if (!user) {
            return {
                status: 404,
                msg: 'Usuario nao existente!'
            };
        }
        
        const matchPassword = await bcrypt.compare(password, user.senha);

        const userId: string = user.id;

        if (matchPassword) {
            return {
                token: generateToken(userId),
                user
            };
        }
        return {
            status: 401,
            msg: 'Email ou senha errados!'
        };
    } catch (err) {
        throw new Error('Error during login');
    }
};
