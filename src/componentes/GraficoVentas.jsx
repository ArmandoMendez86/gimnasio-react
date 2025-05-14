import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GraficoVentas = ({ data, title, barThickness, maxBarThickness }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: title,
      },
    },
    datasets: {
      bar: {
        // Configuración específica para los datasets de tipo 'bar'
        barThickness: barThickness,
        maxBarThickness: maxBarThickness,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

GraficoVentas.defaultProps = {
  barThickness: "flex",
  maxBarThickness: undefined,
};

export default GraficoVentas;
