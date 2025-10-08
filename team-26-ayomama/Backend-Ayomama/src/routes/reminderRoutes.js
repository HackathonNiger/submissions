import express from 'express'
import {runReminders} from '../controllers/reminderController.js'

const router = express.Router();

router.get("/run", runReminders);

export default router;







