const { sequelize, models } = require("../config/sequelize");
const { generateTestPasswords } = require("../utils/hashPassword");

async function getTables(models) {
    const classes = await models.classes.findAll();
    console.log("Classes trouvées :", classes.length);
    classes.forEach(cls => {
        console.log(`Classe ID: ${cls.id}, Nom: ${cls.name}, Niveau: ${cls.level}`);
    });
    const users = await models.users.findAll();
    console.log("Utilisateurs trouvés :", users.length);
    users.forEach(user => {
        console.log(`Utilisateur ID: ${user.id}, Nom: ${user.firstName} ${user.lastName}, Email: ${user.email}`);
    });
    const courses = await models.courses.findAll();
    console.log("Cours trouvés :", courses.length);
    courses.forEach(course => {
        console.log(`Cours ID: ${course.id}, Nom: ${course.name}, Professeur ID: ${course.professorId}`);
    });
    const establishments = await models.establishments.findAll();
    console.log("Établissements trouvés :", establishments.length);
    establishments.forEach(establishment => {
        console.log(`Établissement ID: ${establishment.id}, Nom: ${establishment.name}`);
    });
    const qrCodes = await models.qr_codes.findAll();
    console.log("QR Codes trouvés :", qrCodes.length);
    qrCodes.forEach(qr => {
        console.log(`QR Code ID: ${qr.id}, Cours ID: ${qr.courseId}`);
    });
    const signatures = await models.signatures.findAll();
    console.log("Signatures trouvées :", signatures.length);
    signatures.forEach(signature => {
        console.log(`Signature ID: ${signature.id}, Cours ID: ${signature.courseId}, Étudiant ID: ${signature.studentId}`);
    });
    const alerts = await models.alerts.findAll();
    console.log("Alertes trouvées :", alerts.length);
    alerts.forEach(alert => {
        console.log(`Alerte ID: ${alert.id}, Créée par ID: ${alert.createdBy}, Message: ${alert.message}`);
    });
    console.log("Toutes les données ont été récupérées avec succès");

}

(async () => {
    try {
        // Test de la connexion à la base de données
        await sequelize.authenticate();
        console.log("Connexion à la base de données réussie");

        // Synchronisation des modèles avec la base de données
        // await sequelize.dropAllSchemas();
        await sequelize.sync({ force: true });
        console.log("Modèles synchronisés avec succès");

        // Génération des mots de passe de test
        const demoPass = await generateTestPasswords();

        const establishment = await models.establishments.create({ name: "Lycée Jean Moulin", address: "15 Avenue de la République", city: "Lyon", postalCode: "69003", phone: "04.72.34.56.78", email: "contact@lycee-jeanmoulin.fr", zipCode: "69003" });
        const classe = await models.classes.create({ name: "Terminale S1", level: "Terminale", establishmentId: establishment.id });
        await models.users.create({ firstName: "Admin", lastName: "Principal", email: "admin@letussign.com", password: demoPass, role: "ADMIN", status: "ACTIVE", establishmentId: establishment.id });
        await models.users.create({ firstName: "Jean", lastName: "Martin", email: "j.martin@lycee-jeanmoulin.fr", password: demoPass, role: "PROFESSOR", status: "ACTIVE", establishmentId: establishment.id });
        const user = await models.users.create({ firstName: "Lucas", lastName: "Roux", email: "lucas.roux@student.lycee-jm.fr", password: demoPass, role: "STUDENT", status: "ACTIVE", establishmentId: establishment.id, classId: classe.id });
        await models.users.create({ firstName: "Alice", lastName: "Dupont", email: "alice.dupont@example.com", password: demoPass, role: "student", establishmentId: establishment.id, classId: classe.id });
        const course = await models.courses.create({ name: "Mathématiques", subject: "Mathématiques", professorId: user.id, classId: classe.id, endTime: new Date(), startTime: new Date() });
        const qrCode = await models.qr_codes.create({ courseId: course.id, code: "QRCODE123", expiresAt: new Date(Date.now() + 3600000), isActive: true, scansCount: 0, maxScans: 100 });
        const signature = await models.signatures.create({ courseId: course.id, studentId: user.id, signedAt: new Date(), signatureData: "Signature de test" });
        await models.alerts.create({ createdBy: user.id, title: "Alerte", message: "Message d'alerte de test", type: "info", status: "active" });
        await getTables(models);

        console.log("Toutes les données de test ont été créées avec succès");

    } catch (error) {
        console.error("Impossible de se connecter à la base de données :", error.message);
    } finally {
        await sequelize.close();
    }
})();