import mongoose, { Document, Schema } from 'mongoose';

interface IFormulario extends Document {
    questoes: mongoose.Schema.Types.ObjectId[];
    finalizado: boolean;
    email: string;
}

const formularioSchema: Schema = new Schema({
    questoes: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'questao' }],
    finalizado: { type: Boolean, require: true },
    email: { type: String, require: true },
}, {
    timestamps: true
});

const Formulario = mongoose.model<IFormulario>('formulario', formularioSchema);

export default Formulario;
