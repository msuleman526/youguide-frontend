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
                if (!res.ok) throw new Error('Failed to fetch JSON content');
                const json = await res.json();

                // Convert JSON to HTML string
                const html = json.content.map((item, index) => {
                    if (item.type === 'paragraph') {
                        return `<p style="font-size: ${item.font_size}px; color: #${item.font_color};">${item.text}</p>`;
                    }
                    return '';
                }).join('');

                setHtmlContent(html);
            } catch (err) {
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
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
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
