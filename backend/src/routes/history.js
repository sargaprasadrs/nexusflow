import { Router } from 'express';
import { historyController } from '../controllers/historyController.js';

const router = Router();

// GET /api/history?ruleId=&from=&to= - rule execution history (Week 4)
router.get('/', historyController.list);

export default router;
