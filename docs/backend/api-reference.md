# Complete API Reference

**Version**: 2.0  
**Last Updated**: February 18, 2026  
**Status**: Production Ready

This is the complete API reference for the Self-Growth backend. Use this document to integrate with the API from mobile or web applications.

**Recent Changes (v2.0)**:

- UserProfile no longer contains `household_id` or `subject_id` (users can be members of multiple households)
- HouseholdMember no longer contains `display_name` or `dob` (access control only)
- HouseholdSubject now uses `created_by_user_id` instead of `user_id` (tracks who created the subject)
- All field names updated to match current implementation

---

## Table of Contents

1. [Base Information](#base-information)
2. [Data Model Overview](#data-model-overview)
3. [Authentication Flow](#authentication-flow)
4. [Authentication Endpoints](#authentication-endpoints)
5. [User Profile Endpoints](#user-profile-endpoints)
6. [Household Endpoints](#household-endpoints)
7. [Household Member Endpoints](#household-member-endpoints)
8. [Household Subject Endpoints](#household-subject-endpoints)
9. [ToDo Endpoints](#todo-endpoints)
10. [Habit Endpoints](#habit-endpoints)
11. [Habit Event Endpoints](#habit-event-endpoints)
12. [Blog Post Endpoints](#blog-post-endpoints)
13. [Pagination & Filtering](#pagination--filtering)
14. [Error Handling](#error-handling)
15. [Rate Limiting](#rate-limiting)
16. [Security & Validation](#security--validation)

---

## Data Model Overview

### Entity Relationships

```
UserProfile (Global Identity)
    ↓
    ├─→ HouseholdMember (Access Control) → Household
    │       ↓
    │       HouseholdSubject (Tracked Individual)
    │           ↓
    │           Todos, Habits, BlogPosts
    │
    └─→ HouseholdMember → Another Household
            ↓
            HouseholdSubject
                ↓
                Todos, Habits, BlogPosts
```

### Key Concepts

**UserProfile**: Application-level identity

- Contains: `id`, `email`, `username`, `first_name`, `last_name`, `phone_number`
- Does NOT contain `household_id` or `subject_id` (users can be members of multiple households)
- One per Cognito user

**HouseholdMember**: Access control (who can access a household)

- Contains: `household_id`, `user_id`, `role`
- Does NOT contain `display_name` or `dob` (those belong on HouseholdSubject)
- Junction table: User ↔ Household
- One user can be a member of multiple households

**HouseholdSubject**: Tracked individual (who is being tracked)

- Contains: `id`, `household_id`, `created_by_user_id`, `type`, `display_name`, `dob`
- Represents individuals being tracked (self, child, adult, pet)
- Has todos, habits, and blog posts
- `created_by_user_id` tracks who created this subject

**Household**: Shared container

- Contains: `id`, `name`, `owner_user_id`
- Can have multiple members and multiple subjects

### Scope Management

The frontend manages the "current scope" (selected household and subject):

- Store `householdId` and `subjectId` in AsyncStorage/localStorage
- Fetch households on app launch: `GET /households`
- Fetch subjects for selected household: `GET /households/{id}/subjects`
- Allow users to switch between households/subjects via a picker

### Use Case Examples

**Self-tracking**:

```
User creates profile → Creates household → Creates subject (type: self)
```

**Parent tracking child**:

```
Parent creates profile → Creates household → Creates subject (type: child)
```

**Shared household (couple)**:

```
User 1 creates household → Invites User 2 → Both create subjects (type: self)
```

---

## Base Information

### Base URLs

- **Development**: `https://{api-id}.execute-api.{region}.amazonaws.com/dev`
- **Production**: `https://{api-id}.execute-api.{region}.amazonaws.com/prod`

Replace `{api-id}` and `{region}` with your deployed API Gateway values.

### Authentication Header

All endpoints except authentication endpoints require a JWT access token:

```http
Authorization: Bearer <access-token>
```

### Content Type

All requests with a body must include:

```http
Content-Type: application/json
```

### Response Format

All responses are JSON with the following structure:

**Success (2xx):**

```json
{
  "id": "resource-id",
  "field": "value",
  ...
}
```

**Error (4xx/5xx):**

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {
    "field": "field_name",
    "additionalInfo": "..."
  }
}
```

---

## Authentication Flow

### New User Registration

1. **Sign Up** → `POST /auth/signup`
2. **Confirm Email** → `POST /auth/confirm` (with code from email)
3. **Login** → `POST /auth/login` (get tokens)
4. **Create Profile** → `POST /user-profile` (with access token)

### Existing User Login

1. **Login** → `POST /auth/login` (get tokens)
2. Use `accessToken` for API requests
3. When `accessToken` expires → `POST /auth/refresh` (with `refreshToken`)

### Token Lifecycle

- **Access Token**: Valid for 24 hours, used for API requests
- **ID Token**: Contains user claims (email, name, etc.)
- **Refresh Token**: Valid for 30 days, used to get new access tokens

---

### POST /auth/signup

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "phone_number": "+11234567890",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response (201 Created):**

```json
{
  "userSub": "cognito-user-id",
  "userConfirmed": false,
  "codeDelivery": {
    "deliveryMedium": "EMAIL",
    "destination": "u***@example.com"
  },
  "message": "Signup successful. Please confirm the code sent to your email."
}
```

**Error Codes:**

- `400`: Invalid input (weak password, invalid email)
- `409`: Email already exists

### POST /auth/confirm-signup

Confirm user signup with email verification code.

**Request Body:**

```json
{
  "email": "user@example.com",
  "confirmation_code": "123456"
}
```

**Response (200 OK):**

```json
{
  "message": "Signup confirmed. You can now log in."
}
```

**Error Codes:**

- `400`: Invalid confirmation code
- `404`: User not found

### POST /auth/login

Authenticate user and receive JWT tokens.

**Request Body:**

```json
{
  "username": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs...",
  "idToken": "eyJhbGciOiJSUzI1NiIs...",
  "refreshToken": "eyJjdHkiOiJKV1QiLCJlbmMi...",
  "expiresIn": 86400,
  "tokenType": "Bearer"
}
```

**Error Codes:**

- `401`: Invalid credentials
- `400`: User not confirmed

### POST /auth/refresh

Refresh expired access tokens using a refresh token.

**Request Body:**

```json
{
  "refresh_token": "eyJjdHkiOiJKV1QiLCJlbmMi..."
}
```

**Response (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs...",
  "idToken": "eyJhbGciOiJSUzI1NiIs...",
  "expiresIn": 86400,
  "tokenType": "Bearer"
}
```

**Error Codes:**

- `400`: Invalid or expired refresh token

## User Profile Endpoints

### POST /user-profile

Create user profile (called during onboarding after signup confirmation).

**Authentication:** Required

**Request Body:**

```json
{
  "username": "john_doe",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+11234567890"
}
```

**Response (201 Created):**

```json
{
  "id": "cognito-sub",
  "username": "john_doe",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+11234567890",
  "entity": "UserProfile",
  "date_created": "2026-02-18T10:00:00Z",
  "date_modified": "2026-02-18T10:00:00Z"
}
```

**Important Notes:**

- UserProfile does NOT contain `household_id` or `subject_id`
- Users can be members of multiple households
- Frontend manages current scope (selected household/subject) in local storage

**Error Codes:**

- `400`: Invalid input (invalid email, username, or phone format)
- `409`: Username or email already exists

### GET /user-profile

Get current user profile.

**Authentication:** Required

**Response (200 OK):**

```json
{
  "id": "cognito-sub",
  "username": "john_doe",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+11234567890",
  "entity": "UserProfile",
  "date_created": "2026-02-18T10:00:00Z",
  "date_modified": "2026-02-18T10:00:00Z"
}
```

**Response (404 Not Found):**

```json
{
  "error": "NOT_FOUND",
  "message": "Profile not found"
}
```

**Frontend Behavior:** If 404, call `POST /user-profile` to create profile during onboarding.

### PUT /user-profile

Update current user profile.

**Authentication:** Required

**Request Body (partial update):**

```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "phone_number": "+19876543210"
}
```

**Response (200 OK):**

```json
{
  "id": "cognito-sub",
  "username": "john_doe",
  "email": "user@example.com",
  "first_name": "Jane",
  "last_name": "Smith",
  "phone_number": "+19876543210",
  "entity": "UserProfile",
  "date_created": "2026-02-18T10:00:00Z",
  "date_modified": "2026-02-18T14:30:00Z"
}
```

**Important:** Email and username cannot be changed after profile creation.

## ToDo Endpoints

### POST /households/{householdId}/subjects/{subjectId}/todos

Create a new todo for a subject.

**Authentication:** Required
**Authorization:** User must be household member; subject must exist in household

**Path Parameters:**

- `householdId` (string): Household identifier
- `subjectId` (string): Subject identifier

**Request Body:**

```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "checklist": ["Milk", "Eggs", "Bread"],
  "difficulty": "easy",
  "status": "active",
  "date_due": "2025-01-15"
}
```

**Response (201 Created):**

```json
{
  "id": "todo-id",
  "title": "Buy groceries",
  "householdId": "household-id",
  "subjectId": "subject-id",
  "description": "Milk, eggs, bread",
  "checklist": ["Milk", "Eggs", "Bread"],
  "difficulty": "easy",
  "status": "active",
  "dateDue": "2025-01-15",
  "dateCreated": "2025-01-01T10:00:00Z",
  "dateModified": "2025-01-01T10:00:00Z"
}
```

### GET /households/{householdId}/subjects/{subjectId}/todos/{todoId}

Get a specific todo.

**Authentication:** Required
**Authorization:** User must be household member

**Response (200 OK):** ToDo object (same format as create response)

### GET /households/{householdId}/subjects/{subjectId}/todos

Get all todos for a subject.

**Authentication:** Required
**Authorization:** User must be household member

**Query Parameters:**

- `sortBy` (string, optional): Sort order (`date_due` or `date_modified`, default: `date_modified`)
- `limit` (integer, optional): Items per page (1-100)
- `nextToken` (string, optional): Opaque pagination token from previous response
- `status` (string, optional): Filter by status (`active`, `completed`, `deleted`)

**Response (200 OK):**

```json
{
  "items": [
    {
      "id": "todo-id",
      "title": "Buy groceries"
    }
  ],
  "nextToken": "eyJwayI6Ik..."
}
```

### PUT /households/{householdId}/subjects/{subjectId}/todos/{todoId}

Update an existing todo.

**Authentication:** Required
**Authorization:** User must be household member

**Request Body:** Partial update (any fields from create request)

**Response (200 OK):** Updated ToDo object

### DELETE /households/{householdId}/subjects/{subjectId}/todos/{todoId}

Delete a todo (soft delete).

**Authentication:** Required
**Authorization:** User must be household member

**Response (204 No Content)**

## Habit Endpoints

### POST /households/{householdId}/subjects/{subjectId}/habits

Create a new habit for a subject.

**Authentication:** Required
**Authorization:** User must be household member; subject must exist in household

**Request Body:**

```json
{
  "title": "Morning run",
  "description": "5km run every morning",
  "counter": "daily",
  "difficulty": "medium",
  "type": "build",
  "status": "active"
}
```

**Response (201 Created):**

```json
{
  "id": "habit-id",
  "title": "Morning run",
  "householdId": "household-id",
  "subjectId": "subject-id",
  "description": "5km run every morning",
  "counter": "daily",
  "difficulty": "medium",
  "type": "build",
  "status": "active",
  "dateCreated": "2025-01-01T10:00:00Z",
  "dateModified": "2025-01-01T10:00:00Z"
}
```

### GET /households/{householdId}/subjects/{subjectId}/habits/{habitId}

Get a specific habit.

**Authentication:** Required
**Authorization:** User must be household member

**Response (200 OK):** Habit object (same format as create response)

### GET /households/{householdId}/subjects/{subjectId}/habits

Get all habits for a subject.

**Authentication:** Required
**Authorization:** User must be household member

**Response (200 OK):**

```json
{
  "items": [
    {
      "id": "habit-id",
      "title": "Morning run"
    }
  ],
  "nextToken": null
}
```

**Query Parameters:**

- `limit` (integer, optional): Items per page (1-100)
- `nextToken` (string, optional): Opaque pagination token from previous response
- `status` (string, optional): Filter by status (`active`, `archived`, `deleted`)

### PUT /households/{householdId}/subjects/{subjectId}/habits/{habitId}

Update an existing habit.

**Authentication:** Required
**Authorization:** User must be household member

**Request Body:** Partial update (any fields from create request)

**Response (200 OK):** Updated Habit object

### DELETE /households/{householdId}/subjects/{subjectId}/habits/{habitId}

Delete a habit (soft delete).

**Authentication:** Required
**Authorization:** User must be household member

**Response (204 No Content)**

## Habit Event Endpoints

### POST /households/{householdId}/subjects/{subjectId}/habits/{habitId}/events

Create a habit event (log habit occurrence).

**Authentication:** Required
**Authorization:** User must be household member; habit must exist

**Request Body:**

```json
{
  "status": "done",
  "note": "Completed 5km run in 30 minutes"
}
```

**Response (201 Created):**

```json
{
  "id": "event-id",
  "householdId": "household-id",
  "subjectId": "subject-id",
  "habitId": "habit-id",
  "periodKey": "2025-01-15",
  "status": "done",
  "note": "Completed 5km run in 30 minutes",
  "dateCreated": "2025-01-15T07:30:00Z",
  "dateModified": "2025-01-15T07:30:00Z"
}
```

**Behavior:**

- Period key is auto-calculated based on habit counter type
- One event per period is enforced (returns 400 if duplicate exists)
- Idempotent by design (same action = same DynamoDB key)

**Error Codes:**

- `400`: Event already exists for this period
- `403`: User not authorized
- `404`: Habit not found

### GET /households/{householdId}/subjects/{subjectId}/habits/{habitId}/events

Get all habit events for a habit.

**Authentication:** Required
**Authorization:** User must be household member

**Query Parameters:**

- `limit` (integer, optional): Items per page (1-100)
- `nextToken` (string, optional): Opaque pagination token from previous response
- `status` (string, optional): Filter by status (`done`, `skipped`, `failed`)

**Response (200 OK):**

```json
{
  "items": [
    {
      "id": "event-id",
      "periodKey": "2025-01-15",
      "status": "done"
    }
  ],
  "nextToken": null
}
```

### GET /households/{householdId}/subjects/{subjectId}/habits/{habitId}/events/{periodKey}

Get a single habit event by period key.

**Authentication:** Required
**Authorization:** User must be household member

**Response (200 OK):** HabitEvent object

### GET /households/{householdId}/subjects/{subjectId}/habits/{habitId}/analytics

Get analytics for a habit (computed on-the-fly from events).

**Authentication:** Required
**Authorization:** User must be household member

**Response (200 OK):**

```json
{
  "habitId": "habit-id",
  "counter": "daily",
  "totalEvents": 45,
  "distribution": {
    "done": 38,
    "skipped": 5,
    "failed": 2
  },
  "completionRate": 0.8444,
  "currentStreak": 7,
  "longestStreak": 14,
  "firstEventDate": "2025-11-01T08:00:00Z",
  "lastEventDate": "2026-02-16T07:30:00Z"
}
```

## Household Endpoints

### POST /households

Create a new household.

**Authentication:** Required

**Request Body:**

```json
{
  "name": "Smith Family"
}
```

**Response (201 Created):**

```json
{
  "id": "hh-123",
  "name": "Smith Family",
  "owner_user_id": "cognito-sub",
  "entity": "Household",
  "date_created": "2026-02-18T10:00:00Z",
  "date_modified": "2026-02-18T10:00:00Z"
}
```

**Backend Behavior:** Automatically creates a HouseholdMember record linking the authenticated user to this household with role `owner`.

**Error Codes:**

- `400`: Invalid input (name is required)

### GET /households/{householdId}

Get household details.

**Authentication:** Required
**Authorization:** User must be household member

**Response (200 OK):**

```json
{
  "id": "hh-123",
  "name": "Smith Family",
  "owner_user_id": "cognito-sub",
  "entity": "Household",
  "date_created": "2026-02-18T10:00:00Z",
  "date_modified": "2026-02-18T10:00:00Z"
}
```

**Error Codes:**

- `403`: User is not a member of this household
- `404`: Household not found

### GET /households

List user's households (only households where user is a member).

**Authentication:** Required

**Query Parameters:**

- `limit` (integer, optional): Items per page (1-100, default: 20)
- `nextToken` (string, optional): Pagination token from previous response

**Response (200 OK):**

```json
{
  "items": [
    {
      "id": "hh-123",
      "name": "Smith Family",
      "owner_user_id": "cognito-sub",
      "entity": "Household",
      "date_created": "2026-02-18T10:00:00Z",
      "date_modified": "2026-02-18T10:00:00Z"
    }
  ],
  "nextToken": null
}
```

### PUT /households/{householdId}

Update household.

**Authentication:** Required
**Authorization:** User must be household member

**Request Body (partial update):**

```json
{
  "name": "Updated Family Name"
}
```

**Response (200 OK):** Updated Household object

**Error Codes:**

- `403`: User is not a member of this household
- `404`: Household not found

### DELETE /households/{householdId}

Delete household (soft delete).

**Authentication:** Required
**Authorization:** User must be household owner

**Response (204 No Content)**

**Error Codes:**

- `403`: User is not the household owner
- `404`: Household not found

## Household Member Endpoints

### POST /households/{householdId}/members

Add a member to a household.

**Authentication:** Required
**Authorization:** User must be household member

**Request Body:**

```json
{
  "user_id": "cognito-sub-of-new-member",
  "role": "member"
}
```

**Valid Roles:** `owner`, `admin`, `member`

**Response (201 Created):**

```json
{
  "household_id": "hh-123",
  "user_id": "cognito-sub-of-new-member",
  "role": "member",
  "entity": "Member",
  "date_created": "2026-02-18T10:00:00Z",
  "date_modified": "2026-02-18T10:00:00Z"
}
```

**Important Notes:**

- HouseholdMember represents access control (who can access the household)
- Does NOT contain `display_name` or `dob` (those belong on HouseholdSubject)
- To display member names, fetch their UserProfile using `user_id`

**Error Codes:**

- `400`: Invalid input (user_id or role missing/invalid)
- `403`: User is not a member of this household
- `409`: User is already a member of this household

### GET /households/{householdId}/members

List household members.

**Authentication:** Required
**Authorization:** User must be household member

**Query Parameters:**

- `limit` (integer, optional): Items per page (1-100, default: 20)
- `nextToken` (string, optional): Pagination token from previous response

**Response (200 OK):**

```json
{
  "items": [
    {
      "household_id": "hh-123",
      "user_id": "cognito-sub",
      "role": "owner",
      "entity": "Member",
      "date_created": "2026-02-18T10:00:00Z",
      "date_modified": "2026-02-18T10:00:00Z"
    }
  ],
  "nextToken": null
}
```

**Frontend Tip:** To display member names, fetch each user's UserProfile:

```javascript
for (const member of members.items) {
  const profile = await fetch(`/user-profile/${member.user_id}`);
  console.log(`${profile.first_name} ${profile.last_name} - ${member.role}`);
}
```

**Error Codes:**

- `403`: User is not a member of this household

### DELETE /households/{householdId}/members/{userId}

Remove a member from a household.

**Authentication:** Required
**Authorization:** User must be household owner or admin

**Response (204 No Content)**

**Error Codes:**

- `403`: User lacks permission to remove members
- `404`: Member not found in household

## Household Subject Endpoints

### POST /households/{householdId}/subjects

Create a subject in a household (individual being tracked).

**Authentication:** Required
**Authorization:** User must be household member

**Request Body:**

```json
{
  "type": "child",
  "display_name": "Emma",
  "dob": "2018-05-15"
}
```

**Valid Types:** `self`, `child`, `adult`, `pet`

**Response (201 Created):**

```json
{
  "id": "sub-456",
  "household_id": "hh-123",
  "created_by_user_id": "cognito-sub",
  "type": "child",
  "display_name": "Emma",
  "dob": "2018-05-15",
  "points": null,
  "level": null,
  "entity": "Subject",
  "date_created": "2026-02-18T10:00:00Z",
  "date_modified": "2026-02-18T10:00:00Z"
}
```

**Important Notes:**

- `created_by_user_id` is automatically set from the authenticated user's token
- Tracks who created this subject (ownership/audit trail)
- HouseholdSubject represents the tracked individual (has todos, habits, blogs)
- `display_name` and `dob` are stored here (not on HouseholdMember)

**Error Codes:**

- `400`: Invalid input (type is required, invalid type value)
- `403`: User is not a member of this household

### GET /households/{householdId}/subjects/{subjectId}

Get subject details.

**Authentication:** Required
**Authorization:** User must be household member

**Response (200 OK):**

```json
{
  "id": "sub-456",
  "household_id": "hh-123",
  "created_by_user_id": "cognito-sub",
  "type": "child",
  "display_name": "Emma",
  "dob": "2018-05-15",
  "points": null,
  "level": null,
  "entity": "Subject",
  "date_created": "2026-02-18T10:00:00Z",
  "date_modified": "2026-02-18T10:00:00Z"
}
```

**Error Codes:**

- `403`: User is not a member of this household
- `404`: Subject not found

### GET /households/{householdId}/subjects

List all subjects in a household.

**Authentication:** Required
**Authorization:** User must be household member

**Query Parameters:**

- `limit` (integer, optional): Items per page (1-100, default: 20)
- `nextToken` (string, optional): Pagination token from previous response
- `type` (string, optional): Filter by type (`self`, `child`, `adult`, `pet`)

**Response (200 OK):**

```json
{
  "items": [
    {
      "id": "sub-456",
      "household_id": "hh-123",
      "created_by_user_id": "cognito-sub",
      "type": "child",
      "display_name": "Emma",
      "dob": "2018-05-15",
      "points": null,
      "level": null,
      "entity": "Subject",
      "date_created": "2026-02-18T10:00:00Z",
      "date_modified": "2026-02-18T10:00:00Z"
    }
  ],
  "nextToken": null
}
```

**Error Codes:**

- `403`: User is not a member of this household

### PUT /households/{householdId}/subjects/{subjectId}

Update a subject.

**Authentication:** Required
**Authorization:** User must be household member

**Request Body (partial update):**

```json
{
  "display_name": "Emma Rose",
  "dob": "2018-05-15"
}
```

**Response (200 OK):** Updated HouseholdSubject object

**Error Codes:**

- `403`: User is not a member of this household
- `404`: Subject not found

### DELETE /households/{householdId}/subjects/{subjectId}

Delete a subject (soft delete).

**Authentication:** Required
**Authorization:** User must be household member

**Response (204 No Content)**

**Warning:** Deleting a subject will also delete all associated todos, habits, and blog posts.

**Error Codes:**

- `403`: User is not a member of this household
- `404`: Subject not found

## Blog Post Endpoints

### POST /blogs

Create a new blog post.

**Authentication:** Required

**Request Body:**

```json
{
  "title": "My Reflection",
  "content": "Today I learned...",
  "status": "draft",
  "visibility": "private"
}
```

**Response (201 Created):** BlogPost object

### GET /blogs/{postId}

Get a specific blog post.

**Authentication:** Required

**Response (200 OK):** BlogPost object

### GET /blogs

List user's blog posts.

**Authentication:** Required

**Query Parameters:**

- `limit` (integer, optional): Items per page (1-100)
- `nextToken` (string, optional): Opaque pagination token
- `status` (string, optional): Filter by status (`draft`, `published`, `archived`)

**Response (200 OK):**

```json
{
  "items": [{ "id": "...", "title": "My Reflection" }],
  "nextToken": null
}
```

### PUT /blogs/{postId}

Update a blog post.

**Authentication:** Required

**Response (200 OK):** Updated BlogPost object

## Field Validation

### UserProfile Validations

- **Username**: 3-20 characters, alphanumeric + underscore only
- **Email**: RFC-compliant email format, max 255 characters
- **Phone**: 10-15 digits (with optional +)
- **First Name / Last Name**: Letters, spaces, apostrophes, hyphens only

### HouseholdSubject Validations

- **Type**: Must be one of: `self`, `child`, `adult`, `pet`
- **Display Name**: 1-50 characters (optional)
- **DOB**: ISO 8601 date format (YYYY-MM-DD, optional)

### HouseholdMember Validations

- **Role**: Must be one of: `owner`, `admin`, `member`
- **User ID**: Required, must be valid Cognito user ID

### Common Validations

- **Difficulty**: Must be one of: `trivial`, `easy`, `medium`, `hard`
- **Dates**: ISO 8601 format (YYYY-MM-DD)
- **Timestamps**: ISO 8601 format with timezone (YYYY-MM-DDTHH:mm:ssZ)

### Habit-Specific Validations

- **Counter**: Must be one of: `daily`, `weekly`, `monthly`
- **Type**: Must be one of: `build`, `quit`
- **Status**: Must be one of: `active`, `archived`, `deleted`
- **Title**: Required, 1-200 characters
- **Description**: Optional, max 1000 characters

### ToDo-Specific Validations

- **Status**: Must be one of: `active`, `completed`, `deleted`
- **Title**: Required, 1-200 characters
- **Description**: Optional, max 1000 characters
- **Checklist**: Array of strings (optional)
- **Date Due**: ISO 8601 date format (YYYY-MM-DD, optional)

### Habit Event Validations

- **Status**: Must be one of: `done`, `skipped`, `failed`
- **Period Key**: Auto-generated based on habit counter type, cannot be manually set
- **Note**: Optional, max 500 characters

## Error Codes

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `204`: No Content (successful deletion)
- `400`: Bad Request (validation error)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate resource)
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error

### Rate Limiting

All endpoints are subject to rate limiting:

- **Burst Limit**: 100 concurrent requests
- **Rate Limit**: 50 requests per second

When rate limited, the API returns `429 Too Many Requests`. Implement exponential backoff retry logic in your client. See [Rate Limiting Documentation](../docs/rate-limiting.md) for details.

### Common Error Messages

- `"Invalid input"`: Request body validation failed
- `"User not authorized"`: User lacks permission for this resource
- `"Resource not found"`: Requested resource doesn't exist
- `"Duplicate resource"`: Resource already exists (e.g., habit event for period)

---

## Related Documentation

### For Frontend Developers

- **[Frontend Project Context](./fe-project-context.md)** - Frontend integration guide with examples
- **[Frontend Source of Truth](./fe-source-of-truth.md)** - Complete API contract for frontend
- **[Onboarding Flow Update](./ONBOARDING_FLOW_UPDATE.md)** - Detailed onboarding implementation guide

### For Backend Developers

- **[Source of Truth](./source-of-truth.md)** - Backend architecture and current state
- **[Project Context](./project-context.md)** - Design principles and mental model
- **[Architecture Overview](./architecture-overview.md)** - System architecture details

### Data Model & Relationships

- **[Entity Relationships](./ENTITY_RELATIONSHIPS.md)** - Complete relationship guide with examples
- **[Relationship Summary](./RELATIONSHIP_SUMMARY.md)** - Quick reference for entity connections
- **[Data Model Clarification](./DATA_MODEL_CLARIFICATION.md)** - Member vs Subject explained
- **[Member vs Subject Summary](./MEMBER_VS_SUBJECT_SUMMARY.md)** - Quick comparison guide

### Security & Operations

- **[Input Sanitization](./input-sanitization.md)** - Security measures and validation
- **[Rate Limiting](./rate-limiting.md)** - Rate limiting configuration and retry strategies
- **[Security Quick Reference](./security-quick-reference.md)** - Quick security guide
- **[Deployment Troubleshooting](./deployment-troubleshooting.md)** - Common deployment issues

---

## Quick Start Guide

### 1. Authentication

```bash
# Sign up
POST /auth/signup
{ "email": "user@example.com", "password": "SecurePass123!" }

# Confirm (get code from email)
POST /auth/confirm
{ "email": "user@example.com", "confirmation_code": "123456" }

# Login
POST /auth/login
{ "username": "user@example.com", "password": "SecurePass123!" }
# Save accessToken from response
```

### 2. Onboarding

```bash
# Create profile
POST /user-profile
Authorization: Bearer {accessToken}
{ "username": "johndoe", "email": "user@example.com", "first_name": "John", "last_name": "Doe" }

# Create household
POST /households
Authorization: Bearer {accessToken}
{ "name": "Smith Family" }
# Save household.id

# Create subject
POST /households/{householdId}/subjects
Authorization: Bearer {accessToken}
{ "type": "self", "display_name": "John" }
# Save subject.id in local storage
```

### 3. Create Data

```bash
# Create todo
POST /households/{householdId}/subjects/{subjectId}/todos
Authorization: Bearer {accessToken}
{ "title": "Buy groceries", "difficulty": "easy" }

# Create habit
POST /households/{householdId}/subjects/{subjectId}/habits
Authorization: Bearer {accessToken}
{ "title": "Morning run", "counter": "daily", "type": "build" }

# Log habit event
POST /households/{householdId}/subjects/{subjectId}/habits/{habitId}/events
Authorization: Bearer {accessToken}
{ "status": "done", "note": "Completed 5km" }
```

---

## Version History

### v2.0 (February 18, 2026)

- Removed `household_id` and `subject_id` from UserProfile
- Removed `display_name` and `dob` from HouseholdMember
- Changed `user_id` to `created_by_user_id` in HouseholdSubject
- Updated all field names to match snake_case convention
- Added comprehensive data model overview
- Added related documentation links

### v1.0 (February 16, 2026)

- Initial production-ready API
- All core endpoints implemented
- Authentication, profiles, households, subjects, todos, habits, events, blogs
