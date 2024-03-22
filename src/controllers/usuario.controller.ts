import { UsuarioProps } from "../external/mongo/model/props/usuario.props";
import { IUsuarioGateway } from "../interfaces/usuario.gateway.interface";

export class UsuarioController {
	static async CriarUsuario(
		usuarioGatewayInterface: IUsuarioGateway,
		usuarioProps: UsuarioProps
	): Promise<boolean> {
		try {
			return await usuarioGatewayInterface.CriarUsuario(usuarioProps);				
		} catch (error) {
			throw error;
		}
	}

	static async Signin(
		usuarioGatewayInterface: IUsuarioGateway,
		usuarioProps: UsuarioProps
	): Promise<object> {
		try {
			return await usuarioGatewayInterface.Signin(usuarioProps);				
		} catch (error) {
			throw error;
		}
	}
}
