import React, { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";

const TestNameCountsChart = ({ topN = null }) => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("https://api.swasthyapro.com/api/database/testname-counts", {
                    headers: { Accept: "application/json" },
                });
                const json = await res.json();
                if (!json?.success || !Array.isArray(json?.data)) {
                    setErr(json?.message || "Failed to load data");
                } else {
                    setRows(json.data); 
                }
            } catch (e) {
                setErr(e.message || "Network error");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Optionally show only top N items
    const data = useMemo(() => {
        const arr = [...rows];
        arr.sort((a, b) => (b.count || 0) - (a.count || 0));
        return topN ? arr.slice(0, topN) : arr;
    }, [rows, topN]);

    const categories = data.map(d => d.test_name);
    const seriesData = data.map(d => Number(d.count) || 0);

    // Auto height: ~38px per bar + padding
    const chartHeight = Math.max(320, data.length * 38 + 80);

    const options = {
        chart: { type: "bar", toolbar: { show: false } },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 6,
                dataLabels: { position: "right" }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => `${val}`,
            offsetX: 8,
            style: {
                fontSize: "12px",
                colors: ["#304758"],
            },
            textAnchor: "end", 

        },
        xaxis: {
            categories,
            labels: {
                show: true,
                formatter: (val) => `${val}` 
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
            tooltip: { enabled: false },

        },
        yaxis: {
            labels: {
                maxWidth: 320, // prevents overflow on long names
                style: { fontSize: "12px" }
            }
        },
        tooltip: {
            y: { formatter: (val) => `${val} bookings` }
        },
        grid: { borderColor: "#eee" },

        legend: { show: false }
    };

    if (loading) {
        return <div className="p-4 text-gray-600">Loading test counts…</div>;
    }
    if (err) {
        return <div className="p-4 text-red-600">Error: {err}</div>;
    }

    return (

        <div className="w-full">
            <h2 className="text-2xl font-bold text-gray-800 mt-4 pb-2">Top Test Sold</h2>

            <ReactApexChart options={options} series={[{ name: "Count", data: seriesData }]} type="bar" height={chartHeight} />

        </div>
    );
};

export default TestNameCountsChart;
