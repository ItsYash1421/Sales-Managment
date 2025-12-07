import express from 'express';
import { getSales, getStats, getFilters } from '../controllers/salesController.js';

const router = express.Router();

router.get('/', getSales);
router.get('/statistics', getStats);
router.get('/filters', getFilters);

export default router;
