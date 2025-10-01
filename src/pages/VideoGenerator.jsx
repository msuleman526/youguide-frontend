import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import largeLogo from "../assets/large_logo.png";
import readyMusic from "../assets/ready.mp3";
import { getCountryFlag } from "../Utils/CountryFlag";
import ApiService from "../APIServices/ApiService";

const CANVAS_W = 440;
const CANVAS_H = 720;
const FPS = 30;

const INTRO_SEC = 8;
const PER_IMAGE_SEC = 3.0;
const OUTRO_SEC = 2.0;

const API_BASE_URL = ApiService.baseURL;

export default function VideoGenerator() {
  const { tripId } = useParams();
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const [tripData, setTripData] = useState(null);
  const [thumbUrl, setThumbUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recordedBlobs, setRecordedBlobs] = useState([]);
  const [error, setError] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  
  const [progress, setProgress] = useState({ step: 'loading', percent: 0, message: 'Loading trip data...' });

  // Fetch trip data
  useEffect(() => {
    console.log('🚀 VideoGenerator: Component mounted, starting data fetch for tripId:', tripId);
    
    const fetchTripData = async () => {
      try {
        console.log('📡 API: Starting fetch request');
        setProgress({ step: 'loading', percent: 10, message: 'Loading trip data...' });
        
        const response = await fetch(`${API_BASE_URL}/video-data/${tripId}`);
        console.log('📡 API: Response received, status:', response.status);
        
        if (!response.ok) {
          console.error('❌ API: Request failed with status:', response.status);
          throw new Error('Trip not found');
        }
        
        const data = await response.json();
        console.log('✅ API: Trip data loaded successfully');
        
        setTripData(data);
        setProgress({ step: 'loaded', percent: 20, message: 'Trip data loaded successfully' });
      } catch (err) {
        console.error('❌ API: Failed to fetch trip data:', err);
        setError('Failed to load trip data');
      }
    };

    fetchTripData();
  }, [tripId]);

  // Calculate day numbers for trip points
  const tripPointsWithDays = useMemo(() => {
    if (!tripData?.tripPoints) return [];

    // Sort trip points by created_at date
    const sortedPoints = [...tripData.tripPoints].sort((a, b) => 
      new Date(a.created_at) - new Date(b.created_at)
    );

    // Group by date and assign day numbers
    const dayMap = new Map();
    let currentDay = 1;

    const pointsWithDays = sortedPoints.map(tp => {
      const date = new Date(tp.created_at).toDateString(); // Get date part only
      
      if (!dayMap.has(date)) {
        dayMap.set(date, currentDay);
        currentDay++;
      }
      
      return {
        ...tp,
        dayNumber: dayMap.get(date)
      };
    });

    console.log('📅 Days: Trip points with day numbers:', pointsWithDays.map(tp => ({
      created_at: tp.created_at,
      dayNumber: tp.dayNumber,
      area_name: tp.area_name
    })));

    return pointsWithDays;
  }, [tripData]);

  // Prepare assets for preloading - FLAGS FROM PUBLIC FOLDER
  const assets = useMemo(() => {
    if (!tripData) {
      console.log('⏳ Assets: No trip data yet, returning empty assets');
      return [];
    }
    
    const baseUrls = [
      largeLogo,
      ...(tripData.trip.presignedImageUrl ? [tripData.trip.presignedImageUrl] : []),
      ...tripPointsWithDays.flatMap(tp => 
        tp.media.filter(m => m.media_url).map(m => m.media_url)
      )
    ].filter(Boolean);

    // Add flag URLs - NO process.env.PUBLIC_URL needed for public folder
    const flagUrls = [];
    if (tripData.trip.countries) {
      const countryList = tripData.trip.countries.split(',').map(c => c.trim()).filter(Boolean);
      countryList.forEach(country => {
        const flagPath = getCountryFlag(country);
        if (flagPath) {
          flagUrls.push(flagPath); // Direct path like "/assets/countries/Pakistan.png"
        }
      });
    }

    // Add individual trip point country flags
    tripPointsWithDays.forEach(tp => {
      if (tp.country) {
        const flagPath = getCountryFlag(tp.country);
        if (flagPath) {
          flagUrls.push(flagPath);
        }
      }
    });
    
    const allUrls = [...baseUrls, ...flagUrls];
    const uniqueUrls = Array.from(new Set(allUrls));
    
    console.log('🖼️ Assets: Prepared assets list:', {
      totalAssets: uniqueUrls.length,
      baseUrls: baseUrls.length,
      flagUrls: flagUrls.length,
    });
    
    return uniqueUrls;
  }, [tripData, tripPointsWithDays]);

  // Preload images
  useEffect(() => {
    if (!tripData || assets.length === 0) {
      console.log('⏳ Images: Waiting for trip data and assets...');
      return;
    }

    console.log('🖼️ Images: Starting image preload process for', assets.length, 'assets');
    setIsSettingUp(true);
    
    let cancelled = false;
    const preloadImages = async () => {
      setIsReady(false);
      const imageMap = {};
      
      try {
        console.log('🖼️ Images: Beginning image preload process');
        setProgress({ step: 'configuring', percent: 25, message: 'Loading images and flags...' });
        
        let loadedCount = 0;
        const startTime = performance.now();
        
        await Promise.all(
          assets.map((src, index) => 
            new Promise((resolve) => {
              console.log(`🖼️ Images: Loading asset ${index + 1}/${assets.length}:`, src.substring(0, 100) + '...');
              
              const img = new Image();
              img.crossOrigin = "anonymous";
              
              img.onload = () => {
                imageMap[src] = img;
                loadedCount++;
                
                const progressPercent = 25 + (loadedCount / assets.length) * 50;
                let message = '';
                
                if (src === largeLogo) {
                  message = 'Loading app logo...';
                  console.log('✅ Images: Logo loaded successfully');
                } else if (src === tripData.trip.presignedImageUrl) {
                  message = 'Loading cover image...';
                  console.log('✅ Images: Cover image loaded successfully');
                } else if (src.includes('/assets/countries/')) {
                  message = 'Loading country flags...';
                  console.log('✅ Images: Flag loaded successfully:', src);
                } else {
                  message = `Loading trip images (${loadedCount}/${assets.length})...`;
                  console.log(`✅ Images: Trip media ${loadedCount}/${assets.length} loaded`);
                }
                
                setProgress({ 
                  step: 'loading-images', 
                  percent: Math.round(progressPercent), 
                  message 
                });
                resolve();
              };
              
              img.onerror = (e) => {
                console.warn('⚠️ Images: Failed to load image:', src, e);
                loadedCount++;
                const progressPercent = 25 + (loadedCount / assets.length) * 50;
                setProgress({ 
                  step: 'loading-images', 
                  percent: Math.round(progressPercent), 
                  message: `Loading images (${loadedCount}/${assets.length})...`
                });
                resolve();
              };
              
              img.src = src;
            })
          )
        );
        
        const loadTime = performance.now() - startTime;
        console.log('✅ Images: All images processed in', Math.round(loadTime), 'ms, loaded:', Object.keys(imageMap).length);
        
        if (!cancelled) {
          setLoadedImages(imageMap);
          setProgress({ step: 'ready', percent: 80, message: 'Ready to generate video!' });
          console.log('🎯 Images: Image map created with', Object.keys(imageMap).length, 'images');
          
          setTimeout(() => {
            setIsSettingUp(false);
            setIsReady(true);
          }, 1000);
        }
      } catch (e) {
        if (!cancelled) {
          console.error('❌ Images: Image loading error:', e);
          setError("Failed to load some images");
          setIsSettingUp(false);
        }
      }
    };

    preloadImages();
    return () => { 
      cancelled = true; 
      console.log('🛑 Images: Cleanup - cancelled image loading');
    };
  }, [assets, tripData]);

  // Calculate total duration
  const totalDurationSec = useMemo(() => {
    if (!tripData) return 0;
    const totalImages = tripPointsWithDays.reduce((sum, tp) => 
      sum + tp.media.filter(m => m.media_url).length, 0
    );
    const duration = INTRO_SEC + (totalImages * PER_IMAGE_SEC) + OUTRO_SEC;
    
    console.log('⏱️ Duration: Calculated video duration:', duration + 's');
    return duration;
  }, [tripData, tripPointsWithDays]);

  // Parse countries from comma-separated string
  const countries = useMemo(() => {
    if (!tripData?.trip.countries) return [];
    const countryList = tripData.trip.countries.split(',').map(c => c.trim()).filter(Boolean);
    console.log('🌍 Countries: Parsed countries:', countryList);
    return countryList;
  }, [tripData]);

  // Drawing helpers
  const drawCenteredText = (ctx, text, y, size, color = "#ffffff", shadow = true) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `700 ${size}px "Inter", system-ui, -apple-system, Arial`;
    if (shadow) {
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 2;
    }
    ctx.fillText(text, CANVAS_W / 2, y);
    ctx.restore();
  };

  // Helper for left-aligned text
  const drawLeftText = (ctx, text, x, y, size, color = "#ffffff", shadow = true) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = `700 ${size}px "Inter", system-ui, -apple-system, Arial`;
    if (shadow) {
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 2;
    }
    ctx.fillText(text, x, y);
    ctx.restore();
  };

  const drawImageCover = (ctx, img, x, y, w, h) => {
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const r = Math.max(w / iw, h / ih);
    const nw = iw * r;
    const nh = ih * r;
    const nx = x + (w - nw) / 2;
    const ny = y + (h - nh) / 2;
    ctx.drawImage(img, nx, ny, nw, nh);
  };

  // NEW: Helper for contain fit (like object-fit: contain)
  const drawImageContain = (ctx, img, x, y, w, h) => {
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const r = Math.min(w / iw, h / ih); // Use Math.min for contain
    const nw = iw * r;
    const nh = ih * r;
    const nx = x + (w - nw) / 2;
    const ny = y + (h - nh) / 2;
    ctx.drawImage(img, nx, ny, nw, nh);
  };

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  // UPDATED: Render single frame with Day numbers, left-aligned text and logo contain
  const renderFrame = (ctx, t) => {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    
    let cursor = 0;

    // 1. Intro Phase (Cover Image - keep centered)
    if (t < INTRO_SEC) {
      const coverImg = loadedImages[tripData.trip.presignedImageUrl];
      if (coverImg) {
        drawImageCover(ctx, coverImg, 0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      } else {
        ctx.fillStyle = "#0b1017";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      }

      const progress = easeOut(clamp(t / INTRO_SEC, 0, 1));
      const fontSize = 20 + (30 * progress);
      const opacity = 0.2 + (0.8 * progress);
      
      ctx.save();
      ctx.globalAlpha = opacity;
      drawCenteredText(ctx, tripData.trip.name, CANVAS_H / 2, fontSize);
      ctx.restore();

      // FIXED FLAG RENDERING - using direct public paths (keep centered for cover)
      if (countries.length > 0) {
        const flagSize = 30;
        const spacing = 10;
        const totalWidth = (countries.length * flagSize) + ((countries.length - 1) * spacing);
        let startX = (CANVAS_W - totalWidth) / 2;

        countries.forEach((country) => {
          const flagPath = getCountryFlag(country);
          if (flagPath) {
            const flagImg = loadedImages[flagPath];
            
            if (flagImg) {
              ctx.save();
              ctx.globalAlpha = progress;
              ctx.drawImage(flagImg, startX, CANVAS_H - 100, flagSize, flagSize * 0.75);
              ctx.restore();
              console.log('🏳️ Flag rendered:', country, 'at position', startX);
            } else {
              console.warn('⚠️ Flag not found in loadedImages:', flagPath);
            }
          }
          startX += flagSize + spacing;
        });
      }

      return;
    }
    cursor += INTRO_SEC;

    // 2. Trip Points Slideshow - LEFT ALIGNED with Day numbers
    const allMedia = tripPointsWithDays.flatMap(tp => 
      tp.media.filter(m => m.media_url).map(media => ({ ...media, tripPoint: tp }))
    );
    
    const slideshowDuration = allMedia.length * PER_IMAGE_SEC;
    if (t < cursor + slideshowDuration) {
      const slideTime = t - cursor;
      const slideIndex = Math.floor(slideTime / PER_IMAGE_SEC);
      const slideProgress = (slideTime % PER_IMAGE_SEC) / PER_IMAGE_SEC;
      
      const currentMedia = allMedia[slideIndex];
      if (currentMedia) {
        const mediaImg = loadedImages[currentMedia.media_url];
        if (mediaImg) {
          drawImageCover(ctx, mediaImg, 0, 0, CANVAS_W, CANVAS_H);
          ctx.fillStyle = "rgba(0,0,0,0.2)";
          ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        }

        const fadeIn = easeOut(clamp(slideProgress / 0.3, 0, 1));
        ctx.save();
        ctx.globalAlpha = fadeIn;
        
        const leftMargin = 20;
        
        // NEW: Day number above area name
        drawLeftText(ctx, `Day ${currentMedia.tripPoint.dayNumber}`, leftMargin, CANVAS_H - 150, 20, "#FFFFFF");
        
        // LEFT-ALIGNED: Area name
        drawLeftText(ctx, currentMedia.tripPoint.area_name, leftMargin, CANVAS_H - 120, 24, "#ffffff");
        
        // LEFT-ALIGNED: Flag and country in same row - FIXED: Added margin bottom
        const flagPath = getCountryFlag(currentMedia.tripPoint.country);
        const flagSize = 30;
        let countryRowX = leftMargin;
        const countryY = CANVAS_H - 100; // FIXED: Added 10px margin bottom
        
        // Draw flag first (if available)
        if (flagPath) {
          const flagImg = loadedImages[flagPath];
          
          if (flagImg) {
            ctx.drawImage(flagImg, countryRowX, countryY - 5, flagSize, flagSize * 0.75); // Adjust flag Y to align with text
            countryRowX += flagSize + 8; // Move right after flag + spacing
          }
        }
        
        // Draw country name next to flag - FIXED: Using countryY with margin
        drawLeftText(ctx, currentMedia.tripPoint.country, countryRowX, countryY + 10, 16, "#FFFFFF");
        
        ctx.restore();

        const fadeDur = 0.4;
        if (slideProgress < fadeDur / PER_IMAGE_SEC) {
          const fadeAlpha = 1 - (slideProgress / (fadeDur / PER_IMAGE_SEC));
          ctx.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
          ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        } else if (slideProgress > 1 - (fadeDur / PER_IMAGE_SEC)) {
          const fadeAlpha = (slideProgress - (1 - (fadeDur / PER_IMAGE_SEC))) / (fadeDur / PER_IMAGE_SEC);
          ctx.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
          ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        }
      }
      return;
    }
    cursor += slideshowDuration;

    // 3. Outro Phase - FIXED: Logo with contain fit
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    
    const logoImg = loadedImages[largeLogo];
    if (logoImg) {
      const logoSize = 150;
      const logoX = (CANVAS_W - logoSize) / 2;
      const logoY = (CANVAS_H - logoSize) / 2;
      // FIXED: Use contain logic with proper center positioning
      drawImageContain(ctx, logoImg, logoX, logoY, logoSize, logoSize);
    }
  };

  // Generate video with proper audio synchronization
  const generateVideo = async () => {
    console.log('🎬 Video Generation: Starting video generation with proper audio');
    const startTime = performance.now();
    
    try {
      setError("");
      setIsGenerating(true);
      setProgress({ step: 'setup', percent: 85, message: 'Setting up video recorder...' });

      const canvas = canvasRef.current;
      const audioEl = audioRef.current;
      
      if (!canvas || !audioEl) {
        throw new Error("Canvas or audio not available");
      }
      
      const ctx = canvas.getContext("2d");

      setProgress({ step: 'audio', percent: 88, message: 'Setting up audio recording...' });
      console.log('🎵 Audio: Setting up proper audio recording');

      // CRITICAL: Reset audio completely
      audioEl.pause();
      audioEl.currentTime = 0;
      audioEl.muted = false; // Don't mute - we need the audio in the recording
      audioEl.volume = 1.0;
      audioEl.loop = false;
      
      // Create new AudioContext
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      await audioCtx.resume();
      console.log('✅ Audio: AudioContext state:', audioCtx.state);
      
      // Create destination for mixed stream
      const dest = audioCtx.createMediaStreamDestination();
      const source = audioCtx.createMediaElementSource(audioEl);
      
      // CRITICAL: Only connect to destination, NOT to speakers during recording
      source.connect(dest);
      // Do NOT connect to audioCtx.destination during recording to avoid feedback
      
      // Setup recording streams
      const videoStream = canvas.captureStream(FPS);
      console.log('✅ Video: Canvas stream tracks:', videoStream.getTracks().length);
      
      const audioTracks = dest.stream.getAudioTracks();
      console.log('✅ Audio: Audio stream tracks:', audioTracks.length);
      
      const mixedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioTracks,
      ]);
      console.log('✅ Stream: Mixed stream tracks:', mixedStream.getTracks().length);

      // Use best available codec
      let mimeType = "video/webm";
      if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")) {
        mimeType = "video/webm;codecs=vp9,opus";
      } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")) {
        mimeType = "video/webm;codecs=vp8,opus";
      }
      console.log('🎥 Recorder: Using MIME type:', mimeType);

      const recorder = new MediaRecorder(mixedStream, { 
        mimeType, 
        videoBitsPerSecond: 3_000_000, // Slightly lower for stability
        audioBitsPerSecond: 128_000
      });
      
      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size) {
          chunks.push(e.data);
          console.log('📊 Recording: Chunk size:', Math.round(e.data.size / 1024) + 'KB');
        }
      };

      setProgress({ step: 'recording', percent: 90, message: 'Recording video with audio...' });
      console.log('🎬 Recording: Starting synchronized recording');

      // CRITICAL: Start everything in the right order
      console.log('🎥 Recording: Starting MediaRecorder...');
      recorder.start(200); // Larger chunks for stability
      
      // Wait for recorder to be ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Start audio playback
      console.log('🎵 Audio: Starting audio playback...');
      try {
        const playPromise = audioEl.play();
        await playPromise;
        console.log('✅ Audio: Audio started successfully');
      } catch (e) {
        console.error('❌ Audio: Audio start failed:', e);
        throw new Error('Audio failed to start');
      }
      
      // Start animation loop immediately after audio
      const recordingStartAt = performance.now();
      let rafId;
      let lastUpdateTime = 0;
      let frameCount = 0;

      const drawLoop = () => {
        const now = performance.now();
        const t = (now - recordingStartAt) / 1000;
        renderFrame(ctx, Math.min(t, totalDurationSec));
        frameCount++;
        
        // Update progress
        if (now - lastUpdateTime > 500) {
          const recordingProgress = Math.min((t / totalDurationSec) * 100, 100);
          const overallProgress = 90 + (recordingProgress * 0.08);
          
          let message = 'Recording video with audio...';
          if (t < INTRO_SEC) {
            message = 'Recording intro...';
          } else if (t >= INTRO_SEC && t < totalDurationSec - OUTRO_SEC) {
            const slideTime = t - INTRO_SEC;
            const currentSlide = Math.floor(slideTime / PER_IMAGE_SEC) + 1;
            const totalSlides = tripPointsWithDays.reduce((sum, tp) => sum + tp.media.length, 0);
            message = `Recording slideshow (${currentSlide}/${totalSlides})...`;
          } else {
            message = 'Recording outro...';
          }
          
          setProgress({ 
            step: 'recording', 
            percent: Math.round(overallProgress), 
            message 
          });
          lastUpdateTime = now;
        }
        
        if (t < totalDurationSec) {
          rafId = requestAnimationFrame(drawLoop);
        } else {
          console.log('🎬 Recording: Animation finished, frames rendered:', frameCount);
        }
      };

      // Start the drawing loop
      rafId = requestAnimationFrame(drawLoop);

      // Wait for the full duration + buffer
      console.log('⏰ Waiting: Recording for', totalDurationSec, 'seconds...');
      await new Promise(resolve => setTimeout(resolve, (totalDurationSec * 1000) + 500));
      
      // Stop everything
      cancelAnimationFrame(rafId);
      console.log('🛑 Recording: Stopping animation...');
      
      // Stop audio
      try {
        audioEl.pause();
        audioEl.currentTime = 0;
        console.log('✅ Audio: Audio stopped');
      } catch (e) {
        console.warn('⚠️ Audio: Error stopping audio:', e);
      }
      
      // Stop recorder
      console.log('🛑 Recording: Stopping recorder...');
      recorder.stop();

      setProgress({ step: 'finalizing', percent: 98, message: 'Processing video with audio...' });

      // Wait for recorder to finish
      await new Promise(resolve => {
        recorder.onstop = () => {
          console.log('✅ Recording: Recorder stopped');
          resolve();
        };
        // Fallback timeout
        setTimeout(resolve, 3000);
      });
      
      console.log('📊 Recording: Total chunks:', chunks.length);
      if (chunks.length === 0) {
        throw new Error('No video data recorded');
      }
      
      setRecordedBlobs(chunks);

      // Create video blob with audio
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      console.log('✅ Video: Final video created, size:', Math.round(blob.size / 1024 / 1024 * 100) / 100 + 'MB');

      // Generate thumbnail
      renderFrame(ctx, 0);
      const thumb = canvas.toDataURL("image/jpeg", 0.85);
      setThumbUrl(thumb);

      setProgress({ step: 'complete', percent: 100, message: 'Video with audio completed!' });
      
      const totalTime = performance.now() - startTime;
      console.log('🎉 Complete: Video generation finished in', Math.round(totalTime / 1000 * 10) / 10 + 's');

    } catch (e) {
      console.error('❌ Generation: Video generation failed:', e);
      setError("Failed to generate video: " + e.message);
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
      }, 1000);
    }
  };

  const handleGenerateVideo = () => {
    console.log('👆 User: Generate video button clicked');
    generateVideo();
  };

  const handlePlay = () => {
    console.log('▶️ Play: Starting video playback');
    setShowVideo(true);
    setTimeout(() => {
      if (videoRef.current) {
        // Ensure audio is enabled
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
        
        videoRef.current.play()
          .then(() => {
            console.log('✅ Play: Video with audio playing');
          })
          .catch(e => {
            console.error('❌ Play: Video play failed:', e);
            // Try playing muted first, then unmute
            videoRef.current.muted = true;
            return videoRef.current.play();
          })
          .then(() => {
            if (videoRef.current.muted) {
              videoRef.current.muted = false;
              console.log('✅ Play: Video unmuted after start');
            }
          })
          .catch(e => {
            console.error('❌ Play: Complete video play failed:', e);
          });
      }
    }, 100);
  };

  const handleDownload = () => {
    if (!recordedBlobs.length) return;
    
    const blob = new Blob(recordedBlobs, { type: recordedBlobs[0].type || "video/webm" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${tripData?.trip.name || "trip"}_with_audio.webm`;
    a.click();
    console.log('✅ Download: Video with audio downloaded');
  };

  const handleShare = async () => {
    try {
      if (!recordedBlobs.length) return;
      
      const blob = new Blob(recordedBlobs, { type: recordedBlobs[0].type || "video/webm" });

      if (navigator.canShare && navigator.canShare({ files: [new File([blob], "trip_with_audio.webm", { type: blob.type })] })) {
        await navigator.share({
          title: tripData?.trip.name || "My Trip",
          text: "Check out this amazing trip video with music!",
          files: [new File([blob], "trip_with_audio.webm", { type: blob.type })],
        });
        console.log('✅ Share: Video with audio shared');
      } else {
        const tempUrl = URL.createObjectURL(blob);
        window.open(`https://wa.me/?text=${encodeURIComponent("Check out my trip video with music: " + tempUrl)}`, "_blank");
      }
    } catch (e) {
      console.error('❌ Share: Share failed:', e);
      alert("Sharing not supported. Please download and share manually.");
    }
  };

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.error}>
            <h2>Error</h2>
            <p>{error}</p>
            <button style={styles.retryButton} onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <h2>Generating Video</h2>
            
            <div style={styles.progressContainer}>
              <div style={styles.progressBar}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${progress.percent}%`
                  }}
                ></div>
              </div>
              <p style={styles.progressText}>{progress.message}</p>
              <span style={styles.progressPercent}>{progress.percent}%</span>
            </div>
          </div>
          
          <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              style={{ display: 'block' }}
            />
            <audio 
              ref={audioRef} 
              src={readyMusic} 
              preload="auto" 
              style={{ display: 'block' }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (isSettingUp) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <h2>Setting Up</h2>
            <p>Preparing your trip data and trip points</p>
          </div>
          
          <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              style={{ display: 'block' }}
            />
            <audio 
              ref={audioRef} 
              src={readyMusic} 
              preload="auto" 
              style={{ display: 'block' }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (isReady && !videoUrl) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.coverImageContainer}>
            {tripData?.trip.presignedImageUrl && (
              <img 
                src={tripData.trip.presignedImageUrl}
                alt={tripData.trip.name}
                style={styles.coverImage}
              />
            )}
            
            <div style={styles.coverOverlay}>
              <div style={styles.tripInfo}>
                <h1 style={styles.tripTitle}>{tripData?.trip.name}</h1>
                <p style={styles.tripDetails}>
                  {countries.join(', ')} • {totalDurationSec}s video • {Object.keys(loadedImages).length} trip media
                </p>
              </div>
              
              <button 
                style={styles.generateButton}
                onClick={handleGenerateVideo}
              >
                Generate Trip Video
              </button>
            </div>
          </div>
          
          <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              style={{ display: 'block' }}
            />
            <audio 
              ref={audioRef} 
              src={readyMusic} 
              preload="auto" 
              style={{ display: 'block' }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.videoContainer}>
          {showVideo && videoUrl ? (
            <video
              ref={videoRef}
              controls
              style={styles.video}
              poster={thumbUrl || undefined}
              onEnded={() => setShowVideo(false)}
              playsInline // Important for mobile
              preload="metadata"
            >
              <source src={videoUrl} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          ) : (
            thumbUrl && (
              <img src={thumbUrl} alt="Video thumbnail" style={styles.thumbnail} />
            )
          )}
        </div>

        {videoUrl && (
          <div style={styles.buttonRow}>
            <button style={styles.button} onClick={handlePlay}>
              {showVideo ? "Replay Video" : "Play Video"}
            </button>
            <button style={styles.button} onClick={handleDownload}>
              Download Video
            </button>
            <button style={styles.button} onClick={handleShare}>
              Share Video
            </button>
          </div>
        )}
        
        <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            style={{ display: 'block' }}
          />
          <audio 
            ref={audioRef} 
            src={readyMusic} 
            preload="auto" 
            style={{ display: 'block' }}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #000000, #333333)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  container: {
    maxWidth: 500,
    width: "100%",
    textAlign: "center",
    position: "relative",
  },
  coverImageContainer: {
    position: 'relative',
    width: '100%',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
  },
  coverImage: {
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    display: 'block',
    aspectRatio: '9/16',
  },
  coverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '30px 20px',
    color: 'white',
  },
  tripInfo: {
    textAlign: 'left',
  },
  tripTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
  },
  tripDetails: {
    fontSize: '16px',
    margin: 0,
    opacity: 0.9,
    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
  },
  generateButton: {
    alignSelf: 'center',
    padding: "15px 30px",
    fontSize: "18px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #28a745, #20c997)",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 6px 20px rgba(40, 167, 69, 0.4)",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "30px",
  },
  spinner: {
    width: 50,
    height: 50,
    border: "5px solid rgba(255,255,255,0.3)",
    borderTop: "5px solid #007bff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  progressContainer: {
    width: "100%",
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  progressBar: {
    width: "100%",
    height: "8px",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007bff",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  progressText: {
    margin: 0,
    fontSize: "16px",
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
  },
  progressPercent: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.7)",
    fontWeight: "bold",
  },
  error: {
    background: "rgba(255,0,0,0.1)",
    border: "1px solid rgba(255,0,0,0.3)",
    borderRadius: 10,
    padding: 30,
    maxWidth: 500,
    margin: "0 auto",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    background: "#007bff",
    color: "white",
    cursor: "pointer",
  },
  videoContainer: {
    marginBottom: 30,
    display: "flex",
    justifyContent: "center",
  },
  thumbnail: {
    width: '85%',
    height: 'auto',
    borderRadius: 10,
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },
  video: {
    width: '85%',
    height: 'auto',
    borderRadius: 10,
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },
  buttonRow: {
    display: "flex",
    gap: 15,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  button: {
    padding: "12px 24px",
    fontSize: 16,
    fontWeight: "bold",
    border: "none",
    borderRadius: 8,
    background: "#007bff",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
    minWidth: 100,
  },
};

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  `;
  document.head.appendChild(styleSheet);
}
