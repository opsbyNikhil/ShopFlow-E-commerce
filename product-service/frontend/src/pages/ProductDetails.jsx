import { useEffect, useState } from "react";
import { message } from "antd";
import { ArrowLeftOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PRODUCT_API_URL}/api/products/${id}/`,
      );

      console.log("Product Details:", response.data);

      setProduct(response.data);
    } catch (error) {
      console.error("Failed to load product:", error);
      message.error("Product not found");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // IMAGE URL
  // --------------------------------------------------

  const getImageUrl = (image) => {
    if (!image) {
      return null;
    }

    // If backend already returns complete URL
    if (image.startsWith("http")) {
      return image;
    }

    // If backend returns /media/products/...
    return `${import.meta.env.VITE_PRODUCT_API_URL}${image}`;
  };

  const sharedStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap');

    .pd-wrap {
      background: #FDFAF6;
      min-height: 100vh;
      font-family: 'Inter', sans-serif;
    }

    .pd-back {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: none;
      border: none;
      cursor: pointer;
      color: #7C8798;
      font-size: 13.5px;
      font-weight: 500;
      padding: 8px 0;
      transition: color 0.2s ease;
    }

    .pd-back:hover {
      color: #1F2A37;
    }

    .pd-category {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #C4785E;
    }

    .pd-name {
      font-family: 'Fraunces', serif;
      font-size: 34px;
      font-weight: 600;
      color: #1F2A37;
      margin: 8px 0 12px;
      line-height: 1.2;
    }

    .pd-desc {
      font-size: 15px;
      color: #5B6472;
      line-height: 1.7;
      margin-bottom: 24px;
    }

    .pd-price {
      font-family: 'Fraunces', serif;
      font-size: 30px;
      font-weight: 600;
      color: #1F2A37;
    }

    .pd-stock {
      font-size: 12px;
      font-weight: 600;
      padding: 5px 12px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 4px;
    }

    .pd-stock.in {
      background: #EAF6EF;
      color: #2F9E6E;
    }

    .pd-stock.low {
      background: #FFF3E8;
      color: #C4785E;
    }

    .pd-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }

    .pd-cta {
      margin-top: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      border: none;
      background: #1F2A37;
      color: #fff;
      font-weight: 600;
      font-size: 15px;
      padding: 15px 0;
      border-radius: 12px;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .pd-cta:hover {
      background: #FF8A65;
    }

    .pd-cta:disabled {
      background: #D8DCE1;
      cursor: not-allowed;
    }

    .pd-img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: 20px;
      border: 1px solid #F0E9DF;
      display: block;
    }

    .pd-no-image {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 20px;
      border: 1px solid #F0E9DF;
      background: #F6F1E9;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .pd-details-grid {
        grid-template-columns: 1fr !important;
        gap: 30px !important;
      }

      .pd-name {
        font-size: 28px;
      }
    }
  `;

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div
        className="pd-wrap"
        style={{
          textAlign: "center",
          paddingTop: 140,
        }}
      >
        <style>{sharedStyles}</style>

        <p>Loading product...</p>
      </div>
    );
  }

  // --------------------------------------------------
  // PRODUCT NOT FOUND
  // --------------------------------------------------

  if (!product) {
    return (
      <div
        className="pd-wrap"
        style={{
          textAlign: "center",
          paddingTop: 140,
        }}
      >
        <style>{sharedStyles}</style>

        <h2
          style={{
            fontFamily: "Fraunces, serif",
            color: "#1F2A37",
          }}
        >
          Product not found
        </h2>

        <button
          className="pd-back"
          style={{
            margin: "0 auto",
            justifyContent: "center",
          }}
          onClick={() =>
            (window.location.href = import.meta.env.VITE_PRODUCT_FRONTEND_URL)
          }
        >
          <ArrowLeftOutlined />
          Back to Products
        </button>
      </div>
    );
  }

  // --------------------------------------------------
  // STOCK
  // --------------------------------------------------

  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= 5;

  // --------------------------------------------------
  // IMAGE
  // --------------------------------------------------

  const imageUrl = getImageUrl(product.image);

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="pd-wrap">
      <style>{sharedStyles}</style>

      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "36px 40px 64px",
        }}
      >
        {/* BACK BUTTON */}

        <button
          className="pd-back"
          onClick={() => {
            window.location.href = import.meta.env.VITE_PRODUCT_FRONTEND_URL;
          }}
        >
          <ArrowLeftOutlined />
          Back to Products
        </button>

        {/* PRODUCT */}

        <div
          className="pd-details-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 56,
            marginTop: 20,
          }}
        >
          {/* IMAGE */}

          <div>
            {imageUrl ? (
              <img
                className="pd-img"
                src={imageUrl}
                alt={product.name}
                onError={(e) => {
                  console.log("Product image failed:", e.target.src);

                  e.target.style.display = "none";

                  e.target.parentElement.innerHTML = `
                    <div class="pd-no-image">
                      Image unavailable
                    </div>
                  `;
                }}
              />
            ) : (
              <div className="pd-no-image">No Image Available</div>
            )}
          </div>

          {/* PRODUCT INFORMATION */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* CATEGORY */}

            <span className="pd-category">{product.category}</span>

            {/* NAME */}

            <h1 className="pd-name">{product.name}</h1>

            {/* DESCRIPTION */}

            <p className="pd-desc">{product.description}</p>

            {/* PRICE + STOCK */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 20,
                borderTop: "1px solid #F0E9DF",
              }}
            >
              <div>
                <div className="pd-price">₹{product.price}</div>

                <span
                  className={`pd-stock ${
                    lowStock ? "low" : inStock ? "in" : "low"
                  }`}
                >
                  <span className="pd-dot" />

                  {inStock
                    ? lowStock
                      ? `Only ${product.stock} left`
                      : `${product.stock} in stock`
                    : "Out of stock"}
                </span>
              </div>
            </div>

            {/* ADD TO CART */}

            <button
              className="pd-cta"
              disabled={!inStock}
              onClick={async () => {
                try {
                  await axios.post(
                    `${import.meta.env.VITE_CART_API_URL}/api/cart/1/add/`,
                    {
                      product_id: product.id,
                      product_name: product.name,
                      price: product.price,
                      quantity: 1,
                    },
                  );

                  message.success("Product added to cart");

                  setTimeout(() => {
                    window.location.href = `${import.meta.env.VITE_CART_FRONTEND_URL}`;
                  }, 500);
                } catch (error) {
                  console.error("Add to cart error:", error);

                  message.error(
                    error.response?.data?.error ||
                      "Failed to add product to cart",
                  );
                }
              }}
            >
              <ShoppingCartOutlined />

              {inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
