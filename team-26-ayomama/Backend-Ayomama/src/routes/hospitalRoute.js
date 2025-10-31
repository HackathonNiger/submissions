import { Router } from "express";
import { getNearbyHospitals } from "../controllers/hospitalController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protectRoute, getNearbyHospitals);

export default router;
