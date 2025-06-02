# Starter Project

This repository contains a full-stack application with separate backend and frontend directories.

## Overview

- **Backend**: Built with [NestJS](https://nestjs.com) and TypeScript. It provides a scalable and efficient server-side application featuring modules such as logging (using [Winston](https://github.com/winstonjs/winston)), validation, and database integration via [TypeORM](https://typeorm.io).
- **Frontend**: A client-side application using Vite and TypeScript, structured to work seamlessly with the backend API.

## Backend Setup

The backend is located in the [backend/](backend/) directory.

### Prerequisites

- Node.js (LTS recommended)
- npm

### Installation

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables by copying the example file:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your database and other configuration settings.

4. Run the application:
   ```bash
   npm run start
   ```
   The server should now be running on `http://localhost:3000`.

## Frontend Setup

The frontend is located in the [frontend/](frontend/) directory.

### Prerequisites

- Node.js (LTS recommended)
- npm

### Installation

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables by copying the example file:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with the backend API URL and other configuration settings.

4. Run the application:
   ```bash
   npm run dev
   ```
   The client should now be running on `http://localhost:5173`.

## Database

This project uses [PostgreSQL](https://www.postgresql.org/) as the database. Ensure that PostgreSQL is installed and running on your machine. Create a database and update the connection settings in the backend `.env` file.

## Docker Setup

Docker is used for containerization in this project. Ensure that [Docker](https://www.docker.com/) is installed on your machine.

### Running with Docker

To build and run the application with Docker, use the following command in the root of the project:

```bash
docker-compose up --build
```

This command will build the Docker images and start the containers for both the backend and frontend applications.

### Stopping Docker Containers

To stop the running containers, use the following command:

```bash
docker-compose down
```

## Testing

To run the tests for the backend application, navigate to the `backend` directory and run:

```bash
npm run test
```

For the frontend application, navigate to the `frontend` directory and run:

```bash
npm run test
```

## Troubleshooting

- If you encounter issues with dependencies, try deleting the `node_modules` folder and the `package-lock.json` file, then run `npm install` again.
- For database connection issues, ensure that the PostgreSQL service is running and the connection settings in the `.env` file are correct.
- If the application fails to start, check the logs for error messages and resolve any issues indicated.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b my-feature-branch
   ```
3. Make your changes and commit them with descriptive messages.
4. Push your branch to your forked repository:
   ```bash
   git push origin my-feature-branch
   ```
5. Submit a pull request detailing your changes and the problem they solve.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

