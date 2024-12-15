import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import axiosInstance from "../config/axiosInstance";
import "./viewreports.css";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { toast } from "react-toastify";
import Navbara from "./adminnav";

// Register Chart.js components
ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

const Dashboard = () => {
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [dashboardData, setDashboardData] = useState({
    signups: [5, 7, 3, 10, 14, 6], // Example data
    bookingsByDay: [2, 3, 4, 6, 5, 3], // Example data
    cinemasByDay: [1, 2, 0, 1, 3, 0], // Example data
  });

  useEffect(() => {
    // Fetch data from the backend
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get("admin/reports");
        const { message, report } = response.data;

        if (message && message.includes("A report for today already exists.")) {
          toast.info(message);
        }

        // Set data for the charts
        setDashboardData({
          signups: [report.newCustomers], // Here we map the response to chart data
          bookingsByDay: [report.totalBookings], // Map to appropriate field
          cinemasByDay: [report.newCinemas], // Map to appropriate field
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // Chart data
  const signupsData = {
    labels: ["Today"], // Display today's date on the chart
    datasets: [
      {
        label: "New Customers",
        data: dashboardData.signups,
        backgroundColor: "rgba(153, 102, 255, 0.4)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
        fill: true,
      },
    ],
  };

  const bookingsData = {
    labels: ["Today"], // Display today's date on the chart
    datasets: [
      {
        label: "Total Bookings",
        data: dashboardData.bookingsByDay,
        backgroundColor: "rgba(255, 99, 132, 0.4)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        fill: true,
        hoverBackgroundColor: "rgba(255, 99, 132, 0.8)",
        hoverBorderColor: "rgba(255, 99, 132, 1)",
        hoverBorderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const cinemasData = {
    labels: ["Today"], // Display today's date on the chart
    datasets: [
      {
        label: "New Cinemas",
        data: dashboardData.cinemasByDay,
        backgroundColor: "rgba(54, 162, 235, 0.4)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        fill: true,
      },
    ],
  };

  return (
    <>
      <Navbara />
      <div className="dashboard">
        <h1>Admin Dashboard</h1>
        <p className="date">Today's Date: {date}</p>
        <div className="charts">
          {/* Chart for Sign Ups */}
          <div className="chart">
            <h2>New Customers</h2>
            <Line data={signupsData} />
          </div>

          {/* Chart for Bookings */}
          <div className="chart">
            <h2>Total Bookings</h2>
            <Bar data={bookingsData} />
          </div>

          {/* Chart for Cinemas */}
          <div className="chart">
            <h2>New Cinemas</h2>
            <Bar data={cinemasData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
