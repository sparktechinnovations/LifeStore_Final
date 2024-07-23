const { body, validationResult } = require('express-validator')
const { MyCustomError } = require('../error/error.handler')

// Define an array of validation middleware for updating admin
const updateAdminValidator = [
  // Validation rules using Express Validator's 'body' method
  body('name').optional().notEmpty().withMessage('Name is required'),
  body('phoneNumber')
    .optional()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('address').optional().notEmpty().withMessage('Address is required'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Invalid gender'),
  body('dob')
    .optional()
    .isISO8601({ strict: true })
    .toDate()
    .custom((value, { req }) => {
      const today = new Date()
      const age = today.getFullYear() - value.getFullYear()
      if (age < 18 || value > today) {
        throw new Error(
          'Admin must be at least 18 years old and DOB cannot be in the future.'
        )
      }
      return true
    }),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/)
    .withMessage(
      'Password must contain at least one uppercase letter and one special character'
    ),

  // Custom middleware to check for validation errors
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new MyCustomError(
        400,
        errors?.errors?.reduce(
          (accumulator, currentValue) =>
            accumulator + (accumulator && ', ') + currentValue.msg,
          ''
        )
      )
    }
    next()
  },
]

module.exports = {
  updateAdminValidator,
}
