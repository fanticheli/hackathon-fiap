import express, { Request, Response } from "express";
import { verificarToken } from "../../middleware/verificarToken";
import { PontoRepositoryInMongo } from "../../../external/mongo/repositories/ponto.repository";
import { PontoController } from "../../../controllers/ponto.controller";

interface RequestComUsuario extends Request {
	usuarioId?: string;
}

const router = express.Router();
const pontoRepositoryInMongo = new PontoRepositoryInMongo();

/**
 * @swagger
 * tags:
 *   name: Authorization
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Cria um novo Usuário.
 *     tags: [Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: "sample@sample.com.br"
 *               password: "teste123"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 */
router.post("/register", verificarToken, async (req: RequestComUsuario, res: Response) => {
	if (!req.usuarioId) return res.status(400).send({ message: "Ops, algo deu errado." });

	await PontoController.BaterPonto(pontoRepositoryInMongo, req.usuarioId)
		.then((response: any) => {
			res.status(201).send("Ponto batido com sucesso!!!");
		})
		.catch((err: any) => {
			res.status(400).send({ message: err?.message });
		});
});

module.exports = router;
