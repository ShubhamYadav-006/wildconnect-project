# WildConnect Database Architecture

This document describes the complete database architecture and schema for the **WildConnect** platform. The database is fully normalized, type-safe, and deployed on PostgreSQL via Neon with Prisma ORM.

---

## 1. Core Setup & Technologies

- **Database Engine**: PostgreSQL (Neon Serverless PostgreSQL)
- **ORM**: Prisma v7 (`@prisma/client`)
- **Connection Strategy**: Direct connection / `pg` driver adapter
- **Client Output**: `src/generated/prisma`
- **Primary Keys**: UUID v4 generated via Prisma (`@id @default(uuid())`)
- **Timestamps**: All models track `createdAt` (`@default(now())`) and `updatedAt` (`@updatedAt`)
- **Soft Deletion**: Implemented via nullable `deletedAt DateTime?` on critical business models (`User`, `Destination`, `Resort`, `Business`, `Article`)

---

## 2. Enumerations

```prisma
enum Role {
  ADMIN
  TOURIST
  BUSINESS_PARTNER
}

enum KycStatus {
  KYC_UNSUBMITTED
  KYC_PENDING
  KYC_VERIFIED
  KYC_REJECTED
}

enum VehicleType {
  SAFARI_GYPSY_4X4
  INNOVA_TRANSFER
  CANTER_SAFARI
}

enum SafariSlot {
  MORNING_SAFARI
  AFTERNOON_SAFARI
  FULL_DAY_TRANSFER
}

enum EquipmentType {
  CAMERA_BODY
  TELEPHOTO_LENS
  ACCESSORY_KIT
}

enum BlockReason {
  PROPERTY_MAINTENANCE
  WALK_IN_OFFLINE_BOOKING
  MONSOON_CLOSURE
  PERSONAL_USE
}

enum PayoutStatus {
  HELD_IN_ESCROW
  PENDING_CLEARANCE
  PROCESSING
  PAID
  ON_HOLD
}

enum TripStatus {
  PENDING
  REVIEWING
  PROPOSAL_READY
  BOOKED
  CANCELLED
}

enum ProposalStatus {
  PENDING
  ACCEPTED
  REJECTED
  WITHDRAWN
  DRAFT
  SENT
  CHANGE_REQUESTED
}

enum BookingStatus {
  CONFIRMED
  COMPLETED
  CANCELLED
}

enum ArticleStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum NotificationType {
  PROPOSAL_CREATED
  PROPOSAL_ACCEPTED
  PROPOSAL_REJECTED
  BOOKING_CONFIRMED
  BOOKING_COMPLETED
  SYSTEM_ANNOUNCEMENT
  BUSINESS_APPROVED
  BUSINESS_REJECTED
  BUSINESS_PENDING
  BUSINESS_SUSPENDED
  BUSINESS_INQUIRY_RECEIVED
  BUSINESS_BOOKING_CONFIRMED
  BUSINESS_BOOKING_CANCELLED
  BUSINESS_NEW_BOOKING_PARTNER
  BUSINESS_REVIEW_SUBMITTED
  KYC_SUBMITTED
  KYC_VERIFIED
  KYC_REJECTED
  BOOKING_CANCELLED_GUEST
  BOOKING_CANCELLED_PARTNER
  PAYOUT_CLEARED
  INQUIRY_ESCALATED
}

enum ApprovalStatus {
  DRAFT
  PENDING_REVIEW
  APPROVED
  REJECTED
  SUSPENDED
}

enum BusinessType {
  RESORT
  TAXI
  CAMERA_RENTAL
}

enum InquiryStatus {
  PENDING
  RESPONDED
  CLOSED
  ESCALATED
  EXPIRED
}

enum BusinessBookingStatus {
  CONFIRMED
  CANCELLED
  CANCELLED_BY_GUEST
  CANCELLED_BY_PARTNER
  COMPLETED
}
```

---

## 3. Data Models & Entity Specifications

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        WILDCONNECT DATA MODELS                         │
├───────────────────────────────────┬────────────────────────────────────┤
│ 1. Identity & Compliance          │ 2. Partner Marketplace             │
│    • User                         │    • Business                      │
│    • PartnerKyc                   │    • BusinessRoom                  │
│                                   │    • BusinessVehicle               │
├───────────────────────────────────┤    • BusinessEquipment             │
│ 3. Destinations & Stays           │    • BusinessInventoryBlock        │
│    • Destination                  │    • BusinessBooking               │
│    • Resort                       │    • BusinessInquiry               │
│                                   │    • PayoutTransaction             │
├───────────────────────────────────┼────────────────────────────────────┤
│ 4. Managed Safari Planning        │ 5. Content & Alerts                │
│    • TripRequest                  │    • Article                       │
│    • Proposal                     │    • Notification                  │
│    • Booking                      │                                    │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

### 3.1 Identity & Partner Compliance

#### `User`
Stores all registered accounts across all roles (`TOURIST`, `ADMIN`, `BUSINESS_PARTNER`). Supports traditional email/password authentication as well as Google OAuth.

| Field | Type | Attributes / Constraints | Description |
|---|---|---|---|
| `id` | String | `@id @default(uuid())` | Unique user identifier |
| `firstName` | String | Required | User first name |
| `lastName` | String | Required | User last name |
| `email` | String | `@unique` | Unique login email address |
| `password` | String? | Nullable (optional for OAuth) | bcrypt-hashed password |
| `phone` | String? | Nullable | Contact phone number |
| `role` | Role | `@default(TOURIST)` | User authorization role |
| `avatar` | String? | Nullable | URL/path to profile photo |
| `googleId` | String? | `@unique`, Nullable | Google OAuth profile identifier |
| `deletedAt` | DateTime? | Nullable | Soft deletion timestamp |
| `createdAt` | DateTime | `@default(now())` | Registration timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Last profile update timestamp |

**Relations**:
- `articles`: `Article[]`
- `bookings`: `Booking[]`
- `businesses`: `Business[]`
- `businessBookings`: `BusinessBooking[]`
- `inquiries`: `BusinessInquiry[]`
- `notifications`: `Notification[]`
- `proposals`: `Proposal[]`
- `tripRequests`: `TripRequest[]`
- `partnerKyc`: `PartnerKyc?`

#### `PartnerKyc`
Stores verification documents and banking information submitted by Business Partners for legal and financial onboarding.

| Field | Type | Attributes / Constraints | Description |
|---|---|---|---|
| `id` | String | `@id @default(uuid())` | Unique KYC record ID |
| `userId` | String | `@unique` | One-to-one link to partner `User` (`onDelete: Cascade`) |
| `businessPan` | String | Required | Company or Proprietor Permanent Account Number (PAN) |
| `gstin` | String? | Nullable | Goods and Services Tax Identification Number |
| `idProofUrl` | String | Required | Government ID proof document path/URL (Aadhaar/Passport/DL) |
| `businessProofUrl`| String | Required | Business registration or establishment proof document path/URL |
| `bankAccountName` | String | Required | Bank account holder name |
| `bankAccountNumber`| String | Required | Account number for payouts |
| `bankIfsc` | String | Required | Bank branch IFSC code |
| `bankName` | String | Required | Name of the banking institution |
| `cancelledChequeUrl`| String? | Nullable | Cancelled cheque or bank statement image path/URL |
| `status` | KycStatus | `@default(KYC_UNSUBMITTED)` | Verification status (`KYC_UNSUBMITTED`, `KYC_PENDING`, `KYC_VERIFIED`, `KYC_REJECTED`) |
| `rejectionReason` | String? | Nullable | Admin feedback if rejected |
| `verifiedAt` | DateTime? | Nullable | Timestamp of verification approval |
| `createdAt` | DateTime | `@default(now())` | Creation timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Update timestamp |

---

### 3.2 Destination & Curated Stays

#### `Destination`
Stores national parks, tiger reserves, and wildlife sanctuaries (e.g., *Tadoba-Andhari Tiger Reserve*).

| Field | Type | Attributes / Constraints | Description |
|---|---|---|---|
| `id` | String | `@id @default(uuid())` | Unique destination ID |
| `name` | String | `@unique` | Park/sanctuary title |
| `slug` | String | `@unique` | URL-friendly unique slug |
| `description` | String | Required | Detailed overview and wildlife info |
| `bestSeason` | String? | Nullable | Best months to visit |
| `state` | String | Required | Indian State (e.g., Maharashtra) |
| `country` | String | Required | Country (e.g., India) |
| `coverImage` | String? | Nullable | Primary banner image |
| `establishedYear` | Int? | Nullable | Year established as a reserve |
| `totalArea` | Float? | Nullable | Total sanctuary area in sq km |
| `coreArea` | Float? | Nullable | Core tiger zone in sq km |
| `coreGates` | Int? | Nullable | Number of active core entry gates |
| `bufferArea` | Float? | Nullable | Buffer zone in sq km |
| `bufferGates` | Int? | Nullable | Number of active buffer entry gates |
| `deletedAt` | DateTime? | Nullable | Soft deletion timestamp |
| `createdAt` | DateTime | `@default(now())` | Created timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Updated timestamp |

**Relations**:
- `resorts`: `Resort[]`
- `businesses`: `Business[]`
- `tripRequests`: `TripRequest[]`
- `proposals`: `Proposal[]`
- `bookings`: `Booking[]`
- `articles`: `Article[]`

#### `Resort` (Curated / Managed Listings)
Stores managed properties directly curated by the WildConnect platform team.

| Field | Type | Attributes / Constraints | Description |
|---|---|---|---|
| `id` | String | `@id @default(uuid())` | Unique resort ID |
| `name` | String | Required | Property name |
| `description` | String | Required | Property description |
| `address` | String | Required | Physical address |
| `starRating` | Int? | Nullable | 1-5 star classification |
| `amenities` | String[] | Default `[]` | Amenities list (Pool, Safari Desk, etc.) |
| `coverImage` | String? | Nullable | Hero display image |
| `images` | String[] | Default `[]` | Gallery photo URLs |
| `destinationId` | String | `@index` | Destination foreign key (`onDelete: Restrict`) |
| `deletedAt` | DateTime? | Nullable | Soft delete timestamp |
| `createdAt` | DateTime | `@default(now())` | Created timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Updated timestamp |

---

### 3.3 Business Partner Marketplace Ecosystem

#### `Business`
Represents partner businesses registered across multiple wildlife service categories. Requires Admin verification before going live.

| Field | Type | Attributes / Constraints | Description |
|---|---|---|---|
| `id` | String | `@id @default(uuid())` | Unique business ID |
| `name` | String | Required | Registered business name |
| `slug` | String | `@unique` | Unique URL-friendly slug |
| `type` | BusinessType | Required | Service category (`RESORT`, `TAXI`, `CAMERA_RENTAL`). `RESORT` acts as umbrella for all accommodation properties. |
| `description` | String | Required | Business details and offerings |
| `coverImage` | String? | Nullable | Featured card/banner image |
| `images` | String[] | Default `[]` | Gallery photos |
| `contactEmail` | String? | Nullable | Direct business contact email |
| `contactPhone` | String? | Nullable | Direct business contact phone |
| `address` | String? | Nullable | Physical address/location |
| `starRating` | Int? | Nullable | Star/quality rating |
| `amenities` | String[] | Default `[]` | Service features & amenities |
| `metadata` | Json? | Nullable | Flexible structured data |
| `status` | ApprovalStatus | `@default(DRAFT)` | Verification status (`DRAFT`, `PENDING_REVIEW`, `APPROVED`, `REJECTED`, `SUSPENDED`) |
| `rejectionReason`| String? | Nullable | Admin feedback if rejected |
| `pendingUpdates`| Json? | Nullable | Temporary edit staging |
| `verifiedAt` | DateTime? | Nullable | Timestamp of admin approval |
| `destinationId` | String? | Nullable | Destination link (`Destination`, `@relation`) |
| `userId` | String | Required, `@index` | Owner user ID (`User`, `onDelete: Cascade`) |
| `deletedAt` | DateTime? | Nullable | Soft delete timestamp |
| `createdAt` | DateTime | `@default(now())` | Created timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Updated timestamp |

**Relations**:
- `destination`: `Destination?`
- `user`: `User`
- `bookings`: `BusinessBooking[]`
- `inquiries`: `BusinessInquiry[]`
- `rooms`: `BusinessRoom[]`
- `vehicles`: `BusinessVehicle[]`
- `equipment`: `BusinessEquipment[]`
- `inventoryBlocks`: `BusinessInventoryBlock[]`
- `payouts`: `PayoutTransaction[]`

#### `BusinessRoom`
Stores room categories and inventory for accommodation partners (`RESORT`).

| Field | Type | Attributes / Constraints | Description |
|---|---|---|---|
| `id` | String | `@id @default(uuid())` | Unique room type ID |
| `businessId` | String | `@index` | Business foreign key (`onDelete: Cascade`) |
| `name` | String | Required | Room name (e.g., *Luxury Machan*, *Deluxe Cottage*) |
| `description` | String | Required | Room amenities & details |
| `capacity` | Int | Required | Max guest occupancy per room |
| `basePrice` | Float | Required | Nightly price in INR |
| `totalInventory`| Int | `@default(1)` | Total physical units available |
| `amenities` | String[] | Default `[]` | Room-specific amenities |
| `images` | String[] | Default `[]` | Room photography URLs |
| `createdAt` | DateTime | `@default(now())` | Created timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Updated timestamp |

**Relations**:
- `business`: `Business`
- `bookings`: `BusinessBooking[]`
- `inventoryBlocks`: `BusinessInventoryBlock[]`

#### `BusinessVehicle`
Stores vehicle fleet inventory for taxi and safari transport operators (`TAXI`).

| Field | Type | Attributes / Constraints | Description |
|---|---|---|---|
| `id` | String | `@id @default(uuid())` | Unique vehicle ID |
| `businessId` | String | `@index` | Business foreign key (`onDelete: Cascade`) |
| `vehicleType` | VehicleType | Required | Type (`SAFARI_GYPSY_4X4`, `INNOVA_TRANSFER`, `CANTER_SAFARI`) |
| `modelName` | String | Required | Model & make (e.g., *Maruti Gypsy King 4WD*) |
| `registrationNumber` | String | Required | Vehicle RTO registration number |
| `driverName` | String? | Nullable | Assigned naturalist or driver name |
| `driverPhone` | String? | Nullable | Driver contact phone number |
| `maxPassengers` | Int | `@default(6)` | Maximum seating capacity |
| `supportedSlots` | SafariSlot[] | Array | Allowed drive slots (`MORNING_SAFARI`, `AFTERNOON_SAFARI`, `FULL_DAY_TRANSFER`) |
| `basePricePerSlot`| Float | Required | Rate per slot/day in INR |
| `images` | String[] | Default `[]` | Vehicle photos |
| `createdAt` | DateTime | `@default(now())` | Created timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Updated timestamp |

**Relations**:
- `business`: `Business`
- `bookings`: `BusinessBooking[]`
- `inventoryBlocks`: `BusinessInventoryBlock[]`

#### `BusinessEquipment`
Stores photography gear and camera rental kits for gear rental partners (`CAMERA_RENTAL`).

| Field | Type | Attributes / Constraints | Description |
|---|---|---|---|
| `id` | String | `@id @default(uuid())` | Unique equipment ID |
| `businessId` | String | `@index` | Business foreign key (`onDelete: Cascade`) |
| `equipmentType` | EquipmentType | Required | Category (`CAMERA_BODY`, `TELEPHOTO_LENS`, `ACCESSORY_KIT`) |
| `brandAndModel` | String | Required | Brand & model (e.g., *Sony Alpha A1 + 200-600mm F/5.6-6.3 G*) |
| `serialNumber` | String? | Nullable | Device serial number for tracking |
| `dailyRate` | Float | Required | Daily rental fee in INR |
| `securityDeposit`| Float | `@default(0)` | Refundable security deposit in INR |
| `condition` | String | `@default("EXCELLENT")`| Condition grade (*MINT*, *EXCELLENT*, *GOOD*) |
| `kitIncludes` | String[] | Default `[]` | Included accessories (lens hood, monopod, extra battery) |
| `images` | String[] | Default `[]` | Equipment photos |
| `createdAt` | DateTime | `@default(now())` | Created timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Updated timestamp |

**Relations**:
- `business`: `Business`
- `bookings`: `BusinessBooking[]`
- `inventoryBlocks`: `BusinessInventoryBlock[]`

#### `BusinessInventoryBlock`
Enables partners to lock/blackout specific dates for rooms, vehicles, or gear due to offline bookings, maintenance, or monsoon closures.

| Field | Type | Attributes / Constraints | Description |
|---|---|---|---|
| `id` | String | `@id @default(uuid())` | Unique block ID |
| `businessId` | String | `@index` | Business foreign key (`onDelete: Cascade`) |
| `roomId` | String? | Nullable, `@index` | Blocked room link |
| `vehicleId` | String? | Nullable, `@index` | Blocked vehicle link |
| `equipmentId`| String? | Nullable, `@index` | Blocked equipment link |
| `startDate` | DateTime | Required | Block start date |
| `endDate` | DateTime | Required | Block end date |
| `slot` | SafariSlot? | Nullable | Specific safari slot if blocking a vehicle |
| `unitsBlocked` | Int | `@default(1)` | Number of inventory units blocked |
| `reason` | BlockReason | `@default(PROPERTY_MAINTENANCE)` | Reason (`PROPERTY_MAINTENANCE`, `WALK_IN_OFFLINE_BOOKING`, `MONSOON_CLOSURE`, `PERSONAL_USE`) |
| `notes` | String? | Nullable | Additional internal notes |
| `createdAt` | DateTime | `@default(now())` | Created timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Updated timestamp |

**Relations**:
- `business`: `Business`
- `room`: `BusinessRoom?`
- `vehicle`: `BusinessVehicle?`
- `equipment`: `BusinessEquipment?`

#### `BusinessBooking` (Multi-Resource Partner Bookings)
Direct bookings placed by Tourists for specific `BusinessRoom`, `BusinessVehicle`, or `BusinessEquipment` units with atomic inventory and date overlap checks.

| Field | Type | Attributes / Constraints | Description |
|---|---|---|---|
| `id` | String | `@id @default(uuid())` | Unique booking ID |
| `businessId` | String | `@index` | Business foreign key (`onDelete: Cascade`) |
| `roomId` | String? | Nullable, `@index` | Booked room foreign key |
| `vehicleId` | String? | Nullable, `@index` | Booked vehicle foreign key |
| `equipmentId`| String? | Nullable, `@index` | Booked equipment foreign key |
| `slot` | SafariSlot? | Nullable | Selected safari slot |
| `userId` | String | `@index` | Tourist user foreign key (`onDelete: Cascade`) |
| `guestName` | String | Required | Primary guest full name |
| `guestEmail` | String | Required | Primary guest email |
| `guestPhone` | String? | Nullable | Primary guest phone |
| `specialRequests`| String? | Nullable | Optional notes |
| `startDate` | DateTime | Required | Check-in / rental start date |
| `endDate` | DateTime | Required | Check-out / rental end date |
| `travelerCount` | Int | Required | Number of staying guests or passengers |
| `totalAmount` | Float | Required | Calculated total price |
| `platformFee` | Float? | Nullable | Platform commission percentage/fee |
| `status` | BusinessBookingStatus | `@default(CONFIRMED)` | Status (`CONFIRMED`, `CANCELLED`, `CANCELLED_BY_GUEST`, `CANCELLED_BY_PARTNER`, `COMPLETED`) |
| `cancellationReason` | String? | Nullable | Explanation for cancellation |
| `cancelledAt` | DateTime? | Nullable | Timestamp of cancellation |
| `refundAmount` | Float? | Nullable | Processed refund amount |
| `refundStatus` | String? | Nullable | Refund processing status |
| `payoutStatus` | PayoutStatus | `@default(HELD_IN_ESCROW)` | Escrow payout status |
| `createdAt` | DateTime | `@default(now())` | Booking timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Update timestamp |

**Relations**:
- `business`: `Business`
- `room`: `BusinessRoom?`
- `vehicle`: `BusinessVehicle?`
- `equipment`: `BusinessEquipment?`
- `user`: `User`
- `payout`: `PayoutTransaction?`

#### `PayoutTransaction`
Manages escrow lifecycle, platform commissions, and bank settlement transfers to verified Business Partners.

| Field | Type | Attributes / Constraints | Description |
|---|---|---|---|
| `id` | String | `@id @default(uuid())` | Unique payout transaction ID |
| `businessId` | String | `@index` | Business foreign key (`onDelete: Cascade`) |
| `bookingId` | String | `@unique` | Associated booking ID (`onDelete: Cascade`) |
| `grossAmount` | Float | Required | Total amount paid by customer |
| `platformFee` | Float | Required | Platform service fee / commission |
| `netPayout` | Float | Required | Net amount payable to partner (`grossAmount - platformFee`) |
| `status` | PayoutStatus | `@default(HELD_IN_ESCROW)` | Payout status (`HELD_IN_ESCROW`, `PENDING_CLEARANCE`, `PROCESSING`, `PAID`, `ON_HOLD`) |
| `settlementDate` | DateTime? | Nullable | Timestamp when payout was cleared/transferred |
| `utrNumber` | String? | Nullable | Banking Unique Transaction Reference (UTR) |
| `failureReason` | String? | Nullable | Error details if bank transfer failed |
| `createdAt` | DateTime | `@default(now())` | Created timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Updated timestamp |

**Relations**:
- `business`: `Business`
- `booking`: `BusinessBooking`

#### `BusinessInquiry`
Customer inquiries submitted to partners for custom packages, taxi hires, safari guides, or questions with SLA tracking.

| Field | Type | Attributes / Constraints | Description |
|---|---|---|---|
| `id` | String | `@id @default(uuid())` | Unique inquiry ID |
| `businessId` | String | `@index` | Business foreign key (`onDelete: Cascade`) |
| `userId` | String? | Nullable, `@index` | Registered user ID if logged in |
| `customerName` | String | Required | Inquirer's full name |
| `customerEmail`| String | Required | Inquirer's email address |
| `customerPhone`| String? | Nullable | Inquirer's phone number |
| `message` | String | Required | Inquiry content/details |
| `dateRequested`| DateTime? | Nullable | Preferred travel/service date |
| `status` | InquiryStatus | `@default(PENDING)` | Partner status (`PENDING`, `RESPONDED`, `CLOSED`, `ESCALATED`, `EXPIRED`) |
| `slaDeadlineAt`| DateTime? | Nullable | SLA response cutoff timestamp |
| `escalatedAt` | DateTime? | Nullable | Timestamp when inquiry was escalated to Admin |
| `createdAt` | DateTime | `@default(now())` | Submission timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Last updated timestamp |

**Relations**:
- `business`: `Business`
- `user`: `User?`

---

### 3.4 Custom Trip Requests, Proposals & Managed Bookings

#### `TripRequest`
Bespoke travel requests submitted by Tourists for custom safari itineraries.

| Field | Type | Attributes / Constraints | Description |
|---|---|---|---|
| `id` | String | `@id @default(uuid())` | Unique request ID |
| `userId` | String | `@index` | Tourist user foreign key (`onDelete: Cascade`) |
| `destinationId` | String | `@index` | Destination foreign key (`onDelete: Restrict`) |
| `travelerCount` | Int | Required | Number of travelers |
| `startDate` | DateTime | Required | Trip start date |
| `endDate` | DateTime | Required | Trip end date |
| `budget` | String? | Nullable | Budget range description |
| `preferences` | String? | Nullable | Safari preferences (core/buffer, luxury/budget) |
| `notes` | String? | Nullable | Additional notes |
| `status` | TripStatus | `@default(PENDING)` | Status (`PENDING`, `REVIEWING`, `PROPOSAL_READY`, `BOOKED`, `CANCELLED`) |
| `createdAt` | DateTime | `@default(now())` | Created timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Updated timestamp |

**Relations**:
- `booking`: `Booking?`
- `proposals`: `Proposal[]`
- `destination`: `Destination`
- `user`: `User`

#### `Proposal`
Customized itineraries prepared by Admins for specific `TripRequest` records.

| Field | Type | Attributes / Constraints | Description |
|---|---|---|---|
| `id` | String | `@id @default(uuid())` | Unique proposal ID |
| `tripRequestId` | String | `@index` | Trip request link (`onDelete: Cascade`) |
| `userId` | String | `@index` | Target tourist ID (`onDelete: Cascade`) |
| `destinationId` | String? | Nullable, `@index` | Destination reference (`onDelete: Restrict`) |
| `safariNotes` | String? | Nullable | Recommended safari gates and zones |
| `resortIds` | String[] | Default `[]` | Selected curated resort IDs |
| `businessIds` | String[] | Default `[]` | Selected partner business IDs |
| `numberOfNights`| Int? | Nullable | Duration of stay |
| `dayWiseItinerary`| Json? | Nullable | Day-by-day activity plan |
| `activities` | String[] | Default `[]` | Included excursions (safari drives, birding, nature walks) |
| `totalPrice` | Float? | Nullable | Quoted package price |
| `notes` | String? | Nullable | Special terms & inclusions |
| `expiryDate` | DateTime? | Nullable | Validity deadline |
| `content` | String? | Nullable | Overview summary |
| `status` | ProposalStatus| `@default(DRAFT)` | Status (`DRAFT`, `SENT`, `ACCEPTED`, `CHANGE_REQUESTED`, `PENDING`, `REJECTED`, `WITHDRAWN`) |
| `changeRequest` | String? | Nullable | Feedback provided by tourist when requesting changes |
| `sentAt` | DateTime? | Nullable | Dispatch timestamp |
| `acceptedAt` | DateTime? | Nullable | Acceptance timestamp |
| `createdAt` | DateTime | `@default(now())` | Created timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Updated timestamp |

**Relations**:
- `booking`: `Booking?`
- `destination`: `Destination?`
- `tripRequest`: `TripRequest`
- `user`: `User`

#### `Booking` (Managed Safari Bookings)
Created automatically upon tourist acceptance of an Admin travel `Proposal`.

| Field | Type | Attributes / Constraints | Description |
|---|---|---|---|
| `id` | String | `@id @default(uuid())` | Unique booking ID |
| `userId` | String | `@index` | Tourist user foreign key (`onDelete: Restrict`) |
| `tripRequestId` | String | `@unique` | Associated trip request (`onDelete: Restrict`) |
| `proposalId` | String | `@unique` | Associated accepted proposal (`onDelete: Restrict`) |
| `destinationId` | String | `@index` | Destination foreign key (`onDelete: Restrict`) |
| `travelerCount` | Int | Required | Number of travelers |
| `startDate` | DateTime | Required | Confirmed start date |
| `endDate` | DateTime | Required | Confirmed end date |
| `totalAmount` | Float | Required | Confirmed package cost |
| `safariNotes` | String? | Nullable | Confirmed safari details |
| `resortIds` | String[] | Default `[]` | Confirmed resort bookings |
| `businessIds` | String[] | Default `[]` | Confirmed partner services |
| `status` | BookingStatus | `@default(CONFIRMED)` | Status (`CONFIRMED`, `COMPLETED`, `CANCELLED`) |
| `createdAt` | DateTime | `@default(now())` | Created timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Updated timestamp |

**Relations**:
- `destination`: `Destination`
- `proposal`: `Proposal`
- `tripRequest`: `TripRequest`
- `user`: `User`

---

### 3.5 Content & Community

#### `Article`
Educational wildlife articles, park guides, and photography tips published by Admins.

| Field | Type | Attributes / Constraints | Description |
|---|---|---|---|
| `id` | String | `@id @default(uuid())` | Unique article ID |
| `title` | String | Required | Article headline |
| `slug` | String | `@unique` | URL slug |
| `content` | String | Required | Full markdown / HTML body |
| `featuredImage`| String? | Nullable | Primary banner photo |
| `tags` | String[] | Default `[]` | Topic tags (e.g. `['Tadoba', 'Safari Tips', 'Tigers']`) |
| `status` | ArticleStatus | `@default(DRAFT)` | Status (`DRAFT`, `PUBLISHED`, `ARCHIVED`) |
| `authorId` | String | `@index` | Admin author foreign key (`User`) |
| `destinationId` | String? | Nullable, `@index` | Associated destination link |
| `deletedAt` | DateTime? | Nullable | Soft delete timestamp |
| `createdAt` | DateTime | `@default(now())` | Created timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Updated timestamp |

**Relations**:
- `author`: `User`
- `destination`: `Destination?`

---

### 3.6 Communication & Notifications

#### `Notification`
In-app notification system delivering status alerts and updates to Users across all roles.

| Field | Type | Attributes / Constraints | Description |
|---|---|---|---|
| `id` | String | `@id @default(uuid())` | Unique notification ID |
| `userId` | String | `@index` | Recipient user ID (`onDelete: Cascade`) |
| `title` | String | Required | Notification summary |
| `message` | String | Required | Notification message body |
| `type` | NotificationType| Required | Event category enum (22 types) |
| `isRead` | Boolean | `@default(false)`, `@index`| Read status boolean |
| `referenceId` | String? | Nullable | Related entity ID (e.g., businessId, bookingId, kycId) |
| `createdAt` | DateTime | `@default(now())` | Generated timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Updated timestamp |

**Relations**:
- `user`: `User`

---

## 4. Indexing & Integrity Constraints

1. **Foreign Key Indexes**: Explicit `@index` applied to all relational IDs (`userId`, `destinationId`, `businessId`, `roomId`, `vehicleId`, `equipmentId`, `tripRequestId`, etc.) to maximize query performance.
2. **Search Indexes**: Unique constraints (`@unique`) on `slug`, `email`, and `googleId`.
3. **Status Indexes**: Indexes on `status` columns (`TripStatus`, `ProposalStatus`, `ApprovalStatus`, `isRead`, `PayoutStatus`) for efficient dashboard filtering.
4. **Referential Actions**:
   - `onDelete: Cascade` for weak entities owned directly by a parent (e.g., `PartnerKyc` on `User`, `BusinessRoom`, `BusinessVehicle`, `BusinessEquipment`, `BusinessInventoryBlock`, and `BusinessInquiry` on `Business`, `Notification` on `User`).
   - `onDelete: Restrict` on critical business entities (e.g., `Destination` with active `Resort` or `Booking` records) to prevent accidental cascade drops.
   - `onDelete: SetNull` where relational history should be preserved even if the source user is removed (e.g., `BusinessInquiry.userId`).

---

## 5. Schema Maintenance Status

- [x] Schema Defined & Synchronized with Prisma Client (`src/generated/prisma`)
- [x] 17 Normalized Models & 14 Enums Deployed on PostgreSQL (Neon)
- [x] Multi-Role User Support (`ADMIN`, `TOURIST`, `BUSINESS_PARTNER`)
- [x] Partner KYC Compliance & Banking Verification System Active
- [x] Multi-Service Inventory Management (Rooms, Safari Vehicles, Camera Gear)
- [x] Calendar Blackout / Inventory Blocking Active
- [x] Atomic Direct Booking & Escrow Payout Engine Active
- [x] Managed Safari Proposal & Custom Trip Schema Active
- [x] Seed Script Configured (`prisma/seed.ts`)
- [x] Soft Deletion Implemented across Core Entities
