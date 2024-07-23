const express = require('express')
const router = express.Router()

const {
  createCommission,
  getAllStoreCommission,
  getAllAgentCommission,
  getAgentCommissionAmount,
  payStoreCommission,
  getOneStoreCommission,
  getOneAgentCommission,
  payAgentCommission,
  getAgentPayment,
  getStorePayment,

  // payAgentCommission,
} = require('../controllers/commission.controller')

const adminAuth = require('../middlewares/auth/admin.auth')

const authenticateAdminOrAgent = require('../middlewares/auth/adminOrAgent.auth')

const adminOrStoreAuth = require('../middlewares/auth/adminOrStore.auth')
const storeAuth = require('../middlewares/auth/store.auth')
// Create a new agent
router.route('/').post(storeAuth, createCommission)
router.route('/store-commissions').get(adminAuth, getAllStoreCommission)
router
  .route('/store-commissions/:id')
  .get(adminOrStoreAuth, getOneStoreCommission)
  .post(adminAuth, payStoreCommission)
router.route('/agent-commissions').get(adminAuth, getAllAgentCommission)
router
  .route('/agent-commissions/:id')
  .get(authenticateAdminOrAgent, getOneAgentCommission)
  .post(adminAuth, payAgentCommission)
router
  .route('/agent-commissions/:id/amount')
  .get(adminAuth, getAgentCommissionAmount)

router.route('/payment/agent').get(authenticateAdminOrAgent, getAgentPayment) //hi
router.route('/payment/store').get(adminOrStoreAuth, getStorePayment)

module.exports = router
