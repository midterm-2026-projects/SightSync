import express from "express";
import inventoryRoutes from "./src/objective2/routes/inventory.js";

const app = express();

app.use(express.json());

app.use("/inventory", inventoryRoutes);

export default app;