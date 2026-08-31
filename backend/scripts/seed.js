import mongoose from "mongoose";
import "dotenv/config";
import connectDB from "../db/mongodb.js";
import User from "../models/UserModel.js";
import Shop from "../models/ShopModel.js";
import Product from "../models/ProductModel.js";
import Events from "../models/eventModel.js";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop";

export async function seedDatabase() {
  const existingProducts = await Product.countDocuments();
  if (existingProducts > 0) {
    console.log("Database already has data — skipping seed.");
    return;
  }

  console.log("Seeding database with sample data...");

  await User.create({
    fullName: "Admin User",
    email: "admin@shopo.com",
    password: "admin123",
    role: "Admin",
    avatar: {
      public_id: "seed-admin",
      url: PLACEHOLDER_IMAGE,
    },
  });

  await User.create({
    fullName: "Demo Customer",
    email: "customer@shopo.com",
    password: "customer123",
    avatar: {
      public_id: "seed-customer",
      url: PLACEHOLDER_IMAGE,
    },
  });

  const shop = await Shop.create({
    name: "Tech Haven",
    email: "seller@shopo.com",
    password: "seller123",
    phoneNumber: "1234567890",
    address: "123 Market Street",
    zipCode: 10001,
    avatar: {
      public_id: "seed-shop",
      url: PLACEHOLDER_IMAGE,
    },
  });

  const shopInfo = {
    _id: shop._id,
    name: shop.name,
    email: shop.email,
    avatar: shop.avatar,
  };

  const products = [
    {
      name: "Wireless Headphones",
      description: "Premium noise-cancelling wireless headphones with 30h battery.",
      category: "Electronics",
      tags: "audio headphones wireless",
      originalPrice: 149,
      discountPrice: 99,
      stock: 50,
      images: [{ public_id: "seed-p1", url: PLACEHOLDER_IMAGE }],
      shopId: shop._id.toString(),
      shop: shopInfo,
      sold_out: 12,
      ratings: 4.5,
    },
    {
      name: "Smart Watch",
      description: "Fitness tracking smartwatch with heart-rate monitor.",
      category: "Electronics",
      tags: "watch fitness smart",
      originalPrice: 199,
      discountPrice: 149,
      stock: 30,
      images: [{ public_id: "seed-p2", url: PLACEHOLDER_IMAGE }],
      shopId: shop._id.toString(),
      shop: shopInfo,
      sold_out: 8,
      ratings: 4.2,
    },
    {
      name: "Running Shoes",
      description: "Lightweight running shoes for everyday training.",
      category: "Fashion",
      tags: "shoes running sport",
      originalPrice: 89,
      discountPrice: 69,
      stock: 100,
      images: [{ public_id: "seed-p3", url: PLACEHOLDER_IMAGE }],
      shopId: shop._id.toString(),
      shop: shopInfo,
      sold_out: 25,
      ratings: 4.7,
    },
    {
      name: "Leather Backpack",
      description: "Durable leather backpack with laptop compartment.",
      category: "Fashion",
      tags: "bag backpack leather",
      originalPrice: 120,
      discountPrice: 89,
      stock: 40,
      images: [{ public_id: "seed-p4", url: PLACEHOLDER_IMAGE }],
      shopId: shop._id.toString(),
      shop: shopInfo,
      sold_out: 5,
      ratings: 4.0,
    },
  ];

  await Product.insertMany(products);

  const finishDate = new Date();
  finishDate.setDate(finishDate.getDate() + 7);

  await Events.create({
    name: "Summer Flash Sale",
    description: "Up to 40% off on selected electronics!",
    category: "Electronics",
    start_Date: new Date(),
    finish_Date: finishDate,
    status: "Running",
    tags: "sale summer flash",
    originalPrice: 149,
    discountPrice: 89,
    stock: 20,
    images: [{ public_id: "seed-e1", url: PLACEHOLDER_IMAGE }],
    shopId: shop._id.toString(),
    shop: shopInfo,
    sold_out: 3,
  });

  console.log("Seed complete. Demo accounts:");
  console.log("  Admin:    admin@shopo.com / admin123");
  console.log("  Customer: customer@shopo.com / customer123");
  console.log("  Seller:   seller@shopo.com / seller123");
  console.log(`  Created ${products.length} products and 1 event.`);
}

async function runStandalone() {
  await connectDB();
  await seedDatabase();
  await mongoose.disconnect();
  if (global.__MONGOD) await global.__MONGOD.stop();
}

const isDirectRun = process.argv[1]?.includes("seed.js");
if (isDirectRun) {
  runStandalone().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
