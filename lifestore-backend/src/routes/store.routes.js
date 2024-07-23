const express = require('express')
const adminAuth = require('../middlewares/auth/admin.auth')
const adminOrStoreAuth = require('../middlewares/auth/adminOrStore.auth')

const {
  createStore,
  getStoreList,
  getOneStore,

  updateStore,
  deleteManyStore,
  restoreManyStore,
  deleteDocument,
  storeLogin,
  forgotPassword,
} = require('../controllers/store.controller')
const router = express.Router()

const multer = require('multer')
const validateStoreCreate = require('../middlewares/validators/store.validator')
const validateStoreUpdate = require('../middlewares/validators/store.update.validator')

const storage = multer.memoryStorage() // Use in-memory storage for handling files as buffers
const upload = multer({ storage })

router
  .route('/')
  .post(upload.any(), validateStoreCreate, adminAuth, createStore)
  .get(adminAuth, getStoreList)

  router.route('/login').post(storeLogin)
  router.route('/forgotPassword').put(forgotPassword)

router.route('/delete-many').post(adminAuth, deleteManyStore)
router.route('/restore-many').post(adminAuth, restoreManyStore)

router
  .route('/:id')
  .get(adminOrStoreAuth, getOneStore)
  .put(upload.any(), validateStoreUpdate, adminOrStoreAuth, updateStore)

router.route('/document/:key').delete(adminAuth, deleteDocument)

module.exports = router
