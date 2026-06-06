export default function WeatherSkeleton() {
  return (
    <div className="flex flex-col items-center mt-4 animate-pulse">
      {/* Сірий блок замість назви міста (ширина 32, висота 6) */}
      <div className="bg-slate-200 rounded-full w-32 h-6 mb-4"></div>

      {/* Великий круглий блок замість емодзі погоди */}
      <div className="bg-slate-200 rounded-full w-20 h-20 mb-4"></div>

      {/* Великий прямокутник замість гігантських цифр температури */}
      <div className="bg-slate-200 rounded-full w-48 h-16 mb-4"></div>

      {/* Маленький рядок замість швидкості вітру */}
      <div className="bg-slate-200 rounded-full w-40 h-4"></div>
    </div>
  );
}
