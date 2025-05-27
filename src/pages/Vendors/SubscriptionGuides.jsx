import { Button, Col, Image, Row, Skeleton, Typography, message, Select, Input, Empty } from 'antd';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../atom';
import { useEffect, useState, useLayoutEffect } from 'react';
import ApiService from '../../APIServices/ApiService';
import { useNavigate, useParams } from 'react-router-dom';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { showAddress } from '../../Utils/Utils';

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

const SubscriptionGuides = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from the URL
  const theme = useRecoilValue(themeState);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("en");
  const [hasMore, setHasMore] = useState(true);

  useLayoutEffect(() => {
    fetchGuides(pageNo);
  }, [pageNo, language]);

  const fetchGuides = async (page) => {
    setGuides([]);
    setLoading(true);
    const isMobile = window.innerWidth <= 768; // Detect mobile devices
    const limit = isMobile ? 1 : 8; // Set limit based on device type
    try {
      const response = await ApiService.getAllSubsciptionBooks(id, page, query, language, limit);
      setGuides(response.books);
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
        window.top.location.href = "#/view-content/" + book._id;
      }
    } catch (error) {
      console.log("Error Fetching ", error);
    }
  };

  const onSearchClick = () => {
    setGuides([]);
    if (pageNo === 1) {
      fetchGuides(1);
    } else {
      setPageNo(1);
    }
  };

  const handleNext = () => {
    if (hasMore) {
      setPageNo(pageNo + 1);
    }
  };

  const handlePrevious = () => {
    if (pageNo > 1) {
      setPageNo(pageNo - 1);
    }
  };

  return (
    <div style={{ position: "relative", overflow: "hidden", height: "100vh", margin: 0, padding: 0 }}>
      {/* Fixed, Centered Search Bar */}
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
        <Button type="primary" style={{ background: "#27ae60", border: "none" }} size="large" onClick={onSearchClick}>
          Search
        </Button>
        <Select
          defaultValue={language}
          style={{ marginLeft: '10px', width: '120px' }}
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

      {/* Fixed Title Section */}
      <div
        style={{
          textAlign: "center",
          position: "fixed",
          top: "120px",
          left: 0,
          width: "100%",
          zIndex: 999,
          padding: "20px 0",
        }}
      >
        <Typography.Title level={4} className="my-0 fw-500 subscription-typography">
          Guides
        </Typography.Title>
        <Typography.Title level={2} className="my-0 fw-500 subscription-typography1">
          Our Travel Guides
        </Typography.Title>
      </div>

      {/* Scrollable Guides List */}
      <div className="scrollable-guides">
        <Row gutter={[16, 16]}>
          {guides.map((book) => (
            <Col
              key={book.name}
              xs={24}
              sm={8}
              md={6}
              lg={6}
              xl={6}
              className="custom-col"
              xxl={4}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div
                style={{
                  maxWidth: '300px',
                  width: '90%',
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
                  src={book.imagePath}
                  style={{
                    width: "100%",
                    height: "240px",
                    borderTopLeftRadius: "15px",
                    borderTopRightRadius: "15px",
                  }}
                />
                <Typography.Title level={5} style={{ margin: "10px 0", height: "80px" }}>
                  {(book?.name || book?.name).length > 39
                    ? (book?.name || book?.name ).slice(0, 39) + "..."
                    : book?.name  || book?.name }
                </Typography.Title>
                <Typography.Paragraph level={5} style={{color: 'black', margin: "10px 0", height: "40px", marginTop: '-30px'}}>
                    {showAddress(book)}
                </Typography.Paragraph>
                <Button
                  type="primary"
                  style={{
                    marginTop: "auto",
                    backgroundColor: "#29b8e3",
                    borderRadius: "20px",
                  }}
                  onClick={() => handleOpenGuide(book)}
                >
                  Open Guide
                </Button>
              </div>
            </Col>
          ))}
        </Row>
        {loading && <Skeleton active />}
        {guides.length === 0 && !loading && <Empty description="No Guides Found" />}
        {/* Pagination Buttons */}
        <div style={{ marginTop: '15px', bottom: "20px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {pageNo <= 1 && !hasMore ? null : (
            <Button
              shape="circle"
              icon={<LeftOutlined />}
              onClick={handlePrevious}
              disabled={pageNo <= 1 || loading}
              style={{ marginRight: "20px", backgroundColor: "#29b8e3", color: "white" }}
            />
          )}
          {!hasMore ? null : (
            <Button
              shape="circle"
              icon={<RightOutlined />}
              onClick={handleNext}
              disabled={!hasMore || loading}
              style={{ marginLeft: "20px", backgroundColor: "#29b8e3", color: "white" }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionGuides;