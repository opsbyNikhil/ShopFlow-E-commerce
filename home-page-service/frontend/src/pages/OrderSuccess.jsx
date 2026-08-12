import { Result, Button, Card, Typography, Divider, Space } from "antd";

import { CheckCircleOutlined, ShoppingOutlined } from "@ant-design/icons";

import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header";

const { Text, Title } = Typography;

function OrderSuccess() {
  const location = useLocation();

  const navigate = useNavigate();

  const order = location.state?.order;

  if (!order) {
    return (
      <>
        <Header />

        <Result
          status="404"
          title="Order Not Found"
          subTitle="We could not find your order."
          extra={
            <Button type="primary" onClick={() => navigate("/")}>
              Go Home
            </Button>
          }
        />
      </>
    );
  }

  return (
    <>
      <Header />

      <div
        style={{
          padding: "50px 20px",
          background: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Result
          icon={<CheckCircleOutlined />}
          status="success"
          title="Order Placed Successfully!"
          subTitle={`Order ID: ${order.order_id}`}
          extra={[
            <Button
              type="primary"
              icon={<ShoppingOutlined />}
              key="shopping"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </Button>,
          ]}
        />

        <Card
          style={{
            maxWidth: 700,
            margin: "0 auto",
          }}
        >
          <Title level={3}>Order Details</Title>

          <Divider />

          {/* CUSTOMER */}

          <Text strong>Customer</Text>

          <p>
            {order.customer.first_name} {order.customer.last_name}
          </p>

          <p>{order.customer.email}</p>

          <p>{order.customer.mobile}</p>

          <Divider />

          {/* ADDRESS */}

          <Text strong>Delivery Address</Text>

          <p>
            {order.address.address}
            <br />
            {order.address.city}, {order.address.state}
            <br />
            PIN: {order.address.pincode}
          </p>

          <Divider />

          {/* PRODUCTS */}

          <Text strong>Products</Text>

          <div
            style={{
              marginTop: 15,
            }}
          >
            {order.products.map((product) => (
              <div
                key={product.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <Space>
                  <Text>{product.name}</Text>

                  <Text type="secondary">× {product.quantity}</Text>
                </Space>

                <Text strong>₹{product.price * product.quantity}</Text>
              </div>
            ))}
          </div>

          <Divider />

          {/* PAYMENT */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Text>Payment Method</Text>

            <Text strong>
              {order.payment_method === "cod"
                ? "Cash on Delivery"
                : "Online Payment"}
            </Text>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 15,
            }}
          >
            <Title
              level={3}
              style={{
                margin: 0,
              }}
            >
              Total
            </Title>

            <Title
              level={3}
              style={{
                margin: 0,
              }}
            >
              ₹{order.total_amount}
            </Title>
          </div>
        </Card>
      </div>
    </>
  );
}

export default OrderSuccess;
