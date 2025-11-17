# Context API & Custom Hooks

State management system using React Context API for global state and Firebase real-time listeners.

## Architecture

```
App
└── AppProvider (Composition Root)
    ├── AuthProvider (Authentication state)
    └── DataProviders (Conditional on auth)
        ├── TipstersProvider
        ├── PicksProvider
        └── FollowsProvider
```

## Providers

### AuthProvider

Manages authentication state and methods.

**Location**: `src/core/providers/AuthProvider.tsx`

**State**:
- `user: User | null` - Current Firebase user
- `loading: boolean` - Auth operation in progress
- `error: string | null` - Last error message

**Methods**:
- `login(email, password)` - Sign in with email/password
- `signup(email, password)` - Create new account
- `logout()` - Sign out current user
- `resetPassword(email)` - Send password reset email
- `clearError()` - Clear error state

**Usage**:
```tsx
import { useAuth } from '@shared/hooks';

function LoginForm() {
  const { user, loading, error, login, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      // Error is already in context.error
    }
  };

  if (user) {
    return <div>Welcome {user.email}</div>;
  }

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### TipstersProvider

Manages tipsters collection with real-time Firebase listeners.

**Location**: `src/core/providers/TipstersProvider.tsx`

**State**:
- `tipsters: Tipster[]` - Array of tipsters
- `loading: boolean` - Data loading state
- `error: string | null` - Error message

**Methods**:
- `createTipster(data)` - Create new tipster
- `updateTipster(id, data)` - Update tipster
- `deleteTipster(id)` - Delete tipster
- `getTipsterById(id)` - Find tipster by ID
- `refreshTipsters()` - Manual refresh

**Usage**:
```tsx
import { useTipsters } from '@shared/hooks';

function TipstersList() {
  const { tipsters, loading, createTipster } = useTipsters();

  const handleAdd = async () => {
    const result = await createTipster({
      name: 'ProTipster',
      channel: 'Telegram',
      createdDate: '2025-01-01',
      lastPickDate: null,
    });

    if (result.success) {
      console.log('Created with ID:', result.data);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {tipsters.map((t) => (
        <li key={t.id}>{t.name}</li>
      ))}
    </ul>
  );
}
```

### PicksProvider

Manages picks collection with real-time listeners ordered by dateTime.

**Location**: `src/core/providers/PicksProvider.tsx`

**State**:
- `picks: Pick[]` - Array of picks (ordered by dateTime desc)
- `loading: boolean` - Data loading state
- `error: string | null` - Error message

**Methods**:
- `createPick(data)` - Create new pick
- `updatePick(id, data)` - Update pick
- `deletePick(id)` - Delete pick
- `getPickById(id)` - Find pick by ID
- `getPicksByTipster(tipsterId)` - Filter picks by tipster
- `refreshPicks()` - Manual refresh

**Usage**:
```tsx
import { usePicks } from '@shared/hooks';

function PicksList({ tipsterId }: { tipsterId: string }) {
  const { picks, loading, getPicksByTipster, createPick } = usePicks();

  const tipsterPicks = getPicksByTipster(tipsterId);

  const handleAdd = async () => {
    const result = await createPick({
      tipsterId,
      sport: 'Futbol',
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
    });

    if (result.success) {
      console.log('Pick created!');
    }
  };

  return (
    <div>
      <button onClick={handleAdd}>Add Pick</button>
      {tipsterPicks.map((pick) => (
        <div key={pick.id}>{pick.match}</div>
      ))}
    </div>
  );
}
```

### FollowsProvider

Manages user follows collection with real-time listeners.

**Location**: `src/core/providers/FollowsProvider.tsx`

**State**:
- `follows: UserFollow[]` - Array of follows (ordered by dateTimeFollowed desc)
- `loading: boolean` - Data loading state
- `error: string | null` - Error message

**Methods**:
- `createFollow(data)` - Create new follow
- `updateFollow(id, data)` - Update follow
- `deleteFollow(id)` - Delete follow
- `getFollowById(id)` - Find follow by ID
- `getFollowByPickId(pickId)` - Find follow for a pick
- `getFollowsByTipster(tipsterId)` - Filter follows by tipster
- `refreshFollows()` - Manual refresh

**Usage**:
```tsx
import { useFollows, usePicks } from '@shared/hooks';

function FollowButton({ pickId }: { pickId: string }) {
  const { createFollow, getFollowByPickId } = useFollows();
  const { getPickById } = usePicks();

  const pick = getPickById(pickId);
  const existingFollow = getFollowByPickId(pickId);

  if (existingFollow) {
    return <div>Already following</div>;
  }

  const handleFollow = async () => {
    if (!pick) return;

    const result = await createFollow({
      pickId: pick.id,
      tipsterId: pick.tipsterId,
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
    });

    if (result.success) {
      console.log('Followed!');
    }
  };

  return <button onClick={handleFollow}>Follow Pick</button>;
}
```

### AppProvider

Composition root that wraps all providers in the correct order.

**Location**: `src/core/providers/AppProvider.tsx`

**Usage in `main.tsx`**:
```tsx
import { AppProvider } from '@core/providers';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
);
```

**Internal Structure**:
```tsx
<AuthProvider>
  <TipstersProvider userId={user?.uid}>
    <PicksProvider userId={user?.uid}>
      <FollowsProvider userId={user?.uid}>
        {children}
      </FollowsProvider>
    </PicksProvider>
  </TipstersProvider>
</AuthProvider>
```

## Custom Hooks

### useAuth()

Hook to access authentication context.

**Returns**: `AuthContextValue`

**Throws**: Error if used outside `AuthProvider`

**Example**:
```tsx
const { user, loading, login, logout } = useAuth();

if (loading) return <Spinner />;
if (!user) return <LoginForm />;

return <div>Welcome {user.email}</div>;
```

### useTipsters()

Hook to access tipsters context.

**Returns**: `TipstersContextValue`

**Throws**: Error if used outside `TipstersProvider`

**Example**:
```tsx
const { tipsters, loading, createTipster, deleteTipster } = useTipsters();
```

### usePicks()

Hook to access picks context.

**Returns**: `PicksContextValue`

**Throws**: Error if used outside `PicksProvider`

**Example**:
```tsx
const { picks, loading, getPicksByTipster, updatePick } = usePicks();
```

### useFollows()

Hook to access follows context.

**Returns**: `FollowsContextValue`

**Throws**: Error if used outside `FollowsProvider`

**Example**:
```tsx
const { follows, loading, getFollowsByTipster, deleteFollow } = useFollows();
```

## Real-time Updates

All data providers use Firebase `onSnapshot` listeners for real-time synchronization:

- **Automatic updates**: When data changes in Firestore, components re-render automatically
- **No manual refresh needed**: State updates happen via listeners
- **Proper cleanup**: Listeners are unsubscribed when component unmounts or userId changes

**Example**:
```tsx
// Component A creates a tipster
const { createTipster } = useTipsters();
await createTipster({ name: 'New Tipster', ... });

// Component B (in another part of the app) will automatically re-render
// with the new tipster in the list - no manual refresh needed!
const { tipsters } = useTipsters();
```

## Error Handling

All operations return `OperationResult<T>`:

```typescript
interface OperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: AppError;
}
```

**Best practice**:
```tsx
const { createTipster } = useTipsters();

const handleSubmit = async (data: CreateTipsterDTO) => {
  const result = await createTipster(data);

  if (result.success) {
    toast.success('Tipster created!');
    navigate('/tipsters');
  } else {
    toast.error(result.error?.message || 'Error creating tipster');
  }
};
```

## Performance Optimization

### Memoization

All context values are memoized with `useMemo` to prevent unnecessary re-renders:

```tsx
const value = useMemo(
  () => ({
    tipsters,
    loading,
    error,
    createTipster,
    updateTipster,
    // ...
  }),
  [tipsters, loading, error, createTipster, updateTipster],
);
```

### Callbacks

All methods are wrapped in `useCallback` for stable references:

```tsx
const createTipster = useCallback(
  async (data: CreateTipsterDTO) => {
    if (!userId) return { success: false, error: { code: 'NO_USER', message: 'Usuario no autenticado' } };
    return tipsterRepository.createTipster(data, userId);
  },
  [userId],
);
```

### Lazy Loading

Data providers don't load until user is authenticated:

```tsx
// DataProviders component only renders when user exists
function DataProviders({ children }) {
  const { user } = useAuth();
  const userId = user?.uid || null;
  
  // If userId is null, providers return empty arrays without subscribing
  return (
    <TipstersProvider userId={userId}>
      {/* ... */}
    </TipstersProvider>
  );
}
```

## Testing

### Mocking Providers

```tsx
import { AuthContext } from '@core/providers/AuthContext';

const mockAuthValue = {
  user: { uid: 'test-user', email: 'test@example.com' },
  loading: false,
  error: null,
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
  resetPassword: jest.fn(),
  clearError: jest.fn(),
};

it('renders when authenticated', () => {
  render(
    <AuthContext.Provider value={mockAuthValue}>
      <ProtectedComponent />
    </AuthContext.Provider>
  );
});
```

## Common Patterns

### Protected Route
```tsx
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
}
```

### Combined Data
```tsx
function TipsterDetailPage({ tipsterId }: { tipsterId: string }) {
  const { getTipsterById } = useTipsters();
  const { getPicksByTipster } = usePicks();
  const { getFollowsByTipster } = useFollows();

  const tipster = getTipsterById(tipsterId);
  const picks = getPicksByTipster(tipsterId);
  const follows = getFollowsByTipster(tipsterId);

  return (
    <div>
      <h1>{tipster?.name}</h1>
      <p>Total picks: {picks.length}</p>
      <p>Followed: {follows.length}</p>
    </div>
  );
}
```

### Loading States
```tsx
function Dashboard() {
  const { tipsters, loading: tipstersLoading } = useTipsters();
  const { picks, loading: picksLoading } = usePicks();
  const { follows, loading: followsLoading } = useFollows();

  const isLoading = tipstersLoading || picksLoading || followsLoading;

  if (isLoading) return <Spinner />;

  return (
    <div>
      <StatsCards tipsters={tipsters} picks={picks} follows={follows} />
    </div>
  );
}
```

## Related Documentation

- [Repository Pattern](../services/README.md)
- [TypeScript Types](../../shared/types/README.md)
- [Firebase Configuration](../config/README.md)
