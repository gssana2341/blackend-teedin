import { Router } from 'express';
import { asyncHandler } from '../lib/http-helpers';
import { getUserById, updateUserRole, checkUserExists } from '../controllers/users';

const router = Router();

// User routes
router.get('/:id', asyncHandler(getUserById));
router.post('/update-role', asyncHandler(updateUserRole));
router.post('/check-exists', asyncHandler(checkUserExists));

export { router as usersRouter };
