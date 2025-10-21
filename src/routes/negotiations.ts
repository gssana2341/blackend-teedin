import { Router } from 'express';
import { asyncHandler } from '../lib/http-helpers';
import { getPriceNegotiations, createPriceNegotiation, updatePriceNegotiation } from '../controllers/negotiations';

const router = Router();

// Price negotiations routes
router.get('/price-negotiations', asyncHandler(getPriceNegotiations));
router.post('/price-negotiations', asyncHandler(createPriceNegotiation));
router.put('/price-negotiations/:id', asyncHandler(updatePriceNegotiation));

export { router as negotiationsRouter };
