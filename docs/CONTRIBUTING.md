# Contributing to AGM Store Builder

Thank you for your interest in contributing to the AGM Store Builder project!

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Project Structure](#project-structure)
5. [Coding Standards](#coding-standards)
6. [Commit Guidelines](#commit-guidelines)
7. [Pull Request Process](#pull-request-process)
8. [Testing](#testing)
9. [Documentation](#documentation)
10. [Reporting Issues](#reporting-issues)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** 18.x or higher
- **MySQL** 8.0 or higher
- **Git** installed
- **Code editor** (VS Code recommended)
- Basic knowledge of TypeScript, Express.js, and MySQL

### Fork the Repository

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/agm-store-builder-backend.git
cd agm-store-builder-backend
```

3. Add upstream remote:

```bash
git remote add upstream https://github.com/shopwithagm/agm-store-builder-backend.git
```

---

## Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your local development values.

### 3. Setup Database

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE agm_store_builder_dev;"

# Run migrations
npm run migrate
```

### 4. Start Development Server

```bash
npm run dev
```

The API should now be running at `http://localhost:5000`

### 5. Verify Setup

```bash
# Check health
curl http://localhost:5000/health

# Run tests
npm test
```

---

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Express middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
├── types/           # TypeScript types
├── app.ts           # Express app setup
└── server.ts        # Server entry point

tests/
├── unit/            # Unit tests
├── integration/     # Integration tests
└── setup.ts         # Test setup

docs/
├── API.md           # API documentation
├── DATABASE.md      # Database documentation
├── DEPLOYMENT.md    # Deployment guide
└── CONTRIBUTING.md  # This file
```

---

## Coding Standards

### TypeScript Guidelines

**1. Use TypeScript strictly**

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  name: string;
}

function getUser(id: string): Promise<User> {
  // implementation
}

// ❌ Bad
function getUser(id: any): any {
  // implementation
}
```

**2. Use explicit types**

```typescript
// ✅ Good
const users: User[] = await userService.getAllUsers();

// ❌ Bad
const users = await userService.getAllUsers();
```

**3. Avoid 'any' type**

```typescript
// ✅ Good
function processData(data: unknown): ProcessedData {
  if (typeof data === 'object' && data !== null) {
    // process data
  }
}

// ❌ Bad
function processData(data: any): any {
  // process data
}
```

### Code Style

**1. Use async/await instead of callbacks**

```typescript
// ✅ Good
async function createUser(data: CreateUserData): Promise<User> {
  const user = await db.query('INSERT INTO users...');
  return user;
}

// ❌ Bad
function createUser(data: CreateUserData, callback: Function) {
  db.query('INSERT INTO users...', (err, result) => {
    callback(err, result);
  });
}
```

**2. Use arrow functions for callbacks**

```typescript
// ✅ Good
users.map(user => user.email);

// ❌ Bad
users.map(function(user) {
  return user.email;
});
```

**3. Use template literals**

```typescript
// ✅ Good
const message = `Welcome ${user.name}!`;

// ❌ Bad
const message = 'Welcome ' + user.name + '!';
```

**4. Use destructuring**

```typescript
// ✅ Good
const { email, password } = req.body;

// ❌ Bad
const email = req.body.email;
const password = req.body.password;
```

### Error Handling

**Always use try-catch for async functions:**

```typescript
// ✅ Good
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const user = await userService.createUser({ email, password });
  
  res.status(201).json({
    success: true,
    data: user
  });
});

// ❌ Bad
export const createUser = async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body); // No error handling
  res.json(user);
};
```

### Naming Conventions

```typescript
// Files: camelCase.ts
userController.ts
authService.ts

// Classes: PascalCase
class UserService {}

// Functions: camelCase
function getUserById() {}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;

// Interfaces: PascalCase
interface CreateUserData {}

// Enums: PascalCase
enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed'
}
```

### Comments

```typescript
/**
 * Create a new user account
 * @param data - User registration data
 * @returns Created user object
 * @throws {AppError} If email already exists
 */
async function createUser(data: CreateUserData): Promise<User> {
  // Validate email format
  if (!isValidEmail(data.email)) {
    throw errors.badRequest('Invalid email format');
  }
  
  // Check if user exists
  const existing = await findUserByEmail(data.email);
  if (existing) {
    throw errors.conflict('Email already registered');
  }
  
  // Create user
  return await db.users.create(data);
}
```

---

## Commit Guidelines

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(auth): add password reset functionality"

# Bug fix
git commit -m "fix(orders): correct total calculation for discounts"

# Documentation
git commit -m "docs(api): update payment endpoints documentation"

# Multiple lines
git commit -m "feat(products): add product filtering

- Add category filter
- Add price range filter
- Add search functionality

Closes #123"
```

### Commit Best Practices

1. **Keep commits atomic** - One logical change per commit
2. **Write clear messages** - Explain what and why, not how
3. **Reference issues** - Use `Closes #123` or `Fixes #456`
4. **Test before committing** - Ensure tests pass
5. **Don't commit sensitive data** - Check `.env` files

---

## Pull Request Process

### Before Submitting

1. **Update from upstream:**

```bash
git fetch upstream
git rebase upstream/main
```

2. **Run tests:**

```bash
npm test
npm run lint
```

3. **Build successfully:**

```bash
npm run build
```

4. **Update documentation** if needed

### Creating Pull Request

1. **Push to your fork:**

```bash
git push origin feature/your-feature-name
```

2. **Create PR on GitHub** with:
   - Clear title following commit conventions
   - Detailed description of changes
   - Screenshots/GIFs for UI changes
   - Link to related issues
   - Checklist of completed tasks

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Related Issues
Closes #123

## Screenshots (if applicable)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
- [ ] Dependent changes merged
```

### Review Process

1. **Automated checks** must pass (tests, linting, build)
2. **At least one approval** required from maintainers
3. **All conversations resolved** before merging
4. **Squash and merge** preferred for clean history

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- auth.test.ts

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Writing Tests

**Unit Test Example:**

```typescript
// filepath: tests/unit/services/userService.test.ts
import { createUser } from '../../../src/services/userService';
import { errors } from '../../../src/middleware/errorHandler';

describe('UserService - createUser', () => {
  it('should create a new user with valid data', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      full_name: 'Test User'
    };
    
    const user = await createUser(userData);
    
    expect(user).toBeDefined();
    expect(user.email).toBe(userData.email);
    expect(user.password).not.toBe(userData.password); // Should be hashed
  });
  
  it('should throw error for duplicate email', async () => {
    const userData = {
      email: 'existing@example.com',
      password: 'SecurePass123!',
      full_name: 'Test User'
    };
    
    await expect(createUser(userData)).rejects.toThrow();
  });
});
```

**Integration Test Example:**

```typescript
// filepath: tests/integration/auth.test.ts
import request from 'supertest';
import app from '../../src/app';

describe('POST /api/v1/auth/register', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'newuser@example.com',
        password: 'SecurePass123!',
        full_name: 'New User',
        phone: '08012345678'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe('newuser@example.com');
    expect(response.body.data.tokens).toBeDefined();
  });
});
```

---

## Documentation

### API Documentation

When adding new endpoints, update `docs/API.md`:

```markdown
### Create Product

**POST** `/products`

Create a new product.

**Request Body:**
```json
{
  "name": "Product Name",
  "price": 5000
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Product Name"
  }
}
```
```

### Code Documentation

Use JSDoc for functions:

```typescript
/**
 * Send order confirmation email
 * @param order - Order object
 * @param customer - Customer information
 * @returns Promise that resolves when email is sent
 * @example
 * await sendOrderConfirmation(order, customer);
 */
async function sendOrderConfirmation(
  order: Order,
  customer: Customer
): Promise<void> {
  // implementation
}
```

---

## Reporting Issues

### Bug Reports

**Use the bug report template:**

```markdown
**Describe the bug**
A clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g. Windows 10]
- Node version: [e.g. 20.0.0]
- Browser: [e.g. Chrome 120]

**Additional context**
Any other relevant information
```

### Feature Requests

**Use the feature request template:**

```markdown
**Is your feature request related to a problem?**
Description of the problem

**Describe the solution you'd like**
Clear description of what you want to happen

**Describe alternatives you've considered**
Alternative solutions or features

**Additional context**
Any other context or screenshots
```

---

## Development Workflow

### Branch Strategy

```
main (production)
  ↓
develop (staging)
  ↓
feature/feature-name (your work)
```

### Creating a Feature

```bash
# Create feature branch from develop
git checkout develop
git pull upstream develop
git checkout -b feature/add-product-filtering

# Make changes and commit
git add .
git commit -m "feat(products): add filtering by category"

# Push to your fork
git push origin feature/add-product-filtering

# Create pull request to develop branch
```

### Keeping Up-to-Date

```bash
# Fetch upstream changes
git fetch upstream

# Rebase your branch
git rebase upstream/develop

# Force push if needed (only on your feature branch)
git push origin feature/your-feature --force
```

---

## Getting Help

### Resources

- **Documentation**: https://docs.shopwithagm.com
- **API Reference**: [docs/API.md](./API.md)
- **Database Schema**: [docs/DATABASE.md](./DATABASE.md)
- **Deployment Guide**: [docs/DEPLOYMENT.md](./DEPLOYMENT.md)

### Contact

- **Email**: dev@shopwithagm.com
- **GitHub Discussions**: https://github.com/shopwithagm/api/discussions
- **Slack**: Join our [Slack workspace](https://shopwithagm.slack.com)

---

## Recognition

Contributors will be recognized in:
- **README.md** - Contributors section
- **CHANGELOG.md** - Release notes
- **GitHub** - Contributors page

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

**Thank you for contributing to AGM Store Builder! 🚀**

---

**Last Updated**: December 11, 2025  
**Version**: 1.0.0