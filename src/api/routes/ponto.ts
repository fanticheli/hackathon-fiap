import express, { Request, Response } from "express";
import { verificarToken } from "../middleware/verificarToken";
import { PontoRepositoryInMongo } from "../../external/mongo/repositories/ponto.repository";
import { PontoController } from "../../controllers/ponto.controller";

interface RequestComUsuario extends Request {
	usuarioId?: string;
	email?: string;
}

const router = express.Router();
const pontoRepositoryInMongo = new PontoRepositoryInMongo();

/**
 * @swagger
 * tags:
 *   name: Pontos
 */

/**
 * @swagger
 * /pontos/register:
 *   post:
 *     summary: Bater o ponto.
 *     tags: [Pontos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Ponto batido com sucesso!!!
 *       403:
 *         description: Token de autenticação necessário.
 */
router.post("/register", verificarToken, async (req: RequestComUsuario, res: Response) => {
	if (!req.usuarioId) return res.status(400).send({ message: "Ops, algo deu errado." });

	await PontoController.BaterPonto(pontoRepositoryInMongo, req.usuarioId)
		.then((response: any) => {
			res.status(201).send({ message: "Ponto batido com sucesso!!!" });
		})
		.catch((err: any) => {
			res.status(400).send({ message: err?.message });
		});
});

/**
 * @swagger
 * /pontos/registers:
 *   get:
 *     summary: Lista registro de colaborador.
 *     tags: [Pontos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de registros.
 */
router.get("/registers", verificarToken, async (req: RequestComUsuario, res: Response) => {
	if (!req.usuarioId) return res.status(400).send({ message: "Ops, algo deu errado." });

	await PontoController.CalcularHorasEIntervalos(pontoRepositoryInMongo, req.usuarioId)
		.then((response: any) => {
			res.status(200).send(response);
		})
		.catch((err: any) => {
			res.status(400).send({ message: err?.message });
		});
});

/**
 * @swagger
 * /pontos/registers/email:
 *   get:
 *     summary: Lista registro de colaborador e envia para o email.
 *     tags: [Pontos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de registros no email.
 */
router.get("/registers/email", verificarToken, async (req: RequestComUsuario, res: Response) => {
	if (!req.usuarioId || !req.email) return res.status(400).send({ message: "Ops, algo deu errado." });

	await PontoController.EnviarEmailRegistros(pontoRepositoryInMongo, req.usuarioId, req.email)
		.then((response: any) => {
			res.status(200).send({ message: "Email enviado com sucesso!!!" });
		})
		.catch((err: any) => {
			res.status(400).send({ message: err?.message });
		});
});

module.exports = router;
