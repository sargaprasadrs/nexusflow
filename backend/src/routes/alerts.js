import { Router } from 'express';
import { alertController } from '../controllers/alertController.js';
import { validateObjectId } from '../middleware/security.js';

const router = Router();

router.get('/', alertController.list);
router.post('/', alertController.create);
router.patch('/:id', validateObjectId('id'), alertController.updateStatus);
router.delete('/:id', validateObjectId('id'), alertController.remove);

export default router;
