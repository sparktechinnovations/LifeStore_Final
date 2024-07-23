const jwt = require('jsonwebtoken')
const { MyCustomError } = require('../error/error.handler') // Import your custom error handler
const Agent = require('../../models/agent.model') // Import your Agent model

// Middleware function to verify JWT tokens and check against agent data
async function agentAuth(req, res, next) {
  // Get the token from the request headers
  const token =
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer') &&
    req.headers.authorization.split(' ')[1]?.trim()

  // Check if a token is provided
  if (!token) {
    return next(new MyCustomError(401, 'Token not provided'))
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    // Check if the decoded user ID or email exists in the database
    const agent = await Agent.findById(decoded.id)

    if (!agent) {
      return next(new MyCustomError(401, 'Agent not found'))
    }

    if (!agent.deleteStatus === 'true') {
      return next(
        new MyCustomError(
          403,
          'Agent Deleted Please Contact Support to Restore Account'
        )
      )
    }

    // Token is valid, attach the decoded user information to the request
    agent.role = decoded.role
    req.user = agent
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new MyCustomError(401, 'Invalid token'))
    }

    next(error) // Pass any other errors to the global error handler
  }
}

module.exports = agentAuth
