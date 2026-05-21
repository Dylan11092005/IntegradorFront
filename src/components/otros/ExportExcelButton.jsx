// ExportExcelButton.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import SubmitButton from "../FormComponents/SubmitButton.jsx";

const ExportExcelButton = ({ data = [], headers = [], fileName = "reporte.xlsx" }) => {
  const [loading, setLoading] = useState(false);

  const handleExport = () => {
    setLoading(true);

    let exportData = data;
    if (headers.length) {
      exportData = data.map(row => {
        const newRow = {};
        headers.forEach(h => {
          newRow[h.label] = row[h.key];
        });
        return newRow;
      });
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    XLSX.writeFile(workbook, fileName);
    setLoading(false);
  };

  return (
    <SubmitButton
      type="button"
      loading={loading}
      className={`bg-[#F8B601] font-bold py-3 px-10 rounded-xl transition  hover:bg-[#d9a100] focus:outline-none focus:ring-2 focus:ring-[#F8B601]/50 duration-200`}
      onClick={handleExport}
    >
      Exportar Excel
    </SubmitButton>
  );
};

export default ExportExcelButton;
