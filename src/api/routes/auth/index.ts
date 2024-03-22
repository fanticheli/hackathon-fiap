import express, { Request, Response } from "express";
import { UsuarioRepositoryInMongo } from "../../../external/mongo/repositories/user.repository";
import { UsuarioController } from "../../../controllers/usuario.controller";
import { verificarToken } from "../../middleware/verificarToken";

const router = express.Router();
const usuarioRepositoryInMongo = new UsuarioRepositoryInMongo();

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
router.post("/register", verificarToken, async (req: Request, res: Response) => {
	await UsuarioController.CriarUsuario(
		usuarioRepositoryInMongo,
		req.body
	)
		.then((response: any) => {
			res.status(201).send("Usuário criado com sucesso.");
		})
		.catch((err: any) => {
			res.status(400).send({ message: err?.message });
		});
});

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Faz login de um Usuário
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
 *       200:
 *         description: Usuário logado com sucesso.
 */
router.post("/signin", async (req: Request, res: Response) => {
	await UsuarioController.Signin(
		usuarioRepositoryInMongo,
		req.body
	)
		.then((response: any) => {
			res.status(200).send(response);
		})
		.catch((err: any) => {
			res.status(400).send({ message: err?.message });
		});
});

module.exports = router;
