const { body, validationResult } = require('express-validator')
const { MyCustomError } = require('../error/error.handler')

const validateAdminCreate = [
  // Validation rules using Express Validator's 'body' method
  body('name').notEmpty().withMessage('Name is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('email').optional().trim().isEmail().withMessage('Invalid email'),
  body('gender')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Invalid gender'),
  body('dob')
    .isISO8601({ strict: true })
    .toDate()
    .custom((value, { req }) => {
      // Calculate the minimum date (18 years ago from today)
      const minDate = new Date()
      minDate.setFullYear(minDate.getFullYear() - 18)

      // Check if DOB is before the minimum date
      if (value > minDate) {
        throw new Error('Admin must be at least 18 years old')
      }

      return true
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/)
    .withMessage(
      'Password must contain at least one uppercase letter and one special character'
    ),

  // Custom middleware to check for validation errors
  (req, res, next) => {
    const errors = validationResult(req)
    console.log(errors)

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
  validateAdminCreate,
}
