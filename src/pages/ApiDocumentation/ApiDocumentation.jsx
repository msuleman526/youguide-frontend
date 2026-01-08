import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Menu, Typography, Card, Tag, Divider, Space, Button, Drawer, Modal, Dropdown, Input, message } from 'antd';
import {
  ApiOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  CodeOutlined,
  DollarOutlined,
  FreeOutlined,
  MenuOutlined,
  PartitionOutlined,
  DownOutlined,
} from '@ant-design/icons';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
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
  const [flowChartVisible, setFlowChartVisible] = useState(false);
  const [selectedFlowChart, setSelectedFlowChart] = useState(null);

  // Token states for each API type
  const [pdfPrepaidToken, setPdfPrepaidToken] = useState(localStorage.getItem('pdfPrepaidToken') || '');
  const [pdfPaidToken, setPdfPaidToken] = useState(localStorage.getItem('pdfPaidToken') || '');
  const [htmlPrepaidToken, setHtmlPrepaidToken] = useState(localStorage.getItem('htmlPrepaidToken') || '');
  const [htmlPaidToken, setHtmlPaidToken] = useState(localStorage.getItem('htmlPaidToken') || '');

  const saveToken = (type, value) => {
    localStorage.setItem(type, value);
    message.success('Token saved successfully!');
  };

  const flowChartItems = [
    { key: 'pdf-prepaid', label: 'PDF Prepaid Flow' },
    { key: 'pdf-paid', label: 'PDF Paid Flow' },
    { key: 'html-json-prepaid', label: 'HTML/JSON Prepaid Flow' },
    { key: 'html-json-paid', label: 'HTML/JSON Paid Flow' },
  ];

  const handleFlowChartSelect = ({ key }) => {
    setSelectedFlowChart(key);
    setFlowChartVisible(true);
  };

  // Flow chart configurations for React Flow
  const getFlowChartData = (type) => {
    const nodeStyle = {
      padding: 10,
      borderRadius: 8,
      fontSize: 11,
      textAlign: 'center',
      width: 200,
    };

    const flowCharts = {
      'pdf-prepaid': {
        title: 'PDF Prepaid API Flow',
        nodes: [
          { id: '1', position: { x: 250, y: 0 }, data: { label: 'START' }, style: { ...nodeStyle, background: '#d9f7be', border: '2px solid #52c41a' } },
          { id: '2', position: { x: 250, y: 80 }, data: { label: 'GET /api/travel-content/languages' }, style: { ...nodeStyle, background: '#e6f7ff', border: '1px solid #1890ff' } },
          { id: '3', position: { x: 250, y: 160 }, data: { label: 'GET /api/travel-content/categories' }, style: { ...nodeStyle, background: '#e6f7ff', border: '1px solid #1890ff' } },
          { id: '4', position: { x: 250, y: 240 }, data: { label: 'GET /api/travel-content/guides' }, style: { ...nodeStyle, background: '#e6f7ff', border: '1px solid #1890ff' } },
          { id: '5', position: { x: 250, y: 320 }, data: { label: 'User selects guide' }, style: { ...nodeStyle, background: '#fff7e6', border: '1px solid #ffa940' } },
          { id: '6', position: { x: 250, y: 400 }, data: { label: 'GET /api/travel-guides/pdf/content/:guideId' }, style: { ...nodeStyle, background: '#f0f5ff', border: '1px solid #2f54eb' } },
          { id: '7', position: { x: 250, y: 480 }, data: { label: 'VALIDATION\n✓ Token type = pdf?\n✓ Payment = free?\n✓ Category allowed?\n✓ Quota > 0?' }, style: { ...nodeStyle, background: '#fff1f0', border: '2px solid #ff4d4f', width: 220, height: 100 } },
          { id: '8', position: { x: 80, y: 620 }, data: { label: '❌ FAILED\nReturn 403 Error' }, style: { ...nodeStyle, background: '#fff1f0', border: '1px solid #ff4d4f' } },
          { id: '9', position: { x: 420, y: 620 }, data: { label: '✅ PASSED' }, style: { ...nodeStyle, background: '#f6ffed', border: '1px solid #52c41a' } },
          { id: '10', position: { x: 320, y: 720 }, data: { label: 'First access?\nDeduct quota' }, style: { ...nodeStyle, background: '#fffbe6', border: '1px solid #faad14' } },
          { id: '11', position: { x: 520, y: 720 }, data: { label: 'Already accessed?\nNo deduction' }, style: { ...nodeStyle, background: '#f6ffed', border: '1px solid #52c41a' } },
          { id: '12', position: { x: 420, y: 820 }, data: { label: 'Response: PDF Download' }, style: { ...nodeStyle, background: '#d9f7be', border: '1px solid #52c41a' } },
          { id: '13', position: { x: 420, y: 900 }, data: { label: 'END' }, style: { ...nodeStyle, background: '#d9f7be', border: '2px solid #52c41a' } },
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e2-3', source: '2', target: '3', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e3-4', source: '3', target: '4', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e4-5', source: '4', target: '5', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e5-6', source: '5', target: '6', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e6-7', source: '6', target: '7', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e7-8', source: '7', target: '8', label: 'No', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#ff4d4f' } },
          { id: 'e7-9', source: '7', target: '9', label: 'Yes', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#52c41a' } },
          { id: 'e9-10', source: '9', target: '10', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e9-11', source: '9', target: '11', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e10-12', source: '10', target: '12', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e11-12', source: '11', target: '12', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e12-13', source: '12', target: '13', markerEnd: { type: MarkerType.ArrowClosed } },
        ]
      },
      'pdf-paid': {
        title: 'PDF Paid API Flow',
        nodes: [
          { id: '1', position: { x: 300, y: 0 }, data: { label: 'START' }, style: { ...nodeStyle, background: '#d9f7be', border: '2px solid #52c41a' } },
          { id: '2', position: { x: 300, y: 80 }, data: { label: 'Browse Guides\n(languages, categories, guides)' }, style: { ...nodeStyle, background: '#e6f7ff', border: '1px solid #1890ff' } },
          { id: '3', position: { x: 300, y: 170 }, data: { label: 'User selects guide to PURCHASE' }, style: { ...nodeStyle, background: '#fff7e6', border: '1px solid #ffa940' } },
          { id: '4', position: { x: 300, y: 260 }, data: { label: 'POST /api/travel-guides/pdf/secure/checkout\n{ guide_id, content_type: "pdf" }' }, style: { ...nodeStyle, background: '#f0f5ff', border: '1px solid #2f54eb', width: 250 } },
          { id: '5', position: { x: 300, y: 360 }, data: { label: 'VALIDATION\n✓ Token type = pdf?\n✓ Payment = paid?\n✓ Category allowed?' }, style: { ...nodeStyle, background: '#fff1f0', border: '2px solid #ff4d4f', width: 200, height: 90 } },
          { id: '6', position: { x: 300, y: 490 }, data: { label: 'Response:\n{ checkout_url, transaction_id }' }, style: { ...nodeStyle, background: '#f9f0ff', border: '1px solid #722ed1' } },
          { id: '7', position: { x: 300, y: 580 }, data: { label: 'Redirect to Stripe Checkout' }, style: { ...nodeStyle, background: '#e6fffb', border: '1px solid #13c2c2' } },
          { id: '8', position: { x: 120, y: 680 }, data: { label: '❌ Payment Failed\nRedirect to cancel URL' }, style: { ...nodeStyle, background: '#fff1f0', border: '1px solid #ff4d4f' } },
          { id: '9', position: { x: 480, y: 680 }, data: { label: '✅ Payment Success\nRedirect to success URL' }, style: { ...nodeStyle, background: '#f6ffed', border: '1px solid #52c41a' } },
          { id: '10', position: { x: 480, y: 780 }, data: { label: 'GET /api/travel-guides/pdf/secure/download\n?transaction_id=xxx&guide_id=xxx' }, style: { ...nodeStyle, background: '#f0f5ff', border: '1px solid #2f54eb', width: 280 } },
          { id: '11', position: { x: 480, y: 880 }, data: { label: 'VALIDATION\n✓ Transaction exists?\n✓ Payment completed?\n✓ Guide matches?' }, style: { ...nodeStyle, background: '#fff1f0', border: '2px solid #ff4d4f', height: 90 } },
          { id: '12', position: { x: 480, y: 1010 }, data: { label: 'Response: PDF Download' }, style: { ...nodeStyle, background: '#d9f7be', border: '1px solid #52c41a' } },
          { id: '13', position: { x: 480, y: 1090 }, data: { label: 'END' }, style: { ...nodeStyle, background: '#d9f7be', border: '2px solid #52c41a' } },
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e2-3', source: '2', target: '3', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e3-4', source: '3', target: '4', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e4-5', source: '4', target: '5', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e5-6', source: '5', target: '6', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e6-7', source: '6', target: '7', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e7-8', source: '7', target: '8', label: 'Failed', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#ff4d4f' } },
          { id: 'e7-9', source: '7', target: '9', label: 'Success', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#52c41a' } },
          { id: 'e9-10', source: '9', target: '10', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e10-11', source: '10', target: '11', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e11-12', source: '11', target: '12', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e12-13', source: '12', target: '13', markerEnd: { type: MarkerType.ArrowClosed } },
        ]
      },
      'html-json-prepaid': {
        title: 'HTML/JSON Prepaid API Flow',
        nodes: [
          { id: '1', position: { x: 300, y: 0 }, data: { label: 'START' }, style: { ...nodeStyle, background: '#d9f7be', border: '2px solid #52c41a' } },
          { id: '2', position: { x: 300, y: 80 }, data: { label: 'Browse Guides\n(languages, categories, guides)' }, style: { ...nodeStyle, background: '#e6f7ff', border: '1px solid #1890ff' } },
          { id: '3', position: { x: 300, y: 170 }, data: { label: 'User selects guide\nChoose format: JSON or HTML' }, style: { ...nodeStyle, background: '#fff7e6', border: '1px solid #ffa940' } },
          { id: '4', position: { x: 120, y: 280 }, data: { label: 'JSON Format\nGET /digital/content/data/:id\n\nParams:\n• headings\n• heading_format' }, style: { ...nodeStyle, background: '#f0f5ff', border: '1px solid #2f54eb', width: 180, height: 120 } },
          { id: '5', position: { x: 480, y: 280 }, data: { label: 'HTML Format\nGET /digital/content/view/:id\n\nParams: headings, heading_format,\ntitle_color, title_size, heading_color,\nheading_size, paragraph_color, mode...' }, style: { ...nodeStyle, background: '#f9f0ff', border: '1px solid #722ed1', width: 220, height: 130 } },
          { id: '6', position: { x: 300, y: 450 }, data: { label: 'VALIDATION\n✓ Token type = html_json?\n✓ Payment = free?\n✓ Category allowed?\n✓ Quota > 0?' }, style: { ...nodeStyle, background: '#fff1f0', border: '2px solid #ff4d4f', width: 220, height: 100 } },
          { id: '7', position: { x: 100, y: 600 }, data: { label: '❌ FAILED\nReturn 403 Error' }, style: { ...nodeStyle, background: '#fff1f0', border: '1px solid #ff4d4f' } },
          { id: '8', position: { x: 500, y: 600 }, data: { label: '✅ PASSED' }, style: { ...nodeStyle, background: '#f6ffed', border: '1px solid #52c41a' } },
          { id: '9', position: { x: 380, y: 700 }, data: { label: 'First access?\nDeduct quota' }, style: { ...nodeStyle, background: '#fffbe6', border: '1px solid #faad14' } },
          { id: '10', position: { x: 600, y: 700 }, data: { label: 'Already accessed?\nNo deduction' }, style: { ...nodeStyle, background: '#f6ffed', border: '1px solid #52c41a' } },
          { id: '11', position: { x: 200, y: 820 }, data: { label: 'JSON Response\n{ guide, content, access_info }' }, style: { ...nodeStyle, background: '#f0f5ff', border: '1px solid #2f54eb' } },
          { id: '12', position: { x: 500, y: 820 }, data: { label: 'HTML Response\nFull styled HTML page' }, style: { ...nodeStyle, background: '#f9f0ff', border: '1px solid #722ed1' } },
          { id: '13', position: { x: 350, y: 920 }, data: { label: 'END' }, style: { ...nodeStyle, background: '#d9f7be', border: '2px solid #52c41a' } },
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e2-3', source: '2', target: '3', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e3-4', source: '3', target: '4', label: 'JSON', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e3-5', source: '3', target: '5', label: 'HTML', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e4-6', source: '4', target: '6', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e5-6', source: '5', target: '6', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e6-7', source: '6', target: '7', label: 'No', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#ff4d4f' } },
          { id: 'e6-8', source: '6', target: '8', label: 'Yes', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#52c41a' } },
          { id: 'e8-9', source: '8', target: '9', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e8-10', source: '8', target: '10', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e9-11', source: '9', target: '11', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e9-12', source: '9', target: '12', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e10-11', source: '10', target: '11', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e10-12', source: '10', target: '12', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e11-13', source: '11', target: '13', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e12-13', source: '12', target: '13', markerEnd: { type: MarkerType.ArrowClosed } },
        ]
      },
      'html-json-paid': {
        title: 'HTML/JSON Paid API Flow',
        nodes: [
          { id: '1', position: { x: 300, y: 0 }, data: { label: 'START' }, style: { ...nodeStyle, background: '#d9f7be', border: '2px solid #52c41a' } },
          { id: '2', position: { x: 300, y: 80 }, data: { label: 'Browse Guides\n(languages, categories, guides)' }, style: { ...nodeStyle, background: '#e6f7ff', border: '1px solid #1890ff' } },
          { id: '3', position: { x: 300, y: 170 }, data: { label: 'User selects guide to PURCHASE' }, style: { ...nodeStyle, background: '#fff7e6', border: '1px solid #ffa940' } },
          { id: '4', position: { x: 300, y: 260 }, data: { label: 'POST /digital/secure/checkout\n{ guide_id, content_type: "digital" }' }, style: { ...nodeStyle, background: '#f0f5ff', border: '1px solid #2f54eb', width: 250 } },
          { id: '5', position: { x: 300, y: 360 }, data: { label: 'Response:\n{ checkout_url, transaction_id }' }, style: { ...nodeStyle, background: '#f9f0ff', border: '1px solid #722ed1' } },
          { id: '6', position: { x: 300, y: 450 }, data: { label: 'Redirect to Stripe Checkout' }, style: { ...nodeStyle, background: '#e6fffb', border: '1px solid #13c2c2' } },
          { id: '7', position: { x: 100, y: 550 }, data: { label: '❌ Payment Failed' }, style: { ...nodeStyle, background: '#fff1f0', border: '1px solid #ff4d4f' } },
          { id: '8', position: { x: 500, y: 550 }, data: { label: '✅ Payment Success' }, style: { ...nodeStyle, background: '#f6ffed', border: '1px solid #52c41a' } },
          { id: '9', position: { x: 500, y: 650 }, data: { label: 'Choose format: JSON or HTML' }, style: { ...nodeStyle, background: '#fff7e6', border: '1px solid #ffa940' } },
          { id: '10', position: { x: 300, y: 760 }, data: { label: 'JSON Format\nGET /digital/secure/data\n?transaction_id&guide_id\n&headings&heading_format' }, style: { ...nodeStyle, background: '#f0f5ff', border: '1px solid #2f54eb', width: 200, height: 100 } },
          { id: '11', position: { x: 550, y: 760 }, data: { label: 'HTML Format\nGET /digital/secure/view\n?transaction_id&guide_id\n+ all styling params' }, style: { ...nodeStyle, background: '#f9f0ff', border: '1px solid #722ed1', width: 200, height: 100 } },
          { id: '12', position: { x: 420, y: 900 }, data: { label: 'VALIDATION\n✓ Transaction exists?\n✓ Payment completed?\n✓ Guide matches?' }, style: { ...nodeStyle, background: '#fff1f0', border: '2px solid #ff4d4f', height: 90 } },
          { id: '13', position: { x: 300, y: 1030 }, data: { label: 'JSON Response' }, style: { ...nodeStyle, background: '#f0f5ff', border: '1px solid #2f54eb' } },
          { id: '14', position: { x: 550, y: 1030 }, data: { label: 'HTML Response' }, style: { ...nodeStyle, background: '#f9f0ff', border: '1px solid #722ed1' } },
          { id: '15', position: { x: 420, y: 1120 }, data: { label: 'END' }, style: { ...nodeStyle, background: '#d9f7be', border: '2px solid #52c41a' } },
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e2-3', source: '2', target: '3', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e3-4', source: '3', target: '4', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e4-5', source: '4', target: '5', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e5-6', source: '5', target: '6', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e6-7', source: '6', target: '7', label: 'Failed', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#ff4d4f' } },
          { id: 'e6-8', source: '6', target: '8', label: 'Success', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#52c41a' } },
          { id: 'e8-9', source: '8', target: '9', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e9-10', source: '9', target: '10', label: 'JSON', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e9-11', source: '9', target: '11', label: 'HTML', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e10-12', source: '10', target: '12', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e11-12', source: '11', target: '12', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e12-13', source: '12', target: '13', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e12-14', source: '12', target: '14', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e13-15', source: '13', target: '15', markerEnd: { type: MarkerType.ArrowClosed } },
          { id: 'e14-15', source: '14', target: '15', markerEnd: { type: MarkerType.ArrowClosed } },
        ]
      }
    };

    return flowCharts[type] || null;
  };

  const FlowChartComponent = ({ type }) => {
    const flowData = getFlowChartData(type);
    const [nodes, setNodes, onNodesChange] = useNodesState(flowData?.nodes || []);
    const [edges, setEdges, onEdgesChange] = useEdgesState(flowData?.edges || []);

    if (!flowData) return null;

    return (
      <div style={{ height: 600, border: '1px solid #d9d9d9', borderRadius: 8 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
    );
  };

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>API Overview</Title>
        <Dropdown
          menu={{ items: flowChartItems, onClick: handleFlowChartSelect }}
          trigger={['click']}
        >
          <Button type="primary" icon={<PartitionOutlined />}>
            Flow Charts <DownOutlined />
          </Button>
        </Dropdown>
      </div>
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
    "_id": "672a73fc3ff8e4cf3ba9084a",
    "name": "City Trips",
    "slug": "city-trips",
  },
  {
    "_id": "672a73fd3ff8e4cf3ba9084f",
    "name": "Country Guides",
    "slug": "country-guides",
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
      "_id": "672a73fc3ff8e4cf3ba9084a",
      "name": "Amsterdam Travel Guide",
      "eng_name": "Amsterdam Travel Guide",
      "description": "Discover the vibrant capital of Netherlands with this comprehensive travel guide. Explore historic canals, world-class museums, charming neighborhoods, and the unique Dutch culture.",
      "category": { "_id": "672a73fc3ff8e4cf3ba9084a", "name": "City Trips" },
      "city": "Amsterdam",
      "country": "Netherlands",
      "price": 9.99,
      "imagePath": "https://presigned-url...",
      "fullCover": "https://presigned-url...",
      "latitude": 52.3676,
      "longitude": 4.9041
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
    "eng_name": "Amsterdam Travel Guide",
    "description": "Complete travel guide for Amsterdam with historic canals, world-class museums, charming neighborhoods, and unique Dutch culture.",
    "eng_description": "Complete travel guide for Amsterdam with historic canals, world-class museums, charming neighborhoods, and unique Dutch culture.",
    "city": "Amsterdam",
    "country": "Netherlands",
    "address": "Amsterdam, Netherlands",
    "latitude": 52.3676,
    "longitude": 4.9041,
    "price": 9.99,
    "status": true,
    "category": {
      "_id": "672a73fc3ff8e4cf3ba9084a",
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
    "eng_name": "Amsterdam Travel Guide",
    "description": "Complete travel guide for Amsterdam with historic canals, world-class museums, charming neighborhoods, and unique Dutch culture.",
    "eng_description": "Complete travel guide for Amsterdam with historic canals, world-class museums, charming neighborhoods, and unique Dutch culture.",
    "city": "Amsterdam",
    "country": "Netherlands",
    "address": "Amsterdam, Netherlands",
    "latitude": 52.3676,
    "longitude": 4.9041,
    "price": 9.99,
    "status": true,
    "category": {
      "_id": "672a73fc3ff8e4cf3ba9084a",
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
  {
    "_id": "672a73fc3ff8e4cf3ba9084a",
    "name": "City Trips",
    "slug": "city-trips",
  }
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
      "eng_name": "Amsterdam Travel Guide",
      "description": "Discover the vibrant capital of Netherlands with this comprehensive travel guide. Explore historic canals, world-class museums, charming neighborhoods, and the unique Dutch culture.",
      "category": { "_id": "672a73fc3ff8e4cf3ba9084a", "name": "City Trips" },
      "city": "Amsterdam",
      "country": "Netherlands",
      "price": 9.99,
      "imagePath": "https://presigned-url...",
      "fullCover": "https://presigned-url...",
      "latitude": 52.3676,
      "longitude": 4.9041
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
    "eng_name": "Amsterdam Travel Guide",
    "description": "Complete travel guide for Amsterdam with historic canals, world-class museums, charming neighborhoods, and unique Dutch culture.",
    "eng_description": "Complete travel guide for Amsterdam with historic canals, world-class museums, charming neighborhoods, and unique Dutch culture.",
    "city": "Amsterdam",
    "country": "Netherlands",
    "address": "Amsterdam, Netherlands",
    "latitude": 52.3676,
    "longitude": 4.9041,
    "price": 9.99,
    "status": true,
    "category": {
      "_id": "672a73fc3ff8e4cf3ba9084a",
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
  "content": [
    {
      "heading": "1. Introduction",
      "heading_number": 1,
      "content": "<h2>1. Introduction</h2><p>Welcome to Amsterdam, the vibrant capital of the Netherlands...</p>"
    },
    {
      "heading": "2. Navigation",
      "heading_number": 2,
      "content": "<h2>2. Navigation</h2><p>Amsterdam has an excellent public transport system...</p>"
    },
    {
      "heading": "3. Attractions & Activities",
      "heading_number": 3,
      "content": "<h2>3. Attractions & Activities</h2><p>Visit the Van Gogh Museum, Rijksmuseum, Anne Frank House...</p>"
    }
  ],
  "headings": [
    { "number": 1, "title": "Introduction" },
    { "number": 2, "title": "Navigation" },
    { "number": 3, "title": "Attractions & Activities" },
    { "number": 4, "title": "Day Trips" },
    { "number": 5, "title": "Practical Information" },
    { "number": 6, "title": "About the Author" }
  ],
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
          { name: 'guideId', description: 'Guide ID (in URL path)', required: true },
          { name: 'headings', description: 'Filter content by heading numbers (comma-separated, e.g., headings=2,3,4). See Heading Reference section for category-specific heading numbers.', required: false },
          { name: 'heading_format', description: 'Format for headings: "normal" (default) or "sequential" (renumbered starting from 1)', required: false },
          { name: 'title_color', description: 'Color for title (e.g., orange, #ff5500)', required: false },
          { name: 'title_size', description: 'Font size for title in pixels (e.g., 50)', required: false },
          { name: 'heading_color', description: 'Color for headings (e.g., red, #333333)', required: false },
          { name: 'heading_size', description: 'Font size for headings in pixels (e.g., 40)', required: false },
          { name: 'sub_heading_color', description: 'Color for sub-headings (e.g., blue, #666666)', required: false },
          { name: 'sub_heading_size', description: 'Font size for sub-headings in pixels (e.g., 30)', required: false },
          { name: 'paragraph_color', description: 'Color for paragraph text (e.g., yellow, #333333)', required: false },
          { name: 'paragraph_size', description: 'Font size for paragraphs in pixels (e.g., 16)', required: false },
          { name: 'mode', description: 'Theme mode: "light" or "dark" (default: light)', required: false },
          { name: 'heading_visible', description: 'Show/hide heading numbers: 1 (show) or 0 (hide)', required: false },
          { name: 'table_of_content_color', description: 'Color for table of contents (e.g., orange, #1890ff)', required: false },
          { name: 'hosted_page', description: 'Hosted page mode: 1 (enabled) or 0 (disabled)', required: false },
        ],
        `Example: /api/travel-guides/digital/content/view/123?title_color=orange&title_size=50&heading_color=red&heading_size=40&sub_heading_color=blue&sub_heading_size=30&paragraph_color=yellow&paragraph_size=16&mode=dark&headings=3,4&heading_format=normal&heading_visible=0&table_of_content_color=orange&hosted_page=1

Returns full HTML page with applied styling`
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

        <Card style={{ marginBottom: '15px', backgroundColor: '#fff7e6', border: '1px solid #ffd591' }}>
          <Text strong style={{ color: '#d46b08' }}>🔑 Enter Your API Token to View Live Preview</Text>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <Input.Password
              placeholder="Enter your PDF Prepaid API token"
              value={pdfPrepaidToken}
              onChange={(e) => setPdfPrepaidToken(e.target.value)}
              style={{ flex: 1 }}
            />
            <Button type="primary" onClick={() => saveToken('pdfPrepaidToken', pdfPrepaidToken)}>
              Save Token
            </Button>
          </div>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#8c8c8c' }}>
            Your token will be saved locally and used for live preview.
          </p>
        </Card>

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
          onClick={() => openPreview(document.getElementById('pdf-prepaid-html').textContent, pdfPrepaidToken)}
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
    .filter-group { position: relative; z-index: 100; }
    .filter-group label { display: block; font-weight: 600; margin-bottom: 8px; color: #495057; font-size: 14px; }
    .filter-group select, .filter-group input { width: 100%; padding: 10px 12px; border: 2px solid #dee2e6; border-radius: 6px; font-size: 14px; position: relative; z-index: 100; }
    .filter-group select:focus, .filter-group input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); z-index: 200; }
    .stats-bar { background: #e7f3ff; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #bee5eb; }
    .stat-item { display: flex; align-items: center; gap: 8px; }
    .stat-label { font-weight: 600; color: #0c5460; }
    .stat-value { background: white; padding: 4px 12px; border-radius: 20px; font-weight: bold; color: #667eea; }
    .guides-container { padding: 30px; min-height: 400px; }
    .guides-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-top: 20px; }
    @media (min-width: 1200px) { .guides-grid { grid-template-columns: repeat(4, 1fr); } }
    @media (min-width: 768px) and (max-width: 1199px) { .guides-grid { grid-template-columns: repeat(3, 1fr); } }
    .guide-card { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.3s; border: 2px solid transparent; }
    .guide-card:hover { transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.15); border-color: #667eea; }
    .guide-image { width: 120px; height: 180px; object-fit: cover; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0 auto; display: block; }
    .guide-content { padding: 12px; }
    .guide-title { font-size: 14px; font-weight: bold; color: #2c3e50; margin-bottom: 6px; line-height: 1.3; }
    .guide-location { color: #6c757d; font-size: 11px; margin-bottom: 8px; display: flex; align-items: center; gap: 3px; }
    .guide-meta { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 10px; border-top: 1px solid #e9ecef; }
    .guide-price { font-size: 16px; font-weight: bold; color: #667eea; }
    .guide-lang { background: #e7f3ff; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; color: #0c5460; }
    .download-btn { width: 100%; padding: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; margin-top: 10px; transition: all 0.3s; }
    .download-btn:hover { transform: scale(1.02); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }
    .download-btn:disabled { background: #6c757d; cursor: not-allowed; transform: scale(1); }
    .loading { text-align: center; padding: 60px 20px; color: #6c757d; font-size: 18px; }
    .loading::after { content: '...'; animation: dots 1.5s steps(4, end) infinite; }
    @keyframes dots { 0%, 20% { content: '.'; } 40% { content: '..'; } 60%, 100% { content: '...'; } }
    .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 1000; align-items: center; justify-content: center; }
    .modal.show { display: flex; }
    .modal-content { background: white; border-radius: 12px; padding: 30px; max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto; animation: slideDown 0.3s; }
    @keyframes slideDown { from { transform: translateY(-50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .modal-header { font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #2c3e50; }
    .modal-body { margin-bottom: 20px; }
    .modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
    .btn { padding: 10px 20px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
    .btn-primary { background: #667eea; color: white; }
    .btn-primary:hover { background: #5568d3; }
    .btn-secondary { background: #e9ecef; color: #495057; }
    .btn-secondary:hover { background: #dee2e6; }
    .success-message { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 12px; border-radius: 6px; margin-bottom: 15px; }
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
        <span class="stat-label">Remaining Quota:</span>
        <span class="stat-value" id="quota">--</span>
      </div>
    </div>

    <div class="guides-container">
      <div id="guides-grid" class="guides-grid"></div>
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
    const YOUR_TOKEN = 'YOUR_TOKEN_HERE'; // Enter your PDF Prepaid Token

    let currentFilters = {
      search: '',
      language: '',
      category: ''
    };
    let selectedGuide = null;
    let remainingQuota = null;
    let currentPage = 1;
    let totalPages = 1;

    async function init() {
      await loadLanguages();
      await loadCategories();
      await loadGuides();
      setupEventListeners();
    }

    function setupEventListeners() {
      document.getElementById('search-input').addEventListener('input', debounce((e) => {
        currentFilters.search = e.target.value;
        loadGuides();
      }, 500));

      document.getElementById('language-filter').addEventListener('change', (e) => {
        currentFilters.language = e.target.value;
        loadGuides();
      });

      document.getElementById('category-filter').addEventListener('change', (e) => {
        currentFilters.category = e.target.value;
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

    async function loadGuides(page = 1) {
      const container = document.getElementById('guides-grid');
      container.innerHTML = '<div class="loading">Loading guides</div>';

      try {
        let url = \`\${API_BASE}/api/travel-content/guides?limit=20&page=\${page}\`;
        if (currentFilters.search) url += \`&query=\${encodeURIComponent(currentFilters.search)}\`;
        if (currentFilters.language) url += \`&lang=\${currentFilters.language}\`;
        else url += \`&lang=en\`;
        if (currentFilters.category) url += \`&category_id=\${currentFilters.category}\`;

        const response = await fetch(url, {
          headers: { 'Authorization': \`Bearer \${YOUR_TOKEN}\` }
        });
        const data = await response.json();

        document.getElementById('total-guides').textContent = data.totalBooks;
        currentPage = data.currentPage || page;
        totalPages = Math.ceil(data.totalBooks / 20);

        renderGuides(data.books);
        renderPagination();
      } catch (error) {
        container.innerHTML = '<div class="loading">❌ Error loading guides. Please check your token.</div>';
        console.error('Error:', error);
      }
    }

    function renderPagination() {
      let paginationContainer = document.getElementById('pagination');
      if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'pagination';
        paginationContainer.style.cssText = 'display: flex; justify-content: center; gap: 8px; margin-top: 20px; flex-wrap: wrap;';
        document.querySelector('.guides-container').appendChild(paginationContainer);
      }

      let html = '';
      if (currentPage > 1) {
        html += \`<button onclick="loadGuides(\${currentPage - 1})" style="padding: 8px 16px; border: 1px solid #667eea; background: white; color: #667eea; border-radius: 4px; cursor: pointer;">← Prev</button>\`;
      }

      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage;
        html += \`<button onclick="loadGuides(\${i})" style="padding: 8px 16px; border: 1px solid #667eea; background: \${isActive ? '#667eea' : 'white'}; color: \${isActive ? 'white' : '#667eea'}; border-radius: 4px; cursor: pointer;">\${i}</button>\`;
      }

      if (currentPage < totalPages) {
        html += \`<button onclick="loadGuides(\${currentPage + 1})" style="padding: 8px 16px; border: 1px solid #667eea; background: white; color: #667eea; border-radius: 4px; cursor: pointer;">Next →</button>\`;
      }

      paginationContainer.innerHTML = html;
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

        <Card style={{ marginBottom: '15px', backgroundColor: '#fff7e6', border: '1px solid #ffd591' }}>
          <Text strong style={{ color: '#d46b08' }}>🔑 Enter Your API Token to View Live Preview</Text>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <Input.Password
              placeholder="Enter your PDF Paid API token"
              value={pdfPaidToken}
              onChange={(e) => setPdfPaidToken(e.target.value)}
              style={{ flex: 1 }}
            />
            <Button type="primary" style={{ background: '#fa8c16', borderColor: '#fa8c16' }} onClick={() => saveToken('pdfPaidToken', pdfPaidToken)}>
              Save Token
            </Button>
          </div>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#8c8c8c' }}>
            Your token will be saved locally and used for live preview.
          </p>
        </Card>

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
          onClick={() => openPreview(document.getElementById('pdf-paid-html').textContent, pdfPaidToken)}
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
    const YOUR_TOKEN = 'YOUR_TOKEN_HERE'; // Enter your PDF Paid Token

    let currentPage = 1;
    let totalPages = 1;

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

    async function loadGuides(page = 1) {
      const container = document.getElementById('guides-grid');
      container.innerHTML = '<div class="loading">Loading guides...</div>';

      try {
        let url = \`\${API_BASE}/api/travel-content/guides?limit=20&page=\${page}\`;
        const search = document.getElementById('search-input').value;
        const lang = document.getElementById('language-filter').value;
        const category = document.getElementById('category-filter').value;

        if (search) url += \`&query=\${encodeURIComponent(search)}\`;
        if (lang) url += \`&lang=\${lang}\`;
        else url += \`&lang=en\`;
        if (category) url += \`&category_id=\${category}\`;

        const response = await fetch(url, {
          headers: { 'Authorization': \`Bearer \${YOUR_TOKEN}\` }
        });
        const data = await response.json();

        currentPage = data.currentPage || page;
        totalPages = Math.ceil(data.totalBooks / 20);

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

        renderPagination();
      } catch (error) {
        container.innerHTML = '<div class="loading">❌ Error loading guides</div>';
      }
    }

    function renderPagination() {
      let paginationContainer = document.getElementById('pagination');
      if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'pagination';
        paginationContainer.style.cssText = 'display: flex; justify-content: center; gap: 8px; margin: 20px 30px; flex-wrap: wrap;';
        document.getElementById('main-page').appendChild(paginationContainer);
      }

      let html = '';
      if (currentPage > 1) {
        html += \`<button onclick="loadGuides(\${currentPage - 1})" style="padding: 8px 16px; border: 1px solid #f5576c; background: white; color: #f5576c; border-radius: 4px; cursor: pointer;">← Prev</button>\`;
      }

      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage;
        html += \`<button onclick="loadGuides(\${i})" style="padding: 8px 16px; border: 1px solid #f5576c; background: \${isActive ? '#f5576c' : 'white'}; color: \${isActive ? 'white' : '#f5576c'}; border-radius: 4px; cursor: pointer;">\${i}</button>\`;
      }

      if (currentPage < totalPages) {
        html += \`<button onclick="loadGuides(\${currentPage + 1})" style="padding: 8px 16px; border: 1px solid #f5576c; background: white; color: #f5576c; border-radius: 4px; cursor: pointer;">Next →</button>\`;
      }

      paginationContainer.innerHTML = html;
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

        <Card style={{ marginBottom: '15px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
          <Text strong style={{ color: '#389e0d' }}>🔑 Enter Your API Token to View Live Preview</Text>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <Input.Password
              placeholder="Enter your HTML/JSON Prepaid API token"
              value={htmlPrepaidToken}
              onChange={(e) => setHtmlPrepaidToken(e.target.value)}
              style={{ flex: 1 }}
            />
            <Button type="primary" style={{ background: '#52c41a', borderColor: '#52c41a' }} onClick={() => saveToken('htmlPrepaidToken', htmlPrepaidToken)}>
              Save Token
            </Button>
          </div>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#8c8c8c' }}>
            Your token will be saved locally and used for live preview.
          </p>
        </Card>

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
          onClick={() => openPreview(document.getElementById('html-prepaid-html').textContent, htmlPrepaidToken)}
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
    body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #00b4db 0%, #0083b0 100%); min-height: 100vh; padding: 20px; }
    .container { max-width: 1400px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow: hidden; }
    .header { background: linear-gradient(135deg, #00b4db 0%, #0083b0 100%); color: white; padding: 30px; text-align: center; }
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
    .guide-card:hover { transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.15); border-color: #00b4db; }
    .guide-image { width: 120px; height: 180px; object-fit: cover; background: linear-gradient(135deg, #00b4db 0%, #0083b0 100%); margin: 0 auto; display: block; }
    .guide-content { padding: 12px; }
    .guide-title { font-size: 14px; font-weight: bold; color: #2c3e50; margin-bottom: 6px; line-height: 1.3; }
    .guide-location { color: #6c757d; font-size: 11px; margin-bottom: 8px; }
    .guide-price { font-size: 18px; font-weight: bold; color: #00b4db; margin: 10px 0; }
    .view-btn { width: 100%; padding: 8px; background: linear-gradient(135deg, #00b4db 0%, #0083b0 100%); color: white; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
    .view-btn:hover { transform: scale(1.02); box-shadow: 0 4px 12px rgba(0, 180, 219, 0.4); }
    .view-btn:disabled { background: #6c757d; cursor: not-allowed; }
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
    .loading { text-align: center; padding: 60px 20px; color: #6c757d; font-size: 18px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌍 YouGuide Travel Guides</h1>
      <p>HTML/JSON Prepaid API - View travel guide content</p>
    </div>

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

    <div class="guides-grid" id="guides-grid"></div>
  </div>

  <!-- Content View Modal -->
  <div id="content-modal" class="modal">
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
          <label>🎨 Title Color</label>
          <input type="color" id="title-color" value="#333333">
        </div>

        <div class="control-group">
          <label>📏 Title Size</label>
          <input type="number" id="title-size" value="50" min="20" max="80">
        </div>

        <div class="control-group">
          <label>🎨 Heading Color</label>
          <input type="color" id="heading-color" value="#333333">
        </div>

        <div class="control-group">
          <label>📏 Heading Size</label>
          <input type="number" id="heading-size" value="40" min="16" max="60">
        </div>

        <div class="control-group">
          <label>🎨 Sub-heading Color</label>
          <input type="color" id="subheading-color" value="#666666">
        </div>

        <div class="control-group">
          <label>📏 Sub-heading Size</label>
          <input type="number" id="subheading-size" value="30" min="14" max="50">
        </div>

        <div class="control-group">
          <label>🎨 Paragraph Color</label>
          <input type="color" id="paragraph-color" value="#333333">
        </div>

        <div class="control-group">
          <label>📏 Paragraph Size</label>
          <input type="number" id="paragraph-size" value="16" min="10" max="30">
        </div>

        <div class="control-group">
          <label>👁️ Heading Visible</label>
          <select id="heading-visible">
            <option value="1">Show Numbers</option>
            <option value="0">Hide Numbers</option>
          </select>
        </div>

        <div class="control-group">
          <label>🎨 TOC Color</label>
          <input type="color" id="toc-color" value="#1890ff">
        </div>

        <div class="control-group">
          <label>📄 Hosted Page</label>
          <select id="hosted-page">
            <option value="0">Disabled</option>
            <option value="1">Enabled</option>
          </select>
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
    const YOUR_TOKEN = 'YOUR_TOKEN_HERE'; // Enter your HTML/JSON Prepaid Token

    let currentPage = 1;
    let totalPages = 1;
    let currentGuideId = null;
    let currentGuideName = '';

    async function init() {
      await loadLanguages();
      await loadCategories();
      await loadGuides();
      setupFilters();
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

    function openGuide(guideId, guideName) {
      currentGuideId = guideId;
      currentGuideName = guideName;
      document.getElementById('modal-guide-name').textContent = guideName;
      document.getElementById('content-modal').classList.add('show');
    }

    function closeModal() {
      document.getElementById('content-modal').classList.remove('show');
      currentGuideId = null;
    }

    async function loadLanguages() {
      try {
        const response = await fetch(\`\${API_BASE}/api/travel-content/languages\`, {
          headers: { 'Authorization': \`Bearer \${YOUR_TOKEN}\` }
        });
        const response_data = await response.json();
        const languages = Array.isArray(response_data) ? response_data : response_data.data;
        const select = document.getElementById('language-filter');
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
        const select = document.getElementById('category-filter');
        if (Array.isArray(categories)) {
          categories.forEach(cat => {
            select.innerHTML += \`<option value="\${cat._id}">\${cat.name}</option>\`;
          });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    async function loadGuides(page = 1) {
      const container = document.getElementById('guides-grid');
      container.innerHTML = '<div class="loading">Loading guides...</div>';

      try {
        let url = \`\${API_BASE}/api/travel-content/guides?limit=20&page=\${page}\`;
        const search = document.getElementById('search-input').value;
        const lang = document.getElementById('language-filter').value;
        const category = document.getElementById('category-filter').value;

        if (search) url += \`&query=\${encodeURIComponent(search)}\`;
        if (lang) url += \`&lang=\${lang}\`;
        else url += \`&lang=en\`;
        if (category) url += \`&category_id=\${category}\`;

        const response = await fetch(url, {
          headers: { 'Authorization': \`Bearer \${YOUR_TOKEN}\` }
        });
        const data = await response.json();

        currentPage = data.currentPage || page;
        totalPages = Math.ceil(data.totalBooks / 20);

        container.innerHTML = '';
        data.books.forEach(guide => {
          container.innerHTML += \`
            <div class="guide-card">
              <img class="guide-image" src="\${guide.imagePath || ''}" alt="\${guide.name}" onerror="this.style.display='none'">
              <div class="guide-content">
                <div class="guide-title">\${guide.name}</div>
                <div class="guide-location">📍 \${guide.city}, \${guide.country}</div>
                <div class="guide-price">€\${guide.price.toFixed(2)}</div>
                <button class="view-btn" onclick="openGuide('\${guide._id}', '\${guide.name.replace(/'/g, "\\'")}')">
                  View Content
                </button>
              </div>
            </div>
          \`;
        });

        renderPagination();
      } catch (error) {
        container.innerHTML = '<div class="loading">❌ Error loading guides</div>';
      }
    }

    function renderPagination() {
      let paginationContainer = document.getElementById('pagination');
      if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'pagination';
        paginationContainer.style.cssText = 'display: flex; justify-content: center; gap: 8px; margin: 20px 30px; flex-wrap: wrap;';
        document.querySelector('.container').appendChild(paginationContainer);
      }

      let html = '';
      if (currentPage > 1) {
        html += \`<button onclick="loadGuides(\${currentPage - 1})" style="padding: 8px 16px; border: 1px solid #00b4db; background: white; color: #00b4db; border-radius: 4px; cursor: pointer;">← Prev</button>\`;
      }

      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage;
        html += \`<button onclick="loadGuides(\${i})" style="padding: 8px 16px; border: 1px solid #00b4db; background: \${isActive ? '#00b4db' : 'white'}; color: \${isActive ? 'white' : '#00b4db'}; border-radius: 4px; cursor: pointer;">\${i}</button>\`;
      }

      if (currentPage < totalPages) {
        html += \`<button onclick="loadGuides(\${currentPage + 1})" style="padding: 8px 16px; border: 1px solid #00b4db; background: white; color: #00b4db; border-radius: 4px; cursor: pointer;">Next →</button>\`;
      }

      paginationContainer.innerHTML = html;
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
        const titleColor = document.getElementById('title-color').value;
        const titleSize = document.getElementById('title-size').value;
        const headingColor = document.getElementById('heading-color').value;
        const headingSize = document.getElementById('heading-size').value;
        const subheadingColor = document.getElementById('subheading-color').value;
        const subheadingSize = document.getElementById('subheading-size').value;
        const paragraphColor = document.getElementById('paragraph-color').value;
        const paragraphSize = document.getElementById('paragraph-size').value;
        const headingVisible = document.getElementById('heading-visible').value;
        const tocColor = document.getElementById('toc-color').value;
        const hostedPage = document.getElementById('hosted-page').value;

        if (headings) params.append('headings', headings);
        if (headingFormat) params.append('heading_format', headingFormat);
        params.append('mode', mode);
        params.append('title_color', titleColor.replace('#', ''));
        params.append('title_size', titleSize);
        params.append('heading_color', headingColor.replace('#', ''));
        params.append('heading_size', headingSize);
        params.append('sub_heading_color', subheadingColor.replace('#', ''));
        params.append('sub_heading_size', subheadingSize);
        params.append('paragraph_color', paragraphColor.replace('#', ''));
        params.append('paragraph_size', paragraphSize);
        params.append('heading_visible', headingVisible);
        params.append('table_of_content_color', tocColor.replace('#', ''));
        params.append('hosted_page', hostedPage);

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

        <Card style={{ marginBottom: '15px', backgroundColor: '#fff0f6', border: '1px solid #ffadd2' }}>
          <Text strong style={{ color: '#c41d7f' }}>🔑 Enter Your API Token to View Live Preview</Text>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <Input.Password
              placeholder="Enter your HTML/JSON Paid API token"
              value={htmlPaidToken}
              onChange={(e) => setHtmlPaidToken(e.target.value)}
              style={{ flex: 1 }}
            />
            <Button type="primary" style={{ background: '#eb2f96', borderColor: '#eb2f96' }} onClick={() => saveToken('htmlPaidToken', htmlPaidToken)}>
              Save Token
            </Button>
          </div>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#8c8c8c' }}>
            Your token will be saved locally and used for live preview.
          </p>
        </Card>

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
          onClick={() => openPreview(document.getElementById('html-paid-html').textContent, htmlPaidToken)}
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
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
    .container { max-width: 1400px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow: hidden; }
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
    <div class="header">
      <h1>🌍 YouGuide - Pay Per Guide</h1>
      <p>HTML/JSON Paid API - Purchase and view travel guides</p>
    </div>

    <!-- Main Page (Guide Listing) -->
    <div id="main-page">
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
      <div class="header" style="background: #28a745;">
        <h1>✅ Purchase Successful!</h1>
        <p>Your guide content is ready to view</p>
      </div>
      <div style="padding: 30px;">
        <h2 id="purchased-guide-name"></h2>
        <p style="color: #6c757d; margin: 10px 0;">Transaction ID: <span id="transaction-id"></span></p>

        <div class="content-controls">
          <div class="control-group">
            <label>📋 Filter Headings</label>
            <input type="text" id="headings" placeholder="e.g., 2,3,4">
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
            <select id="mode">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div class="control-group">
            <label>🎨 Title Color</label>
            <input type="color" id="title-color" value="#333333">
          </div>
          <div class="control-group">
            <label>📏 Title Size</label>
            <input type="number" id="title-size" value="50" min="20" max="80">
          </div>
          <div class="control-group">
            <label>🎨 Heading Color</label>
            <input type="color" id="h-color" value="#667eea">
          </div>
          <div class="control-group">
            <label>📏 Heading Size</label>
            <input type="number" id="h-size" value="40" min="16" max="60">
          </div>
          <div class="control-group">
            <label>🎨 Sub-heading Color</label>
            <input type="color" id="sh-color" value="#666666">
          </div>
          <div class="control-group">
            <label>📏 Sub-heading Size</label>
            <input type="number" id="sh-size" value="30" min="14" max="50">
          </div>
          <div class="control-group">
            <label>🎨 Paragraph Color</label>
            <input type="color" id="p-color" value="#333333">
          </div>
          <div class="control-group">
            <label>📏 Paragraph Size</label>
            <input type="number" id="p-size" value="16" min="10" max="30">
          </div>
          <div class="control-group">
            <label>👁️ Heading Visible</label>
            <select id="h-visible">
              <option value="1">Show Numbers</option>
              <option value="0">Hide Numbers</option>
            </select>
          </div>
          <div class="control-group">
            <label>🎨 TOC Color</label>
            <input type="color" id="toc-color" value="#1890ff">
          </div>
          <div class="control-group">
            <label>📄 Hosted Page</label>
            <select id="hosted-page">
              <option value="0">Disabled</option>
              <option value="1">Enabled</option>
            </select>
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

  <script>
    const API_BASE = 'https://appapi.youguide.com';
    const YOUR_TOKEN = 'YOUR_TOKEN_HERE'; // Enter your HTML/JSON Paid Token

    let currentPage = 1;
    let totalPages = 1;
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

    async function loadGuides(page = 1) {
      const grid = document.getElementById('guides-grid');
      grid.innerHTML = '<div class="loading">Loading guides...</div>';

      try {
        const search = document.getElementById('search').value;
        const lang = document.getElementById('lang-filter').value;
        const cat = document.getElementById('cat-filter').value;

        let url = \`\${API_BASE}/api/travel-content/guides?limit=20&page=\${page}\`;
        if (search) url += \`&query=\${encodeURIComponent(search)}\`;
        if (lang) url += \`&lang=\${lang}\`;
        else url += \`&lang=en\`;
        if (cat) url += \`&category_id=\${cat}\`;

        const response = await fetch(url, {
          headers: { 'Authorization': \`Bearer \${YOUR_TOKEN}\` }
        });
        const data = await response.json();

        currentPage = data.currentPage || page;
        totalPages = Math.ceil(data.totalBooks / 20);

        grid.innerHTML = '';
        data.books.forEach(guide => {
          grid.innerHTML += \`
            <div class="guide-card">
              <img class="guide-image" src="\${guide.imagePath || ''}" alt="\${guide.name}" onerror="this.style.display='none'">
              <div class="guide-content">
                <div class="guide-title">\${guide.name}</div>
                <div style="color: #6c757d; margin: 10px 0;">📍 \${guide.city}, \${guide.country}</div>
                <div class="guide-price">€\${guide.price.toFixed(2)}</div>
                <button class="purchase-btn" onclick='purchase("\${guide._id}", "\${guide.name.replace(/'/g, "\\'")}",  \${guide.price})'>
                  Buy Content
                </button>
              </div>
            </div>
          \`;
        });

        renderPagination();
      } catch (error) {
        grid.innerHTML = '<div class="loading">Error loading guides</div>';
      }
    }

    function renderPagination() {
      let paginationContainer = document.getElementById('pagination');
      if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'pagination';
        paginationContainer.style.cssText = 'display: flex; justify-content: center; gap: 8px; margin: 20px 30px; flex-wrap: wrap;';
        document.getElementById('main-page').appendChild(paginationContainer);
      }

      let html = '';
      if (currentPage > 1) {
        html += \`<button onclick="loadGuides(\${currentPage - 1})" style="padding: 8px 16px; border: 1px solid #eb2f96; background: white; color: #eb2f96; border-radius: 4px; cursor: pointer;">← Prev</button>\`;
      }

      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage;
        html += \`<button onclick="loadGuides(\${i})" style="padding: 8px 16px; border: 1px solid #eb2f96; background: \${isActive ? '#eb2f96' : 'white'}; color: \${isActive ? 'white' : '#eb2f96'}; border-radius: 4px; cursor: pointer;">\${i}</button>\`;
      }

      if (currentPage < totalPages) {
        html += \`<button onclick="loadGuides(\${currentPage + 1})" style="padding: 8px 16px; border: 1px solid #eb2f96; background: white; color: #eb2f96; border-radius: 4px; cursor: pointer;">Next →</button>\`;
      }

      paginationContainer.innerHTML = html;
    }

    async function purchase(guideId, guideName, price) {
      if (!confirm(\`Purchase "\${guideName}" for €\${price}?\\n\\nYou will be redirected to Stripe for secure payment.\`)) {
        return;
      }

      try {
        const response = await fetch(\`\${API_BASE}/api/travel-guides/digital/secure/checkout\`, {
          method: 'POST',
          headers: {
            'Authorization': \`Bearer \${YOUR_TOKEN}\`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            guide_id: guideId,
            content_type: 'digital'
          })
        });

        if (!response.ok) throw new Error('Checkout failed');

        const data = await response.json();

        // Save for later
        localStorage.setItem('transaction_id', data.transaction_id);
        localStorage.setItem('guide_id', guideId);
        localStorage.setItem('guide_name', guideName);
        localStorage.setItem('content_type', 'digital');

        // Open Stripe checkout in new tab
        window.open(data.checkout_url, '_blank');
        alert('Checkout opened in new tab. After payment, refresh this page to view content.');
      } catch (error) {
        alert('Purchase failed. Please try again.');
        console.error('Error:', error);
      }
    }

    function showSuccessPage() {
      document.getElementById('main-page').style.display = 'none';
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
        const headingFormat = document.getElementById('heading-format').value;

        let url = \`\${API_BASE}/api/travel-guides/digital/secure/data?transaction_id=\${transactionId}&guide_id=\${guideId}\`;
        if (headings) url += \`&headings=\${headings}\`;
        if (headingFormat) url += \`&heading_format=\${headingFormat}\`;

        const response = await fetch(url, {
          headers: { 'Authorization': \`Bearer \${YOUR_TOKEN}\` }
        });
        const data = await response.json();

        let html = '<pre style="background: #f8f9fa; padding: 15px; border-radius: 6px; overflow: auto;">' + JSON.stringify(data, null, 2) + '</pre>';
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
        const headingFormat = document.getElementById('heading-format').value;
        const mode = document.getElementById('mode').value;
        const titleColor = document.getElementById('title-color').value.replace('#', '');
        const titleSize = document.getElementById('title-size').value;
        const hColor = document.getElementById('h-color').value.replace('#', '');
        const hSize = document.getElementById('h-size').value;
        const shColor = document.getElementById('sh-color').value.replace('#', '');
        const shSize = document.getElementById('sh-size').value;
        const pColor = document.getElementById('p-color').value.replace('#', '');
        const pSize = document.getElementById('p-size').value;
        const hVisible = document.getElementById('h-visible').value;
        const tocColor = document.getElementById('toc-color').value.replace('#', '');
        const hostedPage = document.getElementById('hosted-page').value;

        const params = new URLSearchParams({
          transaction_id: transactionId,
          guide_id: guideId,
          mode,
          title_color: titleColor,
          title_size: titleSize,
          heading_color: hColor,
          heading_size: hSize,
          sub_heading_color: shColor,
          sub_heading_size: shSize,
          paragraph_color: pColor,
          paragraph_size: pSize,
          heading_visible: hVisible,
          table_of_content_color: tocColor,
          hosted_page: hostedPage
        });
        if (headings) params.append('headings', headings);
        if (headingFormat) params.append('heading_format', headingFormat);

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
      "_id": "672a73fc3ff8e4cf3ba9084a",
      "name": "Amsterdam Travel Guide",
      "eng_name": "Amsterdam Travel Guide",
      "description": "Discover the vibrant capital of Netherlands with this comprehensive travel guide. Explore historic canals, world-class museums, charming neighborhoods, and the unique Dutch culture.",
      "category": { "_id": "672a73fc3ff8e4cf3ba9084a", "name": "City Trips" },
      "city": "Amsterdam",
      "country": "Netherlands",
      "price": 9.99,
      "imagePath": "https://presigned-url...",
      "fullCover": "https://presigned-url...",
      "latitude": 52.3676,
      "longitude": 4.9041
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
  "content": [
    {
      "heading": "1. Introduction",
      "heading_number": 1,
      "content": "<h2>1. Introduction</h2><p>Welcome to Amsterdam, the vibrant capital of the Netherlands...</p>"
    },
    {
      "heading": "2. Navigation",
      "heading_number": 2,
      "content": "<h2>2. Navigation</h2><p>Amsterdam has an excellent public transport system...</p>"
    }
  ],
  "headings": [
    { "number": 1, "title": "Introduction" },
    { "number": 2, "title": "Navigation" },
    { "number": 3, "title": "Attractions & Activities" },
    { "number": 4, "title": "Day Trips" },
    { "number": 5, "title": "Practical Information" },
    { "number": 6, "title": "About the Author" }
  ],
  "transaction": {
    "transaction_id": "550e8400-e29b-41d4-a716-446655440000",
    "paid_at": "2026-01-02T10:30:00Z",
    "amount": 9.99,
    "currency": "eur"
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
          { name: 'transaction_id', description: 'Transaction ID from payment', required: true },
          { name: 'guide_id', description: 'Guide ID', required: true },
          { name: 'headings', description: 'Filter content by heading numbers (comma-separated, e.g., headings=2,3,4). See Heading Reference section for category-specific heading numbers.', required: false },
          { name: 'heading_format', description: 'Format for headings: "normal" (default) or "sequential" (renumbered starting from 1)', required: false },
          { name: 'title_color', description: 'Color for title (e.g., orange, #ff5500)', required: false },
          { name: 'title_size', description: 'Font size for title in pixels (e.g., 50)', required: false },
          { name: 'heading_color', description: 'Color for headings (e.g., red, #333333)', required: false },
          { name: 'heading_size', description: 'Font size for headings in pixels (e.g., 40)', required: false },
          { name: 'sub_heading_color', description: 'Color for sub-headings (e.g., blue, #666666)', required: false },
          { name: 'sub_heading_size', description: 'Font size for sub-headings in pixels (e.g., 30)', required: false },
          { name: 'paragraph_color', description: 'Color for paragraph text (e.g., yellow, #333333)', required: false },
          { name: 'paragraph_size', description: 'Font size for paragraphs in pixels (e.g., 16)', required: false },
          { name: 'mode', description: 'Theme mode: "light" or "dark" (default: light)', required: false },
          { name: 'heading_visible', description: 'Show/hide heading numbers: 1 (show) or 0 (hide)', required: false },
          { name: 'table_of_content_color', description: 'Color for table of contents (e.g., orange, #1890ff)', required: false },
          { name: 'hosted_page', description: 'Hosted page mode: 1 (enabled) or 0 (disabled)', required: false },
        ],
        `Example: /api/travel-guides/digital/secure/view?transaction_id=txn_123&guide_id=456&title_color=orange&title_size=50&heading_color=red&heading_size=40&sub_heading_color=blue&sub_heading_size=30&paragraph_color=yellow&paragraph_size=16&mode=dark&headings=3,4&heading_format=normal&heading_visible=0&table_of_content_color=orange&hosted_page=1

Returns full HTML page with applied styling`
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

  const openPreview = (htmlContent, token) => {
    if (!token) {
      message.error('Please enter and save your API token first!');
      return;
    }
    const contentWithToken = htmlContent.replace(/YOUR_TOKEN_HERE/g, token);
    setCurrentPreviewHtml(contentWithToken);
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

      {/* Flow Chart Modal */}
      <Modal
        title={getFlowChartData(selectedFlowChart)?.title || 'API Flow Chart'}
        open={flowChartVisible}
        onCancel={() => setFlowChartVisible(false)}
        footer={[
          <Button key="close" onClick={() => setFlowChartVisible(false)}>
            Close
          </Button>
        ]}
        width={1000}
        styles={{
          body: { padding: '16px' }
        }}
      >
        <FlowChartComponent type={selectedFlowChart} />
      </Modal>
    </Layout>
  );
};

export default ApiDocumentation;
