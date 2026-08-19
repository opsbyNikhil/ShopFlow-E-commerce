import { Card, Row, Col, Typography, Button, Space } from "antd";
import {
  DeleteOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

function CartItem({
  item,
  itemImage,
  updateQuantity,
  confirmRemove,
}) {
  const itemTotal =
    Number(item.price) * Number(item.quantity);

  return (
    <Card
      style={{
        marginBottom: 20,
        borderRadius: 14,
        border: "1px solid #e8e8e8",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
      }}
      bodyStyle={{
        padding: 20,
      }}
    >
      <Row gutter={[20, 20]} align="middle">

        {/* PRODUCT IMAGE */}
        <Col xs={24} sm={5}>
          {itemImage ? (
            <img
              src={
                itemImage.startsWith("http")
                  ? itemImage
                  : `${import.meta.env.VITE_PRODUCT_API_URL}${itemImage}`
              }
              alt={item.product_name}
              style={{
                width: "100%",
                height: 130,
                objectFit: "cover",
                borderRadius: 12,
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: 130,
                background: "#f0f2f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
                color: "#888",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <ShoppingOutlined
                  style={{
                    fontSize: 30,
                    marginBottom: 5,
                  }}
                />

                <div>No Image</div>
              </div>
            </div>
          )}
        </Col>

        {/* PRODUCT DETAILS */}
        <Col xs={24} sm={7}>
          <Title
            level={4}
            style={{
              margin: 0,
              marginBottom: 8,
            }}
          >
            {item.product_name}
          </Title>

          <Text
            type="secondary"
            style={{
              display: "block",
              marginBottom: 8,
            }}
          >
            Unit Price
          </Text>

          <Text
            strong
            style={{
              fontSize: 17,
            }}
          >
            ₹{Number(item.price).toFixed(2)}
          </Text>
        </Col>

        {/* QUANTITY */}
        <Col xs={24} sm={6}>
          <Text
            type="secondary"
            style={{
              display: "block",
              marginBottom: 8,
            }}
          >
            Quantity
          </Text>

          <Space>
            <Button
              size="middle"
              onClick={() =>
                updateQuantity(
                  item.id,
                  item.quantity - 1
                )
              }
              disabled={item.quantity <= 1}
            >
              −
            </Button>

            <Text
              strong
              style={{
                minWidth: 25,
                textAlign: "center",
                fontSize: 16,
              }}
            >
              {item.quantity}
            </Text>

            <Button
              size="middle"
              onClick={() =>
                updateQuantity(
                  item.id,
                  item.quantity + 1
                )
              }
            >
              +
            </Button>
          </Space>
        </Col>

        {/* SUBTOTAL + DELETE */}
        <Col xs={24} sm={6}>
          <div
            style={{
              textAlign: "right",
            }}
          >
            <Text
              type="secondary"
              style={{
                display: "block",
                marginBottom: 8,
              }}
            >
              Subtotal
            </Text>

            <Text
              strong
              style={{
                fontSize: 17,
                display: "block",
                marginBottom: 10,
              }}
            >
              ₹{itemTotal.toFixed(2)}
            </Text>

            <Button
              danger
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => confirmRemove(item)}
            >
              Remove
            </Button>
          </div>
        </Col>

      </Row>
    </Card>
  );
}

export default CartItem;