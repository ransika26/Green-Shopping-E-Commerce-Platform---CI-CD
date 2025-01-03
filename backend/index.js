import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import gmailController from "./models/gmailController.js";
import AdmincontactRouter from "./routes/Admin_contact_routes.js";
import PrivateRoute from "./routes/Admin_Login_Private.js";
import AskQuestionReply from "./routes/Ask_questions_reply_route.js";
import AskQuestionsRouter from "./routes/Ask_questions_routes.js";
import { initializeCustomerRoutes } from "./routes/Customer_account_routes.js";
import CustomerAuthenticationRouter from "./routes/Customer_authentication_routes.js";
import Orderscustomer from "./routes/Customer_order_routes.js";
import router from "./routes/Customer_reply_delete_routes.js";
import Display from "./routes/Home_product_display_routes.js";
import DisplayHot from "./routes/Hot_product_display_routes.js";
import DisplayMen from "./routes/Men_product_display_routes.js";
import DisplayOffer from "./routes/Offer_product_display_routes.js";
import OrderRouter from "./routes/Order_routes.js";
import PendingCartRouter from "./routes/Pending_cart_routes.js";
import ECommerceRouter from "./routes/Product_add_routes.js";
import Productdetails from "./routes/Product_details_routes.js";
import Update from "./routes/Product_edit_routes.js";
import Search from "./routes/Search_routes.js";
import Sellerdetails from "./routes/Seller_account_routes.js";
import ProductDisplayRouter from "./routes/Seller_all_products_routes.js";
import SellerAuthenticationRouter from "./routes/Seller_authentication_routes.js";
import Delivered from "./routes/Seller_delivered_order_routes.js";
import Ordernew from "./routes/Seller_new_order_routes.js";
import Delete from "./routes/Seller_product_de_ed_routes.js";
import Questions from "./routes/Show_questions_routes.js";
import Reply from "./routes/Show_reply_routes.js";
import WishlistDisplay from "./routes/Wish_list_display_routes.js";
import WishlistRouter from "./routes/Wish_list_routes.js";
import DisplayWomen from "./routes/Women_product_display_routes.js";

const app = express();
const port = 3000;

// Create HTTP server for WebSocket
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for development
    },
});

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Connection to MongoDB
connectDB();

// API Endpoints
app.use("/api/ecommerceproduct", ECommerceRouter);
app.use("/api/ecommerceproductedit", Update);
app.use("/api/sellerauthentication", SellerAuthenticationRouter);
app.use("/api/customerauthentication", CustomerAuthenticationRouter);
app.use("/api/admincontact", AdmincontactRouter);
app.use("/api/wishlist", WishlistRouter);
app.use("/api/productssellerdisplay", ProductDisplayRouter);
app.use("/api/ordernewsellerdisplay", Ordernew);
app.use("/api/orderdeliveredsellerdisplay", Delivered);
app.use("/api/productsdelete", Delete);
app.use("/api/productsdisplay", Display);
app.use("/api/productsdisplaymen", DisplayMen);
app.use("/api/productsdisplaywomen", DisplayWomen);
app.use("/api/productsdisplayhot", DisplayHot);
app.use("/api/productsdisplayoffers", DisplayOffer);
app.use("/api/pendingcart", PendingCartRouter);
app.use("/api/productsdetailsdisplay", Productdetails);
app.use("/api/productsaskquestions", AskQuestionsRouter);
app.use("/api/productsshowquestions", Questions);
app.use("/api/productsreplyquestions", AskQuestionReply);
app.use("/api/wishlistdisplay", WishlistDisplay);
app.use("/api/productssearch", Search);
app.use("/api/sellers", SellerAuthenticationRouter);
app.use("/api/orders", OrderRouter);
app.use("/api/selleraccount", Sellerdetails);

// Customer account details
app.use("/api/customeraccount", initializeCustomerRoutes(io));

// Customer reply questions
app.use("/api/customerreply", Reply);
app.use("/api/customerorder", Orderscustomer);
app.use("/api/customerdeletereply", router);

app.use("/api/orders", OrderRouter);
app.use("/api/admin", PrivateRoute);
app.use("/api/email", PrivateRoute);
app.use("/api/email", gmailController);

app.get("/", (req, res) => {
    res.send("Good to go");
});

// WebSocket connection logic
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("new-reply", (reply) => {
        io.emit("update-replies", reply);
    });

    socket.on("new-question", (question) => {
        io.emit("update-questions", question);
    });

    socket.on("new-message", (message) => {
        io.emit("broadcast-message", message);
    });

    socket.on("order-update", (order) => {
        io.emit("order-status-updated", order);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});

export { io };

