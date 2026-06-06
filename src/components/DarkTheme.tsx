interface DarkThemeProps {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
}

export default function DarkTheme({ setIsDark, isDark }: DarkThemeProps) {
  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className={`absolute top-10 right-10 p-4 rounded-full shadow-lg hover:scale-110 transition-all cursor-pointer text-2xl z-50 ${
        isDark
          ? "bg-stone-700 border border-stone-400"
          : "bg-white border border-gray-200"
      }`}
      title="Змінити тему"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
