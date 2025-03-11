const express = require("express")
const { models } = require("../config/sequelize")
const { Op } = require("sequelize")
const { authenticateToken, requireRole } = require("../middleware/auth")
const { validateCourse } = require("../middleware/validation")

const router = express.Router()

// Middleware d'authentification pour toutes les routes
router.use(authenticateToken)

// Récupérer tous les cours
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, professorId, classId, date, status, search } = req.query

    const offset = (Number.parseInt(page) - 1) * Number.parseInt(limit)
    const _limit = Number.parseInt(limit)

    // Construire les filtres
    const where = {}

    if (professorId) where.professorId = professorId
    if (classId) where.classId = classId
    if (status) where.status = status
    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      where.date = {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      }
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { subject: { [Op.like]: `%${search}%` } },
      ]
    }

    // Filtrer selon le rôle
    if (req.user.role === "PROFESSOR") {
      where.professorId = req.user.id
    } else if (req.user.role === "STUDENT") {
      where.classId = req.user.classId
    }

    const { rows: courses, count: total } = await models.courses.findAndCountAll({
      where,
      offset,
      limit: _limit,
      include: [
        {
          model: models.users,
          as: "professor",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: models.classes,
          as: "class",
          attributes: ["id", "name"],
        },
        {
          model: models.signatures,
          as: "signatures",
          attributes: ["id"],
        },
      ],
      order: [["date", "DESC"]],
      distinct: true,
    })

    // Formater les données
    const formattedCourses = courses.map((course) => ({
      id: course.id,
      name: course.name,
      subject: course.subject,
      professorId: course.professorId,
      professor: course.professor
        ? `${course.professor.firstName} ${course.professor.lastName}`
        : null,
      classId: course.classId,
      className: course.class ? course.class.name : null,
      date: course.date ? course.date.toISOString().split("T")[0] : null,
      startTime: course.startTime,
      endTime: course.endTime,
      status: course.status,
      signaturesCount: course.signatures ? course.signatures.length : 0,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    }))

    res.json({
      success: true,
      data: formattedCourses,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        totalPages: Math.ceil(total / Number.parseInt(limit)),
      },
    })
  } catch (error) {
    console.error("Erreur récupération cours:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Récupérer les cours du jour
router.get("/today", async (req, res) => {
  try {
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    const where = {
      date: {
        [Op.gte]: startOfDay,
        [Op.lte]: endOfDay,
      },
    }

    // Filtrer selon le rôle
    if (req.user.role === "PROFESSOR") {
      where.professorId = req.user.id
    } else if (req.user.role === "STUDENT") {
      where.classId = req.user.classId
    }

    const courses = await models.courses.findAll({
      where,
      include: [
        {
          model: models.users,
          as: "professor",
          attributes: ["firstName", "lastName"],
        },
        {
          model: models.classes,
          as: "class",
          attributes: ["name"],
        },
        {
          model: models.signatures,
          as: "signatures",
          where: req.user.role === "STUDENT" ? { studentId: req.user.id } : undefined,
          required: false,
        },
      ],
      order: [["startTime", "ASC"]],
    })

    const formattedCourses = courses.map((course) => {
      const baseData = {
        id: course.id,
        name: course.name,
        subject: course.subject,
        professor: course.professor
          ? `${course.professor.firstName} ${course.professor.lastName}`
          : null,
        className: course.class ? course.class.name : null,
        date: course.date ? course.date.toISOString().split("T")[0] : null,
        startTime: course.startTime,
        endTime: course.endTime,
        time: `${course.startTime} - ${course.endTime}`,
        status: course.status,
      }

      if (req.user.role === "STUDENT") {
        const signature = course.signatures[0]
        return {
          ...baseData,
          signTime: signature?.signedAt
            ? new Date(signature.signedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
            : null,
          signatureStatus: signature?.status || "upcoming",
        }
      }

      return {
        ...baseData,
        signaturesCount: course.signatures ? course.signatures.length : 0,
        totalStudents: 28, // À calculer selon la classe
      }
    })

    res.json({
      success: true,
      data: formattedCourses,
    })
  } catch (error) {
    console.error("Erreur récupération cours du jour:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Récupérer un cours par ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const course = await models.courses.findByPk(id, {
      include: [
        {
          model: models.users,
          as: "professor",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: models.classes,
          as: "class",
          attributes: ["id", "name"],
        },
      ],
    })

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Cours non trouvé",
      })
    }

    // Vérifier les permissions
    if (req.user.role === "PROFESSOR" && course.professorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès non autorisé",
      })
    }

    if (req.user.role === "STUDENT" && course.classId !== req.user.classId) {
      return res.status(403).json({
        success: false,
        message: "Accès non autorisé",
      })
    }

    res.json({
      success: true,
      data: {
        ...course.toJSON(),
        professor: course.professor
          ? `${course.professor.firstName} ${course.professor.lastName}`
          : null,
        className: course.class ? course.class.name : null,
        date: course.date ? course.date.toISOString().split("T")[0] : null,
      },
    })
  } catch (error) {
    console.error("Erreur récupération cours:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Créer un cours
router.post("/", requireRole(["ADMIN", "PROFESSOR"]), validateCourse, async (req, res) => {
  try {
    const { name, subject, classId, date, startTime, endTime } = req.body

    // Pour un professeur, utiliser son ID
    const professorId = req.user.role === "PROFESSOR" ? req.user.id : req.body.professorId

    const course = await models.courses.create({
      name,
      subject,
      professorId,
      classId,
      date: new Date(date),
      startTime,
      endTime,
    })

    // Récupérer les infos liées
    const createdCourse = await models.courses.findByPk(course.id, {
      include: [
        {
          model: models.users,
          as: "professor",
          attributes: ["firstName", "lastName"],
        },
        {
          model: models.classes,
          as: "class",
          attributes: ["name"],
        },
      ],
    })

    res.status(201).json({
      success: true,
      data: {
        ...createdCourse.toJSON(),
        professor: createdCourse.professor
          ? `${createdCourse.professor.firstName} ${createdCourse.professor.lastName}`
          : null,
        className: createdCourse.class ? createdCourse.class.name : null,
        date: createdCourse.date ? createdCourse.date.toISOString().split("T")[0] : null,
      },
      message: "Cours créé avec succès",
    })
  } catch (error) {
    console.error("Erreur création cours:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Mettre à jour un cours
router.put("/:id", requireRole(["ADMIN", "PROFESSOR"]), async (req, res) => {
  try {
    const { id } = req.params
    const { name, subject, classId, date, startTime, endTime, status } = req.body

    // Vérifier si le cours existe
    const existingCourse = await models.courses.findByPk(id)

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Cours non trouvé",
      })
    }

    // Vérifier les permissions pour un professeur
    if (req.user.role === "PROFESSOR" && existingCourse.professorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès non autorisé",
      })
    }

    await existingCourse.update({
      name,
      subject,
      classId,
      date: date ? new Date(date) : undefined,
      startTime,
      endTime,
      status,
    })

    const updatedCourse = await models.courses.findByPk(id, {
      include: [
        {
          model: models.users,
          as: "professor",
          attributes: ["firstName", "lastName"],
        },
        {
          model: models.classes,
          as: "class",
          attributes: ["name"],
        },
      ],
    })

    res.json({
      success: true,
      data: {
        ...updatedCourse.toJSON(),
        professor: updatedCourse.professor
          ? `${updatedCourse.professor.firstName} ${updatedCourse.professor.lastName}`
          : null,
        className: updatedCourse.class ? updatedCourse.class.name : null,
        date: updatedCourse.date ? updatedCourse.date.toISOString().split("T")[0] : null,
      },
      message: "Cours mis à jour avec succès",
    })
  } catch (error) {
    console.error("Erreur mise à jour cours:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Supprimer un cours
router.delete("/:id", requireRole(["ADMIN", "PROFESSOR"]), async (req, res) => {
  try {
    const { id } = req.params

    const existingCourse = await models.courses.findByPk(id)

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Cours non trouvé",
      })
    }

    // Vérifier les permissions pour un professeur
    if (req.user.role === "PROFESSOR" && existingCourse.professorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès non autorisé",
      })
    }

    await existingCourse.destroy()

    res.json({
      success: true,
      message: "Cours supprimé avec succès",
    })
  } catch (error) {
    console.error("Erreur suppression cours:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Démarrer un cours
router.patch("/:id/start", requireRole(["PROFESSOR"]), async (req, res) => {
  try {
    const { id } = req.params

    const course = await models.courses.findByPk(id, {
      include: [
        {
          model: models.users,
          as: "professor",
          attributes: ["firstName", "lastName"],
        },
        {
          model: models.classes,
          as: "class",
          attributes: ["name"],
        },
      ],
    })

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Cours non trouvé",
      })
    }

    if (course.professorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès non autorisé",
      })
    }

    await course.update({ status: "IN_PROGRESS" })

    res.json({
      success: true,
      data: {
        ...course.toJSON(),
        professor: course.professor
          ? `${course.professor.firstName} ${course.professor.lastName}`
          : null,
        className: course.class ? course.class.name : null,
        date: course.date ? course.date.toISOString().split("T")[0] : null,
      },
      message: "Cours démarré avec succès",
    })
  } catch (error) {
    console.error("Erreur démarrage cours:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Terminer un cours
router.patch("/:id/end", requireRole(["PROFESSOR"]), async (req, res) => {
  try {
    const { id } = req.params

    const course = await models.courses.findByPk(id, {
      include: [
        {
          model: models.users,
          as: "professor",
          attributes: ["firstName", "lastName"],
        },
        {
          model: models.classes,
          as: "class",
          attributes: ["name"],
        },
      ],
    })

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Cours non trouvé",
      })
    }

    if (course.professorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès non autorisé",
      })
    }

    await course.update({ status: "COMPLETED" })

    // Désactiver les QR codes associés
    await models.qr_codes.update(
      { isActive: false },
      { where: { courseId: id } }
    )

    res.json({
      success: true,
      data: {
        ...course.toJSON(),
        professor: course.professor
          ? `${course.professor.firstName} ${course.professor.lastName}`
          : null,
        className: course.class ? course.class.name : null,
        date: course.date ? course.date.toISOString().split("T")[0] : null,
      },
      message: "Cours terminé avec succès",
    })
  } catch (error) {
    console.error("Erreur fin cours:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Statistiques d'un cours
router.get("/:id/stats", async (req, res) => {
  try {
    const { id } = req.params

    const course = await models.courses.findByPk(id, {
      include: [
        {
          model: models.classes,
          as: "class",
          include: [
            {
              model: models.users,
              as: "users",
              where: { role: "STUDENT" },
              required: false,
            },
          ],
        },
        {
          model: models.signatures,
          as: "signatures",
        },
      ],
    })

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Cours non trouvé",
      })
    }

    const totalStudents = course.class && course.class.users ? course.class.users.length : 0
    const presentStudents = course.signatures
      ? course.signatures.filter((s) => s.status === "PRESENT").length
      : 0
    const lateStudents = course.signatures
      ? course.signatures.filter((s) => s.status === "LATE").length
      : 0
    const absentStudents = totalStudents - presentStudents - lateStudents
    const attendanceRate = totalStudents > 0 ? (presentStudents / totalStudents) * 100 : 0

    res.json({
      success: true,
      data: {
        totalStudents,
        presentStudents,
        absentStudents,
        lateStudents,
        attendanceRate: Math.round(attendanceRate * 100) / 100,
      },
    })
  } catch (error) {
    console.error("Erreur statistiques cours:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

module.exports = router
