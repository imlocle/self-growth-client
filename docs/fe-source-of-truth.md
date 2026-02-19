<!-- Last Updated: February 19, 2026 -->

# Source of Truth: API Contract & Data Models

This document defines the exact API contract and data models that the frontend expects. Backend implementation MUST match these specifications.

## Base URL

```
Production: https://api.selfgrowth.com
Development: https://dev-api.selfgrowth.com
```

## Authentication

All authenticated endpoints require:

```
Authorization: Bearer {accessToken}
```

## Data Types

### Base Entity

All entities inherit these fields:

```typescript
{
  "id": string,              // Unique identifier
  "dateCreated": string,     // ISO 8601 timestamp
  "dateModified": string     // ISO 8601 timestamp
}
```

**Note:** Frontend code uses `dateCreated` consistently (the `dataCreated` typo was fixed).

---

## Auth Endpoints

### POST /auth/signup

**Request:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John", // Optional
  "lastName": "Doe" // Optional
}
```

**Response: 200 OK**

```json
{
  "userSub": "cognito-uuid",
  "userConfirmed": false,
  "codeDelivery": {
    "deliveryMedium": "EMAIL",
    "destination": "u***@example.com"
  },
  "message": "User created. Check email for confirmation code."
}
```

**Errors:**

- `400` — Invalid email format, weak password
- `409` — Email already exists

---

### POST /auth/confirm

**Request:**

```json
{
  "email": "user@example.com",
  "confirmationCode": "123456"
}
```

**Response: 200 OK**

```json
{}
```

or

```json
{
  "message": "User confirmed successfully"
}
```

**Errors:**

- `400` — Invalid confirmation code
- `404` — User not found

---

### POST /auth/login

**Request:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response: 200 OK**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "idToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "tokenType": "Bearer"
}
```

**Errors:**

- `401` — Invalid credentials
- `400` — User not confirmed

---

## Profile Endpoints

### GET /user-profile

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response: 200 OK**

```json
{
  "id": "cognito-uuid",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": null,
  "entity": "UserProfile",
  "dateCreated": "2026-02-16T10:00:00Z",
  "dateModified": "2026-02-16T10:00:00Z"
}
```

**Response: 404 Not Found**

```json
{
  "error": "Profile not found"
}
```

**Important:** UserProfile does NOT contain `householdId`, `subjectId`, or `email`. Users can be members of multiple households. The frontend manages the "current scope" (selected household and subject) in SecureStore.

**Frontend Behavior:** If 404, user goes through onboarding where POST /user-profile is called.

---

### POST /user-profile

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Request:**

```json
{
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response: 201 Created**

```json
{
  "id": "cognito-uuid",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": null,
  "entity": "UserProfile",
  "dateCreated": "2026-02-16T10:00:00Z",
  "dateModified": "2026-02-16T10:00:00Z"
}
```

**Errors:**

- `409` — Profile already exists for this user

---

### PUT /user-profile

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Request:**

```json
{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Response: 200 OK**

```json
{
  "id": "cognito-uuid",
  "username": "johndoe",
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": null,
  "entity": "UserProfile",
  "dateCreated": "2026-02-16T10:00:00Z",
  "dateModified": "2026-02-16T11:30:00Z"
}
```

**Note:** Frontend manages scope (householdId/subjectId) in SecureStore, not on UserProfile.

---

## Household Endpoints

### POST /households

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Request:**

```json
{
  "name": "Smith Family"
}
```

**Response: 201 Created**

```json
{
  "id": "hh-123",
  "name": "Smith Family",
  "ownerUserId": "cognito-uuid",
  "dateCreated": "2026-02-16T10:00:00Z",
  "dateModified": "2026-02-16T10:00:00Z"
}
```

**Backend Behavior:** Automatically creates a HouseholdMember record linking the authenticated user to this household with role `owner`.

---

### GET /households

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response: 200 OK**

```json
{
  "items": [
    {
      "id": "hh-123",
      "name": "Smith Family",
      "ownerUserId": "cognito-uuid",
      "dateCreated": "2026-02-16T10:00:00Z",
      "dateModified": "2026-02-16T10:00:00Z"
    }
  ],
  "nextToken": null
}
```

**Note:** Returns only households the authenticated user is a member of.

---

### GET /households/{id}

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response: 200 OK**

```json
{
  "id": "hh-123",
  "name": "Smith Family",
  "ownerUserId": "cognito-uuid",
  "dateCreated": "2026-02-16T10:00:00Z",
  "dateModified": "2026-02-16T10:00:00Z"
}
```

**Errors:**

- `403` — User is not a member of this household
- `404` — Household not found

---

### PUT /households/{id}

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Request:**

```json
{
  "name": "Updated Family Name"
}
```

**Response: 200 OK**

```json
{
  "id": "hh-123",
  "name": "Updated Family Name",
  "ownerUserId": "cognito-uuid",
  "dateCreated": "2026-02-16T10:00:00Z",
  "dateModified": "2026-02-16T11:30:00Z"
}
```

**Errors:**

- `403` — User is not a member of this household
- `404` — Household not found

---

### DELETE /households/{id}

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response: 204 No Content**

**Backend Requirement:** Soft delete. Only the household owner can delete a household.

**Errors:**

- `403` — User is not the household owner
- `404` — Household not found

---

## Household Member Endpoints

### POST /households/{householdId}/members

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Request:**

```json
{
  "userId": "cognito-uuid-of-new-member",
  "role": "member"
}
```

**Valid Roles:** `owner`, `admin`, `member`

**Response: 201 Created**

```json
{
  "householdId": "hh-123",
  "userId": "cognito-uuid-of-new-member",
  "role": "member",
  "dateCreated": "2026-02-16T10:00:00Z",
  "dateModified": "2026-02-16T10:00:00Z"
}
```

**Important:** HouseholdMember represents access control (who can access the household). It does NOT contain `displayName` or `dob` (those belong on HouseholdSubject).

**Errors:**

- `400` — Invalid input (userId or role missing/invalid)
- `403` — User is not a member of this household
- `409` — User is already a member of this household

---

### GET /households/{householdId}/members

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response: 200 OK**

```json
{
  "items": [
    {
      "householdId": "hh-123",
      "userId": "cognito-uuid",
      "role": "owner",
      "dateCreated": "2026-02-16T10:00:00Z",
      "dateModified": "2026-02-16T10:00:00Z"
    }
  ],
  "nextToken": null
}
```

**Frontend Tip:** To display member names, fetch each user's UserProfile using their `userId`.

**Errors:**

- `403` — User is not a member of this household

---

### DELETE /households/{householdId}/members/{userId}

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response: 204 No Content**

**Backend Requirement:** User must be household owner or admin to remove members.

**Errors:**

- `403` — User lacks permission to remove members
- `404` — Member not found in household

```
Authorization: Bearer {accessToken}
```

**Response: 200 OK**

```json
{
  "id": "hh-123",
  "name": "Smith Family",
  "dateCreated": "2026-02-16T10:00:00Z",
  "dateModified": "2026-02-16T10:00:00Z"
}
```

**Errors:**

- `403` — User is not a member of this household
- `404` — Household not found

---

## Household Subject Endpoints

### POST /households/{householdId}/subjects

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Request:**

```json
{
  "type": "child",
  "displayName": "Emma",
  "dob": "2018-05-15"
}
```

**Valid Types:** `self`, `child`, `adult`, `pet`

**Response: 201 Created**

```json
{
  "id": "sub-456",
  "householdId": "hh-123",
  "createdByUserId": "cognito-uuid",
  "type": "child",
  "displayName": "Emma",
  "dob": "2018-05-15",
  "points": null,
  "level": null,
  "dateCreated": "2026-02-16T10:00:00Z",
  "dateModified": "2026-02-16T10:00:00Z"
}
```

**Important:**

- `createdByUserId` is automatically set from the authenticated user's token (tracks who created this subject).
- HouseholdSubject represents the tracked individual (has todos, habits, blogs).
- `displayName` and `dob` are stored here (not on HouseholdMember).

**Errors:**

- `400` — Invalid input (type is required, invalid type value)
- `403` — User is not a member of this household

---

### GET /households/{householdId}/subjects

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Query Parameters:**

- `type` (optional): Filter by type (`self`, `child`, `adult`, `pet`)

**Response: 200 OK**

```json
{
  "items": [
    {
      "id": "sub-456",
      "householdId": "hh-123",
      "createdByUserId": "cognito-uuid",
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

**Errors:**

- `403` — User is not a member of this household

---

### GET /households/{householdId}/subjects/{id}

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response: 200 OK**

```json
{
  "id": "sub-456",
  "householdId": "hh-123",
  "createdByUserId": "cognito-uuid",
  "type": "child",
  "displayName": "Emma",
  "dob": "2018-05-15",
  "points": null,
  "level": null,
  "dateCreated": "2026-02-16T10:00:00Z",
  "dateModified": "2026-02-16T10:00:00Z"
}
```

**Errors:**

- `403` — User is not a member of this household
- `404` — Subject not found

---

### PUT /households/{householdId}/subjects/{id}

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Request:**

```json
{
  "displayName": "Emma Rose",
  "dob": "2018-05-15"
}
```

**Response: 200 OK**

```json
{
  "id": "sub-456",
  "householdId": "hh-123",
  "createdByUserId": "cognito-uuid",
  "type": "child",
  "displayName": "Emma Rose",
  "dob": "2018-05-15",
  "points": null,
  "level": null,
  "dateCreated": "2026-02-16T10:00:00Z",
  "dateModified": "2026-02-16T11:30:00Z"
}
```

**Note:** Partial updates are supported. Only send fields that changed.

**Errors:**

- `400` — Validation error
- `403` — User is not a member of this household
- `404` — Subject not found

---

### DELETE /households/{householdId}/subjects/{id}

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response: 204 No Content**

**Backend Requirement:** Soft delete. Warning: Deleting a subject will also delete all associated todos, habits, and blog posts.

**Errors:**

- `403` — User is not a member of this household
- `404` — Subject not found

---

## ToDo Endpoints

### GET /households/{hid}/subjects/{sid}/todos

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Query Parameters:**

- `sortBy` (optional): `"date_due"` | `"date_modified"` (default: `"date_modified"`)

**Response: 200 OK**

```json
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

**Field Details:**

- `title` (required): string, max 200 chars
- `description` (optional): string, max 1000 chars
- `status` (optional): `"active"` | `"completed"` | `"deleted"` (default: `"active"`)
- `difficulty` (optional): `"trivial"` | `"easy"` | `"medium"` | `"hard"`
- `dateDue` (optional): ISO 8601 date string (YYYY-MM-DD)
- `checklist` (optional): array of strings

**Errors:**

- `403` — User doesn't have access to this household/subject

---

### GET /households/{hid}/subjects/{sid}/todos/{id}

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response: 200 OK**

```json
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

**Errors:**

- `403` — User doesn't have access
- `404` — ToDo not found

---

### POST /households/{hid}/subjects/{sid}/todos

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Request:**

```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "difficulty": "easy",
  "dateDue": "2026-02-20",
  "checklist": ["Milk", "Eggs", "Bread"]
}
```

**Response: 201 Created**

```json
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

**Validation:**

- `title` is required
- `title` max 200 characters
- `description` max 1000 characters
- `difficulty` must be one of: `"trivial"`, `"easy"`, `"medium"`, `"hard"`
- `dateDue` must be valid ISO 8601 date

**Errors:**

- `400` — Validation error
- `403` — User doesn't have access

---

### PUT /households/{hid}/subjects/{sid}/todos/{id}

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Request:**

```json
{
  "title": "Buy groceries and snacks",
  "status": "completed"
}
```

**Response: 200 OK**

```json
{
  "id": "todo-1",
  "title": "Buy groceries and snacks",
  "description": "Milk, eggs, bread",
  "status": "completed",
  "difficulty": "easy",
  "dateDue": "2026-02-20",
  "checklist": ["Milk", "Eggs", "Bread"],
  "dateCreated": "2026-02-16T10:00:00Z",
  "dateModified": "2026-02-16T11:30:00Z"
}
```

**Note:** Partial updates are supported. Only send fields that changed.

**Errors:**

- `400` — Validation error
- `403` — User doesn't have access
- `404` — ToDo not found

---

### DELETE /households/{hid}/subjects/{sid}/todos/{id}

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response: 200 OK or 204 No Content**

**Backend Requirement:** This MUST be a soft delete. Set `status: "deleted"` instead of removing the record. Frontend filters out deleted items.

**Errors:**

- `403` — User doesn't have access
- `404` — ToDo not found

---

## Habit Endpoints

### GET /households/{hid}/subjects/{sid}/habits

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response: 200 OK**

```json
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

**Field Details:**

- `title` (required): string, max 200 chars
- `description` (optional): string, max 1000 chars
- `type` (optional): `"build"` | `"quit"` (default: `"build"`)
- `counter` (optional): `"daily"` | `"weekly"` | `"monthly"` (default: `"daily"`)
- `difficulty` (optional): `"trivial"` | `"easy"` | `"medium"` | `"hard"`
- `status` (optional): `"active"` | `"archived"` | `"deleted"` (default: `"active"`)

**Errors:**

- `403` — User doesn't have access

---

### GET /households/{hid}/subjects/{sid}/habits/{id}

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response: 200 OK**

```json
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

**Errors:**

- `403` — User doesn't have access
- `404` — Habit not found

---

### POST /households/{hid}/subjects/{sid}/habits

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Request:**

```json
{
  "title": "Morning run",
  "description": "Run 3 miles",
  "type": "build",
  "counter": "daily",
  "difficulty": "medium"
}
```

**Response: 201 Created**

```json
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

**Validation:**

- `title` is required
- `title` max 200 characters
- `description` max 1000 characters
- `type` must be one of: `"build"`, `"quit"`
- `counter` must be one of: `"daily"`, `"weekly"`, `"monthly"`
- `difficulty` must be one of: `"trivial"`, `"easy"`, `"medium"`, `"hard"`

**Errors:**

- `400` — Validation error
- `403` — User doesn't have access

---

### PUT /households/{hid}/subjects/{sid}/habits/{id}

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Request:**

```json
{
  "status": "archived"
}
```

**Response: 200 OK**

```json
{
  "id": "habit-1",
  "title": "Morning run",
  "description": "Run 3 miles",
  "type": "build",
  "counter": "daily",
  "difficulty": "medium",
  "status": "archived",
  "dateCreated": "2026-02-16T10:00:00Z",
  "dateModified": "2026-02-16T12:00:00Z"
}
```

**Note:** Partial updates are supported.

**Errors:**

- `400` — Validation error
- `403` — User doesn't have access
- `404` — Habit not found

---

### DELETE /households/{hid}/subjects/{sid}/habits/{id}

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response: 200 OK or 204 No Content**

**Backend Requirement:** This MUST be a soft delete. Set `status: "deleted"` instead of removing the record.

**Errors:**

- `403` — User doesn't have access
- `404` — Habit not found

---

## Future: Habit Event Endpoints (Not Yet Implemented)

### POST /households/{hid}/subjects/{sid}/habits/{habitId}/events

**Request:**

```json
{
  "status": "done",
  "note": "Felt great today!"
}
```

**Response: 201 Created**

```json
{
  "id": "event-1",
  "habitId": "habit-1",
  "periodKey": "2026-02-16",
  "status": "done",
  "note": "Felt great today!",
  "dateCreated": "2026-02-16T10:00:00Z",
  "dateModified": "2026-02-16T10:00:00Z"
}
```

**Backend Requirement:**

- Calculate `periodKey` based on habit's `counter` type:
  - `daily`: `"2026-02-16"`
  - `weekly`: `"2026-W07"` (ISO week)
  - `monthly`: `"2026-02"`
- Enforce one event per period (return 400 if event already exists for this period)

---

## Error Response Format

All errors should follow this format:

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": "Optional additional details"
}
```

### Common Error Codes

- `400 Bad Request` — Invalid input, validation error
- `401 Unauthorized` — Missing or invalid token
- `403 Forbidden` — User doesn't have access to this resource
- `404 Not Found` — Resource doesn't exist
- `409 Conflict` — Resource already exists (e.g., email taken)
- `500 Internal Server Error` — Server error

---

## Security Requirements

### Authorization Checks

For ALL scoped endpoints (`/households/{hid}/subjects/{sid}/...`):

1. Verify JWT token is valid
2. Extract user ID from token
3. Verify user is a member of household `{hid}`
4. Verify subject `{sid}` belongs to household `{hid}`
5. If any check fails, return `403 Forbidden`

### Membership Table

Backend should maintain a `HouseholdMemberships` table:

```
userId (PK)
householdId (SK)
role (owner | member)
dateCreated
```

When user creates a household, automatically insert:

```
userId: {cognito-user-id}
householdId: {new-household-id}
role: "owner"
dateCreated: {current-timestamp}
```

---

## Data Validation Rules

### Email

- Valid email format
- Max 255 characters

### Password

- Min 8 characters
- Must contain: uppercase, lowercase, number, special character

### Title (ToDo/Habit)

- Required
- Min 1 character (after trim)
- Max 200 characters

### Description

- Optional
- Max 1000 characters

### Name (Household/Subject)

- Required
- Min 1 character (after trim)
- Max 100 characters

### Dates

- ISO 8601 format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ssZ`

---

## Testing Checklist

- [ ] Signup with valid email/password
- [ ] Signup with duplicate email returns 409
- [ ] Confirm with valid code
- [ ] Confirm with invalid code returns 400
- [ ] Login with valid credentials
- [ ] Login with invalid credentials returns 401
- [ ] Create profile with valid token
- [ ] Get profile returns 404 for new user
- [ ] Create household with valid token
- [ ] Create subject under household
- [ ] Create todo with valid scope
- [ ] Create todo without scope returns 403
- [ ] Update todo with valid scope
- [ ] Delete todo sets status to "deleted"
- [ ] Create habit with valid scope
- [ ] Update habit status to "archived"
- [ ] Delete habit sets status to "deleted"
- [ ] List todos filters out deleted items (or backend filters)
- [ ] List habits filters out deleted items (or backend filters)

---

## Questions & Clarifications

1. **Should backend filter deleted items?** Or should frontend always receive them and filter client-side?
2. **Pagination:** Is `lastEvaluatedKey` implemented? Frontend sends it but doesn't use it yet.
3. **Token expiration:** What's the access token TTL? Frontend needs to implement refresh.
4. **Default household/subject:** Should backend auto-set these on profile when user creates their first household/subject?

---

## Related Docs

- [Project Context](./fe-project-context.md) — High-level overview and user flows
- [Architecture Overview](./architecture-overview.md) — Frontend architecture
- [Domain Models](./domain-model-and-entities.md) — Detailed entity documentation
