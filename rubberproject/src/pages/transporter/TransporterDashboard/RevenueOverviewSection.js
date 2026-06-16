import React, { useEffect, useState } from "react";
import axios from "axios";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { FiTrendingUp } from "react-icons/fi";
import styles from "./RevenueOverviewSection.module.css";

function RevenueOverviewSection() {
  const [filter, setFilter] = useState("1month");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:4000";
    const token = localStorage.getItem("token");

    axios.get(`${baseUrl}/api/transporter-dashboard/revenue-overview?filter=${filter}`, {
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
        console.error("Error fetching revenue details:", err);
        setLoading(false);
      });
  }, [filter]);

  const totalPeriodRevenue = data.reduce((acc, curr) => acc + (curr.revenue || 0), 0);
  const formattedLakhs = totalPeriodRevenue >= 100000 
    ? (totalPeriodRevenue / 100000).toFixed(1) 
    : (totalPeriodRevenue / 100000).toFixed(2);

  return (
    <section className={styles.container}>
      <div className={styles.leftMeta}>
        <div className={styles.titleBlock}>
          <div className={styles.iconCircle}><FiTrendingUp /></div>
          <span>Revenue Overview</span>
        </div>
        <div className={styles.amountDisplay}>
          <h2>₹{loading ? "..." : formattedLakhs} <span>Lakhs</span></h2>
          <p className={styles.growthText}>+12% Growth ↗</p>
        </div>
      </div>

      <div className={styles.rightChart}>
        <div className={styles.filterBar}>
          <div className={styles.toggleGroup}>
            <button className={filter === "7days" ? styles.active : ""} onClick={() => setFilter("7days")}>Last 7 Days</button>
            <button className={filter === "1month" ? styles.active : ""} onClick={() => setFilter("1month")}>Last 1 Month</button>
          </div>
        </div>

        <div className={styles.canvas}>
          {loading ? (
            <div className={styles.loading}>Calculating balances...</div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="purpleFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c084fc" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" stroke="#f8fafc" vertical={false} />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#purpleFill)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
}

export default RevenueOverviewSection;