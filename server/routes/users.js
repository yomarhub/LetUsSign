const express = require("express")
const bcrypt = require("bcryptjs")
const { v4: uuidv4 } = require("uuid")
const { authenticateToken, requireRole } = require("../middleware/auth")
const { validateUser } = require("../middleware/validation")
const { models } = require("../config/sequelize")
const { Op } = require("sequelize")

const router = express.Router()

// Récupérer tous les utilisateurs (Admin seulement)
router.get("/", authenticateToken, requireRole(["ADMIN"]), async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search, establishmentId } = req.query
    const offset = (Number.parseInt(page) - 1) * Number.parseInt(limit)
    const _limit = Number.parseInt(limit)

    // Construire les filtres
    const where = {}
    if (role) where.role = role
    if (establishmentId) where.establishmentId = establishmentId
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ]
    }

    const { rows: users, count: total } = await models.users.findAndCountAll({
      where,
      offset,
      limit: _limit,
      include: [
        {
          model: models.establishments,
          as: "establishment",
          attributes: ["name"],
        },
        {
          model: models.classes,
          as: "class",
          attributes: ["name"],
        },
      ],
      order: [["createdAt", "DESC"]],
      distinct: true,
    })

    // Formater les résultats
    const formattedUsers = users.map((u) => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt,
      establishmentName: u.establishment ? u.establishment.name : null,
      className: u.class ? u.class.name : null,
    }))

    res.json({
      success: true,
      data: formattedUsers,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        totalPages: Math.ceil(total / Number.parseInt(limit)),
      },
    })
  } catch (error) {
    console.error("Erreur récupération utilisateurs:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des utilisateurs",
    })
  }
})

// Créer un utilisateur (Admin seulement)
router.post("/", authenticateToken, requireRole(["ADMIN"]), validateUser, async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, establishmentId, classId } = req.body

    // Vérifier si l'email existe déjà
    const existingUser = await models.users.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Cet email est déjà utilisé",
      })
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, Number.parseInt(process.env.BCRYPT_ROUNDS) || 12)

    // Créer l'utilisateur
    const user = await models.users.create({
      id: uuidv4(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      establishmentId,
      classId: classId || null,
    })

    // Récupérer l'utilisateur créé avec les infos liées
    const newUser = await models.users.findByPk(user.id, {
      include: [
        {
          model: models.establishments,
          as: "establishment",
          attributes: ["name"],
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
      message: "Utilisateur créé avec succès",
      data: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        createdAt: newUser.createdAt,
        establishmentName: newUser.establishment ? newUser.establishment.name : null,
        className: newUser.class ? newUser.class.name : null,
      },
    })
  } catch (error) {
    console.error("Erreur création utilisateur:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'utilisateur",
    })
  }
})

// Mettre à jour un utilisateur
router.put("/:id", authenticateToken, requireRole(["ADMIN"]), async (req, res) => {
  try {
    const { id } = req.params
    const { firstName, lastName, email, role, status, establishmentId, classId } = req.body

    // Vérifier si l'utilisateur existe
    const user = await models.users.findByPk(id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      })
    }

    // Mettre à jour l'utilisateur
    await user.update({
      firstName,
      lastName,
      email,
      role,
      status,
      establishmentId,
      classId: classId || null,
    })

    // Récupérer l'utilisateur mis à jour avec les infos liées
    const updatedUser = await models.users.findByPk(id, {
      include: [
        {
          model: models.establishments,
          as: "establishment",
          attributes: ["name"],
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
      message: "Utilisateur mis à jour avec succès",
      data: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        createdAt: updatedUser.createdAt,
        establishmentName: updatedUser.establishment ? updatedUser.establishment.name : null,
        className: updatedUser.class ? updatedUser.class.name : null,
      },
    })
  } catch (error) {
    console.error("Erreur mise à jour utilisateur:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de l'utilisateur",
    })
  }
})

// Supprimer un utilisateur (désactiver)
router.delete("/:id", authenticateToken, requireRole(["ADMIN"]), async (req, res) => {
  try {
    const { id } = req.params

    // Vérifier si l'utilisateur existe
    const user = await models.users.findByPk(id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      })
    }

    // Désactiver l'utilisateur
    await user.update({ status: "INACTIVE" })

    res.json({
      success: true,
      message: "Utilisateur supprimé avec succès",
    })
  } catch (error) {
    console.error("Erreur suppression utilisateur:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'utilisateur",
    })
  }
})

module.exports = router
