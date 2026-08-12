import { Router } from 'express';
import { graphController } from '../controllers/graphController.js';

const router = Router();

router.get('/', graphController.list);
router.get('/:id', graphController.get);
router.post('/', graphController.create);
router.put('/:id', graphController.update);
router.delete('/:id', graphController.remove);
router.post('/:id/compile', graphController.compile); // graph JSON -> RxJS pipeline (Week 2)

export default router;
