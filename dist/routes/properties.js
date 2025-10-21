"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertiesRouter = void 0;
const express_1 = require("express");
const http_helpers_1 = require("../lib/http-helpers");
const properties_1 = require("../controllers/properties");
const router = (0, express_1.Router)();
exports.propertiesRouter = router;
// Properties routes
router.get('/', (0, http_helpers_1.asyncHandler)(properties_1.getProperties));
router.get('/similar', (0, http_helpers_1.asyncHandler)(properties_1.getSimilarProperties));
router.get('/:id', (0, http_helpers_1.asyncHandler)(properties_1.getPropertyById));
router.post('/create', (0, http_helpers_1.asyncHandler)(properties_1.createProperty));
// Additional property routes
router.get('/get-properties', (0, http_helpers_1.asyncHandler)(properties_1.getPropertiesVariant));
router.get('/get-property/:id', (0, http_helpers_1.asyncHandler)(properties_1.getPropertyByIdVariant));
router.get('/static-properties', (0, http_helpers_1.asyncHandler)(properties_1.getStaticProperties));
//# sourceMappingURL=properties.js.map