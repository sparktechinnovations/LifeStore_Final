const { body, validationResult } = require('express-validator')
const { MyCustomError } = require('../error/error.handler')

const validateCustomerCreate = [
  // Validation rules using Express Validator's 'body' method
  body('name').notEmpty().withMessage('Name is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('phoneNumber').isMobilePhone().withMessage('Invalid phone number'),
  body('address').optional(),
  body('email').optional().isEmail().withMessage('Invalid email address'),
  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Invalid gender'),
  body('dob')
    .optional()
    .isDate()
    .withMessage('Invalid date of birth')
    .custom((value) => {
      const today = new Date()
      const dob = new Date(value)
      const age = today.getFullYear() - dob.getFullYear()
      if (age < 18) {
        throw new Error('Customer must be at least 18 years old')
      }
      if (dob > today) {
        throw new Error('Date of birth cannot be in the future')
      }
      return true
    }),
  body('pan').optional(),
  body('aadhar').optional(),
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
  validateCustomerCreate,
}
