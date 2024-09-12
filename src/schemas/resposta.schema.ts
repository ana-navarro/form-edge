import mongoose, { Document, Schema } from 'mongoose';

interface IResposta extends Document {
    email: string;
    questao: mongoose.Schema.Types.ObjectId;
    resposta: string;
}

const respostaSchema: Schema = new Schema({
    email: { type: String, required: true },
    questao: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'questao' },
    resposta: { type: String, required: true },
}, {
    timestamps: true
});

const Resposta = mongoose.model<IResposta>('resposta', respostaSchema);

export default Resposta;