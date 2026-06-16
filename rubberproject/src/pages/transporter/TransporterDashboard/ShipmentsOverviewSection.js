import React, { useEffect, useState } from "react";
import axios from "axios";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { FiBarChart2 } from "react-icons/fi";
import styles from "./ShipmentsOverviewSection.module.css";

function ShipmentsOverviewSection() {
  const [filter, setFilter] = useState("1month");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:4000";
    const token = localStorage.getItem("token");

    axios.get(`${baseUrl}/api/transporter-dashboard/shipments-overview?filter=${filter}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : ""
      },
      withCredentials: true
    })
      .then((res) => {
        if (res.data.success) {
          setData(res.data.graphData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching chart data:", err);
        setLoading(false);
      });
  }, [filter]);

  return (
    <section className={styles.chartContainer}>
      <div className={styles.topRow}>
        <h3>Assigned vs Completed Shipments</h3>
        <div className={styles.controls}>
          <div className={styles.toggleButtons}>
            <button 
              className={filter === "7days" ? styles.activeBtn : ""} 
              onClick={() => setFilter("7days")}
            >
              Last 7 Days
            </button>
            <button 
              className={filter === "1month" ? styles.activeBtn : ""} 
              onClick={() => setFilter("1month")}
            >
              Last 1 Month
            </button>
          </div>
          <div className={styles.iconBtn}><FiBarChart2 /></div>
        </div>
      </div>

      <div className={styles.chartWrapper}>
        {loading ? (
          <div className={styles.loading}>Loading chart data...</div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="0" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
              <Line type="monotone" dataKey="assigned" name="Assigned" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="completed" name="Completed" stroke="#c084fc" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}

export default ShipmentsOverviewSection;