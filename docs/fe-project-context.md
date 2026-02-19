<!-- Last Updated: February 19, 2026 -->

# Project Context

## Overview

Self Growth is a personal development app for adults to track habits and todos. The app is designed with a calming, elegant aesthetic specifically for users with ADHD and anxiety. It supports multi-user households where one person can track habits/todos for themselves or dependents (children, elderly parents, etc.).

## Target Audience

- Adults focused on personal development
- Parents tracking their children's habits
- Caregivers managing routines for dependents
- Users with ADHD who need clear hierarchy and generous spacing
- Users with anxiety who benefit from calming colors and predictable patterns

## Design Philosophy

**NOT like Habitica/Finch** — Those apps are playful and gamified, designed for younger audiences. Our app is:

- Elegant and sophisticated
- Calming with muted colors (sage green, serene blue, soft purple)
- Minimalistic and professional
- Serious about personal development

## Core Concepts

### Hierarchical Ownership Model

```
User (Cognito Identity)
  └── UserProfile (App Identity)
       ├── HouseholdMember (Access Control) → Household
       │       ↓
       │       HouseholdSubject (Tracked Individual)
       │           ↓
       │           Todos, Habits, BlogPosts
       │
       └── HouseholdMember → Another Household
               ↓
               HouseholdSubject
                   ↓
                   Todos, Habits, BlogPosts
```

### Why This Structure?

1. **User (Cognito)** — Authentication identity managed by AWS Cognito
2. **UserProfile** — Application identity that links Cognito user to app data (does NOT contain householdId/subjectId)
3. **HouseholdMember** — Access control linking users to households with roles (owner/admin/member)
4. **Household** — Shared container (family, couple, individual workspace)
5. **HouseholdSubject** — Individual being tracked (self, child, adult, pet) with displayName and dob

This allows:

- One parent to track multiple children
- Caregivers to manage elderly parents
- Couples to share a household
- Multiple users accessing the same household
- Users to be members of multiple households

### Scoping

ALL data operations are scoped: `/households/{householdId}/subjects/{subjectId}/todos`

Every API call from the frontend includes:

- `householdId` — Which household this data belongs to
- `subjectId` — Which individual within that household

The backend MUST validate that the authenticated user has access to the requested household/subject.

## User Flows

### New User Journey

1. **Signup** → User creates account with email/password
2. **Email Confirmation** → User enters 6-digit code
3. **Auto-Login** → After confirmation, user is automatically logged in
4. **Onboarding** → 4-screen flow:
   - Welcome (with inspirational quote)
   - Profile Setup (username, first name, last name)
   - Household Setup (create household + "self" subject in one step)
   - Completion (sets scope, navigates to main app)
5. **Main App** → User can now create habits and todos

### Returning User Journey

1. **Login** → User enters email/password
2. **Scope Check** → App checks if user has household/subject
3. **Main App** → If scope exists, go straight to main app
4. **Onboarding** → If no scope, show onboarding screens

## Authentication Flow

### Signup

```
POST /auth/signup
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 200 OK
{
  "userSub": "cognito-user-id",
  "userConfirmed": false,
  "codeDelivery": {
    "deliveryMedium": "EMAIL",
    "destination": "u***@example.com"
  },
  "message": "User created. Check email for confirmation code."
}
```

### Confirm Signup

```
POST /auth/confirm
{
  "email": "user@example.com",
  "confirmationCode": "123456"
}

Response: 200 OK
{} or { "message": "User confirmed" }
```

### Login

```
POST /auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "accessToken": "eyJhbGc...",
  "idToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 3600,
  "tokenType": "Bearer"
}
```

Frontend stores these tokens in SecureStore (encrypted) and attaches `accessToken` as Bearer token to all subsequent requests.

## Profile Management

### Get Profile

```
GET /user-profile
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "id": "cognito-user-id",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": null,
  "entity": "UserProfile",
  "dateCreated": "2026-02-16T10:00:00Z",
  "dateModified": "2026-02-16T10:00:00Z"
}

Response: 404 Not Found (if profile doesn't exist yet)
```

**Important:** UserProfile does NOT contain `householdId`, `subjectId`, or `email`. Users can be members of multiple households. The frontend manages the "current scope" (selected household and subject) in SecureStore.

### Create Profile

```
POST /user-profile
Authorization: Bearer {accessToken}
{
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201 Created
{
  "id": "cognito-user-id",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": null,
  "entity": "UserProfile",
  "dateCreated": "2026-02-16T10:00:00Z",
  "dateModified": "2026-02-16T10:00:00Z"
}
```

**Frontend Behavior:** After login, frontend calls `GET /user-profile`. If 404, user goes through onboarding where `POST /user-profile` is called with `username` (required).

## Household & Subject Management

### Create Household

```
POST /households
Authorization: Bearer {accessToken}
{
  "name": "Smith Family"
}

Response: 201 Created
{
  "id": "hh-123",
  "name": "Smith Family",
  "ownerUserId": "cognito-user-id",
  "dateCreated": "2026-02-16T10:00:00Z",
  "dateModified": "2026-02-16T10:00:00Z"
}
```

**Backend Behavior:** Automatically creates a HouseholdMember record linking the authenticated user to this household with role `owner`.

### List Households

```
GET /households
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "items": [
    {
      "id": "hh-123",
      "name": "Smith Family",
      "ownerUserId": "cognito-user-id",
      "dateCreated": "2026-02-16T10:00:00Z",
      "dateModified": "2026-02-16T10:00:00Z"
    }
  ],
  "nextToken": null
}
```

**Note:** Returns only households the authenticated user is a member of.

### Create Subject

```
POST /households/{householdId}/subjects
Authorization: Bearer {accessToken}
{
  "type": "child",
  "displayName": "Emma",
  "dob": "2018-05-15"
}

Response: 201 Created
{
  "id": "sub-456",
  "householdId": "hh-123",
  "createdByUserId": "cognito-user-id",
  "type": "child",
  "displayName": "Emma",
  "dob": "2018-05-15",
  "points": null,
  "level": null,
  "dateCreated": "2026-02-16T10:00:00Z",
  "dateModified": "2026-02-16T10:00:00Z"
}
```

**Backend Behavior:** Automatically sets `createdByUserId` from the authenticated user's token (tracks who created this subject).

### List Subjects

```
GET /households/{householdId}/subjects
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "items": [
    {
      "id": "sub-456",
      "householdId": "hh-123",
      "createdByUserId": "cognito-user-id",
      "type": "child",
      "displayName": "Emma",
      "dob": "2018-05-15",
      "points": null,
      "level": null,
      "dateCreated": "2026-02-16T10:00:00Z",
      "dateModified": "2026-02-16T10:00:00Z"
    }
  ],
  "nextToken": null
}
```

## ToDo Operations

All ToDo endpoints are scoped under `/households/{hid}/subjects/{sid}/todos`

### List ToDos

```
GET /households/{hid}/subjects/{sid}/todos
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "items": [
    {
      "id": "todo-1",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "status": "active",
      "difficulty": "easy",
      "dateDue": "2026-02-20",
      "checklist": ["Milk", "Eggs", "Bread"],
      "dateCreated": "2026-02-16T10:00:00Z",
      "dateModified": "2026-02-16T10:00:00Z"
    }
  ],
  "lastEvaluatedKey": null
}
```

### Create ToDo

```
POST /households/{hid}/subjects/{sid}/todos
Authorization: Bearer {accessToken}
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "difficulty": "easy",
  "dateDue": "2026-02-20",
  "checklist": ["Milk", "Eggs", "Bread"]
}

Response: 201 Created
{
  "id": "todo-1",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "status": "active",
  "difficulty": "easy",
  "dateDue": "2026-02-20",
  "checklist": ["Milk", "Eggs", "Bread"],
  "dateCreated": "2026-02-16T10:00:00Z",
  "dateModified": "2026-02-16T10:00:00Z"
}
```

### Update ToDo

```
PUT /households/{hid}/subjects/{sid}/todos/{id}
Authorization: Bearer {accessToken}
{
  "title": "Buy groceries and snacks",
  "status": "completed"
}

Response: 200 OK
{
  "id": "todo-1",
  "title": "Buy groceries and snacks",
  "status": "completed",
  ...
}
```

### Delete ToDo (Soft Delete)

```
DELETE /households/{hid}/subjects/{sid}/todos/{id}
Authorization: Bearer {accessToken}

Response: 200 OK or 204 No Content
```

**Important:** This should be a SOFT delete (set `status: "deleted"`), not a hard delete. Frontend filters out deleted items.

## Habit Operations

All Habit endpoints are scoped under `/households/{hid}/subjects/{sid}/habits`

### List Habits

```
GET /households/{hid}/subjects/{sid}/habits
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "items": [
    {
      "id": "habit-1",
      "title": "Morning run",
      "description": "Run 3 miles",
      "type": "build",
      "counter": "daily",
      "difficulty": "medium",
      "status": "active",
      "dateCreated": "2026-02-16T10:00:00Z",
      "dateModified": "2026-02-16T10:00:00Z"
    }
  ],
  "lastEvaluatedKey": null
}
```

### Create Habit

```
POST /households/{hid}/subjects/{sid}/habits
Authorization: Bearer {accessToken}
{
  "title": "Morning run",
  "description": "Run 3 miles",
  "type": "build",
  "counter": "daily",
  "difficulty": "medium"
}

Response: 201 Created
{
  "id": "habit-1",
  "title": "Morning run",
  "description": "Run 3 miles",
  "type": "build",
  "counter": "daily",
  "difficulty": "medium",
  "status": "active",
  "dateCreated": "2026-02-16T10:00:00Z",
  "dateModified": "2026-02-16T10:00:00Z"
}
```

### Update Habit

```
PUT /households/{hid}/subjects/{sid}/habits/{id}
Authorization: Bearer {accessToken}
{
  "status": "archived"
}

Response: 200 OK
{
  "id": "habit-1",
  "status": "archived",
  ...
}
```

### Delete Habit (Soft Delete)

```
DELETE /households/{hid}/subjects/{sid}/habits/{id}
Authorization: Bearer {accessToken}

Response: 200 OK or 204 No Content
```

**Important:** Soft delete (set `status: "deleted"`).

## Field Enums

### ToDo

- `status`: `"active"` | `"completed"` | `"deleted"`
- `difficulty`: `"trivial"` | `"easy"` | `"medium"` | `"hard"`

### Habit

- `status`: `"active"` | `"archived"` | `"deleted"`
- `type`: `"build"` | `"quit"`
- `counter`: `"daily"` | `"weekly"` | `"monthly"`
- `difficulty`: `"trivial"` | `"easy"` | `"medium"` | `"hard"`

## Security Requirements

### Authorization

The backend MUST validate:

1. User is authenticated (valid JWT token)
2. User has access to the requested household
3. User has permission to access the requested subject

### Membership Validation

When a user creates a household, automatically create a membership record linking them to it. When they try to access `/households/{hid}/subjects/{sid}/todos`, verify:

1. User is a member of household `{hid}`
2. Subject `{sid}` belongs to household `{hid}`

If either check fails, return `403 Forbidden`.

## Error Responses

### 400 Bad Request

```json
{
  "error": "Invalid input",
  "details": "Title is required"
}
```

### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden

```json
{
  "error": "Forbidden",
  "message": "You do not have access to this household"
}
```

### 404 Not Found

```json
{
  "error": "Not found",
  "message": "Todo not found"
}
```

### 409 Conflict

```json
{
  "error": "Conflict",
  "message": "Email already exists"
}
```

## Frontend Expectations

### Response Format

Frontend expects JSON responses with the data directly in the body:

```json
{
  "id": "todo-1",
  "title": "Buy groceries",
  ...
}
```

NOT wrapped in a `body` field like:

```json
{
  "statusCode": 200,
  "body": "{\"id\":\"todo-1\",...}"
}
```

### Date Format

All dates should be ISO 8601 strings: `"2026-02-16T10:00:00Z"`

### Field Naming

Use camelCase for all field names: `dateCreated`, `householdId`, `firstName`

## Future Features (Not Yet Implemented)

### Habit Events

Track individual habit occurrences:

```
POST /households/{hid}/subjects/{sid}/habits/{habitId}/events
{
  "status": "done",
  "note": "Felt great!"
}
```

One event per period (daily/weekly/monthly) enforced by backend.

### Token Refresh

Frontend doesn't yet implement token refresh. When access token expires, user must re-login.

### Household Invitations

Allow users to invite others to their household (not yet implemented).

## Testing the API

### Postman Collection

1. **Signup** → Get confirmation code from email
2. **Confirm** → Use the code
3. **Login** → Get access token
4. **Create Profile** → Use Bearer token
5. **Create Household** → Use Bearer token
6. **Create Subject** → Use Bearer token with household ID
7. **Create ToDo** → Use Bearer token with household ID and subject ID

### Example Flow

```bash
# 1. Signup
curl -X POST https://api.example.com/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","firstName":"Test","lastName":"User"}'

# 2. Confirm (get code from email)
curl -X POST https://api.example.com/auth/confirm \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","confirmationCode":"123456"}'

# 3. Login
curl -X POST https://api.example.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Save the accessToken from response

# 4. Create Profile
curl -X POST https://api.example.com/user-profile \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User"}'

# 5. Create Household
curl -X POST https://api.example.com/households \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Household"}'

# Save the household id from response

# 6. Create Subject
curl -X POST https://api.example.com/households/{hid}/subjects \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Subject"}'

# Save the subject id from response

# 7. Create ToDo
curl -X POST https://api.example.com/households/{hid}/subjects/{sid}/todos \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Todo","difficulty":"easy"}'
```

## Questions for Backend Team

1. **Token Expiration** — What's the access token expiration time? Frontend needs to implement refresh logic.
2. **Pagination** — Do you support pagination for list endpoints? Frontend sends `lastEvaluatedKey` but doesn't use it yet.
3. **Habit Events** — Is the backend ready for habit event tracking, or is this future work?
4. **Deleted Item Filtering** — Should backend filter deleted items from list responses, or should frontend filter client-side?

## Related Docs

- [Source of Truth](./fe-source-of-truth.md) — API contract and data models
- [Architecture Overview](./architecture-overview.md) — Frontend architecture
- [Domain Models](./domain-model-and-entities.md) — Detailed entity documentation
