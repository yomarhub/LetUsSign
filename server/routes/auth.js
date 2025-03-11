const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { validateLogin } = require("../middleware/validation")
const { authenticateToken } = require("../middleware/auth")
const { models } = require("../config/sequelize")

const dotenv = require("dotenv")
dotenv.config()

const router = express.Router()

// Route de connexion
router.post("/login", validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body

    // Recherche de l'utilisateur avec ses relations
    const user = await models.users.findOne({
      where: { email },
      include: [
        { model: models.establishments, as: "establishment" },
        { model: models.classes, as: "class" },
      ],
    })

    if (!user || user.status !== "ACTIVE") {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      })
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      })
    }

    // Générer le token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" },
    )

    // Préparer les données utilisateur (sans le mot de passe)
    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      establishment: user.establishment
        ? {
          id: user.establishment.id,
          name: user.establishment.name,
        }
        : null,
      class: user.class
        ? {
          id: user.class.id,
          name: user.class.name,
        }
        : null,
    }

    res.json({
      success: true,
      message: "Connexion réussie",
      data: {
        user: userData,
        token,
      },
    })
  } catch (error) {
    console.error("Erreur login:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion",
    })
  }
})

// Route pour récupérer le profil
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await models.users.findByPk(req.user.id, {
      include: [
        { model: models.establishments, as: "establishment" },
        { model: models.classes, as: "class" },
      ],
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      })
    }

    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      establishment: user.establishment
        ? {
          id: user.establishment.id,
          name: user.establishment.name,
        }
        : null,
      class: user.class
        ? {
          id: user.class.id,
          name: user.class.name,
        }
        : null,
    }

    res.json({
      success: true,
      data: userData,
    })
  } catch (error) {
    console.error("Erreur profil:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du profil",
    })
  }
})

// Route de déconnexion
router.post("/logout", authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: "Déconnexion réussie",
  })
})

module.exports = router
