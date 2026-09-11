# WildConnect Database Architecture

This document describes the database architecture for the WildConnect project (Phase 1). The database is fully initialized, normalized, and deployed on Neon PostgreSQL.

## Core Setup
- **Database**: PostgreSQL (hosted on Neon)
- **ORM**: Prisma v7
- **Connection Strategy**: `pg` driver adapter using `@prisma/adapter-pg`

## Core Models (V1)
The initial schema includes the following foundation models for the platform:

1. **User**
   - Stores all platform users.
   - Enforces unique emails and utilizes `bcrypt` for password hashing.
   - Contains a `role` enum (`ADMIN`, `TOURIST`).
   - Uses soft deletes (`deletedAt`).

2. **Destination**
   - Stores wildlife reserves/parks (e.g., Tadoba Andhari Tiger Reserve).
   - Core entity; uses restrict constraint to protect associated entities.
   - Indexed uniquely by `slug`.

3. **SafariGate**
   - Stores entry points mapped strictly to Destinations.
   - Weak entity (`onDelete: Cascade`), meaning deleting a destination automatically cleans up its gates.
   - Enforces unique combination of `destinationId` and `name`.

4. **Resort**
   - Stores accommodation properties.
   - Mapped to Destinations with a restrict constraint (`onDelete: Restrict`).
   - Uses soft deletes (`deletedAt`).

## Standards & Constraints
- **IDs**: UUID (v4) generated via Prisma for all models.
- **Timestamps**: All models include `createdAt` and `updatedAt`.
- **Soft Deletes**: Enabled for critical business records (User, Destination, Resort).
- **Indexing**: explicitly defined on foreign keys (`destinationId`), search criteria (`slug`, `email`), and composite unique constraints.

## Status
- [x] Schema Designed & Validated
- [x] Initial Migration Executed
- [x] Seed Data Inserted
- [x] Database Connectivity & CRUD Tested Successfully
