const app = require("./app")
const { testConnection, sequelize } = require("./config/database")

const PORT = process.env.PORT || 3001

// Démarrage du serveur
async function startServer() {
    try {
        // Test de connexion à la base de données
        const dbConnected = await testConnection()
        if (!dbConnected) {
            console.error("❌ Impossible de se connecter à la base de données")
            process.exit(1)
        }

        app.listen(PORT, () => {
            console.log(`🚀 Serveur LetUsSign démarré sur le port ${PORT}`)
            console.log(`📊 API disponible sur http://localhost:${PORT}/api`)
            console.log(`🏥 Health check: http://localhost:${PORT}/api/health`)
        })
    } catch (error) {
        console.error("❌ Erreur lors du démarrage du serveur:", error)
        process.exit(1)
    } finally {
        // Fermer la connexion à la base de données lors de l'arrêt du serveur
        process.on('SIGINT', async () => {
            console.log("\n🔌 Fermeture du serveur...")
            await sequelize.close()
            console.log("✅ Serveur fermé")
            process.exit(0)
        })
    }
}

startServer()