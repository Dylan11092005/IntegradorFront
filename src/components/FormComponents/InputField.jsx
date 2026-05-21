import { forwardRef } from "react";

const InputField = forwardRef(({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
  readOnly = false,
  pattern,
  className = "",
  endAdornment,
  ...props
}, ref) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-[#00897B] mb-2">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          ref={ref}
          type={type}
          name={name}
          {...(type !== "file" ? { value } : {})}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          pattern={pattern}
          className={`w-full p-3 border border-[#00897B] rounded-lg text-[#00897B] focus:outline-none focus:ring-0 focus:border-[#00897B] focus:border-2 ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""} ${endAdornment ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {endAdornment && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">{endAdornment}</span>
        )}
      </div>
    </div>
  );
});

InputField.displayName = "InputField";

export default InputField;