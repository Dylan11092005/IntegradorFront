import React from "react";

const FoldDownComponent = ({
  title = "Sección",
  open = false,
  children,
  className = "",
  ...props
}) => (
  <details open={open} className={className} {...props}>
    <summary className="cursor-pointer font-semibold text-[#00897B] py-2 px-1 rounded">{title}</summary>
    <div className="mt-4">{children}</div>
  </details>
);

export default FoldDownComponent;