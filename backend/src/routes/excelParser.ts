import express from 'express';
import multer from 'multer';
import { parseExcelSpecifications, generateExcelTemplate } from '../controllers/excelParserController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Configure multer for Excel file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept Excel files
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo se aceptan archivos Excel (.xlsx, .xls).'));
    }
  },
});

/**
 * @route   POST /api/excel-parser/specifications
 * @desc    Parse machinery specifications from Excel file
 * @access  Private (requires authentication)
 */
router.post('/specifications', authenticateToken, upload.single('file'), parseExcelSpecifications);

/**
 * @route   GET /api/excel-parser/template
 * @desc    Download Excel template
 * @access  Public
 */
router.get('/template', generateExcelTemplate);

export default router;

