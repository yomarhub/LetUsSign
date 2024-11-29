# LetUsSign - Gestion des Présences Lyon

## 📝 Overview

LetUsSign est une application web moderne de gestion des présences pour les écoles de Lyon. Elle permet aux étudiants de signer leur présence de manière numérique et aux enseignants de suivre les présences en temps réel.

## ✨ Fonctionnalités

- 🔐 **Authentification Sécurisée** - Système de connexion pour les étudiants et les enseignants
- 📱 **Signature Numérique** - Possibilité de signer sa présence via:
  - Code QR
  - Signature tactile
  - Saisie manuelle de code
- 📊 **Suivi des Présences** - Interface intuitive pour visualiser:
  - L'historique des signatures
  - Les statistiques de présence
  - Les retards et absences
- 🎨 **Interface Moderne** - Design responsive et ergonomique

## 🛠️ Technologies Utilisées

- **Frontend:**
  - Next.js 15.3.3
  - React 19.1.0
  - Tailwind CSS
  - Radix UI Components
- **Backend:**
  - Node.js avec Express
  - MySQL avec Sequelize ORM
  - JWT pour l'authentification
  - API RESTful
- **UI/UX:**
  - Interface responsive
  - Thème personnalisé
  - Animations fluides
- **Sécurité:**
  - Authentification JWT
  - Protection des routes
  - Validation des données

## 🚀 Installation

### 1. Configuration du Backend

1. Clonez le repository:

```bash
git clone https://github.com/votre-username/let-us-sign.git
cd let-us-sign
```

2. Installez les dépendances du serveur:

```bash
cd server
npm install
```

3. Configurez l'environnement:

```bash
cp .env.example .env
# Modifiez les variables dans .env avec vos informations
```

4. Configurez la base de données:

```bash
# Assurez-vous que MySQL est installé et en cours d'exécution
npm run migrate
```

5. Démarrez le serveur:

```bash
npm run dev
```

Le serveur sera disponible sur http://localhost:3001

### 2. Configuration du Frontend

1. Dans un nouveau terminal, retournez à la racine du projet:

```bash
cd ..
```

2. Installez les dépendances du frontend:

```bash
npm install
```

3. Configurez l'environnement frontend:

```bash
cp .env.example .env.local
# Modifiez les variables si nécessaire
```

4. Lancez le serveur de développement:

```bash
npm run dev
```

5. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📦 Scripts Disponibles

### Frontend

- `npm run dev` - Lance le serveur de développement avec Turbopack
- `npm run build` - Crée une version de production
- `npm run start` - Démarre le serveur de production
- `npm run lint` - Vérifie le code avec ESLint

### Backend

- `npm run dev` - Lance le serveur en mode développement
- `npm start` - Lance le serveur en mode production
- `npm run migrate` - Applique les migrations de base de données

## 🌐 Déploiement

Le projet est automatiquement déployé sur Vercel à chaque push sur la branche principale.

## 👥 Comptes de Test

Après l'installation, ces comptes sont disponibles:

- **Admin**: admin@letussign.fr / demo123
- **Professeur**: prof@letussign.fr / demo123
- **Élève**: eleve@letussign.fr / demo123

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🔗 Liens Utiles

- [Documentation](https://votre-documentation.com)
- [README Server](server/README.md)