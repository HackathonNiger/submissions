// import { validateRequest } from "zod-express-middleware";
import {
  visitSchedule,
  getVisits,
  getVisitById,
  updateSpecificVisit,
  deleteVisit,
} from "../controllers/visitController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import express from "express";
// import {
//   createVisitSchema,
//   updateVisitSchema,
// } from "../middleware/validateSchema.js";

const router = express.Router();

router.post(
  "/create_schedule",
  protectRoute,
  // validateRequest({ body: createVisitSchema }),
  visitSchedule
);
router.get("/get_visits", protectRoute, getVisits);
router.get("/get_visit/:id", protectRoute, getVisitById);
router.put(
  "/update_visit/:id",
  protectRoute,
  // validateRequest({ body: updateVisitSchema }),
  updateSpecificVisit
);
router.delete("/delete_visit/:id", protectRoute, deleteVisit);

export default router;
