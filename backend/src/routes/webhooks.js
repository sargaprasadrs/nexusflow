import { Router } from 'express';
import { webhookController } from '../controllers/webhookController.js';
import { validateObjectId } from '../middleware/security.js';

const router = Router();

router.get('/', webhookController.list);
router.post('/', webhookController.create);
router.put('/:id', validateObjectId('id'), webhookController.update);
router.delete('/:id', validateObjectId('id'), webhookController.remove);
router.post('/:id/test', validateObjectId('id'), webhookController.test);

export default router;
