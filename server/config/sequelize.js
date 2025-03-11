const { Sequelize } = require("sequelize")
const initModels = require("../models/init-models")
const dotenv = require("dotenv")
dotenv.config()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    logging: false, // Désactiver les logs SQL
    dialect: "mysql",
})

const models = initModels(sequelize)
module.exports = { sequelize, models }
