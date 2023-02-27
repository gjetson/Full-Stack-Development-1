const isPhoneNumber = (str) => {
    const regex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/
    return regex.test(str)
}

module.exports = { isPhoneNumber }