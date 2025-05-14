import { QRCodeCanvas } from "qrcode.react";
import { useRef, useState, useCallback, useEffect } from "react";
import { toPng } from "html-to-image";
import Download from "@mui/icons-material/Download";
import Send from "@mui/icons-material/Telegram";
import emailjs from "emailjs-com";

// Componente reutilizable para la previsualización del fondo
const BackgroundPreview = ({ backgroundColor }) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: backgroundColor,
      display: "block",
    }}
  />
);

const ColorSlider = ({ label, color, onColorChange }) => {
  const handleChange = (event) => {
    onColorChange(event.target.value);
  };

  return (
    <div className="my-3">
      <label
        htmlFor={`colorSlider-${label}`}
        className="form-label"
        style={{ display: "block", marginBottom: "5px" }}
      >
        {label}:{" "}
        <span
          style={{
            backgroundColor: color,
            color: getContrastYIQ(color),
            padding: "0.2em 0.5em",
            borderRadius: "5px",
          }}
        >
          {color}
        </span>
      </label>
      <input
        type="color"
        className="form-control form-control-color"
        id={`colorSlider-${label}`}
        value={color}
        onChange={handleChange}
        title={`Selecciona el color de ${label.toLowerCase()}`}
      />
    </div>
  );
};

// Función para obtener un color de texto contrastante (blanco o negro)
function getContrastYIQ(hexcolor) {
  const r = parseInt(hexcolor.substring(1, 3), 16);
  const g = parseInt(hexcolor.substring(3, 5), 16);
  const b = parseInt(hexcolor.substring(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}

const LOCAL_STORAGE_KEY = "credencial_preferences";

const InfoCliente = ({
  cliente,
  config,
  initialBackgroundColor,
  initialTextColor,
}) => {
  const componentRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState(() => {
    try {
      const storedPreferences = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedPreferences && JSON.parse(storedPreferences).backgroundColor) {
        return JSON.parse(storedPreferences).backgroundColor;
      }
    } catch (error) {
      console.error(
        "Error al cargar el color de fondo desde localStorage:",
        error
      );
    }
    return initialBackgroundColor || "#f8f9fa";
  });
  const [textColor, setTextColor] = useState(() => {
    try {
      const storedPreferences = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedPreferences && JSON.parse(storedPreferences).textColor) {
        return JSON.parse(storedPreferences).textColor;
      }
    } catch (error) {
      console.error(
        "Error al cargar el color de texto desde localStorage:",
        error
      );
    }
    return initialTextColor || "#000000";
  });
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    // Guardar las preferencias en localStorage cada vez que cambian los colores
    try {
      const preferencesToStore = { backgroundColor, textColor };
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(preferencesToStore)
      );
    } catch (error) {
      console.error(
        "Error al guardar las preferencias en localStorage:",
        error
      );
    }
  }, [backgroundColor, textColor]);

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

  const handleBackgroundColorChange = useCallback((newColor) => {
    setBackgroundColor(newColor);
  }, []);

  const handleTextColorChange = useCallback((newColor) => {
    setTextColor(newColor);
  }, []);

  const handleDownloadImage = useCallback(async () => {
    setShowControls(false);
    if (componentRef.current) {
      try {
        const dataUrl = await toPng(componentRef.current, { cacheBust: true });
        const link = document.createElement("a");
        link.download = `credencial_${cliente.nombre}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Error al generar la imagen:", error);
      } finally {
        setShowControls(true);
      }
    }
  }, [cliente.nombre]);

  const compressImage = useCallback(async (dataUrl, quality = 0.8) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let width = img.width;
        let height = img.height;
        const maxWidth = 600;
        const maxHeight = 600;

        if (width > maxWidth || height > maxHeight) {
          const scale = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * scale);
          height = Math.floor(height * scale);
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const reduceQuality = () => {
          canvas.toBlob(
            (blob) => {
              if (blob.size <= 50000 || quality < 0.3) {
                resolve(blob);
              } else {
                compressImage(dataUrl, quality - 0.1).then(resolve);
              }
            },
            "image/jpeg",
            quality
          );
        };

        reduceQuality();
      };
    });
  }, []);

  const handleSendEmail = useCallback(async () => {
    setShowControls(false);
    if (componentRef.current) {
      try {
        const dataUrl = await toPng(componentRef.current, { cacheBust: true });
        const compressedBlob = await compressImage(dataUrl);

        const reader = new FileReader();
        reader.readAsDataURL(compressedBlob);
        reader.onload = async () => {
          const base64Image = reader.result.split(",")[1];

          const emailParams = {
            title: `Credencial para: ${cliente.nombre}`,
            to_name: cliente.nombre,
            to_email: cliente.email,
            from_name: config.razon,
            message: `Hola ${cliente.nombre}, adjuntamos tu credencial.`,
            image: base64Image,
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
      } finally {
        setShowControls(true);
      }
    }
  }, [cliente, config, compressImage]);

  return (
    <>
      <div
        ref={componentRef}
        className="card p-4 text-center border rounded"
        style={{
          position: "relative",
          width: "300px",
          height: "450px",
          textTransform: "uppercase",
          overflow: "hidden",
          color: textColor,
        }}
      >
        <BackgroundPreview backgroundColor={backgroundColor} />
        <div className="card-body" style={{ position: "relative", zIndex: 0 }}>
          <h4 className="card-title" style={{ color: textColor }}>
            {config.razon}
          </h4>
          <div
            className="rounded-circle overflow-hidden border border-3 border-white my-3 mx-auto"
            style={{ width: "150px", height: "150px" }}
          >
            <img
              src={
                config?.img
                  ? `/backend/img_clientes/${config.img}`
                  : "/backend/img_clientes/logo_ejemplo.png"
              }
              alt="cliente Profile"
              className="w-100 h-100 object-fit-cover"
            />
          </div>
          <h5 className="card-title">{cliente.nombre}</h5>
          <p className="card-text">{cliente.telefono}</p>
          <div className="mt-4 d-flex justify-content-center">
            <QRCodeCanvas
              value={cliente.telefono}
              size={70}
              bgColor="#ffffff"
              fgColor="#000000"
              level="Q"
            />
          </div>
        </div>
      </div>

      <div className="text-center d-flex justify-content-between align-items-center">
        <div className="d-flex flex-column gap-2 flex-grow-1">
          <div className="d-flex justify-content-between align-items-center">
            <ColorSlider
              label=""
              color={backgroundColor}
              onColorChange={handleBackgroundColorChange}
            />
            <ColorSlider
              label=""
              color={textColor}
              onColorChange={handleTextColorChange}
            />
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

          {/* Foto del usuario */}
          <div className="d-flex gap-2 justify-content-around align-items-center">
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
        </div>
      </div>
    </>
  );
};

export default InfoCliente;
