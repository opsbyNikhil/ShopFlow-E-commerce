import {
  Card,
  Typography,
  Row,
  Col,
  Form,
  Input,
  Button,
  Radio,
  Divider,
  Space,
  message,
} from "antd";

import {
  EnvironmentOutlined,
  CreditCardOutlined,
  WalletOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import Header from "../components/Header";

import { useShop } from "../context/ShopContext";

const { Title, Text } = Typography;

function Checkout() {
  const navigate = useNavigate();

  const { cart, clearCart } = useShop();

  const [form] = Form.useForm();

  // Calculate total

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const deliveryCharge = subtotal >= 500 ? 0 : 50;

  const total = subtotal + deliveryCharge;

  // =========================
  // PLACE ORDER
  // =========================

  const handlePlaceOrder = (values) => {
    if (cart.length === 0) {
      message.error("Your cart is empty");
      navigate("/");
      return;
    }

    const order = {
      order_id: "SF" + Date.now(),

      customer: {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        mobile: values.mobile,
      },

      address: {
        address: values.address,
        city: values.city,
        state: values.state,
        pincode: values.pincode,
      },

      payment_method: values.payment_method,

      products: cart,

      subtotal: subtotal,

      delivery_charge: deliveryCharge,

      total_amount: total,

      created_at: new Date().toISOString(),
    };

    // Temporary frontend order storage

    localStorage.setItem("shopflow_last_order", JSON.stringify(order));

    // Clear cart

    clearCart();

    // Go to success page

    navigate("/order-success", {
      state: {
        order,
      },
    });
  };

  // =========================
  // EMPTY CART
  // =========================

  if (cart.length === 0) {
    return (
      <>
        <Header />

        <div
          style={{
            textAlign: "center",
            padding: 80,
          }}
        >
          <Title level={2}>Your cart is empty</Title>

          <Button type="primary" onClick={() => navigate("/")}>
            Continue Shopping
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div
        style={{
          padding: "40px 6%",
          background: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Title>Checkout</Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handlePlaceOrder}
          initialValues={{
            payment_method: "cod",
          }}
        >
          <Row gutter={[24, 24]}>
            {/* ========================= */}
            {/* CUSTOMER DETAILS */}
            {/* ========================= */}

            <Col xs={24} lg={16}>
              <Card
                title={
                  <Space>
                    <EnvironmentOutlined />
                    Delivery Details
                  </Space>
                }
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="First Name"
                      name="first_name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter first name",
                        },
                      ]}
                    >
                      <Input placeholder="First Name" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Last Name"
                      name="last_name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter last name",
                        },
                      ]}
                    >
                      <Input placeholder="Last Name" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Please enter email",
                        },
                        {
                          type: "email",
                          message: "Enter a valid email",
                        },
                      ]}
                    >
                      <Input placeholder="Email" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Mobile Number"
                      name="mobile"
                      rules={[
                        {
                          required: true,
                          message: "Please enter mobile number",
                        },
                        {
                          pattern: /^[6-9]\d{9}$/,
                          message: "Enter valid 10 digit mobile number",
                        },
                      ]}
                    >
                      <Input placeholder="Mobile Number" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Address"
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: "Please enter delivery address",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="House No, Street, Area"
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="City"
                      name="city"
                      rules={[
                        {
                          required: true,
                          message: "Enter city",
                        },
                      ]}
                    >
                      <Input placeholder="City" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="State"
                      name="state"
                      rules={[
                        {
                          required: true,
                          message: "Enter state",
                        },
                      ]}
                    >
                      <Input placeholder="State" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Pincode"
                      name="pincode"
                      rules={[
                        {
                          required: true,
                          message: "Enter pincode",
                        },
                        {
                          pattern: /^\d{6}$/,
                          message: "Enter valid 6 digit pincode",
                        },
                      ]}
                    >
                      <Input placeholder="Pincode" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* ========================= */}
              {/* PAYMENT */}
              {/* ========================= */}

              <Card
                title={
                  <Space>
                    <CreditCardOutlined />
                    Payment Method
                  </Space>
                }
                style={{
                  marginTop: 24,
                }}
              >
                <Form.Item
                  name="payment_method"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Radio.Group>
                    <Space direction="vertical" size="large">
                      <Radio value="cod">
                        <Space>
                          <WalletOutlined />

                          <span>Cash on Delivery</span>
                        </Space>
                      </Radio>

                      <Radio value="online">
                        <Space>
                          <CreditCardOutlined />

                          <span>Online Payment</span>
                        </Space>
                      </Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </Card>
            </Col>

            {/* ========================= */}
            {/* ORDER SUMMARY */}
            {/* ========================= */}

            <Col xs={24} lg={8}>
              <Card
                title={
                  <Space>
                    <ShoppingCartOutlined />
                    Order Summary
                  </Space>
                }
              >
                {cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 15,
                    }}
                  >
                    <div>
                      <Text strong>{item.name}</Text>

                      <br />

                      <Text type="secondary">Qty: {item.quantity}</Text>
                    </div>

                    <Text strong>₹{item.price * item.quantity}</Text>
                  </div>
                ))}

                <Divider />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <Text>Subtotal</Text>

                  <Text>₹{subtotal}</Text>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <Text>Delivery</Text>

                  <Text>
                    {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                  </Text>
                </div>

                <Divider />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <Title
                    level={4}
                    style={{
                      margin: 0,
                    }}
                  >
                    Total
                  </Title>

                  <Title
                    level={4}
                    style={{
                      margin: 0,
                    }}
                  >
                    ₹{total}
                  </Title>
                </div>

                <Button type="primary" size="large" htmlType="submit" block>
                  Place Order
                </Button>
              </Card>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
}

export default Checkout;
