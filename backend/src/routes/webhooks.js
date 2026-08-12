import { Router } from 'express';
import { webhookController } from '../controllers/webhookController.js';

const router = Router();

router.get('/', webhookController.list);
router.post('/', webhookController.create);
router.put('/:id', webhookController.update);
router.delete('/:id', webhookController.remove);
router.post('/:id/test', webhookController.test); // fire a test request

export default router;
