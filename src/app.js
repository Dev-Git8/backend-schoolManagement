import express from "express";
const app = express();
import schoolrouter from "./routes/school.routes.js";






app.use(express.json());
app.use("/school", schoolrouter);

















export default app;