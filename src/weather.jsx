import React, { useEffect, useState } from 'react';
import search_icon from './assets/search.png';
import humidity_icon from './assets/humidity.png';
import wind_icon from './assets/wind.png';


import clear_day from './assets/animated/day.svg';
import clouds_day from './assets/animated/cloudy-day-3.svg';
import rain_day from './assets/animated/rainy-1.svg';
import snow_day from './assets/animated/snowy-1.svg';
import thunderstorm_day from './assets/animated/thunder.svg';


import clear_night from './assets/animated/night.svg';
import clouds_night from './assets/animated/cloudy-night-3.svg';
import rain_night from './assets/animated/rainy-4.svg';
import snow_night from './assets/animated/snowy-4.svg';
import thunderstorm_night from './assets/animated/thunder.svg';


import './weather.css';

const Weather = () => {
  const [cityInput, setCityInput] = useState(""); 
  const [weather, setWeather] = useState(false);
  const [backgroundClass, setBackgroundClass] = useState("clear");

  const search = async (city) => {
    if (!city || city.trim() === "") {
      alert("Enter city name");
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "City not found");
        return;
      }

      const mainWeather = data.weather[0].main.toLowerCase();
      const iconCode = data.weather[0].icon; 
      const isDay = iconCode.includes("d");

      
      const weatherClassMap = {
        clear: 'clear',
        clouds: 'clouds',
        rain: 'rain',
        drizzle: 'rain',
        thunderstorm: 'thunderstorm',
        snow: 'snow'
      };
      setBackgroundClass(weatherClassMap[mainWeather] || 'clear');

    
      const iconMap = {
        day: {
          clear: clear_day,
          clouds: clouds_day,
          rain: rain_day,
          drizzle: rain_day,
          thunderstorm: thunderstorm_day,
          snow: snow_day
        },
        night: {
          clear: clear_night,
          clouds: clouds_night,
          rain: rain_night,
          drizzle: rain_night,
          thunderstorm: thunderstorm_night,
          snow: snow_night
        }
      };

      const icon = isDay
        ? iconMap.day[mainWeather] || clear_day
        : iconMap.night[mainWeather] || clear_night;

      const newWeatherData = {
        humidity: data.main.humidity,
        windspeed: data.wind.speed,
        temp: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      };

      setWeather(newWeatherData);
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
