import { useState, useEffect } from "react";

import { Card, Form, Input, Button, Typography, message, Result } from "antd";

import { UserOutlined, CheckCircleFilled } from "@ant-design/icons";

import axios from "axios";

import { Link, useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

function Login() {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [success, setSuccess] = useState(false);
  const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;



  const navigate = useNavigate();

  useEffect(() => {
    // Trigger the entrance animation on next paint rather than at initial
    // render, so the CSS transition actually runs instead of snapping in.
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleRequestOTP = async (values) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${AUTH_API_URL}/api/auth/request-login-otp/`,
        {
          login: values.login,
        },
      );

      message.success(response.data.message);

      // Brief success state gives a clear confirmation before the route
      // change, instead of an abrupt jump to /login-otp.
      setSuccess(true);
      setTimeout(() => {
        navigate("/login-otp", {
          state: {
            user_id: response.data.user_id,
            login: values.login,
          },
        });
      }, 900);
    } catch (error) {
      message.error(error.response?.data?.message || "Unable to send OTP");
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
        Scoped animation styles, matching the signup page: a short
        opacity + translateY entrance on the card, a small stagger on
        each field, and gentle micro-interactions on focus/hover.
      */}
      <style>{`
        @keyframes login-card-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes login-field-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes login-check-in {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }

        .login-card {
          opacity: 0;
        }
        .login-card.mounted {
          animation: login-card-in 420ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .stagger-item {
          opacity: 0;
        }
        .login-card.mounted .stagger-item {
          animation: login-field-in 380ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .login-card.mounted .stagger-item:nth-child(1) { animation-delay: 100ms; }
        .login-card.mounted .stagger-item:nth-child(2) { animation-delay: 160ms; }
        .login-card.mounted .stagger-item:nth-child(3) { animation-delay: 220ms; }
        .login-card.mounted .stagger-item:nth-child(4) { animation-delay: 280ms; }

        .login-form .ant-input-affix-wrapper,
        .login-form .ant-input {
          transition: box-shadow 200ms ease, border-color 200ms ease, transform 150ms ease;
        }
        .login-form .ant-input-affix-wrapper:hover,
        .login-form .ant-input:hover {
          transform: translateY(-1px);
        }

        .login-submit {
          transition: transform 150ms ease, box-shadow 200ms ease;
        }
        .login-submit:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(24, 144, 255, 0.28);
        }
        .login-submit:not(:disabled):active {
          transform: translateY(0);
        }

        .login-link {
          transition: color 150ms ease;
        }

        .login-success-icon {
          animation: login-check-in 420ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .login-card,
          .stagger-item,
          .login-card.mounted,
          .login-card.mounted .stagger-item,
          .login-success-icon {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .login-form .ant-input-affix-wrapper:hover,
          .login-form .ant-input:hover,
          .login-submit:hover {
            transform: none !important;
          }
        }
      `}</style>

      <Card
        bordered={false}
        className={`login-card${mounted ? " mounted" : ""}`}
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
                className="login-success-icon"
                style={{ color: "#52c41a" }}
              />
            }
            title="OTP sent"
            subTitle="Redirecting you to verify your OTP…"
          />
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <Title level={2} style={{ marginBottom: 4 }}>
                Sign in
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                Enter your email or mobile number to continue
              </Paragraph>
            </div>

            <Form
              layout="vertical"
              onFinish={handleRequestOTP}
              className="login-form"
            >
              <Form.Item
                className="stagger-item"
                label="Email or mobile number"
                name="login"
                rules={[
                  {
                    required: true,
                    message: "Please enter your email or mobile number",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="jane.doe@example.com"
                  autoComplete="username"
                />
              </Form.Item>

              <Form.Item className="stagger-item" style={{ marginBottom: 12 }}>
                <Button
                  className="login-submit"
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                >
                  Request OTP
                </Button>
              </Form.Item>

              <div className="stagger-item" style={{ textAlign: "center" }}>
                <Link className="login-link" to="/forgot-password">
                  Forgot password?
                </Link>
              </div>
            </Form>

            <div
              className="stagger-item"
              style={{ textAlign: "center", marginTop: 20 }}
            >
              <Text type="secondary">
                Don't have an account?{" "}
                <Link className="login-link" to="/signup">
                  Create account
                </Link>
              </Text>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default Login;
