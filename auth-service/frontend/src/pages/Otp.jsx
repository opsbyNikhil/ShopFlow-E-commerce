import { useState, useEffect, useRef } from "react";

import { Card, Form, Input, Button, Typography, message, Result } from "antd";

import { CheckCircleFilled } from "@ant-design/icons";

import axios from "axios";

import { useLocation, useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const RESEND_COOLDOWN = 30; // seconds

function Otp() {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [form] = Form.useForm();

  const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;

  const location = useLocation();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const email = location.state?.email;

  useEffect(() => {
    // Trigger the entrance animation on next paint rather than at initial
    // render, so the CSS transition actually runs instead of snapping in.
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    // There's nothing useful to verify without an email — send the
    // person back to signup rather than showing a broken form.
    if (!email) {
      navigate("/signup", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const handleVerify = async (values) => {
    setLoading(true);

    try {
      // const response = await axios.post(
      //   `http://127.0.0.1:8000/api/auth/verify-otp/`,
            const response = await axios.post(
              `${AUTH_API_URL}/api/auth/verify-otp/`,
              {
                email: email,
                otp: values.otp,
              },
            );

      message.success(response.data.message);

      // Brief success state gives a clear confirmation before the route
      // change, instead of an abrupt jump to /login.
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 900);
    } catch (error) {
      message.error(error.response?.data?.message || "Invalid OTP");
      form.resetFields(["otp"]);
      setOtpError(true);
      setTimeout(() => setOtpError(false), 400);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    setResending(true);

    try {
      const response = await axios.post(
        `${AUTH_API_URL}/api/auth/resend-otp/`,
        { email },
      );

      //  const response = await axios.post(
      //    "http://127.0.0.1:8000/api/auth/resend-otp/",
      //    { email },
      //  );

      message.success(response.data?.message || "OTP resent");
      form.resetFields(["otp"]);
      setCooldown(RESEND_COOLDOWN);
    } catch (error) {
      message.error(error.response?.data?.message || "Unable to resend OTP");
    } finally {
      setResending(false);
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
        Scoped animation styles, matching the signup/login pages: a short
        opacity + translateY entrance on the card, a small stagger on
        each element, and gentle micro-interactions on focus/hover.
      */}
      <style>{`
        @keyframes otp-card-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes otp-field-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes otp-check-in {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes otp-shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }

        .otp-card {
          opacity: 0;
        }
        .otp-card.mounted {
          animation: otp-card-in 420ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .stagger-item {
          opacity: 0;
        }
        .otp-card.mounted .stagger-item {
          animation: otp-field-in 380ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .otp-card.mounted .stagger-item:nth-child(1) { animation-delay: 100ms; }
        .otp-card.mounted .stagger-item:nth-child(2) { animation-delay: 160ms; }
        .otp-card.mounted .stagger-item:nth-child(3) { animation-delay: 220ms; }
        .otp-card.mounted .stagger-item:nth-child(4) { animation-delay: 280ms; }

        .otp-input .ant-otp-input {
          transition: box-shadow 200ms ease, border-color 200ms ease, transform 150ms ease;
        }
        .otp-input .ant-otp-input:hover {
          transform: translateY(-1px);
        }
        .otp-input.otp-error .ant-otp-input {
          animation: otp-shake 400ms ease;
        }

        .otp-submit {
          transition: transform 150ms ease, box-shadow 200ms ease;
        }
        .otp-submit:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(24, 144, 255, 0.28);
        }
        .otp-submit:not(:disabled):active {
          transform: translateY(0);
        }

        .otp-resend {
          transition: color 150ms ease;
        }

        .otp-success-icon {
          animation: otp-check-in 420ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .otp-card,
          .stagger-item,
          .otp-card.mounted,
          .otp-card.mounted .stagger-item,
          .otp-success-icon,
          .otp-input.otp-error .ant-otp-input {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .otp-input .ant-otp-input:hover,
          .otp-submit:hover {
            transform: none !important;
          }
        }
      `}</style>

      <Card
        bordered={false}
        className={`otp-card${mounted ? " mounted" : ""}`}
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
                className="otp-success-icon"
                style={{ color: "#52c41a" }}
              />
            }
            title="Verified"
            subTitle="Redirecting you to sign in…"
          />
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <Title level={2} style={{ marginBottom: 4 }}>
                Verify your email
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                Enter the 6-digit code sent to <strong>{email}</strong>
              </Paragraph>
            </div>

            <Form form={form} layout="vertical" onFinish={handleVerify}>
              <Form.Item
                className="stagger-item"
                name="otp"
                rules={[
                  { required: true, message: "Enter the 6-digit OTP" },
                  { len: 6, message: "OTP must be 6 digits" },
                ]}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Input.OTP
                  length={6}
                  className={`otp-input${otpError ? " otp-error" : ""}`}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                className="stagger-item"
                style={{ marginBottom: 12, marginTop: 24 }}
              >
                <Button
                  className="otp-submit"
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                >
                  Verify OTP
                </Button>
              </Form.Item>
            </Form>

            <div
              className="stagger-item"
              style={{ textAlign: "center", marginTop: 20 }}
            >
              <Text type="secondary">
                Didn't get a code?{" "}
                {cooldown > 0 ? (
                  <Text type="secondary">Resend in {cooldown}s</Text>
                ) : (
                  <a
                    className="otp-resend"
                    onClick={handleResend}
                    style={{
                      opacity: resending ? 0.5 : 1,
                      pointerEvents: resending ? "none" : "auto",
                    }}
                  >
                    Resend OTP
                  </a>
                )}
              </Text>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default Otp;
