export default function FullScreenSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#DEF7E9] bg-opacity-80">
      <div className="flex flex-col items-center">
        <svg
          className="animate-spin h-16 w-16 text-[#00897B] mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="#00897B"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="#00897B"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span className="text-[#00897B] text-lg font-semibold">Cargando...</span>
      </div>
    </div>
  );
}