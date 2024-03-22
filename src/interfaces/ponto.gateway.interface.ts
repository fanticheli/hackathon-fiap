export interface IPontoGateway {
    BaterPonto(identificacao: string): Promise<boolean>;
}
