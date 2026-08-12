// import {
//   Card,
//   Typography,
//   Button,
//   Space,
//   InputNumber,
//   Empty,  Row,
//   Col,
//   message,
// } from "antd";

// import { DeleteOutlined, ShoppingOutlined } from "@ant-design/icons";

// import { useNavigate } from "react-router-dom";

// import Header from "../components/Header";

// import { useShop } from "../context/ShopContext";

// const { Title, Text } = Typography;

// function Cart() {
//   const navigate = useNavigate();

//   const { cart, removeFromCart, increaseQuantity, decreaseQuantity } =
//     useShop();

//   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

//   if (cart.length === 0) {
//     return (
//       <>
//         <Header />

//         <div
//           style={{
//             padding: 80,
//             textAlign: "center",
//           }}
//         >
//           <Empty description="Your cart is empty" />

//           <Button type="primary" onClick={() => navigate("/")}>
//             Continue Shopping
//           </Button>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Header />

//       <div
//         style={{
//           padding: 40,
//         }}
//       >
//         <Title level={2}>Shopping Cart</Title>

//         <Row gutter={30}>
//           {/* CART ITEMS */}

//           <Col xs={24} lg={16}>
//             {cart.map((item) => (
//               <Card
//                 key={item.id}
//                 style={{
//                   marginBottom: 20,
//                 }}
//               >
//                 <Row align="middle" gutter={20}>
//                   <Col span={5}>
//                     <img
//                       src={item.image || "https://via.placeholder.com/150"}
//                       alt={item.name}
//                       style={{
//                         width: "100%",
//                         height: 100,
//                         objectFit: "cover",
//                       }}
//                     />
//                   </Col>

//                   <Col span={7}>
//                     <Title level={4}>{item.name}</Title>

//                     <Text>₹{item.price}</Text>
//                   </Col>

//                   <Col span={6}>
//                     <Space>
//                       <Button onClick={() => decreaseQuantity(item.id)}>
//                         -
//                       </Button>

//                       <Text>{item.quantity}</Text>

//                       <Button onClick={() => increaseQuantity(item.id)}>
//                         +
//                       </Button>
//                     </Space>
//                   </Col>

//                   <Col span={4}>
//                     <Button
//                       danger
//                       icon={<DeleteOutlined />}
//                       onClick={() => {
//                         removeFromCart(item.id);

//                         message.success("Item removed from cart");
//                       }}
//                     />
//                   </Col>
//                 </Row>
//               </Card>
//             ))}
//           </Col>

//           {/* SUMMARY */}

//           <Col xs={24} lg={8}>
//             <Card title="Order Summary">
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   marginBottom: 20,
//                 }}
//               >
//                 <Text>Total</Text>

//                 <Text strong>₹{total}</Text>
//               </div>

//               <Button
//                 type="primary"
//                 size="large"
//                 block
//                 icon={<ShoppingOutlined />}
//                 onClick={() => navigate("/checkout")}
//               >
//                 Proceed to Checkout
//               </Button>
//             </Card>
//           </Col>
//         </Row>
//       </div>
//     </>
//   );
// }

// export default Cart;
