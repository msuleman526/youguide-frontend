import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ApiService from '../../APIServices/ApiService';
import axios from 'axios';

const PdfToHtmlConverter = () => {
    const { id } = useParams(); // Get ID from the URL
    const [book, setBook] = useState(null);
    const [jsonPath, setJsonPath] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [htmlContent, setHtmlContent] = useState('');
    const [headings, setHeadings] = useState([]);
    const [showToc, setShowToc] = useState(false);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchHtmlContent = async () => {
            setLoading(true);
            try {
                if (id) {
                    const response = await ApiService.getVendorBookByID(id);
                    setBook(response)
                    setJsonPath(response.jsonPath);
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch or render HTML content.');
            } finally {
                setLoading(false);
            }
        };

        fetchHtmlContent();
    }, [id]);

    useEffect(() => {
        const fetchAndRenderJsonContent = async () => {
            if (!jsonPath) return;

            try {
                const res = await axios.get(jsonPath);
                const json = await res.data;
                const headingList = [];

                // Convert JSON to HTML string
                const html = json.content.map((item, index) => {
                    if (item.type === 'paragraph') {
                        let fontWeight = item.font_size == 18 || item.font_size == 14 ? 'bold' : 'normal';
                        let margin = item.level == 1 ? '20px' : item.level == 2 ? "10px" : "2px"

                        // Collect heading data
                        if (item.level === 1 || item.level === 2 || item.level === 3) {
                            headingList.push({
                                id: `heading-${index}`,
                                text: item.text,
                                level: item.level
                            });
                        }

                        return `<p id="heading-${index}" style="font-size: ${item.font_size + 3}px; color: #000000; font-weight: ${fontWeight}; margin-top: ${margin};">${item.text}</p>`;
                    }
                    return '';
                }).join('');

                setHtmlContent(html);
                setHeadings(headingList);
            } catch (err) {
                console.log(err)
                setError('Failed to render JSON content.');
            } finally {
                setLoading(false);
            }
        };

        fetchAndRenderJsonContent();
    }, [jsonPath]);


    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Left static image */}
            {!isMobile && <div
                style={{
                    width: '250px',
                    height: '100vh',
                    backgroundImage: "url('../collage-left.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    flexShrink: 0
                }}
            />}

            {/* Center scrollable content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', marginTop: '20px' }}>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>

            <div style={{ position: 'fixed', top: 20, right: isMobile ? 10 : 270, zIndex: 1000 }}>
                <button
                    onClick={() => setShowToc(!showToc)}
                    style={{
                        padding: '8px 12px',
                        backgroundColor: '#333',
                        color: '#fff',
                        border: 'none',
                        position: 'absolute',
                        right: "10px",
                        width: '150px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Table of Contents
                </button>

                {showToc && (
                    <div
                        style={{
                            marginTop: '40px',
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            width: '300px',
                            maxHeight: '500px',
                            overflowY: 'auto',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                            padding: '10px'
                        }}
                    >
                        {headings.map((heading, idx) => (
                            <div
                                key={idx}
                                onClick={() => {
                                    const element = document.getElementById(heading.id);
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        setShowToc(false); // optional: hide after click
                                    }
                                }}
                                style={{
                                    cursor: 'pointer',
                                    padding: '4px 0',
                                    marginLeft: `${(heading.level - 1) * 10}px`,
                                    fontWeight: heading.level === 1 ? 'bold' : 'normal',
                                    fontSize: heading.level === 1 ? '16px' : '14px',
                                    color: '#333'
                                }}
                            >
                                {heading.text}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right static image */}
            {!isMobile && <div
                style={{
                    width: '250px',
                    height: '100vh',
                    backgroundImage: "url('../collage-right.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    flexShrink: 0
                }}
            />}
        </div>
    );
};

export default PdfToHtmlConverter;
