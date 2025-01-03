import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  CustomerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customerauthentication",
    required: true,
  },
  ProductID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ecommerceproduct",
    required: true,
  },
});

const WishlistModel = mongoose.model("Wishlist", WishlistSchema);

export default WishlistModel;
