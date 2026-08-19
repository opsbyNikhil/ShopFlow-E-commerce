import { useEffect, useState } from "react";
import { Layout, Typography, Space, Button, Badge, message } from "antd";
import {
  UserOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const CART_API = `${import.meta.env.VITE_CART_API_URL}`;

const userId = 1; // temporary, same pattern used elsewhere

const navButtonStyle = {
  color: "rgba(255, 255, 255, 0.85)",
  display: "flex",
  alignItems: "center",
  gap: 6,
  height: 40,
  paddingInline: 14,
  borderRadius: 8,
  fontWeight: 500,
};

const handleLogout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  message.success("Logged out successfully");
  setTimeout(() => {
    window.location.href = `${import.meta.env.VITE_AUTH_FRONTEND_URL}/login`;
  }, 500);
};

function Header() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  // ---------------------------------------------
  // FETCH CART COUNT
  // ---------------------------------------------

  const fetchCartCount = async () => {
    try {
      const response = await axios.get(`${CART_API}/api/cart/${userId}/`);

      const items = response.data?.items || [];

      // total quantity across all items (change to items.length
      // if you'd rather count distinct products instead)
      const count = items.reduce((sum, item) => sum + item.quantity, 0);

      setCartCount(count);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  useEffect(() => {
    fetchCartCount();

    // refetch instantly when any page on this origin adds/removes an item
    window.addEventListener("cartUpdated", fetchCartCount);

    return () => {
      window.removeEventListener("cartUpdated", fetchCartCount);
    };
  }, []);

  return (
    <AntHeader
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        height: 68,
        background: "#001529",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* LOGO */}
      <Space
        align="center"
        size={10}
        style={{ cursor: "pointer" }}
        onClick={() => {
          window.location.href = `${import.meta.env.VITE_HOME_FRONTEND_URL}`;
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: "linear-gradient(135deg, #1677ff, #69b1ff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            color: "white",
            fontSize: 16,
          }}
        >
          S
        </div>
        <Text style={{ color: "white", fontSize: 22, fontWeight: 700 }}>
          ShopFlow
        </Text>
      </Space>

      {/* RIGHT SIDE */}
      <Space size={4} align="center">
        {/* HOME */}
        <Button
          type="text"
          icon={<HomeOutlined style={{ fontSize: 16 }} />}
          style={navButtonStyle}
          onClick={() => {
            window.location.href = `${import.meta.env.VITE_HOME_FRONTEND_URL}`;
          }}
        >
          Home
        </Button>

        {/* PRODUCTS */}
        <Button
          type="text"
          icon={<ShoppingOutlined style={{ fontSize: 16 }} />}
          style={navButtonStyle}
          onClick={() => navigate("/products")}
        >
          Products
        </Button>

        {/* PROFILE */}
        <Button
          type="text"
          icon={<UserOutlined style={{ fontSize: 16 }} />}
          style={navButtonStyle}
          onClick={() => {
            window.location.href = "http://localhost:5178/profile";
          }}
        >
          Profile
        </Button>

        {/* WISHLIST */}
        <Button
          type="text"
          icon={<HeartOutlined style={{ fontSize: 16 }} />}
          style={navButtonStyle}
          onClick={() => {
            window.location.href = "http://localhost:5179/wishlist";
          }}
        >
          Wishlist
        </Button>

        {/* CART */}
        <Badge count={cartCount} size="small" offset={[-6, 4]}>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined style={{ fontSize: 16 }} />}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 40,
              paddingInline: 16,
              borderRadius: 8,
              fontWeight: 500,
              marginLeft: 8,
            }}
            onClick={() => {
              window.location.href = `${import.meta.env.VITE_CART_FRONTEND_URL}/cart`;
            }}
          >
            Cart
          </Button>
        </Badge>

        {/* LOGOUT */}
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Space>
    </AntHeader>
  );
}

export default Header;
