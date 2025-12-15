# FullStack_ShopMarket

# Guide de lancement du projet

Ce projet utilise GitHub Actions pour l'intégration continue (CI) et respecte les bonnes conventions et pratiques de codage listées ci-dessous.

## 📋 Prérequis et installation pour lancer le front en Stand Alone

1. Configuration de Node.js (version ≥ 20)
   Le projet utilise derniere version de React > 19.0.0 , qui nécessite Node.js version 20 ou supérieure. Nous recommandons l'utilisation de nvm pour gérer les versions de Node.

```
# Installer nvm (si ce n'est pas déjà fait)
# Suivez les instructions sur : https://github.com/nvm-sh/nvm

# Installer Node.js v20
nvm install v20

# Utiliser Node.js v20
nvm use v20

# Vérifier la version installée
node --version
```

2. Installation des dépendances

```
npm i
```

3. Lancer l'API

4. Lancement du projet frontend

```
npm run start
```

# 🚀 Workflow & Bonnes pratiques Git

Ce projet s’appuie sur **GitHub Actions** pour garantir la qualité du code et la cohérence du workflow.

Deux workflows principaux sont configurés : **validation des commits/branches** et **CI Node.js**.

---

## ✅ Vérification des commits et branches

Workflow : **`check-commits`**

> Déclenché automatiquement sur chaque **push** et **pull request**.

### 📌 Règles de commit

Chaque message de commit doit suivre le format :

<type>: description courte

markdown

Copier le code

**Types acceptés :**

- `feature` → ajout de fonctionnalités

- `fix` / `bugfix` → corrections de bugs

- `hotfix` → correction urgente

- `chore` → maintenance / configuration

- `docs` → documentation

- `style` → formatage / style

- `refactor` → refactorisation

- `test` → ajout ou modification de tests

- `perf` → optimisation des performances

**Exemples corrects :**

feature: implémentation du module d’authentification

fix: correction du bug sur le formulaire d’inscription

yaml

Copier le code

---

### 📌 Règles de nom de branche

Une branche doit être nommée de la façon suivante :

main | develop | <type>/<nom-de-branche>

markdown

Copier le code

**Types acceptés :** `feature`, `fix`, `bugfix`, `hotfix`, `chore`, `docs`, `style`, `refactor`, `release`, `test`, `perf`

**Exemples corrects :**

feature/login

fix/navbar-bug

hotfix/events-affichage

markdown

Copier le code

> 🔒 Si le nom de la branche ne correspond pas à ce format, le workflow échoue.

> Avec la **protection de branche GitHub**, le merge sera alors impossible.

---

## 🛠️ Intégration Continue Node.js

Workflow : **`Node.js CI`**

> Déclenché sur **push** et **pull request**.

### Étapes exécutées

1. Récupération du code (`checkout`).

2. Installation de **Node.js** avec cache npm.

3. Installation des dépendances (`npm install`).

4. Vérification du code (`npm run lint`).

5. Build du projet (`npm run build`).

6. Lancement des tests (`npm run test`).

7. Vérification de la couverture (`npm run test:cov`).

⚠️ Si une étape échoue, le workflow passe en **failed** → le merge est bloqué si la protection de branche est activée.

---

## 📖 Bonnes pratiques à respecter

- Toujours créer une branche à partir de `develop` ou `main`.

- Respecter le format des **messages de commit** et **noms de branches**.

- Vérifier que les tests passent avant d’ouvrir une Pull Request.

- Les branches `main` et `develop` doivent rester stables et validées par CI.

```

```
