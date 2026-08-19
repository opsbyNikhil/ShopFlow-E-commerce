import { useState, useEffect } from "react";

import { Card, Form, Input, Button, Typography, message, Result } from "antd";

import { LockOutlined, CheckCircleFilled } from "@ant-design/icons";

import axios from "axios";

import { Link, useParams, useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form] = Form.useForm();

  const { uid, token } = useParams();
  const navigate = useNavigate();

  const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;

  useEffect(() => {
    // Trigger the entrance animation on next paint rather than at initial
    // render, so the CSS transition actually runs instead of snapping in.
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleReset = async (values) => {
    setLoading(true);

    try {
      // const response = await axios.post(
      //   "http://127.0.0.1:8000/api/auth/reset-password/",
      const response = await axios.post(
        `${AUTH_API_URL}/api/auth/reset-password/`,
        {
          uid: uid,
          token: token,
          old_password: values.old_password,
          new_password: values.new_password,
        },
      );

      message.success(response.data.message);

      // Brief success state gives a clear confirmation before the route
      // change, instead of an abrupt jump to /login.
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      message.error(error.response?.data?.message || "Password reset failed");
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
        @keyframes rp-card-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rp-field-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rp-check-in {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }

        .rp-card {
          opacity: 0;
        }
        .rp-card.mounted {
          animation: rp-card-in 420ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .stagger-item {
          opacity: 0;
        }
        .rp-card.mounted .stagger-item {
          animation: rp-field-in 380ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .rp-card.mounted .stagger-item:nth-child(1) { animation-delay: 100ms; }
        .rp-card.mounted .stagger-item:nth-child(2) { animation-delay: 160ms; }
        .rp-card.mounted .stagger-item:nth-child(3) { animation-delay: 220ms; }
        .rp-card.mounted .stagger-item:nth-child(4) { animation-delay: 280ms; }

        .rp-form .ant-input-affix-wrapper {
          transition: box-shadow 200ms ease, border-color 200ms ease, transform 150ms ease;
        }
        .rp-form .ant-input-affix-wrapper:hover {
          transform: translateY(-1px);
        }

        .rp-submit {
          transition: transform 150ms ease, box-shadow 200ms ease;
        }
        .rp-submit:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(24, 144, 255, 0.28);
        }
        .rp-submit:not(:disabled):active {
          transform: translateY(0);
        }

        .rp-link {
          transition: color 150ms ease;
        }

        .rp-success-icon {
          animation: rp-check-in 420ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .rp-card,
          .stagger-item,
          .rp-card.mounted,
          .rp-card.mounted .stagger-item,
          .rp-success-icon {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .rp-form .ant-input-affix-wrapper:hover,
          .rp-submit:hover {
            transform: none !important;
          }
        }
      `}</style>

      <Card
        bordered={false}
        className={`rp-card${mounted ? " mounted" : ""}`}
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
                className="rp-success-icon"
                style={{ color: "#52c41a" }}
              />
            }
            title="Password reset"
            subTitle="Taking you to sign in…"
          />
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <Title level={2} style={{ marginBottom: 4 }}>
                Reset password
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                Choose a new password for your account
              </Paragraph>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleReset}
              className="rp-form"
            >
              <Form.Item
                className="stagger-item"
                label="Old password"
                name="old_password"
                rules={[
                  { required: true, message: "Please enter your old password" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Old password"
                  size="large"
                  autoComplete="current-password"
                  autoFocus
                />
              </Form.Item>

              <Form.Item
                className="stagger-item"
                label="New password"
                name="new_password"
                hasFeedback
                rules={[
                  { required: true, message: "Please enter a new password" },
                  { min: 8, message: "Minimum 8 characters" },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: "Include uppercase, lowercase, and a number",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("old_password") !== value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "New password must differ from the old password",
                        ),
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="New password"
                  size="large"
                  autoComplete="new-password"
                />
              </Form.Item>

              <Form.Item
                className="stagger-item"
                label="Confirm new password"
                name="confirm_password"
                dependencies={["new_password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("new_password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match"),
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Re-enter new password"
                  size="large"
                  autoComplete="new-password"
                />
              </Form.Item>

              <Form.Item className="stagger-item" style={{ marginBottom: 12 }}>
                <Button
                  className="rp-submit"
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                >
                  Reset password
                </Button>
              </Form.Item>

              <div className="stagger-item" style={{ textAlign: "center" }}>
                <Link className="rp-link" to="/login">
                  Back to sign in
                </Link>
              </div>
            </Form>
          </>
        )}
      </Card>
    </div>
  );
}

export default ResetPassword;
