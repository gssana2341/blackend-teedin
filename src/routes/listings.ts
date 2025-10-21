import { Router } from 'express';
import { asyncHandler } from '../lib/http-helpers';
import { getMyListings, deleteListing } from '../controllers/listings';

const router = Router();

// Listings routes
router.get('/my-listings', asyncHandler(getMyListings));
router.delete('/my-listings', asyncHandler(deleteListing));

export { router as listingsRouter };
