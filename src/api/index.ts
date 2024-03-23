export class NoPonto {
	constructor() {}

	static start() {
		const express = require("express");

		const app = express();
		const swaggerUi = require("swagger-ui-express");
		const swaggerSpec = require("./swagger");
		app.use(express.json());
		const PORT = process.env.PORT || 3000;

		const docsRoutes = require("./routes/docs");
		const indexRoutes = require("./routes/routes");
		const authRoutes = require("./routes/auth");
		const pontoRoutes = require("./routes/ponto");

		app.use("/api", indexRoutes);
		app.use("/api-json", docsRoutes);
		app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
		app.use("/auth", authRoutes);
		app.use("/pontos", pontoRoutes);

		app.listen(PORT, () => {
			console.log(`No ponto listening on port ${PORT}`);
		});
	}
}
