# Student Management System

Application web full stack de gestion d'étudiants : ajouter, consulter, modifier, supprimer et rechercher des étudiants. Réalisée dans le cadre du stage **Full Stack Development – Auspify Technologies** (Tâche 2).

## Liens

| | Adresse |
|---|---|
| Application (frontend) | https://student-managementrima.netlify.app |
| API (backend) | https://student-management-api-7zpp.onrender.com |
| Code source | [https://github.com/LSIri2020/student-management-system.git] |

> **Remarque :** l'API est hébergée sur le plan gratuit de Render. Après quelques minutes d'inactivité, elle se met en veille, et le premier chargement peut prendre **30 à 60 secondes**. Ouvrez l'adresse de l'API une première fois, attendez sa réponse, puis rechargez l'application.

## Fonctionnalités

- Ajouter un étudiant (nom, email, filière, âge)
- Afficher la liste des étudiants
- Voir le détail d'un étudiant
- Modifier et supprimer un étudiant (avec confirmation avant suppression)
- Recherche par nom ou par filière
- Filtre par filière, tri par colonne et pagination
- Validation des formulaires (côté interface et côté serveur)
- Gestion des erreurs : email déjà utilisé, champs invalides, serveur injoignable
- Statistiques : nombre d'étudiants, âge moyen, nombre de filières
- Export de la liste au format CSV
- Interface responsive (ordinateur et téléphone)

## Technologies

| Partie | Technologies |
|---|---|
| Frontend | React (Vite), JavaScript, CSS |
| Backend | Node.js, Express.js |
| Base de données | MongoDB Atlas, Mongoose |
| Outils | Git et GitHub, Postman, VS Code |
| Déploiement | Netlify (frontend), Render (backend) |

## Structure du projet

```
student-management-system/
├── backend/
│   ├── models/Student.js       # Modèle de données et validations
│   ├── routes/students.js     # Routes CRUD de l'API
│   ├── server.js              # Serveur Express et connexion MongoDB
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Interface de l'application
│   │   └── App.css            # Styles
│   └── package.json
├── screenshots/               # Captures d'écran
└── README.md
```

## Modèle de données

| Champ | Type | Règles |
|---|---|---|
| `nom` | Texte | Obligatoire, 2 caractères minimum |
| `email` | Texte | Obligatoire, format valide, **unique** |
| `filiere` | Texte | Obligatoire |
| `age` | Nombre | Obligatoire, entre 15 et 100 |
| `createdAt`, `updatedAt` | Date | Ajoutés automatiquement |

## API REST

Adresse de base : `https://student-management-api-7zpp.onrender.com/api/students`

| Méthode | Route | Description | Codes de réponse |
|---|---|---|---|
| GET | `/api/students` | Lister les étudiants (option : `?search=texte`) | 200 |
| GET | `/api/students/:id` | Détail d'un étudiant | 200, 400, 404 |
| POST | `/api/students` | Ajouter un étudiant | 201, 400, 409 |
| PUT | `/api/students/:id` | Modifier un étudiant | 200, 400, 404, 409 |
| DELETE | `/api/students/:id` | Supprimer un étudiant | 200, 400, 404 |

Codes d'erreur : `400` données invalides ou identifiant incorrect, `404` étudiant introuvable, `409` email déjà utilisé.

**Exemple de requête (POST)**
```json
{
  "nom": "Sara Ben Ali",
  "email": "sara@mail.com",
  "filiere": "Informatique",
  "age": 21
}
```

**Exemple de réponse (201)**
```json
{
  "_id": "6af48a6a52b7d5fa8701893d",
  "nom": "Sara Ben Ali",
  "email": "sara@mail.com",
  "filiere": "Informatique",
  "age": 21,
  "createdAt": "2026-11-11T15:31:54.942Z",
  "updatedAt": "2026-11-11T15:31:54.942Z"
}
```

## Installation en local

### Prérequis
- [Node.js](https://nodejs.org) (version LTS)
- Un compte [MongoDB Atlas](https://www.mongodb.com/atlas) (gratuit) et une base de données
- Git

### 1. Cloner le dépôt
```bash
git clone [LIEN-GITHUB-DU-DEPOT]
cd student-management-system
```

### 2. Lancer le backend
```bash
cd backend
npm install
```

Créez un fichier `.env` dans le dossier `backend` avec les variables suivantes (renseignez vos propres valeurs) :

```env
PORT=
MONGO_URI=
CLIENT_URL=
```

| Variable | Rôle |
|---|---|
| `PORT` | Port du serveur (exemple : `5000`) |
| `MONGO_URI` | Adresse de connexion à votre base MongoDB Atlas |
| `CLIENT_URL` | Adresse du frontend autorisée à appeler l'API (exemple en local : `http://localhost:5173`) |

Démarrez le serveur :
```bash
npm run dev
```
Le terminal doit afficher `MongoDB connecté`.

### 3. Lancer le frontend
Dans un second terminal :
```bash
cd frontend
npm install
npm run dev
```
Ouvrez l'adresse affichée (en général `http://localhost:5173`).

Par défaut, le frontend appelle l'API de l'adresse définie dans `src/App.jsx`. Pour utiliser votre API locale, définissez `API` sur `http://localhost:5000/api/students`.

> Le fichier `.env` contient des informations secrètes : il est exclu du dépôt grâce au `.gitignore` et ne doit jamais être publié.

## Déploiement

- **Base de données :** MongoDB Atlas (accès réseau autorisé pour Render)
- **Backend :** Render (Web Service, dossier `backend`, commande de démarrage `npm start`, variables `MONGO_URI` et `CLIENT_URL` définies dans l'onglet Environment)
- **Frontend :** Netlify (dossier de base `frontend`, commande `npm run build`, dossier publié `dist`)

## Captures d'écran

### Ordinateur

| Liste des étudiants | Ajout d'un étudiant |
|---|---|
| ![Liste](screenshots/liste-desktop.png) | ![Ajout](screenshots/ajout-desktop.png) |

| Modification | Détail d'un étudiant |
|---|---|
| ![Modification](screenshots/modification-desktop.png) | ![Détail](screenshots/detail-desktop.png) |

| Validation du formulaire | Recherche et filtre |
|---|---|
| ![Validation](screenshots/validation-desktop.png) | ![Recherche](screenshots/recherche-desktop.png) |


## Améliorations possibles

- Authentification des utilisateurs (connexion administrateur)
- Pagination et tri côté serveur
- Tests automatisés de l'API

## Auteure

**Rima Werteteni**, développeuse Full Stack
- LinkedIn : https://linkedin.com/in/rima-werteteni
- GitHub : [https://github.com/LSIri2020/student-management-system.git]

Projet réalisé dans le cadre du stage Full Stack Development, Auspify Technologies.
