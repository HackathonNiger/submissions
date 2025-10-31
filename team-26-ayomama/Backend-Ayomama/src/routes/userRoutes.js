import {
  updateLanguagePreference,
  profileInformation,
  getUser,
} from "../controllers/userController.js";
import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
// import {
//   profileUpdateSchema,
//   updateLanguageSchema,
// } from "../middleware/validateSchema.js";
// import { validateRequest } from "zod-express-middleware";

const router = express.Router();

router.get("/", protectRoute, getUser);
router.put(
  "/update-language",
  protectRoute,
  // validateRequest({ body: updateLanguageSchema }),
  updateLanguagePreference
);
router.put(
  "/profile-info",
  protectRoute,
  // validateRequest({ body: profileUpdateSchema }),
  profileInformation
);

export default router;
