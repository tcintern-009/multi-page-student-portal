export default function SectionTitle({
  title,
  subtitle,
  align = "center",
  className = "",
}) {
  const alignment = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`${alignment} mb-12 ${className}`}>
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
