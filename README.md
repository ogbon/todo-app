# Todo App API

## Description
Resources Recommendation API

## Table of Content

- [System Setup](#system-setup)
- [Installation](#installation)
- [Testing](#testing)


### System Setup
Your system will need to have the following software installed:

  * [Node](https://nodejs.org/en/download/)
  * [Postgres](https://www.postgresql.org/)

## Installation
#### Step 1: Clone the repository

```bash
git clone <repo-url>
cd <project-directory>
```

#### Step 2: Setup database
Create a new postgres database

#### Step 3: Setup environment variables
Copy `.env.sample` to `.env` i.e `cp .env.sample .env`
Update DATABASE_URL with url of database created in Step 2
Update other variables if needed

#### Step 4: Install NPM packages
```bash
npm i
```

#### Step 5: Make database migration and seed data
```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

#### Step 6: Start in development mode
```bash
npm run dev
```

## Testing
```bash
npm run test
````