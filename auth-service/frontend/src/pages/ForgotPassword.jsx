import { useState, useEffect } from "react";

import { Card, Form, Input, Button, Typography, message, Result } from "antd";

import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";

import axios from "axios";

import { Link } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;

  useEffect(() => {
    // Trigger the entrance animation on next paint rather than at initial
    // render, so the CSS transition actually runs instead of snapping in.
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleForgotPassword = async (values) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${AUTH_API_URL}/api/auth/forgot-password/`,
        values,
      );

      message.success(response.data.message);
      setSentEmail(values.email);
      setSent(true);
    } catch (error) {
      message.error(error.response?.data?.message || "Unable to send email");
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
        Scoped animation styles, matching the rest of the auth flow: a
        short opacity + translateY entrance on the card, a small stagger
        on each element, and gentle micro-interactions on focus/hover.
      */}
      <style>{`
        @keyframes fp-card-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fp-field-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fp-mail-in {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }

        .fp-card {
          opacity: 0;
        }
        .fp-card.mounted {
          animation: fp-card-in 420ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .stagger-item {
          opacity: 0;
        }
        .fp-card.mounted .stagger-item {
          animation: fp-field-in 380ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .fp-card.mounted .stagger-item:nth-child(1) { animation-delay: 100ms; }
        .fp-card.mounted .stagger-item:nth-child(2) { animation-delay: 160ms; }
        .fp-card.mounted .stagger-item:nth-child(3) { animation-delay: 220ms; }

        .fp-form .ant-input-affix-wrapper {
          transition: box-shadow 200ms ease, border-color 200ms ease, transform 150ms ease;
        }
        .fp-form .ant-input-affix-wrapper:hover {
          transform: translateY(-1px);
        }

        .fp-submit {
          transition: transform 150ms ease, box-shadow 200ms ease;
        }
        .fp-submit:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(24, 144, 255, 0.28);
        }
        .fp-submit:not(:disabled):active {
          transform: translateY(0);
        }

        .fp-link {
          transition: color 150ms ease;
        }

        .fp-mail-icon {
          animation: fp-mail-in 460ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .fp-card,
          .stagger-item,
          .fp-mail-icon,
          .fp-card.mounted,
          .fp-card.mounted .stagger-item {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .fp-form .ant-input-affix-wrapper:hover,
          .fp-submit:hover {
            transform: none !important;
          }
        }
      `}</style>

      <Card
        bordered={false}
        className={`fp-card${mounted ? " mounted" : ""}`}
        style={{
          width: 400,
          maxWidth: "100%",
          borderRadius: 12,
          boxShadow: "0 6px 24px rgba(0, 0, 0, 0.08)",
        }}
        bodyStyle={{ padding: "40px 36px" }}
      >
        {!sent ? (
          <>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <Title level={2} style={{ marginBottom: 4 }}>
                Forgot password?
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                Enter your registered email and we'll send you a reset link
              </Paragraph>
            </div>

            <Form
              layout="vertical"
              onFinish={handleForgotPassword}
              className="fp-form"
            >
              <Form.Item
                className="stagger-item"
                label="Registered email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Enter a valid email address" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="jane.doe@example.com"
                  size="large"
                  autoComplete="email"
                  autoFocus
                />
              </Form.Item>

              <Form.Item className="stagger-item" style={{ marginBottom: 12 }}>
                <Button
                  className="fp-submit"
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                >
                  Send reset link
                </Button>
              </Form.Item>

              <div className="stagger-item" style={{ textAlign: "center" }}>
                <Link className="fp-link" to="/login">
                  <ArrowLeftOutlined style={{ marginRight: 6 }} />
                  Back to sign in
                </Link>
              </div>
            </Form>
          </>
        ) : (
          <Result
            icon={
              <MailOutlined
                className="fp-mail-icon"
                style={{ color: "#1677ff" }}
              />
            }
            title="Check your email"
            subTitle={
              <>
                We've sent a password reset link to <strong>{sentEmail}</strong>
                . It may take a minute to arrive — don't forget to check spam.
              </>
            }
            extra={
              <Link className="fp-link" to="/login">
                Back to sign in
              </Link>
            }
          />
        )}
      </Card>
    </div>
  );
}

export default ForgotPassword;
