export class NoPonto {
	constructor() {}

	static start() {
		const express = require("express");

		const app = express();
		app.use(express.json());
		const PORT = process.env.PORT || 3000;

		const authRoutes = require("./routes/auth");
		const pontoRoutes = require("./routes/ponto");

		app.use("/auth", authRoutes);
		app.use("/ponto", pontoRoutes);

		app.listen(PORT, () => {
			console.log(`No ponto listening on port ${PORT}`);
		});
	}
}
