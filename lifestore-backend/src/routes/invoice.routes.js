const express = require('express')
const router = express.Router()

const adminOrStoreAuth = require('../middlewares/auth/adminOrStore.auth')


const storeAuth = require('../middlewares/auth/store.auth')
const adminAuth = require('../middlewares/auth/admin.auth')
const { createInvoice, getAllInvoice, getOneCustomer, deleteInvoice } = require('../controllers/invoice.controller')
const authenticateAdminOrStoreOrAgent = require('../middlewares/auth/adminOrStoreOrAgent.auth')

router.route('/').post(storeAuth, createInvoice).get(authenticateAdminOrStoreOrAgent , getAllInvoice)
router.route('/customer/:id').get(storeAuth, getOneCustomer)
router.route('/:id').delete(adminAuth, deleteInvoice)

module.exports = router
