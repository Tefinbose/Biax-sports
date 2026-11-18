import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

// Load environment variables from the project root.
config({ path: ".env.local" });
config({ path: ".env" });

const prisma = new PrismaClient();

const seedProducts = [
  {
    name: "BIAX Performance Training T-Shirt",
    slug: "biax-performance-training-tshirt",
    description:
      "A performance-focused training T-shirt designed for comfort, movement, and everyday workouts.",
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
      "Athletic training wear intended for gym sessions and active lifestyles.",
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
      "A premium martial arts training uniform engineered for durability, discipline, and comfort.",
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
      "Tournament-grade combat sports gloves designed for rigorous training sessions.",
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
      "High-durability football for training, drills, and match practice.",
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
      "Athletic sports shoes engineered for athletic training and everyday movement.",
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
    console.log("Connected to TiDB for seeding products.");

    for (const product of seedProducts) {
      await prisma.product.upsert({
        where: { sku: product.sku },
        update: product,
        create: product,
      });

      console.log(`Seeded in TiDB: ${product.name}`);
    }

    console.log(
      `\nSeed completed. ${seedProducts.length} sample products processed.`,
    );
  } catch (error) {
    console.error("\nSeeding failed:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}

void seedDatabase();
