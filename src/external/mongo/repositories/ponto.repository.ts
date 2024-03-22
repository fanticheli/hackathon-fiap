import crypto from 'crypto';

import Ponto from '../model/ponto.model';
import { IPontoGateway } from '../../../interfaces/ponto.gateway.interface';

export class PontoRepositoryInMongo implements IPontoGateway {
    private _model;

    constructor() {
        this._model = Ponto;
    }

    async BaterPonto(identificacao: string): Promise<boolean> {
        try {

            const tipo = await this.dicidirOtipoBatido(identificacao);

            await this._model.create({
                identificacao: this.hashIdentificacao(identificacao),
                tipo
            });

            return true;
        } catch (error: any) {
            if (error.name === 'MongoServerError' && error.code === 11000) {
                throw (new Error('O email já está em uso.'));
            } else {
                throw error;
            }
        }
    }

    hashIdentificacao(identificacao: string): string {
        const salt = process.env.SALT_PONTO;

        if (!salt) {
            throw new Error('Configuração de sistemas não encontrada.');
        }

        return crypto.pbkdf2Sync(identificacao, salt, 10000, 64, 'sha1').toString('base64');
    };

    async dicidirOtipoBatido(identificacao: string): Promise<string> {
        const ultimoPontoBatido = await this._model.findOne(
            { identificacao: this.hashIdentificacao(identificacao) }).sort({ createdAt: -1 });

        if (!ultimoPontoBatido) {
            return 'entrada';
        }

        return ultimoPontoBatido.tipo === 'entrada' ? 'saida' : 'entrada';
    }

}
