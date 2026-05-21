import React, { useState } from "react";
import DataTable from "react-data-table-component";

// Generador de páginas con elipsis
function getPageNumbers(current, total, max = 5) {
  if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [];
  const half = Math.floor(max / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(total, current + half);

  if (start === 1) end = max;
  if (end === total) start = total - max + 1;

  if (start > 1) pages.push(1, "...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total) pages.push("...", total);

  return pages;
}

export default function GlobalDataTable({
  columns,
  data,
  noDataComponent = (
    <div className="px-6 py-4 text-center text-sm text-gray-500">
      No se encontraron resultados
    </div>
  ),
  pagination = true,
  customStyles = {
    headCells: {
      style: {
        background: "#00796B",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "13px",
        textTransform: "uppercase",
      },
    },
  },
  dense = false,
  highlightOnHover = false,
  rowsPerPage = 10,
  currentPage,
  onChangePage,
  paginationTotalRows,
  loading = false,
  ...rest
}) {
  const [internalPage, setInternalPage] = useState(1);
  const page = currentPage ?? internalPage;
  const setPage = onChangePage ?? setInternalPage;

  const totalRows = paginationTotalRows ?? data.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const paginatedData =
    pagination && !paginationTotalRows
      ? data.slice((page - 1) * rowsPerPage, page * rowsPerPage)
      : data;

  const start = (page - 1) * rowsPerPage + 1;
  const end = Math.min(start + paginatedData.length - 1, totalRows);

  const buttonClass = (disabled, active) =>
    `relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border ${
      disabled
        ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
        : active
        ? "bg-[#00796B] text-white border-[#2AAC67] shadow-md transform scale-105"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md"
    }`;

  const CustomPagination = () => (
    <div className="flex flex-col items-center mt-6 space-y-2">
      <div className="text-sm text-gray-500">
        Mostrando {start} - {end} de {totalRows} resultados
      </div>
      <nav className="flex items-center space-x-1" aria-label="Pagination">
        <button
          className={buttonClass(page === 1, false)}
          onClick={() => setPage(Math.max(page - 1, 1))}
          disabled={page === 1}
        >
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {getPageNumbers(page, totalPages, 5).map((p, idx) =>
          typeof p === "number" ? (
            <button
              key={p}
              aria-current={page === p ? "page" : undefined}
              className={buttonClass(false, page === p)}
              onClick={() => setPage(p)}
              disabled={page === p}
            >
              {p}
            </button>
          ) : (
            <span key={`ellipsis-${idx}`} className="px-2 py-2 text-gray-400 select-none text-sm">
              ...
            </span>
          )
        )}

        <button
          className={buttonClass(page === totalPages, false)}
          onClick={() => setPage(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
        >
          <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>
    </div>
  );

  return (
    <div
      className="w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
      style={{
        overflowX: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "#00796B #E0E0E0",
      }}
    >
      <style>
        {`
          div::-webkit-scrollbar {
            height: 8px;
          }
          div::-webkit-scrollbar-track {
            background: #E0E0E0;
            border-radius: 4px;
          }
          div::-webkit-scrollbar-thumb {
            background-color: #00796B;
            border-radius: 4px;
            border: 2px solid #E0E0E0;
          }
          div::-webkit-scrollbar-thumb:hover {
            background-color: #004D40;
          }
        `}
      </style>

      <DataTable
        columns={columns}
        data={paginatedData}
        noDataComponent={noDataComponent}
        customStyles={customStyles}
        pagination={false}
        dense={dense}
        highlightOnHover={highlightOnHover}
        progressPending={loading}
        progressComponent={<div className="p-4 text-center text-sm">Cargando datos...</div>}
        {...rest}
      />
      {pagination && totalPages > 1 && <CustomPagination />}
    </div>
  );
}
