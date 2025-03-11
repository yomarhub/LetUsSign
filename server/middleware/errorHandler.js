const errorHandler = (err, req, res, next) => {
  console.error("Erreur:", err)

  // Erreur de validation Prisma
  if (err.code === "P2002") {
    return res.status(400).json({
      success: false,
      message: "Cette valeur existe déjà",
      error: "DUPLICATE_ENTRY",
    })
  }

  // Erreur de contrainte Prisma
  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Ressource non trouvée",
      error: "NOT_FOUND",
    })
  }

  // Erreur JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Token invalide",
      error: "INVALID_TOKEN",
    })
  }

  // Erreur de validation
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Données invalides",
      errors: err.errors,
    })
  }

  // Erreur par défaut
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Erreur interne du serveur",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}

const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} non trouvée`,
  })
}

module.exports = {
  errorHandler,
  notFound
}
