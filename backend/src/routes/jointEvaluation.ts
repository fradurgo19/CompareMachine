import { Router } from 'express';
import {
  getJointEvaluations,
  getJointEvaluationById,
  createJointEvaluation,
  updateJointEvaluation,
  deleteJointEvaluation,
  calculateJointEvaluationResults
} from '../controllers/jointEvaluationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public route for calculations
router.post('/calculate', calculateJointEvaluationResults);

// Protected routes (require authentication)
router.use(authenticateToken);

router.get('/', getJointEvaluations);
router.get('/:id', getJointEvaluationById);
router.post('/', createJointEvaluation);
router.put('/:id', updateJointEvaluation);
router.delete('/:id', deleteJointEvaluation);

export default router;
