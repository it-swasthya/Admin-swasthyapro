import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
// import DashboardCard from "../components/"; // adjust path
import DashboardCard from "../../components/dashboardCard";

import { User as UserIcon, CalendarDays } from "lucide-react";

const UsersByMonthSection = () => {
  const monthLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const [series, setSeries] = useState([{ name: "Users", data: Array(12).fill(0) }]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [topMonth, setTopMonth] = useState({ label: "-", users: 0 });

  const [options] = useState({
    chart: { height: 350, type: "bar", toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 10, dataLabels: { position: "top" } } },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}`,
      offsetY: -20,
      style: { fontSize: "12px", colors: ["#304758"] },
    },
    xaxis: {
      categories: monthLabels,
      position: "top",
      axisBorder: { show: false },
      axisTicks: { show: false },
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: { colorFrom: "#D8E3F0", colorTo: "#BED1E6", stops: [0, 100], opacityFrom: 0.4, opacityTo: 0.5 }
        }
      },
      tooltip: { enabled: true }
    },
    yaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { show: false, formatter: (val) => `${val}` },
    },
    title: {
      text: "Monthly New Users",
      floating: true,
      offsetY: 330,
      align: "center",
      style: { color: "#444" }
    }
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("https://api.swasthyapro.com/api/user/month-wise");
        const json = await res.json();
        if (!json?.success || !Array.isArray(json.data)) return;

        // Fill 12 months with zeros, then overlay API data
        const data = Array(12).fill(0);
        json.data.forEach((row) => {
          const idx = Number(row.monthNum) - 1; // 1..12 -> 0..11
          if (idx >= 0 && idx < 12) data[idx] = Number(row.users) || 0;
        });

        setSeries([{ name: "Users", data }]);

        // Total users (sum of all months)
        const total = data.reduce((a, b) => a + b, 0);
        setTotalUsers(total);

        // Top month (max)
        let maxUsers = 0;
        let maxIdx = 0;
        data.forEach((v, i) => {
          if (v > maxUsers) {
            maxUsers = v;
            maxIdx = i;
          }
        });
        setTopMonth({ label: monthLabels[maxIdx], users: maxUsers });
      } catch (e) {
        console.error("Failed to load month-wise data", e);
      }
    };
    load();
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mt-4 pb-2">Users by Month</h2>

      <div className="flex flex-col md:flex-row w-full gap-4">
        {/* Left: Chart (70%) */}
        <div className="w-full md:w-[70%] bg-white rounded-xl shadow p-4">
          <ReactApexChart options={options} series={series} type="bar" height={350} />
        </div>

        {/* Right: Two cards stacked (30%) */}
        <div className="w-full md:w-[30%] flex flex-col gap-4">
          <DashboardCard
            title="Total Users"
            value={totalUsers}
            color="bg-cyan-500"
            icon={UserIcon}
          />
          <DashboardCard
            title="Top Month Users"
            value={`${topMonth.label} • ${topMonth.users}`}
            color="bg-pink-500"
            icon={CalendarDays}
          />
        </div>
      </div>
    </div>
  );
};

export default UsersByMonthSection;
