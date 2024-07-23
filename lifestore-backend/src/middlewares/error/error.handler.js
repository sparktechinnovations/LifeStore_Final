const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
function errorHandler(err, req, res, next) {
  console.error(err)

  if (err instanceof MyCustomError) {
    return res.status(err.statusCode).json({ message: err.message })
  }
  if (err instanceof mongoose.Error.ValidationError) {
    const errorMessages = []

    for (const field in err.errors) {
      errorMessages.push(err.errors[field].message)
    }

    const errorResponse = {
      message: errorMessages.join(', '),
    }

    return res.status(400).json(errorResponse)
  }

  if (err instanceof jwt.TokenExpiredError) {
    // Token has expired
    return res
      .status(403)
      .json({ message: 'Token has expired , please login again' })
  }

  res.status(500).json({ message: 'Internal server error' })
}

class MyCustomError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
  }
}

module.exports = { errorHandler, MyCustomError }
