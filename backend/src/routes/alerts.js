import { Router } from 'express';
import { alertController } from '../controllers/alertController.js';

const router = Router();

router.get('/', alertController.list);
router.patch('/:id', alertController.updateStatus); // resolve / dedupe
router.delete('/:id', alertController.remove);

export default router;
