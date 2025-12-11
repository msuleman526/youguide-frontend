# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YouGuide is a React-based travel guide platform that serves three distinct user types:
- **Admin users**: Manage the entire platform including books, categories, vendors, affiliates, and hotels
- **Vendor subscriptions**: Organizations with time-limited access to travel guides
- **Affiliate subscriptions**: Partners who can manage their own hotels and provide branded access to travel guides

## Development Commands

### Start Development Server
```bash
npm start
```
Runs the app in development mode at http://localhost:3000

### Build for Production
```bash
npm build
```
Creates an optimized production build in the `build/` directory

### Run Tests
```bash
npm test
```
Launches the test runner in interactive watch mode

## Architecture

### Routing Strategy
The application uses **HashRouter** (not BrowserRouter) for client-side routing. This is critical for deployment compatibility.

### Authentication & Authorization
The app implements **dual authentication systems**:

1. **Admin Authentication** (src/components/ProtectedRoute.jsx:5-24)
   - Token stored in `localStorage.getItem('token')`
   - User data in `localStorage.getItem('user')`
   - Validates that user has Admin role: `userObj.role?.name?.includes('Admin')`

2. **Affiliate Authentication** (src/components/ProtectedRoute.jsx:27-36)
   - Separate token: `localStorage.getItem('affiliateToken')`
   - Separate data: `localStorage.getItem('affiliateData')`

**Important**: When working with protected routes, always use the `type` prop to specify which authentication system to use:
- `<ProtectedRoute type="admin">` for admin routes
- `<ProtectedRoute type="affiliate">` for affiliate routes

### Layout System
The app uses three distinct layouts:

1. **AuthLayout** (src/layouts/AuthLayout.jsx)
   - For unauthenticated pages (login, register, forgot password)

2. **DashboardLayout** (src/layouts/DashboardLayout.jsx)
   - For admin users
   - Includes Sidebar and LayoutHeader components
   - Responsive: collapses sidebar at < 1400px, mobile view at < 550px

3. **AffiliateLayout** (src/layouts/AffiliateLayout.jsx)
   - For affiliate users
   - Uses AffiliateSidebar and AffiliateLayoutHeader
   - Supports dynamic theming via affiliate's `primaryColor` property

### State Management
The app uses **Recoil** for global state management:
- Main Recoil state defined in `src/atom.js`
- Theme state (`themeState`) persists to localStorage
- Application wrapped in `<RecoilRoot>` at the entry point (src/index.js)

### API Architecture
There are **two separate API service files**:

1. **src/APIServices/ApiService.js** - Primary API service
   - Base URL: `https://appapi.youguide.com/api`
   - Uses class-based static methods
   - Handles all CRUD operations for roles, categories, users, books, vendors, affiliates, hotels, analytics
   - Auth headers use `localStorage.getItem('token')` for admin OR `localStorage.getItem('affiliateToken')` for affiliates

2. **src/Utils/Apis.js** - Legacy/alternate API service
   - Different base URL: `https://dinkum.netlify.app`
   - Contains transaction and bank-related APIs
   - Appears to be from a previous project (references "dinkum")

**When adding new API calls**: Always add them to ApiService.js and follow the existing patterns for error handling and authorization headers.

### Theme System
Dual theme support (light/dark) managed through:
- Recoil state: `themeState` atom
- Theme configs: `src/theme/dashboardTheme.js` exports `dashboardLightTheme` and `dashboardDarkTheme`
- Ant Design ConfigProvider wraps layouts with theme configuration
- Theme persisted to localStorage

### Key Domain Models

**Vendors vs Affiliates vs Hotels**:
- **Vendors**: Organizations with direct subscriptions to access guides
- **Affiliates**: Partners who have their own branded access and can manage multiple hotels
- **Hotels**: Sub-entities under affiliates, each with its own subscription and branding

**Books/Guides**:
- Books belong to categories
- Can be accessed via vendor subscriptions, affiliate subscriptions, or hotel subscriptions
- Support multiple languages (tracked via `lang` query parameter)
- PDF files uploaded separately from book metadata

### PDF Viewing Architecture
The app has three separate PDF viewer implementations:
- `src/pages/Vendors/PdfViewer.js` - For vendor subscription guides
- `src/pages/Affiliate/PdfAffiliateViewer.js` - For affiliate subscription guides
- `src/pages/Affiliate/PdfHotelViewer.js` - For hotel-specific guides

Each viewer checks subscription expiry and implements one-time view tracking.

### Public vs Protected Routes
**Public routes** (no authentication required):
- `/login`, `/register`, `/otp`, `/forget-password`, `/set-new-password`
- `/travel-guides/:id` - Public guide preview
- `/subscription-guides/:id` - Vendor guide access
- `/affiliate-guides/:id` - Affiliate guide access
- `/hotel-guides/:affiliateId/:hotelId` - Hotel guide access
- `/view-content/*`, `/view-affiliate-content/*`, `/view-hotel-content/*` - PDF viewers
- `/payment/success`, `/payment/cancel`
- `/account/remove`, `/subscription-expired`

**Protected admin routes** (wrapped in DashboardLayout):
- `/admin-dashboard`, `/dashboard`
- `/roles`, `/categories`, `/vendors`, `/affiliates`, `/users`, `/books`, `/transactions`
- `/hotel-management/:affiliateId`

**Protected affiliate routes** (wrapped in AffiliateLayout):
- `/affiliate-dashboard/:affiliateId`
- `/affiliate-hotels/:affiliateId`

### Component Organization
```
src/
├── APIServices/         # API service layer (ApiService.js)
├── assets/              # Images, SVGs, country flags
├── components/          # Reusable components
│   ├── layout/          # Sidebar, Header components for both admin and affiliate
│   ├── ProtectedRoute.jsx
│   ├── AuthRedirect.jsx
│   └── ...
├── hooks/               # Custom hooks (useDarkMode.js)
├── layouts/             # Page layouts (Auth, Dashboard, Affiliate)
├── pages/               # Feature-specific pages
│   ├── Affiliate/       # Affiliate management and dashboard
│   ├── Books/           # Book management
│   ├── Categories/      # Category management
│   ├── Payment/         # Payment success/error pages
│   ├── Roles/           # Role management
│   ├── Users/           # User management
│   ├── Vendors/         # Vendor management
│   └── ...
├── theme/               # Theme configurations
├── Utils/               # Utility functions and legacy APIs
├── App.js               # Main routing configuration
├── atom.js              # Recoil state definitions
└── index.js             # Application entry point
```

## Important Patterns

### Adding New Protected Routes
```javascript
// For admin routes:
<Route element={<ProtectedRoute type="admin"><DashboardLayout /></ProtectedRoute>}>
  <Route path="/your-route" element={<YourComponent />} />
</Route>

// For affiliate routes:
<Route element={<ProtectedRoute type="affiliate"><AffiliateLayout /></ProtectedRoute>}>
  <Route path="/your-route/:affiliateId" element={<YourComponent />} />
</Route>
```

### API Call Pattern
```javascript
// Import the service
import ApiService from '../APIServices/ApiService';

// Make API call (with proper error handling)
try {
  const response = await ApiService.yourMethod(params);
  // Handle success
} catch (error) {
  console.error('Error message:', error.response?.data || error.message);
  // Handle error
}
```

### Authorization Headers
Admin endpoints automatically use: `"Authorization": "Bearer " + localStorage.getItem("token")`
Affiliate endpoints use: `"Authorization": "Bearer " + localStorage.getItem("affiliateToken")`

### Subscription Expiry Checks
When implementing features that access subscription content, always check expiry:
```javascript
const expiry = await ApiService.checkVendorSubscriptionExpiry(id);
// or
const expiry = await ApiService.checkAffiliateSubscriptionExpiry(id);
// or
const expiry = await ApiService.checkHotelSubscriptionExpiry(hotelId);
```

### One-Time View Tracking
For PDF viewers, track one-time views:
```javascript
await ApiService.openVendorBookOneTime(id);
// or
await ApiService.openAffiliateBookOneTime(id);
// or
await ApiService.openHotelBookOneTime(hotelId);
```

## Analytics
The platform includes comprehensive analytics endpoints (src/APIServices/ApiService.js:744-1127):
- Dashboard stats with date filtering
- User growth and role distribution
- Book performance by category, language, destination
- Revenue tracking and purchase trends
- Affiliate and vendor click statistics
- Expiring subscriptions tracking

All analytics methods support optional `startDate` and `endDate` parameters for filtering.

## Testing Considerations
- The repo uses Create React App's default testing setup
- Tests run with Jest and React Testing Library
- Test file: src/App.test.js (currently contains default CRA test)

## Mobile Responsiveness
Layouts track mobile state with `window.innerWidth < 550` and adjust:
- Sidebar collapses to drawer on mobile
- Different header behaviors for mobile vs desktop
