import { Button, Col, Image, Row, Skeleton, Typography, message, Select } from 'antd';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../atom';
import { useEffect, useState } from 'react';
import ApiService from '../../APIServices/ApiService';
import { useNavigate, useParams } from 'react-router-dom';
import * as CryptoJS from 'crypto-js';

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

  useEffect(() => {
    fetchGuides(pageNo);
  }, [pageNo]);

  const fetchGuides = async (page) => {
    setLoading(true);
    try {
      const response = await ApiService.getAllSubsciptionBooks(id, page, query, "en");
      setGuides((prev) => [...prev, ...response.books]);
      setHasMore(response.totalPages > response.currentPage);
    } catch (error) {
      message.error('Failed to fetch guides.');
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

  return (
    <div style={{ margin: '20px' }}>
      <div>
        <Typography.Title level={2} className="my-0 fw-500">
          Subscription Guides
        </Typography.Title>
        <Typography.Title level={4} className="my-0 fw-500">
          Browse and manage all subscription guides.
        </Typography.Title>
      </div>
      <Row gutter={[16, 16]} style={{ marginTop: '40px' }}>
        {guides.map((guide) => (
          <Col key={guide.id} xs={24} sm={12} md={6} lg={6} xl={4}>
            <div
              style={{
                background: 'white',
                borderRadius: '15px',
                boxShadow: '5px 5px 5px 5px lightgray',
                height: '500px',
                display: 'flex',
                flexDirection: 'column',
                padding: '5px',
              }}
            >
              <Image
                src={ApiService.documentURL + guide.imagePath}
                style={{ width: '100%', height: '320px', borderRadius: '15px' }}
              />
              <Typography.Title level={4} style={{ margin: '10px 0', height: '80px' }}>
                {guide.name}
              </Typography.Title>
              {/* Dropdown for book files */}
              {guide.pdfFiles && guide.pdfFiles.length > 0 ? (
                <Select
                  placeholder="Select a file"
                  style={{ marginBottom: '10px' }}
                  options={guide.pdfFiles.map((file) => ({
                    label: file.language,
                    value: file.filePath,
                  }))}
                  onChange={(value) => handleFileSelection(guide._id, value)}
                />
              ) : (
                <Typography.Text type="secondary" style={{ marginBottom: '10px' }}>
                  No Guides available
                </Typography.Text>
              )}
              {/* Open Guide button */}
              <Button
                type="primary"
                style={{ marginTop: 'auto', backgroundColor: '#29b8e3', borderRadius: '20px' }}
                disabled={!selectedFiles[guide._id]} // Disable only if no file is selected for this guide
                onClick={() => {
                  const encrypted = CryptoJS.AES.encrypt(selectedFiles[guide._id], '1ju38091`594801kl35j05u91u50915').toString();
                  const modifiedPath  = encrypted.replace(/\//g, '__SLASH__');
                  console.log(modifiedPath)
                  navigate("/view-content/" + modifiedPath);
                }}
              >
                Open Guide
              </Button>
            </div>
          </Col>
        ))}
      </Row>
      {loading && <Skeleton active />}
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button
            type="primary"
            onClick={handleLoadMore}
            loading={loading}
            style={{ backgroundColor: '#29b8e3' }}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionGuides;
