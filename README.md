# TaskTrack

A modern task management application built with **Angular** and **NestJS** in an **Nx monorepo**.

![TaskTrack](https://img.shields.io/badge/Angular-20+-red?style=flat&logo=angular)
![NestJS](https://img.shields.io/badge/NestJS-11+-red?style=flat&logo=nestjs)
![Nx](https://img.shields.io/badge/Nx-21+-blue?style=flat&logo=nx)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue?style=flat&logo=typescript)

## 🎯 Overview

TaskTrack is a full-stack task management application that helps you organize tasks with categories, track progress, and manage deadlines. Built with modern web technologies and best practices.

### ✨ Key Features

- **Task Management**: Create, edit, delete, and organize tasks
- **Category System**: Group tasks by categories with visual task counts
- **Status Tracking**: Track progress with To Do, In Progress, Done states
- **Advanced Filtering**: Filter by status, category, title, and date ranges
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Instant feedback and smooth user experience

## 🏗️ Architecture

This project uses an **Nx monorepo** structure for independent applications:

```
tasktrack/
├── apps/
│   ├── angular-frontend/     # Angular 20+ SPA
│   └── nest-backend/         # NestJS REST API
└── ...
```

### Tech Stack

- **Frontend**: Angular 20+ with standalone components, Tailwind CSS
- **Backend**: NestJS with TypeScript, Swagger documentation
- **Validation**: Zod schemas with project-specific DTOs
- **Build Tool**: Nx for monorepo management
- **Package Manager**: pnpm for fast, efficient dependency management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone and install
git clone <repository-url>
cd tasktrack
pnpm install

# Start development servers
pnpm dev
```

That's it! The application will be available at:

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000/api
- **API Docs**: http://localhost:3000/docs

## 📖 Development

### Available Scripts

```bash
# Development
pnpm dev                    # Start both frontend & backend
pnpm dev:frontend          # Start only Angular
pnpm dev:backend           # Start only NestJS

# Building
pnpm build                 # Build all projects
npx nx build angular-frontend
npx nx build nest-backend

# Testing
pnpm test                  # Run all tests
pnpm lint                  # Lint all code
```

### Project Structure

```
apps/
├── angular-frontend/
│   ├── src/app/
│   │   ├── core/          # Services, interceptors
│   │   ├── features/      # Feature modules
│   │   │   ├── tasks/     # Task management
│   │   │   └── categories/ # Category management
│   │   └── shared/        # Shared components
│   └── ...
└── nest-backend/
    ├── src/
    │   ├── tasks/         # Task API endpoints
    │   ├── categories/    # Category API endpoints
    │   └── common/        # Shared utilities
    └── ...
```

## 🔧 Configuration

### Environment Setup

The application uses environment-based configuration:

- **Development**: `apps/angular-frontend/src/environments/environment.ts`
- **Production**: `apps/angular-frontend/src/environments/environment.prod.ts`

### API Configuration

Update the `apiBaseUrl` in environment files to point to your backend:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api',
};
```

## 📦 Deployment

### Backend (NestJS)

```bash
npx nx build nest-backend
# Deploy dist/apps/nest-backend to your server
```

### Frontend (Angular)

```bash
npx nx build angular-frontend
# Deploy dist/apps/angular-frontend/browser to static hosting
```

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

- **CORS Errors**: Ensure backend (port 3000) and frontend (port 4200) are running
- **Build Errors**: Try `npx nx reset` to clear cache
- **Memory Issues**: Increase Node.js memory with `export NODE_OPTIONS="--max-old-space-size=4096"`

### Getting Help

- [Nx Documentation](https://nx.dev/)
- [Angular Documentation](https://angular.dev/)
- [NestJS Documentation](https://docs.nestjs.com/)
