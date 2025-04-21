import { Button, Col, Image, Row, Skeleton, Typography, message, Select, Input, Empty } from 'antd';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../atom';
import { useEffect, useState, useLayoutEffect } from 'react';
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
  const [selectedFiles, setSelectedFiles] = useState({}); // Store selected file paths by group ID
  const [selectedGuides, setSelectedGuides] = useState({}); // Store selected guide details (name, image) by group ID
  const [buttonLoading, setButtonLoading] = useState({}); // Track loading state for each button

  useLayoutEffect(() => {
    fetchGuides(pageNo);
  }, [pageNo]);

  useEffect(() => {
    if (guides.length > 0) {
      const defaultSelections = {};
      const defaultGuides = {};
      guides.forEach((book) => {
        if (book.group && book.group.length > 0) {
          const firstGuide = book.group[0];
          defaultSelections[book.eng_name] = firstGuide.filePath;
          defaultGuides[book.eng_name] = {
            name: firstGuide.name,
            imagePath: firstGuide.imagePath,
          };
        }
      });
      setSelectedFiles(defaultSelections);
      setSelectedGuides(defaultGuides);
    }
  }, [guides]);

  const fetchGuides = async (page) => {
    setGuides([]);
    setLoading(true);
    const isMobile = window.innerWidth <= 768; // Detect mobile devices
    const limit = isMobile ? 1 : 8; // Set limit based on device type
    try {
      const response = await ApiService.getAllSubsciptionBooks(id, page, query, "en", limit);
      // Map the response to ensure filePath is included
      const mappedBooks = response.books.map((book) => ({
        ...book,
        group: book.group.map((guide) => ({
          ...guide,
          filePath: guide.filePath || `Uploads/pdfs/${guide._id}_${guide.lang}.pdf`, // Fallback filePath
        })),
      }));
      setGuides(mappedBooks);
      setHasMore(response.totalPages > response.currentPage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelection = (groupId, filePath, guide) => {
    setSelectedFiles((prev) => ({ ...prev, [groupId]: filePath }));
    setSelectedGuides((prev) => ({
      ...prev,
      [groupId]: {
        name: guide.name,
        imagePath: guide.imagePath,
      },
    }));
  };

  const handleOpenGuide = async (groupId) => {
    const filePath = selectedFiles[groupId];
    if (!filePath) return;

    setButtonLoading((prev) => ({ ...prev, [groupId]: true }));

    try {
      const response = await ApiService.checkVendorSubscriptionExpiry(id);

      if (response.message === "Subscription Expired.") {
        message.warning("Subscription Expired");
        navigate("/subscription-expired");
      } else {
        const encrypted = CryptoJS.AES.encrypt(filePath, '1ju38091`594801kl35j05u91u50915').toString();
        const modifiedPath = encrypted.replace(/\//g, '__SLASH__');
        window.top.location.href = "#/view-content/" + modifiedPath;
      }
    } catch (error) {
      console.log("Error Fetching ", error);
    } finally {
      setButtonLoading((prev) => ({ ...prev, [groupId]: false }));
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
          width: "410px",
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
          style={{ width: "265px", marginRight: "10px" }}
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
          {guides.map((book) => (
            <Col
              key={book.eng_name}
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
                  src={ApiService.documentURL + (selectedGuides[book.eng_name]?.imagePath || book.group[0].imagePath)}
                  style={{
                    width: "101.5%",
                    height: "255px",
                    borderTopLeftRadius: "15px",
                    borderTopRightRadius: "15px",
                  }}
                />

                <Typography.Title level={5} style={{ margin: "10px 0", height: "80px" }}>
                  {(selectedGuides[book.eng_name]?.name || book.group[0].name).length > 39
                    ? (selectedGuides[book.eng_name]?.name || book.group[0].name).slice(0, 39) + "..."
                    : selectedGuides[book.eng_name]?.name || book.group[0].name}
                </Typography.Title>

                {book.group && book.group.length > 0 ? (
                  <Select
                    placeholder="Select a language"
                    style={{ marginBottom: "10px", width: "100%" }}
                    options={book.group.map((guide) => ({
                      label: guide.lang,
                      value: guide.filePath,
                      guide,
                    }))}
                    value={selectedFiles[book.eng_name]}
                    onChange={(value, option) => handleFileSelection(book.eng_name, value, option.guide)}
                    allowClear={false}
                    showSearch={false}
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
                  disabled={!selectedFiles[book.eng_name]}
                  loading={buttonLoading[book.eng_name]}
                  onClick={() => handleOpenGuide(book.eng_name)}
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