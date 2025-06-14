import React, { useEffect, useState } from 'react';
import search_icon from './assets/search.png';
import humidity_icon from './assets/humidity.png';
import wind_icon from './assets/wind.png';
import './weather.css';

const Weather = () => {
  const [cityInput, setCityInput] = useState(""); 
  const [weather, setWeather] = useState(false);
  const [backgroundClass, setBackgroundClass] = useState("clear");
  const [iconKey, setIconKey] = useState(0); 

  const search = async (city) => {
    if (!city || city.trim() === "") {
      alert("Enter city name");
      return;
    }

    console.log("City searched:", city);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      console.log("API URL:", url);

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "City not found");
        return;
      }

      console.log("Weather Data:", data.weather[0]);

      const iconCode = data.weather[0].icon;
    
      const icon = `https://openweathermap.org/img/wn/${iconCode}@2x.png?t=${Date.now()}&r=${Math.random()}`;
      console.log("Icon URL:", icon);

      const mainWeather = data.weather[0].main.toLowerCase();

      const weatherMap = {
        clear: 'clear',
        clouds: 'clouds',
        rain: 'rain',
        drizzle: 'rain',
        thunderstorm: 'thunderstorm',
        snow: 'snow',
        mist: 'mist',
        haze: 'mist',
        fog: 'mist',
      };
      setBackgroundClass(weatherMap[mainWeather] || 'clear');

      const newWeatherData = {
        humidity: data.main.humidity,
        windspeed: data.wind.speed,
        temp: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
        iconCode: iconCode,
      };

      console.log("Setting new weather with icon:", icon);
      setWeather(newWeatherData);
      
    
      setIconKey(prev => prev + 1);

    } catch (error) {
      console.error("Error fetching weather:", error);
      setWeather(false);
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      search(cityInput);
    }
  };

  useEffect(() => {
    search("Bangalore");
  }, []);


  useEffect(() => {
    if (weather && weather.icon) {
      setIconKey(prev => prev + 1);
    }
  }, [weather?.iconCode, weather?.location]);

  return (
    <div className={`app-container ${backgroundClass}`}>
      <div className="weather">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search city"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <img
            src={search_icon}
            alt="Search Icon"
            onClick={() => search(cityInput)}
            style={{ cursor: 'pointer' }}
          />
        </div>

        {weather && (
          <>
            <img
              src={weather.icon}
              alt="Weather icon"
              className="weather-icon"
              key={`weather-icon-${weather.location}-${weather.iconCode}-${iconKey}`}
              onLoad={() => console.log("Weather icon loaded:", weather.icon)}
              onError={(e) => {
                console.error("Error loading weather icon:", e);
              
                e.target.src = `https://openweathermap.org/img/wn/${weather.iconCode}@2x.png`;
              }}
            />
            <p className="temperature">{weather.temp}°C</p>
            <p className="location">{weather.location}</p>
            <div className="weather-data">
              <div className="col">
                <img src={humidity_icon} alt="Humidity Icon" />
                <div>
                  <p>{weather.humidity}%</p>
                  <span>Humidity</span>
                </div>
              </div>
              <div className="col">
                <img src={wind_icon} alt="Wind Icon" />
                <div>
                  <p>{weather.windspeed} km/h</p>
                  <span>Wind Speed</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Weather;