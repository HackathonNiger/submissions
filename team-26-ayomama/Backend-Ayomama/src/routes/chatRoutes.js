import { Router } from "express";
import { chatWithAi } from "../controllers/chatController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
// import { validateRequest } from "zod-express-middleware";
// import { chatSchema } from "../middleware/validateSchema.js";

const router = Router();

router.post(
  "/",
  protectRoute,
  // validateRequest({ body: chatSchema }),
  chatWithAi
);


export default router;
