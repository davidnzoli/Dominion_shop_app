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

| Variable      | Description              | Défaut          |
|---------------|--------------------------|-----------------|
| `PORT`        | Port du serveur          | `5001`          |
| `DB_HOST`     | Hôte PostgreSQL          | `localhost`     |
| `DB_PORT`     | Port PostgreSQL          | `5432`          |
| `DB_USER`     | Utilisateur PostgreSQL   | `postgres`      |
| `DB_PASSWORD` | Mot de passe PostgreSQL  | —               |
| `DB_DATABASE` | Nom de la base           | `dominion-shop-db` |

## 📁 Structure du projet

```
Dominion_shop_app/
├── src/
│   ├── config/       # Configuration DB
│   ├── controllers/  # Logique métier
│   ├── middlewares/  # Middlewares Express
│   ├── models/       # Modèles de données
│   └── routes/       # Routes API
├── docker-compose.yml
├── .env.example
└── index.js
```

## 📡 Endpoints API

| Méthode | Endpoint       | Description              |
|---------|----------------|--------------------------|
| GET     | `/`            | Vérification de la DB    |
| `*`     | `/api/...`     | Routes utilisateurs      |

## 🛠️ Technologies

- **Runtime**: Node.js + ES Modules
- **Framework**: Express 5
- **Base de données**: PostgreSQL (via `pg`)
- **Validation**: Joi
- **Dev**: Nodemon
