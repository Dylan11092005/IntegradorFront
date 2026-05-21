export default function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  disabled = false,
  className = "",
  optionLabel = "nombre",
  optionValue = "nombre",
  ...props
}) {
  // Normaliza para aceptar string[] y OptionType[]
  const normalizedOptions = options.map((opt) =>
    typeof opt === "object"
      ? opt
      : { [optionLabel]: opt, [optionValue]: opt }
  );

  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-[#00897B] mb-2">
          {label}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full p-3 border border-[#00897B] rounded-lg text-[#00897B] bg-white focus:border-[#00897B] focus:ring-2 focus:ring-[#00897B]/30 ${className}`}
        {...props}
      >
        <option value="" disabled>
          Seleccione {label?.toLowerCase()}
        </option>
        {normalizedOptions.map((opt, i) => (
          <option
            key={opt.codigo ?? opt[optionValue] ?? i}
            value={opt[optionValue]}
          >
            {opt[optionLabel]}
          </option>
        ))}
      </select>
    </div>
  );
}