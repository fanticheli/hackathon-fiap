export interface IPontoGateway {
    BaterPonto(identificacao: string): Promise<boolean>;
    CalcularHorasEIntervalos(identificacao: string): Promise<object>;
}
