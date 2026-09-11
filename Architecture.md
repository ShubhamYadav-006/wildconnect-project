# WildConnect - System Architecture Document

**Version:** 1.0  
**Status:** Approved for Development  
**Project Type:** Startup MVP + Final Year Project  
**Document Owner:** WildConnect Team  
**Last Updated:** July 2026

---

# Table of Contents

## Phase 1 — Foundation Architecture

1. Document Information
2. Architecture Overview
3. Design Principles
4. High-Level System Architecture
5. Technology Stack
6. Development Philosophy
7. System Components
8. Architecture Decisions
9. Project Directory Overview

---

## Phase 2 — Application Architecture

10. Backend Architecture
11. Frontend Architecture
12. Database Architecture Overview
13. Request Lifecycle
14. Authentication Flow
15. Website Navigation Flow
16. User Journey Flow
17. Module Interaction Flow
18. API Architecture

---

## Phase 3 — Project Structure

19. Complete Project Structure
20. Backend Folder Structure
21. Frontend Folder Structure
22. File Naming Conventions
23. Component Organization
24. Route Organization
25. API Organization
26. Environment Configuration
27. Coding Standards
28. Reusable Component Strategy

---

## Phase 4 — Development & Scalability

29. Security Architecture
30. State Management
31. Error Handling Strategy
32. Logging Strategy
33. Deployment Architecture
34. Performance Considerations
35. Scalability Strategy
36. Future Architecture (V2)
37. Development Workflow
38. Architecture Summary

---

# Document Purpose

This document serves as the technical blueprint for the WildConnect platform.

It explains how the application is structured, how different components interact, the technologies used, project organization, development standards, and architectural decisions.

This document should be referenced throughout the development lifecycle to ensure consistency across the frontend, backend, and database.

---

# Intended Audience

This document is intended for:

- Developers
- Project Contributors
- Technical Reviewers
- Mentors
- Future Team Members
- Project Maintainers

---

# Related Documents

- PRD.md
- DATABASE.md
- API.md
- UI_GUIDELINES.md
- DEVELOPMENT_ROADMAP.md
- README.md

---

> **Note:** This document focuses on the technical architecture of WildConnect. Product requirements, business goals, and feature specifications are documented separately in the Product Requirements Document (PRD).




# Phase 2 — Application Architecture

This phase explains how different parts of WildConnect communicate with each other, how user requests are processed, how authentication works, and how users navigate through the platform.

---

# 10. Backend Architecture

The backend follows a **Layered Architecture (Controller → Service → Repository)** to ensure maintainability, scalability, and separation of concerns.

Each layer has a dedicated responsibility.

```text
                    Client Request
                          │
                          ▼
                      API Route
                          │
                          ▼
                     Controller
                          │
                          ▼
                       Service
                          │
                          ▼
                    Repository
                          │
                          ▼
                     Prisma ORM
                          │
                          ▼
                   PostgreSQL Database
```

### Route Layer

Responsible for:

- Defining API endpoints
- Applying middleware
- Forwarding requests to controllers

---

### Controller Layer

Responsible for:

- Receiving HTTP requests
- Validating request flow
- Calling business services
- Returning API responses

Controllers do not contain business logic.

---

### Service Layer

Responsible for:

- Business rules
- Validation logic
- Data processing
- Combining multiple operations

This is the heart of the application.

---

### Repository Layer

Responsible for:

- Database operations
- Prisma queries
- CRUD operations
- Returning data to services

Repositories never contain business logic.

---

### Prisma ORM

Responsible for:

- Database communication
- Type-safe queries
- Migrations
- Relationship management

---

### PostgreSQL Database

Stores all application data including:

- Users
- Destinations
- Safari Gates
- Resorts
- Trip Requests
- Proposals
- Bookings
- Articles
- Experiences
- Notifications

---

# 11. Frontend Architecture

The frontend follows a **Component-Based Architecture** using React and TypeScript.

Every screen is built using reusable components.

```text
Page
 │
 ▼
Layout
 │
 ▼
Components
 │
 ▼
Custom Hooks
 │
 ▼
API Services
 │
 ▼
Backend API
```

### Pages

Responsible for:

- Rendering complete screens
- Combining layouts and components

Examples:

- Home
- Destinations
- Login
- Dashboard

---

### Layouts

Responsible for:

- Shared page structure
- Navigation
- Footer
- Sidebar

Layouts reduce code duplication.

---

### Components

Reusable UI elements such as:

- Navbar
- Footer
- Cards
- Buttons
- Forms
- Tables
- Modals

---

### Hooks

Responsible for:

- Reusable frontend logic
- Authentication
- API state
- Form handling

---

### Services

Responsible for:

- API communication
- Axios configuration
- Request handling

---

# 12. Database Architecture Overview

WildConnect uses a **Relational Database** powered by PostgreSQL.

Prisma ORM acts as the communication layer between the backend and database.

The database follows normalization principles to reduce redundancy while maintaining efficient relationships.

Core entities include:

- Users
- Destinations
- Safari Gates
- Resorts
- Trip Requests
- Proposals
- Bookings
- Articles
- Experiences
- Notifications

Detailed schema and relationships are documented separately in **DATABASE.md**.

---

# 13. Request Lifecycle

Every request follows the same processing flow.

```text
User

↓

React Component

↓

Axios Request

↓

Express Route

↓

Controller

↓

Service

↓

Repository

↓

Prisma ORM

↓

PostgreSQL

↓

Repository

↓

Service

↓

Controller

↓

JSON Response

↓

Frontend UI
```

This consistent flow improves maintainability and simplifies debugging.

---

# 14. Authentication Flow

WildConnect uses **JWT-based Authentication**.

```text
User Registers

↓

Password Hashed (bcrypt)

↓

User Stored in Database

↓

User Logs In

↓

Credentials Verified

↓

JWT Generated

↓

Token Returned

↓

Protected Routes Accessible
```

### Authentication Features

- User Registration
- Secure Login
- Password Hashing
- JWT Authentication
- Role-Based Authorization
- Protected Routes
- Secure Logout

---

# 15. Website Navigation Flow

## Public Website

```text
Home
│
├── Destinations
│      └── Destination Details
│
├── Resorts
│      └── Resort Details
│
├── Articles
│
├── Experiences
│
├── Contact
│
├── Login
│
└── Register
```

---

## Tourist Dashboard

```text
Dashboard
│
├── Profile
│
├── Trip Requests
│
├── Proposals
│
├── Bookings
│
└── Notifications
```

---

## Admin Dashboard

```text
Admin Dashboard
│
├── Dashboard
│
├── Users
│
├── Destinations
│
├── Safari Gates
│
├── Resorts
│
├── Inquiries
│
├── Trip Requests
│
├── Proposals
│
├── Bookings
│
├── Articles
│
├── Experiences
│
└── Notifications
```

---

# 16. User Journey Flow

The user journey represents the complete lifecycle of a traveler using WildConnect.

```text
Visitor

↓

Explore Website

↓

Browse Destinations

↓

View Resorts

↓

Register

↓

Login

↓

Submit Trip Request

↓

Admin Reviews Request

↓

Proposal Created

↓

Proposal Sent

↓

User Accepts Proposal

↓

Booking Confirmed

↓

Trip Completed
```

This workflow forms the foundation of the platform's business process.

---

# 17. Module Interaction Flow

Each module communicates independently while remaining connected through shared data.

```text
Authentication
        │
        ▼
Destination Module
        │
        ▼
Safari Gate Module
        │
        ▼
Resort Module
        │
        ▼
Trip Request Module
        │
        ▼
Proposal Module
        │
        ▼
Booking Module
        │
        ▼
Notification Module
```

Supporting modules:

- Articles
- Experiences
- Inquiry Management
- Admin Dashboard

These modules operate independently without affecting the booking workflow.

---

# 18. API Architecture

WildConnect follows a **RESTful API architecture**.

Each module exposes its own set of endpoints.

Example structure:

```text
/api/auth

/api/destinations

/api/safari-gates

/api/resorts

/api/inquiries

/api/trip-requests

/api/proposals

/api/bookings

/api/articles

/api/experiences

/api/notifications

/api/admin
```

### Supported HTTP Methods

- GET — Retrieve data
- POST — Create data
- PUT — Replace existing data
- PATCH — Update specific fields
- DELETE — Remove data

---

### Standard API Response

Successful responses:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

Error responses:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

Using a consistent response structure improves frontend integration and error handling across the application.

---

## Phase 2 Summary

Phase 2 defines how the frontend, backend, database, and application modules interact to deliver a consistent user experience.

The layered backend architecture, component-based frontend, RESTful APIs, and clearly defined request lifecycle provide a scalable foundation for WildConnect while keeping the codebase modular, maintainable, and ready for future expansion.




# Phase 3 — Project Structure

This phase defines how the WildConnect codebase is organized. A clean and consistent project structure improves maintainability, scalability, collaboration, and developer productivity.

---

# 19. Complete Project Structure

The project follows a monorepo-style organization where the frontend, backend, and documentation are maintained in separate directories.

```text
wildconnect/
│
├── backend/
│
├── frontend/
│
├── docs/
│
├── .gitignore
├── LICENSE
└── README.md
```

---

### Backend

Contains the complete server-side application including:

- REST APIs
- Business Logic
- Authentication
- Database Access
- Validation
- Configuration

---

### Frontend

Contains the React application responsible for the user interface.

Includes:

- Pages
- Components
- Layouts
- API Services
- Hooks
- Styling

---

### Docs

Contains all project documentation.

Example:

```text
docs/

├── PRD.md
├── ARCHITECTURE.md
├── DATABASE.md
├── API.md
├── UI_GUIDELINES.md
├── DEVELOPMENT_ROADMAP.md
├── DEPLOYMENT.md
├── SETUP.md
└── CHANGELOG.md
```

---

# 20. Backend Folder Structure

```text
backend/
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── src/
│   │
│   ├── config/
│   │
│   ├── constants/
│   │
│   ├── controllers/
│   │
│   ├── middleware/
│   │
│   ├── repositories/
│   │
│   ├── routes/
│   │
│   ├── services/
│   │
│   ├── validators/
│   │
│   ├── types/
│   │
│   ├── utils/
│   │
│   ├── generated/
│   │
│   ├── app.ts
│   └── server.ts
│
├── package.json
├── tsconfig.json
└── .env
```

---

## Folder Responsibilities

### prisma/

Contains:

- Database schema
- Database migrations
- Seed scripts

---

### config/

Application configuration.

Examples:

- Prisma Client
- Environment Variables
- JWT Configuration

---

### constants/

Application-wide constants.

Examples:

- Roles
- Status Values
- Messages
- API Constants

---

### controllers/

Responsible for:

- Receiving HTTP requests
- Calling services
- Returning API responses

Example:

```text
auth.controller.ts

destination.controller.ts

booking.controller.ts
```

---

### middleware/

Reusable Express middleware.

Examples:

- Authentication
- Authorization
- Validation
- Error Handling
- Logging

---

### repositories/

Handles database operations.

Example:

```text
user.repository.ts

resort.repository.ts

booking.repository.ts
```

---

### routes/

Defines all REST API endpoints.

Example:

```text
auth.routes.ts

resort.routes.ts

booking.routes.ts
```

---

### services/

Contains business logic.

Example:

```text
auth.service.ts

proposal.service.ts

tripRequest.service.ts
```

---

### validators/

Contains Zod validation schemas.

Example:

```text
login.validator.ts

booking.validator.ts
```

---

### types/

Shared TypeScript types and interfaces.

---

### utils/

Reusable utility functions.

Examples:

- Date formatting
- Slug generation
- Token helpers

---

### generated/

Contains Prisma generated client.

---

# 21. Frontend Folder Structure

```text
frontend/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │
│   ├── layouts/
│   │
│   ├── pages/
│   │
│   ├── routes/
│   │
│   ├── services/
│   │
│   ├── hooks/
│   │
│   ├── context/
│   │
│   ├── types/
│   │
│   ├── utils/
│   │
│   ├── constants/
│   │
│   ├── styles/
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Folder Responsibilities

### assets/

Contains:

- Images
- Icons
- Videos
- Fonts

---

### components/

Reusable UI components.

Examples:

```text
Navbar/

Footer/

Button/

Card/

Modal/

Input/

Loader/

Badge/
```

---

### layouts/

Shared layouts.

Examples:

```text
PublicLayout

DashboardLayout

AdminLayout
```

---

### pages/

Contains complete application pages.

Examples:

```text
Home

Login

Register

Destinations

Resorts

Dashboard
```

---

### routes/

Application routing configuration.

---

### services/

Axios configuration and API calls.

Example:

```text
auth.service.ts

booking.service.ts
```

---

### hooks/

Reusable React hooks.

Examples:

```text
useAuth()

useFetch()

useDebounce()
```

---

### context/

Global application state.

Examples:

- Authentication
- Theme
- Notifications

---

### types/

Shared frontend interfaces.

---

### utils/

Reusable helper functions.

---

### constants/

Application constants.

---

### styles/

Global styles.

Includes:

- Tailwind
- Custom CSS
- Theme Variables

---

# 22. File Naming Conventions

Consistency improves readability and maintainability.

---

## Backend

Controllers

```text
auth.controller.ts

booking.controller.ts
```

Services

```text
auth.service.ts

proposal.service.ts
```

Repositories

```text
user.repository.ts
```

Validators

```text
login.validator.ts
```

Routes

```text
booking.routes.ts
```

Middleware

```text
auth.middleware.ts
```

---

## Frontend

Pages

```text
HomePage.tsx

LoginPage.tsx

DestinationDetailsPage.tsx
```

Components

```text
DestinationCard.tsx

Navbar.tsx

SearchBar.tsx
```

Hooks

```text
useAuth.ts

useBooking.ts
```

Services

```text
auth.service.ts

resort.service.ts
```

---

# 23. Component Organization

Components are categorized by their purpose.

```text
components/

├── common/
├── forms/
├── cards/
├── navigation/
├── dashboard/
├── modals/
└── ui/
```

### Common

Reusable across the application.

Examples:

- Button
- Input
- Loader

---

### Forms

Reusable form components.

---

### Cards

Destination cards

Resort cards

Article cards

Experience cards

---

### Navigation

Navbar

Sidebar

Breadcrumb

Footer

---

### Dashboard

Dashboard-specific components.

---

### UI

Generic interface components.

Examples:

- Modal
- Tooltip
- Badge
- Alert

---

# 24. Route Organization

Routes are organized by feature modules.

```text
/auth

/destinations

/resorts

/articles

/experiences

/dashboard

/admin
```

Protected routes require authentication.

Admin routes require administrator privileges.

---

# 25. API Organization

Each module owns its own API.

```text
Authentication

↓

Destination

↓

Safari Gate

↓

Resort

↓

Inquiry

↓

Trip Request

↓

Proposal

↓

Booking

↓

Article

↓

Experience

↓

Notification
```

Every module follows the same architecture:

```text
Route

↓

Controller

↓

Service

↓

Repository
```

This ensures consistency throughout the application.

---

# 26. Environment Configuration

Sensitive information is stored using environment variables.

Examples include:

Backend

- Database URL
- JWT Secret
- Refresh Token Secret
- Port Number
- Environment Mode

Frontend

- API Base URL

No secrets are committed to version control.

---

# 27. Coding Standards

The project follows these development standards.

### General

- Use TypeScript throughout the project.
- Keep functions small and focused.
- Write reusable code.
- Avoid duplication.
- Follow consistent naming conventions.

---

### Backend

- Business logic belongs in Services.
- Database queries belong in Repositories.
- Controllers remain lightweight.
- Validate all incoming data.

---

### Frontend

- Prefer reusable components.
- Keep pages focused on layout and composition.
- Separate UI from business logic.
- Use custom hooks for reusable logic.

---

### Git

- Feature-based branches.
- Meaningful commit messages.
- Pull requests reviewed before merging.

---

# 28. Reusable Component Strategy

WildConnect emphasizes component reusability to reduce duplication and improve consistency.

Examples of reusable components include:

```text
Button

Input

Textarea

Modal

Badge

Alert

Loader

Pagination

Search Bar

Filter Panel

Data Table

Confirmation Dialog
```

These components are designed to be configurable through props and reused across multiple pages and modules.

---

# Phase 3 Summary

Phase 3 establishes a clear and scalable project organization for WildConnect. The backend follows a layered architecture with separated responsibilities, while the frontend adopts a component-based structure with reusable layouts and services. Consistent folder organization, naming conventions, coding standards, and reusable components ensure the project remains maintainable, collaborative, and ready for future growth.



# Phase 4 — Development & Scalability

This phase defines the engineering practices, security standards, deployment strategy, and scalability considerations that will guide the long-term development of WildConnect.

---

# 29. Security Architecture

Security is a core requirement throughout the application.

The platform follows industry-standard security practices to protect user data and application resources.

## Authentication

- JWT Authentication
- Protected Routes
- Role-Based Authorization
- Secure Logout

---

## Password Security

- Passwords are never stored in plain text.
- All passwords are hashed using **bcrypt** before being stored in the database.

---

## Authorization

Every protected endpoint verifies:

- User authentication
- User role
- Required permissions

Roles include:

- Visitor
- Tourist
- Admin

---

## Input Validation

Every incoming request is validated before processing.

Validation includes:

- Required fields
- Data types
- String lengths
- Email format
- Business rules

Invalid requests return standardized validation errors.

---

## Environment Variables

Sensitive configuration is stored in environment variables.

Examples include:

- Database URL
- JWT Secret
- Refresh Token Secret
- API Keys
- Server Port

No secrets are committed to Git.

---

## API Protection

The backend includes:

- Request validation
- Authentication middleware
- Authorization middleware
- Centralized error handling

---

# 30. State Management

WildConnect uses lightweight state management suitable for an MVP.

## Global State

Managed using React Context.

Examples:

- Authentication
- Current User
- Theme (Future)
- Notifications

---

## Local State

Managed using React Hooks.

Examples:

- Form Inputs
- Search Filters
- Modal State
- Loading States

---

## Custom Hooks

Reusable logic is extracted into custom hooks.

Examples:

```text
useAuth()

useFetch()

usePagination()

useSearch()

useDebounce()
```

Redux is intentionally not included in Version 1 to keep the application simple and maintainable.

---

# 31. Error Handling Strategy

A centralized error handling strategy ensures consistent responses across the application.

## Backend

Errors are handled using a global error middleware.

Categories include:

- Validation Errors
- Authentication Errors
- Authorization Errors
- Database Errors
- Internal Server Errors

---

## Frontend

The UI provides user-friendly feedback using toast notifications and error messages.

Examples:

- Invalid login credentials
- Network failures
- Validation errors
- Unexpected server errors

Users should always receive meaningful and actionable feedback.

---

# 32. Logging Strategy

Logging helps monitor the application and simplify debugging.

## Development Logs

Examples:

- Incoming Requests
- API Responses
- Database Queries
- Validation Errors

---

## Production Logs

Examples:

- Server Errors
- Authentication Failures
- Critical Exceptions

Sensitive information such as passwords and JWT tokens must never be logged.

---

# 33. Deployment Architecture

WildConnect follows a cloud-based deployment architecture.

```text
                 Users
                   │
                   ▼
           React Frontend
             (Vercel)
                   │
            HTTPS Requests
                   │
                   ▼
         Express Backend API
        (Render / Railway)
                   │
                   ▼
          PostgreSQL Database
               (Neon)
```

---

## Frontend

Deployment Platform:

- Vercel

Responsibilities:

- Static Asset Hosting
- React Application
- Client-side Routing

---

## Backend

Deployment Platform:

- Render
or
- Railway

Responsibilities:

- REST APIs
- Authentication
- Business Logic
- Database Communication

---

## Database

Platform:

- Neon PostgreSQL

Responsibilities:

- Persistent Storage
- Automated Backups
- Secure Connections

---

# 34. Performance Considerations

The application is designed to provide a fast and responsive experience.

Performance strategies include:

- Lazy Loading
- Code Splitting
- Optimized Images
- Efficient Database Queries
- Pagination
- Search Optimization
- API Response Standardization
- Reusable Components

---

## Backend Optimization

- Indexed database queries
- Optimized Prisma queries
- Minimized database calls
- Modular services

---

## Frontend Optimization

- Lazy-loaded pages
- Memoized components where appropriate
- Efficient state management
- Optimized asset loading

---

# 35. Scalability Strategy

WildConnect is designed to support future expansion without requiring major architectural changes.

Future scalability includes:

- Additional Wildlife Destinations
- Multiple Administrators
- Resort Partner Portal
- AI Services
- Online Payments
- Mobile Applications
- Analytics Dashboard
- External API Integrations

The layered backend architecture and modular frontend make future enhancements easier to implement.

---

# 36. Future Architecture (V2)

Version 2 may introduce several new architectural components.

Examples:

```text
React Frontend

↓

API Gateway

↓

Authentication Service

↓

AI Recommendation Service

↓

Booking Service

↓

Payment Service

↓

Notification Service

↓

PostgreSQL
```

Possible additions:

- AI Itinerary Generation
- AI Chat Assistant
- Payment Gateway
- Resort Owner Dashboard
- Safari Booking Integration
- Email & SMS Notifications
- Recommendation Engine
- Mobile Application
- Partner APIs

The current architecture is intentionally designed to accommodate these future services.

---

# 37. Development Workflow

Development follows a structured, module-based workflow.

```text
Planning

↓

Database Design

↓

Backend Development

↓

API Testing

↓

Frontend Development

↓

Integration

↓

Testing

↓

Deployment
```

Each module follows the same implementation sequence:

```text
Database Model

↓

Migration

↓

Repository

↓

Service

↓

Controller

↓

Routes

↓

API Testing

↓

Frontend UI

↓

Integration

↓

Module Testing
```

This workflow ensures consistency and minimizes integration issues.

---

# 38. Architecture Summary

WildConnect follows a modern, modular architecture designed for maintainability, scalability, and long-term growth.

### Key Architectural Highlights

- Layered Backend Architecture
- Component-Based Frontend
- RESTful APIs
- PostgreSQL with Prisma ORM
- JWT Authentication
- Role-Based Authorization
- Modular Project Structure
- Reusable Components
- Cloud-Based Deployment
- Scalable Foundation for Future Features

The architecture prioritizes clean code, clear separation of responsibilities, and flexibility for future enhancements while keeping Version 1 focused, stable, and production-ready.

---

# Final Conclusion

This architecture document serves as the technical foundation of the WildConnect platform.

Together with the PRD, Database Design, API Documentation, and UI Guidelines, it provides a complete blueprint for building, maintaining, and scaling the application.

All future development should align with the principles, standards, and architectural decisions defined in this document to ensure consistency, reliability, and long-term maintainability.