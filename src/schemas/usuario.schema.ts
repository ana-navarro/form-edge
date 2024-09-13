import mongoose, { Document, Schema } from 'mongoose';

interface Acesso {
    tipoAcesso: 'ADMIN' | 'RESPONDENTE' | 'VISUALIZACAO' | 'EDICAO'; 
    acessoFormularios: string | null;
}

export interface UsuarioDocument extends Document {
    nome: string;
    email: string;
    senha: string;
    acesso: Acesso[];
}

const usuarioSchema: Schema = new Schema({
    nome: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    senha: { type: String, required: true },
    acesso: [{
        tipoAcesso: { 
            type: String, 
            enum: ['ADMIN', 'RESPONDENTE', 'VISUALIZACAO', 'EDICAO'], 
            required: true 
        },
        acessoFormularios: { type: mongoose.Schema.Types.ObjectId, ref: 'Formulario' }
    }]
}, {
    timestamps: true
});

const Usuario = mongoose.model<UsuarioDocument>('Usuario', usuarioSchema);

export default Usuario;
