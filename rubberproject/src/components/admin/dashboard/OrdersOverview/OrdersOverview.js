import React, { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import styles from "./OrdersOverview.module.css";

function OrdersOverview() {
  const [range, setRange] = useState("7days");

  const [overview, setOverview] = useState({
    totalOrders: 0,
    completedOrders: 0,
    partialShipments: 0,
    pendingOrders: 0,
  });

  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    fetchOrdersOverview();
  }, [range]);

  const fetchOrdersOverview = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin-dashboard/orders-overview?range=${range}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        setOverview(data.overview);

        /*
        --------------------------------------------------
        FIX EMPTY / SINGLE GRAPH DATA
        --------------------------------------------------
        */

        let formattedGraph = data.graphData || [];

        if (formattedGraph.length === 1) {
          formattedGraph = [
            {
              date: "Start",
              orders: 0,
            },

            ...formattedGraph,

            {
              date: "End",
              orders: formattedGraph[0].orders,
            },
          ];
        }

        setGraphData(formattedGraph);
      }
    } catch (error) {
      console.log("Orders Overview Error:", error);
    }
  };

  return (
    <div className={styles.ordersOverview}>
      {/* TOP */}

      <div className={styles.ordersOverviewTop}>
        <div>
          <h2>Orders Overview</h2>

          <p>Monitor orders and shipment activity</p>
        </div>

        <div className={styles.ordersFilters}>
          <button
            className={range === "7days" ? styles.activeFilter : ""}
            onClick={() => setRange("7days")}
          >
            Last 7 Days
          </button>

          <button
            className={range === "30days" ? styles.activeFilter : ""}
            onClick={() => setRange("30days")}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* STATS */}

      <div className={styles.ordersStatsGrid}>
        <div className={styles.ordersStatCard}>
          <span>Total Orders</span>

          <h3>{overview.totalOrders}</h3>
        </div>

        <div className={styles.ordersStatCard}>
          <span>Completed</span>

          <h3>{overview.completedOrders}</h3>
        </div>

        <div className={styles.ordersStatCard}>
          <span>Partial Shipments</span>

          <h3>{overview.partialShipments}</h3>
        </div>

        <div className={styles.ordersStatCard}>
          <span>Pending</span>

          <h3>{overview.pendingOrders}</h3>
        </div>
      </div>

      {/* CHART */}

      <div className={styles.ordersChartWrapper}>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart
            data={graphData}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />

                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis dataKey="date" tickLine={false} axisLine={false} />

            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />

            <Area
              type="natural"
              dataKey="orders"
              stroke="#7c3aed"
              strokeWidth={3}
              fill="url(#ordersGradient)"
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default OrdersOverview;
