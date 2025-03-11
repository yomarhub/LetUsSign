const { sequelize, models } = require("./sequelize")

// Pour tester la connexion Sequelize :
async function testConnection() {
  try {
    await sequelize.authenticate()
    console.log("✅ Connexion à la base de données réussie")
    return true
  } catch (error) {
    console.error("❌ Erreur de connexion à la base de données:", error.message)
    return false
  }
}

module.exports = {
  sequelize,
  models,
  testConnection,
}
