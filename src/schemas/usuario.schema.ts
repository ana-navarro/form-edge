import mongoose, { Document, Schema } from 'mongoose';

export interface UsuarioDocument extends Document {
    nome: string;
    email: string;
    senha: string;
    tipoAcesso: 'ADMIN' | 'RESPONDENTE' | 'VISUALIZACAO'; 
    acessoFormularios: mongoose.Schema.Types.ObjectId[];
}

const usuarioSchema: Schema = new Schema({
    nome: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    senha: { type: String, required: true },
    tipoAcesso: { 
        type: String, 
        enum: ['ADMIN', 'RESPONDENTE', 'VISUALIZACAO'], 
        required: true 
    },
    acessoFormularios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'formulario' }]
}, {
    timestamps: true
});

const Usuario = mongoose.model<UsuarioDocument>('Usuario', usuarioSchema);

export default Usuario;
