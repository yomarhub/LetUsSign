const bcrypt = require("bcryptjs")

// Fonction pour hacher un mot de passe
async function hashPassword(password) {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

// Fonction pour vérifier un mot de passe
async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword)
}

// Fonction pour générer des mots de passe hachés pour les données de test
async function generateTestPasswords() {
  const password = "demo123"
  const hashedPassword = await hashPassword(password)
  console.log(`Mot de passe: ${password}`)
  console.log(`Hash: ${hashedPassword}`)
  return hashedPassword
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateTestPasswords,
}
