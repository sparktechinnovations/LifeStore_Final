const { body, validationResult } = require('express-validator')
const { MyCustomError } = require('../error/error.handler')

const validateStoreUpdate = [
  body('storeName').optional().trim().isString(),
  body('gstNumber').optional().trim().isString(),
  body('address').optional().trim().isString(),
  body('phoneNumber').optional().trim().isString(),
  body('email').optional().trim().isEmail().withMessage('Invalid email'),
  body('ownerName').optional().trim().isString(),
  body('deleteStatus').optional().isIn(['true', 'false']),
  body('credit').optional().isNumeric(),
  body('agentPercentage').optional().isNumeric(),
  body('lifeStorePercentage').optional().isNumeric(),
  body('password').optional()
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

module.exports = validateStoreUpdate
