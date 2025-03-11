const express = require("express")
const multer = require("multer")
const sharp = require("sharp")
const { models } = require("../config/sequelize")
const { Op } = require("sequelize")
const { authenticateToken, requireRole } = require("../middleware/auth")

const router = express.Router()

// Configuration multer pour l'upload des signatures
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: Number.parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Seules les images sont autorisées"), false)
    }
  },
})

// Middleware d'authentification pour toutes les routes
router.use(authenticateToken)

// Signer la présence
router.post("/sign", upload.single("file"), async (req, res) => {
  try {
    const { courseId, qrCode, timestamp } = req.body
    const studentId = req.user.id

    if (req.user.role !== "STUDENT") {
      return res.status(403).json({
        success: false,
        message: "Seuls les étudiants peuvent signer leur présence",
      })
    }

    // Vérifier le QR code
    const qrCodeRecord = await models.qr_codes.findOne({
      where: { code: qrCode },
      include: [
        {
          model: models.courses,
          as: "course",
          include: [
            {
              model: models.classes,
              as: "class",
            },
          ],
        },
      ],
    })

    if (!qrCodeRecord || !qrCodeRecord.isActive || qrCodeRecord.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "QR Code invalide ou expiré",
      })
    }

    // Vérifier que l'étudiant fait partie de la classe
    if (qrCodeRecord.course.classId !== req.user.classId) {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas inscrit à ce cours",
      })
    }

    // Vérifier si l'étudiant a déjà signé
    const existingSignature = await models.signatures.findOne({
      where: {
        studentId,
        courseId,
      },
    })

    if (existingSignature) {
      return res.status(400).json({
        success: false,
        message: "Vous avez déjà signé pour ce cours",
      })
    }

    // Traiter l'image de signature
    let signatureData = ""
    if (req.file) {
      // Optimiser l'image
      const optimizedImage = await sharp(req.file.buffer)
        .resize(400, 200, { fit: "inside" })
        .png({ quality: 80 })
        .toBuffer()

      signatureData = `data:image/png;base64,${optimizedImage.toString("base64")}`
    } else if (req.body.signatureData) {
      signatureData = req.body.signatureData
    } else {
      return res.status(400).json({
        success: false,
        message: "Signature requise",
      })
    }

    // Déterminer le statut (présent ou en retard)
    const courseStartTime = qrCodeRecord.course.startTime
    const signTime = new Date(timestamp)
    const courseDate = new Date(qrCodeRecord.course.date)

    // Combiner date et heure du cours
    const [hours, minutes] = courseStartTime.split(":")
    const courseStart = new Date(courseDate)
    courseStart.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0)

    // Considérer comme retard si plus de 10 minutes après le début
    const isLate = signTime > new Date(courseStart.getTime() + 10 * 60 * 1000)
    const status = isLate ? "LATE" : "PRESENT"

    // Créer la signature
    const signature = await models.signatures.create({
      studentId,
      courseId,
      signatureData,
      status,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    })

    // Incrémenter le compteur de scans du QR code
    await qrCodeRecord.increment("scansCount")

    // Récupérer les infos liées pour la réponse
    const student = await models.users.findByPk(studentId, {
      attributes: ["firstName", "lastName"],
    })
    const course = await models.courses.findByPk(courseId, {
      attributes: ["name", "subject", "date", "startTime", "endTime"],
    })

    res.status(201).json({
      success: true,
      data: {
        id: signature.id,
        studentId: signature.studentId,
        studentName: `${student.firstName} ${student.lastName}`,
        courseId: signature.courseId,
        course: {
          name: course.name,
          subject: course.subject,
          date: course.date.toISOString().split("T")[0],
          startTime: course.startTime,
          endTime: course.endTime,
        },
        signedAt: signature.signedAt,
        status: signature.status,
      },
      message: "Présence signée avec succès",
    })
  } catch (error) {
    console.error("Erreur signature présence:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Récupérer les signatures
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, studentId, courseId, date, status } = req.query

    const offset = (Number.parseInt(page) - 1) * Number.parseInt(limit)
    const _limit = Number.parseInt(limit)

    // Construire les filtres
    const where = {}

    if (studentId) where.studentId = studentId
    if (courseId) where.courseId = courseId
    if (status) where.status = status
    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      where.createdAt = {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      }
    }

    // Filtrer selon le rôle
    if (req.user.role === "STUDENT") {
      where.studentId = req.user.id
    }

    const { rows: signatures, count: total } = await models.signatures.findAndCountAll({
      where,
      offset,
      limit: _limit,
      include: [
        {
          model: models.users,
          as: "student",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: models.courses,
          as: "course",
          attributes: ["id", "name", "subject", "date", "startTime", "endTime", "professorId"],
          include: [
            {
              model: models.users,
              as: "professor",
              attributes: ["firstName", "lastName"],
            },
          ],
        },
      ],
      order: [["signedAt", "DESC"]],
      distinct: true,
    })

    const formattedSignatures = signatures.map((signature) => ({
      id: signature.id,
      studentId: signature.studentId,
      student: {
        id: signature.student.id,
        firstName: signature.student.firstName,
        lastName: signature.student.lastName,
      },
      courseId: signature.courseId,
      course: {
        id: signature.course.id,
        name: signature.course.name,
        subject: signature.course.subject,
        date: signature.course.date.toISOString().split("T")[0],
        startTime: signature.course.startTime,
        endTime: signature.course.endTime,
        professor: signature.course.professor
          ? {
            firstName: signature.course.professor.firstName,
            lastName: signature.course.professor.lastName,
          }
          : null,
      },
      signedAt: signature.signedAt,
      status: signature.status,
    }))

    res.json({
      success: true,
      data: formattedSignatures,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        totalPages: Math.ceil(total / Number.parseInt(limit)),
      },
    })
  } catch (error) {
    console.error("Erreur récupération signatures:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Marquer manuellement la présence (professeur)
router.post("/manual", requireRole(["PROFESSOR"]), async (req, res) => {
  try {
    const { courseId, studentId, status } = req.body

    // Vérifier que le cours appartient au professeur
    const course = await models.courses.findByPk(courseId)
    if (!course || course.professorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès non autorisé",
      })
    }

    // Vérifier si une signature existe déjà
    let signature = await models.signatures.findOne({
      where: { studentId, courseId },
    })

    if (signature) {
      // Mettre à jour la signature existante
      await signature.update({ status })
    } else {
      // Créer une nouvelle signature
      signature = await models.signatures.create({
        studentId,
        courseId,
        status,
        signatureData: "manual", // Marquage manuel
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      })
    }

    // Récupérer les infos liées pour la réponse
    const student = await models.users.findByPk(studentId, {
      attributes: ["firstName", "lastName"],
    })
    const courseInfo = await models.courses.findByPk(courseId, {
      attributes: ["name", "subject", "date", "startTime", "endTime"],
    })

    res.json({
      success: true,
      data: {
        id: signature.id,
        studentId: signature.studentId,
        studentName: `${student.firstName} ${student.lastName}`,
        courseId: signature.courseId,
        course: {
          name: courseInfo.name,
          subject: courseInfo.subject,
          date: courseInfo.date.toISOString().split("T")[0],
          startTime: courseInfo.startTime,
          endTime: courseInfo.endTime,
        },
        signedAt: signature.signedAt,
        status: signature.status,
      },
      message: "Présence marquée avec succès",
    })
  } catch (error) {
    console.error("Erreur marquage manuel:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Récupérer les signatures d'un étudiant
router.get("/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params
    const { page = 1, limit = 10, startDate, endDate } = req.query

    // Vérifier les permissions
    if (req.user.role === "STUDENT" && req.user.id !== parseInt(studentId)) {
      return res.status(403).json({
        success: false,
        message: "Accès non autorisé",
      })
    }

    const offset = (Number.parseInt(page) - 1) * Number.parseInt(limit)
    const _limit = Number.parseInt(limit)

    const where = { studentId }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt[Op.gte] = new Date(startDate)
      if (endDate) where.createdAt[Op.lte] = new Date(endDate)
    }

    const { rows: signatures, count: total } = await models.signatures.findAndCountAll({
      where,
      offset,
      limit: _limit,
      include: [
        {
          model: models.courses,
          as: "course",
          attributes: ["name", "subject", "date", "startTime", "endTime", "professorId"],
          include: [
            {
              model: models.users,
              as: "professor",
              attributes: ["firstName", "lastName"],
            },
          ],
        },
      ],
      order: [["signedAt", "DESC"]],
      distinct: true,
    })

    res.json({
      success: true,
      data: signatures,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        totalPages: Math.ceil(total / Number.parseInt(limit)),
      },
    })
  } catch (error) {
    console.error("Erreur récupération signatures étudiant:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Récupérer les présences d'un cours
router.get("/course/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params

    // Vérifier que le cours existe
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
              attributes: ["id", "firstName", "lastName"],
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

    // Vérifier les permissions
    if (req.user.role === "PROFESSOR" && course.professorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès non autorisé",
      })
    }

    // Récupérer toutes les signatures pour ce cours
    const signatures = await models.signatures.findAll({
      where: { courseId },
      include: [
        {
          model: models.users,
          as: "student",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    })

    // Calculer les statistiques
    const totalStudents = course.class && course.class.users ? course.class.users.length : 0
    const presentCount = signatures.filter((s) => s.status === "PRESENT").length
    const lateCount = signatures.filter((s) => s.status === "LATE").length
    const absentCount = totalStudents - presentCount - lateCount
    const attendanceRate = totalStudents > 0 ? (presentCount / totalStudents) * 100 : 0

    res.json({
      success: true,
      data: {
        signatures,
        stats: {
          totalStudents,
          presentCount,
          absentCount,
          lateCount,
          attendanceRate: Math.round(attendanceRate * 100) / 100,
        },
      },
    })
  } catch (error) {
    console.error("Erreur récupération présences cours:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Récupérer une signature par ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const signature = await models.signatures.findByPk(id, {
      include: [
        {
          model: models.users,
          as: "student",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: models.courses,
          as: "course",
          attributes: ["id", "name", "subject", "date", "startTime", "endTime", "professorId"],
          include: [
            {
              model: models.users,
              as: "professor",
              attributes: ["firstName", "lastName"],
            },
          ],
        },
      ],
    })

    if (!signature) {
      return res.status(404).json({
        success: false,
        message: "Signature non trouvée",
      })
    }

    // Vérifier les permissions
    if (req.user.role === "STUDENT" && signature.studentId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Accès non autorisé",
      })
    }

    if (
      req.user.role === "PROFESSOR" &&
      signature.course.professorId !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Accès non autorisé",
      })
    }

    res.json({
      success: true,
      data: signature,
    })
  } catch (error) {
    console.error("Erreur récupération signature:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

module.exports = router
