const express = require('express')
const router = express.Router()
const storeAuth = require('../middlewares/auth/store.auth')
const adminOrStoreAuth = require('../middlewares/auth/adminOrStore.auth')
const multer = require('multer')
const {
  validateProductCreate,
} = require('../middlewares/validators/product.validator')
const {
  createProduct,
  getProductList,
  getOneProduct,
  updateProduct,
  deleteManyProduct,
  restoreManyProduct,
  addManyProduct,
} = require('../controllers/product.controller')
const { validateProductUpdate } = require('../middlewares/validators/product.update.validator')

const storage = multer.memoryStorage() // Use in-memory storage for handling files as buffers
const upload = multer({ storage })

router
  .route('/')
  .post(upload.any(), adminOrStoreAuth, validateProductCreate, createProduct)
  .get(adminOrStoreAuth, getProductList)
  router.route('/add-many').post(storeAuth, addManyProduct)
  router.route('/delete-many').post(adminOrStoreAuth, deleteManyProduct)
  router.route('/restore-many').post(adminOrStoreAuth, restoreManyProduct)

router
  .route('/:id')
  .get(adminOrStoreAuth, getOneProduct)
  .put(upload.any(), adminOrStoreAuth,validateProductUpdate, updateProduct)

module.exports = router
