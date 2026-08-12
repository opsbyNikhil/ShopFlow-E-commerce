import {
  Layout,
  Row,
  Col,
  Typography,
  Space,
  Input,
  Button,
  Divider,
} from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  SendOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const linkStyle = {
  color: "rgba(255, 255, 255, 0.65)",
  display: "block",
  marginBottom: 12,
  fontSize: 14,
  transition: "color 0.2s ease",
  cursor: "pointer",
};

const socialIconStyle = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.08)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontSize: 15,
  transition: "all 0.2s ease",
  cursor: "pointer",
};

function FooterLink({ children, onClick }) {
  return (
    <Text
      style={linkStyle}
      onClick={onClick}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
      onMouseLeave={(e) =>
        (e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)")
      }
    >
      {children}
    </Text>
  );
}

function SocialIcon({ icon }) {
  return (
    <div
      style={socialIconStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#1677ff";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {icon}
    </div>
  );
}

function Footer() {
  const navigate = useNavigate();

  return (
    <AntFooter
      style={{
        background: "#001529",
        padding: "64px 40px 24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Row gutter={[48, 40]}>
          {/* BRAND + NEWSLETTER */}
          <Col xs={24} md={8}>
            <Space align="center" size={10} style={{ marginBottom: 16 }}>
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
              <Text style={{ color: "white", fontSize: 20, fontWeight: 700 }}>
                ShopFlow
              </Text>
            </Space>

            <Text
              style={{
                color: "rgba(255, 255, 255, 0.55)",
                fontSize: 14,
                display: "block",
                marginBottom: 20,
                lineHeight: 1.6,
              }}
            >
              Curated products, honest prices, and a shopping experience built
              around you.
            </Text>

            <Text
              style={{
                color: "white",
                fontSize: 13,
                fontWeight: 600,
                display: "block",
                marginBottom: 10,
                letterSpacing: "0.02em",
              }}
            >
              SUBSCRIBE TO OUR NEWSLETTER
            </Text>
            <Space.Compact style={{ width: "100%", maxWidth: 320 }}>
              <Input
                placeholder="Enter your email"
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  color: "white",
                }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                style={{ borderRadius: "0 6px 6px 0" }}
              />
            </Space.Compact>
          </Col>

          {/* SHOP LINKS */}
          <Col xs={12} md={5}>
            <Title
              level={5}
              style={{ color: "white", marginBottom: 18, fontSize: 14 }}
            >
              SHOP
            </Title>
            <FooterLink onClick={() => navigate("/products")}>
              All Products
            </FooterLink>
            <FooterLink onClick={() => navigate("/categories")}>
              Categories
            </FooterLink>
            <FooterLink onClick={() => navigate("/deals")}>
              Deals & Offers
            </FooterLink>
            <FooterLink onClick={() => navigate("/new-arrivals")}>
              New Arrivals
            </FooterLink>
          </Col>

          {/* SUPPORT LINKS */}
          <Col xs={12} md={5}>
            <Title
              level={5}
              style={{ color: "white", marginBottom: 18, fontSize: 14 }}
            >
              SUPPORT
            </Title>
            <FooterLink onClick={() => navigate("/contact")}>
              Contact Us
            </FooterLink>
            <FooterLink onClick={() => navigate("/shipping")}>
              Shipping Info
            </FooterLink>
            <FooterLink onClick={() => navigate("/returns")}>
              Returns & Refunds
            </FooterLink>
            <FooterLink onClick={() => navigate("/faq")}>FAQs</FooterLink>
          </Col>

          {/* CONTACT */}
          <Col xs={24} md={6}>
            <Title
              level={5}
              style={{ color: "white", marginBottom: 18, fontSize: 14 }}
            >
              GET IN TOUCH
            </Title>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <Space align="start" size={10}>
                <EnvironmentOutlined
                  style={{ color: "#1677ff", marginTop: 3 }}
                />
                <Text
                  style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: 14 }}
                >
                  221B Baker Street, London, UK
                </Text>
              </Space>
              <Space align="start" size={10}>
                <PhoneOutlined style={{ color: "#1677ff", marginTop: 3 }} />
                <Text
                  style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: 14 }}
                >
                  +1 (555) 123-4567
                </Text>
              </Space>
              <Space align="start" size={10}>
                <MailOutlined style={{ color: "#1677ff", marginTop: 3 }} />
                <Text
                  style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: 14 }}
                >
                  support@shopflow.com
                </Text>
              </Space>
            </Space>
          </Col>
        </Row>

        <Divider
          style={{
            borderColor: "rgba(255, 255, 255, 0.1)",
            margin: "40px 0 20px",
          }}
        />

        {/* BOTTOM BAR */}
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Text style={{ color: "rgba(255, 255, 255, 0.45)", fontSize: 13 }}>
              © {new Date().getFullYear()} ShopFlow. All rights reserved.
            </Text>
          </Col>

          <Col>
            <Space size={12}>
              <SocialIcon icon={<FacebookOutlined />} />
              <SocialIcon icon={<TwitterOutlined />} />
              <SocialIcon icon={<InstagramOutlined />} />
              <SocialIcon icon={<LinkedinOutlined />} />
            </Space>
          </Col>

          <Col>
            <Space size={20}>
              <Link
                onClick={() => navigate("/privacy")}
                style={{ color: "rgba(255, 255, 255, 0.45)", fontSize: 13 }}
              >
                Privacy Policy
              </Link>
              <Link
                onClick={() => navigate("/terms")}
                style={{ color: "rgba(255, 255, 255, 0.45)", fontSize: 13 }}
              >
                Terms of Service
              </Link>
            </Space>
          </Col>
        </Row>
      </div>
    </AntFooter>
  );
}

export default Footer;
