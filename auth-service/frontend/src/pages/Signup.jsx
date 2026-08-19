import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  message,
  Row,
  Col,
  Checkbox,
  Divider,
  Result,
} from "antd";

import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";

import axios from "axios";

import { useNavigate, Link } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;

function Signup() {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form] = Form.useForm();

  const navigate = useNavigate();

  useEffect(() => {
    // Trigger the entrance animation on next paint rather than at initial
    // render, so the CSS transition actually runs instead of snapping in.
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleSignup = async (values) => {
    setLoading(true);

    try {
      const { confirm_password, agree, ...payload } = values;

      // const response = await axios.post(
      //   "http://127.0.0.1:8000/api/auth/signup/",
      //   payload,
      // );

            const response = await axios.post(
              `${AUTH_API_URL}/api/auth/signup/`,
              payload,
            );


      message.success(response.data.message || "Account created successfully");

      // Brief success state gives the user a clear, calm confirmation
      // before the route change, instead of an abrupt jump to /otp.
      setSuccess(true);
      setTimeout(() => {
        navigate("/otp", {
          state: {
            email: values.email,
          },
        });
      }, 900);
    } catch (error) {
      message.error(
        error.response?.data?.message || "Signup failed. Please try again.",
      );
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
        Scoped animation styles. Kept minimal and physical: a short
        opacity + translateY entrance on the card, a small stagger on
        each field so the form reads top-to-bottom, and gentle
        micro-interactions on focus/hover. Nothing bounces or loops.
      */}
      <style>{`
        @keyframes signup-card-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes signup-field-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes signup-check-in {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }

        .signup-card {
          opacity: 0;
        }
        .signup-card.mounted {
          animation: signup-card-in 420ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .stagger-item {
          opacity: 0;
        }
        .signup-card.mounted .stagger-item {
          animation: signup-field-in 380ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .signup-card.mounted .stagger-item:nth-child(1) { animation-delay: 80ms; }
        .signup-card.mounted .stagger-item:nth-child(2) { animation-delay: 130ms; }
        .signup-card.mounted .stagger-item:nth-child(3) { animation-delay: 180ms; }
        .signup-card.mounted .stagger-item:nth-child(4) { animation-delay: 230ms; }
        .signup-card.mounted .stagger-item:nth-child(5) { animation-delay: 280ms; }
        .signup-card.mounted .stagger-item:nth-child(6) { animation-delay: 330ms; }
        .signup-card.mounted .stagger-item:nth-child(7) { animation-delay: 380ms; }

        /* AntD already animates focus rings; this adds a touch of lift
           so inputs feel responsive without competing with that. */
        .signup-form .ant-input-affix-wrapper,
        .signup-form .ant-input {
          transition: box-shadow 200ms ease, border-color 200ms ease, transform 150ms ease;
        }
        .signup-form .ant-input-affix-wrapper:hover,
        .signup-form .ant-input:hover {
          transform: translateY(-1px);
        }

        .signup-submit {
          transition: transform 150ms ease, box-shadow 200ms ease;
        }
        .signup-submit:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(24, 144, 255, 0.28);
        }
        .signup-submit:not(:disabled):active {
          transform: translateY(0);
        }

        .signup-success-icon {
          animation: signup-check-in 420ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .signup-card,
          .stagger-item,
          .signup-card.mounted,
          .signup-card.mounted .stagger-item,
          .signup-success-icon {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .signup-form .ant-input-affix-wrapper:hover,
          .signup-form .ant-input:hover,
          .signup-submit:hover {
            transform: none !important;
          }
        }
      `}</style>

      <Card
        bordered={false}
        className={`signup-card${mounted ? " mounted" : ""}`}
        style={{
          width: 460,
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
                className="signup-success-icon"
                style={{ color: "#52c41a" }}
              />
            }
            title="Account created"
            subTitle="Redirecting you to verify your email…"
          />
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <Title level={2} style={{ marginBottom: 4 }}>
                Create your account
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                Fill in your details below to get started
              </Paragraph>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSignup}
              requiredMark={false}
              scrollToFirstError
              className="signup-form"
            >
              <Row gutter={12} className="stagger-item">
                <Col span={12}>
                  <Form.Item
                    label="First name"
                    name="first_name"
                    rules={[
                      { required: true, message: "First name is required" },
                      { max: 50, message: "Too long" },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Jane"
                      autoComplete="given-name"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Last name"
                    name="last_name"
                    rules={[
                      { required: true, message: "Last name is required" },
                      { max: 50, message: "Too long" },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Doe"
                      autoComplete="family-name"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                className="stagger-item"
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email address" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="jane.doe@example.com"
                  autoComplete="email"
                />
              </Form.Item>

              <Form.Item
                className="stagger-item"
                label="Mobile number"
                name="mobile"
                rules={[
                  { required: true, message: "Mobile number is required" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit mobile number",
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="9876543210"
                  autoComplete="tel"
                  maxLength={10}
                />
              </Form.Item>

              <Form.Item
                className="stagger-item"
                label="Password"
                name="password"
                hasFeedback
                rules={[
                  { required: true, message: "Password is required" },
                  { min: 8, message: "Minimum 8 characters" },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: "Include uppercase, lowercase, and a number",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
              </Form.Item>

              <Form.Item
                className="stagger-item"
                label="Confirm password"
                name="confirm_password"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
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
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                />
              </Form.Item>

              <Form.Item
                className="stagger-item"
                name="agree"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("You must accept the terms to continue"),
                          ),
                  },
                ]}
              >
                <Checkbox>
                  I agree to the <a href="/terms">Terms of Service</a> and{" "}
                  <a href="/privacy">Privacy Policy</a>
                </Checkbox>
              </Form.Item>

              <Form.Item style={{ marginBottom: 12 }}>
                <Button
                  className="signup-submit"
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                >
                  Send OTP
                </Button>
              </Form.Item>
            </Form>

            <Divider style={{ margin: "16px 0" }} />

            <div style={{ textAlign: "center" }}>
              <Text type="secondary">
                Already have an account? <Link to="/login">Log in</Link>
              </Text>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default Signup;
