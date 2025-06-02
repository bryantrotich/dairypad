# Frontend Application

This is the frontend application for the Starter Project, built with [Vite](https://vitejs.dev) and TypeScript. It serves as the client-side interface for interacting with the backend API.

## Prerequisites

- Node.js (LTS recommended)
- npm

## Installation

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

## Environment Configuration

The application uses environment variables for configuration. These variables are defined in the `.env` file.

1. Copy the example `.env` file:
   ```bash
   cp .env.example .env
   ```
2. Update the `.env` file with the following values:
   - `VITE_APP_NAME`: The name of your application (e.g., `Starter App`).
   - `VITE_API_BASE_URL`: The base URL of the backend API (e.g., `http://localhost:3000/api/v1`).

## Running the Application

To start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## Building for Production

To build the application for production:
```bash
npm run build
```
The production-ready files will be generated in the `dist/` directory.

## Previewing the Production Build

To preview the production build locally:
```bash
npm run preview
```

## Testing

To run tests for the frontend application:
```bash
npm run test
```

## Troubleshooting

- If you encounter issues with dependencies, try deleting the `node_modules` folder and the `package-lock.json` file, then run `npm install` again.
- Ensure that the `VITE_API_BASE_URL` in the `.env` file matches the backend API URL.

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

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## Support

For issues, please check the documentation or open an issue in the repository.
