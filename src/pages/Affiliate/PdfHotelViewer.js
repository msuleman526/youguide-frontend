import { Button, Col, Image, Row, Skeleton, Typography, message, Select, Input, Empty, Divider } from 'antd';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../atom';
import { useState, useLayoutEffect, useEffect, useRef } from 'react';
import ApiService from '../../APIServices/ApiService';
import { useNavigate, useParams } from 'react-router-dom';
import logo from "../../assets/large_logo.png";

const PdfHotelViewer = () => {
  const navigate = useNavigate();
  const { affiliateId, hotelId, id } = useParams(); // Get all IDs from URL
  const theme = useRecoilValue(themeState);
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentHotel, setCurrentHotel] = useState(null);
  const [currentAffiliate, setCurrentAffiliate] = useState(null);
  const [bookDetails, setBookDetails] = useState(null);

  useEffect(() => {
    fetchHotelDetails();
    fetchBookContent();
  }, [affiliateId, hotelId, id]);

  const fetchHotelDetails = async () => {
    try {
      const hotelResponse = await ApiService.getHotelById(hotelId);
      setCurrentHotel(hotelResponse);
      setCurrentAffiliate(hotelResponse.affiliateId);
    } catch (error) {
      console.log('Error fetching hotel details:', error);
      message.error('Failed to load hotel details');
    }
  };

  const fetchBookContent = async () => {
    try {
      // Check subscription and decrement click
      const subscriptionCheck = await ApiService.openHotelBookOneTime(hotelId);
      
      if (subscriptionCheck.message.includes("Subscription Expired")) {
        message.warning("Subscription Expired");
        navigate("/subscription-expired");
        return;
      }

      // Get book details and convert to HTML
      const bookResponse = await ApiService.getVendorBookByID(id);
      setBookDetails(bookResponse);
      
      const htmlResponse = await ApiService.convertPDFToHTML(id);
      setHtmlContent(htmlResponse.htmlContent);
    } catch (error) {
      console.log('Error fetching book content:', error);
      message.error('Failed to load book content');
      navigate(-1); // Go back if there's an error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#f0f0f0'
      }}>
        <Skeleton active />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", margin: 0, padding: 0, backgroundColor: '#f0f0f0' }}>
      {/* Fixed Header with Hotel Logo */}
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
          zIndex: 1000,
        }}
      >
        {currentHotel?.logo && (
          <img
            src={currentHotel.logo}
            alt="Client Logo"
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

      {/* Main Content */}
      <div style={{ paddingTop: '90px', padding: '20px', minHeight: 'calc(100vh - 200px)' }}>
        <div 
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}
        >
          {/* Book Title */}
          {bookDetails && (
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #e0e0e0',
              backgroundColor: currentHotel?.primaryColor || currentAffiliate?.primaryColor || '#3498db',
              color: 'white'
            }}>
              <Typography.Title level={3} style={{ color: 'white', margin: 0 }}>
                {bookDetails.name || bookDetails.eng_name}
              </Typography.Title>
            </div>
          )}
          
          {/* HTML Content */}
          <div 
            style={{ 
              padding: '30px',
              lineHeight: '1.6',
              fontSize: '16px'
            }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </div>

      {/* Footer with Hotel Logo and Affiliate By */}
      <div
        style={{
          width: "100%",
          background: "white",
          boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
          padding: "20px 0",
          marginTop: "50px"
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
          <Row gutter={[20, 20]} align="middle">
            {/* Powered By Section */}
            <Col xs={24} sm={12}>
              <Typography.Title level={5} style={{ color: '#000', marginBottom: '10px' }}>
                Powered By
              </Typography.Title>
              <Image
                src={logo}
                style={{ width: "120px" }}
                preview={false}
              />
            </Col>
            
            {/* Affiliate By Section */}
            <Col xs={24} sm={12}>
              {currentAffiliate?.logo && (
                <div>
                  <Typography.Title level={5} style={{ color: '#000', marginBottom: '10px' }}>
                    Affiliate By
                  </Typography.Title>
                  <Image
                    src={currentAffiliate.logo}
                    alt="Affiliate Logo"
                    style={{ width: "100px" }}
                    preview={false}
                  />
                </div>
              )}
            </Col>
          </Row>
          
          <Divider style={{ margin: '20px 0' }} />
          
          {/* Copyright */}
          <div style={{ textAlign: 'center' }}>
            <Typography.Text style={{ color: '#000000', fontSize: '14px' }}>
              Copyright © 2024 - YouGuide
            </Typography.Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfHotelViewer;
