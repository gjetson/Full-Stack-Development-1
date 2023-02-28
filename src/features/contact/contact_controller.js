const Contact = require('../../shared/db/mongodb/schemas/contact_schema')
const asyncWrapper = require('../../shared/util/base-utils')

const createContact = async (req, res) => {
    try {
        // console.log(req.body)
        const contact = await Contact.create(req.body)
        res.status(201).json({ msg: 'Contact created', data: contact })
    } catch (err) {
        console.error(err)
        res.status(500).json({ err: `${err.message}` })
    }
}

module.exports = { createContact }