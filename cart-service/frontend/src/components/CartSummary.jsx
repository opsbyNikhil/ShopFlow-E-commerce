import { Card, Typography, Button, Divider } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";

const { Text } = Typography;

function CartSummary({ itemCount, total, navigate }) {
  return (
    <Card
      title={
        <span
          style={{
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          Order Summary{" "}
        </span>
      }
      style={{
        borderRadius: 14,
        position: "sticky",
        top: 90,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
      }}
      bodyStyle={{
        padding: 24,
      }}
    >
      {/* ITEMS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 15,
        }}
      >
        <Text type="secondary">Items</Text>

        <Text>{itemCount}</Text>
      </div>
      {/* SUBTOTAL */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 15,
        }}
      >
        <Text type="secondary">Subtotal</Text>

        <Text>₹{total.toFixed(2)}</Text>
      </div>
      {/* DELIVERY */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 15,
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
            fontSize: 20,
          }}
        >
          ₹{total.toFixed(2)}
        </Text>
      </div>
      {/* CHECKOUT */}
      <Button
        type="primary"
        size="large"
        block
        icon={<ShoppingOutlined />}
        style={{
          height: 48,
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 500,
        }}
        onClick={() => {
          window.location.href = "http://localhost:5177/checkout";
        }}
      >
        Proceed to Checkout
      </Button>
    </Card>
  );
}

export default CartSummary;
