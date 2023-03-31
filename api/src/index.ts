import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { routes } from "./routes";

import swaggerUI from "swagger-ui-express";
import swaggerDocument from "../swagger.json";

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

app.use("/api/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

dotenv.config();
const port = process.env.API_PORT || 3000;

app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});
