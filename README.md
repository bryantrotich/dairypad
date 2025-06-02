# DairyPad Project

DairyPad is a full-stack application designed to manage societies, farmers, milk delivery, and employees efficiently. It provides a robust backend and a modern frontend to streamline operations for dairy businesses.

---

## Overview

- **Backend**: Built with [NestJS](https://nestjs.com) and TypeScript, the backend offers scalable and efficient server-side functionality. It includes modules for logging (using [Winston](https://github.com/winstonjs/winston)), validation, and database integration via [TypeORM](https://typeorm.io).
- **Frontend**: A client-side application powered by [Vite](https://vitejs.dev) and TypeScript, designed to provide an intuitive interface for managing societies, farmers, milk deliveries, and employees.

---

## Features

- **Society Management**: Create and manage societies, track their milk collection, and monitor performance.
- **Farmer Management**: Maintain farmer profiles, track milk contributions, and manage payments.
- **Milk Delivery Tracking**: Record and monitor milk deliveries, including quantity, quality, and delivery schedules.
- **Employee Management**: Manage employee profiles, roles, and responsibilities within the dairy ecosystem.

---

## Backend Setup

The backend code is located in the [`backend/`](backend/) directory.

### Prerequisites

- [Node.js](https://nodejs.org) (LTS version recommended)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) (for database management)

### Installation

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your database credentials and other configuration settings.

4. Start the backend server:
   ```bash
   npm run start
   ```
   The server will be available at `http://localhost:3000`.

---

## Frontend Setup

The frontend code is located in the [`frontend/`](frontend/) directory.

### Prerequisites

- [Node.js](https://nodejs.org) (LTS version recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with the backend API URL and other necessary settings.

4. Start the frontend application:
   ```bash
   npm run dev
   ```
   The client will be available at `http://localhost:5173`.

---

## Database Configuration

DairyPad uses [PostgreSQL](https://www.postgresql.org/) as the database. Ensure PostgreSQL is installed and running on your machine.

1. Create a new database for DairyPad.
2. Update the database connection settings in the backend `.env` file.

---

## Docker Setup

DairyPad supports containerization using [Docker](https://www.docker.com/).

### Running the Application with Docker

1. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

   This will start both the backend and frontend containers.

2. Stop the containers:
   ```bash
   docker-compose down
   ```

---

## Testing

### Backend Tests

Navigate to the `backend` directory and run:
```bash
npm run test
```

### Frontend Tests

Navigate to the `frontend` directory and run:
```bash
npm run test
```

---

## Troubleshooting

- **Dependency Issues**: Delete the `node_modules` folder and `package-lock.json`, then run `npm install` again.
- **Database Connection Issues**: Ensure PostgreSQL is running and the `.env` file contains the correct connection settings.
- **Application Fails to Start**: Check the logs for error messages and resolve any issues.

---

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b my-feature-branch
   ```
3. Make your changes and commit them with descriptive messages.
4. Push your branch:
   ```bash
   git push origin my-feature-branch
   ```
5. Open a pull request with a detailed description of your changes.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.