import { useEffect, useState } from "react";

import {
  Card,
  Typography,
  Button,
  Divider,
  Space,
  Tag,
  Row,
  Col,
  Spin,
  message,
} from "antd";

import {
  CheckCircleFilled,
  ShoppingOutlined,
  EyeOutlined,
  OrderedListOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "../components/Header";

const { Title, Text } = Typography;

// Temporary user ID
const userId = 1;

// --------------------------------------------------
// API URL
// --------------------------------------------------

const ADDRESS_API = `${import.meta.env.VITE_ORDER_API_URL}/api/orders/delivery-address/`;

// --------------------------------------------------
// COMPONENT
// --------------------------------------------------

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  // --------------------------------------------------
  // ORDER DATA
  // --------------------------------------------------

  const order = location.state?.order;

  // IMPORTANT:
  // Get delivery address ID from navigation state first.
  // Fallback to values possibly returned by backend.
  const deliveryAddressId =
    location.state?.deliveryAddressId ||
    order?.delivery_address_id ||
    order?.delivery_address?.id ||
    order?.address_id ||
    null;

  console.log("=================================");
  console.log("OrderSuccess");
  console.log("Order:", order);
  console.log("Delivery Address ID:", deliveryAddressId);
  console.log("User ID:", userId);
  console.log("=================================");

  // --------------------------------------------------
  // STATE
  // --------------------------------------------------

  const [address, setAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [addressVisible, setAddressVisible] = useState(false);

  // --------------------------------------------------
  // ORDER ID
  // --------------------------------------------------

  const orderId = order?.id || order?.order_id || "N/A";

  // --------------------------------------------------
  // TOTAL
  // --------------------------------------------------

  const totalAmount = Number(order?.total_amount || order?.total || 0).toFixed(
    2,
  );

  // --------------------------------------------------
  // STATUS
  // --------------------------------------------------

  const status = order?.status || "PENDING";

  // --------------------------------------------------
  // CREATED DATE
  // --------------------------------------------------

  const createdAt = order?.created_at ? new Date(order.created_at) : new Date();

  // --------------------------------------------------
  // STATUS COLORS
  // --------------------------------------------------

  const statusColors = {
    PENDING: "gold",
    CONFIRMED: "blue",
    PROCESSING: "blue",
    SHIPPED: "cyan",
    DELIVERED: "green",
    CANCELLED: "red",
  };

  // --------------------------------------------------
  // FETCH DELIVERY ADDRESS
  // --------------------------------------------------

  const fetchDeliveryAddress = async () => {
    console.log("View Delivery Address clicked");
    console.log("Delivery Address ID:", deliveryAddressId);

    // ----------------------------------------------
    // Check address ID
    // ----------------------------------------------

    if (!deliveryAddressId) {
      message.warning("Delivery address ID was not found.");

      console.error("Delivery address ID is missing.", {
        order,
        deliveryAddressId,
      });

      return;
    }

    setLoadingAddress(true);
    setAddressVisible(true);

    try {
      console.log("Fetching delivery addresses...");

      // --------------------------------------------
      // IMPORTANT:
      // Backend requires user_id
      // --------------------------------------------

      const response = await axios.get(ADDRESS_API, {
        params: {
          user_id: userId,
        },
      });

      console.log("Delivery Address API Response:", response.data);

      // --------------------------------------------
      // Get addresses from response
      // --------------------------------------------

      let addresses = [];

      if (Array.isArray(response.data)) {
        addresses = response.data;
      } else if (Array.isArray(response.data?.addresses)) {
        addresses = response.data.addresses;
      } else if (Array.isArray(response.data?.data)) {
        addresses = response.data.data;
      } else if (response.data?.address) {
        addresses = [response.data.address];
      }

      console.log("Available Addresses:", addresses);

      // --------------------------------------------
      // Find selected address
      // --------------------------------------------

      const selectedAddress = addresses.find(
        (item) => Number(item.id) === Number(deliveryAddressId),
      );

      console.log("Selected Delivery Address:", selectedAddress);

      if (selectedAddress) {
        setAddress(selectedAddress);

        message.success("Delivery address loaded");
      } else {
        setAddress(null);

        message.warning("Selected delivery address was not found.");
      }
    } catch (error) {
      console.error(
        "Could not fetch delivery address:",
        error.response?.data || error,
      );

      setAddress(null);

      message.error(
        error.response?.data?.message || "Failed to load delivery address",
      );
    } finally {
      setLoadingAddress(false);
    }
  };

  // --------------------------------------------------
  // ORDER NOT FOUND
  // --------------------------------------------------

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
              width: 500,
              maxWidth: "100%",
              textAlign: "center",
              borderRadius: 16,
            }}
          >
            <Title level={3}>Order Not Found</Title>

            <Text type="secondary">
              We couldn't find your order information.
            </Text>

            <br />
            <br />

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
          </Card>
        </div>
      </>
    );
  }

  // --------------------------------------------------
  // ESTIMATED DELIVERY
  // --------------------------------------------------

  const estimatedDelivery = new Date(
    createdAt.getTime() + 5 * 24 * 60 * 60 * 1000,
  ).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <>
      <Header />

      <div
        style={{
          minHeight: "calc(100vh - 68px)",
          background: "#f0f2f5",
          padding: "40px 5%",
        }}
      >
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
          }}
        >
          <Card
            style={{
              borderRadius: 16,
              boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
              overflow: "hidden",
            }}
            styles={{
              body: {
                padding: "30px 24px",
              },
            }}
          >
            {/* =========================================
                SUCCESS HEADER
            ========================================= */}

            <div
              style={{
                textAlign: "center",
                marginBottom: 28,
              }}
            >
              <CheckCircleFilled
                style={{
                  fontSize: 72,
                  color: "#52c41a",
                  marginBottom: 12,
                }}
              />

              <Title
                level={2}
                style={{
                  margin: 0,
                  color: "#1a1a1a",
                }}
              >
                Order Placed Successfully!
              </Title>

              <Text
                type="secondary"
                style={{
                  fontSize: 16,
                  display: "block",
                  marginTop: 4,
                }}
              >
                Thank you for shopping with ShopFlow. We'll notify you when your
                order ships.
              </Text>
            </div>

            <Divider
              style={{
                margin: "12px 0 24px",
              }}
            />

            {/* =========================================
                ORDER DETAILS
            ========================================= */}

            <Row gutter={[16, 16]}>
              {/* ORDER ID */}

              <Col xs={24} sm={12}>
                <div
                  style={{
                    background: "#fafafa",
                    padding: 16,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    type="secondary"
                    style={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      display: "block",
                    }}
                  >
                    Order ID
                  </Text>

                  <Text
                    strong
                    style={{
                      fontSize: 18,
                    }}
                  >
                    #{orderId}
                  </Text>
                </div>
              </Col>

              {/* TOTAL */}

              <Col xs={24} sm={12}>
                <div
                  style={{
                    background: "#fafafa",
                    padding: 16,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    type="secondary"
                    style={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      display: "block",
                    }}
                  >
                    Total Amount
                  </Text>

                  <Text
                    strong
                    style={{
                      fontSize: 20,
                      color: "#B12704",
                    }}
                  >
                    ₹{totalAmount}
                  </Text>
                </div>
              </Col>

              {/* STATUS */}

              <Col xs={24} sm={12}>
                <div
                  style={{
                    background: "#fafafa",
                    padding: 16,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    type="secondary"
                    style={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      display: "block",
                    }}
                  >
                    Order Status
                  </Text>

                  <Tag
                    color={statusColors[status] || "default"}
                    style={{
                      fontSize: 14,
                      padding: "4px 14px",
                      marginTop: 2,
                    }}
                  >
                    {status}
                  </Tag>
                </div>
              </Col>

              {/* ESTIMATED DELIVERY */}

              <Col xs={24} sm={12}>
                <div
                  style={{
                    background: "#fafafa",
                    padding: 16,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    type="secondary"
                    style={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      display: "block",
                    }}
                  >
                    Estimated Delivery
                  </Text>

                  <Text
                    strong
                    style={{
                      fontSize: 16,
                    }}
                  >
                    {estimatedDelivery}
                  </Text>
                </div>
              </Col>
            </Row>

            {/* =========================================
                DELIVERY ADDRESS
            ========================================= */}

            <Divider
              style={{
                margin: "24px 0 16px",
              }}
            />

            <div>
              {/* HEADER */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 15,
                  flexWrap: "wrap",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <EnvironmentOutlined
                    style={{
                      fontSize: 20,
                      color: "#1677ff",
                    }}
                  />

                  <Text
                    strong
                    style={{
                      fontSize: 16,
                    }}
                  >
                    Delivery Address
                  </Text>
                </div>

                {/* VIEW ADDRESS BUTTON */}

                <Button
                  type="primary"
                  icon={<EnvironmentOutlined />}
                  disabled={!deliveryAddressId}
                  onClick={() => {
                    console.log("View Delivery Address clicked");
                    console.log("Delivery Address ID:", deliveryAddressId);

                    if (!deliveryAddressId) {
                      message.warning("Delivery address ID was not found.");
                      return;
                    }

                    navigate("/delivery-address", {
                      state: {
                        selectedAddressId: Number(deliveryAddressId),
                      },
                    });
                  }}
                >
                  View Delivery Address
                </Button>
              </div>

              {/* =====================================
                  ADDRESS CONTENT
              ===================================== */}

              {addressVisible && (
                <>
                  {loadingAddress ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: 25,
                      }}
                    >
                      <Spin />

                      <div
                        style={{
                          marginTop: 10,
                        }}
                      >
                        <Text type="secondary">
                          Loading delivery address...
                        </Text>
                      </div>
                    </div>
                  ) : address ? (
                    <div
                      style={{
                        background: "#f7f9fc",
                        padding: "18px 20px",
                        borderRadius: 12,
                        border: "1px solid #e6eaf0",
                      }}
                    >
                      {/* NAME */}

                      <div
                        style={{
                          marginBottom: 5,
                        }}
                      >
                        <Text
                          strong
                          style={{
                            fontSize: 16,
                          }}
                        >
                          {address.full_name}
                        </Text>

                        {address.is_default && (
                          <Tag
                            color="green"
                            style={{
                              marginLeft: 10,
                            }}
                          >
                            Default
                          </Tag>
                        )}
                      </div>

                      {/* PHONE */}

                      <div
                        style={{
                          marginBottom: 10,
                        }}
                      >
                        <Text type="secondary">
                          Phone: {address.mobile_number}
                        </Text>
                      </div>

                      {/* ADDRESS */}

                      <div
                        style={{
                          lineHeight: 1.8,
                        }}
                      >
                        <Text>{address.address_line1}</Text>

                        {address.address_line2 && (
                          <>
                            <br />

                            <Text>{address.address_line2}</Text>
                          </>
                        )}

                        <br />

                        <Text>
                          {address.city}, {address.state} - {address.pincode}
                        </Text>

                        {address.landmark && (
                          <>
                            <br />

                            <Text type="secondary">
                              Landmark: {address.landmark}
                            </Text>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        background: "#fff7e6",
                        border: "1px solid #ffd591",
                        padding: 15,
                        borderRadius: 10,
                      }}
                    >
                      <Text type="secondary">
                        Delivery address information is not available.
                      </Text>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* =========================================
                ORDER ITEMS
            ========================================= */}

            {order.items && order.items.length > 0 && (
              <>
                <Divider
                  style={{
                    margin: "24px 0 16px",
                  }}
                />

                <Text
                  strong
                  style={{
                    fontSize: 16,
                  }}
                >
                  Order Summary
                </Text>

                <div
                  style={{
                    marginTop: 12,
                  }}
                >
                  {order.items.slice(0, 3).map((item, index) => {
                    const itemTotal =
                      Number(item.price) * Number(item.quantity);

                    return (
                      <div
                        key={item.id || index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "7px 0",
                          gap: 15,
                        }}
                      >
                        <Text>
                          {item.product_name} × {item.quantity}
                        </Text>

                        <Text strong>₹{itemTotal.toFixed(2)}</Text>
                      </div>
                    );
                  })}

                  {order.items.length > 3 && (
                    <Text type="secondary">
                      + {order.items.length - 3} more item(s)
                    </Text>
                  )}
                </div>
              </>
            )}

            {/* =========================================
                ACTION BUTTONS
            ========================================= */}

            <Divider
              style={{
                margin: "24px 0 20px",
              }}
            />

            <Space
              size="middle"
              wrap
              style={{
                justifyContent: "center",
                display: "flex",
              }}
            >
              {/* CONTINUE SHOPPING */}

              <Button
                type="primary"
                size="large"
                icon={<ShoppingOutlined />}
                onClick={() => navigate("/products")}
                style={{
                  minWidth: 150,
                }}
              >
                Continue Shopping
              </Button>

              {/* VIEW ORDER */}

              <Button
                size="large"
                icon={<EyeOutlined />}
                onClick={() => navigate(`/orders/${orderId}`)}
                style={{
                  minWidth: 150,
                }}
              >
                View Order Details
              </Button>

              {/* MY ORDERS */}

              <Button
                size="large"
                icon={<OrderedListOutlined />}
                onClick={() => navigate("/orders")}
                style={{
                  minWidth: 150,
                }}
              >
                My Orders
              </Button>
            </Space>
          </Card>
        </div>
      </div>
    </>
  );
}

export default OrderSuccess;
