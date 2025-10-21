import { Router } from 'express';
import { asyncHandler } from '../lib/http-helpers';
import { 
  getProperties, 
  getPropertyById, 
  createProperty, 
  getSimilarProperties,
  getPropertiesVariant,
  getPropertyByIdVariant,
  getStaticProperties
} from '../controllers/properties';

const router = Router();

// Properties routes
router.get('/', asyncHandler(getProperties));
router.get('/similar', asyncHandler(getSimilarProperties));
router.get('/:id', asyncHandler(getPropertyById));
router.post('/create', asyncHandler(createProperty));

// Additional property routes
router.get('/get-properties', asyncHandler(getPropertiesVariant));
router.get('/get-property/:id', asyncHandler(getPropertyByIdVariant));
router.get('/static-properties', asyncHandler(getStaticProperties));

export { router as propertiesRouter };
