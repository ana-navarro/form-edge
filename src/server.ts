import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import formularioRoutes from './routes/formulario.routes'
import usuarioRoutes from './routes/usuario.routes'
import authRoutes from './routes/auth.routes'

const app = express();

dotenv.config();

const connect = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.BANCO_DE_DADOS as string);
        console.log('Banco de Dados conectado com sucesso!');
    } catch (err) {
        console.log(err);
    }
};
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server rodando na porta ${process.env.PORT || 5000}`);
    connect();
});

app.use(cors());
app.use(express.json());

app.use(
    '/api',
    createProxyMiddleware({
        target: 'http://181.215.134.184:5000',
        changeOrigin: true,
    })
);

app.use(express.static(path.join(__dirname, "./sigus-app/build")));

app.get("*", (req: Request, res: Response) => {
    res.sendFile(
        path.join(__dirname, "../sigus-app/build/index.html"),
        (err: any) => {
            if (err) {
                res.status(500).send(err);
            }
        }
    );
});

app.use('/api/formulario', formularioRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api', authRoutes);

export default app;
