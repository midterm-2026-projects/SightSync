import express from "express";

import inventoryRoutes from "./src/objective2/routes/inventory.js";
import patientRoutes from "./src/objective1/routes/patient.routes.js";
const app = express();

app.use(express.json());


app.get("/", (req, res) => {

    res.send("SightSync Backend Running");

});
app.use("/inventory", inventoryRoutes);
app.use("/api/patients", patientRoutes);

export default app;
