import { useState, useEffect } from "react";

import { Card, Typography, Button } from "antd";
import { ShopOutlined, LogoutOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

function Home() {
  const [mounted, setMounted] = useState(false);
  const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;

  const navigate = useNavigate();

  useEffect(() => {
    // Trigger the entrance animation on next paint rather than at initial
    // render, so the CSS transition actually runs instead of snapping in.
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    // A stray visit here without a token means the person isn't actually
    // logged in — send them back rather than showing a "logged in" page.
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "#f5f6f8",
      }}
    >
      {/*
        Scoped animation styles, matching the auth flow: a short
        opacity + translateY entrance on the card, a small stagger on
        each element, and a gentle hover lift on the logout button.
      */}
      <style>{`
        @keyframes home-card-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes home-field-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes home-icon-in {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }

        .home-card {
          opacity: 0;
        }
        .home-card.mounted {
          animation: home-card-in 420ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .stagger-item {
          opacity: 0;
        }
        .home-card.mounted .stagger-item {
          animation: home-field-in 380ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .home-card.mounted .stagger-item:nth-child(1) { animation-delay: 80ms; }
        .home-card.mounted .stagger-item:nth-child(2) { animation-delay: 140ms; }
        .home-card.mounted .stagger-item:nth-child(3) { animation-delay: 200ms; }
        .home-card.mounted .stagger-item:nth-child(4) { animation-delay: 260ms; }
        .home-card.mounted .stagger-item:nth-child(5) { animation-delay: 320ms; }

        .home-icon {
          animation: home-icon-in 460ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          animation-delay: 40ms;
          opacity: 0;
        }

        .home-logout {
          transition: transform 150ms ease, box-shadow 200ms ease;
        }
        .home-logout:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(255, 77, 79, 0.24);
        }
        .home-logout:not(:disabled):active {
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .home-card,
          .stagger-item,
          .home-icon,
          .home-card.mounted,
          .home-card.mounted .stagger-item {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .home-logout:hover {
            transform: none !important;
          }
        }
      `}</style>

      <Card
        bordered={false}
        className={`home-card${mounted ? " mounted" : ""}`}
        style={{
          maxWidth: 700,
          margin: "50px auto",
          textAlign: "center",
          borderRadius: 12,
          boxShadow: "0 6px 24px rgba(0, 0, 0, 0.08)",
        }}
        bodyStyle={{ padding: "48px 40px" }}
      >
        <div className="stagger-item">
          <ShopOutlined
            className="home-icon"
            style={{ fontSize: 40, color: "#1677ff", marginBottom: 12 }}
          />
        </div>

        <Title level={1} className="stagger-item" style={{ marginBottom: 4 }}>
          Welcome to ShopFlow
        </Title>

        <Paragraph
          className="stagger-item"
          style={{ fontSize: 16, marginBottom: 24 }}
        >
          Login successful — you're all set.
        </Paragraph>

        <Paragraph
          className="stagger-item"
          type="secondary"
          style={{ marginBottom: 32 }}
        >
          <Text type="secondary">
            This is a temporary home page. It will be replaced by the separate
            Home Page Service.
          </Text>
        </Paragraph>

        <div className="stagger-item">
          <Button
            className="home-logout"
            danger
            icon={<LogoutOutlined />}
            size="large"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Home;
