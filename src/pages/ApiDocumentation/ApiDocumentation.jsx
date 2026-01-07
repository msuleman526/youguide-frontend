import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Card, Tag, Divider, Space, Button, Drawer } from 'antd';
import {
  ApiOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  CodeOutlined,
  DollarOutlined,
  FreeOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import './ApiDocumentation.css';

const { Sider, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const ApiDocumentation = () => {
  const [selectedSection, setSelectedSection] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const [previewDrawerVisible, setPreviewDrawerVisible] = useState(false);
  const [currentPreviewHtml, setCurrentPreviewHtml] = useState('');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileDrawerVisible(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const BASE_URL = 'https://appapi.youguide.com';

  const menuItems = [
    {
      key: 'overview',
      icon: <FileTextOutlined />,
      label: 'Overview',
    },
    {
      key: 'heading-reference',
      icon: <FileTextOutlined />,
      label: 'Heading Reference',
    },
    {
      key: 'pdf-free',
      icon: <FilePdfOutlined />,
      label: 'PDF Prepaid API',
    },
    {
      key: 'pdf-paid',
      icon: <DollarOutlined />,
      label: 'PDF Paid API',
    },
    {
      key: 'html-json-free',
      icon: <CodeOutlined />,
      label: 'HTML/JSON Prepaid API',
    },
    {
      key: 'html-json-paid',
      icon: <ApiOutlined />,
      label: 'HTML/JSON Paid API',
    },
    {
      key: 'code-snippets',
      icon: <CodeOutlined />,
      label: 'Code Snippets',
      children: [
        {
          key: 'snippet-pdf-prepaid',
          label: 'PDF Prepaid',
          icon: <FilePdfOutlined />,
        },
        {
          key: 'snippet-pdf-paid',
          label: 'PDF Paid',
          icon: <DollarOutlined />,
        },
        {
          key: 'snippet-html-prepaid',
          label: 'HTML/JSON Prepaid',
          icon: <CodeOutlined />,
        },
        {
          key: 'snippet-html-paid',
          label: 'HTML/JSON Paid',
          icon: <ApiOutlined />,
        },
      ],
    },
  ];

  const handleMenuClick = ({ key }) => {
    setSelectedSection(key);
    if (isMobile) {
      setMobileDrawerVisible(false);
    }
  };

  const renderApiEndpoint = (method, endpoint, description, params = [], response = '') => (
    <Card className="api-card" style={{ marginBottom: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div className="api-header">
          <Tag color={method === 'GET' ? 'blue' : 'green'}>{method}</Tag>
          <Text strong style={{ fontSize: 16 }}>{endpoint}</Text>
        </div>
        <Paragraph>{description}</Paragraph>

        {params.length > 0 && (
          <>
            <Text strong>Parameters:</Text>
            <ul>
              {params.map((param, idx) => (
                <li key={idx}>
                  <Text code>{param.name}</Text> - {param.description}
                  {param.required && <Tag color="red" style={{ marginLeft: 8 }}>Required</Tag>}
                </li>
              ))}
            </ul>
          </>
        )}

        <Text strong>Full URL:</Text>
        <div className="code-block">
          <code>{BASE_URL}{endpoint}</code>
        </div>

        {response && (
          <>
            <Text strong>Example Response:</Text>
            <div className="code-block">
              <pre>{response}</pre>
            </div>
          </>
        )}
      </Space>
    </Card>
  );

  const renderHeadingReference = () => (
    <div>
      <Title level={2}>Category Heading Reference</Title>
      <Paragraph>
        Each category has a predefined set of main headings that can be used for filtering content using the <Text code>headings</Text> parameter.
        Use comma-separated heading numbers (e.g., <Text code>headings=2,3,4</Text>) to filter content by specific sections.
      </Paragraph>

      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>City Guides (672a73fc3ff8e4cf3ba9084a)</Title>
        <ol>
          <li>Introduction</li>
          <li>Navigation</li>
          <li>Attractions & Activities</li>
          <li>Day Trips</li>
          <li>Practical Information</li>
          <li>About the Author</li>
        </ol>
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>Country Guides (672a73fd3ff8e4cf3ba9084f)</Title>
        <ol>
          <li>Introduction</li>
          <li>Exploring Regions</li>
          <li>Culture and Traditions</li>
          <li>Cities and Landmarks</li>
          <li>Outdoor Adventures</li>
          <li>Hidden Gems</li>
          <li>Practical Travel Tips</li>
          <li>Special Interests</li>
          <li>About the Author</li>
        </ol>
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>Camper Guides (682f0cdcbbade38f87c5c1da)</Title>
        <ol>
          <li>Introduction</li>
          <li>Preparing for Your Camper Adventure</li>
          <li>Road Regulations and Driving Tips</li>
          <li>Best Places for Camper Travel</li>
          <li>Top Campsites and Camper Stops</li>
          <li>Food and Culture for Campers</li>
          <li>Activities and Adventures</li>
          <li>Sustainability and Responsible Travel</li>
          <li>Troubleshooting and Safety</li>
          <li>Sample Itineraries</li>
          <li>About the Author</li>
        </ol>
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>Island Guides (682f0ce0bbade38f87c5c1dc)</Title>
        <ol>
          <li>Introduction</li>
          <li>Getting There</li>
          <li>Accommodation Options</li>
          <li>Transportation</li>
          <li>Top Attractions</li>
          <li>Outdoor Activities and Adventures</li>
          <li>Dining and Cuisine</li>
          <li>Shopping and Markets</li>
          <li>Nightlife and Entertainment</li>
          <li>Health and Safety Tips</li>
          <li>Cultural Etiquette and Respect</li>
          <li>Essential Packing List</li>
          <li>Useful Contacts and Resources</li>
          <li>About the Author</li>
        </ol>
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>Canal Guides (682f0ce4bbade38f87c5c1de)</Title>
        <ol>
          <li>Introduction</li>
          <li>Understanding Canal Boating</li>
          <li>Planning Your Canal Boat Adventure</li>
          <li>Navigating Waterways</li>
          <li>Exploring Iconic Canals</li>
          <li>Canal-Side Activities</li>
          <li>Practical Tips for Canal Boat Living</li>
          <li>Seasonal Canal Boating</li>
          <li>Troubleshooting and Maintenance</li>
          <li>About the Author</li>
        </ol>
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>Cyclist Guides (682f0ce9bbade38f87c5c1e0)</Title>
        <ol>
          <li>Cycling Basics</li>
          <li>Planning Your Cycling Tour</li>
          <li>Top Cycling Routes</li>
          <li>Cycling in Cities</li>
          <li>Practical Information for Cyclists</li>
          <li>Cycling Culture and Etiquette</li>
          <li>Exploring Nature by Bike</li>
          <li>Cycling Events and Festivals</li>
          <li>Responsible Cycling and Sustainable Tourism</li>
          <li>About the Author</li>
        </ol>
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>Regional Guides (682f0ceebbade38f87c5c1e2)</Title>
        <ol>
          <li>Introduction</li>
          <li>Planning Your Trip</li>
          <li>Major Destinations</li>
          <li>Off-the-Beaten-Path</li>
          <li>Outdoor Adventures</li>
          <li>Food and Drink</li>
          <li>Arts and Culture</li>
          <li>Practical Tips for Travelers</li>
          <li>Suggested Itineraries</li>
          <li>About the Author</li>
        </ol>
      </Card>
    </div>
  );

  const renderOverview = () => (
    <div>
      <Title level={2}>API Overview</Title>
      <Paragraph>
        Welcome to the YouGuide B2B API documentation. This API system allows external clients
        to access YouGuide's travel guides programmatically with strict type and payment enforcement.
      </Paragraph>

      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>Authentication</Title>
        <Paragraph>
          All API requests require Bearer token authentication. Include your token in the request header:
        </Paragraph>
        <div className="code-block">
          <code>Authorization: Bearer YOUR_TOKEN_HERE</code>
        </div>
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>Token Types</Title>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div>
            <Tag color="blue">PDF Tokens</Tag>
            <Text>Access only PDF endpoints (/api/travel-guides/pdf/*)</Text>
          </div>
          <div>
            <Tag color="green">HTML/JSON Tokens</Tag>
            <Text>Access only digital content endpoints (/api/travel-guides/digital/*)</Text>
          </div>
        </Space>
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>Payment Types</Title>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div>
            <Tag color="cyan">Prepaid Tokens</Tag>
            <Text>Access /content/* endpoints with prepaid quota</Text>
          </div>
          <div>
            <Tag color="orange">Paid Tokens</Tag>
            <Text>Access /secure/* endpoints with pay-per-guide via Stripe</Text>
          </div>
        </Space>
      </Card>

      <Card>
        <Title level={4}>Business Flow</Title>
        <Paragraph><strong>For Prepaid Access (payment_type=free):</strong></Paragraph>
        <ol>
          <li>Admin creates token with prepaid quota (e.g., 100 guides)</li>
          <li>Client uses token to access guides directly via /content endpoints</li>
          <li>System validates: token type, payment type, category, quota</li>
          <li>First access deducts quota, subsequent access to same guide = free</li>
        </ol>

        <Paragraph><strong>For Paid Access (payment_type=paid):</strong></Paragraph>
        <ol>
          <li>Client requests checkout link via /secure/checkout</li>
          <li>System generates Stripe session with unique transaction_id</li>
          <li>Client completes payment, redirected to success page</li>
          <li>Client accesses content via /secure/* endpoints with transaction_id</li>
          <li>System validates payment success, ownership, and guide match</li>
        </ol>
      </Card>
    </div>
  );

  const renderPdfFreeApis = () => (
    <div>
      <Title level={2}>PDF Prepaid API</Title>
      <Paragraph>
        These endpoints are for tokens with <Tag color="blue">type=pdf</Tag> and <Tag color="cyan">payment_type=free</Tag>
      </Paragraph>

      <Divider orientation="left">Common Endpoints</Divider>

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/languages',
        'Get list of supported languages for travel guides',
        [],
        `[
  { "name": "English", "code": "en" },
  { "name": "Arabic", "code": "ar" },
  { "name": "Chinese", "code": "zh" }
]`
      )}

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/categories',
        'Get categories allowed for your token',
        [],
        `[
  {
    "_id": "cat1",
    "name": "City Trips",
    "slug": "city-trips",
    "image": "https://presigned-url..."
  }
]`
      )}

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/guides',
        'List all available travel guides with pagination',
        [
          { name: 'category_id', description: 'Filter by category (must be in allowed categories)', required: false },
          { name: 'lang', description: 'Filter by language code (en, ar, zh, etc.)', required: false },
          { name: 'query', description: 'Search in guide name/description', required: false },
          { name: 'page', description: 'Page number (default: 1)', required: false },
          { name: 'limit', description: 'Items per page (default: 20, max: 100)', required: false },
        ],
        `{
  "currentPage": 1,
  "pageSize": 20,
  "totalPages": 8,
  "totalBooks": 150,
  "books": [
    {
      "_id": "guide123",
      "name": "Amsterdam Travel Guide",
      "description": "Discover the vibrant capital of Netherlands with this comprehensive travel guide. Explore historic canals, world-class museums, charming neighborhoods, and the unique Dutch culture.",
      "category": { "_id": "cat1", "name": "City Trips" },
      "city": "Amsterdam",
      "country": "Netherlands",
      "price": 9.99,
      "imagePath": "https://presigned-url..."
    }
  ]
}`
      )}

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/guides/:guideId',
        'Get detailed information about a specific travel guide',
        [
          { name: 'guideId', description: 'The MongoDB ObjectId of the guide', required: true },
        ],
        `{
  "success": true,
  "guide": {
    "_id": "672a73fc3ff8e4cf3ba9084a",
    "name": "Amsterdam Travel Guide",
    "description": "Discover the vibrant capital of Netherlands with this comprehensive travel guide. Explore historic canals, world-class museums, charming neighborhoods, and the unique Dutch culture.",
    "city": "Amsterdam",
    "country": "Netherlands",
    "price": 12.99,
    "category": {
      "_id": "672a73fc3ff8e4cf3ba9084a",
      "name": "City Trips",
      "slug": "city-trips"
    },
    "lang": "English",
    "lang_short": "en",
    "has_pdf": true,
    "has_json": true,
    "imagePath": "https://s3.wasabisys.com/youguide/covers/amsterdam-cover.jpg",
    "pages": 156,
    "createdAt": "2024-11-05T10:30:00.000Z",
    "updatedAt": "2025-01-05T14:22:00.000Z"
  }
}`
      )}

      <Divider orientation="left">PDF Content Endpoint</Divider>

      {renderApiEndpoint(
        'GET',
        '/api/travel-guides/pdf/content/:guideId',
        'Get presigned URL to download the PDF guide (deducts quota on first access)',
        [
          { name: 'guideId', description: 'The MongoDB ObjectId of the guide', required: true },
        ],
        `{
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
}`
      )}

      <Divider orientation="left">Usage Statistics</Divider>

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/stats',
        'Get detailed usage statistics for your token including graphs and recent access logs',
        [],
        `{
  "success": true,
  "data": {
    "token_info": {
      "name": "Client Name",
      "company_name": "Company Inc",
      "type": "pdf",
      "payment_type": "free",
      "is_active": true
    },
    "usage_summary": {
      "total_accesses": 150,
      "unique_guides_accessed": 45,
      "remaining_quota": 55
    },
    "graphs": {
      "daily_usage": [
        { "date": "2025-01-01", "count": 10 }
      ],
      "category_breakdown": [
        { "category_name": "City Trips", "count": 80 }
      ]
    }
  }
}`
      )}
    </div>
  );

  const renderPdfPaidApis = () => (
    <div>
      <Title level={2}>PDF Paid API</Title>
      <Paragraph>
        These endpoints are for tokens with <Tag color="blue">type=pdf</Tag> and <Tag color="orange">payment_type=paid</Tag>
      </Paragraph>

      <Divider orientation="left">Common Endpoints</Divider>

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/languages',
        'Get list of supported languages for travel guides',
        [],
        `[
  { "name": "English", "code": "en" },
  { "name": "Arabic", "code": "ar" }
]`
      )}

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/categories',
        'Get categories allowed for your token',
        [],
        `[
  {
    "_id": "cat1",
    "name": "City Trips",
    "slug": "city-trips"
  }
]`
      )}

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/guides',
        'List all available travel guides with pagination and filtering',
        [
          { name: 'category_id', description: 'Filter by category', required: false },
          { name: 'lang', description: 'Filter by language code', required: false },
          { name: 'page', description: 'Page number', required: false },
        ],
        `{
  "currentPage": 1,
  "pageSize": 20,
  "totalPages": 8,
  "totalBooks": 150,
  "books": [
    {
      "_id": "672a73fc3ff8e4cf3ba9084a",
      "name": "Amsterdam Travel Guide",
      "description": "Discover the vibrant capital of Netherlands with this comprehensive travel guide. Explore historic canals, world-class museums, charming neighborhoods, and the unique Dutch culture.",
      "category": {
        "_id": "672a73fc3ff8e4cf3ba9084a",
        "name": "City Trips",
        "slug": "city-trips"
      },
      "city": "Amsterdam",
      "country": "Netherlands",
      "price": 12.99,
      "imagePath": "https://s3.wasabisys.com/youguide/covers/amsterdam-cover.jpg",
      "lang_short": "en"
    },
    {
      "_id": "672a73fd3ff8e4cf3ba9084f",
      "name": "Paris Travel Guide",
      "description": "Experience the romance and elegance of Paris. Visit iconic landmarks, savor world-class cuisine, and immerse yourself in French culture.",
      "category": {
        "_id": "672a73fc3ff8e4cf3ba9084a",
        "name": "City Trips",
        "slug": "city-trips"
      },
      "city": "Paris",
      "country": "France",
      "price": 14.99,
      "imagePath": "https://s3.wasabisys.com/youguide/covers/paris-cover.jpg",
      "lang_short": "en"
    }
  ]
}`
      )}

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/guides/:guideId',
        'Get detailed information about a specific guide',
        [
          { name: 'guideId', description: 'Guide ID', required: true },
        ],
        `{
  "success": true,
  "guide": {
    "_id": "672a73fc3ff8e4cf3ba9084a",
    "name": "Amsterdam Travel Guide",
    "description": "Discover the vibrant capital of Netherlands with this comprehensive travel guide.",
    "city": "Amsterdam",
    "country": "Netherlands",
    "price": 12.99,
    "category": {
      "_id": "672a73fc3ff8e4cf3ba9084a",
      "name": "City Trips",
      "slug": "city-trips"
    },
    "lang": "English",
    "lang_short": "en",
    "has_pdf": true,
    "has_json": true,
    "imagePath": "https://s3.wasabisys.com/youguide/covers/amsterdam-cover.jpg",
    "pages": 156
  }
}`
      )}

      <Divider orientation="left">Payment & PDF Access</Divider>

      {renderApiEndpoint(
        'POST',
        '/api/travel-guides/pdf/secure/checkout',
        'Generate Stripe checkout link for purchasing PDF guide access',
        [
          { name: 'guide_id', description: 'The guide ID to purchase (in request body)', required: true },
        ],
        `{
  "success": true,
  "checkout_url": "https://checkout.stripe.com/...",
  "transaction_id": "550e8400-e29b-41d4-a716-446655440000",
  "expires_in": 1800
}`
      )}

      {renderApiEndpoint(
        'GET',
        '/api/travel-guides/pdf/secure/download',
        'Download PDF using transaction ID after successful payment',
        [
          { name: 'transaction_id', description: 'Transaction ID from checkout', required: true },
          { name: 'guide_id', description: 'Guide ID', required: true },
        ],
        `{
  "success": true,
  "guide": {
    "_id": "guide123",
    "name": "Amsterdam Guide"
  },
  "pdf_url": "https://wasabi.../presigned-url",
  "expires_in": 3600,
  "transaction": {
    "transaction_id": "uuid",
    "paid_at": "2026-01-02T10:30:00Z",
    "amount": 9.99,
    "currency": "eur"
  }
}`
      )}

      <Divider orientation="left">Usage Statistics</Divider>

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/stats',
        'Get usage statistics for your token',
        [],
        `{
  "success": true,
  "data": {
    "token_info": {
      "name": "Travel Agency XYZ",
      "company_name": "XYZ Tours Inc",
      "type": "pdf",
      "payment_type": "free",
      "is_active": true,
      "created_at": "2024-10-15T10:00:00.000Z"
    },
    "usage_summary": {
      "total_accesses": 245,
      "unique_guides_accessed": 67,
      "remaining_quota": 155,
      "total_quota": 300,
      "quota_used_percentage": 51.67
    },
    "graphs": {
      "daily_usage": [
        { "date": "2025-01-01", "count": 8 },
        { "date": "2025-01-02", "count": 12 },
        { "date": "2025-01-03", "count": 15 },
        { "date": "2025-01-04", "count": 10 },
        { "date": "2025-01-05", "count": 18 }
      ],
      "category_breakdown": [
        { "category_name": "City Trips", "count": 120 },
        { "category_name": "Country Guides", "count": 85 },
        { "category_name": "Island Guides", "count": 40 }
      ],
      "top_guides": [
        { "guide_name": "Amsterdam Travel Guide", "access_count": 25 },
        { "guide_name": "Paris Travel Guide", "access_count": 22 },
        { "guide_name": "Barcelona Travel Guide", "access_count": 18 }
      ]
    }
  }
}`
      )}
    </div>
  );

  const renderHtmlJsonFreeApis = () => (
    <div>
      <Title level={2}>HTML/JSON Prepaid API</Title>
      <Paragraph>
        These endpoints are for tokens with <Tag color="green">type=html_json</Tag> and <Tag color="cyan">payment_type=free</Tag>
      </Paragraph>

      <Divider orientation="left">Common Endpoints</Divider>

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/languages',
        'Get list of supported languages',
        [],
        `[
  { "name": "English", "code": "en" }
]`
      )}

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/categories',
        'Get allowed categories',
        [],
        `[
  { "_id": "cat1", "name": "City Trips" }
]`
      )}

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/guides',
        'List travel guides',
        [
          { name: 'category_id', description: 'Filter by category', required: false },
          { name: 'lang', description: 'Filter by language', required: false },
        ],
        `{
  "currentPage": 1,
  "pageSize": 20,
  "totalPages": 5,
  "totalBooks": 95,
  "books": [
    {
      "_id": "672a73fc3ff8e4cf3ba9084a",
      "name": "Amsterdam Travel Guide",
      "description": "Discover the vibrant capital of Netherlands with this comprehensive travel guide. Explore historic canals, world-class museums, charming neighborhoods, and the unique Dutch culture.",
      "category": {
        "_id": "672a73fc3ff8e4cf3ba9084a",
        "name": "City Trips"
      },
      "city": "Amsterdam",
      "country": "Netherlands",
      "price": 12.99,
      "imagePath": "https://s3.wasabisys.com/youguide/covers/amsterdam-cover.jpg",
      "lang_short": "en",
      "has_pdf": true,
      "has_json": true
    }
  ]
}`
      )}

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/guides/:guideId',
        'Get guide details',
        [
          { name: 'guideId', description: 'Guide ID', required: true },
        ],
        `{
  "success": true,
  "guide": {
    "_id": "672a73fc3ff8e4cf3ba9084a",
    "name": "Amsterdam Travel Guide",
    "description": "Discover the vibrant capital of Netherlands with this comprehensive travel guide.",
    "city": "Amsterdam",
    "country": "Netherlands",
    "price": 12.99,
    "category": {
      "_id": "672a73fc3ff8e4cf3ba9084a",
      "name": "City Trips",
      "slug": "city-trips"
    },
    "lang": "English",
    "lang_short": "en",
    "has_pdf": true,
    "has_json": true,
    "imagePath": "https://s3.wasabisys.com/youguide/covers/amsterdam-cover.jpg",
    "pages": 156
  }
}`
      )}

      <Divider orientation="left">Digital Content Endpoints</Divider>

      {renderApiEndpoint(
        'GET',
        '/api/travel-guides/digital/content/data/:guideId',
        'Get JSON data for the travel guide (deducts quota on first access)',
        [
          { name: 'guideId', description: 'Guide ID', required: true },
          { name: 'headings', description: 'Filter content by heading numbers (comma-separated, e.g., headings=2,3,4). See Heading Reference section for category-specific heading numbers.', required: false },
          { name: 'heading_format', description: 'Format for headings: "normal" (default) or "sequential" (numbered)', required: false },
        ],
        `{
  "success": true,
  "guide": {
    "_id": "672a73fc3ff8e4cf3ba9084a",
    "name": "Amsterdam Travel Guide",
    "city": "Amsterdam",
    "country": "Netherlands",
    "category": "City Trips",
    "language": "en"
  },
  "content": {
    "overview": "Welcome to Amsterdam, the vibrant capital of the Netherlands! This guide will help you discover the city's historic canals, world-renowned museums, and unique Dutch culture.",
    "sections": [
      {
        "heading": "1. Introduction",
        "subheadings": [
          {
            "title": "Welcome to Amsterdam",
            "content": "<p>Amsterdam is a city of contrasts where historic architecture meets modern innovation...</p>"
          },
          {
            "title": "Best Time to Visit",
            "content": "<p>The best time to visit Amsterdam is during spring (April-May) when tulips are in bloom...</p>"
          }
        ]
      },
      {
        "heading": "2. Navigation",
        "subheadings": [
          {
            "title": "Getting Around",
            "content": "<p>Amsterdam has an excellent public transport system including trams, buses, and metros...</p>"
          },
          {
            "title": "Bicycle Rentals",
            "content": "<p>Cycling is the best way to explore Amsterdam like a local. Rental shops are everywhere...</p>"
          }
        ]
      },
      {
        "heading": "3. Attractions & Activities",
        "subheadings": [
          {
            "title": "Museums",
            "content": "<p>Visit the Van Gogh Museum, Rijksmuseum, and Anne Frank House...</p>"
          },
          {
            "title": "Canal Tours",
            "content": "<p>Experience Amsterdam from the water with a canal boat tour...</p>"
          }
        ]
      }
    ],
    "places": [
      {
        "name": "Van Gogh Museum",
        "address": "Museumplein 6, 1071 DJ Amsterdam",
        "coordinates": { "lat": 52.3584, "lng": 4.8811 },
        "category": "Museum",
        "description": "World's largest collection of Van Gogh paintings"
      },
      {
        "name": "Anne Frank House",
        "address": "Prinsengracht 263-267, 1016 GV Amsterdam",
        "coordinates": { "lat": 52.3752, "lng": 4.8840 },
        "category": "Historical Site",
        "description": "The hiding place of Anne Frank during WWII"
      }
    ]
  },
  "access_info": {
    "first_access": true,
    "remaining_quota": 99,
    "quota_deducted": 1
  }
}`
      )}

      <Card style={{ marginBottom: 24, backgroundColor: '#f0f8ff', border: '1px solid #1890ff' }}>
        <Text>
          <strong>Note:</strong> To filter content by specific headings, refer to the{' '}
          <Button type="link" onClick={() => setSelectedSection('heading-reference')} style={{ padding: 0, height: 'auto' }}>
            Heading Reference
          </Button>{' '}
          section to see available headings for each category.
        </Text>
      </Card>

      <Card style={{ marginBottom: 24, backgroundColor: '#fff9e6', border: '1px solid #ffd666' }}>
        <div style={{ marginBottom: 12 }}>
          <Text strong style={{ fontSize: 14 }}>📋 Heading Format Parameter Explained:</Text>
        </div>
        <Text>
          The <Text code>heading_format</Text> parameter controls how heading numbers are displayed when using the <Text code>headings</Text> filter:
        </Text>
        <div style={{ marginTop: 12, marginBottom: 12 }}>
          <div style={{ background: '#f6f6f6', padding: 12, borderRadius: 4, marginBottom: 8 }}>
            <Text strong>Example: headings=2,3,4</Text>
          </div>
          <ul style={{ marginLeft: 20, lineHeight: 2 }}>
            <li>
              <Text code>heading_format=normal</Text> (default): Headings keep their original numbers → <Text strong>2, 3, 4</Text>
            </li>
            <li>
              <Text code>heading_format=sequential</Text>: Headings are renumbered sequentially → <Text strong>1, 2, 3</Text>
              <div style={{ marginLeft: 20, marginTop: 4, fontSize: 12, color: '#666' }}>
                (Original heading 2 becomes 1, heading 3 becomes 2, heading 4 becomes 3)
              </div>
            </li>
          </ul>
        </div>
        <Text type="secondary" style={{ fontSize: 12 }}>
          💡 Use <Text code>sequential</Text> when you want filtered content to appear as a continuous numbered sequence starting from 1.
        </Text>
      </Card>

      {renderApiEndpoint(
        'GET',
        '/api/travel-guides/digital/content/view/:guideId',
        'Get rendered HTML version of the guide with customizable styling',
        [
          { name: 'guideId', description: 'Guide ID', required: true },
          { name: 'headings', description: 'Filter content by heading numbers (comma-separated, e.g., headings=2,3,4). See Heading Reference section for category-specific heading numbers.', required: false },
          { name: 'heading_format', description: 'Format for headings: "normal" (default) or "sequential" (numbered)', required: false },
          { name: 'heading_font_size', description: 'Font size for headings (default: 24)', required: false },
          { name: 'heading_color', description: 'Color for headings (default: #333333)', required: false },
          { name: 'sub_heading_font_size', description: 'Font size for sub-headings (default: 18)', required: false },
          { name: 'mode', description: 'Theme mode: light or dark (default: light)', required: false },
        ],
        `Returns full HTML page with applied styling`
      )}

      <Card style={{ marginBottom: 24, backgroundColor: '#f0f8ff', border: '1px solid #1890ff' }}>
        <Text>
          <strong>Note:</strong> To filter content by specific headings, refer to the{' '}
          <Button type="link" onClick={() => setSelectedSection('heading-reference')} style={{ padding: 0, height: 'auto' }}>
            Heading Reference
          </Button>{' '}
          section to see available headings for each category.
        </Text>
      </Card>

      <Divider orientation="left">Usage Statistics</Divider>

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/stats',
        'Get usage statistics',
        [],
        `{
  "success": true,
  "data": {
    "token_info": {
      "name": "Travel Agency XYZ",
      "company_name": "XYZ Tours Inc",
      "type": "html_json",
      "payment_type": "free",
      "is_active": true,
      "created_at": "2024-10-15T10:00:00.000Z"
    },
    "usage_summary": {
      "total_accesses": 178,
      "unique_guides_accessed": 45,
      "remaining_quota": 122,
      "total_quota": 200,
      "quota_used_percentage": 39
    },
    "graphs": {
      "daily_usage": [
        { "date": "2025-01-01", "count": 5 },
        { "date": "2025-01-02", "count": 8 },
        { "date": "2025-01-03", "count": 12 }
      ],
      "category_breakdown": [
        { "category_name": "City Trips", "count": 95 },
        { "category_name": "Country Guides", "count": 63 },
        { "category_name": "Island Guides", "count": 20 }
      ]
    }
  }
}`
      )}
    </div>
  );

  const renderCodeSnippets = () => {
    // Determine which snippets to show based on selected section
    const showPdfPrepaid = selectedSection === 'code-snippets' || selectedSection === 'snippet-pdf-prepaid';
    const showPdfPaid = selectedSection === 'code-snippets' || selectedSection === 'snippet-pdf-paid';
    const showHtmlPrepaid = selectedSection === 'code-snippets' || selectedSection === 'snippet-html-prepaid';
    const showHtmlPaid = selectedSection === 'code-snippets' || selectedSection === 'snippet-html-paid';

    return (
      <div>
        <Title level={2}>Code Snippets</Title>
        <Paragraph>
          Complete, ready-to-use HTML/JavaScript applications demonstrating all YouGuide API endpoints.
          Each snippet is a fully functional website with filters, dropdowns, popups, and complete API integration.
          Click "View Design" to see the snippet running live!
        </Paragraph>

        {showPdfPrepaid && (
          <>
            <Divider orientation="left">1. PDF Prepaid API - Complete Application</Divider>

            <Card style={{ marginBottom: 24, backgroundColor: '#f9f9f9' }}>
        <Title level={4}>Full HTML Application - PDF Prepaid Guide Browser</Title>
        <Paragraph type="secondary">
          Features: Language & Category filters, Search, Guide grid with pagination, PDF download with quota tracking
        </Paragraph>
        <div style={{ background: '#e6f7ff', padding: '12px', borderRadius: '4px', marginBottom: '15px', border: '1px solid #91d5ff' }}>
          <Text strong style={{ color: '#0050b3' }}>✅ WORKING DEMO</Text>
          <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#096dd9' }}>
            This snippet contains a <strong>real, active API token</strong> with 50 remaining quota.
            Copy this entire HTML file and open it in your browser to see it work immediately!
            Token Owner: Muhammad Suleman (Fairfield) | Access: Camper Guides | 1836 guides available
          </p>
        </div>

        <Card style={{ marginBottom: '15px', backgroundColor: '#f0f5ff', border: '1px solid #adc6ff' }}>
          <Text strong>📡 APIs Used in this Snippet:</Text>
          <ul style={{ marginTop: '10px', marginBottom: '10px', lineHeight: '1.8' }}>
            <li><Text code>GET /api/travel-content/languages</Text> - Fetch available languages</li>
            <li><Text code>GET /api/travel-content/categories</Text> - Fetch categories</li>
            <li><Text code>GET /api/travel-content/guides</Text> - List guides with filters (category, language, search, pagination)</li>
            <li><Text code>GET /api/travel-guides/pdf/content/:guideId</Text> - Download PDF guide (deducts quota on first access)</li>
          </ul>
        </Card>

        <Button
          type="primary"
          icon={<ApiOutlined />}
          size="large"
          onClick={() => openPreview(document.getElementById('pdf-prepaid-html').textContent)}
          style={{ marginBottom: '15px', width: '100%', height: '45px', fontSize: '16px' }}
        >
          🚀 View Live Design
        </Button>

        <div className="code-block" style={{ backgroundColor: '#1e1e1e', padding: '16px', borderRadius: '4px', overflow: 'auto' }}>
          <pre id="pdf-prepaid-html" style={{ color: '#d4d4d4', margin: 0, fontSize: '13px' }}>{`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YouGuide - PDF Prepaid Travel Guides</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 { font-size: 32px; margin-bottom: 10px; }
    .header p { opacity: 0.9; }
    .filters {
      background: #f8f9fa;
      padding: 25px 30px;
      border-bottom: 2px solid #e9ecef;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      position: relative;
      z-index: 100;
    }
    .filter-group {
      position: relative;
      z-index: 100;
    }
    .filter-group label {
      display: block;
      font-weight: 600;
      margin-bottom: 8px;
      color: #495057;
      font-size: 14px;
    }
    .filter-group select,
    .filter-group input {
      width: 100%;
      padding: 10px 12px;
      border: 2px solid #dee2e6;
      border-radius: 6px;
      font-size: 14px;
      transition: all 0.3s;
      position: relative;
      z-index: 100;
    }
    .filter-group select:focus,
    .filter-group input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      z-index: 200;
    }
    .stats-bar {
      background: #e7f3ff;
      padding: 15px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #bee5eb;
    }
    .stat-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .stat-label { font-weight: 600; color: #0c5460; }
    .stat-value {
      background: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: bold;
      color: #667eea;
    }
    .guides-container {
      padding: 30px;
      min-height: 400px;
    }
    .guides-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    @media (min-width: 1200px) {
      .guides-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    @media (min-width: 768px) and (max-width: 1199px) {
      .guides-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    .guide-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: all 0.3s;
      border: 2px solid transparent;
    }
    .guide-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.15);
      border-color: #667eea;
    }
    .guide-image {
      width: 120px;
      height: 180px;
      object-fit: cover;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin: 0 auto;
      display: block;
    }
    .guide-content {
      padding: 12px;
    }
    .guide-title {
      font-size: 14px;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 6px;
      line-height: 1.3;
    }
    .guide-location {
      color: #6c757d;
      font-size: 11px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 3px;
    }
    .guide-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #e9ecef;
    }
    .guide-price {
      font-size: 16px;
      font-weight: bold;
      color: #667eea;
    }
    .guide-lang {
      background: #e7f3ff;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 600;
      color: #0c5460;
    }
    .download-btn {
      width: 100%;
      padding: 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 10px;
      transition: all 0.3s;
    }
    .download-btn:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    .download-btn:disabled {
      background: #6c757d;
      cursor: not-allowed;
      transform: scale(1);
    }
    .loading {
      text-align: center;
      padding: 60px 20px;
      color: #6c757d;
      font-size: 18px;
    }
    .loading::after {
      content: '...';
      animation: dots 1.5s steps(4, end) infinite;
    }
    @keyframes dots {
      0%, 20% { content: '.'; }
      40% { content: '..'; }
      60%, 100% { content: '...'; }
    }
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e9ecef;
    }
    .page-btn {
      padding: 8px 16px;
      background: white;
      border: 2px solid #667eea;
      color: #667eea;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }
    .page-btn:hover:not(:disabled) {
      background: #667eea;
      color: white;
    }
    .page-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .page-info {
      padding: 8px 16px;
      font-weight: 600;
      color: #495057;
    }
    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      z-index: 1000;
      align-items: center;
      justify-content: center;
    }
    .modal.show {
      display: flex;
    }
    .modal-content {
      background: white;
      border-radius: 12px;
      padding: 30px;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      animation: slideDown 0.3s;
    }
    @keyframes slideDown {
      from { transform: translateY(-50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .modal-header {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #2c3e50;
    }
    .modal-body {
      margin-bottom: 20px;
    }
    .modal-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }
    .btn-primary {
      background: #667eea;
      color: white;
    }
    .btn-primary:hover {
      background: #5568d3;
    }
    .btn-secondary {
      background: #e9ecef;
      color: #495057;
    }
    .btn-secondary:hover {
      background: #dee2e6;
    }
    .success-message {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 15px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌍 YouGuide Travel Guides</h1>
      <p>PDF Prepaid API - Browse and download travel guides</p>
    </div>

    <div class="filters">
      <div class="filter-group">
        <label>🔍 Search Guides</label>
        <input type="text" id="search-input" placeholder="Search by name or location...">
      </div>
      <div class="filter-group">
        <label>🌐 Language</label>
        <select id="language-filter">
          <option value="">All Languages</option>
        </select>
      </div>
      <div class="filter-group">
        <label>📚 Category</label>
        <select id="category-filter">
          <option value="">All Categories</option>
        </select>
      </div>
    </div>

    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-label">Total Guides:</span>
        <span class="stat-value" id="total-guides">0</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Current Page:</span>
        <span class="stat-value" id="current-page">1</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Remaining Quota:</span>
        <span class="stat-value" id="quota">--</span>
      </div>
    </div>

    <div class="guides-container">
      <div id="guides-grid" class="guides-grid"></div>
      <div id="pagination" class="pagination"></div>
    </div>
  </div>

  <!-- Download Confirmation Modal -->
  <div id="download-modal" class="modal">
    <div class="modal-content">
      <div class="modal-header">📥 Download Guide</div>
      <div class="modal-body">
        <p style="margin-bottom: 15px;"><strong id="modal-guide-name"></strong></p>
        <p style="color: #6c757d; line-height: 1.6;">
          This will download the PDF guide. If this is your first time accessing this guide,
          it will deduct 1 from your quota. Subsequent downloads of the same guide are free.
        </p>
        <div id="success-msg" class="success-message" style="display: none;"></div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" id="confirm-download">Download PDF</button>
      </div>
    </div>
  </div>

  <script>
    const API_BASE = 'https://appapi.youguide.com';
    const YOUR_TOKEN = 'e94aa42004ab5c9977cd1390d589992628fb5f1da0e6646dcdce4bd00ca4820a'; // PDF Prepaid Token

    let currentPage = 1;
    let totalPages = 1;
    let currentFilters = {
      search: '',
      language: '',
      category: ''
    };
    let selectedGuide = null;
    let remainingQuota = null;

    // Initialize the application
    async function init() {
      await loadLanguages();
      await loadCategories();
      await loadGuides();
      setupEventListeners();
    }

    function setupEventListeners() {
      document.getElementById('search-input').addEventListener('input', debounce((e) => {
        currentFilters.search = e.target.value;
        currentPage = 1;
        loadGuides();
      }, 500));

      document.getElementById('language-filter').addEventListener('change', (e) => {
        currentFilters.language = e.target.value;
        currentPage = 1;
        loadGuides();
      });

      document.getElementById('category-filter').addEventListener('change', (e) => {
        currentFilters.category = e.target.value;
        currentPage = 1;
        loadGuides();
      });
    }

    function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
      };
    }

    async function loadLanguages() {
      try {
        const response = await fetch(\`\${API_BASE}/api/travel-content/languages\`, {
          headers: { 'Authorization': \`Bearer \${YOUR_TOKEN}\` }
        });

        console.log('Languages Response Status:', response.status);

        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }

        const response_data = await response.json();
        console.log('Languages data:', response_data);

        const select = document.getElementById('language-filter');
        if (!select) {
          console.error('ERROR: language-filter element not found in DOM!');
          return;
        }

        // Handle both array response and object with data property
        const languages = Array.isArray(response_data) ? response_data : response_data.data;

        if (Array.isArray(languages) && languages.length > 0) {
          languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.name;
            select.appendChild(option);
          });
          console.log('Successfully populated', languages.length, 'languages');
        } else {
          console.warn('No languages returned from API');
        }
      } catch (error) {
        console.error('Error loading languages:', error);
      }
    }

    async function loadCategories() {
      try {
        const response = await fetch(\`\${API_BASE}/api/travel-content/categories\`, {
          headers: { 'Authorization': \`Bearer \${YOUR_TOKEN}\` }
        });

        console.log('Categories Response Status:', response.status);

        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }

        const response_data = await response.json();
        console.log('Categories data:', response_data);

        const select = document.getElementById('category-filter');
        if (!select) {
          console.error('ERROR: category-filter element not found in DOM!');
          return;
        }

        // Handle both array response and object with data property
        const categories = Array.isArray(response_data) ? response_data : response_data.data;

        if (Array.isArray(categories) && categories.length > 0) {
          categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat._id;
            option.textContent = cat.name;
            select.appendChild(option);
          });
          console.log('Successfully populated', categories.length, 'categories');
        } else {
          console.warn('No categories returned from API');
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    }

    async function loadGuides() {
      const container = document.getElementById('guides-grid');
      container.innerHTML = '<div class="loading">Loading guides</div>';

      try {
        let url = \`\${API_BASE}/api/travel-content/guides?page=\${currentPage}&limit=12\`;
        if (currentFilters.search) url += \`&query=\${encodeURIComponent(currentFilters.search)}\`;
        if (currentFilters.language) url += \`&lang=\${currentFilters.language}\`;
        else url += \`&lang=en\`;
        if (currentFilters.category) url += \`&category_id=\${currentFilters.category}\`;

        const response = await fetch(url, {
          headers: { 'Authorization': \`Bearer \${YOUR_TOKEN}\` }
        });
        const data = await response.json();

        totalPages = data.totalPages;
        document.getElementById('total-guides').textContent = data.totalBooks;
        document.getElementById('current-page').textContent = currentPage;

        renderGuides(data.books);
        renderPagination();
      } catch (error) {
        container.innerHTML = '<div class="loading">❌ Error loading guides. Please check your token.</div>';
        console.error('Error:', error);
      }
    }

    function renderGuides(guides) {
      const container = document.getElementById('guides-grid');

      if (guides.length === 0) {
        container.innerHTML = '<div class="loading">No guides found</div>';
        return;
      }

      container.innerHTML = '';
      guides.forEach(guide => {
        const card = document.createElement('div');
        card.className = 'guide-card';
        card.innerHTML = \`
          <img class="guide-image" src="\${guide.imagePath || ''}"
               alt="\${guide.name}"
               onerror="this.style.display='none'">
          <div class="guide-content">
            <div class="guide-title">\${guide.name}</div>
            <div class="guide-location">📍 \${guide.city}, \${guide.country}</div>
            <div class="guide-meta">
              <div class="guide-price">€\${guide.price.toFixed(2)}</div>
              <div class="guide-lang">\${guide.lang_short || 'EN'}</div>
            </div>
            <button class="download-btn" onclick="openDownloadModal('\${guide._id}', '\${guide.name.replace(/'/g, "\\'")}')">
              Download PDF
            </button>
          </div>
        \`;
        container.appendChild(card);
      });
    }

    function renderPagination() {
      const container = document.getElementById('pagination');
      container.innerHTML = \`
        <button class="page-btn" onclick="goToPage(\${currentPage - 1})" \${currentPage === 1 ? 'disabled' : ''}>
          ← Previous
        </button>
        <span class="page-info">Page \${currentPage} of \${totalPages}</span>
        <button class="page-btn" onclick="goToPage(\${currentPage + 1})" \${currentPage === totalPages ? 'disabled' : ''}>
          Next →
        </button>
      \`;
    }

    function goToPage(page) {
      if (page < 1 || page > totalPages) return;
      currentPage = page;
      loadGuides();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function openDownloadModal(guideId, guideName) {
      selectedGuide = { id: guideId, name: guideName };
      document.getElementById('modal-guide-name').textContent = guideName;
      document.getElementById('success-msg').style.display = 'none';
      document.getElementById('download-modal').classList.add('show');
    }

    function closeModal() {
      document.getElementById('download-modal').classList.remove('show');
      selectedGuide = null;
    }

    document.getElementById('confirm-download').addEventListener('click', async function() {
      if (!selectedGuide) return;

      const btn = this;
      btn.disabled = true;
      btn.textContent = 'Downloading...';

      try {
        const response = await fetch(
          \`\${API_BASE}/api/travel-guides/pdf/content/\${selectedGuide.id}\`,
          { headers: { 'Authorization': \`Bearer \${YOUR_TOKEN}\` } }
        );

        if (!response.ok) throw new Error('Download failed');

        const data = await response.json();

        // Update quota
        remainingQuota = data.access_info.remaining_quota;
        document.getElementById('quota').textContent = remainingQuota;

        // Show success message
        const msg = document.getElementById('success-msg');
        msg.textContent = \`✅ \${data.access_info.first_access ? 'First access! Quota deducted.' : 'Free re-download!'} Remaining: \${remainingQuota}\`;
        msg.style.display = 'block';

        // Open PDF in new tab
        setTimeout(() => {
          window.open(data.pdf_url, '_blank');
          setTimeout(closeModal, 1500);
        }, 500);

      } catch (error) {
        alert('Error downloading PDF. Please try again.');
        console.error('Error:', error);
      } finally {
        btn.disabled = false;
        btn.textContent = 'Download PDF';
      }
    });

    // Close modal when clicking outside
    document.getElementById('download-modal').addEventListener('click', function(e) {
      if (e.target === this) closeModal();
    });

    // Initialize app when DOM is fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  </script>
</body>
</html>`}</pre>
        </div>
      </Card>
          </>
        )}

        {showPdfPaid && (
          <>
            <Divider orientation="left">2. PDF Paid API - Complete Payment Application</Divider>

            <Card style={{ marginBottom: 24, backgroundColor: '#f9f9f9' }}>
        <Title level={4}>Full HTML Application - PDF Paid with Stripe Integration</Title>
        <Paragraph type="secondary">
          Features: Guide listing, Stripe payment flow, Transaction tracking, PDF download after payment
        </Paragraph>
        <div style={{ background: '#fff7e6', padding: '12px', borderRadius: '4px', marginBottom: '15px', border: '1px solid #ffd591' }}>
          <Text strong style={{ color: '#d46b08' }}>✅ WORKING DEMO - Payment Integration</Text>
          <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#d48806' }}>
            This snippet contains a <strong>real, active API token</strong> for pay-per-guide access.
            Includes full Stripe checkout integration. Test in a development environment first!
          </p>
        </div>

        <Card style={{ marginBottom: '15px', backgroundColor: '#fff7e6', border: '1px solid #ffd591' }}>
          <Text strong>📡 APIs Used in this Snippet:</Text>
          <ul style={{ marginTop: '10px', marginBottom: '10px', lineHeight: '1.8' }}>
            <li><Text code>GET /api/travel-content/languages</Text> - Fetch available languages</li>
            <li><Text code>GET /api/travel-content/categories</Text> - Fetch categories</li>
            <li><Text code>GET /api/travel-content/guides</Text> - List guides with filters</li>
            <li><Text code>POST /api/travel-guides/pdf/secure/checkout</Text> - Create Stripe checkout session</li>
            <li><Text code>GET /api/travel-guides/pdf/secure/download</Text> - Download PDF after payment with transaction ID</li>
          </ul>
        </Card>

        <Button
          type="primary"
          icon={<ApiOutlined />}
          size="large"
          onClick={() => openPreview(document.getElementById('pdf-paid-html').textContent)}
          style={{ marginBottom: '15px', width: '100%', height: '45px', fontSize: '16px', background: '#fa8c16', borderColor: '#fa8c16' }}
        >
          🚀 View Live Design
        </Button>

        <div className="code-block" style={{ backgroundColor: '#1e1e1e', padding: '16px', borderRadius: '4px', overflow: 'auto' }}>
          <pre id="pdf-paid-html" style={{ color: '#d4d4d4', margin: 0, fontSize: '13px' }}>{`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>YouGuide - PDF Paid API</title>
  <style>
    /* Reuse styles from first snippet for consistency */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); min-height: 100vh; padding: 20px; }
    .container { max-width: 1400px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow: hidden; }
    .header { background: linear-gradient(135deg, #f5576c 0%, #c94b4b 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { font-size: 32px; margin-bottom: 10px; }
    .filters { background: #f8f9fa; padding: 25px 30px; border-bottom: 2px solid #e9ecef; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; position: relative; z-index: 100; }
    .filter-group { position: relative; z-index: 100; }
    .filter-group label { display: block; font-weight: 600; margin-bottom: 8px; color: #495057; font-size: 14px; }
    .filter-group select, .filter-group input { width: 100%; padding: 10px 12px; border: 2px solid #dee2e6; border-radius: 6px; font-size: 14px; position: relative; z-index: 100; }
    .filter-group select:focus, .filter-group input:focus { z-index: 200; }
    .guides-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; padding: 30px; }
    @media (min-width: 1200px) { .guides-grid { grid-template-columns: repeat(4, 1fr); } }
    @media (min-width: 768px) and (max-width: 1199px) { .guides-grid { grid-template-columns: repeat(3, 1fr); } }
    .guide-card { background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; transition: all 0.3s; border: 2px solid transparent; }
    .guide-card:hover { transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.15); border-color: #f5576c; }
    .guide-image { width: 120px; height: 180px; object-fit: cover; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); margin: 0 auto; display: block; }
    .guide-content { padding: 12px; }
    .guide-title { font-size: 14px; font-weight: bold; color: #2c3e50; margin-bottom: 6px; line-height: 1.3; }
    .guide-location { color: #6c757d; font-size: 11px; margin-bottom: 8px; }
    .guide-price { font-size: 18px; font-weight: bold; color: #f5576c; margin: 10px 0; }
    .pay-btn { width: 100%; padding: 8px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
    .pay-btn:hover { transform: scale(1.02); box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4); }
    .pay-btn:disabled { background: #6c757d; cursor: not-allowed; }
    .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 1000; align-items: center; justify-content: center; }
    .modal.show { display: flex; }
    .modal-content { background: white; border-radius: 12px; padding: 30px; max-width: 500px; width: 90%; animation: slideDown 0.3s; }
    @keyframes slideDown { from { transform: translateY(-50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .modal-header { font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #2c3e50; }
    .btn { padding: 10px 20px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; margin: 5px; }
    .btn-primary { background: #f5576c; color: white; }
    .btn-secondary { background: #e9ecef; color: #495057; }
    .success-page { text-align: center; padding: 60px 30px; }
    .success-icon { font-size: 80px; color: #28a745; margin-bottom: 20px; }
    .loading { text-align: center; padding: 60px 20px; color: #6c757d; font-size: 18px; }
  </style>
</head>
<body>
  <div class="container" id="app">
    <div class="header">
      <h1>💳 YouGuide Travel Guides - Pay Per Guide</h1>
      <p>PDF Paid API - Secure payment via Stripe</p>
    </div>

    <!-- Main Page (Guide Listing) -->
    <div id="main-page">
      <div class="filters">
        <div class="filter-group">
          <label>🔍 Search Guides</label>
          <input type="text" id="search-input" placeholder="Search...">
        </div>
        <div class="filter-group">
          <label>🌐 Language</label>
          <select id="language-filter"><option value="">All Languages</option></select>
        </div>
        <div class="filter-group">
          <label>📚 Category</label>
          <select id="category-filter"><option value="">All Categories</option></select>
        </div>
      </div>
      <div id="guides-grid" class="guides-grid"></div>
    </div>

    <!-- Success Page (After Payment) -->
    <div id="success-page" style="display: none;">
      <div class="success-page">
        <div class="success-icon">✅</div>
        <h2>Payment Successful!</h2>
        <p style="margin: 20px 0; color: #6c757d;">Your guide is ready for download.</p>
        <div id="download-info" style="margin: 30px 0;"></div>
        <button class="btn btn-primary" id="download-btn">📥 Download PDF Now</button>
        <button class="btn btn-secondary" onclick="location.reload()">← Back to Guides</button>
      </div>
    </div>
  </div>

  <script>
    const API_BASE = 'https://appapi.youguide.com';
    const YOUR_TOKEN = 'dfe40026e78100e04dfcaf5d7f2b79bd5a5f0901664b1d067e63435d07edd19a'; // PDF Paid Token

    // Check if returning from Stripe payment
    window.addEventListener('DOMContentLoaded', () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('payment') === 'success') {
        showSuccessPage();
      } else {
        init();
      }
    });

    async function init() {
      await loadLanguages();
      await loadCategories();
      await loadGuides();
      setupFilters();
    }

    async function loadLanguages() {
      try {
        const response = await fetch(\`\${API_BASE}/api/travel-content/languages\`, {
          headers: { 'Authorization': \`Bearer \${YOUR_TOKEN}\` }
        });

        console.log('Languages Response Status:', response.status);

        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }

        const languages = await response.json();
        console.log('Languages data:', languages);

        const select = document.getElementById('language-filter');
        if (!select) {
          console.error('ERROR: language-filter element not found in DOM!');
          return;
        }

        if (Array.isArray(languages) && languages.length > 0) {
          languages.forEach(lang => {
            select.innerHTML += \`<option value="\${lang.code}">\${lang.name}</option>\`;
          });
          console.log('Successfully populated', languages.length, 'languages');
        } else {
          console.warn('No languages returned from API');
        }
      } catch (error) {
        console.error('Error loading languages:', error);
      }
    }

    async function loadCategories() {
      try {
        const response = await fetch(\`\${API_BASE}/api/travel-content/categories\`, {
          headers: { 'Authorization': \`Bearer \${YOUR_TOKEN}\` }
        });

        console.log('Categories Response Status:', response.status);

        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }

        const categories = await response.json();
        console.log('Categories data:', categories);

        const select = document.getElementById('category-filter');
        if (!select) {
          console.error('ERROR: category-filter element not found in DOM!');
          return;
        }

        if (Array.isArray(categories) && categories.length > 0) {
          categories.forEach(cat => {
            select.innerHTML += \`<option value="\${cat._id}">\${cat.name}</option>\`;
          });
          console.log('Successfully populated', categories.length, 'categories');
        } else {
          console.warn('No categories returned from API');
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    }

    function setupFilters() {
      ['search-input', 'language-filter', 'category-filter'].forEach(id => {
        document.getElementById(id).addEventListener('change', loadGuides);
        document.getElementById(id).addEventListener('input', debounce(loadGuides, 500));
      });
    }

    function debounce(func, wait) {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
      };
    }

    async function loadGuides() {
      const container = document.getElementById('guides-grid');
      container.innerHTML = '<div class="loading">Loading guides...</div>';

      try {
        const search = document.getElementById('search-input').value;
        const lang = document.getElementById('language-filter').value;
        const category = document.getElementById('category-filter').value;

        let url = \`\${API_BASE}/api/travel-content/guides?limit=20\`;
        if (search) url += \`&query=\${encodeURIComponent(search)}\`;
        if (lang) url += \`&lang=\${lang}\`;
        else url += \`&lang=en\`;
        if (category) url += \`&category_id=\${category}\`;

        const response = await fetch(url, {
          headers: { 'Authorization': \`Bearer \${YOUR_TOKEN}\` }
        });
        const data = await response.json();

        container.innerHTML = '';
        data.books.forEach(guide => {
          container.innerHTML += \`
            <div class="guide-card">
              <img class="guide-image" src="\${guide.imagePath || ''}" alt="\${guide.name}" onerror="this.style.display='none'">
              <div class="guide-content">
                <div class="guide-title">\${guide.name}</div>
                <div class="guide-location">📍 \${guide.city}, \${guide.country}</div>
                <div class="guide-price">€\${guide.price.toFixed(2)}</div>
                <button class="pay-btn" onclick="initiatePayment('\${guide._id}', '\${guide.name.replace(/'/g, "\\'")}', \${guide.price})">
                  Buy PDF
                </button>
              </div>
            </div>
          \`;
        });
      } catch (error) {
        container.innerHTML = '<div class="loading">❌ Error loading guides</div>';
      }
    }

    async function initiatePayment(guideId, guideName, price) {
      if (!confirm(\`Purchase "\${guideName}" for €\${price}?\\n\\nYou will be redirected to Stripe for secure payment.\`)) {
        return;
      }

      try {
        const response = await fetch(\`\${API_BASE}/api/travel-guides/pdf/secure/checkout\`, {
          method: 'POST',
          headers: {
            'Authorization': \`Bearer \${YOUR_TOKEN}\`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ guide_id: guideId })
        });

        if (!response.ok) throw new Error('Checkout failed');

        const data = await response.json();

        // Save transaction data
        localStorage.setItem('transaction_id', data.transaction_id);
        localStorage.setItem('guide_id', guideId);
        localStorage.setItem('guide_name', guideName);

        // Open Stripe checkout in new tab
        window.open(data.checkout_url, '_blank');
      } catch (error) {
        alert('Error initiating payment. Please try again.');
        console.error('Error:', error);
      }
    }

    async function showSuccessPage() {
      document.getElementById('main-page').style.display = 'none';
      document.getElementById('success-page').style.display = 'block';

      const guideName = localStorage.getItem('guide_name') || 'Your Guide';
      document.getElementById('download-info').innerHTML = \`
        <h3>\${guideName}</h3>
        <p style="color: #6c757d; margin-top: 10px;">Transaction ID: \${localStorage.getItem('transaction_id')}</p>
      \`;

      document.getElementById('download-btn').addEventListener('click', downloadPdf);
    }

    async function downloadPdf() {
      const btn = document.getElementById('download-btn');
      btn.disabled = true;
      btn.textContent = 'Downloading...';

      try {
        const transactionId = localStorage.getItem('transaction_id');
        const guideId = localStorage.getItem('guide_id');

        const response = await fetch(
          \`\${API_BASE}/api/travel-guides/pdf/secure/download?transaction_id=\${transactionId}&guide_id=\${guideId}\`,
          { headers: { 'Authorization': \`Bearer \${YOUR_TOKEN}\` } }
        );

        if (!response.ok) throw new Error('Download failed');

        const data = await response.json();

        // Open PDF
        window.open(data.pdf_url, '_blank');

        // Clear storage
        localStorage.removeItem('transaction_id');
        localStorage.removeItem('guide_id');
        localStorage.removeItem('guide_name');

        btn.textContent = '✓ Downloaded';
        setTimeout(() => location.reload(), 2000);
      } catch (error) {
        alert('Error downloading PDF');
        btn.disabled = false;
        btn.textContent = '📥 Download PDF Now';
      }
    }
  </script>
</body>
</html>`}</pre>
        </div>
      </Card>
          </>
        )}

        {showHtmlPrepaid && (
          <>
            <Divider orientation="left">3. HTML/JSON Prepaid API - Interactive Content Viewer</Divider>

            <Card style={{ marginBottom: 24, backgroundColor: '#f9f9f9' }}>
        <Title level={4}>Full HTML Application - JSON/HTML Content with Heading Filters & Format</Title>
        <Paragraph type="secondary">
          Features: Guide browser with sidebar, Heading filters, Heading format (normal/sequential), Mode selector (light/dark), Custom styling options, JSON and HTML view modes in popup
        </Paragraph>
        <div style={{ background: '#f6ffed', padding: '12px', borderRadius: '4px', marginBottom: '15px', border: '1px solid #b7eb8f' }}>
          <Text strong style={{ color: '#389e0d' }}>✅ WORKING DEMO - Content Viewer</Text>
          <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#52c41a' }}>
            This snippet contains a <strong>real, active API token</strong> for HTML/JSON content access.
            View travel guide content in JSON or styled HTML format with customizable heading filters!
          </p>
        </div>

        <Card style={{ marginBottom: '15px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
          <Text strong>📡 APIs Used in this Snippet:</Text>
          <ul style={{ marginTop: '10px', marginBottom: '10px', lineHeight: '1.8' }}>
            <li><Text code>GET /api/travel-content/languages</Text> - Fetch available languages</li>
            <li><Text code>GET /api/travel-content/categories</Text> - Fetch categories</li>
            <li><Text code>GET /api/travel-content/guides</Text> - List guides with filters</li>
            <li><Text code>GET /api/travel-guides/digital/content/data/:guideId</Text> - Get JSON content with heading filters & format (normal/sequential)</li>
            <li><Text code>GET /api/travel-guides/digital/content/view/:guideId</Text> - Get styled HTML view with heading filters, format, and customization options</li>
          </ul>
        </Card>

        <Button
          type="primary"
          icon={<ApiOutlined />}
          size="large"
          onClick={() => openPreview(document.getElementById('html-prepaid-html').textContent)}
          style={{ marginBottom: '15px', width: '100%', height: '45px', fontSize: '16px', background: '#52c41a', borderColor: '#52c41a' }}
        >
          🚀 View Live Design
        </Button>

        <div className="code-block" style={{ backgroundColor: '#1e1e1e', padding: '16px', borderRadius: '4px', overflow: 'auto' }}>
          <pre id="html-prepaid-html" style={{ color: '#d4d4d4', margin: 0, fontSize: '13px' }}>{`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>YouGuide - HTML/JSON Prepaid API</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; background: #f0f2f5; }
    .app-container { display: flex; height: 100vh; }
    .sidebar { width: 400px; background: white; border-right: 1px solid #e0e0e0; display: flex; flex-direction: column; }
    .sidebar-header { background: linear-gradient(135deg, #00b4db 0%, #0083b0 100%); color: white; padding: 20px; }
    .sidebar-header h2 { font-size: 20px; margin-bottom: 5px; }
    .filters-panel { padding: 20px; border-bottom: 1px solid #e0e0e0; position: relative; z-index: 100; }
    .filter-group { margin-bottom: 15px; position: relative; z-index: 100; }
    .filter-group label { display: block; font-weight: 600; margin-bottom: 6px; font-size: 13px; color: #495057; }
    .filter-group select, .filter-group input { width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px; font-size: 13px; position: relative; z-index: 100; }
    .filter-group select:focus, .filter-group input:focus { z-index: 200; }
    .guides-list { flex: 1; overflow-y: auto; padding: 10px; }
    .guide-item { background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; border: 1px solid #e0e0e0; transition: all 0.2s; }
    .guide-item:hover { box-shadow: 0 4px 8px rgba(0,0,0,0.1); border-color: #00b4db; }
    .guide-item-title { font-weight: 600; color: #2c3e50; margin-bottom: 6px; font-size: 14px; }
    .guide-item-meta { font-size: 12px; color: #6c757d; margin-bottom: 10px; }
    .guide-item-price { font-size: 16px; font-weight: bold; color: #00b4db; margin-bottom: 10px; }
    .open-guide-btn { width: 100%; padding: 8px; background: linear-gradient(135deg, #00b4db 0%, #0083b0 100%); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 13px; }
    .open-guide-btn:hover { opacity: 0.9; }
    .welcome-area { flex: 1; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); }
    .welcome-content { text-align: center; padding: 40px; }
    .welcome-content h1 { font-size: 36px; color: #2c3e50; margin-bottom: 10px; }
    .welcome-content p { font-size: 18px; color: #6c757d; }
    .loading { text-align: center; padding: 40px 20px; color: #6c757d; }
    .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 1000; align-items: center; justify-content: center; }
    .modal.show { display: flex; }
    .modal-content { background: white; border-radius: 12px; padding: 30px; max-width: 700px; width: 90%; max-height: 90vh; overflow-y: auto; animation: slideDown 0.3s; }
    @keyframes slideDown { from { transform: translateY(-50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .modal-header { font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #2c3e50; border-bottom: 2px solid #e9ecef; padding-bottom: 15px; }
    .modal-controls { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
    .control-group { margin-bottom: 15px; }
    .control-group label { display: block; font-size: 13px; font-weight: 600; color: #495057; margin-bottom: 6px; }
    .control-group input, .control-group select { width: 100%; padding: 10px; border: 1px solid #ced4da; border-radius: 6px; font-size: 14px; }
    .control-group input[type="color"] { height: 42px; }
    .modal-actions { display: flex; gap: 10px; margin-top: 20px; }
    .btn { padding: 12px 24px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; flex: 1; }
    .btn-primary { background: linear-gradient(135deg, #00b4db 0%, #0083b0 100%); color: white; }
    .btn-primary:hover { opacity: 0.9; }
    .btn-secondary { background: #e9ecef; color: #495057; }
    .btn-secondary:hover { background: #dee2e6; }
    .quota-info { background: #e7f3ff; padding: 10px; border-radius: 6px; margin-bottom: 15px; color: #0c5460; font-size: 13px; }
  </style>
</head>
<body>
  <div class="app-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="sidebar-header">
        <h2>📚 Travel Guides</h2>
        <p style="font-size: 13px; opacity: 0.9;">HTML/JSON Prepaid API</p>
      </div>

      <div class="filters-panel">
        <div class="filter-group">
          <label>🔍 Search</label>
          <input type="text" id="search" placeholder="Search guides...">
        </div>
        <div class="filter-group">
          <label>🌐 Language</label>
          <select id="lang-filter"><option value="">All Languages</option></select>
        </div>
        <div class="filter-group">
          <label>📂 Category</label>
          <select id="cat-filter"><option value="">All Categories</option></select>
        </div>
      </div>

      <div class="guides-list" id="guides-list"></div>
    </div>

    <!-- Welcome Area -->
    <div class="welcome-area">
      <div class="welcome-content">
        <h1>👈 Select a Guide</h1>
        <p>Browse guides from the sidebar and click "Open Guide" to view content</p>
      </div>
    </div>
  </div>

  <!-- Guide Content Modal -->
  <div id="guide-modal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <span id="modal-guide-name">Guide Content</span>
      </div>

      <div class="quota-info" id="quota-info" style="display: none;">
        📊 Remaining Quota: <strong id="quota-value">--</strong>
      </div>

      <div class="modal-controls">
        <div class="control-group">
          <label>📋 Filter by Headings</label>
          <input type="text" id="headings-filter" placeholder="e.g., 2,3,4 (leave empty for all)">
          <small style="color: #6c757d; font-size: 11px;">See Heading Reference section</small>
        </div>

        <div class="control-group">
          <label>🔢 Heading Format</label>
          <select id="heading-format">
            <option value="normal">Normal</option>
            <option value="sequential">Sequential</option>
          </select>
        </div>

        <div class="control-group">
          <label>🎨 Mode</label>
          <select id="mode-select">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div class="control-group">
          <label>📏 Heading Font Size</label>
          <input type="number" id="heading-size" value="24" min="16" max="40">
        </div>

        <div class="control-group">
          <label>🎨 Heading Color</label>
          <input type="color" id="heading-color" value="#333333">
        </div>

        <div class="control-group">
          <label>📏 Sub-heading Font Size</label>
          <input type="number" id="subheading-size" value="18" min="14" max="30">
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn btn-primary" onclick="viewJSON()">📄 View JSON</button>
        <button class="btn btn-primary" onclick="viewHTML()">🌐 View HTML</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  </div>

  <script>
    const API_BASE = 'https://appapi.youguide.com';
    const YOUR_TOKEN = '468374ef8319516c3602f71da3196de3b57224ca06db6cf30751225a12688f0a'; // HTML/JSON Prepaid Token
    let currentGuideId = null;
    let currentGuideName = '';
    let allGuides = [];

    async function init() {
      await loadLanguages();
      await loadCategories();
      await loadGuides();
      setupEventListeners();
    }

    function setupEventListeners() {
      document.getElementById('search').addEventListener('input', filterGuides);
      document.getElementById('lang-filter').addEventListener('change', loadGuides);
      document.getElementById('cat-filter').addEventListener('change', loadGuides);
    }

    function openGuide(guideId, guideName) {
      currentGuideId = guideId;
      currentGuideName = guideName;
      document.getElementById('modal-guide-name').textContent = guideName;
      document.getElementById('guide-modal').classList.add('show');
    }

    function closeModal() {
      document.getElementById('guide-modal').classList.remove('show');
      currentGuideId = null;
    }

    async function loadLanguages() {
      try {
        const response = await fetch(\`\${API_BASE}/api/travel-content/languages\`, {
          headers: { 'Authorization': \`Bearer \${YOUR_TOKEN}\` }
        });
        const response_data = await response.json();
        const languages = Array.isArray(response_data) ? response_data : response_data.data;
        const select = document.getElementById('lang-filter');
        if (Array.isArray(languages)) {
          languages.forEach(lang => {
            select.innerHTML += \`<option value="\${lang.code}">\${lang.name}</option>\`;
          });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    async function loadCategories() {
      try {
        const response = await fetch(\`\${API_BASE}/api/travel-content/categories\`, {
          headers: { 'Authorization': \`Bearer \${YOUR_TOKEN}\` }
        });
        const response_data = await response.json();
        const categories = Array.isArray(response_data) ? response_data : response_data.data;
        const select = document.getElementById('cat-filter');
        if (Array.isArray(categories)) {
          categories.forEach(cat => {
            select.innerHTML += \`<option value="\${cat._id}">\${cat.name}</option>\`;
          });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    async function loadGuides() {
      const list = document.getElementById('guides-list');
      list.innerHTML = '<div class="loading">Loading...</div>';

      try {
        const lang = document.getElementById('lang-filter').value;
        const cat = document.getElementById('cat-filter').value;

        let url = \`\${API_BASE}/api/travel-content/guides?limit=100\`;
        if (lang) url += \`&lang=\${lang}\`;
        else url += \`&lang=en\`;
        if (cat) url += \`&category_id=\${cat}\`;

        const response = await fetch(url, {
          headers: { 'Authorization': \`Bearer \${YOUR_TOKEN}\` }
        });
        const data = await response.json();
        allGuides = data.books;

        renderGuidesList(allGuides);
      } catch (error) {
        list.innerHTML = '<div class="loading">Error loading guides</div>';
      }
    }

    function filterGuides() {
      const search = document.getElementById('search').value.toLowerCase();
      const filtered = allGuides.filter(g =>
        g.name.toLowerCase().includes(search) ||
        g.city.toLowerCase().includes(search) ||
        g.country.toLowerCase().includes(search)
      );
      renderGuidesList(filtered);
    }

    function renderGuidesList(guides) {
      const list = document.getElementById('guides-list');

      if (guides.length === 0) {
        list.innerHTML = '<div class="loading">No guides found</div>';
        return;
      }

      list.innerHTML = '';
      guides.forEach(guide => {
        const item = document.createElement('div');
        item.className = 'guide-item';
        item.innerHTML = \`
          <div class="guide-item-title">\${guide.name}</div>
          <div class="guide-item-meta">📍 \${guide.city}, \${guide.country} • \${guide.lang_short || 'EN'}</div>
          <div class="guide-item-price">€\${guide.price ? guide.price.toFixed(2) : '0.00'}</div>
          <button class="open-guide-btn" onclick="openGuide('\${guide._id}', '\${guide.name.replace(/'/g, "\\'")}')">
            📖 Open Guide
          </button>
        \`;
        list.appendChild(item);
      });
    }

    async function viewJSON() {
      if (!currentGuideId) return;

      try {
        const headings = document.getElementById('headings-filter').value.trim();
        const headingFormat = document.getElementById('heading-format').value;

        let url = \`\${API_BASE}/api/travel-guides/digital/content/data/\${currentGuideId}\`;
        const params = new URLSearchParams();
        if (headings) params.append('headings', headings);
        if (headingFormat) params.append('heading_format', headingFormat);
        if (params.toString()) url += '?' + params.toString();

        const response = await fetch(url, {
          headers: { 'Authorization': \`Bearer \${YOUR_TOKEN}\` }
        });
        const data = await response.json();

        // Update quota
        document.getElementById('quota-info').style.display = 'block';
        document.getElementById('quota-value').textContent = data.access_info.remaining_quota;

        // Open JSON in a popup window
        const popup = window.open('', 'JSON Content', 'width=800,height=600,scrollbars=yes');
        popup.document.write(\`
          <html>
          <head>
            <title>JSON Content - \${data.guide.name}</title>
            <style>
              body { font-family: monospace; padding: 20px; background: #282c34; color: #abb2bf; }
              pre { white-space: pre-wrap; word-wrap: break-word; line-height: 1.5; }
              h1 { color: #61dafb; }
            </style>
          </head>
          <body>
            <h1>📄 JSON Content: \${data.guide.name}</h1>
            <p>Remaining Quota: \${data.access_info.remaining_quota}</p>
            <p>Heading Format: \${headingFormat || 'normal'}</p>
            <pre>\${JSON.stringify(data, null, 2)}</pre>
          </body>
          </html>
        \`);
        popup.document.close();
      } catch (error) {
        alert('Error loading JSON content');
        console.error('Error:', error);
      }
    }

    async function viewHTML() {
      if (!currentGuideId) return;

      try {
        const params = new URLSearchParams();
        const headings = document.getElementById('headings-filter').value.trim();
        const headingFormat = document.getElementById('heading-format').value;
        const mode = document.getElementById('mode-select').value;
        const headingSize = document.getElementById('heading-size').value;
        const headingColor = document.getElementById('heading-color').value;
        const subheadingSize = document.getElementById('subheading-size').value;

        if (headings) params.append('headings', headings);
        if (headingFormat) params.append('heading_format', headingFormat);
        params.append('mode', mode);
        params.append('heading_font_size', headingSize);
        params.append('heading_color', headingColor.replace('#', ''));
        params.append('sub_heading_font_size', subheadingSize);

        const url = \`\${API_BASE}/api/travel-guides/digital/content/view/\${currentGuideId}?\` + params.toString();

        const response = await fetch(url, {
          headers: { 'Authorization': \`Bearer \${YOUR_TOKEN}\` }
        });

        const htmlContent = await response.text();

        // Open HTML in new page
        const newPage = window.open('', '_blank');
        newPage.document.write(htmlContent);
        newPage.document.close();
      } catch (error) {
        alert('Error loading HTML view');
        console.error('Error:', error);
      }
    }

    // Initialize app when DOM is fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  </script>
</body>
</html>`}</pre>
        </div>
      </Card>
          </>
        )}

        {showHtmlPaid && (
          <>
            <Divider orientation="left">4. HTML/JSON Paid API - Complete Paid Application</Divider>

            <Card style={{ marginBottom: 24, backgroundColor: '#f9f9f9' }}>
        <Title level={4}>Full HTML Application - JSON/HTML Paid with All Features</Title>
        <Paragraph type="secondary">
          Features: Guide listing with filters, Payment via Stripe, Content viewing with heading filters and styling options, Transaction tracking
        </Paragraph>
        <div style={{ background: '#fff0f6', padding: '12px', borderRadius: '4px', marginBottom: '15px', border: '1px solid #ffadd2' }}>
          <Text strong style={{ color: '#c41d7f' }}>✅ WORKING DEMO - Full Featured</Text>
          <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#eb2f96' }}>
            This snippet contains a <strong>real, active API token</strong> for paid HTML/JSON content.
            Complete solution: Browse guides, pay via Stripe, view content with customizable styling and filters!
          </p>
        </div>

        <Card style={{ marginBottom: '15px', backgroundColor: '#fff0f6', border: '1px solid #ffadd2' }}>
          <Text strong>📡 APIs Used in this Snippet:</Text>
          <ul style={{ marginTop: '10px', marginBottom: '10px', lineHeight: '1.8' }}>
            <li><Text code>GET /api/travel-content/languages</Text> - Fetch available languages</li>
            <li><Text code>GET /api/travel-content/categories</Text> - Fetch categories</li>
            <li><Text code>GET /api/travel-content/guides</Text> - List guides with filters</li>
            <li><Text code>POST /api/travel-guides/digital/secure/checkout</Text> - Create Stripe checkout (specify JSON/HTML content type)</li>
            <li><Text code>GET /api/travel-guides/digital/secure/data</Text> - Get JSON content after payment with heading filters</li>
            <li><Text code>GET /api/travel-guides/digital/secure/view</Text> - Get styled HTML view after payment</li>
          </ul>
        </Card>

        <Button
          type="primary"
          icon={<ApiOutlined />}
          size="large"
          onClick={() => openPreview(document.getElementById('html-paid-html').textContent)}
          style={{ marginBottom: '15px', width: '100%', height: '45px', fontSize: '16px', background: '#eb2f96', borderColor: '#eb2f96' }}
        >
          🚀 View Live Design
        </Button>

        <div className="code-block" style={{ backgroundColor: '#1e1e1e', padding: '16px', borderRadius: '4px', overflow: 'auto' }}>
          <pre id="html-paid-html" style={{ color: '#d4d4d4', margin: 0, fontSize: '13px' }}>{`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>YouGuide - HTML/JSON Paid API</title>
  <style>
    /* Similar styling to previous examples */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow: hidden; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { font-size: 32px; margin-bottom: 10px; }
    .filters { background: #f8f9fa; padding: 25px 30px; border-bottom: 2px solid #e9ecef; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; position: relative; z-index: 100; }
    .filter-group { position: relative; z-index: 100; }
    .filter-group label { display: block; font-weight: 600; margin-bottom: 8px; color: #495057; font-size: 14px; }
    .filter-group select, .filter-group input { width: 100%; padding: 10px 12px; border: 2px solid #dee2e6; border-radius: 6px; font-size: 14px; position: relative; z-index: 100; }
    .filter-group select:focus, .filter-group input:focus { z-index: 200; }
    .guides-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; padding: 30px; }
    @media (min-width: 1200px) { .guides-grid { grid-template-columns: repeat(4, 1fr); } }
    @media (min-width: 768px) and (max-width: 1199px) { .guides-grid { grid-template-columns: repeat(3, 1fr); } }
    .guide-card { background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; transition: all 0.3s; }
    .guide-card:hover { transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.15); }
    .guide-image { width: 120px; height: 180px; object-fit: cover; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0 auto; display: block; }
    .guide-content { padding: 12px; }
    .guide-title { font-size: 14px; font-weight: bold; color: #2c3e50; margin-bottom: 6px; line-height: 1.3; }
    .guide-price { font-size: 18px; font-weight: bold; color: #667eea; margin: 10px 0; }
    .purchase-btn { width: 100%; padding: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; }
    .purchase-btn:hover { transform: scale(1.02); }
    .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 1000; align-items: center; justify-content: center; }
    .modal.show { display: flex; }
    .modal-content { background: white; border-radius: 12px; padding: 30px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto; }
    .modal-header { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
    .content-controls { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
    .control-group label { display: block; font-size: 12px; font-weight: 600; margin-bottom: 5px; }
    .control-group input, .control-group select { width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px; }
    .btn { padding: 10px 20px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; margin: 5px; }
    .btn-primary { background: #667eea; color: white; }
    .btn-secondary { background: #e9ecef; color: #495057; }
    .content-viewer { background: #f8f9fa; padding: 20px; border-radius: 8px; max-height: 400px; overflow-y: auto; margin: 20px 0; }
    .loading { text-align: center; padding: 40px; color: #6c757d; }
  </style>
</head>
<body>
  <div class="container" id="app">
    <!-- Browse Page -->
    <div id="browse-page">
      <div class="header">
        <h1>🌍 YouGuide - Pay Per Guide</h1>
        <p>HTML/JSON Paid API - Purchase and view travel guides</p>
      </div>

      <div class="filters">
        <div class="filter-group">
          <label>🔍 Search</label>
          <input type="text" id="search" placeholder="Search guides...">
        </div>
        <div class="filter-group">
          <label>🌐 Language</label>
          <select id="lang-filter"><option value="">All</option></select>
        </div>
        <div class="filter-group">
          <label>📚 Category</label>
          <select id="cat-filter"><option value="">All</option></select>
        </div>
      </div>

      <div id="guides-grid" class="guides-grid"></div>
    </div>

    <!-- Success Page (After Payment) -->
    <div id="success-page" style="display: none;">
      <div class="header">
        <h1>✅ Purchase Successful!</h1>
        <p>Your guide content is ready to view</p>
      </div>
      <div style="padding: 30px;">
        <h2 id="purchased-guide-name"></h2>
        <p style="color: #6c757d; margin: 10px 0;">Transaction ID: <span id="transaction-id"></span></p>

        <div class="content-controls">
          <div class="control-group">
            <label>📋 Filter Headings (comma-separated)</label>
            <input type="text" id="headings" placeholder="e.g., 2,3,4">
          </div>
          <div class="control-group">
            <label>🎨 Mode</label>
            <select id="mode">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div class="control-group">
            <label>📏 Heading Size</label>
            <input type="number" id="h-size" value="26" min="16" max="40">
          </div>
          <div class="control-group">
            <label>🎨 Heading Color</label>
            <input type="color" id="h-color" value="#667eea">
          </div>
        </div>

        <div style="display: flex; gap: 10px; margin: 20px 0;">
          <button class="btn btn-primary" onclick="viewContentJSON()">View as JSON</button>
          <button class="btn btn-primary" onclick="viewContentHTML()">View as HTML</button>
          <button class="btn btn-secondary" onclick="location.reload()">← Back to Guides</button>
        </div>

        <div id="content-viewer" class="content-viewer" style="display: none;"></div>
      </div>
    </div>
  </div>

  <!-- Purchase Modal -->
  <div id="purchase-modal" class="modal">
    <div class="modal-content">
      <div class="modal-header">💳 Select Content Type</div>
      <p style="margin-bottom: 20px;"><strong id="modal-guide-name"></strong></p>
      <p style="color: #6c757d; margin-bottom: 20px;">Choose the format you want to purchase:</p>
      <div style="display: flex; gap: 10px;">
        <button class="btn btn-primary" style="flex: 1;" onclick="purchase('json')">
          📄 JSON Content
        </button>
        <button class="btn btn-primary" style="flex: 1;" onclick="purchase('html')">
          🌐 HTML Content
        </button>
      </div>
      <button class="btn btn-secondary" style="width: 100%; margin-top: 15px;" onclick="closeModal()">Cancel</button>
    </div>
  </div>

  <script>
    const API_BASE = 'https://appapi.youguide.com';
    const YOUR_TOKEN = 'b63117ef75835ba756fccfbe12ba7c3d0a813743a1fc0ab96eb1cce90f1769de'; // HTML/JSON Paid Token
    let selectedGuide = null;

    // Check if returning from payment
    window.addEventListener('DOMContentLoaded', () => {
      if (new URLSearchParams(window.location.search).get('payment') === 'success') {
        showSuccessPage();
      } else {
        init();
      }
    });

    async function init() {
      await loadLanguages();
      await loadCategories();
      await loadGuides();
      setupFilters();
    }

    async function loadLanguages() {
      try {
        const response = await fetch(\`\${API_BASE}/api/travel-content/languages\`, {
          headers: { 'Authorization': \`Bearer \${YOUR_TOKEN}\` }
        });
        const response_data = await response.json();
        const langs = Array.isArray(response_data) ? response_data : response_data.data;
        const select = document.getElementById('lang-filter');
        if (Array.isArray(langs)) {
          langs.forEach(l => select.innerHTML += \`<option value="\${l.code}">\${l.name}</option>\`);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    async function loadCategories() {
      try {
        const response = await fetch(\`\${API_BASE}/api/travel-content/categories\`, {
          headers: { 'Authorization': \`Bearer \${YOUR_TOKEN}\` }
        });
        const response_data = await response.json();
        const cats = Array.isArray(response_data) ? response_data : response_data.data;
        const select = document.getElementById('cat-filter');
        if (Array.isArray(cats)) {
          cats.forEach(c => select.innerHTML += \`<option value="\${c._id}">\${c.name}</option>\`);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    function setupFilters() {
      ['search', 'lang-filter', 'cat-filter'].forEach(id => {
        document.getElementById(id).addEventListener('change', loadGuides);
        document.getElementById(id).addEventListener('input', debounce(loadGuides, 500));
      });
    }

    function debounce(func, wait) {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
      };
    }

    async function loadGuides() {
      const grid = document.getElementById('guides-grid');
      grid.innerHTML = '<div class="loading">Loading guides...</div>';

      try {
        const search = document.getElementById('search').value;
        const lang = document.getElementById('lang-filter').value;
        const cat = document.getElementById('cat-filter').value;

        let url = \`\${API_BASE}/api/travel-content/guides?limit=20\`;
        if (search) url += \`&query=\${encodeURIComponent(search)}\`;
        if (lang) url += \`&lang=\${lang}\`;
        else url += \`&lang=en\`;
        if (cat) url += \`&category_id=\${cat}\`;

        const response = await fetch(url, {
          headers: { 'Authorization': \`Bearer \${YOUR_TOKEN}\` }
        });
        const data = await response.json();

        grid.innerHTML = '';
        data.books.forEach(guide => {
          grid.innerHTML += \`
            <div class="guide-card">
              <img class="guide-image" src="\${guide.imagePath || ''}" alt="\${guide.name}" onerror="this.style.display='none'">
              <div class="guide-content">
                <div class="guide-title">\${guide.name}</div>
                <div style="color: #6c757d; margin: 10px 0;">📍 \${guide.city}, \${guide.country}</div>
                <div class="guide-price">€\${guide.price.toFixed(2)}</div>
                <button class="purchase-btn" onclick='openPurchaseModal("\${guide._id}", "\${guide.name.replace(/'/g, "\\'")}",  \${guide.price})'>
                  Buy HTML JSON
                </button>
              </div>
            </div>
          \`;
        });
      } catch (error) {
        grid.innerHTML = '<div class="loading">Error loading guides</div>';
      }
    }

    function openPurchaseModal(guideId, guideName, price) {
      selectedGuide = { id: guideId, name: guideName, price };
      document.getElementById('modal-guide-name').textContent = \`\${guideName} - €\${price}\`;
      document.getElementById('purchase-modal').classList.add('show');
    }

    function closeModal() {
      document.getElementById('purchase-modal').classList.remove('show');
    }

    async function purchase(contentType) {
      if (!selectedGuide) return;

      try {
        const response = await fetch(\`\${API_BASE}/api/travel-guides/digital/secure/checkout\`, {
          method: 'POST',
          headers: {
            'Authorization': \`Bearer \${YOUR_TOKEN}\`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            guide_id: selectedGuide.id,
            content_type: contentType
          })
        });

        if (!response.ok) throw new Error('Checkout failed');

        const data = await response.json();

        // Save for later
        localStorage.setItem('transaction_id', data.transaction_id);
        localStorage.setItem('guide_id', selectedGuide.id);
        localStorage.setItem('guide_name', selectedGuide.name);
        localStorage.setItem('content_type', contentType);

        // Open Stripe checkout in new tab
        window.open(data.checkout_url, '_blank');
        alert('Checkout opened in new tab. After payment, refresh this page to view content.');
      } catch (error) {
        alert('Purchase failed. Please try again.');
        console.error('Error:', error);
      }
    }

    function showSuccessPage() {
      document.getElementById('browse-page').style.display = 'none';
      document.getElementById('success-page').style.display = 'block';

      document.getElementById('purchased-guide-name').textContent = localStorage.getItem('guide_name') || 'Your Guide';
      document.getElementById('transaction-id').textContent = localStorage.getItem('transaction_id') || 'N/A';
    }

    async function viewContentJSON() {
      const viewer = document.getElementById('content-viewer');
      viewer.style.display = 'block';
      viewer.innerHTML = '<div class="loading">Loading JSON content...</div>';

      try {
        const transactionId = localStorage.getItem('transaction_id');
        const guideId = localStorage.getItem('guide_id');
        const headings = document.getElementById('headings').value.trim();

        let url = \`\${API_BASE}/api/travel-guides/digital/secure/data?transaction_id=\${transactionId}&guide_id=\${guideId}\`;
        if (headings) url += \`&headings=\${headings}\`;

        const response = await fetch(url, {
          headers: { 'Authorization': \`Bearer \${YOUR_TOKEN}\` }
        });
        const data = await response.json();

        let html = '';
        if (data.content.overview) {
          html += \`<div style="margin-bottom: 20px;"><h3>Overview</h3><p>\${data.content.overview}</p></div>\`;
        }

        data.content.sections.forEach(section => {
          html += \`<div style="margin-bottom: 20px;"><h3>\${section.heading}</h3><div>\${section.content}</div></div>\`;
        });

        viewer.innerHTML = html;
      } catch (error) {
        viewer.innerHTML = '<div class="loading">Error loading content</div>';
      }
    }

    async function viewContentHTML() {
      const viewer = document.getElementById('content-viewer');
      viewer.style.display = 'block';
      viewer.innerHTML = '<div class="loading">Loading HTML view...</div>';

      try {
        const transactionId = localStorage.getItem('transaction_id');
        const guideId = localStorage.getItem('guide_id');
        const headings = document.getElementById('headings').value.trim();
        const mode = document.getElementById('mode').value;
        const hSize = document.getElementById('h-size').value;
        const hColor = document.getElementById('h-color').value.replace('#', '');

        const params = new URLSearchParams({
          transaction_id: transactionId,
          guide_id: guideId,
          mode,
          heading_font_size: hSize,
          heading_color: hColor
        });
        if (headings) params.append('headings', headings);

        const url = \`\${API_BASE}/api/travel-guides/digital/secure/view?\` + params.toString();

        const response = await fetch(url, {
          headers: { 'Authorization': \`Bearer \${YOUR_TOKEN}\` }
        });

        const htmlContent = await response.text();

        viewer.innerHTML = \`<iframe style="width: 100%; height: 500px; border: 1px solid #dee2e6; border-radius: 8px;" srcdoc="\${htmlContent.replace(/"/g, '&quot;')}"></iframe>\`;
      } catch (error) {
        viewer.innerHTML = '<div class="loading">Error loading HTML view</div>';
      }
    }
  </script>
</body>
</html>`}</pre>
        </div>
      </Card>
          </>
        )}

        <Card style={{ marginBottom: 24, backgroundColor: '#fff3cd', border: '1px solid #ffc107' }}>
          <Title level={4}>💡 Implementation Notes</Title>
        <ul style={{ marginLeft: 20, lineHeight: '2' }}>
          <li><strong>🎉 READY TO USE:</strong> All code snippets above contain <strong>real, active API tokens</strong> - copy any snippet and run it immediately in your browser!</li>
          <li><strong>Token Details:</strong> Each snippet uses a different token (PDF Prepaid, PDF Paid, HTML/JSON Prepaid, HTML/JSON Paid) to demonstrate all API types</li>
          <li><strong>Prepaid APIs:</strong> Automatically deduct quota on first access to each guide</li>
          <li><strong>Paid APIs:</strong> Integrate Stripe checkout - set your success URL to redirect back with <Text code>?payment=success</Text> parameter</li>
          <li><strong>Heading Filters:</strong> Use comma-separated numbers (e.g., "2,3,4") based on the Heading Reference section for each category</li>
          <li><strong>Mode Options:</strong> "light" or "dark" for different themes</li>
          <li><strong>Styling:</strong> Customize heading sizes, colors, and sub-heading styles</li>
          <li><strong>Content Types:</strong> JSON returns structured data, HTML returns ready-to-display content</li>
          <li><strong>Mobile Responsive:</strong> All snippets use responsive design patterns</li>
          <li><strong>Error Handling:</strong> Basic error handling included - enhance for production use</li>
        </ul>
      </Card>
      </div>
    );
  };

  const renderHtmlJsonPaidApis = () => (
    <div>
      <Title level={2}>HTML/JSON Paid API</Title>
      <Paragraph>
        These endpoints are for tokens with <Tag color="green">type=html_json</Tag> and <Tag color="orange">payment_type=paid</Tag>
      </Paragraph>

      <Divider orientation="left">Common Endpoints</Divider>

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/languages',
        'Get supported languages',
        [],
        `[
  { "name": "English", "code": "en" },
  { "name": "Arabic", "code": "ar" },
  { "name": "Chinese", "code": "zh" }
]`
      )}

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/categories',
        'Get categories',
        [],
        `[
  {
    "_id": "cat1",
    "name": "City Trips",
    "slug": "city-trips",
    "image": "https://presigned-url..."
  }
]`
      )}

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/guides',
        'List guides',
        [
          { name: 'category_id', description: 'Filter by category', required: false },
          { name: 'lang', description: 'Filter by language code', required: false },
          { name: 'page', description: 'Page number', required: false },
        ],
        `{
  "currentPage": 1,
  "pageSize": 20,
  "totalPages": 8,
  "totalBooks": 150,
  "books": [
    {
      "_id": "guide123",
      "name": "Amsterdam Travel Guide",
      "description": "Discover the vibrant capital of Netherlands with this comprehensive travel guide. Explore historic canals, world-class museums, charming neighborhoods, and the unique Dutch culture.",
      "category": { "_id": "cat1", "name": "City Trips" },
      "city": "Amsterdam",
      "country": "Netherlands",
      "price": 9.99,
      "imagePath": "https://presigned-url..."
    }
  ]
}`
      )}

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/guides/:guideId',
        'Get guide details',
        [
          { name: 'guideId', description: 'Guide ID', required: true },
        ],
        `{
  "success": true,
  "guide": {
    "_id": "guide123",
    "name": "Amsterdam Travel Guide",
    "description": "Complete travel guide for Amsterdam...",
    "city": "Amsterdam",
    "country": "Netherlands",
    "price": 9.99,
    "category": {
      "_id": "cat1",
      "name": "City Trips"
    },
    "lang": "English",
    "lang_short": "en",
    "has_pdf": true,
    "has_json": true
  }
}`
      )}

      <Divider orientation="left">Payment & Digital Content Access</Divider>

      {renderApiEndpoint(
        'POST',
        '/api/travel-guides/digital/secure/checkout',
        'Generate Stripe checkout link for purchasing digital guide access',
        [
          { name: 'guide_id', description: 'Guide ID (in request body)', required: true },
          { name: 'content_type', description: 'Type: "html" or "json" (in request body)', required: true },
        ],
        `{
  "success": true,
  "checkout_url": "https://checkout.stripe.com/...",
  "transaction_id": "uuid-here",
  "content_type": "html",
  "expires_in": 1800
}`
      )}

      {renderApiEndpoint(
        'GET',
        '/api/travel-guides/digital/secure/data',
        'Get JSON data using transaction ID after payment',
        [
          { name: 'transaction_id', description: 'Transaction ID', required: true },
          { name: 'guide_id', description: 'Guide ID', required: true },
          { name: 'headings', description: 'Filter content by heading numbers (comma-separated, e.g., headings=2,3,4). See Heading Reference section for category-specific heading numbers.', required: false },
          { name: 'heading_format', description: 'Format for headings: "normal" (default) or "sequential" (numbered)', required: false },
        ],
        `{
  "success": true,
  "guide": {
    "_id": "672a73fc3ff8e4cf3ba9084a",
    "name": "Amsterdam Travel Guide",
    "city": "Amsterdam",
    "country": "Netherlands",
    "category": "City Trips",
    "language": "en"
  },
  "content": {
    "overview": "Welcome to Amsterdam, the vibrant capital of the Netherlands! This guide will help you discover the city's historic canals, world-renowned museums, and unique Dutch culture.",
    "sections": [
      {
        "heading": "1. Introduction",
        "subheadings": [
          {
            "title": "Welcome to Amsterdam",
            "content": "<p>Amsterdam is a city of contrasts where historic architecture meets modern innovation...</p>"
          }
        ]
      },
      {
        "heading": "2. Navigation",
        "subheadings": [
          {
            "title": "Getting Around",
            "content": "<p>Amsterdam has an excellent public transport system...</p>"
          }
        ]
      }
    ],
    "places": [
      {
        "name": "Van Gogh Museum",
        "address": "Museumplein 6, 1071 DJ Amsterdam",
        "coordinates": { "lat": 52.3584, "lng": 4.8811 },
        "category": "Museum"
      }
    ]
  },
  "transaction": {
    "transaction_id": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 12.99,
    "currency": "eur",
    "paid_at": "2025-01-07T10:30:00.000Z",
    "status": "completed"
  }
}`
      )}

      <Card style={{ marginBottom: 24, backgroundColor: '#f0f8ff', border: '1px solid #1890ff' }}>
        <Text>
          <strong>Note:</strong> To filter content by specific headings, refer to the{' '}
          <Button type="link" onClick={() => setSelectedSection('heading-reference')} style={{ padding: 0, height: 'auto' }}>
            Heading Reference
          </Button>{' '}
          section to see available headings for each category.
        </Text>
      </Card>

      <Card style={{ marginBottom: 24, backgroundColor: '#fff9e6', border: '1px solid #ffd666' }}>
        <div style={{ marginBottom: 12 }}>
          <Text strong style={{ fontSize: 14 }}>📋 Heading Format Parameter Explained:</Text>
        </div>
        <Text>
          The <Text code>heading_format</Text> parameter controls how heading numbers are displayed when using the <Text code>headings</Text> filter:
        </Text>
        <div style={{ marginTop: 12, marginBottom: 12 }}>
          <div style={{ background: '#f6f6f6', padding: 12, borderRadius: 4, marginBottom: 8 }}>
            <Text strong>Example: headings=2,3,4</Text>
          </div>
          <ul style={{ marginLeft: 20, lineHeight: 2 }}>
            <li>
              <Text code>heading_format=normal</Text> (default): Headings keep their original numbers → <Text strong>2, 3, 4</Text>
            </li>
            <li>
              <Text code>heading_format=sequential</Text>: Headings are renumbered sequentially → <Text strong>1, 2, 3</Text>
              <div style={{ marginLeft: 20, marginTop: 4, fontSize: 12, color: '#666' }}>
                (Original heading 2 becomes 1, heading 3 becomes 2, heading 4 becomes 3)
              </div>
            </li>
          </ul>
        </div>
        <Text type="secondary" style={{ fontSize: 12 }}>
          💡 Use <Text code>sequential</Text> when you want filtered content to appear as a continuous numbered sequence starting from 1.
        </Text>
      </Card>

      {renderApiEndpoint(
        'GET',
        '/api/travel-guides/digital/secure/view',
        'Get HTML version using transaction ID after payment',
        [
          { name: 'transaction_id', description: 'Transaction ID', required: true },
          { name: 'guide_id', description: 'Guide ID', required: true },
          { name: 'headings', description: 'Filter content by heading numbers (comma-separated, e.g., headings=2,3,4). See Heading Reference section for category-specific heading numbers.', required: false },
          { name: 'heading_format', description: 'Format for headings: "normal" (default) or "sequential" (numbered)', required: false },
          { name: 'heading_font_size', description: 'Heading font size (optional)', required: false },
          { name: 'heading_color', description: 'Heading color (optional)', required: false },
          { name: 'mode', description: 'light or dark (optional)', required: false },
        ],
        `Returns full HTML page with styling`
      )}

      <Card style={{ marginBottom: 24, backgroundColor: '#f0f8ff', border: '1px solid #1890ff' }}>
        <Text>
          <strong>Note:</strong> To filter content by specific headings, refer to the{' '}
          <Button type="link" onClick={() => setSelectedSection('heading-reference')} style={{ padding: 0, height: 'auto' }}>
            Heading Reference
          </Button>{' '}
          section to see available headings for each category.
        </Text>
      </Card>

      <Divider orientation="left">Usage Statistics</Divider>

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/stats',
        'Get usage statistics for your token',
        [],
        `{
  "success": true,
  "data": {
    "token_info": {
      "name": "Client Name",
      "company_name": "Company Inc",
      "type": "html_json",
      "payment_type": "paid",
      "is_active": true
    },
    "usage_summary": {
      "total_accesses": 150,
      "unique_guides_accessed": 45,
      "remaining_quota": 55
    },
    "graphs": {
      "daily_usage": [
        { "date": "2025-01-01", "count": 10 }
      ],
      "category_breakdown": [
        { "category_name": "City Trips", "count": 80 }
      ]
    }
  }
}`
      )}
    </div>
  );

  const renderContent = () => {
    switch (selectedSection) {
      case 'overview':
        return renderOverview();
      case 'heading-reference':
        return renderHeadingReference();
      case 'pdf-free':
        return renderPdfFreeApis();
      case 'pdf-paid':
        return renderPdfPaidApis();
      case 'html-json-free':
        return renderHtmlJsonFreeApis();
      case 'html-json-paid':
        return renderHtmlJsonPaidApis();
      case 'code-snippets':
      case 'snippet-pdf-prepaid':
      case 'snippet-pdf-paid':
      case 'snippet-html-prepaid':
      case 'snippet-html-paid':
        return renderCodeSnippets();
      default:
        return renderOverview();
    }
  };

  const openPreview = (htmlContent) => {
    setCurrentPreviewHtml(htmlContent);
    setPreviewDrawerVisible(true);
  };

  const renderSidebarContent = () => (
    <>
      <div className="api-doc-logo">
        <Title level={4} style={{ color: '#fff', margin: '16px', textAlign: 'center' }}>
          {!isMobile && collapsed ? 'API' : 'YouGuide API'}
        </Title>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedSection]}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={250}
          className="desktop-sidebar"
          style={{
            background: '#001529',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            overflow: 'auto',
          }}
        >
          {renderSidebarContent()}
        </Sider>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          title="YouGuide API"
          placement="left"
          onClose={() => setMobileDrawerVisible(false)}
          open={mobileDrawerVisible}
          className="mobile-drawer"
          styles={{
            body: { padding: 0, background: '#001529' },
            header: { background: '#001529', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)' }
          }}
        >
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedSection]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ background: '#001529', border: 'none' }}
          />
        </Drawer>
      )}

      <Layout style={{ marginLeft: !isMobile ? (collapsed ? 80 : 250) : 0, transition: 'margin-left 0.2s' }}>
        {/* Mobile Header with Menu Button */}
        {isMobile && (
          <div className="mobile-header">
            <Button
              type="primary"
              icon={<MenuOutlined />}
              onClick={() => setMobileDrawerVisible(true)}
              className="mobile-menu-btn"
            >
              Menu
            </Button>
            <Title level={4} style={{ margin: 0, color: '#001529' }}>
              YouGuide API Docs
            </Title>
          </div>
        )}

        <Content className="api-content" style={{ padding: isMobile ? '16px' : '24px', background: '#f0f2f5', minHeight: '100vh' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {renderContent()}
          </div>
        </Content>
      </Layout>

      {/* Preview Drawer */}
      <Drawer
        title="Live Code Preview"
        placement="right"
        width={isMobile ? '100%' : 900}
        height={900}
        onClose={() => setPreviewDrawerVisible(false)}
        open={previewDrawerVisible}
        styles={{
          body: { padding: 0 }
        }}
      >
        <iframe
          srcDoc={currentPreviewHtml}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block'
          }}
          title="Code Preview"
        />
      </Drawer>
    </Layout>
  );
};

export default ApiDocumentation;
