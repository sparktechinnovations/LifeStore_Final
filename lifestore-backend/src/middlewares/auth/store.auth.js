const jwt = require('jsonwebtoken')
const { MyCustomError } = require('../error/error.handler') // Import your custom error handler
const Store = require('../../models/store.model') // Import your Store model

// Middleware function to verify JWT tokens and check against store data
async function storeAuth(req, res, next) {
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
    const store = await Store.findById(decoded.id)

    // console.log(store, decoded)

    if (!store) {
      return next(new MyCustomError(401, 'Store not found'))
    }

    if (!store.deleteStatus === 'true') {
      return next(
        new MyCustomError(
          403,
          'Store Deleted Please Contact Support to Restore Account'
        )
      )
    }

    // Token is valid, attach the decoded user information to the request
    store.role = decoded.role
    req.user = store
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new MyCustomError(401, 'Invalid token'))
    }

    next(error) // Pass any other errors to the global error handler
  }
}

module.exports = storeAuth
