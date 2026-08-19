import { useEffect, useState } from "react";

import {
  Card,
  Typography,
  Button,
  Row,
  Col,
  Spin,
  message,
  Divider,
  Empty,
  Grid,
  Tag,
} from "antd";

import {
  ShoppingOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import Header from "../components/Header";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

// Temporary user ID
const userId = 1;

// API URLs
const CART_API = `${import.meta.env.VITE_CART_API_URL}/api/cart/${userId}/`;
const ORDER_API = `${import.meta.env.VITE_ORDER_API_URL}/api/orders/create/`;
const ADDRESS_API = `${import.meta.env.VITE_ORDER_API_URL}/api/orders/delivery-address/`;

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState(null);

  // ------------------------------------------------
  // GET CART
  // ------------------------------------------------

  const fetchCart = async () => {
    try {
      const response = await axios.get(CART_API);

      setCart(response.data);
    } catch (error) {
      console.error("Cart Error:", error);

      message.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------
  // GET SELECTED DELIVERY ADDRESS
  // ------------------------------------------------

  const fetchSelectedAddress = async () => {
    const addressId = location.state?.selectedAddressId;

    if (!addressId) {
      return;
    }

    try {
      const response = await axios.get(ADDRESS_API, {
        params: {
          user_id: userId,
        },
      });

      if (response.data.success) {
        const addresses = response.data.addresses || [];

        const address = addresses.find((item) => item.id === Number(addressId));

        if (address) {
          setSelectedAddress(address);
        }
      }
    } catch (error) {
      console.error("Address Error:", error);

      message.error("Failed to load delivery address");
    }
  };

  // ------------------------------------------------
  // INITIAL LOAD
  // ------------------------------------------------

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    fetchSelectedAddress();
  }, [location.state]);

  // ------------------------------------------------
  // LOADING
  // ------------------------------------------------

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

  // ------------------------------------------------
  // EMPTY CART
  // ------------------------------------------------

  if (!cart || !cart.items || cart.items.length === 0) {
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
            padding: 40,
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
            <Empty description="Your cart is empty" />

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

  // ------------------------------------------------
  // CALCULATE TOTAL
  // ------------------------------------------------

  const total = cart.items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0,
  );

  // ------------------------------------------------
  // GO TO DELIVERY ADDRESS
  // ------------------------------------------------

const selectDeliveryAddress = () => {
  const addressId = selectedAddress?.id || "";

  window.location.href = `${import.meta.env.VITE_ORDER_FRONTEND_URL}/delivery-address?addressId=${addressId}`;
};

  // ------------------------------------------------
  // PLACE ORDER
  // ------------------------------------------------

  const placeOrder = async () => {
    // Make sure address is selected
    if (!selectedAddress?.id) {
      message.warning("Please select a delivery address first");

      window.location.href = `${import.meta.env.VITE_ORDER_FRONTEND_URL}/delivery-address`;

      return;
    }

    try {
      setPlacingOrder(true);

      const orderData = {
        user_id: userId,

        delivery_address_id: selectedAddress.id,

        total_amount: total.toFixed(2),

        items: cart.items.map((item) => ({
          product_id: item.product_id,

          product_name: item.product_name,

          product_image: item.product_image || null,

          price: Number(item.price).toFixed(2),

          quantity: Number(item.quantity),
        })),
      };

      console.log("Order Data:", orderData);

      const response = await axios.post(ORDER_API, orderData);

      console.log("Order Response:", response.data);

      message.success("Order placed successfully!");

      // Your backend may return:
      // { success: true, order: {...} }
      //
      // So use response.data.order when available.

     const createdOrder = response.data.order || response.data;

     sessionStorage.setItem(
       "orderSuccessData",
       JSON.stringify({
         order: {
           ...createdOrder,
           delivery_address_id: selectedAddress.id,
         },
         selectedAddress,
         delivery_address_id: selectedAddress.id,
       }),
     );

     window.location.href = `${import.meta.env.VITE_ORDER_FRONTEND_URL}/order-success`;

    } catch (error) {
      console.error("Place order error:", error);

      console.error("Backend response:", error.response?.data);

      message.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  // ------------------------------------------------
  // CHECKOUT UI
  // ------------------------------------------------

  return (
    <>
      <Header />

      <div
        style={{
          minHeight: "calc(100vh - 68px)",
          background: "#f5f7fa",
          padding: isMobile ? "25px 15px" : "40px 5%",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {/* --------------------------------------- */}
          {/* PAGE HEADER */}
          {/* --------------------------------------- */}

          <div
            style={{
              marginBottom: 30,
            }}
          >
            <Title
              level={2}
              style={{
                marginBottom: 4,
              }}
            >
              Checkout
            </Title>

            <Text type="secondary">Review your order before placing it.</Text>
          </div>

          <Row gutter={[30, 30]}>
            {/* ===================================== */}
            {/* LEFT COLUMN */}
            {/* ===================================== */}

            <Col xs={24} lg={16}>
              {/* ----------------------------------- */}
              {/* DELIVERY ADDRESS */}
              {/* ----------------------------------- */}

              <Card
                style={{
                  borderRadius: 14,
                  marginBottom: 25,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 15,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <Title
                      level={4}
                      style={{
                        margin: 0,
                      }}
                    >
                      <EnvironmentOutlined
                        style={{
                          marginRight: 8,
                        }}
                      />
                      Delivery Address
                    </Title>

                    <Text type="secondary">
                      Select the address where you want your order delivered.
                    </Text>
                  </div>

                  <Button type="primary" onClick={selectDeliveryAddress}>
                    {selectedAddress ? "Change Address" : "Select Address"}
                  </Button>
                </div>

                {/* SELECTED ADDRESS */}

                {selectedAddress ? (
                  <div
                    style={{
                      marginTop: 20,
                      padding: 15,
                      background: "#f6f8fa",
                      border: "1px solid #d9d9d9",
                      borderRadius: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 10,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 5,
                          }}
                        >
                          <Text strong>{selectedAddress.full_name}</Text>

                          {selectedAddress.is_default && (
                            <Tag color="green">Default</Tag>
                          )}
                        </div>

                        <Text type="secondary">
                          {selectedAddress.mobile_number}
                        </Text>

                        <div
                          style={{
                            marginTop: 8,
                            lineHeight: 1.7,
                          }}
                        >
                          <Text>{selectedAddress.address_line1}</Text>

                          {selectedAddress.address_line2 && (
                            <>
                              <br />

                              <Text>{selectedAddress.address_line2}</Text>
                            </>
                          )}

                          <br />

                          <Text>
                            {selectedAddress.city}, {selectedAddress.state} -{" "}
                            {selectedAddress.pincode}
                          </Text>

                          {selectedAddress.landmark && (
                            <>
                              <br />

                              <Text type="secondary">
                                Landmark: {selectedAddress.landmark}
                              </Text>
                            </>
                          )}
                        </div>
                      </div>

                      <CheckCircleOutlined
                        style={{
                          color: "#52c41a",
                          fontSize: 22,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      marginTop: 20,
                      padding: 15,
                      background: "#fff7e6",
                      border: "1px solid #ffd591",
                      borderRadius: 10,
                    }}
                  >
                    <Text>
                      Please select a delivery address before placing your
                      order.
                    </Text>
                  </div>
                )}
              </Card>

              {/* ----------------------------------- */}
              {/* ORDER ITEMS */}
              {/* ----------------------------------- */}

              <Card
                title={
                  <>
                    <ShoppingOutlined
                      style={{
                        marginRight: 8,
                      }}
                    />
                    Order Items
                  </>
                }
                style={{
                  borderRadius: 14,
                }}
              >
                {cart.items.map((item) => {
                  const itemTotal = Number(item.price) * Number(item.quantity);

                  return (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "15px 0",
                        borderBottom: "1px solid #f0f0f0",
                        gap: 15,
                      }}
                    >
                      <div>
                        <Text
                          strong
                          style={{
                            fontSize: 16,
                          }}
                        >
                          {item.product_name}
                        </Text>

                        <div>
                          <Text type="secondary">
                            ₹{Number(item.price).toFixed(2)} × {item.quantity}
                          </Text>
                        </div>
                      </div>

                      <Text
                        strong
                        style={{
                          fontSize: 16,
                        }}
                      >
                        ₹{itemTotal.toFixed(2)}
                      </Text>
                    </div>
                  );
                })}
              </Card>
            </Col>

            {/* ===================================== */}
            {/* RIGHT COLUMN */}
            {/* ===================================== */}

            <Col xs={24} lg={8}>
              <Card
                title="Order Summary"
                style={{
                  borderRadius: 14,
                  position: isMobile ? "static" : "sticky",
                  top: 90,
                }}
              >
                {/* ITEMS */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <Text type="secondary">Items ({cart.items.length})</Text>

                  <Text>₹{total.toFixed(2)}</Text>
                </div>

                {/* DELIVERY */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <Text type="secondary">Delivery</Text>

                  <Text
                    style={{
                      color: "#52c41a",
                      fontWeight: 500,
                    }}
                  >
                    FREE
                  </Text>
                </div>

                {/* TAX */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <Text type="secondary">Tax</Text>

                  <Text>Included</Text>
                </div>

                <Divider />

                {/* TOTAL */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 25,
                  }}
                >
                  <Text
                    strong
                    style={{
                      fontSize: 18,
                    }}
                  >
                    Total
                  </Text>

                  <Text
                    strong
                    style={{
                      fontSize: 22,
                      color: "#B12704",
                    }}
                  >
                    ₹{total.toFixed(2)}
                  </Text>
                </div>

                {/* PLACE ORDER */}

                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<ShoppingOutlined />}
                  loading={placingOrder}
                  disabled={!selectedAddress}
                  onClick={placeOrder}
                  style={{
                    height: 48,
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                >
                  Place Order
                </Button>

                <div
                  style={{
                    marginTop: 16,
                    textAlign: "center",
                  }}
                >
                  <Text
                    type="secondary"
                    style={{
                      fontSize: 12,
                    }}
                  >
                    <CheckCircleOutlined /> Secure checkout
                  </Text>
                </div>
              </Card>
            </Col>
          </Row>

          {/* --------------------------------------- */}
          {/* BACK TO CART */}
          {/* --------------------------------------- */}

          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            style={{
              marginTop: 25,
              paddingLeft: 0,
            }}
            onClick={() => {
              window.location.href = import.meta.env.VITE_CART_FRONTEND_URL;
            }}
          >
            Back to Cart
          </Button>
        </div>
      </div>
    </>
  );
}

export default Checkout;
