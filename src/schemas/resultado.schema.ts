import mongoose, { Document, Schema } from 'mongoose';

interface IResultado extends Document {
    email: string;
    formulario: mongoose.Schema.Types.ObjectId;
    respostas: {
        questao: mongoose.Schema.Types.ObjectId;
        resposta: string;
    }[];
    mediaResultado: Number;
    resultado: {
        valor: Number;
        resultado: string;
    }; 
}

const resultadoSchema: Schema = new Schema({
    email: { type: String, required: true },
    formulario: { type: mongoose.Schema.Types.ObjectId, ref: 'formulario', required: true },
    respostas: [
        {
            questao: { type: mongoose.Schema.Types.ObjectId, ref: 'questao', required: true },
            resposta: { type: mongoose.Schema.Types.ObjectId, ref: 'resposta', required: true },
        }
    ],
    mediaResultado: { type: Number, required: true },
    resultado: {
        valor: { type: Number, required: true },
        resultado: { type: String, required: true }
    }
}, {
    timestamps: true
});

const Resultado = mongoose.model<IResultado>('resultado', resultadoSchema);

export default Resultado;
