import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { IUsuarioGateway } from "../../../interfaces/usuario.gateway.interface";
import { UsuarioProps } from "../model/props/usuario.props";
import Usuario from "../model/usuario.model";

const jwtSecret = process.env.JWT_SECRET;

export class UsuarioRepositoryInMongo implements IUsuarioGateway {
	private _model;

	constructor() {
		this._model = Usuario;
	}

	async CriarUsuario(usuarioProps: UsuarioProps): Promise<boolean> {
		try {
			const salt = Buffer.from(crypto.randomBytes(16).toString('base64'), 'base64').toString('base64')
			const novoUsuario = {
				email: usuarioProps.email,
				password: this.hashPassword(usuarioProps.password, salt),
				salt
			};

			await this._model.create(novoUsuario);

			return true;
		} catch (error: any) {
			if (error.name === 'MongoServerError' && error.code === 11000) {
				throw (new Error('O email já está em uso.'));
			} else {
				throw error;
			}
		}
	}

	async Signin(usuarioProps: UsuarioProps): Promise<object> {
		const { email, password } = usuarioProps;
		const usuario = await this._model.findOne({ email });

		if (!usuario) {
			throw new Error('Ops, algo deu errado.');
		}

		if (usuario.password === this.hashPassword(password, usuario.salt)) {
			const token = jwt.sign({ userId: usuario._id, email: usuario.email }, jwtSecret!, { expiresIn: '1h' });
			return { token };
		}

		throw new Error('Ops, algo deu errado.');
	}

	hashPassword(password: string, salt: string): string {
		return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64');
	};

}
