import { useEffect, useState } from "react";

import {
  Card,
  Typography,
  Button,
  Empty,
  Row,
  Col,
  message,
  Spin,
  Modal,
} from "antd";

import {
  ShoppingOutlined,
  ArrowLeftOutlined,
  ShoppingCartOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "../components/Header";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";

const { Title, Text } = Typography;

// Temporary user ID
const userId = 1;

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState({});
  const [itemToRemove, setItemToRemove] = useState(null);

  // ---------------------------------------------
  // GET CART
  // ---------------------------------------------

  const fetchCart = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_CART_API_URL}/api/cart/${userId}/`,
      );

      console.log("Cart API Response:", response.data);

      setCart(response.data);
    } catch (error) {
      console.error("Failed to load cart:", error);

      message.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ---------------------------------------------
  // FETCH PRODUCT IMAGES
  // ---------------------------------------------

  useEffect(() => {
    if (!cart?.items?.length) return;

    cart.items.forEach(async (item) => {
      if (images[item.product_id]) return;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_PRODUCT_API_URL}/api/products/${item.product_id}/`,
        );

        setImages((prev) => ({
          ...prev,
          [item.product_id]: res.data.image,
        }));
      } catch (error) {
        console.error(
          `Failed to fetch image for product ${item.product_id}:`,
          error,
        );
      }
    });
  }, [cart]);

  // ---------------------------------------------
  // REMOVE ITEM
  // ---------------------------------------------

  const removeItem = async (itemId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_CART_API_URL}/api/cart/${userId}/item/${itemId}/remove/`,
      );

      message.success("Item removed from cart");

      fetchCart();
    } catch (error) {
      console.error("Remove error:", error);

      message.error("Failed to remove item");
    }
  };

  // ---------------------------------------------
  // OPEN REMOVE CONFIRMATION
  // ---------------------------------------------

  const confirmRemove = (item) => {
    setItemToRemove(item);
  };

  // ---------------------------------------------
  // CONFIRM REMOVE
  // ---------------------------------------------

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      removeItem(itemToRemove.id);
      setItemToRemove(null);
    }
  };

  // ---------------------------------------------
  // UPDATE QUANTITY
  // ---------------------------------------------

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_CART_API_URL}/api/cart/${userId}/item/${itemId}/`,
        {
          quantity: quantity,
        },
      );

      fetchCart();
    } catch (error) {
      console.error("Quantity update error:", error);

      message.error("Failed to update quantity");
    }
  };

  // ---------------------------------------------
  // LOADING
  // ---------------------------------------------

  if (loading) {
    return (
      <>
        {" "}
        <Header />
        ```
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

  // ---------------------------------------------
  // EMPTY CART
  // ---------------------------------------------

  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    return (
      <>
        {" "}
        <Header />
        <div
          style={{
            minHeight: "calc(100vh - 68px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 40,
            background: "#f5f7fa",
          }}
        >
          <Card
            style={{
              width: 460,
              maxWidth: "100%",
              textAlign: "center",
              borderRadius: 20,
              border: "none",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.06)",
            }}
            bodyStyle={{
              padding: "56px 40px 48px",
            }}
          >
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                background: "#EEF2FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 28px",
              }}
            >
              <ShoppingCartOutlined
                style={{
                  fontSize: 40,
                  color: "#4F63D2",
                }}
              />
            </div>

            <Title
              level={3}
              style={{
                marginBottom: 8,
              }}
            >
              Your cart is empty
            </Title>

            <Text
              type="secondary"
              style={{
                fontSize: 15,
                display: "block",
                marginBottom: 32,
              }}
            >
              Looks like you haven't added anything yet. Start exploring and
              find something you'll love.
            </Text>

            <Button
              type="primary"
              size="large"
              icon={<ShoppingOutlined />}
              style={{
                height: 48,
                paddingInline: 32,
                borderRadius: 10,
                fontWeight: 500,
                fontSize: 15,
              }}
              onClick={() => {
                window.location.href = `${import.meta.env.VITE_PRODUCT_FRONTEND_URL}/products`;
              }}
            >
              Continue Shopping
            </Button>
          </Card>
        </div>
      </>
    );
  }

  // ---------------------------------------------
  // CALCULATE TOTAL
  // ---------------------------------------------

  const total = cart.items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0,
  );

  // ---------------------------------------------
  // CART UI
  // ---------------------------------------------

  return (
    <>
      {" "}
      <Header />
      <div
        style={{
          width: "100%",
          minHeight: "calc(100vh - 68px)",
          background: "#f5f7fa",
          padding: "40px 5%",
          boxSizing: "border-box",
        }}
      >
        {/* PAGE HEADER */}

        <div
          style={{
            marginBottom: 30,
          }}
        >
          <Title
            level={2}
            style={{
              marginBottom: 5,
            }}
          >
            Shopping Cart
          </Title>

          <Text type="secondary">
            {cart.items.length} {cart.items.length === 1 ? "item" : "items"} in
            your cart
          </Text>
        </div>

        <Row gutter={[30, 30]}>
          {/* =========================================
          CART ITEMS
      ========================================== */}

          <Col xs={24} lg={16}>
            {cart.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                itemImage={images[item.product_id]}
                updateQuantity={updateQuantity}
                confirmRemove={confirmRemove}
              />
            ))}

            {/* CONTINUE SHOPPING */}

            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              style={{
                paddingLeft: 0,
                fontSize: 15,
              }}
              onClick={() => {
                window.location.href = `${import.meta.env.VITE_PRODUCT_FRONTEND_URL}/products`;
              }}
            >
              Continue Shopping
            </Button>
          </Col>

          {/* =========================================
          ORDER SUMMARY
      ========================================== */}

          <Col xs={24} lg={8}>
            <CartSummary
              itemCount={cart.items.length}
              total={total}
              navigate={navigate}
            />
          </Col>
        </Row>

        {/* =========================================
        REMOVE CONFIRMATION MODAL
    ========================================== */}

        <Modal
          open={!!itemToRemove}
          onCancel={() => setItemToRemove(null)}
          centered
          footer={null}
          closable={false}
          width={420}
        >
          <div
            style={{
              textAlign: "center",
              padding: "12px 4px",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#FFF1F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <ExclamationCircleOutlined
                style={{
                  fontSize: 28,
                  color: "#FF4D4F",
                }}
              />
            </div>

            <Title
              level={4}
              style={{
                marginBottom: 8,
              }}
            >
              Remove item?
            </Title>

            <Text
              type="secondary"
              style={{
                fontSize: 15,
              }}
            >
              Remove "{itemToRemove?.product_name}" from your cart?
            </Text>

            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 28,
              }}
            >
              <Button
                block
                size="large"
                style={{
                  borderRadius: 10,
                }}
                onClick={() => setItemToRemove(null)}
              >
                Cancel
              </Button>

              <Button
                block
                danger
                type="primary"
                size="large"
                style={{
                  borderRadius: 10,
                }}
                onClick={handleConfirmRemove}
              >
                Remove
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default Cart;
