"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const http_helpers_1 = require("../lib/http-helpers");
const http_helpers_2 = require("../lib/http-helpers");
const auth_1 = require("../controllers/auth");
const router = (0, express_1.Router)();
exports.authRouter = router;
// Auth routes
router.get('/me', (0, http_helpers_1.asyncHandler)(auth_1.getCurrentUser));
router.post('/logout', (0, http_helpers_1.asyncHandler)(auth_1.logoutUser));
router.delete('/logout', (0, http_helpers_1.asyncHandler)(auth_1.forceLogout));
// Login route
router.post('/login', (0, http_helpers_1.asyncHandler)(async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return (0, http_helpers_2.sendError)(res, 'Email and password are required', 400);
        }
        // Import Supabase client
        const { createClient } = await Promise.resolve().then(() => __importStar(require('@supabase/supabase-js')));
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        // First, try Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        if (authError || !authData.user) {
            // If Supabase Auth fails, check if user exists in database
            console.log('Supabase Auth failed, checking database for user:', email);
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();
            console.log('Database query result:', { userData, userError });
            if (userError || !userData) {
                console.log('User not found in database');
                return (0, http_helpers_2.sendError)(res, 'ไม่พบข้อมูลผู้ใช้', 404);
            }
            // For now, accept any password for existing users (you should implement proper password checking)
            return (0, http_helpers_2.sendSuccess)(res, {
                message: 'Login successful',
                user: {
                    id: userData.id,
                    email: userData.email,
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    role: userData.role,
                    phone: userData.phone
                },
                token: 'mock-jwt-token' // You should generate a proper JWT token
            });
        }
        // If Supabase Auth succeeds, get user details
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();
        if (userError || !userData) {
            return (0, http_helpers_2.sendError)(res, 'ไม่พบข้อมูลผู้ใช้', 404);
        }
        return (0, http_helpers_2.sendSuccess)(res, {
            message: 'Login successful',
            user: {
                id: userData.id,
                email: userData.email,
                first_name: userData.first_name,
                last_name: userData.last_name,
                role: userData.role,
                phone: userData.phone
            },
            token: authData.session?.access_token
        });
    }
    catch (error) {
        return (0, http_helpers_2.sendError)(res, `Login failed: ${error.message}`, 500);
    }
}));
// Register route
router.post('/register', (0, http_helpers_1.asyncHandler)(async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return (0, http_helpers_2.sendError)(res, 'Email, password, and name are required', 400);
        }
        // TODO: Implement actual registration logic with Supabase
        // For now, return a mock response
        return (0, http_helpers_2.sendSuccess)(res, {
            message: 'Registration successful',
            user: {
                id: 'mock-user-id',
                email: email,
                name: name
            }
        });
    }
    catch (error) {
        return (0, http_helpers_2.sendError)(res, `Registration failed: ${error.message}`, 500);
    }
}));
//# sourceMappingURL=auth.js.map