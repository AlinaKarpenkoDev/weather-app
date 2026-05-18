export default function Forecast({ forecast, isDark, getWeatherIcon }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      weekday: "short",
      day: "numeric",
    });
  };
  return (
    <div>
      {forecast && (
        <div className="mt-12 w-[90%] max-w-4xl">
          <div className="flex flex-wrap md:flex-nowrap justify-center gap-3 w-full pb-4">
            {forecast.time.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`flex flex-col items-center p-3 sm:p-4 rounded-xl w-[47%] sm:w-auto sm:flex-1 shadow-sm transition-colors duration-500 backdrop-blur-sm ${
                    isDark
                      ? "bg-neutral-600 text-black border border-zinc-700"
                      : "bg-white/80 text-gray-800"
                  }`}
                >
                  <p className="text-base text-gray-300 font-medium">
                    {formatDate(item)}
                  </p>

                  <div className="text-4xl my-2">
                    {getWeatherIcon(forecast.weathercode[index])}
                  </div>

                  <p className="text-lg text-black font-bold">
                    {Math.round(forecast.temperature_2m_max[index])}°
                  </p>

                  <p className="text-sm text-black">
                    {Math.round(forecast.temperature_2m_min[index])}°
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
