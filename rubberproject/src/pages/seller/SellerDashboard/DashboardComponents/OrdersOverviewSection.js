import React, {
  useEffect,
  useState,
} from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  getSellerOrdersOverviewThunk,
} from "../../../../redux/slices/sellerDashboardThunk";

import styles from "./OrdersOverviewSection.module.css";

function OrdersOverviewSection() {
  const dispatch = useDispatch();

  const [filter, setFilter] =
    useState("7days");

  const {
    ordersOverview,
    ordersOverviewLoading,
  } = useSelector(
    (state) => state.sellerDashboard
  );

  useEffect(() => {
    dispatch(
      getSellerOrdersOverviewThunk(
        filter
      )
    );
  }, [dispatch, filter]);

  return (
    <section className={styles.wrapper}>
      {/* =========================
          TOP BAR
      ========================= */}

      <div className={styles.topBar}>
        <div>
          <h2>Orders Overview</h2>

          <p>
            Monitor your order
            analytics
          </p>
        </div>

        {/* FILTER */}

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
          className={styles.filterSelect}
        >
          <option value="7days">
            Last 7 Days
          </option>

          <option value="30days">
            Last 30 Days
          </option>
        </select>
      </div>

      {/* =========================
          CHART CARD
      ========================= */}

      <div className={styles.chartCard}>
        {ordersOverviewLoading ? (
          <div className={styles.loading}>
            Loading analytics...
          </div>
        ) : (
          <>
            {/* GRAPH */}

            <div
              className={styles.chartWrapper}
            >
              <ResponsiveContainer
                width="100%"
                height={350}
              >
                <AreaChart
                  data={
                    ordersOverview.graphData
                  }
                >
                  <defs>
                    {/* PURPLE */}

                    <linearGradient
                      id="purpleGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#7c3aed"
                        stopOpacity={0.35}
                      />

                      <stop
                        offset="95%"
                        stopColor="#7c3aed"
                        stopOpacity={0}
                      />
                    </linearGradient>

                    {/* GREEN */}

                    <linearGradient
                      id="greenGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#16a34a"
                        stopOpacity={0.30}
                      />

                      <stop
                        offset="95%"
                        stopColor="#16a34a"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                  />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  {/* TOTAL */}

                  <Area
                    type="monotone"
                    dataKey="totalOrders"
                    name="Total Orders"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#purpleGradient)"
                  />

                  {/* COMPLETED */}

                  <Area
                    type="monotone"
                    dataKey="completedOrders"
                    name="Completed Orders"
                    stroke="#16a34a"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#greenGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* =========================
                SUMMARY
            ========================= */}

            <div
              className={styles.summaryGrid}
            >
              {/* TOTAL */}

              <div
                className={
                  styles.summaryCard
                }
              >
                <h3>
                  {
                    ordersOverview.summary
                      .totalOrders
                  }
                </h3>

                <p>Total Orders</p>
              </div>

              {/* COMPLETED */}

              <div
                className={
                  styles.summaryCard
                }
              >
                <h3
                  className={
                    styles.greenText
                  }
                >
                  {
                    ordersOverview.summary
                      .completedOrders
                  }
                </h3>

                <p>Completed</p>
              </div>

              {/* PENDING */}

              <div
                className={
                  styles.summaryCard
                }
              >
                <h3
                  className={
                    styles.orangeText
                  }
                >
                  {
                    ordersOverview.summary
                      .pendingOrders
                  }
                </h3>

                <p>Pending</p>
              </div>

              {/* PARTIAL */}

              <div
                className={
                  styles.summaryCard
                }
              >
                <h3
                  className={
                    styles.blueText
                  }
                >
                  {
                    ordersOverview.summary
                      .partialShipmentOrders
                  }
                </h3>

                <p>
                  Partial Shipment
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default OrdersOverviewSection;