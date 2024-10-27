import mongoose, { model, models, Schema } from "mongoose";
const AdminSchema = new Schema(
  {
    name: { required: false, type: String, unique: false },
    email: { required: true, type: String, unique: true },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const userSchema = new Schema(
  {
    mobile: { required: true, type: String, unique: true },
    uid: { required: true, type: String },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const productSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  discountedPrice: { type: Number, required: true, min: 0 },
  images: [{ type: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  collections: { type: String, default: "All" },
  properties: { type: Object },
  stock: { type: Number, required: true, min: 0 },
  ribbon: { type: String },
});
const CategorySchema = new Schema({
  name: { type: String, required: true },
  image: { type: String },
});

const OrderSchema = new Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      country: {
        type: String,
        required: true,
      },
      pinCode: {
        type: Number,
        required: true,
      },
      phoneNo: {
        type: Number,
        required: true,
      },
    },
    products: {
      type: Array,
      default: [],
    },
    user: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    order_id: {
      type: String,
      required: true,
    },
    shippingCharge: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    orderStatus: {
      type: String,
      required: true,
      default: "Processing",
    },
    deliveredAt: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
const heroSchema = new Schema({
  title: { type: String },
  image: { type: String },
  url: { type: String },
  subtitle:{type:String}
});

const reviewSchema = new Schema(
  {
    name: { required: true, type: String },
    productId: {
      type: Schema.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: { required: true, type: String },
    review: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);
export const Order = models?.Order || model("Order", OrderSchema);
export const Category = models?.Category || model("Category", CategorySchema);
export const Admin = models?.Admin || model("Admin", AdminSchema);
export const User = models?.User || model("User", userSchema);
export const Product =
  mongoose.models?.Product || mongoose.model("Product", productSchema);
export const Hero = models?.Hero || model("Hero", heroSchema);
export const Review = models?.Review || model("Review", reviewSchema);
