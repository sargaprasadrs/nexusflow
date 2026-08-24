import { Router } from 'express';
import { templateController } from '../controllers/templateController.js';
import { validateObjectId } from '../middleware/security.js';

const router = Router();

router.get('/', templateController.list);
router.post('/', templateController.create);
router.delete('/:id', validateObjectId('id'), templateController.remove);

export default router;
