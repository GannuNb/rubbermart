import Order from "../models/orderModel.js";
import ShipmentTransportQuote from "../models/ShipmentTransportQuote.js";
import mongoose from "mongoose";

// Constants for consistent status filtering
const ACTIVE_STATUSES = ["assigned", "shipped", "in_transit"];
const COMPLETED_STATUSES = ["delivered", "completed"];

/* =========================================================================
   1. TOP ROW KPI METRIC COUNTS
   ========================================================================= */
export const getTransporterDashboardStats = async (req, res) => {
    try {
        const transporterId = req.user._id;

        const [myQuotes, allOrders] = await Promise.all([
            ShipmentTransportQuote.find({ transporter: transporterId }).lean(),
            Order.find({
                $or: [
                    { "shipments.transportStatus": "open_for_quotes" },
                    { "shipments.transportStatus": "admin_assignment_pending" },
                    { "shipments.assignedTransporter": transporterId }
                ],
                isDeleted: false
            }).lean()
        ]);

        const myQuotedShipmentIds = new Set(myQuotes.map(q => q.shipmentId.toString()));
        const openShipmentsList = [];
        const adminPendingList = [];
        const assignedShipmentsList = [];
        let aggregateRevenue = 0;
        let completedCount = 0;

        allOrders.forEach(o => {
            o.shipments.forEach(s => {
                const isMyShipment = s.assignedTransporter?.toString() === transporterId.toString();

                // Open Marketplace Loads
                if (s.transportStatus === "open_for_quotes" && !myQuotedShipmentIds.has(s._id.toString())) {
                    openShipmentsList.push({ shipmentId: s.shipmentInvoiceId, route: `${s.shipmentFrom} ➔ ${s.shipmentTo}`, item: s.selectedItem });
                }

                // Admin Pending Loads
                if (s.transportStatus === "admin_assignment_pending") {
                    adminPendingList.push({ shipmentId: s.shipmentInvoiceId, route: `${s.shipmentFrom} ➔ ${s.shipmentTo}` });
                }

                // Assigned & Completed Shipments
                if (isMyShipment) {
                    if (ACTIVE_STATUSES.includes(s.shipmentStatus)) {
                        assignedShipmentsList.push({ shipmentId: s.shipmentInvoiceId, route: `${s.shipmentFrom} ➔ ${s.shipmentTo}`, status: s.shipmentStatus });
                    }
                    if (COMPLETED_STATUSES.includes(s.shipmentStatus)) {
                        completedCount++;
                        aggregateRevenue += Number(s.transportFinalAmount || s.transportPrice || 0);
                    }
                }
            });
        });

        res.status(200).json({
            success: true,
            stats: {
                openShipments: openShipmentsList.length,
                // Summing bids and admin-pending tasks into one logical KPI
                pendingRequests: myQuotes.filter(q => q.quoteStatus === "submitted").length + adminPendingList.length,
                adminPending: adminPendingList.length, // Keep as a separate metric for the new card
                assignedShipments: assignedShipmentsList.length,
                completedShipments: completedCount,
                revenue: aggregateRevenue >= 100000 ? `${(aggregateRevenue / 100000).toFixed(2)} Lakhs` : `₹${aggregateRevenue.toLocaleString()}`
            },
            openShipmentsList,
            adminPendingList,
            assignedShipmentsList
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching stats" });
    }
};

/* =========================================================================
   2. MAIN ANALYTICS LINE CHART
   ========================================================================= */
export const getAssignedVsCompletedOverview = async (req, res) => {
    try {
        const transporterId = req.user._id;
        // Update this line to match "1month" instead of "30days"
        const days = req.query.filter === "1month" ? 30 : 7; 

        const orders = await Order.find({ "shipments.assignedTransporter": transporterId, isDeleted: false }).lean();

        const graphData = Array.from({ length: days }, (_, i) => {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            date.setDate(date.getDate() - (days - 1 - i));

            let dayAssigned = 0, dayCompleted = 0;
            orders.forEach(order => {
                order.shipments.forEach(s => {
                    if (s.assignedTransporter?.toString() === transporterId.toString()) {
                        if (new Date(s.assignedAt || order.createdAt).toDateString() === date.toDateString()) dayAssigned++;
                        if (COMPLETED_STATUSES.includes(s.shipmentStatus) && new Date(s.deliveredAt || order.updatedAt).toDateString() === date.toDateString()) dayCompleted++;
                    }
                });
            });
            return { date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }), assigned: dayAssigned, completed: dayCompleted };
        });

        return res.status(200).json({ success: true, graphData });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch timeline" });
    }
};

/* =========================================================================
   3. SPLIT ACTIVITY LOGGING TABLES
   ========================================================================= */
export const getTransporterRecentActivity = async (req, res) => {
    try {
        const transporterId = req.user._id;

        const [rawQuotes, activeOrders] = await Promise.all([
            ShipmentTransportQuote.find({ transporter: transporterId })
                .populate('orderId')
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),
            Order.find({
                "shipments.assignedTransporter": transporterId,
                "shipments.shipmentStatus": { $in: [...ACTIVE_STATUSES, ...COMPLETED_STATUSES] },
                isDeleted: false
            }).sort({ createdAt: -1 }).lean()
        ]);

        const recentRequests = rawQuotes.map(q => {
            // Find the specific shipment object within the populated order
            const shipment = q.orderId?.shipments?.find(s => s._id.toString() === q.shipmentId.toString());
            
            return {
                // Get the actual ID for this specific shipment
                shipmentId: shipment?.shipmentInvoiceId || "N/A",
                route: shipment ? `${shipment.shipmentFrom} ➔ ${shipment.shipmentTo}` : "Route Unavailable",
                quoteAmount: q.quotedPrice || 0,
                status: q.quoteStatus // e.g., "submitted", "selected", "rejected"
            };
        });

        const assignedShipments = activeOrders.flatMap(o => o.shipments
            .filter(s => s.assignedTransporter?.toString() === transporterId.toString())
            .map(s => ({ 
                shipmentId: s.shipmentInvoiceId || "N/A", 
                route: `${s.shipmentFrom} ➔ ${s.shipmentTo}`, 
                item: s.selectedItem, 
                status: s.shipmentStatus 
            }))
        );

        return res.status(200).json({ success: true, recentRequests, assignedShipments });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

/* =========================================================================
   4. BOTTOM SPLINE AREA CHART (Revenue)
   ========================================================================= */
export const getRevenueOverviewGraph = async (req, res) => {
    try {
        const transporterId = req.user._id;
        const days = req.query.filter === "30days" ? 30 : 7;
        const orders = await Order.find({ "shipments.assignedTransporter": transporterId, "shipments.shipmentStatus": { $in: COMPLETED_STATUSES }, isDeleted: false }).lean();

        const graphData = Array.from({ length: days }, (_, i) => {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            date.setDate(date.getDate() - (days - 1 - i));

            let dayRevenue = 0;
            orders.forEach(order => {
                order.shipments.forEach(s => {
                    if (s.assignedTransporter?.toString() === transporterId.toString() && COMPLETED_STATUSES.includes(s.shipmentStatus) && new Date(s.deliveredAt || order.updatedAt).toDateString() === date.toDateString()) {
                        dayRevenue += Number(s.transportFinalAmount || s.transportPrice || 0);
                    }
                });
            });
            return { date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }), revenue: dayRevenue };
        });
        return res.status(200).json({ success: true, graphData });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to generate revenue plot" });
    }
};

/* =========================================================================
   5. DATABASE SEEDER
   ========================================================================= */
export const seedTransporterData = async (req, res) => {
    // (Assuming your previous seeder logic remains here)
    return res.status(200).json({ success: true, message: "Database seeded." });
};