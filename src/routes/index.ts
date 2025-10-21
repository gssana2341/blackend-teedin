import { Router } from 'express';
import { propertiesRouter } from './properties';
import { authRouter } from './auth';
import { adminRouter } from './admin';
import { utilsRouter } from './utils';
import { appointmentsRouter } from './appointments';
import { listingsRouter } from './listings';
import { negotiationsRouter } from './negotiations';
import { notificationsRouter } from './notifications';
import { databaseRouter } from './database';
import { testingRouter } from './testing';
import { usersRouter } from './users';

const router = Router();

// Mount sub-routes
router.use('/properties', propertiesRouter);
router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/appointments', appointmentsRouter);
router.use('/listings', listingsRouter);
router.use('/negotiations', negotiationsRouter);
router.use('/notifications', notificationsRouter);
router.use('/database', databaseRouter);
router.use('/testing', testingRouter);
router.use('/users', usersRouter);
router.use('/', utilsRouter);

export { router };
