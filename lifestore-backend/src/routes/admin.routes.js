const express = require('express')
const router = express.Router()
const multer = require('multer')
const storage = multer.memoryStorage() // Use in-memory storage for handling files as buffers
const upload = multer({ storage })

const {
  validateAdminCreate,
} = require('../middlewares/validators/admin.validator')
const {
  createAdmin,
  adminLogin,
  getAdminList,
  getOneAdmin,
  updateAdmin,
  deleteManyAdmin,
  restoreManyAdmin,
  forgotPassword,
  sendOtp,
} = require('../controllers/admin.controller')
const adminAuth = require('../middlewares/auth/admin.auth')
const {
  updateAdminValidator,
} = require('../middlewares/validators/admin.update.validator')

// Create a new admin
router
  .route('/')
  .post(upload.any(), adminAuth, validateAdminCreate, createAdmin)
  .get(adminAuth, getAdminList)

router.route('/login').post(adminLogin)
router.route('/forgotPassword').put(forgotPassword)

router.route('/delete-many').post(adminAuth, deleteManyAdmin)
router.route('/restore-many').post(adminAuth, restoreManyAdmin)

router.route('/send-otp').post(sendOtp)

router
  .route('/:id')
  .get(adminAuth, getOneAdmin)
  .put(upload.any(), adminAuth, updateAdminValidator, updateAdmin)

module.exports = router
