import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

const SubmitButton = ({
  children,
  width = "w-auto",
  className = "",
  loading = false,
  ...props
}) => (
  <button
    type="submit"
    className={`bg-[#F8B601] font-bold py-3 px-10 rounded-xl transition ${width} ${className} hover:bg-[#d9a100] focus:outline-none focus:ring-2 focus:ring-[#F8B601]/50 duration-200`}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading ? (
      <span className="flex items-center justify-center gap-2">
        <CircularProgress size={20} style={{ color: "#fff" }} />
        <span>Cargando...</span>
      </span>
    ) : (
      children
    )}
  </button>
);


export default SubmitButton;