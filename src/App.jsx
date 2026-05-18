import { useState, useEffect, useRef } from "react";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";
import DarkTheme from "./components/DarkTheme";

const getWeatherIcon = (code) => {
  if (code === 0) return "☀️";
  if (code >= 1 && code <= 3) return "☁️";
  if (code >= 45 && code <= 48) return "🌫️";
  if (code >= 51 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 95) return "🌩️";
  return "🌤️";
};

function getBackgroundClass(weather) {
  if (!weather) return "bg-slate-100";
  if (weather.temperature < 10) return "bg-sky-200";
  if (weather.temperature >= 10 && weather.temperature <= 25)
    return "bg-lime-100";
  if (weather.temperature > 25) return "bg-amber-200";
}

export default function App() {
  const [city, setCity] = useState(""); //(рядок пошуку)
  const [nameCity, setNameCity] = useState(""); //назва міста, яка вже знайдена
  const [weather, setWeather] = useState(null); //  Об'єкт з поточною погодою
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [forecast, setForecast] = useState(null); //прогноз погоди на 7 днів

  const [suggestions, setSuggestions] = useState([]); // Масив міст-підказок
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!city || city.trim() === "") {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=5&language=uk`
        );
        if (!response.ok) {
          throw new Error("Помилка від сервера");
        }
        const data = await response.json();

        console.log("ПІДКАЗКИ:", data.results);
        if (data.results) {
          setSuggestions(data.results);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.log("Помилка пошуку міст:", err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [city]);

  // Слідкуємо за кліками поза списком
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError("Ваш браузер не підтримує геолокацію.");
      return;
    }
    setIsLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
          );
          if (!response.ok) {
            throw new Error("Помилка від сервера");
          }
          const data = await response.json();

          setWeather(data.current_weather);
          setForecast(data.daily);

          // ДІЗНАЄМОСЯ НАЗВУ МІСТА ---
          const geoResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=uk`
          );
          const geoData = await geoResponse.json();

          // Якщо є city, беремо його. Якщо немає (наприклад, село), бере locality.
          setNameCity(geoData.city || geoData.locality || "Невідоме місце");
        } catch {
          setError("Не вдалося завантажити погоду за вашою локацією.");
          setWeather(null);
          setForecast(null);
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setError("Ви заборонили доступ до локації або сталася помилка.");
        setIsLoading(false);
      }
    );
  };

  const searchWeather = async () => {
    if (!city) return;
    setIsLoading(true);
    setSuggestions([]);
    setError("");

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=uk`
      );
      const data = await response.json();

      if (!data.results) {
        throw new Error("Місто не знайдено");
      }

      const lat = data.results[0].latitude;
      const lon = data.results[0].longitude;

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      if (!weatherResponse.ok) {
        throw new Error("Помилка від сервера погоди");
      }
      const weatherData = await weatherResponse.json();

      setWeather(weatherData.current_weather);
      setForecast(weatherData.daily);
      console.log(weatherData.daily);
      setNameCity(data.results[0].name);
    } catch {
      setError("Не вдалося знайти місто. Спробуйте ще раз.");
      setWeather(null);
      setForecast(null);
    } finally {
      setCity("");
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (cityName) => {
    setCity(cityName);
    setSuggestions([]);
  };

  return (
    <div
      className={`transition-colors duration-500 flex flex-col items-center justify-center min-h-screen py-12 relative ${
        isDark ? "bg-zinc-800" : getBackgroundClass(weather)
      }`}
    >
      <DarkTheme setIsDark={setIsDark} isDark={isDark} />
      <div
        className={`w-[90%] max-w-sm p-6 rounded-xl shadow-lg shrink-0 transition-colors duration-500 ${
          isDark ? "bg-neutral-600 text-gray-300" : "bg-white text-gray-800"
        }`}
      >
        <h1 className="text-2xl font-bold text-center">Weather App</h1>
        <SearchBar
          dropdownRef={dropdownRef}
          city={city}
          setCity={setCity}
          searchWeather={searchWeather}
          suggestions={suggestions}
          isDark={isDark}
          handleSuggestionClick={handleSuggestionClick}
          isLoading={isLoading}
          getUserLocation={getUserLocation}
        />
        <CurrentWeather
          error={error}
          isLoading={isLoading}
          nameCity={nameCity}
          weather={weather}
          getWeatherIcon={getWeatherIcon}
        />
      </div>
      <Forecast
        forecast={forecast}
        isDark={isDark}
        getWeatherIcon={getWeatherIcon}
      />
    </div>
  );
}
