const { body, validationResult } = require('express-validator')
const { MyCustomError } = require('../error/error.handler')

const validateStoreCreate = [
  body('storeName').trim().notEmpty().withMessage('Store name is required'),
  body('gstNumber').trim().notEmpty().withMessage('GST number is required'),
  body('address').trim(),
  body('phoneNumber').trim().notEmpty().withMessage('Phone number is required'),
  body('email').optional().trim().isEmail().withMessage('Invalid email'),
  body('ownerName').trim().notEmpty().withMessage('Owner name is required'),
  body('agentPercentage')
    .trim()
    .notEmpty()
    .withMessage('agent Percentage is required'),
  body('lifeStorePercentage')
    .trim()
    .notEmpty()
    .withMessage('lifeStore Percentage is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/)
    .withMessage(
      'Password must contain at least one uppercase letter and one special character'
    ),

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new MyCustomError(
        400,
        errors.errors.map((error) => error.msg).join(', ')
      )
    }
    next()
  },
]

module.exports = validateStoreCreate
