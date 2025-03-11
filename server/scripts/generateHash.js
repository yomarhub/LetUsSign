const bcrypt = require("bcryptjs")

async function generatePasswordHash() {
  const password = "demo123"
  const saltRounds = 12

  try {
    const hash = await bcrypt.hash(password, saltRounds)
    console.log(`Mot de passe: ${password}`)
    console.log(`Hash bcrypt: ${hash}`)

    // Vérifier que le hash fonctionne
    const isValid = await bcrypt.compare(password, hash)
    console.log(`Vérification: ${isValid ? "OK" : "ERREUR"}`)

    return hash
  } catch (error) {
    console.error("Erreur lors du hashage:", error)
  }
}

// Exécuter le script
generatePasswordHash()
