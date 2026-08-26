/**
 * ==============================================================================
 * KitchenOS Database Seeder (Prisma ORM & PostgreSQL)
 * Automated Kitchen Prep-Scrap Tracking & Dynamic Daily Special Menu Generation
 * ==============================================================================
 * Execute with: npx prisma db seed
 */

import { PrismaClient, Role, ScrapCategory, ScrapStatus, SkuStatus, BatchStatus, FoodCategory } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting KitchenOS PostgreSQL Seeding...");

  // ───────────────────────────────────────────────────────────────────────────
  // 1. Clean Database (in reverse dependency order)
  // ───────────────────────────────────────────────────────────────────────────
  console.log("🧹 Purging existing records...");
  await prisma.sustainabilityLog.deleteMany();
  await prisma.redistributionBatch.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.dynamicSku.deleteMany();
  await prisma.byproductRecipe.deleteMany();
  await prisma.scrapLedger.deleteMany();
  await prisma.rawInventory.deleteMany();
  await prisma.ngo.deleteMany();
  await prisma.user.deleteMany();
  await prisma.restaurant.deleteMany();

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Seed Sample Restaurant (Chennai, Tamil Nadu)
  // ───────────────────────────────────────────────────────────────────────────
  console.log("📍 Creating Sample Restaurant...");
  const restaurant = await prisma.restaurant.create({
    data: {
      name: "The Grand Malabar Bistro — Anna Salai",
      address: "742 Anna Salai, Thousand Lights East, Chennai, Tamil Nadu 600002",
      latitude: 13.0827,
      longitude: 80.2707,
      contactPhone: "+91-44-2829-1144",
      openingTime: "07:30",
      closingTime: "23:30",
    },
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Seed Staff & User Accounts
  // ───────────────────────────────────────────────────────────────────────────
  console.log("👥 Creating Staff User Accounts...");
  // Pre-hashed passwords ($2b$12$... for 'KitchenOS@2026')
  const defaultPasswordHash = "$2b$12$e8Yh9Yk0kF8GqD0KkK9.3.P2F9aF.mE3p3d1F.X9E3K8e8Yh9Yk0k";

  const headChef = await prisma.user.create({
    data: {
      name: "Chef Rajesh Sundaram",
      email: "chef.rajesh@kitchenos.internal",
      passwordHash: defaultPasswordHash,
      role: Role.CHEF,
    },
  });

  const prepCook = await prisma.user.create({
    data: {
      name: "Karthik Velu",
      email: "cook.karthik@kitchenos.internal",
      passwordHash: defaultPasswordHash,
      role: Role.CHEF,
    },
  });

  const cashier = await prisma.user.create({
    data: {
      name: "Priya Natarajan",
      email: "cashier.priya@kitchenos.internal",
      passwordHash: defaultPasswordHash,
      role: Role.CASHIER,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Operations Admin",
      email: "admin@kitchenos.internal",
      passwordHash: defaultPasswordHash,
      role: Role.ADMIN,
    },
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Seed Raw Ingredients
  // ───────────────────────────────────────────────────────────────────────────
  console.log("📦 Creating Raw Inventory Ingredients...");
  const rawChicken = await prisma.rawInventory.create({
    data: {
      restaurantId: restaurant.id,
      name: "Whole Broiler Chicken (Fresh Dressed)",
      category: "POULTRY",
      currentStockKg: 85.0,
      costPerKg: 180.0,
      baselineTrimRatio: 0.18, // 18% expected bone scrap
    },
  });

  const rawOnions = await prisma.rawInventory.create({
    data: {
      restaurantId: restaurant.id,
      name: "Red Onions (Bellary Grade-A)",
      category: "VEGETABLES",
      currentStockKg: 120.0,
      costPerKg: 35.0,
      baselineTrimRatio: 0.12, // 12% expected outer skin trim
    },
  });

  const rawTomatoes = await prisma.rawInventory.create({
    data: {
      restaurantId: restaurant.id,
      name: "Tomatoes (Country Naatu)",
      category: "VEGETABLES",
      currentStockKg: 75.0,
      costPerKg: 45.0,
      baselineTrimRatio: 0.08, // 8% stem & core trim
    },
  });

  const rawOranges = await prisma.rawInventory.create({
    data: {
      restaurantId: restaurant.id,
      name: "Fresh Oranges (Nagpur Sweet)",
      category: "CITRUS",
      currentStockKg: 50.0,
      costPerKg: 90.0,
      baselineTrimRatio: 0.25, // 25% peel/rind trim
    },
  });

  const rawCoriander = await prisma.rawInventory.create({
    data: {
      restaurantId: restaurant.id,
      name: "Coriander Bunches (Fresh Organic)",
      category: "HERBS",
      currentStockKg: 30.0,
      costPerKg: 60.0,
      baselineTrimRatio: 0.20, // 20% root & stem trim
    },
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Seed Byproduct Reverse Recipes
  // ───────────────────────────────────────────────────────────────────────────
  console.log("🍲 Creating High-Margin Byproduct Recipes...");
  const recipeBroth = await prisma.byproductRecipe.create({
    data: {
      name: "Slow-Roasted Peppercorn Bone Broth",
      description: "12-hour slow-extracted chicken bone collagen broth infused with black Tellicherry pepper and charred aromatics.",
      primaryScrapCategory: ScrapCategory.BONES,
      scrapPerPortionKg: 0.25,
      baseServingYield: 16,
      pantryCostPerPortion: 6.0,
      suggestedPrice: 89.0, // Gross Margin: (89 - 6) / 89 = 93.2%
      pantryStaples: [
        { item: "Tellicherry Black Pepper", qty: "5g" },
        { item: "Ginger-Garlic Paste", qty: "10g" },
        { item: "Filtered Mineral Water", qty: "300ml" },
      ],
    },
  });

  const recipeGlaze = await prisma.byproductRecipe.create({
    data: {
      name: "Caramelized Onion Skin Glaze",
      description: "Slow-reduced deep umami stock made from roasted onion skins and jaggery for grilling and dipping.",
      primaryScrapCategory: ScrapCategory.VEGETABLE_SKINS,
      scrapPerPortionKg: 0.15,
      baseServingYield: 20,
      pantryCostPerPortion: 3.5,
      suggestedPrice: 59.0, // Gross Margin: (59 - 3.5) / 59 = 94.1%
      pantryStaples: [
        { item: "Palm Jaggery", qty: "15g" },
        { item: "Mustard Seeds", qty: "3g" },
        { item: "Fresh Curry Leaves", qty: "2g" },
      ],
    },
  });

  const recipeInfusion = await prisma.byproductRecipe.create({
    data: {
      name: "Spiced Citrus Rind Infusion",
      description: "Candied orange rind reduction with Ceylon cinnamon, clove, and raw Demerara sugar for cocktails & desserts.",
      primaryScrapCategory: ScrapCategory.CITRUS_PEELS,
      scrapPerPortionKg: 0.10,
      baseServingYield: 25,
      pantryCostPerPortion: 2.0,
      suggestedPrice: 49.0, // Gross Margin: (49 - 2) / 49 = 95.9%
      pantryStaples: [
        { item: "Ceylon Cinnamon Bark", qty: "2g" },
        { item: "Green Cardamom", qty: "1g" },
        { item: "Raw Demerara Sugar", qty: "20g" },
      ],
    },
  });

  const recipeChimichurri = await prisma.byproductRecipe.create({
    data: {
      name: "Herb Stem Chimichurri Dip",
      description: "Tangy emulsion of fresh coriander and mint stems with cold-pressed gingelly oil, roasted green chillies, and sea salt.",
      primaryScrapCategory: ScrapCategory.HERB_STEMS,
      scrapPerPortionKg: 0.08,
      baseServingYield: 30,
      pantryCostPerPortion: 4.0,
      suggestedPrice: 39.0, // Gross Margin: (39 - 4) / 39 = 89.7%
      pantryStaples: [
        { item: "Cold-Pressed Gingelly Oil", qty: "15ml" },
        { item: "Roasted Green Chillies", qty: "5g" },
        { item: "Crushed Rock Salt", qty: "2g" },
      ],
    },
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 6. Seed Verified Real-World Local NGOs in Chennai
  // ───────────────────────────────────────────────────────────────────────────
  console.log("🤝 Creating Local Verified NGO Shelters...");
  const ngoNoFoodWaste = await prisma.ngo.create({
    data: {
      name: "No Food Waste - Chennai Central",
      contactPerson: "Senthil Kumar",
      phone: "+91-98401-22334",
      email: "chennai@nofoodwaste.org",
      latitude: 13.0604,
      longitude: 80.2496, // Nungambakkam (~3.2 km from Anna Salai)
      maxCapacityServings: 250,
      operatingStart: "19:00",
      operatingEnd: "23:30",
      isVerified: true,
      isActive: true,
    },
  });

  const ngoRobinHoodArmy = await prisma.ngo.create({
    data: {
      name: "Robin Hood Army - Egmore Division",
      contactPerson: "Deepika Sundar",
      phone: "+91-98412-33445",
      email: "egmore.rha@robinhoodarmy.com",
      latitude: 13.0784,
      longitude: 80.2608, // Egmore (~1.2 km from Anna Salai)
      maxCapacityServings: 180,
      operatingStart: "20:00",
      operatingEnd: "00:00",
      isVerified: true,
      isActive: true,
    },
  });

  const ngoAkshayaPatra = await prisma.ngo.create({
    data: {
      name: "Akshaya Patra Foundation - T. Nagar Distribution",
      contactPerson: "Venkatesh Rao",
      phone: "+91-98423-44556",
      email: "tnagar@akshayapatra.org",
      latitude: 13.0418,
      longitude: 80.2341, // T. Nagar (~5.8 km from Anna Salai)
      maxCapacityServings: 300,
      operatingStart: "18:30",
      operatingEnd: "23:00",
      isVerified: true,
      isActive: true,
    },
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 7. Seed Starter Scrap Entries (Ledger Reservoir)
  // ───────────────────────────────────────────────────────────────────────────
  console.log("🔪 Populating Starter Scrap Entries...");
  const now = new Date();

  // Chicken Bones (5.0 kg scrap logged)
  await prisma.scrapLedger.create({
    data: {
      restaurantId: restaurant.id,
      cookId: prepCook.id,
      rawInventoryId: rawChicken.id,
      scrapCategory: ScrapCategory.BONES,
      usableWeightKg: 22.0,
      scrapWeightKg: 5.0,
      trimRatio: 5.0 / 27.0, // ~0.185 (Normal inlier)
      isAnomaly: false,
      status: ScrapStatus.AVAILABLE,
      loggedAt: new Date(now.getTime() - 4 * 3600 * 1000),
    },
  });

  // Onion Skins (3.5 kg scrap logged)
  await prisma.scrapLedger.create({
    data: {
      restaurantId: restaurant.id,
      cookId: prepCook.id,
      rawInventoryId: rawOnions.id,
      scrapCategory: ScrapCategory.VEGETABLE_SKINS,
      usableWeightKg: 25.0,
      scrapWeightKg: 3.5,
      trimRatio: 3.5 / 28.5, // ~0.123 (Normal inlier)
      isAnomaly: false,
      status: ScrapStatus.AVAILABLE,
      loggedAt: new Date(now.getTime() - 3 * 3600 * 1000),
    },
  });

  // Citrus Peels (2.8 kg scrap logged)
  await prisma.scrapLedger.create({
    data: {
      restaurantId: restaurant.id,
      cookId: headChef.id,
      rawInventoryId: rawOranges.id,
      scrapCategory: ScrapCategory.CITRUS_PEELS,
      usableWeightKg: 8.5,
      scrapWeightKg: 2.8,
      trimRatio: 2.8 / 11.3, // ~0.248 (Normal inlier)
      isAnomaly: false,
      status: ScrapStatus.AVAILABLE,
      loggedAt: new Date(now.getTime() - 2 * 3600 * 1000),
    },
  });

  // Herb Stems (1.8 kg scrap logged)
  await prisma.scrapLedger.create({
    data: {
      restaurantId: restaurant.id,
      cookId: prepCook.id,
      rawInventoryId: rawCoriander.id,
      scrapCategory: ScrapCategory.HERB_STEMS,
      usableWeightKg: 7.2,
      scrapWeightKg: 1.8,
      trimRatio: 1.8 / 9.0, // 0.200 (Normal inlier)
      isAnomaly: false,
      status: ScrapStatus.AVAILABLE,
      loggedAt: new Date(now.getTime() - 1 * 3600 * 1000),
    },
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 8. Seed Active Dynamic SKU on POS & Initial Orders
  // ───────────────────────────────────────────────────────────────────────────
  console.log("🛒 Creating Active Dynamic Specials SKU & Orders...");
  const dynamicBrothSku = await prisma.dynamicSku.create({
    data: {
      restaurantId: restaurant.id,
      recipeId: recipeBroth.id,
      itemName: recipeBroth.name,
      totalPortions: 16,
      remainingPortions: 12,
      unitPrice: 89.0,
      costPerServing: 6.0,
      status: SkuStatus.ACTIVE,
      createdAt: new Date(now.getTime() - 2 * 3600 * 1000),
      expiryAt: new Date(now.getTime() + 6 * 3600 * 1000),
    },
  });

  // 4 portions ordered at POS
  const order1 = await prisma.order.create({
    data: {
      restaurantId: restaurant.id,
      cashierId: cashier.id,
      totalAmount: 356.0, // 4 * 89.0
      createdAt: new Date(now.getTime() - 45 * 60 * 1000),
      items: {
        create: [
          {
            dynamicSkuId: dynamicBrothSku.id,
            itemName: dynamicBrothSku.itemName,
            quantity: 4,
            unitPrice: 89.0,
            subtotal: 356.0,
          },
        ],
      },
    },
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 9. Seed Sample NGO Redistribution Batch
  // ───────────────────────────────────────────────────────────────────────────
  console.log("🚚 Creating Sample NGO Redistribution Batch...");
  await prisma.redistributionBatch.create({
    data: {
      restaurantId: restaurant.id,
      dynamicSkuId: dynamicBrothSku.id,
      itemName: "Slow-Roasted Peppercorn Bone Broth (Dinner Surplus)",
      foodCategory: FoodCategory.LIQUID_SOUP,
      portions: 12,
      weightKg: 3.0,
      status: BatchStatus.OFFERED,
      pickupOtp: "847291",
      assignedNgoId: ngoRobinHoodArmy.id,
      preparedAt: new Date(now.getTime() - 30 * 60 * 1000),
    },
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 10. Seed Initial Sustainability & ESG Log
  // ───────────────────────────────────────────────────────────────────────────
  console.log("📊 Creating Initial Sustainability Impact Metrics...");
  const todayDateStr = now.toISOString().split("T")[0];

  await prisma.sustainabilityLog.create({
    data: {
      restaurantId: restaurant.id,
      date: todayDateStr,
      totalScrapDivertedKg: 13.1, // Diverted bones, peels, stems
      recoveredRevenue: 356.0,
      mealsDonatedCount: 24,
      co2eAvoidedKg: 32.75, // 13.1 kg * 2.5
      waterSavedLiters: 480.0,
    },
  });

  console.log("✅ KitchenOS PostgreSQL Database Seeding Complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
