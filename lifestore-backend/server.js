const serverless = require('serverless-http')
const express = require('express')
const app = express()
const cors = require('cors')

app.use(
  cors()
  //  {
  //   origin: 'https://your-react-app-domain.com',
  //   methods: 'GET,POST',
  //   // Add more options if needed
  // }
)

const adminRoutes = require('./src/routes/admin.routes')
const agentRoutes = require('./src/routes/agent.routes')
const storeRoutes = require('./src/routes/store.routes')
const customerRoutes = require('./src/routes/customer.routes')
const productRoutes = require('./src/routes/product.routes')
const commissionRoutes = require('./src/routes/commission.routes')
const homeRoutes = require('./src/routes/home.routes')
const invoiceRoutes = require('./src/routes/invoice.routes')

require('dotenv').config()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const connectDB = require('./src/config/db')
const { errorHandler } = require('./src/middlewares/error/error.handler')
connectDB()

// Middleware

// Routes

app.use('/api/admin', adminRoutes)

app.use('/api/agent', agentRoutes)
app.use('/api/store', storeRoutes)
app.use('/api/customer', customerRoutes)
app.use('/api/product', productRoutes)
app.use('/api/commission', commissionRoutes)
app.use('/api/home', homeRoutes)
app.use('/api/invoice', invoiceRoutes)

// Error Handler
app.use(errorHandler)
// Start the server

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running on port ${process.env.PORT || 8000}`)
})

module.exports.handler = serverless(app)
