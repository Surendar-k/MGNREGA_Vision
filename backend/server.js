import express from "express";
import cors from "cors";
import mgnregaRoutes from "./routes/mgnregaRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/mgnrega", mgnregaRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
