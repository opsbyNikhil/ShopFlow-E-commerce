import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";

function SearchBar({ onSearch }) {
  const [focused, setFocused] = useState(false);

  return (
    <Input.Search
      placeholder="Search baby products..."
      allowClear
      enterButton={<SearchOutlined style={{ fontSize: 16 }} />}
      size="large"
      onSearch={onSearch}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        maxWidth: 600,
        width: "100%",
      }}
      styles={{
        input: {
          borderRadius: "8px 0 0 8px",
        },
      }}
      className="shopflow-search"
    />
  );
}

export default SearchBar;
