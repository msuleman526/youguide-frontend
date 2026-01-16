// Tour configurations for each page

export const TOUR_PAGES = {
  ADMIN_DASHBOARD: 'admin-dashboard',
  USERS: 'users',
  TEAMS: 'teams',
  BOOKS: 'books',
  TRANSACTIONS: 'transactions',
  VENDORS: 'vendors',
  AFFILIATES: 'affiliates',
  AFFILIATE_DASHBOARD: 'affiliate-dashboard',
  AFFILIATE_HOTELS: 'affiliate-hotels',
  ROLES: 'roles',
  CATEGORIES: 'categories',
  HOTEL_MANAGEMENT: 'hotel-management',
  API_ACCESS_DASHBOARD: 'api-access-dashboard',
  API_ACCESS_LIST: 'api-access-list',
  ALL_REQUESTS: 'all-requests',
  ALL_CONTACTS: 'all-contacts',
  AFFILIATE_API_ACCESS_DASHBOARD: 'affiliate-api-access-dashboard',
  AFFILIATE_API_ACCESS_LIST: 'affiliate-api-access-list',
};

export const TOUR_STORAGE_KEY = 'youguide-tours-completed';
export const TOUR_FIRST_TIME_KEY = 'youguide-first-tour-shown';
export const TOUR_AUTO_START_KEY = 'youguide-tour-auto-start';

// Tour steps for Admin Dashboard
export const adminDashboardTour = [
  {
    target: '.date-filter',
    content: 'Use these date filters to view statistics for a specific time period. You can filter by week, month, year, or select a custom date range.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '.stats-cards',
    content: 'Here you can see key statistics including total users, books, revenue, affiliates, vendors, and more. These stats update based on your selected date filter.',
    placement: 'bottom',
  },
];

// Tour steps for Users Page
export const usersTour = [
  {
    target: '.users-add-button',
    content: 'Click here to create a new user in the system. You can assign roles and permissions.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '.users-table',
    content: 'This table displays all users with their details. Each row shows user information including name, email, role, and activity statistics.',
    placement: 'top',
  },
  {
    target: '.users-table',
    content: 'Use the edit button (pencil icon) in each row to modify user details. You can update their role, name, email, and other information.',
    placement: 'top',
  },
];

// Tour steps for Teams Page
export const teamsTour = [
  {
    target: '.teams-add-admin-button',
    content: 'Click here to create a new Team Admin. A Team Admin can manage their own team with limited members.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '.teams-table',
    content: 'This table displays all Team Admins. You can set team limits, toggle status, and expand rows to see team members.',
    placement: 'top',
  },
  {
    target: '.teams-table',
    content: 'Expand any row using the arrow icon to see team members. You can add new team users by clicking the "Add Team User" button inside each expanded row.',
    placement: 'top',
  },
];

// Tour steps for Books/Guides Page
export const booksTour = [
  {
    target: '.books-add-button',
    content: 'Click here to add a new travel guide to the platform.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '.books-filters',
    content: 'Use these filters to search guides by language, category, or search query.',
    placement: 'bottom',
  },
  {
    target: '.books-table',
    content: 'This table displays all travel guides. You can edit, delete, or upload PDF files for each guide.',
    placement: 'top',
  },
  {
    target: '.upload-pdf-button',
    content: 'Use this button to upload or update the PDF file for a guide.',
    placement: 'left',
  },
];

// Tour steps for Transactions Page
export const transactionsTour = [
  {
    target: '.transactions-table',
    content: 'This table displays all purchase transactions. You can see user details, book information, payment status, and purchase dates.',
    disableBeacon: true,
    placement: 'top',
  },
];

// Tour steps for Vendors Page
export const vendorsTour = [
  {
    target: '.vendors-add-button',
    content: 'Click here to create a new vendor subscription with expiry date and book access.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '.vendors-table',
    content: 'This table displays all vendor subscriptions. You can view details, check expiry dates, and delete vendors.',
    placement: 'top',
  },
];

// Tour steps for Affiliates Page
export const affiliatesTour = [
  {
    target: '.affiliates-add-button',
    content: 'Click here to create a new affiliate with custom branding, logo, and subscription settings.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '.affiliates-table',
    content: 'This table shows all affiliates. You can manage hotels, extend subscriptions, view login details, and delete affiliates.',
    placement: 'top',
  },
  {
    target: '.affiliate-qr-column',
    content: 'Each affiliate has a QR Code that redirects to their custom branded website where users can see all travel guides. Click the QR code to view and download it in full size.',
    placement: 'left',
  },
];

// Tour steps for Affiliate Dashboard Page
export const affiliateDashboardTour = [
  {
    target: '.affiliate-stats-cards',
    content: 'View your affiliate performance metrics including total clicks, pending clicks, and subscription status.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '.affiliate-analytics-section',
    content: 'Track your affiliate analytics over time with these charts showing clicks and engagement trends.',
    placement: 'top',
  },
];

// Tour steps for Affiliate Hotels Management Page
export const affiliateHotelsTour = [
  {
    target: '.affiliate-hotels-add-button',
    content: 'Click here to add a new client under your affiliate account. Each client can have its own subscription and branding.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '.affiliate-hotels-table',
    content: 'This table shows all clients under your affiliate. You can manage client subscriptions, extend expiry dates, and view client-specific travel guides.',
    placement: 'top',
  },
];

// Tour steps for Roles Page
export const rolesTour = [
  {
    target: '.roles-add-button',
    content: 'Click here to create a new role. Roles define permissions and access levels for users.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '.roles-table',
    content: 'This table displays all roles with their status. Use the edit button to modify role details.',
    placement: 'top',
  },
];

// Tour steps for Categories Page
export const categoriesTour = [
  {
    target: '.categories-add-button',
    content: 'Click here to create a new category. Categories help organize travel guides by destination or type.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '.categories-table',
    content: 'This table shows all categories. You can edit category names and details using the edit button.',
    placement: 'top',
  },
];

// Tour steps for Hotel Management Page (Admin)
export const hotelManagementTour = [
  {
    target: '.hotel-management-affiliate-card',
    content: 'This card shows the default affiliate link. Share this URL with clients to access travel guides.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '.hotel-management-add-button',
    content: 'Click here to add a new client for this affiliate. Each client gets their own branded access and subscription.',
    placement: 'bottom',
  },
  {
    target: '.hotel-management-table',
    content: 'This table shows all clients under this affiliate. You can extend subscriptions, edit details, or delete clients.',
    placement: 'top',
  },
];

// Tour steps for API Access Dashboard Page
export const apiAccessDashboardTour = [
  {
    target: '.api-access-token-selector',
    content: 'Select an API token from the dropdown to view its statistics and usage data.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '.api-access-view-logs-button',
    content: 'Click here to view detailed logs including transaction history and API call records.',
    placement: 'bottom',
  },
  {
    target: '.api-access-stats-cards',
    content: 'These cards show key metrics: total accesses, unique guides accessed, remaining quota, and access breakdown by type.',
    placement: 'top',
  },
];

// Tour steps for API Access List Page
export const apiAccessListTour = [
  {
    target: '.api-access-add-button',
    content: 'Click here to create a new API access token. Configure the token type, quota, and categories.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '.api-access-table',
    content: 'This table shows all API tokens. You can edit settings, view statistics, or delete tokens.',
    placement: 'top',
  },
];

// Tour steps for All Requests Page
export const allRequestsTour = [
  {
    target: '.requests-stats-cards',
    content: 'These cards show request statistics: total requests, unread count, new requests, and in-progress items.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '.requests-table',
    content: 'This table displays all submitted requests with contact information, status, and submission date.',
    placement: 'top',
  },
];

// Tour steps for All Contacts Page
export const allContactsTour = [
  {
    target: '.contacts-stats-cards',
    content: 'These cards show contact statistics: total contacts, unread messages, new contacts, and in-progress items.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '.contacts-table',
    content: 'This table displays all contact form submissions with message details and status.',
    placement: 'top',
  },
];

// Tour steps for Affiliate API Access Dashboard Page
export const affiliateApiAccessDashboardTour = [
  {
    target: '.affiliate-api-dashboard-header',
    content: 'View your API token statistics here. Select a token to see its usage data and performance metrics.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '.affiliate-api-view-logs-button',
    content: 'Click here to view detailed logs including all API calls and transaction history.',
    placement: 'bottom',
  },
  {
    target: '.affiliate-api-stats-cards',
    content: 'Monitor your API usage: total accesses, unique guides, remaining quota, and access breakdown by type.',
    placement: 'top',
  },
];

// Tour steps for Affiliate API Access List Page
export const affiliateApiAccessListTour = [
  {
    target: '.affiliate-api-list-header',
    content: 'Manage your API access tokens here. The token counter shows how many tokens you can create.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '.affiliate-api-add-button',
    content: 'Click here to create a new API token. Tokens will be deducted from your available quota.',
    placement: 'bottom',
  },
  {
    target: '.affiliate-api-table',
    content: 'This table shows all your API tokens. You can edit settings, view statistics, or delete tokens.',
    placement: 'top',
  },
];

// Map page names to their tour configurations
export const PAGE_TOURS = {
  [TOUR_PAGES.ADMIN_DASHBOARD]: adminDashboardTour,
  [TOUR_PAGES.USERS]: usersTour,
  [TOUR_PAGES.TEAMS]: teamsTour,
  [TOUR_PAGES.BOOKS]: booksTour,
  [TOUR_PAGES.TRANSACTIONS]: transactionsTour,
  [TOUR_PAGES.VENDORS]: vendorsTour,
  [TOUR_PAGES.AFFILIATES]: affiliatesTour,
  [TOUR_PAGES.AFFILIATE_DASHBOARD]: affiliateDashboardTour,
  [TOUR_PAGES.AFFILIATE_HOTELS]: affiliateHotelsTour,
  [TOUR_PAGES.ROLES]: rolesTour,
  [TOUR_PAGES.CATEGORIES]: categoriesTour,
  [TOUR_PAGES.HOTEL_MANAGEMENT]: hotelManagementTour,
  [TOUR_PAGES.API_ACCESS_DASHBOARD]: apiAccessDashboardTour,
  [TOUR_PAGES.API_ACCESS_LIST]: apiAccessListTour,
  [TOUR_PAGES.ALL_REQUESTS]: allRequestsTour,
  [TOUR_PAGES.ALL_CONTACTS]: allContactsTour,
  [TOUR_PAGES.AFFILIATE_API_ACCESS_DASHBOARD]: affiliateApiAccessDashboardTour,
  [TOUR_PAGES.AFFILIATE_API_ACCESS_LIST]: affiliateApiAccessListTour,
};

// Pages that have tours
export const PAGES_WITH_TOURS = Object.keys(PAGE_TOURS);
