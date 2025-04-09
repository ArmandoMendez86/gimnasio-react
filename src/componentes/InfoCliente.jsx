import { QRCodeCanvas } from "qrcode.react";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import Download from "@mui/icons-material/Download";
import Send from "@mui/icons-material/Telegram";
import emailjs from "emailjs-com";

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

  // ✅ Comprimir la imagen antes de enviarla por EmailJS
  const compressImage = async (dataUrl, quality = 0.8) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Ajustar dimensiones para mantener calidad pero reducir peso
        let width = img.width;
        let height = img.height;
        const maxWidth = 600; // Tamaño máximo permitido
        const maxHeight = 600;

        if (width > maxWidth || height > maxHeight) {
          const scale = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * scale);
          height = Math.floor(height * scale);
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a JPEG y reducir calidad
        const reduceQuality = () => {
          canvas.toBlob(
            (blob) => {
              if (blob.size <= 50000 || quality < 0.3) {
                resolve(blob);
              } else {
                compressImage(dataUrl, quality - 0.1).then(resolve); // Reducir más la calidad
              }
            },
            "image/jpeg",
            quality
          );
        };

        reduceQuality();
      };
    });
  };

  // ✅ Enviar la credencial comprimida por EmailJS
  const handleSendEmail = async () => {
    if (componentRef.current) {
      try {
        const dataUrl = await toPng(componentRef.current, { cacheBust: true });
        const compressedBlob = await compressImage(dataUrl);

        const reader = new FileReader();
        reader.readAsDataURL(compressedBlob);
        reader.onload = async () => {
          const base64Image = reader.result.split(",")[1]; // Extraer solo el Base64

          const emailParams = {
            title: `Credencial para: ${cliente.nombre}`,
            to_name: cliente.nombre,
            to_email: cliente.email,
            from_name: config.razon,
            message: `Hola ${cliente.nombre}, adjuntamos tu credencial.`,
            image: base64Image, // Imagen en Base64 comprimida
          };

          const response = await emailjs.send(
            "service_tewkhg2",
            "template_m073kpg",
            emailParams,
            "BNmYFBN0xpJf4jzrH"
          );

          console.log("Correo enviado con éxito:", response);
          alert("Correo enviado con éxito");
        };
      } catch (error) {
        console.error("Error al enviar el correo:", error);
        alert("Error al enviar el correo");
      }
    }
  };

  return (
    <>
      <div
        ref={componentRef}
        className="card p-4 text-center border rounded"
        style={{
          width: "300px",
          height: "450px",
          backgroundColor: "#d2dada",
          textTransform: "uppercase",
        }}
      >
        <div className="card-body">
          <h3 className="card-title text-danger">{config.razon}</h3>

          <div
            className="rounded-circle overflow-hidden border border-3 border-white my-3 mx-auto"
            style={{ width: "150px", height: "150px" }}
          >
            <img
              src={
                config
                  ? config.img
                    ? `/backend/img_clientes/${config.img}`
                    : "/backend/img_clientes/logo_ejemplo.png"
                  : "/backend/img_clientes/logo_ejemplo.png"
              }
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
        <div className="d-flex gap-2">
          <button
            data-bs-toggle="tooltip"
            title="Descargar Credencial"
            onClick={handleDownloadImage}
            className="btn btn-outline-danger btn-sm"
          >
            <Download />
          </button>
          {cliente.email && (
            <button
              data-bs-toggle="tooltip"
              title="Enviar por correo"
              onClick={handleSendEmail}
              className="btn btn-outline-secondary btn-sm"
            >
              <Send />
            </button>
          )}
        </div>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            overflow: "hidden",
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
              transform: `scale(${zoom}) translate(${offsetX}px, ${offsetY}px)`,
              transformOrigin: "center center",
              transition: "transform 0.3s ease",
            }}
          />
        </div>
      </div>
    </>
  );
};

export default InfoCliente;
