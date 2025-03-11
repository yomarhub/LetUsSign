const express = require("express")
const { models, sequelize } = require("../config/sequelize")
const Sequelize = sequelize.constructor
const { authenticateToken, requireRole } = require("../middleware/auth")

const User = models.users
const Course = models.courses
const Signature = models.signatures
const QRCode = models.qr_codes
const Alert = models.alerts
const Class = models.classes
const Establishments = models.establishments

const router = express.Router()

// Middleware d'authentification et autorisation admin
router.use(authenticateToken)
router.use(requireRole(["ADMIN"]))

// Statistiques générales
router.get("/stats", async (req, res) => {
  try {
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    const [
      totalUsers,
      activeCourses,
      todaySignatures,
      todayAbsences,
      usersByRole,
      coursesByStatus,
      recentActivity,
    ] = await Promise.all([
      // Total utilisateurs
      User.count(),

      // Cours actifs
      Course.count({
        where: {
          status: {
            [Sequelize.Op.in]: ["SCHEDULED", "IN_PROGRESS"],
          },
        },
      }),

      // Signatures aujourd'hui
      Signature.count({
        where: {
          signedAt: {
            [Sequelize.Op.gte]: startOfDay,
            [Sequelize.Op.lte]: endOfDay,
          },
        },
      }),

      // Absences aujourd'hui (cours programmés - signatures)
      Course.count({
        where: {
          date: {
            [Sequelize.Op.gte]: startOfDay,
            [Sequelize.Op.lte]: endOfDay,
          },
          status: {
            [Sequelize.Op.in]: ["SCHEDULED", "IN_PROGRESS", "COMPLETED"],
          },
        },
      }),

      // Répartition par rôle
      User.findAll({
        attributes: [
          "role",
          [Sequelize.fn("COUNT", Sequelize.col("role")), "count"],
        ],
        group: ["role"],
        raw: true,
      }),

      // Cours par statut
      Course.findAll({
        attributes: [
          "status",
          [Sequelize.fn("COUNT", Sequelize.col("status")), "count"],
        ],
        group: ["status"],
        raw: true,
      }),

      // Activité récente
      Signature.findAll({
        limit: 10,
        order: [["signedAt", "DESC"]],
        include: [
          {
            model: User,
            as: "student",
            attributes: ["firstName", "lastName"],
          },
          {
            model: Course,
            as: "course",
            attributes: ["name", "subject"],
          },
        ],
      }),
    ])

    const expectedSignatures = todayAbsences * 25
    const absences = Math.max(0, expectedSignatures - todaySignatures)

    res.json({
      success: true,
      data: {
        totalUsers,
        activeCourses,
        todaySignatures,
        absences,
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item.role] = Number(item.count)
          return acc
        }, {}),
        coursesByStatus: coursesByStatus.reduce((acc, item) => {
          acc[item.status] = Number(item.count)
          return acc
        }, {}),
        recentActivity: recentActivity.map((activity) => ({
          id: activity.id,
          studentName: `${activity.student?.firstName || ""} ${activity.student?.lastName || ""}`,
          courseName: activity.course?.name,
          subject: activity.course?.subject,
          signedAt: activity.signedAt,
          status: activity.status,
        })),
      },
    })
  } catch (error) {
    console.error("Erreur récupération statistiques admin:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Statistiques de présence par période
router.get("/attendance-stats", async (req, res) => {
  try {
    const { period = "week", startDate, endDate } = req.query

    let dateFilter = {}
    const now = new Date()

    switch (period) {
      case "day":
        const today = new Date(now.setHours(0, 0, 0, 0))
        const endOfToday = new Date(now.setHours(23, 59, 59, 999))
        dateFilter = { [Sequelize.Op.gte]: today, [Sequelize.Op.lte]: endOfToday }
        break

      case "week":
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
        startOfWeek.setHours(0, 0, 0, 0)
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(endOfWeek.getDate() + 6)
        endOfWeek.setHours(23, 59, 59, 999)
        dateFilter = { [Sequelize.Op.gte]: startOfWeek, [Sequelize.Op.lte]: endOfWeek }
        break

      case "month":
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        endOfMonth.setHours(23, 59, 59, 999)
        dateFilter = { [Sequelize.Op.gte]: startOfMonth, [Sequelize.Op.lte]: endOfMonth }
        break

      case "custom":
        if (startDate && endDate) {
          dateFilter = {
            [Sequelize.Op.gte]: new Date(startDate),
            [Sequelize.Op.lte]: new Date(endDate),
          }
        }
        break
    }

    const signatures = await Signature.findAll({
      where: {
        signedAt: dateFilter,
      },
      include: [
        {
          model: Course,
          attributes: ["date"],
          include: [
            {
              model: Class,
              attributes: ["name"],
            },
          ],
        },
      ],
    })

    const dailyStats = signatures.reduce((acc, signature) => {
      const date = signature.course.date.toISOString().split("T")[0]
      if (!acc[date]) {
        acc[date] = { present: 0, late: 0, total: 0 }
      }

      if (signature.status === "PRESENT") acc[date].present++
      if (signature.status === "LATE") acc[date].late++
      acc[date].total++

      return acc
    }, {})

    res.json({
      success: true,
      data: {
        period,
        dailyStats,
        summary: {
          totalSignatures: signatures.length,
          presentCount: signatures.filter((s) => s.status === "PRESENT").length,
          lateCount: signatures.filter((s) => s.status === "LATE").length,
          attendanceRate:
            signatures.length > 0
              ? (signatures.filter((s) => s.status === "PRESENT").length / signatures.length) * 100
              : 0,
        },
      },
    })
  } catch (error) {
    console.error("Erreur statistiques présence:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Rapport d'activité des utilisateurs
router.get("/user-activity", async (req, res) => {
  try {
    const { role, limit = 50 } = req.query

    const where = {}
    if (role) where.role = role

    const users = await User.findAll({
      where,
      limit: Number.parseInt(limit),
      include: [
        {
          model: Signature,
          as: "signatures",
          limit: 5,
          order: [["signedAt", "DESC"]],
          include: [
            {
              model: Course,
              attributes: ["name", "date"],
            },
          ],
        },
        {
          model: Course,
          as: "coursesTaught",
          ...(role === "PROFESSOR"
            ? {
              limit: 5,
              order: [["date", "DESC"]],
              attributes: ["id", "name", "date", "status"],
            }
            : { attributes: [] }),
        },
      ],
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM signatures AS s
              WHERE s.studentId = users.id
            )`),
            "signaturesCount",
          ],
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM courses AS c
              WHERE c.professorId = users.id
            )`),
            "coursesTaughtCount",
          ],
        ],
      },
      order: [["createdAt", "DESC"]],
    })

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      status: user.status,
      lastActivity:
        user.signatures?.[0]?.signedAt ||
        user.coursesTaught?.[0]?.date ||
        user.createdAt,
      stats: {
        totalSignatures: user.get("signaturesCount"),
        totalCourses: user.get("coursesTaughtCount"),
      },
      recentActivity: [
        ...(user.signatures || []).map((sig) => ({
          type: "signature",
          course: sig.course?.name,
          date: sig.course?.date,
          signedAt: sig.signedAt,
        })),
        ...((user.coursesTaught || []).map((course) => ({
          type: "course",
          course: course.name,
          date: course.date,
          status: course.status,
        })) || []),
      ]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5),
    }))

    res.json({
      success: true,
      data: formattedUsers,
    })
  } catch (error) {
    console.error("Erreur activité utilisateurs:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Alertes système
router.get("/system-alerts", async (req, res) => {
  try {
    const alerts = []

    // Vérifier les cours sans signatures récentes
    const coursesWithoutSignatures = await Course.findAll({
      where: {
        date: {
          [Sequelize.Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        status: "COMPLETED",
      },
      include: [
        {
          model: Signature,
          required: false,
          where: {},
        },
        {
          model: User,
          as: "professor",
          attributes: ["firstName", "lastName"],
        },
      ],
      having: sequelize.literal(`COUNT(signatures.id) = 0`),
      group: ["courses.id", "professor.id"],
    })

    if (coursesWithoutSignatures.length > 0) {
      alerts.push({
        type: "warning",
        title: "Cours sans signatures",
        message: `${coursesWithoutSignatures.length} cours terminés sans aucune signature`,
        count: coursesWithoutSignatures.length,
        details: coursesWithoutSignatures.slice(0, 5),
      })
    }

    // Vérifier les utilisateurs inactifs
    const inactiveUsers = await User.count({
      where: {
        status: "INACTIVE",
      },
    })

    if (inactiveUsers > 0) {
      alerts.push({
        type: "info",
        title: "Utilisateurs inactifs",
        message: `${inactiveUsers} utilisateurs sont marqués comme inactifs`,
        count: inactiveUsers,
      })
    }

    // Vérifier les QR codes expirés non désactivés
    const expiredQRCodes = await QRCode.count({
      where: {
        isActive: true,
        expiresAt: {
          [Sequelize.Op.lt]: new Date(),
        },
      },
    })

    if (expiredQRCodes > 0) {
      alerts.push({
        type: "warning",
        title: "QR Codes expirés",
        message: `${expiredQRCodes} QR codes expirés sont encore actifs`,
        count: expiredQRCodes,
      })
    }

    res.json({
      success: true,
      data: alerts,
    })
  } catch (error) {
    console.error("Erreur alertes système:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

// Nettoyage automatique
router.post("/cleanup", async (req, res) => {
  try {
    const { type } = req.body

    let result = {}

    switch (type) {
      case "expired-qrcodes":
        const expiredQRCodes = await QRCode.update(
          { isActive: false },
          {
            where: {
              isActive: true,
              expiresAt: {
                [Sequelize.Op.lt]: new Date(),
              },
            },
          }
        )
        result.expiredQRCodes = expiredQRCodes[0]
        break

      case "old-alerts":
        const oldAlerts = await Alert.destroy({
          where: {
            createdAt: {
              [Sequelize.Op.lt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
            isRead: true,
          },
        })
        result.oldAlerts = oldAlerts
        break

      case "all":
        // Nettoyer les QR codes expirés
        const expiredQR = await QRCode.update(
          { isActive: false },
          {
            where: {
              isActive: true,
              expiresAt: {
                [Sequelize.Op.lt]: new Date(),
              },
            },
          }
        )

        // Supprimer les anciennes alertes lues
        const oldAlertsAll = await Alert.destroy({
          where: {
            createdAt: {
              [Sequelize.Op.lt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
            isRead: true,
          },
        })

        result = {
          expiredQRCodes: expiredQR[0],
          oldAlerts: oldAlertsAll,
        }
        break

      default:
        return res.status(400).json({
          success: false,
          message: "Type de nettoyage invalide",
        })
    }

    res.json({
      success: true,
      data: result,
      message: "Nettoyage effectué avec succès",
    })
  } catch (error) {
    console.error("Erreur nettoyage:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

router.get("/classes", async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: [
        {
          model: Establishments,
          as: "establishment",
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    res.json({
      success: true,
      data: classes,
    })
  } catch (error) {
    console.error("Erreur récupération classes:", error)
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    })
  }
})

module.exports = router
