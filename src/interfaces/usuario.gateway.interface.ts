import { UsuarioProps } from "../external/mongo/model/props/usuario.props";

export interface IUsuarioGateway {
    CriarUsuario(usuarioProps: UsuarioProps): Promise<boolean>;
    Signin(usuarioProps: UsuarioProps): Promise<object>;
}
