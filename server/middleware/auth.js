const jwt = require("jsonwebtoken")
const { models } = require("../config/sequelize")
const User = models.users

/**
 * Middleware pour authentifier les requêtes avec un token JWT.
 * Vérifie si le token est présent, valide et que l'utilisateur existe toujours.
 * Si l'utilisateur n'existe pas ou n'est pas actif, renvoie une erreur 401.
 * Si le token est invalide ou expiré, renvoie une erreur 403 ou 401 respectivement.
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token d'accès requis",
      })
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Vérifier que l'utilisateur existe toujours
    const user = await User.findOne({
      where: {
        id: decoded.userId,
        status: "ACTIVE",
      },
      attributes: ["id", "email", "firstName", "lastName", "role", "status", "classId"],
      include: [
        {
          model: models.classes,
          as: "class",
          attributes: ["id", "name"],
        },
      ]
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non trouvé ou inactif",
      })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expiré",
      })
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({
        success: false,
        message: "Token invalide",
      })
    }

    console.error("Erreur d'authentification:", error)
    return res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
}

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentification requise",
      })
    }

    const userRoles = Array.isArray(roles) ? roles : [roles]
    if (!userRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Permissions insuffisantes",
      })
    }

    next()
  }
}

module.exports = {
  authenticateToken,
  requireRole,
}
