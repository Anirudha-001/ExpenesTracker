import { useEffect, useState } from "react";
import axios from "../api";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function Reports() {
  const [summary, setSummary] = useState({
    categorySummary: {},
    monthly: {},
    monthlyCategorySummary: {}, 
  });

  useEffect(() => {
    axios
      .get("/transactions/summary")
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("Failed to load summary", err));
  }, []);

  const categoryLabels = Object.keys(summary.categorySummary);
  const categoryValues = Object.values(summary.categorySummary);
  const totalCategoryAmount = categoryValues.reduce((sum, val) => sum + val, 0);

  const pieData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Expenses by Category",
        data: categoryValues,
        backgroundColor: [
          "#007bff",
          "#28a745",
          "#dc3545",
          "#ffc107",
          "#17a2b8",
          "#6610f2",
        ],
      },
    ],
  };

  const pieOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed;
            const percentage = ((value / totalCategoryAmount) * 100).toFixed(1);
            return `${label}: ₹${value} (${percentage}%)`;
          },
        },
      },
      legend: {
        position: "bottom",
        labels: {
          font: { size: 14 },
          color: "#333",
        },
      },
      datalabels: {
        color: "#fff",
        font: { weight: "bold", size: 13 },
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((sum, v) => sum + v, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
      },
    },
  };

  const barData = {
    labels: Object.keys(summary.monthly),
    datasets: [
      {
        label: "Monthly Balance",
        data: Object.values(summary.monthly),
        backgroundColor: "#17a2b8",
      },
    ],
  };

  const barOptions = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "₹" + value;
          },
        },
      },
    },
  };

  const renderMonthlyPieCharts = () => {
    const monthlySummary = summary.monthlyCategorySummary || {};

    return Object.entries(monthlySummary).map(([month, categoryData]) => {
      const labels = Object.keys(categoryData);
      const values = Object.values(categoryData);
      const total = values.reduce((a, b) => a + b, 0);

      const data = {
        labels,
        datasets: [
          {
            label: `Category-wise for ${month}`,
            data: values,
            backgroundColor: [
              "#007bff",
              "#28a745",
              "#dc3545",
              "#ffc107",
              "#17a2b8",
              "#6610f2",
            ],
          },
        ],
      };

      return (
        <Col md={6} key={month} className="mb-4">
         <Card className="monthly-pie-card">
  <div className="monthly-pie-title">📆 {month}</div>
  <Pie data={data} options={pieOptions} />
</Card>

        </Col>
      );
    });
  };

  return (
    <Container className="my-4">
      <Row>
        <Col md={6}>
          <Card className="p-4 mb-3 shadow-sm border-0 rounded-4 chart-card">
            <h5 className="text-center mb-3 fw-bold text-dark">💡 Category Breakdown</h5>
            <Pie data={pieData} options={pieOptions} />
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-4 mb-3 shadow-sm border-0 rounded-4 chart-card">
            <h5 className="text-center mb-3 fw-bold text-dark">📅 Monthly Summary</h5>
            <Bar data={barData} options={barOptions} />
          </Card>
        </Col>
      </Row>

      <hr className="my-4" />
      <h5 className="mb-4 text-center fw-bold text-secondary">📆 Month-wise Category Breakdown</h5>
      <Row className="monthly-charts-row">{renderMonthlyPieCharts()}</Row>

    </Container>
  );
}
