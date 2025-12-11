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
    content: 'Click here to add a new hotel under your affiliate account. Each hotel can have its own subscription and branding.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '.affiliate-hotels-table',
    content: 'This table shows all hotels under your affiliate. You can manage hotel subscriptions, extend expiry dates, and view hotel-specific travel guides.',
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
};

// Pages that have tours (excludes Roles and Categories)
export const PAGES_WITH_TOURS = Object.keys(PAGE_TOURS);
