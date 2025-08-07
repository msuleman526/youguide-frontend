import { Button, Col, Image, Row, Skeleton, Typography, message, Select, Input, Empty, Divider } from 'antd';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../atom';
import { useState, useLayoutEffect, useEffect, useRef } from 'react';
import ApiService from '../../APIServices/ApiService';
import { useNavigate, useParams } from 'react-router-dom';
import { showAddress } from '../../Utils/Utils';
import logo from "../../assets/large_logo.png";

const languageOptions = [
  { name: "Arabic", code: "ar" },
  { name: "Chinese", code: "zh_cn" },
  { name: "Portuguese", code: "pt" },
  { name: "Russian", code: "ru" },
  { name: "Italian", code: "it" },
  { name: "English", code: "en" },
  { name: "Japanese", code: "ja" },
  { name: "Spanish", code: "es" },
  { name: "French", code: "fr" },
  { name: "German", code: "de" },
  { name: "Polish", code: "pl" },
  { name: "Dutch", code: "nl" }
];

const AffiliateSubscriptionGuides = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from the URL
  const theme = useRecoilValue(themeState);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("en");
  const [hasMore, setHasMore] = useState(true);
  const [currentAffiliate, setCurrentAffiliate] = useState(null);
  
  // Refs for scroll position tracking (only used for manual load more)
  const scrollPositionRef = useRef(0);
  const isLoadingMoreRef = useRef(false);

  useLayoutEffect(() => {
    fetchGuides(1, true); // Reset guides on language change
  }, [language]);

  // Removed automatic scroll loading - only load more on button click

  // Removed automatic loading when pageNo changes - only manual loading via button

  const fetchGuides = async (page, resetGuides = false) => {
    if (resetGuides) {
      setGuides([]);
      setPageNo(1);
    }
    setLoading(true);
    const isMobile = window.innerWidth <= 768; // Detect mobile devices
    const limit = isMobile ? 1 : 8; // Set limit based on device type
    try {
      let response = await ApiService.getAffiliateByID(id);
      setCurrentAffiliate(response);
      response = await ApiService.getAllAffiliateSubsciptionBooks(id, page, query, language, limit);
      
      if (resetGuides) {
        setGuides(response.books);
      } else {
        setGuides(prevGuides => {
          const newGuides = [...prevGuides, ...response.books];
          
          // Preserve scroll position after state update
          if (isLoadingMoreRef.current) {
            requestAnimationFrame(() => {
              window.scrollTo(0, scrollPositionRef.current);
              isLoadingMoreRef.current = false;
            });
          }
          
          return newGuides;
        });
      }
      setHasMore(response.totalPages > response.currentPage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGuide = async (book) => {
    try {
      const response = await ApiService.checkVendorSubscriptionExpiry(id);

      if (response.message === "Subscription Expired.") {
        message.warning("Subscription Expired");
        navigate("/subscription-expired");
      } else {
        window.open(`#/view-content/${book._id}`, '_blank');
      }
    } catch (error) {
      console.log("Error Fetching ", error);
    }
  };

  const onSearchClick = () => {
    setPageNo(1);
    fetchGuides(1, true); // Reset guides for new search
  };

  const handleLoadMore = () => {
    // Store current scroll position before loading more
    scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop;
    isLoadingMoreRef.current = true;
    
    // Directly call fetchGuides instead of updating pageNo
    fetchGuides(pageNo + 1, false);
    setPageNo(prevPage => prevPage + 1);
  };

  return (
    <div style={{ minHeight: "100vh", margin: 0, padding: 0 }}>
      {/* Fixed Header with Logo */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "70px",
          backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          zIndex: 1100, // higher than search bar
        }}
      >
        {currentAffiliate?.logo && (
          <img
            src={currentAffiliate.logo}
            alt="Logo"
            style={{
              height: "auto",
              width: 'auto',
              maxHeight: '60px',
              maxWidth: '200px',
              objectFit: "contain",
            }}
          />
        )}
      </div>

      {/* Fixed Search Bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "550px",
          height: "100px",
          background: "white",
          zIndex: 1000,
          padding: "15px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Input
          placeholder="Search with city, country, or name"
          style={{ width: "270px", marginRight: "10px" }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="primary" style={{ background: currentAffiliate?.primaryColor, border: "none" }} size="large" onClick={onSearchClick}>
          Search
        </Button>
        <Select
          defaultValue={language}
          style={{ marginLeft: '10px', width: '120px', border: `1px solid ${currentAffiliate?.primaryColor}`}}
          onChange={(value) => {setLanguage(value) 
            setPageNo(1)}}
          className={theme === 'light' ? 'header-search-input-light' : 'header-search-input-dark'}
        >
          {languageOptions.map((languag) => (
            <Select.Option key={languag.code} value={languag.code}>
              {languag.name}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* Main Content - No separate scroll container */}
      <div style={{ paddingTop: '60px' }}>
        {/* Title Section */}
        <div
          style={{
            textAlign: "center",
            padding: "40px 0",
            backgroundColor: "white"
          }}
        >
          <Typography.Title level={2} className="my-0 fw-500 subscription-typography1">
            Our Travel Guides
          </Typography.Title>
        </div>

        {/* Center container with max-width for large screens */}
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '20px', 
            justifyContent: 'center',
            '@media (max-width: 576px)': { justifyContent: 'center' }
          }}>
            {guides.map((book) => (
              <div
                key={book.name}
                style={{
                  flex: '0 0 auto',
                  width: '280px',
                  '@media (max-width: 768px)': { width: '100%', maxWidth: '400px' },
                  '@media (max-width: 576px)': { width: '100%', maxWidth: '350px' }
                }}
              >
                <div
                  id="one-book"
                  style={{
                    width: '100%',
                    background: "white",
                    borderRadius: "15px",
                    margin: 1,
                    boxShadow: "5px 5px 5px lightgray",
                    height: "400px",
                    display: "flex",
                    flexDirection: "column",
                    padding: "5px",
                  }}
                >
                  <Image
                    src={book.fullCover}
                    style={{
                      width: "100%",
                      height: "240px",
                      borderTopLeftRadius: "15px",
                      borderTopRightRadius: "15px",
                    }}
                  />
                  <Typography.Title level={5} style={{ margin: "10px 0", height: "80px", color: currentAffiliate?.primaryColor }}>
                    {(book?.name || book?.name).length > 39
                      ? (book?.name || book?.name ).slice(0, 39) + "..."
                      : book?.name  || book?.name }
                  </Typography.Title>
                  <Typography.Paragraph level={5} style={{color: 'black', margin: "10px 0", height: "40px", marginTop: '-30px', color: '#000'}}>
                      {showAddress(book)}
                  </Typography.Paragraph>
                  <Button
                    type="primary"
                    style={{
                      marginTop: "auto",
                      backgroundColor: currentAffiliate?.primaryColor,
                      borderRadius: "20px",
                    }}
                    onClick={() => handleOpenGuide(book)}
                  >
                    Open Guide
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      
        
        {/* Load More Button - shown when there are more items and not currently loading */}
        {hasMore && !loading && guides.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '30px' }}>
            <Button 
              type="primary" 
              size="large"
              style={{ 
                backgroundColor: currentAffiliate?.primaryColor || '#1890ff', 
                border: 'none',
                borderRadius: '25px',
                padding: '10px 30px',
                height: 'auto'
              }}
              onClick={handleLoadMore}
            >
              Load More Guides
            </Button>
          </div>
        )}
        
        {/* No more content message */}
        {!hasMore && guides.length > 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
            <Typography.Text>No more guides to load</Typography.Text>
          </div>
        )}
        
        {guides.length === 0 && !loading && <Empty description="No Guides Found" />}
      </div>

      {/* Footer */}
      <div
        style={{
          width: "100%",
          background: "white",
          boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
          padding: "30px 0",
          marginTop: "50px"
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
          {/* Two Column Layout */}
          <Row gutter={[40, 40]} style={{ marginBottom: '40px' }}>
            {/* Logo and Description Column */}
            <Col xs={24} md={12}>
              {currentAffiliate?.logo && (
                <img
                  src={currentAffiliate.logo}
                  alt="Logo"
                  style={{
                    height: "60px",
                    width: 'auto',
                    maxWidth: '200px',
                    objectFit: "contain",
                    marginBottom: '20px'
                  }}
                />
              )}
              <Typography.Paragraph style={{ fontSize: '16px', lineHeight: '1.6', color: 'black'}}>
                {currentAffiliate?.name ? 
                  `${currentAffiliate.name} provides comprehensive travel guides powered by YouGuide, offering destination guides in 13 languages, seamless eSIM connectivity worldwide, and language guides for 50+ languages to enhance your travel experience.` :
                  'Comprehensive travel guides offering destination information in 13 languages, seamless eSIM connectivity worldwide, and language guides for 50+ languages to enhance your travel experience.'
                }
              </Typography.Paragraph>
            </Col>

            {/* Information and Large Logo Column */}
            <Col xs={24} md={12}>
              <Row gutter={[20, 20]}>
                {/* Information sub-column */}
                <Col xs={24} lg={12}>
                  <Typography.Title level={4} style={{ color: '#000', marginBottom: '20px' }}>
                    Information
                  </Typography.Title>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <a href="https://www.youguide.com/pages/about-us" target="_blank" rel="noopener noreferrer" 
                       style={{ color: '#000', textDecoration: 'none', fontSize: '14px' }}>
                      About us
                    </a>
                    <a href="https://www.youguide.com/pages/contact" target="_blank" rel="noopener noreferrer" 
                       style={{ color: '#000', textDecoration: 'none', fontSize: '14px' }}>
                      Contact us
                    </a>
                    <a href="https://www.youguide.com/blogs/news" target="_blank" rel="noopener noreferrer" 
                       style={{ color: '#000', textDecoration: 'none', fontSize: '14px' }}>
                      Blogs
                    </a>
                    <a href="https://www.youguide.com/pages/privacy-policy" target="_blank" rel="noopener noreferrer" 
                       style={{ color: '#000', textDecoration: 'none', fontSize: '14px' }}>
                      Privacy Policy
                    </a>
                    <a href="https://www.youguide.com/pages/terms-and-conditions" target="_blank" rel="noopener noreferrer" 
                       style={{ color: '#000', textDecoration: 'none', fontSize: '14px' }}>
                      Terms and Conditions
                    </a>
                    <a href="https://www.youguide.com/pages/eula" target="_blank" rel="noopener noreferrer" 
                       style={{ color: '#000', textDecoration: 'none', fontSize: '14px' }}>
                      EULA
                    </a>
                    <a href="https://www.youguide.com/pages/merchandise-1" target="_blank" rel="noopener noreferrer" 
                       style={{ color: '#000', textDecoration: 'none', fontSize: '14px' }}>
                      Merchandise
                    </a>
                    <a href="https://www.youguide.com/pages/affiliate-program" target="_blank" rel="noopener noreferrer" 
                       style={{ color: '#000', textDecoration: 'none', fontSize: '14px' }}>
                      Affiliate program
                    </a>
                  </div>
                </Col>
                
                {/* Large Logo sub-column - positioned at top */}
                <Col xs={24} lg={12} style={{ display: 'block', justifyContent: 'center', alignItems: 'flex-start' }}>
                  <Typography.Title level={4} style={{ color: '#000', marginBottom: '20px' }}>
                    Powered By
                  </Typography.Title>
                  <Image
                    src={logo}
                    style={{ width: "150px" }}
                    preview={false}
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Separator */}
          <Divider style={{ margin: '20px 0', borderColor: '#e0e0e0' }} />
        </div>

        {/* Copyright Section */}
        <div
          style={{
            height: '50px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 'auto'
          }}
        >
          <Typography.Text style={{ color: '#000000', fontSize: '14px' }}>
            Copyright © 2024 - YouGuide
          </Typography.Text>
          </div>
      </div>
    </div>
  );
};

export default AffiliateSubscriptionGuides;