const jwt = require("jsonwebtoken")
const SECRET = process.env.JWT_SECRET;

/**
 * JWT Authorization Middleware
 * 
 * This middleware function verifies the presence and validity of a JWT (JSON Web Token)
 * in the Authorization header of incoming HTTP requests.
 * 
 * Features:
 * - Allows OPTIONS requests to pass through without authorization (useful for CORS preflight).
 * - Extracts the token from the `Authorization` header in the format: "Bearer <token>".
 * - Verifies the token using a secret key defined in environment variables.
 * - Attaches the decoded token payload to `req.user` for downstream use.
 * - Returns a 403 Forbidden response if no token is present or the token is invalid.
 * 
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} req.headers - HTTP request headers (expects Authorization header).
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * 
 * @returns {void} Calls `next()` if authorized or sends HTTP 403 if unauthorized.
 */
module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(403).json({ message: "The user is not authorized" })
        }

        const decodedData = jwt.verify(token, SECRET)
        req.user = decodedData
        next()
    } catch (e) {
        return res.status(403).json({ message: "The user is not authorized" })
    }
}