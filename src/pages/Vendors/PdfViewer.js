import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as CryptoJS from 'crypto-js'; // Import CryptoJS for decryption
import ApiService from '../../APIServices/ApiService';

const PdfToHtmlConverter = () => {
    const { encryptedPdfUrl } = useParams(); // Retrieve the encrypted PDF URL from the URL
    const [htmlContent, setHtmlContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to decrypt the encrypted PDF path
    const decryptPdfPath = (encryptedPath) => {
        console.log(encryptedPath)
        let modifiedPath = encryptedPath.replace('__SLASH__', '/');
        modifiedPath = encryptedPath.replace('__SLASH__', '/');
        const bytes = CryptoJS.AES.decrypt(modifiedPath, '1ju38091`594801kl35j05u91u50915'); // Use your secret key
        const decryptedPath = bytes.toString(CryptoJS.enc.Utf8); // Convert bytes to UTF-8 string
        return decryptedPath;
    };

    useEffect(() => {
        const fetchHtmlContent = async () => {
            setLoading(true);
            try {
                if (encryptedPdfUrl) {
                    const decryptedUrl = decryptPdfPath(encryptedPdfUrl); // Decrypt the URL parameter
                    console.log(decryptedUrl)
                    const response = await ApiService.convertPDFToHTML(decryptedUrl)
                    const html = response.data;
                    setHtmlContent(`${html}`);
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch or render HTML content.');
            } finally {
                setLoading(false);
            }
        };

        fetchHtmlContent();
    }, [encryptedPdfUrl]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return <div style={{ margin: '20px' }} dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default PdfToHtmlConverter;
