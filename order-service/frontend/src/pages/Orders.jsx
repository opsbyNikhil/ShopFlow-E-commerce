import { useEffect, useState } from "react";

import {
  Card,
  Typography,
  Button,
  Spin,
  Empty,
  Tag,
  Divider,
  message,
  Space,
  Row,
  Col,
  Grid,
  Modal,
} from "antd"; // <-- removed Popconfirm

import {
  ShoppingOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
  CheckCircleFilled,
  CarOutlined,
  CloseCircleFilled,
  ClockCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import Header from "../components/Header";

const { Title, Text } = Typography;

// Temporary user ID
const userId = 1;

// Base URL of your backend/API — used to resolve relative image paths
const API_BASE = `${import.meta.env.VITE_ORDER_API_URL}`;

const resolveImageUrl = (path) => {
  if (!path) return null;
  if (/^(https?:)?\/\//i.test(path) || path.startsWith("data:")) return path;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
};

// ---------------------------------------------
// STATUS CONFIG
// ---------------------------------------------
const STATUS_CONFIG = {
  PENDING: { color: "#B45309", bg: "#FEF3C7", label: "Pending", step: 0 },
  PROCESSING: { color: "#B45309", bg: "#FEF3C7", label: "Processing", step: 0 },
  SHIPPED: { color: "#1D4ED8", bg: "#DBEAFE", label: "Shipped", step: 1 },
  DELIVERED: { color: "#15803D", bg: "#DCFCE7", label: "Delivered", step: 2 },
  CANCELLED: { color: "#B91C1C", bg: "#FEE2E2", label: "Cancelled", step: -1 },
};

const TRACK_STEPS = ["Order Placed", "Shipped", "Delivered"];

const getStatusConfig = (status) =>
  STATUS_CONFIG[status] || {
    color: "#4B5563",
    bg: "#F3F4F6",
    label: status,
    step: 0,
  };

function OrderTracker({ status }) {
  const config = getStatusConfig(status);

  if (config.step === -1) {
    return (
      <div className="sf-cancelled-banner">
        <CloseCircleFilled style={{ fontSize: 16 }} />
        This order was cancelled
      </div>
    );
  }

  return (
    <div className="sf-tracker">
      {TRACK_STEPS.map((label, idx) => {
        const done = idx <= config.step;
        return (
          <div className="sf-tracker-step" key={label}>
            <div className="sf-tracker-node-row">
              <div className={`sf-tracker-node ${done ? "done" : ""}`}>
                {done ? <CheckCircleFilled /> : <span className="sf-dot" />}
              </div>
              {idx < TRACK_STEPS.length - 1 && (
                <div
                  className={`sf-tracker-line ${idx < config.step ? "done" : ""}`}
                />
              )}
            </div>
            <Text
              className="sf-tracker-label"
              style={{ color: done ? "#111827" : "#9CA3AF" }}
            >
              {label}
            </Text>
          </div>
        );
      })}
    </div>
  );
}

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brokenImages, setBrokenImages] = useState({});
  const [actionLoading, setActionLoading] = useState({});

  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  // Modal states
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // ---------------------------------------------
  // GET USER ORDERS
  // ---------------------------------------------
  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_ORDER_API_URL}/api/orders/?user_id=${userId}`,
      );
      console.log("Orders:", response.data);
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to load orders:", error);
      message.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markImageBroken = (key) => {
    setBrokenImages((prev) => ({ ...prev, [key]: true }));
  };

  // ---------------------------------------------
  // CANCEL ORDER
  // ---------------------------------------------
  const cancelOrder = async (orderId) => {
    setActionLoading((prev) => ({ ...prev, [orderId]: "cancel" }));

    try {
      await axios.patch(`${API_BASE}/api/orders/${orderId}/`, {
        status: "CANCELLED",
      });

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "CANCELLED" } : o)),
      );

      message.success(`Order #${orderId} cancelled`);
    } catch (error) {
      console.error("Failed to cancel order:", error);
      message.error("Couldn't cancel this order. Please try again.");
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[orderId];
        return next;
      });
    }
  };

  // ---------------------------------------------
  // DELETE ORDER
  // ---------------------------------------------
  const deleteOrder = async (orderId) => {
    setActionLoading((prev) => ({ ...prev, [orderId]: "delete" }));

    try {
      await axios.delete(`${API_BASE}/api/orders/${orderId}/`);

      setOrders((prev) => prev.filter((o) => o.id !== orderId));

      message.success(`Order #${orderId} deleted`);
    } catch (error) {
      console.error("Failed to delete order:", error);
      message.error("Couldn't delete this order. Please try again.");
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[orderId];
        return next;
      });
    }
  };

  // ---------------------------------------------
  // LOADING
  // ---------------------------------------------
  if (loading) {
    return (
      <>
        <Header />
        <div className="sf-center-screen">
          <Spin size="large" />
        </div>
      </>
    );
  }

  // ---------------------------------------------
  // EMPTY ORDERS
  // ---------------------------------------------
  if (orders.length === 0) {
    return (
      <>
        <Header />
        <div className="sf-center-screen sf-bg">
          <Card className="sf-empty-card">
            <Empty description="You haven't placed any orders yet" />
            <Button
              type="primary"
              icon={<ShoppingOutlined />}
              onClick={() => {
                window.location.href = `${import.meta.env.VITE_PRODUCT_FRONTEND_URL}/products`;
              }}
              style={{ marginTop: 16 }}
            >
              Start Shopping
            </Button>
          </Card>
        </div>
      </>
    );
  }

  // ---------------------------------------------
  // ORDERS PAGE
  // ---------------------------------------------
  return (
    <>
      <Header />
      <style>{ORDERS_CSS}</style>
      <div className="sf-bg sf-page">
        <div className="sf-container">
          {/* PAGE HEADER */}
          <div className="sf-page-header">
            <Title level={2} style={{ marginBottom: 4 }}>
              My Orders
            </Title>
            <Text type="secondary">
              {orders.length} {orders.length === 1 ? "order" : "orders"} placed
              &nbsp;&middot;&nbsp; view status, items and details below.
            </Text>
          </div>

          {/* ORDERS */}
          {orders.map((order) => {
            const status = getStatusConfig(order.status);

            return (
              <Card
                key={order.id}
                className="sf-order-card"
                bodyStyle={{ padding: 0 }}
              >
                {/* SUMMARY STRIP */}
                <div className="sf-summary-strip">
                  <div className="sf-summary-cell">
                    <Text className="sf-summary-label">Order Placed</Text>
                    <Text className="sf-summary-value">
                      {new Date(order.created_at).toLocaleDateString(
                        undefined,
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </Text>
                  </div>
                  <div className="sf-summary-cell">
                    <Text className="sf-summary-label">Total</Text>
                    <Text className="sf-summary-value">
                      ₹{Number(order.total_amount).toFixed(2)}
                    </Text>
                  </div>
                  <div className="sf-summary-cell">
                    <Text className="sf-summary-label">Order #</Text>
                    <Text className="sf-summary-value">#{order.id}</Text>
                  </div>
                  <div className="sf-summary-cell sf-summary-status">
                    <Tag
                      className="sf-status-tag"
                      style={{
                        color: status.color,
                        background: status.bg,
                        borderColor: status.bg,
                      }}
                      icon={
                        status.step === -1 ? (
                          <CloseCircleFilled />
                        ) : status.step === 2 ? (
                          <CheckCircleFilled />
                        ) : status.step === 1 ? (
                          <CarOutlined />
                        ) : (
                          <ClockCircleOutlined />
                        )
                      }
                    >
                      {status.label}
                    </Tag>
                  </div>
                </div>

                <div className="sf-card-body">
                  {/* TRACKER */}
                  <OrderTracker status={order.status} />
                  <Divider style={{ margin: "18px 0" }} />

                  {/* ORDER ITEMS */}
                  <Text strong className="sf-items-heading">
                    Items in this order
                  </Text>
                  <div className="sf-items-list">
                    {order.items &&
                      order.items.map((item) => {
                        const imgKey = `${order.id}-${item.id}`;
                        const resolvedSrc = resolveImageUrl(item.product_image);
                        const showImage = resolvedSrc && !brokenImages[imgKey];

                        return (
                          <div key={item.id} className="sf-item-row">
                            <div className="sf-item-left">
                              <div className="sf-item-thumb">
                                {showImage ? (
                                  <img
                                    src={resolvedSrc}
                                    alt={item.product_name}
                                    onError={() => markImageBroken(imgKey)}
                                  />
                                ) : (
                                  <ShoppingOutlined className="sf-item-thumb-fallback" />
                                )}
                              </div>
                              <div className="sf-item-info">
                                <Text strong className="sf-item-name">
                                  {item.product_name}
                                </Text>
                                <Text type="secondary">
                                  ₹{Number(item.price).toFixed(2)} ×{" "}
                                  {item.quantity}
                                </Text>
                              </div>
                            </div>
                            <Text strong className="sf-item-total">
                              ₹
                              {(
                                Number(item.price) * Number(item.quantity)
                              ).toFixed(2)}
                            </Text>
                          </div>
                        );
                      })}
                  </div>

                  <Divider style={{ margin: "18px 0" }} />

                  {/* FOOTER ACTIONS */}
                  <div className="sf-card-footer">
                    <Text type="secondary">
                      Ordered on {new Date(order.created_at).toLocaleString()}
                    </Text>

                    <Space wrap size="middle">
                      {(order.status === "PENDING" ||
                        order.status === "PROCESSING") && (
                        <Button
                          danger
                          icon={<CloseOutlined />}
                          loading={actionLoading[order.id] === "cancel"}
                          onClick={() => {
                            setSelectedOrderId(order.id);
                            setCancelModalVisible(true);
                          }}
                          block={isMobile}
                        >
                          Cancel Order
                        </Button>
                      )}

                      {order.status === "CANCELLED" && (
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          loading={actionLoading[order.id] === "delete"}
                          onClick={() => {
                            setSelectedOrderId(order.id);
                            setDeleteModalVisible(true);
                          }}
                          block={isMobile}
                        >
                          Delete Order
                        </Button>
                      )}

                      <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/orders/${order.id}`)}
                        block={isMobile}
                      >
                        View Order Details
                      </Button>
                    </Space>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Cancel Confirmation Modal */}
          <Modal
            title="Cancel this order?"
            open={cancelModalVisible}
            onOk={() => {
              setModalLoading(true);
              cancelOrder(selectedOrderId).finally(() => {
                setModalLoading(false);
                setCancelModalVisible(false);
              });
            }}
            onCancel={() => setCancelModalVisible(false)}
            okText="Yes, cancel it" // or just "Cancel"
            cancelText="No, keep it" // or "Cancel" (but that would confuse with the action)
            okButtonProps={{ danger: true }}
            confirmLoading={modalLoading}
          >
            <p>Are you sure you want to cancel order #{selectedOrderId}?</p>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            title="Delete this order?"
            open={deleteModalVisible}
            onOk={() => {
              setModalLoading(true);
              deleteOrder(selectedOrderId).finally(() => {
                setModalLoading(false);
                setDeleteModalVisible(false);
              });
            }}
            onCancel={() => setDeleteModalVisible(false)}
            okText="Delete" // matches the screenshot's "Remove"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            confirmLoading={modalLoading}
          >
            <p>
              Are you sure you want to delete order #{selectedOrderId}? This
              cannot be undone.
            </p>
          </Modal>

          {/* BACK BUTTON */}
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            style={{ paddingLeft: 0, marginTop: 10 }}
            onClick={() => {
              window.location.href = import.meta.env.VITE_PRODUCT_FRONTEND_URL;
            }}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------
// STYLES (unchanged)
// ---------------------------------------------
const ORDERS_CSS = `
  .sf-center-screen {
    min-height: calc(100vh - 68px);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .sf-bg { background: #f5f7fa; }
  .sf-page { padding: 40px 5%; }
  .sf-empty-card {
    width: 450px;
    max-width: 100%;
    text-align: center;
    border-radius: 16px;
    padding: 12px;
  }
  .sf-container { max-width: 1000px; margin: 0 auto; }
  .sf-page-header { margin-bottom: 28px; }
  .sf-order-card {
    margin-bottom: 22px;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    border: 1px solid #eef0f3;
  }
  .sf-summary-strip {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background: #f8f9fb;
    border-bottom: 1px solid #eef0f3;
    padding: 16px 24px;
    gap: 12px;
  }
  .sf-summary-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
    border-left: 1px solid #e5e7eb;
    padding-left: 16px;
  }
  .sf-summary-cell:first-child { border-left: none; padding-left: 0; }
  .sf-summary-status { align-items: flex-start; justify-content: center; }
  .sf-summary-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: #8c8c8c;
  }
  .sf-summary-value { font-size: 15px; font-weight: 600; color: #111827; }
  .sf-status-tag {
    border-radius: 20px;
    padding: 3px 12px;
    font-weight: 600;
    font-size: 12px;
    border-width: 1px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .sf-card-body { padding: 20px 24px 24px; }
  .sf-tracker {
    display: flex;
    align-items: flex-start;
    max-width: 420px;
    margin: 4px auto 0;
  }
  .sf-tracker-step {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .sf-tracker-node-row {
    display: flex;
    align-items: center;
    width: 100%;
  }
  .sf-tracker-node {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid #d1d5db;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    flex-shrink: 0;
    margin: 0 auto;
    background: #fff;
  }
  .sf-tracker-node.done {
    border-color: #16a34a;
    color: #16a34a;
  }
  .sf-dot { width: 6px; height: 6px; border-radius: 50%; background: #d1d5db; }
  .sf-tracker-line {
    flex: 1;
    height: 2px;
    background: #e5e7eb;
    margin-top: 11px;
  }
  .sf-tracker-line.done { background: #16a34a; }
  .sf-tracker-label { font-size: 12px; margin-top: 6px; }
  .sf-cancelled-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fef2f2;
    color: #b91c1c;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 10px 14px;
    font-weight: 500;
    font-size: 13px;
    width: fit-content;
  }
  .sf-items-heading { display: block; margin-bottom: 4px; }
  .sf-items-list { margin-top: 8px; }
  .sf-item-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  .sf-item-row:last-child { border-bottom: none; }
  .sf-item-left {
    display: flex;
    align-items: center;
    gap: 15px;
    flex: 1;
    min-width: 0;
  }
  .sf-item-thumb {
    width: 72px;
    height: 72px;
    border-radius: 10px;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }
  .sf-item-thumb img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .sf-item-thumb-fallback { font-size: 26px; color: #aaa; }
  .sf-item-info { min-width: 0; display: flex; flex-direction: column; gap: 4px; }
  .sf-item-name {
    font-size: 15px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .sf-item-total { font-size: 15px; white-space: nowrap; }
  .sf-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px;
  }
  .sf-view-btn { width: auto; }

  @media (max-width: 640px) {
    .sf-page { padding: 20px 4%; }
    .sf-empty-card { width: 100%; }
    .sf-summary-strip {
      grid-template-columns: 1fr 1fr;
      padding: 14px 16px;
      row-gap: 14px;
    }
    .sf-summary-cell:nth-child(3) { border-left: none; padding-left: 0; }
    .sf-summary-status { grid-column: span 2; align-items: flex-start; }
    .sf-card-body { padding: 16px; }
    .sf-tracker { max-width: 100%; }
    .sf-item-thumb { width: 60px; height: 60px; }
    .sf-item-name { white-space: normal; }
    .sf-card-footer { flex-direction: column; align-items: stretch; }
    .sf-view-btn { width: 100%; justify-content: center; }
  }
  @media (max-width: 400px) {
    .sf-summary-strip { grid-template-columns: 1fr; }
    .sf-summary-cell { border-left: none; padding-left: 0; border-top: 1px solid #e5e7eb; padding-top: 10px; }
    .sf-summary-cell:first-child { border-top: none; padding-top: 0; }
    .sf-summary-status { grid-column: span 1; }
  }
`;

export default Orders;
