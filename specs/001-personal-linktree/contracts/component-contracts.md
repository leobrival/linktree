# Component API Contracts

**Status**: Complete
**Version**: 1.0.0

## Overview

This document specifies the TypeScript contracts for React components in the Personal Linktree application.

---

## 1. ProfileCard Component

### Purpose
Display the linktree owner's profile with avatar, name, and bio. Includes skeleton loader during loading state.

### Props Interface

```typescript
interface ProfileCardProps {
  profile: Profile | null;
  avatarUrl: string | null;
  loading: boolean;
  error: string | null;
}

interface Profile {
  name: string;
  bio: string;
  gitHubUsername: string;
  socialMediaHandle?: string;
}
```

### Component Signature

```typescript
export function ProfileCard(props: ProfileCardProps): JSX.Element
```

### Behavior

| State | Rendering |
|-------|-----------|
| loading = true | Show ProfileSkeleton component |
| loading = false, error = null | Show profile with avatar |
| loading = false, error != null | Show error message with retry option |
| avatarUrl = null | Show default/fallback avatar |

### Props Details

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| profile | Profile \| null | Yes | - | Profile data object |
| avatarUrl | string \| null | Yes | - | URL to avatar image |
| loading | boolean | Yes | false | Is data currently loading |
| error | string \| null | Yes | null | Error message if any |

### Class Names

- Container: `profile-card` or `w-full max-w-md mx-auto`
- Avatar: `w-32 h-32 rounded-full`
- Name: `text-2xl font-bold`
- Bio: `text-gray-600 text-sm`

### Accessibility

- Avatar has `alt` attribute describing the person
- Heading uses semantic `<h1>` tag
- Error message is announced to screen readers

### Example Usage

```typescript
<ProfileCard
  profile={profile}
  avatarUrl={avatarUrl}
  loading={loading}
  error={error}
/>
```

---

## 2. LinksList Component

### Purpose
Display a scrollable list of links sorted by their order property.

### Props Interface

```typescript
interface LinksListProps {
  links: Link[];
  loading: boolean;
  error: string | null;
}

interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
  description?: string;
  order: number;
}
```

### Component Signature

```typescript
export function LinksList(props: LinksListProps): JSX.Element
```

### Behavior

| State | Rendering |
|-------|-----------|
| loading = true | Show 5 LinkSkeleton components |
| loading = false, error = null | Show all links sorted by order |
| loading = false, error != null | Show error message |
| links.length = 0 | Show "No links available" message |

### Props Details

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| links | Link[] | Yes | [] | Array of link objects |
| loading | boolean | Yes | false | Is data loading |
| error | string \| null | Yes | null | Error message |

### Sorting Behavior

- Links sorted by `order` property (ascending)
- Invalid order values treated as 0
- Duplicate order values preserved in input order

### Class Names

- Container: `links-list space-y-3`
- List item: `link-item`
- Each link rendered with LinkButton component

### Accessibility

- Container uses semantic `<div role="list">`
- Each LinkButton has `role="listitem"`
- Links are keyboard accessible (Tab navigation)

### Example Usage

```typescript
<LinksList
  links={links}
  loading={loading}
  error={error}
/>
```

---

## 3. LinkButton Component

### Purpose
Display a single clickable link with icon, title, and optional description.

### Props Interface

```typescript
interface LinkButtonProps {
  link: Link;
  onClick?: (link: Link) => void;
}

interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
  description?: string;
  order: number;
}
```

### Component Signature

```typescript
export function LinkButton(props: LinkButtonProps): JSX.Element
```

### Behavior

- Click opens `link.url` in new tab/window
- Hover state shows subtle visual feedback
- Valid URLs required (must start with http:// or https://)
- Invalid URLs show warning in console but remain clickable

### Props Details

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| link | Link | Yes | - | Link data object |
| onClick | function | No | undefined | Optional callback on click |

### Link Validation

- URL must be valid HTTP(S) format
- Empty URL treated as "#" (no-op link)
- Missing URL shows warning to console

### Class Names

- Container: `link-button w-full rounded-lg border`
- Icon: `text-xl mr-3`
- Content wrapper: `flex-1 text-left`
- Title: `font-medium`
- Description: `text-sm text-gray-500`

### Accessibility

- Uses semantic `<a>` element with `href`
- Has `rel="noopener noreferrer"` for security
- Title attribute for additional context
- Minimum 44px touch target on mobile

### Example Usage

```typescript
<LinkButton
  link={link}
  onClick={(link) => console.log(`Clicked: ${link.title}`)}
/>
```

---

## 4. ProfileSkeleton Component

### Purpose
Show loading skeleton for profile section while data loads.

### Props Interface

```typescript
interface ProfileSkeletonProps {
  // No props - pure presentation
}
```

### Component Signature

```typescript
export function ProfileSkeleton(): JSX.Element
```

### Behavior

- Displays placeholder shapes mimicking ProfileCard layout
- Smooth fade animation (optional)
- Never blocks interaction (loading state only)

### Elements Rendered

```
[Circular skeleton] - Avatar (w-32 h-32)
[Line skeleton] - Name (w-3/4)
[Line skeleton] - Bio line 1 (w-full)
[Line skeleton] - Bio line 2 (w-5/6)
```

### Class Names

- Wrapper: `w-full max-w-md mx-auto p-6 space-y-4`
- Avatar skeleton: `w-32 h-32 rounded-full mx-auto`
- Text skeletons: `h-4` or `h-6`

### Animation

- Pulsing animation using shadcn/ui Skeleton
- Duration: 2 seconds
- Infinite loop during loading

### Example Usage

```typescript
{loading ? <ProfileSkeleton /> : <ProfileCard {...props} />}
```

---

## 5. LinkSkeleton Component

### Purpose
Show loading skeleton for individual link items.

### Props Interface

```typescript
interface LinkSkeletonProps {
  // No props - pure presentation
}
```

### Component Signature

```typescript
export function LinkSkeleton(): JSX.Element
```

### Behavior

- Displays placeholder shape mimicking LinkButton
- Renders full width with rounded corners
- No interaction during loading

### Elements Rendered

```
[Icon skeleton] [Title skeleton ................]
                [Description skeleton ......]
```

### Class Names

- Container: `w-full rounded-lg border p-4 space-y-2`
- Icon: `w-8 h-8 rounded`
- Title: `h-6 w-3/4`
- Description: `h-4 w-full`

### Animation

- Pulsing animation using shadcn/ui Skeleton
- Duration: 2 seconds
- Staggered with offset for visual effect

### Example Usage

```typescript
{loading ? (
  <>
    <LinkSkeleton />
    <LinkSkeleton />
    <LinkSkeleton />
  </>
) : (
  <LinksList links={links} />
)}
```

---

## 6. App Component (Root)

### Purpose
Main application component orchestrating data loading and layout.

### Props Interface

```typescript
interface AppProps {
  // App doesn't accept props
}
```

### Component Signature

```typescript
export function App(): JSX.Element
```

### Behavior

- Initializes both data hooks on mount
- Manages loading states across components
- Handles errors gracefully with user-friendly messages
- Responsive container layout

### State Management

```typescript
// Uses two hooks:
const { data, loading: dataLoading, error: dataError } = useLinktreeData();
const { avatar, loading: avatarLoading } = useGithubProfile(username);
```

### Layout Structure

```
<div className="min-h-screen bg-white">
  <div className="container mx-auto py-8 px-4">
    <ProfileCard ... />
    <LinksList ... />
  </div>
</div>
```

### Error Handling

- Network errors shown with retry option
- Validation errors logged to console
- Fallbacks provided (default avatar, empty links)
- App remains functional even with partial failures

### Responsive Behavior

- Mobile-first design
- Container padding adjusts for screen size
- Components stack vertically
- Touch targets minimum 44px

### Example Implementation

```typescript
export function App() {
  const { data, loading: dataLoading, error: dataError } = useLinktreeData();
  const { avatar, loading: avatarLoading } = useGithubProfile(
    data?.profile.gitHubUsername || ''
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8 px-4">
        <ProfileCard
          profile={data?.profile || null}
          avatarUrl={avatar}
          loading={dataLoading || avatarLoading}
          error={dataError || null}
        />
        <LinksList
          links={data?.links || []}
          loading={dataLoading}
          error={dataError}
        />
      </div>
    </div>
  );
}
```

---

## Component Composition Map

```
App (Root)
├── ProfileCard
│   ├── Avatar image (or ProfileSkeleton)
│   ├── Name (h1)
│   └── Bio (p)
└── LinksList
    ├── LinkButton (repeated)
    │   ├── Icon
    │   ├── Title
    │   └── Description (optional)
    └── LinkSkeleton (during loading)
```

---

## Styling Conventions

### Tailwind Classes Used

- **Spacing**: `p-4`, `m-2`, `space-y-3`
- **Sizing**: `w-32`, `h-32`, `max-w-md`
- **Colors**: `bg-white`, `text-gray-600`, `border-gray-200`
- **Typography**: `text-2xl`, `font-bold`, `text-sm`
- **Layout**: `flex`, `mx-auto`, `container`
- **Effects**: `rounded-lg`, `border`, `shadow-sm`

### Color Palette

- Background: `white`
- Text Primary: `gray-900`
- Text Secondary: `gray-600`
- Borders: `gray-200`
- Hover: `gray-50` or `gray-100`

### Responsive Breakpoints

- Mobile: Default (no prefix)
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)

---

## Testing Contract

### Component Tests Expected

Each component should have:

1. **Rendering Test**: Component renders without error
2. **Props Test**: Component handles props correctly
3. **Loading State Test**: Skeleton shown during loading
4. **Error State Test**: Error message displayed properly
5. **Interaction Test**: Click/hover handlers work (LinkButton)
6. **Accessibility Test**: ARIA labels, semantic HTML verified

### Example Test Structure

```typescript
describe('ProfileCard', () => {
  it('renders loading skeleton when loading prop is true', () => {
    render(<ProfileCard loading={true} profile={null} avatarUrl={null} error={null} />);
    expect(screen.getByTestId('profile-skeleton')).toBeInTheDocument();
  });

  it('displays profile information when loaded', () => {
    render(<ProfileCard loading={false} profile={mockProfile} avatarUrl={mockUrl} error={null} />);
    expect(screen.getByText(mockProfile.name)).toBeInTheDocument();
  });

  it('shows error message when error prop is provided', () => {
    render(<ProfileCard loading={false} profile={null} avatarUrl={null} error="Failed to load" />);
    expect(screen.getByText(/Failed to load/i)).toBeInTheDocument();
  });
});
```

---

## Performance Considerations

### Component Optimization

- **ProfileCard**: Memoize if re-rendering becomes costly
- **LinksList**: Virtualize if > 50 links needed (future)
- **LinkButton**: Memoize to prevent re-render on parent change
- **Skeletons**: Keep lightweight, minimal DOM nodes

### Re-render Prevention

```typescript
// Memoize components that receive many props
export const LinkButton = memo(function LinkButton(props: LinkButtonProps) {
  // Component implementation
});
```

### Bundle Size

- Only import needed shadcn/ui components
- Use dynamic imports for optional features (future)
- Tree-shake unused Tailwind utilities

---

## Browser Support

**Target Browsers**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Features Used**:
- Fetch API
- CSS Grid/Flexbox
- Modern JavaScript (ES2020)
- Dynamic imports (optional)

**No polyfills needed** for target browsers.

---

## Version History

**v1.0.0** (2025-11-01):
- Initial component contracts
- Profile, Links, Skeleton components
- Full TypeScript interfaces
- Accessibility guidelines
