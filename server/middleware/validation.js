const { body, validationResult } = require("express-validator")

// Middleware pour gérer les erreurs de validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Données invalides",
      errors: errors.array(),
    })
  }
  next()
}

// Validation pour la connexion
const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Email invalide"),
  body("password").isLength({ min: 6 }).withMessage("Le mot de passe doit contenir au moins 6 caractères"),
  handleValidationErrors,
]

// Validation pour la création d'utilisateur
const validateUser = [
  body("firstName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Le prénom doit contenir entre 2 et 50 caractères"),
  body("lastName").trim().isLength({ min: 2, max: 50 }).withMessage("Le nom doit contenir entre 2 et 50 caractères"),
  body("email").isEmail().normalizeEmail().withMessage("Email invalide"),
  body("password").isLength({ min: 8 }).withMessage("Le mot de passe doit contenir au moins 8 caractères"),
  body("role").isIn(["ADMIN", "PROFESSOR", "STUDENT"]).withMessage("Rôle invalide"),
  handleValidationErrors,
]

// Validation pour la création de cours
const validateCourse = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Le nom du cours doit contenir entre 3 et 100 caractères"),
  body("subject").trim().isLength({ min: 2, max: 50 }).withMessage("La matière doit contenir entre 2 et 50 caractères"),
  body("professorId").isUUID().withMessage("ID professeur invalide"),
  body("classId").isUUID().withMessage("ID classe invalide"),
  body("date").isISO8601().withMessage("Date invalide"),
  body("startTime")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Heure de début invalide"),
  body("endTime")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Heure de fin invalide"),
  handleValidationErrors,
]

module.exports = {
  validateLogin,
  validateUser,
  validateCourse,
  handleValidationErrors,
}
