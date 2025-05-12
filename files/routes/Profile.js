const BaseRoute = require('../../core/Classes/RouteClass.js');
const ProfileModel = require('../models/Profile.js');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpire } = require('../../config.js');

class ProfileRoute extends BaseRoute {
    constructor() {
        super();
        this.path = '/profile';
        this.initRoutes();
    }

    initRoutes() {
        this.router.post('/register', this.createProfile.bind(this));
        this.router.post('/login', this.loginProfile.bind(this));
    }

    async createProfile(req, res) {
        try {
            const profile = await ProfileModel.create(req.body);
            this.sendResponse(res, profile);
        } catch (err) {
            this.sendError(res, err.message);
        }
    }

    async loginProfile(req, res) {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await ProfileModel.findOne({ email });

            if (!user) {
                return this.sendError(res, 'User not found', 404);
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return this.sendError(res, 'Invalid credentials', 401);
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user._id, role: user.role }, // Payload (user info)
                jwtSecret,                          // Secret key
                { expiresIn: jwtExpire }            // Token expiration time
            );

            // Send response with token and user info (no cookie, just JWT in the response)
            this.sendResponse(res, {
                message: 'Login successful',
                token, // JWT token in the response
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (err) {
            this.sendError(res, err.message);
        }
    }
}

module.exports = ProfileRoute;
