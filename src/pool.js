const { Pool } = require('pg')
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'skatepark',
    password: 'alejandra',
    port: 5432
})

pool.connect()

const getConnection = () => {
    return pool
}

module.exports = {
    getConnection
}