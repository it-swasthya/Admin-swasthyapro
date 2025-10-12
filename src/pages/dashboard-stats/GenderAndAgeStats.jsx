import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import { CircularProgress, Box, Typography, Grid, Paper } from "@mui/material";

const GenderAgePieCharts = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://api.swasthyapro.com/api/database/gender-age-count"
        );
        setData(res.data);
      } catch (err) {
        console.error("Error fetching gender-age data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (!data) return <Typography>Error loading data.</Typography>;

  // --- GENDER PIE CHART ---
  const genderLabels = Object.keys(data.genderCount);
  const genderValues = Object.values(data.genderCount);

  const genderChartOptions = {
    chart: { type: "pie" },
    labels: genderLabels.map((g) =>
      g === "M" ? "Male" : g === "F" ? "Female" : "Other"
    ),
    legend: { position: "bottom" },
    colors: ["#06b6d4", "#ec4899", "#ef4444"],
    title: {
      text: "Gender Distribution",
      align: "center",
    },
    dataLabels: {
      formatter: (val) => `${val.toFixed(1)}%`,
    },
  };

  // --- AGE PIE CHART ---
  const ageLabels = data.ageGroups.map((a) => a.range);
  const ageValues = data.ageGroups.map((a) => a.count);



  // --- AGE BAR CHART ---
const ageBarOptions = {
  chart: {
    type: "bar",
    height: 350,
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: "50%",
    },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ageLabels,
    labels: {
      rotate: -45,
    },
    title: {
      text: "Age Groups",
    },
  },
  yaxis: {
    title: {
      text: "User Count",
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "light",
      type: "horizontal",
      shadeIntensity: 0.25,
      opacityFrom: 0.9,
      opacityTo: 0.9,
      stops: [50, 0, 100],
    },
  },
  colors: ["#06b6d4", "#a855f7", "#ef4444", "#60a5fa", "#fbbf24"],
  title: {
    text: "Age Group Distribution (Bar)",
    align: "center",
  },
  grid: {
    row: { 
      colors: ["#fff", "#f9fafb"],
    },
  },
};


  const ageBarSeries = [
    {
      name: "Users",
      data: ageValues,
    },
  ];

  return (
    <Box p={3}>
      <Grid  spacing={3}>
        {/* Gender Pie */}
        <Grid item xs={12} md={4}>
          <Paper  sx={{ p: 2 }}>
            <Chart
              options={genderChartOptions}
              series={genderValues}
              type="pie"
              height={350}
            />
          </Paper>
        </Grid>

        {/* Age Pie */}
      

        {/* Age Bar */}
        <Grid item>
          <Paper  sx={{ p: 2 }}>
            <Chart
              options={ageBarOptions}
              series={ageBarSeries}
              type="bar"
              height={350}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GenderAgePieCharts;
