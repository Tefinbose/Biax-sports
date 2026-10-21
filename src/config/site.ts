
export const siteConfig = {
  name: "BIAX SPORTS",
  legalName: "BIAX SPORTS INDIA PRIVATE LIMITED",
  tagline: "Empowering Athletes. Elevating Performance.",
  slogan: "Built for Impact.",
  description:
    "Discover performance-focused sportswear, martial arts uniforms, and sports equipment from BIAX SPORTS.",

  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  email: "info@biaxsports.com",

  address: {
    line1: "16/593 D, 2nd Floor",
    line2: "Memunda",
    city: "Kozhikode",
    state: "Kerala",
    country: "India",
    postalCode: "673104",
  },

  navigation: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Sportswear", href: "/categories/sportswear" },
    {
      label: "Martial Arts",
      href: "/categories/martial-arts-uniforms",
    },
    { label: "Sports Equipment", href: "/categories/sports-equipment" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  categories: [
  {
    name: "Sportswear",
    slug: "sportswear",
    description: "Performance apparel for training and active lifestyles.",
  },
  {
    name: "Martial Arts Uniforms",
    slug: "martial-arts-uniforms",
    description: "Training and competition uniforms.",
  },
  {
    name: "Sports Equipment",
    slug: "sports-equipment",
    description: "Essential equipment for athletes.",
  },
],

  socialLinks: {
    instagram: "",
    facebook: "",
    youtube: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
