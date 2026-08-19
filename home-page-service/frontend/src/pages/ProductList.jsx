import { useEffect, useState } from "react";

import { Row, Col, Typography, Spin, Empty } from "antd";

import { useSearchParams } from "react-router-dom";

import axios from "axios";

import ProductCard from "../components/ProductCard";

const { Title } = Typography;

function ProductList() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    loadProducts();
  }, [searchParams]);

  const loadProducts = async () => {
    setLoading(true);

    try {
      const search = searchParams.get("search");

      const category = searchParams.get("category");

      let url = `${import.meta.env.VITE_AUTH_API_URL}/api/home/products/`;

      const params = {};

      if (search) {
        params.search = search;
      }

      if (category) {
        params.category = category;
      }

      const response = await axios.get(url, { params });

      setProducts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: 100,
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "40px auto",
        padding: "0 20px",
      }}
    >
      <Title>Products</Title>

      {products.length === 0 ? (
        <Empty description="No products found" />
      ) : (
        <Row gutter={[24, 24]}>
          {products.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default ProductList;
