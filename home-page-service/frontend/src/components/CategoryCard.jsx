import { Card, Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Text } = Typography;

function CategoryCard({ category, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      hoverable
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      styles={{ body: { padding: 16 } }}
      style={{
        overflow: "hidden",
        borderRadius: 12,
        border: "1px solid #f0f0f0",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 12px 24px rgba(0, 0, 0, 0.1)"
          : "0 1px 3px rgba(0, 0, 0, 0.04)",
      }}
      cover={
        category.image ? (
          <div style={{ position: "relative", overflow: "hidden" }}>
            <img
              src={category.image}
              alt={category.name}
              style={{
                height: 180,
                width: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.4s ease",
                transform: hovered ? "scale(1.06)" : "scale(1)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 45%)",
              }}
            />
          </div>
        ) : (
          <div
            style={{
              height: 180,
              width: "100%",
              background: "linear-gradient(135deg, #f5f5f5, #e8e8e8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text type="secondary" style={{ fontSize: 13 }}>
              No image available
            </Text>
          </div>
        )
      }
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <Text
            strong
            style={{
              fontSize: 16,
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {category.name}
          </Text>
          {category.description && (
            <Text
              type="secondary"
              style={{
                fontSize: 13,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                marginTop: 4,
              }}
            >
              {category.description}
            </Text>
          )}
        </div>

        <RightOutlined
          style={{
            fontSize: 12,
            color: "#1677ff",
            flexShrink: 0,
            transition: "transform 0.25s ease",
            transform: hovered ? "translateX(3px)" : "translateX(0)",
          }}
        />
      </div>
    </Card>
  );
}

export default CategoryCard;
