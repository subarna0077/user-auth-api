require('dotenv').config()
const {Pool} = require('pg')

const pool = new Pool({
    user: 'postgres',
    password: 'Hello@$12_',
    host: 'localhost',
    port: 5432,
    database: 'user_auth_database'
})

module.exports = pool;