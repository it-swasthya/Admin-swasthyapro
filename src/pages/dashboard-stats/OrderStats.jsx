import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import DashboardCard from "../../components/dashboardCard";
import { BookCheckIcon, CalendarDays } from "lucide-react";

const OrderStatsByMonth = () => {
  const monthLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const [series, setSeries] = useState([
    { name: "Bookings", data: Array(12).fill(0) },
  ]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [topMonth, setTopMonth] = useState({ label: "-", booking: 0 });

  const [options, setOptions] = useState({
    chart: {
      type: "bar",
      height: 380,
      toolbar: { show: false },
      foreColor: "#374151", // neutral gray text
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "45%",
        dataLabels: { position: "top" },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        gradientToColors: ["#60a5fa"], // lighter blue
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.8,
        stops: [0, 100],
      },
    },
    colors: ["#2563eb"], // solid blue for bars
    dataLabels: {
      enabled: true,
      formatter: (val) => (val > 0 ? val.toString() : ""),
      offsetY: -16,
      style: {
        fontSize: "12px",
        fontWeight: 600,
        colors: ["#1f2937"], // dark gray text
      },
    },
    xaxis: {
      categories: monthLabels,
      position: "bottom",
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#4b5563",
          fontSize: "13px",
          fontWeight: 500,
        },
      },
      tooltip: { enabled: true },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6b7280",
          fontSize: "12px",
        },
        formatter: (val) => `${val}`,
      },
      title: {
        text: "No. of Bookings",
        style: { color: "#374151", fontSize: "13px", fontWeight: 600 },
      },
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
      padding: { left: 10, right: 10 },
    },
    tooltip: {
      theme: "light",
      style: { fontSize: "13px" },
      y: { formatter: (val) => `${val} bookings` },
    },
    legend: { show: false },
    title: {
      text: "Monthly Bookings Trend",
      align: "center",
      margin: 10,
      offsetY: 10,
      style: { fontSize: "16px", fontWeight: 600, color: "#111827" },
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          "https://api.swasthyapro.com/api/user/monthly-orders"
        );
        const json = await res.json();

        if (!json?.success || !Array.isArray(json.data)) return;

        const data = Array(12).fill(0);
        json.data.forEach((row) => {
          const idx = Number(row.month) - 1;
          if (idx >= 0 && idx < 12)
            data[idx] = Number(row.totalBookings) || 0;
        });

        setSeries([{ name: "Bookings", data }]);

        const total = data.reduce((a, b) => a + b, 0);
        setTotalOrders(total);

        let maxBookings = 0;
        let maxIdx = 0;
        data.forEach((v, i) => {
          if (v > maxBookings) {
            maxBookings = v;
            maxIdx = i;
          }
        });
        setTopMonth({ label: monthLabels[maxIdx], booking: maxBookings });

        // Highlight top month with a slightly deeper blue
        const highlightColors = data.map((val, i) =>
          i === maxIdx ? "#1d4ed8" : "#2563eb"
        );
        setOptions((prev) => ({
          ...prev,
          colors: highlightColors,
        }));
      } catch (e) {
        console.error("Failed to load month-wise data", e);
      }
    };

    load();
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mt-4 pb-2">
        Orders by Month
      </h2>

      <div className="flex flex-col md:flex-row w-full gap-4">
        {/* Summary Cards */}
        <div className="w-full md:w-[30%] flex flex-col gap-4">
          <DashboardCard
            title="Total Orders"
            value={totalOrders}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            icon={BookCheckIcon}
          />
          <DashboardCard
            title="Top Month Orders"
            value={`${topMonth.label} • ${topMonth.booking}`}
            color="bg-gradient-to-r from-green-500 to-emerald-600"
            icon={CalendarDays}
          />
        </div>

        {/* Chart Section */}
        <div className="w-full md:w-[70%] bg-white rounded-xl shadow p-5">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={380}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderStatsByMonth;
