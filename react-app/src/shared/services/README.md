# Firebase Repository Pattern

This directory contains the implementation of the Repository Pattern for Firebase Firestore operations.

## Architecture

```
shared/services/
├── firebase-repository.ts      # Abstract base class
└── README.md                    # This file

features/*/services/
├── tipster-repository.ts        # Tipster-specific operations
├── pick-repository.ts           # Pick-specific operations
└── follow-repository.ts         # Follow-specific operations
```

## Base Repository

### FirebaseRepository\<T\>

Abstract generic class that provides common CRUD operations for all Firestore collections.

**Type Parameter:**
- `T extends FirestoreDocument`: Entity type that must have `id` and `uid` fields

**Abstract Property:**
- `collectionName: string`: Name of the Firestore collection

**Core Methods:**

#### `create(data, userId): Promise<OperationResult<string>>`
Creates a new document in the collection.

**Parameters:**
- `data: Omit<T, 'id' | 'uid'>`: Document data without id/uid
- `userId: string`: User ID to associate with the document

**Returns:** `OperationResult<string>` with the created document ID

**Example:**
```typescript
const result = await repository.create({ name: 'Example' }, userId);
if (result.success) {
  console.log('Created with ID:', result.data);
}
```

#### `getById(id): Promise<OperationResult<T | null>>`
Retrieves a document by ID.

**Parameters:**
- `id: string`: Document ID

**Returns:** `OperationResult<T | null>` with the document or null if not found

**Example:**
```typescript
const result = await repository.getById('doc123');
if (result.success && result.data) {
  console.log('Document:', result.data);
}
```

#### `getByUserId(userId, constraints?): Promise<OperationResult<T[]>>`
Retrieves all documents for a user with optional constraints.

**Parameters:**
- `userId: string`: User ID to filter by
- `constraints?: QueryConstraint[]`: Optional Firestore query constraints

**Returns:** `OperationResult<T[]>` with array of documents

**Example:**
```typescript
const result = await repository.getByUserId(userId, [
  orderBy('createdAt', 'desc'),
  limit(10)
]);
```

#### `update(id, data): Promise<OperationResult>`
Updates a document.

**Parameters:**
- `id: string`: Document ID
- `data: Partial<Omit<T, 'id' | 'uid'>>`: Partial data to update

**Returns:** `OperationResult` (success/error)

**Example:**
```typescript
const result = await repository.update('doc123', { name: 'Updated' });
if (result.success) {
  console.log('Updated successfully');
}
```

#### `delete(id): Promise<OperationResult>`
Deletes a document.

**Parameters:**
- `id: string`: Document ID

**Returns:** `OperationResult` (success/error)

**Example:**
```typescript
const result = await repository.delete('doc123');
if (result.success) {
  console.log('Deleted successfully');
}
```

#### `query(userId, constraints): Promise<OperationResult<T[]>>`
Executes a custom query with constraints.

**Parameters:**
- `userId: string`: User ID to filter by
- `constraints: QueryConstraint[]`: Firestore query constraints

**Returns:** `OperationResult<T[]>` with array of documents

**Example:**
```typescript
const result = await repository.query(userId, [
  where('status', '==', 'active'),
  orderBy('createdAt', 'desc')
]);
```

### Helper Methods

The base repository provides helper methods to create Firestore query constraints:

#### `whereClause(field, operator, value)`
Creates a `where` constraint.

**Example:**
```typescript
this.whereClause('status', '==', 'active')
```

#### `orderByClause(field, direction)`
Creates an `orderBy` constraint.

**Example:**
```typescript
this.orderByClause('createdAt', 'desc')
```

#### `limitClause(count)`
Creates a `limit` constraint.

**Example:**
```typescript
this.limitClause(10)
```

### Error Handling

All methods return `OperationResult<T>` which has the structure:

```typescript
// Success
{
  success: true,
  data: T  // The result data
}

// Error
{
  success: false,
  error: AppError  // Error details
}
```

**AppError Structure:**
```typescript
{
  code: string,        // Error code (e.g., 'FIRESTORE_ERROR')
  message: string,     // User-friendly message
  originalError?: any  // Original error from Firebase
}
```

## Concrete Repositories

### TipsterRepository

Manages Tipster entities in the `tipsters` collection.

**Singleton Export:** `tipsterRepository`

**Methods:**

| Method | Description |
|--------|-------------|
| `createTipster(data, userId)` | Creates a new tipster |
| `updateTipster(id, updates)` | Updates tipster data |
| `deleteTipster(id)` | Deletes a tipster |
| `getAllTipsters(userId)` | Gets all tipsters for a user |
| `getTipsterById(id)` | Gets a tipster by ID |
| `getTipstersByChannel(userId, channel)` | Filters tipsters by channel |
| `searchTipstersByName(userId, searchTerm)` | Searches tipsters by name |
| `getTipstersSortedByName(userId)` | Gets tipsters sorted alphabetically |
| `updateLastPickDate(id, date)` | Updates the last pick date |
| `getActiveTipsters(userId, days)` | Gets tipsters with recent picks |
| `getInactiveTipsters(userId, days)` | Gets tipsters without recent picks |
| `resetTipster(id)` | Resets tipster stats (clears lastPickDate) |

**Example Usage:**
```typescript
import { tipsterRepository } from '@features/tipsters/services/tipster-repository';

// Create tipster
const result = await tipsterRepository.createTipster({
  name: 'ProTipster',
  channel: 'Telegram',
  createdDate: '2025-01-01',
  lastPickDate: null,
}, userId);

// Search tipsters
const tipsters = await tipsterRepository.searchTipstersByName(
  userId,
  'Pro'
);

// Get active tipsters (with picks in last 30 days)
const active = await tipsterRepository.getActiveTipsters(userId, 30);
```

### PickRepository

Manages Pick entities in the `picks` collection.

**Singleton Export:** `pickRepository`

**Methods:**

| Method | Description |
|--------|-------------|
| `createPick(data, userId)` | Creates a new pick |
| `updatePick(id, updates)` | Updates pick data |
| `deletePick(id)` | Deletes a pick |
| `getAllPicks(userId)` | Gets all picks for a user |
| `getPickById(id)` | Gets a pick by ID |
| `getPicksByTipster(userId, tipsterId)` | Filters picks by tipster |
| `getPicksBySport(userId, sport)` | Filters picks by sport |
| `getResolvedPicks(userId)` | Gets resolved picks |
| `getPendingPicks(userId)` | Gets pending picks |
| `getPicksByResult(userId, result)` | Filters picks by result |
| `getPicksByDateRange(userId, start, end)` | Filters picks by date range |
| `getPicksByBookmaker(userId, bookmaker)` | Filters picks by bookmaker |
| `getRecentPicks(userId, count)` | Gets last N picks |
| `updatePickResult(id, result)` | Updates pick result and resolved status |
| `getPicksByType(userId, pickType)` | Filters picks by type (Pre/Live/Combinado) |
| `searchPicksByMatch(userId, searchTerm)` | Searches picks by match name |
| `getPicksByMinOdds(userId, minOdds)` | Filters picks by minimum odds |
| `getPicksByStakeRange(userId, min, max)` | Filters picks by stake range |

**Example Usage:**
```typescript
import { pickRepository } from '@features/picks/services/pick-repository';

// Create pick
const result = await pickRepository.createPick({
  tipsterId: 'tipster123',
  sport: 'Fútbol',
  match: 'Real Madrid vs Barcelona',
  betType: '1X2 - Local',
  odds: 1.85,
  stake: 3,
  pickType: 'Pre',
  date: '2025-01-15',
  time: '20:00',
  dateTime: '2025-01-15T20:00:00Z',
  bookmaker: 'Bet365',
  result: 'Pendiente',
  isResolved: false,
  comments: '',
}, userId);

// Get resolved picks
const resolved = await pickRepository.getResolvedPicks(userId);

// Get picks by tipster and sport
const footballPicks = await pickRepository.getPicksBySport(
  userId,
  'Fútbol'
);

// Update pick result
await pickRepository.updatePickResult('pick123', 'Ganada');
```

### FollowRepository

Manages UserFollow entities in the `userFollows` collection.

**Singleton Export:** `followRepository`

**Methods:**

| Method | Description |
|--------|-------------|
| `createFollow(data, userId)` | Creates a new follow |
| `updateFollow(id, updates)` | Updates follow data |
| `deleteFollow(id)` | Deletes a follow |
| `getAllFollows(userId)` | Gets all follows for a user |
| `getFollowById(id)` | Gets a follow by ID |
| `getFollowsByTipster(userId, tipsterId)` | Gets follows for a tipster |
| `getFollowByPickId(userId, pickId)` | Gets follow for a specific pick |
| `getResolvedFollows(userId)` | Gets resolved follows |
| `getPendingFollows(userId)` | Gets pending follows |
| `getFollowsByResult(userId, result)` | Filters follows by result |
| `getFollowsWithErrors(userId)` | Gets follows marked as errors |
| `getFollowsByBookmaker(userId, bookmaker)` | Filters follows by bookmaker |
| `getFollowsByDateRange(userId, start, end)` | Filters follows by date range |
| `updateFollowResult(id, result, profit)` | Updates follow result and profit |
| `markFollowAsError(id, isError)` | Marks follow as error |
| `getRecentFollows(userId, count)` | Gets last N follows |
| `getTotalProfit(userId)` | Calculates total profit from all follows |
| `deleteFollowsByTipster(userId, tipsterId)` | Deletes all follows for a tipster |
| `deleteFollowByPickId(userId, pickId)` | Deletes follow for a pick |

**Example Usage:**
```typescript
import { followRepository } from '@features/follows/services/follow-repository';

// Create follow
const result = await followRepository.createFollow({
  pickId: 'pick123',
  tipsterId: 'tipster123',
  userOdds: 1.90,
  userStake: 2,
  userBookmaker: 'Bet365',
  userResult: 'Pendiente',
  isResolved: false,
  profitFromFollow: 0,
  dateFollowed: '2025-01-15',
  timeFollowed: '19:00',
  dateTimeFollowed: '2025-01-15T19:00:00Z',
  isError: false,
  comments: '',
}, userId);

// Get follows for a tipster
const tipsterFollows = await followRepository.getFollowsByTipster(
  userId,
  'tipster123'
);

// Update follow result
await followRepository.updateFollowResult('follow123', 'Ganada', 1.80);

// Calculate total profit
const profit = await followRepository.getTotalProfit(userId);
console.log('Total profit:', profit.data);

// Delete all follows for a tipster (when resetting)
await followRepository.deleteFollowsByTipster(userId, 'tipster123');
```

## Best Practices

### 1. Always Check Success

```typescript
const result = await repository.getById(id);
if (!result.success) {
  console.error(result.error);
  return;
}
// Safe to use result.data
```

### 2. Handle Null Results

```typescript
const result = await repository.getById(id);
if (result.success && result.data) {
  // Document found
} else {
  // Document not found or error
}
```

### 3. Use Singleton Instances

```typescript
// ✅ Good - Use singleton
import { tipsterRepository } from '@features/tipsters/services/tipster-repository';

// ❌ Bad - Don't create new instances
import { TipsterRepository } from '@features/tipsters/services/tipster-repository';
const repo = new TipsterRepository();
```

### 4. Batch Operations

```typescript
// Get multiple related entities efficiently
const [tipstersResult, picksResult] = await Promise.all([
  tipsterRepository.getAllTipsters(userId),
  pickRepository.getAllPicks(userId),
]);
```

### 5. Error Handling in Components

```typescript
try {
  const result = await tipsterRepository.createTipster(data, userId);
  if (!result.success) {
    showError(result.error.message);
    return;
  }
  showSuccess('Tipster created!');
} catch (error) {
  showError('Unexpected error occurred');
}
```

## Testing

When testing components that use repositories, mock the singleton exports:

```typescript
import { tipsterRepository } from '@features/tipsters/services/tipster-repository';

jest.mock('@features/tipsters/services/tipster-repository');

it('should load tipsters', async () => {
  (tipsterRepository.getAllTipsters as jest.Mock).mockResolvedValue({
    success: true,
    data: [{ id: '1', name: 'Test' }],
  });
  
  // Test component
});
```

## Performance Considerations

### Indexing

The following Firestore indexes are required (defined in `firestore.indexes.json`):

- `picks`: `uid` + `dateTime` (desc)
- `picks`: `uid` + `tipsterId` + `dateTime` (desc)
- `picks`: `uid` + `isResolved` + `dateTime` (desc)
- `userFollows`: `uid` + `dateTimeFollowed` (desc)
- `userFollows`: `uid` + `tipsterId` + `dateTimeFollowed` (desc)

### Caching

Consider implementing caching for frequently accessed data:

```typescript
// In a React component
const { data: tipsters, isLoading } = useTipsters(userId);
```

### Pagination

For large datasets, implement pagination:

```typescript
const PAGE_SIZE = 20;

async function getPicksPage(userId: string, page: number) {
  return pickRepository.query(userId, [
    orderBy('dateTime', 'desc'),
    limit(PAGE_SIZE),
    // Add startAfter for pagination
  ]);
}
```

## Future Enhancements

- [ ] Add real-time listeners (onSnapshot)
- [ ] Implement caching layer
- [ ] Add batch write operations
- [ ] Add transaction support
- [ ] Implement soft delete
- [ ] Add audit logging

## Related Documentation

- [TypeScript Types](../types/README.md)
- [Firebase Configuration](../../core/config/README.md)
- [Migration Guide](../../../MIGRATION-GUIDE.md)
