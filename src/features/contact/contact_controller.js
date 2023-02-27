const Contact = require('../../shared/db/mongodb/schemas/contact_schema')
const asyncWrapper = require('../../shared/util/base-utils')

const createContact = asyncWrapper(async (req, res) => {
    const contact = await Contact.create(req.body)
    res.status(201).json({ msg: 'Contact created', data: contact })
})

module.exports = { createContact }