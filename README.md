# 🛒 Dominion Shop App

Une API REST pour la gestion d'une boutique en ligne, construite avec **Node.js**, **Express** et **PostgreSQL**.

## 🚀 Démarrage rapide

### Prérequis

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) & Docker Compose

### Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/davidnzoli/Dominion_shop_app.git
cd Dominion_shop_app

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditez .env avec vos valeurs

# 4. Démarrer la base de données PostgreSQL
docker-compose up -d

# 5. Lancer le serveur en mode développement
npm run dev
```

## ⚙️ Variables d'environnement

Copiez `.env.example` vers `.env` et renseignez :

| Variable         | Description                      | Défaut                             |
|------------------|----------------------------------|------------------------------------|
| `PORT`           | Port du serveur                  | `5001`                             |
| `DB_HOST`        | Hôte PostgreSQL                  | `localhost`                        |
| `DB_PORT`        | Port PostgreSQL                  | `5432`                             |
| `DB_USER`        | Utilisateur PostgreSQL           | `postgres`                         |
| `DB_PASSWORD`    | Mot de passe PostgreSQL          | —                                  |
| `DB_DATABASE`    | Nom de la base                   | `dominion-shop-db`                 |
| `JWT_SECRET`     | Clé secrète pour signer les JWT  | —                                  |
| `JWT_EXPIRES_IN` | Durée de validité du token       | `24h`                              |

## 📁 Structure du projet

```
Dominion_shop_app/
├── src/
│   ├── config/       # Configuration DB
│   ├── contollers/   # Logique métier (users, auth)
│   ├── data/         # Migrations SQL
│   ├── middlewares/  # Middlewares (error, authMiddleware)
│   ├── modeles/      # Requêtes SQL et modèles de données
│   └── routes/       # Routes API (userRoutes, authRoutes)
├── docker-compose.yml
├── .env.example
└── index.js
```

## 📡 Endpoints API

### Authentification (`/api/auth`)
| Méthode | Endpoint            | Accès    | Description                                      |
|---------|---------------------|----------|--------------------------------------------------|
| POST    | `/api/auth/register`| Public   | Inscription avec hachage bcrypt (retourne JWT 24h)|
| POST    | `/api/auth/login`   | Public   | Connexion par email / mot de passe (retourne JWT)|
| GET     | `/api/auth/me`      | Protégé  | Récupère le profil de l'utilisateur connecté     |

### Utilisateurs (`/api/user`)
| Méthode | Endpoint        | Accès    | Description                           |
|---------|-----------------|----------|---------------------------------------|
| GET     | `/api/user`     | Public   | Liste tous les utilisateurs           |
| GET     | `/api/user/:id` | Public   | Détail d'un utilisateur               |
| POST    | `/api/user`     | Public   | Créer un utilisateur                  |
| PUT     | `/api/user/:id` | Public   | Mettre à jour un utilisateur          |
| DELETE  | `/api/user/:id` | Public   | Supprimer un utilisateur              |

## 🛠️ Technologies

- **Runtime**: Node.js + ES Modules
- **Framework**: Express 5
- **Base de données**: PostgreSQL (via `pg`)
- **Sécurité**: `bcryptjs` (hachage sécurisé), `jsonwebtoken` (JWT 24h)
- **Validation**: Joi
- **Dev**: Nodemon

