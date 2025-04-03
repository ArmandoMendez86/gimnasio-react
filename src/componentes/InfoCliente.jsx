import { QRCodeCanvas } from "qrcode.react";
import { useRef, useState } from "react";
import { toPng, toJpeg } from "html-to-image";
import Download from "@mui/icons-material/Download";

const InfoCliente = ({ cliente, config }) => {
  
  const componentRef = useRef(null);
  const [zoom, setZoom] = useState(1); 
  const [offsetX, setOffsetX] = useState(0); 
  const [offsetY, setOffsetY] = useState(0); 

  const handleMouseEnter = (event) => {
    setZoom(1.5); 
    setOffsetX(event.clientX * 0); 
    setOffsetY(event.clientY * 0.03); 
  };

  const handleMouseLeave = () => {
    setZoom(1); 
    setOffsetX(0);
    setOffsetY(0);
  };

  const handleDownloadImage = async () => {
    if (componentRef.current) {
      try {
        const dataUrl = await toPng(componentRef.current, { cacheBust: true });
        const link = document.createElement("a");
        link.download = `credencial_${cliente.nombre}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Error al generar la imagen:", error);
      }
    }
  };

  return (
    <>
      <div
        ref={componentRef}
        className="card p-4 text-center border rounded"
        style={{ width: "300px", height: "450px", backgroundColor: "#d2dada", textTransform:'uppercase' }}
      >
        <div className="card-body">
          <h3 className="card-title text-danger">{config.razon}</h3>

          <div
            className="rounded-circle overflow-hidden border border-3 border-white my-3 mx-auto"
            style={{ width: "150px", height: "150px" }}
          >
            <img
              src={config ? (config.img ? `/backend/img_clientes/${config.img}` : '/backend/img_clientes/logo_ejemplo.png') : '/backend/img_clientes/logo_ejemplo.png'} 
              alt="cliente Profile"
              className="w-100 h-100 object-fit-cover"
            />
          </div>

          <h5 className="card-title">{cliente.nombre}</h5>
          <p className="card-text text-muted">{cliente.telefono}</p>

          <div className="mt-4 d-flex justify-content-center">
            <QRCodeCanvas
              value={cliente.telefono}
              size={70}
              bgColor="#ffffff"
              fgColor="#001256"
              level="Q"
            />
          </div>
        </div>
      </div>

      <div className="text-center mt-4 d-flex justify-content-between align-items-center">
        <button onClick={handleDownloadImage} className="btn btn-success">
          <Download />
        </button>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            overflow: "hidden", // Recorta el contenido fuera de los límites
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={
              cliente.img
                ? `/backend/img_clientes/${cliente.img}`
                : "/backend/img_clientes/not_user.jpg"
            }
            alt="Imagen usuario"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${zoom}) translate(${offsetX}px, ${offsetY}px)`, // Aplica zoom y desplazamiento
              transformOrigin: "center center", // Zoom desde el centro
              transition: "transform 0.3s ease", // Transición suave
            }}
          />
        </div>
      </div>
    </>
  );
};

export default InfoCliente;
