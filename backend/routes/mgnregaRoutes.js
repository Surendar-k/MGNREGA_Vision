import express from "express";
import { getDistrictData, getStates } from "../controllers/mgnregaController.js";

const router = express.Router();

// Fetch filtered district data
router.get("/", getDistrictData);

// States endpoint (always TAMIL NADU)
router.get("/states", getStates);

export default router;
