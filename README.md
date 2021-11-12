# Test Technique - Node REST API

Ce projet est une réalisation qui m'a été demandée en tant que test technique.
L'objectif était de fork un projet initial d'API REST gérant des items d'une todo list et de réaliser les tâches suivantes, en apportant des suggestions d'amélioration:
- Implémenter un middleware de gestion d'erreur centralisée
- Créer un test unitaire pour la fonction de mise à jour du contrôleur des todo
- Ajouter un champ de catégories au todo, avec gestion de celles-ci (opérations CRUD) via l'API REST

Des explications détaillées sur le cheminement et les possibilités d'alternatives ou d'amélioration sont détaillées dans les pull requests.

## Prérequis
- NodeJS
- MongoDB (ou Docker pour utiliser le `docker-compose.yaml` fourni)

## Lancement
1. Lancer MongoDB selon votre installation
2. `npm install`
3. `npm start`

## Utilisation

### Schemas
#### TodoItem
Voir [/api/model/todoItem.js](/api/model/todoItem.js)
#### Category
Voir [/api/model/category.js](/api/model/category.js)
### Routes
Voir [/api/route/index.js](/api/route/index.js)
