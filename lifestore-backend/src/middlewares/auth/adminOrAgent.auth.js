const jwt = require('jsonwebtoken')
const Admin = require('../../models/admin.model') // Replace with the actual admin model
const Agent = require('../../models/agent.model') // Replace with the actual agent model
const { MyCustomError } = require('../error/error.handler')

async function authenticateAdminOrAgent(req, res, next) {
  // Get the token from the request header
  const token =
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer') &&
    req.headers.authorization.split(' ')[1]?.trim()

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' })
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    // Fetch the user's role from the appropriate model based on the user's ID
    let user
    if (decoded.role === 'admin') {
      user = await Admin.findById(decoded.id)
    } else if (decoded.role === 'agent') {
      user = await Agent.findById(decoded.id)
    }

    if (!user) {
      return next(
        new MyCustomError(403, 'Access denied. Insufficient permissions.')
      )
    }

    if (!user.deleteStatus === 'true') {
      return next(
        new MyCustomError(
          403,
          'User Deleted Please Contact Support to Restore Account'
        )
      )
    }

    // Attach the decoded user data to the request
    user.role = decoded.role
    req.user = user

    // Check if the user has the 'admin' or 'agent' role
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new MyCustomError(401, 'Invalid token'))
    }

    next(error)
  }
}

module.exports = authenticateAdminOrAgent
