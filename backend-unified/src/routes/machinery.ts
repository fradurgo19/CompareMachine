import { Router } from 'express';
import {
  getMachinery,
  getMachineryById,
  createMachinery,
  updateMachinery,
  deleteMachinery,
  getManufacturers,
  getAllMachineryDirect
} from '../controllers/machineryController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/diagnostic/all', getAllMachineryDirect); // TEMPORARY DIAGNOSTIC ENDPOINT
router.get('/', getMachinery);
router.get('/manufacturers', getManufacturers);
router.get('/:id', getMachineryById);

// Protected routes (require authentication)
router.use(authenticateToken);

// Admin only routes
// router.post('/', requireAdmin, createMachinery); // Temporarily allow all authenticated users

// Allow authenticated users to create machinery
router.post('/', createMachinery);
router.put('/:id', requireAdmin, updateMachinery);
router.delete('/:id', requireAdmin, deleteMachinery);

export default router;
