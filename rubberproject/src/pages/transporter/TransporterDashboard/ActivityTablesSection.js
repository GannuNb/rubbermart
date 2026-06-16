import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Ensure this is imported
import { FiArrowRight, FiFileText, FiLayers } from "react-icons/fi";
import styles from "./ActivityTablesSection.module.css";

function ActivityTablesSection() {
    const [data, setData] = useState({ recentRequests: [], assignedShipments: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:4000";
        const token = localStorage.getItem("token");

        axios.get(`${baseUrl}/api/transporter-dashboard/recent-activity`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : ""
            },
            withCredentials: true
        })
            .then((res) => {
                if (res.data.success) {
                    setData(res.data);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching activity logs:", err);
                setLoading(false);
            });
    }, []);

    return (
        <section className={styles.splitWrapper}>
            <div className={styles.tableBlock}>
                <div className={styles.blockHeader}>
                    <div className={styles.titleWithIcon}><FiFileText /> <h3>Recent Requests</h3></div>
                </div>
                <div className={styles.tableCard}>
                    <div className={styles.responsiveTable}>
                        <table>
                            <thead>
                                <tr><th>Shipment ID</th><th>Route</th><th>Quote Amount</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" className={styles.centerText}>Syncing rows...</td></tr>
                                ) : data.recentRequests.length === 0 ? (
                                    <tr><td colSpan="4" className={styles.centerText}>No pending requests available</td></tr>
                                ) : (
                                    data.recentRequests.map((r, i) => (
                                        <tr key={i}>
                                            <td>{r.shipmentId}</td>
                                            <td className={styles.routeColumn}>{r.route}</td>
                                            <td>{r.quoteAmount ? `₹${r.quoteAmount.toLocaleString()}` : "N/A"}</td>
                                            <td><span className={styles.pendingBadge}>{r.status}</span></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Link to="/transporter-my-quotes" className={styles.viewAllFooter}>
                        View All Requests <FiArrowRight />
                    </Link>
                </div>
            </div>

            <div className={styles.tableBlock}>
                <div className={styles.blockHeader}>
                    <div className={styles.titleWithIcon}><FiLayers /> <h3>Assigned Shipments</h3></div>
                </div>
                <div className={styles.tableCard}>
                    <div className={styles.responsiveTable}>
                        <table>
                            <thead>
                                <tr><th>Shipment</th><th>Route</th><th>Item</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" className={styles.centerText}>Syncing rows...</td></tr>
                                ) : data.assignedShipments.length === 0 ? (
                                    <tr><td colSpan="4" className={styles.centerText}>No active assignments available</td></tr>
                                ) : (
                                    data.assignedShipments.map((s, i) => (
                                        <tr key={i}>
                                            <td>{s.shipmentId}</td>
                                            <td className={styles.routeColumn}>{s.route}</td>
                                            <td>{s.item}</td>
                                            <td><span className={styles.assignedBadge}>{s.status}</span></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Link to="/transporter-completed-deliveries" className={styles.viewAllFooter}>
                        View All Assigned <FiArrowRight />
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default ActivityTablesSection;