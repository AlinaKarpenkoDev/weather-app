export default function SearchBar({
  dropdownRef,
  city,
  setCity,
  searchWeather,
  suggestions,
  isDark,
  handleSuggestionClick,
  isLoading,
  getUserLocation,
}) {
  return (
    <div className="flex gap-2 mt-4">
      <div ref={dropdownRef} className="relative w-full">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchWeather()}
          className={`w-full outline-none px-3 py-2 rounded-lg border transition-colors ${
            isDark
              ? "bg-zinc-700 border-zinc-600 text-white placeholder-gray-400 focus:border-zinc-400"
              : "bg-white border-gray-300 text-gray-800 focus:border-gray-500"
          }`}
          type="text"
          placeholder="Введіть місто.."
        />
        {suggestions.length > 0 && (
          <ul
            className={`absolute left-0 top-full mt-1 w-full backdrop-blur-md border rounded-lg shadow-lg z-10 overflow-y-auto max-h-40 text-left custom-scrollbar transition-colors ${
              isDark
                ? "bg-zinc-600/95 border-zinc-500"
                : "bg-white/80 border-gray-200/50"
            }`}
          >
            {suggestions.map((item, index) => {
              return (
                <li
                  onClick={() => handleSuggestionClick(item.name)}
                  key={index}
                  className={`px-3 py-1.5 cursor-pointer text-sm transition-colors ${
                    isDark
                      ? "hover:bg-zinc-500 text-gray-200"
                      : "hover:bg-gray-500/10 text-gray-700"
                  }`}
                >
                  {`${item.name}, `}
                  <span
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {item.admin2 && ` ${item.admin2}, `}
                    {item.admin1 && ` ${item.admin1}, `}
                    {item.country}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <button
        disabled={!city || isLoading}
        onClick={searchWeather}
        className="hover:bg-gray-800 text-white px-4 py-2 rounded-lg bg-zinc-500 cursor-pointer disabled:opacity-50"
      >
        {isLoading ? "Шукаю..." : "Знайти"}
      </button>
      <button
        onClick={getUserLocation}
        className="bg-gray-200 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-300 cursor-pointer text-xl"
      >
        📍
      </button>
    </div>
  );
}
