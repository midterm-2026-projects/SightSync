import express from "express";
import inventoryRoutes from "./src/objective2/routes/inventory.js";
import patientRoutes from "./src/objective1/routes/patient.routes.js";
import appointmentRoutes from "./src/objective1/routes/appointment.routes.js";
import doctorAvailabilityRoutes from "./src/objective1/routes/doctorAvailability.routes.js";
import orderRoutes from "./src/objective2/routes/order.js";

const app = express();

app.use(express.json());


app.get("/", (req, res) => {

    res.send("SightSync Backend Running");

});
app.use("/inventory", inventoryRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doc-availability", doctorAvailabilityRoutes);
app.use("/orders", orderRoutes);

export default app;
