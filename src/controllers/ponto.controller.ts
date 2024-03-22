import nodemailer from 'nodemailer';
import { IPontoGateway } from "../interfaces/ponto.gateway.interface";

export class PontoController {
	static async BaterPonto(PontoGatewayInterface: IPontoGateway, identificacao: string): Promise<boolean> {
		try {
			return await PontoGatewayInterface.BaterPonto(identificacao);
		} catch (error) {
			throw error;
		}
	}

	static async CalcularHorasEIntervalos(PontoGatewayInterface: IPontoGateway, identificacao: string): Promise<object> {
		try {
			return await PontoGatewayInterface.CalcularHorasEIntervalos(identificacao);
		} catch (error) {
			throw error;
		}
	}

	static async EnviarEmailRegistros(PontoGatewayInterface: IPontoGateway, identificacao: string, email: string): Promise<boolean> {
		try {
			const response = await PontoGatewayInterface.CalcularHorasEIntervalos(identificacao);

			let transporter = nodemailer.createTransport({
				service: 'hotmail',
				auth: {
					user: process.env.EMAIL_FROM,
					pass: process.env.PASSWORD_EMAIL
				}
			});

			let mailOptions = {
				from: process.env.EMAIL_FROM,
				to: email,
				subject: 'Seus Registros de ponto',
				text: JSON.stringify(response)
			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					console.log('Email enviado: ' + info.response);
				}
			});

			return true;
		} catch (error) {
			throw error;
		}
	}
}
