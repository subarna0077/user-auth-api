const express = require('express')
const router = express.Router()
const {register, login} = require('../controllers/auth')

router.route('/create').post(register)
router.route('/login').post(login)

module.exports = router