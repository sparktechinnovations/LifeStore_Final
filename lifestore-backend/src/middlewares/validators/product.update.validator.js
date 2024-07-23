const { body, validationResult } = require('express-validator')
const { MyCustomError } = require('../error/error.handler')

const validateProductUpdate = [
  // Validation rules using Express Validator's 'body' method
  body('productName')
    .optional()
    .notEmpty()
    .withMessage('Product name is required'),

  // productId must not be empty and must be unique
  body('productId')
    .optional()
    .optional()
    .notEmpty()
    .withMessage('Product ID is required')
    .isString()
    .withMessage('Product ID must be a string'),

  // productGST must be a number
  body('productGST')
    .optional()
    .notEmpty()
    .withMessage('Product GST is required')
    .isNumeric()
    .withMessage('Product GST must be a number'),

  // inclusiveOfGST must be a boolean
  body('inclusiveOfGST')
    .optional()
    .notEmpty()
    .withMessage('inclusive Of GST is required')
    .isBoolean()
    .withMessage('Inclusive of GST must be a boolean'),

  // productPrice must be a number
  body('productPrice')
    .optional()
    .notEmpty()
    .withMessage('Product price is required')
    .isNumeric()
    .withMessage('Product price must be a number'),

  // store must be a valid ObjectId
  body('store')
    .optional()
    .notEmpty()
    .withMessage('store is required')
    .isMongoId()
    .withMessage('Invalid store ID'),

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
  validateProductUpdate,
}
