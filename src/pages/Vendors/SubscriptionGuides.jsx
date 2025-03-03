import { Button, Col, Image, Row, Skeleton, Typography, message, Select, Input, Empty } from 'antd';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../atom';
import { useEffect, useState } from 'react';
import ApiService from '../../APIServices/ApiService';
import { useNavigate, useParams } from 'react-router-dom';
import * as CryptoJS from 'crypto-js';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const SubscriptionGuides = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from the URL
  const theme = useRecoilValue(themeState);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState({}); // Store selected file paths by guide ID
  const [buttonLoading, setButtonLoading] = useState({}); // Track loading state for each button

  useEffect(() => {
    fetchGuides(pageNo);
  }, [pageNo]);

  const fetchGuides = async (page) => {
    setGuides([])
    setLoading(true);
    const isMobile = window.innerWidth <= 768; // Detect mobile devices
    const limit = isMobile ? 1 : 8; // Set limit based on device type
    try {
      const response = await ApiService.getAllSubsciptionBooks(id, page, query, "en", limit);
      //setGuides((prev) => [...prev, ...response.books]);
      setGuides(response.books)
      setHasMore(response.totalPages > response.currentPage);
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPageNo((prev) => prev + 1);
  };

  const handleFileSelection = (guideId, filePath) => {
    setSelectedFiles((prev) => ({ ...prev, [guideId]: filePath }));
  };

  const handleOpenGuide = async (guideId) => {
    const filePath = selectedFiles[guideId];
    if (!filePath) return;

    // Set loading for this specific guide
    setButtonLoading((prev) => ({ ...prev, [guideId]: true }));

    try {
      // Call API to check subscription expiry
      const response = await ApiService.checkVendorSubscriptionExpiry(id);

      if (response.message === "Subscription Expired.") {
        message.warning("Subscription Expired");
        navigate("/subscription-expired");
      } else {
        // Encrypt the file path and open the guide
        const encrypted = CryptoJS.AES.encrypt(filePath, '1ju38091`594801kl35j05u91u50915').toString();
        const modifiedPath = encrypted.replace(/\//g, '__SLASH__');
        console.log(filePath)
        console.log(modifiedPath)
        window.open("#/view-content/" + modifiedPath);
      }
    } catch (error) {
       console.log("Error Fetching ", "error");
    } finally {
      // Reset loading for this guide
      setButtonLoading((prev) => ({ ...prev, [guideId]: false }));
    }
  };

  let onSearchClick = () => {
      setGuides([]);
      if(pageNo == 1){
         fetchGuides(1)
      }else{
        setPageNo(1);
      }
  }

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
          width: "400px",
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
          style={{ width: "250px", marginRight: "10px" }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="primary" style={{ background: "#27ae60", border: "none" }} size="large" onClick={onSearchClick}>
          Search
        </Button>
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
              {guides.map((guide) => (
                <Col  key={guide.id}
                xs={24}
                sm={8}
                md={6}
                lg={6}
                xl={6}
                className="custom-col"
                xxl={4}
                style={{ display: "flex", justifyContent: "center" }}>
                  <div
                    style={{
                      maxWidth: '300px',
                      background: "white",
                      borderRadius: "15px",
                      margin: 1,
                      boxShadow: "5px 5px 5px lightgray",
                      height: "420px",
                      display: "flex",
                      flexDirection: "column",
                      padding: "5px",
                    }}
                  >
                    <Image
                      src={ApiService.documentURL + guide.imagePath}
                      style={{
                        width: "101.5%",
                        height: "255px",
                        borderTopLeftRadius: "15px",
                        borderTopRightRadius: "15px",
                      }}
                    />

                    <Typography.Title level={5} style={{ margin: "10px 0", height: "80px" }}>
                      {guide.name && guide.name.length > 39 ? guide.name.slice(0, 39) + "..." : guide.name}
                    </Typography.Title>

                    {guide.pdfFiles && guide.pdfFiles.length > 0 ? (
                      <Select
                        placeholder="Select a language"
                        style={{ marginBottom: "10px" }}
                        options={guide.pdfFiles.map((file) => ({
                          label: file.language,
                          value: file.filePath,
                        }))}
                        value={selectedFiles[guide._id] || guide.pdfFiles[0]?.filePath}
                        onChange={(value) => handleFileSelection(guide._id, value)}
                      />
                    ) : (
                      <Typography.Text type="secondary" style={{ marginBottom: "10px" }}>
                        No Guides available
                      </Typography.Text>
                    )}
                    <Button
                      type="primary"
                      style={{
                        marginTop: "auto",
                        backgroundColor: "#29b8e3",
                        borderRadius: "20px",
                      }}
                      disabled={!selectedFiles[guide._id]}
                      loading={buttonLoading[guide._id]}
                      onClick={() => handleOpenGuide(guide._id)}
                    >
                      Open Guide
                    </Button>
                  </div>
                </Col>
              ))}
            </Row>
        {loading && <Skeleton active />}
        {guides.length === 0 && !loading && <Empty description="No Guides Found"/>}
        {/* {hasMore && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Button
              type="primary"
              onClick={handleLoadMore}
              loading={loading}
              style={{ backgroundColor: "#29b8e3" }}
            >
              Load More
            </Button>
          </div>
        )} */}
        {/* Pagination Buttons */}
        <div style={{ position: "fixed", bottom: "20px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {pageNo <= 1 && !hasMore ? "" : <Button 
            shape="circle" 
            icon={<LeftOutlined />} 
            onClick={handlePrevious} 
            disabled={pageNo <= 1 || loading}
            style={{ marginRight: "20px", backgroundColor: "#29b8e3", color: "white" }}
          />}
          {!hasMore ? "" :<Button 
            shape="circle" 
            icon={<RightOutlined />} 
            onClick={handleNext} 
            disabled={!hasMore || loading}
            style={{ marginLeft: "20px", backgroundColor: "#29b8e3", color: "white" }}
          />}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionGuides;
