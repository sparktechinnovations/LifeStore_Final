const express = require('express')
const router = express.Router()
const multer = require('multer')
const storage = multer.memoryStorage() // Use in-memory storage for handling files as buffers
const upload = multer({ storage })

const {
  validateAgentCreate,
} = require('../middlewares/validators/agent.validator')
const {
  createAgent,
  agentLogin,
  getAgentList,
  getOneAgent,
  updateAgent,
  deleteManyAgent,
  restoreManyAgent,
  forgotPassword,
} = require('../controllers/agent.controller')
const agentAuth = require('../middlewares/auth/agent.auth')
const adminAuth = require('../middlewares/auth/admin.auth')
const authenticateAdminOrAgent = require('../middlewares/auth/adminOrAgent.auth')
const {
  validateAgentUpdate,
} = require('../middlewares/validators/agent.update.validator')

// Create a new agent
router
  .route('/')
  .post(upload.any(), adminAuth, validateAgentCreate, createAgent)
  .get(adminAuth, getAgentList)

router.route('/login').post(agentLogin)
router.route('/forgotPassword').put(forgotPassword)

router.route('/delete-many').post(adminAuth, deleteManyAgent)
router.route('/restore-many').post(adminAuth, restoreManyAgent)

router
  .route('/:id')
  .get(authenticateAdminOrAgent, getOneAgent)
  .put(upload.any(), authenticateAdminOrAgent, validateAgentUpdate, updateAgent)

module.exports = router
