import express from 'express';
import { parseTextSpecifications } from '../controllers/textParserController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

/**
 * @route   POST /api/text-parser/specifications
 * @desc    Parse machinery specifications from pasted text
 * @access  Private (requires authentication)
 */
router.post('/specifications', authenticateToken, parseTextSpecifications);

export default router;

