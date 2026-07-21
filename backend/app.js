import express from "express";
import inventoryRoutes from "./src/objective2/routes/inventory.js";
import patientRoutes from "./src/objective1/routes/patient.routes.js";
import orderRoutes from "./src/objective2/routes/order.js";
import predictionRoutes from "./src/objective2/routes/prediction.js";

const app = express();

app.use(express.json());


app.get("/", (req, res) => {

    res.send("SightSync Backend Running");
    
});
app.use("/inventory", inventoryRoutes);
app.use("/api/patients", patientRoutes);
app.use("/orders", orderRoutes);
app.use("/prediction", predictionRoutes);

export default app;
