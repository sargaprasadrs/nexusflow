import { Router } from 'express';
import { templateController } from '../controllers/templateController.js';

const router = Router();

// Template library (Week 4) - reusable starter graphs
router.get('/', templateController.list);
router.post('/', templateController.create);
router.delete('/:id', templateController.remove);

export default router;
