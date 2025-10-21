import { Router } from 'express';
import { asyncHandler } from '../lib/http-helpers';
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from '../controllers/appointments';

const router = Router();

// Appointments routes
router.get('/', asyncHandler(getAppointments));
router.post('/', asyncHandler(createAppointment));
router.put('/:id', asyncHandler(updateAppointment));
router.delete('/:id', asyncHandler(deleteAppointment));

export { router as appointmentsRouter };
