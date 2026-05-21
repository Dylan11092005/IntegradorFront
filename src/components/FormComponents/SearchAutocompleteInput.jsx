import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React from "react";

export default function SearchAutocompleteInput({
  label = "Buscar",
  busqueda,
  setBusqueda,
  showSugerencias,
  setShowSugerencias,
  resultados,
  onSelect,
  optionLabelKeys = ["codigo", "titulo"],
  placeholder = "Buscar...",
  sx = {},
  disabled = false,
}) {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="block text-sm font-semibold text-[#00897B] mb-2">
          {label}
        </label>
      )}
      <Autocomplete
        freeSolo
        options={resultados}
        getOptionLabel={(option) =>
          typeof option === "string"
            ? option
            : optionLabelKeys.map((key) => option[key]).filter(Boolean).join(" - ")
        }
        inputValue={busqueda}
        onInputChange={(_, value, reason) => {
          setBusqueda(value);
          setShowSugerencias(reason === "input" && value.length > 0);
        }}
        onChange={(_, value) => {
          if (value && typeof value !== "string") {
            onSelect(value);
            setShowSugerencias(false);
          }
        }}
        open={showSugerencias && resultados.length > 0}
        onClose={() => setShowSugerencias(false)}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            variant="outlined"
            fullWidth
            InputLabelProps={{
              style: { color: "#00897B", fontWeight: 600 },
            }}
            InputProps={{
              ...params.InputProps,
              style: {
                borderRadius: 8,
                background: "white",
                border: "1px solid #00897B",
                color: "#00897B",
                padding: "10px",
                fontFamily: "Poppins",
                fontSize: "16px",
                minHeight: "50px",
                height: "50px",
              },
            }}
          />
        )}
        sx={{
          width: '100%',
          background: "white",
          borderRadius: "8px",
          minHeight: "48px",
          height: "48px",
          boxShadow: "none",
          '& .MuiOutlinedInput-root': {
            padding: '0',
            minHeight: '48px',
            height: '48px',
            borderRadius: '8px',
            border: '1px solid #00897B',
            color: '#00897B',
            fontFamily: 'Poppins',
            fontSize: '16px',
            '& input': {
              padding: '12px 14px',
              height: '24px',
            },
            '&:hover fieldset': {
              borderColor: '#00695C',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00897B',
            },
          },
          '& .MuiAutocomplete-option': {
            backgroundColor: 'white',
            color: '#00897B',
            fontWeight: 500,
            fontFamily: 'Poppins',
            fontSize: '16px',
            borderBottom: '1px solid #E0F2F1',
            transition: 'background 0.2s',
            '&:hover': {
              backgroundColor: '#E0F2F1',
              color: '#00695C',
            },
          },
          '& .MuiAutocomplete-option[aria-selected="true"]': {
            backgroundColor: '#00897B',
            color: 'white',
          },
          '& .MuiAutocomplete-option.Mui-focused': {
            backgroundColor: '#E0F2F1',
            color: '#00897B',
          },
          '& .MuiAutocomplete-endAdornment': {
            color: '#00897B',
          },
          ...sx,
        }}
        disabled={disabled}
      />
    </div>
  );
} 