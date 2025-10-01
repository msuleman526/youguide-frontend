import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import HTMLFlipBook from 'react-pageflip';
import { getCountryBoundary } from '../Utils/CountryBoundary';
import { getCountryFlag } from '../Utils/CountryFlag';
import largeLogo from "../assets/large_logo_white.png";
import ApiService from "../APIServices/ApiService";

const API_BASE_URL = ApiService.baseURL;
const PRIMARY_COLOR = '#65d2f2';

export default function PDFGenerator() {
  const { tripId } = useParams();
  const flipBookRef = useRef();
  
  const [tripData, setTripData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewPages, setPreviewPages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [screenSize, setScreenSize] = useState("small");

  function getSizeCategory() {
      const width = window.innerWidth;
      if (width >= 1200) return "large";
      if (width >= 768 && width < 1200) {
        if (width >= 900) return "medium";
        return "tablet";
      }
      return "small";
  }

  useEffect(() => {
      function handleResize() {
        setScreenSize(getSizeCategory());
      }
      console.log(screenSize)
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

  // Fetch trip data
  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/video-data/${tripId}`);
        if (!response.ok) throw new Error('Trip not found');
        
        const data = await response.json();
        setTripData(data);
      } catch (err) {
        console.error('Failed to fetch trip data:', err);
        setError('Failed to load trip data');
      }
    };

    fetchTripData();
  }, [tripId]);

  // Check if trip has enough data
  const canGenerate = () => {
    if (!tripData) return false;
    
    const tripPoints = tripData.tripPoints || [];
    const totalImages = tripPoints.reduce((sum, tp) => 
      sum + (tp.media ? tp.media.filter(m => m.media_url).length : 0), 0
    );
    
    return tripPoints.length >= 5 && totalImages >= 5;
  };

  // Progress update helper
  const updateProgress = (percent, text) => {
    setProgress(percent);
    setProgressText(text);
  };

  // FIXED Weather API function using Open-Meteo Archive
  const getWeatherData = async (lat, lng, date) => {
    try {
      const dateObj = new Date(date);
      const dateStr = dateObj.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      const response = await fetch(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${dateStr}&end_date=${dateStr}&hourly=temperature_2m`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.hourly && data.hourly.temperature_2m && data.hourly.temperature_2m.length > 0) {
          // Get average temperature for the day
          const temps = data.hourly.temperature_2m.filter(temp => temp !== null);
          const avgTemp = temps.reduce((sum, temp) => sum + temp, 0) / temps.length;
          return `${Math.round(avgTemp)}°C`;
        }
      }
    } catch (error) {
      console.log('Weather data not available');
    }
    return 'N/A';
  };

  // Elevation API function (free service)
  const getElevationData = async (lat, lng) => {
    try {
      const response = await fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`);
      if (response.ok) {
        const data = await response.json();
        return `${data.results[0].elevation}m`;
      }
    } catch (error) {
      console.log('Elevation data not available');
    }
    return 'N/A';
  };

  // Calculate trip statistics
  const getTripStats = () => {
    if (!tripData) return {};

    const tripPoints = tripData.tripPoints || [];
    const totalImages = tripPoints.reduce((sum, tp) => 
      sum + (tp.media ? tp.media.filter(m => m.media_url).length : 0), 0
    );

    // Calculate days based on created_at dates
    const dates = tripPoints.map(tp => new Date(tp.created_at).toDateString());
    const uniqueDates = [...new Set(dates)];
    
    return {
      kilometers: Math.floor(tripData.trip.total_km || 0),
      days: uniqueDates.length,
      steps: tripPoints.length,
      photos: totalImages
    };
  };

  // Generate Google Maps static image URL
  const getStaticMapUrl = () => {
    if (!tripData?.tripPoints?.length) return '';
    
    const points = tripData.tripPoints;
    const markers = points.map(tp => `${tp.latitude},${tp.longitude}`).join('|');
    const path = points.map(tp => `${tp.latitude},${tp.longitude}`).join('|');
    
    return `https://maps.googleapis.com/maps/api/staticmap?size=2000x2000&scale=2&maptype=hybrid&markers=color:red|${markers}&path=color:0x65D2F2|weight:3|${path}&key=AIzaSyAo1viD-Ut0TzXTyihevwuf-9tv_J3dPa0`;
  };

  // Helper function to calculate image dimensions for fill behavior (like CSS object-fit: cover)
  const calculateFillDimensions = (imgWidth, imgHeight, containerWidth, containerHeight) => {
    const imgRatio = imgWidth / imgHeight;
    const containerRatio = containerWidth / containerHeight;
    
    let width, height, x = 0, y = 0;
    
    if (imgRatio > containerRatio) {
      // Image is wider, fit to height and crop sides
      height = containerHeight;
      width = height * imgRatio;
      x = (containerWidth - width) / 2; // Center horizontally
    } else {
      // Image is taller, fit to width and crop top/bottom
      width = containerWidth;
      height = width / imgRatio;
      y = (containerHeight - height) / 2; // Center vertically
    }
    
    return { width, height, x, y };
  };

  // Load image and get dimensions
  const loadImageWithDimensions = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve({
          dataUrl: canvas.toDataURL('image/jpeg', 1.0),
          width: img.width,
          height: img.height
        });
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  const loadImageAsBase641 = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        resolve({
          base64: canvas.toDataURL('image/jpeg', 1.0),
          width: img.width,
          height: img.height,
        });
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  // Load image as base64 for PDF
  const loadImageAsBase64 = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 1.0));
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  // Calculate day number based on created_at
  const getDayNumber = (created_at, allTripPoints) => {
    const sortedPoints = [...allTripPoints].sort((a, b) => 
      new Date(a.created_at) - new Date(b.created_at)
    );
    
    const dates = [];
    sortedPoints.forEach(tp => {
      const date = new Date(tp.created_at).toDateString();
      if (!dates.includes(date)) {
        dates.push(date);
      }
    });
    
    const currentDate = new Date(created_at).toDateString();
    return dates.indexOf(currentDate) + 1;
  };

  // Generate PDF
  const generatePDF = async () => {
    setIsGenerating(true);
    setError("");
    updateProgress(5, "Initializing PDF generation...");

    try {
      // Create PDF in landscape mode
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const stats = getTripStats();
      const countries = tripData.trip.countries ? tripData.trip.countries.split(',').map(c => c.trim()) : [];
      
      updateProgress(10, "Creating cover page...");

      // Page 1: Cover Page with trip image background - FIXED WITH FILL BEHAVIOR
      const worldCoverData = await loadImageWithDimensions('/world_cover.png');
      if (tripData.trip.presignedImageUrl) {
        try {
          const tripImgData = await loadImageAsBase641(tripData.trip.presignedImageUrl);
          if (tripImgData) {
            pdf.addImage(tripImgData.base64, 'JPEG', 0, 0, pageWidth, pageHeight);
          } else {
            console.log("Trip Page 1 Not")
            // Fallback to primary color background
            pdf.setFillColor(101, 210, 242);
            pdf.rect(0, 0, pageWidth, pageHeight, 'F');
          }
        } catch (error) {
          console.log(error)
          console.warn('Could not load trip image for cover');
          pdf.setFillColor(101, 210, 242);
          pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        }
      } else {
        // Fallback to primary color background
        pdf.setFillColor(101, 210, 242);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      }
      
      // Add title in WHITE color, centered
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(36);
      pdf.setFont('helvetica', 'bold');
      const titleWidth = pdf.getTextWidth(tripData.trip.name);
      pdf.text(tripData.trip.name, (pageWidth - titleWidth) / 2, pageHeight / 2);

      updateProgress(20, "Creating intro page...");

      // Page 2: Intro Page - FIXED WITH WHITE BACKGROUND AND FILL BEHAVIOR
      pdf.addPage();
      
      // Set white background first
      pdf.setFillColor(255, 255, 255); // White background
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Load world_cover.png as background
      try {
        if (worldCoverData) {
          // Calculate fill dimensions for proper cropping
          const fillDims = calculateFillDimensions(
            worldCoverData.width, 
            worldCoverData.height, 
            pageWidth, 
            pageHeight
          );
          
          // Add image as background with fill behavior
          pdf.addImage(worldCoverData.dataUrl, 'PNG', fillDims.x, fillDims.y, fillDims.width, fillDims.height);
        }
      } catch (error) {
        console.warn('Could not load world cover image');
        // Keep white background if image fails
      }
      
      const user = tripData.user || {};
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      
      // Text with black color for better visibility on white background
      pdf.setTextColor(0, 0, 0); // BLACK color
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(fullName, pageWidth / 2, pageHeight / 2 - 10, { align: 'center' });
      pdf.setFontSize(18);
      pdf.text(tripData.trip.name, pageWidth / 2, pageHeight / 2 + 5, { align: 'center' });

      updateProgress(30, "Creating countries and summary page...");

      // Page 3: Countries & Summary
      pdf.addPage();
      
      // Left column (35%) - Countries
      const leftWidth = pageWidth * 0.35;
      const rightWidth = pageWidth * 0.65;
      
      // Left background
      pdf.setFillColor(29, 132, 142); // #1D848E
      pdf.rect(0, 0, leftWidth, pageHeight, 'F');
      
      // Countries title - WHITE
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('COUNTRIES', leftWidth / 2, 30, { align: 'center' });
      
      // Countries content
      if (countries.length <= 4) {
        // Show country images with transparent background
        let yPos = 50;
        for (const country of countries) {
          const boundaryPath = getCountryBoundary(country+"_blue");
          if (boundaryPath) {
            try {
              const boundaryImg = await loadImageAsBase64(boundaryPath);
              if (boundaryImg) {
                pdf.addImage(boundaryImg, 'PNG', 10, yPos, leftWidth - 20, 40);
                yPos += 50;
              }
            } catch (error) {
              console.warn('Could not load country boundary:', country);
            }
          }
        }
      } else {
        // Show country names list
        let yPos = 50;
        countries.forEach(country => {
          pdf.setFontSize(12);
          pdf.text(country, 15, yPos);
          yPos += 10;
        });
      }

      
      pdf.setTextColor(0, 0, 0); // Black text for visibility
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Trip Summary', leftWidth + rightWidth / 2, 30, { align: 'center' });
      
      // FIXED: Load icons from public folder for stats
      const iconPaths = {
        globe: '/globe.png',
        location: '/location.png', 
        calendar: '/calendar.png',
        camera: '/camera.png'
      };
      
      // Load all icons
      const icons = {};
      for (const [key, path] of Object.entries(iconPaths)) {
        try {
          const iconImg = await loadImageAsBase64(path);
          if (iconImg) {
            icons[key] = iconImg;
          }
        } catch (error) {
          console.warn(`Could not load icon: ${path}`);
        }
      }
      
      // Stats in 2x2 grid WITH icons
      const statsData = [
        { icon: icons.globe, count: stats.kilometers, name: 'KILOMETERS' },
        { icon: icons.location, count: stats.steps, name: 'STEPS' },
        { icon: icons.calendar, count: stats.days, name: 'DAYS' },
        { icon: icons.camera, count: stats.photos, name: 'PHOTOS' }
      ];
      
      let statX = leftWidth + 20;
      let statY = 60;
      const statSpacing = rightWidth / 2 - 20;
      
      statsData.forEach((stat, index) => {
        const x = statX + (index % 2) * statSpacing;
        const y = statY + Math.floor(index / 2) * 50;
        
        // Draw icon if available
        if (stat.icon) {
          pdf.addImage(stat.icon, 'PNG', x, y - 8, 16, 16); // Icon size 16x16
        }
        
        pdf.setTextColor(101, 210, 242); // PRIMARY_COLOR
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.text(stat.count.toString(), x + 20, y); // Offset for icon
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        pdf.text(stat.name, x + 20, y + 7); // Offset for icon
      });
      
      // Load home and destination icons
      const homeIcon = await loadImageAsBase64('/home.png');
      const destIcon = await loadImageAsBase64('/destination.png');
      
      // Home and destination at bottom with icons
      const firstPoint = tripData.tripPoints[0];
      const lastPoint = tripData.tripPoints[tripData.tripPoints.length - 1];
      
      let homeX = leftWidth + 20;
      if (homeIcon) {
        pdf.addImage(homeIcon, 'PNG', homeX, pageHeight - 35, 16, 16);
        homeX += 20;
      }
      pdf.setFontSize(14);
      pdf.text(firstPoint.area_name, homeX - 20, pageHeight - 13);
      
      let destX = leftWidth + rightWidth - 50;
      if (destIcon) {
        pdf.addImage(destIcon, 'PNG', destX, pageHeight - 35, 16, 16);
        destX += 20;
      }
      pdf.text(lastPoint.area_name, destX - 20, pageHeight - 13);
      
      // Draw line between them
      pdf.setDrawColor(101, 210, 242); // PRIMARY_COLOR
      pdf.line(leftWidth + 30, pageHeight - 27, leftWidth + rightWidth - 50, pageHeight - 27);

      updateProgress(40, "Creating map page...");

      // Page 4: Full Page Google Map
      pdf.addPage();
      const mapUrl = getStaticMapUrl();
      if (mapUrl) {
        try {
          const mapImg = await loadImageAsBase64(mapUrl);
          if (mapImg) {
            pdf.addImage(mapImg, 'JPEG', 0, 0, pageWidth, pageHeight);
          }
        } catch (error) {
          // Fallback if map fails
          pdf.setFillColor(200, 200, 200);
          pdf.rect(0, 0, pageWidth, pageHeight, 'F');
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(20);
          pdf.text('Map Not Available', pageWidth / 2, pageHeight / 2, { align: 'center' });
        }
      }

      updateProgress(50, "Processing trip points...");

      // Pages 5+: Trip Points
      const totalTripPoints = tripData.tripPoints.length;
      for (const [pointIndex, tripPoint] of [...tripData.tripPoints.entries()].reverse()) {
        updateProgress(50 + (pointIndex / totalTripPoints) * 40, `Processing trip point ${pointIndex + 1}/${totalTripPoints}...`);
        
        // First page for each trip point
        pdf.addPage();

        pdf.setFillColor(255, 255, 255); // Light gray
        pdf.rect(0, 0, leftWidth, pageHeight, 'F');
        
        // Country boundary - TRANSPARENT background
        const countryBoundaryPath = getCountryBoundary(tripPoint.country+"_white");
        if (countryBoundaryPath) {
          try {
            const countryImg = await loadImageAsBase64(countryBoundaryPath);
            if (countryImg) {
              pdf.addImage(countryImg, 'PNG', 10, 10, leftWidth - 20, 60);
            }
          } catch (error) {
            console.warn('Could not load country boundary for trip point');
          }
        }
        
        // Country flag and name - size 40x30
        const flagPath = getCountryFlag(tripPoint.country);
        let textY = 80;
        
        if (flagPath) {
          try {
            const flagImg = await loadImageAsBase64(flagPath);
            if (flagImg) {
              pdf.addImage(flagImg, 'PNG', 10, textY, 10, 5); // 40x30
            }
          } catch (error) {
            console.warn('Could not load flag for trip point');
          }
        }
        
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(13);
        pdf.text(tripPoint.country, 23, textY + 4); // Adjusted position
        textY += 15;
        
        // Area name
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(tripPoint.area_name, 10, textY);
        textY += 15;
        
        // Description
        if (tripPoint.description) {
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'normal');
          const splitDescription = pdf.splitTextToSize(tripPoint.description, leftWidth - 40);
          pdf.text(splitDescription, 10, textY);
          textY += splitDescription.length * 5 + 40;
        }else{
           textY += 50
        }
        
        // Stats in ROW format
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        const formattedDate = new Date(tripPoint.created_at).toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric' 
        });
        const weather = await getWeatherData(tripPoint.latitude, tripPoint.longitude, tripPoint.created_at);
        const altitude = await getElevationData(tripPoint.latitude, tripPoint.longitude);
        
        // Stats table with separators
        pdf.setFont('helvetica', 'bold');
        pdf.text('Date', 10, textY);
        pdf.text('Weather', 45, textY);
        pdf.text('Altitude', 70, textY);
        textY += 10;
        
        pdf.setFont('helvetica', 'normal');
        pdf.text(formattedDate, 10, textY);
        pdf.text(weather, 45, textY);
        pdf.text(altitude, 70, textY);
        textY += 20;
        
        // Day number at bottom with box
        const dayNum = getDayNumber(tripPoint.created_at, tripData.tripPoints);
        pdf.setFillColor(101, 210, 242); // PRIMARY_COLOR
        pdf.rect(10, pageHeight - 20, 15, 8, 'F'); // 30x20 box
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text(`DAY ${dayNum}`, 18, pageHeight - 14, { align: 'center' });
        
        // Right column (65%) - Light gray background with contained image
        pdf.setFillColor(240, 240, 240); // Light gray background
        pdf.rect(leftWidth, 0, rightWidth, pageHeight, 'F');
        
        if (tripPoint.media && tripPoint.media.length > 0) {
          const firstMedia = tripPoint.media[0];
          if (firstMedia.media_url) {
            try {
              const mediaImg = await loadImageAsBase641(firstMedia.media_url);
              if (mediaImg) {
                // Available space
                const maxWidth = rightWidth -20;
                const maxHeight = pageHeight - 20;

                // Original dimensions
                const { width: imgW, height: imgH } = mediaImg;

                // Scale while keeping aspect ratio ("contain" fit)
                const scale = Math.min(maxWidth / imgW, maxHeight / imgH, 1); 
                const drawW = imgW * scale;
                const drawH = imgH * scale;

                // Center in the available box
                const x = leftWidth + 10 + (maxWidth - drawW) / 2;
                const y = 10 + (maxHeight - drawH) / 2;

                // Draw image
                pdf.addImage(mediaImg.base64, 'JPEG', x, y, drawW, drawH);
              }
            } catch (error) {
              console.warn('Could not load first media for trip point');
            }
          }
        }
        
          // Additional pages for remaining media - CENTER CONTAIN
        const remainingMedia = tripPoint.media.slice(1);
        for (const media of remainingMedia) {
          if (!media.media_url) continue;
            pdf.addPage();
            try {
              const mediaImg = await loadImageAsBase641(media.media_url);
              if (mediaImg) {
                const { x, y, w, h } = containCenter(
                  mediaImg.width, mediaImg.height,
                  pageWidth, pageHeight,    // full page box
                  0, 0
                );
                pdf.addImage(mediaImg.base64, 'JPEG', x, y, w, h);
              }
            } catch {
              console.warn('Could not load media for trip point');
            }
        }
      }

      updateProgress(90, "Creating final page...");

      // Last Page: Logo
      pdf.addPage();
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      try {
        const logoImg = await loadImageAsBase64("/large_logo_white.png");
        if (logoImg) {
          const logoWidth = 70;
          const logoHeight = 20
          pdf.addImage(logoImg, 'PNG', (pageWidth - logoWidth) / 2, (pageHeight - logoHeight) / 2, logoWidth, logoHeight);
        }
      } catch (error) {
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(20);
        pdf.text('YouGuide', pageWidth / 2, pageHeight / 2, { align: 'center' });
      }

      updateProgress(95, "Generating PDF and preview...");

      // Generate PDF blob
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      setPdfBlob(pdfBlob);
      setPdfUrl(pdfUrl);
      
      // Generate preview pages for flip book
      await generatePreviewPages();
      
      updateProgress(100, "Complete!");
      
    } catch (error) {
      console.error('PDF generation error:', error);
      setError('Failed to generate PDF: ' + error.message);
    } finally {
      setIsGenerating(false);
      setTimeout(() => {
        setProgress(0);
        setProgressText("");
      }, 2000);
    }
  };

  // Helper: compute centered "contain" rect, never upscales past 1:1
  const containCenter = (imgW, imgH, boxW, boxH, boxX = 0, boxY = 0) => {
    const scale = Math.min(boxW / imgW, boxH / imgH, 1);
    const w = imgW * scale;
    const h = imgH * scale;
    const x = boxX + (boxW - w) / 2;
    const y = boxY + (boxH - h) / 2;
    return { x, y, w, h };
  };

  // Generate preview pages by recreating the actual PDF content
  // helper: draw image "contain" centered (no upscale beyond 1:1)
const drawContainCentered = (ctx, img, boxX, boxY, boxW, boxH) => {
  const scale = Math.min(boxW / img.width, boxH / img.height, 1);
  const w = img.width * scale;
  const h = img.height * scale;
  const x = boxX + (boxW - w) / 2;
  const y = boxY + (boxH - h) / 2;
  ctx.drawImage(img, x, y, w, h);
};

// helper: load image with CORS safe
const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

  const generatePreviewPages = async () => {
    const pages = [];
    try {
      updateProgress(94, "Building preview pages...");

      // canvas size roughly matches landscape A4 preview
      const CANVAS_W = 1190;
      const CANVAS_H = 842;

      const makeCanvas = () => {
        const c = document.createElement('canvas');
        c.width = CANVAS_W;
        c.height = CANVAS_H;
        return { c, ctx: c.getContext('2d') };
      };

      const leftWidth = CANVAS_W * 0.35;

      // 1) COVER
      {
        const { c, ctx } = makeCanvas();
        // background image or solid color
        if (tripData?.trip?.presignedImageUrl) {
          try {
            const img = await loadImage(tripData.trip.presignedImageUrl);
            ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
          } catch {
            ctx.fillStyle = '#65d2f2';
            ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
          }
        } else {
          ctx.fillStyle = '#65d2f2';
          ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        }

        // title
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 72px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 15;
        ctx.fillText(tripData?.trip?.name || 'Trip Name', CANVAS_W / 2, CANVAS_H / 2);
        ctx.shadowBlur = 0;

        pages.push(c.toDataURL('image/png', 1.0));
      }

      // 2) INTRO
      {
        const { c, ctx } = makeCanvas();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        try {
          const world = await loadImage('/world_cover.png');
          // fill behavior for full bleed
          const imgRatio = world.width / world.height;
          const canvasRatio = CANVAS_W / CANVAS_H;
          if (imgRatio > canvasRatio) {
            const h = CANVAS_H;
            const w = h * imgRatio;
            const x = (CANVAS_W - w) / 2;
            ctx.drawImage(world, x, 0, w, h);
          } else {
            const w = CANVAS_W;
            const h = w / imgRatio;
            const y = (CANVAS_H - h) / 2;
            ctx.drawImage(world, 0, y, w, h);
          }
        } catch {
          const g = ctx.createLinearGradient(0, 0, CANVAS_W, CANVAS_H);
          g.addColorStop(0, '#87CEEB');
          g.addColorStop(1, '#4682B4');
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        }

        const user = tripData?.user || {};
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.font = 'bold 40px Arial';
        ctx.fillText(fullName || 'Traveler', CANVAS_W / 2, CANVAS_H / 2 - 25);
        ctx.font = '36px Arial';
        ctx.fillText(tripData?.trip?.name || '', CANVAS_W / 2, CANVAS_H / 2 + 25);

        pages.push(c.toDataURL('image/png', 1.0));
      }

      // 3) COUNTRIES + SUMMARY
      {
        const stats = getTripStats();
        const countries = tripData.trip.countries ? tripData.trip.countries.split(',').map(c => c.trim()) : [];

        const { c, ctx } = makeCanvas();
        // left bg
        ctx.fillStyle = '#1D848E';
        ctx.fillRect(0, 0, leftWidth, CANVAS_H);
        // right bg
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(leftWidth, 0, CANVAS_W - leftWidth, CANVAS_H);

        // countries title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('COUNTRIES', leftWidth / 2, 60);

        if (countries.length <= 4) {
          let yPos = 100;
          for (const country of countries) {
            const path = getCountryBoundary(country + "_blue");
            if (path) {
              try {
                const img = await loadImage(path);
                drawContainCentered(ctx, img, 20, yPos, leftWidth - 40, 120);
                yPos += 140;
              } catch {
                ctx.fillStyle = '#ffffff';
                ctx.font = '24px Arial';
                ctx.textAlign = 'left';
                ctx.fillText(country, 30, yPos + 40);
                yPos += 60;
              }
            }
          }
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.font = '24px Arial';
          ctx.textAlign = 'left';
          let y = 100;
          countries.forEach(country => {
            ctx.fillText(country, 30, y);
            y += 36;
          });
        }

        // summary
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Trip Summary', leftWidth + (CANVAS_W - leftWidth) / 2, 60);

        const statDefs = [
          { path: '/globe.png', count: stats.kilometers, name: 'KILOMETERS' },
          { path: '/location.png', count: stats.steps, name: 'STEPS' },
          { path: '/calendar.png', count: stats.days, name: 'DAYS' },
          { path: '/camera.png', count: stats.photos, name: 'PHOTOS' },
        ];

        for (let k = 0; k < statDefs.length; k++) {
          const def = statDefs[k];
          const x = leftWidth + 60 + (k % 2) * 300;
          const y = 200 + Math.floor(k / 2) * 150;

          try {
            const icon = await loadImage(def.path);
            ctx.drawImage(icon, x, y - 32, 64, 64);
          } catch {
            ctx.fillStyle = '#65d2f2';
            ctx.beginPath();
            ctx.arc(x + 32, y, 32, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.fillStyle = '#65d2f2';
          ctx.textAlign = 'left';
          ctx.font = 'bold 56px Arial';
          ctx.fillText(String(def.count ?? 0), x + 80, y + 8);

          ctx.fillStyle = '#000';
          ctx.font = '28px Arial';
          ctx.fillText(def.name, x + 80, y + 40);
        }

        // home/destination
        const firstPoint = tripData.tripPoints[0];
        const lastPoint  = tripData.tripPoints[tripData.tripPoints.length - 1];

        try {
          const home = await loadImage('/home.png');
          ctx.drawImage(home, leftWidth + 60, CANVAS_H - 90, 48, 48);
        } catch {}
        try {
          const dest = await loadImage('/destination.png');
          ctx.drawImage(dest, CANVAS_W - 120, CANVAS_H - 90, 48, 48);
        } catch {}

        ctx.fillStyle = '#000';
        ctx.font = '32px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(firstPoint.area_name, leftWidth + 60, CANVAS_H - 30);
        ctx.textAlign = 'right';
        ctx.fillText(lastPoint.area_name, CANVAS_W - 60, CANVAS_H - 30);

        ctx.strokeStyle = '#65d2f2';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(leftWidth + 120, CANVAS_H - 66);
        ctx.lineTo(CANVAS_W - 120, CANVAS_H - 66);
        ctx.stroke();

        pages.push(c.toDataURL('image/png', 1.0));
      }

      // 4) MAP
      {
        const { c, ctx } = makeCanvas();
        ctx.fillStyle = '#e8f4f8';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        const mapUrl = getStaticMapUrl();
        if (mapUrl) {
          try {
            const map = await loadImage(mapUrl);
            ctx.drawImage(map, 0, 0, CANVAS_W, CANVAS_H);
          } catch {
            ctx.fillStyle = '#c8c8c8';
            ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
            ctx.fillStyle = '#000';
            ctx.font = '36px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Map Not Available', CANVAS_W / 2, CANVAS_H / 2);
          }
        }
        pages.push(c.toDataURL('image/png', 1.0));
      }

      // 5) TRIP POINTS (REVERSED to match PDF) — info page + remaining media pages
      {
        const points = [...tripData.tripPoints].reverse();

        for (const tripPoint of points) {
          // INFO PAGE (left text + first media on right)
          const { c, ctx } = makeCanvas();
          // left column
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, leftWidth, CANVAS_H);
          // right column
          ctx.fillStyle = '#f0f0f0';
          ctx.fillRect(leftWidth, 0, CANVAS_W - leftWidth, CANVAS_H);

          // country boundary
          try {
            const boundaryPath = getCountryBoundary(tripPoint.country + "_white");
            if (boundaryPath) {
              const bImg = await loadImage(boundaryPath);
              drawContainCentered(ctx, bImg, 20, 20, leftWidth - 40, 120);
            }
          } catch {}

          // flag
          let textY = 160;
          try {
            const flagPath = getCountryFlag(tripPoint.country);
            if (flagPath) {
              const flagImg = await loadImage(flagPath);
              ctx.drawImage(flagImg, 20, textY, 80, 60);
            }
          } catch {}

          // text
          ctx.fillStyle = '#000';
          ctx.textAlign = 'left';
          ctx.font = '28px Arial';
          ctx.fillText(tripPoint.country, 110, textY + 30);

          ctx.font = 'bold 36px Arial';
          ctx.fillText(tripPoint.area_name, 20, textY + 100);

          textY += 140;

          if (tripPoint.description) {
            ctx.font = '24px Arial';
            ctx.fillStyle = '#333';
            const words = tripPoint.description.split(' ');
            let line = '';
            let y = textY;
            const maxWidth = leftWidth - 80;
            for (let n = 0; n < words.length && y < CANVAS_H - 200; n++) {
              const test = line + words[n] + ' ';
              if (ctx.measureText(test).width > maxWidth && n > 0) {
                ctx.fillText(line, 20, y);
                line = words[n] + ' ';
                y += 30;
              } else {
                line = test;
              }
            }
            if (line.trim() && y < CANVAS_H - 200) ctx.fillText(line, 20, y);
            textY = y + 100;
          } else {
            textY += 100;
          }

          // stats row
          ctx.font = 'bold 24px Arial';
          ctx.fillStyle = '#000';
          const formattedDate = new Date(tripPoint.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
          ctx.fillText('Date', 20, textY);
          ctx.fillText('Weather', 160, textY);
          ctx.fillText('Altitude', 300, textY);

          ctx.font = '20px Arial';
          ctx.fillText(formattedDate, 20, textY + 30);
          ctx.fillText('N/A', 160, textY + 30);   // keep simple; live calls are slow here
          ctx.fillText('N/A', 300, textY + 30);

          // day badge
          const dayNum = getDayNumber(tripPoint.created_at, tripData.tripPoints);
          ctx.fillStyle = '#65d2f2';
          ctx.fillRect(20, CANVAS_H - 40, 90, 32);
          ctx.fillStyle = '#fff';
          ctx.textAlign = 'center';
          ctx.font = 'bold 20px Arial';
          ctx.fillText(`DAY ${dayNum}`, 65, CANVAS_H - 20);

          // right column first media
          const firstMedia = (tripPoint.media || []).find(m => m.media_url);
          if (firstMedia?.media_url) {
            try {
              const img = await loadImage(firstMedia.media_url);
              drawContainCentered(ctx, img, leftWidth + 20, 20, CANVAS_W - leftWidth - 40, CANVAS_H - 40);
            } catch {
              // placeholder
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(leftWidth + 20, 20, CANVAS_W - leftWidth - 40, CANVAS_H - 40);
              ctx.strokeStyle = '#ddd';
              ctx.lineWidth = 4;
              ctx.strokeRect(leftWidth + 20, 20, CANVAS_W - leftWidth - 40, CANVAS_H - 40);
              ctx.fillStyle = '#999';
              ctx.textAlign = 'center';
              ctx.font = '32px Arial';
              ctx.fillText('📷 Photo', leftWidth + (CANVAS_W - leftWidth) / 2, CANVAS_H / 2);
            }
          }

          pages.push(c.toDataURL('image/png', 1.0));

          // REMAINING MEDIA (each gets its own full page) — this was missing before
          const remaining = (tripPoint.media || []).filter(m => m.media_url).slice(firstMedia ? 1 : 0);
          for (const m of remaining) {
            const { c: c2, ctx: ctx2 } = makeCanvas();
            ctx2.fillStyle = '#ffffff';
            ctx2.fillRect(0, 0, CANVAS_W, CANVAS_H);
            if (m.media_url) {
              try {
                const img = await loadImage(m.media_url);
                drawContainCentered(ctx2, img, 0, 0, CANVAS_W, CANVAS_H);
              } catch {
                ctx2.fillStyle = '#f5f5f5';
                ctx2.fillRect(0, 0, CANVAS_W, CANVAS_H);
              }
            }
            pages.push(c2.toDataURL('image/png', 1.0));
          }
        }
      }

      // 6) LOGO PAGE
      {
        const { c, ctx } = makeCanvas();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        try {
          const logo = await loadImage(largeLogo || "/large_logo_white.png");
          const w = 400, h = 120;
          ctx.drawImage(logo, (CANVAS_W - w)/2, (CANVAS_H - h)/2, w, h);
        } catch {
          ctx.fillStyle = '#65d2f2';
          ctx.font = 'bold 72px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('YouGuide', CANVAS_W / 2, CANVAS_H / 2);
          ctx.fillStyle = '#333';
          ctx.font = '36px Arial';
          ctx.fillText('Travel Books', CANVAS_W / 2, CANVAS_H / 2 + 60);
        }
        pages.push(c.toDataURL('image/png', 1.0));
      }

      setPreviewPages(pages);
      updateProgress(100, "Preview ready!");
    } catch (err) {
      console.error('Preview error:', err);
      // graceful fallback
      const { c, ctx } = (() => {
        const c = document.createElement('canvas');
        c.width = 1190; c.height = 842;
        return { c, ctx: c.getContext('2d') };
      })();
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, 1190, 842);
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.font = '48px Arial';
      ctx.fillText('Preview Error', 595, 421);
      setPreviewPages([c.toDataURL('image/png')]);
    }
  };


  const handleDownload = () => {
    if (!pdfBlob) return;
    
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tripData.trip.name}_Travel_Book.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Flipbook navigation functions
  const handlePrevPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };

  const handleNextPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.error}>
            <h2>Error</h2>
            <p>{error}</p>
            <button style={styles.button} onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!tripData) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <h2>Loading Trip Data...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Transform Your Trip into Travel Book</h1>
        {showPreview && previewPages.length > 0 && (
            <div style={styles.previewContainer}>
              <div style={styles.bookControls}>
                <button 
                  style={styles.controlButton} 
                  onClick={handlePrevPage}
                  disabled={previewPages.length === 0}
                >
                  ←
                </button>
                <span style={styles.pageCounter}>
                  ({previewPages.length} pages)
                </span>
                <button 
                  style={styles.controlButton} 
                  onClick={handleNextPage}
                  disabled={previewPages.length === 0}
                >
                  →
                </button>
              </div>
              
              <div style={styles.flipBookContainer}>
                
                <HTMLFlipBook
                  ref={flipBookRef}
                  width={screenSize === 'large' ? 590 : screenSize == 'medium' || screenSize == 'tablet' ? 400 : 230}
                  height={screenSize === 'large' ? 450 : screenSize == 'medium' || screenSize == 'tablet' ? 290 : 160}
                  size="fixed"
                  minWidth={screenSize === 'large' ? 590 : screenSize == 'medium' || screenSize == 'tablet' ? 400 : 230}
                  maxWidth={screenSize === 'large' ? 590 : screenSize == 'medium' || screenSize == 'tablet' ? 400 : 230}
                  minHeight={screenSize === 'large' ? 450 : screenSize == 'medium' || screenSize == 'tablet' ? 290 : 160}
                  maxHeight={screenSize === 'large' ? 450 : screenSize == 'medium' || screenSize == 'tablet' ? 290 : 160}
                  usePortrait={false}
                >
                  {previewPages.map((page, index) => (
                    <div key={index} style={styles.flipPage}>
                      <img 
                        src={page} 
                        alt={`Page ${index + 1}`} 
                        style={styles.pageImage}
                        draggable={false}
                      />
                    </div>
                  ))}
                </HTMLFlipBook>
              </div>
              
              <p style={styles.flipInstructions}>
                Click on the corners or use the arrow buttons to flip pages
              </p>
            </div>
        )}


        {showPreview == false && tripData.trip.presignedImageUrl && (
          <div style={styles.imageContainer}>
            <img 
              src={tripData.trip.presignedImageUrl}
              alt={tripData.trip.name}
              style={styles.tripImage}
            />
          </div>
        )}
        
        <div style={styles.content}>
          <h2 style={styles.tripName}>{tripData.trip.name}</h2>
          
          {!canGenerate() ? (
            <div style={styles.warning}>
              <p>You need at least 5 trip photos to generate the travel book.</p>
              <p>Current: {tripData.tripPoints?.length || 0} trip points, {
                tripData.tripPoints?.reduce((sum, tp) => 
                  sum + (tp.media ? tp.media.filter(m => m.media_url).length : 0), 0
                ) || 0
              } photos</p>
            </div>
          ) : (
            <>
              {isGenerating ? (
                <div style={styles.generating}>
                  <div style={styles.spinner}></div>
                  <h3>Generating book...</h3>
                  <p>{progressText}</p>
                  <div style={styles.progressContainer}>
                    <div 
                      style={{
                        ...styles.progressBar,
                        width: `${progress}%`
                      }}
                    ></div>
                  </div>
                  <p style={styles.progressText}>{progress.toFixed(2)}%</p>
                </div>
              ) : pdfUrl ? (
                <div style={styles.results}>
                  <div style={styles.buttonGroup}>
                    <button style={styles.button} onClick={handleDownload}>
                      Download
                    </button>
                    <button 
                      style={styles.button} 
                      onClick={() => window.open(pdfUrl, '_blank')}
                    >
                      View
                    </button>
                    <button 
                      style={styles.button} 
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      {showPreview ? 'Hide Preview' : 'Preview'}
                    </button>
                  </div>
                </div>
              ) : (
                <button style={styles.generateButton} onClick={generatePDF}>
                  Generate Travel Book
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f0f9ff, #e0f2fe)",
    padding: "20px",
    fontFamily: "'Inter', system-ui, -apple-system, Arial",
  },
  container: {
    maxWidth: 800,
    margin: "0 auto",
    textAlign: "center",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "30px",
  },
  imageContainer: {
    marginBottom: "30px",
    display: "flex",
    justifyContent: "center",
  },
  tripImage: {
    width: "590px",
    height: "500px",
    objectFit: "cover",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  content: {
    background: "white",
    borderRadius: "15px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    margin: "0 auto",
    maxWidth: "560px",
    marginTop: "-60px",
    zIndex: 999,
    position: 'relative'
  },
  tripName: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "20px",
  },
  warning: {
    background: "#fee2e2",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    padding: "20px",
    color: "#dc2626",
  },
  generateButton: {
    background: PRIMARY_COLOR,
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "15px 30px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(101, 210, 242, 0.3)",
    transition: "all 0.3s ease",
  },
  generating: {
    padding: "30px",
  },
  results: {
    padding: "20px",
  },
  buttonGroup: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
  },
  button: {
    background: PRIMARY_COLOR,
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    minWidth: "110px",
  },
  // Progress bar styles
  progressContainer: {
    width: "100%",
    height: "8px",
    backgroundColor: "#e5e7eb",
    borderRadius: "4px",
    margin: "15px 0",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: PRIMARY_COLOR,
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  progressText: {
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: "bold",
  },
  // Enhanced flip book styles
  previewContainer: {
    marginTop: "30px",
    padding: "10px",
    borderRadius: "15px",
  },
  bookControls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    padding: "0 20px",
  },
  controlButton: {
    background: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  pageCounter: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#374151",
  },
  flipBookContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "5px",
    background: "linear-gradient(45deg, #f3f4f6, #e5e7eb)",
    borderRadius: "10px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
  },
  flipBook: {
    backgroundColor: "transparent",
    borderRadius: "8px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
  },
  flipPage: {
    backgroundColor: '#ffffff',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    position: 'relative',
  },
  pageImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    backgroundColor: '#ffffff',
    userSelect: 'none',
  },
  flipInstructions: {
    fontSize: "14px",
    color: "#6b7280",
    marginTop: "15px",
    fontStyle: "italic",
  },
  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    padding: "50px",
  },
  error: {
    background: "#fee2e2",
    border: "1px solid #fecaca",
    borderRadius: "15px",
    padding: "30px",
    color: "#dc2626",
    maxWidth: "560px",
    margin: "0 auto",
  },
  spinner: {
    marginLeft: '45%',
    width: 40,
    height: 40,
    border: "4px solid rgba(101, 210, 242, 0.3)",
    borderTop: "4px solid " + PRIMARY_COLOR,
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  overlayContent: {
    background: "white",
    borderRadius: "15px",
    padding: "40px",
    textAlign: "center",
    maxWidth: "560px",
    width: "90%",
    boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
  },
};

// Enhanced CSS animations and styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Enhanced flipbook styles */
    .travel-book {
      margin: 0 auto;
      background-color: transparent !important;
      border-radius: 8px;
      overflow: visible;
    }
    
    .travel-book .stf__parent {
      background-color: transparent !important;
      box-shadow: 0 15px 35px rgba(0,0,0,0.3);
      border-radius: 8px;
      overflow: visible;
    }
    
    .travel-book .stf__block {
      background-color: #ffffff !important;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      border: 1px solid #e5e7eb;
    }
    
    .travel-book .stf__block:hover {
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    
    /* Page corner indicators */
    .travel-book .stf__block::after {
      content: '';
      position: absolute;
      top: 5px;
      right: 5px;
      width: 20px;
      height: 20px;
      background: linear-gradient(135deg, transparent 50%, rgba(101, 210, 242, 0.3) 50%);
      border-radius: 0 4px 0 0;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .travel-book .stf__block:hover::after {
      opacity: 1;
    }
    
    /* Smooth page transitions */
    .travel-book .stf__block {
      transition: all 0.3s ease;
    }
    
    /* Enhanced button hover effects */
    .travel-book-controls button:hover {
      background-color: #4CBCE8 !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(101, 210, 242, 0.3) !important;
    }
    
    .travel-book-controls button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
    }
  `;
  document.head.appendChild(styleSheet);
}