import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestao extends Document {
    enunciado: string;
    numAlternativas?: number;
    alternativas: string[];
}

const questaoSchema: Schema = new Schema({
    enunciado: { type: String, required: true },
    numAlternativas: { type: Number },
    alternativas: [{ type: String }],
});

const Questao = mongoose.model<IQuestao>('questao', questaoSchema);

export default Questao;