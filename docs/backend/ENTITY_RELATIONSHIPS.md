# Entity Relationships - Complete Guide

**Date**: February 18, 2026  
**Purpose**: Clarify how UserProfile, HouseholdMember, and HouseholdSubject relate to each other

## The Three Core Entities

### 1. UserProfile (Application Identity)

**Purpose**: Represents a user's application-level identity

**Fields**:

- `id` (user_id from Cognito)
- `email`, `username`
- `first_name`, `last_name`, `phone_number`

**Key Points**:

- One per Cognito user
- Does NOT contain household_id or subject_id
- Global identity across all households

### 2. HouseholdMember (Access Control)

**Purpose**: Links users to households with permissions

**Fields**:

- `household_id` (which household)
- `user_id` (which user - references UserProfile.id)
- `role` (owner/admin/member)

**Key Points**:

- Junction table: User ↔ Household
- Defines WHO can access the household
- One user can be a member of multiple households

### 3. HouseholdSubject (Tracked Individual)

**Purpose**: Represents individuals being tracked within a household

**Fields**:

- `id` (unique subject identifier)
- `household_id` (which household)
- `created_by_user_id` (who created this subject - references UserProfile.id)
- `type` (self/child/adult/pet)
- `display_name`, `dob`

**Key Points**:

- Represents the individual being tracked
- Has todos, habits, and blog posts
- `created_by_user_id` tracks ownership/creator

## The Relationships

```
UserProfile (id: user-123)
    ↓
    ├─→ HouseholdMember (user_id: user-123, household_id: hh-456, role: owner)
    │       ↓
    │       Household (id: hh-456)
    │           ↓
    │           ├─→ HouseholdSubject (id: sub-789, created_by_user_id: user-123, type: self)
    │           │       ↓
    │           │       Todos, Habits, Blogs
    │           │
    │           └─→ HouseholdSubject (id: sub-999, created_by_user_id: user-123, type: child)
    │                   ↓
    │                   Todos, Habits, Blogs
    │
    └─→ HouseholdMember (user_id: user-123, household_id: hh-777, role: member)
            ↓
            Household (id: hh-777)
```

## Field Naming Clarification

### Why `created_by_user_id` instead of just `user_id`?

**In HouseholdSubject**:

- `created_by_user_id`: WHO created this subject (always a user)
- This is clear and unambiguous

**In HouseholdMember**:

- `user_id`: WHO is a member (always a user)
- This is clear and unambiguous

**In UserProfile**:

- `id`: The user's Cognito ID
- This is the canonical user identifier

## Use Case Examples

### Example 1: Parent Tracking Child

**Setup**:

```python
# Parent's profile
UserProfile(
    id="user-parent-123",
    email="parent@example.com",
    first_name="Jane",
    last_name="Smith"
)

# Parent is a member of household
HouseholdMember(
    household_id="hh-456",
    user_id="user-parent-123",
    role="owner"
)

# Parent creates subject for themselves
HouseholdSubject(
    id="sub-789",
    household_id="hh-456",
    created_by_user_id="user-parent-123",
    type="self",
    display_name="Mom"
)

# Parent creates subject for child
HouseholdSubject(
    id="sub-999",
    household_id="hh-456",
    created_by_user_id="user-parent-123",  # Parent created this
    type="child",
    display_name="Emma",
    dob="2018-05-15"
)
```

**Queries**:

- "Who created subject sub-999?" → `created_by_user_id` = "user-parent-123"
- "Who can access household hh-456?" → Query HouseholdMember where household_id = "hh-456"
- "What subjects did user-parent-123 create?" → Query HouseholdSubject where created_by_user_id = "user-parent-123"

### Example 2: Self-Tracking (Single User)

**Setup**:

```python
# User's profile
UserProfile(
    id="user-john-456",
    email="john@example.com",
    first_name="John",
    last_name="Doe"
)

# User is a member of their own household
HouseholdMember(
    household_id="hh-789",
    user_id="user-john-456",
    role="owner"
)

# User creates subject for themselves
HouseholdSubject(
    id="sub-111",
    household_id="hh-789",
    created_by_user_id="user-john-456",  # Same user!
    type="self",
    display_name="John"
)
```

**Key Point**: The same user_id appears in both HouseholdMember and HouseholdSubject.created_by_user_id

### Example 3: Shared Household (Couple)

**Setup**:

```python
# User 1's profile
UserProfile(id="user-alice-111", first_name="Alice")

# User 2's profile
UserProfile(id="user-bob-222", first_name="Bob")

# Both are members of the household
HouseholdMember(household_id="hh-999", user_id="user-alice-111", role="owner")
HouseholdMember(household_id="hh-999", user_id="user-bob-222", role="owner")

# Alice creates subject for herself
HouseholdSubject(
    id="sub-aaa",
    household_id="hh-999",
    created_by_user_id="user-alice-111",
    type="self",
    display_name="Alice"
)

# Bob creates subject for himself
HouseholdSubject(
    id="sub-bbb",
    household_id="hh-999",
    created_by_user_id="user-bob-222",
    type="self",
    display_name="Bob"
)

# Alice creates subject for their child
HouseholdSubject(
    id="sub-ccc",
    household_id="hh-999",
    created_by_user_id="user-alice-111",  # Alice created it
    type="child",
    display_name="Charlie"
)
```

**Queries**:

- "Who are the members of household hh-999?" → user-alice-111, user-bob-222
- "What subjects did Alice create?" → sub-aaa, sub-ccc
- "What subjects did Bob create?" → sub-bbb
- "Who created the child subject?" → user-alice-111

### Example 4: Caregiver Scenario

**Setup**:

```python
# Caregiver's profile
UserProfile(id="user-caregiver-333", first_name="Sarah")

# Caregiver is a member of household
HouseholdMember(household_id="hh-care-123", user_id="user-caregiver-333", role="owner")

# Caregiver creates subject for elderly parent
HouseholdSubject(
    id="sub-elder-456",
    household_id="hh-care-123",
    created_by_user_id="user-caregiver-333",
    type="adult",
    display_name="Mom",
    dob="1950-03-20"
)
```

**Key Point**: The elderly parent doesn't have a UserProfile or HouseholdMember record (no login)

## Database Queries

### Query 1: Get all subjects in a household

```python
# Query HouseholdSubject
WHERE household_id = "hh-456"
```

### Query 2: Get all subjects created by a user

```python
# Query HouseholdSubject
WHERE created_by_user_id = "user-123"
```

### Query 3: Get all households a user is a member of

```python
# Query HouseholdMember
WHERE user_id = "user-123"
```

### Query 4: Check if user can access a subject

```python
# Step 1: Get subject
subject = get_subject(subject_id)

# Step 2: Check if user is a member of the subject's household
member = get_household_member(household_id=subject.household_id, user_id=user_id)

# Step 3: If member exists, user has access
if member:
    return True
```

## API Implications

### Creating a Subject

**Request**:

```http
POST /households/{householdId}/subjects
Authorization: Bearer {token}

{
  "type": "child",
  "display_name": "Emma",
  "dob": "2018-05-15"
}
```

**Backend Logic**:

```python
# Extract user_id from JWT token
user_id = get_user_id_from_token(token)

# Verify user is a member of the household
assert_household_member(user_id, household_id)

# Create subject with created_by_user_id
subject = HouseholdSubject(
    id=generate_id(),
    household_id=household_id,
    created_by_user_id=user_id,  # From token!
    type=data["type"],
    display_name=data["display_name"],
    dob=data["dob"]
)
```

**Response**:

```json
{
  "id": "sub-789",
  "household_id": "hh-456",
  "created_by_user_id": "user-123",
  "type": "child",
  "display_name": "Emma",
  "dob": "2018-05-15"
}
```

### Listing Subjects

**Request**:

```http
GET /households/{householdId}/subjects
Authorization: Bearer {token}
```

**Backend Logic**:

```python
# Extract user_id from JWT token
user_id = get_user_id_from_token(token)

# Verify user is a member of the household
assert_household_member(user_id, household_id)

# Return all subjects in the household
subjects = query_subjects(household_id)
```

**Response**:

```json
{
  "items": [
    {
      "id": "sub-789",
      "household_id": "hh-456",
      "created_by_user_id": "user-123",
      "type": "self",
      "display_name": "Mom"
    },
    {
      "id": "sub-999",
      "household_id": "hh-456",
      "created_by_user_id": "user-123",
      "type": "child",
      "display_name": "Emma",
      "dob": "2018-05-15"
    }
  ]
}
```

## Frontend Implementation

### Displaying Subject Creator

```javascript
// Fetch subject
const subject = await fetch(`/households/${hid}/subjects/${sid}`);

// Fetch creator's profile
const creator = await fetch(`/user-profile/${subject.created_by_user_id}`);

console.log(`Created by: ${creator.firstName} ${creator.lastName}`);
```

### Checking if Subject Represents Current User

```javascript
// Get current user's ID from token
const currentUserId = getCurrentUserId();

// Fetch subject
const subject = await fetch(`/households/${hid}/subjects/${sid}`);

// Check if this subject was created by current user AND is type "self"
if (subject.created_by_user_id === currentUserId && subject.type === "self") {
  console.log("This subject represents you!");
}
```

## Summary Table

| Entity               | Has user_id?                 | Has subject_id? | Has household_id? | Purpose              |
| -------------------- | ---------------------------- | --------------- | ----------------- | -------------------- |
| **UserProfile**      | ✅ (as `id`)                 | ❌              | ❌                | Global user identity |
| **HouseholdMember**  | ✅                           | ❌              | ✅                | Access control       |
| **HouseholdSubject** | ✅ (as `created_by_user_id`) | ✅ (as `id`)    | ✅                | Tracked individual   |

## Key Takeaways

1. **UserProfile.id** = The canonical user identifier (Cognito sub)
2. **HouseholdMember.user_id** = References UserProfile.id (who is a member)
3. **HouseholdSubject.created_by_user_id** = References UserProfile.id (who created the subject)
4. **HouseholdSubject.id** = The subject's unique identifier
5. **No circular references**: Clean one-way relationships
6. **Clear ownership**: Every subject has a creator
7. **Flexible permissions**: Can implement fine-grained access control based on creator

## Related Documentation

- `docs/DATA_MODEL_CLARIFICATION.md` - Member vs Subject clarification
- `docs/MEMBER_VS_SUBJECT_SUMMARY.md` - Quick reference guide
- `docs/source-of-truth.md` - Complete data model reference
