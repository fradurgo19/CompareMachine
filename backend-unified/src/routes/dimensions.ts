import express from 'express';
import {
  getDimensions,
  getDimensionById,
  searchDimensionsByModel,
  createDimension,
  updateDimension,
  deleteDimension,
} from '../controllers/dimensionController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes (no authentication required for reading)
router.get('/', getDimensions);
router.get('/search/:model', searchDimensionsByModel);
router.get('/:id', getDimensionById);

// Protected routes (require authentication)
router.post('/', authenticateToken, createDimension);
router.put('/:id', authenticateToken, updateDimension);
router.delete('/:id', authenticateToken, deleteDimension);

export default router;

