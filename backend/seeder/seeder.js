import connectDB from "../config/db.js";

import categoryData from "./categories.js";
import productData from "./products.js";
import reviewData from "./reviews.js";
import userData from "./users.js";
import orderData from "./orders.js";

import Category from "../models/CategoryModel.js";
import Product from "../models/ProductModel.js";
import Review from "../models/ReviewModel.js";
import User from "../models/UserModel.js";
import Order from "../models/OrderModel.js";

connectDB();

const importData = async () => {
  try {
    /* Comentar los dropIndexes y deleteMany 
     si se va a popular por primera vez
    */
    await Category.collection.dropIndexes();
    await Product.collection.dropIndexes();

    await Category.collection.deleteMany({});
    await Product.collection.deleteMany({});
    await Review.collection.deleteMany({});
    await User.collection.deleteMany({});
    await Order.collection.deleteMany({});

    if (process.argv[2] !== "-d") {
      await Category.insertMany(categoryData);
      const reviews = await Review.insertMany(reviewData);
      const sampleProducts = productData.map((product) => {
        reviews.map((review) => {
          product.reviews.push(review._id);
        });
        return { ...product };
      });
      await Product.insertMany(sampleProducts);
      await User.insertMany(userData);
      await Order.insertMany(orderData);

      console.log("Seeder data imported successfully");
      process.exit();
      return;
    }
    console.log("Seeder data deleted successfully");
    process.exit();
  } catch (error) {
    console.error("Error while proccessing seeder data", error);
    process.exit(1);
  }
};
importData();
