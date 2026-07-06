// rubberproject/src/components/admin/OrderHistoryPDF.js
import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 8,
        color: "#1f2937",
        fontFamily: "Helvetica",
        backgroundColor: "#ffffff",
    },
    topAccentBar: {
        height: 12,
        backgroundColor: "#312e81",
        marginHorizontal: -30,
        marginTop: -30,
        marginBottom: 15,
    },
    headerBlock: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottom: "1.5px solid #312e81",
        paddingBottom: 10,
        marginBottom: 12,
    },
    logoSection: {
        flexDirection: "row",
        alignItems: "center",
    },
    logoTextMain: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1e1b4b",
        letterSpacing: 0.5,
    },
    logoTextSub: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#16a34a",
        marginLeft: 2,
    },
    marketSubtitle: {
        fontSize: 8,
        color: "#6b7280",
        marginTop: 1,
    },
    docMetaTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#312e81",
        textAlign: "right",
        marginBottom: 4,
    },
    metaRightText: {
        textAlign: "right",
        lineHeight: 1.3,
        color: "#374151",
    },
    companyStampBlock: {
        fontSize: 7.5,
        color: "#4b5563",
        lineHeight: 1.3,
        marginBottom: 12,
    },

    // Three Column Address Row
    addressRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    addressCard: {
        width: "32%",
        border: "1px solid #e5e7eb",
        borderRadius: 3,
    },
    cardHeader: {
        backgroundColor: "#312e81",
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 8,
        paddingVertical: 3,
        paddingHorizontal: 6,
        textTransform: "uppercase",
    },
    cardBody: {
        padding: 5,
        lineHeight: 1.4,
    },

    // Summary Matrix Bar
    summaryRowBar: {
        flexDirection: "row",
        border: "1px solid #e5e7eb",
        backgroundColor: "#f9fafb",
        borderRadius: 3,
        padding: 6,
        justifyContent: "space-between",
        marginBottom: 12,
    },
    summaryBarItem: {
        width: "24%",
    },
    summaryBarLabel: {
        color: "#6b7280",
        fontSize: 7,
        marginBottom: 1,
    },
    summaryBarValue: {
        fontWeight: "bold",
        color: "#111827",
    },

    // Global Table Configurations
    sectionTitle: {
        fontSize: 9,
        fontWeight: "bold",
        color: "#ffffff",
        backgroundColor: "#4338ca",
        paddingVertical: 3,
        paddingHorizontal: 6,
        textTransform: "uppercase",
        marginBottom: 4,
    },
    table: {
        display: "table",
        width: "auto",
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 3,
        overflow: "hidden",
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        paddingVertical: 4,
        alignItems: "center",
    },
    tableHeader: {
        backgroundColor: "#312e81",
        color: "#ffffff",
    },
    tableHeaderCell: {
        fontWeight: "bold",
        color: "#ffffff",
    },

    // Columns for Items Table
    colSno: { width: "6%", textAlign: "center" },
    colProd: { width: "34%", paddingLeft: 6 },
    colCat: { width: "20%" },
    colQty: { width: "12%", textAlign: "center" },
    colPrice: { width: "13%", textAlign: "right" },
    colSub: { width: "15%", textAlign: "right", paddingRight: 6 },

    // Triple Payment Sub-tables wrapper
    paymentsGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    paymentMiniTable: {
        width: "32%",
        border: "1px solid #e5e7eb",
        borderRadius: 3,
    },
    miniTableHeader: {
        backgroundColor: "#1e1b4b",
        color: "#ffffff",
        fontWeight: "bold",
        paddingVertical: 3,
        paddingHorizontal: 4,
        fontSize: 7.5,
        textAlign: "center",
    },
    miniRowHeader: {
        flexDirection: "row",
        backgroundColor: "#f3f4f6",
        borderBottom: "1px solid #e5e7eb",
        paddingVertical: 2,
    },
    miniRowData: {
        flexDirection: "row",
        borderBottom: "1px solid #f3f4f6",
        paddingVertical: 2.5,
    },
    mColDate: { width: "35%", fontSize: 6.5, textAlign: "center" },
    mColAmt: { width: "35%", fontSize: 6.5, textAlign: "right" },
    mColStatus: { width: "30%", fontSize: 6.5, textAlign: "center" },

    // Shipments Breakdown Layout
    shipmentCardWrapper: {
        border: "1px solid #e5e7eb",
        borderRadius: 3,
        marginBottom: 8,
        padding: 5,
        backgroundColor: "#fafafa",
    },
    shipmentTopMeta: {
        backgroundColor: "#e0e7ff",
        paddingVertical: 2,
        paddingHorizontal: 4,
        fontWeight: "bold",
        color: "#312e81",
        marginBottom: 4,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    // Financial Summary Section
    financialContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        border: "1px solid #e5e7eb",
        borderRadius: 3,
        padding: 6,
        backgroundColor: "#f9fafb",
        marginBottom: 15,
    },
    finColumn: {
        width: "32%",
        lineHeight: 1.4,
    },
    finRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 1,
    },
    finLabel: { color: "#4b5563" },
    finValue: { fontWeight: "bold" },

    // Timeline Progress Component
    timelineContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #e5e7eb",
        borderRadius: 3,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "#fdfdfd",
        marginBottom: 15,
    },
    timelineStep: {
        alignItems: "center",
        width: "12%",
    },
    timelineDotActive: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#16a34a",
        marginBottom: 3,
        border: "2px solid #d1fae5",
    },
    timelineDotInactive: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#d1d5db",
        marginBottom: 3,
    },
    timelineText: {
        fontSize: 6,
        textAlign: "center",
        color: "#374151",
        fontWeight: "bold",
    },
    timelineDate: {
        fontSize: 5.5,
        color: "#9ca3af",
        marginTop: 1,
    },

    // Signatures / Footer elements
    bottomContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginTop: 10,
    },
    infoNoteBox: {
        width: "45%",
        borderLeft: "2px solid #4338ca",
        paddingLeft: 6,
    },
    signatureBox: {
        width: "35%",
        textAlign: "center",
        borderTop: "1px solid #9ca3af",
        paddingTop: 4,
    },
    systemFooter: {
        position: "absolute",
        bottom: 15,
        left: 30,
        right: 30,
        backgroundColor: "#1e1b4b",
        color: "#ffffff",
        textAlign: "center",
        paddingVertical: 3,
        fontSize: 7,
    }
});

const OrderHistoryPDF = ({ order }) => {
    
    // Change "Short" to lowercase "short"
    const formatReportDate = (dt) => dt ? new Date(dt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-";
    const formatReportTime = (dt) => dt ? new Date(dt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "";

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.topAccentBar} />

                {/* TOP BRAND HEADER */}
                <View style={styles.headerBlock}>
                    <View>
                        <View style={styles.logoSection}>
                            <Text style={styles.logoTextMain}>RUBBER</Text>
                            <Text style={styles.logoTextSub}>SCRAP MART</Text>
                        </View>
                        <Text style={styles.marketSubtitle}>Industrial Recycling & Scrap Marketplace Records</Text>
                    </View>
                    <View>
                        <Text style={styles.docMetaTitle}>ORDER HISTORY REPORT</Text>
                        <Text style={styles.metaRightText}>Report Date : {formatReportDate(new Date())} {formatReportTime(new Date())}</Text>
                        <Text style={styles.metaRightText}>Order ID : {order?.orderId || "-"}</Text>
                        <Text style={styles.metaRightText}>Order Date : {formatReportDate(order?.createdAt)}</Text>
                        <Text style={styles.metaRightText}>Generated By : Admin</Text>
                    </View>
                </View>

                {/* HEAD OFFICE METRICS STAMP */}
                <Text style={styles.companyStampBlock}>
                    <Text style={{ fontWeight: "bold" }}>Rubberscrapmart</Text> {"\n"}
                    Ground Floor, Office No-52 / Plot No-44, Sai Chamber CHS Wing A, Sector-11, {"\n"}
                    Sai Chambers, CBD Belapur, Navi Mumbai, Thane, Maharashtra, 400614, GSTN: 27AAVFV4635R1ZY
                </Text>
{/* UPDATED: TWO COLUMN ADDRESS BLOCKS (Buyer & Seller only) */}
<View style={[styles.addressRow, { justifyContent: "flex-start" }]}>
    {/* Buyer Details */}
    <View style={[styles.addressCard, { marginRight: "2%" }]}>
        <Text style={styles.cardHeader}>Buyer Details</Text>
        <View style={styles.cardBody}>
            <Text style={{ fontWeight: "bold" }}>{order?.buyer?.fullName || "-"}</Text>
            <Text>Company: {order?.buyer?.businessProfile?.companyName || "N/A"}</Text>
            <Text>Email: {order?.buyer?.email || "-"}</Text>
            {/* Fallback to order.buyer.phone if businessProfile.phoneNumber is missing */}
            <Text>Phone: {order?.buyer?.businessProfile?.phoneNumber || order?.buyer?.phone || "-"}</Text>
        </View>
    </View>

    {/* Seller Details */}
    <View style={styles.addressCard}>
        <Text style={styles.cardHeader}>Seller Details</Text>
        <View style={styles.cardBody}>
            <Text style={{ fontWeight: "bold" }}>{order?.seller?.fullName || "-"}</Text>
            <Text>Company: {order?.seller?.businessProfile?.companyName || "N/A"}</Text>
            <Text>Email: {order?.seller?.email || "-"}</Text>
            {/* Fallback to order.seller.phone if businessProfile.phoneNumber is missing */}
            <Text>Phone: {order?.seller?.businessProfile?.phoneNumber || order?.seller?.phone || "-"}</Text>
        </View>
    </View>
</View>

                {/* ORDER SUMMARY BANNER */}
                <Text style={styles.sectionTitle}>Order Summary</Text>
                <View style={styles.summaryRowBar}>
                    <View style={styles.summaryBarItem}>
                        <Text style={styles.summaryBarLabel}>Order Status</Text>
                        <Text style={styles.summaryBarValue}>{order?.orderStatus?.toUpperCase()?.replace("_", " ") || "-"}</Text>
                    </View>
                    <View style={styles.summaryBarItem}>
                        <Text style={styles.summaryBarLabel}>Transport Mode</Text>
                        <Text style={styles.summaryBarValue}>{order?.transportMode?.toUpperCase()?.replace("_", " ") || "-"}</Text>
                    </View>
                    <View style={styles.summaryBarItem}>
                        <Text style={styles.summaryBarLabel}>Buyer Payment Status</Text>
                        <Text style={styles.summaryBarValue}>{order?.buyerPaymentStatus?.toUpperCase() || "-"}</Text>
                    </View>
                    <View style={styles.summaryBarItem}>
                        <Text style={styles.summaryBarLabel}>Seller Payment Status</Text>
                        <Text style={styles.summaryBarValue}>{order?.sellerPaymentStatus?.toUpperCase() || "-"}</Text>
                    </View>
                </View>

                {/* ORDERED ITEMS TABLE */}
                <Text style={styles.sectionTitle}>Ordered Items</Text>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.colSno, styles.tableHeaderCell]}>S.No</Text>
                        <Text style={[styles.colProd, styles.tableHeaderCell]}>Product</Text>
                        <Text style={[styles.colCat, styles.tableHeaderCell]}>Category</Text>
                        <Text style={[styles.colQty, styles.tableHeaderCell]}>Qty (MT)</Text>
                        <Text style={[styles.colPrice, styles.tableHeaderCell]}>Price / MT (₹)</Text>
                        <Text style={[styles.colSub, styles.tableHeaderCell]}>Subtotal (₹)</Text>
                    </View>
                    {order?.orderItems?.map((item, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={styles.colSno}>{index + 1}</Text>
                            {/* Correctly accessing nested product and direct schema fields */}
                            <Text style={styles.colProd}>{item.productName || item.product?.productName || "Scrap Item"}</Text>
                            <Text style={styles.colCat}>{item.category || item.product?.category || "N/A"}</Text>
                            <Text style={styles.colQty}>{item.requiredQuantity || 0}</Text>
                            <Text style={styles.colPrice}>{(item.pricePerMT || 0).toLocaleString("en-IN")}</Text>
                            <Text style={styles.colSub}>{(item.subtotal || 0).toLocaleString("en-IN")}</Text>
                        </View>
                    ))}
                </View>

                {/* THREE PAYMENT BREAKDOWNS MATRIX */}
                <View style={styles.paymentsGrid}>
                    {/* Buyer Payments */}
                    <View style={styles.paymentMiniTable}>
                        <Text style={styles.miniTableHeader}>BUYER → ADMIN PAYMENTS</Text>
                        <View style={styles.miniRowHeader}>
                            <Text style={styles.mColDate}>Date</Text>
                            <Text style={styles.mColAmt}>Amount (₹)</Text>
                            <Text style={styles.mColStatus}>Status</Text>
                        </View>
                        {order?.buyerPaymentReceipts?.map((rec, i) => (
                            <View style={styles.miniRowData} key={i}>
                                <Text style={styles.mColDate}>{formatReportDate(rec.uploadedAt || rec.createdAt)}</Text>
                                <Text style={styles.mColAmt}>{(rec.amount || 0).toLocaleString("en-IN")}</Text>
                                <Text style={styles.mColStatus}>{rec.status || "Verified"}</Text>
                            </View>
                        )) || <Text style={{ fontSize: 6, padding: 4, textAlign: "center" }}>No transactional activity logged</Text>}
                    </View>

                    {/* Seller Payments */}
                    <View style={styles.paymentMiniTable}>
                        <Text style={styles.miniTableHeader}>ADMIN → SELLER PAYMENTS</Text>
                        <View style={styles.miniRowHeader}>
                            <Text style={styles.mColDate}>Date</Text>
                            <Text style={styles.mColAmt}>Amount (₹)</Text>
                            <Text style={styles.mColStatus}>Status</Text>
                        </View>
                        {order?.sellerPaymentReceipts?.map((rec, i) => (
                            <View style={styles.miniRowData} key={i}>
                                <Text style={styles.mColDate}>{formatReportDate(rec.uploadedAt || rec.createdAt)}</Text>
                                <Text style={styles.mColAmt}>{(rec.amount || 0).toLocaleString("en-IN")}</Text>
                                <Text style={styles.mColStatus}>{rec.status || "Verified"}</Text>
                            </View>
                        )) || <Text style={{ fontSize: 6, padding: 4, textAlign: "center" }}>No transactional activity logged</Text>}
                    </View>

                    {/* Transporter Payments */}
                    <View style={styles.paymentMiniTable}>
                        <Text style={styles.miniTableHeader}>ADMIN → TRANSPORTER PAYMENTS</Text>
                        <View style={styles.miniRowHeader}>
                            <Text style={styles.mColDate}>Date</Text>
                            <Text style={styles.mColAmt}>Amount (₹)</Text>
                            <Text style={styles.mColStatus}>Status</Text>
                        </View>
                        {order?.shipments?.flatMap(s => s.adminTransportPaymentReceipts || [])?.map((rec, i) => (
                            <View style={styles.miniRowData} key={i}>
                                <Text style={styles.mColDate}>{formatReportDate(rec.uploadedAt)}</Text>
                                <Text style={styles.mColAmt}>{(rec.amount || 0).toLocaleString("en-IN")}</Text>
                                <Text style={styles.mColStatus}>{rec.status || "Paid"}</Text>
                            </View>
                        )) || <Text style={{ fontSize: 6, padding: 4, textAlign: "center" }}>No transactional activity logged</Text>}
                    </View>
                </View>

                {/* SHIPMENT MANAGEMENT LOG DETAILS */}
                <Text style={styles.sectionTitle}>Shipment Details</Text>
                {order?.shipments?.map((ship, index) => (
                    <View style={styles.shipmentCardWrapper} key={index}>
                        <View style={styles.shipmentTopMeta}>
                            <Text>SHIPMENT ID: {ship.shipmentInvoiceId || `SHIP-00${index + 1}`}</Text>
                            <Text>SHIPPED QTY: {ship.shippedQuantity || 0} MT</Text>
                            {/* Ensure you use adminAssignedPrice */}
                            <Text>Cost: ₹{(ship.adminAssignedPrice || 0).toLocaleString("en-IN")}</Text>
                            <Text>STATUS: {ship.shipmentStatus}</Text>
                        </View>
                    </View>
                ))}

                {/* THREE SECTION COMPREHENSIVE FINANCIAL BALANCES SUMMARIES */}
                <View style={styles.financialContainer}>
                    <View style={styles.finColumn}>
                        <View style={styles.finRow}><Text style={styles.finLabel}>Taxable Amount:</Text><Text style={styles.finValue}>₹{(order?.taxableAmount || 0).toLocaleString("en-IN")}</Text></View>
                        <View style={styles.finRow}><Text style={styles.finLabel}>CGST (2.5%):</Text><Text style={styles.finValue}>₹{(order?.cgstAmount || 0).toLocaleString("en-IN")}</Text></View>
                        <View style={styles.finRow}><Text style={styles.finLabel}>SGST (2.5%):</Text><Text style={styles.finValue}>₹{(order?.sgstAmount || 0).toLocaleString("en-IN")}</Text></View>
                        <View style={styles.finRow}><Text style={styles.finLabel}>IGST (5.0%):</Text><Text style={styles.finValue}>₹{(order?.igstAmount || 0).toLocaleString("en-IN")}</Text></View>
                        <View style={styles.finRow}><Text style={styles.finLabel}>Total GST Amount:</Text><Text style={styles.finValue}>₹{(order?.gstAmount || 0).toLocaleString("en-IN")}</Text></View>
                    </View>

                    <View style={styles.finColumn}>
                        <View style={styles.finRow}><Text style={styles.finLabel}>Total Product cost:</Text><Text style={styles.finValue}>₹{(order?.totalAmount || 0).toLocaleString("en-IN")}</Text></View>
                        <View style={styles.finRow}><Text style={styles.finLabel}>Buyer Paid Amount:</Text><Text style={styles.finValue}>₹{(order?.buyerPaidAmount || 0).toLocaleString("en-IN")}</Text></View>
                        <View style={styles.finRow}><Text style={styles.finLabel}>Buyer Pending Bal:</Text><Text style={styles.finValue}>₹{(order?.buyerPendingAmount || 0).toLocaleString("en-IN")}</Text></View>
                        <View style={styles.finRow}><Text style={styles.finLabel}>Seller Paid Amount:</Text><Text style={styles.finValue}>₹{(order?.sellerPaidAmount || 0).toLocaleString("en-IN")}</Text></View>
                        <View style={styles.finRow}><Text style={styles.finLabel}>Seller Pending Bal:</Text><Text style={styles.finValue}>₹{(order?.sellerPendingAmount || 0).toLocaleString("en-IN")}</Text></View>
                    </View>

                    <View style={styles.finColumn}>
                        <View style={styles.finRow}>
                            <Text style={styles.finLabel}>Transport Cost:</Text>
                            <Text style={styles.finValue}>₹{(order?.shipments?.reduce((acc, curr) => acc + (curr.adminAssignedPrice || 0), 0) || 0).toLocaleString("en-IN")}</Text>
                        </View>
                        <View style={[styles.finRow, { marginTop: 6, borderTop: "1px solid #312e81", paddingTop: 4 }]}>
                            <Text style={{ fontWeight: "bold", color: "#312e81" }}>Grand Total Ledger:</Text>
                            <Text style={{ fontWeight: "bold", color: "#312e81" }}>₹{((order?.totalAmount || 0) + (order?.shipments?.reduce((acc, curr) => acc + (curr.adminAssignedPrice || 0), 0) || 0)).toLocaleString("en-IN")}</Text>
                        </View>
                    </View>
                </View>

                {/* PROGRESS FLOW TIMELINE SECTION */}
                <Text style={styles.sectionTitle}>Order Timeline Tracker</Text>
                <View style={styles.timelineContainer}>
                    <View style={styles.timelineStep}>
                        <View style={styles.timelineDotActive} />
                        <Text style={styles.timelineText}>Order Placed</Text>
                        <Text style={styles.timelineDate}>{formatReportDate(order?.createdAt)}</Text>
                    </View>
                    <View style={styles.timelineStep}>
                        <View style={order?.sellerConfirmedAt ? styles.timelineDotActive : styles.timelineDotInactive} />
                        <Text style={styles.timelineText}>Seller Confirmed</Text>
                        <Text style={styles.timelineDate}>{formatReportDate(order?.sellerConfirmedAt)}</Text>
                    </View>
                    <View style={styles.timelineStep}>
                        <View style={order?.paymentUploadedAt ? styles.timelineDotActive : styles.timelineDotInactive} />
                        <Text style={styles.timelineText}>Payment Sent</Text>
                        <Text style={styles.timelineDate}>{formatReportDate(order?.paymentUploadedAt)}</Text>
                    </View>
                    <View style={styles.timelineStep}>
                        <View style={order?.paymentVerifiedAt ? styles.timelineDotActive : styles.timelineDotInactive} />
                        <Text style={styles.timelineText}>Payment Verified</Text>
                        <Text style={styles.timelineDate}>{formatReportDate(order?.paymentVerifiedAt)}</Text>
                    </View>
                    <View style={styles.timelineStep}>
                        <View style={order?.shipments?.some(s => s.packedAt) ? styles.timelineDotActive : styles.timelineDotInactive} />
                        <Text style={styles.timelineText}>Cargo Packed</Text>
                        <Text style={styles.timelineDate}>{formatReportDate(order?.shipments?.find(s => s.packedAt)?.packedAt)}</Text>
                    </View>
                    <View style={styles.timelineStep}>
                        <View style={order?.shippedAt ? styles.timelineDotActive : styles.timelineDotInactive} />
                        <Text style={styles.timelineText}>Dispatched</Text>
                        <Text style={styles.timelineDate}>{formatReportDate(order?.shippedAt)}</Text>
                    </View>
                    <View style={styles.timelineStep}>
                        <View style={order?.deliveredAt ? styles.timelineDotActive : styles.timelineDotInactive} />
                        <Text style={styles.timelineText}>Delivered</Text>
                        <Text style={styles.timelineDate}>{formatReportDate(order?.deliveredAt)}</Text>
                    </View>
                    <View style={styles.timelineStep}>
                        <View style={order?.completedAt ? styles.timelineDotActive : styles.timelineDotInactive} />
                        <Text style={styles.timelineText}>Completed</Text>
                        <Text style={styles.timelineDate}>{formatReportDate(order?.completedAt)}</Text>
                    </View>
                </View>

                {/* LOWER SIGNATURE / NOTARY AREA */}
                <View style={styles.bottomContainer}>
                    <View style={styles.infoNoteBox}>
                        <Text style={{ fontWeight: "bold", fontSize: 7, color: "#1e1b4b", marginBottom: 2 }}>IMPORTANT NOTICE</Text>
                        <Text style={{ fontSize: 6.5, color: "#4b5563", lineHeight: 1.3 }}>
                            This statement document is compiled programmatically from authentic transaction logs within the RubberHub network infrastructure. No handwritten signature required.
                        </Text>
                    </View>
                    <View style={styles.signatureBox}>
                        <Text style={{ fontSize: 7, fontWeight: "bold", color: "#374151" }}>Authorized System Desk</Text>
                        <Text style={{ fontSize: 6, color: "#6b7280", marginTop: 1 }}>RubberHub Corporate Admin Panel</Text>
                    </View>
                </View>

                <Text style={styles.systemFooter}>
                    This is a system-generated report and does not require a physical signature. Page 1 of 1
                </Text>
            </Page>
        </Document>
    );
};

export default OrderHistoryPDF;