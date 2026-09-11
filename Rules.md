# RULES.md

> **Project:** WildConnect  
> **Version:** 1.0  
> **Purpose:** This document defines the development standards, coding conventions, libraries, best practices, and rules that every contributor must follow to ensure a consistent, maintainable, and scalable codebase.

---

# Table of Contents

1. Development Principles
2. Technology Stack
3. Approved Libraries
4. Libraries to Avoid
5. Project Structure Rules
6. Backend Rules
7. Frontend Rules
8. API Rules
9. Database Rules
10. Authentication Rules
11. Validation Rules
12. Error Handling Rules
13. Logging Rules
14. Naming Conventions
15. Git Rules
16. Performance Rules
17. Security Rules
18. Testing Rules
19. Code Review Checklist
20. General Do's & Don'ts

---

# 1. Development Principles

Every piece of code should follow these principles:

- Keep code simple.
- Write reusable code.
- Avoid duplication (DRY).
- Follow Single Responsibility Principle.
- Prefer composition over duplication.
- Write readable code before clever code.
- Use TypeScript everywhere.
- Keep functions small and focused.
- Separate business logic from database logic.
- Maintain consistent folder structure.

---

# 2. Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Standard CSS (Vanilla CSS)
- React Router DOM
- Axios
- React Hook Form
- Zod
- Lucide React
- React Hot Toast

---

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt
- Zod
- dotenv
- CORS

---

# 3. Approved Libraries

## Backend

| Purpose | Library |
|----------|----------|
| Server | Express |
| ORM | Prisma |
| Database | PostgreSQL |
| Validation | Zod |
| Password Hashing | bcrypt |
| Authentication | jsonwebtoken |
| Environment Variables | dotenv |
| CORS | cors |

---

## Frontend

| Purpose | Library |
|----------|----------|
| UI | React |
| Routing | React Router DOM |
| Styling | Standard CSS (Vanilla CSS) |
| Forms | React Hook Form |
| Validation | Zod |
| HTTP Client | Axios |
| Icons | Lucide React |
| Notifications | React Hot Toast |

---

# 4. Libraries to Avoid

Avoid adding libraries unless there is a strong technical reason.

Do **NOT** use:

- jQuery
- Moment.js (prefer native Date APIs)
- Redux (Context API is sufficient for V1)
- Multiple UI frameworks together
- Multiple HTTP libraries
- Any deprecated package

Before adding a new dependency:

- Check if an existing library already solves the problem.
- Evaluate maintenance and community support.
- Keep the dependency list minimal.

---

# 5. Project Structure Rules

- One responsibility per folder.
- One module per feature.
- Keep files organized by feature.
- Avoid deeply nested folders.
- Do not mix frontend and backend code.
- Documentation belongs in `/docs`.

---

# 6. Backend Rules

## Controllers

Controllers should:

- Receive requests
- Validate request flow
- Call services
- Return responses

Controllers should **NOT**:

- Query the database directly
- Contain business logic
- Contain Prisma queries

---

## Services

Services should:

- Contain business logic
- Handle validations
- Coordinate repositories

Services should **NOT**:

- Return HTTP responses
- Access Express request/response objects

---

## Repositories

Repositories should:

- Perform database operations
- Use Prisma only
- Return database results

Repositories should **NOT**:

- Contain business logic
- Access Express objects

---

# 7. Frontend Rules

Pages should:

- Compose layouts and components
- Call hooks/services

Pages should **NOT**:

- Contain API logic
- Contain large business logic

---

Components should:

- Be reusable
- Receive data via props
- Be small and focused

Components should **NOT**:

- Fetch data directly unless specifically designed for it
- Contain unrelated logic

---

Hooks should:

- Encapsulate reusable logic
- Start with `use`

Example:

```text
useAuth()

useFetch()

useBooking()
```

---

# 8. API Rules

Follow RESTful conventions.

Examples:

```text
GET    /api/resorts

GET    /api/resorts/:id

POST   /api/resorts

PUT    /api/resorts/:id

PATCH  /api/resorts/:id

DELETE /api/resorts/:id
```

Rules:

- Use nouns, not verbs.
- Use plural resource names.
- Return proper HTTP status codes.
- Keep response format consistent.

---

## Standard Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

## Standard Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

# 9. Database Rules

- Never write raw SQL unless necessary.
- Always use Prisma.
- Use migrations for schema changes.
- Normalize database tables.
- Use foreign keys.
- Use indexes where appropriate.
- Do not store duplicate data.

---

# 10. Authentication Rules

- Hash passwords using bcrypt.
- Never store plain-text passwords.
- Protect private routes.
- Validate JWT tokens.
- Use role-based authorization.
- Never expose secrets to the frontend.

---

# 11. Validation Rules

All incoming data must be validated.

Backend:

- Zod validation
- Required fields
- Type checking
- Business rule validation

Frontend:

- React Hook Form
- Zod schema validation

Never trust client-side validation alone.

---

# 12. Error Handling Rules

## Backend

Use centralized error handling middleware.

Do:

- Return meaningful messages
- Use appropriate HTTP status codes
- Log unexpected errors

Don't:

- Expose stack traces
- Leak database details
- Return generic 200 responses for failures

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

## Frontend

Display friendly error messages.

Examples:

- "Invalid email or password."
- "Something went wrong. Please try again."
- "Network error. Check your internet connection."

Never display raw server errors to users.

---

# 13. Logging Rules

Development:

- Log requests
- Log validation errors
- Log server startup

Production:

- Log only important events
- Never log passwords
- Never log JWT tokens
- Never log sensitive user information

---

# 14. Naming Conventions

## Files

```text
auth.controller.ts

booking.service.ts

user.repository.ts

login.validator.ts

HomePage.tsx

Navbar.tsx
```

---

## Variables

```typescript
const userName

const tripRequest

const bookingStatus
```

---

## Constants

```typescript
MAX_BOOKINGS

JWT_SECRET

USER_ROLES
```

---

## Interfaces

```typescript
interface User

interface Booking
```

---

## Types

```typescript
type UserRole

type BookingStatus
```

---

# 15. Git Rules

Branch naming:

```text
feature/auth

feature/resorts

feature/bookings

bugfix/login

hotfix/token
```

---

Commit messages:

```text
feat: add booking module

fix: correct login validation

docs: update API documentation

refactor: simplify auth service

test: add booking tests

chore: update dependencies
```

---

# 16. Performance Rules

- Use pagination for large datasets.
- Lazy load pages where appropriate.
- Optimize database queries.
- Avoid unnecessary API calls.
- Reuse components.
- Keep bundle size small.

---

# 17. Security Rules

- Never commit `.env` files.
- Validate all user input.
- Sanitize incoming data where necessary.
- Protect admin routes.
- Use HTTPS in production.
- Keep dependencies updated.
- Use least-privilege access.

---

# 18. Testing Rules

Every feature should be tested before merging.

Checklist:

- API works correctly.
- Validation works.
- Authentication works.
- Authorization works.
- Edge cases handled.
- UI behaves as expected.
- No console errors.

---

# 19. Code Review Checklist

Before merging code, verify:

- [ ] Code follows project structure.
- [ ] No duplicated logic.
- [ ] Naming conventions followed.
- [ ] Validation implemented.
- [ ] Error handling included.
- [ ] No unused imports.
- [ ] No commented-out code.
- [ ] Environment variables used correctly.
- [ ] Documentation updated (if required).

---

# 20. General Do's & Don'ts

## ✅ Do

- Write clean, readable code.
- Keep modules independent.
- Reuse components and utilities.
- Handle all errors gracefully.
- Document important decisions.
- Follow TypeScript best practices.
- Write meaningful commit messages.
- Keep dependencies minimal.

---

## ❌ Don't

- Don't hardcode secrets.
- Don't duplicate code.
- Don't skip validation.
- Don't mix business logic with controllers.
- Don't write raw SQL without justification.
- Don't ignore TypeScript errors.
- Don't leave `console.log()` statements in production code.
- Don't commit `.env` files.
- Don't install unnecessary libraries.
- Don't merge untested code.

---

# Summary

Following these rules ensures that WildConnect remains:

- Clean and maintainable
- Secure by default
- Easy to scale
- Consistent across contributors
- Production-ready
- Simple to understand and extend

Every contributor is expected to follow this document throughout the development lifecycle.