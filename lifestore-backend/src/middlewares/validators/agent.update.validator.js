const { body, validationResult } = require('express-validator')
const { MyCustomError } = require('../error/error.handler')

const validateAgentUpdate = [
  // Validation rules using Express Validator's 'body' method
  body('name').optional().trim().isString(),
  body('phoneNumber')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Invalid phone number'),
  body('address').optional().trim().isString(),
  body('email').optional().trim().isEmail().withMessage('Invalid email'),
  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Invalid gender'),
  body('dob')
    .optional()
    .isISO8601({ strict: true })
    .toDate()
    .custom((value, { req }) => {
      // Calculate the minimum date (18 years ago from today)
      const minDate = new Date()
      minDate.setFullYear(minDate.getFullYear() - 18)

      // Check if DOB is before the minimum date
      if (value > minDate) {
        throw new Error('Agent must be at least 18 years old')
      }

      return true
    }),
  body('pan')
    .optional()
    .custom((value, { req }) => {
      var regex = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/
      if (!regex.test(value)) {
        throw new Error('Invalid Pan Number')
      }
      return true
    }),

  body('aadhar')
    .optional()
    .custom((value, { req }) => {
      var regex = /[0-9]{12}$/
      if (!regex.test(value)) {
        throw new Error('Invalid Aadhar Number')
      }
      return true
    }),
  body('accNo').optional().notEmpty().withMessage('Account number is required'),
  body('cat').optional().isIn(['LIC', 'Other']).withMessage('Invalid category'),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/)
    .withMessage(
      'Password must contain at least one uppercase letter and one special character'
    ),
  body('anniversary')
    .optional()
    .isISO8601({ strict: true })
    .toDate()
    .withMessage('Invalid anniversary date format'),
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
  validateAgentUpdate,
}
