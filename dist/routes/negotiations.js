"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.negotiationsRouter = void 0;
const express_1 = require("express");
const http_helpers_1 = require("../lib/http-helpers");
const negotiations_1 = require("../controllers/negotiations");
const router = (0, express_1.Router)();
exports.negotiationsRouter = router;
// Price negotiations routes
router.get('/price-negotiations', (0, http_helpers_1.asyncHandler)(negotiations_1.getPriceNegotiations));
router.post('/price-negotiations', (0, http_helpers_1.asyncHandler)(negotiations_1.createPriceNegotiation));
router.put('/price-negotiations/:id', (0, http_helpers_1.asyncHandler)(negotiations_1.updatePriceNegotiation));
//# sourceMappingURL=negotiations.js.map