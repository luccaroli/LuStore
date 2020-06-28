const { Pool } = require("pg")

module.exports = new Pool({
  user: "postgres",
  password: "261014",
  host: "localhost",
  port: 5432,
  database: "lustoredb"
})