import express from "express";
import inventoryRoutes from "./src/objective2/routes/inventory.js";
import patientRoutes from "./src/objective1/routes/patient.routes.js";
import appointmentRoutes from "./src/objective1/routes/appointment.routes.js";
import doctorAvailabilityRoutes from "./src/objective1/routes/doctorAvailability.routes.js";
import orderRoutes from "./src/objective2/routes/order.js";
import predictionRoutes from "./src/objective2/routes/prediction.js";
import summaryRoutes from "./src/objective1/routes/summary.routes.js";
import doctorRoutes from "./src/objective1/routes/doctor.routes.js";
import depositRoutes from "./src/objective3/routes/depositRoutes.js";
import paymentRoutes from "./src/objective3/routes/paymentRoutes.js";
import receiptRoutes from "./src/objective3/routes/receiptRoutes.js";
import messagingRoutes from "./src/objective3/routes/messagingRoutes.js";

import cors from "cors";

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
];

app.use(express.json());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));


app.get("/", (req, res) => {

    res.send("SightSync Backend Running");
    
});
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doc-availability", doctorAvailabilityRoutes);
app.use("/api/summaries", summaryRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/orders", orderRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/deposits", depositRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/receipts", receiptRoutes);
app.use("/api", messagingRoutes);
app.use("/prediction", predictionRoutes);

export default app;
