-- Space Odyssey - Version Interactive

-- Présentation du Projet

Ce projet s’inscrit dans le cadre de la formation YouCode.  
J’ai réalisé d’abord une version statique du site Space Odyssey en HTML et CSS, puis dans une deuxième étape j’ai ajouté des fonctionnalités interactives en utilisant JavaScript.

Le but du projet est de rendre le site plus vivant, en permettant à l’utilisateur d’interagir avec les pages : rechercher des missions, filtrer, gérer des favoris, valider des formulaires, etc.

---

--- Pages du Projet

-- 1. Page d’Accueil : `index.html`
Cette page présente le site et permet de naviguer vers les différentes sections.

-- 2. Page À propos : `about.html`
Contient des informations générales sur le thème du site.

-- 3. Page Planètes : `planets.html`
Présentation de quelques planètes avec description.

-- 4. Page Contact : `contact.html`
Cette page contient un formulaire que l’utilisateur peut remplir pour envoyer un message.
J’ai ajouté une validation JavaScript dans `contact-validation.js` :

- Vérification des champs obligatoires
- Vérification du format de l’email
- Messages d’erreurs affichés sous les champs

Si le formulaire est bien rempli, l’utilisateur est redirigé vers `contact-success.html`.

-- 5. Page Missions Spatiales : `mission.html`
C'est la page la plus importante du projet.
Les missions sont stockées dans un fichier `missions.json`.

Dans cette page, j’ai ajouté plusieurs fonctionnalités avec JavaScript :

- Affichage des missions sous forme de cartes
- Recherche par nom, agence, type ou année
- Filtrage dynamique sans rechargement de la page
- Ajout de missions (Create)
- Modification (Update)
- Suppression (Delete)

J’ai aussi ajouté un système de *favoris* :
- L’utilisateur peut ajouter une mission aux favoris
- Les favoris sont enregistrés dans le `localStorage`, donc ils restent même si la page est rechargée



 --Technologies Utilisées

- HTML pour la structure des pages
- CSS pour la mise en forme
- JavaScript pour l’interaction, les événements et les modifications du DOM
- JSON pour stocker les données des missions
- localStorage pour sauvegarder les favoris



