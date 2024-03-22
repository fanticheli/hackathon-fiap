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
        const hoje = new Date();
        const inicioDoDia = new Date(hoje.setHours(0, 0, 0, 0));
        const fimDoDia = new Date(hoje.setHours(23, 59, 59, 999));

        const ultimoPontoBatido = await this._model.findOne(
            {
                identificacao: this.hashIdentificacao(identificacao),
                createdAt: {
                    $gte: inicioDoDia,
                    $lt: fimDoDia
                }
            }).sort({ createdAt: -1 });

        if (!ultimoPontoBatido) {
            return 'entrada';
        }

        return ultimoPontoBatido.tipo === 'entrada' ? 'saida' : 'entrada';
    }

    async CalcularHorasEIntervalos(identificacao: string): Promise<object> {
        try {
            const registros = await this._model.find({ identificacao: this.hashIdentificacao(identificacao) })
                .sort({ createdAt: 1 })
                .lean();

            let resultados = {} as any;

            registros.forEach(registro => {
                const data = registro.createdAt.toISOString().split('T')[0];

                if (!resultados[data]) {
                    resultados[data] = {
                        horasTrabalhadas: 0,
                        minutosIntervalo: 0,
                        ultimoRegistroSaida: null,
                        registros: []
                    };
                }

                resultados[data].registros.push(registro);
            });

            Object.keys(resultados).forEach(data => {
                const dia = resultados[data];
                dia.registros.forEach((registro: any, index: any) => {
                    // Cálculo dos intervalos
                    if (dia.ultimoRegistroSaida && registro.tipo === 'entrada') {
                        const intervalo = (registro.createdAt - dia.ultimoRegistroSaida) / (1000 * 60); // Convertendo para minutos
                        dia.minutosIntervalo += intervalo;
                    }

                    if (registro.tipo === 'saida') {
                        dia.ultimoRegistroSaida = registro.createdAt;
                    }

                    if (index % 2 === 0 && dia.registros[index + 1]) {
                        const entrada = new Date(registro.createdAt).getTime();
                        const saida = new Date(dia.registros[index + 1].createdAt).getTime();
                        const horasTrabalhadas = (saida - entrada) / (1000 * 60 * 60);
                        dia.horasTrabalhadas += horasTrabalhadas;
                    }
                });

                dia.registros = dia.registros.map((registro: any) => {
                    return {
                        tipo: registro.tipo,
                        createdAt: this.formatDateTimeToBrazilian(registro.createdAt)
                    };
                });
            });

            return resultados;
        } catch (error) {
            throw error;
        }
    }

    formatDateTimeToBrazilian(date: Date): string {
        return new Intl.DateTimeFormat('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(date);
    }

}
