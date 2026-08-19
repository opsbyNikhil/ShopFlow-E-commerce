import { useEffect, useState } from "react";
import { Typography, Row, Col, Layout, Empty, Tag, Space } from "antd";

import {
  SafetyCertificateOutlined,
  CarOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import CategoryCard from "../components/CategoryCard";
// import ProductCard from "../components/ProductCard";

const { Title, Text, Paragraph } = Typography;

// --------------------------------------------------
// CATEGORIES
// --------------------------------------------------

const categories = [
  {
    id: 1,
    name: "Baby Clothing",
    description: "Soft, breathable outfits for everyday wear",
    image: "https://via.placeholder.com/300x180",
  },
  {
    id: 2,
    name: "Baby Toys",
    description: "Safe, fun toys for every stage",
    image: "https://via.placeholder.com/300x180",
  },
  {
    id: 3,
    name: "Baby Feeding",
    description: "Bottles, bibs, and mealtime essentials",
    image: "https://via.placeholder.com/300x180",
  },
  {
    id: 4,
    name: "Baby Care",
    description: "Everyday care and wellness products",
    image: "https://via.placeholder.com/300x180",
  },
];

// --------------------------------------------------
// PERKS
// --------------------------------------------------

const perks = [
  {
    icon: <SafetyCertificateOutlined style={{ fontSize: 24 }} />,
    title: "Safe & Certified",
    description: "All products meet child safety standards",
  },
  {
    icon: <CarOutlined style={{ fontSize: 24 }} />,
    title: "Fast Delivery",
    description: "Free shipping on orders above ₹999",
  },
  {
    icon: <CustomerServiceOutlined style={{ fontSize: 24 }} />,
    title: "24/7 Support",
    description: "We're here whenever you need us",
  },
];

// --------------------------------------------------
// HOME
// --------------------------------------------------

function Home() {
  const navigate = useNavigate();

  // Dynamic products from Product Service
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  // ------------------------------------------------
  // FETCH PRODUCTS
  // ------------------------------------------------

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PRODUCT_API_URL}/api/products`,
      );

      console.log("Products from Product Service:", response.data);

      const data = response.data;

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.results)) {
        setProducts(data.results);
      } else {
        console.error("Unexpected products response:", data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------
  // SEARCH
  // ------------------------------------------------

  const handleSearch = (value) => {
    if (!value) return;

    window.location.href = `${import.meta.env.VITE_PRODUCT_FRONTEND_URL}/products?search=${encodeURIComponent(value)}`;
  };

  // ------------------------------------------------
  // RENDER
  // ------------------------------------------------

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
      }}
    >
      <Header />

      {/* ==================================================
          HERO
      ================================================== */}

      <div
        style={{
          textAlign: "center",
          padding: "80px 24px 60px",
          background: "radial-gradient(circle at top, #eef4ff 0%, #f5f5f5 70%)",
        }}
      >
        <Tag
          color="blue"
          style={{
            marginBottom: 16,
            padding: "4px 14px",
            borderRadius: 20,
            fontSize: 13,
          }}
        >
          New arrivals every week
        </Tag>

        <Title
          style={{
            fontSize: 40,
            marginBottom: 12,
          }}
        >
          Welcome to ShopFlow
        </Title>

        <Paragraph
          type="secondary"
          style={{
            fontSize: 16,
            marginBottom: 32,
          }}
        >
          Everything you need for your little one, all in one place.
        </Paragraph>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* ==================================================
          PERKS
      ================================================== */}

      <div
        style={{
          background: "white",
          borderBottom: "1px solid #f0f0f0",
          padding: "24px",
        }}
      >
        <Row
          gutter={[32, 16]}
          justify="center"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {perks.map((perk) => (
            <Col key={perk.title} xs={24} sm={8}>
              <Space align="center" size={14}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: "#eef4ff",
                    color: "#1677ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {perk.icon}
                </div>

                <div>
                  <Text
                    strong
                    style={{
                      display: "block",
                      fontSize: 14,
                    }}
                  >
                    {perk.title}
                  </Text>

                  <Text
                    type="secondary"
                    style={{
                      fontSize: 13,
                    }}
                  >
                    {perk.description}
                  </Text>
                </div>
              </Space>
            </Col>
          ))}
        </Row>
      </div>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "60px 24px",
          width: "100%",
        }}
      >
        {/* ==================================================
            CATEGORIES
        ================================================== */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 24,
          }}
        >
          <Title
            level={2}
            style={{
              margin: 0,
            }}
          >
            Shop by Category
          </Title>

          <Text
            style={{
              color: "#1677ff",
              cursor: "pointer",
              fontWeight: 500,
            }}
            onClick={() => navigate("/categories")}
          >
            View all →
          </Text>
        </div>

        {categories.length === 0 ? (
          <Empty description="No categories available" />
        ) : (
          <Row
            gutter={[20, 20]}
            style={{
              marginBottom: 64,
            }}
          >
            {categories.map((category) => (
              <Col xs={24} sm={12} md={6} key={category.id}>
                <CategoryCard
                  category={category}
                  onClick={() =>
                    (window.location.href = `${import.meta.env.VITE_PRODUCT_FRONTEND_URL}/products?category=${category.id}`)
                  }
                />
              </Col>
            ))}
          </Row>
        )}

        {/* ==================================================
            LATEST PRODUCTS
        ================================================== */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 24,
          }}
        >
          <Title
            level={2}
            style={{
              margin: 0,
            }}
          >
            Latest Products
          </Title>

          <Text
            style={{
              color: "#1677ff",
              cursor: "pointer",
              fontWeight: 500,
            }}
            onClick={() => {
              window.location.href = `${import.meta.env.VITE_PRODUCT_FRONTEND_URL}/products`;
            }}
          >
            View all →
          </Text>
        </div>

        {/* LOADING */}

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "50px",
            }}
          >
            <Text type="secondary">Loading products...</Text>
          </div>
        ) : products.length === 0 ? (
          /* NO PRODUCTS */
          <Empty description="No products available" />
        ) : (
          /* PRODUCTS */
          <Row gutter={[24, 24]}>
            {Array.isArray(products) &&
              products.slice(0, 4).map((product) => (
                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 16,
                      overflow: "hidden",
                      border: "1px solid #f0f0f0",
                      cursor: "pointer",
                      height: "100%",
                    }}
                    onClick={() => {
                      window.location.href = `${import.meta.env.VITE_PRODUCT_FRONTEND_URL}/products/${product.id}`;
                    }}
                  >
                    {product.image && (
                      <img
                        src={
                          product.image.startsWith("http")
                            ? product.image
                            : `${import.meta.env.VITE_PRODUCT_API_URL}${product.image}`
                        }
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: 220,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    )}

                    <div style={{ padding: 18 }}>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          textTransform: "uppercase",
                        }}
                      >
                        {product.category}
                      </Text>

                      <Title
                        level={4}
                        style={{
                          marginTop: 6,
                          marginBottom: 8,
                        }}
                      >
                        {product.name}
                      </Title>

                      <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                        {product.description}
                      </Paragraph>

                      <Text strong style={{ fontSize: 20 }}>
                        ₹{product.price}
                      </Text>

                      <div style={{ marginTop: 14 }}>
                        <button
                          style={{
                            width: "100%",
                            padding: "10px",
                            border: "none",
                            borderRadius: 8,
                            background: "#1F2A37",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `${import.meta.env.VITE_PRODUCT_FRONTEND_URL}/products/${product.id}`;
                          }}
                        >
                          View Product
                        </button>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
          </Row>
        )}
      </div>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <Footer />
    </Layout>
  );
}

export default Home;