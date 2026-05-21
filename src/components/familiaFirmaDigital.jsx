import React, { useEffect, useRef } from "react";
import SignaturePad from "signature_pad";

const FamiliaFirmaDigital = ({ datos = {}, setDatos }) => {
  const canvasRef = useRef(null);
  const signaturePadRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && !signaturePadRef.current) {
      signaturePadRef.current = new SignaturePad(canvasRef.current, {
        backgroundColor: "rgba(255, 255, 255, 0)", // Fondo transparente
      });
    }
  }, []);

  const guardarFirma = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const imagen = canvas.toDataURL("image/png");
      setDatos({ ...datos, imagen });
    }
  };

  const limpiarFirma = () => {
    signaturePadRef.current?.clear();
    setDatos((prev) => ({ ...prev, imagen: null }));
  };

  return (
    <details>
      <summary><strong>Firma Digital</strong></summary>
      <div style={{ border: "1px solid black", width: 400, height: 150 }}>
        <canvas ref={canvasRef} width={400} height={150} />
      </div>
      <button type="button" onClick={guardarFirma} className="btn btn-primary mt-2">
        Guardar Firma
      </button>
      <button type="button" onClick={limpiarFirma} className="btn btn-secondary mt-2 ms-2">
        Limpiar Firma
      </button>
      {datos.imagen && (
        <div style={{ marginTop: 10 }}>
          <p>Firma guardada:</p>
          <img src={datos.imagen} alt="Firma digital" style={{ border: "1px solid #ccc" }} />
        </div>
      )}
    </details>
  );
};

export default FamiliaFirmaDigital;
