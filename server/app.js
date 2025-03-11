const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

const { errorHandler, notFound } = require("./middleware/errorHandler")

// Routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const courseRoutes = require("./routes/courses")
const qrcodeRoutes = require("./routes/qrcodes")
const signatureRoutes = require("./routes/signatures")
const alertRoutes = require("./routes/alerts")
const adminRoutes = require("./routes/admin")

const app = express()

// Middleware de sécurité
app.use(helmet())

// Configuration CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limite chaque IP à 1000 requêtes par windowMs
  message: {
    success: false,
    message: "Trop de requêtes, veuillez réessayer plus tard",
  },
})
app.use("/api/", limiter)

// Rate limiting spécial pour la connexion
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limite chaque IP à 5 tentatives de connexion par windowMs
  message: {
    success: false,
    message: "Trop de tentatives de connexion, veuillez réessayer plus tard",
  },
})
app.use("/api/auth/login", loginLimiter)

// Middleware pour parser le JSON
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Routes API
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/qrcodes", qrcodeRoutes)
app.use("/api/signatures", signatureRoutes)
app.use("/api/alerts", alertRoutes)
app.use("/api/admin", adminRoutes)

// Route de santé
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Serveur LetUsSign opérationnel",
    timestamp: new Date().toISOString(),
  })
})

// Middleware de gestion des erreurs
app.use(notFound)
app.use(errorHandler)

module.exports = app
