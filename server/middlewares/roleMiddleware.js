const jwt = require("jsonwebtoken")
const SECRET = process.env.JWT_SECRET;

/**
 * Role-Based JWT Authorization Middleware Factory
 * 
 * Creates middleware that:
 * - Checks for a valid JWT token in the Authorization header.
 * - Verifies the token and extracts the user's role.
 * - Allows access only if the user's role matches the required role.
 * - Skips authorization for HTTP OPTIONS requests (for CORS preflight).
 * 
 * @function
 * @param {string} role - The required user role to access the route (e.g., "admin", "teacher", "student").
 * @returns {Function} Express middleware function to enforce role-based authorization.
 * 
 * @example
 * // Usage in an Express route
 * app.get('/admin/dashboard', roleAuthorization('admin'), (req, res) => {
 *   res.send('Welcome, admin!');
 * });
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * 
 * @throws {403} If no token is provided or token is invalid.
 * @throws {403} If user's role does not match the required role.
 */
module.exports = function (role) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }

        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(403).json({ message: "The user is not authorized" })
            }

            const { role: userRole } = jwt.verify(token, SECRET)
            if (userRole !== role) {
                return res.status(403).json({ message: `Access denied: you must be a ${role}` });
            }
            next()
        } catch (e) {
            console.log(e)
            return res.status(403).json({ message: "The user is not authorized" })
        }
    }
}