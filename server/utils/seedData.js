const bcrypt = require("bcryptjs")
const { Establishment, Class, User, Course, Signature, Alert } = require("../models/init-models")(require("../config/database"))

async function seedDatabase() {
  try {
    console.log("🌱 Début du seeding de la base de données...")

    // Créer les établissements
    const establishments = await Promise.all([
      Establishment.create({
        name: "Lycée Jean Moulin",
        address: "123 Rue de la République",
        city: "Lyon",
        zipCode: "69003",
        phone: "04 72 00 00 00",
        email: "contact@lycee-jeanmoulin.fr",
      }),
      Establishment.create({
        name: "Collège Victor Hugo",
        address: "456 Avenue des Sciences",
        city: "Lyon",
        zipCode: "69006",
        phone: "04 72 11 11 11",
        email: "contact@college-victorhugo.fr",
      }),
    ])

    console.log("✅ Établissements créés")

    // Créer les classes
    const classes = await Promise.all([
      Class.create({
        name: "Terminale S1",
        level: "Terminale",
        establishmentId: establishments[0].id,
      }),
      Class.create({
        name: "Première S2",
        level: "Première",
        establishmentId: establishments[0].id,
      }),
      Class.create({
        name: "3ème A",
        level: "3ème",
        establishmentId: establishments[1].id,
      }),
    ])

    console.log("✅ Classes créées")

    // Hasher les mots de passe
    const hashedPassword = await bcrypt.hash("demo123", 12)

    // Créer les utilisateurs
    const admin = await User.create({
      firstName: "Admin",
      lastName: "System",
      email: "admin@letussign.fr",
      password: hashedPassword,
      role: "ADMIN",
      establishmentId: establishments[0].id,
    })

    const professor = await User.create({
      firstName: "Pierre",
      lastName: "Bernard",
      email: "prof@letussign.fr",
      password: hashedPassword,
      role: "PROFESSOR",
      establishmentId: establishments[0].id,
    })

    const student = await User.create({
      firstName: "Lucas",
      lastName: "Martin",
      email: "eleve@letussign.fr",
      password: hashedPassword,
      role: "STUDENT",
      establishmentId: establishments[0].id,
      classId: classes[0].id,
    })

    // Créer d'autres étudiants
    const students = await Promise.all([
      User.create({
        firstName: "Marie",
        lastName: "Dubois",
        email: "marie.dubois@letussign.fr",
        password: hashedPassword,
        role: "STUDENT",
        establishmentId: establishments[0].id,
        classId: classes[0].id,
      }),
      User.create({
        firstName: "Thomas",
        lastName: "Leroy",
        email: "thomas.leroy@letussign.fr",
        password: hashedPassword,
        role: "STUDENT",
        establishmentId: establishments[0].id,
        classId: classes[0].id,
      }),
    ])

    console.log("✅ Utilisateurs créés")

    // Créer des cours
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const courses = await Promise.all([
      Course.create({
        name: "Introduction aux mathématiques",
        subject: "Mathématiques",
        professorId: professor.id,
        classId: classes[0].id,
        date: today,
        startTime: "09:00",
        endTime: "11:00",
        status: "COMPLETED",
      }),
      Course.create({
        name: "Mécanique quantique",
        subject: "Physique",
        professorId: professor.id,
        classId: classes[0].id,
        date: tomorrow,
        startTime: "14:00",
        endTime: "16:00",
        status: "SCHEDULED",
      }),
    ])

    console.log("✅ Cours créés")

    // Créer des signatures
    await Promise.all([
      Signature.create({
        studentId: student.id,
        courseId: courses[0].id,
        signatureData:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        status: "PRESENT",
      }),
      Signature.create({
        studentId: students[0].id,
        courseId: courses[0].id,
        signatureData:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        status: "LATE",
      }),
    ])

    console.log("✅ Signatures créées")

    // Créer des alertes
    await Promise.all([
      Alert.create({
        type: "ABSENCE",
        title: "Absences multiples détectées",
        message: "3 élèves absents en cours de Mathématiques",
        severity: "MEDIUM",
        courseId: courses[0].id,
        createdBy: admin.id,
      }),
      Alert.create({
        type: "SYSTEM",
        title: "Maintenance programmée",
        message: "Maintenance du système prévue ce weekend",
        severity: "LOW",
        createdBy: admin.id,
      }),
    ])

    console.log("✅ Alertes créées")

    console.log("🎉 Seeding terminé avec succès !")
    console.log("\n📧 Comptes de test créés :")
    console.log("Admin: admin@letussign.fr / demo123")
    console.log("Professeur: prof@letussign.fr / demo123")
    console.log("Élève: eleve@letussign.fr / demo123")
  } catch (error) {
    console.error("❌ Erreur lors du seeding:", error)
    throw error
  }
}

// Exécuter le seeding si ce fichier est appelé directement
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("✅ Seeding terminé")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Erreur seeding:", error)
      process.exit(1)
    })
}

module.exports = { seedDatabase }
