import { useEffect, useState } from "react";

import {
  Card,
  Typography,
  Button,
  Row,
  Col,
  Spin,
  message,
  Empty,
  Radio,
  Modal,
  Form,
  Input,
  Tag,
  Divider,
  Checkbox,
} from "antd";

import {
  EnvironmentOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import Header from "../components/Header";

const { Title, Text } = Typography;

// Temporary user ID
const userId = 1;

const ADDRESS_API = `${import.meta.env.VITE_ORDER_API_URL}/api/orders/delivery-address/`;

function DeliveryAddress() {
  const navigate = useNavigate();
  const location = useLocation();

  // ---------------------------------------------
  // STATE
  // ---------------------------------------------

  const [addresses, setAddresses] = useState([]);

  const [selectedAddressId, setSelectedAddressId] = useState(
    location.state?.selectedAddressId || null,
  );

  const [loading, setLoading] = useState(true);
  const [savingAddress, setSavingAddress] = useState(false);

  const [showAddressModal, setShowAddressModal] = useState(false);

  const [form] = Form.useForm();

  const selectedAddress = addresses.find(
    (address) => address.id === selectedAddressId,
  );

  // ---------------------------------------------
  // GET SELECTED ADDRESS
  // ---------------------------------------------
  // selectedAddressId contains only the ID.
  // selectedAddress contains the complete address object.
  // ---------------------------------------------



  // ---------------------------------------------
  // GET ADDRESSES
  // ---------------------------------------------

  const fetchAddresses = async () => {
    try {
      setLoading(true);

      const response = await axios.get(ADDRESS_API, {
        params: {
          user_id: userId,
        },
      });

      if (response.data.success) {
        const addressList = response.data.addresses || [];

        setAddresses(addressList);

        // ---------------------------------------------
        // KEEP PREVIOUSLY SELECTED ADDRESS
        // ---------------------------------------------

        if (
          location.state?.selectedAddressId &&
          addressList.some(
            (address) => address.id === location.state.selectedAddressId,
          )
        ) {
          setSelectedAddressId(location.state.selectedAddressId);
        } else {
          // ---------------------------------------------
          // SELECT DEFAULT ADDRESS
          // ---------------------------------------------

          const defaultAddress = addressList.find(
            (address) => address.is_default,
          );

          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
          } else if (addressList.length > 0) {
            // ---------------------------------------------
            // SELECT FIRST ADDRESS IF NO DEFAULT
            // ---------------------------------------------

            setSelectedAddressId(addressList[0].id);
          }
        }
      }
    } catch (error) {
      console.error("Fetch Address Error:", error);

      message.error("Failed to load delivery addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // ---------------------------------------------
  // ADD ADDRESS
  // ---------------------------------------------

  const handleAddAddress = async (values) => {
    try {
      setSavingAddress(true);

      const addressData = {
        user_id: userId,

        full_name: values.full_name,

        mobile_number: values.mobile_number,

        address_line1: values.address_line1,

        address_line2: values.address_line2 || "",

        city: values.city,

        state: values.state,

        pincode: values.pincode,

        landmark: values.landmark || "",

        is_default: values.is_default || false,
      };

      const response = await axios.post(ADDRESS_API, addressData);

      if (response.data.success) {
        const newAddress = response.data.address;

        message.success("Delivery address added successfully");

        // ---------------------------------------------
        // REFRESH ADDRESS LIST
        // ---------------------------------------------

        await fetchAddresses();

        // ---------------------------------------------
        // SELECT NEW ADDRESS
        // ---------------------------------------------

        if (newAddress?.id) {
          setSelectedAddressId(newAddress.id);
        }

        // ---------------------------------------------
        // CLOSE MODAL
        // ---------------------------------------------

        setShowAddressModal(false);

        // ---------------------------------------------
        // RESET FORM
        // ---------------------------------------------

        form.resetFields();
      }
    } catch (error) {
      console.error("Add Address Error:", error);

      message.error(
        error.response?.data?.message || "Failed to add delivery address",
      );
    } finally {
      setSavingAddress(false);
    }
  };

  // ---------------------------------------------
  // CONTINUE TO CHECKOUT
  // ---------------------------------------------

  const continueToCheckout = () => {
    if (!selectedAddressId) {
      message.warning("Please select a delivery address");

      return;
    }

    navigate("/checkout", {
      state: {
        selectedAddressId: selectedAddressId,
      },
    });
  };

  // ---------------------------------------------
  // LOADING
  // ---------------------------------------------

  if (loading) {
    return (
      <>
        <Header />

        <div
          style={{
            minHeight: "calc(100vh - 68px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin size="large" />
        </div>
      </>
    );
  }

  // ---------------------------------------------
  // UI
  // ---------------------------------------------

  return (
    <>
      <Header />

      <div
        style={{
          minHeight: "calc(100vh - 68px)",
          background: "#f5f7fa",
          padding: "40px 5%",
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {/* PAGE HEADER */}

          <div
            style={{
              marginBottom: 30,
            }}
          >
            <Title
              level={2}
              style={{
                marginBottom: 5,
              }}
            >
              Delivery Address
            </Title>

            <Text type="secondary">
              Select where you want your order to be delivered.
            </Text>
          </div>

          <Row gutter={[25, 25]}>
            {/* ========================================= */}
            {/* LEFT SIDE - ADDRESS LIST */}
            {/* ========================================= */}

            <Col xs={24} lg={16}>
              <Card
                style={{
                  borderRadius: 14,
                }}
              >
                {/* HEADER */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <Title
                    level={4}
                    style={{
                      margin: 0,
                    }}
                  >
                    <EnvironmentOutlined
                      style={{
                        marginRight: 8,
                      }}
                    />
                    Select Address
                  </Title>

                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setShowAddressModal(true)}
                  >
                    Add New Address
                  </Button>
                </div>

                <Divider />

                {/* ========================================= */}
                {/* NO ADDRESSES */}
                {/* ========================================= */}

                {addresses.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px 10px",
                    }}
                  >
                    <Empty description="No delivery address found" />

                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setShowAddressModal(true)}
                    >
                      Add Delivery Address
                    </Button>
                  </div>
                ) : (
                  /* ========================================= */
                  /* ADDRESS LIST */
                  /* ========================================= */

                  <Radio.Group
                    value={selectedAddressId}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                    style={{
                      width: "100%",
                    }}
                  >
                    {addresses.map((address) => {
                      const isSelected = selectedAddressId === address.id;

                      return (
                        <div
                          key={address.id}
                          onClick={() => setSelectedAddressId(address.id)}
                          style={{
                            border: isSelected
                              ? "2px solid #1677ff"
                              : "1px solid #d9d9d9",

                            borderRadius: 12,

                            padding: 18,

                            marginBottom: 15,

                            cursor: "pointer",

                            background: isSelected ? "#f0f7ff" : "#ffffff",

                            transition: "all 0.2s",
                          }}
                        >
                          <Row align="top" gutter={10}>
                            <Col>
                              <Radio value={address.id} />
                            </Col>

                            <Col flex="1">
                              {/* NAME */}

                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  flexWrap: "wrap",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    fontSize: 16,
                                  }}
                                >
                                  {address.full_name}
                                </Text>

                                {address.is_default && (
                                  <Tag color="green">Default</Tag>
                                )}
                              </div>

                              {/* MOBILE */}

                              <div
                                style={{
                                  marginTop: 5,
                                }}
                              >
                                <Text type="secondary">
                                  {address.mobile_number}
                                </Text>
                              </div>

                              {/* ADDRESS */}

                              <div
                                style={{
                                  marginTop: 8,
                                  lineHeight: 1.8,
                                }}
                              >
                                <Text>{address.address_line1}</Text>

                                {address.address_line2 && (
                                  <>
                                    <br />

                                    <Text>{address.address_line2}</Text>
                                  </>
                                )}

                                <br />

                                <Text>
                                  {address.city}, {address.state} -{" "}
                                  {address.pincode}
                                </Text>

                                {address.landmark && (
                                  <>
                                    <br />

                                    <Text type="secondary">
                                      Landmark: {address.landmark}
                                    </Text>
                                  </>
                                )}
                              </div>

                              {/* SELECTED */}

                              {isSelected && (
                                <div
                                  style={{
                                    marginTop: 10,
                                  }}
                                >
                                  <Text
                                    type="success"
                                    style={{
                                      fontSize: 13,
                                    }}
                                  >
                                    <CheckCircleOutlined
                                      style={{
                                        marginRight: 5,
                                      }}
                                    />
                                    Selected for delivery
                                  </Text>
                                </div>
                              )}
                            </Col>
                          </Row>
                        </div>
                      );
                    })}
                  </Radio.Group>
                )}
              </Card>
            </Col>

            {/* ========================================= */}
            {/* RIGHT SIDE - DELIVERY DETAILS */}
            {/* ========================================= */}

            <Col xs={24} lg={8}>
              <Card
                title="Delivery Details"
                style={{
                  borderRadius: 14,
                  position: "sticky",
                  top: 90,
                }}
              >
                {selectedAddress ? (
                  <>
                    <div
                      style={{
                        background: "#f6f8fa",
                        borderRadius: 10,
                        padding: 15,
                        marginBottom: 20,
                      }}
                    >
                      <Text
                        strong
                        style={{
                          display: "block",
                          marginBottom: 8,
                        }}
                      >
                        Delivering to
                      </Text>

                      <Text strong>{selectedAddress.full_name}</Text>

                      <br />

                      <Text type="secondary">
                        {selectedAddress.mobile_number}
                      </Text>

                      <br />

                      <Text type="secondary">
                        {selectedAddress.address_line1}
                      </Text>

                      {selectedAddress.address_line2 && (
                        <>
                          <br />

                          <Text type="secondary">
                            {selectedAddress.address_line2}
                          </Text>
                        </>
                      )}

                      <br />

                      <Text type="secondary">
                        {selectedAddress.city}, {selectedAddress.state} -{" "}
                        {selectedAddress.pincode}
                      </Text>

                      {selectedAddress.landmark && (
                        <>
                          <br />

                          <Text type="secondary">
                            Landmark: {selectedAddress.landmark}
                          </Text>
                        </>
                      )}
                    </div>

                    <Button
                      type="primary"
                      size="large"
                      block
                      onClick={continueToCheckout}
                    >
                      Continue to Checkout
                    </Button>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        textAlign: "center",
                        padding: "20px 5px",
                      }}
                    >
                      <EnvironmentOutlined
                        style={{
                          fontSize: 35,
                          color: "#999",
                          marginBottom: 10,
                        }}
                      />

                      <div>
                        <Text type="secondary">
                          Please select a delivery address
                        </Text>
                      </div>
                    </div>

                    <Button type="primary" size="large" block disabled>
                      Continue to Checkout
                    </Button>
                  </>
                )}
              </Card>
            </Col>
          </Row>

          {/* BACK */}

          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            style={{
              marginTop: 25,
              paddingLeft: 0,
            }}
            onClick={() => {
              window.location.href = import.meta.env.VITE_CART_FRONTEND_URL;
            }}
          >
            Back to Cart
          </Button>
        </div>
      </div>

      {/* ===================================== */}
      {/* ADD ADDRESS MODAL */}
      {/* ===================================== */}

      <Modal
        title={
          <>
            <EnvironmentOutlined
              style={{
                marginRight: 8,
              }}
            />
            Add Delivery Address
          </>
        }
        open={showAddressModal}
        onCancel={() => {
          if (!savingAddress) {
            setShowAddressModal(false);
            form.resetFields();
          }
        }}
        footer={null}
        destroyOnClose
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleAddAddress}>
          {/* FULL NAME */}

          <Form.Item
            label="Full Name"
            name="full_name"
            rules={[
              {
                required: true,
                message: "Please enter full name",
              },
            ]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          {/* MOBILE */}

          <Form.Item
            label="Mobile Number"
            name="mobile_number"
            rules={[
              {
                required: true,
                message: "Please enter mobile number",
              },
              {
                pattern: /^[0-9]{10}$/,
                message: "Enter a valid 10 digit mobile number",
              },
            ]}
          >
            <Input placeholder="Enter mobile number" maxLength={10} />
          </Form.Item>

          {/* ADDRESS LINE 1 */}

          <Form.Item
            label="Address"
            name="address_line1"
            rules={[
              {
                required: true,
                message: "Please enter address",
              },
            ]}
          >
            <Input placeholder="House / Flat / Building" />
          </Form.Item>

          {/* ADDRESS LINE 2 */}

          <Form.Item label="Address Line 2" name="address_line2">
            <Input placeholder="Street / Area" />
          </Form.Item>

          {/* CITY + STATE */}

          <Row gutter={15}>
            <Col xs={24} md={12}>
              <Form.Item
                label="City"
                name="city"
                rules={[
                  {
                    required: true,
                    message: "Please enter city",
                  },
                ]}
              >
                <Input placeholder="Enter city" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="State"
                name="state"
                rules={[
                  {
                    required: true,
                    message: "Please enter state",
                  },
                ]}
              >
                <Input placeholder="Enter state" />
              </Form.Item>
            </Col>
          </Row>

          {/* PINCODE */}

          <Form.Item
            label="Pincode"
            name="pincode"
            rules={[
              {
                required: true,
                message: "Please enter pincode",
              },
              {
                pattern: /^[0-9]{6}$/,
                message: "Enter a valid 6 digit pincode",
              },
            ]}
          >
            <Input placeholder="Enter pincode" maxLength={6} />
          </Form.Item>

          {/* LANDMARK */}

          <Form.Item label="Landmark" name="landmark">
            <Input placeholder="Optional" />
          </Form.Item>

          {/* DEFAULT ADDRESS */}

          <Form.Item
            name="is_default"
            valuePropName="checked"
            initialValue={false}
          >
            <Checkbox>Make this my default address</Checkbox>
          </Form.Item>

          {/* ACTIONS */}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 20,
            }}
          >
            <Button
              onClick={() => {
                setShowAddressModal(false);
                form.resetFields();
              }}
              disabled={savingAddress}
            >
              Cancel
            </Button>

            <Button type="primary" htmlType="submit" loading={savingAddress}>
              Save Address
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default DeliveryAddress;
