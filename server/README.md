# LetUsSign Backend API

Backend Node.js avec Express et Prisma pour l'application LetUsSign de gestion des présences.

## 🚀 Installation

1. **Cloner et installer les dépendances**
```bash
cd server
npm install
```

2. **Configuration de l'environnement**
```bash
cp .env.example .env
# Modifier les variables dans .env
```

3. **Configuration de la base de données**
```bash
# Générer le client Prisma
npm run generate

# Appliquer les migrations et seeder
npm run migrate
```

4. **Démarrer le serveur**
```bash
# Développement
npm run dev

# Production
npm start
```

## 📡 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Profil utilisateur
- `POST /api/auth/refresh` - Rafraîchir le token

### Utilisateurs
- `GET /api/users` - Liste des utilisateurs (Admin)
- `POST /api/users` - Créer un utilisateur (Admin)
- `PUT /api/users/:id` - Modifier un utilisateur (Admin)
- `DELETE /api/users/:id` - Supprimer un utilisateur (Admin)

### Cours
- `GET /api/courses` - Liste des cours
- `GET /api/courses/today` - Cours du jour
- `POST /api/courses` - Créer un cours
- `PUT /api/courses/:id` - Modifier un cours
- `DELETE /api/courses/:id` - Supprimer un cours

### QR Codes
- `POST /api/qrcodes/generate` - Générer un QR code
- `GET /api/qrcodes/active` - QR codes actifs
- `POST /api/qrcodes/validate` - Valider un QR code

### Signatures
- `POST /api/signatures/sign` - Signer la présence
- `GET /api/signatures` - Liste des signatures
- `POST /api/signatures/manual` - Marquage manuel

### Alertes
- `GET /api/alerts` - Liste des alertes
- `PATCH /api/alerts/:id/read` - Marquer comme lu
- `PATCH /api/alerts/read-all` - Tout marquer comme lu

### Administration
- `GET /api/admin/stats` - Statistiques générales
- `GET /api/admin/attendance-stats` - Statistiques de présence
- `POST /api/admin/cleanup` - Nettoyage automatique
- `GET /api/admin/classes` - Liste des classes

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification. Incluez le token dans l'en-tête Authorization :

```
Authorization: Bearer <votre-token>
```

## 👥 Rôles et Permissions

- **ADMIN** : Accès complet à toutes les fonctionnalités
- **PROFESSOR** : Gestion de ses cours et QR codes
- **STUDENT** : Signature de présence et consultation de ses données

## 📊 Base de Données

Le projet utilise Sequelize ORM avec MySQL. Le schéma inclut :

- **Users** : Utilisateurs (admin, professeurs, étudiants)
- **Establishments** : Établissements scolaires
- **Classes** : Classes d'étudiants
- **Courses** : Cours programmés
- **QRCodes** : Codes QR pour les signatures
- **Signatures** : Signatures de présence
- **Alerts** : Alertes et notifications

## 🛠️ Scripts Disponibles

- `npm run dev` - Démarrer en mode développement
- `npm start` - Démarrer en production
- `npm run migrate` - Appliquer les migrations
- `npm run generate` - Générer le client Prisma
- `npm run studio` - Ouvrir Prisma Studio

## 🔧 Configuration

Variables d'environnement importantes :

```env
DATABASE_URL="mysql://user:password@localhost:3306/letussign"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

## 📝 Comptes de Test

Après le seeding, ces comptes sont disponibles :

- **Admin** : admin@letussign.fr / demo123
- **Professeur** : prof@letussign.fr / demo123
- **Élève** : eleve@letussign.fr / demo123

## 🚀 Déploiement

1. Configurer les variables d'environnement
2. Installer les dépendances : `npm install`
3. Appliquer les migrations : `npm run migrate`
4. Démarrer : `npm start`

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement.
