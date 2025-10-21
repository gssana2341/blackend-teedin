"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentsRouter = void 0;
const express_1 = require("express");
const http_helpers_1 = require("../lib/http-helpers");
const appointments_1 = require("../controllers/appointments");
const router = (0, express_1.Router)();
exports.appointmentsRouter = router;
// Appointments routes
router.get('/', (0, http_helpers_1.asyncHandler)(appointments_1.getAppointments));
router.post('/', (0, http_helpers_1.asyncHandler)(appointments_1.createAppointment));
router.put('/:id', (0, http_helpers_1.asyncHandler)(appointments_1.updateAppointment));
router.delete('/:id', (0, http_helpers_1.asyncHandler)(appointments_1.deleteAppointment));
//# sourceMappingURL=appointments.js.map