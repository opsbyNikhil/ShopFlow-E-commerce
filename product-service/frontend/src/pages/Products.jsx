import { useEffect, useState } from "react";
import { Row, Col, Spin, message } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CART_API = `${import.meta.env.VITE_CART_API_URL}`;
const userId = 1; 

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PRODUCT_API_URL}/api/products/`,
      );
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();

    try {
      setAddingId(product.id);

      await axios.post(`${CART_API}/api/cart/${userId}/add/`, {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        quantity: 1,
      });

      message.success(`${product.name} added to cart`);
      window.location.href = `${import.meta.env.VITE_CART_FRONTEND_URL}/cart`;
    } catch (error) {
      console.error("Failed to add to cart:", error);
      message.error("Failed to add item to cart");
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 140 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ background: "#FDFAF6", minHeight: "100vh" }}>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap');

        .pg-card {
          background: #ffffff;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid #F0E9DF;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
          cursor: pointer;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .pg-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 32px -18px rgba(31, 42, 55, 0.22);
          border-color: #F3D8CC;
        }
        .pg-img-wrap {
          height: 210px;
          background: #F6F1E9;
          overflow: hidden;
        }
        .pg-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }
        .pg-card:hover .pg-img-wrap img {
          transform: scale(1.05);
        }
        .pg-body {
          padding: 18px 20px 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }
        .pg-category {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #C4785E;
        }
        .pg-name {
          font-family: 'Fraunces', serif;
          font-size: 19px;
          font-weight: 600;
          color: #1F2A37;
          margin: 2px 0 0;
          line-height: 1.25;
        }
        .pg-desc {
          font-family: 'Inter', sans-serif;
          font-size: 13.5px;
          color: #7C8798;
          line-height: 1.5;
          margin: 2px 0 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pg-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .pg-price {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          font-weight: 600;
          color: #1F2A37;
        }
        .pg-stock {
          font-family: 'Inter', sans-serif;
          font-size: 11.5px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          white-space: nowrap;
        }
        .pg-stock.in {
          background: #EAF6EF;
          color: #2F9E6E;
        }
        .pg-stock.low {
          background: #FFF3E8;
          color: #C4785E;
        }
        .pg-stock-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }
        .pg-btn-row {
          display: flex;
          gap: 8px;
          margin-top: 14px;
        }
        .pg-btn {
          flex: 1;
          border: none;
          background: #1F2A37;
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 13.5px;
          padding: 11px 0;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .pg-card:hover .pg-btn {
          background: #FF8A65;
        }
        .pg-btn-cart {
          flex: 1;
          border: 1px solid #1F2A37;
          background: #ffffff;
          color: #1F2A37;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 13.5px;
          padding: 11px 0;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .pg-btn-cart:hover {
          background: #1F2A37;
          color: #fff;
        }
        .pg-btn-cart:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .pg-hero-title {
          font-family: 'Fraunces', serif;
          font-size: 38px;
          font-weight: 600;
          color: #1F2A37;
          margin: 0;
        }
        .pg-hero-sub {
          font-family: 'Inter', sans-serif;
          font-size: 14.5px;
          color: #7C8798;
          margin-top: 6px;
        }
          `}
      </style>

      <div
        style={{
          width: "100%",
          maxWidth: "none",
          margin: 0,
          padding: "48px 40px 64px",
        }}
      >
        <div style={{ marginBottom: 36 }}>
          <h1 className="pg-hero-title">Products</h1>
          <p className="pg-hero-sub">
            {products.length} thoughtfully chosen essentials for the road ahead
          </p>
        </div>

        <Row gutter={[24, 24]}>
          {products.map((product) => {
            const lowStock = product.stock > 0 && product.stock <= 5;
            const inStock = product.stock > 0;

            return (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <div
                  className="pg-card"
                  onClick={() =>
                    (window.location.href = `${import.meta.env.VITE_PRODUCT_FRONTEND_URL}/products/${product.id}`)
                  }
                >
                  <div className="pg-img-wrap">
                    {product.image ? (
                      <img
                        src={
                          product.image.startsWith("http")
                            ? product.image
                            : `${import.meta.env.VITE_PRODUCT_API_URL}${product.image}`
                        }
                        alt={product.name}
                        onError={(e) => {
                          console.log("Image failed:", e.target.src);
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#999",
                        }}
                      >
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="pg-body">
                    <span className="pg-category">{product.category}</span>
                    <h3 className="pg-name">{product.name}</h3>
                    <p className="pg-desc">{product.description}</p>

                    <div className="pg-footer">
                      <span className="pg-price">₹{product.price}</span>
                      <span
                        className={`pg-stock ${inStock ? (lowStock ? "low" : "in") : "low"}`}
                      >
                        <span className="pg-stock-dot" />
                        {inStock
                          ? lowStock
                            ? `${product.stock} left`
                            : "In stock"
                          : "Out of stock"}
                      </span>
                    </div>

                    <div className="pg-btn-row">
                      <button
                        className="pg-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `${import.meta.env.VITE_PRODUCT_FRONTEND_URL}/products/${product.id}`;
                        }}
                      >
                        View Product
                      </button>

                      <button
                        className="pg-btn-cart"
                        disabled={!inStock || addingId === product.id}
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        <ShoppingCartOutlined style={{ fontSize: 14 }} />
                        {addingId === product.id ? "Adding..." : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}

export default Products;
