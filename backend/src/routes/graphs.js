import { Router } from 'express';
import { graphController } from '../controllers/graphController.js';
import { validateObjectId } from '../middleware/security.js';
import { validateGraphBody } from '../middleware/validate.js';

const router = Router();

router.get('/running', graphController.running);   // list running rules
router.get('/', graphController.list);
router.get('/:id', validateObjectId('id'), graphController.get);
router.post('/', validateGraphBody, graphController.create);
router.put('/:id', validateObjectId('id'), validateGraphBody, graphController.update);
router.delete('/:id', validateObjectId('id'), graphController.remove);
router.post('/:id/compile', validateObjectId('id'), graphController.compile);
router.post('/:id/execute', validateObjectId('id'), graphController.execute);
router.post('/:id/stop', validateObjectId('id'), graphController.stop);

export default router;
