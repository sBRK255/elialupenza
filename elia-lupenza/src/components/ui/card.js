export function Card({ children, className }) {
  return <div className={`rounded-xl glass-card transition-all duration-300 hover:translate-y-[-2px] ${className}`}>{children}</div>;
}

export function CardContent({ children, className }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
