Core Concept

  A B2B API system for external clients to access YouGuide's travel guides programmatically with:
  - Strict type enforcement: PDF tokens cannot access HTML/JSON APIs and vice versa
  - Payment type isolation: Free tokens cannot use secure (paid) endpoints and vice versa
  - Token-based authentication with Bearer tokens
  - Quota management with first-access deduction
  - Category-based access control
  - HTML rendering from JSON (similar to reference.html)

  Business Flow

  For "Content" Access (payment_type=free):
  1. Admin creates token with pre-paid quota (e.g., 100 guides)
  2. Client uses token to access guides directly via /content endpoints
  3. System validates: token type, payment type, category, quota
  4. First access deducts quota, subsequent access to same guide = free
  5. HTML is rendered server-side from JSON with optional styling

  For "Secure" Access (payment_type=paid):
  1. Client requests checkout link via /secure/checkout
  2. System generates Stripe session with unique transaction_id
  3. Client completes payment, redirected to success page
  4. Client accesses content via /secure/* endpoints with transaction_id
  5. System validates payment success, ownership, and guide match
  6. Quota deducted only after successful payment verification

  Strict Validation Rules

  Type Validation:
  - type=pdf tokens → ONLY /pdf/* endpoints allowed
  - type=html_json tokens → ONLY /digital/* endpoints allowed
  - Cross-type access = 403 Forbidden

  Payment Type Validation:
  - payment_type=free tokens → ONLY /content endpoints allowed
  - payment_type=paid tokens → ONLY /secure endpoints allowed
  - Cross-payment access = 403 Forbidden

  Combined Example:
  - Token with type=pdf, payment_type=free → Can ONLY access /api/travel-guides/pdf/content/:guideId
  - Token with type=html_json, payment_type=paid → Can ONLY access /api/travel-guides/digital/secure/*

  ---
  📁 Files I Will Create

  Models (4 files)

  1. src/models/ApiAccess.js
  {
    token: String (unique, indexed) - Bearer token
    name: String - Client contact name
    company_name: String - Company name
    user_id: ObjectId (nullable) - Optional affiliate linkage
    end_date: Date - Token expiration
    allowed_travel_guides: Number - Remaining quota
    type: String (enum: 'pdf', 'html_json') - Content format
    payment_type: String (enum: 'free', 'paid') - Payment model
    categories: [ObjectId] - Allowed category IDs
    createdAt, updatedAt
  }
  1. Indexes: token (unique), end_date, type, payment_type
  2. src/models/ApiAccessLog.js
  {
    api_access_id: ObjectId - Reference to ApiAccess
    token: String - For quick lookups
    travel_guide_id: ObjectId - Guide accessed
    transaction_id: String (nullable) - For paid access
    access_type: String - 'pdf', 'html', 'json'
    created_at: Date
  }
  2. Indexes:
    - Compound: { token: 1, travel_guide_id: 1 } (for duplicate access check)
    - api_access_id, transaction_id
  3. src/models/ApiTransaction.js
  {
    transaction_id: String (unique, indexed) - UUID
    api_access_id: ObjectId - Token used
    token: String - For validation
    travel_guide_id: ObjectId - Guide purchased
    content_type: String (enum: 'pdf', 'html', 'json') - Format purchased
    stripe_session_id: String - Stripe checkout session
    stripe_payment_intent_id: String (nullable)
    amount: Number - Payment amount
    currency: String - e.g., 'usd'
    status: String (enum: 'pending', 'completed', 'failed')
    paid_at: Date (nullable)
    createdAt, updatedAt
  }
  3. Indexes: transaction_id (unique), stripe_session_id, compound: { token: 1, travel_guide_id: 1 }
  4. Existing Models Used:
    - Book (travel guides)
    - Category

  ---
  Middleware (1 file)

  src/middleware/authenticateBearerToken.js
  - Extracts token from Authorization: Bearer <token> header
  - Validates token exists in ApiAccess collection
  - Checks end_date >= today
  - Attaches apiAccess object to req.apiAccess
  - Returns 401 if invalid/expired

  ---
  Services (1 file - recommended)

  src/services/apiAccessService.js
  - validateTokenAccess(apiAccess, requiredType, requiredPaymentType) - Type/payment enforcement
  - checkCategoryAccess(apiAccess, guideId) - Category authorization
  - checkAndDeductQuota(apiAccess, guideId) - Quota validation & deduction
  - logAccess(apiAccess, guideId, transactionId, accessType) - Usage logging
  - generateTransactionId() - UUID generation
  - validateTransaction(transactionId, token, guideId, contentType) - Transaction verification
  - renderHtmlFromJson(jsonContent, options) - HTML generation from JSON (like reference.html)

  ---
  Controllers (2 files)

  1. src/controllers/apiAccessController.js - Admin operations
  2. src/controllers/travelContentController.js - All client-facing APIs

  ---
  Routes (2 files)

  1. src/routes/apiAccess.js - Admin routes
  2. src/routes/travelContent.js - Client routes

  ---
  🔌 APIs I Will Create (By Category)

  1️⃣ Admin APIs (/api/api-access/*)

  Authentication: JWT (existing admin auth)
  Controller: apiAccessController.js

  | Method | Endpoint                  | Purpose                       | Request Body/Query                                                                                                 |
  |--------|---------------------------|-------------------------------|--------------------------------------------------------------------------------------------------------------------|
  | GET    | /api/api-access           | List all API access tokens    | Query: page, limit, type, payment_type, user_id                                                                    |
  | POST   | /api/api-access           | Create new API access token   | Body: { name, company_name, user_id?, end_date, allowed_travel_guides, type, payment_type, categories[] }          |
  | GET    | /api/api-access/:id       | Get single API access details | -                                                                                                                  |
  | PUT    | /api/api-access/:id       | Update API access token       | Body: { name?, company_name?, end_date?, allowed_travel_guides?, categories[]? } (cannot change type/payment_type) |
  | DELETE | /api/api-access/:id       | Delete token (permanent)      | -                                                                                                                  |
  | GET    | /api/api-access/:id/logs  | View usage logs for token     | Query: page, limit                                                                                                 |
  | GET    | /api/api-access/:id/stats | Get token usage statistics with graphs | - (returns: stats summary, graph data, recent logs - see details below)                                   |

  Admin Stats Endpoint Response:
  {
    "success": true,
    "data": {
      "token_info": { name, company_name, type, payment_type, is_active, end_date },
      "usage": { total_accesses, unique_guides_accessed, remaining_quota, access_breakdown },
      "graphs": {
        "daily_usage": [{ date, count }],  // Last 30 days
        "category_breakdown": [{ category_id, category_name, count }],
        "access_type_breakdown": [{ type, count }]
      },
      "recent_logs": [ /* Last 20 logs with guide details */ ]
    }
  }

  Validation:
  - Ensure categories array contains valid category IDs
  - type must be 'pdf' or 'html_json'
  - payment_type must be 'free' or 'paid'
  - end_date must be future date
  - allowed_travel_guides must be positive integer

  ---
  2️⃣ Common Content APIs (/api/travel-content/*)

  Authentication: Bearer Token
  Controller: travelContentController.js
  Validation: None (accessible by all valid tokens)

  | Method | Endpoint                                  | Purpose                       | Response                                                            |
  |--------|-------------------------------------------|-------------------------------|---------------------------------------------------------------------|
  | GET    | /api/travel-content/languages             | Get supported languages       | [{ name: "English", code: "en" }, ...] (12 languages hardcoded)     |
  | GET    | /api/travel-content/categories            | Get categories for this token | [{ _id, name, slug, image }] (filtered by token's categories array) |
  | GET    | /api/travel-content/guides                | List travel guides            | Paginated guide list                                                |
  | GET    | /api/travel-content/guides/:guideId       | Get single guide details      | Full guide object with presigned image URLs                         |
  | GET    | /api/travel-content/guides/:guideId/headings | Get available headings for guide | Static heading array based on guide's category                   |

  /api/travel-content/guides Query Parameters:
  - category_id (optional) - Must be in token's allowed categories
  - lang (optional) - Filter by language code (en, ar, zh, etc.)
  - query (optional) - Search in guide name/description
  - page (optional, default: 1)
  - limit (optional, default: 20, max: 100)

  Response Structure (List):
  {
    "currentPage": 1,
    "pageSize": 20,
    "totalPages": 8,
    "totalBooks": 150,
    "books": [
      {
        "_id": "guide123",
        "name": "Amsterdam Travel Guide",
        "eng_name": "Amsterdam Travel Guide",
        "description": "...",
        "category": { "_id": "cat1", "name": "City Trips" },
        "city": "Amsterdam",
        "country": "Netherlands",
        "price": 9.99,
        "imagePath": "https://presigned-url...",
        "fullCover": "https://presigned-url...",
        "latitude": 52.3676,
        "longitude": 4.9041
      }
    ]
  }

  /api/travel-content/guides/:guideId Response Structure:
  {
    "success": true,
    "guide": {
      "_id": "guide123",
      "name": "Amsterdam Travel Guide",
      "eng_name": "Amsterdam Travel Guide",
      "description": "Complete travel guide for Amsterdam...",
      "eng_description": "Complete travel guide for Amsterdam...",
      "city": "Amsterdam",
      "country": "Netherlands",
      "address": "Amsterdam, Netherlands",
      "latitude": 52.3676,
      "longitude": 4.9041,
      "price": 9.99,
      "status": true,
      "category": {
        "_id": "cat1",
        "name": "City Trips",
        "slug": "city-trips",
        "description": "Urban exploration guides"
      },
      "lang": "English",
      "lang_short": "en",
      "imagePath": "https://presigned-url-for-thumbnail...",
      "fullCover": "https://presigned-url-for-full-cover...",
      "has_pdf": true,
      "has_json": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-02T00:00:00.000Z"
    }
  }

  Validation:
  - Token must be valid and not expired
  - Guide must exist (404 if not found)
  - Guide's category must be in token's allowed categories (403 if not allowed)

  /api/travel-content/guides/:guideId/headings Response:
  {
    "success": true,
    "guide_id": "guide123",
    "category_id": "672a73fc3ff8e4cf3ba9084a",
    "headings": [
      { "number": 1, "title": "Introduction" },
      { "number": 2, "title": "Navigation" },
      { "number": 3, "title": "Attractions & Activities" },
      { "number": 4, "title": "Day Trips" },
      { "number": 5, "title": "Practical Information" },
      { "number": 6, "title": "About the Author" }
    ]
  }

  2️⃣.1 Category Heading Reference

  Each category has a predefined set of main headings that can be used for filtering content:

  **City Guides** (672a73fc3ff8e4cf3ba9084a):
  1. Introduction
  2. Navigation
  3. Attractions & Activities
  4. Day Trips
  5. Practical Information
  6. About the Author

  **Country Guides** (672a73fd3ff8e4cf3ba9084f):
  1. Introduction
  2. Exploring Regions
  3. Culture and Traditions
  4. Cities and Landmarks
  5. Outdoor Adventures
  6. Hidden Gems
  7. Practical Travel Tips
  8. Special Interests
  9. About the Author

  **Camper Guides** (682f0cdcbbade38f87c5c1da):
  1. Introduction
  2. Preparing for Your Camper Adventure
  3. Road Regulations and Driving Tips
  4. Best Places for Camper Travel
  5. Top Campsites and Camper Stops
  6. Food and Culture for Campers
  7. Activities and Adventures
  8. Sustainability and Responsible Travel
  9. Troubleshooting and Safety
  10. Sample Itineraries
  11. About the Author

  **Island Guides** (682f0ce0bbade38f87c5c1dc):
  1. Introduction
  2. Getting There
  3. Accommodation Options
  4. Transportation
  5. Top Attractions
  6. Outdoor Activities and Adventures
  7. Dining and Cuisine
  8. Shopping and Markets
  9. Nightlife and Entertainment
  10. Health and Safety Tips
  11. Cultural Etiquette and Respect
  12. Essential Packing List
  13. Useful Contacts and Resources
  14. About the Author

  **Canal Guides** (682f0ce4bbade38f87c5c1de):
  1. Introduction
  2. Understanding Canal Boating
  3. Planning Your Canal Boat Adventure
  4. Navigating Waterways
  5. Exploring Iconic Canals
  6. Canal-Side Activities
  7. Practical Tips for Canal Boat Living
  8. Seasonal Canal Boating
  9. Troubleshooting and Maintenance
  10. About the Author

  **Cyclist Guides** (682f0ce9bbade38f87c5c1e0):
  1. Cycling Basics
  2. Planning Your Cycling Tour
  3. Top Cycling Routes
  4. Cycling in Cities
  5. Practical Information for Cyclists
  6. Cycling Culture and Etiquette
  7. Exploring Nature by Bike
  8. Cycling Events and Festivals
  9. Responsible Cycling and Sustainable Tourism
  10. About the Author

  **Regional Guides** (682f0ceebbade38f87c5c1e2):
  1. Introduction
  2. Planning Your Trip
  3. Major Destinations
  4. Off-the-Beaten-Path
  5. Outdoor Adventures
  6. Food and Drink
  7. Arts and Culture
  8. Practical Tips for Travelers
  9. Suggested Itineraries
  10. About the Author

  2️⃣.2 Client Usage Statistics API

  | Method | Endpoint                    | Purpose                              | Response                                              |
  |--------|-----------------------------|--------------------------------------|-------------------------------------------------------|
  | GET    | /api/travel-content/stats   | Get usage stats for current token    | Detailed statistics, graphs data, logs (see below)    |

  Authentication: Bearer Token
  Access: All valid tokens can view their own stats

  Response Structure:
  {
    "success": true,
    "data": {
      "token_info": {
        "name": "Client Name",
        "company_name": "Company Inc",
        "type": "pdf",
        "payment_type": "free",
        "is_active": true,
        "end_date": "2026-12-31T00:00:00.000Z",
        "allowed_categories": 5
      },
      "usage_summary": {
        "total_accesses": 150,
        "unique_guides_accessed": 45,
        "remaining_quota": 55,
        "date_range": {
          "first_access": "2025-01-01T10:00:00.000Z",
          "last_access": "2025-01-05T15:30:00.000Z"
        },
        "access_breakdown": {
          "pdf": 100,
          "html": 30,
          "json": 20
        }
      },
      "graphs": {
        "daily_usage": [
          { "date": "2025-01-01", "count": 10 },
          { "date": "2025-01-02", "count": 15 },
          ...
        ],
        "weekly_usage": [
          { "week": "2025-W01", "count": 50 },
          ...
        ],
        "monthly_usage": [
          { "month": "2025-01", "count": 150 },
          ...
        ],
        "category_breakdown": [
          { "category_id": "cat1", "category_name": "City Trips", "count": 80 },
          { "category_id": "cat2", "category_name": "Campers", "count": 70 }
        ],
        "access_type_breakdown": [
          { "type": "pdf", "count": 100 },
          { "type": "html", "count": 30 },
          { "type": "json", "count": 20 }
        ]
      },
      "top_guides": [
        {
          "guide_id": "guide123",
          "guide_name": "Amsterdam Guide",
          "city": "Amsterdam",
          "country": "Netherlands",
          "count": 25,
          "last_accessed": "2025-01-05T15:30:00.000Z",
          "access_types": ["pdf", "html"]
        }
      ],
      "recent_logs": [
        {
          "_id": "log123",
          "guide": {
            "_id": "guide123",
            "name": "Amsterdam Guide",
            "city": "Amsterdam",
            "country": "Netherlands"
          },
          "access_type": "pdf",
          "transaction_id": null,
          "created_at": "2025-01-05T15:30:00.000Z"
        }
      ]
    }
  }

  Graph Data Details:
  - daily_usage: Last 30 days
  - weekly_usage: Last 12 weeks
  - monthly_usage: Last 12 months
  - category_breakdown: Sorted by count (descending)
  - top_guides: Top 10 most accessed guides
  - recent_logs: Last 50 access entries

  ---
  3️⃣ PDF Content APIs (/api/travel-guides/pdf/content/*)

  Authentication: Bearer Token
  Required Token: type=pdf, payment_type=free
  Controller: travelContentController.js

  | Method | Endpoint                                | Purpose                    | Validation                                               |
  |--------|-----------------------------------------|----------------------------|----------------------------------------------------------|
  | GET    | /api/travel-guides/pdf/content/:guideId | Get PDF file or secure URL | Type=pdf, Payment=free, Category access, Quota available |

  Process Flow:
  1. Validate bearer token
  2. Validate apiAccess.type === 'pdf' (403 if not)
  3. Validate apiAccess.payment_type === 'free' (403 if not)
  4. Verify guide exists and category is allowed
  5. Check if guide already accessed (ApiAccessLog lookup)
  6. If first access:
    - Check allowed_travel_guides > 0 (403 if zero)
    - Deduct 1 from allowed_travel_guides
  7. Log access in ApiAccessLog
  8. Return PDF presigned URL or direct file

  Response:
  {
    "success": true,
    "guide": {
      "_id": "guide123",
      "name": "Amsterdam Guide",
      "language": "en"
    },
    "pdf_url": "https://wasabi.../presigned-url",
    "expires_in": 3600,
    "access_info": {
      "first_access": true,
      "remaining_quota": 99
    }
  }

  ---
  4️⃣ PDF Secure APIs (/api/travel-guides/pdf/secure/*)

  Authentication: Bearer Token
  Required Token: type=pdf, payment_type=paid
  Controller: travelContentController.js

  4.1 Generate Checkout Link

  | Method | Endpoint                               | Purpose                    |
  |--------|----------------------------------------|----------------------------|
  | POST   | /api/travel-guides/pdf/secure/checkout | Create Stripe payment link |

  Request Body:
  {
    "guide_id": "guide123"
  }

  Validation:
  1. Validate bearer token
  2. Validate apiAccess.type === 'pdf' (403 if not)
  3. Validate apiAccess.payment_type === 'paid' (403 if not)
  4. Verify guide exists and category allowed

  Process:
  1. Generate unique transaction_id (UUID)
  2. Fetch guide price from Book model
  3. Create ApiTransaction record (status: 'pending')
  4. Create Stripe checkout session with:
    - Line item: guide name + price
    - Success URL: http://appadmin.youguide.com/guide-success/pdf?guide_id={guide_id}&transaction_id={transaction_id}&token={bearer_token}
    - Cancel URL: http://appadmin.youguide.com/guide-cancel
    - Metadata: { transaction_id, api_access_id, guide_id, content_type: 'pdf', token: bearer_token }

  Response:
  {
    "success": true,
    "checkout_url": "https://checkout.stripe.com/...",
    "transaction_id": "uuid-here",
    "expires_in": 1800
  }

  4.2 Download PDF

  | Method | Endpoint                               | Purpose              |
  |--------|----------------------------------------|----------------------|
  | GET    | /api/travel-guides/pdf/secure/download | Access purchased PDF |

  Query Parameters:
  - transaction_id (required)
  - guide_id (required)

  Validation:
  1. Validate bearer token
  2. Validate apiAccess.type === 'pdf' (403 if not)
  3. Validate apiAccess.payment_type === 'paid' (403 if not)
  4. Fetch transaction by transaction_id
  5. Verify transaction.status === 'completed' (403 if not)
  6. Verify transaction.token === apiAccess.token (403 if mismatch)
  7. Verify transaction.travel_guide_id === guide_id (403 if mismatch)
  8. Verify transaction.content_type === 'pdf' (403 if mismatch)

  Process:
  1. Check if guide already logged (ApiAccessLog lookup by transaction_id)
  2. If first access after payment:
    - Check allowed_travel_guides > 0 (should always be true, but verify)
    - Deduct 1 from allowed_travel_guides
    - Log access in ApiAccessLog
  3. Return PDF presigned URL

  Response:
  {
    "success": true,
    "guide": {
      "_id": "guide123",
      "name": "Amsterdam Guide",
      "language": "en"
    },
    "pdf_url": "https://wasabi.../presigned-url",
    "expires_in": 3600,
    "transaction": {
      "transaction_id": "uuid",
      "paid_at": "2026-01-02T10:30:00Z",
      "amount": 9.99,
      "currency": "usd"
    }
  }

  ---
  5️⃣ Digital Content APIs (/api/travel-guides/digital/content/*)

  Authentication: Bearer Token
  Required Token: type=html_json, payment_type=free
  Controller: travelContentController.js

  5.1 Get JSON Data

  | Method | Endpoint                                         | Purpose        |
  |--------|--------------------------------------------------|----------------|
  | GET    | /api/travel-guides/digital/content/data/:guideId | Get guide JSON |

  Query Parameters:
  - headings (optional) - Comma-separated heading numbers to filter (e.g., "1,2,3")

  Validation:
  1. Validate bearer token
  2. Validate apiAccess.type === 'html_json' (403 if not)
  3. Validate apiAccess.payment_type === 'free' (403 if not)
  4. Verify guide category access
  5. Check quota (first access deducts)

  Process:
  1. Fetch JSON file from Wasabi/S3
  2. Parse JSON content
  3. Apply heading filter if provided (filters to selected sections only)
  4. Log access (type: 'json')
  5. Return parsed JSON

  Response:
  {
    "success": true,
    "guide": {
      "_id": "guide123",
      "name": "Amsterdam Guide",
      "language": "en"
    },
    "content": [...],  // Filtered content array
    "headings": [...], // Filtered headings array
    "access_info": {
      "first_access": true,
      "remaining_quota": 99
    }
  }

  Example with heading filter:
  GET /api/travel-guides/digital/content/data/guide123?headings=1,2,3
  Returns only sections 1 (Introduction), 2 (Navigation), and 3 (Attractions & Activities)

  5.2 View HTML

  | Method | Endpoint                                         | Purpose           |
  |--------|--------------------------------------------------|-------------------|
  | GET    | /api/travel-guides/digital/content/view/:guideId | Get rendered HTML |

  Query Parameters (optional):
  - title_color - Custom color for title (hex color)
  - table_of_content_color - Custom color for TOC (hex color)
  - heading_color - Custom color for main headings (hex color)
  - sub_heading_color - Custom color for subheadings (hex color)
  - title_size - Title font size (default: 24)
  - heading_size - Main heading font size (default: 21)
  - sub_heading_size - Subheading font size (default: 18)
  - paragraph_size - Paragraph font size (default: 16)
  - mode - Light or dark mode (default: light)
  - headings - Comma-separated heading numbers to filter (e.g., "1,2,3")

  Validation:
  1. Validate bearer token
  2. Validate apiAccess.type === 'html_json' (403 if not)
  3. Validate apiAccess.payment_type === 'free' (403 if not)
  4. Verify guide category access
  5. Check quota (first access deducts)

  Process:
  1. Fetch JSON file from Wasabi/S3
  2. Parse JSON content
  3. Apply heading filter if provided (filters to selected sections only)
  4. Render HTML using reference.html template with customizations:
    - Apply heading styles
    - Apply color scheme (light/dark mode)
    - Inject guide content sections
  5. Log access (type: 'html')
  6. Return HTML (Content-Type: text/html)

  Response: Full HTML page (similar to reference.html structure)

  Example with heading filter:
  GET /api/travel-guides/digital/content/view/guide123?headings=1,3,5&mode=dark
  Returns HTML with only sections 1, 3, and 5 rendered in dark mode

  ---
  6️⃣ Digital Secure APIs (/api/travel-guides/digital/secure/*)

  Authentication: Bearer Token
  Required Token: type=html_json, payment_type=paid
  Controller: travelContentController.js

  6.1 Generate Checkout Link

  | Method | Endpoint                                   | Purpose                    |
  |--------|--------------------------------------------|----------------------------|
  | POST   | /api/travel-guides/digital/secure/checkout | Create Stripe payment link |

  Request Body:
  {
    "guide_id": "guide123",
    "content_type": "html" // or "json"
  }

  Validation:
  1. Validate bearer token
  2. Validate apiAccess.type === 'html_json' (403 if not)
  3. Validate apiAccess.payment_type === 'paid' (403 if not)
  4. Verify content_type is 'html' or 'json'
  5. Verify guide exists and category allowed

  Process:
  1. Generate unique transaction_id
  2. Fetch guide price
  3. Create ApiTransaction record (content_type: html/json, status: 'pending')
  4. Create Stripe checkout session with:
    - Success URL: http://appadmin.youguide.com/guide-success/{content_type}?guide_id={guide_id}&transaction_id={transaction_id}&token={bearer_token}
    - Metadata: { transaction_id, api_access_id, guide_id, content_type, token: bearer_token }

  Response:
  {
    "success": true,
    "checkout_url": "https://checkout.stripe.com/...",
    "transaction_id": "uuid-here",
    "content_type": "html",
    "expires_in": 1800
  }

  6.2 Get JSON Data (Paid)

  | Method | Endpoint                               | Purpose               |
  |--------|----------------------------------------|-----------------------|
  | GET    | /api/travel-guides/digital/secure/data | Access purchased JSON |

  Query Parameters:
  - transaction_id (required)
  - guide_id (required)
  - headings (optional) - Comma-separated heading numbers to filter (e.g., "1,2,3")

  Validation:
  1. Validate bearer token
  2. Validate apiAccess.type === 'html_json' (403 if not)
  3. Validate apiAccess.payment_type === 'paid' (403 if not)
  4. Fetch transaction by transaction_id
  5. Verify transaction.status === 'completed'
  6. Verify transaction.token === apiAccess.token
  7. Verify transaction.travel_guide_id === guide_id
  8. Verify transaction.content_type === 'json' OR 'digital' (403 if mismatch)

  Process:
  1. Fetch JSON file
  2. Parse content
  3. Apply heading filter if provided (filters to selected sections only)
  4. Log access if first time
  5. Deduct quota if first access
  6. Return JSON

  Response:
  {
    "success": true,
    "guide": {
      "_id": "guide123",
      "name": "Amsterdam Guide",
      "lang": "en"
    },
    "content": [...],  // Filtered content array
    "headings": [...], // Filtered headings array (if headings param used)
    "transaction": {
      "transaction_id": "uuid",
      "paid_at": "2026-01-02T10:30:00Z",
      "amount": 9.99,
      "currency": "usd"
    }
  }

  Example with heading filter:
  GET /api/travel-guides/digital/secure/data?transaction_id=abc123&guide_id=guide123&headings=1,5,6
  Returns only sections 1, 5, and 6

  6.3 View HTML (Paid)

  | Method | Endpoint                               | Purpose               |
  |--------|----------------------------------------|-----------------------|
  | GET    | /api/travel-guides/digital/secure/view | Access purchased HTML |

  Query Parameters:
  - transaction_id (required)
  - guide_id (required)
  - title_color (optional) - Custom color for title (hex color)
  - table_of_content_color (optional) - Custom color for TOC (hex color)
  - heading_color (optional) - Custom color for main headings (hex color)
  - sub_heading_color (optional) - Custom color for subheadings (hex color)
  - title_size (optional) - Title font size (default: 24)
  - heading_size (optional) - Main heading font size (default: 21)
  - sub_heading_size (optional) - Subheading font size (default: 18)
  - paragraph_size (optional) - Paragraph font size (default: 16)
  - mode (optional) - Light or dark mode (default: light)
  - headings (optional) - Comma-separated heading numbers to filter (e.g., "1,2,3")

  Validation:
  1. Validate bearer token
  2. Validate apiAccess.type === 'html_json' (403 if not)
  3. Validate apiAccess.payment_type === 'paid' (403 if not)
  4. Fetch transaction
  5. Verify transaction status, ownership, guide match
  6. Verify transaction.content_type === 'html' OR 'digital' (403 if mismatch)

  Process:
  1. Fetch JSON file
  2. Apply heading filter if provided (filters to selected sections only)
  3. Render HTML with customizations (like 5.2)
  4. Log access if first time
  5. Deduct quota if first access
  6. Return HTML

  Response: Full HTML page with styling applied

  Example with heading filter:
  GET /api/travel-guides/digital/secure/view?transaction_id=abc123&guide_id=guide123&headings=2,3,4&mode=light
  Returns HTML with only sections 2, 3, and 4 rendered in light mode

  ---
  ⚠️ Success URL Parameters

  All Stripe checkout success URLs include these query parameters for client verification:

  | Parameter       | Description                                | Example                                      |
  |-----------------|-----------------------------------------------|----------------------------------------------|
  | guide_id        | MongoDB ObjectId of the purchased guide      | 677abc123def456789012345                     |
  | transaction_id  | Unique UUID for this transaction             | 550e8400-e29b-41d4-a716-446655440000         |
  | token           | Bearer token (URL encoded)                   | tok_abc123def456...                          |

  Success URL Format:
  - PDF: `http://appadmin.youguide.com/guide-success/pdf?guide_id={guide_id}&transaction_id={transaction_id}&token={bearer_token}`
  - HTML: `http://appadmin.youguide.com/guide-success/html?guide_id={guide_id}&transaction_id={transaction_id}&token={bearer_token}`
  - JSON: `http://appadmin.youguide.com/guide-success/json?guide_id={guide_id}&transaction_id={transaction_id}&token={bearer_token}`

  Client Usage:
  After successful payment, the client receives these parameters and can:
  1. Use the `transaction_id` and `token` to download/access the content
  2. Call the appropriate `/secure/download`, `/secure/data`, or `/secure/view` endpoint
  3. Verify the purchase was successful

  ---
  7️⃣ Stripe Webhook

  No authentication (Stripe signature verification)

  | Method | Endpoint            | Purpose                      |
  |--------|---------------------|------------------------------|
  | POST   | /webhook/api-access | Handle Stripe payment events |

  Handled Events:
  - checkout.session.completed

  Process:
  1. Verify Stripe signature
  2. Extract transaction_id from metadata
  3. Fetch ApiTransaction by transaction_id
  4. Update transaction:
    - status = 'completed'
    - stripe_payment_intent_id = session.payment_intent
    - paid_at = new Date()
  5. (Optional) Send email confirmation to client

  ---
  🔐 Security & Validation Matrix

  Token Type Enforcement

  | Token Type     | Allowed Endpoints            | Blocked Endpoints                            |
  |----------------|------------------------------|----------------------------------------------|
  | type=pdf       | /api/travel-guides/pdf/*     | /api/travel-guides/digital/* (403 Forbidden) |
  | type=html_json | /api/travel-guides/digital/* | /api/travel-guides/pdf/* (403 Forbidden)     |

  Payment Type Enforcement

  | Payment Type      | Allowed Endpoints | Blocked Endpoints           |
  |-------------------|-------------------|-----------------------------|
  | payment_type=free | */content/*       | */secure/* (403 Forbidden)  |
  | payment_type=paid | */secure/*        | */content/* (403 Forbidden) |

  Combined Enforcement Examples

  | Token Config     | Valid Endpoint                       | Invalid Endpoints (403)    |
  |------------------|--------------------------------------|----------------------------|
  | pdf + free       | /api/travel-guides/pdf/content/:id   | /pdf/secure/*, /digital/*  |
  | pdf + paid       | /api/travel-guides/pdf/secure/*      | /pdf/content/*, /digital/* |
  | html_json + free | /api/travel-guides/digital/content/* | /digital/secure/*, /pdf/*  |
  | html_json + paid | /api/travel-guides/digital/secure/*  | /digital/content/*, /pdf/* |

  Content Type Enforcement (Paid Only)

  For paid transactions, the content_type in ApiTransaction must match:

  | Purchased Type    | Can Access           | Cannot Access               |
  |-------------------|----------------------|-----------------------------|
  | content_type=pdf  | /pdf/secure/download | N/A (only one PDF endpoint) |
  | content_type=html | /digital/secure/view | /digital/secure/data (403)  |
  | content_type=json | /digital/secure/data | /digital/secure/view (403)  |

  Example Error: User buys HTML access but tries to get JSON:
  {
    "error": "Content type mismatch",
    "message": "This transaction is for HTML access only. You purchased 'html' but are trying to access 'json'.",
    "purchased_type": "html",
    "requested_type": "json"
  }

  ---
  📊 Complete API Summary Table

  | Category        | Endpoint                                         | Method | Token Requirements      | Description         |
  |-----------------|--------------------------------------------------|--------|-------------------------|---------------------|
  | Admin           | /api/api-access                                  | GET    | JWT Admin               | List tokens         |
  |                 | /api/api-access                                  | POST   | JWT Admin               | Create token        |
  |                 | /api/api-access/:id                              | GET    | JWT Admin               | Get token details   |
  |                 | /api/api-access/:id                              | PUT    | JWT Admin               | Update token        |
  |                 | /api/api-access/:id                              | DELETE | JWT Admin               | Delete token        |
  |                 | /api/api-access/:id/logs                         | GET    | JWT Admin               | View logs           |
  |                 | /api/api-access/:id/stats                        | GET    | JWT Admin               | Usage stats         |
  | Common          | /api/travel-content/languages                    | GET    | Bearer (any)            | List languages      |
  |                 | /api/travel-content/categories                   | GET    | Bearer (any)            | List categories     |
  |                 | /api/travel-content/guides                       | GET    | Bearer (any)            | List guides         |
  |                 | /api/travel-content/guides/:guideId              | GET    | Bearer (any)            | Get guide details   |
  |                 | /api/travel-content/guides/:guideId/headings     | GET    | Bearer (any)            | Get guide headings  |
  |                 | /api/travel-content/stats                        | GET    | Bearer (any)            | Client usage stats  |
  | PDF Content     | /api/travel-guides/pdf/content/:guideId          | GET    | Bearer (pdf+free)       | Get PDF             |
  | PDF Secure      | /api/travel-guides/pdf/secure/checkout           | POST   | Bearer (pdf+paid)       | Create checkout     |
  |                 | /api/travel-guides/pdf/secure/download           | GET    | Bearer (pdf+paid)       | Download PDF        |
  | Digital Content | /api/travel-guides/digital/content/data/:guideId | GET    | Bearer (html_json+free) | Get JSON            |
  |                 | /api/travel-guides/digital/content/view/:guideId | GET    | Bearer (html_json+free) | View HTML           |
  | Digital Secure  | /api/travel-guides/digital/secure/checkout       | POST   | Bearer (html_json+paid) | Create checkout     |
  |                 | /api/travel-guides/digital/secure/data           | GET    | Bearer (html_json+paid) | Get JSON            |
  |                 | /api/travel-guides/digital/secure/view           | GET    | Bearer (html_json+paid) | View HTML           |
  | Webhook         | /webhook/api-access                              | POST   | Stripe signature        | Payment complete    |
  | Request Form    | /api/request                                     | POST   | Public (no auth)        | Submit request form |
  | Request Admin   | /api/requests/admin/list                         | GET    | JWT Admin               | List all requests   |
  |                 | /api/requests/admin/:id                          | GET    | JWT Admin               | Get request details |
  |                 | /api/requests/admin/:id                          | PUT    | JWT Admin               | Update request      |
  |                 | /api/requests/admin/:id                          | DELETE | JWT Admin               | Delete request      |
  | Contact Form    | /api/contact                                     | POST   | Public (no auth)        | Submit contact form |
  | Contact Admin   | /api/contact/admin/list                          | GET    | JWT Admin               | List all contacts   |
  |                 | /api/contact/admin/:id                           | GET    | JWT Admin               | Get contact details |
  |                 | /api/contact/admin/:id                           | PUT    | JWT Admin               | Update contact      |
  |                 | /api/contact/admin/:id                           | DELETE | JWT Admin               | Delete contact      |

  Total: 31 endpoints (11 admin + 6 common + 8 client-facing + 2 public + 4 request admin + 4 contact admin)

  ---
  8️⃣ Request Form API

  8.1 Public Request Form Submission

  No authentication required

  | Method | Endpoint      | Purpose                            |
  |--------|---------------|------------------------------------|
  | POST   | /api/request  | Submit request form from admin portal |

  Request Body:
  {
    "full_name": "John Doe",              // Required
    "company_name": "Tech Corp",          // Optional
    "email_address": "john@example.com",  // Required (validated)
    "phone_no": "+1234567890",            // Optional
    "interested_id": "API Access",        // Optional (text field for interest area)
    "additional_information": "..."       // Optional (free text)
  }

  Process:
  1. Validates full_name and email_address (required fields)
  2. Validates email format
  3. Saves request to database (Request collection)
  4. Creates formatted HTML email template
  5. Sends email:
     - TO: Affiliates@youguide.com
     - CC: msuleman526@gmail.com
     - Subject: "Request from Youguide Admin Portal"
     - Reply-To: customer's email for easy response
  6. Returns success with request_id

  Response (Success):
  {
    "success": true,
    "message": "Request form submitted successfully. We will get back to you soon!",
    "data": {
      "request_id": "request_id_here"
    }
  }

  Response (Validation Error):
  {
    "success": false,
    "error": "Validation error",
    "message": "Full name and email address are required fields"
  }

  Response (Server Error):
  {
    "success": false,
    "error": "Server error",
    "message": "Failed to submit request form. Please try again later."
  }

  Email Template Features:
  - Professional gradient header with YouGuide branding
  - Organized request information in a table format
  - Separate section for additional information (if provided)
  - Direct "Reply to Request" button
  - Timestamp of submission
  - Responsive HTML design

  8.2 Admin Request Management APIs

  Authentication: JWT (Admin)

  | Method | Endpoint                   | Purpose                      | Request/Query                                            |
  |--------|----------------------------|------------------------------|----------------------------------------------------------|
  | GET    | /api/requests/admin/list   | List all requests with stats | Query: page, limit, status, is_read, search              |
  | GET    | /api/requests/admin/:id    | Get single request details   | -                                                        |
  | PUT    | /api/requests/admin/:id    | Update request status/notes  | Body: { status?, notes?, is_read? }                      |
  | DELETE | /api/requests/admin/:id    | Delete request               | -                                                        |

  Request Model Fields:
  - full_name (String, required)
  - company_name (String, optional)
  - email_address (String, required)
  - phone_no (String, optional)
  - interested_id (String, optional)
  - additional_information (String, optional)
  - status (Enum: 'new', 'contacted', 'in_progress', 'resolved', 'closed', default: 'new')
  - notes (String, optional) - Admin notes
  - is_read (Boolean, default: false)
  - createdAt, updatedAt (timestamps)

  GET /api/requests/admin/list Response:
  {
    "success": true,
    "data": [
      {
        "_id": "request_id",
        "full_name": "John Doe",
        "company_name": "Tech Corp",
        "email_address": "john@example.com",
        "phone_no": "+1234567890",
        "interested_id": "API Access",
        "additional_information": "Need info about pricing",
        "status": "new",
        "notes": null,
        "is_read": false,
        "createdAt": "2026-01-05T10:00:00.000Z",
        "updatedAt": "2026-01-05T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    },
    "stats": {
      "total": 150,
      "unread": 45,
      "new": 30,
      "in_progress": 20,
      "resolved": 100
    }
  }

  Query Parameters for List:
  - page (optional, default: 1)
  - limit (optional, default: 20)
  - status (optional) - Filter by status: 'new', 'contacted', 'in_progress', 'resolved', 'closed'
  - is_read (optional) - Filter by read status: 'true' or 'false'
  - search (optional) - Search in full_name, company_name, email_address, phone_no

  PUT /api/requests/admin/:id Request Body:
  {
    "status": "in_progress",     // Optional: 'new', 'contacted', 'in_progress', 'resolved', 'closed'
    "notes": "Called customer",  // Optional: Admin notes
    "is_read": true              // Optional: Mark as read/unread
  }

  ---
  9️⃣ Contact Form API (Simple)

  9.1 Public Contact Form Submission

  No authentication required

  | Method | Endpoint      | Purpose                                     |
  |--------|---------------|---------------------------------------------|
  | POST   | /api/contact  | Submit simple contact form from admin portal |

  Request Body:
  {
    "name": "John Doe",                   // Required
    "email": "john@example.com",          // Required (validated)
    "phone": "+1234567890",               // Optional
    "message": "I need help with..."      // Required
  }

  Process:
  1. Validates name, email, and message (required fields)
  2. Validates email format
  3. Saves contact to database (Contact collection)
  4. Creates formatted HTML email template
  5. Sends email:
     - TO: Affiliates@youguide.com
     - CC: msuleman526@gmail.com
     - Subject: "New Contact from Youguide Admin Portal"
     - Reply-To: customer's email for easy response
  6. Returns success with contact_id

  Response (Success):
  {
    "success": true,
    "message": "Contact form submitted successfully. We will get back to you soon!",
    "data": {
      "contact_id": "contact_id_here"
    }
  }

  Response (Validation Error):
  {
    "success": false,
    "error": "Validation error",
    "message": "Name, email, and message are required fields"
  }

  Response (Server Error):
  {
    "success": false,
    "error": "Server error",
    "message": "Failed to submit contact form. Please try again later."
  }

  Email Template Features:
  - Professional gradient header with YouGuide branding
  - Contact information in a table format
  - Message section with proper formatting
  - Direct "Reply to Contact" button
  - Timestamp of submission
  - Responsive HTML design

  9.2 Admin Contact Management APIs

  Authentication: JWT (Admin)

  | Method | Endpoint                  | Purpose                      | Request/Query                                            |
  |--------|---------------------------|------------------------------|----------------------------------------------------------|
  | GET    | /api/contact/admin/list   | List all contacts with stats | Query: page, limit, status, is_read, search              |
  | GET    | /api/contact/admin/:id    | Get single contact details   | -                                                        |
  | PUT    | /api/contact/admin/:id    | Update contact status/notes  | Body: { status?, notes?, is_read? }                      |
  | DELETE | /api/contact/admin/:id    | Delete contact               | -                                                        |

  Contact Model Fields:
  - name (String, required)
  - email (String, required)
  - phone (String, optional)
  - message (String, required)
  - status (Enum: 'new', 'contacted', 'in_progress', 'resolved', 'closed', default: 'new')
  - notes (String, optional) - Admin notes
  - is_read (Boolean, default: false)
  - createdAt, updatedAt (timestamps)

  GET /api/contact/admin/list Response:
  {
    "success": true,
    "data": [
      {
        "_id": "contact_id",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "message": "I need help with...",
        "status": "new",
        "notes": null,
        "is_read": false,
        "createdAt": "2026-01-05T10:00:00.000Z",
        "updatedAt": "2026-01-05T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    },
    "stats": {
      "total": 150,
      "unread": 45,
      "new": 30,
      "in_progress": 20,
      "resolved": 100
    }
  }

  Query Parameters for List:
  - page (optional, default: 1)
  - limit (optional, default: 20)
  - status (optional) - Filter by status: 'new', 'contacted', 'in_progress', 'resolved', 'closed'
  - is_read (optional) - Filter by read status: 'true' or 'false'
  - search (optional) - Search in name, email, phone

  PUT /api/contact/admin/:id Request Body:
  {
    "status": "in_progress",     // Optional: 'new', 'contacted', 'in_progress', 'resolved', 'closed'
    "notes": "Called customer",  // Optional: Admin notes
    "is_read": true              // Optional: Mark as read/unread
  }

  ---
  🎨 HTML Rendering from JSON

  The HTML rendering will follow the reference.html structure with these features:

  Template Structure

  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{guide.name}</title>
    <style>
      /* Base styles */
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: {mode === 'dark' ? '#1a1a1a' : '#ffffff'};
        color: {mode === 'dark' ? '#e0e0e0' : '#333333'};
      }
      h1 {
        font-size: {heading_font_size}px;
        color: {heading_color};
      }
      h2 {
        font-size: {sub_heading_font_size}px;
      }
      /* Responsive styles, sections, images, etc. */
    </style>
  </head>
  <body>
    <header>
      <h1>{guide.name}</h1>
      <p>{guide.description}</p>
    </header>

    <main>
      {/* Render JSON sections dynamically */}
      {json.sections.map(section => `
        <section>
          <h2>${section.title}</h2>
          <p>${section.content}</p>
          ${section.images ? renderImages(section.images) : ''}
        </section>
      `)}
    </main>

    <footer>
      <p>Generated by YouGuide API</p>
    </footer>
  </body>
  </html>

  Customization Parameters

  - heading_font_size: 16-48px (default: 24)
  - heading_color: Any hex color (default: #333333 or #e0e0e0 for dark)
  - sub_heading_font_size: 14-36px (default: 18)
  - mode: 'light' or 'dark' (switches background, text colors, borders)

  Dark Mode Colors

  - Background: #1a1a1a
  - Text: #e0e0e0
  - Headings: #ffffff
  - Borders: #444444

  Light Mode Colors

  - Background: #ffffff
  - Text: #333333
  - Headings: Custom or default
  - Borders: #e0e0e0

  ---
  🚀 Implementation Order

  1. Models (ApiAccess, ApiAccessLog, ApiTransaction)
  2. Middleware (authenticateBearerToken)
  3. Services (apiAccessService with all validation logic)
  4. Controllers (apiAccessController, travelContentController)
  5. Routes (apiAccess.js, travelContent.js)
  6. Webhook (Update existing webhook handler or create new)
  7. Testing (Postman collection for all 18 endpoints)

  ---
  ✅ Error Response Standards

  All errors will follow consistent format:

  {
    "success": false,
    "error": "Error Type",
    "message": "Human-readable message",
    "code": "ERROR_CODE",
    "details": {} // Optional
  }

  Common Error Codes:
  - TOKEN_INVALID - Bearer token not found
  - TOKEN_EXPIRED - Token past end_date
  - TYPE_MISMATCH - Wrong content type for token
  - PAYMENT_TYPE_MISMATCH - Wrong payment model for endpoint
  - CATEGORY_FORBIDDEN - Guide not in allowed categories
  - QUOTA_EXCEEDED - No remaining guide quota
  - TRANSACTION_NOT_FOUND - Invalid transaction_id
  - TRANSACTION_INCOMPLETE - Payment not completed
  - TRANSACTION_MISMATCH - Transaction doesn't match guide/token
  - CONTENT_TYPE_MISMATCH - Bought HTML trying to access JSON (or vice versa)