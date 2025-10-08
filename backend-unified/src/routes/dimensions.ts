import express from 'express';
import {
  getDimensions,
  getDimensionById,
  searchDimensionsByModel,
  createDimension,
  updateDimension,
  deleteDimension,
} from '../controllers/dimensionController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes (no authentication required for reading)
router.get('/', getDimensions);
router.get('/search/:model', searchDimensionsByModel);
router.get('/:id', getDimensionById);

// Protected routes (require authentication)
router.post('/', authenticate, createDimension);
router.put('/:id', authenticate, updateDimension);
router.delete('/:id', authenticate, deleteDimension);

export default router;

