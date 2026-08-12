// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Typography, Row, Col, Layout, Divider, Empty, Tag, Space } from "antd";
// import {
//   SafetyCertificateOutlined,
//   CarOutlined,
//   CustomerServiceOutlined,
// } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";

// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import SearchBar from "../components/SearchBar";
// import CategoryCard from "../components/CategoryCard";
// import ProductCard from "../components/ProductCard";

// const { Title, Text, Paragraph } = Typography;

// // const categories = [
// //   {
// //     id: 1,
// //     name: "Baby Clothing",
// //     description: "Soft, breathable outfits for everyday wear",
// //     image: "https://via.placeholder.com/300x180",
// //   },
// //   {
// //     id: 2,
// //     name: "Baby Toys",
// //     description: "Safe, fun toys for every stage",
// //     image: "https://via.placeholder.com/300x180",
// //   },
// //   {
// //     id: 3,
// //     name: "Baby Feeding",
// //     description: "Bottles, bibs, and mealtime essentials",
// //     image: "https://via.placeholder.com/300x180",
// //   },
// //   {
// //     id: 4,
// //     name: "Baby Care",
// //     description: "Everyday care and wellness products",
// //     image: "https://via.placeholder.com/300x180",
// //   },
// // ];

// // const products = [
// //   {
// //     id: 1,
// //     name: "Baby T-Shirt",
// //     description: "Soft cotton baby T-shirt, perfect for everyday wear",
// //     price: 499,
// //     originalPrice: 699,
// //     rating: 4.5,
// //     reviewCount: 128,
// //     image: "https://via.placeholder.com/300x220",
// //   },
// //   {
// //     id: 2,
// //     name: "Baby Shoes",
// //     description: "Comfortable baby shoes with non-slip soles",
// //     price: 799,
// //     rating: 4.7,
// //     reviewCount: 84,
// //     image: "https://via.placeholder.com/300x220",
// //   },
// //   {
// //     id: 3,
// //     name: "Baby Toy",
// //     description: "Safe and colorful baby toy for early development",
// //     price: 299,
// //     originalPrice: 399,
// //     rating: 4.3,
// //     reviewCount: 56,
// //     image: "https://via.placeholder.com/300x220",
// //   },
// //   {
// //     id: 4,
// //     name: "Baby Feeding Bottle",
// //     description: "BPA-free feeding bottle with anti-colic design",
// //     price: 399,
// //     rating: 4.6,
// //     reviewCount: 201,
// //     image: "https://via.placeholder.com/300x220",
// //   },
// // ];

// const perks = [
//   {
//     icon: <SafetyCertificateOutlined style={{ fontSize: 24 }} />,
//     title: "Safe & Certified",
//     description: "All products meet child safety standards",
//   },
//   {
//     icon: <CarOutlined style={{ fontSize: 24 }} />,
//     title: "Fast Delivery",
//     description: "Free shipping on orders above ₹999",
//   },
//   {
//     icon: <CustomerServiceOutlined style={{ fontSize: 24 }} />,
//     title: "24/7 Support",
//     description: "We're here whenever you need us",
//   },
// ];

// function Home() {
//   const navigate = useNavigate();

//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const handleSearch = (value) => {
//     if (!value) return;
//     navigate(`/products?search=${encodeURIComponent(value)}`);
//   };

//   return (
//     <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
//       <Header />

//       {/* HERO */}
//       <div
//         style={{
//           textAlign: "center",
//           padding: "80px 24px 60px",
//           background: "radial-gradient(circle at top, #eef4ff 0%, #f5f5f5 70%)",
//         }}
//       >
//         <Tag
//           color="blue"
//           style={{
//             marginBottom: 16,
//             padding: "4px 14px",
//             borderRadius: 20,
//             fontSize: 13,
//           }}
//         >
//           New arrivals every week
//         </Tag>

//         <Title style={{ fontSize: 40, marginBottom: 12 }}>
//           Welcome to ShopFlow
//         </Title>

//         <Paragraph type="secondary" style={{ fontSize: 16, marginBottom: 32 }}>
//           Everything you need for your little one, all in one place.
//         </Paragraph>

//         <div style={{ display: "flex", justifyContent: "center" }}>
//           <SearchBar onSearch={handleSearch} />
//         </div>
//       </div>

//       {/* PERKS STRIP */}
//       <div
//         style={{
//           background: "white",
//           borderBottom: "1px solid #f0f0f0",
//           padding: "24px",
//         }}
//       >
//         <Row
//           gutter={[32, 16]}
//           justify="center"
//           style={{ maxWidth: 1200, margin: "0 auto" }}
//         >
//           {perks.map((perk) => (
//             <Col key={perk.title} xs={24} sm={8}>
//               <Space align="center" size={14}>
//                 <div
//                   style={{
//                     width: 44,
//                     height: 44,
//                     borderRadius: 10,
//                     background: "#eef4ff",
//                     color: "#1677ff",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     flexShrink: 0,
//                   }}
//                 >
//                   {perk.icon}
//                 </div>
//                 <div>
//                   <Text strong style={{ display: "block", fontSize: 14 }}>
//                     {perk.title}
//                   </Text>
//                   <Text type="secondary" style={{ fontSize: 13 }}>
//                     {perk.description}
//                   </Text>
//                 </div>
//               </Space>
//             </Col>
//           ))}
//         </Row>
//       </div>

//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
//         {/* CATEGORIES */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "baseline",
//             marginBottom: 24,
//           }}
//         >
//           <Title level={2} style={{ margin: 0 }}>
//             Shop by Category
//           </Title>
//           <Text
//             style={{ color: "#1677ff", cursor: "pointer", fontWeight: 500 }}
//             onClick={() => navigate("/categories")}
//           >
//             View all →
//           </Text>
//         </div>

//         {categories.length === 0 ? (
//           <Empty description="No categories available" />
//         ) : (
//           <Row gutter={[20, 20]} style={{ marginBottom: 64 }}>
//             {categories.map((category) => (
//               <Col xs={24} sm={12} md={6} key={category.id}>
//                 <CategoryCard
//                   category={category}
//                   onClick={() => navigate(`/products?category=${category.id}`)}
//                 />
//               </Col>
//             ))}
//           </Row>
//         )}

//         {/* PRODUCTS */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "baseline",
//             marginBottom: 24,
//           }}
//         >
//           <Title level={2} style={{ margin: 0 }}>
//             Latest Products
//           </Title>
//           <Text
//             style={{ color: "#1677ff", cursor: "pointer", fontWeight: 500 }}
//             onClick={() => {
//               window.location.href = "http://localhost:5174/products";
//             }}
//           >
//             View all →
//           </Text>
//         </div>

//         {products.length === 0 ? (
//           <Empty description="No products available" />
//         ) : (
//           <Row gutter={[24, 24]}>
//             {products.map((product) => (
//               <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
//                 <ProductCard product={product} />
//               </Col>
//             ))}
//           </Row>
//         )}
//       </div>

//       <Footer />
//     </Layout>
//   );
// }

// export default Home;
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
      const response = await axios.get("http://127.0.0.1:8002/api/products/");

      console.log("Products from Product Service:", response.data);

      setProducts(response.data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------
  // SEARCH
  // ------------------------------------------------

  const handleSearch = (value) => {
    if (!value) return;

    window.location.href = `http://localhost:5174/products?search=${encodeURIComponent(value)}`;
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
                    (window.location.href = `http://localhost:5174/products?category=${category.id}`)
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
              window.location.href = "http://localhost:5175/products";
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
            {products.slice(0, 4).map((product) => (
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
                    window.location.href = `http://localhost:5175/products/${product.id}`;
                  }}
                >
                  {product.image && (
                    <img
                      src={
                        product.image.startsWith("http")
                          ? product.image
                          : `http://127.0.0.1:8002${product.image}`
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
                          window.location.href = `http://localhost:5175/products/${product.id}`;
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