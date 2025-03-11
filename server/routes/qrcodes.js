const express = require("express")
const { v4: uuidv4 } = require("uuid")
const { models } = require("../config/sequelize")
const { Op } = require("sequelize")
const { authenticateToken, requireRole } = require("../middleware/auth")

const router = express.Router()

// Middleware d'authentification pour toutes les routes
router.use(authenticateToken)

// Générer un QR code
router.post("/generate", requireRole(["PROFESSOR"]), async (req, res) => {
  try {
    const { courseId, expiryMinutes = 120, maxScans } = req.body

    // Vérifier que le cours existe et appartient au professeur
    const course = await models.courses.findByPk(courseId, {
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

    // Désactiver les anciens QR codes pour ce cours
    await models.qr_codes.update(
      { isActive: false },
      { where: { courseId, isActive: true } }
    )

    // Générer un code unique
    const code = uuidv4()

    // Calculer l'expiration
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes)

    // Créer le QR code
    const qrCode = await models.qr_codes.create({
      courseId,
      code,
      expiresAt,
      maxScans: maxScans || (course.class && course.class.users ? course.class.users.length : 0),
      isActive: true,
      scansCount: 0,
    })

    res.status(201).json({
      success: true,
      data: {
        id: qrCode.id,
        courseId: qrCode.courseId,
        courseName: course.name,
        code: qrCode.code,
        qrData: `${process.env.FRONTEND_URL}/sign/${qrCode.code}`,
        createdAt: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        expiresAt: qrCode.expiresAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        scans: qrCode.scansCount,
        totalStudents: course.class && course.class.users ? course.class.users.length : 0,
        isActive: qrCode.isActive,
      },
      message: "QR Code généré avec succès",
    })
  } catch (error) {
    console.error("Erreur génération QR code:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Récupérer les QR codes actifs
router.get("/active", async (req, res) => {
  try {
    const { professorId } = req.query

    const where = {
      isActive: true,
      expiresAt: {
        [Op.gt]: new Date(),
      },
    }

    // Filtrer selon le rôle
    if (req.user.role === "PROFESSOR") {
      where["$course.professorId$"] = req.user.id
    } else if (professorId && req.user.role === "ADMIN") {
      where["$course.professorId$"] = professorId
    }

    const qrCodes = await models.qr_codes.findAll({
      where,
      include: [
        {
          model: models.courses,
          as: "course",
          include: [
            {
              model: models.users,
              as: "professor",
              attributes: ["firstName", "lastName"],
            },
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
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    const formattedQRCodes = qrCodes.map((qr) => ({
      id: qr.id,
      courseId: qr.courseId,
      courseName: qr.course ? qr.course.name : null,
      code: qr.code,
      qrData: `${process.env.FRONTEND_URL}/sign/${qr.code}`,
      createdAt: qr.createdAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      expiresAt: qr.expiresAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      scans: qr.scansCount,
      totalStudents: qr.course && qr.course.class && qr.course.class.users ? qr.course.class.users.length : 0,
      isActive: qr.isActive,
      professor: qr.course && qr.course.professor
        ? `${qr.course.professor.firstName} ${qr.course.professor.lastName}`
        : null,
    }))

    res.json({
      success: true,
      data: formattedQRCodes,
    })
  } catch (error) {
    console.error("Erreur récupération QR codes actifs:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Valider un QR code
router.post("/validate", async (req, res) => {
  try {
    const { code } = req.body

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Code requis",
      })
    }

    // Trouver le QR code
    const qrCode = await models.qr_codes.findOne({
      where: { code },
      include: [
        {
          model: models.courses,
          as: "course",
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
        },
      ],
    })

    if (!qrCode) {
      return res.json({
        success: true,
        data: {
          valid: false,
          message: "Code non trouvé",
        },
      })
    }

    // Vérifier si le code est actif
    if (!qrCode.isActive) {
      return res.json({
        success: true,
        data: {
          valid: false,
          message: "Code désactivé",
        },
      })
    }

    // Vérifier l'expiration
    if (qrCode.expiresAt < new Date()) {
      // Désactiver le code expiré
      await qrCode.update({ isActive: false })

      return res.json({
        success: true,
        data: {
          valid: false,
          message: "Code expiré",
        },
      })
    }

    // Vérifier le nombre maximum de scans
    if (qrCode.maxScans && qrCode.scansCount >= qrCode.maxScans) {
      return res.json({
        success: true,
        data: {
          valid: false,
          message: "Nombre maximum de scans atteint",
        },
      })
    }

    // Vérifier si l'étudiant fait partie de la classe
    if (
      req.user.role === "STUDENT" &&
      qrCode.course &&
      qrCode.course.classId !== req.user.classId
    ) {
      return res.json({
        success: true,
        data: {
          valid: false,
          message: "Vous n'êtes pas inscrit à ce cours",
        },
      })
    }

    // Code valide
    res.json({
      success: true,
      data: {
        valid: true,
        course: qrCode.course
          ? {
            id: qrCode.course.id,
            name: qrCode.course.name,
            subject: qrCode.course.subject,
            professor: qrCode.course.professor
              ? `${qrCode.course.professor.firstName} ${qrCode.course.professor.lastName}`
              : null,
            className: qrCode.course.class ? qrCode.course.class.name : null,
            date: qrCode.course.date ? qrCode.course.date.toISOString().split("T")[0] : null,
            time: `${qrCode.course.startTime} - ${qrCode.course.endTime}`,
            room: "Salle 201", // À adapter selon votre modèle
          }
          : null,
      },
    })
  } catch (error) {
    console.error("Erreur validation QR code:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Désactiver un QR code
router.patch("/:id/deactivate", requireRole(["PROFESSOR", "ADMIN"]), async (req, res) => {
  try {
    const { id } = req.params

    const qrCode = await models.qr_codes.findByPk(id, {
      include: [
        {
          model: models.courses,
          as: "course",
        },
      ],
    })

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: "QR Code non trouvé",
      })
    }

    // Vérifier les permissions pour un professeur
    if (req.user.role === "PROFESSOR" && qrCode.course.professorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès non autorisé",
      })
    }

    await qrCode.update({ isActive: false })

    res.json({
      success: true,
      message: "QR Code désactivé avec succès",
    })
  } catch (error) {
    console.error("Erreur désactivation QR code:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Statistiques d'un QR code
router.get("/:id/stats", async (req, res) => {
  try {
    const { id } = req.params

    const qrCode = await models.qr_codes.findByPk(id, {
      include: [
        {
          model: models.courses,
          as: "course",
          include: [
            {
              model: models.signatures,
              as: "signatures",
              order: [["signedAt", "DESC"]],
            },
          ],
        },
      ],
    })

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: "QR Code non trouvé",
      })
    }

    const signatures = qrCode.course && qrCode.course.signatures ? qrCode.course.signatures : []
    const uniqueScans = new Set(signatures.map((s) => s.studentId)).size
    const lastScanAt = signatures.length > 0 ? signatures[0].signedAt : null

    res.json({
      success: true,
      data: {
        scansCount: qrCode.scansCount,
        uniqueScans,
        lastScanAt,
      },
    })
  } catch (error) {
    console.error("Erreur statistiques QR code:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

module.exports = router
