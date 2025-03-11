const express = require("express")
const { models } = require("../config/sequelize")
const { authenticateToken, requireRole } = require("../middleware/auth")
const { Op } = require("sequelize")

const router = express.Router()

// Middleware d'authentification pour toutes les routes
router.use(authenticateToken)

// Récupérer les alertes
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 20, type, severity, isRead } = req.query

    const offset = (Number.parseInt(page) - 1) * Number.parseInt(limit)
    const _limit = Number.parseInt(limit)

    // Construire les filtres
    const where = {}

    if (type) where.type = type
    if (severity) where.severity = severity
    if (isRead !== undefined) where.isRead = isRead === "true"

    // Filtrer selon le rôle
    if (req.user.role === "PROFESSOR") {
      where[Op.or] = [
        { userId: req.user.id },
        { courseId: { [Op.in]: await getCourseIdsByProfessor(req.user.id) } },
        { type: "SYSTEM" },
      ]
    } else if (req.user.role === "STUDENT") {
      where[Op.or] = [{ userId: req.user.id }, { type: "SYSTEM" }]
    }

    const { rows: alerts, count: total } = await models.alerts.findAndCountAll({
      where,
      offset,
      limit: _limit,
      include: [
        {
          model: models.users,
          as: "createdBy_user",
          attributes: ["firstName", "lastName"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    res.json({
      success: true,
      data: alerts,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        totalPages: Math.ceil(total / Number.parseInt(limit)),
      },
    })
  } catch (error) {
    console.error("Erreur récupération alertes:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Marquer une alerte comme lue
router.patch("/:id/read", async (req, res) => {
  try {
    const { id } = req.params

    const alert = await models.alerts.findByPk(id)

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alerte non trouvée",
      })
    }

    // Vérifier les permissions
    if (req.user.role !== "ADMIN" && alert.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès non autorisé",
      })
    }

    await alert.update({ isRead: true })

    res.json({
      success: true,
      message: "Alerte marquée comme lue",
    })
  } catch (error) {
    console.error("Erreur marquage alerte:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Marquer toutes les alertes comme lues
router.patch("/read-all", async (req, res) => {
  try {
    const where = {}

    // Filtrer selon le rôle
    if (req.user.role === "PROFESSOR") {
      where[Op.or] = [
        { userId: req.user.id },
        { courseId: { [Op.in]: await getCourseIdsByProfessor(req.user.id) } },
        { type: "SYSTEM" },
      ]
    } else if (req.user.role === "STUDENT") {
      where[Op.or] = [{ userId: req.user.id }, { type: "SYSTEM" }]
    }

    await models.alerts.update(
      { isRead: true },
      { where }
    )

    res.json({
      success: true,
      message: "Toutes les alertes marquées comme lues",
    })
  } catch (error) {
    console.error("Erreur marquage toutes alertes:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Créer une alerte (admin uniquement)
router.post("/", requireRole(["ADMIN"]), async (req, res) => {
  try {
    const { type, title, message, severity = "MEDIUM", userId, courseId } = req.body

    const alert = await models.alerts.create({
      type,
      title,
      message,
      severity,
      userId,
      courseId,
      createdBy: req.user.id,
    })

    // Inclure le créateur dans la réponse
    const creator = await models.users.findByPk(req.user.id, {
      attributes: ["firstName", "lastName"],
    })

    res.status(201).json({
      success: true,
      data: { ...alert.toJSON(), creator },
      message: "Alerte créée avec succès",
    })
  } catch (error) {
    console.error("Erreur création alerte:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Supprimer une alerte (admin uniquement)
router.delete("/:id", requireRole(["ADMIN"]), async (req, res) => {
  try {
    const { id } = req.params

    const alert = await models.alerts.findByPk(id)

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alerte non trouvée",
      })
    }

    await alert.destroy()

    res.json({
      success: true,
      message: "Alerte supprimée avec succès",
    })
  } catch (error) {
    console.error("Erreur suppression alerte:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Fonction utilitaire pour récupérer les IDs des cours d'un professeur
async function getCourseIdsByProfessor(professorId) {
  const courses = await models.courses.findAll({
    where: { professorId },
    attributes: ["id"],
  })
  return courses.map((course) => course.id)
}

module.exports = router
