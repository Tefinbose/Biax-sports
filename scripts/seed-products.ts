
import { config } from "dotenv";
import mongoose from "mongoose";
import Product, { type IProduct } from "../src/models/Product";

// Load environment variables from the project root.
config({ path: ".env.local" });

type SeedProduct = Omit<IProduct, "createdAt" | "updatedAt">;

const seedProducts: SeedProduct[] = [
  {
    name: "BIAX Performance Training T-Shirt",
    slug: "biax-performance-training-tshirt",
    description:
      "A performance-focused training T-shirt designed for comfort, movement, and everyday workouts. Sample product: update the specifications to match your actual product before selling.",
    shortDescription:
      "Lightweight training T-shirt for everyday athletic performance.",
    category: "sportswear",
    price: 799,
    compareAtPrice: 999,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=80",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Red"],
    stock: 50,
    sku: "BIAX-SW-001",
    featured: true,
    published: true,
  },
  {
    name: "BIAX Athletic Training Wear",
    slug: "biax-athletic-training-wear",
    description:
      "Athletic training wear intended for gym sessions and active lifestyles. Sample product: confirm the material, fit, and specifications before selling.",
    shortDescription:
      "Comfortable athletic wear for training and active days.",
    category: "sportswear",
    price: 1199,
    compareAtPrice: 1499,
    images: [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Grey"],
    stock: 35,
    sku: "BIAX-SW-002",
    featured: true,
    published: true,
  },
  {
    name: "BIAX Martial Arts Training Uniform",
    slug: "biax-martial-arts-training-uniform",
    description:
      "A sample martial arts training uniform listing. Replace this description with the correct fabric, weight, sizing, and care details for your actual uniform.",
    shortDescription:
      "Training uniform for martial arts practice.",
    category: "martial-arts-uniforms",
    price: 1499,
    compareAtPrice: 1799,
    images: [
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1000&q=80",
    ],
    sizes: ["120", "130", "140", "150", "160", "170", "180"],
    colors: ["White"],
    stock: 25,
    sku: "BIAX-MA-001",
    featured: true,
    published: true,
  },
  {
    name: "BIAX Combat Sports Gloves",
    slug: "biax-combat-sports-gloves",
    description:
      "A sample combat sports glove listing. Verify the glove type, size, materials, and intended use before making this product available for purchase.",
    shortDescription:
      "Combat sports gloves for training sessions.",
    category: "martial-arts-uniforms",
    price: 1299,
    compareAtPrice: 1599,
    images: [
      "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1000&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Red"],
    stock: 20,
    sku: "BIAX-MA-002",
    featured: false,
    published: true,
  },
  {
    name: "BIAX Training Football",
    slug: "biax-training-football",
    description:
      "A sample football listing for training and practice. Update the construction, size, and surface suitability details to match your actual product.",
    shortDescription:
      "Football for training and practice.",
    category: "sports-equipment",
    price: 899,
    compareAtPrice: 1099,
    images: [
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80",
    ],
    sizes: ["Size 5"],
    colors: ["White", "Black"],
    stock: 40,
    sku: "BIAX-SE-001",
    featured: true,
    published: true,
  },
  {
    name: "BIAX Sports Training Shoes",
    slug: "biax-sports-training-shoes",
    description:
      "A sample sports shoe listing for athletic training. Confirm the shoe design, sizing, materials, and performance features before selling.",
    shortDescription:
      "Sports shoes for training and everyday athletic activities.",
    category: "sports-equipment",
    price: 2499,
    compareAtPrice: 2999,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
    ],
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["Red", "Black"],
    stock: 15,
    sku: "BIAX-SE-002",
    featured: false,
    published: true,
  },
];

async function seedDatabase(): Promise<void> {
  try {
    // Validate the MongoDB connection string before importing the DB helper.
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is missing. Check .env.local in your project root.",
      );
    }

    // Import dynamically so .env.local is loaded before mongodb.ts reads it.
    const { connectToDatabase } = await import("../src/lib/mongodb");

    await connectToDatabase();
    console.log("Connected to MongoDB.");

    for (const product of seedProducts) {
      await Product.updateOne(
        { sku: product.sku },
        { $set: product },
        { upsert: true, runValidators: true },
      );

      console.log(`Seeded: ${product.name}`);
    }

    console.log(
      `\nSeed completed. ${seedProducts.length} sample products processed.`,
    );
  } catch (error) {
    console.error("\nSeeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {
      // Ignore disconnect errors if the database connection never opened.
    });
  }
}

void seedDatabase();
