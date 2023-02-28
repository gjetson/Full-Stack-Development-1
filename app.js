
const Express = require('express')
const bodyParser = require('body-parser')

require('dotenv').config()
//console.log(process.env)

const app = Express()
const port = process.env.PORT || 3004

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


const MongoManager = require('./src/shared/db/mongodb/mongo-manager')
const MiddleWare = require('./src/shared/middleware/base-middleware')
const HealthRoutes = require('./src/routes/health.routes')
const AdminRoutes = require('./src/routes/admin.routes')
const PublicRoutes = require('./src/routes/public.routes')
const AgentRoutes = require('./src/routes/agent.routes')
const RegionRoutes = require('./src/routes/region.routes')
const ContactRoutes = require('./src/routes/contact_routes')

app.use(Express.static('./src/public')) //serves our static genesis project
app.use(Express.json())

// configurable authorization
const { setActive } = require('./src/utils/auth')
setActive(process.env)

// configurable logger
const { initLogger } = require('./src/utils/logger')
initLogger(app, process.env)

// MiddleWare.registerBaseMiddleWare(app)
HealthRoutes.registerHealthRoutes(app)
AdminRoutes.registerAdminRoutes(app)
PublicRoutes.registerPublicRoutes(app)
AgentRoutes.registerAgentRoutes(app)
RegionRoutes.registerRegionRoutes(app)
ContactRoutes.registerContactRoutes(app)

MongoManager.openMongoConnection(process.env.MONGO_URI)
app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})
