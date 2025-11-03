# Modern CMS Platform

A production-ready Content Management System built with React, TypeScript, and modern web technologies. Features role-based access control, real-time data management, and a sleek, responsive user interface.

## 🚀 Features

### Core Functionality
- **User Management** - Create, edit, and delete users with role assignments
- **Posts Management** - Full CRUD operations for content with status tracking (Draft, Published, Scheduled)
- **Dashboard** - Real-time analytics, activity feed, and performance metrics
- **Search & Filtering** - Dynamic filtering for users and posts

### Security & Access Control
- **RBAC (Role-Based Access Control)** - Three-tier permission system:
  - **Admin**: Full access to all features
  - **Editor**: Create and edit content (no delete or user management)
  - **Viewer**: Read-only access
- **Permission-based UI** - Dynamic interface adapts to user role
- **Secure operations** - All actions validated against user permissions

### Technical Highlights
- **React Query** - Advanced server state management with caching, optimistic updates, and automatic refetching
- **TypeScript** - Full type safety for reduced runtime errors
- **Chakra UI v3** - Modern, accessible component library with responsive design
- **Optimistic Updates** - Instant UI feedback before server confirmation
- **Toast Notifications** - Real-time success/error feedback

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **React Query** (@tanstack/react-query) - Server state management
- **Chakra UI v3** - Component library and design system
- **Lucide React** - Beautiful, consistent icons

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Header.tsx       # Navigation header
│   ├── Sidebar.tsx      # Navigation sidebar
│   ├── MobileRestriction.tsx  # Desktop-only enforcement
│   ├── Posts/
│   │   └── PostsList.tsx      # Posts management
│   └── Users/
│       └── UsersList.tsx      # User management
├── context/
│   └── AuthContext.tsx  # Authentication & RBAC
├── hooks/
│   ├── usePosts.ts      # React Query hooks for posts
│   └── useUsers.ts      # React Query hooks for users
├── lib/
│   └── api.ts           # API functions & mock data
├── providers/
│   └── QueryProvider.tsx # React Query configuration
└── main.tsx             # App entry point
```

## 🎯 Key Features

### Role-Based Access Control (RBAC)
```tsx
// Centralized permission system
const permissions = {
  admin: ['create', 'read', 'update', 'delete', 'manage_users'],
  editor: ['create', 'read', 'update'],
  viewer: ['read']
}
```

### React Query Implementation
- **Automatic Caching** - Reduces unnecessary API calls
- **Optimistic Updates** - Instant UI feedback
- **Error Handling** - Built-in retry logic
- **Cache Invalidation** - Auto-refresh after mutations
- **DevTools** - Built-in debugging tools

### Responsive Design
- **Desktop-first** - Optimized for screens ≥1024px
- **Mobile/Tablet** - Shows restriction message for optimal UX
- **Adaptive Layouts** - Components scale across breakpoints

## 🔐 User Roles & Permissions

| Feature | Admin | Editor | Viewer |
|---------|-------|--------|--------|
| View Posts | ✅ | ✅ | ✅ |
| Create Posts | ✅ | ✅ | ❌ |
| Edit Posts | ✅ | ✅ | ❌ |
| Delete Posts | ✅ | ❌ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |
| View Dashboard | ✅ | ✅ | ✅ |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Development
```bash
# Clone the repository
git clone <repository-url>

# Navigate to project
cd test

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will be available at `http://localhost:5173`

### Mock Data
The application uses mock data for demonstration. User and post data is stored in memory and will reset on page refresh.

**Default Users:**
- Admin: admin@cms.com (Full access)
- Editor: bob@example.com (Content editing)
- Viewer: carol@example.com (Read-only)

## 🎨 UI/UX Features

- **Modern Card Layouts** - Clean, organized interface
- **Hover Effects** - Interactive feedback on all clickable elements
- **Loading States** - Skeleton screens and spinners
- **Toast Notifications** - Success/error messages
- **Smooth Transitions** - Polished animations
- **Accessible Forms** - WCAG compliant inputs

## 📊 Performance Optimizations

- **Code Splitting** - Dynamic imports for faster initial load
- **Memoization** - `useMemo` for expensive computations
- **Debounced Search** - Reduces API calls during typing
- **Cache Strategy** - 5-minute stale time, 10-minute cache time
- **Lazy Loading** - Components load on demand

## 🔄 State Management

### React Query Configuration
```tsx
{
  staleTime: 1000 * 60 * 5,    // 5 minutes
  gcTime: 1000 * 60 * 10,       // 10 minutes
  retry: 1,
  refetchOnWindowFocus: false
}
```

## 🛣️ Future Enhancements

- [ ] Backend API integration (REST/GraphQL)
- [ ] JWT-based authentication
- [ ] Rich text editor for posts
- [ ] Image upload functionality
- [ ] Advanced analytics dashboard
- [ ] Real-time collaboration (WebSocket)
- [ ] Unit & integration tests
- [ ] CI/CD pipeline
- [ ] Error monitoring (Sentry)
- [ ] Performance monitoring

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

This is a demo project. For production use:
1. Replace mock API with real backend
2. Add authentication flow
3. Implement proper error boundaries
4. Add comprehensive testing
5. Setup CI/CD pipeline

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- React Team for the amazing framework
- Chakra UI team for the component library
- TanStack team for React Query
- Lucide icons for beautiful icons

---

**Built with ❤️ using React, TypeScript, and modern web technologies**