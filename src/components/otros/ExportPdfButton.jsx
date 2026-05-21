import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import SubmitButton from "../FormComponents/SubmitButton.jsx";

const ExportPdfButton = ({
  data = [],
  headers = [],
  title = "Reporte",
  fileName = "reporte.pdf",
}) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);

    try {
      const doc = new jsPDF();

      // Solo título y fecha, sin nombre de institución
      doc.setFontSize(14);
      doc.text(title, 105, 20, { align: "center" });
      doc.setFontSize(10);
      doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 105, 28, { align: "center" });

      const tableHeaders = headers.map(h => h.label);
      const tableData = data.map(row => headers.map(h => row[h.key]));

      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        startY: 34,
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [248, 182, 1],
          textColor: [0, 0, 0],
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          halign: "left",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        tableLineColor: [200, 200, 200],
        tableLineWidth: 0.1,
      });

      setTimeout(() => {
        doc.save(fileName);
        setLoading(false);
      }, 100);
    } catch (error) {
      console.error("Error exportando PDF:", error);
      setLoading(false);
    }
  };

  return (
    <SubmitButton
      type="button"
      loading={loading}
      className={`bg-[#F8B601] font-bold py-3 px-10 rounded-xl transition hover:bg-[#d9a100] focus:outline-none focus:ring-2 focus:ring-[#F8B601]/50 duration-200`}
      onClick={handleExport}
    >
      Exportar PDF
    </SubmitButton>
  );
};

export default ExportPdfButton;
