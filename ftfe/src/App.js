import './styles/base.css';
import './styles/components.css';
import './styles/modules.css';
import './styles/responsive.css';
import './styles/utilities.css';
import './App.css';
import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PhotoUploadQR from './PhotoUploadQR';
import PhotoUploadForm from './PhotoUploadForm';

const WEATHER_CODES = {
  0: { name: '晴', icon: '☀️' },
  1: { name: '晴', icon: '🌤' },
  2: { name: '多云', icon: '⛅' },
  3: { name: '阴', icon: '☁️' },
  45: { name: '雾', icon: '🌫' },
  48: { name: '冻雾', icon: '🌫' },
  51: { name: '小雨', icon: '🌦' },
  53: { name: '中雨', icon: '🌧' },
  55: { name: '大雨', icon: '💦' },
  56: { name: '冻雨', icon: '🌨' },
  57: { name: '强冻雨', icon: '🌨' },
  61: { name: '阵雨', icon: '🌦' },
  63: { name: '强阵雨', icon: '🌧' },
  65: { name: '暴雨', icon: '⛈' },
  71: { name: '小雪', icon: '❄️' },
  73: { name: '中雪', icon: '🌨' },
  75: { name: '大雪', icon: '❄️' },
  77: { name: '冰雹', icon: '🌨' },
  80: { name: '强降雨', icon: '🌧' },
  81: { name: '强降雨', icon: '🌧' },
  82: { name: '暴雨', icon: '⛈' },
  85: { name: '降雪', icon: '❄️' },
  86: { name: '强降雪', icon: '❄️' },
  95: { name: '雷暴', icon: '⛈' },
  96: { name: '雷雹', icon: '🌩' },
  99: { name: '强雷雹', icon: '🌩' }
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PhotoSection />} />
        <Route path="/upload" element={<PhotoUploadForm />} />
      </Routes>
    </Router>
  );
}

function PhotoSection() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [playQueue, setPlayQueue] = useState([]);
  const [playedImages, setPlayedImages] = useState(new Set());
  const prevImagesRef = useRef([]);
  const [weatherForecast, setWeatherForecast] = useState(null);
  const [weatherError, setWeatherError] = useState('');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${process.env.REACT_APP_CITY_LAT}&longitude=${process.env.REACT_APP_CITY_LON}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3`
        );
        if (!response.ok) throw new Error('weather data fetch failed');
        
        const { daily } = await response.json();
        setWeatherForecast({
          dates: daily.time,
          codes: daily.weathercode,
          maxTemps: daily.temperature_2m_max,
          minTemps: daily.temperature_2m_min
        });
      } catch (error) {
        setWeatherError(error.message);
      }
    };
    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 3600000);   
    return () => clearInterval(weatherInterval); 
  }, []);  

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`http://${process.env.REACT_APP_LOCAL_IP}:${process.env.REACT_APP_BE_PORT}/api/images`, { mode: 'cors' });
        if (!response.ok) {
          throw new Error(`HTTP error, status: ${response.status}`);
        }
        const data = await response.json();
        setGalleryImages(data.images);
      } catch (error) {
        console.error('fetch image failed:', error.message);
      }
    };
    fetchImages();
    const interval = setInterval(fetchImages, 10000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (galleryImages.length > 0) {
      const prevSet = new Set(prevImagesRef.current);
      const newImages = galleryImages.filter(img => !prevSet.has(img));
      const deletedImages = prevImagesRef.current.filter(img =>!galleryImages.includes(img));
      let unplayed = galleryImages.filter(img => !playedImages.has(img) && !newImages.includes(img));

      if (newImages.length > 0 || deletedImages.length > 0 || playQueue.length === 0) {
        if (deletedImages.length > 0) {
          unplayed = unplayed.filter(img =>!deletedImages.includes(img));
        }
        const newQueue = [
          ...shuffle(newImages),
          ...unplayed
        ];

        setPlayQueue(prev => [...prev, ...newQueue]);
        prevImagesRef.current = galleryImages;
      }      
    }
  }, [galleryImages]);

  useEffect(() => {
    const playImage = () => {
      console.log("tick-playQueue.length:", playQueue.length);
      if (playQueue.length === 0) {
        setPlayQueue(shuffle([...galleryImages]));
        setPlayedImages(new Set());
        return;
      };
      const currentImage = playQueue[0];
      const currentIndex = galleryImages.indexOf(currentImage);
      console.log("playing:", currentIndex);
      setPlayedImages(prev => new Set([...prev, currentImage]));
      setPlayQueue(prev => prev.slice(1));
      setCurrentGalleryIndex(currentIndex);
    };

    const timer = setInterval(playImage, 5000);
    return () => clearInterval(timer);
  }, [playQueue]);

  const shuffle = (array) => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const currentImage = galleryImages.length > 0 
  ? `http://${process.env.REACT_APP_LOCAL_IP}:${process.env.REACT_APP_BE_PORT}/images/${galleryImages[currentGalleryIndex]}`
  : null;

  return (
    <div className="App">
      <div className="container">
        <div className="photo-carousel">
          {currentImage ? (
            <img 
              src={currentImage} 
              alt="" 
              onError={(e) => e.target.style.display = 'none'}
            />
          ) : (
            <p className="placeholder">No images</p>
          )}
        </div>

        <div className="info-panel">
          <PhotoUploadQR />
          <div className="weather-card">
            <h3>3-Days Weather</h3>
            {weatherError && <p className="weather-error">{weatherError}</p>}
            {weatherForecast ? (
                  <div className="forecast-container">
                  {weatherForecast.dates.map((date, index) => {
                    const code = weatherForecast.codes[index];
                    return (
                      <div key={date} className="weather-card__daily-item">
                        <p>{new Date(date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}</p>
                        <div className="weather-card__icon-group">
                          {WEATHER_CODES[code]?.icon || '🌐'}
                          {/* <p>{WEATHER_CODES[code]?.name || 'unknown'}</p> */}
                        </div>
                        <p>{weatherForecast.maxTemps[index]}°/{weatherForecast.minTemps[index]}°</p>
                      </div>
                    );
                  })}
                </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
