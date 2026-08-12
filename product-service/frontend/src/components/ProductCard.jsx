import { Card, Button } from "antd";

function ProductCard({ product, onView }) {
  return (
    <Card
      hoverable
      style={{
        width: 280,
      }}
      cover={
        product.image ? (
          <img
            alt={product.name}
            src={product.image}
            style={{
              height: 200,
              objectFit: "cover",
            }}
          />
        ) : null
      }
    >
      <h3>{product.name}</h3>

      <p>{product.description}</p>

      <h3>₹{product.price}</h3>

      <p>Category: {product.category}</p>

      <p>Stock: {product.stock}</p>

      <Button type="primary" block onClick={() => onView(product.id)}>
        View Product
      </Button>
    </Card>
  );
}

export default ProductCard;
