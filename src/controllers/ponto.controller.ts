import { IPontoGateway } from "../interfaces/ponto.gateway.interface";

export class PontoController {
	static async BaterPonto(PontoGatewayInterface: IPontoGateway, identificacao: string): Promise<boolean> {
		try {
			return await PontoGatewayInterface.BaterPonto(identificacao);
		} catch (error) {
			throw error;
		}
	}
}
