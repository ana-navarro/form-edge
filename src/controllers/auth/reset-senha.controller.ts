import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { resetSenhaService } from '../../services/auth/reset-senha.service';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

export const resetSenhaUsuario = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(401).json({ msg: 'Entre um email válido' });
    }

    try {
        const result = await resetSenhaService(email);

        if (result.error) {
            return res.status(result.status || 500).json({ msg: result.error });
        }

        const user = result.user;

        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Email para troca de senha!',
            text: `Para trocar a senha, acesse o link: algum-link-aleatorio`
        };

        transporter.sendMail(mailOptions, (error: any) => {
            if (error) {
                console.log('Error:', error);
                return res.status(401).json({ msg: 'Email não enviado' });
            } else {
                return res.status(201).json({ msg: 'Email de reset de senha enviado com sucesso!' });
            }
        });
    } catch (error) {
        res.status(500).json({ msg: 'Error during password reset' });
    }
};
