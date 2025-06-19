# TaskTrack2 - Task Manager Application

A modern task management application built with Angular frontend and Nest.js backend in an Nx monorepo.

## 🚀 Features

### Tasks Management

- ✅ Create, edit, delete tasks
- ✅ Filter tasks by status, category, title
- ✅ Sort and paginate tasks
- ✅ Task status: To Do, In Progress, Done
- ✅ Due date management
- ✅ Category assignment

### Categories Management

- ✅ View categories with task counts
- ✅ Assign tasks to categories
- ✅ Category-based task filtering

### Technical Features

- ✅ Modern Angular 20+ with standalone components
- ✅ Reactive forms with validation
- ✅ Tailwind CSS for styling
- ✅ Nest.js REST API with Swagger documentation
- ✅ TypeScript throughout
- ✅ Environment-based configuration

## 📋 Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- Git

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tasktrack2
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

## ⚙️ Environment Configuration

### Backend (Nest.js)

The backend runs on `http://localhost:3000` by default with the following configuration:

- **Port**: 3000 (configurable via `PORT` environment variable)
- **Global API Prefix**: `/api`
- **CORS**: Enabled for `http://localhost:4200` (Angular dev server)
- **Swagger Documentation**: Available at `http://localhost:3000/docs`

### Frontend (Angular)

The frontend is configured to connect to the backend via environment files:

#### Development Environment (`apps/angular-frontend/src/environments/environment.ts`)

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api',
};
```

#### Production Environment (`apps/angular-frontend/src/environments/environment.prod.ts`)

```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'http://localhost:3000/api',
};
```

### Customizing API URL

To change the API base URL:

1. **For Development**: Edit `apps/angular-frontend/src/environments/environment.ts`
2. **For Production**: Edit `apps/angular-frontend/src/environments/environment.prod.ts`
3. **For Different Environments**: Create new environment files and update `angular.json`

## 🚀 Running the Application

### Development Mode

#### Option 1: Start Both Applications Together (Recommended)

```bash
# Start both backend and frontend in one command
pnpm dev
```

#### Option 2: Start Applications Separately

1. **Start the Backend**

   ```bash
   # Terminal 1
   pnpm dev:backend
   # or
   npx nx serve nest-backend
   ```

   The backend will be available at `http://localhost:3000`

2. **Start the Frontend**
   ```bash
   # Terminal 2
   pnpm dev:frontend
   # or
   npx nx serve angular-frontend
   ```
   The frontend will be available at `http://localhost:4200`

### Production Build

1. **Build the Backend**

   ```bash
   npx nx build nest-backend
   ```

2. **Build the Frontend**

   ```bash
   npx nx build angular-frontend
   ```

3. **Serve Production Build**
   ```bash
   npx nx serve-static angular-frontend
   ```

## 📁 Project Structure

```
tasktrack2/
├── apps/
│   ├── angular-frontend/          # Angular application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── core/          # Core services, guards, interceptors
│   │   │   │   ├── features/      # Feature modules
│   │   │   │   │   ├── tasks/     # Tasks feature
│   │   │   │   │   └── categories/ # Categories feature
│   │   │   │   └── shared/        # Shared components, models, utilities
│   │   │   └── environments/      # Environment configuration
│   │   └── ...
│   └── nest-backend/              # Nest.js API
│       ├── src/
│       │   ├── tasks/             # Tasks module
│       │   ├── categories/        # Categories module
│       │   └── ...
│       └── ...
└── ...
```

## 🔧 Available Commands

### Nx Commands

```bash
# Development
npx nx serve angular-frontend     # Start Angular dev server
npx nx serve nest-backend         # Start Nest.js dev server

# Building
npx nx build angular-frontend     # Build Angular for production
npx nx build nest-backend         # Build Nest.js for production

# Testing
npx nx test angular-frontend      # Run Angular tests
npx nx test nest-backend          # Run Nest.js tests

# Linting
npx nx lint angular-frontend      # Lint Angular code
npx nx lint nest-backend          # Lint Nest.js code

# E2E Testing
npx nx e2e angular-frontend-e2e   # Run Angular E2E tests
```

### Package Manager Commands

```bash
# Install dependencies
pnpm install

# Development (start both backend and frontend)
pnpm dev

# Development (start individually)
pnpm dev:backend      # Start only backend
pnpm dev:frontend     # Start only frontend

# Build and test
pnpm build            # Build all projects
pnpm test             # Test all projects
pnpm lint             # Lint all projects

# Add new dependencies
pnpm add <package-name>           # Add to root
pnpm add <package-name> --filter=angular-frontend  # Add to Angular
pnpm add <package-name> --filter=nest-backend      # Add to Nest.js
```

## 🌐 API Endpoints

### Tasks

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PATCH /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Swagger Documentation

Visit `http://localhost:3000/docs` for interactive API documentation.

## 🔒 Environment Variables

### Backend Environment Variables

```bash
PORT=3000                    # Server port (default: 3000)
NODE_ENV=development         # Environment mode
```

### Frontend Environment Variables

The frontend uses Angular's environment system. See the `environments/` folder for configuration.

## 🧪 Testing

### Unit Tests

```bash
npx nx test angular-frontend
npx nx test nest-backend
```

### E2E Tests

```bash
npx nx e2e angular-frontend-e2e
```

### Test Coverage

```bash
npx nx test angular-frontend --coverage
npx nx test nest-backend --coverage
```

## 📦 Deployment

### Backend Deployment

1. Build the application: `npx nx build nest-backend`
2. The built files will be in `dist/apps/nest-backend`
3. Deploy the contents to your server
4. Set environment variables as needed

### Frontend Deployment

1. Build the application: `npx nx build angular-frontend`
2. The built files will be in `dist/apps/angular-frontend/browser`
3. Deploy the contents to your static hosting service
4. Update the environment configuration for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**

   - Ensure the backend is running on port 3000
   - Check that CORS is enabled in `main.ts`
   - Verify the frontend is running on port 4200

2. **API Connection Issues**

   - Check the `apiBaseUrl` in environment files
   - Ensure the backend is running and accessible
   - Verify the API endpoints match the backend routes

3. **Build Errors**

   - Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`
   - Clear Nx cache: `npx nx reset`
   - Check TypeScript errors: `npx nx lint angular-frontend`

4. **Port Conflicts**
   - Change the backend port: `PORT=3001 npx nx serve nest-backend`
   - Update the environment files accordingly

### Getting Help

- Check the [Nx documentation](https://nx.dev/)
- Review the [Angular documentation](https://angular.dev/)
- Review the [Nest.js documentation](https://docs.nestjs.com/)
