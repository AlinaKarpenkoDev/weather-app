import WeatherSkeleton from "./WeatherSkeleton";
import { CurrentWeatherType } from "../App";

interface CurrentWeatherProps {
  error: string;
  isLoading: boolean;
  nameCity: string;
  weather: CurrentWeatherType | null;
  getWeatherIcon: (code: number) => string;
}

export default function CurrentWeather({
  error,
  isLoading,
  nameCity,
  weather,
  getWeatherIcon,
}: CurrentWeatherProps) {
  return (
    <div>
      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg mt-4 text-center text-sm">
          {error}
        </div>
      )}
      {isLoading && <WeatherSkeleton />}
      {!isLoading && weather && (
        <div className="flex flex-col items-center mt-4">
          <p className="text-xl font-medium ">{nameCity}</p>
          <div className="text-6xl my-2">
            {getWeatherIcon(weather.weathercode)}
          </div>
          <h2 className="text-6xl font-bold my-4">{weather.temperature} °C</h2>
          <p>Вітер: {weather.windspeed} км/год</p>
        </div>
      )}
      {!isLoading && weather === null && !error && (
        <div className="flex flex-col items-center mt-4">
          <div className="text-6xl mb-4 opacity-50">🌍</div>
          <p className="text-sm mt-1">
            Введіть назву міста, щоб дізнатися погоду
          </p>
        </div>
      )}
    </div>
  );
}
