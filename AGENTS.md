# Agent Documentation

This file contains information for AI coding agents working with this project.

## Deployment

See `./DEPLOYMENT.md` for deployment status, logs, troubleshooting, pipeline setup, and next steps.

## Project Structure

- `src/` - React application source code
- `public/` - Static assets
- `build/` - Production build output
- `infra/` - AWS CDK infrastructure as code
- `scripts/` - Deployment and utility scripts
- `tests/` - Test files

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

## Deployment Commands

```bash
# Deploy to preview environment
./scripts/deploy.sh

# Deploy to specific environment
./scripts/deploy.sh dev
./scripts/deploy.sh prod
```

## Technology Stack

- Framework: React (Create React App)
- UI: Bootstrap 5
- Build tool: react-scripts
- Package manager: npm
- Infrastructure: AWS CDK (TypeScript)
- Hosting: CloudFront + S3
