const express = require('express')
require('dotenv').config()
const app = express();
const pool = require('./Database/db')
const userRoutes = require('./routes/users')


const PORT = process.env.PORT

app.use(express.json())
app.use('/api',userRoutes)

app.get('/', async(req, res)=>{
    try {
        const result = await pool.query(' SELECT NOW()')
        res.json({connected: true, database: 'user_auth_db_connected', time: result.rows[0].now});
    }
    catch(error){
        res.status(500).json({connected:'false'})
    }
})

app.listen(PORT, ()=>{
    console.log("Server started at port 5000")
})