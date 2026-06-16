import express from "express";
import {
  getTransporterDashboardStats,
  getAssignedVsCompletedOverview,
  getTransporterRecentActivity,
  getRevenueOverviewGraph,
  seedTransporterData
} from "../controllers/transporterDashboardController.js";
import { protectUser } from "../middlewares/authMiddleware.js"; // Replace with your actual auth middleware path

const router = express.Router();

/* =========================================================================
   TRANSPORTER DASHBOARD ROUTES
   All routes are protected and expect a valid session/token (req.user._id)
   ========================================================================= */

// 1. Top Row KPI Metric Counts (Open, Pending, Assigned, Completed, Revenue)
router.get("/stats", protectUser, getTransporterDashboardStats);

// 2. Main Analytics Line Chart (Assigned vs Completed Over Time)
router.get("/shipments-overview", protectUser, getAssignedVsCompletedOverview);

// 3. Split Activity Logging Tables (Recent Requests & Assigned Shipments tables)
router.get("/recent-activity", protectUser, getTransporterRecentActivity);

// 4. Bottom Spline Area Chart (Revenue Overview Growth Tracker)
router.get("/revenue-overview", protectUser, getRevenueOverviewGraph);

/* =========================================================================
   DEVELOPMENT ONLY ENVIRONMENT TOOLS
   ========================================================================= */
// Staging Data Generator to populate real records directly onto your account
router.post("/seed-data", protectUser, seedTransporterData);

export default router;