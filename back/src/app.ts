import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import excelRouter from "./routes/excel";
const runServer = () => {
	const app = express();
	// * MIDDLEWARES
	app.use(cors());
	app.use(morgan("dev"));
	app.use(express.json());
	// * ROUTES
	app.use("/api", excelRouter);
	// * START
	app.listen(process.env.PORT || 4000, () => {
		console.log("SERVER RUN: URL -> " + (process.env.PORT || 4000));
	});
};

export = runServer;
