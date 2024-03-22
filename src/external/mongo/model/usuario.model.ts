import crypto from 'crypto';
import mongoose, { Schema, Document } from 'mongoose';

interface IUsuarioDocument extends Document {
    email: string;
    password: string;
    salt: string;
    hashPassword: (password: string) => string;
    authenticate: (password: string) => boolean;
}

const UsuarioSchema: Schema<IUsuarioDocument> = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
});

UsuarioSchema.index({
    email: 1
}, {
    unique: true
});

const Usuario = mongoose.model<IUsuarioDocument>('Usuario', UsuarioSchema);
export default Usuario;
