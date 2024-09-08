# HBV501GTasker

## Project Overview

**HBV501GTasker** is a full-stack web application designed to manage tasks efficiently. The backend is built using Spring Boot, while the frontend is developed using React. 

## Technologies Used

- **Backend**: Java, Spring Boot, Gradle (Kotlin DSL)
- **Database**: SQLite
- **Frontend**: React, JavaScript, HTML, CSS
- **Other Tools**: Prettier, ESLint, IntelliJ IDEA, Git, GitHub

## Installation

### Prerequisites

- **Java 17** or later
- **Node.js** and **npm** (for the frontend)
- **Gradle** (if not using wrapper)
- **Git**

### Clone the Repository

```bash
git clone https://github.com/mag115/HBV501GTasker.git
cd HBV501GTasker
```

### Run the project
#### Run backend
```bash
cd backend/
./gradlew build
./gradlew bootRun
```
Or use IntelliJ Run Spring Boot: TaskerApplication

Go to you browser and to localhost:8080

#### Run front end
```bash
cd frontend/
npm install
npm start
```

Go to your browser and to localhost:3000
