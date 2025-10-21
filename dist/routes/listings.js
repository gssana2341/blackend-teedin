"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listingsRouter = void 0;
const express_1 = require("express");
const http_helpers_1 = require("../lib/http-helpers");
const listings_1 = require("../controllers/listings");
const router = (0, express_1.Router)();
exports.listingsRouter = router;
// Listings routes
router.get('/my-listings', (0, http_helpers_1.asyncHandler)(listings_1.getMyListings));
router.delete('/my-listings', (0, http_helpers_1.asyncHandler)(listings_1.deleteListing));
//# sourceMappingURL=listings.js.map