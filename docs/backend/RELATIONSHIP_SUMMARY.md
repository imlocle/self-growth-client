# Entity Relationship Summary

**Date**: February 18, 2026  
**Question**: How do we link HouseholdSubject to HouseholdMember/UserProfile?  
**Answer**: Use `created_by_user_id` in HouseholdSubject

## The Solution

### Three Entities, Three Purposes

```
┌─────────────────┐
│   UserProfile   │  Global identity (email, username, name)
│   id (user_id)  │
└────────┬────────┘
         │
         ├──────────────────────────────────┐
         │                                  │
         ▼                                  ▼
┌─────────────────┐              ┌─────────────────────┐
│ HouseholdMember │              │ HouseholdSubject    │
│ user_id ────────┼──────┐       │ created_by_user_id ─┼──────┐
│ household_id    │      │       │ household_id        │      │
│ role            │      │       │ type, display_name  │      │
└─────────────────┘      │       └─────────────────────┘      │
                         │                                    │
                         │       References UserProfile.id    │
                         │                                    │
                         └────────────────────────────────────┘
```

## Field Naming

| Entity               | Field Name           | References     | Purpose                   |
| -------------------- | -------------------- | -------------- | ------------------------- |
| **UserProfile**      | `id`                 | Cognito sub    | Canonical user identifier |
| **HouseholdMember**  | `user_id`            | UserProfile.id | Who is a member           |
| **HouseholdSubject** | `created_by_user_id` | UserProfile.id | Who created the subject   |

## Why `created_by_user_id`?

### Clear and Unambiguous

- `user_id` in HouseholdMember = "who is a member"
- `created_by_user_id` in HouseholdSubject = "who created this subject"
- No confusion between the two

### Supports All Use Cases

**1. Parent tracking child**:

```python
HouseholdSubject(
    id="sub-child",
    created_by_user_id="parent-user-id",  # Parent created it
    type="child",
    display_name="Emma"
)
```

**2. Self-tracking**:

```python
HouseholdSubject(
    id="sub-self",
    created_by_user_id="user-id",  # Same user!
    type="self",
    display_name="John"
)
```

**3. Shared household**:

```python
# Alice creates subject for herself
HouseholdSubject(
    id="sub-alice",
    created_by_user_id="alice-user-id",
    type="self",
    display_name="Alice"
)

# Alice creates subject for child
HouseholdSubject(
    id="sub-child",
    created_by_user_id="alice-user-id",  # Alice created it
    type="child",
    display_name="Charlie"
)

# Bob creates subject for himself
HouseholdSubject(
    id="sub-bob",
    created_by_user_id="bob-user-id",
    type="self",
    display_name="Bob"
)
```

## What About `subject_id`?

**UserProfile does NOT have `subject_id`** because:

- A user can create multiple subjects (themselves, their children, etc.)
- A user can be a member of multiple households, each with different subjects
- Storing a single `subject_id` would imply a 1:1 relationship

**Frontend manages scope**:

- Store selected `householdId` and `subjectId` in AsyncStorage/localStorage
- Allow users to switch between subjects via a picker

## Quick Reference

### To find all subjects created by a user:

```python
subjects = query_subjects(created_by_user_id="user-123")
```

### To find who created a subject:

```python
subject = get_subject("sub-456")
creator = get_user_profile(subject.created_by_user_id)
print(f"Created by: {creator.first_name} {creator.last_name}")
```

### To check if a subject represents the current user:

```python
if subject.created_by_user_id == current_user_id and subject.type == "self":
    print("This subject represents you!")
```

### To list all subjects in a household:

```python
subjects = query_subjects(household_id="hh-123")
# Returns all subjects regardless of who created them
```

## API Example

**Creating a subject**:

```http
POST /households/hh-123/subjects
Authorization: Bearer {token}

{
  "type": "child",
  "display_name": "Emma",
  "dob": "2018-05-15"
}
```

**Backend automatically sets `created_by_user_id` from token**:

```python
user_id = extract_user_id_from_token(token)

subject = HouseholdSubject(
    id=generate_id(),
    household_id="hh-123",
    created_by_user_id=user_id,  # From token!
    type="child",
    display_name="Emma",
    dob="2018-05-15"
)
```

**Response**:

```json
{
  "id": "sub-789",
  "household_id": "hh-123",
  "created_by_user_id": "user-123",
  "type": "child",
  "display_name": "Emma",
  "dob": "2018-05-15"
}
```

## Summary

✅ **UserProfile.id** = Canonical user identifier  
✅ **HouseholdMember.user_id** = References UserProfile.id (who can access)  
✅ **HouseholdSubject.created_by_user_id** = References UserProfile.id (who created)  
✅ **No circular references** = Clean one-way relationships  
✅ **Clear ownership** = Every subject has a creator  
✅ **Supports all use cases** = Parent tracking child, self-tracking, shared households

## Related Documentation

- `docs/ENTITY_RELATIONSHIPS.md` - Complete relationship guide with examples
- `docs/DATA_MODEL_CLARIFICATION.md` - Member vs Subject clarification
- `docs/MEMBER_VS_SUBJECT_SUMMARY.md` - Quick reference guide
