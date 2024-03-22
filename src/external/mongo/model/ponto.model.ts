import mongoose, { Schema, Document } from 'mongoose';

interface IPontoDocument extends Document {
    identificacao: string;
    tipo: string;
    createdAt: Date;
    updatedAt: Date;
}

const noPonto = mongoose.connection.useDb('no-ponto');
const PontoSchema: Schema<IPontoDocument> = new Schema({
    identificacao: { type: String, required: true },
    tipo: { type: String, enum: ['entrada', 'saida'], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Ponto = noPonto.model<IPontoDocument>('Ponto', PontoSchema);
export default Ponto;
