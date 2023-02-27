let active = true

const setActive = (env) => {
    if (env.AUTH === '0') {
        console.log('Basic authorization disabled.')
        active = false
    } else {
        console.log('Basic authorization enabled.')
        active = true
    }
}

const isAuth = (req, res, next) => {
    if (active) {
        const auth = req.headers.authorization
        if (auth === 'rocket') {
            next()
        } else {
            res.status(401)
            res.send('Access forbidden')
        }
    } else {
        next()
    }
}

module.exports = { isAuth, setActive }