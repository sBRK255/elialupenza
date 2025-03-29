export function Input({ value, onChange, placeholder, className }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border rounded-lg px-4 py-3 w-full bg-white bg-opacity-10 backdrop-blur-md border-white border-opacity-20 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300 ${className}`}
    />
  );
}
