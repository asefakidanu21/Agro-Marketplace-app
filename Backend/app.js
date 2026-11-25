

import express from "express";
import cors from "cors"
import userRoutes from "./features/users/user.route.js";
import authRoutes from "./features/auth/auth.route.js";
import categoryRoutes from "./features/categories/category.route.js";
import productRoutes from "./features/products/product.route.js";
import cartRoutes from "./features/carts/cart.route.js";
import addressRoutes from "./features/addresses/address.routes.js";
import orderRoutes from "./features/orders/order.route.js";
import paymentRoutes from "./features/payments/payment.route.js";
import favoriteRoutes from "./features/favorites/favorite.routes.js";
import notificationRoutes from "./features/notifications/notification.route.js";
import homeRoutes from "./features/home/home.routes.js";
import searchRoutes from "./features/search/search.routes.js";






const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({message: "Hello from agricaltural store"});
})

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/search", searchRoutes);


export default app;


