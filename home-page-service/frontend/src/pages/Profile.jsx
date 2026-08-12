import { Card, Typography, Avatar } from "antd";

import { UserOutlined } from "@ant-design/icons";

function Profile() {
  return (
    <div
      style={{
        maxWidth: 600,
        margin: "50px auto",
      }}
    >
      <Card
        style={{
          textAlign: "center",
        }}
      >
        <Avatar size={100} icon={<UserOutlined />} />

        <Typography.Title level={2}>My Profile</Typography.Title>

        <Typography.Paragraph>
          User profile information will come from auth-service.
        </Typography.Paragraph>
      </Card>
    </div>
  );
}

export default Profile;
