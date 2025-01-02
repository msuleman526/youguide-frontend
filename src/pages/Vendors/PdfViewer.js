import { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { useParams } from 'react-router-dom';
import * as CryptoJS from 'crypto-js'; // Import CryptoJS for decryption
import ApiService from '../../APIServices/ApiService';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/browse/pdfjs-dist@4.10.38/build/pdf.worker.mjs';

const PdfToHtmlConverter = () => {
    const { encryptedPdfUrl } = useParams(); // Retrieve the encrypted PDF URL from the URL
    const [htmlContent, setHtmlContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to decrypt the encrypted PDF path
    const decryptPdfPath = (encryptedPath) => {
        const modifiedPathh = encryptedPath.replace('__SLASH__', '/');
        const bytes = CryptoJS.AES.decrypt(modifiedPathh, '1ju38091`594801kl35j05u91u50915'); // Use your secret key
        const decryptedPath = bytes.toString(CryptoJS.enc.Utf8); // Convert bytes to UTF-8 string
        return decryptedPath;
    };

    // Function to convert the PDF to HTML
    const convertPdfToHtml = async (url) => {
        setLoading(true);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch PDF.');
            }
            const pdf = await pdfjsLib.getDocument(url).promise;
            let html = '';
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                const text = textContent.items.map(item => item.str).join(' ');
                html += `<div><h3>Page ${pageNum}</h3><p>${text}</p></div>`;
            }
            setHtmlContent(html);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(error.message || 'Failed to convert PDF to HTML.');
        }
    };


    useEffect(() => {
        if (encryptedPdfUrl) {
            const decryptedUrl = decryptPdfPath(encryptedPdfUrl); // Decrypt the URL parameter
            let url = ApiService.documentURL + decryptedUrl
            convertPdfToHtml(url); // Pass the decrypted URL to the conversion function
        }
    }, [encryptedPdfUrl]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default PdfToHtmlConverter;
