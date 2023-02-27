const ContactController = require('../features/contact/contact_controller')

const registerContactRoutes = (app) => {
    app.post('/contact-create', ContactController.createContact)
}

module.exports = { registerContactRoutes }