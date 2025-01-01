import { Button, Col, Image, Row, Skeleton, Typography, message } from 'antd';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../atom';
import { useEffect, useState } from 'react';
import ApiService from '../../APIServices/ApiService';
import { useParams } from 'react-router-dom';

const SubscriptionGuides = () => {
  const { id } = useParams(); // Get ID from the URL
  const theme = useRecoilValue(themeState);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchGuides(pageNo);
  }, [pageNo]);

  const fetchGuides = async (page) => {
    setLoading(true);
    try {
      const response = await ApiService.getAllSubsciptionBooks(id, page, query, "en");
      console.log(response)
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
            <div style={{background: 'white', borderRadius: '15px',boxShadow: '5px 5px 5px 5px lightgray', height: '480px', display: 'flex', flexDirection: 'column', padding: '5px'}}>
              <Image src={ApiService.documentURL + guide.imagePath} style={{width: '100%',height: '350px', borderRadius: '15px'}}/>
              <Typography.Title level={4} style={{ margin: '10px 0' }}>
                {guide.name}
              </Typography.Title>
              {/* Open Book button */}
              <Button type="primary" style={{ marginTop: 'auto', backgroundColor: '#29b8e3', borderRadius: '20px'}}>
                Open Guide
              </Button>
            </div>
          </Col>
        ))}
      </Row>
      {loading && <Skeleton active />}
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button type="primary" onClick={handleLoadMore} loading={loading} stye={{ backgroundColor: '#29b8e3'}}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionGuides;
