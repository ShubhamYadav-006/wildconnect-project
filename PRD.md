# WildConnect - Product Requirements Document (PRD)

**Version:** 2.0 (V1 Scope)
**Status:** Approved for Development
**Project Type:** Final Year Project + Startup MVP
**Last Updated:** July 2026

---

# 1. Product Overview

## Product Name

**WildConnect**

## Product Vision

WildConnect is a centralized wildlife tourism platform that helps travelers discover wildlife destinations, explore verified resorts, submit personalized trip requests, receive customized travel proposals, and manage their bookings through a single platform.

Instead of searching multiple websites for safari information, resorts, travel contacts, and trip planning, users can access everything in one place.

The first version (V1) focuses on creating a reliable and professional wildlife tourism management platform with a manual proposal and booking workflow.

---

# 2. Problem Statement

Planning a wildlife trip is currently fragmented.

A traveler often has to:

- Search Google for destination information
- Compare resorts across multiple websites
- Contact multiple resort owners individually
- Search separately for safari information
- Find transportation independently
- Manage everything through calls and WhatsApp

This process is:

- Time consuming
- Confusing
- Difficult for first-time visitors
- Lacks personalized guidance
- Offers no centralized trip management

WildConnect aims to solve this problem by providing a single platform for wildlife tourism.

---

# 3. What We Are Building

WildConnect is **not** an online hotel booking website.

WildConnect is a wildlife tourism management platform where users can:

- Explore wildlife destinations
- Browse verified resorts
- Read travel articles
- View wildlife experiences
- Submit trip requirements
- Receive personalized travel proposals
- Confirm bookings
- Track their trips
- Receive notifications

The platform acts as a bridge between travelers and the WildConnect team.

---

# 4. Goals

## Primary Goals

- Simplify wildlife trip planning
- Centralize tourism information
- Build trust through verified listings
- Reduce planning time
- Improve customer experience

## Business Goals

- Build a scalable wildlife tourism platform
- Create a professional digital presence
- Generate trip inquiries
- Increase resort partnerships
- Prepare the platform for future expansion

---

# 5. Target Users

## Primary Users

### Wildlife Tourists

People planning wildlife trips.

Examples:

- Families
- Couples
- Solo travelers
- Nature lovers
- Wildlife photographers
- Bird watchers

Needs:

- Destination information
- Resort options
- Trip planning
- Booking assistance

---

### Returning Travelers

Users who have already visited wildlife destinations and want to plan another trip.

Needs:

- Faster planning
- Better resort selection
- Easier booking management

---

### WildConnect Admin Team

Platform administrators responsible for managing:

- Destinations
- Resorts
- Trip Requests
- Proposals
- Bookings
- Articles
- Experiences
- Users

---

# 6. User Roles

## Visitor

Can:

- Browse destinations
- Browse resorts
- Read articles
- View experiences
- Contact WildConnect

Cannot:

- Submit trip requests
- Receive proposals
- View bookings

---

## Tourist

Can:

- Register/Login
- Submit trip requests
- View proposals
- Accept or reject proposals
- View bookings
- Receive notifications
- Manage profile

---

## Admin

Full system access.

Can:

- Manage all content
- Review requests
- Create proposals
- Manage bookings
- Publish articles
- Verify resorts
- Manage destinations
- View users

---

# 7. Core Features (V1)

## Authentication

- User Registration
- Login
- Logout
- JWT Authentication
- Protected Routes
- Role Based Access

---

## Destination Management

Users can:

- Browse destinations
- View destination details
- View best visiting season
- Read destination highlights
- Explore wildlife information

Admin can:

- Create destinations
- Edit destinations
- Delete destinations



## Resort Module

Users can:

- Browse resorts
- View resort details
- View amenities
- Search resorts
- Filter resorts

Admin can:

- Manage resort listings
- Upload images
- Update amenities



## Trip Request Module

Registered users can:

- Submit trip requirements
- Mention travel dates
- Mention group size
- Mention budget
- Add special requirements

Admin can review requests.

---

## Proposal Module

Admin creates personalized travel proposals.

Proposal includes:

- Resort recommendation
- Stay duration
- Pricing
- Trip details
- Additional notes

Users can:

- Accept proposal
- Reject proposal

---

## Booking Module

After proposal acceptance:

Admin confirms booking.

Users can:

- View booking details
- View booking history

---

## Articles Module

Users can:

- Read wildlife articles
- Explore travel tips
- Learn about destinations

Admin can:

- Publish articles
- Edit articles
- Archive articles

---

## Experiences Module

Users can:

- Read travel stories
- Browse wildlife experiences

Admin manages all experiences.

---

## Notification Module

Users receive notifications for:

- Proposal received
- Booking confirmed
- Booking updated
- Important announcements

---

## Admin Dashboard

Admin dashboard includes:

- User management
- Destination management
- Resort management
- Trip request management
- Proposal management
- Booking management
- Article management
- Experience management
- Notifications

---

# 8. Features NOT Included in V1

To keep the MVP focused, the following features are intentionally excluded.

## AI Features

- AI itinerary generation
- AI travel assistant
- AI chatbot
- AI recommendations

---

## Online Payments

- Credit Card Payments
- UPI Payments
- Payment Gateway Integration

---

## Resort Owner Portal

Resort owners cannot manage their listings directly.

All listings are managed by the WildConnect Admin.

---

## Taxi Booking

Not included.

---

## Safari Ticket Booking

Not included.

---

## Camera Rental

Not included.

---

## Hotel Availability Sync

Not included.

---

## Live Chat

Not included.

---

## Wishlist

Not included.

---

## Ratings & Reviews

Not included.

---

## Coupon System

Not included.

---

## Multi-language Support

Not included.

---

## Mobile Application

Only responsive web application in V1.

---

# 9. Functional Requirements

The system shall allow users to:

- Register an account
- Login securely
- Browse destinations
- Browse resorts
- Search resorts
- Submit trip requests
- View personalized proposals
- Accept or reject proposals
- View bookings
- Read articles
- Read experiences
- Receive notifications

The system shall allow administrators to:

- Manage users
- Manage destinations
- Manage resorts
- Review trip requests
- Create proposals
- Manage bookings
- Publish articles
- Publish experiences
- Send notifications

---

# 10. Success Criteria

The MVP will be considered successful if users can:

- Discover wildlife destinations
- Explore verified resorts
- Submit trip requests
- Receive personalized proposals
- Confirm bookings
- Access trip information from a single platform

---

# 11. Future Scope (V2)

After successful completion of V1, WildConnect may include:

- AI-powered itinerary planning
- AI travel assistant
- Online payment gateway
- Resort owner dashboard
- Safari booking integration
- Taxi booking
- Camera rental booking
- Wishlist
- User reviews and ratings
- Mobile application
- Multi-language support
- Advanced analytics
- Recommendation engine
- Partner portal
- Dynamic pricing
- Email and SMS automation

---

# 12. MVP Summary

WildConnect V1 focuses on solving one core problem:

> "Provide a centralized platform where wildlife travelers can discover destinations, explore verified resorts, submit trip requests, receive personalized travel proposals, and manage bookings without visiting multiple websites."

The first version prioritizes simplicity, reliability, and a scalable architecture over advanced automation, creating a strong foundation for future AI-powered features and partner integrations.