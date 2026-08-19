import { useState, useEffect } from "react";

import { Card, Form, Input, Button, Typography, message, Result } from "antd";

import { LockOutlined, CheckCircleFilled } from "@ant-design/icons";

import axios from "axios";

import { Link, useLocation, useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

function LoginPassword() {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;
  const FRONTEND_API_URL = import.meta.env.VITE_FRONTEND_URL;
  const HOME_URL = import.meta.env.VITE_HOME_URL; 

  const sessionToken = location.state?.session_token;
  const login = location.state?.login;

  useEffect(() => {
    // Trigger the entrance animation on next paint rather than at initial
    // render, so the CSS transition actually runs instead of snapping in.
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    // Nothing to do here without a valid session — send the person back
    // to request a fresh OTP rather than showing a form that will 100%
    // fail on submit.
    if (!sessionToken) {
      message.error("Login session expired. Please log in again.");
      navigate("/login", { replace: true });
    }
  }, [sessionToken, navigate]);

  const handleLogin = async (values) => {
    if (!sessionToken) {
      message.error("Login session expired. Please log in again.");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${AUTH_API_URL}/api/auth/login-password/`,
        {
          session_token: sessionToken,
          password: values.password,
        },
      );
      // const response = await axios.post(
      //   "http://127.0.0.1:8000/api/auth/login-password/",
      //   {
      //     session_token: sessionToken,
      //     password: values.password,
      //   },
      // );

      // Save JWT
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      message.success("Login successful");

      setSuccess(true);

      setTimeout(() => {
        window.location.href = `${HOME_URL}/home`;
      }, 1000);
    } catch (error) {
      message.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f6f8",
        padding: "24px",
      }}
    >
      {/*
        Scoped animation styles, matching the signup/login/otp pages: a
        short opacity + translateY entrance on the card, a small stagger
        on each element, and gentle micro-interactions on focus/hover.
      */}
      <style>{`
        @keyframes pw-card-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pw-field-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pw-check-in {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }

        .pw-card {
          opacity: 0;
        }
        .pw-card.mounted {
          animation: pw-card-in 420ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .stagger-item {
          opacity: 0;
        }
        .pw-card.mounted .stagger-item {
          animation: pw-field-in 380ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .pw-card.mounted .stagger-item:nth-child(1) { animation-delay: 100ms; }
        .pw-card.mounted .stagger-item:nth-child(2) { animation-delay: 160ms; }
        .pw-card.mounted .stagger-item:nth-child(3) { animation-delay: 220ms; }

        .pw-form .ant-input-affix-wrapper {
          transition: box-shadow 200ms ease, border-color 200ms ease, transform 150ms ease;
        }
        .pw-form .ant-input-affix-wrapper:hover {
          transform: translateY(-1px);
        }

        .pw-submit {
          transition: transform 150ms ease, box-shadow 200ms ease;
        }
        .pw-submit:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(24, 144, 255, 0.28);
        }
        .pw-submit:not(:disabled):active {
          transform: translateY(0);
        }

        .pw-link {
          transition: color 150ms ease;
        }

        .pw-success-icon {
          animation: pw-check-in 420ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .pw-card,
          .stagger-item,
          .pw-card.mounted,
          .pw-card.mounted .stagger-item,
          .pw-success-icon {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .pw-form .ant-input-affix-wrapper:hover,
          .pw-submit:hover {
            transform: none !important;
          }
        }
      `}</style>

      <Card
        bordered={false}
        className={`pw-card${mounted ? " mounted" : ""}`}
        style={{
          width: 400,
          maxWidth: "100%",
          borderRadius: 12,
          boxShadow: "0 6px 24px rgba(0, 0, 0, 0.08)",
        }}
        bodyStyle={{ padding: "40px 36px" }}
      >
        {success ? (
          <Result
            icon={
              <CheckCircleFilled
                className="pw-success-icon"
                style={{ color: "#52c41a" }}
              />
            }
            title="Login successful"
            subTitle="Taking you to your account…"
          />
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <Title level={2} style={{ marginBottom: 4 }}>
                Welcome back
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                {login ? (
                  <>
                    Enter your password for <strong>{login}</strong>
                  </>
                ) : (
                  "Enter your password to continue"
                )}
              </Paragraph>
            </div>

            <Form layout="vertical" onFinish={handleLogin} className="pw-form">
              <Form.Item
                className="stagger-item"
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter password"
                  size="large"
                  autoComplete="current-password"
                  autoFocus
                />
              </Form.Item>

              <Form.Item className="stagger-item" style={{ marginBottom: 12 }}>
                <Button
                  className="pw-submit"
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                >
                  Log in
                </Button>
              </Form.Item>

              <div className="stagger-item" style={{ textAlign: "center" }}>
                <Link className="pw-link" to="/forgot-password">
                  Forgot password?
                </Link>
              </div>
            </Form>
          </>
        )}
      </Card>
    </div>
  );
}

export default LoginPassword;
