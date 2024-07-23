const express = require('express')
const router = express.Router()

const adminAuth = require('../middlewares/auth/admin.auth')
const { getHomeData, getAgentHomeData, getStoreHomeData } = require('../controllers/home.controller')
const agentAuth = require('../middlewares/auth/agent.auth')
const storeAuth = require('../middlewares/auth/store.auth')

router
  .route('/')
  .get(adminAuth, getHomeData)

  router.route('/agent').get(agentAuth, getAgentHomeData)
  router.route('/store').get(storeAuth, getStoreHomeData)

module.exports = router
