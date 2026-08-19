import { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Button,
  Spin,
  Tag,
  Divider,
  message,
  Space,
  Grid,
  Modal,
  Descriptions,
  Table,
} from "antd";
import {
  ArrowLeftOutlined,
  ShoppingOutlined,
  CarOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  ClockCircleOutlined,
  CloseOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  CalendarOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

// --------------------- STATUS CONFIG (same as Orders) ---------------------
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

// --------------------- TRACKER COMPONENT (reused) ---------------------
function OrderTracker({ status }) {
  const config = getStatusConfig(status);

  if (config.step === -1) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#FEF2F2",
          color: "#B91C1C",
          border: "1px solid #FECACA",
          borderRadius: 8,
          padding: "10px 14px",
          fontWeight: 500,
        }}
      >
        <CloseCircleFilled style={{ fontSize: 16 }} />
        This order was cancelled
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        maxWidth: 420,
        margin: "4px auto 0",
        width: "100%",
      }}
    >
      {TRACK_STEPS.map((label, idx) => {
        const done = idx <= config.step;
        return (
          <div
            key={label}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: `2px solid ${done ? "#16a34a" : "#d1d5db"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: done ? "#16a34a" : "#9ca3af",
                  background: "#fff",
                  flexShrink: 0,
                  margin: "0 auto",
                }}
              >
                {done ? (
                  <CheckCircleFilled />
                ) : (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#d1d5db",
                    }}
                  />
                )}
              </div>
              {idx < TRACK_STEPS.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: idx < config.step ? "#16a34a" : "#e5e7eb",
                    marginTop: 11,
                  }}
                />
              )}
            </div>
            <Text
              style={{
                fontSize: 12,
                marginTop: 6,
                color: done ? "#111827" : "#9CA3AF",
              }}
            >
              {label}
            </Text>
          </div>
        );
      })}
    </div>
  );
}

// --------------------- MAIN ORDER DETAILS ---------------------
function OrderDetails() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  const API_BASE = `${import.meta.env.VITE_ORDER_API_URL}`;

  // Fetch order
  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/orders/${orderId}/`);
      setOrder(response.data);
    } catch (error) {
      console.error("Failed to load order:", error);
      message.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  // Cancel order
  const cancelOrder = async () => {
    setActionLoading(true);
    try {
      await axios.patch(`${API_BASE}/api/orders/${orderId}/`, {
        status: "CANCELLED",
      });
      // Refresh order details
      await fetchOrder();
      message.success(`Order #${orderId} cancelled`);
      setCancelModalVisible(false);
    } catch (error) {
      console.error("Failed to cancel order:", error);
      message.error("Couldn't cancel this order. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <div
          style={{
            minHeight: "calc(100vh - 68px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin size="large" />
        </div>
      </>
    );
  }

  // Order not found
  if (!order) {
    return (
      <>
        <Header />
        <div
          style={{
            minHeight: "calc(100vh - 68px)",
            background: "#f5f7fa",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 30,
          }}
        >
          <Card
            style={{
              width: 450,
              maxWidth: "100%",
              textAlign: "center",
              borderRadius: 16,
            }}
          >
            <Title level={3}>Order Not Found</Title>
            <Button type="primary" onClick={() => navigate("/orders")}>
              Back to Orders
            </Button>
          </Card>
        </div>
      </>
    );
  }

  // --------------------- RENDER ---------------------
  const statusConfig = getStatusConfig(order.status);
  const totalAmount = Number(order.total_amount).toFixed(2);

  // Columns for items table
  const columns = [
    {
      title: "Product",
      dataIndex: "product_name",
      key: "product_name",
      render: (text, record) => (
        <Space>
          <div
            style={{
              width: 60,
              height: 60,
              background: "#f5f5f5",
              borderRadius: 8,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {record.product_image ? (
              <img
                src={record.product_image}
                alt={text}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <ShoppingOutlined style={{ fontSize: 24, color: "#aaa" }} />
            )}
          </div>
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary">
              ₹{Number(record.price).toFixed(2)} × {record.quantity}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (price) => `₹${Number(price).toFixed(2)}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Total",
      key: "total",
      align: "right",
      render: (_, record) =>
        `₹${(Number(record.price) * Number(record.quantity)).toFixed(2)}`,
    },
  ];

  return (
    <>
      <Header />
      <div
        style={{
          minHeight: "calc(100vh - 68px)",
          background: "#f5f7fa",
          padding: "40px 5%",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          {/* Back button */}
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            style={{ paddingLeft: 0, marginBottom: 15 }}
            onClick={() => navigate("/orders")}
          >
            Back to Orders
          </Button>

          {/* Order summary header */}
          <Card
            style={{ borderRadius: 14, marginBottom: 20, padding: "0 24px" }}
            bodyStyle={{ padding: "20px 0" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 15,
              }}
            >
              <div>
                <Text
                  type="secondary"
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Order ID
                </Text>
                <Title level={2} style={{ margin: "2px 0 0" }}>
                  #{order.id}
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  <CalendarOutlined />{" "}
                  {new Date(order.created_at).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
              </div>
              <div style={{ textAlign: "right" }}>
                <Text
                  type="secondary"
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Status
                </Text>
                <div style={{ marginTop: 4 }}>
                  <Tag
                    style={{
                      fontSize: 14,
                      padding: "4px 14px",
                      borderRadius: 20,
                    }}
                    color={
                      order.status === "DELIVERED"
                        ? "green"
                        : order.status === "CANCELLED"
                          ? "red"
                          : order.status === "SHIPPED"
                            ? "blue"
                            : "orange"
                    }
                  >
                    {statusConfig.label}
                  </Tag>
                </div>
              </div>
            </div>
          </Card>

          {/* Tracker */}
          <Card
            style={{ borderRadius: 14, marginBottom: 20, textAlign: "center" }}
          >
            <OrderTracker status={order.status} />
          </Card>

          {/* Two columns: Address & Payment */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: 20,
              marginBottom: 20,
            }}
          >
            <Card
              title={
                <>
                  <EnvironmentOutlined /> Delivery Address
                </>
              }
              style={{ borderRadius: 14 }}
            >
              <Paragraph>
                <strong>John Doe</strong>
                <br />
                123, Main Street,
                <br />
                City, State - 123456
                <br />
                Phone: +91 9876543210
              </Paragraph>
              <Text type="secondary">
                (This is a sample address – integrate your actual address field)
              </Text>
            </Card>
            <Card
              title={
                <>
                  <CreditCardOutlined /> Payment Information
                </>
              }
              style={{ borderRadius: 14 }}
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Payment Method">
                  Credit Card (ending ****1234)
                </Descriptions.Item>
                <Descriptions.Item label="Total Paid">
                  ₹{totalAmount}
                </Descriptions.Item>
                <Descriptions.Item label="Payment Status">
                  Completed
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>

          {/* Order Items */}
          <Card
            title={
              <>
                <ShoppingOutlined /> Order Items
              </>
            }
            style={{ borderRadius: 14, marginBottom: 20 }}
            extra={<Text strong>Total: ₹{totalAmount}</Text>}
          >
            <Table
              columns={columns}
              dataSource={order.items}
              rowKey="id"
              pagination={false}
              size="middle"
              scroll={{ x: true }}
            />
          </Card>

          {/* Order Information */}
          <Card
            title={
              <>
                <DollarOutlined /> Order Summary
              </>
            }
            style={{ borderRadius: 14, marginBottom: 20 }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: 16,
              }}
            >
              <div>
                <Text type="secondary">Subtotal</Text>
                <div>
                  <Text strong>₹{totalAmount}</Text>
                </div>
              </div>
              <div>
                <Text type="secondary">Shipping</Text>
                <div>
                  <Text strong>Free</Text>
                </div>
              </div>
              <div>
                <Text type="secondary">Tax</Text>
                <div>
                  <Text strong>Included</Text>
                </div>
              </div>
              <div>
                <Text type="secondary">Total</Text>
                <div>
                  <Text strong style={{ fontSize: 20, color: "#B12704" }}>
                    ₹{totalAmount}
                  </Text>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: 15,
              flexWrap: "wrap",
              marginTop: 10,
            }}
          >
            {(order.status === "PENDING" || order.status === "PROCESSING") && (
              <Button
                danger
                icon={<CloseOutlined />}
                onClick={() => setCancelModalVisible(true)}
                loading={actionLoading}
              >
                Cancel Order
              </Button>
            )}
            <Button
              type="primary"
              icon={<ShoppingOutlined />}
              onClick={() => {
                window.location.href =
                  import.meta.env.VITE_PRODUCT_FRONTEND_URL;
              }}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        title="Cancel this order?"
        open={cancelModalVisible}
        onOk={cancelOrder}
        onCancel={() => setCancelModalVisible(false)}
        okText="Yes, cancel it"
        cancelText="No, keep it"
        okButtonProps={{ danger: true }}
        confirmLoading={actionLoading}
      >
        <p>Are you sure you want to cancel order #{orderId}?</p>
      </Modal>
    </>
  );
}

export default OrderDetails;
