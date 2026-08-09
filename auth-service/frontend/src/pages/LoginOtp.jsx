import { useState } from "react";

import { Card, Form, Input, Button, Typography, message } from "antd";

import { SafetyOutlined } from "@ant-design/icons";

import axios from "axios";

import { useLocation, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function LoginOtp() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  // Get user_id passed from Login page

  const userId = location.state?.user_id;

  const handleVerify = async (values) => {
    if (!userId) {
      message.error("Login session not found. Please login again.");

      navigate("/login");

      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/verify-login-otp/",
        {
          user_id: userId,
          otp: values.otp,
        },
      );

      message.success("OTP verified successfully");

      // IMPORTANT:
      // Don't generate JWT here.
      //
      // Move to password page.

      navigate("/login-password", {
        state: {
          session_token: response.data.session_token,
        },
      });
    } catch (error) {
      message.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <Card
        style={{
          width: 400,
        }}
      >
        <Title
          level={2}
          style={{
            textAlign: "center",
          }}
        >
          Verify OTP
        </Title>

        <Text
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: 25,
          }}
        >
          Enter the 6-digit OTP sent to your registered email.
        </Text>

        <Form layout="vertical" onFinish={handleVerify}>
          <Form.Item
            label="OTP"
            name="otp"
            rules={[
              {
                required: true,
                message: "Please enter OTP",
              },
              {
                len: 6,
                message: "OTP must be 6 digits",
              },
            ]}
          >
            <Input
              prefix={<SafetyOutlined />}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              size="large"
              inputMode="numeric"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
          >
            Verify OTP
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default LoginOtp;
