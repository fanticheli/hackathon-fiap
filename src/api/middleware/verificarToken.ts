import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface RequestComUsuario extends Request {
    usuarioId?: string;
    email?: string;
}

export const verificarToken = (req: RequestComUsuario, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).send({ mensagem: 'Token de autenticação necessário.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
        req.usuarioId = decoded.userId;
        req.email = decoded.email;
        next();
    } catch (error) {
        return res.status(401).send({ mensagem: 'Token inválido.' });
    }
};
