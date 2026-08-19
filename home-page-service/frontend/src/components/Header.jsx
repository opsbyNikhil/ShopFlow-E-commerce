import { Layout, Typography, Space, Badge, Button, message } from "antd";

import {
  UserOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const navButtonStyle = {
  color: "rgba(255, 255, 255, 0.85)",
  display: "flex",
  alignItems: "center",
  gap: 6,
  height: 40,
  paddingInline: 14,
  borderRadius: 8,
  fontWeight: 500,
  transition: "all 0.2s ease",
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
  const { cartCount, wishlistCount } = useShop();

  return (
    <AntHeader
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        height: 68,
        background: "#001529",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
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
          window.location.href = import.meta.env.VITE_HOME_FRONTEND_URL;
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

        <Text
          style={{
            color: "white",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          ShopFlow
        </Text>
      </Space>

      {/* RIGHT SIDE */}
      <Space size={4} align="center">
        {/* PRODUCTS */}
        <Button
          type="text"
          icon={<ShoppingOutlined style={{ fontSize: 16 }} />}
          style={navButtonStyle}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
          onClick={() => {
            window.location.href = `${import.meta.env.VITE_PRODUCT_FRONTEND_URL}/products`;
          }}
        >
          Products
        </Button>

        {/* PROFILE */}
        <Button
          type="text"
          icon={<UserOutlined style={{ fontSize: 16 }} />}
          style={navButtonStyle}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
          onClick={() => navigate("/profile")}
        >
          Profile
        </Button>

        {/* WISHLIST */}
        <Badge count={wishlistCount} size="small" offset={[-4, 4]}>
          <Button
            type="text"
            icon={<HeartOutlined style={{ fontSize: 16 }} />}
            style={navButtonStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
            onClick={() => navigate("/wishlist")}
          >
            Wishlist
          </Button>
        </Badge>

        {/* CART */}
        <Badge count={cartCount} size="small" offset={[-4, 4]}>
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
              window.location.href = import.meta.env.VITE_CART_FRONTEND_URL;
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
