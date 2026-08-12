import { Card, Typography, Button, Row, Col, Empty, message } from "antd";

import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";

import Header from "../components/Header";

import { useShop } from "../context/ShopContext";

const { Title, Text } = Typography;

function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart } = useShop();

  const handleAddToCart = (product) => {
    addToCart(product);

    message.success(`${product.name} added to cart`);
  };

  return (
    <>
      <Header />

      <div
        style={{
          padding: 40,
        }}
      >
        <Title level={2}>My Wishlist</Title>

        {wishlist.length === 0 ? (
          <Empty description="Your wishlist is empty" />
        ) : (
          <Row gutter={[24, 24]}>
            {wishlist.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      src={
                        product.image || "https://via.placeholder.com/300x220"
                      }
                      alt={product.name}
                      style={{
                        height: 200,
                        objectFit: "cover",
                      }}
                    />
                  }
                >
                  <Title level={4}>{product.name}</Title>

                  <Text strong>₹{product.price}</Text>

                  <div
                    style={{
                      marginTop: 15,
                      display: "flex",
                      gap: 10,
                    }}
                  >
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => handleAddToCart(product)}
                    >
                      Cart
                    </Button>

                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        removeFromWishlist(product.id);

                        message.success("Removed from wishlist");
                      }}
                    />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </>
  );
}

export default Wishlist;
