import React, { useState } from 'react';
import { Layout, Menu, Typography, Card, Tag, Divider, Space, Button } from 'antd';
import {
  ApiOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  CodeOutlined,
  DollarOutlined,
  FreeOutlined,
} from '@ant-design/icons';
import './ApiDocumentation.css';

const { Sider, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const ApiDocumentation = () => {
  const [selectedSection, setSelectedSection] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);

  const BASE_URL = 'https://appapi.youguide.com';

  const menuItems = [
    {
      key: 'overview',
      icon: <FileTextOutlined />,
      label: 'Overview',
    },
    {
      key: 'pdf-free',
      icon: <FilePdfOutlined />,
      label: 'PDF Free API',
    },
    {
      key: 'pdf-paid',
      icon: <DollarOutlined />,
      label: 'PDF Paid API',
    },
    {
      key: 'html-json-free',
      icon: <CodeOutlined />,
      label: 'HTML/JSON Free API',
    },
    {
      key: 'html-json-paid',
      icon: <ApiOutlined />,
      label: 'HTML/JSON Paid API',
    },
  ];

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
            <Tag color="cyan">Free Tokens</Tag>
            <Text>Access /content/* endpoints with pre-paid quota</Text>
          </div>
          <div>
            <Tag color="orange">Paid Tokens</Tag>
            <Text>Access /secure/* endpoints with pay-per-guide via Stripe</Text>
          </div>
        </Space>
      </Card>

      <Card>
        <Title level={4}>Business Flow</Title>
        <Paragraph><strong>For Free Access (payment_type=free):</strong></Paragraph>
        <ol>
          <li>Admin creates token with pre-paid quota (e.g., 100 guides)</li>
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
      <Title level={2}>PDF Free API</Title>
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
      "description": "...",
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
  "totalPages": 8,
  "books": [...]
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
  "guide": { ... }
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
    "currency": "usd"
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
    "usage_summary": { ... },
    "graphs": { ... }
  }
}`
      )}
    </div>
  );

  const renderHtmlJsonFreeApis = () => (
    <div>
      <Title level={2}>HTML/JSON Free API</Title>
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
  "books": [...]
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
  "guide": { ... }
}`
      )}

      <Divider orientation="left">Digital Content Endpoints</Divider>

      {renderApiEndpoint(
        'GET',
        '/api/travel-guides/digital/content/data/:guideId',
        'Get JSON data for the travel guide (deducts quota on first access)',
        [
          { name: 'guideId', description: 'Guide ID', required: true },
        ],
        `{
  "success": true,
  "guide": {
    "_id": "guide123",
    "name": "Amsterdam Guide"
  },
  "content": {
    "overview": "...",
    "sections": [...],
    "places": [...]
  },
  "access_info": {
    "first_access": true,
    "remaining_quota": 99
  }
}`
      )}

      {renderApiEndpoint(
        'GET',
        '/api/travel-guides/digital/content/view/:guideId',
        'Get rendered HTML version of the guide with customizable styling',
        [
          { name: 'guideId', description: 'Guide ID', required: true },
          { name: 'heading_font_size', description: 'Font size for headings (default: 24)', required: false },
          { name: 'heading_color', description: 'Color for headings (default: #333333)', required: false },
          { name: 'sub_heading_font_size', description: 'Font size for sub-headings (default: 18)', required: false },
          { name: 'mode', description: 'Theme mode: light or dark (default: light)', required: false },
        ],
        `Returns full HTML page with applied styling`
      )}

      <Divider orientation="left">Usage Statistics</Divider>

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/stats',
        'Get usage statistics',
        [],
        `{
  "success": true,
  "data": { ... }
}`
      )}
    </div>
  );

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
        `[...]`
      )}

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/categories',
        'Get categories',
        [],
        `[...]`
      )}

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/guides',
        'List guides',
        [],
        `{...}`
      )}

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/guides/:guideId',
        'Get guide details',
        [
          { name: 'guideId', description: 'Guide ID', required: true },
        ],
        `{...}`
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
        ],
        `{
  "success": true,
  "guide": { ... },
  "content": {
    "overview": "...",
    "sections": [...]
  },
  "transaction": {
    "transaction_id": "uuid",
    "amount": 9.99
  }
}`
      )}

      {renderApiEndpoint(
        'GET',
        '/api/travel-guides/digital/secure/view',
        'Get HTML version using transaction ID after payment',
        [
          { name: 'transaction_id', description: 'Transaction ID', required: true },
          { name: 'guide_id', description: 'Guide ID', required: true },
          { name: 'heading_font_size', description: 'Heading font size (optional)', required: false },
          { name: 'heading_color', description: 'Heading color (optional)', required: false },
          { name: 'mode', description: 'light or dark (optional)', required: false },
        ],
        `Returns full HTML page with styling`
      )}

      <Divider orientation="left">Usage Statistics</Divider>

      {renderApiEndpoint(
        'GET',
        '/api/travel-content/stats',
        'Get usage statistics',
        [],
        `{
  "success": true,
  "data": { ... }
}`
      )}
    </div>
  );

  const renderContent = () => {
    switch (selectedSection) {
      case 'overview':
        return renderOverview();
      case 'pdf-free':
        return renderPdfFreeApis();
      case 'pdf-paid':
        return renderPdfPaidApis();
      case 'html-json-free':
        return renderHtmlJsonFreeApis();
      case 'html-json-paid':
        return renderHtmlJsonPaidApis();
      default:
        return renderOverview();
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
        style={{
          background: '#001529',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          overflow: 'auto',
        }}
      >
        <div className="api-doc-logo">
          <Title level={4} style={{ color: '#fff', margin: '16px', textAlign: 'center' }}>
            {collapsed ? 'API' : 'YouGuide API'}
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedSection]}
          items={menuItems}
          onClick={({ key }) => setSelectedSection(key)}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'margin-left 0.2s' }}>
        <Content style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {renderContent()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ApiDocumentation;
