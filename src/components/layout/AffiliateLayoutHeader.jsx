import {
  Avatar,
  Button,
  Dropdown,
  Flex,
  Layout,
  Typography,
  Tag,
  Spin,
  Modal,
  message,
  InputNumber,
  Popover,
  Divider,
} from 'antd';
import profile from '../../assets/profile.png';
import { IoMdContact } from 'react-icons/io';
import { TbLogout2 } from 'react-icons/tb';
import { GoChevronDown } from 'react-icons/go';
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { MenuOutlined, RocketOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import ApiService from '../../APIServices/ApiService';

const AffiliateLayoutHeader = ({ isMobile, collapsed, setCollapsed, theme, toggleTheme, showDrawer, affiliate, onStartTour }) => {
  const [user, setUser] = useState(null);
  const [quotaData, setQuotaData] = useState(null);
  const [quotaLoading, setQuotaLoading] = useState(false);
  const [buyPopoverVisible, setBuyPopoverVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [requestedQuota, setRequestedQuota] = useState(null);
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(() => {
    const affiliateUser = localStorage.getItem('affiliateUser');
    if (affiliateUser) {
      const parsedUser = JSON.parse(affiliateUser);
      setUser(parsedUser);
    }

    // Try to get affiliate data from localStorage if prop not yet available
    const affiliateData = localStorage.getItem('affiliateData');
    if (affiliateData) {
      try {
        const parsedAffiliate = JSON.parse(affiliateData);
        const affiliateId = parsedAffiliate?._id || parsedAffiliate?.id;
        if (affiliateId) {
          fetchQuotaPackageDetails(affiliateId);
        }
      } catch (e) {
        console.error('Error parsing affiliate data');
      }
    }
  }, []);

  useEffect(() => {
    const affiliateId = affiliate?._id || affiliate?.id;
    if (affiliateId && !quotaData) {
      fetchQuotaPackageDetails(affiliateId);
    }
  }, [affiliate]);

  // Listen for quota refresh events from other components
  useEffect(() => {
    const handleQuotaRefresh = () => {
      const affiliateId = affiliate?._id || affiliate?.id;
      if (affiliateId) {
        fetchQuotaPackageDetails(affiliateId);
      }
    };

    window.addEventListener('refreshAffiliateQuota', handleQuotaRefresh);
    return () => {
      window.removeEventListener('refreshAffiliateQuota', handleQuotaRefresh);
    };
  }, [affiliate]);

  const fetchQuotaPackageDetails = async (affiliateId) => {
    if (!affiliateId) return;
    setQuotaLoading(true);
    try {
      const response = await ApiService.getQuotaPackageDetails(affiliateId);
      if (response.success) {
        setQuotaData(response);
      } else {
        // Fallback to old API if new one doesn't return success
        const affiliateUser = localStorage.getItem('affiliateUser');
        if (affiliateUser) {
          const parsedUser = JSON.parse(affiliateUser);
          const quotaRes = await ApiService.getAffiliateQuotaDetails(parsedUser.id);
          setQuotaData({
            current_quota: {
              initial: quotaRes.initial_api_quota || quotaRes.total_quota || 0,
              remaining: quotaRes.remaining_quota || 0
            },
            quota_packages: []
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch quota package details, trying fallback...');
      // Fallback to old API
      try {
        const affiliateUser = localStorage.getItem('affiliateUser');
        if (affiliateUser) {
          const parsedUser = JSON.parse(affiliateUser);
          const quotaRes = await ApiService.getAffiliateQuotaDetails(parsedUser.id);
          setQuotaData({
            current_quota: {
              initial: quotaRes.initial_api_quota || quotaRes.total_quota || 0,
              remaining: quotaRes.remaining_quota || 0
            },
            quota_packages: []
          });
        }
      } catch (fallbackError) {
        console.error('Fallback also failed');
      }
    } finally {
      setQuotaLoading(false);
    }
  };

  const handleSelectPackage = (pkg) => {
    setBuyPopoverVisible(false);
    Modal.confirm({
      title: 'Confirm Purchase',
      width: 400,
      content: (
        <div>
          <Typography.Text>You are about to purchase:</Typography.Text>
          <div style={{ marginTop: 12, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
            <Flex justify="space-between" style={{ marginBottom: 8 }}>
              <Typography.Text>Quota Amount:</Typography.Text>
              <Tag color="green" style={{ margin: 0 }}>{pkg.quota_amount}</Tag>
            </Flex>
            <Flex justify="space-between">
              <Typography.Text>Price:</Typography.Text>
              <Tag color="orange" style={{ margin: 0 }}>${pkg.price}</Tag>
            </Flex>
          </div>
          <Typography.Text type="secondary" style={{ display: 'block', marginTop: 12 }}>
            You will be redirected to Stripe for payment.
          </Typography.Text>
        </div>
      ),
      okText: 'Proceed to Checkout',
      cancelText: 'Cancel',
      onOk: async () => {
        message.loading({ content: 'Redirecting to checkout...', key: 'checkout' });
        const affiliateId = affiliate?._id || affiliate?.id;
        try {
          const response = await ApiService.checkoutQuotaPackage({
            affiliate_id: affiliateId,
            user_id: user?.id,
            quota_package_id: pkg._id
          });

          if (response.success && response.checkout_url) {
            window.location.href = response.checkout_url;
          } else {
            message.error({ content: 'Failed to initiate checkout', key: 'checkout' });
          }
        } catch (error) {
          message.error({ content: error.response?.data?.message || 'Failed to initiate checkout', key: 'checkout' });
        }
      },
    });
  };

  const handleContactForQuota = () => {
    setRequestedQuota(null);
    setContactModalVisible(true);
  };

  const handleRequestQuota = async () => {
    if (!requestedQuota || requestedQuota <= 0) {
      message.warning('Please enter a valid quota amount');
      return;
    }

    const affiliateId = affiliate?._id || affiliate?.id;
    if (!affiliateId) {
      message.error('Affiliate information not found');
      return;
    }

    setRequestLoading(true);
    try {
      const response = await ApiService.requestQuota({
        affiliate_id: affiliateId,
        quota: requestedQuota
      });

      if (response.success) {
        message.success(response.message || 'Quota request submitted successfully');
        setContactModalVisible(false);
        setRequestedQuota(null);
      } else {
        message.error(response.message || 'Failed to submit quota request');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to submit quota request');
    } finally {
      setRequestLoading(false);
    }
  };

  const callLogout = () => {
    localStorage.removeItem('affiliateToken');
    localStorage.removeItem('affiliateData');
    localStorage.removeItem('affiliateUser');
    window.location.href = '/';
  };

  const items = [
    {
      label: 'Profile',
      icon: <IoMdContact size={18} />,
      key: 'profile',
    },
    {
      label: (
        <Link onClick={callLogout} style={{ color: 'inherit', textDecoration: 'none' }}>
          Logout
        </Link>
      ),
      icon: <TbLogout2 size={18} />,
      key: 'logout',
    },
  ];

  return (
    <Layout.Header className="custom_header">
      <Flex gap="small" align="center" justify="space-between">
        <Flex gap="small" align="center">
          {isMobile ? (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={showDrawer}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
          ) : (
            <Button
              type="text"
              icon={
                collapsed ? (
                  <FaChevronCircleRight
                    size={20}
                    className="fw-500"
                    color="#66b3ff"
                  />
                ) : (
                  <FaChevronCircleLeft
                    size={20}
                    className="fw-500"
                    color="#66b3ff"
                  />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
          )}
        
        </Flex>

        <Flex gap="small" align="center">
          {/* Quota Display */}
          {quotaLoading ? (
            <Spin size="small" />
          ) : quotaData?.current_quota && (
            <Flex gap="small" align="center" style={{ marginRight: 8 }}>
              <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                Total Quota: <Tag color="blue" style={{ marginRight: 4 }}>{quotaData.current_quota.initial || 0}</Tag>
                Available: <Tag color={quotaData.current_quota.remaining > 0 ? 'green' : 'red'}>{quotaData.current_quota.remaining || 0}</Tag>
              </Typography.Text>
            </Flex>
          )}

          {/* Buy More Quota Button or Contact Button */}
          {quotaData?.quota_packages?.length > 0 ? (
            <Popover
              title="Select Quota Package"
              trigger="click"
              open={buyPopoverVisible}
              onOpenChange={setBuyPopoverVisible}
              placement="bottomRight"
              content={
                <div style={{ minWidth: 200 }}>
                  {quotaData?.quota_packages?.map((pkg) => (
                    <div
                      key={pkg._id}
                      onClick={() => handleSelectPackage(pkg)}
                      style={{
                        padding: '10px 12px',
                        cursor: 'pointer',
                        borderRadius: 6,
                        marginBottom: 4,
                        border: '1px solid #f0f0f0',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f5f5f5';
                        e.currentTarget.style.borderColor = '#1890ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = '#f0f0f0';
                      }}
                    >
                      <Flex justify="space-between" align="center">
                        <Typography.Text strong>{pkg.quota_amount} Quota</Typography.Text>
                        <Tag color="green" style={{ margin: 0 }}>${pkg.price}</Tag>
                      </Flex>
                    </div>
                  ))}
                </div>
              }
            >
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                size="small"
                style={{ marginRight: 8 }}
              >
                Buy More Quota
              </Button>
            </Popover>
          ) : quotaData && (
            <Button
              type="default"
              onClick={handleContactForQuota}
              size="small"
              style={{ marginRight: 8 }}
            >
              Contact For More Quota
            </Button>
          )}

          {onStartTour && (
            <Button
              type="default"
              icon={<RocketOutlined />}
              onClick={onStartTour}
              style={{
                borderRadius: '8px',
                height: '40px',
              }}
            >
              Tour
            </Button>
          )}

          <Dropdown
            menu={{ items }}
            placement="bottomRight"
            arrow={{ pointAtCenter: true}}
          >
            <Button type="text" style={{marginTop: '-15px'}}>
              <Flex gap="small" align="center">
                <Avatar src={affiliate?.logo || profile} />
                <div>
                  <Typography.Text className="fw-500" style={{ display: 'block' }}>
                    {user?.firstName || 'Affiliate'} {user?.lastName || 'User'}
                  </Typography.Text>
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: '12px', display: 'block' }}
                  >
                    Affiliate Portal
                  </Typography.Text>
                </div>
                <GoChevronDown size={12} />
              </Flex>
            </Button>
          </Dropdown>
        </Flex>
      </Flex>

      {/* Contact For More Quota Modal */}
      <Modal
        title="Request More Quota"
        open={contactModalVisible}
        onCancel={() => {
          setContactModalVisible(false);
          setRequestedQuota(null);
        }}
        onOk={handleRequestQuota}
        okText="Submit Request"
        okButtonProps={{ loading: requestLoading, disabled: !requestedQuota || requestedQuota <= 0 }}
        cancelButtonProps={{ disabled: requestLoading }}
      >
        <div style={{ marginBottom: 16 }}>
          <Typography.Text type="secondary">
            Current Available Quota: <Tag color="blue">{quotaData?.current_quota?.remaining || 0}</Tag>
          </Typography.Text>
        </div>
        <Typography.Text style={{ display: 'block', marginBottom: 8 }}>
          How much quota do you need?
        </Typography.Text>
        <InputNumber
          style={{ width: '100%' }}
          min={1}
          placeholder="Enter quota amount"
          value={requestedQuota}
          onChange={setRequestedQuota}
        />
        <Typography.Text type="secondary" style={{ display: 'block', marginTop: 12 }}>
          Our team will review your request and get back to you.
        </Typography.Text>
      </Modal>
    </Layout.Header>
  );
};

export default AffiliateLayoutHeader;
