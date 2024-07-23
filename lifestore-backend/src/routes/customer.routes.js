const express = require('express')
const multer = require('multer')
const router = express.Router()

const authenticateAdminOrAgent = require('../middlewares/auth/adminOrAgent.auth')

const storage = multer.memoryStorage() // Use in-memory storage for handling files as buffers
const upload = multer({ storage })
const {
  createCustomer,
  customerLogin,
  getCustomerList,
  getOneCustomer,
  updateCustomer,
  deleteManyCustomer,
  restoreManyCustomer,
  sendOtp,
} = require('../controllers/customer.controller')
const {
  validateCustomerCreate,
} = require('../middlewares/validators/customer.validator')
const adminAuth = require('../middlewares/auth/admin.auth')

// Create a new agent
router
  .route('/')
  .post(
    upload.any(),
    authenticateAdminOrAgent,
    validateCustomerCreate,
    createCustomer
  )
  .get(authenticateAdminOrAgent, getCustomerList)

router.route('/login').post(customerLogin)
router.route('/delete-many').post(adminAuth, deleteManyCustomer)
router.route('/restore-many').post(adminAuth, restoreManyCustomer)
router.route('/send-otp').post(sendOtp)
router
  .route('/:id')
  .get(authenticateAdminOrAgent, getOneCustomer)
  .put(upload.any(), authenticateAdminOrAgent, updateCustomer)

module.exports = router
